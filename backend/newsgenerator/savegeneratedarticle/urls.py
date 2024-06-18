from django.urls import path
from .views import save_generated_article

urlpatterns = [
    path('save_generated_article/', save_generated_article, name='save_generated_article'),
]
