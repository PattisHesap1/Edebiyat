# Generated by Django 4.1.3 on 2023-04-07 16:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0017_vote_down_vote_up'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='votes',
        ),
    ]
