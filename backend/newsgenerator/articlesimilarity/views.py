# Elasticsearch 검색 로직과 Django 뷰를 통해 데이터를 받아 처리하는 함수들. 
# 즉, 사용자이 입력을 받아 검색을 수행하고 결과를 반환하는 뷰 함수를 여기에 정의

from django.shortcuts import render 
from .models import Utf8Article
from django.views.decorators.csrf import csrf_exempt
from konlpy.tag import Okt
import MeCab
from sklearn.feature_extraction.text import TfidfVectorizer
from elasticsearch import Elasticsearch
from newsgenerator.settings import ELASTICSEARCH_DSL
from .search import db
import logging
# MeCab 사전 경로 지정
# dic_path = 'C:/Program Files/MySQL/MySQL Server 8.0/lib/mecab/dic/ipadic_utf-8'
# try:
#     mecab = MeCab.Tagger(f'-d "{dic_path}"')
#     print("initialized successfully")
# except RuntimeError as e:
#     print("Fail: ", e)
# tfidf_vectorizer = TfidfVectorizer(tokenizer=lambda text: mecab.parse(text).split())
es = Elasticsearch(ELASTICSEARCH_DSL['default']['hosts'])
# # mySQL에서 데이터 로딩
# def post_view(request):
#     posts = Utf8Article.objects.all()
#     return render(request, 'index.html', {"posts":posts})
okt = Okt()
tfidf_vectorizer = TfidfVectorizer(tokenizer = lambda text: okt.morphs(text))

logger = logging.getLogger(__name__)

def initialize_corpus():
    from .search import db
    cursor = db.cursor()
    cursor.execute("SELECT content FROM utf8article")
    articles = cursor.fetchall()
    corpus = [article[0] for article in articles]
    tfidf_vectorizer.fit(corpus)
    logger.info("Corpus initialized and vectorizer trained.")

initialize_corpus()

#데이터 학습


@csrf_exempt
def search_articles(request):
    if request.method == 'POST':
        try:
            # 사용자가 index.html에서 제출한 텍스트 데이터 추출
            input_content = request.POST.get('content', '')
            # 텍스트를 벡터로 변환해 검색쿼리에 사용
            input_vector = tfidf_vectorizer.transform([input_content]).toarray()[0]

            response = es.search(
                index="articles",
                body={
                    "query": {
                        "script_score": {
                            "query": {"match_all": {}},
                            "script": {
                                "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0",
                                "params": {"query_vector": input_vector}
                            }
                        }
                    },
                    "size": 5
                }
            )
            results = [(hit['_source']['title'], hit['_source']['content']) for hit in response['hits']['hits']]
            return render(request, 'index.html', {'results': results})
        except Exception as e:
            logger.error("Error processing search request: %s", e)
            return render(request, 'index.html', {'error': 'Error processing your search request.'})

    return render(request, 'index.html')