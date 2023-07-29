from bank_accounts.models import BankAccount
from bank_accounts.serializers import (
    BankAccountViewSerializer,
    BankAccountWriteSerializer,
)
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class BankAccountList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        owners_equity = BankAccount.objects.all()
        serializer = BankAccountViewSerializer(owners_equity, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BankAccountWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
        owners_equity = self.get_object(pk)
        serializer = BankAccountViewSerializer(owners_equity)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        owners_equity = self.get_object(pk)
        serializer = BankAccountWriteSerializer(owners_equity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        owners_equity = self.get_object(pk)
        owners_equity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
