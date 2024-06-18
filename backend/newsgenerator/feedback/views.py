from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Article, Feedback, Survey
from .serializers import ArticleSerializer, FeedbackSerializer, SurveySerializer

@api_view(['POST'])
def submit_article(request):
    if request.method == 'POST':
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '기사 제출이 완료되었습니다.', 'article_id': serializer.data['id']}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def article_feedback(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return Response({'message': '기사 찾을 수 없음'}, status=status.HTTP_404_NOT_FOUND)
    # 여기에 AI 피드백 로직 추가
    feedback = "AI가 제공한 피드백"  # 예시 피드백
    Feedback.objects.create(article=article, feedback=feedback)
    return Response({'message': 'AI 피드백이 제공되었습니다.', 'feedback': feedback}, status=status.HTTP_200_OK)

@api_view(['GET'])
def generate_article(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return Response({'message': '기사 찾을 수 없음'}, status=status.HTTP_404_NOT_FOUND)
    # 여기에 AI 생성 기사 로직 추가
    generated_article = "AI가 생성한 기사"  # 예시 기사
    return Response({'message': 'AI 생성 기사가 조회되었습니다.', 'generated_article': generated_article}, status=status.HTTP_200_OK)

@api_view(['POST'])
def satisfaction_survey(request):
    if request.method == 'POST':
        serializer = SurveySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '만족도 조사가 성공적으로 제출되었습니다.', 'next_step': 'completion'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
