from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *

urlpatterns = [
    path("", UserPermission.as_view()),
    path("<int:user_id>/", UserPermission.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
