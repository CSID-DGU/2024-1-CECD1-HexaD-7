# Generated by Django 4.2.16 on 2024-11-07 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('textprocessor', '0002_rename_format_article_content_category_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='format_category',
            field=models.CharField(default='기본 형식', max_length=100),
        ),
    ]
