import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Search, Calendar, UserCheck, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await api.getAuditLogs();
        setLogs(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    (l.user_name && l.user_name.toLowerCase().includes(search.toLowerCase())) ||
    (l.new_value && l.new_value.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="brand-font mb-1">Institutional Audit Trail</h2>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Security & Compliance</span>
          </div>
          <p className="text-muted small mb-0">
            Immutable log of all attendance sessions, manual safety overrides, and biometric enrollments.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="custom-card mb-4 p-3">
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0 text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search audit trail by user, action, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Authority</th>
                <th>System Action</th>
                <th>Entity Target</th>
                <th>Modification Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td className="small text-muted" style={{ whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td>
                    <div className="fw-bold text-dark">{log.user_name || 'System Auto'}</div>
                    <div className="text-muted small text-capitalize">{log.role}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-primary border fw-semibold">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary">
                      {log.entity_type} #{log.entity_id}
                    </span>
                  </td>
                  <td>
                    <div className="small text-dark fw-medium">{log.new_value}</div>
                    {log.old_value && (
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Previous: {log.old_value}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
