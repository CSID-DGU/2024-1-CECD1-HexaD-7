import openai
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import Article, Feedback
from .serializers import ArticleSerializer, FeedbackSerializer, SurveySerializer

# OpenAI API 키 설정
openai.api_key = settings.GPT_API_KEY

@api_view(['POST'])
def submit_article(request):
    if request.method == 'POST':
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '기사 제출이 완료되었습니다.', 'article_id': serializer.data['id']}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])  # HTTP 메소드를 POST로 변경, 필요에 따라
def article_feedback(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return Response({'message': '기사 찾을 수 없음'}, status=status.HTTP_404_NOT_FOUND)

    # 채팅 스타일의 프롬프트 준비
    prompt = f"다음 초안에 대한 피드백을 제공해 주세요:\n\n{article.draft}"
    
    try:
        # 챗 모델 사용으로 변경
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # 적절한 모델명을 사용
            messages=[{"role": "user", "content": prompt}]
        )
        
        feedback = response['choices'][0]['message']['content']  # 적절한 필드로 수정
        Feedback.objects.create(article=article, feedback=feedback)
        return Response({'message': 'AI 피드백이 제공되었습니다.', 'feedback': feedback}, status=status.HTTP_201_CREATED)
    except Exception as e:
        # 오류 메시지를 더 명확하게 반환
        return Response({'message': 'AI 피드백 생성 중 오류 발생', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])  # HTTP 메소드를 POST로 변경, 필요에 따라
def generate_article(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
        feedback = Feedback.objects.filter(article=article).last()
        if not feedback:
            return Response({'message': '피드백이 없음'}, status=status.HTTP_404_NOT_FOUND)

        prompt = f"다음 초안을 기반으로 AI 피드백을 반영하여 반드시 한국어로 기사를 생성해 주세요:\n\n초안:\n{article.draft}\n\n피드백:\n{feedback.feedback}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # 적절한 모델명 사용
            messages=[{"role": "system", "content": "The following is a draft article and AI feedback. Generate a final article based on the input."},
                      {"role": "user", "content": prompt}]
        )
        
        generated_article = response['choices'][0]['message']['content']
        return Response({'message': 'AI 생성 기사가 조회되었습니다.', 'generated_article': generated_article}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': 'AI 생성 중 오류 발생', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def satisfaction_survey(request):
    if request.method == 'POST':
        serializer = SurveySerializer(data=request.data)
        if serializer.is_vamymlid():
            serializer.save()
            return Response({'message': '만족도 조사가 성공적으로 제출되었습니다.', 'next_step': 'completion'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
