from rest_framework import serializers
from .models import (
    Asset,
    Ledger,
    DepreciationLedger,
)
from components.serializers import AssetTypeSerializer
from users.serializers import UserSerializer


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
            "under_approval",
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
            "under_approval",
            "created_at",
        ]


class LedgerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ledger
        fields = [
            "id",
            "invoice_number",
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
