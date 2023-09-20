from rest_framework import serializers
from .models import UserPermissions


class UserPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPermissions
        fields = ["id", "permissions", "user"]
