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
from datetime import datetime


# Create your views here.
class ApprovalList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def update_data(self, approval_type, type, pk):
        if type == "Owner's Equity":
            try:
                data = {
                    "under_approval": True,
                }
                owners_equity = OwnersEquity.objects.get(pk=pk)
                owners_equity_serializer = OwnersEquityWriteSerializer(
                    owners_equity, data=data, partial=True
                )

                if owners_equity_serializer.is_valid():
                    owners_equity_serializer.save()
                else:
                    return Response(
                        owners_equity_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except OwnersEquity.DoesNotExist:
                raise Http404
        else:
            raise Http404

    def get(self, request, format=None):
        approval = Approval.objects.order_by("-created_at").exclude(
            approved_by__isnull=False
        )
        serializer = ApprovalViewSerializer(approval, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        self.update_data(
            request.data["approval_type"],
            request.data["type"],
            request.data["module_id"],
        )
        approval_serializer = ApprovalWriteSerializer(data=request.data)
        if approval_serializer.is_valid():
            approval_serializer.save()
            return Response(approval_serializer.data, status=status.HTTP_201_CREATED)
        return Response(approval_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApprovedList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        approval = Approval.objects.order_by("-created_at").exclude(
            approved_by__isnull=True
        )
        serializer = ApprovalViewSerializer(approval, many=True)
        return Response(serializer.data)


class ApprovalDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Approval.objects.get(pk=pk)
        except Approval.DoesNotExist:
            raise Http404

    def update_data(self, data):
        if data["type"] == "Owner's Equity":
            try:
                if data["approval_type"] == "Add":
                    data["new_data"]["under_approval"] = 0
                owners_equity = OwnersEquity.objects.get(pk=data["module_id"])
                owners_equity_serializer = OwnersEquityWriteSerializer(
                    owners_equity, data=data["new_data"]
                )
                if owners_equity_serializer.is_valid():
                    owners_equity_serializer.save()
                else:
                    return Response(
                        owners_equity_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except OwnersEquity.DoesNotExist:
                raise Http404
        else:
            raise Http404

    def get(self, request, pk, format=None):
        approval = self.get_object(pk)
        serializer = ApprovalViewSerializer(approval)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        approval = self.get_object(pk)
        self.update_data(request.data)
        data = {
            "approved_by": request.data["approved_by"],
            "approved_date": datetime.today().strftime("%m/%d/%Y %H:%M:%S"),
        }
        approval_serializer = ApprovalWriteSerializer(approval, data=data, partial=True)

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
