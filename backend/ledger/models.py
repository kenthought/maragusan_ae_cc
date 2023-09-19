from django.db import models
from django.conf import settings


# Create your models here.
class LedgerCode(models.Model):
    id = models.BigAutoField(primary_key=True)
    ledger = models.CharField(max_length=100)
    module_id = models.IntegerField()
    code = models.CharField(
        blank=True, null=True, max_length=100, editable=False, unique=True
    )

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.code == None:
            self.code = str(self.id).zfill(3)
            # You need to call save two times since the id value is not accessible at creation
            super().save()
