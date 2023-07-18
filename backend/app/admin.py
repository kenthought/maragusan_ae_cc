from django.contrib import admin
from .models import (
    Account,
    AssetType,
    Asset,
    Ledger,
    DepreciationLedger,
    Barangay,
    Municipality,
    Province,
    OwnersEquity,
)

# Register your models here.


class AccountAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user")


class AssetTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "asset_type", "user")


class BarangayAdmin(admin.ModelAdmin):
    list_display = ("id", "barangay", "user")


class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ("id", "municipality", "user")


class ProvinceAdmin(admin.ModelAdmin):
    list_display = ("id", "province", "user")


class AssetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "account_number",
        "account_name",
        "control_number",
        "asset_description",
        "asset_type",
        "user",
    )


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


class LedgerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "invoice_number",
        "term",
        "particulars",
        "debit",
        "credit",
        "control_number",
        "trans_number",
        "asset",
        "user",
    )


class DepreciationLedgerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "invoice_number",
        "term",
        "particulars",
        "debit",
        "credit",
        "control_number",
        "depreciation_date",
        "trans_date",
        "asset",
        "user",
    )


admin.site.register(Account, AccountAdmin)
admin.site.register(Asset, AssetAdmin)
admin.site.register(AssetType, AssetTypeAdmin)
admin.site.register(Barangay, BarangayAdmin)
admin.site.register(Municipality, MunicipalityAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(Ledger, LedgerAdmin)
admin.site.register(DepreciationLedger, DepreciationLedgerAdmin)
admin.site.register(OwnersEquity, OwnersEquityAdmin)
