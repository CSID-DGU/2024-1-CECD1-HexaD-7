from django.conf import settings 
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import openai
from .models import Article
from .serializers import ArticleSerializer

# 마이그레이션 파일 사용 중, mySQL 내용 변경 필요

class BaseGenerateView(APIView):
    def call_gpt_model(self, role, text, category=""):
        """OpenAI의 GPT 모델을 호출하여 텍스트를 생성합니다."""
        openai.api_key = settings.GPT_API_KEY  # GPT API 키 설정
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "당신은 주어진 데이터를 바탕으로 기사를 작성하는 기자입니다."},
                {"role": "user", "content": f"- {role}: {text} - 카테고리: {category}"}
            ],
            temperature=1,
            max_tokens=1094,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        return response

    def call_ner_api(self, text):
        """Flask 서버의 NER API에 POST 요청을 보냅니다."""
        response = requests.post('http://localhost:5000/ner', json={'text': text})
        if response.status_code == 200:
            return response.json()
        else:
            return {"오류": f"NER 서비스로부터 응답을 받지 못했습니다. 상태 코드: {response.status_code}"}


class Step1View(BaseGenerateView):
    def post(self, request, *args, **kwargs):
        """1단계: 기본 데이터 입력 및 저장"""
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            article = serializer.save()  # ArticleSerializer에서 create 메서드 오버라이드로 처리
            return Response({"status": "success", "article_id": article.id})
        return Response(serializer.errors, status=400)


class Step2View(BaseGenerateView):
    def post(self, request, *args, **kwargs):
        """2단계: 포함 내용 정리본 생성"""
        article_id = request.data.get("article_id")
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({"error": "Article not found"}, status=404)
        
        # GPT-3.5를 호출하여 포함 내용 정리본 생성
        gpt_response = self.call_gpt_model("내용 선별", article.source_data, article.content_category)
        summary = gpt_response['choices'][0]['message']['content'].strip()

        return Response({"status": "success", "포함내용정리본": summary})

class Step3View(BaseGenerateView):
    def post(self, request, *args, **kwargs):
        """3단계: 기사 초안 작성 및 개체명 인식"""
        article_id = request.data.get("article_id")
        summary = request.data.get("summary")  # 수정된 포함 내용 정리본
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({"error": "Article not found"}, status=404)

        # 기사 초안 작성
        draft_response = self.call_gpt_model("기사 초안 작성", summary, f"{article.literary}, {article.structure}, {article.style}")
        article_draft = draft_response['choices'][0]['message']['content'].strip()

        # 팩트체크 하이라이팅 여부에 따른 개체명 인식
        if article.fact_check_highlight:
            ner_result = self.call_ner_api(article_draft)
            # 하이라이트를 적용할 개체명만 추출
            entities_to_highlight = [entity[0] for entity in ner_result.get('entities', []) if entity[1] != "O"]
            highlighted_draft = self.apply_highlighting(article_draft, entities_to_highlight)
            # 개체명 인식 결과 형식화
            entity_recognitions = [f"{entity[0]}({entity[1]})" for entity in ner_result.get('entities', []) if entity[1] != "O"]
            return Response({
                "status": "success",
                "기사초안": highlighted_draft,
                "개체명인식": entity_recognitions
            })
        else:
            return Response({
                "status": "success",
                "기사초안": article_draft,
                "개체명인식": []
            })

    def apply_highlighting(self, text, entities):
        """텍스트에 하이라이팅 적용"""
        for entity in entities:
            text = text.replace(entity, f"<highlight>{entity}</highlight>")
        return text
