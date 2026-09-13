from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import Base, engine, SessionLocal
from app.services.seed_service import seed_initial_database_if_empty
from app.api import auth, faculty, courses, students, attendance, reports, face_ai

# Initialize database schema tables
Base.metadata.create_all(bind=engine)

# Instantiate FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready REST API for Smart Attendance System Using Face Recognition (AI Automation)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS) for React Frontend & Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: Seed initial demo dataset if database is empty
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_initial_database_if_empty(db)
    finally:
        db.close()

# Include Sub-Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(faculty.router, prefix=settings.API_V1_STR)
app.include_router(courses.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(attendance.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(face_ai.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "domain": "AI Automation",
        "status": "online",
        "docs": "/docs",
        "api_version": "v1"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
