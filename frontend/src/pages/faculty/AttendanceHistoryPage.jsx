import React, { useState, useEffect } from 'react';
import { History, Calendar, Filter, Eye, CheckCircle2, XCircle, ArrowDownToLine } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function AttendanceHistoryPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    // Load historical sessions
    setHistoryRecords([
      { id: 1, subject: "Cloud Computing & AI Architecture", course: "MCA", semester: 2, division: "A", date: selectedDate, time: "08:00 AM - 08:50 AM", present: 5, absent: 1, rate: "92.5%" },
      { id: 2, subject: "Advanced Database Systems", course: "MCA", semester: 2, division: "A", date: "2026-09-12", time: "08:00 AM - 08:50 AM", present: 6, absent: 0, rate: "100%" },
      { id: 3, subject: "Neural Networks & Deep Learning", course: "MCA", semester: 4, division: "A", date: "2026-09-11", time: "09:00 AM - 09:50 AM", present: 4, absent: 1, rate: "80.0%" }
    ]);
  }, [selectedDate]);

  const handleExport = () => {
    addToast('Attendance history exported to CSV', 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Attendance History & Lecture Logs</h2>
          <p className="text-muted small mb-0">
            Past lecture attendance records and biometric verification logs conducted by you.
          </p>
        </div>
        <button onClick={handleExport} className="btn btn-primary-custom btn-sm">
          <ArrowDownToLine size={16} /> Export CSV
        </button>
      </div>

      {/* History Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Lecture Subject</th>
                <th>Course & Batch</th>
                <th>Date & Time</th>
                <th>Attendance Count</th>
                <th>Success Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyRecords.map((rec) => (
                <tr key={rec.id}>
                  <td>
                    <div className="fw-bold text-dark">{rec.subject}</div>
                    <div className="text-muted small">ID: LECT-SESS-00{rec.id}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {rec.course} • Sem {rec.semester}-{rec.division}
                    </span>
                  </td>
                  <td>
                    <div className="small text-dark fw-semibold">{rec.date}</div>
                    <div className="text-muted small">{rec.time}</div>
                  </td>
                  <td>
                    <span className="fw-bold text-success">{rec.present} Present</span>
                    <span className="text-muted"> / </span>
                    <span className="fw-bold text-danger">{rec.absent} Absent</span>
                  </td>
                  <td>
                    <span className="fw-bold text-primary">{rec.rate}</span>
                  </td>
                  <td>
                    <span className="badge-present">Completed</span>
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
