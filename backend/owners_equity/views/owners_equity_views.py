from owners_equity.models import OwnersEquity
from owners_equity.serializers import (
    OwnersEquityViewSerializer,
    OwnersEquityWriteSerializer,
)
from ledger.serializers import LedgerCodeSerializer
from approvals.serializers import ApprovalWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
import inspect


# Create your views here.
class OwnersEquityList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def add_for_approval(self, data):
        try:
            approval_serializer = ApprovalWriteSerializer(data=data)
            if approval_serializer.is_valid():
                approval_serializer.save()
        except:
            raise Http404

    def format_account_number(self, id, account_number, user):
        try:
            # Create ledger code
            ledger_code = {"ledger": "Owner's Equity", "module_id": id}
            ledger_serializer = LedgerCodeSerializer(data=ledger_code)
            if ledger_serializer.is_valid():
                ledger_serializer.save()
                # Update account number
                data = {
                    "account_number": user.business_code
                    + "-"
                    + user.branch_code
                    + "-"
                    + ledger_serializer.data["code"]
                    + "-"
                    + account_number
                }
                owners_equity = OwnersEquity.objects.get(pk=id)
                owners_equity_serializer = OwnersEquityWriteSerializer(
                    owners_equity, data=data, partial=True
                )
                if owners_equity_serializer.is_valid():
                    owners_equity_serializer.save()
                    return owners_equity_serializer.data

            else:
                return Response(
                    ledger_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            raise Http404

    def get(self, request, format=None):
        owners_equity = OwnersEquity.objects.all()
        serializer = OwnersEquityViewSerializer(owners_equity, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = OwnersEquityWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Call format_account_number function
            format_account_number = self.format_account_number(
                serializer.data["id"], serializer.data["account_number"], request.user
            )

            for_approval = request.data["forApproval"]
            for_approval["module_id"] = serializer.data["id"]
            for_approval["account_number"] = format_account_number["account_number"]

            # Call add_for_approval function
            add_for_approval = self.add_for_approval(for_approval)

            if add_for_approval != "Success":
                return Response(add_for_approval)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OwnersEquityDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return OwnersEquity.objects.get(pk=pk)
        except OwnersEquity.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        owners_equity = self.get_object(pk)
        serializer = OwnersEquityViewSerializer(owners_equity)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        owners_equity = self.get_object(pk)
        serializer = OwnersEquityWriteSerializer(owners_equity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        owners_equity = self.get_object(pk)
        owners_equity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
