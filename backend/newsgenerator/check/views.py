# check/views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .llm_utils import generate_feedback

@require_http_methods(["GET"])
def article_feedback(request):
    article_id = request.GET.get('article_id')
    if not article_id:
        return JsonResponse({'message': 'article_id is required'}, status=400)

    # Dummy article for demonstration; replace with actual data retrieval logic
    article = {
        "id": article_id,
        "title": "Example Article Title",
        "content": "This is a smple cntent with speling erors."
    }

    feedback = generate_feedback(article['title'], article['content'])

    return JsonResponse({
        'message': 'AI 피드백이 제공되었습니다.',
        'feedback': feedback
    })
