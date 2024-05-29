# Django 관리자 사이트에서 모델을 관리할 수 있게 해줌
# 간단한 API 서버에서는 필요 없지만 관리자 기능이 필요하다면 작성할 수 있음
from django.contrib import admin
from .models import Article  # 예시 모델

admin.site.register(Article)
