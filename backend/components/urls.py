from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from components.views.asset_type_views import *
from components.views.barangay_views import *
from components.views.municipality_views import *
from components.views.province_views import *
from components.views.bank_views import *
from components.views.expenses_category_views import *
from components.views.supplier_views import *
from components.views.schedule_view import *
from components.views.frequency_views import *
from components.views.company_views import *

urlpatterns = [
    path("asset_type/", AssetTypeList.as_view()),
    path("asset_type/<int:pk>/", AssetTypeDetail.as_view()),
    path("asset_type/<str:pk_ids>/", AssetTypeList.as_view()),
    path("bank/", BankList.as_view()),
    path("bank/<int:pk>/", BankDetail.as_view()),
    path("bank/<str:pk_ids>/", BankList.as_view()),
    path("barangay/", BarangayList.as_view()),
    path("barangay/<int:pk>/", BarangayDetail.as_view()),
    path("barangay/<str:pk_ids>/", BarangayList.as_view()),
    path("municipality/", MunicipalityList.as_view()),
    path("municipality/<int:pk>/", MunicipalityDetail.as_view()),
    path("municipality/<str:pk_ids>/", MunicipalityList.as_view()),
    path("province/", ProvinceList.as_view()),
    path("province/<int:pk>/", ProvinceDetail.as_view()),
    path("province/<str:pk_ids>/", ProvinceList.as_view()),
    path("expenses_category/", ExpensesCategoryList.as_view()),
    path("expenses_category/<int:pk>/", ExpensesCategoryDetail.as_view()),
    path("expenses_category/<str:pk_ids>/", ExpensesCategoryList.as_view()),
    path("supplier/", SupplierList.as_view()),
    path("supplier/<int:pk>/", SupplierDetail.as_view()),
    path("supplier/<str:pk_ids>/", SupplierList.as_view()),
    path("schedule/", ScheduleList.as_view()),
    path("schedule/<int:pk>/", ScheduleDetail.as_view()),
    path("schedule/<str:pk_ids>/", ScheduleList.as_view()),
    path("frequency/", FrequencyList.as_view()),
    path("frequency/<int:pk>/", FrequencyDetail.as_view()),
    path("frequency/<str:pk_ids>/", FrequencyList.as_view()),
    path("company/", CompanyList.as_view()),
    path("company/<int:pk>/", CompanyDetail.as_view()),
    path("company/<str:pk_ids>/", CompanyList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
