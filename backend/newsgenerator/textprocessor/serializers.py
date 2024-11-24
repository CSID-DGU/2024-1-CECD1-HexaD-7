from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    format_category = serializers.JSONField()  # literary, structure, style을 포함한 JSON 형태

    class Meta:
        model = Article
        fields = ['title', 'source_data', 'fact_check_highlight', 'content_category', 'format_category']

    def validate_format_category(self, value):
        """format_category의 하위 필드가 모두 포함되어 있는지 검증"""
        required_keys = {'literary', 'structure', 'style'}
        if not required_keys.issubset(value.keys()):
            missing_keys = required_keys - value.keys()
            raise serializers.ValidationError(f"Missing keys in format_category: {', '.join(missing_keys)}")
        return value

    def create(self, validated_data):
        # format_category를 분리하여 개별 필드로 저장
        format_data = validated_data.pop('format_category')
        validated_data['literary'] = format_data.get('literary')
        validated_data['structure'] = format_data.get('structure')
        validated_data['style'] = format_data.get('style')
        return Article.objects.create(**validated_data)
