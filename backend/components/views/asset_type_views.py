from components.models import AssetType
from components.serializers import AssetTypeSerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class AssetTypeList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        asset_type = AssetType.objects.all()
        serializer = AssetTypeSerializer(asset_type, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = AssetTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk_ids):
        ids = [int(pk) for pk in pk_ids.split(",")]
        for i in ids:
            get_object_or_404(AssetType, pk=i).delete()
        asset_type = AssetType.objects.all()
        serializer = AssetTypeSerializer(asset_type, many=True)
        return Response(serializer.data)


class AssetTypeDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return AssetType.objects.get(pk=pk)
        except AssetType.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        asset_type = self.get_object(pk)
        serializer = AssetTypeSerializer(asset_type)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        asset_type = self.get_object(pk)
        serializer = AssetTypeSerializer(asset_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        asset_type = self.get_object(pk)
        asset_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
