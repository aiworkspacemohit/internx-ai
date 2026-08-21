# InternX AI - End-to-End AI-Powered Placement & Internship Management System

InternX AI is an enterprise-grade web application designed to simplify and automate the complete internship and campus placement lifecycle across four distinct user roles: **Student**, **Company**, **Placement Officer**, and **Admin**.

Built with a high-performance **React 18 + Vite + Tailwind CSS** frontend and a **FastAPI + Supabase PostgreSQL (SQLAlchemy & Alembic) + Gemini 3.6 Flash AI** backend, InternX AI provides sub-second Gmail 6-digit OTP verification, Cloudinary asset storage, automated application tracking, interactive recruiter pipelines, interview scheduling, placement analytics, real-time notifications, and Gemini AI career assistance.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS (Dark Mode Glassmorphism), React Router v6, Axios, Recharts, Lucide Icons |
| **Backend** | Python 3.14+, FastAPI, Pydantic v2, PyJWT, Bcrypt, SQLAlchemy 2.0, Alembic |
| **Database** | Supabase PostgreSQL (Production Cloud DB) / SQLite (Local Instant Fallback) |
| **Artificial Intelligence** | Google Gemini 3.6 Flash (`google-generativeai`) with Fallback Mock AI Engine |
| **Cloud Storage** | Cloudinary API (Profile Avatars & Resume Document Uploads with PDF text extraction) |
| **Email & Authentication** | Gmail SMTP Server, FastAPI `BackgroundTasks` (Sub-second OTP & Notification Delivery) |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend API), Supabase Cloud DB |

---

## 📂 Detailed Project Tree Structure

```text
InternX/
├── backend/
│   ├── alembic/                    # Alembic Database Migrations Setup
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   │           ├── ai.py              # Gemini Resume Review, Chatbot, Candidate Suggestion, Recommendations
│   │   │           ├── analytics.py       # Student, Company, Officer, Admin Placement Metrics
│   │   │           ├── announcements.py   # Campus Drive Bulletins
│   │   │           ├── applications.py    # Internship Applications & Status Pipeline Transitions
│   │   │           ├── auth.py            # Login, Gmail OTP Request & Verification, Company Signup
│   │   │           ├── companies.py       # Company Profiles & Verification Approvals
│   │   │           ├── internships.py     # Internship Opportunity Postings & Filters
│   │   │           ├── interviews.py      # Technical Interview Scheduling & Invites
│   │   │           ├── notifications.py   # In-App User Notifications
│   │   │           └── users.py           # User Management, Avatar & Resume Cloudinary Uploads
│   │   ├── core/
│   │   │   ├── config.py                  # Pydantic BaseSettings Environment Loader
│   │   │   ├── database.py                # Supabase PostgreSQL / SQLite Engine & Sessions
│   │   │   └── security.py                # JWT Token Generation, Passlib Hashing, RBAC Middleware
│   │   ├── models/                        # SQLAlchemy ORM Models
│   │   │   ├── announcement.py
│   │   │   ├── application.py
│   │   │   ├── company.py
│   │   │   ├── internship.py
│   │   │   ├── interview.py
│   │   │   ├── notification.py
│   │   │   └── user.py
│   │   ├── schemas/                       # Pydantic Request/Response Validation Schemas
│   │   │   ├── ai.py
│   │   │   ├── analytics.py
│   │   │   ├── application.py
│   │   │   ├── company.py
│   │   │   ├── internship.py
│   │   │   ├── interview.py
│   │   │   └── user.py
│   │   ├── services/                      # Core Micro-Services
│   │   │   ├── ai_service.py              # Gemini 3.6 Flash Resume Parser, Candidate Matcher & Chatbot
│   │   │   ├── cloudinary_service.py      # Cloudinary Profile Avatar & Resume PDF Uploader
│   │   │   └── email_service.py           # Gmail SMTP HTML Email Templates & OTP Dispatcher
│   │   └── main.py                        # FastAPI Application Gateway
│   ├── test_scripts/                      # Verification Test Scripts
│   │   ├── test_all_features.py           # End-to-End Cloudinary, Gemini & Gmail OTP Test Suite
│   │   ├── test_cloudinary.py
│   │   └── test_gmail.py
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── .env                               # Confidential Backend Credentials
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/                    # Reusable UI Components
│   │   │   ├── common/                    # Navbar, Sidebar, StatCard, NotificationPopover
│   │   │   ├── company/                   # Applicant Kanban, Job Form Modals
│   │   │   └── student/                   # AIChatbotWidget, ApplicationTimeline
│   │   ├── context/                       # AuthContext, NotificationContext
│   │   ├── pages/                         # Role-Based Page Views
│   │   │   ├── admin/                     # Dashboard, User Management, Approvals, Officers, System Logs
│   │   │   ├── auth/                      # Login, Student 2-Step OTP Register, Company Register
│   │   │   ├── company/                   # Dashboard, Job Postings, Applicant Pipeline, Interviews, Profile
│   │   │   ├── officer/                   # Dashboard, Student Monitoring, Company Approvals, Announcements, Reports
│   │   │   └── student/                   # Dashboard, Search Internships, Applications, AI Hub, Calendar, Announcements
│   │   ├── routes/                        # ProtectedRoute Middleware (RBAC)
│   │   ├── services/                      # Axios API Client & Endpoints
│   │   ├── styles/                        # Glassmorphism Aesthetics (index.css)
│   │   ├── App.jsx                        # Main Application Layout & Global Chatbot Widget
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env                               # Frontend Environment Config
│   └── .env.example
└── README.md
```

