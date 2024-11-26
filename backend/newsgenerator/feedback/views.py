import openai
from rest_framework.response import Response
from rest_framework import status
import requests
from rest_framework.decorators import api_view
from django.conf import settings
from .models import Article, Feedback, VocabularyRule
from .serializers import ArticleSerializer, FeedbackSerializer, VocabularyRuleSerializer, SurveySerializer
# from hanspell import spell_checker
from aiohanspell import spell_checker
from django.http import JsonResponse
from asgiref.sync import async_to_sync
import asyncio
from django.utils.html import format_html
import difflib
from django.utils.html import escape
import json
from django.shortcuts import get_object_or_404

# OpenAI API 키 설정
openai.api_key = settings.GPT_API_KEY

@api_view(['POST'])
def get_pos_tags(request):
    text = request.data.get('text', '')
    response = requests.post('http://localhost:5000/pos-tag', json={'text': text})
    if response.status_code == 200:
        return Response(response.json(), status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Failed to get response from Pororo service'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def submit_article(request):
#     if request.method == 'POST':
#         serializer = ArticleSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': '기사 제출이 완료되었습니다.', 'article_id': serializer.data['id']}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])  # HTTP 메소드를 POST로 변경, 필요에 따라
# def article_feedback(request, article_id):
#     try:
#         article = Article.objects.get(id=article_id)
#     except Article.DoesNotExist:
#         return Response({'message': '기사 찾을 수 없음'}, status=status.HTTP_404_NOT_FOUND)

#     # 채팅 스타일의 프롬프트 준비
#     prompt = f"다음 초안에 대한 피드백을 제공해 주세요:\n\n{article.draft}"
    
#     try:
#         # 챗 모델 사용으로 변경
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",  # 적절한 모델명을 사용
#             messages=[{"role": "user", "content": prompt}]
#         )
        
#         feedback = response['choices'][0]['message']['content']  # 적절한 필드로 수정
#         Feedback.objects.create(article=article, feedback=feedback)
#         return Response({'message': 'AI 피드백이 제공되었습니다.', 'feedback': feedback}, status=status.HTTP_201_CREATED)
#     except Exception as e:
#         # 오류 메시지를 더 명확하게 반환
#         return Response({'message': 'AI 피드백 생성 중 오류 발생', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])  # HTTP 메소드를 POST로 변경, 필요에 따라
# def generate_article(request, article_id):
#     try:
#         article = Article.objects.get(id=article_id)
#         feedback = Feedback.objects.filter(article=article).last()
#         if not feedback:
#             return Response({'message': '피드백이 없음'}, status=status.HTTP_404_NOT_FOUND)

#         prompt = f"다음 초안을 기반으로 AI 피드백을 반영하여 반드시 한국어로 기사를 생성해 주세요:\n\n초안:\n{article.draft}\n\n피드백:\n{feedback.feedback}"
        
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",  # 적절한 모델명 사용
#             messages=[{"role": "system", "content": "The following is a draft article and AI feedback. Generate a final article based on the input."},
#                       {"role": "user", "content": prompt}]
#         )
        
#         generated_article = response['choices'][0]['message']['content']
#         return Response({'message': 'AI 생성 기사가 조회되었습니다.', 'generated_article': generated_article}, status=status.HTTP_201_CREATED)
#     except Exception as e:
#         return Response({'message': 'AI 생성 중 오류 발생', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def submit_article(request):
    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': '기사 제출이 완료되었습니다.', 'article_id': serializer.data['id']}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def article_feedback(request, article_id):
    article = get_object_or_404(Article, id=article_id)

    # 프롬프트 구성
    prompt = f"""
    다음은 기사 제목 및 초안, 기사의 카테고리입니다. 다음 내용을 바탕으로 피드백을 제공해주세요.
    제목: {article.title}
    초안 내용: {article.source_data}
    
    카테고리:
    - 내용 카테고리: {article.content_category}
    - 문학적 형식: {article.literary}
    - 구조 형식: {article.structure}
    - 스타일 형식: {article.style}
    """

    try:
        # GPT API 호출
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        feedback = response['choices'][0]['message']['content']

        # 피드백 저장
        article.ai_feedback = feedback
        article.save()

        return Response({'message': 'AI 피드백이 생성되었습니다.', 'ai_feedback': feedback}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'AI 피드백 생성 중 오류가 발생했습니다: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def generate_article(request, article_id):
    # 기사 가져오기
    article = get_object_or_404(Article, id=article_id)

    if not article.ai_feedback:
        return Response({'error': '피드백이 없습니다. 먼저 피드백을 생성해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

    # 어휘 규칙 가져오기
    from .models import VocabularyRule  # VocabularyRule 모델 가져오기
    vocabulary_rules = VocabularyRule.objects.all()

    # 규칙을 단순히 나열하여 설명
    restricted_words = [rule.target_word for rule in vocabulary_rules]
    restricted_words_text = ", ".join(restricted_words)

    # 프롬프트 구성
    prompt = f"""
    이것은 지양해야할 단어 리스트이다: {restricted_words_text}.
    input: 기사 카테고리, 기사 초안, AI 피드백.
    output: '기사제목'과 '기사내용'만 출력할 것.
    기사 초안 및 AI 피드백을 반영하여 기사 카테고리에 맞는 완전한 기사를 생성하라.
    
    카테고리:
    - 내용 카테고리: {article.content_category}
    - 문학적 형식: {article.literary}
    - 구조 형식: {article.structure}
    - 스타일 형식: {article.style}

    초안:
    {article.source_data}

    AI 피드백:
    {article.ai_feedback}
    """

    try:
        # GPT API 호출
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        generated_article = response['choices'][0]['message']['content']

        # 생성된 기사 저장
        article.generated_article = generated_article
        article.save()

        return Response({'message': '기사가 성공적으로 생성되었습니다.', 'generated_article': generated_article}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'기사 생성 중 오류가 발생했습니다: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def generate_article(request, article_id):
#     article = get_object_or_404(Article, id=article_id)

#     if not article.ai_feedback:
#         return Response({'error': '피드백이 없습니다. 먼저 피드백을 생성해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

#     # 프롬프트 구성
#     prompt = f"""
#     다음은 기사 카테고리와 기사 초안과 AI 피드백입니다. 다음 내용을 반영하여 완전한 기사를 생성해주세요.

#     카테고리:
#     - 내용 카테고리: {article.content_category}
#     - 문학적 형식: {article.literary}
#     - 구조 형식: {article.structure}
#     - 스타일 형식: {article.style}

#     초안:
#     {article.source_data}
    
#     AI 피드백:
#     {article.ai_feedback}
    
#     """

#     try:
#         # GPT API 호출
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=[{"role": "user", "content": prompt}]
#         )
#         generated_article = response['choices'][0]['message']['content']

#         # 생성된 기사 저장
#         article.generated_article = generated_article
#         article.save()

#         return Response({'message': '기사가 성공적으로 생성되었습니다.', 'generated_article': generated_article}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({'error': f'기사 생성 중 오류가 발생했습니다: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def spell_check(request, article_id):
#     try:
#         article = Article.objects.get(pk=article_id)
#         original_draft = article.draft  # 기사초안원문을 저장합니다.

#         result = spell_checker.check(original_draft)
#         if not result.result:
#             return Response({'error': '맞춤법 검사를 처리할 수 없습니다. API 응답이 올바르지 않습니다.'}, status=500)

#         corrected_draft = result.checked
#         errors = result.errors

#         # 원본과 교정본을 비교하여 변경된 부분을 강조합니다.
#         s = difflib.SequenceMatcher(None, original_draft.split(), corrected_draft.split())
#         highlighted_original = ""
#         highlighted_corrected = ""
#         for tag, i1, i2, j1, j2 in s.get_opcodes():
#             if tag == "replace":
#                 highlighted_original += '<span style="color: blue;">' + escape(' '.join(original_draft.split()[i1:i2])) + '</span> '
#                 highlighted_corrected += '<span style="color: red;">' + escape(' '.join(corrected_draft.split()[j1:j2])) + '</span> '
#             elif tag == "equal":
#                 common_text = escape(' '.join(original_draft.split()[i1:i2]))
#                 highlighted_original += common_text
#                 highlighted_corrected += common_text

#         article.draft = corrected_draft
#         article.save()

#         return Response({
#             'original_draft': highlighted_original,
#             'corrected_draft': highlighted_corrected,
#             'correction_count': errors,
#         }, status=200)
#     except Article.DoesNotExist:
#         return Response({'error': '해당 기사를 찾을 수 없습니다.'}, status=404)
#     except Exception as e:
#         return Response({'error': f'맞춤법 검사 중 오류가 발생했습니다: {str(e)}'}, status=500)


# import logging

# @api_view(['POST'])
# def spell_check(request, article_id):
#     try:
#         article = Article.objects.get(pk=article_id)
#         original_draft = article.draft

#         # 맞춤법 검사기를 동기식으로 실행
#         result = async_to_sync(spell_checker.check)(original_draft)
        
#         # API 응답 검증
#         if not result or not result.result:
#             logging.error(f"Invalid response from spelling API: {result}")
#             return Response({'error': '맞춤법 검사를 처리할 수 없습니다. API 응답이 올바르지 않습니다.'}, status=500)

#         corrected_draft = result.checked
#         errors = result.errors

#         # 원본과 수정본 사이의 차이를 강조하여 표시
#         s = difflib.SequenceMatcher(None, original_draft.split(), corrected_draft.split())
#         highlighted_original = ""
#         highlighted_corrected = ""
#         for tag, i1, i2, j1, j2 in s.get_opcodes():
#             if tag == "replace":
#                 highlighted_original += '<span style="color: blue;">' + escape(' '.join(original_draft.split()[i1:i2])) + '</span> '
#                 highlighted_corrected += '<span style="color: red;">' + escape(' '.join(corrected_draft.split()[j1:j2])) + '</span> '
#             elif tag == "equal":
#                 common_text = escape(' '.join(original_draft.split()[i1:i2]))
#                 highlighted_original += common_text
#                 highlighted_corrected += common_text

#         article.draft = corrected_draft
#         article.save()

#         return Response({
#             'original_draft': highlighted_original,
#             'corrected_draft': highlighted_corrected,
#             'correction_count': errors
#         }, status=200)
#     except Article.DoesNotExist:
#         return Response({'error': '해당 기사를 찾을 수 없습니다.'}, status=404)
#     except Exception as e:
#         logging.error(f"Error during spell checking: {str(e)}")
#         return Response({'error': f'맞춤법 검사 중 오류가 발생했습니다: {str(e)}'}, status=500)
import logging

# 로깅 설정
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

@api_view(['POST'])
def spell_check(request, article_id):
    try:
        # 모델에서 기사 객체를 조회
        article = Article.objects.get(pk=article_id)
        original_draft = article.draft
        logging.debug(f"Original draft: {original_draft}")

        # 맞춤법 검사 API 호출 준비
        api_url = 'https://api.spellchecker.com/check'  # 예시 URL, 실제 URL로 변경 필요
        headers = {'Content-Type': 'application/json'}
        payload = {'text': original_draft}

        # 맞춤법 검사기를 동기식으로 실행
        response = requests.post(api_url, headers=headers, json=payload)
        logging.debug(f"HTTP Status Code: {response.status_code}")
        logging.debug(f"Response Body: {response.text}")

        if response.status_code != 200:
            logging.error("Failed to get a valid response from the spelling API")
            return JsonResponse({'error': 'API 호출에 실패했습니다.'}, status=500)

        result = response.json()

        # API 응답 검증
        if not result or not result.get('result', False):
            logging.error(f"Invalid response from spelling API: {result}")
            return JsonResponse({'error': '맞춤법 검사를 처리할 수 없습니다. API 응답이 올바르지 않습니다.'}, status=500)

        corrected_draft = result['checked']
        errors = result['errors']
        logging.debug(f"Corrected draft: {corrected_draft}, Errors found: {errors}")

        # 원본과 수정본 사이의 차이를 강조하여 표시
        s = difflib.SequenceMatcher(None, original_draft.split(), corrected_draft.split())
        highlighted_original = ""
        highlighted_corrected = ""
        for tag, i1, i2, j1, j2 in s.get_opcodes():
            if tag == "replace":
                highlighted_original += '<span style="color: blue;">' + escape(' '.join(original_draft.split()[i1:i2])) + '</span> '
                highlighted_corrected += '<span style="color: red;">' + escape(' '.join(corrected_draft.split()[j1:j2])) + '</span> '
            elif tag == "equal":
                common_text = escape(' '.join(original_draft.split()[i1:i2]))
                highlighted_original += common_text
                highlighted_corrected += common_text

        # 수정된 초안을 저장
        article.draft = corrected_draft
        article.save()
        logging.debug("Draft saved successfully.")

        # 최종 결과 반환
        return JsonResponse({
            'original_draft': highlighted_original,
            'corrected_draft': highlighted_corrected,
            'correction_count': errors
        }, status=200)
    except Article.DoesNotExist:
        logging.error("Article not found.")
        return JsonResponse({'error': '해당 기사를 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        logging.error(f"Error during spell checking: {str(e)}")
        return JsonResponse({'error': f'맞춤법 검사 중 오류가 발생했습니다: {str(e)}'}, status=500)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def manage_vocabulary(request):
    if request.method == 'GET':
        # 데이터베이스에서 모든 규칙을 조회
        rules = VocabularyRule.objects.all()
        formatted_rules = [
            {
                "target_word": rule.target_word,
                "pos": rule.pos,
                "replacement_word": rule.replacement_word
            }
            for rule in rules
        ]
        return Response(formatted_rules)

    elif request.method == 'POST':
        # 새로운 규칙 추가
        data = request.data
        target_word = data.get('target_word')
        pos = data.get('pos')
        replacement_word = data.get('replacement_word')

        # 데이터 유효성 검사
        if not target_word or not pos or not replacement_word:
            return Response({"error": "모든 필드를 입력해야 합니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 중복 방지
        if VocabularyRule.objects.filter(target_word=target_word, pos=pos).exists():
            return Response({"error": "해당 단어와 품사 조합의 규칙이 이미 존재합니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 규칙 저장
        VocabularyRule.objects.create(target_word=target_word, pos=pos, replacement_word=replacement_word)
        return Response({"message": "어휘 규칙이 성공적으로 추가되었습니다."}, status=status.HTTP_201_CREATED)

    elif request.method == 'PUT':
        # 기존 규칙 수정
        data = request.data
        target_word = data.get('target_word')
        pos = data.get('pos')
        replacement_word = data.get('replacement_word')

        if not target_word or not pos or not replacement_word:
            return Response({"error": "모든 필드를 입력해야 합니다."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rule = VocabularyRule.objects.get(target_word=target_word, pos=pos)
            rule.replacement_word = replacement_word
            rule.save()
            return Response({"message": "어휘 규칙이 성공적으로 수정되었습니다."}, status=status.HTTP_200_OK)
        except VocabularyRule.DoesNotExist:
            return Response({"error": "해당 규칙을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        # 규칙 삭제
        data = request.data
        target_word = data.get('target_word')
        pos = data.get('pos')

        if not target_word or not pos:
            return Response({"error": "target_word와 pos를 입력해야 합니다."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rule = VocabularyRule.objects.get(target_word=target_word, pos=pos)
            rule.delete()
            return Response({"message": "어휘 규칙이 성공적으로 삭제되었습니다."}, status=status.HTTP_200_OK)
        except VocabularyRule.DoesNotExist:
            return Response({"error": "해당 규칙을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def vocabulary_check(request, article_id):
    try:
        # 모델에서 기사 객체를 가져옴
        article = Article.objects.get(pk=article_id)
        original_draft = article.draft  # 원본 초안

        # 어휘 규칙 로딩
        vocabulary_rules = VocabularyRule.objects.all()

        # 규칙 매핑 생성
        rule_list = [
            {
                'target_word': rule.target_word,
                'replacement_word': rule.replacement_word,
                'pos': rule.pos
            }
            for rule in vocabulary_rules
        ]

        # Step 1: 교체 작업 수행 및 교체된 단어 추적
        corrected_text = original_draft
        correction_map = {}  # 교체된 단어 매핑 (key: target_word, value: replacement_word)

        for rule in rule_list:
            target_word = rule['target_word']
            replacement_word = rule['replacement_word']

            # 교체 작업 수행
            if target_word in corrected_text:
                correction_map[target_word] = replacement_word
                corrected_text = corrected_text.replace(target_word, replacement_word)

        # Step 2: 프롬프트 구성 (교체된 부분만 자연스럽게 수정 요청)
        prompt = f"""
        아래는 '어휘 교정 규칙'에 따라 문장을 수정하는 작업입니다.
        각 규칙은 다음과 같이 정의됩니다: [target_word - replacement_word - pos].
        target_word를 replacement_word로 교체한 후, 교체된 부분이 문맥상 어색하다면 품사(pos)를 고려하여 해당 부분만 자연스럽게 수정하세요.
        나머지 부분은 절대 수정하지 마세요.
        교정된 문장만 반환하세요.

        [어휘 교정 규칙]
        {', '.join([f"'{rule['target_word']}' ({rule['pos']}) -> '{rule['replacement_word']}'" for rule in rule_list])}

        [교체된 문장]
        {corrected_text}

        [원본 초안]
        {original_draft}
        """

        # GPT-3.5 API 호출
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        # GPT 응답에서 최종 교정된 텍스트 가져오기
        corrected_text = response['choices'][0]['message']['content'].strip()

        # Step 3: 교체된 단어 개수 카운트
        correction_count = sum(corrected_text.count(replacement) for replacement in correction_map.values())

        # Step 4: 강조 표시 (수정 전/후 비교)
        highlighted_original = original_draft
        highlighted_corrected = corrected_text

        for target_word, replacement_word in correction_map.items():
            # 강조 표시: target_word -> replacement_word
            highlighted_original = highlighted_original.replace(
                target_word, f'<span style="color: red;">{target_word}</span>'
            )
            highlighted_corrected = highlighted_corrected.replace(
                replacement_word, f'<span style="color: blue;">{replacement_word}</span>'
            )

        # Step 5: 최종 결과 반환
        return Response({
            'original_draft': highlighted_original,
            'corrected_text': highlighted_corrected,
            'correction_count': correction_count
        }, status=status.HTTP_200_OK)

    except Article.DoesNotExist:
        return Response({'error': '해당 기사를 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'어휘 교정 중 오류가 발생했습니다: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def satisfaction_survey(request):
    if request.method == 'POST':
        serializer = SurveySerializer(data=request.data)
        if serializer.is_vamymlid():
            serializer.save()
            return Response({'message': '만족도 조사가 성공적으로 제출되었습니다.', 'next_step': 'completion'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)