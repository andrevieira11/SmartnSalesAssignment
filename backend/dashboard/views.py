from datetime import timedelta

from django.db.models import Count, Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import Project
from tasks.models import Task


class DashboardView(APIView):
    """Aggregate counts for the current user — totals, by-status, overdue, due-this-week."""

    @extend_schema(responses={200: dict})
    def get(self, request):
        user = request.user
        # Resolve visible task ids first, then aggregate on a join-free queryset
        # so the OR-filter join can't distort the GROUP BY counts.
        visible_ids = Task.objects.filter(Q(project__owner=user) | Q(assigned_to=user)).values("id")
        tasks = Task.objects.filter(id__in=visible_ids)
        today = timezone.localdate()
        by_status = {r["status"]: r["c"] for r in tasks.values("status").annotate(c=Count("id"))}
        data = {
            "total_projects": Project.objects.filter(owner=user).count(),
            "total_tasks": tasks.count(),
            "tasks_by_status": {
                "TODO": by_status.get("TODO", 0),
                "IN_PROGRESS": by_status.get("IN_PROGRESS", 0),
                "DONE": by_status.get("DONE", 0),
            },
            "overdue": tasks.filter(due_date__lt=today).exclude(status=Task.Status.DONE).count(),
            "due_this_week": tasks.filter(
                due_date__gte=today, due_date__lte=today + timedelta(days=7)
            ).exclude(status=Task.Status.DONE).count(),
        }
        return Response(data)
