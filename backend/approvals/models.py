from django.db import models
from django.conf import settings


# Create your models here.
class Approval(models.Model):
    UNDER_APPROVAL = 0
    APPROVED = 1
    DISAPPROVED = 2

    APPROVAL_STATE = (
        (UNDER_APPROVAL, "Under approval"),
        (APPROVED, "Approved"),
        (DISAPPROVED, "Disapproved")
    )

    type = models.CharField(max_length=100)
    approval_type = models.CharField(max_length=100)
    module_id = models.IntegerField(blank=False, null=False)
    account_number = models.CharField(max_length=100)
    old_data = models.JSONField(blank=False, null=False)
    new_data = models.JSONField(blank=False, null=False)
    remarks = models.CharField(blank=True, null=True, max_length=300)
    state = models.IntegerField(choices=APPROVAL_STATE, default=UNDER_APPROVAL)
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="approval",
        blank=True,
        null=True,
        on_delete=models.PROTECT,
    )
    date_executed = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="approval_submitted",
        blank=False,
        null=False,
        on_delete=models.PROTECT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
