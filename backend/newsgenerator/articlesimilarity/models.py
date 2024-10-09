from django.db import models

class ArticleTable(models.Model):
    id = models.IntegerField(primary_key=True)
    Title = models.CharField(max_length=255)
    Link = models.CharField(max_length=255)
    Content = models.TextField()
    Format = models.CharField(max_length=255)
    Keywords = models.CharField(max_length=255)
    Section = models.CharField(max_length=255)
    SubSection = models.CharField(max_length=255)

    def __str__(self):
        return self.Title

    class Meta:
        db_table = 'articletable_utf8_corrected'
