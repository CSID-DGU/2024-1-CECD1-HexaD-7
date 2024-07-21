from django.db import models


class Articletable(models.Model):
    title = models.TextField(db_column='Title', blank=True, null=True)  # Field name made lowercase.    link = models.TextField(db_column='Link', blank=True, null=True)  # Field name made lowercase.  
    content = models.TextField(db_column='Content', blank=True, null=True)  # Field name made lowercase.
    format = models.TextField(db_column='Format', 
blank=True, null=True)  # Field name made lowercase.
    keywords = models.TextField(db_column='Keywords', blank=True, null=True)  # Field name made lowercase.
    section = models.TextField(db_column='Section', blank=True, null=True)  # Field name made lowercase.
    subsection = models.TextField(db_column='SubSection', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'articletable'
