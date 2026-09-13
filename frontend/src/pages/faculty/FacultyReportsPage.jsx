import React, { useState } from 'react';
import { FileText, Printer, ArrowDownToLine, BarChart3, Users, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function FacultyReportsPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [courseFilter, setCourseFilter] = useState('MCA');

  const reportData = [
    { roll: "EN2024MCA001", name: "Aarav Mehta", total: 18, attended: 17, rate: 94.4, status: "Eligible" },
    { roll: "EN2024MCA002", name: "Ananya Sharma", total: 18, attended: 18, rate: 100.0, status: "Eligible" },
    { roll: "EN2024MCA003", name: "Rohan Verma", total: 18, attended: 16, rate: 88.8, status: "Eligible" },
    { roll: "EN2024MCA004", name: "Priya Shah", total: 18, attended: 17, rate: 94.4, status: "Eligible" },
    { roll: "EN2024MCA005", name: "Kabir Joshi", total: 18, attended: 13, rate: 72.2, status: "Warning (<75%)" },
    { roll: "EN2024MCA006", name: "Sneha Trivedi", total: 18, attended: 16, rate: 88.8, status: "Eligible" },
  ];

  const handleExportCSV = () => {
    const headers = ["Roll No.", "Student Name", "Total Lectures", "Attended Lectures", "Attendance %", "Examination Eligibility"];
    const rows = reportData.map(r => [
      r.roll,
      `"${r.name}"`,
      r.total,
      r.attended,
      `${r.rate}%`,
      `"${r.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faculty_course_report_${courseFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Course report exported to CSV successfully', 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Course Attendance Summary Report</h2>
          <p className="text-muted small mb-0">
            Student-wise lecture attendance percentages and exam eligibility status for your assigned courses.
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

      {/* Filter Ribbon */}
      <div className="custom-card mb-4 p-3 bg-light">
        <div className="row align-items-center g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold text-slate-700">Select Assigned Course Batch</label>
            <select
              className="form-select bg-white"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="MCA">MCA - Semester 2 (Division A)</option>
              <option value="MCA_Sem4">MCA - Semester 4 (Division A)</option>
            </select>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="badge bg-primary px-3 py-2">Mandatory Requirement: 75.0%</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Full Name</th>
                <th>Total Sessions</th>
                <th>Attended</th>
                <th>Attendance %</th>
                <th>Exam Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  <td className="fw-semibold text-primary">{row.roll}</td>
                  <td className="fw-bold text-dark">{row.name}</td>
                  <td>{row.total} Lectures</td>
                  <td className="fw-bold text-success">{row.attended} Lectures</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold" style={{ color: row.rate >= 75 ? '#10b981' : '#ef4444' }}>
                        {row.rate}%
                      </span>
                      <div className="progress flex-fill" style={{ height: '6px', width: '60px' }}>
                        <div 
                          className={`progress-bar ${row.rate >= 75 ? 'bg-success' : 'bg-danger'}`} 
                          style={{ width: `${row.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={row.rate >= 75 ? 'badge-present' : 'badge-absent'}>
                      {row.status}
                    </span>
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
