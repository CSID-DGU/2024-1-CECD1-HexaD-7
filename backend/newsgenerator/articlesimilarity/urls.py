from django.urls import path
from . import views
#from .views import index
urlpatterns = [
    path('', views.search_articles, name='search_articles'),  # 루트 URL에 대한 뷰 연결
    #path('', index, name = 'search'),
]
