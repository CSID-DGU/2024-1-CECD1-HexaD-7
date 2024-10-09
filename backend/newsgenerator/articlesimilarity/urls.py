from django.urls import path
from . import views


urlpatterns = [
    path('', views.show_similarity_aritlce, name='articlesimilarity'),
]
