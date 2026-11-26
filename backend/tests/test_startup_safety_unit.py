"""Startup safety tests: explicit CORS and non-production-only demo seeding."""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import pytest
import server


def test_cors_defaults_to_the_verified_production_frontend(monkeypatch):
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    assert server.get_allowed_origins() == ["https://id9-agency-website.vercel.app"]


def test_cors_rejects_wildcard_origins(monkeypatch):
    monkeypatch.setenv("CORS_ORIGINS", "*")
    with pytest.raises(RuntimeError, match="wildcard CORS is disabled"):
        server.get_allowed_origins()


def test_cors_parses_explicit_origins(monkeypatch):
    monkeypatch.setenv(
        "CORS_ORIGINS",
        "https://id9-agency-website.vercel.app, https://preview.example.test/ ",
    )
    assert server.get_allowed_origins() == [
        "https://id9-agency-website.vercel.app",
        "https://preview.example.test",
    ]


def test_demo_content_is_disabled_by_default(monkeypatch):
    monkeypatch.delenv("APP_ENV", raising=False)
    monkeypatch.delenv("SEED_DEMO_CONTENT", raising=False)
    assert server.should_seed_demo_content() is False


def test_demo_content_cannot_be_seeded_in_production(monkeypatch):
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("SEED_DEMO_CONTENT", "true")
    assert server.should_seed_demo_content() is False


def test_demo_content_requires_explicit_nonproduction_opt_in(monkeypatch):
    monkeypatch.setenv("APP_ENV", "development")
    monkeypatch.setenv("SEED_DEMO_CONTENT", "true")
    assert server.should_seed_demo_content() is True
