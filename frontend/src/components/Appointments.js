import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api/appointments/';
const PATIENTS_API = 'http://127.0.0.1:8000/api/patients/';
const DOCTORS_API = 'http://127.0.0.1:8000/api/doctors/';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patient: '', doctor: '', appointment_date: '', reason: '', status: 'scheduled', notes: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [a, p, d] = await Promise.all([
      axios.get(API),
      axios.get(PATIENTS_API),
      axios.get(DOCTORS_API),
    ]);
    setAppointments(a.data);
    setPatients(p.data);
    setDoctors(d.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}${editId}/`, form);
    } else {
      await axios.post(API, form);
    }
    setForm({ patient: '', doctor: '', appointment_date: '', reason: '', status: 'scheduled', notes: '' });
    setEditId(null);
    setShowForm(false);
    fetchAll();
  };

  const handleEdit = (appt) => {
    setForm({
      patient: appt.patient,
      doctor: appt.doctor,
      appointment_date: appt.appointment_date.slice(0, 16),
      reason: appt.reason,
      status: appt.status,
      notes: appt.notes,
    });
    setEditId(appt.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`${API}${id}/`);
      fetchAll();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>📅 Appointments</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); }}>+ New Appointment</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editId ? 'Edit Appointment' : 'New Appointment'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <select value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} required>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
              </select>
              <select value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} required>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}</option>)}
              </select>
              <input type="datetime-local" value={form.appointment_date} onChange={e => setForm({...form, appointment_date: e.target.value})} required />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required />
              <input placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Save'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan="6" className="empty">No appointments found.</td></tr>
            ) : appointments.map(a => (
              <tr key={a.id}>
                <td>{a.patient_name}</td>
                <td>{a.doctor_name}</td>
                <td>{new Date(a.appointment_date).toLocaleString()}</td>
                <td>{a.reason}</td>
                <td>
                  <span className={`badge-${a.status}`}>{a.status}</span>
                </td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(a)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;