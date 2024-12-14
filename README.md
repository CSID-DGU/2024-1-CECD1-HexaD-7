# 생성형 AI를 활용한 헬스케어 기사작성 서비스 구축

## 프로젝트 설명 (Introduction)

헬스경향 신문사를 위한 AI 기반 기사 작성 보조 도구 개발 프로젝트입니다. 신입 기자들의 업무 효율성 증대 및 기사 작성 과정 교육, 즉각적인 피드백 제공을 목표로 합니다.

---

## 기능 요약 (Features)

### 기사 생성 기능

- **헬스경향 맞춤 기사 작성**: 동일 자료를 기반으로 헬스경향 스타일의 기사 작성.
- **팩트 체크**: 인물, 장소, 수치 정보 하이라이팅으로 검증.
- **유사 기사 검색**: Elasticsearch 기반 유사 기사 추천.

### 기사 피드백 기능

- **피드백 제공**: 기사 초안의 내용 및 형식 피드백.
- **어휘 규칙 관리**: 특정 어휘 및 문체 교정.
- **맞춤법 교정**: 정확성 강화를 위한 맞춤법 수정.

---

## 설치 방법 (Installation)

1. **GitHub에서 프로젝트 클론**:
   ```bash
   git clone https://github.com/CSID-DGU/2024-1-CECD1-HexaD-7.git
   ```
2. **환경 세팅**:
   - **WSL**: `Ubuntu-20.04`
   - **가상환경**: `conda` 사용
   - **Python 버전**:
     - `3.8` (주요 환경)
     - `3.7` (Docker 관련 환경)
3. **의존성 설치**:
   - **Frontend > newsgenerator 디렉토리**:
     ```bash
     npm install
     ```
     혹은
   ```bash
    yarn install
   ```
   - **Backend > newsgenerator 디렉토리**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Backend > services 디렉토리 (Docker 환경)**:
     ```bash
     pip install -r requirements.txt
     ```
4. **실행 준비**:
   **Frontend**
   **development server 실행**:
   `bash
  npm start
  `
   혹은
   `bash
  yarn start
  `
   **Frontend 배포 도메인**:
   테스트시 backend 서버를 local에서 실행 후 접속해야 함.
   `      khealths.com`

   **Backend**

   - 터미널을 2개로 나눠 실행:

     **터미널 1 (Python 3.7)**:

     - Docker 이미지 빌드:

     ```bash
     docker buildx build -t pororo-service --load .
     ```

     - Docker 컨테이너 실행:

     ```bash
     docker run -p 5000:5000 pororo-service
     ```

     **터미널 2 (Python 3.8)**:

     - Django 서버 실행:

     ```bash
     python manage.py runserver
     ```

---

## 사용 방법 (Usage)

1. **기사 초안 작성**:
   - 취재자료/보도자료 입력.
   - 헬스경향 스타일에 맞춰 초안 생성.
2. **피드백 반영**:
   - 자동으로 제공되는 피드백 및 교정 반영.
3. **최종 기사 저장**:
   - 작성된 기사를 저장하고 필요시 유사 기사 검색.

---

## 구조 (Project Structure)

- **`backend/newsgenerator/`**: 기사 생성 및 관련 로직.
- **`backend/services/`**: Docker 환경의 서비스 모듈.
- **`frontend/`**: 사용자 인터페이스 코드.
- **`database/`**: 데이터베이스 연동 스크립트.
- **`scripts/`**: 프로젝트 관련 유틸리티 스크립트.

---

## 기술 스택 (Technologies Used)

- **프로그래밍 언어**: Python
- **모델 및 라이브러리**:
  - GPT-4
  - Pororo (NER 및 맞춤법 교정)
  - py-hanspell
- **데이터베이스**: MySQL, Elasticsearch
- **도구**:
  - Docker
  - Django
  - Conda

---

## 기여 방법 (Contributing)

- PR(Pull Request)을 통해 기여 가능.
- 이슈 트래커에 버그 및 제안 등록.

---

## 라이선스 (License)

- MIT License

---

## 스크린샷/데모 (Screenshots/Demo)

- 프로젝트의 주요 기능에 대한 스크린샷 추가 예정.
- 시연 동영상 링크: [HexaD 데모 영상](https://youtu.be/as7a5aO0pQ4)

---

## 참고 자료 (References)

- [Pororo 라이브러리](https://github.com/kakaobrain/pororo)
- [py-hanspell](https://github.com/ssut/py-hanspell)
