from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.application import ApplicationResponse

class InterviewCreate(BaseModel):
    application_id: int
    round_name: str
    scheduled_at: datetime
    duration_minutes: int = 45
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None
    notes: Optional[str] = None

class InterviewUpdate(BaseModel):
    round_name: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class InterviewResponse(BaseModel):
    id: int
    application_id: int
    round_name: str
    scheduled_at: datetime
    duration_minutes: int
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_at: datetime
    application: Optional[ApplicationResponse] = None

    class Config:
        from_attributes = True
