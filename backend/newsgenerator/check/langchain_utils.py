# check/langchain_utils.py
from langchain import OpenAI

class SpellChecker:
    def __init__(self, api_key):
        self.api = OpenAI(api_key=api_key)

    def check_spelling(self, text):
        # OpenAI API에 텍스트를 전송하여 맞춤법 검사
        response = self.api.Completion.create(
            engine="davinci-codex",
            prompt=f"Check the spelling and grammar of the following article: {text}",
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.7,
        )
        return response.choices[0].text.strip()

