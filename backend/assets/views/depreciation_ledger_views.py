from assets.models import DepreciationLedger
from assets.serializers import (
    DepreciationLedgerViewSerializer,
    DepreciationLedgerWriteSerializer,
)
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


class DepreciationLedgerList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        depreciation_ledger = DepreciationLedger.objects.all()
        serializer = DepreciationLedgerViewSerializer(depreciation_ledger, many=True)
        return Response(serializer.data)


class DepreciationLedgerDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, asset):
        try:
            return DepreciationLedger.objects.filter(asset_id=asset)
        except DepreciationLedger.DoesNotExist:
            raise Http404

    def get(self, request, asset, format=None):
        depreciation_ledger = self.get_object(asset)
        serializer = DepreciationLedgerViewSerializer(depreciation_ledger, many=True)
        return Response(serializer.data)
