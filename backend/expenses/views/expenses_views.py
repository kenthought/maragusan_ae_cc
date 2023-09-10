from expenses.models import Expenses
from expenses.serializers import ExpensesViewSerializer, ExpensesWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class ExpensesList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        expenses = Expenses.objects.all()
        serializer = ExpensesViewSerializer(expenses, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ExpensesWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpensesDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Expenses.objects.get(pk=pk)
        except Expenses.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        expenses = self.get_object(pk)
        serializer = ExpensesViewSerializer(expenses)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        expenses = self.get_object(pk)
        serializer = ExpensesWriteSerializer(expenses, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        expenses = self.get_object(pk)
        expenses.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
