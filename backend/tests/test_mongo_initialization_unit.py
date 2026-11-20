"""MongoDB startup/index and atomic-counter contract tests.

These tests use async fakes to validate call order and application semantics.
They do not claim to replace replica-set/Atlas integration tests.
"""
import asyncio
import os
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_mongo_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-secret-with-more-than-32-bytes")

import pytest
from fastapi import HTTPException
from starlette.requests import Request
import server


class IndexCollection:
    def __init__(self):
        self.indexes = []

    async def create_index(self, field, **kwargs):
        self.indexes.append((field, kwargs))
        return f"{field}_index"


class AtomicCounterCollection:
    def __init__(self):
        self.records = {}
        self.lock = asyncio.Lock()

    async def find_one_and_update(self, query, update, upsert=False, return_document=None):
        async with self.lock:
            key = query["_id"]
            record = self.records.setdefault(key, {"_id": key})
            record["count"] = record.get("count", 0) + update["$inc"]["count"]
            for field, value in update.get("$setOnInsert", {}).items():
                record.setdefault(field, value)
            return dict(record)


def make_request():
    return Request({
        "type": "http", "method": "POST", "path": "/api/auth/login",
        "headers": [], "client": ("203.0.113.21", 12345),
        "server": ("testserver", 80), "scheme": "http", "query_string": b"",
    })


def test_startup_pings_and_creates_all_required_indexes(monkeypatch):
    collections = {
        name: IndexCollection()
        for name in ("users", "portfolio", "blog", "rate_limits", "auth_sessions")
    }
    database = SimpleNamespace(**collections)
    async def ping(command):
        assert command == "ping"
        return {"ok": 1}
    database.command = ping
    monkeypatch.setattr(server, "db", database)
    monkeypatch.delenv("ADMIN_EMAIL", raising=False)
    monkeypatch.delenv("ADMIN_PASSWORD", raising=False)
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("SEED_DEMO_CONTENT", "false")

    asyncio.run(server.on_startup())

    assert collections["users"].indexes == [("email", {"unique": True})]
    assert collections["portfolio"].indexes == [("slug", {"unique": True})]
    assert collections["blog"].indexes == [("slug", {"unique": True})]
    assert collections["rate_limits"].indexes == [("expires_at", {"expireAfterSeconds": 0})]
    assert collections["auth_sessions"].indexes == [
        ("id", {"unique": True}), ("expires_at", {"expireAfterSeconds": 0})
    ]


def test_startup_fails_fast_when_mongodb_ping_fails(monkeypatch):
    async def fail_ping(_):
        raise RuntimeError("MongoDB unavailable")
    database = SimpleNamespace(command=fail_ping)
    monkeypatch.setattr(server, "db", database)
    with pytest.raises(RuntimeError, match="MongoDB unavailable"):
        asyncio.run(server.on_startup())


def test_startup_does_not_suppress_index_creation_errors(monkeypatch):
    class FailingIndex:
        async def create_index(self, *_args, **_kwargs):
            raise RuntimeError("duplicate key prevents unique index")
    async def ping(_):
        return {"ok": 1}
    database = SimpleNamespace(
        command=ping, users=FailingIndex(), portfolio=IndexCollection(),
        blog=IndexCollection(), rate_limits=IndexCollection(),
        auth_sessions=IndexCollection(),
    )
    monkeypatch.setattr(server, "db", database)
    with pytest.raises(RuntimeError, match="duplicate key"):
        asyncio.run(server.on_startup())


def test_concurrent_rate_limit_updates_are_atomic_and_enforce_threshold(monkeypatch):
    counters = AtomicCounterCollection()
    monkeypatch.setattr(server, "db", SimpleNamespace(rate_limits=counters))

    async def attempt():
        try:
            await server.enforce_rate_limit(make_request(), "login", limit=10, window_seconds=300)
            return 200
        except HTTPException as error:
            return error.status_code

    async def run_all():
        return await asyncio.gather(*(attempt() for _ in range(20)))
    results = asyncio.run(run_all())
    assert results.count(200) == 10
    assert results.count(429) == 10
    assert sum(record["count"] for record in counters.records.values()) == 20
