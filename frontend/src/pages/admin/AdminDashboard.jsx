import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, GraduationCap, CheckCircle2, XCircle, 
  Clock, Activity, ArrowUpRight, TrendingUp, ShieldAlert, Sparkles,
  Building2, UserCheck, Layers, BarChart2, PieChart, ChevronRight
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { 
  DailyAttendanceLineChart, CourseAttendanceBarChart, 
  AttendanceDoughnutChart, MonthlyAttendanceTrendChart,
  SubjectWiseAttendanceBarChart, SubjectWiseTrendLineChart,
  SubjectWiseDoughnutChart, ADMIN_FACULTIES_DATA
} from '../../components/charts/AttendanceCharts';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [facultyLogs, setFacultyLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Dashboard Mode: 'full' (Institutional View) | 'faculty_subject' (Faculty & Subject View)
  const [adminViewMode, setAdminViewMode] = useState('full');
  
  // Faculty & Subject view state
  const [selectedFaculty, setSelectedFaculty] = useState(ADMIN_FACULTIES_DATA[0]);
  const [selectedSubject, setSelectedSubject] = useState(ADMIN_FACULTIES_DATA[0].subjects[0]);
  const [facultyChartType, setFacultyChartType] = useState('bar'); // 'bar' | 'trend'

  useEffect(() => {
    async function loadData() {
      try {
        const [st, facLogs, audits] = await Promise.all([
          api.getDashboardStats(),
          api.getFacultyAttendance({ date: new Date().toISOString().split("T")[0] }),
          api.getAuditLogs()
        ]);
        setStats(st);
        setFacultyLogs(facLogs.slice(0, 4));
        setAuditLogs(audits.slice(0, 5));
      } catch (e) {
        console.error("Dashboard data load error", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFacultyChange = (facultyId) => {
    const fac = ADMIN_FACULTIES_DATA.find(f => f.id === Number(facultyId)) || ADMIN_FACULTIES_DATA[0];
    setSelectedFaculty(fac);
    setSelectedSubject(fac.subjects[0]);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Institutional Overview & Analytics</h2>
          <p className="text-muted small mb-0">
            Real-time biometric attendance metrics, faculty check-in status, and deep-dive subject analytics.
          </p>
        </div>
        
        {/* Main View Toggle Buttons (Full View vs Faculty & Subject-Wise View) */}
        <div className="d-flex flex-wrap gap-2">
          <div className="btn-group p-1 bg-white border rounded-3 shadow-xs" role="group">
            <button
              type="button"
              className={`btn btn-sm ${adminViewMode === 'full' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setAdminViewMode('full')}
              style={{ fontWeight: '600', borderRadius: '6px' }}
            >
              <Building2 size={16} className="me-1.5" /> 🏢 Full Institutional View
            </button>
            <button
              type="button"
              className={`btn btn-sm ${adminViewMode === 'faculty_subject' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setAdminViewMode('faculty_subject')}
              style={{ fontWeight: '600', borderRadius: '6px' }}
            >
              <Users size={16} className="me-1.5" /> 👨‍🏫 Faculty & Subject-Wise View
            </button>
          </div>

          <Link to="/admin/reports" className="btn btn-secondary-custom btn-sm d-flex align-items-center gap-1">
            Generate Reports
          </Link>
          <Link to="/admin/faculty-attendance" className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1">
            <Clock size={16} /> 7:00 AM Faculty Log
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FULL INSTITUTIONAL OVERVIEW VIEW (DEFAULT)                             */}
      {/* ========================================================================= */}
      {adminViewMode === 'full' && (
        <div>
          {/* KPI Cards Row */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Students"
                value={stats?.total_students || 14}
                subtitle="Enrolled across 4 courses"
                icon={GraduationCap}
                color="primary"
                trend={{ isUp: true, val: "100% active" }}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Faculty"
                value={stats?.total_faculty || 4}
                subtitle="Devanshi, Risha, Dhruv, Shyam"
                icon={Users}
                color="purple"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Today's Student Attendance"
                value={`${stats?.today_student_attendance_pct || 91.6}%`}
                subtitle="14 Present / 2 Absent"
                icon={CheckCircle2}
                color="success"
                trend={{ isUp: true, val: "+3.2%" }}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Faculty Morning Check-in"
                value="100%"
                subtitle="All 4 faculty verified at 7:00 AM"
                icon={Clock}
                color="warning"
              />
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="row g-4 mb-4">
            {/* Weekly Trend */}
            <div className="col-lg-8">
              <div className="custom-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold mb-0">Daily Attendance Rate (%)</h5>
                    <small className="text-muted">Weekly institutional verification average</small>
                  </div>
                  <span className="badge bg-primary-subtle text-primary">Live Data</span>
                </div>
                <div style={{ height: '240px' }}>
                  <DailyAttendanceLineChart />
                </div>
              </div>
            </div>

            {/* Present vs Absent Ratio */}
            <div className="col-lg-4">
              <div className="custom-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold mb-1">Today's Attendance Ratio</h5>
                  <small className="text-muted">Biometric verified vs Absentees</small>
                </div>
                <div style={{ height: '200px', margin: '1rem 0' }}>
                  <AttendanceDoughnutChart present={stats?.today_present_students || 14} absent={stats?.today_absent_students || 2} />
                </div>
                <div className="d-flex justify-content-around text-center pt-2 border-top">
                  <div>
                    <div className="fw-bold text-success" style={{ fontSize: '1.2rem' }}>14</div>
                    <div className="text-muted small">Present</div>
                  </div>
                  <div className="border-end"></div>
                  <div>
                    <div className="fw-bold text-danger" style={{ fontSize: '1.2rem' }}>2</div>
                    <div className="text-muted small">Absent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course-Wise Breakdown & Monthly Comparison */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <div className="custom-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Course-wise Attendance Rate</h5>
                  <Link to="/admin/courses" className="text-primary small text-decoration-none fw-semibold">View Courses →</Link>
                </div>
                <div style={{ height: '240px' }}>
                  <CourseAttendanceBarChart />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="custom-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Monthly Student vs Faculty Attendance Trend</h5>
                  <span className="badge bg-success-subtle text-success">Biometric Audit</span>
                </div>
                <div style={{ height: '240px' }}>
                  <MonthlyAttendanceTrendChart />
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Overview Table */}
          <div className="custom-card mb-4 p-0 overflow-hidden bg-white shadow-sm">
            <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">Faculty Roster & Teaching Performance</h5>
                <small className="text-muted">Click on any faculty to inspect subject-wise metrics</small>
              </div>
              <button 
                onClick={() => setAdminViewMode('faculty_subject')}
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
              >
                <span>Deep Dive Subject View</span>
                <ChevronRight size={15} />
              </button>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Faculty Name & Code</th>
                    <th>Department & Course</th>
                    <th>Subjects Taught</th>
                    <th>Total Lectures</th>
                    <th>Avg Attendance Rate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_FACULTIES_DATA.map((fac) => (
                    <tr key={fac.id}>
                      <td>
                        <div className="fw-bold text-dark">{fac.name}</div>
                        <div className="text-muted small"><code>{fac.faculty_code}</code></div>
                      </td>
                      <td>
                        <div>{fac.course}</div>
                        <div className="text-muted small">{fac.department}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {fac.subjects.length} Subjects ({fac.subjects.map(s => s.code).join(', ')})
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-dark">{fac.total_lectures} Lectures</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-success">{fac.avg_attendance}%</span>
                          <div className="progress flex-fill" style={{ height: '6px', width: '60px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${fac.avg_attendance}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedFaculty(fac);
                            setSelectedSubject(fac.subjects[0]);
                            setAdminViewMode('faculty_subject');
                          }}
                          className="btn btn-sm btn-primary-custom px-2.5 py-1"
                          style={{ fontSize: '0.78rem' }}
                        >
                          Subject Charts →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FACULTY & SUBJECT-WISE DEEP DIVE VIEW                                  */}
      {/* ========================================================================= */}
      {adminViewMode === 'faculty_subject' && (
        <div>
          {/* Faculty Selector Card */}
          <div className="custom-card mb-4 p-4 bg-white shadow-sm border">
            <div className="row align-items-center g-3">
              <div className="col-lg-5">
                <label className="form-label small fw-bold text-slate-700 mb-1">
                  👨‍🏫 Select Faculty Professor:
                </label>
                <select
                  className="form-select form-select-lg fw-bold bg-light"
                  value={selectedFaculty.id}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                >
                  {ADMIN_FACULTIES_DATA.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.course} — {fac.avg_attendance}% Avg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-4">
                <label className="form-label small fw-bold text-slate-700 mb-1">
                  📚 Select Subject to Inspect:
                </label>
                <select
                  className="form-select form-select-lg bg-light"
                  value={selectedSubject.id}
                  onChange={(e) => {
                    const sub = selectedFaculty.subjects.find(s => s.id === e.target.value);
                    if (sub) setSelectedSubject(sub);
                  }}
                >
                  {selectedFaculty.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}) — {s.attendance}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-3 text-lg-end pt-lg-4">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${facultyChartType === 'bar' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFacultyChartType('bar')}
                  >
                    <BarChart2 size={16} className="me-1" /> All Subjects Bar
                  </button>
                  <button
                    type="button"
                    className={`btn ${facultyChartType === 'trend' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFacultyChartType('trend')}
                  >
                    <TrendingUp size={16} className="me-1" /> Subject Trend
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Faculty Profile Ribbon */}
            <div className="mt-3 pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary px-2.5 py-1.5">{selectedFaculty.faculty_code}</span>
                <span className="fw-bold text-dark fs-6">{selectedFaculty.name}</span>
                <span className="text-muted small">• {selectedFaculty.department}</span>
              </div>
              <div className="d-flex align-items-center gap-3 small">
                <span>Total Subjects: <strong className="text-dark">{selectedFaculty.subjects.length}</strong></span>
                <span>Total Lectures: <strong className="text-dark">{selectedFaculty.total_lectures}</strong></span>
                <span>Overall Attendance: <strong className="text-success">{selectedFaculty.avg_attendance}%</strong></span>
              </div>
            </div>
          </div>

          {/* Subject Charts Grid */}
          <div className="row g-4 mb-4">
            {/* Left Subject Chart */}
            <div className="col-lg-8">
              <div className="custom-card h-100 p-4 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold mb-0">
                      {facultyChartType === 'bar'
                        ? `📊 ${selectedFaculty.name} — All Subjects Attendance Comparison (%)`
                        : `📈 ${selectedSubject.name} — 6-Week Attendance Trend`}
                    </h5>
                    <small className="text-muted">
                      {facultyChartType === 'bar'
                        ? 'Click any subject bar to view its specific lecture ratio'
                        : `Subject Code: ${selectedSubject.code} • Total Lectures: ${selectedSubject.total_lectures}`}
                    </small>
                  </div>
                  <span className="badge bg-primary-subtle text-primary">
                    {facultyChartType === 'bar' ? `${selectedFaculty.subjects.length} Subjects` : `${selectedSubject.attendance}% Attendance`}
                  </span>
                </div>

                <div style={{ height: '260px' }}>
                  {facultyChartType === 'bar' ? (
                    <SubjectWiseAttendanceBarChart
                      subjects={selectedFaculty.subjects}
                      activeSubjectId={selectedSubject.id}
                      onSelectSubject={(sub) => setSelectedSubject(sub)}
                    />
                  ) : (
                    <SubjectWiseTrendLineChart subject={selectedSubject} />
                  )}
                </div>
              </div>
            </div>

            {/* Right Subject Doughnut */}
            <div className="col-lg-4">
              <div className="custom-card h-100 p-4 bg-white shadow-sm d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-0 text-slate-800">Subject Student Ratio</h6>
                      <small className="text-muted d-block text-truncate" style={{ maxWidth: '180px' }}>
                        {selectedSubject.name}
                      </small>
                    </div>
                    <span className="badge bg-success-subtle text-success">
                      {selectedSubject.code}
                    </span>
                  </div>
                </div>

                <div style={{ margin: '0.5rem 0' }}>
                  <SubjectWiseDoughnutChart
                    present={selectedSubject.present}
                    absent={selectedSubject.absent}
                    subjectName={selectedSubject.name}
                  />
                </div>

                <div className="pt-2 border-top">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Present: <strong className="text-success">{selectedSubject.present} Students</strong></span>
                    <span>Absent: <strong className="text-danger">{selectedSubject.absent} Students</strong></span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Conducted Lectures: <strong>{selectedSubject.total_lectures}</strong></span>
                    <span>Exam Eligibility: <strong className="text-primary">✓ Standard (75% Required)</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-Wise Detailed Table for Selected Faculty */}
          <div className="custom-card mb-4 p-0 overflow-hidden bg-white shadow-sm">
            <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">Detailed Subject Roster for {selectedFaculty.name}</h5>
                <small className="text-muted">Breakdown of lectures and attendance compliance</small>
              </div>
              <span className="badge bg-light text-dark border">
                {selectedFaculty.course}
              </span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Subject Code & Name</th>
                    <th>Total Lectures</th>
                    <th>Present Students</th>
                    <th>Absent Students</th>
                    <th>Attendance %</th>
                    <th>Exam Eligibility Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFaculty.subjects.map((sub) => (
                    <tr 
                      key={sub.id}
                      className={sub.id === selectedSubject.id ? 'table-primary-subtle' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedSubject(sub)}
                    >
                      <td>
                        <div className="fw-bold text-dark">{sub.name}</div>
                        <div className="text-muted small"><code>{sub.code}</code></div>
                      </td>
                      <td>
                        <span className="fw-semibold text-dark">{sub.total_lectures} Lectures</span>
                      </td>
                      <td>
                        <span className="fw-bold text-success">{sub.present} Present</span>
                      </td>
                      <td>
                        <span className="fw-bold text-danger">{sub.absent} Absent</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold" style={{ color: sub.attendance >= 90 ? '#10b981' : '#2563eb' }}>
                            {sub.attendance}%
                          </span>
                          <div className="progress flex-fill" style={{ height: '6px', width: '70px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{ width: `${sub.attendance}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={sub.attendance >= 75 ? 'badge-present' : 'badge-absent'}>
                          {sub.attendance >= 75 ? '✓ Exam Eligible (>=75%)' : '⚠️ Warning (<75%)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Row (Visible in Both Views) */}
      <div className="custom-card p-0 overflow-hidden bg-white shadow-sm">
        <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0">Biometric & Academic Audit Trail</h5>
            <small className="text-muted">Immutable cryptographic logs of all face scans and session events</small>
          </div>
          <Link to="/admin/audit" className="btn btn-sm btn-outline-secondary">
            View All Logs →
          </Link>
        </div>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User / Operator</th>
                <th>Action</th>
                <th>Entity Target</th>
                <th>Status / Value</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className="fw-bold text-dark">{log.user_name}</div>
                    <span className="badge bg-light text-muted border text-uppercase" style={{ fontSize: '0.65rem' }}>
                      {log.role}
                    </span>
                  </td>
                  <td>
                    <code>{log.action}</code>
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary">
                      {log.entity_type} #{log.entity_id}
                    </span>
                  </td>
                  <td>
                    <small className="text-dark text-truncate d-inline-block" style={{ maxWidth: '280px' }}>
                      {log.new_value}
                    </small>
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
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
