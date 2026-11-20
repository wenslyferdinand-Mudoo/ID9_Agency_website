"""ID9_AGENCY backend API integration tests.

Remote targets and mutating CRUD tests require explicit opt-in. Known public
production/frontend hosts are always blocked; use a disposable staging backend
and disposable database for any test that writes data.
"""
import os
import uuid
from urllib.parse import urlparse

import pytest
import requests

BASE_URL = os.environ.get("ID9_TEST_API_URL", "").strip().rstrip("/")
ADMIN_EMAIL = os.environ.get("ID9_TEST_ADMIN_EMAIL", "").strip()
ADMIN_PASSWORD = os.environ.get("ID9_TEST_ADMIN_PASSWORD", "")
ALLOW_REMOTE_TARGET = os.environ.get("ID9_TEST_ALLOW_REMOTE", "").lower() == "true"
ALLOW_MUTATIONS = os.environ.get("ID9_TEST_ALLOW_MUTATIONS", "").lower() == "true"

if not BASE_URL:
    pytest.skip("Set ID9_TEST_API_URL to run backend integration tests.", allow_module_level=True)

_target = urlparse(BASE_URL)
if _target.scheme not in {"http", "https"} or not _target.netloc or not _target.hostname:
    raise RuntimeError("ID9_TEST_API_URL must be an absolute HTTP(S) URL.")

# Hard safety stop: the test suite must never target the known public website or
# the historical Emergent preview, even when remote testing is opted in.
_BLOCKED_HOSTS = {
    "id9-agency-website.vercel.app",
    "id9-agency-website-wensy-s-projects.vercel.app",
    "id9-agency-website-git-main-wensy-s-projects.vercel.app",
    "digital-impact-19.preview.emergentagent.com",
}
if _target.hostname.lower() in _BLOCKED_HOSTS:
    raise RuntimeError("Refusing to run integration tests against a known public ID9 host.")

_is_local_target = _target.hostname.lower() in {
    "localhost", "127.0.0.1", "::1", "host.docker.internal"
}
if not _is_local_target and not ALLOW_REMOTE_TARGET:
    pytest.skip(
        "Remote backend tests require explicit ID9_TEST_ALLOW_REMOTE=true.",
        allow_module_level=True,
    )


@pytest.fixture
def allow_mutations():
    if not ALLOW_MUTATIONS:
        pytest.skip(
            "Set ID9_TEST_ALLOW_MUTATIONS=true only for a disposable isolated test database."
        )


@pytest.fixture(scope="session")
def api():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="session")
def admin_token(api):
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        pytest.skip("Set ID9_TEST_ADMIN_EMAIL and ID9_TEST_ADMIN_PASSWORD for authenticated tests.")
    response = api.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15,
    )
    assert response.status_code == 200, f"Login failed: {response.status_code} {response.text}"
    data = response.json()
    assert data.get("access_token")
    assert data["user"]["email"] == ADMIN_EMAIL
    assert data["user"]["role"] == "admin"
    return data["access_token"]


@pytest.fixture
def admin(api, admin_token):
    api.headers.update({"Authorization": f"Bearer {admin_token}"})
    yield api
    api.headers.pop("Authorization", None)


# ----- Health -----
def test_health(api):
    response = api.get(f"{BASE_URL}/api/", timeout=15)
    assert response.status_code == 200
    assert response.json().get("status") == "ok"


# ----- Auth -----
def test_login_invalid(api):
    response = api.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "invalid-login-test@example.invalid", "password": "wrong-test-password"},
        timeout=15,
    )
    assert response.status_code == 401


def test_me_without_token(api):
    response = api.get(f"{BASE_URL}/api/auth/me", timeout=15)
    assert response.status_code == 401


def test_me_with_token(api, admin_token):
    response = api.get(
        f"{BASE_URL}/api/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"},
        timeout=15,
    )
    assert response.status_code == 200
    assert response.json()["email"] == ADMIN_EMAIL


# ----- Services -----
def test_services_seed_count(api):
    response = api.get(f"{BASE_URL}/api/services", timeout=15)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 12
    for key in ("slug", "title", "icon", "desc", "deliverables"):
        assert key in data[0]


def test_service_detail(api):
    response = api.get(f"{BASE_URL}/api/services/branding", timeout=15)
    assert response.status_code == 200
    assert response.json()["slug"] == "branding"


# ----- Portfolio -----
def test_portfolio_seed(api):
    response = api.get(f"{BASE_URL}/api/portfolio", timeout=15)
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 6
    assert all("slug" in item for item in items)


def test_portfolio_filter(api):
    response = api.get(
        f"{BASE_URL}/api/portfolio", params={"category": "branding"}, timeout=15
    )
    assert response.status_code == 200
    items = response.json()
    assert all(item["category"] == "branding" for item in items)
    assert len(items) >= 1


def test_portfolio_detail(api):
    response = api.get(f"{BASE_URL}/api/portfolio", timeout=15)
    slug = response.json()[0]["slug"]
    detail = api.get(f"{BASE_URL}/api/portfolio/{slug}", timeout=15)
    assert detail.status_code == 200
    assert detail.json()["slug"] == slug


def test_portfolio_detail_404(api):
    response = api.get(
        f"{BASE_URL}/api/portfolio/non-existent-slug-xyz", timeout=15
    )
    assert response.status_code == 404


