from django.contrib import admin
from .models import Approval

# Register your models here.


class ApprovalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "type",
        "approval_type",
        "module_id",
        "account_number",
        "old_data",
        "new_data",
        "remarks",
        "state",
        "approver",
        "date_executed",
        "submitted_by",
        "created_at",
    )

admin.site.register(Approval, ApprovalAdmin)