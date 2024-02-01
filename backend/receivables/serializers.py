from rest_framework import serializers
from .models import Receivables, Ledger
from components.serializers import (
    BarangayViewSerializer,
    BankSerializer,
    CompanyViewSerializer,
)
from users.serializers import UserSerializer


class ReceivablesViewSerializer(serializers.ModelSerializer):
    barangay = BarangayViewSerializer()
    bank = BankSerializer()
    company = CompanyViewSerializer()
    co_maker = UserSerializer()
    agent = UserSerializer()
    user = UserSerializer()

    class Meta:
        model = Receivables
        fields = [
            "id",
            "account_number",
            "control_number",
            "account_name",
            "spouse_name",
            "credit_terms",
            "credit_limit",
            "contact_number1",
            "contact_number2",
            "purok_street",
            "barangay",
            "account_category",
            "account_status",
            "co_maker",
            "agent",
            "company",
            "supervisor",
            "assignment",
            "date_hired",
            "company_id",
            "company_id_number",
            "work_contact_number",
            "employment_status",
            "bank_account_name",
            "bank_account_number",
            "bank",
            "bank_branch",
            "card_number",
            "card_pin",
            "send_to",
            "funds_registered_name",
            "funds_account_number",
            "user",
            "under_approval",
            "created_at",
        ]


class ReceivablesWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receivables
        fields = [
            "id",
            "account_number",
            "control_number",
            "account_name",
            "spouse_name",
            "credit_terms",
            "credit_limit",
            "contact_number1",
            "contact_number2",
            "purok_street",
            "barangay",
            "account_category",
            "account_status",
            "co_maker",
            "agent",
            "company",
            "supervisor",
            "assignment",
            "date_hired",
            "company_id",
            "company_id_number",
            "work_contact_number",
            "employment_status",
            "bank_account_name",
            "bank_account_number",
            "bank",
            "bank_branch",
            "card_number",
            "card_pin",
            "send_to",
            "funds_registered_name",
            "funds_account_number",
            "under_approval",
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
            "receivables",
            "user",
            "created_at",
        ]


class LedgerViewSerializer(serializers.ModelSerializer):
    receivables = ReceivablesViewSerializer()
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
            "receivables",
            "user",
            "created_at",
        ]
