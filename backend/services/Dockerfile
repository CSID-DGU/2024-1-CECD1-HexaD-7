FROM python:3.7-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . /app
CMD ["python", "pororo_server.py"]
