import React, { useEffect, useState } from 'react';
import { getBooks, getStudents, issueBook } from '../api';

export default function IssueBook() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ bookId: '', studentId: '', dueDate: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBooks().then(({ data }) => setBooks(data.filter(b => b.available > 0))).catch(() => {});
    getStudents().then(({ data }) => setStudents(data)).catch(() => {});
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg('');
    if (!form.bookId || !form.studentId || !form.dueDate) { setMsg('All fields are required'); return; }
    setLoading(true);
    try {
      await issueBook(form);
      setMsg('success');
      setForm({ bookId: '', studentId: '', dueDate: '' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Issue Book</div><div className="page-subtitle">Lend a book to a student</div></div>
      </div>

      {msg === 'success' ? <div className="alert alert-success">Book issued successfully!</div>
        : msg ? <div className="alert alert-error">{msg}</div> : null}

      <div className="card">
        <div className="card-title">Issue Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Select Book</label>
            <select name="bookId" value={form.bookId} onChange={handleChange}>
              <option value="">— Choose Book —</option>
              {books.map(b => <option key={b._id} value={b._id}>{b.title} ({b.available} left)</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Select Student</label>
            <select name="studentId" value={form.studentId} onChange={handleChange}>
              <option value="">— Choose Student —</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input name="dueDate" type="date" min={today} value={form.dueDate} onChange={handleChange} />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Issuing...</> : '↗ Issue Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
