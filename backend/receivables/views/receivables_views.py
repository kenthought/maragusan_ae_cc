from receivables.models import Receivables
from receivables.serializers import (
    ReceivablesViewSerializer,
    ReceivablesWriteSerializer,
)
from ledger.serializers import LedgerCodeSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class ReceivablesList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def format_account_number(self, id, account_number, user):
        try:
            # Create ledger code
            ledger_code = {"ledger": "Receivables", "module_id": id}
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
                receivables = Receivables.objects.get(pk=id)
                receivables_serializer = ReceivablesWriteSerializer(receivables, data=data, partial=True)
                if receivables_serializer.is_valid():
                    receivables_serializer.save()
                    return receivables_serializer.data

            else:
                return Response(
                    ledger_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            raise Http404

    def get(self, request, format=None):
        receivables = Receivables.objects.all()
        serializer = ReceivablesViewSerializer(receivables, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ReceivablesWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Call format_account_number function
            format_account_number = self.format_account_number(
                serializer.data["id"], serializer.data["account_number"], request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReceivablesDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Receivables.objects.get(pk=pk)
        except Receivables.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        receivables = self.get_object(pk)
        serializer = ReceivablesViewSerializer(receivables)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        receivables = self.get_object(pk)
        serializer = ReceivablesWriteSerializer(receivables, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        receivables = self.get_object(pk)
        receivables.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
