from django.db import models

# class Article(models.Model):
#     title = models.CharField(max_length=255)
#     draft = models.TextField()
#     article_type = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         verbose_name = "Article"
#         verbose_name_plural = "Articles"

from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    source_data = models.TextField()  # 입력 자료 (보도자료 또는 취재 자료)
    content_category = models.CharField(max_length=100)  # 내용 카테고리
    literary = models.CharField(max_length=50, blank=True)  # 형식 카테고리 - 문학적
    structure = models.CharField(max_length=50, blank=True)  # 형식 카테고리 - 구조
    style = models.CharField(max_length=50, blank=True)  # 형식 카테고리 - 스타일
    ai_feedback = models.TextField(blank=True, null=True)  # AI 피드백 저장
    generated_article = models.TextField(blank=True, null=True)  # 생성된 기사

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Feedback(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="feedbacks")
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Feedback"
        verbose_name_plural = "Feedbacks"

# class VocabularyRule(models.Model):
#     target_word = models.CharField(max_length=100, verbose_name="Target Word")
#     part_of_speech = models.CharField(max_length=50, verbose_name="Part of Speech")
#     correct_form = models.TextField(verbose_name="Correct Form")
    
#     def __str__(self):
#         return self.target_word
    
#     class Meta:
#         verbose_name = "Vocabulary Rule"
#         verbose_name_plural = "Vocabulary Rules"

class VocabularyRule(models.Model):
    target_word = models.CharField(
        max_length=100,
        verbose_name="Target Word",
        help_text="The word to be corrected."
    )
    pos = models.CharField(
        max_length=50,
        verbose_name="Part of Speech",
        help_text="The part of speech for the word."
    )
    replacement_word = models.TextField(
        verbose_name="Replacement Word",
        help_text="The corrected form of the target word."
    )

    class Meta:
        verbose_name = "Vocabulary Rule"
        verbose_name_plural = "Vocabulary Rules"
        constraints = [
            models.UniqueConstraint(
                fields=['target_word', 'pos'],
                name='unique_target_word_pos'
            )
        ]
        db_table = "vocabulary_rule"

    def __str__(self):
        return f"{self.target_word} ({self.pos}) -> {self.replacement_word}"

class Survey(models.Model):
    SURVEY_CHOICES = [
        ('vocabulary_accuracy', 'Vocabulary Accuracy'),
        ('grammar_compliance', 'Grammar Compliance'),
        ('format_feedback', 'Format Feedback'),
    ]
    survey_id = models.CharField(max_length=50, choices=SURVEY_CHOICES)
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
