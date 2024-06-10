from elasticsearch_dsl import Document, Text, Keyword

class ArticleDocument(Document):
    title = Text()
    content = Text()
    format = Keyword()
    keywords = Keyword()
    section = Keyword()
    subsection = Keyword()

    class Index:
        name = 'articles'
