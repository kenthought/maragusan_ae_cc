from components.models import Company
from components.serializers import CompanyViewSerializer, CompanyWriteSerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class CompanyList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        company = Company.objects.all()
        serializer = CompanyViewSerializer(company, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CompanyWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk_ids):
        ids = [int(pk) for pk in pk_ids.split(",")]
        for i in ids:
            get_object_or_404(Company, pk=i).delete()
        company = Company.objects.all()
        serializer = CompanyWriteSerializer(company, many=True)
        return Response(serializer.data)


class CompanyDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Company.objects.get(pk=pk)
        except Company.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        company = self.get_object(pk)
        serializer = CompanyViewSerializer(company)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        company = self.get_object(pk)
        serializer = CompanyWriteSerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        company = self.get_object(pk)
        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
