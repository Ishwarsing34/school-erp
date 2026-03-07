import React, { useEffect, useState } from 'react';
import { getAssignments } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AssignmentList({ setView }) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignments()
      .then(({ data }) => setAssignments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isPast = (d) => new Date(d) < new Date();

  if (loading) return <div className="flex items-center gap-2" style={{ padding: 40 }}><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Assignments</div>
          <div className="page-subtitle">{assignments.length} assignment{assignments.length !== 1 ? 's' : ''}</div>
        </div>
        {user?.role === 'teacher' && (
          <button className="btn btn-primary" onClick={() => setView('create-assignment')}>+ Create</button>
        )}
        {user?.role === 'student' && (
          <button className="btn btn-primary" onClick={() => setView('submit-assignment')}>Submit Work</button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="icon">📄</div><p>No assignments yet</p></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {assignments.map(a => (
            <div key={a._id} className="card">
              <div className="flex items-center gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{a.title}</div>
                <span className="badge badge-blue">{a.className}</span>
                {isPast(a.dueDate) ? <span className="badge badge-red">Overdue</span> : <span className="badge badge-green">Active</span>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>{a.description}</p>
              <div className="flex gap-3" style={{ fontSize: 12, color: 'var(--text3)' }}>
                <span>📅 Due: <strong style={{ color: 'var(--text2)' }}>{new Date(a.dueDate).toLocaleDateString()}</strong></span>
                <span>👤 By: <strong style={{ color: 'var(--text2)' }}>{a.teacherId?.name}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
