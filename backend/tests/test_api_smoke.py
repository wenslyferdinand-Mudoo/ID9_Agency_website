"""Safe, local API smoke tests for the ID9 FastAPI application.

These tests use TestClient and the isolated MongoDB service provided by CI.
They intentionally do not import or execute the legacy remote integration suite.
"""
from fastapi.testclient import TestClient

from server import app


def test_api_health():
    with TestClient(app) as client:
        response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {"message": "ID9_AGENCY API", "status": "ok"}


def test_services_endpoint_returns_expected_contract():
    with TestClient(app) as client:
        response = client.get("/api/services")
    assert response.status_code == 200
    services = response.json()
    assert len(services) == 12
    assert {"slug", "title", "icon", "desc", "deliverables"} <= set(services[0])


def test_public_blog_endpoint_only_returns_published_posts():
    with TestClient(app) as client:
        response = client.get("/api/blog")
    assert response.status_code == 200
    assert all(post.get("published") is True for post in response.json())


def test_admin_endpoint_requires_authentication():
    with TestClient(app) as client:
        response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_invalid_login_is_rejected():
    with TestClient(app) as client:
        response = client.post(
            "/api/auth/login",
            json={"email": "unknown@example.invalid", "password": "not-a-valid-password"},
        )
    assert response.status_code == 401
