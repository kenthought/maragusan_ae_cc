from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from assets.serializers import LedgerViewSerializer as AssetsLedgerViewSerializer
from assets.models import Ledger as AssetsLedger
from owners_equity.serializers import (
    LedgerViewSerializer as OwnersEquityLedgerViewSerializer,
)
from owners_equity.models import Ledger as OwnersEquityLedger
from bank_accounts.serializers import (
    LedgerViewSerializer as BankAccountLedgerViewSerializer,
)
from bank_accounts.models import Ledger as BankAccountLedger
from django.db import connection
from django.http import Http404
from django.shortcuts import get_object_or_404
import datetime


# call stored procedures
class DailyClosingToday(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_asset_ledger(self, user_id, year, month, date):
        try:
            # today = date.today()

            return AssetsLedger.objects.filter(
                user_id=user_id, created_at__contains=datetime.date(year, month, date)
            )

        except AssetsLedger.DoesNotExist:
            raise Http404

    def get_owners_equity_ledger(self, user_id, year, month, date):
        try:
            # today = date.today()

            return OwnersEquityLedger.objects.filter(
                user_id=user_id, created_at__contains=datetime.date(year, month, date)
            )

        except OwnersEquityLedger.DoesNotExist:
            raise Http404

    def get_bank_account_ledger(self, user_id, year, month, date):
        try:
            # today = date.today()

            return BankAccountLedger.objects.filter(
                user_id=user_id, created_at__contains=datetime.date(year, month, date)
            )

        except BankAccountLedger.DoesNotExist:
            raise Http404

    # def get(self, request, user_id, format=None):
    #     cursor = connection.cursor()
    #     cursor.callproc("get_dailyClosingToday", (user_id,))
    #     return Response(cursor.fetchall(), status=status.HTTP_201_CREATED)

    def get(self, request, user_id, year, month, date, format=None):
        daily_closing = []
        array = []
        count = 0

        # Asset
        asset_ledger = self.get_asset_ledger(user_id, year, month, date)
        asset_serializer = AssetsLedgerViewSerializer(asset_ledger, many=True)
        for item in asset_serializer.data:
            obj = item
            obj["account_name"] = item["asset"]["account_name"]
            obj["account_number"] = item["asset"]["account_number"]
            obj["ledger"] = "Asset"
            array.append(obj)

        # Owners Equity
        owners_equity_ledger = self.get_owners_equity_ledger(user_id, year, month, date)
        owners_equity_serializer = OwnersEquityLedgerViewSerializer(
            owners_equity_ledger, many=True
        )
        for item in owners_equity_serializer.data:
            obj = item
            obj["account_name"] = item["owners_equity"]["account_name"]
            obj["account_number"] = item["owners_equity"]["account_number"]
            obj["ledger"] = "Owners Equity"
            array.append(obj)

        # Bank Account
        bank_account_ledger = self.get_bank_account_ledger(user_id, year, month, date)
        bank_account_serializer = BankAccountLedgerViewSerializer(
            bank_account_ledger, many=True
        )
        for item in bank_account_serializer.data:
            obj = item
            obj["account_name"] = item["bank_account"]["account_name"]
            obj["account_number"] = item["bank_account"]["account_number"]
            obj["ledger"] = "Bank Account"
            array.append(obj)

        temp = sorted(array, key=lambda x: x["created_at"])

        # compute and do data presentment in ledgers.
        for item in temp:
            obj = item
            obj["cash_in"] = ""
            obj["cash_out"] = ""

            if obj["ledger"] == "Owners Equity":
                obj["cash_in"] = obj["debit"]
                obj["cash_out"] = obj["credit"]
            else:
                obj["cash_in"] = obj["credit"]
                obj["cash_out"] = obj["debit"]

            if count == 0:
                obj["balance"] = int(obj["cash_in"]) - int(obj["cash_out"])
            else:
                if obj["cash_in"] != "0":
                    obj["balance"] = int(temp[count - 1]["balance"]) + int(
                        obj["cash_in"]
                    )
                if obj["cash_out"] != "0":
                    obj["balance"] = int(temp[count - 1]["balance"]) - int(
                        obj["cash_out"]
                    )
            daily_closing.append(obj)
            count = count + 1

        return Response(daily_closing)