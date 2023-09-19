from rest_framework import serializers
from .models import Approval
from users.serializers import UserSerializer


class ApprovalWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approval
        fields = [
            "id",
            "type",
            "approval_type",
            "account_number",
            "module_id",
            "old_data",
            "new_data",
            "approved_by",
            "approved_date",
            "submitted_by",
            "created_at",
        ]


class ApprovalViewSerializer(serializers.ModelSerializer):
    approved_by = UserSerializer()
    submitted_by = UserSerializer()

    class Meta:
        model = Approval
        fields = [
            "id",
            "type",
            "approval_type",
            "account_number",
            "module_id",
            "old_data",
            "new_data",
            "approved_by",
            "approved_date",
            "submitted_by",
            "created_at",
        ]
