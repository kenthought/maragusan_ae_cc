from rest_framework import serializers
from .models import (
    AssetType,
    Bank,
    Barangay,
    Municipality,
    Province,
    ExpensesCategory,
    Supplier,
    Schedule,
    Frequency,
    Company,
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
class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ["id", "province", "user"]


class MunicipalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipality
        fields = ["id", "municipality", "province", "user"]


class MunicipalityViewSerializer(serializers.ModelSerializer):
    province = ProvinceSerializer()

    class Meta:
        model = Municipality
        fields = ["id", "municipality", "province", "user"]


class BarangaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Barangay
        fields = ["id", "barangay", "municipality", "province", "user"]


class BarangayViewSerializer(serializers.ModelSerializer):
    municipality = MunicipalityViewSerializer()

    class Meta:
        model = Barangay
        fields = ["id", "barangay", "municipality", "province", "user"]


class ExpensesCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpensesCategory
        fields = ["id", "expenses_category", "user"]


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ["id", "supplier", "tin", "address", "user"]


class FrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Frequency
        fields = ["id", "frequency", "user"]


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ["id", "schedule", "user"]


class CompanyWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "company", "address", "frequency", "schedule", "user"]


class CompanyViewSerializer(serializers.ModelSerializer):
    frequency = FrequencySerializer()
    schedule = ScheduleSerializer()

    class Meta:
        model = Company
        fields = ["id", "company", "address", "frequency", "schedule", "user"]
