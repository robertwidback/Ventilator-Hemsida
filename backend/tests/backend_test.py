"""Backend API tests for Ventilator site: jobs (public + admin CRUD), news, auth, contact."""
import os
import re
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def test_credentials():
    p = Path("/app/memory/test_credentials.md")
    if not p.exists():
        pytest.skip("missing test_credentials.md")
    content = p.read_text(encoding="utf-8")
    email = re.search(r"(?im)^\s*[-*]?\s*(?:E-post|Email)\s*:\s*`?([^`\s]+)", content)
    pwd = re.search(r"(?im)^\s*[-*]?\s*(?:L\u00f6senord|Password)\s*:\s*`?([^`\s]+)", content)
    if not email or not pwd:
        pytest.skip("no credentials parsed")
    return {"email": email.group(1), "password": pwd.group(1)}


@pytest.fixture(scope="session")
def auth_token(api_client, test_credentials):
    r = api_client.post(f"{BASE_URL}/api/auth/login", json=test_credentials)
    if r.status_code != 200:
        pytest.fail(f"login failed {r.status_code}: {r.text[:300]}")
    token = r.json().get("token")
    assert isinstance(token, str) and len(token) > 20
    return token


@pytest.fixture(scope="session")
def admin_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def created_job_ids():
    return []


@pytest.fixture(scope="module", autouse=True)
def cleanup(api_client, created_job_ids, admin_headers):
    yield
    for jid in created_job_ids:
        api_client.delete(f"{BASE_URL}/api/admin/jobs/{jid}", headers=admin_headers)


# --- Health / root ---
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json()["message"] == "Ventilator API"


