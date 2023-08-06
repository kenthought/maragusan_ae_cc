from payables.models import Ledger
from payables.serializers import LedgerViewSerializer, LedgerWriteSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


class LedgerList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        ledger = Ledger.objects.all()
        serializer = LedgerViewSerializer(ledger, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        ledger_serializer = LedgerWriteSerializer(data=request.data)

        if ledger_serializer.is_valid():
            ledger_serializer.save()
            return Response(ledger_serializer.data, status=status.HTTP_201_CREATED)

        return Response(ledger_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LedgerDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, payables):
        try:
            return Ledger.objects.filter(payables_id=payables)
        except Ledger.DoesNotExist:
            raise Http404

    def get(self, request, payables, format=None):
        ledger = self.get_object(payables)
        serializer = LedgerViewSerializer(ledger, many=True)
        array = []
        count = 0
        for item in serializer.data:
            obj = item
            if count == 0:
                obj["balance"] = int(obj["debit"]) - int(obj["credit"])
            else:
                if obj["debit"] != "0":
                    obj["balance"] = int(array[count - 1]["balance"]) + int(
                        obj["debit"]
                    )
                if obj["credit"] != "0":
                    obj["balance"] = int(array[count - 1]["balance"]) - int(
                        obj["credit"]
                    )
            array.append(obj)
            count = count + 1
        return Response(array)
