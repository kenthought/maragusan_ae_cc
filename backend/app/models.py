from django.db import models
from django.conf import settings
import uuid


# Create your models here.
class Account(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="accounts", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Asset(models.Model):
    id = models.BigAutoField(primary_key=True)
    account_number = models.CharField(
        blank=True, null=True, max_length=100, editable=False, unique=True
    )
    control_number = models.CharField(max_length=100)
    account_name = models.CharField(max_length=100)
    asset_description = models.CharField(max_length=100)
    asset_type = models.ForeignKey(
        "app.AssetType", related_name="asset", on_delete=models.PROTECT
    )
    account_status = models.IntegerField(default=1)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="asset", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.account_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.account_number == None:
            self.account_number = "000" + str(self.id)
            # You need to call save two times since the id value is not accessible at creation
            super().save()


class OwnersEquity(models.Model):
    id = models.BigAutoField(primary_key=True)
    account_number = models.CharField(
        blank=True, null=True, max_length=100, editable=False, unique=True
    )
    control_number = models.CharField(max_length=100)
    account_name = models.CharField(max_length=100)
    purok_street = models.CharField(max_length=100)
    barangay = models.ForeignKey(
        "app.Barangay", related_name="owners_equity", on_delete=models.PROTECT
    )
    municipality = models.ForeignKey(
        "app.Municipality", related_name="owners_equity", on_delete=models.PROTECT
    )
    province = models.ForeignKey(
        "app.Province", related_name="owners_equity", on_delete=models.PROTECT
    )
    account_status = models.IntegerField(default=1)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="owners_equity", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.account_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.account_number == None:
            self.account_number = "000" + str(self.id)
            # You need to call save two times since the id value is not accessible at creation
            super().save()


class AssetType(models.Model):
    asset_type = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="asset_type", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.asset_type


class Barangay(models.Model):
    barangay = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="barangay", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.barangay


class Municipality(models.Model):
    municipality = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="municipality", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.municipality


class Province(models.Model):
    province = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="province", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.province


class Ledger(models.Model):
    id = models.BigAutoField(primary_key=True)
    invoice_number = models.CharField(max_length=100)
    term = models.IntegerField()
    particulars = models.CharField(max_length=100)
    debit = models.CharField(default=0, max_length=100)
    credit = models.CharField(
        default=0,
        max_length=100,
    )
    control_number = models.CharField(max_length=100)
    asset = models.ForeignKey(
        "app.Asset", related_name="ledger", on_delete=models.PROTECT
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="ledger", on_delete=models.PROTECT
    )
    trans_number = models.CharField(
        blank=True, null=True, max_length=100, editable=False, unique=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.trans_number == None:
            self.trans_number = str(self.id)
            # You need to call save two times since the id value is not accessible at creation
            super().save()


class DepreciationLedger(models.Model):
    id = models.BigAutoField(primary_key=True)
    invoice_number = models.CharField(max_length=100)
    term = models.IntegerField()
    particulars = models.CharField(max_length=100)
    debit = models.CharField(default=0, max_length=100)
    credit = models.CharField(
        default=0,
        max_length=100,
    )
    control_number = models.CharField(max_length=100)
    depreciation_date = models.CharField(max_length=100)
    asset = models.ForeignKey(
        "app.Asset", related_name="depreciation_ledger", on_delete=models.PROTECT
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="depreciation_ledger",
        on_delete=models.PROTECT,
    )
    trans_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number
