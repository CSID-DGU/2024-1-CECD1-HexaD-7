from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    link = models.URLField()
    content = models.TextField()
    format = models.CharField(max_length=255)
    keywords = models.TextField()
    section = models.CharField(max_length=20)
    subsection = models.CharField(max_length=20)
    id = models.IntegerField(primary_key=True)

    class Meta:
        db_table = 'articles'  # 기존 테이블 이름을 명시적으로 지정

    def __str__(self):
        return self.title