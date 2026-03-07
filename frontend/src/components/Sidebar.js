import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navConfig = {
  admin: [
    {
      label: 'Students',
      items: [
        { name: 'Add Student', view: 'add-student', icon: '＋' },
        { name: 'Student List', view: 'students', icon: '👥' },
      ],
    },
    {
      label: 'Library',
      items: [
        { name: 'Add Book', view: 'add-book', icon: '＋' },
        { name: 'Book List', view: 'books', icon: '📚' },
        { name: 'Issue Book', view: 'issue-book', icon: '↗' },
        { name: 'Issued Books', view: 'issued-books', icon: '📋' },
      ],
    },
  ],
  teacher: [
    {
      label: 'Assignments',
      items: [
        { name: 'Create Assignment', view: 'create-assignment', icon: '✏️' },
        { name: 'My Assignments', view: 'assignments', icon: '📄' },
        { name: 'View Submissions', view: 'submissions', icon: '📥' },
      ],
    },
    {
      label: 'Students',
      items: [{ name: 'Student List', view: 'students', icon: '👥' }],
    },
  ],
  student: [
    {
      label: 'Assignments',
      items: [
        { name: 'View Assignments', view: 'assignments', icon: '📄' },
        { name: 'Submit Assignment', view: 'submit-assignment', icon: '📤' },
        { name: 'My Submissions', view: 'my-submissions', icon: '📋' },
      ],
    },
    {
      label: 'Library',
      items: [{ name: 'Borrowed Books', view: 'borrowed-books', icon: '📚' }],
    },
  ],
};

export default function Sidebar({ currentView, setView }) {
  const { user, logout } = useAuth();

  const sections = navConfig[user?.role] || [];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>SCHOOL ERP</h1>
        <p>Management System</p>
      </div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.label} className="nav-section">
            <div className="nav-label">{section.label}</div>
            {section.items.map((item) => (
              <button
                key={item.view}
                className={`nav-item ${currentView === item.view ? 'active' : ''}`}
                onClick={() => setView(item.view)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
}
