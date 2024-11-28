from django.test import TestCase
# import pandas as pd
# import requests

# class NERApiTest(TestCase):

#     @staticmethod
#     def call_ner_api(text): 
#         """Flask 서버의 NER API에 POST 요청을 보냅니다."""
#         response = requests.post('http://localhost:5000/ner', json={'text': text})
#         if response.status_code == 200:
#             return response.json()
#         else:
#             return {"오류": f"NER 서비스로부터 응답을 받지 못했습니다. 상태 코드: {response.status_code}"}

#     @staticmethod
#     def process_ner(text):
#         ner_results = NERApiTest.call_ner_api(text)
        
#         if "오류" in ner_results:
#             print(ner_results["오류"])  # 오류 메시지 출력
#             return "", "", "", "", ""

#         processed_text = []
#         named_entities = []
#         org_entities = []
#         name_entities = []
#         term_entities = []

#         for item in ner_results:
#             word = item["word"]
#             label = item["label"]
#             processed_text.append(f"{label}({word})")
#             named_entities.append(word)

#             if label == "ORG":
#                 org_entities.append(word)
#             elif label == "NAME":
#                 name_entities.append(word)
#             elif label == "TERM":
#                 term_entities.append(word)

#         return (
#             " ".join(processed_text),
#             " ".join(named_entities),
#             " ".join(org_entities),
#             " ".join(name_entities),
#             " ".join(term_entities)
#         )

#     def test_process_ner(self):
#         # df = pd.read_csv("example_converted.csv")
#         df = pd.read_csv("/mnt/c/Users/2rayi/my_project/2024-1-CECD1-HexaD-7-new/backend/newsgenerator/textprocessor/example_converted.csv")

#         df[["processed", "NamedEntity", "ORG", "NAME", "TERM"]] = df["original"].apply(
#             lambda x: pd.Series(self.process_ner(x))
#         )
#         df.to_csv("개체_처리결과.csv", index=False, encoding="utf-8-sig")
#         print("CSV 파일 처리가 완료되었습니다. '개체_처리결과.csv' 파일을 확인하세요.")
