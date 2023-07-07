from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from app.views.account_views import *
from app.views.asset_type_views import *
from app.views.asset_views import *
from app.views.ledger_views import *

urlpatterns = [
    path("account/", AccountsList.as_view()),
    path("account/<int:pk>/", AccountsDetail.as_view()),
    path("asset/", AssetList.as_view()),
    path("asset/<int:pk>/", AssetDetail.as_view()),
    path("asset_type/", AssetTypeList.as_view()),
    path("asset_type/<int:pk>/", AssetTypeDetail.as_view()),
    path("asset_type/<str:pk_ids>/", AssetTypeList.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:asset>/", LedgerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
