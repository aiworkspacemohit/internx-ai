from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user, RoleChecker
from app.models.user import User, UserRole
from app.models.company import CompanyProfile
from app.models.application import Application, ApplicationStatus
from app.models.interview import Interview
from app.models.notification import Notification
from app.schemas.interview import InterviewCreate, InterviewUpdate, InterviewResponse
from app.services.email_service import send_notification_email

router = APIRouter()

@router.post("/", response_model=InterviewResponse)
def schedule_interview(
    interview_in: InterviewCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    application = db.query(Application).filter(Application.id == interview_in.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    interview = Interview(
        application_id=interview_in.application_id,
        round_name=interview_in.round_name,
        scheduled_at=interview_in.scheduled_at,
        duration_minutes=interview_in.duration_minutes,
        meeting_link=interview_in.meeting_link,
        interviewer_name=interview_in.interviewer_name,
        notes=interview_in.notes,
        status="SCHEDULED"
    )
    db.add(interview)

    # Automatically advance application status to INTERVIEW_ROUND if lower
    if application.status not in [ApplicationStatus.INTERVIEW_ROUND, ApplicationStatus.HR_ROUND, ApplicationStatus.OFFER]:
        application.status = ApplicationStatus.INTERVIEW_ROUND

    # Notify student in-app
    notif = Notification(
        user_id=application.student_id,
        title=f"Interview Scheduled: {interview_in.round_name}",
        message=f"An interview round '{interview_in.round_name}' for {application.internship.title} has been scheduled for {interview_in.scheduled_at.strftime('%b %d, %Y at %I:%M %p')}.",
        type="INTERVIEW"
    )
    db.add(notif)
    db.commit()
    db.refresh(interview)

    # Trigger background email invitation
    background_tasks.add_task(
        send_notification_email,
        to_email=application.student.email,
        recipient_name=application.student.full_name,
        subject=f"Interview Invitation: {application.internship.title}",
        title=f"You have been invited to an Interview Round!",
        main_content=f"<p><strong>Company:</strong> {application.internship.company.company_name}<br/><strong>Position:</strong> {application.internship.title}<br/><strong>Round:</strong> {interview_in.round_name}<br/><strong>Date & Time:</strong> {interview_in.scheduled_at.strftime('%B %d, %Y at %I:%M %p')}<br/><strong>Duration:</strong> {interview_in.duration_minutes} minutes</p>" + (f"<p><strong>Meeting Room Link:</strong> <a href='{interview_in.meeting_link}' style='color:#818cf8;'>{interview_in.meeting_link}</a></p>" if interview_in.meeting_link else ""),
        cta_text="View Interview Calendar",
        cta_url=f"{settings.FRONTEND_URL}/student/calendar"
    )

    return interview

@router.get("/student/my-interviews", response_model=List[InterviewResponse])
def get_student_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.STUDENT]))
):
    return db.query(Interview).join(Application).filter(Application.student_id == current_user.id).order_by(Interview.scheduled_at.asc()).all()

@router.get("/company/scheduled-interviews", response_model=List[InterviewResponse])
def get_company_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.COMPANY]))
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    return db.query(Interview).join(Application).join(Application.internship).filter(Application.internship.has(company_id=profile.id)).order_by(Interview.scheduled_at.asc()).all()
