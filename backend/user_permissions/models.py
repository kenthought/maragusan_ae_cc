from django.db import models
from django.conf import settings


# Create your models here.
class UserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    permissions = models.JSONField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="permissions",
        on_delete=models.PROTECT,
    )
