# Elasticsearch 검색 로직과 Django 뷰를 통해 데이터를 받아 처리하는 함수들. 
# 즉, 사용자이 입력을 받아 검색을 수행하고 결과를 반환하는 뷰 함수를 여기에 정의

from django.shortcuts import render 
from .models import Utf8Article
#from .search import serach_similar_articles

#from sklearn.feature_extraction.text import TfidfVectorizer
#import MeCab

#from elasticsearch import Elasticsearch

#es = Elasticsearch()



# mySQL에서 데이터 로딩
def post_view(request):
    posts = Utf8Article.objects.all()
    return render(request, 'index.html', {"posts":posts})

# 벡터를 elasticsearch에 저장

# articles = TextprocessorArticle.objects.all()
# from sklearn.feature_extraction.text import TfidfVectorizer
# import MeCab

# mecab = MeCab.Tagger()
# def tokenize(text):
#     return mecab.parse(text).split()

# tfidf_vectorizer = TfidfVectorizer(tokenizer=tokenize)
# corpus = [article.content for article in articles]
# tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

# # 벡터를 Elasticsearch에 저장
# for i, article in enumerate(articles):
#     vector = tfidf_matrix[i].toarray()[0].tolist()
#     es.index(index="articles", id=article.id, body={"content": article.content, "vector": vector})

# def search_similar_articles(input_text):
#     input_vector = tfidf_vectorizer.transform([input_text]).toarray()[0].tolist()
#     response = es.search(
#         index="articles",
#         body={
#             "query": {
#                 "script_score": {
#                     "query": {"match_all": {}},
#                     "script": {
#                         "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0",
#                         "params": {"query_vector": input_vector}
#                     }
#                 }
#             },
#             "size": 3
#         }
#     )
#     return [hit["_source"]["content"] for hit in response["hits"]["hits"]]
