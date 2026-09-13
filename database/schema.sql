-- ====================================================================
-- Smart Attendance System Using Face Recognition
-- PostgreSQL Database Schema
-- Domain: AI Automation
-- ====================================================================

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS student_attendance CASCADE;
DROP TABLE IF EXISTS attendance_sessions CASCADE;
DROP TABLE IF EXISTS faculty_attendance CASCADE;
DROP TABLE IF EXISTS face_enrollments CASCADE;
DROP TABLE IF EXISTS faculty_courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE (Authentication & Role Based Access Control)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'faculty')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. FACULTY TABLE
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    faculty_code VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) DEFAULT 'Computer Applications',
    designation VARCHAR(100) DEFAULT 'Assistant Professor',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSES TABLE
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(30) UNIQUE NOT NULL,
    department VARCHAR(100) DEFAULT 'Computer Science & Applications',
    duration_years INT DEFAULT 2,
    total_semesters INT DEFAULT 4,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. FACULTY COURSES MAPPING (Course Assignment)
CREATE TABLE faculty_courses (
    id SERIAL PRIMARY KEY,
    faculty_id INT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester INT DEFAULT 1,
    division VARCHAR(10) DEFAULT 'A',
    academic_year VARCHAR(20) DEFAULT '2025-2026',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(faculty_id, course_id, semester, division)
);

-- 5. STUDENTS TABLE
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    semester INT NOT NULL,
    division VARCHAR(10) NOT NULL DEFAULT 'A',
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    gender VARCHAR(20),
    face_enrolled BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. FACE ENROLLMENTS TABLE (Biometric Encodings & Landmarks)
CREATE TABLE face_enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    face_encoding TEXT NOT NULL, -- Serialized JSON array of facial embedding vector
    face_image_path VARCHAR(255),
    confidence_score NUMERIC(5, 4) DEFAULT 0.9850,
    enrolled_by INT REFERENCES faculty(id) ON DELETE SET NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- 7. FACULTY ATTENDANCE TABLE (Daily 7:00 AM Morning Check-ins)
CREATE TABLE faculty_attendance (
    id SERIAL PRIMARY KEY,
    faculty_id INT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    attendance_time TIME NOT NULL DEFAULT '07:00:00',
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
    check_in_method VARCHAR(50) DEFAULT 'Biometric Check-In',
    remarks VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(faculty_id, date)
);

-- 8. ATTENDANCE SESSIONS TABLE (Lecture Attendance Sessions initiated by Faculty)
CREATE TABLE attendance_sessions (
    id SERIAL PRIMARY KEY,
    faculty_id INT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    semester INT NOT NULL,
    division VARCHAR(10) NOT NULL,
    subject VARCHAR(100),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    total_enrolled INT DEFAULT 0,
    present_count INT DEFAULT 0,
    absent_count INT DEFAULT 0,
    unknown_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. STUDENT ATTENDANCE TABLE (Individual Student Session Records)
CREATE TABLE student_attendance (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    recognition_time TIME,
    confidence NUMERIC(5, 4),
    recognition_method VARCHAR(50) DEFAULT 'Face Recognition AI', -- 'Face Recognition AI' or 'Manual Safety Override'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, student_id) -- Prevents duplicate attendance for the same student in same session
);

-- 10. AUDIT LOGS TABLE (Institutional Accountability & Safety Trail)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(120),
    role VARCHAR(30),
    action VARCHAR(100) NOT NULL, -- e.g. 'MANUAL_ATTENDANCE_OVERRIDE', 'FACE_ENROLLMENT', 'FACULTY_CREATED'
    entity_type VARCHAR(50) NOT NULL, -- 'student_attendance', 'student', 'faculty', 'session'
    entity_id VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes for fast search, filter, and face verification queries
CREATE INDEX idx_students_course ON students(course_id, semester, division);
CREATE INDEX idx_students_enrollment ON students(enrollment_number);
CREATE INDEX idx_student_attendance_session ON student_attendance(session_id);
CREATE INDEX idx_student_attendance_student ON student_attendance(student_id);
CREATE INDEX idx_attendance_sessions_date ON attendance_sessions(date, course_id);
CREATE INDEX idx_faculty_attendance_date ON faculty_attendance(date, faculty_id);
CREATE INDEX idx_face_enrollments_student ON face_enrollments(student_id);
