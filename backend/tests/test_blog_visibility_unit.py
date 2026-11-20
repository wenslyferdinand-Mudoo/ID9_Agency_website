"""Focused unit tests for public blog publication visibility.

These tests replace the database handle with an in-memory mock. They never
connect to or mutate MongoDB.
Run from the backend directory with: pytest -q tests/test_blog_visibility_unit.py
"""
import asyncio
import os
from types import SimpleNamespace
from unittest.mock import AsyncMock

# server constructs a Motor client at import time; these inert values ensure
# importing the module does not depend on production configuration.
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import pytest
from fastapi import HTTPException

import server


def install_mock_blog_db(monkeypatch, find_one):
    """Replace the entire database handle; never patch Motor collection methods."""
    monkeypatch.setattr(
        server,
        "db",
        SimpleNamespace(blog=SimpleNamespace(find_one=find_one)),
    )


@pytest.mark.parametrize("slug", ["draft-post", "missing-post"])
def test_public_blog_detail_returns_404_for_unpublished_or_missing(slug, monkeypatch):
    find_one = AsyncMock(return_value=None)
    install_mock_blog_db(monkeypatch, find_one)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(server.get_blog(slug))

    assert exc.value.status_code == 404
    find_one.assert_awaited_once_with(
        {"slug": slug, "published": True},
        {"_id": 0},
    )


def test_public_blog_detail_returns_published_post(monkeypatch):
    published_post = {
        "id": "post-1",
        "slug": "published-post",
        "title": "Published post",
        "category": "News",
        "excerpt": "Excerpt",
        "content": "Content",
        "cover_image": "https://example.com/cover.jpg",
        "author": "ID9",
        "read_time": "2 min read",
        "published": True,
        "featured": False,
        "created_at": "2026-11-19T12:00:00+00:00",
    }
    find_one = AsyncMock(return_value=published_post)
    install_mock_blog_db(monkeypatch, find_one)

    result = asyncio.run(server.get_blog("published-post"))

    assert result == published_post
    find_one.assert_awaited_once_with(
        {"slug": "published-post", "published": True},
        {"_id": 0},
    )
