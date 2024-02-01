from receivables.models import Ledger
from receivables.serializers import LedgerViewSerializer, LedgerWriteSerializer
from balance.models import Balance
from balance.serializers import BalanceViewSerializer, BalanceWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from datetime import datetime


class LedgerList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_balance(self, module_id, type):
        try:
            return Balance.objects.get(module_id=module_id, type=type)
        except Balance.DoesNotExist:
            return "No data"

    def update_balance(self, ledger_data):
        balance = self.get_balance(ledger_data["receivables"], "Receivables")

        if balance == "No data":
            balance_amount = (
                float(ledger_data["debit"])
                if ledger_data["debit"] != 0
                else float(ledger_data["credit"]) * -1
            )

            data = {
                "type": "Receivables",
                "module_id": ledger_data["receivables"],
                "balance": balance_amount,
                "user": ledger_data["user"],
                "updated_at": datetime.today().strftime("%m/%d/%Y %H:%M:%S"),
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
                "updated_at": datetime.today().strftime("%m/%d/%Y %H:%M:%S"),
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
            else:
                return Response(balance_update)
            return Response(ledger_serializer.data, status=status.HTTP_201_CREATED)

        return Response(ledger_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LedgerDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, receivables):
        try:
            return Ledger.objects.filter(receivables_id=receivables)
        except Ledger.DoesNotExist:
            raise Http404

    def get(self, request, receivables, format=None):
        ledger = self.get_object(receivables)
        serializer = LedgerViewSerializer(ledger, many=True)
        array = []
        count = 0
        for item in serializer.data:
            obj = item
            if count == 0:
                obj["balance"] = float(obj["debit"]) - float(obj["credit"])
            else:
                if obj["debit"] != "0":
                    obj["balance"] = float(array[count - 1]["balance"]) + float(
                        obj["debit"]
                    )
                if obj["credit"] != "0":
                    obj["balance"] = float(array[count - 1]["balance"]) - float(
                        obj["credit"]
                    )
            array.append(obj)
            count = count + 1
        return Response(array)
