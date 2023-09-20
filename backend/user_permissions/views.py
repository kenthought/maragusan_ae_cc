from .models import UserPermissions
from .serializers import UserPermissionsSerializer
from django.http import Http404
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


# Create your views here.
class UserPermissions(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return UserPermissions.objects.get(pk=pk)
        except UserPermissions.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        user_permissions = self.get_object(pk)
        serializer = UserPermissionsSerializer(user_permissions)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        user_permissions = self.get_object(pk)
        serializer = UserPermissionsSerializer(user_permissions, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user_permissions = self.get_object(pk)
        user_permissions.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
