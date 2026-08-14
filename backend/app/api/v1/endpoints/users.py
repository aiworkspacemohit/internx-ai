from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash, RoleChecker
from app.models.user import User, UserRole
from app.schemas.user import UserResponse, UserUpdate, OfficerCreate

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_all_users(
    role: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.OFFICER]))
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()

@router.post("/officers", response_model=UserResponse)
def create_placement_officer(
    officer_in: OfficerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.ADMIN]))
):
    existing = db.query(User).filter(User.email == officer_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    officer = User(
        email=officer_in.email,
        password_hash=get_password_hash(officer_in.password),
        full_name=officer_in.full_name,
        role=UserRole.OFFICER,
        phone=officer_in.phone,
        department=officer_in.department
    )
    db.add(officer)
    db.commit()
    db.refresh(officer)
    return officer

@router.put("/me", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.ADMIN]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User status updated to {'active' if user.is_active else 'inactive'}"}
