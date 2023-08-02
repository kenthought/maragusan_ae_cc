from django.contrib import admin
from .models import (
    AssetType,
    Bank,
    Barangay,
    Municipality,
    Province,
    ExpensesCategory,
    Supplier,
)

# Register your models here.


class AssetTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "asset_type", "user")


class BankAdmin(admin.ModelAdmin):
    list_display = ("id", "bank", "user")


class BarangayAdmin(admin.ModelAdmin):
    list_display = ("id", "barangay", "user")


class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ("id", "municipality", "user")


class ProvinceAdmin(admin.ModelAdmin):
    list_display = ("id", "province", "user")


class ExpensesCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "expenses_category", "user")


class SupplierAdmin(admin.ModelAdmin):
    list_display = ("id", "supplier", "tin", "address", "user")


admin.site.register(AssetType, AssetTypeAdmin)
admin.site.register(Bank, BankAdmin)
admin.site.register(Barangay, BarangayAdmin)
admin.site.register(Municipality, MunicipalityAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(ExpensesCategory, ExpensesCategoryAdmin)
admin.site.register(Supplier, SupplierAdmin)
