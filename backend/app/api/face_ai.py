from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Student, FaceEnrollment, AttendanceSession, StudentAttendance, AuditLog, User
from app.schemas.schemas import (
    FaceEnrollRequest, FaceRecognizeRequest, FaceRecognizeResponse, StudentOut
)
from app.services.face_recognition_service import face_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/face-ai", tags=["Face AI & Recognition"])

@router.post("/enroll")
def enroll_student_face(
    payload: FaceEnrollRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    try:
        enrollment = face_service.enroll_student_face(
            db=db,
            student_id=payload.student_id,
            face_encoding_data=payload.face_encoding,
            enrolled_by=current_user.id
        )

        # Log audit
        audit = AuditLog(
            user_id=current_user.id,
            user_name=current_user.name,
            role=current_user.role,
            action="FACE_ENROLLMENT_COMPLETED",
            entity_type="student",
            entity_id=str(student.id),
            new_value=f"Biometric face enrolled successfully for {student.name} ({student.student_id})"
        )
        db.add(audit)
        db.commit()

        return {
            "success": True,
            "message": "Face Successfully Enrolled",
            "student_id": student.id,
            "student_name": student.name,
            "confidence_score": float(enrollment.confidence_score),
            "enrolled_at": str(enrollment.enrolled_at)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Face Enrollment Failed: {str(e)}")

@router.post("/recognize", response_model=FaceRecognizeResponse)
def recognize_and_mark_face(
    payload: FaceRecognizeRequest,
    db: Session = Depends(get_db)
):
    """
    Core AI Face Matching Route:
    - Queries ONLY enrolled students registered in the selected course/semester/division.
    - Matches biometric encoding vector.
    - If unknown/unregistered face -> returns UNKNOWN PERSON alert (No attendance marked).
    - If recognized -> marks Present & returns student details + recognition timestamp.
    - If already marked -> returns 'Already Marked' status to prevent duplicates.
    """
    probe_vector = payload.face_encoding
    if not probe_vector:
        # Fallback simulation vector if not provided
        probe_vector = face_service.generate_simulated_embedding("sample-probe-face")

    result = face_service.match_face_in_course(
        db=db,
        course_id=payload.course_id,
        semester=payload.semester,
        division=payload.division,
        probe_encoding=probe_vector,
        session_id=payload.session_id
    )

    if result["is_unknown"]:
        return FaceRecognizeResponse(
            matched=False,
            is_unknown=True,
            already_marked=False,
            student=None,
            confidence=result["confidence"],
            message="UNKNOWN PERSON: Face is not registered for this Course. Attendance not marked.",
            recognition_time=None
        )

    matched_student = result["student"]
    already_marked = result["already_marked"]

    # If session is active and not already marked, auto-record attendance in database
    rec_time_str = datetime.now().strftime("%H:%M:%S")
    if payload.session_id and not already_marked:
        session = db.query(AttendanceSession).filter(AttendanceSession.id == payload.session_id).first()
        if session:
            att_record = db.query(StudentAttendance).filter(
                StudentAttendance.session_id == session.id,
                StudentAttendance.student_id == matched_student.id
            ).first()

            if att_record:
                att_record.status = "present"
                att_record.recognition_time = datetime.now().time()
                att_record.confidence = result["confidence"]
                att_record.recognition_method = "Face Recognition AI"
            else:
                att_record = StudentAttendance(
                    session_id=session.id,
                    student_id=matched_student.id,
                    status="present",
                    recognition_time=datetime.now().time(),
                    confidence=result["confidence"],
                    recognition_method="Face Recognition AI"
                )
                db.add(att_record)

            present_cnt = db.query(StudentAttendance).filter(
                StudentAttendance.session_id == session.id,
                StudentAttendance.status == "present"
            ).count()
            session.present_count = present_cnt
            session.absent_count = max(0, session.total_enrolled - present_cnt)
            db.commit()

    s_out = StudentOut.from_orm(matched_student)
    s_out.course_name = matched_student.course.course_name if matched_student.course else ""

    return FaceRecognizeResponse(
        matched=True,
        is_unknown=False,
        already_marked=already_marked,
        student=s_out,
        confidence=result["confidence"],
        message="Already Marked" if already_marked else f"Recognized: {matched_student.name} - Attendance Marked",
        recognition_time=rec_time_str
    )
