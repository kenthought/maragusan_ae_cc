# Generated by Django 4.2.2 on 2023-08-13 11:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('components', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplier',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='supplier', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='schedule',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='schedule', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='province',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='province', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='municipality',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='municipality', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='frequency',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='frequency', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='expensescategory',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='expenses_category', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='company',
            name='frequency',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='company', to='components.frequency'),
        ),
        migrations.AddField(
            model_name='company',
            name='schedule',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='company', to='components.schedule'),
        ),
        migrations.AddField(
            model_name='company',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='company', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='barangay',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='barangay', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='bank',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bank', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='assettype',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='asset_type', to=settings.AUTH_USER_MODEL),
        ),
    ]
