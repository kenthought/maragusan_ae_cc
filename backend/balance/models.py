from django.db import models
from django.conf import settings


# Create your models here.
class Balance(models.Model):
    type = models.CharField(max_length=100)
    module_id = models.IntegerField()
    balance = models.FloatField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="balance",
        on_delete=models.PROTECT,
    )
    updated_at = models.CharField(max_length=100)
