from django.urls import path
from .views import VerifyAccessCode

urlpatterns = [
    path('api/verify-access-code/', VerifyAccessCode.as_view(), name='verify-access-code')
]