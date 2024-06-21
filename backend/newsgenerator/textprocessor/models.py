from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    keywords = models.JSONField()
    format = models.CharField(max_length=100)
    section = models.CharField(max_length=100)
    subsection = models.CharField(max_length=100)
