-- ====================================================================
-- Smart Attendance System Using Face Recognition
-- Seed Data & Initial Records
-- ====================================================================

-- 1. SEED USERS (Password for all demo accounts: 'password123')
-- Pre-hashed with bcrypt for demo verification
INSERT INTO users (id, name, email, password_hash, role, status, avatar_url) VALUES
(1, 'Dr. Rajesh Sharma (HOD)', 'admin@smartattendance.edu', '$2b$12$e8h4JgD5d0o1f3z7w9k0u.1gq7NqJ5v3z7w9k0u.1gq7NqJ5v3z7w', 'admin', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'Devanshi Patel', 'devanshi@smartattendance.edu', '$2b$12$e8h4JgD5d0o1f3z7w9k0u.1gq7NqJ5v3z7w9k0u.1gq7NqJ5v3z7w', 'faculty', 'active', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
(3, 'Risha Tiwari', 'risha@smartattendance.edu', '$2b$12$e8h4JgD5d0o1f3z7w9k0u.1gq7NqJ5v3z7w9k0u.1gq7NqJ5v3z7w', 'faculty', 'active', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
(4, 'Dhruv Patel', 'dhruv@smartattendance.edu', '$2b$12$e8h4JgD5d0o1f3z7w9k0u.1gq7NqJ5v3z7w9k0u.1gq7NqJ5v3z7w', 'faculty', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(5, 'Shyam Chavda', 'shyam@smartattendance.edu', '$2b$12$e8h4JgD5d0o1f3z7w9k0u.1gq7NqJ5v3z7w9k0u.1gq7NqJ5v3z7w', 'faculty', 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150');

-- 2. SEED FACULTY PROFILES
INSERT INTO faculty (id, user_id, name, faculty_code, email, phone, department, designation, status) VALUES
(1, 2, 'Devanshi Patel', 'FAC-MCA-001', 'devanshi@smartattendance.edu', '+91 98765 43210', 'Master of Computer Applications', 'Assistant Professor', 'active'),
(2, 3, 'Risha Tiwari', 'FAC-BCA-002', 'risha@smartattendance.edu', '+91 98765 43211', 'Bachelor of Computer Applications', 'Assistant Professor', 'active'),
(3, 4, 'Dhruv Patel', 'FAC-BTECH-003', 'dhruv@smartattendance.edu', '+91 98765 43212', 'Computer Science & Engineering', 'Associate Professor', 'active'),
(4, 5, 'Shyam Chavda', 'FAC-MTECH-004', 'shyam@smartattendance.edu', '+91 98765 43213', 'Information Technology', 'Assistant Professor', 'active');

-- 3. SEED COURSES
INSERT INTO courses (id, course_name, course_code, department, duration_years, total_semesters, status) VALUES
(1, 'MCA - Master of Computer Applications', 'MCA', 'Computer Science & Applications', 2, 4, 'active'),
(2, 'BCA - Bachelor of Computer Applications', 'BCA', 'Computer Science & Applications', 3, 6, 'active'),
(3, 'B.Tech - Computer Science & Engineering', 'B.Tech', 'Engineering & Technology', 4, 8, 'active'),
(4, 'M.Tech - Artificial Intelligence & Data Science', 'M.Tech', 'Postgraduate Studies', 2, 4, 'active');

-- 4. SEED FACULTY-COURSE ALLOCATIONS
INSERT INTO faculty_courses (id, faculty_id, course_id, semester, division, academic_year) VALUES
(1, 1, 1, 2, 'A', '2025-2026'),
(2, 1, 1, 4, 'A', '2025-2026'),
(3, 2, 2, 2, 'A', '2025-2026'),
(4, 2, 2, 4, 'B', '2025-2026'),
(5, 3, 3, 4, 'A', '2025-2026'),
(6, 3, 3, 6, 'A', '2025-2026'),
(7, 4, 4, 2, 'A', '2025-2026');

-- 5. SEED STUDENTS
INSERT INTO students (id, student_id, enrollment_number, name, course_id, semester, division, email, phone, gender, face_enrolled, status) VALUES
-- MCA Students
(1, 'STU-MCA-001', 'EN2024MCA001', 'Aarav Mehta', 1, 2, 'A', 'aarav.mehta@student.edu', '+91 91234 56780', 'Male', TRUE, 'active'),
(2, 'STU-MCA-002', 'EN2024MCA002', 'Ananya Sharma', 1, 2, 'A', 'ananya.sharma@student.edu', '+91 91234 56781', 'Female', TRUE, 'active'),
(3, 'STU-MCA-003', 'EN2024MCA003', 'Rohan Verma', 1, 2, 'A', 'rohan.verma@student.edu', '+91 91234 56782', 'Male', TRUE, 'active'),
(4, 'STU-MCA-004', 'EN2024MCA004', 'Priya Shah', 1, 2, 'A', 'priya.shah@student.edu', '+91 91234 56783', 'Female', TRUE, 'active'),
(5, 'STU-MCA-005', 'EN2024MCA005', 'Kabir Joshi', 1, 2, 'A', 'kabir.joshi@student.edu', '+91 91234 56784', 'Male', FALSE, 'active'),
(6, 'STU-MCA-006', 'EN2024MCA006', 'Sneha Trivedi', 1, 2, 'A', 'sneha.trivedi@student.edu', '+91 91234 56785', 'Female', TRUE, 'active'),
-- BCA Students
(7, 'STU-BCA-001', 'EN2024BCA001', 'Ishaan Gupta', 2, 2, 'A', 'ishaan.gupta@student.edu', '+91 91234 56786', 'Male', TRUE, 'active'),
(8, 'STU-BCA-002', 'EN2024BCA002', 'Diya Pandya', 2, 2, 'A', 'diya.pandya@student.edu', '+91 91234 56787', 'Female', TRUE, 'active'),
(9, 'STU-BCA-003', 'EN2024BCA003', 'Aditya Nair', 2, 2, 'A', 'aditya.nair@student.edu', '+91 91234 56788', 'Male', TRUE, 'active'),
-- B.Tech Students
(10, 'STU-BT-001', 'EN2024BT001', 'Siddharth Rao', 3, 4, 'A', 'siddharth.rao@student.edu', '+91 91234 56789', 'Male', TRUE, 'active'),
(11, 'STU-BT-002', 'EN2024BT002', 'Kavya Desai', 3, 4, 'A', 'kavya.desai@student.edu', '+91 91234 56790', 'Female', TRUE, 'active'),
(12, 'STU-BT-003', 'EN2024BT003', 'Manish Soni', 3, 4, 'A', 'manish.soni@student.edu', '+91 91234 56791', 'Male', TRUE, 'active'),
-- M.Tech Students
(13, 'STU-MT-001', 'EN2024MT001', 'Vikramaditya Solanki', 4, 2, 'A', 'vikram.s@student.edu', '+91 91234 56792', 'Male', TRUE, 'active'),
(14, 'STU-MT-002', 'EN2024MT002', 'Pooja Kothari', 4, 2, 'A', 'pooja.k@student.edu', '+91 91234 56793', 'Female', TRUE, 'active');

-- 6. SEED FACE ENROLLMENTS (Embedding placeholders)
INSERT INTO face_enrollments (id, student_id, face_encoding, confidence_score, enrolled_by, enrolled_at, status) VALUES
(1, 1, '[-0.0452, 0.1238, -0.0982, 0.0451, 0.0892, -0.1542, 0.0321, 0.0874]', 0.9920, 1, CURRENT_TIMESTAMP - INTERVAL '10 days', 'active'),
(2, 2, '[0.0821, -0.0543, 0.1145, -0.0211, 0.1342, -0.0872, 0.0451, 0.0912]', 0.9880, 1, CURRENT_TIMESTAMP - INTERVAL '10 days', 'active'),
(3, 3, '[-0.0125, 0.0984, -0.0456, 0.0876, -0.0345, 0.1123, -0.0765, 0.0543]', 0.9950, 1, CURRENT_TIMESTAMP - INTERVAL '9 days', 'active'),
(4, 4, '[0.0654, -0.0321, 0.0876, -0.0432, 0.0987, -0.0654, 0.0321, 0.0876]', 0.9890, 1, CURRENT_TIMESTAMP - INTERVAL '8 days', 'active'),
(5, 6, '[-0.0789, 0.0654, -0.0321, 0.0987, -0.0432, 0.0876, -0.0654, 0.0321]', 0.9910, 1, CURRENT_TIMESTAMP - INTERVAL '7 days', 'active'),
(6, 7, '[0.0543, -0.0876, 0.0654, -0.0321, 0.0987, -0.0432, 0.0876, -0.0654]', 0.9870, 2, CURRENT_TIMESTAMP - INTERVAL '6 days', 'active'),
(7, 8, '[-0.0432, 0.0876, -0.0654, 0.0321, 0.0987, -0.0543, 0.0876, -0.0321]', 0.9940, 2, CURRENT_TIMESTAMP - INTERVAL '5 days', 'active'),
(8, 9, '[0.0321, -0.0987, 0.0543, -0.0876, 0.0654, -0.0321, 0.0987, -0.0432]', 0.9860, 2, CURRENT_TIMESTAMP - INTERVAL '5 days', 'active'),
(9, 10, '[-0.0876, 0.0543, -0.0987, 0.0321, -0.0654, 0.0876, -0.0432, 0.0987]', 0.9930, 3, CURRENT_TIMESTAMP - INTERVAL '4 days', 'active'),
(10, 11, '[0.0987, -0.0432, 0.0876, -0.0654, 0.0321, -0.0987, 0.0543, -0.0876]', 0.9900, 3, CURRENT_TIMESTAMP - INTERVAL '4 days', 'active'),
(11, 12, '[-0.0654, 0.0321, -0.0987, 0.0543, -0.0876, 0.0654, -0.0321, 0.0987]', 0.9880, 3, CURRENT_TIMESTAMP - INTERVAL '3 days', 'active'),
(12, 13, '[0.0876, -0.0654, 0.0321, -0.0987, 0.0543, -0.0876, 0.0654, -0.0321]', 0.9960, 4, CURRENT_TIMESTAMP - INTERVAL '2 days', 'active'),
(13, 14, '[-0.0321, 0.0987, -0.0543, 0.0876, -0.0654, 0.0321, -0.0987, 0.0543]', 0.9920, 4, CURRENT_TIMESTAMP - INTERVAL '2 days', 'active');

-- 7. SEED 7:00 AM FACULTY ATTENDANCE LOGS
INSERT INTO faculty_attendance (id, faculty_id, course_id, date, attendance_time, status, check_in_method, remarks) VALUES
(1, 1, 1, CURRENT_DATE, '07:00:00', 'present', 'Biometric Check-In', 'Morning shift on-time'),
(2, 2, 2, CURRENT_DATE, '06:58:30', 'present', 'Biometric Check-In', 'Early arrival'),
(3, 3, 3, CURRENT_DATE, '07:04:12', 'present', 'Biometric Check-In', 'Morning shift on-time'),
(4, 4, 4, CURRENT_DATE, '07:15:00', 'late', 'Biometric Check-In', 'Slight transit delay'),
(5, 1, 1, CURRENT_DATE - INTERVAL '1 day', '07:00:00', 'present', 'Biometric Check-In', 'Normal'),
(6, 2, 2, CURRENT_DATE - INTERVAL '1 day', '07:02:10', 'present', 'Biometric Check-In', 'Normal'),
(7, 3, 3, CURRENT_DATE - INTERVAL '1 day', '07:00:00', 'present', 'Biometric Check-In', 'Normal'),
(8, 4, 4, CURRENT_DATE - INTERVAL '1 day', '07:01:45', 'present', 'Biometric Check-In', 'Normal');

-- 8. SEED ATTENDANCE SESSIONS (Faculty initiated)
INSERT INTO attendance_sessions (id, faculty_id, course_id, semester, division, subject, date, start_time, end_time, total_enrolled, present_count, absent_count, unknown_count, status) VALUES
(1, 1, 1, 2, 'A', 'Cloud Computing & AI Architecture', CURRENT_DATE, '08:00:00', '08:50:00', 6, 5, 1, 0, 'completed'),
(2, 2, 2, 2, 'A', 'Data Structures & Algorithms', CURRENT_DATE, '09:00:00', '09:50:00', 3, 3, 0, 0, 'completed'),
(3, 3, 3, 4, 'A', 'Operating Systems & Distributed Networks', CURRENT_DATE, '10:00:00', '10:50:00', 3, 2, 1, 1, 'completed'),
(4, 1, 1, 2, 'A', 'Advanced Database Systems', CURRENT_DATE - INTERVAL '1 day', '08:00:00', '08:50:00', 6, 6, 0, 0, 'completed');

-- 9. SEED STUDENT ATTENDANCE RECORDS
INSERT INTO student_attendance (id, session_id, student_id, status, recognition_time, confidence, recognition_method) VALUES
-- Session 1 (MCA Sem 2)
(1, 1, 1, 'present', '08:02:15', 0.9942, 'Face Recognition AI'),
(2, 1, 2, 'present', '08:03:10', 0.9890, 'Face Recognition AI'),
(3, 1, 3, 'present', '08:04:45', 0.9912, 'Face Recognition AI'),
(4, 1, 4, 'present', '08:05:30', 0.9975, 'Face Recognition AI'),
(5, 1, 6, 'present', '08:06:12', 0.9880, 'Face Recognition AI'),
(6, 1, 5, 'absent', NULL, NULL, 'System Auto-Absent'),
-- Session 2 (BCA Sem 2)
(7, 2, 7, 'present', '09:01:20', 0.9930, 'Face Recognition AI'),
(8, 2, 8, 'present', '09:02:40', 0.9910, 'Face Recognition AI'),
(9, 2, 9, 'present', '09:03:15', 0.9895, 'Face Recognition AI'),
-- Session 3 (B.Tech Sem 4)
(10, 3, 10, 'present', '10:02:00', 0.9950, 'Face Recognition AI'),
(11, 3, 11, 'present', '10:03:22', 0.9920, 'Face Recognition AI'),
(12, 3, 12, 'absent', NULL, NULL, 'System Auto-Absent');

-- 10. SEED AUDIT LOGS
INSERT INTO audit_logs (id, user_id, user_name, role, action, entity_type, entity_id, old_value, new_value, ip_address) VALUES
(1, 2, 'Devanshi Patel', 'faculty', 'START_ATTENDANCE_SESSION', 'session', '1', NULL, 'Session started for MCA Sem 2 Div A', '192.168.1.45'),
(2, 2, 'Devanshi Patel', 'faculty', 'END_ATTENDANCE_SESSION', 'session', '1', 'active', 'Completed (Present: 5, Absent: 1, Unknown: 0)', '192.168.1.45'),
(3, 1, 'Dr. Rajesh Sharma (HOD)', 'admin', 'ASSIGN_FACULTY_COURSE', 'faculty_course', '1', NULL, 'Assigned Devanshi Patel to MCA Sem 2', '192.168.1.10'),
(4, 3, 'Risha Tiwari', 'faculty', 'FACE_ENROLLMENT_COMPLETED', 'student', '7', 'Not Enrolled', 'Face Enrolled (Score: 0.987)', '192.168.1.46');

-- Reset sequences for auto-increment IDs
SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id),0) + 1, false) FROM users;
SELECT setval(pg_get_serial_sequence('faculty', 'id'), coalesce(max(id),0) + 1, false) FROM faculty;
SELECT setval(pg_get_serial_sequence('courses', 'id'), coalesce(max(id),0) + 1, false) FROM courses;
SELECT setval(pg_get_serial_sequence('faculty_courses', 'id'), coalesce(max(id),0) + 1, false) FROM faculty_courses;
SELECT setval(pg_get_serial_sequence('students', 'id'), coalesce(max(id),0) + 1, false) FROM students;
SELECT setval(pg_get_serial_sequence('face_enrollments', 'id'), coalesce(max(id),0) + 1, false) FROM face_enrollments;
SELECT setval(pg_get_serial_sequence('faculty_attendance', 'id'), coalesce(max(id),0) + 1, false) FROM faculty_attendance;
SELECT setval(pg_get_serial_sequence('attendance_sessions', 'id'), coalesce(max(id),0) + 1, false) FROM attendance_sessions;
SELECT setval(pg_get_serial_sequence('student_attendance', 'id'), coalesce(max(id),0) + 1, false) FROM student_attendance;
SELECT setval(pg_get_serial_sequence('audit_logs', 'id'), coalesce(max(id),0) + 1, false) FROM audit_logs;
