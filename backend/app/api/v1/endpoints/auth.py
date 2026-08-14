from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.models.user import User, UserRole
from app.models.company import CompanyProfile
from app.schemas.user import StudentRegister, CompanyRegister, UserLogin, Token, UserResponse

router = APIRouter()

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated"
        )
    
    # If user is COMPANY, check if company profile is approved by Admin
    if user.role == UserRole.COMPANY:
        comp = db.query(CompanyProfile).filter(CompanyProfile.user_id == user.id).first()
        if not comp or not comp.is_approved:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your company registration request is pending Admin verification and approval."
            )

    token = create_access_token(data={"sub": user.email, "id": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/register/student", response_model=UserResponse)
def register_student(student_in: StudentRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == student_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        email=student_in.email,
        password_hash=get_password_hash(student_in.password),
        full_name=student_in.full_name,
        role=UserRole.STUDENT,
        phone=student_in.phone,
        department=student_in.department,
        cgpa=student_in.cgpa,
        skills=student_in.skills,
        bio=student_in.bio
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/register/company")
def register_company(company_in: CompanyRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == company_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        email=company_in.email,
        password_hash=get_password_hash(company_in.password),
        full_name=company_in.full_name,
        role=UserRole.COMPANY
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    company_profile = CompanyProfile(
        user_id=user.id,
        company_name=company_in.company_name,
        industry=company_in.industry,
        website=company_in.website,
        location=company_in.location,
        description=company_in.description,
        contact_person=company_in.full_name,
        contact_email=company_in.email,
        is_approved=False,
        verification_status="PENDING"
    )
    db.add(company_profile)
    db.commit()

    return {
        "message": "Company registration request submitted successfully! Pending Administrator approval before sign in.",
        "company_name": company_in.company_name,
        "status": "PENDING"
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