---

## 🔥 Key Functionality Overview

### 1. 🔑 Verified `@gmail.com` Signup with Sub-Second OTP Authentication
- **Gmail Restriction**: Student registration is strictly restricted to valid `@gmail.com` addresses.
- **6-Digit Gmail OTP Verification**: Two-step registration flow.
  - Step 1: Input Gmail address -> Generates 6-digit cryptographic OTP code stored in an `O(1)` in-memory thread-safe cache with a 10-minute expiry. Dispatched via FastAPI `BackgroundTasks` for sub-second HTTP turnaround (< 1s).
  - Step 2: Input 6-digit OTP received in Gmail + complete profile details -> Verified instantly to create student account.

### 2. ☁️ Cloudinary Asset Storage Engine
- **Profile Picture Upload**: Upload avatar images directly to Cloudinary (`folder="internx_avatars"`) with instant URL updates.
- **Resume Upload & Text Extraction**: Upload PDF/DOCX resume files directly to Cloudinary (`folder="internx_resumes"`). Automatically extracts raw text content for Gemini AI analysis.

### 3. 🤖 Google Gemini 3.6 Flash AI Assistant & Tools
- **Resume Review & ATS Matcher**: Parses resume text, evaluates match score for target roles, highlights strengths, and flags missing keywords.
- **Candidate Suggestion & Match Ranking**: Ranks applicant candidates for recruiters and placement officers based on skill compatibility against job descriptions.
- **Global Interactive AI Chatbot**: Floating `AIChatbotWidget` powered by Gemini AI, offering 24/7 assistance for technical interview prep, resume building tips, and platform guidance.
- **AI Job Recommendations**: Ranks active internships based on individual student skill alignment.

### 4. 📧 Automated Gmail Status Tracking & Scheduling Notifications
- **Internship Progress Tracking**: Automated HTML email alerts sent to students whenever application status transitions (`APPLIED` ➔ `SHORTLISTED` ➔ `INTERVIEW_ROUND` ➔ `OFFER` ➔ `REJECTED`).
- **Interview Invitations**: Automated HTML emails sent when recruiters schedule interview rounds, including date, time, duration, and meeting room links.

---

## 👥 User Roles & Features

1. **Student**:
   - 2-Step `@gmail.com` OTP registration.
   - Cloudinary profile avatar & resume PDF upload.
   - Search & filter active internship postings with 1-click application.
   - 7-Stage application pipeline timeline tracker.
   - **AI Prep Hub**: Resume Reviewer, ATS Matcher, Interview Question Generator, Career Roadmap.
   - 24/7 Floating Gemini AI Chatbot.
   - Personal technical interview calendar with meeting room links.

2. **Company (Recruiter)**:
   - Registration request (pending Admin/Officer approval).
   - Post and manage active internship listings.
   - Candidate pipeline management (`Applied` ➔ `Shortlisted` ➔ `Assessment` ➔ `Interview` ➔ `Offer` ➔ `Rejected`).
   - Gemini AI Candidate Suggestion & Match Ranking.
   - Schedule technical interview rounds with meeting links.

3. **Placement Officer**:
   - Provisioned exclusively by Administrator.
   - Department placement rate analytics & Recharts visual graphs.
   - Student monitoring directory with CGPA & skill filter.
   - Verify and approve corporate registration requests.
   - Broadcast placement drive bulletins & export analytical reports.

4. **Administrator**:
   - System overview & complete platform governance.
   - Provision placement officer accounts.
   - Approve/Reject company registration requests.
   - Toggle user active status & monitor system audit logs.

---

## 🚀 Features to Work On (Future Roadmap)

- [ ] **Real-Time WebSockets Push Notifications**: Live instant notifications without page polling.
- [ ] **Automated AI Voice/Video Mock Interview Simulator**: Interactive video interview practice with real-time speech and emotion analysis.
- [ ] **In-Portal Resume Builder & PDF Exporter**: Drag-and-drop resume builder template generator.
- [ ] **WhatsApp & SMS OTP Fallback**: Integration with Twilio for SMS and WhatsApp OTP verification.
- [ ] **Automated Offer Letter Generator & Digital Signature Verification**: PDF offer letter generator with cryptographic student signing.

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

# Supabase PostgreSQL / SQLite Fallback
DATABASE_URL="postgresql://postgres:password@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

# Google Gemini AI API Key
GEMINI_API_KEY="your-gemini-api-key"

# Cloudinary Storage Credentials
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Background Email Notifications (Gmail SMTP)
ENABLE_EMAIL_NOTIFICATIONS=true
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="aiworkspacemohit@gmail.com"
SMTP_PASSWORD="your-16-char-app-password"
EMAILS_FROM_EMAIL="aiworkspacemohit@gmail.com"
EMAILS_FROM_NAME="InternX AI Placement Cell"

BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000","http://127.0.0.1:5173"]
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

## 💻 Local Execution Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Run Backend API Server (Terminal 1)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows (or 'source venv/bin/activate' on Linux/macOS)
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### 2. Run Frontend Web App (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
- Frontend Application Portal: `http://localhost:5173/`

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `alex.rivera@student.edu` | `Student@123` |
| **Company** | `recruiter@google.com` | `Company@123` |
| **Placement Officer** | `officer@university.edu` | `Officer@123` |
| **Administrator** | `admin@internx.ai` | `Admin@123` |
