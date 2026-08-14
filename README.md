# InternX AI - End-to-End AI-Powered Placement & Internship Management System

InternX AI is an enterprise-grade web application designed to simplify and automate the complete internship and campus placement lifecycle across four distinct user roles: **Student**, **Company**, **Placement Officer**, and **Admin**.

Built with a high-performance **React + Vite + Tailwind CSS** frontend and a **FastAPI + PostgreSQL (SQLAlchemy & Alembic) + Gemini AI** backend, InternX AI provides automated application tracking, interactive Kanban status pipelines, interview scheduling, placement analytics, real-time notifications, and AI-driven career tools.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS (Dark Mode Glassmorphism), React Router v6, Axios, Recharts, Lucide Icons, Framer Motion |
| **Backend** | Python 3.14+, FastAPI, Pydantic v2, PyJWT, Bcrypt, SQLAlchemy 2.0, Alembic |
| **Database** | PostgreSQL (Production) / SQLite (Local Instant Fallback) |
| **AI Integration** | Google Gemini API (`google-generativeai`) with Fallback Mock AI Engine |
| **Storage & Email** | Cloudinary (Resumes & Logos), SMTP Email Service via FastAPI `BackgroundTasks` |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend API), PostgreSQL Cloud Provider |

---

## 📂 Project Structure

```
InternX/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # Auth, Users, Companies, Internships, Applications, Interviews, AI, Analytics, Announcements, Notifications
│   │   ├── core/               # Security, Config, Database, Cloudinary
│   │   ├── db/                 # Database initialization & Seeder (init_db.py)
│   │   ├── models/             # SQLAlchemy ORM Models (User, Company, Internship, Application, Interview, Announcement, Notification)
│   │   ├── schemas/            # Pydantic Schemas (Request/Response Validation)
│   │   ├── services/           # Gemini AI Service, Email Service
│   │   └── main.py             # FastAPI App Entrypoint
│   ├── alembic/                # Database Migrations Setup
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Sidebar, StatCards, Timeline, Modals)
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Student Register, Company Register
│   │   │   ├── student/        # Dashboard, Search Internships, Application Tracker, AI Hub, Interview Calendar, Announcements
│   │   │   ├── company/        # Dashboard, Job Postings, Applicant Pipeline, Interviews, Profile
│   │   │   ├── officer/        # Dashboard, Student Monitoring, Company Approvals, Announcements, Reports
│   │   │   └── admin/          # Admin Overview, User Control, Company Approvals, Officer Creation, System Logs
│   │   ├── routes/             # App Routing & Role-Based Access Control (ProtectedRoute)
│   │   ├── services/           # Axios API Client & Endpoints
│   │   ├── styles/             # Tailwind CSS & Glassmorphism Aesthetics (index.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env
│   ├── .env.example
│   └── .gitignore
└── README.md
```

---

## 👥 User Roles & Dashboards

1. **Student**:
   - Self-registration & profile management.
   - Search & filter active internship postings with one-click application.
   - Real-time application timeline tracking (7-stage recruitment flow).
   - **AI Career Hub**: AI Resume Reviewer & ATS Matcher, AI Interview Question Generator, and AI Skill Milestone Roadmap.
   - Personal interview calendar & meeting link launcher.

2. **Company (Recruiter)**:
   - Registration request (requires Admin/Officer approval).
   - Post and manage company internship listings.
   - Candidate pipeline management (Status transitions: Applied -> Shortlisted -> Assessment -> Interview -> HR -> Offer -> Rejected).
   - Schedule technical interview rounds with Google Meet / Zoom links.
   - Corporate profile management.

3. **Placement Officer**:
   - Created exclusively by the Administrator.
   - Department placement rate analytics & Recharts visualizations.
   - Student monitoring directory with CGPA & skill filter.
   - Verify and approve company registration requests.
   - Broadcast placement drive announcements and export analytical reports.

4. **Administrator**:
   - System overview & platform user management.
   - Provision placement officer accounts.
   - Approve/Reject corporate registration requests.
   - Toggle account active status & view system security audit logs.

---

## 🔄 Application Status Workflow

```
APPLIED ➔ SHORTLISTED ➔ ONLINE_ASSESSMENT ➔ INTERVIEW_ROUND ➔ HR_ROUND ➔ OFFER ➔ ACCEPTED / REJECTED
```
- Every status update triggers an in-app notification stored in the database.
- Automated background emails are dispatched via FastAPI `BackgroundTasks`.

---

## 🔑 Environment Configuration (.env)

### Backend (`backend/.env`)
```env
PROJECT_NAME="InternX AI"
API_V1_STR="/api/v1"
ENVIRONMENT="development"
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://127.0.0.1:8000"

SECRET_KEY="your-jwt-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# PostgreSQL / SQLite Fallback
DATABASE_URL="sqlite:///./internx.db"

# Gemini AI API Key
GEMINI_API_KEY=""

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Background Email Notifications (SMTP)
ENABLE_EMAIL_NOTIFICATIONS=true
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="notifications@internx.ai"
SMTP_PASSWORD="your-smtp-app-password"
EMAILS_FROM_EMAIL="notifications@internx.ai"
EMAILS_FROM_NAME="InternX AI Placement Cell"

BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL="http://127.0.0.1:8000/api/v1"
VITE_APP_TITLE="InternX AI - Placement & Internship Portal"
VITE_FRONTEND_URL="http://localhost:5173"
VITE_BACKEND_URL="http://127.0.0.1:8000"
VITE_ENABLE_EMAIL_ALERTS=true
```

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Run Backend API Server
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows (or 'source venv/bin/activate' on Linux/macOS)
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- FastAPI Interactive Docs: `http://127.0.0.1:8000/docs`

### 2. Run Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
- Frontend Web Portal: `http://localhost:5173/`

---

## 🔑 Demo Login Accounts

Instant one-click demo logins are available on the Login page:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `alex.rivera@student.edu` | `Student@123` |
| **Company** | `recruiter@google.com` | `Company@123` |
| **Placement Officer** | `officer@university.edu` | `Officer@123` |
| **Administrator** | `admin@internx.ai` | `Admin@123` |

---

## 🌐 Production Deployment

- **Frontend Deployment (Vercel / Netlify)**:
  - Set `VITE_API_BASE_URL` to your live API endpoint (e.g., `https://internx-api.onrender.com/api/v1`).
- **Backend Deployment (Render / Railway / AWS)**:
  - Set `DATABASE_URL` to your production PostgreSQL connection string.
  - Set `FRONTEND_URL` to your production frontend domain to enable CORS.