# --- Auth ---
class TestAuth:
    def test_login_success(self, api_client, test_credentials):
        r = api_client.post(f"{BASE_URL}/api/auth/login", json=test_credentials)
        assert r.status_code == 200
        d = r.json()
        assert d["email"].lower() == test_credentials["email"].lower()
        assert "token" in d

    def test_login_wrong_password(self, api_client, test_credentials):
        r = api_client.post(f"{BASE_URL}/api/auth/login",
                            json={"email": test_credentials["email"], "password": "wrong-pass"})
        assert r.status_code == 401

    def test_login_wrong_email(self, api_client, test_credentials):
        r = api_client.post(f"{BASE_URL}/api/auth/login",
                            json={"email": "nope@example.com", "password": test_credentials["password"]})
        assert r.status_code == 401

    def test_login_invalid_payload(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/auth/login", json={"email": "not-an-email", "password": "x"})
        assert r.status_code == 422

    def test_bcrypt_hash_format(self):
        """Verify stored admin hash uses bcrypt $2b$ format."""
        import asyncio
        from motor.motor_asyncio import AsyncIOMotorClient
        env = dotenv_values("/app/backend/.env")

        async def _get():
            c = AsyncIOMotorClient(env["MONGO_URL"])
            u = await c[env["DB_NAME"]].users.find_one({"email": env.get("ADMIN_EMAIL")})
            c.close()
            return u

        user = asyncio.get_event_loop().run_until_complete(_get()) if False else asyncio.run(_get())
        assert user is not None, "admin user not seeded"
        assert user["password_hash"].startswith("$2b$"), user["password_hash"][:10]


# --- Admin auth protection ---
class TestAdminProtection:
    @pytest.mark.parametrize("method,path", [
        ("get", "/api/admin/jobs"),
        ("post", "/api/admin/jobs"),
        ("put", "/api/admin/jobs/abc"),
        ("delete", "/api/admin/jobs/abc"),
        ("get", "/api/admin/news"),
        ("post", "/api/admin/news"),
    ])
    def test_requires_token(self, api_client, method, path):
        r = getattr(api_client, method)(f"{BASE_URL}{path}", json={"title": "TEST_x", "body": "hello"})
        assert r.status_code == 401, f"{method} {path} -> {r.status_code}"

    def test_invalid_token(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/jobs", headers={"Authorization": "Bearer bogus.token.here"})
        assert r.status_code == 401


# --- Public jobs ---
class TestPublicJobs:
    def test_list_jobs_contains_seed(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/jobs")
        assert r.status_code == 200
        jobs = r.json()
        assert isinstance(jobs, list) and len(jobs) >= 1
        titles = [j["title"] for j in jobs]
        assert "Servicetekniker" in titles
        seed = next(j for j in jobs if j["title"] == "Servicetekniker")
        assert seed["category"] == "Ventilation"
        assert seed["location"] == "Stockholm"
        assert seed["employment_type"] == "Heltid"
        assert seed["published"] is True
        assert "_id" not in seed

    def test_get_job_detail(self, api_client):
        jobs = api_client.get(f"{BASE_URL}/api/jobs").json()
        jid = jobs[0]["id"]
        r = api_client.get(f"{BASE_URL}/api/jobs/{jid}")
        assert r.status_code == 200
        assert r.json()["id"] == jid
        assert len(r.json()["body"]) > 10

    def test_get_job_404(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/jobs/does-not-exist-123")
        assert r.status_code == 404


# --- Admin jobs CRUD ---
class TestAdminJobsCRUD:
    def test_admin_list_jobs(self, api_client, admin_headers):
        r = api_client.get(f"{BASE_URL}/api/admin/jobs", headers=admin_headers)
        assert r.status_code == 200
        assert any(j["title"] == "Servicetekniker" for j in r.json())

    def test_create_update_delete_flow(self, api_client, admin_headers, created_job_ids):
        payload = {
            "title": "TEST_Ventilationsmontör",
            "category": "TEST_Montage",
            "location": "TEST_Uppsala",
            "employment_type": "Deltid",
            "preamble": "TEST preamble",
            "body": "TEST body text for job listing.",
            "date": "2026-02-01",
            "published": True,
        }
        r = api_client.post(f"{BASE_URL}/api/admin/jobs", headers=admin_headers, json=payload)
        assert r.status_code == 201, r.text[:300]
        created = r.json()
        jid = created["id"]
        created_job_ids.append(jid)
        for k in ("title", "category", "location", "employment_type", "preamble", "body", "date"):
            assert created[k] == payload[k]
        assert "_id" not in created

        # public visibility
        pub = api_client.get(f"{BASE_URL}/api/jobs").json()
        assert jid in [j["id"] for j in pub]
        assert api_client.get(f"{BASE_URL}/api/jobs/{jid}").status_code == 200

        # update
        upd = {**payload, "title": "TEST_Ventilationsmontör Uppdaterad", "location": "TEST_Solna"}
        r = api_client.put(f"{BASE_URL}/api/admin/jobs/{jid}", headers=admin_headers, json=upd)
        assert r.status_code == 200
        assert r.json()["title"] == upd["title"]
        got = api_client.get(f"{BASE_URL}/api/jobs/{jid}").json()
        assert got["title"] == upd["title"] and got["location"] == "TEST_Solna"

        # unpublish -> hidden from public
        r = api_client.put(f"{BASE_URL}/api/admin/jobs/{jid}", headers=admin_headers,
                           json={**upd, "published": False})
        assert r.status_code == 200
        assert r.json()["published"] is False
        assert api_client.get(f"{BASE_URL}/api/jobs/{jid}").status_code == 404
        assert jid not in [j["id"] for j in api_client.get(f"{BASE_URL}/api/jobs").json()]
        # still visible in admin list
        assert jid in [j["id"] for j in api_client.get(f"{BASE_URL}/api/admin/jobs", headers=admin_headers).json()]

        # delete
        r = api_client.delete(f"{BASE_URL}/api/admin/jobs/{jid}", headers=admin_headers)
        assert r.status_code == 204
        created_job_ids.remove(jid)
        assert api_client.get(f"{BASE_URL}/api/jobs/{jid}").status_code == 404
        assert jid not in [j["id"] for j in api_client.get(f"{BASE_URL}/api/admin/jobs", headers=admin_headers).json()]

    def test_update_nonexistent_job_404(self, api_client, admin_headers):
        r = api_client.put(f"{BASE_URL}/api/admin/jobs/nope-123", headers=admin_headers,
                           json={"title": "TEST_x", "body": "hello there"})
        assert r.status_code == 404

    def test_delete_nonexistent_job_404(self, api_client, admin_headers):
        r = api_client.delete(f"{BASE_URL}/api/admin/jobs/nope-123", headers=admin_headers)
        assert r.status_code == 404

    def test_create_job_validation(self, api_client, admin_headers):
        r = api_client.post(f"{BASE_URL}/api/admin/jobs", headers=admin_headers,
                            json={"title": "ab", "body": "x"})
        assert r.status_code == 422


# --- News regression ---
class TestNews:
    def test_list_news(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/news")
        assert r.status_code == 200
        posts = r.json()
        assert len(posts) >= 4
        assert all("_id" not in p for p in posts)

    def test_news_detail_and_404(self, api_client):
        posts = api_client.get(f"{BASE_URL}/api/news").json()
        r = api_client.get(f"{BASE_URL}/api/news/{posts[0]['id']}")
        assert r.status_code == 200
        assert r.json()["title"] == posts[0]["title"]
        assert api_client.get(f"{BASE_URL}/api/news/bad-id").status_code == 404


# --- Contact form (single submission only) ---
class TestContact:
    def test_contact_submit(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_QA Bot",
            "email": "qa-bot@example.com",
            "phone": "0700000000",
            "message": "TEST_ automated regression check, please ignore.",
        })
        assert r.status_code == 200, r.text[:300]
        assert r.json()["status"] == "success"

    def test_contact_validation(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={"name": "a", "email": "bad", "message": "x"})
        assert r.status_code == 422
