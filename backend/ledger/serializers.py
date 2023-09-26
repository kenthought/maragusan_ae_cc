from rest_framework import serializers
from .models import LedgerCode


class LedgerCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerCode
        fields = ["id", "ledger", "module_id", "code"]
