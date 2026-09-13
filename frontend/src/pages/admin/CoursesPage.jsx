import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Users, GraduationCap, Clock, Layers, X } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    department: 'Computer Applications',
    duration_years: 2,
    total_semesters: 4
  });

  const { addToast } = useNotification();

  const loadData = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addCourse(formData);
      addToast(`Course ${formData.course_code} added successfully`, 'success');
      setShowModal(false);
      setFormData({
        course_name: '',
        course_code: '',
        department: 'Computer Applications',
        duration_years: 2,
        total_semesters: 4
      });
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to add course', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="brand-font mb-1">Course & Degree Management</h2>
          <p className="text-muted small mb-0">
            Manage degree programs, curricula, assigned faculty, and total student strength.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary-custom">
          <Plus size={18} /> Add New Course
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="row g-4">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-xl-3">
            <div className="custom-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem'
                    }}
                  >
                    {course.course_code}
                  </div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    {course.status}
                  </span>
                </div>

                <h5 className="fw-bold text-dark mb-1">{course.course_name}</h5>
                <p className="text-muted small mb-3">{course.department}</p>
              </div>

              <div>
                <div className="d-flex justify-content-between py-2 border-top border-bottom small text-muted mb-3">
                  <div>
                    <GraduationCap size={16} className="text-primary me-1" />
                    <strong>{course.student_count || 0}</strong> Students
                  </div>
                  <div>
                    <Users size={16} className="text-purple me-1" />
                    <strong>{course.faculty_count || 1}</strong> Faculty
                  </div>
                  <div>
                    <Layers size={16} className="text-warning me-1" />
                    <strong>{course.total_semesters}</strong> Sems
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="small text-muted">Duration: {course.duration_years} Years</span>
                  <span className="badge bg-light text-dark border">Academic Code: {course.course_code}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
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
          <div className="bg-white rounded-4 shadow-xl border w-100" style={{ maxWidth: '520px' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Add New Academic Course</h5>
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-light p-1 rounded-circle"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Master of Computer Applications"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Course Code</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. MCA"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Duration (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    value={formData.duration_years}
                    onChange={(e) => setFormData({ ...formData, duration_years: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Total Semesters</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-control"
                    value={formData.total_semesters}
                    onChange={(e) => setFormData({ ...formData, total_semesters: e.target.value })}
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
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
