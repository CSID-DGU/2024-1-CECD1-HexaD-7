from django.urls import path
from . import views
#from .views import index
urlpatterns = [
    path('', views.post_view, name='post_view'),  # 루트 URL에 대한 뷰 연결
    #path('', index, name = 'search'),
]
