from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Patient, Doctor, Appointment
from .forms import PatientForm, DoctorForm, AppointmentForm

def dashboard(request):
    context = {
        'patient_count': Patient.objects.count(),
        'doctor_count': Doctor.objects.count(),
        'appointment_count': Appointment.objects.count(),
        'recent_appointments': Appointment.objects.select_related('patient','doctor')[:5],
    }
    return render(request, 'clinic/dashboard.html', context)

# PATIENTS
def patient_list(request):
    patients = Patient.objects.all().order_by('-created_at')
    return render(request, 'clinic/patient_list.html', {'patients': patients})

def patient_create(request):
    form = PatientForm(request.POST or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Patient added successfully.')
        return redirect('patient_list')
    return render(request, 'clinic/patient_form.html', {'form': form, 'title': 'Add Patient'})

def patient_update(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    form = PatientForm(request.POST or None, instance=patient)
    if form.is_valid():
        form.save()
        messages.success(request, 'Patient updated.')
        return redirect('patient_list')
    return render(request, 'clinic/patient_form.html', {'form': form, 'title': 'Edit Patient'})

def patient_delete(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    if request.method == 'POST':
        patient.delete()
        messages.success(request, 'Patient deleted.')
        return redirect('patient_list')
    return render(request, 'clinic/confirm_delete.html', {'object': patient, 'type': 'Patient'})

# DOCTORS
def doctor_list(request):
    doctors = Doctor.objects.all()
    return render(request, 'clinic/doctor_list.html', {'doctors': doctors})

def doctor_create(request):
    form = DoctorForm(request.POST or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Doctor added.')
        return redirect('doctor_list')
    return render(request, 'clinic/doctor_form.html', {'form': form, 'title': 'Add Doctor'})

def doctor_update(request, pk):
    doctor = get_object_or_404(Doctor, pk=pk)
    form = DoctorForm(request.POST or None, instance=doctor)
    if form.is_valid():
        form.save()
        messages.success(request, 'Doctor updated.')
        return redirect('doctor_list')
    return render(request, 'clinic/doctor_form.html', {'form': form, 'title': 'Edit Doctor'})

def doctor_delete(request, pk):
    doctor = get_object_or_404(Doctor, pk=pk)
    if request.method == 'POST':
        doctor.delete()
        messages.success(request, 'Doctor deleted.')
        return redirect('doctor_list')
    return render(request, 'clinic/confirm_delete.html', {'object': doctor, 'type': 'Doctor'})

# APPOINTMENTS
def appointment_list(request):
    appointments = Appointment.objects.select_related('patient', 'doctor').all()
    return render(request, 'clinic/appointment_list.html', {'appointments': appointments})

def appointment_create(request):
    form = AppointmentForm(request.POST or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Appointment scheduled.')
        return redirect('appointment_list')
    return render(request, 'clinic/appointment_form.html', {'form': form, 'title': 'Schedule Appointment'})

def appointment_update(request, pk):
    appt = get_object_or_404(Appointment, pk=pk)
    form = AppointmentForm(request.POST or None, instance=appt)
    if form.is_valid():
        form.save()
        messages.success(request, 'Appointment updated.')
        return redirect('appointment_list')
    return render(request, 'clinic/appointment_form.html', {'form': form, 'title': 'Edit Appointment'})

def appointment_delete(request, pk):
    appt = get_object_or_404(Appointment, pk=pk)
    if request.method == 'POST':
        appt.delete()
        messages.success(request, 'Appointment deleted.')
        return redirect('appointment_list')
    return render(request, 'clinic/confirm_delete.html', {'object': appt, 'type': 'Appointment'})