from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer

@api_view(['POST'])
def save_generated_article(request):
    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "성공"}, status=status.HTTP_201_CREATED)
    return Response({"message": "실패"}, status=status.HTTP_400_BAD_REQUEST)
