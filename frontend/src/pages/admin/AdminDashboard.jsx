import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, GraduationCap, CheckCircle2, XCircle, 
  Clock, Activity, ArrowUpRight, TrendingUp, ShieldAlert, Sparkles 
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { 
  DailyAttendanceLineChart, CourseAttendanceBarChart, 
  AttendanceDoughnutChart, MonthlyAttendanceTrendChart 
} from '../../components/charts/AttendanceCharts';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [facultyLogs, setFacultyLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Institutional Overview</h2>
          <p className="text-muted small mb-0">
            Real-time biometric attendance metrics, faculty check-in status, and department health.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/reports" className="btn btn-secondary-custom btn-sm">
            Generate Reports
          </Link>
          <Link to="/admin/faculty-attendance" className="btn btn-primary-custom btn-sm">
            <Clock size={16} /> 7:00 AM Faculty Log
          </Link>
        </div>
      </div>

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
              <h5 className="fw-bold mb-0">Monthly Trends (Students vs Faculty)</h5>
              <span className="badge bg-light text-dark border">Semester 2025-26</span>
            </div>
            <div style={{ height: '240px' }}>
              <MonthlyAttendanceTrendChart />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 7:00 AM Faculty Log Summary + Recent Audit Feed */}
      <div className="row g-4">
        {/* 7:00 AM Faculty Log Widget */}
        <div className="col-lg-6">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">Today's Faculty Morning Log (7:00 AM)</h5>
                <small className="text-muted">Biometric arrival records</small>
              </div>
              <Link to="/admin/faculty-attendance" className="text-primary small text-decoration-none fw-semibold">View All Logs →</Link>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Course</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="fw-semibold">{log.faculty_name}</td>
                      <td><span className="badge bg-light text-dark border">{log.course_name || 'Assigned'}</span></td>
                      <td><span className="text-muted small">{log.attendance_time}</span></td>
                      <td>
                        <span className={log.status === 'present' ? 'badge-present' : 'badge-absent'}>
                          {log.status === 'present' ? '✓ Present' : 'Late / Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Audit Activity Feed */}
        <div className="col-lg-6">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">Recent Institutional Activity</h5>
                <small className="text-muted">Audit trail of system actions</small>
              </div>
              <Link to="/admin/audit" className="text-primary small text-decoration-none fw-semibold">Audit Trail →</Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="d-flex align-items-start gap-3 p-2 rounded-2 bg-light border">
                  <div className="p-2 rounded-2 bg-primary-subtle text-primary mt-1">
                    <Activity size={16} />
                  </div>
                  <div className="flex-fill">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold small text-dark">{log.action.replace(/_/g, ' ')}</span>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-muted small">{log.new_value}</div>
                    <div className="text-secondary" style={{ fontSize: '0.7rem' }}>By {log.user_name} ({log.role})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
