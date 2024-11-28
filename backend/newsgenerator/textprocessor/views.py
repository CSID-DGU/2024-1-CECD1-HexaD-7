from django.conf import settings 
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import openai
from .models import Article
from .serializers import ArticleSerializer
import csv

# 마이그레이션 파일 사용 중, mySQL 내용 변경 필요

class BaseGenerateView(APIView):
    def call_gpt_model(self, role, text, category=""):
        """OpenAI의 GPT 모델을 호출하여 텍스트를 생성합니다."""
        openai.api_key = settings.GPT_API_KEY  # GPT API 키 설정
        response = openai.ChatCompletion.create(
            model="gpt-4",
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
        article_id = request.data.get("article_id")
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({"error": "Article not found"}, status=404)

        # CSV에서 카테고리에 해당하는 재구성 자료 불러오기
        reconstructed_data = self.get_data_from_csv(article.content_category)

        # 개발자가 작성한 질문 내용
        developer_question = "'취재자료'를 이용해서 '재구성자료'를 작성해라. 이 때, '취재자료'에 해당하는 내용이 없다면 포함하지 말고, 비어둬라. 주의: '서론, 본론, 결론' 등과 같은 구조를 포함하지 않고 텍스트를 연속적으로 생성해라."

        # GPT-4 API 호출을 위한 전체 텍스트 합치기
        full_prompt = f"입력자료: [{article.source_data}]\n\n재구성자료: [{reconstructed_data}]\n\n요구사항: [{developer_question}]"

        # GPT-4를 호출하여 내용 요약 생성
        gpt_response = self.call_gpt_model("내용 선별", full_prompt, article.content_category)
        summary = gpt_response.choices[0].message['content'].strip()

        return Response({"status": "success", "포함내용정리본": summary})

    def get_data_from_csv(self, category):
        try:
            with open('textprocessor/resources/내용카테고리.csv', mode='r', encoding='utf-8-sig') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row['category'] == category:
                        return row['data']

        except KeyError as e:
            print(f"CSV 읽기 오류: {e}")
            raise Exception("CSV 파일이 예상한 헤더를 포함하고 있지 않습니다. 파일 형식을 확인하세요.")
        except FileNotFoundError:
            raise Exception("지정된 파일을 찾을 수 없습니다.")
        return "해당 카테고리에 대한 데이터를 찾을 수 없습니다."

class Step3View(BaseGenerateView):
    def post(self, request, *args, **kwargs):
        article_id = request.data.get("article_id")
        summary = request.data.get("summary")  # 수정된 내용 정리본
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({"error": "기사를 찾을 수 없습니다."}, status=404)

        # 'style.csv'에서 스타일 프롬프트를 로드합니다.
        style_prompt = self.load_style_prompt(article.content_category, article.style)

        # 전체 프롬프트를 준비합니다.
        full_prompt = (
            f"형식 카테고리: [{style_prompt}]\n"
            f"포함내용수정본: [{summary}]\n"
            f"조건: [기사는 {article.literary} 문체와 {article.structure} 구조를 사용할 것이다. 주의: '서론, 본론, 결론' 등과 같은 구조를 포함하지 않고 텍스트를 연속적으로 생성해라.]\n"
            f"프롬프트: ['형식 카테고리'은 '재구성 자료'와 '기사'로 이루어져 있다. 이의 관계를 분석하여, 제시한 '포함내용수정본'을 바탕으로 '조건'에 맞춰 '기사'를 작성해라.]\n"
        )

        # GPT-4를 사용하여 최종 기사 초안을 생성합니다.
        draft_response = self.call_gpt_model("기사 초안 작성", full_prompt, article.content_category)
        article_draft = draft_response.choices[0].message['content'].strip()

        # 팩트체크 하이라이팅 여부에 따라 개체명 인식을 수행합니다.
        if article.fact_check_highlight:
            ner_result = self.call_ner_api(article_draft)
            entities_to_highlight = [entity[0] for entity in ner_result.get('entities', []) if entity[1] != "O"]
            highlighted_draft = self.apply_highlighting(article_draft, entities_to_highlight)
            entity_recognitions = [f"{entity[0]}({entity[1]})" for entity in ner_result.get('entities', []) if entity[1] != "O"]
            return Response({
                "status": "성공",
                "기사 초안": highlighted_draft,
                "개체명 인식": entity_recognitions
            })
        else:
            return Response({
                "status": "성공",
                "기사 초안": article_draft,
                "개체명 인식": []
            })

    def apply_highlighting(self, text, entities):
        """텍스트에 하이라이팅을 적용합니다."""
        for entity in entities:
            text = text.replace(entity, f"<highlight>{entity}</highlight>")
        return text

    def load_style_prompt(self, category, style_choice):
        """선택된 스타일에 따라 'style.csv'에서 프롬프트를 로드합니다."""
        try:
            with open('textprocessor/resources/style.csv', mode='r', encoding='utf-8-sig') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row['category'] == category:
                        return row[style_choice]  # 'style_choice'는 'descriptive', 'qa', 'keypoint' 중 하나입니다. (서술형,Q&A형,핵심 포인트형)
        except Exception as e:
            print(f"CSV 읽기 오류: {e}")
        return ""
    
# class Step2View(BaseGenerateView):
#     def post(self, request, *args, **kwargs):
#         """2단계: 포함 내용 정리본 생성"""
#         article_id = request.data.get("article_id")
#         try:
#             article = Article.objects.get(id=article_id)
#         except Article.DoesNotExist:
#             return Response({"error": "Article not found"}, status=404)
        
#         # GPT-3.5를 호출하여 포함 내용 정리본 생성
#         gpt_response = self.call_gpt_model("내용 선별", article.source_data, article.content_category)
#         summary = gpt_response['choices'][0]['message']['content'].strip()

#         return Response({"status": "success", "포함내용정리본": summary})

# class Step3View(BaseGenerateView):
#     def post(self, request, *args, **kwargs):
#         """3단계: 기사 초안 작성 및 개체명 인식"""
#         article_id = request.data.get("article_id")
#         summary = request.data.get("summary")  # 수정된 포함 내용 정리본
#         try:
#             article = Article.objects.get(id=article_id)
#         except Article.DoesNotExist:
#             return Response({"error": "Article not found"}, status=404)

#         # 기사 초안 작성
#         draft_response = self.call_gpt_model("기사 초안 작성", summary, f"{article.literary}, {article.structure}, {article.style}")
#         article_draft = draft_response['choices'][0]['message']['content'].strip()

#         # 팩트체크 하이라이팅 여부에 따른 개체명 인식
#         if article.fact_check_highlight:
#             ner_result = self.call_ner_api(article_draft)
#             # 하이라이트를 적용할 개체명만 추출
#             entities_to_highlight = [entity[0] for entity in ner_result.get('entities', []) if entity[1] != "O"]
#             highlighted_draft = self.apply_highlighting(article_draft, entities_to_highlight)
#             # 개체명 인식 결과 형식화
#             entity_recognitions = [f"{entity[0]}({entity[1]})" for entity in ner_result.get('entities', []) if entity[1] != "O"]
#             return Response({
#                 "status": "success",
#                 "기사초안": highlighted_draft,
#                 "개체명인식": entity_recognitions
#             })
#         else:
#             return Response({
#                 "status": "success",
#                 "기사초안": article_draft,
#                 "개체명인식": []
#             })

#     def apply_highlighting(self, text, entities):
#         """텍스트에 하이라이팅 적용"""
#         for entity in entities:
#             text = text.replace(entity, f"<highlight>{entity}</highlight>")
#         return text
