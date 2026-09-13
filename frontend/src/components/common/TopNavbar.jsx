import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, RefreshCw, ChevronDown, Check, Github, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopNavbar({ setMobileOpen }) {
  const { user, switchDemoRole } = useAuth();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const roles = [
    { label: "Admin / HOD (Dr. Rajesh Sharma)", key: "admin" },
    { label: "Faculty: Devanshi Patel (MCA)", key: "faculty_devanshi" },
    { label: "Faculty: Risha Tiwari (BCA)", key: "faculty_risha" },
    { label: "Faculty: Dhruv Patel (B.Tech)", key: "faculty_dhruv" },
    { label: "Faculty: Shyam Chavda (M.Tech)", key: "faculty_shyam" },
  ];

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {/* Mobile Hamburger */}
        <button
          className="btn btn-light d-lg-none p-2 border"
          onClick={() => setMobileOpen(prev => !prev)}
        >
          <Menu size={20} />
        </button>

        {/* Live Academic Clock Badge */}
        <div className="d-none d-sm-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
            System Time: {time}
          </span>
        </div>

        {/* Vercel Cloud Badge */}
        <a 
          href="https://vercel.com" 
          target="_blank" 
          rel="noreferrer"
          className="d-none d-xl-flex align-items-center gap-1 text-decoration-none px-2 py-1 bg-dark text-white rounded-pill border"
          style={{ fontSize: '0.72rem', fontWeight: 600 }}
          title="Deployed on Vercel Cloud"
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00df8f' }}></span>
          <span>▲ Vercel Edge</span>
        </a>
      </div>

      {/* Right Controls: GitHub Repo + Quick Role Switcher + User Profile */}
      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {/* GitHub Link */}
        <a
          href="https://github.com/vinithirani/smart-attendance-system"
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-2 px-sm-3 py-1"
          style={{ borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}
          title="View Source on GitHub"
        >
          <Github size={15} />
          <span className="d-none d-sm-inline">GitHub</span>
        </a>
        {/* Quick Demo Switcher Dropdown */}
        <div className="position-relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.82rem',
              color: '#1e293b',
              padding: '0.4rem 0.75rem'
            }}
          >
            <RefreshCw size={14} className="text-primary" />
            <span className="d-none d-md-inline">Switch Demo Role</span>
            <ChevronDown size={14} />
          </button>

          {dropdownOpen && (
            <div
              className="glass-panel position-absolute end-0 mt-2 shadow-lg"
              style={{
                width: '280px',
                borderRadius: '12px',
                padding: '0.5rem',
                zIndex: 1050,
                background: '#ffffff',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="px-3 py-2 text-muted fw-bold" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Instant Persona Switcher
              </div>
              {roles.map(r => {
                const isActive = (r.key === 'admin' && user?.role === 'admin') ||
                                 (r.key === 'faculty_devanshi' && user?.name?.includes('Devanshi')) ||
                                 (r.key === 'faculty_risha' && user?.name?.includes('Risha')) ||
                                 (r.key === 'faculty_dhruv' && user?.name?.includes('Dhruv')) ||
                                 (r.key === 'faculty_shyam' && user?.name?.includes('Shyam'));

                return (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchDemoRole(r.key);
                      setDropdownOpen(false);
                    }}
                    className="w-100 text-start btn btn-sm py-2 px-3 d-flex align-items-center justify-content-between rounded"
                    style={{
                      background: isActive ? '#eff6ff' : 'transparent',
                      color: isActive ? '#2563eb' : '#334155',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.82rem'
                    }}
                  >
                    <span>{r.label}</span>
                    {isActive && <Check size={16} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="d-flex align-items-center gap-2 ps-2 border-start">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={user?.name || "User"}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e2e8f0'
            }}
          />
          <div className="d-none d-md-block text-start">
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.name || "User"}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'capitalize' }}>
              {user?.role === 'admin' ? 'Head of Department' : 'Faculty Member'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
