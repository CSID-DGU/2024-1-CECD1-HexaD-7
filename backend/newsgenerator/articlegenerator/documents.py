from elasticsearch_dsl import Document, Text, Keyword

from elasticsearch_dsl.connections import connections

# Elasticsearch 연결 설정
connections.create_connection(
    hosts=['http://elastic:your_password@localhost:9200'],
    http_auth=('elastic', 'gjDZjADiFwv4xK=789CB'))                   #이 부분 수정함

class ArticleDocument(Document):
    title = Text()
    content = Text()
    format = Keyword()
    keywords = Keyword()
    section = Keyword()
    subsection = Keyword()

    class Index:
        name = 'articles'
