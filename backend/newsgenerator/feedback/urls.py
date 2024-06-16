from django.urls import path
from . import views

urlpatterns = [
    path('submit-article/', views.submit_article, name='submit-article'),
    path('article-feedback/<int:article_id>/', views.article_feedback, name='article-feedback'),
    path('generate-article/<int:article_id>/', views.generate_article, name='generate-article'),
    path('satisfaction-survey/', views.satisfaction_survey, name='satisfaction-survey'),
]