# ----- Blog -----
def test_blog_seed(api):
    response = api.get(f"{BASE_URL}/api/blog", timeout=15)
    assert response.status_code == 200
    posts = response.json()
    assert len(posts) >= 4
    assert all(post.get("published") is True for post in posts)


def test_blog_detail(api):
    response = api.get(f"{BASE_URL}/api/blog", timeout=15)
    slug = response.json()[0]["slug"]
    detail = api.get(f"{BASE_URL}/api/blog/{slug}", timeout=15)
    assert detail.status_code == 200
    assert detail.json()["slug"] == slug


# ----- Contact -----
def test_contact_crud_flow(admin, allow_mutations):
    payload = {
        "name": "TEST_Visitor",
        "email": "test_visitor@example.com",
        "whatsapp": "+15555550100",
        "budget": "$10k-$25k",
        "service": "Branding",
        "deadline": "Q2 2026",
        "message": "TEST contact submission from pytest",
    }
    created = admin.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
    assert created.status_code == 200, created.text
    contact_id = created.json()["id"]

    try:
        contact = created.json()
        assert contact["name"] == payload["name"]
        assert contact["read"] is False
        listed = admin.get(f"{BASE_URL}/api/contact", timeout=15)
        assert listed.status_code == 200
        assert any(item["id"] == contact_id for item in listed.json())

        marked = admin.patch(
            f"{BASE_URL}/api/contact/{contact_id}/read", timeout=15
        )
        assert marked.status_code == 200
        refreshed = admin.get(f"{BASE_URL}/api/contact", timeout=15)
        target = next(item for item in refreshed.json() if item["id"] == contact_id)
        assert target["read"] is True
    finally:
        deleted = admin.delete(f"{BASE_URL}/api/contact/{contact_id}", timeout=15)
        assert deleted.status_code in (200, 404)


def test_contact_submit_missing_fields(api):
    response = api.post(
        f"{BASE_URL}/api/contact", json={"name": "X"}, timeout=15
    )
    assert response.status_code == 422


def test_contact_list_requires_auth(api):
    response = api.get(f"{BASE_URL}/api/contact", timeout=15)
    assert response.status_code == 401


# ----- Portfolio admin CRUD -----
def test_portfolio_admin_crud(admin, allow_mutations):
    payload = {
        "title": f"TEST_Project_{uuid.uuid4().hex[:6]}",
        "category": "web",
        "client": "TEST",
        "year": "2026",
        "summary": "TEST summary",
        "description": "TEST desc",
        "cover_image": "https://example.com/i.jpg",
        "gallery": [],
        "services": ["Web"],
        "challenge": "c",
        "strategy": "s",
        "outcome": "o",
        "featured": False,
    }
    created = admin.post(f"{BASE_URL}/api/portfolio", json=payload, timeout=15)
    assert created.status_code == 200, created.text
    item = created.json()
    item_id = item["id"]
    slug = item["slug"]

    try:
        assert "testproject" in slug
        payload["summary"] = "Updated summary"
        updated = admin.put(
            f"{BASE_URL}/api/portfolio/{item_id}", json=payload, timeout=15
        )
        assert updated.status_code == 200
        assert updated.json()["summary"] == "Updated summary"

        persisted = admin.get(f"{BASE_URL}/api/portfolio/{slug}", timeout=15)
        assert persisted.status_code == 200
        assert persisted.json()["summary"] == "Updated summary"
    finally:
        deleted = admin.delete(f"{BASE_URL}/api/portfolio/{item_id}", timeout=15)
        assert deleted.status_code in (200, 404)


def test_portfolio_create_requires_auth(api):
    response = api.post(
        f"{BASE_URL}/api/portfolio",
        json={"title": "x", "category": "web", "summary": "s", "cover_image": "x"},
        timeout=15,
    )
    assert response.status_code == 401


# ----- Blog admin CRUD -----
def test_blog_admin_crud(admin, allow_mutations):
    payload = {
        "title": f"TEST_Post_{uuid.uuid4().hex[:6]}",
        "category": "TEST",
        "excerpt": "TEST excerpt",
        "content": "## TEST",
        "cover_image": "https://example.com/i.jpg",
        "author": "TEST",
        "read_time": "1 min",
        "published": False,
        "featured": False,
    }
    created = admin.post(f"{BASE_URL}/api/blog", json=payload, timeout=15)
    assert created.status_code == 200, created.text
    item = created.json()
    item_id = item["id"]
    slug = item["slug"]

    try:
        # Verify a newly-created draft is not exposed through the public detail route.
        hidden = admin.get(f"{BASE_URL}/api/blog/{slug}", timeout=15)
        assert hidden.status_code == 404

        payload["excerpt"] = "Updated"
        updated = admin.put(
            f"{BASE_URL}/api/blog/{item_id}", json=payload, timeout=15
        )
        assert updated.status_code == 200
        assert updated.json()["excerpt"] == "Updated"
    finally:
        deleted = admin.delete(f"{BASE_URL}/api/blog/{item_id}", timeout=15)
        assert deleted.status_code in (200, 404)


def test_blog_create_requires_auth(api):
    response = api.post(
        f"{BASE_URL}/api/blog",
        json={
            "title": "x",
            "category": "x",
            "excerpt": "x",
            "content": "x",
            "cover_image": "x",
        },
        timeout=15,
    )
    assert response.status_code == 401
