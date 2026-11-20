"""Regression tests for independent mutable defaults in request models."""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import server


def payload(**overrides):
    data = {"title": "Test project", "category": "branding", "summary": "Summary", "cover_image": "/cover.jpg"}
    data.update(overrides)
    return data


def test_portfolio_collection_defaults_are_independent():
    first, second = server.PortfolioCreate(**payload()), server.PortfolioCreate(**payload())
    first.gallery.append("/gallery.jpg")
    first.services.append("Branding")
    first.tools.append("Illustrator")
    first.kpis.append({"label": "Items", "value": "1"})
    assert second.gallery == []
    assert second.services == []
    assert second.tools == []
    assert second.kpis == []


def test_portfolio_explicit_collections_are_preserved():
    model = server.PortfolioCreate(**payload(
        gallery=["/one.jpg"], services=["Branding"], tools=["Illustrator"],
        kpis=[{"label": "Items", "value": "2"}],
    ))
    assert model.gallery == ["/one.jpg"]
    assert model.services == ["Branding"]
    assert model.tools == ["Illustrator"]
    assert model.kpis == [{"label": "Items", "value": "2"}]
