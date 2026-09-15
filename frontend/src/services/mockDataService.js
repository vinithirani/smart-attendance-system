/**
 * In-Memory Academic Database & AI Face Simulation Service
 * Provides complete data persistence & realistic biometric verification
 * for zero-setup academic presentations & fallback resilience.
 */

const INITIAL_USERS = [
  { id: 1, name: "Dr. Rajesh Sharma (HOD)", email: "admin@smartattendance.edu", role: "admin", status: "active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 2, name: "Devanshi Patel", email: "devanshi@smartattendance.edu", role: "faculty", status: "active", avatar: "/hero-biometric.jpg" },
  { id: 3, name: "Risha Tiwari", email: "risha@smartattendance.edu", role: "faculty", status: "active", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
  { id: 4, name: "Dhruv Patel", email: "dhruv@smartattendance.edu", role: "faculty", status: "active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: 5, name: "Shyam Chavda", email: "shyam@smartattendance.edu", role: "faculty", status: "active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
];

const INITIAL_COURSES = [
  { id: 1, course_name: "MCA - Master of Computer Applications", course_code: "MCA", department: "Computer Science & Applications", duration_years: 2, total_semesters: 4, status: "active", student_count: 6, faculty_count: 1 },
  { id: 2, course_name: "BCA - Bachelor of Computer Applications", course_code: "BCA", department: "Computer Science & Applications", duration_years: 3, total_semesters: 6, status: "active", student_count: 3, faculty_count: 1 },
  { id: 3, course_name: "B.Tech - Computer Science & Engineering", course_code: "B.Tech", department: "Engineering & Technology", duration_years: 4, total_semesters: 8, status: "active", student_count: 3, faculty_count: 1 },
  { id: 4, course_name: "M.Tech - AI & Data Science", course_code: "M.Tech", department: "Postgraduate Studies", duration_years: 2, total_semesters: 4, status: "active", student_count: 2, faculty_count: 1 }
];

const INITIAL_FACULTY = [
  {
    id: 1, user_id: 2, name: "Devanshi Patel", faculty_code: "FAC-MCA-001", email: "devanshi@smartattendance.edu",
    phone: "+91 98765 43210", department: "Master of Computer Applications", designation: "Assistant Professor", status: "active",
    assigned_courses: [
      { id: 1, course_id: 1, course_name: "MCA - Master of Computer Applications", course_code: "MCA", semester: 2, division: "A" },
      { id: 2, course_id: 1, course_name: "MCA - Master of Computer Applications", course_code: "MCA", semester: 4, division: "A" }
    ]
  },
  {
    id: 2, user_id: 3, name: "Risha Tiwari", faculty_code: "FAC-BCA-002", email: "risha@smartattendance.edu",
    phone: "+91 98765 43211", department: "Bachelor of Computer Applications", designation: "Assistant Professor", status: "active",
    assigned_courses: [
      { id: 3, course_id: 2, course_name: "BCA - Bachelor of Computer Applications", course_code: "BCA", semester: 2, division: "A" }
    ]
  },
  {
    id: 3, user_id: 4, name: "Dhruv Patel", faculty_code: "FAC-BTECH-003", email: "dhruv@smartattendance.edu",
    phone: "+91 98765 43212", department: "Computer Science & Engineering", designation: "Associate Professor", status: "active",
    assigned_courses: [
      { id: 5, course_id: 3, course_name: "B.Tech - Computer Science & Engineering", course_code: "B.Tech", semester: 4, division: "A" }
    ]
  },
  {
    id: 4, user_id: 5, name: "Shyam Chavda", faculty_code: "FAC-MTECH-004", email: "shyam@smartattendance.edu",
    phone: "+91 98765 43213", department: "Information Technology", designation: "Assistant Professor", status: "active",
    assigned_courses: [
      { id: 6, course_id: 4, course_name: "M.Tech - AI & Data Science", course_code: "M.Tech", semester: 2, division: "A" }
    ]
  }
];

const INITIAL_STUDENTS = [
  // MCA (Course 1, Sem 2, Div A)
  { id: 101, student_id: "STU-MCA-509", enrollment_number: "EN2024MCA509", name: "Bhavesh Gohil", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "bhavesh.gohil@student.edu", phone: "+91 91234 56701", gender: "Male", face_enrolled: true, attendance_rate: 98.8, status: "active" },
  { id: 102, student_id: "STU-MCA-846", enrollment_number: "EN2024MCA846", name: "Vinit Hirani", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "vinit.hirani@student.edu", phone: "+91 91234 56702", gender: "Male", face_enrolled: true, attendance_rate: 97.5, status: "active" },
  { id: 1, student_id: "STU-MCA-001", enrollment_number: "EN2024MCA001", name: "Aarav Mehta", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "aarav.mehta@student.edu", phone: "+91 91234 56780", gender: "Male", face_enrolled: true, attendance_rate: 94.2, status: "active" },
  { id: 2, student_id: "STU-MCA-002", enrollment_number: "EN2024MCA002", name: "Ananya Sharma", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "ananya.sharma@student.edu", phone: "+91 91234 56781", gender: "Female", face_enrolled: true, attendance_rate: 96.0, status: "active" },
  { id: 3, student_id: "STU-MCA-003", enrollment_number: "EN2024MCA003", name: "Rohan Verma", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "rohan.verma@student.edu", phone: "+91 91234 56782", gender: "Male", face_enrolled: true, attendance_rate: 88.5, status: "active" },
  { id: 4, student_id: "STU-MCA-004", enrollment_number: "EN2024MCA004", name: "Priya Shah", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "priya.shah@student.edu", phone: "+91 91234 56783", gender: "Female", face_enrolled: true, attendance_rate: 92.0, status: "active" },
  { id: 5, student_id: "STU-MCA-005", enrollment_number: "EN2024MCA005", name: "Kabir Joshi", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "kabir.joshi@student.edu", phone: "+91 91234 56784", gender: "Male", face_enrolled: false, attendance_rate: 76.4, status: "active" },
  { id: 6, student_id: "STU-MCA-006", enrollment_number: "EN2024MCA006", name: "Sneha Trivedi", course_id: 1, course_name: "MCA", semester: 2, division: "A", email: "sneha.trivedi@student.edu", phone: "+91 91234 56785", gender: "Female", face_enrolled: true, attendance_rate: 90.5, status: "active" },
  // BCA (Course 2, Sem 2, Div A)
  { id: 7, student_id: "STU-BCA-001", enrollment_number: "EN2024BCA001", name: "Ishaan Gupta", course_id: 2, course_name: "BCA", semester: 2, division: "A", email: "ishaan.gupta@student.edu", phone: "+91 91234 56786", gender: "Male", face_enrolled: true, attendance_rate: 89.0, status: "active" },
  { id: 8, student_id: "STU-BCA-002", enrollment_number: "EN2024BCA002", name: "Diya Pandya", course_id: 2, course_name: "BCA", semester: 2, division: "A", email: "diya.pandya@student.edu", phone: "+91 91234 56787", gender: "Female", face_enrolled: true, attendance_rate: 95.0, status: "active" },
  { id: 9, student_id: "STU-BCA-003", enrollment_number: "EN2024BCA003", name: "Aditya Nair", course_id: 2, course_name: "BCA", semester: 2, division: "A", email: "aditya.nair@student.edu", phone: "+91 91234 56788", gender: "Male", face_enrolled: true, attendance_rate: 85.5, status: "active" },
  // B.Tech (Course 3, Sem 4, Div A)
  { id: 10, student_id: "STU-BT-001", enrollment_number: "EN2024BT001", name: "Siddharth Rao", course_id: 3, course_name: "B.Tech", semester: 4, division: "A", email: "siddharth.rao@student.edu", phone: "+91 91234 56789", gender: "Male", face_enrolled: true, attendance_rate: 91.0, status: "active" },
  { id: 11, student_id: "STU-BT-002", enrollment_number: "EN2024BT002", name: "Kavya Desai", course_id: 3, course_name: "B.Tech", semester: 4, division: "A", email: "kavya.desai@student.edu", phone: "+91 91234 56790", gender: "Female", face_enrolled: true, attendance_rate: 93.4, status: "active" },
  { id: 12, student_id: "STU-BT-003", enrollment_number: "EN2024BT003", name: "Manish Soni", course_id: 3, course_name: "B.Tech", semester: 4, division: "A", email: "manish.soni@student.edu", phone: "+91 91234 56791", gender: "Male", face_enrolled: true, attendance_rate: 87.0, status: "active" },
  // M.Tech (Course 4, Sem 2, Div A)
  { id: 13, student_id: "STU-MT-001", enrollment_number: "EN2024MT001", name: "Vikramaditya Solanki", course_id: 4, course_name: "M.Tech", semester: 2, division: "A", email: "vikram.s@student.edu", phone: "+91 91234 56792", gender: "Male", face_enrolled: true, attendance_rate: 98.0, status: "active" },
  { id: 14, student_id: "STU-MT-002", enrollment_number: "EN2024MT002", name: "Pooja Kothari", course_id: 4, course_name: "M.Tech", semester: 2, division: "A", email: "pooja.k@student.edu", phone: "+91 91234 56793", gender: "Female", face_enrolled: true, attendance_rate: 94.0, status: "active" }
];

const INITIAL_FACULTY_ATTENDANCE = [
  { id: 1, faculty_id: 1, faculty_name: "Devanshi Patel", course_name: "MCA", date: new Date().toISOString().split("T")[0], attendance_time: "07:00:00 AM", status: "present", check_in_method: "Biometric Check-In", remarks: "Morning shift on-time" },
  { id: 2, faculty_id: 2, faculty_name: "Risha Tiwari", course_name: "BCA", date: new Date().toISOString().split("T")[0], attendance_time: "06:58:30 AM", status: "present", check_in_method: "Biometric Check-In", remarks: "Early arrival" },
  { id: 3, faculty_id: 3, faculty_name: "Dhruv Patel", course_name: "B.Tech", date: new Date().toISOString().split("T")[0], attendance_time: "07:04:12 AM", status: "present", check_in_method: "Biometric Check-In", remarks: "Morning shift on-time" },
  { id: 4, faculty_id: 4, faculty_name: "Shyam Chavda", course_name: "M.Tech", date: new Date().toISOString().split("T")[0], attendance_time: "07:15:00 AM", status: "late", check_in_method: "Biometric Check-In", remarks: "Slight transit delay" },
];

const INITIAL_SESSIONS = [
  {
    id: 1,
    faculty_id: 1,
    faculty_name: "Devanshi Patel",
    course_id: 1,
    course_name: "MCA - Master of Computer Applications",
    semester: 2,
    division: "A",
    subject: "Cloud Computing & AI Architecture",
    date: new Date().toISOString().split("T")[0],
    start_time: "08:00:00 AM",
    end_time: null,
    total_enrolled: 6,
    present_count: 3,
    absent_count: 3,
    unknown_count: 0,
    status: "active"
  }
];

const INITIAL_SESSION_RECORDS = {
  1: [
    { student_id: 1, status: "present", recognition_time: "08:02:15 AM", confidence: 0.9942, recognition_method: "Face Recognition AI" },
    { student_id: 2, status: "present", recognition_time: "08:03:10 AM", confidence: 0.9890, recognition_method: "Face Recognition AI" },
    { student_id: 3, status: "present", recognition_time: "08:04:45 AM", confidence: 0.9912, recognition_method: "Face Recognition AI" },
    { student_id: 4, status: "absent", recognition_time: "-", confidence: null, recognition_method: "Pending AI Scan" },
    { student_id: 5, status: "absent", recognition_time: "-", confidence: null, recognition_method: "Pending AI Scan" },
    { student_id: 6, status: "absent", recognition_time: "-", confidence: null, recognition_method: "Pending AI Scan" }
  ]
};

const INITIAL_AUDIT_LOGS = [
  { id: 1, user_name: "Devanshi Patel", role: "faculty", action: "START_ATTENDANCE_SESSION", entity_type: "session", entity_id: "1", new_value: "Started attendance session for MCA Sem 2 Div A", created_at: new Date().toISOString() },
  { id: 2, user_name: "Devanshi Patel", role: "faculty", action: "END_ATTENDANCE_SESSION", entity_type: "session", entity_id: "1", new_value: "Completed (Present: 5, Absent: 1, Unknown: 0)", created_at: new Date().toISOString() },
  { id: 3, user_name: "Dr. Rajesh Sharma (HOD)", role: "admin", action: "FACULTY_ASSIGNED", entity_type: "faculty", entity_id: "1", new_value: "Assigned Devanshi Patel to MCA Sem 2", created_at: new Date().toISOString() }
];

class MockDataService {
  constructor() {
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem("smart_attendance_data_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.users = parsed.users || INITIAL_USERS;
        this.courses = parsed.courses || INITIAL_COURSES;
        this.faculty = parsed.faculty || INITIAL_FACULTY;
        this.students = parsed.students || INITIAL_STUDENTS;
        // Ensure Bhavesh and Vinit are always present
        INITIAL_STUDENTS.forEach(initSt => {
          if (!this.students.some(s => s.id === initSt.id || s.enrollment_number === initSt.enrollment_number)) {
            this.students.unshift(initSt);
          }
        });
        this.facultyAttendance = parsed.facultyAttendance || INITIAL_FACULTY_ATTENDANCE;
        this.sessions = parsed.sessions || INITIAL_SESSIONS;
        this.sessionRecords = parsed.sessionRecords || INITIAL_SESSION_RECORDS;
        this.auditLogs = parsed.auditLogs || INITIAL_AUDIT_LOGS;
        this.lastEnrolledStudentId = parsed.lastEnrolledStudentId || null;
        return;
      } catch (e) {
        console.error("Failed to parse saved state, resetting...", e);
      }
    }
    this.users = [...INITIAL_USERS];
    this.courses = [...INITIAL_COURSES];
    this.faculty = [...INITIAL_FACULTY];
    this.students = [...INITIAL_STUDENTS];
    this.facultyAttendance = [...INITIAL_FACULTY_ATTENDANCE];
    this.sessions = [...INITIAL_SESSIONS];
    this.sessionRecords = { ...INITIAL_SESSION_RECORDS };
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.lastEnrolledStudentId = null;
    this.saveState();
  }

  saveState() {
    localStorage.setItem("smart_attendance_data_v1", JSON.stringify({
      users: this.users,
      courses: this.courses,
      faculty: this.faculty,
      students: this.students,
      facultyAttendance: this.facultyAttendance,
      sessions: this.sessions,
      sessionRecords: this.sessionRecords,
      auditLogs: this.auditLogs,
      lastEnrolledStudentId: this.lastEnrolledStudentId
    }));
  }

  // --- Auth ---
  login(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error("Invalid email or user not found");
    }
    return {
      access_token: "mock_token_" + user.id + "_" + Date.now(),
      token_type: "bearer",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar
      }
    };
  }

  // --- Faculty ---
  getFaculty(filters = {}) {
    let result = [...this.faculty];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(q) || f.faculty_code.toLowerCase().includes(q) || f.email.toLowerCase().includes(q));
    }
    if (filters.status) {
      result = result.filter(f => f.status === filters.status);
    }
    return result;
  }

  addFaculty(data) {
    const id = this.faculty.length ? Math.max(...this.faculty.map(f => f.id)) + 1 : 1;
    const newFaculty = {
      id,
      user_id: id + 10,
      name: data.name,
      faculty_code: data.faculty_code,
      email: data.email,
      phone: data.phone || "+91 98765 00000",
      department: data.department || "Computer Applications",
      designation: data.designation || "Assistant Professor",
      status: "active",
      assigned_courses: data.assigned_courses || []
    };
    this.faculty.push(newFaculty);
    this.logAudit("admin", "CREATE_FACULTY", "faculty", String(id), `Added faculty ${data.name}`);
    this.saveState();
    return newFaculty;
  }

  updateFaculty(id, data) {
    const idx = this.faculty.findIndex(f => f.id === Number(id));
    if (idx !== -1) {
      this.faculty[idx] = { ...this.faculty[idx], ...data };
      this.saveState();
      return this.faculty[idx];
    }
    throw new Error("Faculty not found");
  }

  deleteFaculty(id) {
    const idx = this.faculty.findIndex(f => f.id === Number(id));
    if (idx !== -1) {
      this.faculty[idx].status = "inactive";
      this.saveState();
      return { success: true };
    }
    throw new Error("Faculty not found");
  }

  // --- 7:00 AM Faculty Attendance ---
  getFacultyAttendanceLogs(filters = {}) {
    let list = [...this.facultyAttendance];
    if (filters.date) {
      list = list.filter(item => item.date === filters.date);
    }
    if (filters.faculty_id) {
      list = list.filter(item => item.faculty_id === Number(filters.faculty_id));
    }
    if (filters.status) {
      list = list.filter(item => item.status === filters.status);
    }
    return list;
  }

  // --- Courses ---
  getCourses() {
    return this.courses.map(c => ({
      ...c,
      student_count: this.students.filter(s => s.course_id === c.id && s.status === "active").length,
      faculty_count: this.faculty.filter(f => f.assigned_courses.some(ac => ac.course_id === c.id)).length
    }));
  }

  addCourse(data) {
    const id = this.courses.length ? Math.max(...this.courses.map(c => c.id)) + 1 : 1;
    const newCourse = {
      id,
      course_name: data.course_name,
      course_code: data.course_code,
      department: data.department || "Computer Science",
      duration_years: Number(data.duration_years) || 2,
      total_semesters: Number(data.total_semesters) || 4,
      status: "active"
    };
    this.courses.push(newCourse);
    this.saveState();
    return newCourse;
  }

  // --- Students ---
  getStudents(filters = {}, currentUser = null) {
    let list = [...this.students];
    // Faculty restricted view
    if (currentUser && currentUser.role === "faculty") {
      const fac = this.faculty.find(f => f.email === currentUser.email || f.name === currentUser.name);
      if (fac) {
        const allowedCourseIds = fac.assigned_courses.map(ac => ac.course_id);
        list = list.filter(s => allowedCourseIds.includes(s.course_id));
      }
    }

    if (filters.course_id) {
      list = list.filter(s => s.course_id === Number(filters.course_id));
    }
    if (filters.semester) {
      list = list.filter(s => s.semester === Number(filters.semester));
    }
    if (filters.division) {
      list = list.filter(s => s.division.toUpperCase() === filters.division.toUpperCase());
    }
    if (filters.face_enrolled !== undefined && filters.face_enrolled !== "") {
      list = list.filter(s => s.face_enrolled === (filters.face_enrolled === true || filters.face_enrolled === "true"));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q) || s.enrollment_number.toLowerCase().includes(q));
    }
    return list;
  }

  addStudent(data) {
    const id = this.students.length ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    const course = this.courses.find(c => c.id === Number(data.course_id));
    const newStudent = {
      id,
      student_id: data.student_id,
      enrollment_number: data.enrollment_number,
      name: data.name,
      course_id: Number(data.course_id),
      course_name: course ? course.course_code : "Course",
      semester: Number(data.semester),
      division: (data.division || "A").toUpperCase(),
      email: data.email,
      phone: data.phone,
      gender: data.gender || "Not Specified",
      face_enrolled: false,
      attendance_rate: 0,
      status: "active"
    };
    this.students.push(newStudent);
    this.logAudit("admin", "REGISTER_STUDENT", "student", String(id), `Registered ${data.name} (${data.student_id})`);
    this.saveState();
    return newStudent;
  }

  updateStudent(studentId, data) {
    const id = Number(studentId);
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Student not found");

    const course = data.course_id ? this.courses.find(c => c.id === Number(data.course_id)) : null;

    this.students[index] = {
      ...this.students[index],
      ...data,
      id,
      course_id: data.course_id !== undefined ? Number(data.course_id) : this.students[index].course_id,
      course_name: course ? course.course_code : (data.course_name || this.students[index].course_name),
      semester: data.semester !== undefined ? Number(data.semester) : this.students[index].semester,
      division: data.division !== undefined ? data.division.toUpperCase() : this.students[index].division
    };

    this.logAudit("admin", "UPDATE_STUDENT", "student", String(id), `Updated details for ${this.students[index].name} (${this.students[index].student_id})`);
    this.saveState();
    return this.students[index];
  }

  deleteStudent(studentId) {
    const id = Number(studentId);
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Student not found");

    const deleted = this.students.splice(index, 1)[0];
    this.logAudit("admin", "DELETE_STUDENT", "student", String(id), `Deleted student record ${deleted.name} (${deleted.student_id})`);
    this.saveState();
    return { success: true, message: `Student ${deleted.name} deleted successfully` };
  }

  enrollStudentFace(studentId) {
    const st = this.students.find(s => s.id === Number(studentId));
    if (!st) throw new Error("Student not found");
    st.face_enrolled = true;
    this.lastEnrolledStudentId = st.id;
    this.logAudit("faculty", "FACE_ENROLLMENT_COMPLETED", "student", String(st.id), `Face biometrics enrolled for ${st.name}`);
    this.saveState();
    return {
      success: true,
      message: "Face Successfully Enrolled",
      student_id: st.id,
      student_name: st.name,
      confidence_score: 0.9945,
      enrolled_at: new Date().toISOString()
    };
  }

  // --- Attendance Sessions & Live Face AI ---
  startAttendanceSession(payload, user) {
    const id = this.sessions.length ? Math.max(...this.sessions.map(s => s.id)) + 1 : 1;
    const course = this.courses.find(c => c.id === Number(payload.course_id));
    const enrolledStudents = this.students.filter(
      s => s.course_id === Number(payload.course_id) && 
           s.semester === Number(payload.semester) && 
           s.division === (payload.division || "A").toUpperCase() &&
           s.status === "active"
    );

    const newSession = {
      id,
      faculty_id: Number(payload.faculty_id),
      faculty_name: user ? user.name : "Faculty",
      course_id: Number(payload.course_id),
      course_name: course ? course.course_name : "Course",
      semester: Number(payload.semester),
      division: (payload.division || "A").toUpperCase(),
      subject: payload.subject || "Lecture Session",
      date: new Date().toISOString().split("T")[0],
      start_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      end_time: null,
      total_enrolled: enrolledStudents.length,
      present_count: 0,
      absent_count: enrolledStudents.length,
      unknown_count: 0,
      status: "active"
    };

    this.sessions.unshift(newSession);
    this.sessionRecords[id] = enrolledStudents.map(s => ({
      student_id: s.id,
      status: "absent",
      recognition_time: "-",
      confidence: null,
      recognition_method: "Pending AI Scan"
    }));

    this.logAudit(user?.role || "faculty", "START_ATTENDANCE_SESSION", "session", String(id), `Started session for ${newSession.course_name} Sem ${newSession.semester}-${newSession.division}`);
    this.saveState();
    return newSession;
  }

  recognizeFaceInSession(sessionId, simulateType = "matched_enrolled", targetStudentId = null) {
    const session = this.sessions.find(s => s.id === Number(sessionId));
    if (!session) throw new Error("Session not found");

    const records = this.sessionRecords[sessionId] || [];
    
    // CASE 1: UNKNOWN PERSON SIMULATION
    if (simulateType === "unknown_person") {
      session.unknown_count = (session.unknown_count || 0) + 1;
      this.saveState();
      return {
        matched: false,
        is_unknown: true,
        already_marked: false,
        student: null,
        confidence: 0.1420,
        message: "UNKNOWN PERSON: Face is not registered for this Course. Attendance not marked."
      };
    }

    // CASE 2: MATCHED STUDENT IN THIS COURSE
    let targetStudent = null;

    if (targetStudentId) {
      const student = this.students.find(s => s.id === Number(targetStudentId));
      if (!student || !student.face_enrolled) {
        session.unknown_count = (session.unknown_count || 0) + 1;
        this.saveState();
        return {
          matched: false,
          is_unknown: true,
          already_marked: false,
          student: null,
          confidence: 0.1250,
          message: `UNKNOWN PERSON: Face biometrics not enrolled for ${student?.name || 'this student'}. Attendance not marked.`
        };
      }
      targetStudent = student;
    }

    const eligibleStudents = this.students.filter(
      s => s.course_id === session.course_id && 
           s.semester === session.semester && 
           s.division === session.division && 
           s.face_enrolled &&
           s.status === "active"
    );

    if (eligibleStudents.length === 0) {
      session.unknown_count = (session.unknown_count || 0) + 1;
      this.saveState();
      return {
        matched: false,
        is_unknown: true,
        already_marked: false,
        student: null,
        confidence: 0.2,
        message: "UNKNOWN PERSON: No face-enrolled students registered for this class."
      };
    }

    // If target not set, prioritize last enrolled student or next absent enrolled student
    if (!targetStudent) {
      if (this.lastEnrolledStudentId) {
        const lastEnrolled = eligibleStudents.find(s => s.id === Number(this.lastEnrolledStudentId));
        const lastRec = lastEnrolled ? records.find(r => r.student_id === lastEnrolled.id) : null;
        if (lastEnrolled && (!lastRec || lastRec.status === "absent")) {
          targetStudent = lastEnrolled;
        }
      }

      if (!targetStudent) {
        const absentRec = records.find(r => r.status === "absent");
        if (absentRec) {
          targetStudent = eligibleStudents.find(s => s.id === absentRec.student_id);
        }
        if (!targetStudent) {
          targetStudent = eligibleStudents[0];
        }
      }
    }

    const currentRecord = records.find(r => r.student_id === targetStudent.id);
    
    // DUPLICATE ATTENDANCE CHECK
    if (currentRecord && currentRecord.status === "present") {
      return {
        matched: true,
        is_unknown: false,
        already_marked: true,
        student: targetStudent,
        confidence: currentRecord.confidence || 0.9912,
        message: "Already Marked",
        recognition_time: currentRecord.recognition_time
      };
    }

    // Mark present
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (currentRecord) {
      currentRecord.status = "present";
      currentRecord.recognition_time = nowTime;
      currentRecord.confidence = 0.9935;
      currentRecord.recognition_method = "Face Recognition AI";
    }

    session.present_count = records.filter(r => r.status === "present").length;
    session.absent_count = Math.max(0, session.total_enrolled - session.present_count);
    this.saveState();

    return {
      matched: true,
      is_unknown: false,
      already_marked: false,
      student: targetStudent,
      confidence: 0.9935,
      message: `Recognized: ${targetStudent.name} - Attendance Marked`,
      recognition_time: nowTime
    };
  }

  manualOverride(sessionId, studentId, newStatus, reason = "Faculty manual correction", user) {
    const session = this.sessions.find(s => s.id === Number(sessionId));
    const records = this.sessionRecords[sessionId] || [];
    const rec = records.find(r => r.student_id === Number(studentId));
    const student = this.students.find(s => s.id === Number(studentId));
    
    if (rec) {
      const oldStatus = rec.status;
      rec.status = newStatus;
      rec.recognition_method = "Manual Safety Override";
      if (newStatus === "present") {
        rec.recognition_time = new Date().toLocaleTimeString();
      }

      session.present_count = records.filter(r => r.status === "present").length;
      session.absent_count = Math.max(0, session.total_enrolled - session.present_count);

      this.logAudit(
        user?.role || "faculty",
        "MANUAL_ATTENDANCE_OVERRIDE",
        "student_attendance",
        `Session:${sessionId}-Student:${student?.student_id}`,
        `Old: ${oldStatus} -> New: ${newStatus} (${reason})`
      );
      this.saveState();
      return { success: true };
    }
    throw new Error("Record not found");
  }

  getActiveSession(facultyId = null) {
    if (facultyId) {
      return this.sessions.find(s => s.status === "active" && s.faculty_id === Number(facultyId)) || null;
    }
    return this.sessions.find(s => s.status === "active") || null;
  }

  endAttendanceSession(sessionId, user) {
    const session = this.sessions.find(s => s.id === Number(sessionId));
    if (!session) throw new Error("Session not found");
    session.status = "completed";
    session.end_time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logAudit(user?.role || "faculty", "END_ATTENDANCE_SESSION", "session", String(sessionId), `Ended session (Present: ${session.present_count}, Absent: ${session.absent_count})`);
    this.saveState();
    return session;
  }

  getSessionRoster(sessionId) {
    const session = this.sessions.find(s => s.id === Number(sessionId));
    if (!session) return { session: null, roster: [] };
    const records = this.sessionRecords[sessionId] || [];
    const courseStudents = this.students.filter(
      s => s.course_id === session.course_id &&
           s.semester === session.semester &&
           s.division === session.division
    );

    const roster = courseStudents.map(s => {
      const rec = records.find(r => r.student_id === s.id);
      return {
        student_id: s.id,
        student_code: s.student_id,
        enrollment_number: s.enrollment_number,
        name: s.name,
        face_enrolled: s.face_enrolled,
        status: rec ? rec.status : "absent",
        recognition_time: rec ? rec.recognition_time : "-",
        recognition_method: rec ? rec.recognition_method : "None",
        confidence: rec ? rec.confidence : null
      };
    });

    return { session, roster };
  }

  getDashboardStats() {
    const totalStudents = this.students.filter(s => s.status === "active").length;
    const totalFaculty = this.faculty.filter(f => f.status === "active").length;
    const totalCourses = this.courses.filter(c => c.status === "active").length;
    const enrolledFaces = this.students.filter(s => s.face_enrolled && s.status === "active").length;

    return {
      total_students: totalStudents,
      total_faculty: totalFaculty,
      total_courses: totalCourses,
      today_student_attendance_pct: 91.6,
      today_faculty_attendance_pct: 100.0,
      today_present_students: 14,
      today_absent_students: 2,
      total_enrolled_faces: enrolledFaces
    };
  }

  getAuditLogs() {
    return [...this.auditLogs].reverse();
  }

  logAudit(role, action, entity_type, entity_id, new_value) {
    const newLog = {
      id: this.auditLogs.length + 1,
      user_name: role === "admin" ? "Dr. Rajesh Sharma (HOD)" : "Faculty User",
      role,
      action,
      entity_type,
      entity_id,
      new_value,
      created_at: new Date().toISOString()
    };
    this.auditLogs.push(newLog);
  }
}

export const mockService = new MockDataService();
