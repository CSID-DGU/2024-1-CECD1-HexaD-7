# Python 기반 이미지 사용
FROM python:3.7-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    make \
    automake \
    unzip \
    libcurl4-openssl-dev  # libcurl 라이브러리 추가

# MeCab 설치 (한국어 처리를 위한 의존성)
RUN curl -LO --retry 5 --retry-delay 5 --retry-connrefused https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz && \
    tar zxfv mecab-0.996-ko-0.9.2.tar.gz && \
    cd mecab-0.996-ko-0.9.2 && \
    ./configure && make && make install && \
    ldconfig

# MeCab 한국어 사전 설치
RUN curl -LO --retry 5 --retry-delay 5 --retry-connrefused https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz && \
    tar zxfv mecab-ko-dic-2.1.1-20180720.tar.gz && \
    cd mecab-ko-dic-2.1.1-20180720 && \
    ./autogen.sh && \
    ./configure && make && make install

# mecabrc 파일 생성
RUN echo "dicdir = /usr/local/lib/mecab/dic/mecab-ko-dic" > /usr/local/etc/mecabrc
ENV MECABRC /usr/local/etc/mecabrc

# Python 라이브러리 설치
COPY requirements.txt ./ 
RUN pip install -r requirements.txt
RUN pip install python-mecab-ko pororo

# Pororo 모델을 사전 다운로드 (NER 모델)
RUN python -c "from pororo import Pororo; Pororo(task='ner', lang='ko')"

# 수정된 pos_tagging.py 파일 복사
COPY pos_tagging.py /usr/local/lib/python3.7/site-packages/pororo/tasks/pos_tagging.py


# 애플리케이션 파일 복사
COPY . .

# 서버 실행
CMD ["python", "pororo_server.py"]




# # Python 이미지를 가져옵니다.
# FROM python:3.7-slim

# # 작업 디렉토리 설정
# WORKDIR /app

# # 필수 파일 복사
# COPY requirements.txt ./

# # 필요한 Python 라이브러리 설치
# RUN pip install -r requirements.txt

# # python-mecab-ko 설치
# RUN pip install python-mecab-ko

# # MeCab 및 한국어 사전 설치에 필요한 패키지 설치
# RUN apt-get update && \
#     apt-get install -y gcc g++ curl make automake

# # MeCab 설치
# RUN curl -LO https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz && \
#     tar zxfv mecab-0.996-ko-0.9.2.tar.gz && \
#     cd mecab-0.996-ko-0.9.2 && \
#     ./configure && make && make install && \
#     ldconfig

# # MeCab 한국어 사전 설치
# RUN curl -LO https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz && \
#     tar zxfv mecab-ko-dic-2.1.1-20180720.tar.gz && \
#     cd mecab-ko-dic-2.1.1-20180720 && \
#     ./autogen.sh && \
#     ./configure && make && make install

# # 직접 mecabrc 파일 생성
# RUN echo "dicdir = /usr/local/lib/mecab/dic/mecab-ko-dic" > /usr/local/etc/mecabrc
# ENV MECABRC /usr/local/etc/mecabrc

# # 모든 파일 복사
# COPY . /app

# # 서버 실행
# CMD ["python", "pororo_server.py"]
