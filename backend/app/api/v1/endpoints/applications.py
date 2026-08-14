from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user, RoleChecker
from app.models.user import User, UserRole
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.application import Application, ApplicationStatus
from app.models.notification import Notification
from app.schemas.application import ApplicationCreate, ApplicationStatusUpdate, ApplicationResponse
from app.services.email_service import send_notification_email

router = APIRouter()

@router.post("/", response_model=ApplicationResponse)
def apply_for_internship(
    app_in: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.STUDENT]))
):
    # Check if internship exists
    internship = db.query(Internship).filter(Internship.id == app_in.internship_id).first()
    if not internship or not internship.is_active:
        raise HTTPException(status_code=404, detail="Internship opportunity is closed or invalid")

    # Check existing application
    existing = db.query(Application).filter(
        Application.student_id == current_user.id,
        Application.internship_id == app_in.internship_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted an application for this internship")

    application = Application(
        student_id=current_user.id,
        internship_id=app_in.internship_id,
        cover_letter=app_in.cover_letter,
        resume_url=app_in.resume_url or current_user.resume_url,
        status=ApplicationStatus.APPLIED
    )
    db.add(application)

    # In-app notification to student
    notification = Notification(
        user_id=current_user.id,
        title="Application Submitted",
        message=f"Your application for '{internship.title}' at {internship.company.company_name} was successfully received.",
        type="SUCCESS"
    )
    db.add(notification)
    db.commit()
    db.refresh(application)

    # Trigger background email notification
    background_tasks.add_task(
        send_notification_email,
        to_email=current_user.email,
        recipient_name=current_user.full_name,
        subject=f"Application Received: {internship.title}",
        title=f"Application Confirmation for {internship.title}",
        main_content=f"<p>Your application has been received by <strong>{internship.company.company_name}</strong>.</p><p><strong>Role:</strong> {internship.title}<br/><strong>Stipend:</strong> {internship.stipend}<br/><strong>Location:</strong> {internship.location}</p>",
        cta_text="Track Application Progress",
        cta_url=f"{settings.FRONTEND_URL}/student/applications"
    )

    return application

@router.get("/student/my-applications", response_model=List[ApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.STUDENT]))
):
    return db.query(Application).filter(Application.student_id == current_user.id).order_by(Application.created_at.desc()).all()

@router.get("/company/applicant-pipeline", response_model=List[ApplicationResponse])
def get_company_applicant_pipeline(
    internship_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    query = db.query(Application).join(Internship).filter(Internship.company_id == profile.id)
    if internship_id:
        query = query.filter(Application.internship_id == internship_id)
    if status and status != "ALL":
        query = query.filter(Application.status == status)

    return query.order_by(Application.updated_at.desc()).all()

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application_by_id(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY, UserRole.ADMIN]))
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = application.status
    application.status = status_update.status
    if status_update.feedback:
        application.feedback = status_update.feedback
    if status_update.offer_letter_url:
        application.offer_letter_url = status_update.offer_letter_url

    # Create Notification for Student
    notif_type = "OFFER" if status_update.status == ApplicationStatus.OFFER else "INFO"
    notif = Notification(
        user_id=application.student_id,
        title=f"Application Update: {application.internship.title}",
        message=f"Your application status changed from {old_status.value} to {status_update.status.value}.",
        type=notif_type
    )
    db.add(notif)
    db.commit()
    db.refresh(application)

    # Background Email Notification
    background_tasks.add_task(
        send_notification_email,
        to_email=application.student.email,
        recipient_name=application.student.full_name,
        subject=f"Status Update: {application.internship.title} ({status_update.status.value})",
        title=f"Application Status Updated to {status_update.status.value}",
        main_content=f"<p>The recruiting team at <strong>{application.internship.company.company_name}</strong> updated your application status.</p><p><strong>Position:</strong> {application.internship.title}<br/><strong>New Status:</strong> <span style='color: #818cf8; font-weight: bold;'>{status_update.status.value}</span></p>" + (f"<p><strong>Recruiter Notes:</strong> {status_update.feedback}</p>" if status_update.feedback else ""),
        cta_text="View Status Timeline",
        cta_url=f"{settings.FRONTEND_URL}/student/applications"
    )

    return application
