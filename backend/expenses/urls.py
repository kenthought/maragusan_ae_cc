from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from expenses.views.expenses_views import *
from expenses.views.ledger_views import *

# from owners_equity.views.ledger_views import *

urlpatterns = [
    path("", ExpensesList.as_view()),
    path("<int:pk>/", ExpensesDetail.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:expenses>/", LedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
