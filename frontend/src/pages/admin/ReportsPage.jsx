import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, Filter, Calendar, 
  BarChart3, CheckCircle2, Users, BookOpen, Layers, ArrowDownToLine
} from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { ADMIN_FACULTIES_DATA } from '../../components/charts/AttendanceCharts';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('faculty_subject'); // 'faculty_subject', 'daily', 'monthly', 'course', 'yearly'
  const [selectedFacultyId, setSelectedFacultyId] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportData, setReportData] = useState([]);

  const { addToast } = useNotification();

  const generateReport = () => {
    if (reportType === 'faculty_subject') {
      const rows = [];
      let idx = 1;
      ADMIN_FACULTIES_DATA.forEach(fac => {
        if (selectedFacultyId === 'all' || Number(selectedFacultyId) === fac.id) {
          fac.subjects.forEach(sub => {
            rows.push({
              id: idx++,
              entity: `${sub.name} (${sub.code})`,
              type: `Subject • ${fac.course}`,
              time: `${sub.total_lectures} Lectures Total`,
              faculty: fac.name,
              status: `${sub.present} Present / ${sub.absent} Absent`,
              rate: `${sub.attendance}%`
            });
          });
        }
      });
      setReportData(rows);
    } else if (reportType === 'daily') {
      setReportData([
        { id: 1, entity: "Aarav Mehta (MCA)", type: "Student", time: "08:02 AM", faculty: "Devanshi Patel", status: "Present", rate: "94%" },
        { id: 2, entity: "Ananya Sharma (MCA)", type: "Student", time: "08:03 AM", faculty: "Devanshi Patel", status: "Present", rate: "96%" },
        { id: 3, entity: "Rohan Verma (MCA)", type: "Student", time: "08:04 AM", faculty: "Devanshi Patel", status: "Present", rate: "88%" },
        { id: 4, entity: "Kabir Joshi (MCA)", type: "Student", time: "-", faculty: "Devanshi Patel", status: "Absent", rate: "76%" },
        { id: 5, entity: "Devanshi Patel", type: "Faculty (MCA)", time: "07:00 AM", faculty: "Biometric Shift", status: "Present", rate: "100%" },
        { id: 6, entity: "Risha Tiwari", type: "Faculty (BCA)", time: "06:58 AM", faculty: "Biometric Shift", status: "Present", rate: "100%" },
        { id: 7, entity: "Dhruv Patel", type: "Faculty (B.Tech)", time: "07:04 AM", faculty: "Biometric Shift", status: "Present", rate: "100%" },
        { id: 8, entity: "Shyam Chavda", type: "Faculty (M.Tech)", time: "07:15 AM", faculty: "Biometric Shift", status: "Late", rate: "95%" },
      ]);
    } else if (reportType === 'monthly') {
      setReportData([
        { id: 1, entity: "MCA - Sem 2", type: "Course Batch", time: "May 2026", faculty: "Devanshi Patel", status: "92.5% Attendance", rate: "Active" },
        { id: 2, entity: "BCA - Sem 2", type: "Course Batch", time: "May 2026", faculty: "Risha Tiwari", status: "88.0% Attendance", rate: "Active" },
        { id: 3, entity: "B.Tech - Sem 4", type: "Course Batch", time: "May 2026", faculty: "Dhruv Patel", status: "91.2% Attendance", rate: "Active" },
        { id: 4, entity: "M.Tech - Sem 2", type: "Course Batch", time: "May 2026", faculty: "Shyam Chavda", status: "96.0% Attendance", rate: "Active" },
      ]);
    } else if (reportType === 'course') {
      setReportData([
        { id: 1, entity: "MCA - Sem 2 Div A", type: "Full Course", time: "110 Lectures", faculty: "Devanshi Patel", status: "91.2% Aggregate", rate: "Compliant" },
        { id: 2, entity: "BCA - Sem 2 Div A", type: "Full Course", time: "95 Lectures", faculty: "Risha Tiwari", status: "89.5% Aggregate", rate: "Compliant" },
        { id: 3, entity: "B.Tech - Sem 4 Div A", type: "Full Course", time: "102 Lectures", faculty: "Dhruv Patel", status: "90.8% Aggregate", rate: "Compliant" },
        { id: 4, entity: "M.Tech - Sem 2 Div A", type: "Full Course", time: "82 Lectures", faculty: "Shyam Chavda", status: "96.6% Aggregate", rate: "Compliant" },
      ]);
    } else {
      setReportData([
        { id: 1, entity: "Academic Year 2025-26", type: "Institutional Annual", time: "Full Year", faculty: "All Departments", status: "93.4% Cumulative", rate: "Audited" }
      ]);
    }
  };

  useEffect(() => {
    generateReport();
  }, [reportType, selectedFacultyId, selectedDate]);

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    const headers = ["ID", "Entity / Subject Name", "Classification", "Total Lectures / Time", "Supervising Faculty", "Attendance Outcome", "Attendance Rate"];
    const rows = reportData.map(r => [
      r.id,
      `"${r.entity}"`,
      `"${r.type}"`,
      `"${r.time}"`,
      `"${r.faculty}"`,
      `"${r.status}"`,
      `"${r.rate}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_attendance_report_${reportType}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Report exported to CSV successfully', 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Institutional Attendance Reports</h2>
          <p className="text-muted small mb-0">
            Generate and export daily, monthly, yearly, course-wise, and faculty subject-wise attendance audits.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => window.print()} className="btn btn-secondary-custom btn-sm">
            <Printer size={16} /> Print Report
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary-custom btn-sm">
            <ArrowDownToLine size={16} /> Export to CSV
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="custom-card mb-4 p-2 bg-light">
        <div className="d-flex flex-wrap gap-2">
          {[
            { key: 'faculty_subject', label: '👨‍🏫 Faculty Subject-wise Report' },
            { key: 'course', label: '🏢 Course / Department Report' },
            { key: 'daily', label: '📅 Daily Attendance Log' },
            { key: 'monthly', label: '📊 Monthly Report' },
            { key: 'yearly', label: '🏛️ Yearly Cumulative Audit' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setReportType(tab.key)}
              className={`btn btn-sm px-3 py-2 fw-semibold rounded-3 ${
                reportType === tab.key ? 'btn-primary shadow-sm' : 'btn-light border text-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Ribbon for Faculty Subject-Wise Report */}
      {reportType === 'faculty_subject' && (
        <div className="custom-card mb-4 p-3 bg-white shadow-sm border">
          <div className="row align-items-center g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-slate-700">Filter by Faculty Member:</label>
              <select
                className="form-select bg-light"
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
              >
                <option value="all">All Faculty Professors & Subjects</option>
                {ADMIN_FACULTIES_DATA.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.course}) — {f.subjects.length} Subjects
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 text-md-end pt-md-4">
              <span className="badge bg-success px-3 py-2">
                Showing {reportData.length} Curriculum Subjects
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Report Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm bg-white">
        <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0 text-capitalize">
              {reportType === 'faculty_subject' ? 'Faculty & Subject-Wise Attendance Audit Report' : `${reportType} Attendance Audit Report`}
            </h5>
            <small className="text-muted">Generated for {selectedDate} • Scope: Institutional Degree Programs</small>
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
            Verified Record
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject / Entity</th>
                <th>Classification</th>
                <th>Lectures / Time</th>
                <th>Supervising Faculty</th>
                <th>Attendance Outcome</th>
                <th className="text-end">Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr key={row.id}>
                  <td className="fw-bold text-dark">{row.entity}</td>
                  <td><span className="badge bg-light text-dark border">{row.type}</span></td>
                  <td className="text-muted small">{row.time}</td>
                  <td className="text-dark small fw-semibold">{row.faculty}</td>
                  <td>
                    <span className={row.status.includes('Present') || row.status.includes('%') || row.status.includes('Compliant') ? 'badge-present' : 'badge-absent'}>
                      {row.status}
                    </span>
                  </td>
                  <td className="text-end fw-bold text-primary">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
