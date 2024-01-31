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
class Province(models.Model):
    province = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="province", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.province


class Municipality(models.Model):
    municipality = models.CharField(max_length=100, unique=True)
    province = models.ForeignKey(
        Province, related_name="municipality", on_delete=models.PROTECT
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="municipality", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.municipality


class Barangay(models.Model):
    barangay = models.CharField(max_length=100)
    municipality = models.ForeignKey(
        Municipality, related_name="barangay", on_delete=models.PROTECT
    )
    province = models.ForeignKey(
        Province, related_name="barangay", on_delete=models.PROTECT
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="barangay", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.barangay


class ExpensesCategory(models.Model):
    expenses_category = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="expenses_category",
        on_delete=models.PROTECT,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.expenses_category


class Supplier(models.Model):
    supplier = models.CharField(max_length=100, unique=True)
    tin = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="supplier",
        on_delete=models.PROTECT,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.expenses_category


class Frequency(models.Model):
    frequency = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="frequency", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.frequency


class Schedule(models.Model):
    schedule = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="schedule", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.schedule


class Company(models.Model):
    company = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=100)
    frequency = models.ForeignKey(
        Frequency, related_name="company", on_delete=models.PROTECT
    )
    schedule = models.ForeignKey(
        Schedule, related_name="company", on_delete=models.PROTECT
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="company",
        on_delete=models.PROTECT,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company
