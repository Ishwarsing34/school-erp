import React, { useEffect, useState } from 'react';
import { getSubmissions } from '../api';

export default function MySubmissions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissions().then(({ data }) => setSubs(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    if (s === 'evaluated') return <span className="badge badge-green">Graded</span>;
    if (s === 'late') return <span className="badge badge-red">Late</span>;
    return <span className="badge badge-amber">Submitted</span>;
  };

  if (loading) return <div className="flex items-center gap-2" style={{ padding: 40 }}><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">My Submissions</div><div className="page-subtitle">{subs.length} submissions</div></div>
      </div>

      <div className="card">
        {subs.length === 0 ? (
          <div className="empty-state"><div className="icon">📋</div><p>No submissions yet. Submit your first assignment!</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Assignment</th><th>Class</th><th>Submitted On</th><th>Status</th><th>Marks</th></tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s._id}>
                    <td className="td-name">{s.assignmentId?.title}</td>
                    <td><span className="badge badge-blue">{s.assignmentId?.className}</span></td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td className="mono">
                      {s.marks !== null && s.marks !== undefined
                        ? <strong style={{ color: 'var(--amber)' }}>{s.marks}/100</strong>
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
