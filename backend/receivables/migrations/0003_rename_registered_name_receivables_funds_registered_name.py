# Generated by Django 4.2.2 on 2023-08-14 18:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('receivables', '0002_receivables_account_category'),
    ]

    operations = [
        migrations.RenameField(
            model_name='receivables',
            old_name='registered_name',
            new_name='funds_registered_name',
        ),
    ]