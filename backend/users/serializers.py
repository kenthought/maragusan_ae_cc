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

        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = [
            "username",
            "password",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "is_staff",
            "is_active",
            "business_code",
            "branch_code",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
