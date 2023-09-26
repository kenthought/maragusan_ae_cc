from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from assets.views.asset_views import *
from assets.views.ledger_views import *
from assets.views.depreciation_ledger_views import *

urlpatterns = [
    path("", AssetList.as_view()),
    path("<int:pk>/", AssetDetail.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:asset>/", LedgerDetail.as_view()),
    path("depreciation_ledger/<int:asset>/", DepreciationLedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
