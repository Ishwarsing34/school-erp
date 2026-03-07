import React, { useState } from 'react';
import { createStudent } from '../api';

const empty = { name: '', email: '', className: '', rollNumber: '', parentName: '', parentContact: '' };

export default function AddStudent({ setView }) {
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg('');
    for (const k of Object.keys(empty)) {
      if (!form[k]) { setMsg('All fields are required'); return; }
    }
    setLoading(true);
    try {
      await createStudent(form);
      setMsg('success');
      setForm(empty);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Add Student</div>
          <div className="page-subtitle">Enroll a new student</div>
        </div>
        <button className="btn btn-secondary" onClick={() => setView('students')}>← Back to List</button>
      </div>

      {msg === 'success' ? (
        <div className="alert alert-success">Student added successfully!</div>
      ) : msg ? (
        <div className="alert alert-error">{msg}</div>
      ) : null}

      <div className="card">
        <div className="card-title">Student Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="Riya Sharma" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="riya@school.edu" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Class / Grade</label>
            <input name="className" placeholder="10-A" value={form.className} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Roll Number</label>
            <input name="rollNumber" placeholder="2024001" value={form.rollNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="card-title" style={{ marginTop: 20 }}>Parent / Guardian</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Parent Name</label>
            <input name="parentName" placeholder="Anita Sharma" value={form.parentName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Parent Contact</label>
            <input name="parentContact" placeholder="+91 98765 43210" value={form.parentContact} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Adding...</> : '+ Enroll Student'}
          </button>
        </div>
      </div>
    </div>
  );
}
