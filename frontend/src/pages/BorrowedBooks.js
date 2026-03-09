import React, { useEffect, useState } from 'react';
import { getIssues, getStudents } from '../api';
// import { useAuth } from '../context/AuthContext';

export default function BorrowedBooks() {
  // const {  } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find student by email to get their studentId
    getStudents().then(({ data }) => {
      // Teachers can call this; student cannot call getStudents
      // Instead we just fetch all issues the API returns for this user
    }).catch(() => {});

    // The backend filters by logged-in users student record automatically when role=student
    getIssues()
      .then(({ data }) => setIssues(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isOverdue = (d) => new Date(d) < new Date();

  if (loading) return <div className="flex items-center gap-2" style={{ padding: 40 }}><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Borrowed Books</div><div className="page-subtitle">Your library loans</div></div>
      </div>

      <div className="card">
        {issues.length === 0 ? (
          <div className="empty-state"><div className="icon">📚</div><p>You have no borrowed books</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Book</th><th>Author</th><th>Issued</th><th>Due Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {issues.map(i => (
                  <tr key={i._id}>
                    <td className="td-name">{i.bookId?.title}</td>
                    <td>{i.bookId?.author}</td>
                    <td>{new Date(i.issueDate).toLocaleDateString()}</td>
                    <td>{new Date(i.dueDate).toLocaleDateString()}</td>
                    <td>
                      {i.returned
                        ? <span className="badge badge-green">Returned</span>
                        : isOverdue(i.dueDate)
                        ? <span className="badge badge-red">Overdue</span>
                        : <span className="badge badge-amber">Active</span>}
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
