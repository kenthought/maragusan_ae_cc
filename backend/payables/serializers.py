from rest_framework import serializers
from .models import Payables, Contacts, Ledger
from components.serializers import (
    BarangaySerializer,
    MunicipalitySerializer,
    ProvinceSerializer,
)
from users.serializers import UserSerializer


class PayablesViewSerializer(serializers.ModelSerializer):
    barangay = BarangaySerializer()
    municipality = MunicipalitySerializer()
    province = ProvinceSerializer()
    user = UserSerializer()

    class Meta:
        model = Payables
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "account_type",
            "account_status",
            "payment_arrangement",
            "purok_street",
            "barangay",
            "municipality",
            "province",
            "term",
            "user",
            "created_at",
        ]


class ContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacts
        fields = ["id", "personnel", "contact_no", "designation", "payables", "user"]


class PayablesWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payables
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "account_type",
            "account_status",
            "payment_arrangement",
            "purok_street",
            "barangay",
            "municipality",
            "province",
            "term",
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
            "payables",
            "user",
            "created_at",
        ]


class LedgerViewSerializer(serializers.ModelSerializer):
    payables = PayablesViewSerializer()
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
            "payables",
            "user",
            "created_at",
        ]
