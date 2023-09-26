from django.contrib import admin
from .models import OwnersEquity

# Register your models here.


class OwnersEquityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "account_number",
        "account_name",
        "control_number",
        "purok_street",
        "barangay",
        "municipality",
        "province",
        "user",
    )


admin.site.register(OwnersEquity, OwnersEquityAdmin)
