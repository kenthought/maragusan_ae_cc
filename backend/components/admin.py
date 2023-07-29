from django.contrib import admin
from .models import AssetType, Bank, Barangay, Municipality, Province

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


admin.site.register(AssetType, AssetTypeAdmin)
admin.site.register(Bank, BankAdmin)
admin.site.register(Barangay, BarangayAdmin)
admin.site.register(Municipality, MunicipalityAdmin)
admin.site.register(Province, ProvinceAdmin)
