# Generated by Django 4.2.2 on 2023-08-13 11:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("receivables", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="receivables",
            name="account_category",
            field=models.IntegerField(default="0"),
            preserve_default=False,
        ),
    ]