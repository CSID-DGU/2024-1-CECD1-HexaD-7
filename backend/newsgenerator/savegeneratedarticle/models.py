from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    link = models.URLField()
    content = models.TextField()
    format = models.CharField(max_length=20)
    keywords = models.TextField()
    section = models.CharField(max_length=20)
    subsection = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
