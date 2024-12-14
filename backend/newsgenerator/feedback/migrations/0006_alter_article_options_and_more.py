# Generated by Django 4.2.16 on 2024-11-26 18:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0005_remove_vocabularyrule_unique_target_word_pos_consonant_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='article',
            options={},
        ),
        migrations.RenameField(
            model_name='article',
            old_name='article_type',
            new_name='content_category',
        ),
        migrations.RenameField(
            model_name='article',
            old_name='draft',
            new_name='source_data',
        ),
        migrations.AddField(
            model_name='article',
            name='ai_feedback',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='generated_article',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='literary',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='article',
            name='structure',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='article',
            name='style',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='article',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]