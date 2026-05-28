from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from projects.models import Project
from tasks.models import Task

User = get_user_model()
PASSWORD = "demo12345"


class Command(BaseCommand):
    help = "Populate demo data (idempotent). Login: demo / demo12345"

    def handle(self, *args, **options):
        demo = self._user("demo", "demo@smartnsales.test")
        manager = self._user("manager", "manager@smartnsales.test")

        if Project.objects.filter(owner=demo).exists():
            self.stdout.write("Seed already present; skipping.")
            return

        today = timezone.localdate()
        rollout = Project.objects.create(
            owner=demo, name="Store Rollout — DACH",
            description="Coordinate the Q3 rollout across 120 stores.",
        )
        campaign = Project.objects.create(
            owner=demo, name="Holiday Campaign",
            description="Seasonal merchandising and signage tasks.",
        )
        S, P = Task.Status, Task.Priority
        rows = [
            (rollout, "Audit POS hardware", S.TODO, P.HIGH, today + timedelta(days=3), manager),
            (rollout, "Train regional managers", S.IN_PROGRESS, P.URGENT, today + timedelta(days=1), manager),
            (rollout, "Ship signage kits", S.TODO, P.MEDIUM, today - timedelta(days=2), None),
            (rollout, "Sign off store #001", S.DONE, P.LOW, today - timedelta(days=5), demo),
            (campaign, "Draft window layout", S.IN_PROGRESS, P.MEDIUM, today + timedelta(days=5), demo),
            (campaign, "Order promo materials", S.TODO, P.HIGH, today - timedelta(days=1), manager),
        ]
        for project, title, status, priority, due, assignee in rows:
            Task.objects.create(
                project=project, title=title, status=status, priority=priority,
                due_date=due, assigned_to=assignee,
            )
        self.stdout.write(self.style.SUCCESS("Seeded demo data. Login: demo / demo12345"))

    def _user(self, username, email):
        user, created = User.objects.get_or_create(username=username, defaults={"email": email})
        if created:
            user.set_password(PASSWORD)
            user.save()
        return user
