from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from owners_equity.views.owners_equity_views import *
from owners_equity.views.ledger_views import *

urlpatterns = [
    path("", OwnersEquityList.as_view()),
    path("<int:pk>/", OwnersEquityDetail.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:owners_equity>/", LedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
