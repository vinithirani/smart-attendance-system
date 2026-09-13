import React, { useState, useEffect } from 'react';
import { Clock, Filter, Calendar, Users, CheckCircle2, Download, Printer, ArrowDownToLine } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function FacultyAttendancePage() {
  const [logs, setLogs] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const { addToast } = useNotification();

  const loadData = async () => {
    try {
      const [fLogs, facs] = await Promise.all([
        api.getFacultyAttendance({ date: selectedDate, faculty_id: selectedFaculty, status: statusFilter }),
        api.getFaculty()
      ]);
      setLogs(fLogs);
      setFacultyList(facs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedFaculty, statusFilter, selectedDate]);

  const handleExportCSV = () => {
    if (logs.length === 0) {
      addToast('No records to export', 'warning');
      return;
    }
    const headers = ["ID", "Faculty Name", "Course", "Date", "Attendance Time", "Status", "Method", "Remarks"];
    const rows = logs.map(l => [
      l.id,
      `"${l.faculty_name}"`,
      `"${l.course_name || 'All Assigned'}"`,
      l.date,
      l.attendance_time,
      l.status,
      `"${l.check_in_method}"`,
      `"${l.remarks || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faculty_attendance_log_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Faculty attendance report exported to CSV', 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="brand-font mb-1">Faculty Morning Attendance Log</h2>
            <span className="badge bg-warning text-dark border fw-bold">7:00 AM Shift</span>
          </div>
          <p className="text-muted small mb-0">
            Institutional morning biometric check-in records for all department faculty members.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => window.print()} className="btn btn-secondary-custom btn-sm">
            <Printer size={16} /> Print Log
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary-custom btn-sm">
            <ArrowDownToLine size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="custom-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-success-subtle text-success">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-muted small fw-bold">TODAY'S VERIFIED FACULTY</div>
              <div className="fw-bold" style={{ fontSize: '1.4rem' }}>4 / 4 Present</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-primary-subtle text-primary">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-muted small fw-bold">MANDATORY CHECK-IN WINDOW</div>
              <div className="fw-bold" style={{ fontSize: '1.4rem' }}>07:00 AM Sharp</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-info-subtle text-info">
              <Users size={24} />
            </div>
            <div>
              <div className="text-muted small fw-bold">PUNCTUALITY RATE</div>
              <div className="fw-bold text-success" style={{ fontSize: '1.4rem' }}>98.5%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="custom-card mb-4 p-3">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small fw-bold text-slate-700">Date Selection</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                className="form-control border-start-0"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold text-slate-700">Filter by Faculty</label>
            <select
              className="form-select"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="">All Faculty Members</option>
              {facultyList.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.faculty_code})</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold text-slate-700">Attendance Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="present">Present (On-Time)</option>
              <option value="late">Late Arrival</option>
              <option value="absent">Absent / On-Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* 7:00 AM Attendance Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Faculty Member</th>
                <th>Course / Department</th>
                <th>Date</th>
                <th>Check-In Time</th>
                <th>Verification Method</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No faculty attendance records found for this date.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="fw-bold text-dark">{log.faculty_name}</div>
                      <div className="text-muted small">Lead Faculty</div>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        {log.course_name || 'Academic Core'}
                      </span>
                    </td>
                    <td>
                      <span className="text-dark small fw-semibold">{log.date}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1 fw-bold text-slate-800">
                        <Clock size={14} className="text-muted" /> {log.attendance_time}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {log.check_in_method || 'Biometric Check-In'}
                      </span>
                    </td>
                    <td>
                      <span className={log.status === 'present' ? 'badge-present' : 'badge-absent'}>
                        {log.status === 'present' ? '✓ Present' : log.status === 'late' ? '⚠ Late Arrival' : '✕ Absent'}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted small">{log.remarks || 'Standard morning shift'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
