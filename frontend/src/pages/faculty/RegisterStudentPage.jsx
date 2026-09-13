import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Camera, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function RegisterStudentPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
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

  useEffect(() => {
    async function loadCourses() {
      const crs = await api.getCourses();
      setCourses(crs);
      const rand = Math.floor(100 + Math.random() * 900);
      setFormData(prev => ({
        ...prev,
        student_id: `STU-MCA-${rand}`,
        enrollment_number: `EN2024MCA${rand}`,
      }));
    }
    loadCourses();
  }, []);

  const handleRegisterAndProceedToFace = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.student_id || !formData.enrollment_number) {
      addToast('Please complete all required student fields', 'warning');
      return;
    }

    try {
      const newStudent = await api.addStudent(formData);
      addToast(`Student ${newStudent.name} registered! Proceeding to Face Enrollment...`, 'success');
      navigate(`/faculty/face-enrollment?student_id=${newStudent.id}`);
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="brand-font mb-1">Register New Student</h2>
        <p className="text-muted small mb-0">
          Enter student academic profile details and proceed immediately to biometric face enrollment.
        </p>
      </div>

      {/* 2-Step Progress Indicator */}
      <div className="d-flex align-items-center justify-content-between p-3 bg-white rounded-3 border mb-4 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}
          >
            1
          </div>
          <div>
            <div className="fw-bold text-dark">Step 1: Student Information</div>
            <div className="text-muted small">Personal & Academic Details</div>
          </div>
        </div>

        <ArrowRight size={20} className="text-muted" />

        <div className="d-flex align-items-center gap-3 opacity-50">
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#e2e8f0',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}
          >
            2
          </div>
          <div>
            <div className="fw-bold text-dark">Step 2: Biometric Face Enrollment</div>
            <div className="text-muted small">AI Camera Landmark Capture</div>
          </div>
        </div>
      </div>

      {/* Registration Form Card */}
      <div className="custom-card bg-white p-4 p-sm-5 shadow-sm border rounded-4">
        <form onSubmit={handleRegisterAndProceedToFace}>
          <h5 className="fw-bold mb-3 text-slate-800 border-bottom pb-2">Academic & Personal Info</h5>

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="form-label small fw-bold">Full Student Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Vikram Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Gender *</label>
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
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Enrollment / Roll Number *</label>
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
              <label className="form-label small fw-bold">Course / Degree *</label>
              <select
                className="form-select"
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: Number(e.target.value) })}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Semester *</label>
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
              <label className="form-label small fw-bold">Division / Section *</label>
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
              <label className="form-label small fw-bold">Student Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="student@student.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 91234 56780"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-3 border-top d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary-custom px-5 py-3"
              style={{ fontSize: '1rem' }}
            >
              <Camera size={20} />
              <span>Continue to Face Enrollment</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
