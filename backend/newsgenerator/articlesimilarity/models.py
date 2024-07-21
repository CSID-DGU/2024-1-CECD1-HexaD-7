#Django 모델과 mySQL 스키마 정의하는 곳
from django.db import models
from elasticsearch import Elasticsearch
from django.conf import settings

es_client = Elasticsearch(settings.ELASTICSEARCH_DSL['default']['hosts'])

class Utf8Article(models.Model):

    id = models.AutoField(primary_key=True)
    #id = models.IntegerField(blank=True, null=True)
    title = models.TextField(db_column='Title', blank=True, null=True)  # Field name made lowercase.
    link = models.TextField(db_column='Link', blank=True, null=True)  # Field name made lowercase.
    content = models.TextField(db_column='Content', blank=True, null=True)  # Field name made lowercase.
    format = models.TextField(db_column='Format', blank=True, 
null=True)  # Field name made lowercase.    
    keywords = models.TextField(db_column='Keywords', blank=True, null=True)  # Field name made lowercase.
    section = models.TextField(db_column='Section', blank=True, null=True)  # Field name made lowercase.
    subsection = models.TextField(db_column='SubSection', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'utf8article'