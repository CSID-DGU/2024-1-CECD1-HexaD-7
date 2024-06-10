from rest_framework import serializers

class ArticleRequestSerializer(serializers.Serializer):
    research_info = serializers.CharField()
    file = serializers.FileField(required=False)
    article_type = serializers.ChoiceField(choices=["스트레이트", "보도", "기획"])
    fact_check_highlight = serializers.BooleanField()

class ArticleResponseSerializer(serializers.Serializer):
    generated_article = serializers.DictField(
        child=serializers.CharField()
    )
    similar_articles = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
