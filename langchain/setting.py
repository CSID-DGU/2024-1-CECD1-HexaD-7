INSTALLED_APPS = [
    'check',
    'newsgenerator'
]

MIDDLEWARE = [
    
    'corsheaders.middleware.CorsMiddleware',
    
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React 앱이 실행되는주소
]
