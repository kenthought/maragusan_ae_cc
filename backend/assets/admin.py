from django.contrib import admin
from .models import Asset, Ledger, DepreciationLedger

# Register your models here.


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


class LedgerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "invoice_number",
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


admin.site.register(Asset, AssetAdmin)
admin.site.register(Ledger, LedgerAdmin)
admin.site.register(DepreciationLedger, DepreciationLedgerAdmin)
