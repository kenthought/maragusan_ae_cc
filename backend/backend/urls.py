"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

urlpatterns = [
    # path("", include(router.urls)), change for a default view
    path("admin/", admin.site.urls),
    path("api/assets/", include("assets.urls")),
    path("api/owners_equity/", include("owners_equity.urls")),
    path("api/bank_account/", include("bank_accounts.urls")),
    path("api/expenses/", include("expenses.urls")),
    path("api/payables/", include("payables.urls")),
    path("api/receivables/", include("receivables.urls")),
    path("api/components/", include("components.urls")),
    path("api/balance/", include("balance.urls")),
    path("api/approvals/", include("approvals.urls")),
    path(
        "api/dailyClosingToday/<int:user_id>/<int:year>/<int:month>/<int:date>",
        DailyClosingToday.as_view(),
    ),
    path("api/users/", include("users.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
