from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from app.views.account_views import *
from app.views.asset_type_views import *
from app.views.barangay_views import *
from app.views.municipality_views import *
from app.views.province_views import *
from app.views.asset_views import *
from app.views.ledger_views import *
from app.views.depreciation_ledger_views import *
from app.views.owners_equity_views import *

urlpatterns = [
    path("account/", AccountsList.as_view()),
    path("account/<int:pk>/", AccountsDetail.as_view()),
    path("asset/", AssetList.as_view()),
    path("asset/<int:pk>/", AssetDetail.as_view()),
    path("asset_type/", AssetTypeList.as_view()),
    path("asset_type/<int:pk>/", AssetTypeDetail.as_view()),
    path("asset_type/<str:pk_ids>/", AssetTypeList.as_view()),
    path("barangay/", BarangayList.as_view()),
    path("barangay/<int:pk>/", BarangayDetail.as_view()),
    path("barangay/<str:pk_ids>/", BarangayList.as_view()),
    path("municipality/", MunicipalityList.as_view()),
    path("municipality/<int:pk>/", MunicipalityDetail.as_view()),
    path("municipality/<str:pk_ids>/", MunicipalityList.as_view()),
    path("province/", ProvinceList.as_view()),
    path("province/<int:pk>/", ProvinceDetail.as_view()),
    path("province/<str:pk_ids>/", ProvinceList.as_view()),
    path("ledger/", LedgerList.as_view()),
    path("ledger/<int:asset>/", LedgerDetail.as_view()),
    path("depreciation_ledger/<int:asset>/", DepreciationLedgerDetail.as_view()),
    path("owners_equity/", OwnersEquityList.as_view()),
    path("owners_equity/<int:pk>/", OwnersEquityDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
