from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_detail = UserSerializer(source="assigned_to", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id", "project", "title", "description", "status", "priority",
            "due_date", "assigned_to", "assigned_to_detail", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate_project(self, project):
        # Tasks may only be attached to a project the requester owns.
        request = self.context["request"]
        if project.owner_id != request.user.id:
            raise serializers.ValidationError("You can only add tasks to your own projects.")
        return project
