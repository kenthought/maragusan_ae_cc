from django.contrib import admin
from .models import Receivables


# Register your models here.
class ReceivablesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "account_number",
        "control_number",
        "account_name",
        "spouse_name",
        "credit_terms",
        "credit_limit",
        "contact_number1",
        "contact_number2",
        "purok_street",
        "barangay",
        "municipality",
        "province",
        "account_category",
        "account_status",
        "co_maker",
        "agent",
        "company",
        "supervisor",
        "assignment",
        "date_hired",
        "company_id",
        "work_contact_number",
        "employment_status",
        "bank_account_name",
        "bank_account_number",
        "bank",
        "bank_branch",
        "card_number",
        "card_pin",
        "send_to",
        "funds_registered_name",
        "funds_account_number",
        "user",
        "created_at",
    )


admin.site.register(Receivables, ReceivablesAdmin)
