# API의 테스트를 작성할때 사용됨
from django.test import TestCase
from django.urls import reverse

class ArticleFeedbackTest(TestCase):
    def test_article_feedback_no_article_id(self):
        response = self.client.get(reverse('article_feedback'))
        self.assertEqual(response.status_code, 400)

    def test_article_feedback_with_article_id(self):
        response = self.client.get(reverse('article_feedback'), {'article_id': 1})
        self.assertEqual(response.status_code, 200)
        self.assertIn('feedback', response.json())
