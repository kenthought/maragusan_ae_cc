from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from income.views.income_views import *
from income.views.ledger_views import *

# from owners_equity.views.ledger_views import *

urlpatterns = [
    path("", IncomeList.as_view()),
    path("<int:pk>/", IncomeDetail.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:income>/", LedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
