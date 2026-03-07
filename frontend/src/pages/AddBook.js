import React, { useState } from 'react';
import { addBook } from '../api';

const empty = { title: '', author: '', isbn: '', quantity: '' };

export default function AddBook({ setView }) {
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg('');
    if (!form.title || !form.author || !form.isbn || !form.quantity) {
      setMsg('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await addBook({ ...form, quantity: Number(form.quantity) });
      setMsg('success');
      setForm(empty);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Add Book</div>
          <div className="page-subtitle">Add a new book to the library</div>
        </div>
        <button className="btn btn-secondary" onClick={() => setView('books')}>← Back to Books</button>
      </div>

      {msg === 'success' ? (
        <div className="alert alert-success">Book added to library!</div>
      ) : msg ? (
        <div className="alert alert-error">{msg}</div>
      ) : null}

      <div className="card">
        <div className="card-title">Book Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input name="title" placeholder="The Great Gatsby" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input name="author" placeholder="F. Scott Fitzgerald" value={form.author} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input name="isbn" placeholder="978-0-7432-7356-5" value={form.isbn} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input name="quantity" type="number" min="1" placeholder="5" value={form.quantity} onChange={handleChange} />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Adding...</> : '+ Add Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
