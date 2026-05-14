"""ID9_AGENCY backend API tests - covers health, auth, services, portfolio, blog, contact CRUD."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://digital-impact-19.preview.emergentagent.com').rstrip('/')
ADMIN_EMAIL = "admin@id9agency.com"
ADMIN_PASSWORD = "ID9_Admin_2025!"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api):
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
def test_contact_submit_public(api):
    payload = {
        "name": "TEST_Visitor",
        "email": "test_visitor@example.com",
        "whatsapp": "+15555550100",
        "budget": "$10k-$25k",
        "service": "Branding",
        "deadline": "Q2 2026",
        "message": "TEST_ contact submission from pytest",
    }
    r = api.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["read"] is False
    assert "id" in data
    pytest.contact_id = data["id"]


def test_contact_submit_missing_fields(api):
    r = api.post(f"{BASE_URL}/api/contact", json={"name": "X"})
    assert r.status_code == 422


def test_contact_list_requires_auth(api):
    r = api.get(f"{BASE_URL}/api/contact")
    assert r.status_code == 401


def test_contact_list_with_auth(admin):
    r = admin.get(f"{BASE_URL}/api/contact")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert any(it["id"] == pytest.contact_id for it in items)


def test_contact_mark_read(admin):
    cid = pytest.contact_id
    r = admin.patch(f"{BASE_URL}/api/contact/{cid}/read")
    assert r.status_code == 200
    r2 = admin.get(f"{BASE_URL}/api/contact")
    target = next(it for it in r2.json() if it["id"] == cid)
    assert target["read"] is True


def test_contact_delete(admin):
    cid = pytest.contact_id
    r = admin.delete(f"{BASE_URL}/api/contact/{cid}")
    assert r.status_code == 200
    r2 = admin.get(f"{BASE_URL}/api/contact")
    assert not any(it["id"] == cid for it in r2.json())


# ----- Portfolio admin CRUD -----
def test_portfolio_admin_crud(admin):
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
def test_blog_admin_crud(admin):
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
