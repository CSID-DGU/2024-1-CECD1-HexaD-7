from django.db import models 

class Article(models.Model):
    title = models.CharField(max_length=255)
    source_data = models.TextField()  # 입력 자료 (보도자료 또는 취재 자료)
    content_category = models.CharField(max_length=100)  # 내용 카테고리
    fact_check_highlight = models.BooleanField(default=False)  # 팩트체크 하이라이팅 여부
    literary = models.CharField(max_length=50, blank=True)  # 이전에는 style
    structure = models.CharField(max_length=50, blank=True)
    style = models.CharField(max_length=50, blank=True)  # 이전에는 design

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
