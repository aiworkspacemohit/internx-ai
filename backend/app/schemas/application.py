from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.application import ApplicationStatus
from app.schemas.user import UserResponse
from app.schemas.internship import InternshipResponse

class ApplicationCreate(BaseModel):
    internship_id: int
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    feedback: Optional[str] = None
    offer_letter_url: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    internship_id: int
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None
    status: ApplicationStatus
    feedback: Optional[str] = None
    offer_letter_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    student: Optional[UserResponse] = None
    internship: Optional[InternshipResponse] = None

    class Config:
        from_attributes = True
