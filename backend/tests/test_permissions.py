import pytest
from rest_framework.test import APIClient

from .helpers import csrf_header, register

pytestmark = pytest.mark.django_db


def test_isolation_and_assignee_rules(api):
    register(api, "alice")
    bob = APIClient()
    bob_id = register(bob, "bob").data["id"]

    pid = api.post("/api/projects/", {"name": "Rollout"}, format="json", **csrf_header(api)).data["id"]
    tid = api.post(
        "/api/tasks/", {"project": pid, "title": "Audit", "assigned_to": bob_id},
        format="json", **csrf_header(api),
    ).data["id"]

    # Non-owner cannot see the project at all (404, not 403 — no existence leak).
    assert bob.get(f"/api/projects/{pid}/").status_code == 404
    # Assignee can read and move status, but cannot edit other fields or delete.
    assert bob.get(f"/api/tasks/{tid}/").status_code == 200
    assert bob.patch(f"/api/tasks/{tid}/", {"status": "DONE"}, format="json", **csrf_header(bob)).status_code == 200
    assert bob.patch(f"/api/tasks/{tid}/", {"title": "Hijack"}, format="json", **csrf_header(bob)).status_code == 403
    assert bob.delete(f"/api/tasks/{tid}/", **csrf_header(bob)).status_code == 403
