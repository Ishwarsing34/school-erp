import React, { useEffect, useState } from 'react';
import { getStudents, getBooks, getIssues } from '../api';

export default function AdminDashboard({ setView }) {
  const [stats, setStats] = useState({ students: 0, books: 0, issued: 0 });

  useEffect(() => {
    Promise.all([getStudents(), getBooks(), getIssues({ returned: false })])
      .then(([s, b, i]) => setStats({ students: s.data.length, books: b.data.length, issued: i.data.length }))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Admin Dashboard</div>
          <div className="page-subtitle">System overview & management</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.students}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card" style={{ '--accent': 'var(--blue)' }}>
          <div className="stat-value">{stats.books}</div>
          <div className="stat-label">Books in Library</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.issued}</div>
          <div className="stat-label">Books Issued</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-title">Quick Actions — Students</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setView('add-student')}>+ Add New Student</button>
            <button className="btn btn-secondary" onClick={() => setView('students')}>View All Students</button>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Quick Actions — Library</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setView('add-book')}>+ Add New Book</button>
            <button className="btn btn-secondary" onClick={() => setView('issue-book')}>Issue a Book</button>
            <button className="btn btn-secondary" onClick={() => setView('issued-books')}>View Issued Books</button>
          </div>
        </div>
      </div>
    </div>
  );
}
