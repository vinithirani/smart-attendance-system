import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Plus, Search, Filter, Camera, CheckCircle, 
  XCircle, Mail, Phone, X, Edit3, Trash2, AlertTriangle, 
  User, Check, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [faceFilter, setFaceFilter] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const [editFormData, setEditFormData] = useState({
    student_id: '',
    enrollment_number: '',
    name: '',
    course_id: 1,
    semester: 2,
    division: 'A',
    email: '',
    phone: '',
    gender: 'Male',
    status: 'active'
  });

  const { addToast } = useNotification();

  const loadData = async (isManual = false) => {
    setLoading(true);
    try {
      const [stus, crs] = await Promise.all([
        api.getStudents({ search, course_id: courseFilter, face_enrolled: faceFilter }),
        api.getCourses()
      ]);
      setStudents(stus);
      setCourses(crs);
      if (isManual) {
        addToast('Student records refreshed', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Failed to load student records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, [search, courseFilter, faceFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const rand = Math.floor(100 + Math.random() * 900);
    setFormData({
      student_id: `STU-MCA-${rand}`,
      enrollment_number: `EN2024MCA${rand}`,
      name: '',
      course_id: courses[0]?.id || 1,
      semester: 2,
      division: 'A',
      email: '',
      phone: '',
      gender: 'Male'
    });
    setShowAddModal(true);
  };

  // Submit Add Student
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addStudent(formData);
      addToast(`Student "${formData.name}" registered successfully`, 'success');
      setShowAddModal(false);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to register student', 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      student_id: student.student_id || '',
      enrollment_number: student.enrollment_number || '',
      name: student.name || '',
      course_id: student.course_id || courses[0]?.id || 1,
      semester: student.semester || 1,
      division: student.division || 'A',
      email: student.email || '',
      phone: student.phone || '',
      gender: student.gender || 'Male',
      status: student.status || 'active'
    });
    setShowEditModal(true);
  };

  // Submit Edit Student
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await api.updateStudent(selectedStudent.id, editFormData);
      addToast(`Student record for "${editFormData.name}" updated successfully`, 'success');
      setShowEditModal(false);
      setSelectedStudent(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to update student record', 'error');
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    try {
      await api.deleteStudent(selectedStudent.id);
      addToast(`Student "${selectedStudent.name}" removed from registry`, 'success');
      setShowDeleteModal(false);
      setSelectedStudent(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to delete student', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <GraduationCap size={18} />
            </div>
            <h2 className="brand-font mb-0" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Student Records & Registration
            </h2>
          </div>
          <p className="text-muted small mb-0">
            Comprehensive student directory. Register new students, update profiles, and manage enrollment records.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            onClick={() => loadData(true)} 
            disabled={loading}
            className="btn btn-outline-secondary d-flex align-items-center gap-1 shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary-custom d-flex align-items-center gap-1">
            <Plus size={18} /> Register Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="custom-card mb-4 p-3 shadow-sm border-0">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by student name, roll number, student ID..."
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
              <option value="">All Academic Degree Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={faceFilter}
              onChange={(e) => setFaceFilter(e.target.value)}
            >
              <option value="">All Biometric Statuses</option>
              <option value="true">Face AI Enrolled</option>
              <option value="false">Biometrics Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm border-0">
        <div className="table-responsive">
          <table className="custom-table mb-0">
            <thead>
              <tr>
                <th>Student Profile</th>
                <th>Enrollment & ID</th>
                <th>Course / Division</th>
                <th>Contact Info</th>
                <th>Face Biometrics</th>
                <th>Attendance %</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <GraduationCap size={40} className="mb-2 text-muted opacity-50" />
                    <div>No student records found matching your filters.</div>
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
                            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            border: '1px solid #bfdbfe',
                            flexShrink: 0
                          }}
                        >
                          {student.name ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'ST'}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{student.name}</div>
                          <div className="text-muted small">{student.gender || 'Not specified'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{student.student_id}</div>
                      <div className="text-muted small">Roll: {student.enrollment_number}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
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
                        <span className="badge-enrolled d-inline-flex align-items-center gap-1">
                          <CheckCircle size={14} /> Enrolled
                        </span>
                      ) : (
                        <span className="badge-pending d-inline-flex align-items-center gap-1">
                          <XCircle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold" style={{ color: student.attendance_rate >= 80 ? '#10b981' : '#f59e0b' }}>
                          {student.attendance_rate || 0}%
                        </span>
                        <div className="progress flex-fill" style={{ height: '6px', width: '50px' }}>
                          <div 
                            className={`progress-bar ${student.attendance_rate >= 80 ? 'bg-success' : 'bg-warning'}`} 
                            style={{ width: `${student.attendance_rate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="btn btn-sm btn-outline-primary p-1 px-2"
                          title="Edit / Update Student"
                          style={{ borderRadius: '6px' }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(student)}
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          title="Delete Student"
                          style={{ borderRadius: '6px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= REGISTER NEW STUDENT MODAL ================= */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div className="bg-white rounded-4 shadow-xl border w-100" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-4">
              <div className="d-flex align-items-center gap-2">
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#2563eb',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={18} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Register New Student</h5>
                  <div className="text-muted small">Create institutional profile for student</div>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-sm btn-light p-1 rounded-circle"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-4">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Student Full Name *</label>
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
                  <label className="form-label small fw-bold">Student ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. STU-MCA-101"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Roll / Enrollment No. *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. EN2024MCA101"
                    value={formData.enrollment_number}
                    onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-5">
                  <label className="form-label small fw-bold">Degree Course *</label>
                  <select
                    className="form-select"
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: Number(e.target.value) })}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
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
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-light px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4"
                >
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT / UPDATE STUDENT MODAL ================= */}
      {showEditModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div className="bg-white rounded-4 shadow-xl border w-100" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-4">
              <div className="d-flex align-items-center gap-2">
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#4f46e5',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Edit3 size={18} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Update Student Profile</h5>
                  <div className="text-muted small">Edit student academic & contact credentials</div>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn btn-sm btn-light p-1 rounded-circle"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Student Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Gender</label>
                  <select
                    className="form-select"
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Student ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editFormData.student_id}
                    onChange={(e) => setEditFormData({ ...editFormData, student_id: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Roll / Enrollment No. *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editFormData.enrollment_number}
                    onChange={(e) => setEditFormData({ ...editFormData, enrollment_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-5">
                  <label className="form-label small fw-bold">Degree Course *</label>
                  <select
                    className="form-select"
                    value={editFormData.course_id}
                    onChange={(e) => setEditFormData({ ...editFormData, course_id: Number(e.target.value) })}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="form-control"
                    value={editFormData.semester}
                    onChange={(e) => setEditFormData({ ...editFormData, semester: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Division / Class</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.division}
                    onChange={(e) => setEditFormData({ ...editFormData, division: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-light px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE STUDENT CONFIRMATION MODAL ================= */}
      {showDeleteModal && selectedStudent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div className="bg-white rounded-4 shadow-xl border w-100" style={{ maxWidth: '480px' }}>
            <div className="p-4 text-center">
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <AlertTriangle size={28} />
              </div>

              <h5 className="fw-bold mb-2">Delete Student Record?</h5>
              <p className="text-muted small mb-3">
                Are you sure you want to permanently remove <strong>{selectedStudent.name}</strong> ({selectedStudent.student_id} • Roll: {selectedStudent.enrollment_number}) from the system?
              </p>
              
              <div className="bg-light p-3 rounded-3 text-start small mb-4 border">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Degree / Course:</span>
                  <span className="fw-semibold">{selectedStudent.course_name} (Sem {selectedStudent.semester}-{selectedStudent.division})</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Biometrics Status:</span>
                  <span className="fw-semibold">{selectedStudent.face_enrolled ? 'Face Enrolled' : 'Pending'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Attendance Rate:</span>
                  <span className="fw-semibold">{selectedStudent.attendance_rate || 0}%</span>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setSelectedStudent(null); }}
                  className="btn btn-light px-4"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="btn btn-danger px-4 d-flex align-items-center gap-1"
                >
                  <Trash2 size={16} /> Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
