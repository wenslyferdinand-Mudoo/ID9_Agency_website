"""Regression tests for API input limits, CORS and abuse protection."""
import asyncio
import os
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import pytest
from pydantic import ValidationError
from fastapi import HTTPException
from starlette.requests import Request
import server


def test_contact_fields_have_bounded_lengths():
    # Keep the email valid so each assertion exercises the intended field limit.
    with pytest.raises(ValidationError):
        server.ContactCreate(
            name="A",
            email="person@example.com",
            message="This message is long enough.",
        )
    with pytest.raises(ValidationError):
        server.ContactCreate(
            name="Valid Name",
            email="person@example.com",
            message="short",
        )
    with pytest.raises(ValidationError):
        server.ContactCreate(
            name="Valid Name",
            email="person@example.com",
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
    assert server.should_seed_demo_content() is False


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


def _contact_request():
    return Request({
        "type": "http",
        "method": "POST",
        "path": "/api/contact",
        "headers": [],
        "client": ("203.0.113.10", 12345),
        "server": ("testserver", 80),
        "scheme": "http",
        "query_string": b"",
    })


def _valid_contact():
    return server.ContactCreate(
        name="Test Client",
        email="client@example.com",
        whatsapp="+50900000000",
        service="Brand identity",
        message="Please contact me about a new brand identity project.",
    )


def test_contact_persists_brief_and_marks_resend_notification_sent(monkeypatch):
    contacts = SimpleNamespace(insert_one=AsyncMock(), update_one=AsyncMock())
    monkeypatch.setattr(server, "db", SimpleNamespace(contacts=contacts))
    monkeypatch.setattr(server, "enforce_rate_limit", AsyncMock())
    send_email = Mock()
    monkeypatch.setattr(server, "send_contact_email", send_email)
    response = server.Response()

    result = asyncio.run(server.submit_contact(_valid_contact(), _contact_request(), response))

    assert response.status_code == 201
    assert result.email_status == "sent"
    contacts.insert_one.assert_awaited_once()
    contacts.update_one.assert_awaited_once()
    assert contacts.update_one.await_args.args[1]["$set"]["email_status"] == "sent"
    send_email.assert_called_once()


def test_contact_keeps_saved_brief_when_resend_notification_fails(monkeypatch):
    contacts = SimpleNamespace(insert_one=AsyncMock(), update_one=AsyncMock())
    monkeypatch.setattr(server, "db", SimpleNamespace(contacts=contacts))
    monkeypatch.setattr(server, "enforce_rate_limit", AsyncMock())
    send_email = Mock(side_effect=RuntimeError("provider unavailable"))
    monkeypatch.setattr(server, "send_contact_email", send_email)
    response = server.Response()

    result = asyncio.run(server.submit_contact(_valid_contact(), _contact_request(), response))

    assert response.status_code == 202
    assert result.email_status == "failed"
    contacts.insert_one.assert_awaited_once()
    contacts.update_one.assert_awaited_once()
    assert contacts.update_one.await_args.args[1]["$set"]["email_status"] == "failed"
    send_email.assert_called_once()
