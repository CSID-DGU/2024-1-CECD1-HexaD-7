import openai
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import Article, Feedback, VocabularyRule
from .serializers import ArticleSerializer, FeedbackSerializer, VocabularyRuleSerializer, SurveySerializer
#from pororo import Pororo
from hanspell import spell_checker
from django.utils.html import format_html
import difflib
from django.utils.html import escape
import json
import requests

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

# 어휘 규칙 데이터 베이스 아직...

# 메모리 내에서 어휘 규칙을 저장하는 예시
vocabulary_rules = {
    ("그러나", "MAJ"): "하지만",
    ("으므로", "EC"): "기에",
    # 추가 규칙을 여기에 계속 추가할 수 있습니다.
}

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


# @api_view(['GET'])
# def get_feedback(request, article_id):
#     try:
#         article = Article.objects.get(pk=article_id)  # 기사 객체를 조회

#         # 최신 OpenAI API를 이용하여 피드백 생성
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",  # 최신 모델 지정
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant that provides feedback on article drafts."},
#                 {"role": "user", "content": f"다음 기사 초안에 대한 피드백을 작성해 주세요:\n\n{article.draft}"}
#             ],
#             max_tokens=500,
#             n=1,
#             stop=None,
#             temperature=0.7,
#         )
#         feedback_text = response['choices'][0]['message']['content'].strip()  # GPT-3.5로부터 피드백 응답 받기

#         # Feedback 모델 인스턴스 생성 및 저장
#         Feedback.objects.create(article=article, feedback=feedback_text)

