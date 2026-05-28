import pytest
from django.contrib.auth import get_user_model

from projects.models import Project
from tasks.models import Task

from .helpers import csrf_header, register

pytestmark = pytest.mark.django_db
User = get_user_model()


def test_task_defaults_and_str():
    user = User.objects.create_user("bob", password="x")
    project = Project.objects.create(owner=user, name="P")
    task = Task.objects.create(project=project, title="Ship it")
    assert task.status == Task.Status.TODO
    assert task.priority == Task.Priority.MEDIUM
    assert str(task) == "Ship it"


def test_crud_codes_and_status_filter(api):
    register(api, "alice")
    proj = api.post("/api/projects/", {"name": "Rollout"}, format="json", **csrf_header(api))
    assert proj.status_code == 201
    pid = proj.data["id"]
    t1 = api.post("/api/tasks/", {"project": pid, "title": "A", "status": "TODO"}, format="json", **csrf_header(api))
    t2 = api.post("/api/tasks/", {"project": pid, "title": "B", "status": "DONE"}, format="json", **csrf_header(api))
    assert t1.status_code == 201 and t2.status_code == 201
    done = api.get("/api/tasks/?status=DONE")
    assert done.status_code == 200
    assert done.data["count"] == 1
    assert all(t["status"] == "DONE" for t in done.data["results"])
    assert api.delete(f"/api/tasks/{t1.data['id']}/", **csrf_header(api)).status_code == 204
