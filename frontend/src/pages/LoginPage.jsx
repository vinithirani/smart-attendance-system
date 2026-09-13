import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScanLine, Lock, Mail, ArrowRight, Shield, UserCheck, Eye, EyeOff, Sparkles, Github, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function LoginPage() {
  const [roleTab, setRoleTab] = useState('faculty'); // 'admin' or 'faculty'
  const [email, setEmail] = useState('devanshi@smartattendance.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleRoleTabChange = (role) => {
    setRoleTab(role);
    if (role === 'admin') {
      setEmail('admin@smartattendance.edu');
    } else {
      setEmail('devanshi@smartattendance.edu');
    }
  };

  const handleQuickDemoFill = (selectedEmail, selectedRole) => {
    setRoleTab(selectedRole);
    setEmail(selectedEmail);
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      // Handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-5 px-3 hero-gradient">
      <div className="w-100" style={{ maxWidth: '480px' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)'
              }}
            >
              <ScanLine size={28} />
            </div>
            <div className="text-start">
              <span className="brand-font" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                SmartAttend<span style={{ color: '#2563eb' }}>AI</span>
              </span>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Biometric Portal
              </div>
            </div>
          </Link>
          <h2 className="fw-bold" style={{ fontSize: '1.6rem' }}>Sign In to Portal</h2>
          <p className="text-muted small">Select your role to access your personalized academic dashboard.</p>
        </div>

        {/* Login Card */}
        <div className="custom-card bg-white p-4 p-sm-5 shadow-lg border rounded-4">
          {/* Role Selection Tabs */}
          <div className="d-flex p-1 bg-light rounded-3 mb-4 border">
            <button
              type="button"
              onClick={() => handleRoleTabChange('faculty')}
              className="flex-fill btn py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{
                background: roleTab === 'faculty' ? '#ffffff' : 'transparent',
                color: roleTab === 'faculty' ? '#2563eb' : '#64748b',
                borderRadius: '8px',
                boxShadow: roleTab === 'faculty' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                fontSize: '0.9rem'
              }}
            >
              <UserCheck size={18} />
              <span>Faculty Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className="flex-fill btn py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{
                background: roleTab === 'admin' ? '#ffffff' : 'transparent',
                color: roleTab === 'admin' ? '#2563eb' : '#64748b',
                borderRadius: '8px',
                boxShadow: roleTab === 'admin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                fontSize: '0.9rem'
              }}
            >
              <Shield size={18} />
              <span>Admin / HOD</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-slate-700">Institutional Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smartattendance.edu"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-slate-700 d-flex justify-content-between">
                <span>Password</span>
                <span className="text-muted fw-normal" style={{ fontSize: '0.78rem' }}>Default: password123</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border-start-0 border-end-0 ps-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-custom w-100 py-2 justify-content-center mb-4"
              style={{ fontSize: '0.95rem' }}
            >
              {loading ? 'Authenticating...' : `Enter as ${roleTab === 'admin' ? 'Admin / HOD' : 'Faculty'}`}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts for College Evaluators */}
          <div className="pt-3 border-top">
            <div className="d-flex align-items-center gap-1 mb-2 text-muted fw-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <Sparkles size={14} className="text-warning" />
              <span>1-Click Demo Accounts for Evaluation</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin@smartattendance.edu', 'admin')}
                className="btn btn-sm btn-outline-primary py-1 px-2"
                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              >
                👑 Admin / HOD
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('devanshi@smartattendance.edu', 'faculty')}
                className="btn btn-sm btn-outline-secondary py-1 px-2"
                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              >
                👩‍🏫 Devanshi Patel (MCA)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('risha@smartattendance.edu', 'faculty')}
                className="btn btn-sm btn-outline-secondary py-1 px-2"
                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              >
                👩‍🏫 Risha Tiwari (BCA)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('dhruv@smartattendance.edu', 'faculty')}
                className="btn btn-sm btn-outline-secondary py-1 px-2"
                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              >
                👨‍🏫 Dhruv Patel (B.Tech)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('shyam@smartattendance.edu', 'faculty')}
                className="btn btn-sm btn-outline-secondary py-1 px-2"
                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              >
                👨‍🏫 Shyam Chavda (M.Tech)
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-4 text-muted small px-2">
          <Link to="/" className="text-decoration-none text-muted fw-semibold">← Return to Home</Link>
          <div className="d-flex align-items-center gap-3">
            <a href="https://github.com/vinithirani/smart-attendance-system" target="_blank" rel="noreferrer" className="text-decoration-none text-muted d-flex align-items-center gap-1 hover-text-primary">
              <Github size={14} /> GitHub
            </a>
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-decoration-none text-muted d-flex align-items-center gap-1 hover-text-primary">
              ▲ Vercel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
