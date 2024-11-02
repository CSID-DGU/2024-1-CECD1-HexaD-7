from rest_framework import serializers
from .models import Article, Feedback, VocabularyRule, Survey

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class VocabularyRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabularyRule
        fields = '__all__'
        
class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'
