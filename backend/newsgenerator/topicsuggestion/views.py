import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

class SelectFirstCategory(APIView):
    def post(self, request, format=None):
        first_category = request.data.get('first_category')
        second_categories_map = {
            "건강정보": ["건강일반", "먹거리건강", "한방", "헬스신간"],
            "산업정보": ["제약바이오", "식품", "건강기능식품", "의료기기"],
            "뷰티": ["성형", "피부미용"]
        }
        second_categories = second_categories_map.get(first_category, [])
        if not second_categories:
            return Response({"message": "Invalid category selected"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'first_category': first_category,
            'second_categories': second_categories
        }, status=status.HTTP_200_OK)

class SelectSecondCategory(APIView):
    def post(self, request, format=None):
        first_category = request.data.get('first_category')
        second_category = request.data.get('second_category')

        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GPT_API_KEY}",
                "Content-Type": "application/json"
            },            
            json={
                "model": "gpt-4",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant. Provide only the article topics in Korean without any additional explanation or details."},
                    {"role": "user", "content": f"'{first_category}' 내의 '{second_category}' 카테고리와 관련된 최근 핫한 기사 주제 3가지를 추천해줘."}
                ],
                "max_tokens": 150  # 필요에 따라 max_tokens 값을 조정하세요
            }
        ).json()

        suggested_topics = [choice["message"]["content"] for choice in response.get("choices", [])]

        return Response({
            'message': f"{first_category} > {second_category} 카테고리 기사 작성을 위한 주제 추천 리스트입니다.",
            'suggested_topics': suggested_topics
        }, status=status.HTTP_200_OK)