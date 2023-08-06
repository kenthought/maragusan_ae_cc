from django.contrib import admin
from .models import Payables, Contacts

# Register your models here.


class PayablesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "account_number",
        "account_name",
        "control_number",
        "account_type",
        "account_status",
        "payment_arrangement",
        "purok_street",
        "barangay",
        "municipality",
        "province",
        "term",
        "user",
        "created_at",
    )


class ContactAdmin(admin.ModelAdmin):
    list_display = ("personnel", "contact_no", "designation", "payables", "user")


admin.site.register(Payables, PayablesAdmin)

admin.site.register(Contacts, ContactAdmin)
