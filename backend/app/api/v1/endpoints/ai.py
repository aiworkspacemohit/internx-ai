from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, RoleChecker
from app.models.user import User, UserRole
from app.models.internship import Internship
from app.schemas.ai import (
    ResumeReviewRequest, ResumeReviewResponse,
    InterviewPrepRequest, InterviewPrepResponse,
    CareerRoadmapRequest, CareerRoadmapResponse,
    ChatbotRequest, CandidateSuggestRequest
)
from app.services.ai_service import AIService
from app.services.cloudinary_service import CloudinaryService

router = APIRouter()

@router.post("/resume-review", response_model=ResumeReviewResponse)
def review_resume(
    req: ResumeReviewRequest,
    current_user: User = Depends(get_current_user)
):
    if not req.resume_text or len(req.resume_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Please provide valid resume text to analyze.")
    result = AIService.review_resume(req.resume_text, req.target_role or "Software Engineer Intern")
    return result

@router.post("/parse-resume")
def parse_uploaded_resume(
    file: UploadFile = File(...),
    target_role: str = "Software Engineer Intern",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Upload to Cloudinary and extract text
    upload_res = CloudinaryService.upload_resume(file, current_user.id)
    current_user.resume_url = upload_res["resume_url"]
    db.commit()

    text_content = upload_res["extracted_text"] or f"Resume document for {current_user.full_name}, skills: {current_user.skills or 'Software Development'}"
    ai_eval = AIService.review_resume(text_content, target_role)

    return {
        "message": "Resume parsed and evaluated by Gemini AI!",
        "resume_url": upload_res["resume_url"],
        "filename": upload_res["filename"],
        "evaluation": ai_eval
    }

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

@router.post("/suggest-candidates")
def suggest_candidates_for_job(
    req: CandidateSuggestRequest,
    current_user: User = Depends(RoleChecker([UserRole.COMPANY, UserRole.OFFICER, UserRole.ADMIN]))
):
    ranked = AIService.suggest_candidates(req.job_title, req.job_description, req.candidates)
    return {
        "job_title": req.job_title,
        "total_candidates": len(ranked),
        "ranked_candidates": ranked
    }

@router.post("/chatbot")
def chat_with_assistant(
    req: ChatbotRequest,
    current_user: User = Depends(get_current_user)
):
    user_context = {
        "name": current_user.full_name,
        "role": current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role),
        "department": current_user.department,
        "skills": current_user.skills
    }
    history_dicts = [{"sender": h.sender, "text": h.text} for h in req.history] if req.history else []
    reply = AIService.chat_with_gemini(req.message, history_dicts, user_context)
    return {
        "reply": reply,
        "sender": "InternX Gemini Assistant"
    }

@router.get("/recommendations")
def get_ai_job_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.STUDENT]))
):
    active_internships = db.query(Internship).filter(Internship.is_active == True).all()
    internship_list = [
        {
            "id": i.id,
            "title": i.title,
            "company_name": i.company.company_name if i.company else "Company",
            "required_skills": i.required_skills,
            "stipend": i.stipend,
            "location": i.location
        }
        for i in active_internships
    ]

    candidates_formatted = [{
        "id": current_user.id,
        "name": current_user.full_name,
        "skills": current_user.skills or "Python, Web Development",
        "bio": current_user.bio or ""
    }]

    recommended = []
    for item in internship_list:
        score_data = AIService.suggest_candidates(item["title"], item.get("required_skills", ""), candidates_formatted)
        score = score_data[0].get("fit_score", 80) if score_data else 80
        match_reason = score_data[0].get("match_reason", "Good skill alignment") if score_data else "Good alignment"
        recommended.append({
            **item,
            "match_score": score,
            "match_reason": match_reason
        })

    recommended.sort(key=lambda x: x["match_score"], reverse=True)
    return recommended