#         # 응답 데이터 생성 및 반환
#         return Response({
#             'ai_feedback': feedback_text,  # GPT-3.5로부터 받은 AI 피드백 내용
#             'message': 'AI 피드백이 제공되었습니다.'  # 응답 메시지
#         }, status=200)
#     except Article.DoesNotExist:
#         # 기사가 존재하지 않는 경우의 에러 처리
#         return Response({'error': '기사를 찾을 수 없습니다.'}, status=404)
#     except Exception as e:
#         # GPT-3.5 API 호출 중 오류가 발생한 경우의 에러 처리
#         return Response({'error': f'AI 피드백 생성 중 오류가 발생했습니다: {str(e)}'}, status=500)


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
def spell_check(request, article_id):
    try:
        article = Article.objects.get(pk=article_id)
        original_draft = article.draft  # 기사초안원문을 저장합니다.

        result = spell_checker.check(original_draft)
        if not result.result:
            return Response({'error': '맞춤법 검사를 처리할 수 없습니다. API 응답이 올바르지 않습니다.'}, status=500)

        corrected_draft = result.checked
        errors = result.errors

        # 원본과 교정본을 비교하여 변경된 부분을 강조합니다.
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

        article.draft = corrected_draft
        article.save()

        return Response({
            'original_draft': highlighted_original,
            'corrected_draft': highlighted_corrected,
            'correction_count': errors,
        }, status=200)
    except Article.DoesNotExist:
        return Response({'error': '해당 기사를 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        return Response({'error': f'맞춤법 검사 중 오류가 발생했습니다: {str(e)}'}, status=500)

@api_view(['POST'])
def vocabulary_check(request, article_id):
    try:
        article = Article.objects.get(pk=article_id)
        original_draft = article.draft

        # 품사 태깅 API 호출
        response = requests.post('http://localhost:5000/pos-tag', json={'text': original_draft})
        if response.status_code == 200:
            tagged_sentence = response.json()['tags']
            words = [word for word, tag in tagged_sentence]
            tags = [tag for word, tag in tagged_sentence]

            correction_count = 0
            highlighted_original = original_draft
            highlighted_corrected = original_draft

            # 어휘 교정 로직
            for word, tag in zip(words, tags):
                if (word, tag) in vocabulary_rules:
                    corrected_word = vocabulary_rules[(word, tag)]
                    highlighted_original = highlighted_original.replace(word, f"<span style='color: red;'>{word}</span>")
                    highlighted_corrected = highlighted_corrected.replace(word, f"<span style='color: blue;'>{corrected_word}</span>")
                    correction_count += 1

            # DB 업데이트
            article.draft = highlighted_corrected
            article.save()

            return Response({
                'original_draft': highlighted_original,
                'corrected_draft': highlighted_corrected,
                'correction_count': correction_count
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to get pos tags from Pororo service'}, status=response.status_code)

    except Article.DoesNotExist:
        return Response({'error': '해당 기사를 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error during vocabulary check:", str(e))
        return Response({'error': f'어휘 교정 중 오류가 발생했습니다: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def manage_vocabulary(request):
    if request.method == 'GET':
        # 모든 규칙을 [교정대상단어 / 품사 / 대체단어] 형식으로 반환
        formatted_rules = [
            {"target_word": key[0], "pos": key[1], "replacement_word": value}
            for key, value in vocabulary_rules.items()
        ]
        return Response(formatted_rules)

    elif request.method == 'POST':
        # 새로운 규칙을 추가
        data = request.data
        target_word = data['target_word']
        replacement_word = data['replacement_word']
        
        # 품사 태깅 API 호출
        response = requests.post('http://localhost:5000/pos-tag', json={'text': target_word})
        if response.status_code == 200:
            pos = response.json()['tags'][0][1]  # 첫 번째 단어의 품사만 사용
            vocabulary_rules[(target_word, pos)] = replacement_word
            return Response({'message': '어휘 규칙이 성공적으로 등록되었습니다.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': '품사 태깅 서비스 오류'}, status=response.status_code)

    elif request.method == 'PUT':
        try:
            data = request.data
            target_word = data['target_word']
            new_target_word = data.get('new_target_word', target_word)
            new_replacement_word = data.get('replacement_word', None)
            
            # 기존 품사 태깅
            response = requests.post('http://localhost:5000/pos-tag', json={'text': target_word})
            if response.status_code == 200:
                old_pos = response.json()['tags'][0][1]
                
                # 새 품사 태깅
                new_response = requests.post('http://localhost:5000/pos-tag', json={'text': new_target_word})
                if new_response.status_code == 200:
                    new_pos = new_response.json()['tags'][0][1]
                    
                    # 기존 규칙 삭제 및 새 규칙 추가
                    del vocabulary_rules[(target_word, old_pos)]
                    vocabulary_rules[(new_target_word, new_pos)] = new_replacement_word or vocabulary_rules[(target_word, old_pos)]
                    return Response({'message': '어휘 규칙이 성공적으로 업데이트되었습니다.'})
                else:
                    return Response({'error': '새 품사 태깅 서비스 오류'}, status=new_response.status_code)
            else:
                return Response({'error': '수정하려는 규칙을 찾을 수 없습니다.'}, status=response.status_code)
        except Exception as e:
            return Response({'error': f'어휘 규칙 업데이트 중 오류가 발생했습니다: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        # 규칙을 삭제
        data = request.data
        target_word = data['target_word']

        # 품사 태깅 API 호출
        response = requests.post('http://localhost:5000/pos-tag', json={'text': target_word})
        if response.status_code == 200:
            pos = response.json()['tags'][0][1]
            if (target_word, pos) in vocabulary_rules:
                del vocabulary_rules[(target_word, pos)]
                return Response({'message': '어휘 규칙이 성공적으로 삭제되었습니다.'})
            else:
                return Response({'error': '해당 어휘 규칙을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': '품사 태깅 서비스 오류'}, status=response.status_code)


# @api_view(['POST'])
# def vocabulary_check(request, article_id):
#     try:
#         article = Article.objects.get(pk=article_id)
#         original_draft = article.draft
#         correction_count = 0
#         highlighted_original = original_draft
#         highlighted_corrected = original_draft
#         # 전체 문장에 대해 품사 태깅
#         tagged_sentence = pos_tagger(original_draft)
#         words = [word for word, tag in tagged_sentence]
#         tags = [tag for word, tag in tagged_sentence]
#         print(tagged_sentence)  # 품사 태깅 결과를 확인하기 위해 출력
#         # 어휘 교정 로직
#         for word, tag in zip(words, tags):
#             if (word, tag) in vocabulary_rules:
#                 corrected_word = vocabulary_rules[(word, tag)]
#                 highlighted_original = highlighted_original.replace(word, f"<span style='color: red;'>{word}</span>")
#                 highlighted_corrected = highlighted_corrected.replace(word, f"<span style='color: blue;'>{corrected_word}</span>")
#                 correction_count += 1
#         # DB 업데이트
#         article.draft = highlighted_corrected
#         article.save()
#         return Response({
#             'original_draft': highlighted_original,
#             'corrected_draft': highlighted_corrected,
#             'correction_count': correction_count
#         }, status=200)
#     except Article.DoesNotExist:
#         return Response({'error': '해당 기사를 찾을 수 없습니다.'}, status=404)
#     except Exception as e:
#         print("Error during vocabulary check:", str(e))
#         return Response({'error': f'어휘 교정 중 오류가 발생했습니다: {str(e)}'}, status=500)

# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# def manage_vocabulary(request):
#     if request.method == 'GET':
#         # 모든 규칙을 [교정대상단어 / 품사 / 대체단어] 형식으로 반환
#         formatted_rules = [
#             {"target_word": key[0], "pos": key[1], "replacement_word": value}
#             for key, value in vocabulary_rules.items()
#         ]
#         return Response(formatted_rules)

#     elif request.method == 'POST':
#         # 새로운 규칙을 추가
#         data = request.data
#         target_word = data['target_word']
#         replacement_word = data['replacement_word']
        
#         # 품사 태깅
#         pos = pos_tagger(target_word)[0][1]  # 첫 번째 단어의 품사만 사용
#         vocabulary_rules[(target_word, pos)] = replacement_word
        
#         return Response({'message': '어휘 규칙이 성공적으로 등록되었습니다.'}, status=201)
    
#     elif request.method == 'PUT':
#         try:
#             data = request.data
#             target_word = data['target_word']
#             new_target_word = data.get('new_target_word', target_word)
#             new_replacement_word = data.get('replacement_word', None)
            
#             # 기존 품사 확인
#             old_pos = pos_tagger(target_word)[0][1]
#             if (target_word, old_pos) in vocabulary_rules:
#                 # 새 품사 태깅
#                 new_pos = pos_tagger(new_target_word)[0][1]
                
#                 # 기존 규칙 삭제
#                 del vocabulary_rules[(target_word, old_pos)]
                
#                 # 새 규칙 추가
#                 vocabulary_rules[(new_target_word, new_pos)] = new_replacement_word or vocabulary_rules[(target_word, old_pos)]
#                 return Response({'message': '어휘 규칙이 성공적으로 업데이트되었습니다.'})
#             else:
#                 return Response({'error': '수정하려는 규칙을 찾을 수 없습니다.'}, status=404)
#         except Exception as e:
#             return Response({'error': f'어휘 규칙 업데이트 중 오류가 발생했습니다: {str(e)}'}, status=500)

#     elif request.method == 'DELETE':
#         # 규칙을 삭제
#         data = request.data
#         target_word = data['target_word']
#         pos = pos_tagger(target_word)[0][1]
        
#         if (target_word, pos) in vocabulary_rules:
#             del vocabulary_rules[(target_word, pos)]
#             return Response({'message': '어휘 규칙이 성공적으로 삭제되었습니다.'})
#         else:
#             return Response({'error': '해당 어휘 규칙을 찾을 수 없습니다.'}, status=404)

@api_view(['POST'])
def satisfaction_survey(request):
    if request.method == 'POST':
        serializer = SurveySerializer(data=request.data)
        if serializer.is_vamymlid():
            serializer.save()
            return Response({'message': '만족도 조사가 성공적으로 제출되었습니다.', 'next_step': 'completion'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
