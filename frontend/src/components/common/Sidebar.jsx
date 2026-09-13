import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, Clock, 
  CheckSquare, BarChart3, ShieldCheck, UserCheck, 
  Camera, History, FileText, LogOut, ScanLine
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="d-flex align-items-center gap-2">
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
            }}
          >
            <ScanLine size={22} />
          </div>
          <div>
            <div className="brand-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
              SmartAttend<span style={{ color: '#38bdf8' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Face Recognition
            </div>
          </div>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div style={{ padding: '0.75rem 1.25rem 0.25rem' }}>
        <div 
          style={{
            background: isAdmin ? 'rgba(59, 130, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: isAdmin ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            color: isAdmin ? '#60a5fa' : '#34d399',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{isAdmin ? 'ADMIN / HOD PORTAL' : 'FACULTY PORTAL'}</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isAdmin ? '#60a5fa' : '#34d399' }}></span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        {isAdmin ? (
          // ================= ADMIN NAVIGATION =================
          <>
            <div className="nav-category">Institutional Overview</div>
            <NavLink to="/admin/dashboard" className="nav-link-custom" onClick={closeMobile}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <div className="nav-category">Management</div>
            <NavLink to="/admin/faculty" className="nav-link-custom" onClick={closeMobile}>
              <Users size={18} />
              <span>Faculty Management</span>
            </NavLink>
            <NavLink to="/admin/courses" className="nav-link-custom" onClick={closeMobile}>
              <BookOpen size={18} />
              <span>Course Management</span>
            </NavLink>
            <NavLink to="/admin/students" className="nav-link-custom" onClick={closeMobile}>
              <GraduationCap size={18} />
              <span>Student Management</span>
            </NavLink>

            <div className="nav-category">Attendance Monitoring</div>
            <NavLink to="/admin/faculty-attendance" className="nav-link-custom" onClick={closeMobile}>
              <Clock size={18} />
              <span>7:00 AM Faculty Log</span>
            </NavLink>
            <NavLink to="/admin/student-attendance" className="nav-link-custom" onClick={closeMobile}>
              <CheckSquare size={18} />
              <span>Student Attendance</span>
            </NavLink>
            <NavLink to="/admin/reports" className="nav-link-custom" onClick={closeMobile}>
              <FileText size={18} />
              <span>Attendance Reports</span>
            </NavLink>
            <NavLink to="/admin/audit" className="nav-link-custom" onClick={closeMobile}>
              <ShieldCheck size={18} />
              <span>Audit Logs</span>
            </NavLink>
          </>
        ) : (
          // ================= FACULTY NAVIGATION =================
          <>
            <div className="nav-category">Academic Overview</div>
            <NavLink to="/faculty/dashboard" className="nav-link-custom" onClick={closeMobile}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <div className="nav-category">Assigned Classes</div>
            <NavLink to="/faculty/courses" className="nav-link-custom" onClick={closeMobile}>
              <BookOpen size={18} />
              <span>My Courses</span>
            </NavLink>
            <NavLink to="/faculty/students" className="nav-link-custom" onClick={closeMobile}>
              <GraduationCap size={18} />
              <span>My Students</span>
            </NavLink>
            <NavLink to="/faculty/register-student" className="nav-link-custom" onClick={closeMobile}>
              <UserCheck size={18} />
              <span>Register Student</span>
            </NavLink>

            <div className="nav-category">Biometric AI Scanner</div>
            <NavLink to="/faculty/face-enrollment" className="nav-link-custom" onClick={closeMobile}>
              <Camera size={18} />
              <span>Face Enrollment Studio</span>
            </NavLink>
            <NavLink 
              to="/faculty/take-attendance" 
              className="nav-link-custom" 
              onClick={closeMobile}
              style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#60a5fa',
                fontWeight: 700
              }}
            >
              <ScanLine size={18} />
              <span>Take Live Attendance</span>
            </NavLink>

            <div className="nav-category">Records & History</div>
            <NavLink to="/faculty/history" className="nav-link-custom" onClick={closeMobile}>
              <History size={18} />
              <span>Attendance History</span>
            </NavLink>
            <NavLink to="/faculty/reports" className="nav-link-custom" onClick={closeMobile}>
              <BarChart3 size={18} />
              <span>Course Reports</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Sidebar Footer with Logout */}
      <div className="sidebar-footer">
        <button
          onClick={logout}
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
