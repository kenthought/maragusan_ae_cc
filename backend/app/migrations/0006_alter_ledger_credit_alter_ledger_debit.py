# Generated by Django 4.2.2 on 2023-07-05 02:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_alter_ledger_credit_alter_ledger_debit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ledger',
            name='credit',
            field=models.CharField(default=0, max_length=100),
        ),
        migrations.AlterField(
            model_name='ledger',
            name='debit',
            field=models.CharField(default=0, max_length=100),
        ),
    ]