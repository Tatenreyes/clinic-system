import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import Appointments from './components/Appointments';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">🏥 ClinicMS</div>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/doctors">Doctors</Link>
            <Link to="/appointments">Appointments</Link>
          </div>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome to ClinicMS 🏥</h1>
      <p>Use the navigation above to manage patients, doctors, and appointments.</p>
    </div>
  );
}

export default App;