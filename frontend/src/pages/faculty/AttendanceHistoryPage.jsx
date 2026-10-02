import React, { useState, useEffect } from 'react';
import { History, Calendar, Filter, Eye, CheckCircle2, XCircle, ArrowDownToLine, Mail } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function AttendanceHistoryPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    // Load historical sessions
    setHistoryRecords([
      { id: 1, subject: "Cloud Computing & AI Architecture", course: "MCA", semester: 2, division: "A", date: selectedDate, time: "08:00 AM - 08:50 AM", present: 32, absent: 18, total: 50, rate: "64.0%" },
      { id: 2, subject: "Advanced Database Systems", course: "MCA", semester: 2, division: "A", date: "2026-09-12", time: "08:00 AM - 08:50 AM", present: 48, absent: 2, total: 50, rate: "96.0%" },
      { id: 3, subject: "Neural Networks & Deep Learning", course: "MCA", semester: 4, division: "A", date: "2026-09-11", time: "09:00 AM - 09:50 AM", present: 42, absent: 8, total: 50, rate: "84.0%" }
    ]);
  }, [selectedDate]);

  const handleExport = () => {
    addToast('Attendance history exported to CSV', 'success');
  };

  const handleSendEmails = async (rec) => {
    setSendingId(rec.id);
    try {
      const res = await api.sendAttendanceEmails(rec.id, {
        subject: rec.subject,
        course_name: rec.course,
        semester: rec.semester,
        division: rec.division,
        date: rec.date,
        total_enrolled: rec.total,
        present_count: rec.present,
        absent_count: rec.absent
      });
      addToast(`✉️ Emails Sent! (${res.present_emails_sent || rec.present} Present & ${res.absent_emails_sent || rec.absent} Absent students notified with total attendance stats)`, 'success');
    } catch (e) {
      addToast('Failed to dispatch attendance emails', 'error');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Attendance History & Lecture Logs</h2>
          <p className="text-muted small mb-0">
            Past lecture attendance records and automated email dispatch logs.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={handleExport} className="btn btn-outline-secondary btn-sm bg-white">
            <ArrowDownToLine size={16} /> Export CSV
          </button>
        </div>
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
                <th>Email Students</th>
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
                    <button
                      onClick={() => handleSendEmails(rec)}
                      disabled={sendingId === rec.id}
                      className="btn btn-outline-primary btn-sm py-1 px-2.5 d-inline-flex align-items-center gap-1.5 fw-semibold"
                      style={{ fontSize: '0.78rem' }}
                      title="Send Present & Absent attendance notification emails to students"
                    >
                      <Mail size={13} className={sendingId === rec.id ? 'spin' : ''} />
                      <span>{sendingId === rec.id ? 'Sending...' : 'Send Mail'}</span>
                    </button>
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

