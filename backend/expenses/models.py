from django.db import models
from django.conf import settings

# Create your models here.


class Expenses(models.Model):
    id = models.BigAutoField(primary_key=True)
    account_number = models.CharField(
        blank=True, null=True, max_length=100, editable=False, unique=True
    )
    control_number = models.CharField(max_length=100)
    account_name = models.CharField(max_length=100)
    expenses_description = models.CharField(max_length=100)
    expenses_category = models.ForeignKey(
        "components.ExpensesCategory", related_name="expenses", on_delete=models.PROTECT
    )
    account_status = models.IntegerField(default=1)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="expenses", on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.account_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.account_number == None:
            self.account_number = "000" + str(self.id)
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
    expenses = models.ForeignKey(
        "expenses.Expenses",
        related_name="expenses_ledger",
        on_delete=models.PROTECT,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="expenses_ledger",
        on_delete=models.PROTECT,
    )
    trans_number = models.CharField(
        blank=True, null=True, max_length=100, editable=False, unique=True
    )
    receipt_type = models.IntegerField(default=1)
    receipt_date = models.DateTimeField(
        blank=True,
        null=True,
    )
    supplier = models.ForeignKey(
        "components.Supplier",
        related_name="expenses_ledger",
        on_delete=models.PROTECT,
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
