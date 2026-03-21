from django.contrib import admin
from django.urls import path, include
from clinic.api_views import (
    PatientListCreateView, PatientDetailView,
    DoctorListCreateView, DoctorDetailView,
    AppointmentListCreateView, AppointmentDetailView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('clinic.urls')),

    # API endpoints
    path('api/patients/', PatientListCreateView.as_view(), name='api_patients'),
    path('api/patients/<int:pk>/', PatientDetailView.as_view(), name='api_patient_detail'),
    path('api/doctors/', DoctorListCreateView.as_view(), name='api_doctors'),
    path('api/doctors/<int:pk>/', DoctorDetailView.as_view(), name='api_doctor_detail'),
    path('api/appointments/', AppointmentListCreateView.as_view(), name='api_appointments'),
    path('api/appointments/<int:pk>/', AppointmentDetailView.as_view(), name='api_appointment_detail'),
]