import { mockService } from './mockDataService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Helper to check if backend is reachable
let isBackendLive = false;

async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      isBackendLive = true;
      return true;
    }
  } catch (e) {
    isBackendLive = false;
  }
  return false;
}

// Initial probe
checkBackendHealth();

export const api = {
  // --- AUTH ---
  async login(email, password) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend request failed, using mock service fallback", e);
      }
    }
    return mockService.login(email, password);
  },

  // --- DASHBOARD STATS ---
  async getDashboardStats() {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/reports/dashboard-stats`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.getDashboardStats();
  },

  // --- FACULTY ---
  async getFaculty(filters = {}) {
    if (isBackendLive) {
      try {
        const params = new URLSearchParams(filters);
        const res = await fetch(`${API_BASE_URL}/faculty/?${params.toString()}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.getFaculty(filters);
  },

  async addFaculty(data) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/faculty/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.addFaculty(data);
  },

  async updateFaculty(id, data) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.updateFaculty(id, data);
  },

  async deleteFaculty(id) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/faculty/${id}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.deleteFaculty(id);
  },

  // --- 7:00 AM FACULTY ATTENDANCE ---
  async getFacultyAttendance(filters = {}) {
    if (isBackendLive) {
      try {
        const params = new URLSearchParams(filters);
        const res = await fetch(`${API_BASE_URL}/faculty/attendance/logs?${params.toString()}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.getFacultyAttendanceLogs(filters);
  },

  // --- COURSES ---
  async getCourses() {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.getCourses();
  },

  async addCourse(data) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.addCourse(data);
  },

  // --- STUDENTS ---
  async getStudents(filters = {}, currentUser = null) {
    if (isBackendLive) {
      try {
        const params = new URLSearchParams();
        if (filters.course_id) params.append('course_id', filters.course_id);
        if (filters.semester) params.append('semester', filters.semester);
        if (filters.search) params.append('search', filters.search);
        const res = await fetch(`${API_BASE_URL}/students/?${params.toString()}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.getStudents(filters, currentUser);
  },

  async addStudent(data) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/students/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.addStudent(data);
  },

  async updateStudent(studentId, data) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.updateStudent(studentId, data);
  },

  async deleteStudent(studentId) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
          method: 'DELETE'
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.deleteStudent(studentId);
  },

  // --- FACE BIOMETRIC ENROLLMENT ---
  async enrollStudentFace(studentId, faceData = null) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/face-ai/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: Number(studentId), face_image_base64: faceData })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.enrollStudentFace(studentId);
  },

  // --- ATTENDANCE SESSIONS & SCANNER ---
  async startAttendanceSession(payload, user) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/attendance/sessions/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.startAttendanceSession(payload, user);
  },

  async getActiveSession(facultyId = null) {
    return mockService.getActiveSession(facultyId);
  },

  async recognizeFace(sessionId, simulateType = "matched_enrolled", targetStudentId = null) {
    return mockService.recognizeFaceInSession(sessionId, simulateType, targetStudentId);
  },

  async endAttendanceSession(sessionId, user) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/attendance/sessions/${sessionId}/end`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.endAttendanceSession(sessionId, user);
  },

  async getSessionRoster(sessionId) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/attendance/sessions/${sessionId}/students`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.getSessionRoster(sessionId);
  },

  async manualOverride(sessionId, studentId, newStatus, reason, user) {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/attendance/manual-override`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, student_id: studentId, new_status: newStatus, reason })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.manualOverride(sessionId, studentId, newStatus, reason, user);
  },

  // --- AUDIT LOGS ---
  async getAuditLogs() {
    if (isBackendLive) {
      try {
        const res = await fetch(`${API_BASE_URL}/reports/audit-logs`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return mockService.getAuditLogs();
  }
};
