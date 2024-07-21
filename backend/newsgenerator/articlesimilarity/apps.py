# from django.apps import AppConfig
# from elasticsearch import Elasticsearch
# from django.conf import settings

# es_client = Elasticsearch(settings.ELASTICSEARCH_DSL['default']['hosts'])

# class ArticlesimilarityConfig(AppConfig):
#     default_auto_field = "django.db.models.BigAutoField"
#     name = "articlesimilarity"

# from django.apps import AppConfig
# from elasticsearch import Elasticsearch
# #
# class ArticlesimilarityConfig(AppConfig):
#     name = 'articlesimilarity'

#     def ready(self):
#         es = Elasticsearch()
#         es.indices.create(
#             index="articles",
#             body={
#                 "settings": {"number_of_shards": 1},
#                 "mappings": {
#                     "properties": {
#                         "content": {"type": "text"},
#                         "vector": {"type": "dense_vector", "dims": 100}
#                     }
#                 }
#             },
#             ignore=400  # 이미 인덱스가 존재하는 경우 무시
#         )
#시작
# from django.apps import AppConfig
# import ssl
# from django.conf import settings
# from elasticsearch import Elasticsearch

# from urllib3 import disable_warnings
# from urllib3.exceptions import InsecureRequestWarning

# # 경고 메시지를 비활성화 (선택적)
# disable_warnings(InsecureRequestWarning)

# from django.apps import AppConfig
# import ssl
# from elasticsearch import Elasticsearch

# class ArticlesimilarityConfig(AppConfig):
#     name = 'articlesimilarity'

#     def ready(self):
#         # SSL 컨텍스트 생성
#         context = ssl.create_default_context(cafile="/path/to/cacert.pem")
#         # 인증서 검증 비활성화 시 다음 코드 사용
#         # context.check_hostname = False
#         # context.verify_mode = ssl.CERT_NONE

#         # Elasticsearch 클라이언트 초기화
#         es_client = Elasticsearch(
#             ['https://localhost:9200'],  # Elasticsearch 호스트
#             ssl_context=context
#         )

#         # 여기에 추가적인 초기화 코드를 배치할 수 있습니다.
#         # 예를 들어, Elasticsearch 인덱스를 생성하거나 업데이트하는 로직 등


#끝
# class ArticlesimilarityConfig(AppConfig):
#     name = 'articlesimilarity'

#     def ready(self):
#         # settings 모듈이 완전히 준비된 후 Elasticsearch 클라이언트를 초기화
#         es_client = Elasticsearch(
#     hosts=['https://localhost:9200'],  # 호스트 URL을 변경하세요
#     use_ssl=True,
#     verify_certs=False  # SSL 인증서 검증 비활성화
# )
#         es_client.indices.create(
#             index="articles",
#             body={
#                 "settings": {"number_of_shards": 1},
#                 "mappings": {
#                     "properties": {
#                         "content": {"type": "text"},
#                         "vector": {"type": "dense_vector", "dims": 100}
#                     }
#                 }
#             },
#             ignore=400  # 이미 인덱스가 존재하는 경우 무시
#         )
