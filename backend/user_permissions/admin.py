from django.contrib import admin
from .models import UserPermissions

# Register your models here.
class UserPermissionsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "permissions",
        "user",
    )
    search_fields = (
        "user__username",
    )

admin.site.register(UserPermissions, UserPermissionsAdmin)
