# from django.urls import path
# from .views import GenerateArticle, TextReceiver

# urlpatterns = [
#     path('api/generate-article', GenerateArticle.as_view(), name='generate-article'),
#     path('api/text-receiver', TextReceiver.as_view(), name='text_receiver'),
# ]

from django.urls import path
from .views import GenerateArticle  # 수정된 클래스명을 가져옵니다.

urlpatterns = [
    path('generate-article', GenerateArticle.as_view(), name='generate-article'),
    #path('api/text-receiver', TextReceiver.as_view(), name='text_receiver'),
]