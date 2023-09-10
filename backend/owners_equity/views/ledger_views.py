from owners_equity.models import Ledger
from owners_equity.serializers import LedgerViewSerializer, LedgerWriteSerializer
from balance.models import Balance
from balance.serializers import BalanceViewSerializer, BalanceWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from datetime import date
import json
from django.core.serializers.json import DjangoJSONEncoder


class LedgerList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_balance(self, module_id, type):
        try:
            return Balance.objects.get(module_id=module_id, type=type)
        except Balance.DoesNotExist:
            return "No data"

    def update_balance(self, ledger_data):
        balance = self.get_balance(ledger_data["owners_equity"], "Owner's Equity")

        if balance == "No data":
            balance_amount = (
                int(ledger_data["debit"])
                if ledger_data["debit"] != 0
                else int(ledger_data["credit"]) * -1
            )

            data = {
                "type": "Owner's Equity",
                "module_id": ledger_data["owners_equity"],
                "balance": balance_amount,
                "user": ledger_data["user"],
                "updated_at": date.today().strftime("%m/%d/%Y %H:%M:%S"),
            }

            balance_serializer = BalanceWriteSerializer(data=data)

            if balance_serializer.is_valid():
                balance_serializer.save()
                return "Balance updated"

            return Response(
                balance_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            balance_view_serializer = BalanceViewSerializer(balance)
            balance_amount = (
                balance_view_serializer.data["balance"] + ledger_data["debit"]
                if ledger_data["debit"] != 0
                else balance_view_serializer.data["balance"] - ledger_data["credit"]
            )
            data = {
                "balance": balance_amount,
                "user": ledger_data["user"],
                "updated_at": date.today().strftime("%m/%d/%Y %H:%M:%S"),
            }
            balance_write_serializer = BalanceWriteSerializer(
                balance, data=data, partial=True
            )

            if balance_write_serializer.is_valid():
                balance_write_serializer.save()
                return "Balance updated"

            return Response(
                balance_write_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

    # REST
    def get(self, request, format=None):
        ledger = Ledger.objects.all()
        serializer = LedgerViewSerializer(ledger, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        ledger_serializer = LedgerWriteSerializer(data=request.data)
        if ledger_serializer.is_valid():
            balance_update = self.update_balance(request.data)
            if balance_update == "Balance updated":
                ledger_serializer.save()
                return Response(ledger_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(balance_update)
        return Response(ledger_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LedgerDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, owners_equity):
        try:
            return Ledger.objects.filter(owners_equity_id=owners_equity)
        except Ledger.DoesNotExist:
            raise Http404

    def get(self, request, owners_equity, format=None):
        ledger = self.get_object(owners_equity)
        serializer = LedgerViewSerializer(ledger, many=True)
        array = []
        count = 0
        for item in serializer.data:
            obj = item
            if count == 0:
                obj["balance"] = int(obj["debit"]) - int(obj["credit"])
            else:
                if obj["debit"] != "0":
                    obj["balance"] = int(array[count - 1]["balance"]) + int(
                        obj["debit"]
                    )
                if obj["credit"] != "0":
                    obj["balance"] = int(array[count - 1]["balance"]) - int(
                        obj["credit"]
                    )
            array.append(obj)
            count = count + 1
        return Response(array)
