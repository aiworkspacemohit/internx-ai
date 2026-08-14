from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    COMPANY = "COMPANY"
    OFFICER = "OFFICER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.STUDENT)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=True) # E.g., Computer Science, Information Technology, Electronics
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    cgpa = Column(String, nullable=True)
    skills = Column(String, nullable=True) # Comma separated
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    company_profile = relationship("CompanyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    announcements_created = relationship("Announcement", back_populates="author", cascade="all, delete-orphan")
