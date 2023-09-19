from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from bank_accounts.views.bank_accounts_views import *
from bank_accounts.views.ledger_views import *

urlpatterns = [
    path("", BankAccountList.as_view()),
    path("<int:pk>/", BankAccountDetail.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:bank_account>/", LedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
