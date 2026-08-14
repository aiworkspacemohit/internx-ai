from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.ai import (
    ResumeReviewRequest, ResumeReviewResponse,
    InterviewPrepRequest, InterviewPrepResponse,
    CareerRoadmapRequest, CareerRoadmapResponse
)
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/resume-review", response_model=ResumeReviewResponse)
def review_resume(
    req: ResumeReviewRequest,
    current_user: User = Depends(get_current_user)
):
    if not req.resume_text or len(req.resume_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Please provide a valid resume text block to analyze.")
    result = AIService.review_resume(req.resume_text, req.target_role or "Software Engineer Intern")
    return result

@router.post("/interview-prep", response_model=InterviewPrepResponse)
def generate_interview_prep(
    req: InterviewPrepRequest,
    current_user: User = Depends(get_current_user)
):
    result = AIService.generate_interview_questions(req.role_title, req.tech_stack or "General Software Development")
    return result

@router.post("/career-roadmap", response_model=CareerRoadmapResponse)
def generate_career_roadmap(
    req: CareerRoadmapRequest,
    current_user: User = Depends(get_current_user)
):
    result = AIService.generate_career_roadmap(req.current_skills, req.target_role)
    return result
