import pytest

from .helpers import csrf_header, register

pytestmark = pytest.mark.django_db


def test_dashboard_status_counts_reconcile(api):
    register(api, "alice")
    pid = api.post("/api/projects/", {"name": "P"}, format="json", **csrf_header(api)).data["id"]
    for status in ["TODO", "TODO", "IN_PROGRESS", "DONE"]:
        api.post(
            "/api/tasks/", {"project": pid, "title": "t", "status": status},
            format="json", **csrf_header(api),
        )
    data = api.get("/api/dashboard/").data
    assert data["total_tasks"] == 4
    assert data["tasks_by_status"] == {"TODO": 2, "IN_PROGRESS": 1, "DONE": 1}
    # The by-status breakdown must always sum to the total.
    assert sum(data["tasks_by_status"].values()) == data["total_tasks"]
