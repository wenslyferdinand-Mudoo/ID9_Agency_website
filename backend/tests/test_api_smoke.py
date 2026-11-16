"""Safe, local API smoke tests for the ID9 FastAPI application.

These tests use one module-scoped TestClient and the isolated MongoDB service
provided by CI. They intentionally do not execute the legacy remote suite.
"""
import pytest
from fastapi.testclient import TestClient

from server import app


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
        json={"email": "unknown@example.invalid", "password": "not-a-valid-password"},
    )
    assert response.status_code == 401
