from django.db import models
from django.conf import settings


# Create your models here.
class Receivables(models.Model):
    id = models.BigAutoField(primary_key=True)
    account_number = models.CharField(
        blank=True, null=True, max_length=100, editable=True, unique=True
    )
    control_number = models.CharField(max_length=100)
    account_name = models.CharField(max_length=100)
    spouse_name = models.CharField(max_length=100)
    credit_terms = models.IntegerField()
    credit_limit = models.CharField(max_length=100)
    contact_number1 = models.CharField(max_length=100)
    contact_number2 = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    account_status = models.IntegerField(default=1)
    account_category = models.IntegerField()
    purok_street = models.CharField(max_length=100)
    barangay = models.ForeignKey(
        "components.Barangay", related_name="receivables", on_delete=models.PROTECT
    )
    co_maker = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name="receivables_co_maker", 
        on_delete=models.PROTECT
    )
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name="receivables_agent", 
        on_delete=models.PROTECT
    )
    company = models.ForeignKey(
        "components.Company",
        related_name="receivables",
        on_delete=models.PROTECT,
    )
    supervisor = models.CharField(max_length=100)
    assignment = models.CharField(max_length=100)
    date_hired = models.CharField(max_length=100)
    company_id_number = models.CharField(max_length=100)
    work_contact_number = models.CharField(max_length=100)
    employment_status = models.IntegerField()
    bank_account_name = models.CharField(max_length=100)
    bank_account_number = models.CharField(max_length=100)
    bank = models.ForeignKey(
        "components.Bank",
        related_name="receivables",
        on_delete=models.PROTECT,
    )
    bank_branch = models.CharField(max_length=100)
    card_number = models.CharField(max_length=100)
    card_pin = models.CharField(max_length=100)
    send_to = models.IntegerField()
    funds_registered_name = models.CharField(max_length=100)
    funds_account_number = models.CharField(max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="receivables", on_delete=models.PROTECT
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
    receivables = models.ForeignKey(
        "receivables.Receivables",
        related_name="receivables_ledger",
        on_delete=models.PROTECT,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="receivables_ledger",
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
