from django.db import models

# class Article(models.Model):
    
#     title = models.CharField(max_length=255)
#     draft = models.TextField()
#     article_type = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)

# class Feedback(models.Model):
#     article = models.ForeignKey(Article, on_delete=models.CASCADE)
#     feedback = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

class Article(models.Model):
    title = models.CharField(max_length=255)
    draft = models.TextField()
    article_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"

class Feedback(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="feedbacks")
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Feedback"
        verbose_name_plural = "Feedbacks"

class VocabularyRule(models.Model):
    target_word = models.CharField(max_length=100, verbose_name="Target Word")
    part_of_speech = models.CharField(max_length=50, verbose_name="Part of Speech")
    correct_form = models.TextField(verbose_name="Correct Form")
    
    def __str__(self):
        return self.target_word
    
    class Meta:
        verbose_name = "Vocabulary Rule"
        verbose_name_plural = "Vocabulary Rules"

class Survey(models.Model):
    SURVEY_CHOICES = [
        ('vocabulary_accuracy', 'Vocabulary Accuracy'),
        ('grammar_compliance', 'Grammar Compliance'),
        ('format_feedback', 'Format Feedback'),
    ]
    survey_id = models.CharField(max_length=50, choices=SURVEY_CHOICES)
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
