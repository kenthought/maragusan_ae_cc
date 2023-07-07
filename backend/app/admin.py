from django.contrib import admin
from .models import Account, AssetType, Asset, Ledger

# Register your models here.


class AccountAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user")


class AssetTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "asset_type", "user")


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
        "term",
        "particulars",
        "debit",
        "credit",
        "control_number",
        "trans_number",
        "asset",
        "user",
    )


admin.site.register(Account, AccountAdmin)
admin.site.register(Asset, AssetAdmin)
admin.site.register(AssetType, AssetTypeAdmin)
admin.site.register(Ledger, LedgerAdmin)
