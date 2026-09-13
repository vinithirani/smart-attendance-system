import os
from typing import List, Union
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Attendance System Using Face Recognition"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_jwt_key_for_smart_attendance_system_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database: Default SQLite fallback or PostgreSQL from env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./smart_attendance.db")
    
    # Face AI parameters
    FACE_SIMILARITY_THRESHOLD: float = 0.65
    UNKNOWN_PERSON_THRESHOLD: float = 0.55
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["*"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
