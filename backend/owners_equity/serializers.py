from rest_framework import serializers
from .models import OwnersEquity, Ledger
from components.serializers import (
    BarangayViewSerializer,
    MunicipalityViewSerializer,
    ProvinceSerializer,
)
from users.serializers import UserSerializer


class OwnersEquityViewSerializer(serializers.ModelSerializer):
    barangay = BarangayViewSerializer()
    municipality = MunicipalityViewSerializer()
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
            "under_approval",
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
            "owners_equity",
            "user",
            "created_at",
        ]


class LedgerViewSerializer(serializers.ModelSerializer):
    owners_equity = OwnersEquityViewSerializer()
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
            "owners_equity",
            "user",
            "created_at",
        ]
