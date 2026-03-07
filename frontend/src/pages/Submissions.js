import React, { useEffect, useState } from 'react';
import { getSubmissions, evaluateSubmission } from '../api';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [marks, setMarks] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const { data } = await getSubmissions();
      setSubmissions(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEvaluate = async (id) => {
    if (marks === '') { setMsg('Enter marks'); return; }
    try {
      await evaluateSubmission(id, { marks: Number(marks) });
      setEvaluating(null);
      setMarks('');
      setMsg('Marked!');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  const statusBadge = (s) => {
    if (s === 'evaluated') return <span className="badge badge-green">Evaluated</span>;
    if (s === 'late') return <span className="badge badge-red">Late</span>;
    return <span className="badge badge-amber">Submitted</span>;
  };

  if (loading) return <div className="flex items-center gap-2" style={{ padding: 40 }}><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Submissions</div><div className="page-subtitle">{submissions.length} total</div></div>
      </div>

      {msg && <div className="alert alert-success" style={{ marginBottom: 16 }}>{msg}</div>}

      <div className="card">
        {submissions.length === 0 ? (
          <div className="empty-state"><div className="icon">📥</div><p>No submissions yet</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Assignment</th><th>Student</th><th>Class</th><th>Submitted</th><th>Status</th><th>Marks</th><th>Action</th></tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s._id}>
                    <td className="td-name">{s.assignmentId?.title}</td>
                    <td>{s.studentId?.name}</td>
                    <td><span className="badge badge-blue">{s.studentId?.className}</span></td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td className="mono">{s.marks !== null && s.marks !== undefined ? s.marks : '—'}</td>
                    <td>
                      {evaluating === s._id ? (
                        <div className="flex gap-2 items-center">
                          <input type="number" placeholder="0-100" value={marks}
                            onChange={e => setMarks(e.target.value)}
                            style={{ width: 70, padding: '4px 8px' }} />
                          <button className="btn btn-sm btn-primary" onClick={() => handleEvaluate(s._id)}>Save</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEvaluating(null)}>✕</button>
                        </div>
                      ) : (
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEvaluating(s._id); setMarks(''); }}>
                          Grade
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
    </div>
  );
}
