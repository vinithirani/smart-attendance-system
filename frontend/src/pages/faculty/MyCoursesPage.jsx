import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, ScanLine, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    async function load() {
      const facs = await api.getFaculty();
      const me = facs.find(f => f.email === user?.email || f.name === user?.name) || facs[0];
      setFaculty(me);
      setCourses(me?.assigned_courses || []);
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="brand-font mb-1">My Assigned Courses</h2>
          <p className="text-muted small mb-0">
            Courses and lecture divisions allocated to your academic teaching schedule.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {courses.map((course, idx) => (
          <div key={idx} className="col-md-6 col-xl-4">
            <div className="custom-card h-100 d-flex flex-column justify-content-between p-4 shadow-sm">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem'
                    }}
                  >
                    {course.course_code || 'CRS'}
                  </div>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                    Sem {course.semester} - Div {course.division}
                  </span>
                </div>

                <h5 className="fw-bold text-dark mb-1">{course.course_name || course.course_code}</h5>
                <p className="text-muted small mb-4">Assigned to: {faculty?.name || user?.name}</p>
              </div>

              <div>
                <div className="d-flex justify-content-between py-2 border-top border-bottom small text-muted mb-3">
                  <span><GraduationCap size={16} className="text-primary me-1" /><strong>6</strong> Students</span>
                  <span><ScanLine size={16} className="text-success me-1" /><strong>92.5%</strong> Attendance</span>
                </div>

                <Link 
                  to="/faculty/take-attendance" 
                  className="btn btn-primary-custom w-100 justify-content-center"
                >
                  <ScanLine size={18} /> Start Attendance Session
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
