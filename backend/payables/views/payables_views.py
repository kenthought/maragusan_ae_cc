from payables.models import Payables, Contacts
from payables.serializers import (
    PayablesViewSerializer,
    PayablesWriteSerializer,
    ContactsSerializer,
)
from ledger.serializers import LedgerCodeSerializer
from approvals.serializers import ApprovalWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class PayablesList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def add_for_approval(self, data):
        try:
            approval_serializer = ApprovalWriteSerializer(data=data)
            if approval_serializer.is_valid():
                approval_serializer.save()
            return "Success"
        except:
            raise Http404

    def format_account_number(self, id, account_number, user):
        try:
            # Create ledger code
            ledger_code = {"ledger": "Payables", "module_id": id}
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
                payables = Payables.objects.get(pk=id)
                payables_serializer = PayablesWriteSerializer(payables, data=data, partial=True)
                if payables_serializer.is_valid():
                    payables_serializer.save()
                    return payables_serializer.data

            else:
                return Response(
                    ledger_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            raise Http404

    def get(self, request, format=None):
        payables = Payables.objects.all()
        serializer = PayablesViewSerializer(payables, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PayablesWriteSerializer(data=request.data)
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


class PayablesDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Payables.objects.get(pk=pk)
        except Payables.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        payables = self.get_object(pk)
        payables_serializer = PayablesViewSerializer(payables)
        return Response(payables_serializer.data)

    def put(self, request, pk, format=None):
        payables = self.get_object(pk)
        serializer = PayablesWriteSerializer(payables, data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        payables = self.get_object(pk)
        payables.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
