import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const colorMap = {
    primary: { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb', gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
    success: { bg: '#ecfdf5', border: '#a7f3d0', text: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    danger: { bg: '#fef2f2', border: '#fecaca', text: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    purple: { bg: '#f5f3ff', border: '#ddd6fe', text: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card">
      <div 
        className="stat-icon-wrapper" 
        style={{ background: c.gradient, color: 'white', boxShadow: `0 4px 12px ${c.text}33` }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {subtitle}
          </div>
        )}
      </div>
      {trend && (
        <div 
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '6px',
            background: trend.isUp ? '#ecfdf5' : '#fef2f2',
            color: trend.isUp ? '#059669' : '#dc2626'
          }}
        >
          {trend.isUp ? '↑' : '↓'} {trend.val}
        </div>
      )}
    </div>
  );
}
