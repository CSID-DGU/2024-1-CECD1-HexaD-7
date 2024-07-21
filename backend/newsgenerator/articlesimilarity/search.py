from elasticsearch import Elasticsearch
from sklearn.feature_extraction.text import TfidfVectorizer
import MeCab

def create_index():
    es = Elasticsearch()
    # 인덱스 생성
    es.indices.create(
        index="articles",
        body={
            "settings": {"number_of_shards": 1},
            "mappings": {
                "properties": {
                    "content": {"type": "text"},
                    "vector": {"type": "dense_vector", "dims": 100}
                }
            }
        },
        ignore=400  # 이미 인덱스가 존재하는 경우 무시
    )

def index_documents():
    from .models import Articletable
    articles = Articletable.objects.all()
    mecab = MeCab.Tagger()
    tfidf_vectorizer = TfidfVectorizer(tokenizer=lambda text: mecab.parse(text).split())

    corpus = [article.content for article in articles]
    tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

    es = Elasticsearch()
    for i, article in enumerate(articles):
        vector = tfidf_matrix[i].toarray()[0].tolist()
        es.index(index="articles", id=article.id, body={"content": article.content, "vector": vector})
