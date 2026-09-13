import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopNavbar({ setMobileOpen }) {
  const { user } = useAuth();

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

        {/* Portal Breadcrumb / Title */}
        <div className="d-flex align-items-center gap-2">
          <span 
            className="badge bg-light text-dark border px-3 py-2"
            style={{ fontSize: '0.8rem', fontWeight: 600 }}
          >
            {user?.role === 'admin' ? '🏛️ Admin / HOD Portal' : '🎓 Faculty Portal'}
          </span>
        </div>
      </div>

      {/* Right Controls: User Name & Role */}
      <div className="d-flex align-items-center gap-2">
        <div className="text-end">
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
            {user?.name || "User"}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'capitalize' }}>
            {user?.role === 'admin' ? 'Head of Department' : 'Faculty Member'}
          </div>
        </div>
      </div>
    </header>
  );
}
