from components.models import Barangay
from components.serializers import BarangaySerializer, BarangayViewSerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class BarangayList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        barangay = Barangay.objects.all()
        serializer = BarangayViewSerializer(barangay, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BarangaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk_ids):
        ids = [int(pk) for pk in pk_ids.split(",")]
        for i in ids:
            get_object_or_404(Barangay, pk=i).delete()
        barangay = Barangay.objects.all()
        serializer = BarangaySerializer(barangay, many=True)
        return Response(serializer.data)


class BarangayDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Barangay.objects.get(pk=pk)
        except Barangay.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        barangay = self.get_object(pk)
        serializer = BarangayViewSerializer(barangay)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        barangay = self.get_object(pk)
        serializer = BarangaySerializer(barangay, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        barangay = self.get_object(pk)
        barangay.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
