from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Student, Course, FaceEnrollment, StudentAttendance, User, Faculty
from app.schemas.schemas import StudentOut, StudentCreate, StudentUpdate
from app.api.auth import get_current_user

router = APIRouter(prefix="/students", tags=["Student Management"])

@router.get("/", response_model=List[StudentOut])
def list_students(
    course_id: Optional[int] = None,
    semester: Optional[int] = None,
    division: Optional[str] = None,
    face_enrolled: Optional[bool] = None,
    search: Optional[str] = None,
    status_filter: Optional[str] = "active",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Student)

    # If faculty, restrict queries to faculty assigned courses
    if current_user.role == "faculty":
        faculty_profile = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
        if faculty_profile:
            assigned_cids = [fc.course_id for fc in faculty_profile.course_assignments]
            if assigned_cids:
                query = query.filter(Student.course_id.in_(assigned_cids))

    if course_id:
        query = query.filter(Student.course_id == course_id)
    if semester:
        query = query.filter(Student.semester == semester)
    if division:
        query = query.filter(Student.division == division)
    if face_enrolled is not None:
        query = query.filter(Student.face_enrolled == face_enrolled)
    if status_filter:
        query = query.filter(Student.status == status_filter)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Student.name.ilike(s)) | 
            (Student.student_id.ilike(s)) | 
            (Student.enrollment_number.ilike(s)) |
            (Student.email.ilike(s))
        )

    students = query.order_by(Student.course_id, Student.semester, Student.enrollment_number).all()
    results = []
    for st in students:
        # Calculate sample attendance rate
        total_sessions = db.query(StudentAttendance).filter(StudentAttendance.student_id == st.id).count()
        present_sessions = db.query(StudentAttendance).filter(StudentAttendance.student_id == st.id, StudentAttendance.status == "present").count()
        rate = round((present_sessions / total_sessions * 100), 1) if total_sessions > 0 else 88.5

        s_dict = StudentOut.from_orm(st)
        s_dict.course_name = st.course.course_name if st.course else "Unknown Course"
        s_dict.attendance_rate = rate
        results.append(s_dict)

    return results

@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    total_sessions = db.query(StudentAttendance).filter(StudentAttendance.student_id == student.id).count()
    present_sessions = db.query(StudentAttendance).filter(StudentAttendance.student_id == student.id, StudentAttendance.status == "present").count()
    rate = round((present_sessions / total_sessions * 100), 1) if total_sessions > 0 else 90.0

    s_dict = StudentOut.from_orm(student)
    s_dict.course_name = student.course.course_name if student.course else "Unknown"
    s_dict.attendance_rate = rate
    return s_dict

@router.post("/", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    payload: StudentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check duplicate
    if db.query(Student).filter((Student.student_id == payload.student_id) | (Student.enrollment_number == payload.enrollment_number)).first():
        raise HTTPException(status_code=400, detail="Student with this ID or Roll number already exists")

    student_data = payload.dict(exclude={"face_encoding"})
    student = Student(**student_data)
    student.face_enrolled = False
    db.add(student)
    db.commit()
    db.refresh(student)

    s_dict = StudentOut.from_orm(student)
    s_dict.course_name = student.course.course_name if student.course else ""
    return s_dict

@router.put("/{student_id}", response_model=StudentOut)
def update_student(
    student_id: int, 
    payload: StudentUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)

    s_dict = StudentOut.from_orm(student)
    s_dict.course_name = student.course.course_name if student.course else ""
    return s_dict

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.status = "inactive"
    db.commit()
    return {"message": "Student deactivated successfully"}
