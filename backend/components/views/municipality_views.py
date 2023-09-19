from components.models import Municipality
from components.serializers import MunicipalitySerializer, MunicipalityViewSerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class MunicipalityList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        municipality = Municipality.objects.all()
        serializer = MunicipalityViewSerializer(municipality, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MunicipalitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk_ids):
        ids = [int(pk) for pk in pk_ids.split(",")]
        for i in ids:
            get_object_or_404(Municipality, pk=i).delete()
        municipality = Municipality.objects.all()
        serializer = MunicipalitySerializer(municipality, many=True)
        return Response(serializer.data)


class MunicipalityDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Municipality.objects.get(pk=pk)
        except Municipality.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        municipality = self.get_object(pk)
        serializer = MunicipalityViewSerializer(municipality)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        municipality = self.get_object(pk)
        serializer = MunicipalitySerializer(municipality, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        municipality = self.get_object(pk)
        municipality.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
