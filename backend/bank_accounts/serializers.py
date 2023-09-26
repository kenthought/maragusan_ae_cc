from rest_framework import serializers
from .models import BankAccount, Ledger
from components.serializers import (
    BankSerializer,
    BarangaySerializer,
    MunicipalitySerializer,
    ProvinceSerializer,
)
from users.serializers import UserSerializer


class BankAccountViewSerializer(serializers.ModelSerializer):
    bank = BankSerializer()
    barangay = BarangaySerializer()
    municipality = MunicipalitySerializer()
    province = ProvinceSerializer()
    user = UserSerializer()

    class Meta:
        model = BankAccount
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "account_type",
            "bank",
            "bank_branch",
            "purok_street",
            "barangay",
            "municipality",
            "province",
            "account_status",
            "user",
            "created_at",
        ]


class BankAccountWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "account_type",
            "bank",
            "bank_branch",
            "purok_street",
            "barangay",
            "municipality",
            "province",
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
            "particulars",
            "debit",
            "credit",
            "control_number",
            "bank_account",
            "user",
            "created_at",
        ]


class LedgerViewSerializer(serializers.ModelSerializer):
    bank_account = BankAccountViewSerializer()
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
            "bank_account",
            "user",
            "created_at",
        ]
