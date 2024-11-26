# pororo_server.py

import os

# MeCab 환경 변수 설정
os.environ['MECABRC'] = '/usr/local/etc/mecabrc'

from flask import Flask, request, jsonify
from pororo import Pororo

app = Flask(__name__)

# Pororo 라이브러리 초기화 전에 환경 설정 확인
print("MECABRC:", os.getenv('MECABRC'))

# 형태소 분석기 및 개체명 인식기 초기화
pos_tagger = Pororo(task="pos", lang="ko")
ner_tagger = Pororo(task="ner", lang="ko")

@app.route('/pos-tag', methods=['POST'])
def pos_tag():
    content = request.json
    text = content['text']
    tags = pos_tagger(text)
    return jsonify({'tags': tags})

# @app.route('/pos-tag', methods=['POST'])
# def pos_tag():
#     try:
#         content = request.json
#         text = content['text']
        
#         # Pororo POS 태깅 실행
#         tags = pos_tagger(text)
        
#         # 디버깅용 출력
#         print(f"DEBUG: Input text: {text}")  # 입력된 텍스트
#         print(f"DEBUG: Raw tags from Pororo: {tags}")  # Pororo에서 반환된 태그
        
#         # 반환 데이터가 예상과 다를 경우를 대비한 처리
#         if isinstance(tags, list):
#             # 리스트 내부 요소 확인
#             if len(tags) > 0 and isinstance(tags[0], str):
#                 print("DEBUG: Tags are strings, attempting to split...")
#                 formatted_tags = []
#                 for tag in tags:
#                     try:
#                         word, pos = tag.split("/")  # '/'로 구분된 경우 처리
#                         formatted_tags.append({"word": word, "pos": pos})
#                     except ValueError:
#                         print(f"WARNING: Malformed tag encountered: {tag}")
#             elif len(tags) > 0 and isinstance(tags[0], tuple):
#                 print("DEBUG: Tags are tuples, processing directly...")
#                 formatted_tags = [{"word": word, "pos": pos} for word, pos in tags]
#             else:
#                 print("DEBUG: Tags format is unexpected, returning raw tags.")
#                 formatted_tags = tags
#         else:
#             print("ERROR: Unexpected tags type, returning raw data.")
#             formatted_tags = {"error": f"Unexpected data format: {type(tags)}", "raw": tags}

#         return jsonify({'tags': formatted_tags})

#     except Exception as e:
#         # 예외 발생 시 에러 로그와 함께 반환
#         print(f"ERROR: Exception occurred during POS tagging: {str(e)}")
#         return jsonify({"error": str(e)}), 500

@app.route('/ner', methods=['POST'])
def ner():
    content = request.json
    text = content['text']
    entities = ner_tagger(text)
    return jsonify({'entities': entities})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


# from flask import Flask, request, jsonify
# from pororo import Pororo

# app = Flask(__name__)
# pos_tagger = Pororo(task="pos", lang="ko")
# ner_tagger = Pororo(task="ner", lang="ko")  # NER 객체 추가

# @app.route('/pos-tag', methods=['POST'])
# def pos_tag():
#     content = request.json
#     text = content['text']
#     tags = pos_tagger(text)
#     return jsonify({'tags': tags})

# @app.route('/ner', methods=['POST'])
# def ner():
#     content = request.json
#     text = content['text']
#     entities = ner_tagger(text)
#     return jsonify({'entities': entities})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)


# # from flask import Flask, request, jsonify
# # from pororo import Pororo

# # app = Flask(__name__)
# # pos_tagger = Pororo(task="pos", lang="ko")

# # @app.route('/pos-tag', methods=['POST'])
# # def pos_tag():
# #     content = request.json
# #     text = content['text']
# #     tags = pos_tagger(text)
# #     return jsonify({'tags': tags})

# # if __name__ == '__main__':
# #     app.run(host='0.0.0.0', port=5000, debug=True)
