from payables.models import Payables, Contacts
from payables.serializers import (
    PayablesViewSerializer,
    PayablesWriteSerializer,
    ContactsSerializer,
)
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class PayablesList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        payables = Payables.objects.all()
        serializer = PayablesViewSerializer(payables, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PayablesWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PayablesDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Payables.objects.get(pk=pk)
        except Payables.DoesNotExist:
            raise Http404

    def get_contacts(self, pk):
        try:
            return Contacts.objects.filter(payables_id=pk)
        except Contacts.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        payables = self.get_object(pk)
        contacts = self.get_contacts(pk)
        payables_serializer = PayablesViewSerializer(payables)
        contacts_serializer = ContactsSerializer(contacts, many=True)
        data = payables_serializer.data
        data["contacts"] = contacts_serializer.data

        return Response(data)

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
