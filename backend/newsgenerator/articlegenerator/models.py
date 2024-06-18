# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

#ElasticSearch관련
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .documents import ArticleDocument




# savegeneratedarticle 애플리케이션에서 Article 모델을 가져옵니다
from savegeneratedarticle.models import Article

# 기존의 Article 모델 정의를 삭제합니다
# class Article(models.Model):
#     title = models.CharField(max_length=255)
#     link = models.URLField()
#     content = models.TextField()
#     format = models.CharField(max_length=255)
#     keywords = models.TextField()
#     section = models.CharField(max_length=20)
#     subsection = models.CharField(max_length=20)

#     class Meta:
#         db_table = 'articles'  # 동일한 테이블을 참조하도록 설정

#     def __str__(self):
#         return self.title

