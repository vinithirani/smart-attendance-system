from datetime import datetime, date, time
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import (
    AttendanceSession, StudentAttendance, Student, Faculty, Course, 
    AuditLog, User
)
from app.schemas.schemas import (
    AttendanceSessionStart, AttendanceSessionEnd, AttendanceSessionOut,
    MarkAttendanceItem, ManualOverrideRequest
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/attendance", tags=["Attendance Management"])

@router.post("/sessions/start", response_model=AttendanceSessionOut)
def start_attendance_session(
    payload: AttendanceSessionStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total enrolled students in this course & class
    enrolled_count = db.query(Student).filter(
        Student.course_id == payload.course_id,
        Student.semester == payload.semester,
        Student.division == payload.division,
        Student.status == "active"
    ).count()

    session = AttendanceSession(
        faculty_id=payload.faculty_id,
        course_id=payload.course_id,
        semester=payload.semester,
        division=payload.division,
        subject=payload.subject or "Lecture Session",
        date=date.today(),
        start_time=datetime.now().time(),
        total_enrolled=enrolled_count,
        present_count=0,
        absent_count=enrolled_count,
        unknown_count=0,
        status="active"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Initialize all students as Absent by default so records exist
    course_students = db.query(Student).filter(
        Student.course_id == payload.course_id,
        Student.semester == payload.semester,
        Student.division == payload.division,
        Student.status == "active"
    ).all()

    for s in course_students:
        rec = StudentAttendance(
            session_id=session.id,
            student_id=s.id,
            status="absent",
            recognition_method="Pending AI Scan"
        )
        db.add(rec)
    db.commit()

    # Audit Log
    db.add(AuditLog(
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="START_ATTENDANCE_SESSION",
        entity_type="session",
        entity_id=str(session.id),
        new_value=f"Started attendance session for Course {payload.course_id}, Sem {payload.semester}-{payload.division}"
    ))
    db.commit()

    s_out = AttendanceSessionOut.from_orm(session)
    s_out.faculty_name = session.faculty.name if session.faculty else ""
    s_out.course_name = session.course.course_name if session.course else ""
    return s_out

@router.post("/sessions/{session_id}/mark")
def mark_student_attendance(
    session_id: int,
    payload: MarkAttendanceItem,
    db: Session = Depends(get_db)
):
    session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Attendance session not found")

    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Verify student belongs to this session's course/semester/division
    if student.course_id != session.course_id or student.semester != session.semester or student.division != session.division:
        raise HTTPException(status_code=400, detail="Student does not belong to this course/class session")

    existing_record = db.query(StudentAttendance).filter(
        StudentAttendance.session_id == session_id,
        StudentAttendance.student_id == student.id
    ).first()

    if existing_record:
        if existing_record.status == "present":
            return {
                "message": "Already Marked",
                "status": "already_marked",
                "student_name": student.name,
                "recognition_time": str(existing_record.recognition_time)
            }
        existing_record.status = payload.status
        existing_record.recognition_time = datetime.now().time()
        existing_record.confidence = payload.confidence or 0.99
        existing_record.recognition_method = payload.recognition_method or "Face Recognition AI"
    else:
        new_record = StudentAttendance(
            session_id=session_id,
            student_id=student.id,
            status=payload.status,
            recognition_time=datetime.now().time(),
            confidence=payload.confidence or 0.99,
            recognition_method=payload.recognition_method or "Face Recognition AI"
        )
        db.add(new_record)

    # Recalculate counts
    present_cnt = db.query(StudentAttendance).filter(StudentAttendance.session_id == session_id, StudentAttendance.status == "present").count()
    session.present_count = present_cnt
    session.absent_count = max(0, session.total_enrolled - present_cnt)
    db.commit()

    return {
        "message": "Attendance Marked Successfully",
        "status": "present",
        "student_name": student.name,
        "student_id": student.student_id,
        "recognition_time": datetime.now().strftime("%H:%M:%S")
    }

@router.post("/sessions/{session_id}/end", response_model=AttendanceSessionOut)
def end_attendance_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.end_time = datetime.now().time()
    session.status = "completed"

    present_cnt = db.query(StudentAttendance).filter(StudentAttendance.session_id == session_id, StudentAttendance.status == "present").count()
    session.present_count = present_cnt
    session.absent_count = max(0, session.total_enrolled - present_cnt)

    # Log audit
    db.add(AuditLog(
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="END_ATTENDANCE_SESSION",
        entity_type="session",
        entity_id=str(session.id),
        new_value=f"Completed attendance session. Present: {session.present_count}, Absent: {session.absent_count}"
    ))
    db.commit()
    db.refresh(session)

    s_out = AttendanceSessionOut.from_orm(session)
    s_out.faculty_name = session.faculty.name if session.faculty else ""
    s_out.course_name = session.course.course_name if session.course else ""
    return s_out

@router.post("/manual-override")
def manual_attendance_override(
    payload: ManualOverrideRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Safety override option allowing faculty to correct student status with mandatory audit log"""
    session = db.query(AttendanceSession).filter(AttendanceSession.id == payload.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    rec = db.query(StudentAttendance).filter(
        StudentAttendance.session_id == payload.session_id,
        StudentAttendance.student_id == payload.student_id
    ).first()

    old_status = rec.status if rec else "absent"

    if rec:
        rec.status = payload.new_status
        rec.recognition_method = "Manual Safety Override"
        if payload.new_status == "present" and not rec.recognition_time:
            rec.recognition_time = datetime.now().time()
    else:
        rec = StudentAttendance(
            session_id=payload.session_id,
            student_id=payload.student_id,
            status=payload.new_status,
            recognition_method="Manual Safety Override",
            recognition_time=datetime.now().time() if payload.new_status == "present" else None
        )
        db.add(rec)

    # Recalculate session counts
    db.commit()
    present_cnt = db.query(StudentAttendance).filter(StudentAttendance.session_id == session.id, StudentAttendance.status == "present").count()
    session.present_count = present_cnt
    session.absent_count = max(0, session.total_enrolled - present_cnt)

    # Write Audit Trail
    audit = AuditLog(
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="MANUAL_ATTENDANCE_OVERRIDE",
        entity_type="student_attendance",
        entity_id=f"Session:{session.id}-Student:{student.student_id}",
        old_value=f"Status: {old_status}",
        new_value=f"Status: {payload.new_status} | Reason: {payload.reason}"
    )
    db.add(audit)
    db.commit()

    return {"message": "Attendance status adjusted with audit log recorded", "new_status": payload.new_status}

@router.get("/sessions", response_model=List[AttendanceSessionOut])
def get_sessions(
    course_id: Optional[int] = None,
    faculty_id: Optional[int] = None,
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AttendanceSession)
    if course_id:
        query = query.filter(AttendanceSession.course_id == course_id)
    if faculty_id:
        query = query.filter(AttendanceSession.faculty_id == faculty_id)
    if target_date:
        query = query.filter(AttendanceSession.date == target_date)

    sessions = query.order_by(AttendanceSession.date.desc(), AttendanceSession.start_time.desc()).all()
    results = []
    for s in sessions:
        s_out = AttendanceSessionOut.from_orm(s)
        s_out.faculty_name = s.faculty.name if s.faculty else "Unknown"
        s_out.course_name = s.course.course_name if s.course else "Unknown"
        results.append(s_out)
    return results

@router.get("/sessions/{session_id}/students")
def get_session_student_roster(session_id: int, db: Session = Depends(get_db)):
    session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    students = db.query(Student).filter(
        Student.course_id == session.course_id,
        Student.semester == session.semester,
        Student.division == session.division,
        Student.status == "active"
    ).all()

    attendance_map = {
        rec.student_id: rec for rec in db.query(StudentAttendance).filter(StudentAttendance.session_id == session_id).all()
    }

    roster = []
    for st in students:
        rec = attendance_map.get(st.id)
        roster.append({
            "student_id": st.id,
            "student_code": st.student_id,
            "enrollment_number": st.enrollment_number,
            "name": st.name,
            "face_enrolled": st.face_enrolled,
            "status": rec.status if rec else "absent",
            "recognition_time": str(rec.recognition_time) if rec and rec.recognition_time else "-",
            "recognition_method": rec.recognition_method if rec else "None",
            "confidence": float(rec.confidence) if rec and rec.confidence else None
        })

    return {
        "session": {
            "id": session.id,
            "course_name": session.course.course_name if session.course else "",
            "semester": session.semester,
            "division": session.division,
            "subject": session.subject,
            "date": str(session.date),
            "faculty_name": session.faculty.name if session.faculty else "",
            "present_count": session.present_count,
            "absent_count": session.absent_count,
            "total_enrolled": session.total_enrolled
        },
        "roster": roster
    }
