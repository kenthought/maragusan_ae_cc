from django.contrib import admin
from users.models import UserData
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea, CharField
from django import forms
from django.db import models


# Register your models here.
class UserAdminConfig(UserAdmin):
    model = UserData
    search_fields = (
        "email",
        "username",
        "first_name",
        "middle_name",
        "last_name",
    )
    list_filter = (
        "email",
        "username",
        "first_name",
        "middle_name",
        "last_name",
        "is_active",
        "is_staff",
    )
    ordering = ("-date_joined",)
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
        "middle_name",
        "last_name",
        "is_active",
        "is_staff",
    )
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "username",
                    "first_name",
                    "middle_name",
                    "last_name",
                )
            },
        ),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
        ("Personal", {"fields": ("about",)}),
    )
    formfield_overrides = {
        models.TextField: {"widget": Textarea(attrs={"rows": 20, "cols": 60})},
    }
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )


admin.site.register(UserData, UserAdminConfig)
