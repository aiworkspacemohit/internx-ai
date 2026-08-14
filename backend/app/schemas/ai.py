from pydantic import BaseModel
from typing import Optional, List

class ResumeReviewRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Software Engineer Intern"

class ResumeReviewResponse(BaseModel):
    match_score: int
    strengths: List[str]
    improvements: List[str]
    missing_keywords: List[str]
    summary_verdict: str

class InterviewPrepRequest(BaseModel):
    role_title: str
    experience_level: Optional[str] = "Internship / Entry Level"
    tech_stack: Optional[str] = "Python, React, FastAPI, SQL"

class QuestionItem(BaseModel):
    question: str
    category: str # Technical, Behavioral, System Design
    sample_answer: str

class InterviewPrepResponse(BaseModel):
    questions: List[QuestionItem]

class CareerRoadmapRequest(BaseModel):
    current_skills: str
    target_role: str
    timeline_months: Optional[int] = 3

class MilestoneItem(BaseModel):
    week_or_month: str
    focus_topic: str
    action_items: List[str]
    recommended_projects: List[str]

class CareerRoadmapResponse(BaseModel):
    target_role: str
    roadmap: List[MilestoneItem]
