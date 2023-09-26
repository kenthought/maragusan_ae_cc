from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from payables.views.payables_views import *
from payables.views.contacts_views import *
from payables.views.ledger_views import *

urlpatterns = [
    path("", PayablesList.as_view()),
    path("<int:pk>/", PayablesDetail.as_view()),
    path("contacts/", ContactsList.as_view()),
    path("get_contacts/<int:payables>/", ContactsDetail.as_view()),
    path("contacts/<int:pk>/", ContactsDetail.as_view()),
    path("contacts/<str:pk_ids>/", ContactsList.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:payables>/", LedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
