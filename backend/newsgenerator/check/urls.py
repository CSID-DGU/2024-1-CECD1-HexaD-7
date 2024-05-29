# check/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('article-feedback/', views.article_feedback, name='article_feedback'),
]
