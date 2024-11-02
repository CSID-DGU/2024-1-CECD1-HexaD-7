from django.urls import path
from . import views

urlpatterns = [
    path('submit-article/', views.submit_article, name='submit-article'),
    path('article-feedback/<int:article_id>/', views.article_feedback, name='article-feedback'),
    #path('get-feedback/<int:article_id>/', views.get_feedback, name='get_feedback'),
    path('generate-article/<int:article_id>/', views.generate_article, name='generate-article'),
    path('spell-check/<int:article_id>/', views.spell_check, name='spell_check'),
    path('vocabulary-check/<int:article_id>/', views.vocabulary_check, name='vocabulary_check'),
    path('vocabulary-management/', views.manage_vocabulary, name='vocabulary_management'),
    path('satisfaction-survey/', views.satisfaction_survey, name='satisfaction-survey'),
]

