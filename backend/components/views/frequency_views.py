from components.models import Frequency
from components.serializers import FrequencySerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class FrequencyList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        frequency = Frequency.objects.all()
        serializer = FrequencySerializer(frequency, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = FrequencySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk_ids):
        ids = [int(pk) for pk in pk_ids.split(",")]
        for i in ids:
            get_object_or_404(Frequency, pk=i).delete()
        frequency = Frequency.objects.all()
        serializer = FrequencySerializer(frequency, many=True)
        return Response(serializer.data)


class FrequencyDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Frequency.objects.get(pk=pk)
        except Frequency.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        frequency = self.get_object(pk)
        serializer = FrequencySerializer(frequency)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        frequency = self.get_object(pk)
        serializer = FrequencySerializer(frequency, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        frequency = self.get_object(pk)
        frequency.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
