# 🏫 School ERP Mini System

A full-stack MERN application for managing school operations including students, assignments, and library.

---

## 📁 Project Structure

```
school-erp/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── assignmentController.js
│   │   ├── submissionController.js
│   │   └── bookController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   ├── Book.js
│   │   └── BookIssue.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── submissionRoutes.js
│   │   └── bookRoutes.js
│   ├── .env.example
│   ├── seed.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── index.js
    │   ├── components/
    │   │   └── Sidebar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── AdminDashboard.js
    │   │   ├── StudentList.js
    │   │   ├── AddStudent.js
    │   │   ├── BookList.js
    │   │   ├── AddBook.js
    │   │   ├── IssueBook.js
    │   │   ├── IssuedBooks.js
    │   │   ├── TeacherDashboard.js
    │   │   ├── CreateAssignment.js
    │   │   ├── AssignmentList.js
    │   │   ├── Submissions.js
    │   │   ├── StudentDashboard.js
    │   │   ├── SubmitAssignment.js
    │   │   ├── MySubmissions.js
    │   │   └── BorrowedBooks.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v16+
- **MongoDB** running locally (or a MongoDB Atlas URI)
- **npm** v8+

---

## 🚀 Setup & Run

### 1. Clone / Download the project

```bash
cd school-erp
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed demo users (optional but recommended)
node seed.js

# Start the backend
npm run dev     # with nodemon (auto-restart)
# OR
npm start       # production
```

Backend runs on: **http://localhost:5000**

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit if your backend runs on a different port

# Start React dev server
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 🔐 Demo Credentials

After running `node seed.js`:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@school.edu       | admin123    |
| Teacher | teacher@school.edu     | teacher123  |
| Student | student@school.edu     | student123  |

---

## 🧩 Modules & Features

### Authentication
- JWT-based login/register
- Role-based access control (admin / teacher / student)
- Token stored in localStorage, attached to every API request

### 📋 Student Management (Admin)
- Create, view, and update students
- Student profile: name, email, class, roll number, parent info
- Teachers can view the student list (read-only)

### 📝 Assignment Management
- Teachers create assignments with title, description, class, due date
- Students view available assignments
- Students submit assignments (with text answer or file URL)
- Teacher can grade (evaluate) submissions with marks

### 📚 Library Management
- Admin adds books with title, author, ISBN, quantity
- Admin issues books to students with a due date
- Admin marks books as returned
- Students view their borrowed books
- Available quantity tracked automatically

---

## 🌐 API Reference

### Auth
| Method | Route                  | Access  |
|--------|------------------------|---------|
| POST   | /api/auth/register     | Public  |
| POST   | /api/auth/login        | Public  |
| GET    | /api/auth/me           | Private |

### Students
| Method | Route                  | Access         |
|--------|------------------------|----------------|
| POST   | /api/students          | Admin          |
| GET    | /api/students          | Admin, Teacher |
| GET    | /api/students/:id      | Admin, Teacher |
| PUT    | /api/students/:id      | Admin          |

### Assignments
| Method | Route                  | Access              |
|--------|------------------------|---------------------|
| POST   | /api/assignments       | Teacher             |
| GET    | /api/assignments       | All authenticated   |
| GET    | /api/assignments/:id   | All authenticated   |

### Submissions
| Method | Route                  | Access              |
|--------|------------------------|---------------------|
| POST   | /api/submissions       | Student             |
| GET    | /api/submissions       | Admin, Teacher, Student |
| PUT    | /api/submissions/:id   | Teacher             |

### Books
| Method | Route                  | Access  |
|--------|------------------------|---------|
| POST   | /api/books             | Admin   |
| GET    | /api/books             | All     |
| POST   | /api/books/issue       | Admin   |
| PUT    | /api/books/return/:id  | Admin   |
| GET    | /api/books/issues      | Admin, Student |

---

## 🛠 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Backend    | Node.js + Express.js          |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + bcryptjs                |
| Frontend   | React 18 (functional + hooks) |
| HTTP       | Axios                         |
| Styling    | Custom CSS (IBM Plex fonts)   |

---

## 🔧 Environment Variables

### backend/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_erp
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

### frontend/.env
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📌 Notes

- The frontend uses a proxy setting (`"proxy": "http://localhost:5000"`) in package.json, so you can also use relative paths `/api/...` if needed.
- Student submission filtering: when a student submits, the backend looks up their Student record by matching their User email.
- For production: hash secrets properly, use HTTPS, and consider rate limiting.
