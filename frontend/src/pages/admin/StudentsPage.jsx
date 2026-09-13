import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Search, Filter, Camera, CheckCircle, XCircle, Mail, Phone, X } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [faceFilter, setFaceFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    enrollment_number: '',
    name: '',
    course_id: 1,
    semester: 2,
    division: 'A',
    email: '',
    phone: '',
    gender: 'Male'
  });

  const { addToast } = useNotification();

  const loadData = async () => {
    try {
      const [stus, crs] = await Promise.all([
        api.getStudents({ search, course_id: courseFilter, face_enrolled: faceFilter }),
        api.getCourses()
      ]);
      setStudents(stus);
      setCourses(crs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, courseFilter, faceFilter]);

  const handleOpenAdd = () => {
    const rand = Math.floor(100 + Math.random() * 900);
    setFormData({
      student_id: `STU-MCA-${rand}`,
      enrollment_number: `EN2024MCA${rand}`,
      name: '',
      course_id: 1,
      semester: 2,
      division: 'A',
      email: '',
      phone: '',
      gender: 'Male'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addStudent(formData);
      addToast(`Student ${formData.name} added successfully`, 'success');
      setShowModal(false);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to add student', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Student Management</h2>
          <p className="text-muted small mb-0">
            View student enrollment records, biometric face status, and academic profile logs.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary-custom">
          <Plus size={18} /> Register New Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="custom-card mb-4 p-3">
        <div className="row g-3">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by student name, roll number, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="">All Academic Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={faceFilter}
              onChange={(e) => setFaceFilter(e.target.value)}
            >
              <option value="">All Face Statuses</option>
              <option value="true">Biometrics Enrolled</option>
              <option value="false">Face Pending</option>
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
                <th>Enrollment Details</th>
                <th>Course & Class</th>
                <th>Contact Info</th>
                <th>Face Biometrics</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No student records found matching filters.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
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
                            fontSize: '0.85rem',
                            border: '1px solid #bfdbfe'
                          }}
                        >
                          {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{student.name}</div>
                          <div className="text-muted small">{student.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{student.student_id}</div>
                      <div className="text-muted small">Roll: {student.enrollment_number}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {student.course_name || 'Course'} • Sem {student.semester}-{student.division}
                      </span>
                    </td>
                    <td>
                      <div className="small text-dark d-flex align-items-center gap-1">
                        <Mail size={13} className="text-muted" /> {student.email || 'N/A'}
                      </div>
                      <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                        <Phone size={13} className="text-muted" /> {student.phone || 'N/A'}
                      </div>
                    </td>
                    <td>
                      {student.face_enrolled ? (
                        <span className="badge-enrolled">
                          <CheckCircle size={14} className="me-1" /> Enrolled
                        </span>
                      ) : (
                        <span className="badge-pending">
                          <XCircle size={14} className="me-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold" style={{ color: student.attendance_rate >= 85 ? '#10b981' : '#f59e0b' }}>
                          {student.attendance_rate}%
                        </span>
                        <div className="progress flex-fill" style={{ height: '6px', width: '60px' }}>
                          <div 
                            className={`progress-bar ${student.attendance_rate >= 85 ? 'bg-success' : 'bg-warning'}`} 
                            style={{ width: `${student.attendance_rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
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
          <div className="bg-white rounded-4 shadow-xl border w-100" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Register New Student</h5>
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-light p-1 rounded-circle"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Student Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Aarav Mehta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Gender</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Student ID</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Roll / Enrollment No.</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.enrollment_number}
                    onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Degree Course</label>
                  <select
                    className="form-select"
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: Number(e.target.value) })}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.course_code}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="form-control"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Division / Class</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@student.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 91234 56780"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-light px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
