from django.db import models
from django.conf import settings

# Create your models here.


# Asset Type
class AssetType(models.Model):
    asset_type = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="asset_type", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.asset_type


# Bank
class Bank(models.Model):
    bank = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="bank", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.bank


# Address
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
