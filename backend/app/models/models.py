from datetime import datetime, date, time
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, Time, 
    ForeignKey, Text, Numeric, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False) # 'admin', 'faculty'
    status = Column(String(20), default="active")
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    faculty_profile = relationship("Faculty", back_populates="user", uselist=False)

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(120), nullable=False)
    faculty_code = Column(String(30), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    department = Column(String(100), default="Computer Applications")
    designation = Column(String(100), default="Assistant Professor")
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="faculty_profile")
    course_assignments = relationship("FacultyCourse", back_populates="faculty", cascade="all, delete-orphan")
    attendance_logs = relationship("FacultyAttendance", back_populates="faculty", cascade="all, delete-orphan")
    sessions = relationship("AttendanceSession", back_populates="faculty")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String(100), nullable=False)
    course_code = Column(String(30), unique=True, index=True, nullable=False)
    department = Column(String(100), default="Computer Science & Applications")
    duration_years = Column(Integer, default=2)
    total_semesters = Column(Integer, default=4)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    faculty_assignments = relationship("FacultyCourse", back_populates="course", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="course")
    sessions = relationship("AttendanceSession", back_populates="course")

class FacultyCourse(Base):
    __tablename__ = "faculty_courses"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    semester = Column(Integer, default=1)
    division = Column(String(10), default="A")
    academic_year = Column(String(20), default="2025-2026")
    created_at = Column(DateTime, default=datetime.utcnow)

    faculty = relationship("Faculty", back_populates="course_assignments")
    course = relationship("Course", back_populates="faculty_assignments")

    __table_args__ = (
        UniqueConstraint('faculty_id', 'course_id', 'semester', 'division', name='uq_faculty_course_sem_div'),
    )

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), unique=True, index=True, nullable=False)
    enrollment_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(120), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False)
    semester = Column(Integer, nullable=False)
    division = Column(String(10), nullable=False, default="A")
    email = Column(String(150), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    gender = Column(String(20), nullable=True)
    face_enrolled = Column(Boolean, default=False)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    course = relationship("Course", back_populates="students")
    face_enrollment = relationship("FaceEnrollment", back_populates="student", uselist=False, cascade="all, delete-orphan")
    attendance_records = relationship("StudentAttendance", back_populates="student", cascade="all, delete-orphan")

class FaceEnrollment(Base):
    __tablename__ = "face_enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    face_encoding = Column(Text, nullable=False) # JSON array string of biometric embeddings
    face_image_path = Column(String(255), nullable=True)
    confidence_score = Column(Numeric(5, 4), default=0.9850)
    enrolled_by = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="active")

    student = relationship("Student", back_populates="face_enrollment")

class FacultyAttendance(Base):
    __tablename__ = "faculty_attendance"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    date = Column(Date, default=date.today, nullable=False)
    attendance_time = Column(Time, default=time(7, 0, 0), nullable=False)
    status = Column(String(20), default="present", nullable=False) # present, absent, late, on_leave
    check_in_method = Column(String(50), default="Biometric Check-In")
    remarks = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    faculty = relationship("Faculty", back_populates="attendance_logs")
    course = relationship("Course")

    __table_args__ = (
        UniqueConstraint('faculty_id', 'date', name='uq_faculty_daily_attendance'),
    )

class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False)
    semester = Column(Integer, nullable=False)
    division = Column(String(10), nullable=False)
    subject = Column(String(100), nullable=True)
    date = Column(Date, default=date.today, nullable=False)
    start_time = Column(Time, default=datetime.utcnow().time, nullable=False)
    end_time = Column(Time, nullable=True)
    total_enrolled = Column(Integer, default=0)
    present_count = Column(Integer, default=0)
    absent_count = Column(Integer, default=0)
    unknown_count = Column(Integer, default=0)
    status = Column(String(20), default="completed") # active, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    faculty = relationship("Faculty", back_populates="sessions")
    course = relationship("Course", back_populates="sessions")
    student_records = relationship("StudentAttendance", back_populates="session", cascade="all, delete-orphan")

class StudentAttendance(Base):
    __tablename__ = "student_attendance"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="present", nullable=False) # present, absent, late
    recognition_time = Column(Time, nullable=True)
    confidence = Column(Numeric(5, 4), nullable=True)
    recognition_method = Column(String(50), default="Face Recognition AI") # Face Recognition AI, Manual Safety Override
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("AttendanceSession", back_populates="student_records")
    student = relationship("Student", back_populates="attendance_records")

    __table_args__ = (
        UniqueConstraint('session_id', 'student_id', name='uq_session_student_attendance'),
    )

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_name = Column(String(120), nullable=True)
    role = Column(String(30), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=True)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
