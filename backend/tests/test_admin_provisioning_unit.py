"""Unit tests for explicit, non-destructive administrator provisioning."""
import asyncio
import os
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import pytest
import server


def install_mock_users(monkeypatch, find_one, insert_one):
    monkeypatch.setattr(
        server,
        "db",
        SimpleNamespace(users=SimpleNamespace(find_one=find_one, insert_one=insert_one)),
    )


@pytest.mark.parametrize("missing_variable", ["ADMIN_EMAIL", "ADMIN_PASSWORD"])
def test_seed_admin_skips_when_configuration_is_incomplete(monkeypatch, missing_variable):
    monkeypatch.setenv("ADMIN_EMAIL", "admin@example.test")
    monkeypatch.setenv("ADMIN_PASSWORD", "strong-test-only-password")
    monkeypatch.delenv(missing_variable, raising=False)

    find_one = AsyncMock()
    insert_one = AsyncMock()
    install_mock_users(monkeypatch, find_one, insert_one)

    asyncio.run(server.seed_admin())

    find_one.assert_not_awaited()
    insert_one.assert_not_awaited()


def test_seed_admin_preserves_existing_account_and_password(monkeypatch):
    monkeypatch.setenv("ADMIN_EMAIL", " ADMIN@Example.Test ")
    monkeypatch.setenv("ADMIN_PASSWORD", "new-test-password")

    existing = {"email": "admin@example.test", "password_hash": "existing-hash"}
    find_one = AsyncMock(return_value=existing)
    insert_one = AsyncMock()
    install_mock_users(monkeypatch, find_one, insert_one)

    asyncio.run(server.seed_admin())

    find_one.assert_awaited_once_with({"email": "admin@example.test"})
    insert_one.assert_not_awaited()


def test_seed_admin_creates_first_account_with_explicit_credentials(monkeypatch):
    monkeypatch.setenv("ADMIN_EMAIL", " ADMIN@Example.Test ")
    monkeypatch.setenv("ADMIN_PASSWORD", "strong-test-only-password")

    find_one = AsyncMock(return_value=None)
    insert_one = AsyncMock()
    install_mock_users(monkeypatch, find_one, insert_one)
    monkeypatch.setattr(server, "hash_password", Mock(return_value="hashed-test-password"))
    monkeypatch.setattr(server, "utc_now_iso", Mock(return_value="2026-11-19T00:00:00+00:00"))

    asyncio.run(server.seed_admin())

    find_one.assert_awaited_once_with({"email": "admin@example.test"})
    insert_one.assert_awaited_once()
    created = insert_one.await_args.args[0]
    assert created["email"] == "admin@example.test"
    assert created["password_hash"] == "hashed-test-password"
    assert created["role"] == "admin"
    assert created["name"] == "ID9 Admin"
    assert created["id"]
