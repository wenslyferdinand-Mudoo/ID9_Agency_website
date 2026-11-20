"""Regression tests for independent mutable defaults in backend request models."""
import os
import sys
from pathlib import Path

# Make the backend module importable whether pytest is launched from the
# repository root or from the backend directory.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# server initializes a Motor client at import time; these inert values avoid
# dependence on deployment configuration and do not connect to the database.
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import server


def make_portfolio_payload(**overrides):
    payload = {
        "title": "Test project",
        "category": "branding",
        "summary": "Test summary",
        "cover_image": "/test-cover.jpg",
    }
    payload.update(overrides)
    return payload


def test_portfolio_collection_defaults_are_independent():
    first = server.PortfolioCreate(**make_portfolio_payload())
    second = server.PortfolioCreate(**make_portfolio_payload())

    first.gallery.append("/gallery.jpg")
    first.services.append("Branding")
    first.tools.append("Illustrator")
    first.kpis.append({"label": "Items", "value": "1"})

    assert second.gallery == []
    assert second.services == []
    assert second.tools == []
    assert second.kpis == []


def test_portfolio_explicit_collections_are_preserved():
    payload = make_portfolio_payload(
        gallery=["/one.jpg"],
        services=["Branding"],
        tools=["Illustrator"],
        kpis=[{"label": "Items", "value": "2"}],
    )

    model = server.PortfolioCreate(**payload)

    assert model.gallery == ["/one.jpg"]
    assert model.services == ["Branding"]
    assert model.tools == ["Illustrator"]
    assert model.kpis == [{"label": "Items", "value": "2"}]
