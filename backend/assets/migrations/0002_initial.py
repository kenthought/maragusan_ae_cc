# Generated by Django 4.2.2 on 2023-09-16 10:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('components', '0001_initial'),
        ('assets', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='ledger',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='assets_ledger', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='depreciationledger',
            name='asset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='depreciation_ledger', to='assets.asset'),
        ),
        migrations.AddField(
            model_name='depreciationledger',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='depreciation_ledger', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='asset',
            name='asset_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='asset', to='components.assettype'),
        ),
        migrations.AddField(
            model_name='asset',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='asset', to=settings.AUTH_USER_MODEL),
        ),
    ]