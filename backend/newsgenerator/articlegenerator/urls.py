from django.urls import path
from .views import GenerateArticleView


urlpatterns = [
    #path('generatearticle/', GenerateArticleView.as_view(), name='generate-article'),
    path('generatearticle/', GenerateArticleView.as_view(), name='generate-article'),
]
