from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    round_name = Column(String, nullable=False) # e.g. Technical Round 1, System Design, HR Interview
    scheduled_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=45)
    meeting_link = Column(String, nullable=True)
    interviewer_name = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String, default="SCHEDULED") # SCHEDULED, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    application = relationship("Application", back_populates="interviews")
