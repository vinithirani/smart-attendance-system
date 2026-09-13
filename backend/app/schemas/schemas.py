from datetime import datetime, date, time
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- AUTH SCHEMAS -----------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    status: Optional[str] = "active"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ----------------- FACULTY SCHEMAS -----------------
class FacultyBase(BaseModel):
    name: str
    faculty_code: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = "Computer Applications"
    designation: Optional[str] = "Assistant Professor"
    status: Optional[str] = "active"

class FacultyCreate(FacultyBase):
    password: Optional[str] = "password123"
    assigned_course_ids: Optional[List[int]] = []

class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    faculty_code: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    status: Optional[str] = None
    assigned_course_ids: Optional[List[int]] = None

class FacultyOut(FacultyBase):
    id: int
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    assigned_courses: Optional[List[Any]] = []

    class Config:
        from_attributes = True

# ----------------- COURSE SCHEMAS -----------------
class CourseBase(BaseModel):
    course_name: str
    course_code: str
    department: Optional[str] = "Computer Science & Applications"
    duration_years: Optional[int] = 2
    total_semesters: Optional[int] = 4
    status: Optional[str] = "active"

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    department: Optional[str] = None
    duration_years: Optional[int] = None
    total_semesters: Optional[int] = None
    status: Optional[str] = None

class CourseOut(CourseBase):
    id: int
    created_at: Optional[datetime] = None
    student_count: Optional[int] = 0
    faculty_count: Optional[int] = 0

    class Config:
        from_attributes = True

# ----------------- STUDENT SCHEMAS -----------------
class StudentBase(BaseModel):
    student_id: str
    enrollment_number: str
    name: str
    course_id: int
    semester: int
    division: str = "A"
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    status: Optional[str] = "active"

class StudentCreate(StudentBase):
    face_encoding: Optional[str] = None # Optional initial embedding

class StudentUpdate(BaseModel):
    student_id: Optional[str] = None
    enrollment_number: Optional[str] = None
    name: Optional[str] = None
    course_id: Optional[int] = None
    semester: Optional[int] = None
    division: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    status: Optional[str] = None

class StudentOut(StudentBase):
    id: int
    face_enrolled: bool = False
    created_at: Optional[datetime] = None
    course_name: Optional[str] = None
    attendance_rate: Optional[float] = 0.0

    class Config:
        from_attributes = True

# ----------------- FACE AI & RECOGNITION SCHEMAS -----------------
class FaceEnrollRequest(BaseModel):
    student_id: int
    face_image_base64: Optional[str] = None # Optional base64 frame
    face_encoding: Optional[List[float]] = None # Vector embeddings
    confidence_score: Optional[float] = 0.9850

class FaceRecognizeRequest(BaseModel):
    course_id: int
    semester: int
    division: str = "A"
    face_image_base64: Optional[str] = None
    face_encoding: Optional[List[float]] = None
    session_id: Optional[int] = None

class FaceRecognizeResponse(BaseModel):
    matched: bool
    is_unknown: bool
    already_marked: bool = False
    student: Optional[StudentOut] = None
    confidence: Optional[float] = None
    message: str
    recognition_time: Optional[str] = None

# ----------------- ATTENDANCE SESSION SCHEMAS -----------------
class AttendanceSessionStart(BaseModel):
    faculty_id: int
    course_id: int
    semester: int
    division: str = "A"
    subject: Optional[str] = None

class AttendanceSessionEnd(BaseModel):
    session_id: int
    remarks: Optional[str] = None

class MarkAttendanceItem(BaseModel):
    student_id: int
    status: str = "present" # 'present', 'absent', 'late'
    recognition_method: Optional[str] = "Face Recognition AI"
    confidence: Optional[float] = 0.99

class AttendanceSessionOut(BaseModel):
    id: int
    faculty_id: int
    faculty_name: Optional[str] = None
    course_id: int
    course_name: Optional[str] = None
    semester: int
    division: str
    subject: Optional[str] = None
    date: date
    start_time: time
    end_time: Optional[time] = None
    total_enrolled: int = 0
    present_count: int = 0
    absent_count: int = 0
    unknown_count: int = 0
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ----------------- MANUAL OVERRIDE SCHEMAS -----------------
class ManualOverrideRequest(BaseModel):
    session_id: int
    student_id: int
    new_status: str # 'present', 'absent'
    reason: Optional[str] = "Manual faculty correction"

# ----------------- FACULTY ATTENDANCE (7:00 AM) SCHEMAS -----------------
class FacultyAttendanceOut(BaseModel):
    id: int
    faculty_id: int
    faculty_name: str
    course_id: Optional[int] = None
    course_name: Optional[str] = None
    date: date
    attendance_time: time
    status: str
    check_in_method: str
    remarks: Optional[str] = None

    class Config:
        from_attributes = True

# ----------------- AUDIT & REPORTS SCHEMAS -----------------
class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    role: Optional[str] = None
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_students: int
    total_faculty: int
    total_courses: int
    today_student_attendance_pct: float
    today_faculty_attendance_pct: float
    today_present_students: int
    today_absent_students: int
    total_enrolled_faces: int
