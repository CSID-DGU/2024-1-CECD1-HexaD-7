# langchain_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('check.urls')),
    path('api/', include('newsgenerator.urls'))
]
