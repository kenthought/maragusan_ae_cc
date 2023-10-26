from bank_accounts.models import BankAccount
from bank_accounts.serializers import (
    BankAccountViewSerializer,
    BankAccountWriteSerializer,
)
from ledger.serializers import LedgerCodeSerializer
from approvals.serializers import ApprovalWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class BankAccountList(APIView):
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
            ledger_code = {"ledger": "Bank Account", "module_id": id}
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
                bank_account = BankAccount.objects.get(pk=id)
                bank_account_serializer = BankAccountWriteSerializer(
                    bank_account, data=data, partial=True
                )
                if bank_account_serializer.is_valid():
                    bank_account_serializer.save()
                    return bank_account_serializer.data

            else:
                return Response(
                    ledger_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            raise Http404

    def get(self, request, format=None):
        bank_account = BankAccount.objects.all()
        serializer = BankAccountViewSerializer(bank_account, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BankAccountWriteSerializer(data=request.data)
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


class BankAccountDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return BankAccount.objects.get(pk=pk)
        except BankAccount.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        bank_account = self.get_object(pk)
        serializer = BankAccountViewSerializer(bank_account)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        bank_account = self.get_object(pk)
        serializer = BankAccountWriteSerializer(bank_account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        bank_account = self.get_object(pk)
        bank_account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
