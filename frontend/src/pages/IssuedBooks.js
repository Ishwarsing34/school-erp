import React, { useEffect, useState } from 'react';
import { getIssues, returnBook } from '../api';

export default function IssuedBooks() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = filter === 'active' ? { returned: false } : filter === 'returned' ? { returned: true } : {};
      const { data } = await getIssues(params);
      setIssues(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const handleReturn = async (id) => {
    try {
      await returnBook(id);
      setMsg('Book marked as returned!');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to return book');
    }
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Issued Books</div><div className="page-subtitle">Track all book loans</div></div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="tabs">
        {['active', 'returned', 'all'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="flex items-center gap-2"><div className="spinner" /> Loading...</div> : (
        <div className="card">
          {issues.length === 0 ? (
            <div className="empty-state"><div className="icon">📋</div><p>No records found</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Book</th><th>Student</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {issues.map(i => (
                    <tr key={i._id}>
                      <td className="td-name">{i.bookId?.title}</td>
                      <td>{i.studentId?.name} <span className="mono" style={{ color: 'var(--text3)', fontSize: 11 }}>#{i.studentId?.rollNumber}</span></td>
                      <td>{new Date(i.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(i.dueDate).toLocaleDateString()}</td>
                      <td>
                        {i.returned
                          ? <span className="badge badge-green">Returned</span>
                          : isOverdue(i.dueDate)
                          ? <span className="badge badge-red">Overdue</span>
                          : <span className="badge badge-amber">Active</span>}
                      </td>
                      <td>
                        {!i.returned && (
                          <button className="btn btn-sm btn-secondary" onClick={() => handleReturn(i._id)}>
                            Mark Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
