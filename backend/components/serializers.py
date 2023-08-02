from rest_framework import serializers
from .models import (
    AssetType,
    Bank,
    Barangay,
    Municipality,
    Province,
    ExpensesCategory,
    Supplier,
)
from users.serializers import UserSerializer


# Asset Type
class AssetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetType
        fields = ["id", "asset_type", "user"]


# Bank
class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ["id", "bank", "user"]


# Address
class BarangaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Barangay
        fields = ["id", "barangay", "user"]


class MunicipalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipality
        fields = ["id", "municipality", "user"]


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ["id", "province", "user"]


class ExpensesCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpensesCategory
        fields = ["id", "expenses_category", "user"]


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ["id", "supplier", "tin", "address", "user"]
