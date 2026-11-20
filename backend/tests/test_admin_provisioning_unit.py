"""Unit tests for explicit, non-destructive administrator provisioning."""
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

import server


def install_mock_users(monkeypatch, find_one, insert_one):
    monkeypatch.setattr(server, "db", SimpleNamespace(users=SimpleNamespace(find_one=find_one, insert_one=insert_one)))


def test_seed_admin_skips_when_configuration_is_incomplete(monkeypatch):
    monkeypatch.delenv("ADMIN_EMAIL", raising=False)
    monkeypatch.delenv("ADMIN_PASSWORD", raising=False)
    find_one, insert_one = AsyncMock(), AsyncMock()
    install_mock_users(monkeypatch, find_one, insert_one)
    asyncio.run(server.seed_admin())
    find_one.assert_not_awaited()
    insert_one.assert_not_awaited()


def test_seed_admin_preserves_existing_account_and_password(monkeypatch):
    monkeypatch.setenv("ADMIN_EMAIL", " ADMIN@Example.Test ")
    monkeypatch.setenv("ADMIN_PASSWORD", "new-test-password")
    find_one = AsyncMock(return_value={"email": "admin@example.test", "password_hash": "existing-hash"})
    insert_one = AsyncMock()
    install_mock_users(monkeypatch, find_one, insert_one)
    asyncio.run(server.seed_admin())
    find_one.assert_awaited_once_with({"email": "admin@example.test"})
    insert_one.assert_not_awaited()


def test_seed_admin_creates_first_account_with_explicit_credentials(monkeypatch):
    monkeypatch.setenv("ADMIN_EMAIL", " ADMIN@Example.Test ")
    monkeypatch.setenv("ADMIN_PASSWORD", "strong-test-only-password")
    find_one, insert_one = AsyncMock(return_value=None), AsyncMock()
    install_mock_users(monkeypatch, find_one, insert_one)
    monkeypatch.setattr(server, "hash_password", Mock(return_value="hashed-test-password"))
    monkeypatch.setattr(server, "utc_now_iso", Mock(return_value="2026-11-20T00:00:00+00:00"))
    asyncio.run(server.seed_admin())
    created = insert_one.await_args.args[0]
    assert created["email"] == "admin@example.test"
    assert created["password_hash"] == "hashed-test-password"
    assert created["role"] == "admin"
