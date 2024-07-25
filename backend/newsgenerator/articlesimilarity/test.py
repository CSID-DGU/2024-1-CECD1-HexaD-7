# from sklearn.feature_extraction.text import TfidfVectorizer
# from konlpy.tag import Okt

# okt = Okt()
# # 불용어 리스트 정의
# stop_words = ['의', '가', '이', '은', '들', '는', '좀', '잘', '걍', '과', '도', '를', '으로', '자', '에', '와', '한', '하다']

# # TF-IDF 벡터라이저 초기화
# tfidf_vectorizer = TfidfVectorizer(tokenizer=lambda text: okt.morphs(text), stop_words=stop_words)

# # 샘플 데이터
# corpus = [
#     "한국어 분석을 시작합니다.",
#     "재미있는 텍스트 분석!",
#     "텍스트 마이닝과 데이터 분석"
# ]

# # 벡터라이저 학습
# tfidf_vectorizer.fit(corpus)

# # 학습된 단어 사전 출력
# print(tfidf_vectorizer.vocabulary_)
