import React, { useState, useEffect } from 'react';
import { CheckSquare, Search, Filter, Calendar, Users, Eye, CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function StudentAttendancePage() {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeRosterModal, setActiveRosterModal] = useState(null);
  const [rosterData, setRosterData] = useState([]);

  const { addToast } = useNotification();

  const loadData = async () => {
    try {
      const [crs] = await Promise.all([api.getCourses()]);
      setCourses(crs);
      const sess = await api.getSessionRoster(1); // Default demo session
      setSessions([
        {
          id: 1,
          faculty_name: "Devanshi Patel",
          course_name: "MCA - Master of Computer Applications",
          semester: 2,
          division: "A",
          subject: "Cloud Computing & AI Architecture",
          date: new Date().toISOString().split("T")[0],
          start_time: "08:00:00 AM",
          end_time: "08:50:00 AM",
          present_count: 5,
          absent_count: 1,
          total_enrolled: 6,
          status: "completed"
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCourse, selectedDate]);

  const handleInspectSession = async (session) => {
    try {
      const res = await api.getSessionRoster(session.id);
      setActiveRosterModal(session);
      setRosterData(res.roster || []);
    } catch (e) {
      addToast('Could not load session roster', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Student Attendance Master View</h2>
          <p className="text-muted small mb-0">
            Monitor institutional classroom attendance sessions initiated by faculty across all degrees.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="custom-card mb-4 p-3">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">Filter by Course</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">All Academic Degrees</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Sessions Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Lecture Subject & Class</th>
                <th>Course Degree</th>
                <th>Presiding Faculty</th>
                <th>Time Window</th>
                <th>Attendance Summary</th>
                <th>Status</th>
                <th className="text-end">Roster</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((sess) => {
                const pct = Math.round((sess.present_count / sess.total_enrolled) * 100) || 0;
                return (
                  <tr key={sess.id}>
                    <td>
                      <div className="fw-bold text-dark">{sess.subject}</div>
                      <div className="text-muted small">Semester {sess.semester} • Division {sess.division}</div>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        {sess.course_name}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{sess.faculty_name}</div>
                      <div className="text-muted small">Face AI Initiator</div>
                    </td>
                    <td>
                      <span className="small text-muted">{sess.start_time} - {sess.end_time}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-success">{sess.present_count} P</span>
                        <span className="text-muted">/</span>
                        <span className="fw-bold text-danger">{sess.absent_count} A</span>
                        <span className="badge bg-light text-dark border ms-1">({pct}%)</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-present">Completed</span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleInspectSession(sess)}
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                      >
                        <Eye size={14} /> View Roster
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roster Inspection Modal */}
      {activeRosterModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div className="bg-white rounded-4 shadow-xl border w-100" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-4">
              <div>
                <h5 className="fw-bold mb-1">{activeRosterModal.subject}</h5>
                <div className="text-muted small">
                  Faculty: <strong>{activeRosterModal.faculty_name}</strong> • Date: {activeRosterModal.date}
                </div>
              </div>
              <button 
                onClick={() => setActiveRosterModal(null)}
                className="btn btn-sm btn-light p-1 rounded-circle"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Roll No.</th>
                      <th>Student Name</th>
                      <th>Biometric Method</th>
                      <th>Scan Timestamp</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rosterData.map((st, i) => (
                      <tr key={i}>
                        <td className="fw-semibold text-primary">{st.enrollment_number}</td>
                        <td className="fw-bold text-dark">{st.name}</td>
                        <td>
                          <span className="badge bg-light text-dark border">{st.recognition_method}</span>
                        </td>
                        <td className="small text-muted">{st.recognition_time}</td>
                        <td>
                          <span className={st.status === 'present' ? 'badge-present' : 'badge-absent'}>
                            {st.status === 'present' ? '✓ Present' : '✕ Absent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 border-top text-end bg-light rounded-bottom-4">
              <button onClick={() => setActiveRosterModal(null)} className="btn btn-secondary-custom btn-sm">
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
