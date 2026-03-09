import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';

// admin pages
import AdminDashboard from './pages/AdminDashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import IssueBook from './pages/IssueBook';
import IssuedBooks from './pages/IssuedBooks';

// teacher pages
import TeacherDashboard from './pages/TeacherDashboard';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentList from './pages/AssignmentList';
import Submissions from './pages/Submissions';

// student pages
import StudentDashboard from './pages/StudentDashboard';
import SubmitAssignment from './pages/SubmitAssignment';
import MySubmissions from './pages/MySubmissions';
import BorrowedBooks from './pages/BorrowedBooks';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 12 }}>
        <div className="spinner" />
        <span style={{ color: 'var(--text2)' }}>Loading...</span>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const renderPage = () => {
    // for admin
    if (user.role === 'admin') {
      switch (view) {
        case 'dashboard':    return <AdminDashboard setView={setView} />;
        case 'students':     return <StudentList />;
        case 'add-student':  return <AddStudent setView={setView} />;
        case 'books':        return <BookList />;
        case 'add-book':     return <AddBook setView={setView} />;
        case 'issue-book':   return <IssueBook />;
        case 'issued-books': return <IssuedBooks />;
        default:             return <AdminDashboard setView={setView} />;
      }
    }

    // for teacher
    if (user.role === 'teacher') {
      switch (view) {
        case 'dashboard':          return <TeacherDashboard setView={setView} />;
        case 'create-assignment':  return <CreateAssignment setView={setView} />;
        case 'assignments':        return <AssignmentList setView={setView} />;
        case 'submissions':        return <Submissions />;
        case 'students':           return <StudentList />;
        default:                   return <TeacherDashboard setView={setView} />;
      }
    }

    // for student
    if (user.role === 'student') {
      switch (view) {
        case 'dashboard':         return <StudentDashboard setView={setView} />;
        case 'assignments':       return <AssignmentList setView={setView} />;
        case 'submit-assignment': return <SubmitAssignment setView={setView} />;
        case 'my-submissions':    return <MySubmissions />;
        case 'borrowed-books':    return <BorrowedBooks />;
        default:                  return <StudentDashboard setView={setView} />;
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar currentView={view} setView={(v) => { setView(v === 'home' ? 'dashboard' : v); }} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
