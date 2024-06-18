from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from savegeneratedarticle.models import Article
from .serializers import ArticleSerializer
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import os
import warnings
# from .documents import preprocess_and_index  # 주석 처리 (사용하지 않는 경우)

# DeprecationWarning 무시
warnings.filterwarnings("ignore", category=DeprecationWarning)

# MySQL 데이터베이스 연결 설정
user = 'article_user'
password = '1234'
host = 'localhost'  # 또는 다른 호스트
database = 'articlegenerator_db'

# SQLAlchemy 엔진 생성
engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}/{database}')

@api_view(['POST'])
def save_generated_article(request):
    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with engine.begin() as connection:
                # articles 테이블의 현재 행 개수를 가져옴
                result = connection.execute(text("SELECT COUNT(*) FROM articles"))
                count = result.scalar()

                # 새로운 ID 할당
                new_id = count + 1

                # Article 인스턴스를 생성하되, id 값을 직접 설정
                article_instance = Article(
                    id=new_id,
                    title=serializer.validated_data['title'],
                    link=serializer.validated_data['link'],
                    content=serializer.validated_data['content'],
                    format=serializer.validated_data['format'],
                    keywords=serializer.validated_data['keywords'],
                    section=serializer.validated_data['section'],
                    subsection=serializer.validated_data['subsection']
                )
                article_instance.save()

                # MySQL에 데이터 삽입
                connection.execute(text(
                    "INSERT INTO articles (id, title, link, content, format, keywords, section, subsection) "
                    "VALUES (:id, :title, :link, :content, :format, :keywords, :section, :subsection)"
                ), {
                    'id': new_id,
                    'title': article_instance.title,
                    'link': article_instance.link,
                    'content': article_instance.content,
                    'format': article_instance.format,
                    'keywords': article_instance.keywords,
                    'section': article_instance.section,
                    'subsection': article_instance.subsection
                })

                # 데이터베이스에 삽입된 데이터 확인 (Row 객체 활용)
                result = connection.execute(text("SELECT * FROM articles WHERE id = :id"), {'id': new_id})
                saved_article = result.fetchone()

                if saved_article:
                    # Elasticsearch에 인덱싱 (필요한 경우 주석 해제)
                    preprocess_and_index(article_instance)
                    
                    # Row 객체를 딕셔너리로 변환하여 응답 데이터 구성
                    article_data = saved_article._asdict()

                    return Response({"message": "성공"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "실패"}, status=status.HTTP_400_BAD_REQUEST)
        except SQLAlchemyError as e:
            return Response({"message": "실패"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "실패"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"message": "실패"}, status=status.HTTP_400_BAD_REQUEST)
