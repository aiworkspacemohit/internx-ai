from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, RoleChecker
from app.models.user import User, UserRole
from app.models.company import CompanyProfile
from app.schemas.company import CompanyProfileResponse, CompanyProfileUpdate

router = APIRouter()

@router.get("/", response_model=List[CompanyProfileResponse])
def get_companies(
    status: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(CompanyProfile)
    if status:
        query = query.filter(CompanyProfile.verification_status == status)
    else:
        # Default public view shows approved companies
        query = query.filter(CompanyProfile.is_approved == True)
    return query.all()

@router.get("/me", response_model=CompanyProfileResponse)
def get_my_company_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return profile

@router.put("/me", response_model=CompanyProfileResponse)
def update_my_company_profile(
    update_in: CompanyProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    for field, value in update_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

@router.put("/{company_id}/approve")
def approve_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.OFFICER]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.id == company_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    profile.is_approved = True
    profile.verification_status = "APPROVED"
    db.commit()
    return {"message": f"Company '{profile.company_name}' has been successfully verified and approved."}

@router.put("/{company_id}/reject")
def reject_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.OFFICER]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.id == company_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    profile.is_approved = False
    profile.verification_status = "REJECTED"
    db.commit()
    return {"message": f"Company '{profile.company_name}' registration request rejected."}
