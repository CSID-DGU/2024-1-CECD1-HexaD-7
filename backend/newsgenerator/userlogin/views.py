from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class VerifyAccessCode(APIView):
    def post(self, request):
        access_code = request.data.get('access_code')
        if access_code == "000000": #임의코드
            return Response({'status': 'success', 'message': 'Access code verified successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'failure', 'error_code': 401, 'message': 'Invalid access code. Please check and try again.'}, status=status.HTTP_401_UNAUTHORIZED)
