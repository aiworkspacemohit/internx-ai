from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserResponse

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    target_department: Optional[str] = "ALL"
    priority: Optional[str] = "NORMAL"

class AnnouncementResponse(BaseModel):
    id: int
    author_id: int
    title: str
    content: str
    target_department: str
    priority: str
    created_at: datetime
    author: Optional[UserResponse] = None

    class Config:
        from_attributes = True
