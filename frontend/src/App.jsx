import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout & Protected Route Wrapper
import DashboardLayout from './components/common/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyPage from './pages/admin/FacultyPage';
import CoursesPage from './pages/admin/CoursesPage';
import StudentsPage from './pages/admin/StudentsPage';
import FacultyAttendancePage from './pages/admin/FacultyAttendancePage';
import StudentAttendancePage from './pages/admin/StudentAttendancePage';
import ReportsPage from './pages/admin/ReportsPage';
import AuditPage from './pages/admin/AuditPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MyCoursesPage from './pages/faculty/MyCoursesPage';
import MyStudentsPage from './pages/faculty/MyStudentsPage';
import RegisterStudentPage from './pages/faculty/RegisterStudentPage';
import FaceEnrollmentPage from './pages/faculty/FaceEnrollmentPage';
import TakeAttendancePage from './pages/faculty/TakeAttendancePage';
import AttendanceHistoryPage from './pages/faculty/AttendanceHistoryPage';
import FacultyReportsPage from './pages/faculty/FacultyReportsPage';

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin / HOD Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="faculty" element={<FacultyPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="faculty-attendance" element={<FacultyAttendancePage />} />
              <Route path="student-attendance" element={<StudentAttendancePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="audit" element={<AuditPage />} />
            </Route>

            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/faculty/dashboard" replace />} />
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="courses" element={<MyCoursesPage />} />
              <Route path="students" element={<MyStudentsPage />} />
              <Route path="register-student" element={<RegisterStudentPage />} />
              <Route path="face-enrollment" element={<FaceEnrollmentPage />} />
              <Route path="take-attendance" element={<TakeAttendancePage />} />
              <Route path="history" element={<AttendanceHistoryPage />} />
              <Route path="reports" element={<FacultyReportsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
}
