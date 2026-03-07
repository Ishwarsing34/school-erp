import React, { useState } from 'react';
import { createAssignment } from '../api';

const empty = { title: '', description: '', className: '', dueDate: '' };

export default function CreateAssignment({ setView }) {
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg('');
    if (!form.title || !form.description || !form.className || !form.dueDate) {
      setMsg('All fields are required'); return;
    }
    setLoading(true);
    try {
      await createAssignment(form);
      setMsg('success');
      setForm(empty);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Create Assignment</div><div className="page-subtitle">Assign work to a class</div></div>
        <button className="btn btn-secondary" onClick={() => setView('assignments')}>← Back</button>
      </div>

      {msg === 'success' ? <div className="alert alert-success">Assignment created!</div>
        : msg ? <div className="alert alert-error">{msg}</div> : null}

      <div className="card">
        <div className="card-title">Assignment Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input name="title" placeholder="Chapter 5 Exercise" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Class / Grade</label>
            <input name="className" placeholder="10-A" value={form.className} onChange={handleChange} />
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea name="description" placeholder="Write a detailed description of the assignment..." value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input name="dueDate" type="date" min={today} value={form.dueDate} onChange={handleChange} />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Creating...</> : '✏️ Create Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}
