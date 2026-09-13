import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, Camera, Users, BookOpen, Clock, CheckCircle2, 
  ArrowRight, ShieldCheck, UserPlus, Sparkles 
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { DailyAttendanceLineChart, AttendanceDoughnutChart } from '../../components/charts/AttendanceCharts';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [facultyInfo, setFacultyInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const totalStudentsCount = students.length;
  const enrolledFacesCount = students.filter(s => s.face_enrolled).length;

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
            value={totalStudentsCount || 6}
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
            title="Today's Attendance Rate"
            value="92.5%"
            subtitle="5 Present / 1 Absent"
            icon={CheckCircle2}
            color="warning"
          />
        </div>
      </div>

      {/* Charts & Quick Actions Grid */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">Class Attendance Trend (Weekly)</h5>
                <small className="text-muted">Attendance percentage for your assigned lectures</small>
              </div>
              <span className="badge bg-primary-subtle text-primary">Your Courses</span>
            </div>
            <div style={{ height: '240px' }}>
              <DailyAttendanceLineChart />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="custom-card h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-1">Today's Lecture Ratio</h5>
              <small className="text-muted">MCA Semester 2 (Cloud Computing)</small>
            </div>
            <div style={{ height: '200px', margin: '1rem 0' }}>
              <AttendanceDoughnutChart present={5} absent={1} />
            </div>
            <div className="d-flex justify-content-between pt-2 border-top small text-muted">
              <span>Present: <strong className="text-success">5 Students</strong></span>
              <span>Absent: <strong className="text-danger">1 Student</strong></span>
            </div>
          </div>
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
