import React, { useState } from 'react';
import { FileText, Printer, ArrowDownToLine, BarChart3, Users, CheckCircle2, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FACULTY_SUBJECTS } from '../../components/charts/AttendanceCharts';

export default function FacultyReportsPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [courseFilter, setCourseFilter] = useState('MCA');
  const [selectedSubjectId, setSelectedSubjectId] = useState('cloud');

  const selectedSubject = FACULTY_SUBJECTS.find(s => s.id === selectedSubjectId) || FACULTY_SUBJECTS[0];

  const reportData = [
    { roll: "EN2024MCA001", name: "Aarav Mehta", total: selectedSubject.total_lectures, attended: Math.round(selectedSubject.total_lectures * 0.94), rate: 94.4, status: "Eligible" },
    { roll: "EN2024MCA002", name: "Ananya Sharma", total: selectedSubject.total_lectures, attended: selectedSubject.total_lectures, rate: 100.0, status: "Eligible" },
    { roll: "EN2024MCA003", name: "Rohan Verma", total: selectedSubject.total_lectures, attended: Math.round(selectedSubject.total_lectures * 0.88), rate: 88.8, status: "Eligible" },
    { roll: "EN2024MCA004", name: "Priya Shah", total: selectedSubject.total_lectures, attended: Math.round(selectedSubject.total_lectures * 0.94), rate: 94.4, status: "Eligible" },
    { roll: "EN2024MCA005", name: "Kabir Joshi", total: selectedSubject.total_lectures, attended: Math.round(selectedSubject.total_lectures * 0.72), rate: 72.2, status: "Warning (<75%)" },
    { roll: "EN2024MCA006", name: "Sneha Trivedi", total: selectedSubject.total_lectures, attended: Math.round(selectedSubject.total_lectures * 0.88), rate: 88.8, status: "Eligible" },
    { roll: "EN2024MCA509", name: "Bhavesh Gohil", total: selectedSubject.total_lectures, attended: selectedSubject.total_lectures, rate: 98.8, status: "Eligible" },
    { roll: "EN2024MCA846", name: "Vinit Hirani", total: selectedSubject.total_lectures, attended: Math.round(selectedSubject.total_lectures * 0.98), rate: 97.5, status: "Eligible" },
  ];

  const handleExportCSV = () => {
    const headers = ["Roll No.", "Student Name", "Subject", "Total Lectures", "Attended Lectures", "Attendance %", "Examination Eligibility"];
    const rows = reportData.map(r => [
      r.roll,
      `"${r.name}"`,
      `"${selectedSubject.name}"`,
      r.total,
      r.attended,
      `${r.rate}%`,
      `"${r.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subject_report_${selectedSubject.code}_${courseFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Report for "${selectedSubject.name}" exported to CSV successfully`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
              }}
            >
              <FileText size={20} />
            </div>
            <h2 className="brand-font mb-0">Subject-Wise Attendance Reports</h2>
          </div>
          <p className="text-muted small mb-0">
            Student-wise lecture attendance percentages and exam eligibility status for each curriculum subject.
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
      <div className="custom-card mb-4 p-3 bg-white shadow-sm">
        <div className="row align-items-center g-3">
          <div className="col-md-5">
            <label className="form-label small fw-bold text-slate-700">Filter By Subject</label>
            <select
              className="form-select bg-light"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {FACULTY_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) — {s.attendance}% Avg Attendance
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold text-slate-700">Course & Batch</label>
            <select
              className="form-select bg-light"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="MCA">MCA - Semester 2 (Division A)</option>
              <option value="MCA_Sem4">MCA - Semester 4 (Division A)</option>
            </select>
          </div>
          <div className="col-md-3 text-md-end pt-md-4">
            <span className="badge bg-primary px-3 py-2">Min Requirement: 75.0%</span>
          </div>
        </div>
      </div>

      {/* Subject Summary Card */}
      <div className="custom-card mb-4 p-3 bg-light border">
        <div className="row align-items-center text-center text-md-start g-3">
          <div className="col-md-4">
            <div className="small text-muted">Active Subject</div>
            <div className="fw-bold text-dark fs-6">{selectedSubject.name}</div>
            <div className="text-muted small">Code: <code>{selectedSubject.code}</code></div>
          </div>
          <div className="col-md-3">
            <div className="small text-muted">Conducted Lectures</div>
            <div className="fw-bold text-primary fs-5">{selectedSubject.total_lectures} Lectures</div>
          </div>
          <div className="col-md-3">
            <div className="small text-muted">Subject Attendance Rate</div>
            <div className="fw-bold text-success fs-5">{selectedSubject.attendance}%</div>
          </div>
          <div className="col-md-2 text-md-end">
            <span className="badge-enrolled">✓ Active Term</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm bg-white">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Full Name</th>
                <th>Subject</th>
                <th>Total Lectures</th>
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
                  <td>
                    <span className="badge bg-light text-dark border">
                      {selectedSubject.code}
                    </span>
                  </td>
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
