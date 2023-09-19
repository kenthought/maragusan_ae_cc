from django.contrib import admin
from .models import Expenses


# Register your models here.
class ExpensesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "account_number",
        "account_name",
        "control_number",
        "expenses_description",
        "expenses_category",
        "account_status",
        "user",
        "created_at",
    )


admin.site.register(Expenses, ExpensesAdmin)
