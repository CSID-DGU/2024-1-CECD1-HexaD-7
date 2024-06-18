from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.http import JsonResponse
# from transformers import AutoModelForCausalLM, AutoTokenizer  # Llama 모델 로드 부분은 주석 처리
from elasticsearch_dsl import Search
from .documents import ArticleDocument
from .serializers import ArticleRequestSerializer, ArticleResponseSerializer
from articlegenerator.models import Article
import logging
import os
import re
import requests


# Llama모델 로드 부분 (주석 처리)
# # Hugging Face 토큰 설정
# hf_token = "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"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# # 모델 로드 함수
# def load_model():
#   model_name = "meta-llama/Llama-2-7b-hf"
#   cache_dir = "./cache_dir"
#   logger.info(f"모델 {model_name} 로드 중...")
#   try:
#     tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token, cache_dir=cache_dir)
#     model = AutoModelForCausalLM.from_pretrained(model_name, token=hf_token, cache_dir=cache_dir, low_cpu_mem_usage=True)
#     return tokenizer, model
#   except Exception as e:
#     logger.error(f"모델 로드 중 오류 발생: {e}")
#     return None, None

# tokenizer, model = load_model()




class GenerateArticleView(APIView):
  parser_classes = [MultiPartParser, FormParser]

  def post(self, request, *args, **kwargs):
    serializer = ArticleRequestSerializer(data=request.data)
    if serializer.is_valid():
      research_info = serializer.validated_data['research_info']
      article_type = serializer.validated_data['article_type']
      fact_check_highlight = serializer.validated_data['fact_check_highlight']


    ngrok_url = 'https://b930-34-75-221-172.ngrok-free.app/receive-research-info'
    data_payload = {
            'research_info': research_info,
            'article_type': article_type,
            'fact_check_highlight': fact_check_highlight
        }
        #files = {'file': file_obj} if file_obj else None
    print("data payload: ", data_payload)
    # Colab 서버로 POST 요청 보내기
    try:
        response = requests.post(ngrok_url, json=data_payload, headers={'Content-Type': 'application/json'})
        #response = requests.post(ngrok_url, json=data_payload)
        if response.status_code == 200:
            print("Colab으로 데이터 전송 성공")
            colab_response = response.json()
            generated_text = colab_response.get('generated_text', '')
        else:
            print("코랩 서버로 데이터 전송 실패, 상태 코드:", response.status_code)
            return JsonResponse({"error": "Failed to get response from Colab", "status_code": response.status_code}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        print("오류 발생:", str(e))
        return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



      # if tokenizer is None or model is None:
      #   return Response({"error": "모델 로드 중 오류가 발생했습니다. 나중에 다시 시도해주세요."}, status=500)
      # 
      # # 기사 생성
      # prompt = (f"기사 유형: {article_type}\n\n취재 정보: {research_info}\n\n기사 유형과 취재정보를 바탕으로"
      #     f"가장 알맞은 Title, Content, Format, Keywords, Section, SubSection를 생성해주세요. 당신이 생성한 텍스트는 (생성된...)라고 부르겠습니다. 그리고 생성한 텍스트를 다음과 같은 형식으로 정리해주세요."
      #     f"1. Title: (생성된 Title)\n"
      #     f"2. Content: (생성된 Content)\n"
      #     f"3. Format: (생성된 Format)\n"
      #     f"4. Keywords: (생성된 Keywords)\n"
      #     f"5. Section: (생성된 Section)\n"
      #     f"6. SubSection: (생성된 SubSection)")
      # inputs = tokenizer(prompt, return_tensors="pt")
      # outputs = model.generate(inputs['input_ids'], max_length=1024) # max_length 조정
      # generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

      # 텍스트에서 각 요소 추출 (제목, 본문, 형식, 섹션, 하위 섹션)
      ####title, content, format, keywords, section, subsection = ("1", "껍데기는 가라 알맹이만 남고 껍데기는 가라", "3", "4", "5", "6")
      self.parse_generated_text(generated_text)


      # Elasticsearch에서 유사 기사 검색
      similar_articles = self.find_similar_articles(content)

      # 생성된 기사와 유사 기사 정보를 반환하여 선택지를 제시
      response_data = {
        "generated_article": {
          "title": title,
          "content": content,
          "keywords": keywords,
          "format": format,
          "section": section,
          "subsection": subsection
        },
        "similar_articles": similar_articles,
      }

      return Response(ArticleResponseSerializer(response_data).data)
    return Response(serializer.errors, status=400)

  def parse_generated_text(self, generated_text):
    # 패턴 매칭을 사용하여 각 요소를 추출
    title_match = re.search(r"1\. Title: \((.*?)\)", generated_text, re.DOTALL)
    content_match = re.search(r"2\. Content: \((.*?)\)", generated_text, re.DOTALL)
    format_match = re.search(r"3\. Format: \((.*?)\)", generated_text, re.DOTALL)
    keywords_match = re.search(r"4\. Keywords: \((.*?)\)", generated_text, re.DOTALL)
    section_match = re.search(r"5\. Section: \((.*?)\)", generated_text, re.DOTALL)
    subsection_match = re.search(r"6\. SubSection: \((.*?)\)", generated_text, re.DOTALL)

    # 매칭된 결과에서 각 부분을 추출
    title = title_match.group(1).strip() if title_match else ""
    content = content_match.group(1).strip() if content_match else ""
    format = format_match.group(1).strip() if format_match else ""
    keywords = keywords_match.group(1).strip() if keywords_match else ""
    section = section_match.group(1).strip() if section_match else ""
    subsection = subsection_match.group(1).strip() if subsection_match else ""

    return title, content, format, keywords, section, subsection

  def find_similar_articles(self,content):
    # Elasticsearch에서 유사한 content를 찾음
    s = Search(index="articles").query("more_like_this", fields=["content"], like=content,
                                       min_term_freq=1, min_doc_freq=1)[:5]
    response = s.execute()

    similar_articles = []
    for hit in response:
      # Elasticsearch에서 얻은 문서 id를 이용하여 MySQL에서 해당 기사를 조회
      article_id = hit.meta.id
      article = get_object_or_404(Article, id=article_id)
      similar_articles.append({
        'title': article.title,
        'link': article.link,
        'content': article.content,
        'format': article.format,
        'keywords': article.keywords,
        'section': article.section,
        'subsection': article.subsection,
        'score': hit.meta.score # 유사도 점수 추가
      })

    return similar_articles