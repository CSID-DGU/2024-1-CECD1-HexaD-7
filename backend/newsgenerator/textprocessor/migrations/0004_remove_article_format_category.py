# Generated by Django 4.2.16 on 2024-11-10 06:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('textprocessor', '0003_article_format_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='format_category',
        ),
    ]