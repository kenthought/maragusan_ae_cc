# Generated by Django 4.2.2 on 2023-07-05 00:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_ledger'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ledger',
            name='credit',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='ledger',
            name='debit',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
