import os

# MeCab 설치 경로 설정 (예시 경로)
mecab_dir = r"C:\Program Files\MeCab\bin"

# MeCab 실행 파일 경로 설정
mecab_path = os.path.join(mecab_dir, "mecab.exe")

# MeCab의 경로 출력
print(f"MeCab executable path: {mecab_path}")
