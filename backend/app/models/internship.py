from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("company_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, index=True)
    role_category = Column(String, nullable=False) # Frontend, Backend, AI/ML, Data Science, Full Stack, DevOps, UI/UX
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True) # Comma-separated or bullet list
    stipend = Column(String, nullable=False) # e.g. "$1,200/mo" or "Rs. 25,000/mo"
    location = Column(String, nullable=False) # Remote, Hybrid, Onsite (New York, Tech Hub, etc.)
    duration = Column(String, nullable=False) # e.g. 3 Months, 6 Months
    openings = Column(Integer, default=1)
    deadline = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    company = relationship("CompanyProfile", back_populates="internships")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")
