# Generated by Django 4.2.13 on 2024-08-30 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0013_player_playerstats_stats_player'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stats',
            name='loss',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='stats',
            name='rank',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='stats',
            name='win',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
