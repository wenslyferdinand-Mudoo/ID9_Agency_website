"""HTTP-level authentication/session lifecycle regression tests.

All persistence is an in-memory fake. These tests never connect to MongoDB,
Render, Atlas, or production services.
"""
import os
import sys
from copy import deepcopy
from datetime import datetime, timezone, timedelta
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_auth_http_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-secret-with-more-than-32-bytes")
os.environ.setdefault("APP_ENV", "development")

import jwt
import pytest
from fastapi.testclient import TestClient
import server


class FakeCollection:
    def __init__(self, docs=None):
        self.docs = list(docs or [])

    @staticmethod
    def matches(doc, query):
        for key, expected in query.items():
            actual = doc.get(key)
            if isinstance(expected, dict) and "$gt" in expected:
                if actual is None or not actual > expected["$gt"]:
                    return False
            elif actual != expected:
                return False
        return True

    async def find_one(self, query, projection=None):
        for doc in self.docs:
            if self.matches(doc, query):
                return deepcopy(doc)
        return None

    async def insert_one(self, doc):
        self.docs.append(deepcopy(doc))
        return SimpleNamespace(inserted_id=doc.get("id"))

    async def update_one(self, query, update):
        for doc in self.docs:
            if self.matches(doc, query):
                doc.update(deepcopy(update.get("$set", {})))
                return SimpleNamespace(matched_count=1, modified_count=1)
        return SimpleNamespace(matched_count=0, modified_count=0)

    async def find_one_and_update(self, query, update, upsert=False, return_document=None):
        for doc in self.docs:
            if self.matches(doc, query):
                for key, value in update.get("$inc", {}).items():
                    doc[key] = doc.get(key, 0) + value
                doc.update(deepcopy(update.get("$set", {})))
                for key, value in update.get("$setOnInsert", {}).items():
                    doc.setdefault(key, deepcopy(value))
                return deepcopy(doc)
        if upsert:
            doc = {"_id": query.get("_id")}
            doc.update(deepcopy(update.get("$setOnInsert", {})))
            for key, value in update.get("$inc", {}).items():
                doc[key] = value
            doc.update(deepcopy(update.get("$set", {})))
            self.docs.append(doc)
            return deepcopy(doc)
        return None


@pytest.fixture
def api(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "unit-test-only-secret-with-more-than-32-bytes")
    monkeypatch.setenv("APP_ENV", "development")
    admin = {
        "id": "admin-1", "email": "admin@example.com",
        "name": "Test Admin", "role": "admin",
        "password_hash": server.hash_password("correct-test-password"),
    }
    users = FakeCollection([admin])
    database = SimpleNamespace(
        users=users, auth_sessions=FakeCollection(), rate_limits=FakeCollection(),
        portfolio=FakeCollection(), blog=FakeCollection(), contacts=FakeCollection(),
    )
    monkeypatch.setattr(server, "db", database)
    # Do not enter TestClient's lifespan context: startup intentionally pings
    # MongoDB and creates indexes, which belongs in a separate integration suite.
    client = TestClient(server.app)
    yield client, database, admin
    client.close()


def origin_headers(origin="https://id9-agency-website.vercel.app"):
    return {"Origin": origin}


def login(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "correct-test-password"},
        headers=origin_headers(),
    )
    assert response.status_code == 200, response.text
    assert response.json()["access_token"]
    assert server.AUTH_COOKIE_NAME in response.cookies
    return response.json()["access_token"], response.cookies[server.AUTH_COOKIE_NAME]


def bearer(token):
    return {"Authorization": f"Bearer {token}"}


def test_login_sets_httponly_refresh_cookie_and_access_session_works(api):
    client, database, _ = api
    access, refresh_cookie = login(client)
    assert client.cookies.get(server.AUTH_COOKIE_NAME) == refresh_cookie
    assert len(database.auth_sessions.docs) == 1
    response = client.get("/api/auth/me", headers=bearer(access))
    assert response.status_code == 200
    assert response.json()["role"] == "admin"


def test_refresh_rotates_cookie_and_reuse_revokes_entire_session(api):
    client, database, _ = api
    access, old_refresh = login(client)
    old_session_id = database.auth_sessions.docs[0]["id"]

    rotated = client.post("/api/auth/refresh", headers=origin_headers())
    assert rotated.status_code == 200, rotated.text
    next_access = rotated.json()["access_token"]
    new_refresh = rotated.cookies[server.AUTH_COOKIE_NAME]
    assert new_refresh != old_refresh
    assert database.auth_sessions.docs[0]["refresh_jti_hash"] != server._token_hash(
        jwt.decode(old_refresh, server._jwt_secret(), algorithms=[server.JWT_ALGORITHM])["jti"]
    )

    # Replay the credential that was just rotated. Reuse detection revokes the session.
    client.cookies.set(server.AUTH_COOKIE_NAME, old_refresh, path="/api/auth")
    replay = client.post("/api/auth/refresh")
    assert replay.status_code == 401
    assert database.auth_sessions.docs[0]["revoked"] is True
    assert client.get("/api/auth/me", headers=bearer(next_access)).status_code == 401
    assert client.get("/api/auth/me", headers=bearer(access)).status_code == 401


