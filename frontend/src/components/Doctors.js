import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api/doctors/';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ first_name: '', last_name: '', specialty: '', email: '', phone: '', is_active: true });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    const res = await axios.get(API);
    setDoctors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}${editId}/`, form);
    } else {
      await axios.post(API, form);
    }
    setForm({ first_name: '', last_name: '', specialty: '', email: '', phone: '', is_active: true });
    setEditId(null);
    setShowForm(false);
    fetchDoctors();
  };

  const handleEdit = (doctor) => {
    setForm(doctor);
    setEditId(doctor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`${API}${id}/`);
      fetchDoctors();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>🩺 Doctors</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); }}>+ Add Doctor</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editId ? 'Edit Doctor' : 'Add Doctor'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
              <input placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
              <input placeholder="Specialty" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} required />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              <select value={form.is_active} onChange={e => setForm({...form, is_active: e.target.value === 'true'})}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
              <th>Specialty</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr><td colSpan="6" className="empty">No doctors found.</td></tr>
            ) : doctors.map(d => (
              <tr key={d.id}>
                <td>Dr. {d.first_name} {d.last_name}</td>
                <td>{d.specialty}</td>
                <td>{d.email}</td>
                <td>{d.phone}</td>
                <td><span className={d.is_active ? 'badge-active' : 'badge-inactive'}>{d.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(d)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Doctors;