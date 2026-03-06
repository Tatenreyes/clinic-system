from django.contrib import admin
from django.utils.html import format_html
from .models import Patient, Doctor, Appointment, ClassifiedFile

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'phone', 'blood_type']
    search_fields = ['first_name', 'last_name', 'email']

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'specialty', 'email', 'is_active']
    search_fields = ['first_name', 'last_name', 'specialty']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'appointment_date', 'status']
    search_fields = ['patient__first_name', 'doctor__first_name']
    list_filter = ['status']

@admin.register(ClassifiedFile)
class ClassifiedFileAdmin(admin.ModelAdmin):
    list_display = ['file_id', 'colored_title', 'agency', 'classification_badge', 'status_badge', 'date_created', 'is_redacted']
    search_fields = ['file_id', 'title', 'subject', 'agency']
    list_filter = ['classification', 'status', 'is_redacted']
    readonly_fields = ['file_id_display', 'redacted_content']
    ordering = ['-date_created']

    fieldsets = (
        ('🔐 FILE IDENTIFICATION', {
            'fields': ('file_id', 'title', 'subject', 'agency', 'date_created'),
        }),
        ('⚠️ CLASSIFICATION', {
            'fields': ('classification', 'status', 'is_redacted'),
        }),
        ('📄 CONTENT', {
            'fields': ('content', 'redacted_content'),
        }),
    )

    def colored_title(self, obj):
        return format_html('<strong style="color:#ff4444;">{}</strong>', obj.title)
    colored_title.short_description = 'Title'

    def classification_badge(self, obj):
        colors = {
            'top_secret': '#ff0000',
            'classified': '#ff6600',
            'confidential': '#ffcc00',
            'restricted': '#0099ff',
        }
        color = colors.get(obj.classification, '#ffffff')
        return format_html(
            '<span style="background:{};color:black;padding:2px 8px;border-radius:4px;font-weight:bold;font-size:0.75rem;">{}</span>',
            color, obj.get_classification_display()
        )
    classification_badge.short_description = 'Classification'

    def status_badge(self, obj):
        colors = {
            'active': '#00ff41',
            'leaked': '#ff0000',
            'encrypted': '#ffcc00',
            'deleted': '#ff6600',
        }
        color = colors.get(obj.status, '#ffffff')
        return format_html(
            '<span style="color:{};font-weight:bold;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def redacted_content(self, obj):
        if obj.is_redacted:
            words = obj.content.split()
            redacted = ' '.join(
                '█████' if i % 3 == 0 else word
                for i, word in enumerate(words)
            )
            return format_html(
                '<div style="background:#000;color:#00ff41;padding:12px;font-family:monospace;border:1px solid #00ff41;">'
                '<p style="color:#ff0000;margin-bottom:8px;">⚠️ DOCUMENT PARTIALLY REDACTED - CLEARANCE LEVEL INSUFFICIENT</p>'
                '{}</div>', redacted
            )
        return format_html(
            '<div style="background:#000;color:#00ff41;padding:12px;font-family:monospace;border:1px solid #00ff41;">{}</div>',
            obj.content
        )
    redacted_content.short_description = '📄 Redacted Content Preview'

    def file_id_display(self, obj):
        return format_html(
            '<span style="font-family:monospace;font-size:1.2rem;color:#ff0000;font-weight:bold;">{}</span>',
            obj.file_id
        )
    file_id_display.short_description = 'File ID'