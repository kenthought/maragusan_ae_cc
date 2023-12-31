from rest_framework import serializers
from .models import UserData
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["user_id"] = user.id
        token["name"] = user.first_name
        token["email"] = user.email
        token["is_admin"] = user.is_admin

        return token


class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = [
            "id",
            "username",
            "password",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "is_staff",
            "is_active",
            "is_admin",
            "business_code",
            "branch_code",
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = [
            "id",
            "username",
            "password",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "is_staff",
            "is_active",
            "is_admin",
            "business_code",
            "branch_code",
            "branch",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if password is not None:
            instance.set_password(password)
            instance.username = validated_data.get("username", instance.email)
            instance.first_name = validated_data.get("first_name", instance.first_name)
            instance.middle_name = validated_data.get(
                "middle_name", instance.middle_name
            )
            instance.last_name = validated_data.get("last_name", instance.last_name)
            instance.business_code = validated_data.get("business_code")
            instance.branch_code = validated_data.get("branch_code")
            instance.is_staff = validated_data.get("is_staff", instance.is_staff)
            instance.is_admin = validated_data.get("is_admin", instance.is_staff)
        instance.save()
        return instance
