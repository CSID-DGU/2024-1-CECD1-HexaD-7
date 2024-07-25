# elasticsearch와의 상호작용을 처리하는 중앙 집중식 장소

# 1. Elasicsearch에 데이터 색인
# MySQL 데이터베이스에서 기사 데이터 가져오기
# 각 기사에 대해 mecab, tf-idf 방식으로 벡터화
# 벡터화된 데이터와 기사 제목 및 내용을 elasticsearch에 색인

from elasticsearch import Elasticsearch
from sklearn.feature_extraction.text import TfidfVectorizer
import MeCab
import mysql.connector
#from newsgenerator.settings import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ELASTICSEARCH_DSL
from newsgenerator.settings import  ELASTICSEARCH_DSL
from konlpy.tag import Okt

#Elasticsearch client 설정
es = Elasticsearch(
    ELASTICSEARCH_DSL['default']['hosts'],
    verify_certs=False,  # SSL 인증서 검증 비활성화
    http_auth=("elastic", "CvqzzSwdo3mKDB9rPcY7"),
)

#MySQL 연결 설정
db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="0000",
    database="articledb"
)

cursor = db.cursor()
cursor.execute("SELECT title, content, link FROM utf8article")
articles = cursor.fetchall()

#MeCab 및 TF-IDF 설정
# MeCab 사전 경로 지정
##dic_path = 'C:/Program Files/MySQL/MySQL Server 8.0/lib/mecab/dic/ipadic_utf-8'
#mecab = MeCab.Tagger(f'-d {dic_path}')
#tfidf_vectorizer = TfidfVectorizer(tokenizer = lambda text: mecab.parse(text).split())

okt = Okt()
tfidf_vectorizer = TfidfVectorizer(tokenizer = lambda text: okt.morphs(text))
#데이터 색인
corpus = [article[1] for article in articles]
tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

for i, article in enumerate(articles):
    vector = tfidf_matrix[i].toarray()[0].tolist()
    doc = {
        'title': article[0],
        'content': article[1],
        'vector': vector
    }
    es.index(index='articles', body=doc)# 데이터 확인 및 학습
print("Data indexing completed successfully.")

# corpus = []
# for article in articles:
#     if len(article) < 2:
#         print(f"Skipping incomplete article: {article}")
#         continue
#     corpus.append(article[1])

# tfidf_vectorizer.fit(corpus)

# 데이터 색인
# for i, article in enumerate(articles):
#     if len(article) < 2:
#         continue
#     vector = tfidf_matrix[i].toarray()[0].tolist() # type: ignore
#     doc = {
#         'title': article[0],
#         'content': article[1],
#         'vector': vector
#     }
#     es.index(index='articles', body=doc)

# print("Data indexing completed successfully.")