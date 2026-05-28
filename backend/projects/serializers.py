from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    # Populated by the viewset's annotated queryset (no per-row query).
    task_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "description", "owner", "created_at", "task_count"]
        read_only_fields = ["owner", "created_at"]
