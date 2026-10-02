import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Search, Camera, CheckCircle, XCircle, Plus, 
  Mail, Phone, ArrowRight, Edit3, Trash2, X, AlertTriangle, 
  User, Check, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function MyStudentsPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [faceFilter, setFaceFilter] = useState('');

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const loadData = async (isManual = false) => {
    setLoading(true);
    try {
      const [stus, crs] = await Promise.all([
        api.getStudents({ search, face_enrolled: faceFilter }, user),
        api.getCourses()
      ]);
      setStudents(stus);
      setCourses(crs);
      if (isManual) {
        addToast('My students list refreshed', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, faceFilter, user]);

  // Open Edit Modal
  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      student_id: student.student_id || '',
      enrollment_number: student.enrollment_number || '',
      name: student.name || '',
      course_id: student.course_id || courses[0]?.id || 1,
      semester: student.semester || 2,
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
      addToast(`Student "${editFormData.name}" updated successfully`, 'success');
      setShowEditModal(false);
      setSelectedStudent(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to update student', 'error');
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
      addToast(`Student "${selectedStudent.name}" deleted successfully`, 'success');
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
              <GraduationCap size={20} />
            </div>
            <h2 className="brand-font mb-0">My Students</h2>
          </div>
          <p className="text-muted small mb-0">
            Enrolled students belonging strictly to your assigned academic courses and classes.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            onClick={() => loadData(true)} 
            disabled={loading}
            className="btn btn-outline-secondary btn-sm bg-white d-flex align-items-center gap-1.5"
            title="Refresh student list"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/faculty/face-enrollment" className="btn btn-secondary-custom btn-sm d-flex align-items-center gap-1.5">
            <Camera size={16} /> Face Enrollment Studio
          </Link>
          <Link to="/faculty/register-student" className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1.5">
            <Plus size={16} /> Register Student
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="custom-card mb-4 p-3 bg-white shadow-sm">
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
              <option value="true">✓ Face Enrolled Only</option>
              <option value="false">⚠️ Pending Enrollment Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm bg-white">
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
                <th className="text-end pe-3">Actions (Update & Delete)</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: st.face_enrolled ? '#ecfdf5' : '#eff6ff',
                            color: st.face_enrolled ? '#059669' : '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            border: `1px solid ${st.face_enrolled ? '#a7f3d0' : '#bfdbfe'}`
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
                      <div className="text-muted small"><code>{st.enrollment_number}</code></div>
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
                          <CheckCircle size={14} className="me-1" /> Enrolled
                        </span>
                      ) : (
                        <Link
                          to={`/faculty/face-enrollment?student_id=${st.id}`}
                          className="badge bg-warning-subtle text-warning border border-warning-subtle text-decoration-none px-2 py-1"
                        >
                          <Camera size={13} className="me-1" /> Enroll Face
                        </Link>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-success">{st.attendance_rate || 90}%</div>
                    </td>
                    <td className="text-end pe-3">
                      <div className="d-inline-flex align-items-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(st)}
                          className="btn btn-outline-primary btn-sm p-1 px-2 d-inline-flex align-items-center gap-1"
                          title="Update student details"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDelete(st)}
                          className="btn btn-outline-danger btn-sm p-1 px-2 d-inline-flex align-items-center gap-1"
                          title="Delete student record"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
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

      {/* ================= EDIT STUDENT MODAL ================= */}
      {showEditModal && selectedStudent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '1rem'
          }}
        >
          <div 
            className="custom-card bg-white p-4 shadow-2xl border w-100"
            style={{ maxWidth: '580px', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 brand-font">Update Student Record</h5>
                  <small className="text-muted">Modify student enrollment and class profile details</small>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => { setShowEditModal(false); setSelectedStudent(null); }}
              ></button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold text-slate-700">Full Student Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Roll / Enrollment Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editFormData.enrollment_number}
                    onChange={(e) => setEditFormData({ ...editFormData, enrollment_number: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Student Code ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editFormData.student_id}
                    onChange={(e) => setEditFormData({ ...editFormData, student_id: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Course *</label>
                  <select
                    className="form-select"
                    value={editFormData.course_id}
                    onChange={(e) => setEditFormData({ ...editFormData, course_id: Number(e.target.value) })}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold text-slate-700">Semester *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="8"
                    value={editFormData.semester}
                    onChange={(e) => setEditFormData({ ...editFormData, semester: Number(e.target.value) })}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold text-slate-700">Division *</label>
                  <select
                    className="form-select"
                    value={editFormData.division}
                    onChange={(e) => setEditFormData({ ...editFormData, division: e.target.value })}
                  >
                    <option value="A">Div A</option>
                    <option value="B">Div B</option>
                    <option value="C">Div C</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Gender</label>
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

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Status</label>
                  <select
                    className="form-select"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-4 mt-4 border-top">
                <button
                  type="button"
                  className="btn btn-light border px-3"
                  onClick={() => { setShowEditModal(false); setSelectedStudent(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {showDeleteModal && selectedStudent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '1rem'
          }}
        >
          <div 
            className="custom-card bg-white p-4 shadow-2xl border text-center w-100"
            style={{ maxWidth: '440px', borderRadius: '16px' }}
          >
            <div 
              className="mx-auto mb-3"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <h5 className="fw-bold mb-1">Delete Student Record?</h5>
            <p className="text-muted small mb-3">
              Are you sure you want to delete <strong>"{selectedStudent.name}"</strong> (Roll: <code>{selectedStudent.enrollment_number}</code>)? This action will remove their biometric face vectors and records.
            </p>

            <div className="d-flex justify-content-center gap-2 pt-3 border-top">
              <button
                type="button"
                className="btn btn-light border px-3"
                onClick={() => { setShowDeleteModal(false); setSelectedStudent(null); }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="btn btn-danger px-4 fw-semibold d-flex align-items-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Yes, Delete Student</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
