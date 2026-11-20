"""Focused unit tests for public blog publication visibility.

These tests mock MongoDB and never connect to or mutate a database.
Run from the backend directory with: pytest tests/test_blog_visibility_unit.py
"""
import asyncio
import os
from unittest.mock import AsyncMock

# The application module constructs a Motor client at import time, but does not
# connect until an operation is executed. Supply inert local test configuration.
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import pytest
from fastapi import HTTPException

import server


def test_public_blog_detail_queries_only_published_posts(monkeypatch):
    find_one = AsyncMock(return_value=None)
    monkeypatch.setattr(server.db.blog, "find_one", find_one)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(server.get_blog("draft-post"))

    assert exc.value.status_code == 404
    find_one.assert_awaited_once_with(
        {"slug": "draft-post", "published": True},
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
    monkeypatch.setattr(server.db.blog, "find_one", find_one)

    result = asyncio.run(server.get_blog("published-post"))

    assert result == published_post
    find_one.assert_awaited_once_with(
        {"slug": "published-post", "published": True},
        {"_id": 0},
    )
