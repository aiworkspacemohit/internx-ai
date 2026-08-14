from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, RoleChecker
from app.models.user import User, UserRole
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.schemas.internship import InternshipCreate, InternshipUpdate, InternshipResponse

router = APIRouter()

@router.get("/", response_model=List[InternshipResponse])
def get_internships(
    search: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Internship).filter(Internship.is_active == True)
    if search:
        query = query.filter(
            (Internship.title.ilike(f"%{search}%")) | 
            (Internship.description.ilike(f"%{search}%"))
        )
    if category and category != "ALL":
        query = query.filter(Internship.role_category == category)
    if location and location != "ALL":
        query = query.filter(Internship.location.ilike(f"%{location}%"))

    return query.order_by(Internship.created_at.desc()).all()

@router.get("/company/my-postings", response_model=List[InternshipResponse])
def get_my_company_postings(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return db.query(Internship).filter(Internship.company_id == profile.id).order_by(Internship.created_at.desc()).all()

@router.get("/{internship_id}", response_model=InternshipResponse)
def get_internship_by_id(internship_id: int, db: Session = Depends(get_db)):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship opportunity not found")
    return internship

@router.post("/", response_model=InternshipResponse)
def create_internship(
    job_in: InternshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile or not profile.is_approved:
        raise HTTPException(status_code=403, detail="Only approved companies can post internships")

    internship = Internship(
        company_id=profile.id,
        title=job_in.title,
        role_category=job_in.role_category,
        description=job_in.description,
        requirements=job_in.requirements,
        stipend=job_in.stipend,
        location=job_in.location,
        duration=job_in.duration,
        openings=job_in.openings,
        deadline=job_in.deadline
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship

@router.put("/{internship_id}", response_model=InternshipResponse)
def update_internship(
    internship_id: int,
    job_update: InternshipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    internship = db.query(Internship).filter(
        Internship.id == internship_id,
        Internship.company_id == profile.id
    ).first()

    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found or unauthorized")

    for field, value in job_update.model_dump(exclude_unset=True).items():
        setattr(internship, field, value)

    db.commit()
    db.refresh(internship)
    return internship

@router.delete("/{internship_id}")
def delete_internship(
    internship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY, UserRole.ADMIN]))
):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    db.delete(internship)
    db.commit()
    return {"message": "Internship posting deleted successfully"}
