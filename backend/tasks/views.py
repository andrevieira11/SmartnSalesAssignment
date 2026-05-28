from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .filters import TaskFilter
from .models import Task
from .permissions import IsOwnerOrAssignee
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """Tasks visible when you own the project or are the assignee."""

    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAssignee]
    filterset_class = TaskFilter

    def get_queryset(self):
        user = self.request.user
        return (
            Task.objects.filter(Q(project__owner=user) | Q(assigned_to=user))
            .select_related("assigned_to", "project", "project__owner")
            .distinct()
        )
