import warnings
from elasticsearch import Elasticsearch
from konlpy.tag import Mecab
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

# DeprecationWarning 무시
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Elasticsearch 클라이언트 설정
es = Elasticsearch(
    hosts=["http://localhost:9200"],
    http_auth=('elastic', 'gjDZjADiFwv4xK=789CB')
)

# 데이터 전처리 및 Elasticsearch 인덱싱 함수
def preprocess_and_index(article_instance):
    mecab = Mecab(dicpath=r"C:/mecab/mecab-ko-dic-msvc/mecab-ko-dic")  # 올바른 사전 경로 지정
    tfidf_vectorizer = TfidfVectorizer(stop_words=None, min_df=1)  # stop_words 파라미터 비활성화 및 min_df 설정

    pos_tagged_content = ' '.join([word for word, pos in mecab.pos(article_instance.content)])
    # TF-IDF 벡터라이저로 피팅 및 변환
    tfidf_matrix = tfidf_vectorizer.fit_transform([pos_tagged_content])
    
    if not tfidf_vectorizer.vocabulary_:
        print(f"Empty vocabulary for article with title: {article_instance.title}")
        return

    tfidf_features = tfidf_vectorizer.get_feature_names_out()

    # Elasticsearch 인덱싱을 위한 문서 생성
    document = {
        '_op_type': 'index',
        '_index': 'articles',
        '_id': article_instance.id,  # Article 모델의 id를 Elasticsearch의 id로 사용
        'title': article_instance.title,
        'link': article_instance.link,
        'content': pos_tagged_content,  # 전처리된 content 사용
        'format': article_instance.format,
        'keywords': article_instance.keywords,
        'section': article_instance.section,
        'subsection': article_instance.subsection
    }

    # Elasticsearch에 데이터 인덱싱
    es.index(index='articles', id=article_instance.id, body=document)
