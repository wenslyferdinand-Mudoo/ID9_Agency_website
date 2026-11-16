"""Safe, local API smoke tests for the ID9 FastAPI application.

These tests use one module-scoped TestClient and the isolated MongoDB service
provided by CI. They intentionally do not execute the legacy remote suite.
"""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# GitHub Actions runs pytest from backend/, but pytest's import mode can omit
# that working directory from sys.path when collecting tests from tests/.
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from server import app  # noqa: E402


@pytest.fixture(scope="module")
def client():
    # Keep the app lifespan (and Motor client) alive for the whole module.
    with TestClient(app) as test_client:
        yield test_client


def test_api_health(client):
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {"message": "ID9_AGENCY API", "status": "ok"}


def test_services_endpoint_returns_expected_contract(client):
    response = client.get("/api/services")
    assert response.status_code == 200
    services = response.json()
    assert len(services) == 12
    assert {"slug", "title", "icon", "desc", "deliverables"} <= set(services[0])


def test_public_blog_endpoint_only_returns_published_posts(client):
    response = client.get("/api/blog")
    assert response.status_code == 200
    assert all(post.get("published") is True for post in response.json())


def test_admin_endpoint_requires_authentication(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_invalid_login_is_rejected(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "unknown@example.com", "password": "not-a-valid-password"},
    )
    assert response.status_code == 401
