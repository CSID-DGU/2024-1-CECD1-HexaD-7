from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    draft = models.TextField()
    article_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class Feedback(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Survey(models.Model):
    SURVEY_CHOICES = [
        ('vocabulary_accuracy', 'Vocabulary Accuracy'),
        ('grammar_compliance', 'Grammar Compliance'),
        ('format_feedback', 'Format Feedback'),
    ]
    survey_id = models.CharField(max_length=50, choices=SURVEY_CHOICES)
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
