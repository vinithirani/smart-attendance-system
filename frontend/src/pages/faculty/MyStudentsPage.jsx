import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, Camera, CheckCircle, XCircle, Plus, Mail, Phone, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MyStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [faceFilter, setFaceFilter] = useState('');

  const loadStudents = async () => {
    try {
      const data = await api.getStudents({ search, face_enrolled: faceFilter }, user);
      setStudents(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [search, faceFilter, user]);

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">My Students</h2>
          <p className="text-muted small mb-0">
            Enrolled students belonging strictly to your assigned academic courses and classes.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/faculty/face-enrollment" className="btn btn-secondary-custom">
            <Camera size={18} /> Face Enrollment Studio
          </Link>
          <Link to="/faculty/register-student" className="btn btn-primary-custom">
            <Plus size={18} /> Register Student
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="custom-card mb-4 p-3">
        <div className="row g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search students by name, roll number, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={faceFilter}
              onChange={(e) => setFaceFilter(e.target.value)}
            >
              <option value="">All Face Biometric Statuses</option>
              <option value="true">Face Enrolled</option>
              <option value="false">Pending Enrollment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Profile</th>
                <th>Roll & ID</th>
                <th>Course Batch</th>
                <th>Contact</th>
                <th>Face Biometrics</th>
                <th>Attendance %</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No students found in your assigned courses.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                          }}
                        >
                          {st.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{st.name}</div>
                          <div className="text-muted small">{st.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{st.student_id}</div>
                      <div className="text-muted small">Roll: {st.enrollment_number}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {st.course_name} • Sem {st.semester}-{st.division}
                      </span>
                    </td>
                    <td>
                      <div className="small text-dark">{st.email || 'N/A'}</div>
                      <div className="small text-muted">{st.phone || 'N/A'}</div>
                    </td>
                    <td>
                      {st.face_enrolled ? (
                        <span className="badge-enrolled">
                          <CheckCircle size={14} className="me-1" /> Biometrics Enrolled
                        </span>
                      ) : (
                        <span className="badge-pending">
                          <XCircle size={14} className="me-1" /> Pending Enrollment
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-success">{st.attendance_rate}%</div>
                    </td>
                    <td className="text-end">
                      {!st.face_enrolled ? (
                        <Link
                          to={`/faculty/face-enrollment?student_id=${st.id}`}
                          className="btn btn-sm btn-primary-custom py-1 px-2"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Camera size={14} /> Enroll Face
                        </Link>
                      ) : (
                        <span className="text-muted small">✓ Ready</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
