from payables.models import Contacts
from payables.serializers import ContactsSerializer
from django.http import Http404
from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class ContactsList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        contacts = Contacts.objects.all()
        serializer = ContactsSerializer(contacts, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ContactsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk_ids):
        ids = [int(pk) for pk in pk_ids.split(",")]
        for i in ids:
            get_object_or_404(Contacts, pk=i).delete()
        contacts = Contacts.objects.all()
        serializer = ContactsSerializer(contacts, many=True)
        return Response(serializer.data)


class ContactsDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Contacts.objects.get(pk=pk)
        except Contacts.DoesNotExist:
            raise Http404

    def get_contacts(self, payables):
        try:
            return Contacts.objects.filter(payables_id=payables)
        except Contacts.DoesNotExist:
            raise Http404

    def get(self, request, payables, format=None):
        contacts = self.get_contacts(payables)
        serializer = ContactsSerializer(contacts, many=True)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        contacts = self.get_object(pk)
        serializer = ContactsSerializer(contacts, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        contacts = self.get_object(pk)
        contacts.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
