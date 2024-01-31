from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *

urlpatterns = [
    path("", UserList.as_view()),
    path("<int:pk>/", UserDetail.as_view()),
    path("register/", RegisterUser.as_view()),
    path("logout/blacklist/", BlacklistTokenUpdateView.as_view(), name="blacklist"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
