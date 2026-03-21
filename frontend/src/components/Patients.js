import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api/patients/';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    first_name: '', last_name: '', date_of_birth: '',
    gender: 'M', email: '', phone: '', address: '', blood_type: ''
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    const res = await axios.get(API);
    setPatients(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}${editId}/`, form);
    } else {
      await axios.post(API, form);
    }
    setForm({ first_name: '', last_name: '', date_of_birth: '', gender: 'M', email: '', phone: '', address: '', blood_type: '' });
    setEditId(null);
    setShowForm(false);
    fetchPatients();
  };

  const handleEdit = (patient) => {
    setForm(patient);
    setEditId(patient.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      await axios.delete(`${API}${id}/`);
      fetchPatients();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>👤 Patients</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); }}>
          + Add Patient
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editId ? 'Edit Patient' : 'Add Patient'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
              <input placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
              <input type="date" placeholder="Date of Birth" value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} required />
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              <select value={form.blood_type} onChange={e => setForm({...form, blood_type: e.target.value})}>
                <option value="">Blood Type</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Blood Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr><td colSpan="5" className="empty">No patients found.</td></tr>
            ) : patients.map(p => (
              <tr key={p.id}>
                <td>{p.first_name} {p.last_name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.blood_type || '-'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;