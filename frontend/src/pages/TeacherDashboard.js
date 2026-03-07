import React, { useEffect, useState } from 'react';
import { getAssignments, getSubmissions } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard({ setView }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assignments: 0, submissions: 0, evaluated: 0 });

  useEffect(() => {
    Promise.all([getAssignments(), getSubmissions()])
      .then(([a, s]) => {
        setStats({
          assignments: a.data.length,
          submissions: s.data.length,
          evaluated: s.data.filter(x => x.status === 'evaluated').length,
        });
      }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Teacher Dashboard</div>
          <div className="page-subtitle">Welcome back, {user?.name}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.assignments}</div>
          <div className="stat-label">My Assignments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.submissions}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.evaluated}</div>
          <div className="stat-label">Evaluated</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setView('create-assignment')}>+ Create Assignment</button>
            <button className="btn btn-secondary" onClick={() => setView('assignments')}>View My Assignments</button>
            <button className="btn btn-secondary" onClick={() => setView('submissions')}>Review Submissions</button>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Students</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setView('students')}>View All Students</button>
          </div>
        </div>
      </div>
    </div>
  );
}
