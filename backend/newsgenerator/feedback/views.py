import openai
from rest_framework.response import Response
from rest_framework import status
import requests
from rest_framework.decorators import api_view
from django.conf import settings
from .models import Article, Feedback, VocabularyRule
from .serializers import ArticleSerializer, FeedbackSerializer, VocabularyRuleSerializer, SurveySerializer
from django.http import JsonResponse
from django.utils.html import format_html
import difflib
from django.utils.html import escape
import json
from django.shortcuts import get_object_or_404
import logging

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
            model="gpt-4",
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
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        generated_article = response['choices'][0]['message']['content']

        # 생성된 기사 저장
        article.generated_article = generated_article
        article.save()

        return Response({'message': '기사가 성공적으로 생성되었습니다.', 'generated_article': generated_article}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'기사 생성 중 오류가 발생했습니다: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def spell_check(request, article_id):
    try:
        article = get_object_or_404(Article, pk=article_id)
        original_text = article.source_data
        logging.debug(f"원본 텍스트: {original_text}")

        # GPT-3.5 API 호출
        prompt = f"다음 문장의 맞춤법과 띄어쓰기만 정확하게 교정하라. 다른 건 수정하지마.:\n\n{original_text}"
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": "너는 맞춤법 검사기의 역할을 해야 돼."},
                      {"role": "user", "content": prompt}]
        )

        corrected_text = response.choices[0].message['content'].strip()
        logging.debug(f"교정된 텍스트: {corrected_text}")

        # 단어 단위로 비교하여 변경된 부분 강조
        s = difflib.SequenceMatcher(None, original_text.split(), corrected_text.split())
        highlighted_original = ""
        highlighted_corrected = ""
        correction_count = 0  # 수정된 단어 수 카운트

        for tag, i1, i2, j1, j2 in s.get_opcodes():
            if tag == "replace":
                highlighted_original += f'<span style="color: blue;">{escape(" ".join(original_text.split()[i1:i2]))}</span> '
                highlighted_corrected += f'<span style="color: red;">{escape(" ".join(corrected_text.split()[j1:j2]))}</span> '
                correction_count += 1  # 각 변경에 대해 1씩 추가
            elif tag == "equal":
                common_text = escape(" ".join(original_text.split()[i1:i2]))
                highlighted_original += common_text + " "
                highlighted_corrected += common_text + " "

        # 결과 반환
        return JsonResponse({
            'original_text': highlighted_original,
            'corrected_text': highlighted_corrected,
            'correction_count': correction_count,
        }, status=200)
    except Article.DoesNotExist:
        logging.error("기사를 찾을 수 없습니다.")
        return JsonResponse({'error': '기사를 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        logging.error(f"맞춤법 검사 중 오류 발생: {str(e)}")
        return JsonResponse({'error': f'맞춤법 검사 중 오류 발생: {str(e)}'}, status=500)

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
        #original_draft = article.draft  # 원본 초안
        original_draft = article.source_data  # 필드 이름 수정: draft -> source_data

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
        각 규칙은 다음과 같이 정의된다: [target_word - replacement_word - pos].
        target_word를 replacement_word로 교체한 후, 교체된 부분이 문맥상 어색하다면 품사(pos)를 고려하여 해당 부분만 자연스럽게 수정하세요.
        주의: 맞춤법 틀린거 있어도 이건 어휘 교정이라 절대 건들지마. 나머지 부분은 절대 수정하지 말고, 덧붙이는 문장 없이 교정된 문장만 반환하세요.

        [어휘 교정 규칙]
        {', '.join([f"'{rule['target_word']}' ({rule['pos']}) -> '{rule['replacement_word']}'" for rule in rule_list])}

        [교체된 문장]
        {corrected_text}

        [원본 초안]
        {original_draft}
        """

        # GPT-3.5 API 호출
        response = openai.ChatCompletion.create(
            model="gpt-4",
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