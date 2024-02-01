from django.shortcuts import render
from balance.models import Balance
from balance.serializers import (
    BalanceViewSerializer,
    BalanceWriteSerializer,
)
from owners_equity.models import OwnersEquity
from owners_equity.serializers import OwnersEquityViewSerializer
from bank_accounts.models import BankAccount
from bank_accounts.serializers import BankAccountViewSerializer
from expenses.models import Expenses
from expenses.serializers import ExpensesViewSerializer
from assets.models import Asset
from assets.serializers import AssetViewSerializer
from receivables.models import Receivables
from receivables.serializers import ReceivablesViewSerializer
from payables.models import Payables
from payables.serializers import PayablesViewSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class BalanceList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        balance = Balance.objects.all()
        serializer = BalanceViewSerializer(balance, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BalanceWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BalanceDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, type):
        try:
            return Balance.objects.filter(type=type)
        except Balance.DoesNotExist:
            raise Http404

    def get(self, request, type, format=None):
        balance = self.get_object(type)
        serializer = BalanceViewSerializer(balance, many=True)
        array = []
        for item in serializer.data:
            obj = item
            module = ""

            if type == "Owner's Equity":
                owners_equity = OwnersEquity.objects.get(id=obj["module_id"])
                module = OwnersEquityViewSerializer(owners_equity)

            if type == "Bank Account":
                bank_account = BankAccount.objects.get(id=obj["module_id"])
                module = BankAccountViewSerializer(bank_account)

            if type == "Expenses":
                expenses = Expenses.objects.get(id=obj["module_id"])
                module = ExpensesViewSerializer(expenses)

            if type == "Asset":
                asset = Asset.objects.get(id=obj["module_id"])
                module = AssetViewSerializer(asset)

            if type == "Payables":
                payables = Payables.objects.get(id=obj["module_id"])
                module = PayablesViewSerializer(payables)

            if type == "Receivables":
                receivables = Receivables.objects.get(id=obj["module_id"])
                module = ReceivablesViewSerializer(receivables)

            obj["module"] = module.data
            array.append(obj)

        return Response(array)

    def put(self, request, pk, type, format=None):
        balance = self.get_object(pk, type)
        serializer = BalanceWriteSerializer(balance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, type, format=None):
        balance = self.get_object(pk, type)
        balance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
