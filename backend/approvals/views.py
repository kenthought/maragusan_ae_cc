from django.shortcuts import render
from approvals.models import Approval
from approvals.serializers import (
    ApprovalViewSerializer,
    ApprovalWriteSerializer,
)
from owners_equity.models import OwnersEquity
from owners_equity.serializers import OwnersEquityWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class ApprovalList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        approval = Approval.objects.exclude(approved_by__isnull=False)
        serializer = ApprovalViewSerializer(approval, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ApprovalWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApprovalDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Approval.objects.get(pk=pk)
        except Approval.DoesNotExist:
            raise Http404

    def get_owners_equity(self, pk):
        try:
            return OwnersEquity.objects.get(pk=pk)
        except OwnersEquity.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        approval = self.get_object(pk)
        serializer = ApprovalViewSerializer(approval)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        approval = self.get_object(pk)
        owners_equity = self.get_owners_equity(request.data["module_id"])
        data = {
            "approved_by": request.data["approved_by"],
        }
        approval_serializer = ApprovalWriteSerializer(approval, data=data, partial=True)
        owners_equity_serializer = OwnersEquityWriteSerializer(
            owners_equity, data=request.data["data"]
        )

        if owners_equity_serializer.is_valid():
            owners_equity_serializer.save()
        else:
            return Response(
                owners_equity_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        if approval_serializer.is_valid():
            approval_serializer.save()
            return Response(approval_serializer.data)
        else:
            return Response(
                approval_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, pk, format=None):
        approval = self.get_object(pk)
        approval.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
