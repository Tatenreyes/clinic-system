from django.db import models

class Patient(models.Model):
    BLOOD_TYPE_CHOICES = [
        ('A+','A+'),('A-','A-'),('B+','B+'),('B-','B-'),
        ('AB+','AB+'),('AB-','AB-'),('O+','O+'),('O-','O-'),
    ]
    first_name    = models.CharField(max_length=100)
    last_name     = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender        = models.CharField(max_length=10, choices=[('M','Male'),('F','Female'),('O','Other')])
    email         = models.EmailField(unique=True)
    phone         = models.CharField(max_length=20)
    address       = models.TextField(blank=True)
    blood_type    = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Doctor(models.Model):
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    specialty  = models.CharField(max_length=100)
    email      = models.EmailField(unique=True)
    phone      = models.CharField(max_length=20)
    is_active  = models.BooleanField(default=True)

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} - {self.specialty}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    patient          = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor           = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    reason           = models.TextField()
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes            = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-appointment_date']

    def __str__(self):
        return f"{self.patient} with {self.doctor} on {self.appointment_date:%Y-%m-%d}"

class ClassifiedFile(models.Model):
    CLASSIFICATION_CHOICES = [
        ('top_secret', '🔴 TOP SECRET'),
        ('classified', '🟠 CLASSIFIED'),
        ('confidential', '🟡 CONFIDENTIAL'),
        ('restricted', '🔵 RESTRICTED'),
    ]
    STATUS_CHOICES = [
        ('active', 'ACTIVE'),
        ('leaked', 'LEAKED'),
        ('encrypted', 'ENCRYPTED'),
        ('deleted', 'DELETED - RECOVERED'),
    ]
    file_id        = models.CharField(max_length=20, unique=True)
    title          = models.CharField(max_length=200)
    subject        = models.CharField(max_length=200)
    classification = models.CharField(max_length=20, choices=CLASSIFICATION_CHOICES, default='classified')
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='encrypted')
    date_created   = models.DateField()
    agency         = models.CharField(max_length=100)
    content        = models.TextField()
    is_redacted    = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.file_id}] {self.title}"

    class Meta:
        verbose_name = '🗂️ Classified File'
        verbose_name_plural = '🗂️ Classified Files'