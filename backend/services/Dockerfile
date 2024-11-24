# Dockerfile

# Python 이미지를 가져옵니다.
FROM python:3.7-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필수 파일 복사
COPY requirements.txt ./

# 필요한 Python 라이브러리 설치
RUN pip install -r requirements.txt

# python-mecab-ko 설치
RUN pip install python-mecab-ko

# MeCab 및 한국어 사전 설치
RUN apt-get update && \
    apt-get install -y gcc g++ curl && \
    curl -LO https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz && \
    tar zxfv mecab-0.996-ko-0.9.2.tar.gz && \
    cd mecab-0.996-ko-0.9.2 && \
    ./configure && make && make install && \
    ldconfig && \
    curl -LO https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz && \
    tar zxfv mecab-ko-dic-2.1.1-20180720.tar.gz && \
    cd mecab-ko-dic-2.1.1-20180720 && \
    ./autogen.sh && \
    ./configure && make && make install

# 직접 mecabrc 파일 생성
RUN echo "dicdir = /usr/local/lib/mecab/dic/mecab-ko-dic" > /usr/local/etc/mecabrc
ENV MECABRC /usr/local/etc/mecabrc

# 모든 파일 복사
COPY . /app

# 서버 실행
CMD ["python", "pororo_server.py"]



# FROM python:3.7-slim
# WORKDIR /app
# COPY requirements.txt ./
# RUN pip install -r requirements.txt
# COPY . /app
# CMD ["python", "pororo_server.py"]
