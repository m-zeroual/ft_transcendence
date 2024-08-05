# Generated by Django 5.0.6 on 2024-07-26 23:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Tournament', '0007_player'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='stage',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='players', to='Tournament.stage'),
            preserve_default=False,
        ),
    ]
