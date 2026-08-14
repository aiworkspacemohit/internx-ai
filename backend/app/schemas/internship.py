from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.company import CompanyProfileResponse

class InternshipBase(BaseModel):
    title: str
    role_category: str
    description: str
    requirements: Optional[str] = None
    stipend: str
    location: str
    duration: str
    openings: int = 1
    deadline: Optional[datetime] = None

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    role_category: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    stipend: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    openings: Optional[int] = None
    deadline: Optional[datetime] = None
    is_active: Optional[bool] = None

class InternshipResponse(InternshipBase):
    id: int
    company_id: int
    is_active: bool
    created_at: datetime
    company: Optional[CompanyProfileResponse] = None

    class Config:
        from_attributes = True
