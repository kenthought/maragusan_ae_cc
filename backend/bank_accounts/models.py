from django.db import models
from django.conf import settings


# Create your models here.
class BankAccount(models.Model):
    id = models.BigAutoField(primary_key=True)
    account_number = models.CharField(
        blank=True, null=True, max_length=100, editable=True, unique=True
    )
    control_number = models.CharField(max_length=100)
    account_name = models.CharField(max_length=100)
    account_type = models.IntegerField()
    bank = models.ForeignKey(
        "components.Bank", related_name="bank_accounts", on_delete=models.PROTECT
    )
    bank_branch = models.CharField(max_length=100)
    purok_street = models.CharField(max_length=100)
    barangay = models.ForeignKey(
        "components.Barangay", related_name="bank_accounts", on_delete=models.PROTECT
    )
    municipality = models.ForeignKey(
        "components.Municipality",
        related_name="bank_accounts",
        on_delete=models.PROTECT,
    )
    province = models.ForeignKey(
        "components.Province", related_name="bank_accounts", on_delete=models.PROTECT
    )
    account_status = models.IntegerField(default=1)
    under_approval = models.BooleanField(default=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="bank_accounts", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.account_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.account_number == None:
            self.account_number = str(self.id).zfill(5)
            # You need to call save two times since the id value is not accessible at creation
            super().save()


class Ledger(models.Model):
    id = models.BigAutoField(primary_key=True)
    invoice_number = models.CharField(max_length=100)
    particulars = models.CharField(max_length=100)
    debit = models.CharField(default=0, max_length=100)
    credit = models.CharField(
        default=0,
        max_length=100,
    )
    control_number = models.CharField(max_length=100)
    bank_account = models.ForeignKey(
        "bank_accounts.BankAccount",
        related_name="bank_accounts_ledger",
        on_delete=models.PROTECT,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="bank_accounts_ledger",
        on_delete=models.PROTECT,
    )
    trans_number = models.CharField(
        blank=True, null=True, max_length=100, editable=False, unique=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.trans_number == None:
            self.trans_number = str(self.id)
            # You need to call save two times since the id value is not accessible at creation
            super().save()
