from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyProfileBase(BaseModel):
    company_name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None

class CompanyProfileCreate(CompanyProfileBase):
    pass

class CompanyProfileUpdate(CompanyProfileBase):
    pass

class CompanyProfileResponse(CompanyProfileBase):
    id: int
    user_id: int
    logo_url: Optional[str] = None
    is_approved: bool
    verification_status: str
    created_at: datetime

    class Config:
        from_attributes = True
