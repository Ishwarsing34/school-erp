import React, { useEffect, useState } from 'react';
import { getBooks } from '../api';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then(({ data }) => setBooks(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center gap-2" style={{ padding: 40 }}><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Library Books</div>
          <div className="page-subtitle">{books.length} titles in collection</div>
        </div>
      </div>

      <div className="card">
        {books.length === 0 ? (
          <div className="empty-state"><div className="icon">📚</div><p>No books in library yet</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Title</th><th>Author</th><th>ISBN</th><th>Total</th><th>Available</th></tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b._id}>
                    <td className="td-name">{b.title}</td>
                    <td>{b.author}</td>
                    <td className="mono">{b.isbn}</td>
                    <td>{b.quantity}</td>
                    <td>
                      <span className={`badge ${b.available > 0 ? 'badge-green' : 'badge-red'}`}>
                        {b.available > 0 ? `${b.available} available` : 'Out of stock'}
                      </span>
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
