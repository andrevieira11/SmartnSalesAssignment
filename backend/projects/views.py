from django.db.models import Count
from rest_framework import viewsets

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """CRUD for the current user's projects (others' projects 404 by scoping)."""

    serializer_class = ProjectSerializer

    def get_queryset(self):
        return (
            Project.objects.filter(owner=self.request.user)
            .select_related("owner")
            .annotate(task_count=Count("tasks"))
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
