from datetime import date, datetime, time
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Faculty, User, Course, FacultyCourse, FacultyAttendance, AuditLog
from app.schemas.schemas import (
    FacultyOut, FacultyCreate, FacultyUpdate, 
    FacultyAttendanceOut
)
from app.core.security import get_password_hash
from app.api.auth import get_current_user, require_admin

router = APIRouter(prefix="/faculty", tags=["Faculty Management"])

@router.get("/", response_model=List[FacultyOut])
def list_faculty(
    search: Optional[str] = None,
    department: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Faculty)
    if search:
        s = f"%{search}%"
        query = query.filter((Faculty.name.ilike(s)) | (Faculty.faculty_code.ilike(s)) | (Faculty.email.ilike(s)))
    if department:
        query = query.filter(Faculty.department == department)
    if status_filter:
        query = query.filter(Faculty.status == status_filter)
    
    faculties = query.all()
    results = []
    for f in faculties:
        # Fetch assigned courses
        assigned = []
        for fc in f.course_assignments:
            assigned.append({
                "id": fc.id,
                "course_id": fc.course_id,
                "course_name": fc.course.course_name if fc.course else "",
                "course_code": fc.course.course_code if fc.course else "",
                "semester": fc.semester,
                "division": fc.division
            })
        
        f_dict = FacultyOut.from_orm(f)
        f_dict.assigned_courses = assigned
        results.append(f_dict)
    return results

@router.get("/{faculty_id}", response_model=FacultyOut)
def get_faculty_by_id(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    
    assigned = []
    for fc in faculty.course_assignments:
        assigned.append({
            "id": fc.id,
            "course_id": fc.course_id,
            "course_name": fc.course.course_name if fc.course else "",
            "course_code": fc.course.course_code if fc.course else "",
            "semester": fc.semester,
            "division": fc.division
        })
    f_dict = FacultyOut.from_orm(faculty)
    f_dict.assigned_courses = assigned
    return f_dict

@router.post("/", response_model=FacultyOut, status_code=status.HTTP_201_CREATED)
def create_faculty(
    payload: FacultyCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_admin)
):
    # Check duplicate email or code
    if db.query(Faculty).filter((Faculty.email == payload.email) | (Faculty.faculty_code == payload.faculty_code)).first():
        raise HTTPException(status_code=400, detail="Faculty with this email or code already exists")

    # Create associated user account
    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password or "password123"),
        role="faculty",
        status="active"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    faculty = Faculty(
        user_id=user.id,
        name=payload.name,
        faculty_code=payload.faculty_code,
        email=payload.email,
        phone=payload.phone,
        department=payload.department,
        designation=payload.designation,
        status="active"
    )
    db.add(faculty)
    db.commit()
    db.refresh(faculty)

    # Assign initial courses if specified
    if payload.assigned_course_ids:
        for cid in payload.assigned_course_ids:
            fc = FacultyCourse(faculty_id=faculty.id, course_id=cid, semester=1, division="A")
            db.add(fc)
        db.commit()

    # Log audit
    audit = AuditLog(
        user_id=current_user.id,
        user_name=current_user.name,
        role="admin",
        action="CREATE_FACULTY",
        entity_type="faculty",
        entity_id=str(faculty.id),
        new_value=f"Created faculty {faculty.name} ({faculty.faculty_code})"
    )
    db.add(audit)
    db.commit()

    return faculty

@router.put("/{faculty_id}", response_model=FacultyOut)
def update_faculty(
    faculty_id: int, 
    payload: FacultyUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    update_data = payload.dict(exclude_unset=True)
    assigned_course_ids = update_data.pop("assigned_course_ids", None)

    for field, value in update_data.items():
        setattr(faculty, field, value)

    # Update assigned courses if specified
    if assigned_course_ids is not None:
        db.query(FacultyCourse).filter(FacultyCourse.faculty_id == faculty.id).delete()
        for cid in assigned_course_ids:
            db.add(FacultyCourse(faculty_id=faculty.id, course_id=cid, semester=2, division="A"))

    db.commit()
    db.refresh(faculty)
    return faculty

@router.delete("/{faculty_id}")
def delete_faculty(
    faculty_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    faculty.status = "inactive"
    if faculty.user:
        faculty.user.status = "inactive"
    db.commit()
    return {"message": "Faculty deactivated successfully"}

# ----------------- 7:00 AM FACULTY ATTENDANCE MONITOR -----------------
@router.get("/attendance/logs", response_model=List[FacultyAttendanceOut])
def get_faculty_attendance_logs(
    target_date: Optional[date] = None,
    faculty_id: Optional[int] = None,
    course_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FacultyAttendance)
    if target_date:
        query = query.filter(FacultyAttendance.date == target_date)
    if faculty_id:
        query = query.filter(FacultyAttendance.faculty_id == faculty_id)
    if course_id:
        query = query.filter(FacultyAttendance.course_id == course_id)
    if status_filter:
        query = query.filter(FacultyAttendance.status == status_filter)

    records = query.order_by(FacultyAttendance.date.desc(), FacultyAttendance.attendance_time.asc()).all()
    results = []
    for r in records:
        results.append({
            "id": r.id,
            "faculty_id": r.faculty_id,
            "faculty_name": r.faculty.name if r.faculty else "Unknown",
            "course_id": r.course_id,
            "course_name": r.course.course_name if r.course else "All Assigned",
            "date": r.date,
            "attendance_time": r.attendance_time,
            "status": r.status,
            "check_in_method": r.check_in_method,
            "remarks": r.remarks
        })
    return results

@router.post("/attendance/check-in")
def record_faculty_check_in(
    faculty_id: int,
    status_str: str = "present",
    remarks: Optional[str] = "Morning Check-In",
    db: Session = Depends(get_db)
):
    today = date.today()
    existing = db.query(FacultyAttendance).filter(
        FacultyAttendance.faculty_id == faculty_id,
        FacultyAttendance.date == today
    ).first()

    if existing:
        existing.status = status_str
        existing.remarks = remarks
        db.commit()
        return {"message": "Check-in updated", "record_id": existing.id}

    rec = FacultyAttendance(
        faculty_id=faculty_id,
        date=today,
        attendance_time=datetime.now().time(),
        status=status_str,
        check_in_method="Biometric Check-In",
        remarks=remarks
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"message": "Faculty morning attendance recorded", "record_id": rec.id}
