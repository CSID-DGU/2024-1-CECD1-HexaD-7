# Generated by Django 4.2.16 on 2024-11-26 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0002_vocabularyrule_alter_article_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vocabularyrule',
            name='correct_form',
        ),
        migrations.RemoveField(
            model_name='vocabularyrule',
            name='part_of_speech',
        ),
        migrations.AddField(
            model_name='vocabularyrule',
            name='pos',
            field=models.CharField(default='MAJ', help_text='The part of speech for the word.', max_length=50, verbose_name='Part of Speech'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='vocabularyrule',
            name='replacement_word',
            field=models.TextField(default='DEFAULT_REPLACEMENT', help_text='The corrected form of the target word.', verbose_name='Replacement Word'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='vocabularyrule',
            name='target_word',
            field=models.CharField(help_text='The word to be corrected.', max_length=100, verbose_name='Target Word'),
        ),
        migrations.AddConstraint(
            model_name='vocabularyrule',
            constraint=models.UniqueConstraint(fields=('target_word', 'pos'), name='unique_target_word_pos'),
        ),
        migrations.AlterModelTable(
            name='vocabularyrule',
            table='vocabulary_rule',
        ),
    ]