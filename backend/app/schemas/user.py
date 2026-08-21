from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    department: Optional[str] = None

class StudentRegister(UserBase):
    password: str
    cgpa: Optional[str] = None
    skills: Optional[str] = None
    bio: Optional[str] = None

class SendOTPRequest(BaseModel):
    email: EmailStr
    full_name: str

class VerifyOTPRequest(StudentRegister):
    otp_code: str

class CompanyRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

class OfficerCreate(UserBase):
    password: str
    department: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    cgpa: Optional[str] = None
    skills: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    cgpa: Optional[str] = None
    skills: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
