import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Edit2, Trash2, Mail, Phone, BookOpen, CheckCircle, X } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    faculty_code: '',
    email: '',
    phone: '',
    department: 'Computer Applications',
    designation: 'Assistant Professor',
    assigned_courses: []
  });

  const { addToast } = useNotification();

  const loadData = async () => {
    try {
      const [facs, crs] = await Promise.all([
        api.getFaculty({ search, status: statusFilter }),
        api.getCourses()
      ]);
      setFacultyList(facs);
      setCourses(crs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      faculty_code: `FAC-${Math.floor(100 + Math.random() * 900)}`,
      email: '',
      phone: '',
      department: 'Computer Applications',
      designation: 'Assistant Professor',
      assigned_courses: []
    });
    setShowModal(true);
  };

  const handleOpenEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      faculty_code: faculty.faculty_code,
      email: faculty.email,
      phone: faculty.phone || '',
      department: faculty.department || 'Computer Applications',
      designation: faculty.designation || 'Assistant Professor',
      assigned_courses: faculty.assigned_courses || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaculty) {
        await api.updateFaculty(editingFaculty.id, formData);
        addToast(`Faculty ${formData.name} updated successfully`, 'success');
      } else {
        await api.addFaculty(formData);
        addToast(`Faculty ${formData.name} added successfully`, 'success');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to deactivate faculty ${name}?`)) {
      try {
        await api.deleteFaculty(id);
        addToast(`Faculty ${name} deactivated`, 'info');
        loadData();
      } catch (err) {
        addToast(err.message || 'Failed to deactivate', 'error');
      }
    }
  };

  const toggleCourseAssignment = (course) => {
    const exists = formData.assigned_courses.some(ac => ac.course_id === course.id);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        assigned_courses: prev.assigned_courses.filter(ac => ac.course_id !== course.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assigned_courses: [
          ...prev.assigned_courses,
          { course_id: course.id, course_name: course.course_name, course_code: course.course_code, semester: 2, division: 'A' }
        ]
      }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Faculty Management</h2>
          <p className="text-muted small mb-0">
            Manage academic teaching staff, course assignments, and departmental permissions.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary-custom">
          <Plus size={18} /> Add New Faculty
        </button>
      </div>

      {/* Filter and Search Bar */}
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
                placeholder="Search faculty by name, code, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="custom-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Faculty Profile</th>
                <th>Code & Role</th>
                <th>Contact Info</th>
                <th>Assigned Courses</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No faculty found matching criteria.
                  </td>
                </tr>
              ) : (
                facultyList.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}
                        >
                          {faculty.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{faculty.name}</div>
                          <div className="text-muted small">{faculty.department}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{faculty.faculty_code}</div>
                      <div className="text-muted small">{faculty.designation}</div>
                    </td>
                    <td>
                      <div className="small text-dark d-flex align-items-center gap-1">
                        <Mail size={14} className="text-muted" /> {faculty.email}
                      </div>
                      <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                        <Phone size={14} className="text-muted" /> {faculty.phone || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {faculty.assigned_courses && faculty.assigned_courses.length > 0 ? (
                          faculty.assigned_courses.map((c, i) => (
                            <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle">
                              {c.course_code || c.course_name} (Sem {c.semester})
                            </span>
                          ))
                        ) : (
                          <span className="text-muted small">No assigned courses</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={faculty.status === 'active' ? 'badge-present' : 'badge-absent'}>
                        {faculty.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(faculty)}
                          className="btn btn-sm btn-outline-secondary p-1 px-2"
                          title="Edit Faculty"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(faculty.id, faculty.name)}
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          title="Deactivate"
                        >
                          <Trash2 size={16} />
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

      {/* Add/Edit Modal */}
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
              <h5 className="fw-bold mb-0">
                {editingFaculty ? 'Edit Faculty Record' : 'Add New Faculty Member'}
              </h5>
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
                  <label className="form-label small fw-bold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Devanshi Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Faculty Code</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="FAC-MCA-001"
                    value={formData.faculty_code}
                    onChange={(e) => setFormData({ ...formData, faculty_code: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="devanshi@smartattendance.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
              </div>

              {/* Course Allocation Section */}
              <div className="mb-4">
                <label className="form-label small fw-bold d-block">Assign Courses & Classes</label>
                <div className="d-flex flex-wrap gap-2 pt-1">
                  {courses.map((c) => {
                    const isAssigned = formData.assigned_courses.some(ac => ac.course_id === c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCourseAssignment(c)}
                        className={`btn btn-sm ${isAssigned ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: '8px' }}
                      >
                        {isAssigned ? '✓ ' : '+ '} {c.course_code}
                      </button>
                    );
                  })}
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
                  {editingFaculty ? 'Save Changes' : 'Create Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