def test_logout_revokes_session_and_clears_refresh_cookie(api):
    client, database, _ = api
    access, _ = login(client)
    response = client.post("/api/auth/logout", headers=origin_headers())
    assert response.status_code == 200
    assert database.auth_sessions.docs[0]["revoked"] is True
    assert client.get("/api/auth/me", headers=bearer(access)).status_code == 401


def test_refresh_rejects_untrusted_origin_without_rotating_session(api):
    client, database, _ = api
    login(client)
    session = database.auth_sessions.docs[0]
    original_hash = session["refresh_jti_hash"]
    response = client.post(
        "/api/auth/refresh",
        headers=origin_headers("https://attacker.example"),
    )
    assert response.status_code == 403
    assert session["revoked"] is False
    assert session["refresh_jti_hash"] == original_hash


def test_logout_rejects_untrusted_origin_without_revoking_session(api):
    client, database, _ = api
    access, _ = login(client)
    session = database.auth_sessions.docs[0]
    response = client.post(
        "/api/auth/logout",
        headers=origin_headers("https://attacker.example"),
    )
    assert response.status_code == 403
    assert session["revoked"] is False
    assert client.get("/api/auth/me", headers=bearer(access)).status_code == 200


def test_cookie_auth_endpoints_reject_missing_origin(api):
    client, database, _ = api
    login(client)
    response = client.post("/api/auth/refresh")
    assert response.status_code == 403
    assert database.auth_sessions.docs[0]["revoked"] is False


def test_refresh_without_cookie_is_rejected(api):
    client, _, _ = api
    response = client.post("/api/auth/refresh")
    assert response.status_code == 401


def test_bad_password_and_non_admin_login_are_rejected(api):
    client, database, _ = api
    bad = client.post("/api/auth/login", json={
        "email": "admin@example.com", "password": "wrong-password"
    }, headers=origin_headers())
    assert bad.status_code == 401

    awaitable = database.users.docs[0]
    awaitable["role"] = "editor"
    denied = client.post("/api/auth/login", json={
        "email": "admin@example.com", "password": "correct-test-password"
    }, headers=origin_headers())
    assert denied.status_code == 403
    assert not database.auth_sessions.docs


def test_admin_routes_reject_anonymous_requests_and_accept_valid_admin(api):
    client, _, _ = api
    assert client.get("/api/contact").status_code == 401
    payload = {
        "title": "Authenticated test project", "category": "web",
        "summary": "A valid test summary", "cover_image": "https://example.test/a.jpg",
    }
    assert client.post("/api/portfolio", json=payload).status_code == 401
    blog_payload = {
        "title": "Test article", "category": "Design", "excerpt": "Test excerpt",
        "content": "Test content", "cover_image": "https://example.test/a.jpg",
    }
    assert client.post("/api/blog", json=blog_payload).status_code == 401

    access, _ = login(client)
    created = client.post("/api/portfolio", json=payload, headers=bearer(access))
    assert created.status_code == 200, created.text
    assert created.json()["title"] == payload["title"]


def test_admin_privilege_removed_during_session_is_forbidden(api):
    client, database, _ = api
    access, _ = login(client)
    database.users.docs[0]["role"] = "editor"
    assert client.get("/api/auth/me", headers=bearer(access)).status_code == 403
    assert client.get("/api/contact", headers=bearer(access)).status_code == 403


def test_malformed_and_expired_access_tokens_are_rejected(api):
    client, database, admin = api
    assert client.get("/api/auth/me", headers=bearer("not-a-jwt")).status_code == 401

    session_id = "expired-session"
    database.auth_sessions.docs.append({
        "id": session_id, "user_id": admin["id"], "revoked": False,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=1),
        "refresh_jti_hash": "unused",
    })
    expired = jwt.encode({
        "sub": admin["id"], "email": admin["email"], "sid": session_id,
        "jti": "expired-jti", "type": "access",
        "iat": datetime.now(timezone.utc) - timedelta(hours=1),
        "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
    }, server._jwt_secret(), algorithm=server.JWT_ALGORITHM)
    assert client.get("/api/auth/me", headers=bearer(expired)).status_code == 401
