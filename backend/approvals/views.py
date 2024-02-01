from django.shortcuts import render
from approvals.models import Approval
from approvals.serializers import (
    ApprovalViewSerializer,
    ApprovalWriteSerializer,
)
from owners_equity.models import OwnersEquity
from owners_equity.serializers import OwnersEquityWriteSerializer
from bank_accounts.models import BankAccount
from bank_accounts.serializers import BankAccountWriteSerializer
from expenses.models import Expenses
from expenses.serializers import ExpensesWriteSerializer
from assets.models import Asset
from assets.serializers import AssetWriteSerializer
from payables.models import Payables
from payables.serializers import PayablesWriteSerializer
from receivables.models import Receivables
from receivables.serializers import ReceivablesWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from datetime import datetime
from users.models import UserData


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
        elif type == "Bank Account":
            try:
                data = {
                    "under_approval": True,
                }
                bank_account = BankAccount.objects.get(pk=pk)
                bank_account_serializer = BankAccountWriteSerializer(
                    bank_account, data=data, partial=True
                )

                if bank_account_serializer.is_valid():
                    bank_account_serializer.save()
                else:
                    return Response(
                        bank_account_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except BankAccount.DoesNotExist:
                raise Http404
        elif type == "Expenses":
            try:
                data = {"under_approval": True}
                expenses = Expenses.objects.get(pk=pk)
                expenses_serializer = ExpensesWriteSerializer(
                    expenses, data=data, partial=True
                )

                if expenses_serializer.is_valid():
                    expenses_serializer.save()
                else:
                    return Response(
                        expenses_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except Expenses.DoesNotExist:
                raise Http404
        elif type == "Assets":
            try:
                data = {"under_approval": True}
                assets = Asset.objects.get(pk=pk)
                assets_serializer = AssetWriteSerializer(
                    assets, data=data, partial=True
                )

                if assets_serializer.is_valid():
                    assets_serializer.save()
                else:
                    return Response(
                        assets_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except Asset.DoesNotExist:
                raise Http404

        elif type == "Payables":
            try:
                data = {"under_approval": True}
                payables = Payables.objects.get(pk=pk)
                payables_serializer = PayablesWriteSerializer(
                    payables, data=data, partial=True
                )

                if payables_serializer.is_valid():
                    payables_serializer.save()
                else:
                    return Response(
                        payables_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            except Payables.DoesNotExist:
                raise Http404
        
        elif type == "Receivables":
            try:
                data = {"under_approval": True}
                receivables = Receivables.objects.get(pk=pk)
                receivables_serializer = ReceivablesWriteSerializer(
                    receivables, data=data, partial=True
                )

                if receivables_serializer.is_valid():
                    receivables_serializer.save()
                else:
                    return Response(
                        receivables_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Receivables.DoesNotExist:
                raise Http404

        else:
            raise Http404

    def get(self, request, format=None):
        approval = Approval.objects.order_by("-created_at").filter(
            state=Approval.UNDER_APPROVAL
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

class UserApprovalList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        approval = Approval.objects.order_by("-created_at").filter(
            submitted_by=request.user.id
        )
        serializer = ApprovalViewSerializer(approval, many=True)
        return Response(serializer.data)

class ApprovedList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        approval = Approval.objects.order_by("-created_at").filter(
            state=Approval.APPROVED
        )
        serializer = ApprovalViewSerializer(approval, many=True)
        return Response(serializer.data)


class DisapprovedList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        approval = Approval.objects.order_by("-created_at").filter(
            state=Approval.DISAPPROVED
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
                owners_equity = OwnersEquity.objects.get(pk=data["module_id"])
                if data["is_disapprove"] is False:
                    if data["approval_type"] == "Add":
                        data["new_data"]["under_approval"] = False
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
                else:
                    temp = {"under_approval": False}
                    if data["approval_type"] != "Add":
                        owners_equity_serializer = OwnersEquityWriteSerializer(owners_equity, data=temp, partial=True)
                        if owners_equity_serializer.is_valid():
                            owners_equity_serializer.save()
                        else:
                            return Response(
                                owners_equity_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        owners_equity.delete()

            except OwnersEquity.DoesNotExist:
                raise Http404

        elif data["type"] == "Bank Account":
            try:
                bank_account = BankAccount.objects.get(pk=data["module_id"])
                if data["is_disapprove"] is False:
                    if data["approval_type"] == "Add":
                        data["new_data"]["under_approval"] = False
                    bank_account_serializer = BankAccountWriteSerializer(
                        bank_account, data=data["new_data"]
                    )
                    if bank_account_serializer.is_valid():
                        bank_account_serializer.save()
                    else:
                        return Response(
                            bank_account_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    temp = {"under_approval": False}
                    if data["approval_type"] != "Add":
                        bank_account_serializer = BankAccountWriteSerializer(bank_account, data=temp, partial=True)
                        if bank_account_serializer.is_valid():
                            bank_account_serializer.save()
                        else:
                            return Response(
                                bank_account_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        bank_account.delete()

            except BankAccount.DoesNotExist:
                raise Http404

        elif data["type"] == "Expenses":
            try:
                expenses = Expenses.objects.get(pk=data["module_id"])
                if data["is_disapprove"] is False:
                    if data["approval_type"] == "Add":
                        data["new_data"]["under_approval"] = False
                    expenses_serializer = ExpensesWriteSerializer(
                        expenses, data=data["new_data"]
                    )
                    if expenses_serializer.is_valid():
                        expenses_serializer.save()
                    else:
                        return Response(
                            expenses_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    temp = {"under_approval": False}
                    if data["approval_type"] != "Add":
                        expenses_serializer = ExpensesWriteSerializer(expenses, data=temp, partial=True)
                        if expenses_serializer.is_valid():
                            expenses_serializer.save()
                        else:
                            return Response(
                                expenses_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        expenses.delete()

            except Expenses.DoesNotExist:
                raise Http404

        elif data["type"] == "Assets":
            try:
                assets = Asset.objects.get(pk=data["module_id"])
                if data["is_disapprove"] is False:
                    if data["approval_type"] == "Add":
                        data["new_data"]["under_approval"] = False
                    assets_serializer = AssetWriteSerializer(assets, data=data["new_data"])
                    if assets_serializer.is_valid():
                        assets_serializer.save()
                    else:
                        return Response(
                            assets_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    temp = {"under_approval": False}
                    if data["approval_type"] != "Add":
                        assets_serializer = AssetWriteSerializer(assets, data=temp, partial=True)
                        if assets_serializer.is_valid():
                            assets_serializer.save()
                        else:
                            return Response(
                                assets_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        assets.delete()

            except Asset.DoesNotExist:
                raise Http404
            
        elif data["type"] == "Payables":
            try:
                payables = Payables.objects.get(pk=data["module_id"])
                if data["is_disapprove"] is False:
                    if data["approval_type"] == "Add":
                        data["new_data"]["under_approval"] = False
                    payables_serializer = PayablesWriteSerializer(payables, data=data["new_data"])
                    if payables_serializer.is_valid():
                        payables_serializer.save()
                    else:
                        return Response(
                            payables_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    temp = {"under_approval": False}
                    if data["approval_type"] != "Add":
                        payables_serializer = PayablesWriteSerializer(payables, data=temp, partial=True)
                        if payables_serializer.is_valid():
                            payables_serializer.save()
                        else:
                            return Response(
                                payables_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        payables.delete()

            except Payables.DoesNotExist:
                raise Http404

        
        elif data["type"] == "Receivables":
            try:
                receivables = Receivables.objects.get(pk=data["module_id"])
                if data["is_disapprove"] is False:
                    if data["approval_type"] == "Add":
                        data["new_data"]["under_approval"] = False
                    receivables_serializer = ReceivablesWriteSerializer(receivables, data=data["new_data"])
                    if receivables_serializer.is_valid():
                        receivables_serializer.save()
                    else:
                        return Response(
                            receivables_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    temp = {"under_approval": False}
                    if data["approval_type"] != "Add":
                        receivables_serializer = ReceivablesWriteSerializer(receivables, data=temp, partial=True)
                        if receivables_serializer.is_valid():
                            receivables_serializer.save()
                        else:
                            return Response(
                                receivables_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        receivables.delete()
            
            except Receivables.DoesNotExist:
                raise Http404

        else:
            raise Http404

    def get(self, request, pk, format=None):
        approval = self.get_object(pk)
        serializer = ApprovalViewSerializer(approval)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        user = UserData.objects.get(username=request.user)

        if user.check_password(request.data["password"]):
            print("Correct password!")
            approval = self.get_object(pk)
            self.update_data(request.data)
            data = {
                "approver": request.data["approver"],
                "date_executed": datetime.today().strftime("%m/%d/%Y %H:%M:%S"),
                "state": Approval.DISAPPROVED if request.data["is_disapprove"] else Approval.APPROVED,
                "remarks": request.data["remarks"] if request.data["is_disapprove"] else None
            }
            approval_serializer = ApprovalWriteSerializer(
                approval, data=data, partial=True
            )

            if approval_serializer.is_valid():
                approval_serializer.save()
                return Response(approval_serializer.data)
            else:
                return Response(
                    approval_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response("Invalid Password!", status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        approval = self.get_object(pk)
        approval.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
