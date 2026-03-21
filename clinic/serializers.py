from rest_framework import serializers
from .models import Patient, Doctor, Appointment

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

    def validate_email(self, value):
        if Patient.objects.filter(email=value).exists():
            if self.instance and self.instance.email == value:
                return value
            raise serializers.ValidationError("A patient with this email already exists.")
        return value

    def validate_phone(self, value):
        if not value.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        return value

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

    def validate_email(self, value):
        if Doctor.objects.filter(email=value).exists():
            if self.instance and self.instance.email == value:
                return value
            raise serializers.ValidationError("A doctor with this email already exists.")
        return value

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name  = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name} - {obj.doctor.specialty}"

    def validate_appointment_date(self, value):
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        return value