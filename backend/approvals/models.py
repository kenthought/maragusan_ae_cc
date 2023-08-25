from django.db import models
from django.conf import settings


# Create your models here.
class Approval(models.Model):
    type = models.CharField(max_length=100)
    module_id = models.IntegerField(blank=False, null=False)
    account_number = models.CharField(max_length=100)
    data = models.JSONField(blank=False, null=False)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="approval",
        blank=True,
        null=True,
        on_delete=models.PROTECT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
