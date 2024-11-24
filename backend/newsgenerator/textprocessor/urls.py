from django.urls import path
from .views import Step1View, Step2View, Step3View

urlpatterns = [
    path('generate/step1/', Step1View.as_view(), name='step1'),
    path('generate/step2/', Step2View.as_view(), name='step2'),
    path('generate/step3/', Step3View.as_view(), name='step3'),
]

# from django.urls import path
# from .views import GenerateArticle

# urlpatterns = [
#     path('generate-article', GenerateArticle.as_view(), name='generate-article'),
# ]
