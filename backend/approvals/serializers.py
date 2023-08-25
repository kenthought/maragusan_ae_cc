from rest_framework import serializers
from .models import Approval
from users.serializers import UserSerializer


class ApprovalWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approval
        fields = [
            "id",
            "type",
            "account_number",
            "module_id",
            "data",
            "approved_by",
            "created_at",
        ]


class ApprovalViewSerializer(serializers.ModelSerializer):
    approved_by = UserSerializer()

    class Meta:
        model = Approval
        fields = [
            "id",
            "type",
            "account_number",
            "module_id",
            "data",
            "approved_by",
            "created_at",
        ]
