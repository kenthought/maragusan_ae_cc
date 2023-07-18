from rest_framework import serializers
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
from users.serializers import UserSerializer


class AccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id", "name", "user"]


class AssetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetType
        fields = ["id", "asset_type", "user"]


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


class AssetViewSerializer(serializers.ModelSerializer):
    asset_type = AssetTypeSerializer()
    user = UserSerializer()

    class Meta:
        model = Asset
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "asset_description",
            "asset_type",
            "account_status",
            "user",
            "created_at",
        ]


class AssetWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "asset_description",
            "asset_type",
            "account_status",
            "user",
            "created_at",
        ]


class LedgerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ledger
        fields = [
            "id",
            "invoice_number",
            "term",
            "particulars",
            "debit",
            "credit",
            "control_number",
            "asset",
            "user",
            "created_at",
        ]


class LedgerViewSerializer(serializers.ModelSerializer):
    asset = AssetViewSerializer()
    user = UserSerializer()

    class Meta:
        model = Ledger
        fields = [
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
            "created_at",
        ]


class DepreciationLedgerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepreciationLedger
        fields = [
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
        ]


class DepreciationLedgerViewSerializer(serializers.ModelSerializer):
    asset = AssetViewSerializer()
    user = UserSerializer()

    class Meta:
        model = DepreciationLedger
        fields = [
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
        ]


class OwnersEquityViewSerializer(serializers.ModelSerializer):
    barangay = BarangaySerializer()
    municipality = MunicipalitySerializer()
    province = ProvinceSerializer()
    user = UserSerializer()

    class Meta:
        model = OwnersEquity
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "purok_street",
            "barangay",
            "municipality",
            "province",
            "account_status",
            "user",
            "created_at",
        ]


class OwnersEquityWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnersEquity
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "purok_street",
            "barangay",
            "municipality",
            "province",
            "account_status",
            "user",
            "created_at",
        ]
