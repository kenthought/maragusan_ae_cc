from django.contrib import admin
from .models import BankAccount

# Register your models here.


class BankAccountAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "account_number",
        "account_name",
        "control_number",
        "account_type",
        "bank",
        "bank_branch",
        "purok_street",
        "barangay",
        "municipality",
        "province",
        "account_status",
        "user",
        "created_at",
    )


admin.site.register(BankAccount, BankAccountAdmin)
