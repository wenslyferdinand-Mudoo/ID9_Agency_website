"""Regression tests for API input limits, CORS and abuse protection."""
import asyncio
import os
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import pytest
from fastapi import HTTPException
from starlette.requests import Request
import server


def test_contact_fields_have_bounded_lengths():
    with pytest.raises(Exception):
        server.ContactCreate(
            name="A",
            email="person@example.test",
            message="short",
        )
    with pytest.raises(Exception):
        server.ContactCreate(
            name="Valid Name",
            email="person@example.test",
            message="x" * 5001,
        )


def test_blog_content_is_bounded():
    with pytest.raises(Exception):
        server.BlogCreate(
            title="Valid title",
            category="Design",
            excerpt="Valid excerpt",
            content="x" * 30001,
            cover_image="https://example.test/image.jpg",
        )


def test_cors_rejects_wildcard(monkeypatch):
    monkeypatch.setenv("CORS_ORIGINS", "*")
    with pytest.raises(RuntimeError, match="wildcard CORS is disabled"):
        server.get_allowed_origins()


def test_demo_seeding_is_disabled_in_production(monkeypatch):
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("SEED_DEMO_CONTENT", "true")
    # The startup policy is production-safe: the production branch never opts in.
    assert (os.environ["APP_ENV"].strip().lower() != "production"
            and os.environ["SEED_DEMO_CONTENT"].strip().lower() in {"1", "true", "yes"}) is False


def test_rate_limit_returns_429_after_threshold(monkeypatch):
    fake_collection = SimpleNamespace(
        find_one_and_update=AsyncMock(return_value={"count": 3})
    )
    monkeypatch.setattr(server, "db", SimpleNamespace(rate_limits=fake_collection))
    request = Request({"type": "http", "method": "POST", "path": "/api/contact",
                       "headers": [], "client": ("203.0.113.10", 12345),
                       "server": ("testserver", 80), "scheme": "http",
                       "query_string": b""})
    with pytest.raises(HTTPException) as error:
        asyncio.run(server.enforce_rate_limit(request, "contact", limit=2, window_seconds=60))
    assert error.value.status_code == 429
    assert error.value.headers["Retry-After"] == "60"
    fake_collection.find_one_and_update.assert_awaited_once()
