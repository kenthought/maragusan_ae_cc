from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin


# Create your models here.
class UserManager(BaseUserManager):
    use_in_migration = True

    def create_user(
        self, username, password, first_name, middle_name, last_name, **extra_fields
    ):
        if not username:
            raise ValueError("Username is Required")
        user = self.model(
            username=username,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, username, password, first_name, middle_name, last_name, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff = True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser = True")

        return self.create_user(
            username, password, first_name, middle_name, last_name, **extra_fields
        )


class UserData(AbstractUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, blank=True)
    business_code = models.CharField(max_length=100)
    branch = models.ForeignKey(
        "components.Municipality",
        related_name="user_branch",
        on_delete=models.PROTECT,
        null=True,
    )
    branch_code = models.CharField(default="00", max_length=100)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "first_name",
        "middle_name",
        "last_name",
        "business_code",
    ]

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.branch is not None:
            self.branch_code = str(self.branch.id).zfill(2)
            # You need to call save two times since the id value is not accessible at creation
            super().save()
