from components.models import Bank
from components.serializers import BankSerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class BankList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        bank = Bank.objects.all()
        serializer = BankSerializer(bank, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BankSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk_ids):
        ids = [int(pk) for pk in pk_ids.split(",")]
        for i in ids:
            get_object_or_404(Bank, pk=i).delete()
        bank = Bank.objects.all()
        serializer = BankSerializer(bank, many=True)
        return Response(serializer.data)


class BankDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Bank.objects.get(pk=pk)
        except Bank.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        bank = self.get_object(pk)
        serializer = BankSerializer(bank)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        bank = self.get_object(pk)
        serializer = BankSerializer(bank, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        bank = self.get_object(pk)
        bank.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
