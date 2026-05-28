from rest_framework import permissions


class IsOwnerOrAssignee(permissions.BasePermission):
    """Project owner has full control; an assignee may read and PATCH status only."""

    def has_object_permission(self, request, view, obj):
        if obj.project.owner_id == request.user.id:
            return True
        if request.method in permissions.SAFE_METHODS:
            return obj.assigned_to_id == request.user.id
        # Assignee can move their card across columns, nothing else.
        if request.method == "PATCH" and obj.assigned_to_id == request.user.id:
            return set(request.data.keys()) <= {"status"}
        return False
