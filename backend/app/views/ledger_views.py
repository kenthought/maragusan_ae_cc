from app.models import Ledger
from app.serializers import LedgerViewSerializer, LedgerWriteSerializer
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
        serializer = LedgerWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LedgerDetail(APIView):
    permissions_clases = [permissions.IsAuthenticated]

    def get_object(self, asset):
        try:
            return Ledger.objects.filter(asset_id=asset)
        except Ledger.DoesNotExist:
            raise Http404

    def get(self, request, asset, format=None):
        ledger = self.get_object(asset)
        serializer = LedgerViewSerializer(ledger, many=True)
        array = []
        count = 0
        for item in serializer.data:
            obj = item
            if count == 0:
                # setattr(obj, "balance", int(obj["debit"]) - int(obj["credit"]))
                obj["balance"] = int(obj["debit"]) - int(obj["credit"])
            else:
                if obj["debit"] != "0":
                    # setattr(
                    #     obj,
                    #     "balance",
                    #     int(array[count - 1]["balance"]) + int(obj["debit"]),
                    # )
                    obj["balance"] = int(array[count - 1]["balance"]) + int(
                        obj["debit"]
                    )
                if obj["credit"] != "0":
                    # setattr(
                    #     obj,
                    #     "balance",
                    #     int(array[count - 1]["balance"]) - int(obj["credit"]),
                    # )
                    obj["balance"] = int(array[count - 1]["balance"]) - int(
                        obj["credit"]
                    )
            print(obj["balance"])
            array.append(obj)
            count = count + 1
        return Response(array)
