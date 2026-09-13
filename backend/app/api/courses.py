from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Course, Student, FacultyCourse, User
from app.schemas.schemas import CourseOut, CourseCreate, CourseUpdate
from app.api.auth import require_admin

router = APIRouter(prefix="/courses", tags=["Course Management"])

@router.get("/", response_model=List[CourseOut])
def list_courses(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if search:
        s = f"%{search}%"
        query = query.filter((Course.course_name.ilike(s)) | (Course.course_code.ilike(s)))
    if status_filter:
        query = query.filter(Course.status == status_filter)

    courses = query.all()
    results = []
    for c in courses:
        stu_cnt = db.query(Student).filter(Student.course_id == c.id, Student.status == "active").count()
        fac_cnt = db.query(FacultyCourse).filter(FacultyCourse.course_id == c.id).distinct(FacultyCourse.faculty_id).count()
        c_dict = CourseOut.from_orm(c)
        c_dict.student_count = stu_cnt
        c_dict.faculty_count = fac_cnt
        results.append(c_dict)
    return results

@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    stu_cnt = db.query(Student).filter(Student.course_id == course.id, Student.status == "active").count()
    fac_cnt = db.query(FacultyCourse).filter(FacultyCourse.course_id == course.id).distinct(FacultyCourse.faculty_id).count()
    c_dict = CourseOut.from_orm(course)
    c_dict.student_count = stu_cnt
    c_dict.faculty_count = fac_cnt
    return c_dict

@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if db.query(Course).filter(Course.course_code == payload.course_code).first():
        raise HTTPException(status_code=400, detail="Course with this code already exists")

    course = Course(**payload.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.put("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int, 
    payload: CourseUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)
    return course

@router.delete("/{course_id}")
def delete_course(
    course_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    course.status = "inactive"
    db.commit()
    return {"message": "Course deactivated successfully"}
