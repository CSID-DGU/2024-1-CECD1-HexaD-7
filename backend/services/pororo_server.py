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
