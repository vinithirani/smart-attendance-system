# Smart Attendance System Using Face Recognition

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-00df8f?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-five-tan-77.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-vinithirani%2Fsmart--attendance--system-181717?style=for-the-badge&logo=github)](https://github.com/vinithirani/smart-attendance-system)

**Domain:** AI Automation  
**Academic Degree Project:** Master of Computer Applications (MCA)  
**Live URL:** [https://frontend-five-tan-77.vercel.app](https://frontend-five-tan-77.vercel.app)  
**Architecture:** React.js (Frontend) + Python FastAPI (Backend) + PostgreSQL (Database) + Face AI Computer Vision Engine

---

## 📌 Project Overview

The **Smart Attendance System Using Face Recognition** is an enterprise-grade academic automation platform designed to eliminate manual attendance registers and proxy attendance in educational institutions. Using biometric face detection and deep-learning embeddings, it automatically identifies enrolled students, marks attendance in real-time, blocks duplicate scan attempts, and flags unauthorized individuals as **UNKNOWN PERSON**.

The application enforces strict **Role-Based Access Control (RBAC)** across two primary user portals:
1. **Admin / HOD Portal**: Institution-wide governance, 7:00 AM daily faculty check-in monitoring, faculty and course allocation, global student rosters, audit trails, and multi-format reports.
2. **Faculty Portal**: Scoped strictly to assigned courses (e.g. MCA, BCA, B.Tech, M.Tech), student registration, live Face Enrollment Studio, real-time classroom Face Recognition scanner, and manual safety override with audit recording.

---

## 🏛️ System Architecture

```
                                  +-----------------------------+
                                  |   Modern React.js Client    |
                                  | (Vite + Bootstrap 5 + CSS3) |
                                  +--------------+--------------+
                                                 | REST APIs / JSON
                                                 v
                                  +-----------------------------+
                                  |    FastAPI Python Server    |
                                  |   (Auth, Face AI, Reports)  |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
        +-----------------------------+                     +-----------------------------+
        |     PostgreSQL Database     |                     | Face Recognition AI Service |
        |  (Relational Models & Seed) |                     |  (Detection & Verification) |
        +-----------------------------+                     +-----------------------------+
```

---

## 🚀 Key Features

### 🌟 Core AI & Face Recognition Logic
- **Course-Bounded Matching**: Face comparison is strictly isolated to students registered for the active Course, Semester, and Division.
- **Critical Unknown Person Logic**: Any face detected that is not enrolled for the selected course is flagged with a high-visibility warning as **UNKNOWN PERSON** and **zero attendance is marked**.
- **Duplicate Attendance Prevention**: Re-scanning an already-marked student triggers an **Already Marked** notification without creating redundant database records.
- **Manual Attendance Safety Option**: Faculty can manually adjust a record when needed, automatically generating an immutable institutional audit log.

### 👑 Admin / HOD Portal
- **Overview Dashboard**: High-level KPIs, attendance doughnut ratio, weekly and monthly trend graphs.
- **Faculty Management**: Full CRUD for faculty members with course assignments (Initial faculty: *Devanshi Patel*, *Risha Tiwari*, *Dhruv Patel*, *Shyam Chavda*).
- **Course Management**: Support for MCA, BCA, B.Tech, M.Tech with student strength and assigned faculty metrics.
- **7:00 AM Faculty Attendance Log**: Mandatory morning check-in tracker with punctuality metrics and CSV export.
- **Student Management**: Master database of all enrolled students with biometric status badges.
- **Attendance Reports & Audit Logs**: Daily, monthly, yearly, and faculty-wise attendance reports with CSV/Print export and security audit logs.

### 👩‍🏫 Faculty Portal
- **Personalized Dashboard**: Real-time stats for assigned courses, upcoming lectures, and fast launchers.
- **My Courses & Students**: Strict course isolation preventing cross-department access.
- **Register New Student**: Streamlined registration with direct transition to Face Enrollment.
- **Face Enrollment Studio**: Live camera preview with facial landmark HUD and 128-dimensional embedding generation.
- **Live Face Recognition Scanner**: Real-time camera feed with automated Present marking, duplicate detection, and unknown person warnings.
- **Attendance History & Reports**: Historical lecture logs and exam eligibility calculations (<75% warning).

---

## 🗄️ Database Design (PostgreSQL)

The system is built on a normalized PostgreSQL schema (`database/schema.sql`):

1. `users` — Authentication credentials, roles (`admin`, `faculty`), and profiles.
2. `faculty` — Academic faculty details, codes, departments, and designations.
3. `courses` — Degree programs (MCA, BCA, B.Tech, M.Tech) and duration.
4. `faculty_courses` — Relational mapping of faculty to courses, semesters, and divisions.
5. `students` — Student enrollment data, roll numbers, and face enrollment indicators.
6. `face_enrollments` — Biometric facial feature embeddings and confidence scores.
7. `faculty_attendance` — Daily 7:00 AM morning check-in records.
8. `attendance_sessions` — Faculty-initiated classroom attendance sessions.
9. `student_attendance` — Individual student session records with verification method.
10. `audit_logs` — Immutable audit trail of all manual overrides and administrative actions.

---

## 🔑 Demo Credentials

| Role | Name | Email | Password | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin / HOD** | Dr. Rajesh Sharma | `admin@smartattendance.edu` | `password123` | Institutional Master Access |
| **Faculty** | Devanshi Patel | `devanshi@smartattendance.edu` | `password123` | MCA Department |
| **Faculty** | Risha Tiwari | `risha@smartattendance.edu` | `password123` | BCA Department |
| **Faculty** | Dhruv Patel | `dhruv@smartattendance.edu` | `password123` | B.Tech Department |
| **Faculty** | Shyam Chavda | `shyam@smartattendance.edu` | `password123` | M.Tech Department |

*(A 1-click demo persona switcher is also built directly into the UI for convenient live evaluation)*

---

## 🛠️ Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (Optional — SQLite zero-config fallback is built in for instant standalone evaluation)

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell:
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables in `.env` (or use defaults):
   ```env
   DATABASE_URL=sqlite:///./smart_attendance.db
   # For PostgreSQL: postgresql://postgres:postgres@localhost:5432/smart_attendance_db
   SECRET_KEY=super_secret_jwt_key_2026
   PORT=8000
   ```

5. Start the backend API server:
   ```bash
   python run.py
   ```
   *The interactive API documentation will be available at `http://localhost:8000/docs`*

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and access the application at:
   ```
   http://localhost:5173
   ```

---

## ☁️ GitHub & Vercel Cloud Deployment

### 🐙 1. GitHub Repository & CI/CD Setup
1. Initialize or push the project to your GitHub repository:
   ```bash
   git remote add origin https://github.com/vinithirani/smart-attendance-system.git
   git branch -M main
   git push -u origin main
   ```
2. Automated GitHub Actions CI workflow (`.github/workflows/ci.yml`) will automatically trigger on every push and pull request to validate frontend builds and backend syntax.

---

### ▲ 2. Vercel (Frontend Deployment)
Deploying the frontend to Vercel takes less than 2 minutes:

#### Method A: 1-Click / Git Connected Deployment (Recommended)
1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"** -> **"Import Git Repository"**.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (or leave as `./` as root `vercel.json` is pre-configured)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-api-domain.com` (or leave empty to use local fallback)
5. Click **Deploy**. The included `vercel.json` ensures full Single Page Application (SPA) HTML5 history routing and security headers work out of the box.

#### Method B: Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel
```

---

### 🐍 3. Backend Deployment (Render / Railway / AWS EC2)
1. Deploy `backend/` as a Python Web Service.
2. Set Build Command: `pip install -r requirements.txt`
3. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Attach PostgreSQL database and provide the `DATABASE_URL` environment variable.

---

## 🧪 Verification & User Journey

### Admin Journey:
1. Navigate to `/login` and select **Admin / HOD** (or click the Admin demo chip).
2. View the **Overview Dashboard** with real-time statistics and analytics.
3. Check **Faculty Management** to manage faculty and course assignments.
4. Open **7:00 AM Faculty Log** to verify morning arrival times and export CSV.
5. Inspect **Student Attendance** and **Institutional Reports** for daily/monthly trends.

### Faculty Journey:
1. Log in as **Devanshi Patel** (MCA).
2. View assigned courses in **My Courses** and student rosters in **My Students**.
3. Register a student via **Register Student** and transition into **Face Enrollment Studio**.
4. Open **Take Live Attendance**, select *MCA Sem 2*, and start the session.
5. Test live recognition, **Already Marked** duplicate prevention, and the **Unknown Person** security alert.
6. End session, review Present/Absent counts, and test **Manual Safety Override** with audit logging.

---

## 📄 License & Attribution
Developed for the MCA Final Year Project in AI Automation. All rights reserved.
