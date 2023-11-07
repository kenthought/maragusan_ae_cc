from rest_framework import serializers
from .models import Expenses, Ledger
from components.serializers import ExpensesCategorySerializer, SupplierSerializer
from users.serializers import UserSerializer


class ExpensesViewSerializer(serializers.ModelSerializer):
    expenses_category = ExpensesCategorySerializer()

    class Meta:
        model = Expenses
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "expenses_description",
            "expenses_category",
            "account_status",
            "user",
            "under_approval",
            "created_at",
        ]


class ExpensesWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = [
            "id",
            "account_number",
            "account_name",
            "control_number",
            "expenses_description",
            "expenses_category",
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
            "expenses",
            "receipt_type",
            "receipt_date",
            "supplier",
            "user",
            "created_at",
        ]


class LedgerViewSerializer(serializers.ModelSerializer):
    expenses = ExpensesViewSerializer()
    user = UserSerializer()
    supplier = SupplierSerializer()

    class Meta:
        model = Ledger
        fields = [
            "id",
            "invoice_number",
            "particulars",
            "debit",
            "credit",
            "control_number",
            "expenses",
            "trans_number",
            "receipt_type",
            "receipt_date",
            "supplier",
            "user",
            "created_at",
        ]
