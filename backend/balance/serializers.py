from rest_framework import serializers
from .models import Balance
from users.serializers import UserSerializer


class BalanceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = [
            "id",
            "type",
            "module_id",
            "balance",
            "user",
            "updated_at",
        ]


class BalanceViewSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Balance
        fields = [
            "id",
            "type",
            "module_id",
            "balance",
            "user",
            "updated_at",
        ]
