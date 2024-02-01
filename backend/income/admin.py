from django.contrib import admin
from .models import Income, Ledger

# Register your models here.


class IncomeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "account_number",
        "account_name",
        "control_number",
        "description",
        "user",
    )


admin.site.register(Income, IncomeAdmin)
