from django.urls import path
from .views import SelectFirstCategory, SelectSecondCategory

urlpatterns = [
    path('select-first-category', SelectFirstCategory.as_view()),
    path('select-second-category', SelectSecondCategory.as_view()),
]
