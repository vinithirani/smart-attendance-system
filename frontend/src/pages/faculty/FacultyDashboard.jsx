import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, Camera, Users, BookOpen, Clock, CheckCircle2, 
  ArrowRight, ShieldCheck, UserPlus, Sparkles, BarChart2,
  TrendingUp, PieChart, Layers, CheckCircle
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { 
  SubjectWiseAttendanceBarChart, 
  SubjectWiseTrendLineChart, 
  SubjectWiseDoughnutChart,
  FACULTY_SUBJECTS 
} from '../../components/charts/AttendanceCharts';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [facultyInfo, setFacultyInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subject-wise state
  const [selectedSubject, setSelectedSubject] = useState(FACULTY_SUBJECTS[0]);
  const [chartViewMode, setChartViewMode] = useState('comparison'); // 'comparison' | 'trend'

  useEffect(() => {
    async function loadFacultyData() {
      try {
        const facs = await api.getFaculty();
        const me = facs.find(f => f.email === user?.email || f.name === user?.name) || facs[0];
        setFacultyInfo(me);

        const stus = await api.getStudents({}, user);
        setStudents(stus);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFacultyData();
  }, [user]);

  const assignedCourses = facultyInfo?.assigned_courses || [];
  const totalStudentsCount = students.length || 6;
  const enrolledFacesCount = students.filter(s => s.face_enrolled).length || 5;

  return (
    <div>
      {/* Welcome Banner */}
      <div 
        className="custom-card mb-4 p-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8">
            <span className="badge bg-primary px-3 py-1 mb-2">Faculty Portal</span>
            <h2 className="brand-font text-white mb-2">
              Welcome, {facultyInfo?.name || user?.name || "Professor"}!
            </h2>
            <p className="text-slate-300 mb-4" style={{ maxWidth: '600px' }}>
              Department of {facultyInfo?.department || "Computer Applications"} • Faculty Code: <strong>{facultyInfo?.faculty_code || "FAC-001"}</strong>
            </p>

            <div className="d-flex flex-wrap gap-2">
              <Link to="/faculty/take-attendance" className="btn btn-primary-custom px-4 py-2">
                <ScanLine size={18} /> Launch Face Attendance Scanner
              </Link>
              <Link to="/faculty/face-enrollment" className="btn btn-secondary-custom px-3 py-2">
                <Camera size={18} /> Enroll Student Face
              </Link>
              <Link to="/faculty/register-student" className="btn btn-light px-3 py-2">
                <UserPlus size={18} /> Register Student
              </Link>
            </div>
          </div>

          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <div className="p-3 rounded-3 glass-dark d-inline-block text-start border">
              <div className="small text-slate-400 mb-1">Morning 7:00 AM Check-In</div>
              <div className="fw-bold text-success d-flex align-items-center gap-1">
                <CheckCircle2 size={16} /> Verified On-Time (07:00 AM)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="My Assigned Courses"
            value={assignedCourses.length || 2}
            subtitle={assignedCourses.map(c => c.course_code).join(', ') || 'MCA'}
            icon={BookOpen}
            color="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Students in Scope"
            value={totalStudentsCount}
            subtitle="Scoped to your courses only"
            icon={Users}
            color="purple"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Biometric Face Enrolled"
            value={`${enrolledFacesCount} / ${totalStudentsCount}`}
            subtitle="Ready for AI scanning"
            icon={Camera}
            color="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Avg Subject Attendance"
            value="91.2%"
            subtitle="Across 5 Teaching Subjects"
            icon={CheckCircle2}
            color="warning"
          />
        </div>
      </div>

      {/* ================= SUBJECT-WISE CHARTS & ANALYTICS SECTION ================= */}
      <div className="custom-card mb-4 p-4 bg-white shadow-sm">
        {/* Section Header with Subject Selector and View Toggles */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 mb-4 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2">
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Layers size={18} />
              </div>
              <h5 className="fw-bold mb-0 brand-font">Subject-Wise Attendance Analytics</h5>
            </div>
            <small className="text-muted">
              Live biometric attendance breakdown across all curriculum subjects taught by you
            </small>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Subject Selector Dropdown */}
            <div className="d-flex align-items-center gap-1.5">
              <span className="small text-muted fw-semibold">Subject:</span>
              <select 
                className="form-select form-select-sm"
                style={{ minWidth: '220px', fontWeight: '500' }}
                value={selectedSubject.id}
                onChange={(e) => {
                  const sub = FACULTY_SUBJECTS.find(s => s.id === e.target.value);
                  if (sub) setSelectedSubject(sub);
                }}
              >
                {FACULTY_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.attendance}%)
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle: Bar vs Line Trend */}
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${chartViewMode === 'comparison' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setChartViewMode('comparison')}
                title="All Subjects Comparison Bar Chart"
              >
                <BarChart2 size={15} className="me-1" /> All Subjects
              </button>
              <button
                type="button"
                className={`btn ${chartViewMode === 'trend' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setChartViewMode('trend')}
                title="Weekly Trend Line Chart for Selected Subject"
              >
                <TrendingUp size={15} className="me-1" /> Weekly Trend
              </button>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-4">
          {/* Main Subject Chart (Bar or Line) */}
          <div className="col-lg-8">
            <div className="p-3 bg-light rounded-3 border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="fw-bold mb-0 text-slate-800">
                    {chartViewMode === 'comparison' 
                      ? '📊 All Subjects Attendance Comparison (%)' 
                      : `📈 ${selectedSubject.name} — 6-Week Attendance Trend`}
                  </h6>
                  <small className="text-muted">
                    {chartViewMode === 'comparison'
                      ? 'Click on any bar to switch ratio view or view subject metrics'
                      : `Course Code: ${selectedSubject.code} • Total Lectures: ${selectedSubject.total_lectures}`}
                  </small>
                </div>
                <span className="badge bg-primary-subtle text-primary">
                  {chartViewMode === 'comparison' ? '5 Subjects' : `${selectedSubject.attendance}% Average`}
                </span>
              </div>

              <div style={{ height: '240px' }}>
                {chartViewMode === 'comparison' ? (
                  <SubjectWiseAttendanceBarChart 
                    subjects={FACULTY_SUBJECTS}
                    activeSubjectId={selectedSubject.id}
                    onSelectSubject={(sub) => setSelectedSubject(sub)}
                  />
                ) : (
                  <SubjectWiseTrendLineChart subject={selectedSubject} />
                )}
              </div>
            </div>
          </div>

          {/* Right Subject Doughnut Chart */}
          <div className="col-lg-4">
            <div className="p-3 bg-light rounded-3 border h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-0 text-slate-800">Lecture Ratio</h6>
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
                  <span>Total Lectures: <strong>{selectedSubject.total_lectures}</strong></span>
                  <span>Status: <strong className="text-primary">✓ Exam Eligible</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Summary Mini Badges / Cards */}
        <div className="row g-2 mt-3 pt-3 border-top">
          {FACULTY_SUBJECTS.map((sub) => {
            const isSelected = sub.id === selectedSubject.id;
            return (
              <div className="col-6 col-md-4 col-lg" key={sub.id}>
                <div 
                  onClick={() => setSelectedSubject(sub)}
                  className={`p-2.5 rounded-3 border text-start cursor-pointer transition-all ${
                    isSelected ? 'bg-primary-subtle border-primary shadow-xs' : 'bg-white hover-bg-light'
                  }`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-light text-dark border px-1.5 py-0.5" style={{ fontSize: '0.68rem' }}>
                      {sub.code}
                    </span>
                    <span 
                      className={`fw-bold ${sub.attendance >= 90 ? 'text-success' : 'text-primary'}`} 
                      style={{ fontSize: '0.82rem' }}
                    >
                      {sub.attendance}%
                    </span>
                  </div>
                  <div className="fw-semibold text-dark text-truncate small" title={sub.name}>
                    {sub.name}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {sub.total_lectures} Lectures • {sub.present} Present
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Classes Roster Card */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
          <div>
            <h5 className="fw-bold mb-0">My Assigned Courses & Batches</h5>
            <small className="text-muted">Course-bound role access controls</small>
          </div>
          <Link to="/faculty/take-attendance" className="btn btn-primary-custom btn-sm">
            Take Attendance Now <ArrowRight size={16} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Semester & Class</th>
                <th>Total Students</th>
                <th>Face Enrolled</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedCourses.map((c, i) => (
                <tr key={i}>
                  <td>
                    <div className="fw-bold text-dark">{c.course_name || c.course_code}</div>
                    <div className="text-muted small">Academic Degree</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      Semester {c.semester} • Div {c.division}
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-dark">{totalStudentsCount} Students</span>
                  </td>
                  <td>
                    <span className="badge-enrolled">
                      {enrolledFacesCount} / {totalStudentsCount} Enrolled
                    </span>
                  </td>
                  <td>
                    <Link to="/faculty/take-attendance" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                      <ScanLine size={14} /> Start Scanner
                    </Link>
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
