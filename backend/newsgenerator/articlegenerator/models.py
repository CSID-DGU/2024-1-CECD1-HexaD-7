# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Article(models.Model):
    title = models.CharField(max_length=255)
    link = models.URLField()
    content = models.TextField()
    format = models.CharField(max_length=255)
    keywords = models.TextField()
    section = models.CharField(max_length=20)
    subsection = models.CharField(max_length=20)

    def __str__(self):
        return self.title