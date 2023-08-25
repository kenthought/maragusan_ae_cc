from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from approvals.views import *

urlpatterns = [
    path("", ApprovalList.as_view()),
    path("<int:pk>/", ApprovalDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
