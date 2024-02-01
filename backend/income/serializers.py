from rest_framework import serializers
from .models import Income, Ledger
from users.serializers import UserSerializer


class IncomeViewSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Income
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "description",
            "account_status",
            "user",
            "under_approval",
            "created_at",
        ]


class IncomeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "description",
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
            "income",
            "user",
            "created_at",
        ]


class LedgerViewSerializer(serializers.ModelSerializer):
    income = IncomeViewSerializer()
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
            "income",
            "user",
            "created_at",
        ]