from django.shortcuts import render
from .models import ArticleTable
import MeCab
from sklearn.feature_extraction.text import TfidfVectorizer
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

# 형태소 분석기 초기화
mecab = MeCab.Tagger()
print("mecab 초기화")

# 형태소 분석 함수
def tokenize(text):
    parsed = mecab.parse(text)
    tokens = [line.split('\t')[0] for line in parsed.splitlines() if '\t' in line]
    return tokens

# ElasticSearch 클라이언트 연결 및 초기화
es = Elasticsearch(
    hosts=["http://localhost:9200"],
    http_auth=("elastic","CvqzzSwdo3mKDB9rPcY7"),
    verify_certs=False
)

if es.indices.exists(index="article_vectors"):
    es.indices.delete(index="article_vectors")
    print("기존 인덱스를 삭제했습니다.")

# 인덱스 생성
# TF-IDF 벡터의 차원 수를 지정하는 인덱스 매핑 설정
index_mapping = {
    "mappings" : {
        "properties" : {
            "vector" : {
                "type" : "dense_vector",
                "dims": 100, # vector dimension 100으로 설정
                "index": True,
                "similarity":"cosine",
                "index_options":{
                    "type":"int8_hnsw",
                    "m":16,
                    "ef_construction":100
                }
            }
        }
    }
}


if not es.indices.exists(index="article_vectors"):
    es.indices.create(index = "article_vectors", body=index_mapping)
else:
    print("index가 이미 존재합니다.")
# 매핑 정보 가져오기
mapping = es.indices.get_mapping(index="article_vectors")
print(mapping)
print("elasticserach 연결설정 완료")

def store_to_elasticsearch_bulk(ids, tfidf_matrix):
    dense_tfidf_matrix = tfidf_matrix.toarray()  # Convert to dense matrix

    actions = [
        {
            "_index": "article_vectors",
            "_id": doc_id,
            "_source": {
                "vector": dense_tfidf_matrix[i].tolist()
            }
        }
        for i, doc_id in enumerate(ids)
    ]

    # Bulk index the actions into Elasticsearch
    print("actions: ", actions)
    response = bulk(es, actions)
    print("bulk indexing is successful!!!")

    # Check for errors in the response
    if response[1] > 0:
        print(f"Bulk indexing had errors. Failed: {response[1]}")
    else:
        print("Bulk indexing successful!")



# 최초 저장만 수행
def store_vectors_once(data, ids, tfidf_matrix):
    if not es.indices.exists(index="article_vectors"):
        store_to_elasticsearch_bulk(ids, tfidf_matrix)
    else:
        print("Vectors already stored in Elasticsearch, skipping re-indexing.")


# 유사 기사 반환 함수
def show_similarity_aritlce(request):
    # 1) article data 가져오기
    data = ArticleTable.objects.all()
    ids = [record.id for record in data]
    titles = [record.Title for record in data]
    contents = [record.Content for record in data]
    links = [record.Link for record in data]
    print("fetching Article data.....")

    # 벡터화가 처음일 때만 Elasticsearch에 저장
    tokenized_contents = [' '.join(tokenize(content)) for content in contents]
    vectorizer = TfidfVectorizer(max_features=100)
    #tfidf-vector 학습
    tfidf_matrix = vectorizer.fit_transform(tokenized_contents)
    print("tfidf_matrix: ", tfidf_matrix)

    # if not es.indices.exists(index="article_vectors"):
    # store_to_elasticsearch_bulk(ids, tfidf_matrix)
    store_vectors_once(data, ids, tfidf_matrix)
    print("store_to_elasticsearch_bulk 함수 실행")

    # 내 쿼리 벡터
    text = "어깨가 아픈 원인 중 가장 흔한 것은 목 척추 질환이다. 잘못된 자세나 물리적인 충격 등 요인으로 목 척추관절이 변형되면 신경을 짓눌러 지긋지긋한 어깨 통증을 일으킨다. 목을 앞으로 빼는 자세가 되면 목뼈가 머리를 받쳐주는 대신 목 근육이 무거운 머리를 지탱하느라 목과 어깨 근육의 경직이 일어난다. 근육 경직은 목과 어깨 통증뿐 아니라 두통까지 유발한다. 또 머리의 무게가 앞으로 쏠리면 목 디스크나 척추관 협착증 등을 유발하는 일자목이 되기 쉽다. 어깨가 자주 뭉치고 아픈 증상으로 병원을 찾는 환자들의 경우 일자목이 흔하게 발견된다."
    my_tokenized_content = ' '.join(tokenize(text))
    my_tfidf_value = vectorizer.transform([my_tokenized_content]).toarray()[0]
    # my_tfidf_value logs
    print("my_tfidf_value: ", my_tfidf_value)
    print("my_tfidf_value 길이: ", len(my_tfidf_value))

    # 벡터가 모두 0인지 확인
    if not any(my_tfidf_value):
        print("입력한 텍스트로는 유의미한 결과를 찾을 수 없습니다.")
        return render(request, 'error_page.html', {'message': '입력한 텍스트로는 유의미한 결과를 찾을 수 없습니다.'})

   #search_query
    search_query = {
        "size": 5,
        "query": {
            "script_score": {
                "query": {
                    "match_all": {}
                },
               "script": {
                    "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0", 
                    "params": {
                        "query_vector": my_tfidf_value
                    }
                }
            }
        }
    }



    print("start requirements of similar search")
    # 유사도 검색 요청
    response = es.search(index="article_vectors", body=search_query)
    #doc_id = 12
    #response = es.get(index="article_vectors", id=doc_id)
    print("Response test: ", response)

    print("quit requirements of similar search")

    # 검색 결과에서 상위 5개의 id, title, content, link 가져오기
    top_results = []
    for hit in response['hits']['hits']:
        doc_id = hit['_id']
        title = titles[ids.index(int(doc_id))]
        content = contents[ids.index(int(doc_id))]
        link = links[ids.index(int(doc_id))]
        top_results.append({
            'id': doc_id,
            'title': title,
            'content': content,
            'link': link
        })

    print("Top 5 Similar Articles: ", top_results)
    # return top_results
    return render(request,'top_five.html',{'articles': top_results})
