"""ID9_AGENCY backend API tests - covers health, auth, services, portfolio, blog, contact CRUD."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("ID9_TEST_API_URL", "").strip().rstrip("/")
ADMIN_EMAIL = os.environ.get("ID9_TEST_ADMIN_EMAIL", "").strip()
ADMIN_PASSWORD = os.environ.get("ID9_TEST_ADMIN_PASSWORD", "")
ALLOW_REMOTE_TARGET = os.environ.get("ID9_TEST_ALLOW_REMOTE", "").lower() == "true"
ALLOW_MUTATIONS = os.environ.get("ID9_TEST_ALLOW_MUTATIONS", "").lower() == "true"

if not BASE_URL:
    pytest.skip("Set ID9_TEST_API_URL to run backend integration tests.", allow_module_level=True)

from urllib.parse import urlparse

_target = urlparse(BASE_URL)
if _target.scheme not in {"http", "https"} or not _target.netloc:
    raise RuntimeError("ID9_TEST_API_URL must be an absolute HTTP(S) URL.")

_is_local_target = _target.hostname in {"localhost", "127.0.0.1", "::1", "host.docker.internal"}
if not _is_local_target and not ALLOW_REMOTE_TARGET:
    pytest.skip(
        "Remote backend tests require explicit ID9_TEST_ALLOW_REMOTE=true.",
        allow_module_level=True,
    )


@pytest.fixture
def allow_mutations():
    if not ALLOW_MUTATIONS:
        pytest.skip("Set ID9_TEST_ALLOW_MUTATIONS=true only for an isolated test database.")


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api):
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        pytest.skip("Set ID9_TEST_ADMIN_EMAIL and ID9_TEST_ADMIN_PASSWORD for authenticated tests.")
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data and data["access_token"]
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
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ----- Auth -----
def test_login_invalid(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong!"})
    assert r.status_code == 401


def test_me_without_token(api):
    r = api.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 401


def test_me_with_token(api, admin_token):
    r = api.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# ----- Services -----
def test_services_seed_count(api):
    r = api.get(f"{BASE_URL}/api/services")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 12
    sample = data[0]
    for k in ("slug", "title", "icon", "desc", "deliverables"):
        assert k in sample


def test_service_detail(api):
    r = api.get(f"{BASE_URL}/api/services/branding")
    assert r.status_code == 200
    assert r.json()["slug"] == "branding"


# ----- Portfolio -----
def test_portfolio_seed(api):
    r = api.get(f"{BASE_URL}/api/portfolio")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 6
    assert all("slug" in it for it in items)


def test_portfolio_filter(api):
    r = api.get(f"{BASE_URL}/api/portfolio", params={"category": "branding"})
    assert r.status_code == 200
    items = r.json()
    assert all(it["category"] == "branding" for it in items)
    assert len(items) >= 1


def test_portfolio_detail(api):
    r = api.get(f"{BASE_URL}/api/portfolio")
    slug = r.json()[0]["slug"]
    r2 = api.get(f"{BASE_URL}/api/portfolio/{slug}")
    assert r2.status_code == 200
    assert r2.json()["slug"] == slug


def test_portfolio_detail_404(api):
    r = api.get(f"{BASE_URL}/api/portfolio/non-existent-slug-xyz")
    assert r.status_code == 404


# ----- Blog -----
def test_blog_seed(api):
    r = api.get(f"{BASE_URL}/api/blog")
    assert r.status_code == 200
    posts = r.json()
    assert len(posts) >= 4
    assert all(p.get("published") is True for p in posts)


def test_blog_detail(api):
    r = api.get(f"{BASE_URL}/api/blog")
    slug = r.json()[0]["slug"]
    r2 = api.get(f"{BASE_URL}/api/blog/{slug}")
    assert r2.status_code == 200
    assert r2.json()["slug"] == slug


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
    created = admin.post(f"{BASE_URL}/api/contact", json=payload)
    assert created.status_code == 200, created.text
    contact = created.json()
    contact_id = contact["id"]

    try:
        assert contact["name"] == payload["name"]
        assert contact["read"] is False
        listed = admin.get(f"{BASE_URL}/api/contact")
        assert listed.status_code == 200
        assert any(item["id"] == contact_id for item in listed.json())

        marked = admin.patch(f"{BASE_URL}/api/contact/{contact_id}/read")
        assert marked.status_code == 200
        refreshed = admin.get(f"{BASE_URL}/api/contact")
        target = next(item for item in refreshed.json() if item["id"] == contact_id)
        assert target["read"] is True
    finally:
        deleted = admin.delete(f"{BASE_URL}/api/contact/{contact_id}")
        assert deleted.status_code in (200, 404)


def test_contact_submit_missing_fields(api):
    r = api.post(f"{BASE_URL}/api/contact", json={"name": "X"})
    assert r.status_code == 422


def test_contact_list_requires_auth(api):
    r = api.get(f"{BASE_URL}/api/contact")
    assert r.status_code == 401


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
        "challenge": "c", "strategy": "s", "outcome": "o",
        "featured": False,
    }
    r = admin.post(f"{BASE_URL}/api/portfolio", json=payload)
    assert r.status_code == 200, r.text
    item = r.json()
    item_id = item["id"]
    assert "testproject" in item["slug"]

    # Update
    payload["summary"] = "Updated summary"
    r2 = admin.put(f"{BASE_URL}/api/portfolio/{item_id}", json=payload)
    assert r2.status_code == 200
    assert r2.json()["summary"] == "Updated summary"

    # Verify persisted
    r3 = admin.get(f"{BASE_URL}/api/portfolio/{item['slug']}")
    assert r3.status_code == 200
    assert r3.json()["summary"] == "Updated summary"

    # Delete
    r4 = admin.delete(f"{BASE_URL}/api/portfolio/{item_id}")
    assert r4.status_code == 200
    r5 = admin.get(f"{BASE_URL}/api/portfolio/{item['slug']}")
    assert r5.status_code == 404


def test_portfolio_create_requires_auth(api):
    r = api.post(f"{BASE_URL}/api/portfolio", json={"title": "x", "category": "web", "summary": "s", "cover_image": "x"})
    assert r.status_code == 401


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
        "published": True,
        "featured": False,
    }
    r = admin.post(f"{BASE_URL}/api/blog", json=payload)
    assert r.status_code == 200, r.text
    item = r.json()
    item_id = item["id"]

    payload["excerpt"] = "Updated"
    r2 = admin.put(f"{BASE_URL}/api/blog/{item_id}", json=payload)
    assert r2.status_code == 200
    assert r2.json()["excerpt"] == "Updated"

    r3 = admin.delete(f"{BASE_URL}/api/blog/{item_id}")
    assert r3.status_code == 200


def test_blog_create_requires_auth(api):
    r = api.post(f"{BASE_URL}/api/blog", json={"title": "x", "category": "x", "excerpt": "x", "content": "x", "cover_image": "x"})
    assert r.status_code == 401
