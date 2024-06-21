from django.conf import settings
from .models import Article
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class GenerateArticle(APIView):
    def post(self, request):
        research_info = request.data.get("research_info")
        article_type = request.data.get("article_type", "General")
        fact_check_highlight = request.data.get("fact_check_highlight", False)

        # Set the OpenAI API key
        openai.api_key = settings.TEXT_PROCESSOR_API_KEY

        try:
            # Use the updated API method to create chat completions
            response = openai.ChatCompletion.create(
                model="ft:gpt-3.5-turbo-0125:personal:lab01-data150:9cG0DQID",
                messages=[
                    {"role": "system", "content": "당신은 취재 자료를 바탕으로 사실 기반의 올바른 형식의 기사를 작성하는 기자이다. 기사는 제목, 도입 2~3 문장, 본문 2~3 문단, 결론 2~3 문장으로 구성된다."},
                    {"role": "user", "content": f"- 취재자료: <{research_info}> - 취재자료를 바탕으로 기사를 작성하시오."}
                ],
                temperature=1,
                max_tokens=1094,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            generated_content = response.choices[0].message['content'].strip() if response.choices else ''

            # Save the article
            article = Article(
                title="Generated Title",
                content=generated_content,
                keywords=["AI", "technology", article_type],
                format=article_type,
                section="Technology",
                subsection="Latest News"
            )
            article.save()

            return Response({
                "message": "Success",
                "article_id": article.id,
                "title": article.title,
                "content": article.content
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": "Failure", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# from django.shortcuts import render
# from rest_framework.parsers import JSONParser # type: ignore
# from rest_framework.parsers import MultiPartParser, FormParser # type: ignore
# from django.http import JsonResponse
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import requests

# # 프론트로부터 텍스트를 받는 로직
# class GenerateArticle(APIView):
#     parser_classes = (JSONParser, MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         research_info = request.data.get('research_info')
#         #file_obj = request.FILES.get('file')  # 파일 객체 처리
#         article_type = request.data.get('article_type')
#         fact_check_highlight = request.data.get('fact_check_highlight') == 'true'

#         ##########################################################
#         # 데이터 처리 로직
#         ngrok_url = 'https://b930-34-75-221-172.ngrok-free.app/receive-research-info'

#         data_payload = {
#             'research_info': research_info,
#             'article_type': article_type,
#             'fact_check_highlight': fact_check_highlight
#         }
#         #files = {'file': file_obj} if file_obj else None
#         print("data payload: ", data_payload)
#         # Colab 서버로 POST 요청 보내기
#         try:
#             response = requests.post(ngrok_url, json=data_payload, headers={'Content-Type': 'application/json'})
#             #response = requests.post(ngrok_url, json=data_payload)
#             if response.status_code == 200:
#                 print("Colab으로 데이터 전송 성공")
#                 colab_response = response.json()
#                 generated_text = colab_response.get('generated_text', '')
#             else:
#                 print("코랩 서버로 데이터 전송 실패, 상태 코드:", response.status_code)
#                 return JsonResponse({"error": "Failed to get response from Colab", "status_code": response.status_code}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             print("오류 발생:", str(e))
#             return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         #############################################################

#         response_data = {
#             'generated_text': generated_text,
#         }
#         print("LLM 생성 텍스트를 받아오는데 성공했습니다. ")

#         return JsonResponse(response_data, status=status.HTTP_200_OK)

# # LLM 출력을 받는 로직
# class TextReceiver(APIView):
#     def post(self, request, *args, **kwargs):
#         generated_text = request.data.get('generated_text', None)
#         if generated_text is None:
#             return Response({"error": "No generated text provided."}, status=status.HTTP_400_BAD_REQUEST)
#         return Response({"received_text": generated_text}, status=status.HTTP_200_OK)

