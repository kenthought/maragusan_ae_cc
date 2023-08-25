# Generated by Django 4.2.2 on 2023-08-13 11:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('components', '0002_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Receivables',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('account_number', models.CharField(blank=True, editable=False, max_length=100, null=True, unique=True)),
                ('control_number', models.CharField(max_length=100)),
                ('account_name', models.CharField(max_length=100)),
                ('spouse_name', models.CharField(max_length=100)),
                ('credit_terms', models.IntegerField()),
                ('credit_limit', models.CharField(max_length=100)),
                ('contact_number1', models.CharField(max_length=100)),
                ('contact_number2', models.CharField(blank=True, max_length=100, null=True)),
                ('account_status', models.IntegerField(default=1)),
                ('purok_street', models.CharField(max_length=100)),
                ('supervisor', models.CharField(max_length=100)),
                ('assignment', models.CharField(max_length=100)),
                ('date_hired', models.CharField(max_length=100)),
                ('company_id_number', models.CharField(max_length=100)),
                ('work_contact_number', models.CharField(max_length=100)),
                ('employment_status', models.IntegerField()),
                ('bank_account_name', models.CharField(max_length=100)),
                ('bank_account_number', models.CharField(max_length=100)),
                ('bank_branch', models.CharField(max_length=100)),
                ('card_number', models.CharField(max_length=100)),
                ('card_pin', models.CharField(max_length=100)),
                ('send_to', models.IntegerField()),
                ('registered_name', models.CharField(max_length=100)),
                ('funds_account_number', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('agent', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables_agent', to='components.province')),
                ('bank', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables', to='components.bank')),
                ('barangay', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables', to='components.barangay')),
                ('co_maker', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables_co_maker', to='components.province')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables', to='components.company')),
                ('municipality', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables', to='components.municipality')),
                ('province', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables', to='components.province')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receivables', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]