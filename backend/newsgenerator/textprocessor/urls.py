from django.urls import path
from .views import GenerateArticle, TextReceiver

urlpatterns = [
    path('api/generate-article', GenerateArticle.as_view(), name='generate-article'),
    path('api/text-receiver', TextReceiver.as_view(), name='text_receiver'),
]