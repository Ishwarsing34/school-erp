import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE });

// Automatically attach token from localStorage
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('erp_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const loginApi = (data) => api.post('/auth/login', data);
export const registerApi = (data) => api.post('/auth/register', data);

// ---- Students ----
export const getStudents = () => api.get('/students');
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);

// ---- Assignments ----
export const getAssignments = (params) => api.get('/assignments', { params });
export const createAssignment = (data) => api.post('/assignments', data);

// ---- Submissions ----
export const getSubmissions = (params) => api.get('/submissions', { params });
export const submitAssignment = (data) => api.post('/submissions', data);
export const evaluateSubmission = (id, data) => api.put(`/submissions/${id}`, data);

// ---- Books ----
export const getBooks = () => api.get('/books');
export const addBook = (data) => api.post('/books', data);
export const issueBook = (data) => api.post('/books/issue', data);
export const returnBook = (id) => api.put(`/books/return/${id}`);
export const getIssues = (params) => api.get('/books/issues', { params });

export default api;
