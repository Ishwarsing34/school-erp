import React, { useEffect, useState } from 'react';
import { getAssignments, getSubmissions } from '../api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard({ setView }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assignments: 0, submitted: 0, evaluated: 0 });

  useEffect(() => {
    Promise.all([getAssignments(), getSubmissions()])
      .then(([a, s]) => setStats({
        assignments: a.data.length,
        submitted: s.data.length,
        evaluated: s.data.filter(x => x.status === 'evaluated').length,
      })).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Student Dashboard</div>
          <div className="page-subtitle">Welcome, {user?.name}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.assignments}</div>
          <div className="stat-label">Assignments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.submitted}</div>
          <div className="stat-label">Submitted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.evaluated}</div>
          <div className="stat-label">Graded</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-title">Assignments</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setView('assignments')}>View Assignments</button>
            <button className="btn btn-secondary" onClick={() => setView('submit-assignment')}>Submit Assignment</button>
            <button className="btn btn-secondary" onClick={() => setView('my-submissions')}>My Submissions & Grades</button>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Library</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setView('borrowed-books')}>My Borrowed Books</button>
          </div>
        </div>
      </div>
    </div>
  );
}
