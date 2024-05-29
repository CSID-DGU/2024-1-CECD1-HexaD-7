# check/views.py
from django.http import JsonResponse
from django.views import View
from .langchain_utils.py import SpellChecker
from django.conf import settings

class ArticleFeedbackView(View):
    def get(self, request):
        article_id = request.GET.get('article_id')
        if not article_id:
            return JsonResponse({'message': 'article_id is required'}, status=400)
        
        # 여기에 데이터베이스 조회 또는 더미 데이터를 사용하여 기사를 가져오는 로직 추가
        article = {
            "id": article_id,
            "title": "Sample Title",
            "content": "This is a smaple article content with some speling errors."
        }
        
        checker = SpellChecker(api_key=settings.OPENAI_API_KEY)
        feedback = checker.check_spelling(article['content'])

        return JsonResponse({
            'message': 'AI 피드백이 제공되었습니다.',
            'feedback': feedback
        })
