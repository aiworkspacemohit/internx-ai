from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, RoleChecker
from app.models.user import User, UserRole
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementResponse

router = APIRouter()

@router.get("/", response_model=List[AnnouncementResponse])
def get_announcements(
    department: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Announcement)
    if department and department != "ALL":
        query = query.filter((Announcement.target_department == department) | (Announcement.target_department == "ALL"))
    return query.order_by(Announcement.created_at.desc()).all()

@router.post("/", response_model=AnnouncementResponse)
def create_announcement(
    ann_in: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.OFFICER, UserRole.ADMIN]))
):
    announcement = Announcement(
        author_id=current_user.id,
        title=ann_in.title,
        content=ann_in.content,
        target_department=ann_in.target_department or "ALL",
        priority=ann_in.priority or "NORMAL"
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement
