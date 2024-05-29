# check/urls.py
from django.urls import path
from .views import ArticleFeedbackView

urlpatterns = [
    path('api/article-feedback', ArticleFeedbackView.as_view(), name='article-feedback')
]
