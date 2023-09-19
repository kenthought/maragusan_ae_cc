# Generated by Django 4.2.2 on 2023-09-16 10:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('account_number', models.CharField(max_length=100, unique=True)),
                ('control_number', models.CharField(max_length=100)),
                ('account_name', models.CharField(max_length=100)),
                ('account_type', models.IntegerField()),
                ('bank_branch', models.CharField(max_length=100)),
                ('purok_street', models.CharField(max_length=100)),
                ('account_status', models.IntegerField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ledger',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('invoice_number', models.CharField(max_length=100)),
                ('particulars', models.CharField(max_length=100)),
                ('debit', models.CharField(default=0, max_length=100)),
                ('credit', models.CharField(default=0, max_length=100)),
                ('control_number', models.CharField(max_length=100)),
                ('trans_number', models.CharField(blank=True, editable=False, max_length=100, null=True, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bank_account', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bank_accounts_ledger', to='bank_accounts.bankaccount')),
            ],
        ),
    ]