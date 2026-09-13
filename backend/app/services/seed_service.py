import json
from datetime import datetime, date, time, timedelta
from sqlalchemy.orm import Session
from app.models.models import (
    User, Faculty, Course, FacultyCourse, Student, 
    FaceEnrollment, FacultyAttendance, AttendanceSession, 
    StudentAttendance, AuditLog
)
from app.core.security import get_password_hash
from app.services.face_recognition_service import face_service

def seed_initial_database_if_empty(db: Session):
    """Auto seeds default academic records and demo credentials if tables are empty"""
    user_count = db.query(User).count()
    if user_count > 0:
        return # Database already seeded

    print("[INFO] Database is empty. Seeding initial academic records...")

    # 1. Users
    pwd_hash = get_password_hash("password123")
    users = [
        User(
            id=1,
            name="Dr. Rajesh Sharma (HOD)",
            email="admin@smartattendance.edu",
            password_hash=pwd_hash,
            role="admin",
            status="active",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        ),
        User(
            id=2,
            name="Devanshi Patel",
            email="devanshi@smartattendance.edu",
            password_hash=pwd_hash,
            role="faculty",
            status="active",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
        ),
        User(
            id=3,
            name="Risha Tiwari",
            email="risha@smartattendance.edu",
            password_hash=pwd_hash,
            role="faculty",
            status="active",
            avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
        ),
        User(
            id=4,
            name="Dhruv Patel",
            email="dhruv@smartattendance.edu",
            password_hash=pwd_hash,
            role="faculty",
            status="active",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        ),
        User(
            id=5,
            name="Shyam Chavda",
            email="shyam@smartattendance.edu",
            password_hash=pwd_hash,
            role="faculty",
            status="active",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
        )
    ]
    db.add_all(users)
    db.commit()

    # 2. Faculty
    faculty_members = [
        Faculty(
            id=1, user_id=2, name="Devanshi Patel", faculty_code="FAC-MCA-001",
            email="devanshi@smartattendance.edu", phone="+91 98765 43210",
            department="Master of Computer Applications", designation="Assistant Professor", status="active"
        ),
        Faculty(
            id=2, user_id=3, name="Risha Tiwari", faculty_code="FAC-BCA-002",
            email="risha@smartattendance.edu", phone="+91 98765 43211",
            department="Bachelor of Computer Applications", designation="Assistant Professor", status="active"
        ),
        Faculty(
            id=3, user_id=4, name="Dhruv Patel", faculty_code="FAC-BTECH-003",
            email="dhruv@smartattendance.edu", phone="+91 98765 43212",
            department="Computer Science & Engineering", designation="Associate Professor", status="active"
        ),
        Faculty(
            id=4, user_id=5, name="Shyam Chavda", faculty_code="FAC-MTECH-004",
            email="shyam@smartattendance.edu", phone="+91 98765 43213",
            department="Information Technology", designation="Assistant Professor", status="active"
        )
    ]
    db.add_all(faculty_members)
    db.commit()

    # 3. Courses
    courses = [
        Course(id=1, course_name="MCA - Master of Computer Applications", course_code="MCA", department="Computer Applications", duration_years=2, total_semesters=4),
        Course(id=2, course_name="BCA - Bachelor of Computer Applications", course_code="BCA", department="Computer Applications", duration_years=3, total_semesters=6),
        Course(id=3, course_name="B.Tech - Computer Science & Engineering", course_code="B.Tech", department="Engineering", duration_years=4, total_semesters=8),
        Course(id=4, course_name="M.Tech - AI & Data Science", course_code="M.Tech", department="Postgraduate Studies", duration_years=2, total_semesters=4)
    ]
    db.add_all(courses)
    db.commit()

    # 4. Faculty Courses Assignment
    assignments = [
        FacultyCourse(id=1, faculty_id=1, course_id=1, semester=2, division="A"),
        FacultyCourse(id=2, faculty_id=1, course_id=1, semester=4, division="A"),
        FacultyCourse(id=3, faculty_id=2, course_id=2, semester=2, division="A"),
        FacultyCourse(id=4, faculty_id=2, course_id=2, semester=4, division="B"),
        FacultyCourse(id=5, faculty_id=3, course_id=3, semester=4, division="A"),
        FacultyCourse(id=6, faculty_id=4, course_id=4, semester=2, division="A"),
    ]
    db.add_all(assignments)
    db.commit()

    # 5. Students
    students_data = [
        # MCA (Course 1, Sem 2)
        Student(id=1, student_id="STU-MCA-001", enrollment_number="EN2024MCA001", name="Aarav Mehta", course_id=1, semester=2, division="A", email="aarav.mehta@student.edu", phone="+91 91234 56780", gender="Male", face_enrolled=True),
        Student(id=2, student_id="STU-MCA-002", enrollment_number="EN2024MCA002", name="Ananya Sharma", course_id=1, semester=2, division="A", email="ananya.sharma@student.edu", phone="+91 91234 56781", gender="Female", face_enrolled=True),
        Student(id=3, student_id="STU-MCA-003", enrollment_number="EN2024MCA003", name="Rohan Verma", course_id=1, semester=2, division="A", email="rohan.verma@student.edu", phone="+91 91234 56782", gender="Male", face_enrolled=True),
        Student(id=4, student_id="STU-MCA-004", enrollment_number="EN2024MCA004", name="Priya Shah", course_id=1, semester=2, division="A", email="priya.shah@student.edu", phone="+91 91234 56783", gender="Female", face_enrolled=True),
        Student(id=5, student_id="STU-MCA-005", enrollment_number="EN2024MCA005", name="Kabir Joshi", course_id=1, semester=2, division="A", email="kabir.joshi@student.edu", phone="+91 91234 56784", gender="Male", face_enrolled=False),
        Student(id=6, student_id="STU-MCA-006", enrollment_number="EN2024MCA006", name="Sneha Trivedi", course_id=1, semester=2, division="A", email="sneha.trivedi@student.edu", phone="+91 91234 56785", gender="Female", face_enrolled=True),
        
        # BCA (Course 2, Sem 2)
        Student(id=7, student_id="STU-BCA-001", enrollment_number="EN2024BCA001", name="Ishaan Gupta", course_id=2, semester=2, division="A", email="ishaan.gupta@student.edu", phone="+91 91234 56786", gender="Male", face_enrolled=True),
        Student(id=8, student_id="STU-BCA-002", enrollment_number="EN2024BCA002", name="Diya Pandya", course_id=2, semester=2, division="A", email="diya.pandya@student.edu", phone="+91 91234 56787", gender="Female", face_enrolled=True),
        Student(id=9, student_id="STU-BCA-003", enrollment_number="EN2024BCA003", name="Aditya Nair", course_id=2, semester=2, division="A", email="aditya.nair@student.edu", phone="+91 91234 56788", gender="Male", face_enrolled=True),

        # B.Tech (Course 3, Sem 4)
        Student(id=10, student_id="STU-BT-001", enrollment_number="EN2024BT001", name="Siddharth Rao", course_id=3, semester=4, division="A", email="siddharth.rao@student.edu", phone="+91 91234 56789", gender="Male", face_enrolled=True),
        Student(id=11, student_id="STU-BT-002", enrollment_number="EN2024BT002", name="Kavya Desai", course_id=3, semester=4, division="A", email="kavya.desai@student.edu", phone="+91 91234 56790", gender="Female", face_enrolled=True),
        Student(id=12, student_id="STU-BT-003", enrollment_number="EN2024BT003", name="Manish Soni", course_id=3, semester=4, division="A", email="manish.soni@student.edu", phone="+91 91234 56791", gender="Male", face_enrolled=True),

        # M.Tech (Course 4, Sem 2)
        Student(id=13, student_id="STU-MT-001", enrollment_number="EN2024MT001", name="Vikramaditya Solanki", course_id=4, semester=2, division="A", email="vikram.s@student.edu", phone="+91 91234 56792", gender="Male", face_enrolled=True),
        Student(id=14, student_id="STU-MT-002", enrollment_number="EN2024MT002", name="Pooja Kothari", course_id=4, semester=2, division="A", email="pooja.k@student.edu", phone="+91 91234 56793", gender="Female", face_enrolled=True)
    ]
    db.add_all(students_data)
    db.commit()

    # 6. Face Enrollments
    enrollments = []
    for s in students_data:
        if s.face_enrolled:
            emb = face_service.generate_simulated_embedding(f"{s.student_id}-{s.enrollment_number}")
            enrollments.append(FaceEnrollment(
                student_id=s.id,
                face_encoding=json.dumps(emb),
                confidence_score=0.9920,
                enrolled_by=1 if s.course_id == 1 else 2,
                status="active"
            ))
    db.add_all(enrollments)
    db.commit()

    # 7. Faculty 7:00 AM Attendance
    today = date.today()
    f_att = [
        FacultyAttendance(id=1, faculty_id=1, course_id=1, date=today, attendance_time=time(7, 0, 0), status="present", check_in_method="Biometric Check-In", remarks="Morning shift on-time"),
        FacultyAttendance(id=2, faculty_id=2, course_id=2, date=today, attendance_time=time(6, 58, 30), status="present", check_in_method="Biometric Check-In", remarks="Early arrival"),
        FacultyAttendance(id=3, faculty_id=3, course_id=3, date=today, attendance_time=time(7, 4, 12), status="present", check_in_method="Biometric Check-In", remarks="Morning shift on-time"),
        FacultyAttendance(id=4, faculty_id=4, course_id=4, date=today, attendance_time=time(7, 15, 0), status="late", check_in_method="Biometric Check-In", remarks="Slight transit delay"),
    ]
    db.add_all(f_att)
    db.commit()

    # 8. Completed Session & Student Records
    session1 = AttendanceSession(
        id=1, faculty_id=1, course_id=1, semester=2, division="A",
        subject="Cloud Computing & AI Architecture", date=today,
        start_time=time(8, 0, 0), end_time=time(8, 50, 0),
        total_enrolled=6, present_count=5, absent_count=1, unknown_count=0,
        status="completed"
    )
    db.add(session1)
    db.commit()

    records = [
        StudentAttendance(session_id=1, student_id=1, status="present", recognition_time=time(8, 2, 15), confidence=0.9942, recognition_method="Face Recognition AI"),
        StudentAttendance(session_id=1, student_id=2, status="present", recognition_time=time(8, 3, 10), confidence=0.9890, recognition_method="Face Recognition AI"),
        StudentAttendance(session_id=1, student_id=3, status="present", recognition_time=time(8, 4, 45), confidence=0.9912, recognition_method="Face Recognition AI"),
        StudentAttendance(session_id=1, student_id=4, status="present", recognition_time=time(8, 5, 30), confidence=0.9975, recognition_method="Face Recognition AI"),
        StudentAttendance(session_id=1, student_id=6, status="present", recognition_time=time(8, 6, 12), confidence=0.9880, recognition_method="Face Recognition AI"),
        StudentAttendance(session_id=1, student_id=5, status="absent", recognition_time=None, confidence=None, recognition_method="System Auto-Absent"),
    ]
    db.add_all(records)
    db.commit()

    # 9. Audit Logs
    logs = [
        AuditLog(user_id=2, user_name="Devanshi Patel", role="faculty", action="START_ATTENDANCE_SESSION", entity_type="session", entity_id="1", new_value="Session started for MCA Sem 2 Div A", ip_address="192.168.1.45"),
        AuditLog(user_id=2, user_name="Devanshi Patel", role="faculty", action="END_ATTENDANCE_SESSION", entity_type="session", entity_id="1", old_value="active", new_value="Completed (Present: 5, Absent: 1, Unknown: 0)", ip_address="192.168.1.45"),
        AuditLog(user_id=1, user_name="Dr. Rajesh Sharma (HOD)", role="admin", action="ASSIGN_FACULTY_COURSE", entity_type="faculty_course", entity_id="1", new_value="Assigned Devanshi Patel to MCA Sem 2", ip_address="192.168.1.10"),
    ]
    db.add_all(logs)
    db.commit()

    print("[SUCCESS] Initial academic dataset seeded successfully.")
