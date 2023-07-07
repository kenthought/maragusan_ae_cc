from app.models import Asset
from app.serializers import AssetViewSerializer, AssetWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class AssetList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        asset = Asset.objects.all()
        serializer = AssetViewSerializer(asset, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = AssetWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssetDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Asset.objects.get(pk=pk)
        except Asset.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        asset = self.get_object(pk)
        serializer = AssetViewSerializer(asset)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        asset = self.get_object(pk)
        serializer = AssetWriteSerializer(asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        asset = self.get_object(pk)
        asset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
