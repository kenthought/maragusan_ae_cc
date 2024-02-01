from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from receivables.views.receivables_views import *
from receivables.views.ledger_views import *

urlpatterns = [
    path("", ReceivablesList.as_view()),
    path("<int:pk>/", ReceivablesDetail.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:receivables>/", LedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
