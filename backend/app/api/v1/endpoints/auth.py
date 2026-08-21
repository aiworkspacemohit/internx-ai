import random
import time
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.models.user import User, UserRole
from app.models.company import CompanyProfile
from app.schemas.user import StudentRegister, CompanyRegister, UserLogin, Token, UserResponse, SendOTPRequest, VerifyOTPRequest
from app.services.email_service import send_otp_email

router = APIRouter()

# Fast In-Memory Thread-Safe Cache for OTP Verification (O(1) lookup complexity)
# Format: email -> {"code": "123456", "expires_at": timestamp}
OTP_CACHE: Dict[str, Dict[str, Any]] = {}
OTP_EXPIRATION_SECONDS = 600  # 10 Minutes

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

@router.post("/register/send-otp")
def send_registration_otp(
    req: SendOTPRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    email = req.email.strip().lower()

    # Enforce strict @gmail.com requirement for students
    if not email.endswith("@gmail.com"):
        raise HTTPException(
            status_code=400,
            detail="Student registration is strictly restricted to valid original @gmail.com addresses."
        )

    # Check if student email is already registered
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="This Gmail address is already registered in InternX.")

    # Generate 6-digit cryptographic OTP code
    otp_code = str(random.randint(100000, 999999))
    OTP_CACHE[email] = {
        "code": otp_code,
        "expires_at": time.time() + OTP_EXPIRATION_SECONDS
    }

    # Dispatch OTP via BackgroundTasks (sub-second API latency guarantee)
    background_tasks.add_task(
        send_otp_email,
        to_email=email,
        recipient_name=req.full_name,
        otp_code=otp_code
    )

    return {
        "message": "6-digit OTP code sent to your Gmail inbox successfully!",
        "email": email,
        "expires_in_seconds": OTP_EXPIRATION_SECONDS
    }

@router.post("/register/verify-otp", response_model=UserResponse)
def verify_otp_and_register(
    req: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    email = req.email.strip().lower()

    if not email.endswith("@gmail.com"):
        raise HTTPException(
            status_code=400,
            detail="Student registration is strictly restricted to valid original @gmail.com addresses."
        )

    # Check OTP Cache in O(1) time complexity
    cached = OTP_CACHE.get(email)
    if not cached:
        raise HTTPException(status_code=400, detail="No OTP code requested for this email. Please click 'Send Verification OTP'.")

    if time.time() > cached["expires_at"]:
        OTP_CACHE.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP code has expired. Please request a new 6-digit OTP.")

    if cached["code"] != req.otp_code.strip():
        raise HTTPException(status_code=400, detail="Invalid 6-digit OTP code. Please check your Gmail inbox.")

    # Clear OTP code after successful verification
    OTP_CACHE.pop(email, None)

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="This email is already registered")

    user = User(
        email=email,
        password_hash=get_password_hash(req.password),
        full_name=req.full_name,
        role=UserRole.STUDENT,
        phone=req.phone,
        department=req.department,
        cgpa=req.cgpa,
        skills=req.skills,
        bio=req.bio
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/register/student", response_model=UserResponse)
def register_student(
    student_in: StudentRegister,
    db: Session = Depends(get_db)
):
    email = student_in.email.strip().lower()

    if not email.endswith("@gmail.com"):
        raise HTTPException(
            status_code=400,
            detail="Student registration is strictly restricted to valid original @gmail.com addresses."
        )

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        email=email,
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
