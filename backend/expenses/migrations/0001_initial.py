# Generated by Django 4.2.2 on 2023-08-01 11:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('components', '0005_supplier'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expenses',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('account_number', models.CharField(blank=True, editable=False, max_length=100, null=True, unique=True)),
                ('control_number', models.CharField(max_length=100)),
                ('account_name', models.CharField(max_length=100)),
                ('expenses_description', models.CharField(max_length=100)),
                ('account_status', models.IntegerField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expenses_category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='expenses', to='components.barangay')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='expenses', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
