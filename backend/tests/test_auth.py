import pytest

from .helpers import csrf_header, register

pytestmark = pytest.mark.django_db


def test_login_sets_httponly_cookie_and_hides_token(api):
    register(api, "alice")
    api.cookies.clear()
    resp = api.post(
        "/api/auth/login/", {"username": "alice", "password": "Str0ngP@ss1"}, format="json"
    )
    assert resp.status_code == 200
    assert "access_token" in resp.cookies
    assert resp.cookies["access_token"]["httponly"]
    assert "access" not in resp.data and "token" not in resp.data


def test_unauthenticated_request_rejected(api):
    assert api.get("/api/projects/").status_code == 401


def test_refresh_rotation_invalidates_old_token(api):
    register(api, "alice")
    old_refresh = api.cookies["refresh_token"].value
    rotated = api.post("/api/auth/refresh/", **csrf_header(api))
    assert rotated.status_code == 200
    assert api.cookies["refresh_token"].value != old_refresh
    # Reusing the rotated-out refresh token must fail.
    api.cookies["refresh_token"] = old_refresh
    assert api.post("/api/auth/refresh/", **csrf_header(api)).status_code == 401
