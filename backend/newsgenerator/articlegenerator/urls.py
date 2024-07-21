from django.contrib import admin
from django.urls import path
from articlesimilarity.views import post_view


urlpatterns = [
    #path('generatearticle/', GenerateArticleView.as_view(), name='generate-article'),
    path('articlesimilarity/', post_view),
]
