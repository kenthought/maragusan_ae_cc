from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from balance.views import *

urlpatterns = [
    path("<str:type>/", BalanceDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
