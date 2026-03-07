import React, { useEffect, useState } from 'react';
import { getStudents, updateStudent } from '../api';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const { data } = await getStudents();
      setStudents(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (s) => { setEditing(s._id); setEditForm(s); setMsg(''); };
  const cancelEdit = () => { setEditing(null); setEditForm({}); };

  const saveEdit = async () => {
    try {
      await updateStudent(editing, editForm);
      setMsg('Student updated!');
      setEditing(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div className="flex items-center gap-2" style={{ padding: 40 }}><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Students</div>
          <div className="page-subtitle">{students.length} enrolled</div>
        </div>
      </div>

      {msg && <div className={`alert ${msg.includes('updated') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      {editing && (
        <div className="card mb-4">
          <div className="card-title">Edit Student</div>
          <div className="form-grid">
            {['name','email','className','rollNumber','parentName','parentContact'].map(f => (
              <div key={f} className="form-group">
                <label>{f.replace(/([A-Z])/g,' $1')}</label>
                <input value={editForm[f] || ''} onChange={e => setEditForm({...editForm, [f]: e.target.value})} />
              </div>
            ))}
          </div>
          <div className="flex gap-2" style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        {students.length === 0 ? (
          <div className="empty-state"><div className="icon">👥</div><p>No students enrolled yet</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Class</th><th>Roll No.</th>
                  <th>Parent</th><th>Contact</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td className="td-name">{s.name}</td>
                    <td>{s.email}</td>
                    <td><span className="badge badge-blue">{s.className}</span></td>
                    <td className="mono">{s.rollNumber}</td>
                    <td>{s.parentName}</td>
                    <td>{s.parentContact}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => startEdit(s)}>Edit</button>
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
