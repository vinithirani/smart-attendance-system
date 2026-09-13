import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, Filter, Calendar, 
  BarChart3, CheckCircle2, Users, BookOpen, Layers, ArrowDownToLine
} from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('daily'); // 'daily', 'monthly', 'course', 'faculty', 'yearly'
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportData, setReportData] = useState([]);

  const { addToast } = useNotification();

  const generateReport = () => {
    if (reportType === 'daily') {
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
    } else if (reportType === 'faculty') {
      setReportData([
        { id: 1, entity: "Devanshi Patel", type: "Lead Faculty", time: "08:00 AM - 08:50 AM", faculty: "MCA Sem 2 Div A", status: "5 Present / 1 Absent", rate: "92.5%" },
        { id: 2, entity: "Risha Tiwari", type: "Lead Faculty", time: "09:00 AM - 09:50 AM", faculty: "BCA Sem 2 Div A", status: "3 Present / 0 Absent", rate: "100%" },
        { id: 3, entity: "Dhruv Patel", type: "Lead Faculty", time: "10:00 AM - 10:50 AM", faculty: "B.Tech Sem 4 Div A", status: "2 Present / 1 Absent", rate: "85%" },
        { id: 4, entity: "Shyam Chavda", type: "Lead Faculty", time: "11:00 AM - 11:50 AM", faculty: "M.Tech Sem 2 Div A", status: "2 Present / 0 Absent", rate: "100%" },
      ]);
    } else {
      setReportData([
        { id: 1, entity: "Academic Year 2025-26", type: "Institutional Annual", time: "Full Year", faculty: "All Departments", status: "93.4% Cumulative", rate: "Audited" }
      ]);
    }
    addToast('Report generated successfully', 'info');
  };

  useEffect(() => {
    generateReport();
  }, [reportType, selectedCourse, selectedDate]);

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    const headers = ["ID", "Entity / Student / Faculty", "Classification", "Time Window", "Supervising Faculty / Scope", "Attendance Outcome", "Rate / Status"];
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
    link.setAttribute("download", `attendance_report_${reportType}_${selectedDate}.csv`);
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
            Generate and export daily, monthly, yearly, course-wise, and faculty-wise attendance audits.
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
            { key: 'daily', label: 'Daily Report' },
            { key: 'monthly', label: 'Monthly Report' },
            { key: 'course', label: 'Course-wise Report' },
            { key: 'faculty', label: 'Faculty-wise Report' },
            { key: 'yearly', label: 'Yearly Report' }
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

      {/* Dynamic Report Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0 text-capitalize">{reportType} Attendance Audit Report</h5>
            <small className="text-muted">Generated for {selectedDate} • Scope: All Degree Programs</small>
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
            Verified Record
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Entity / Subject</th>
                <th>Classification</th>
                <th>Time / Date</th>
                <th>Supervising Authority</th>
                <th>Status / Outcome</th>
                <th className="text-end">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr key={row.id}>
                  <td className="fw-bold text-dark">{row.entity}</td>
                  <td><span className="badge bg-light text-dark border">{row.type}</span></td>
                  <td className="text-muted small">{row.time}</td>
                  <td className="text-dark small">{row.faculty}</td>
                  <td>
                    <span className={row.status.includes('Present') || row.status.includes('%') ? 'badge-present' : 'badge-absent'}>
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
