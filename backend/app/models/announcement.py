from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    target_department = Column(String, default="ALL") # ALL or specific department
    priority = Column(String, default="NORMAL") # URGENT, HIGH, NORMAL
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    author = relationship("User", back_populates="announcements_created")
