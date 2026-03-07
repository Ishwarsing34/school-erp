import React, { useEffect, useState } from 'react';
import { getAssignments, submitAssignment } from '../api';

export default function SubmitAssignment({ setView }) {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ assignmentId: '', submittedText: '', fileUrl: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAssignments().then(({ data }) => setAssignments(data)).catch(() => {});
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg('');
    if (!form.assignmentId) { setMsg('Please select an assignment'); return; }
    if (!form.submittedText && !form.fileUrl) { setMsg('Please provide your answer or a file URL'); return; }
    setLoading(true);
    try {
      await submitAssignment(form);
      setMsg('success');
      setForm({ assignmentId: '', submittedText: '', fileUrl: '' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const selected = assignments.find(a => a._id === form.assignmentId);

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Submit Assignment</div><div className="page-subtitle">Upload your work</div></div>
        <button className="btn btn-secondary" onClick={() => setView('assignments')}>← Back</button>
      </div>

      {msg === 'success' ? <div className="alert alert-success">Assignment submitted successfully!</div>
        : msg ? <div className="alert alert-error">{msg}</div> : null}

      <div className="card">
        <div className="card-title">Select Assignment</div>
        <div className="form-group mb-4">
          <label>Assignment</label>
          <select name="assignmentId" value={form.assignmentId} onChange={handleChange}>
            <option value="">— Choose Assignment —</option>
            {assignments.map(a => (
              <option key={a._id} value={a._id}>
                {a.title} · {a.className} · Due {new Date(a.dueDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {selected && (
          <div style={{ background: 'var(--bg3)', borderRadius: 4, padding: 14, marginBottom: 16, fontSize: 13 }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>{selected.title}</div>
            <div style={{ color: 'var(--text2)', lineHeight: 1.5 }}>{selected.description}</div>
          </div>
        )}

        <div className="card-title">Your Submission</div>
        <div className="form-group mb-4">
          <label>Answer / Notes</label>
          <textarea
            name="submittedText"
            placeholder="Write your answer here..."
            value={form.submittedText}
            onChange={handleChange}
            style={{ minHeight: 120 }}
          />
        </div>
        <div className="form-group mb-4">
          <label>File URL (optional)</label>
          <input name="fileUrl" placeholder="https://drive.google.com/..." value={form.fileUrl} onChange={handleChange} />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <><span className="spinner" /> Submitting...</> : '📤 Submit Assignment'}
        </button>
      </div>
    </div>
  );
}
