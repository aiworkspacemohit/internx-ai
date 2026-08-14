from pydantic import BaseModel
from typing import List, Dict, Any

class StudentAnalyticsResponse(BaseModel):
    total_applications: int
    shortlisted_count: int
    interviews_count: int
    offers_count: int
    response_rate_percent: float
    status_breakdown: Dict[str, int]

class CompanyAnalyticsResponse(BaseModel):
    total_postings: int
    total_applicants: int
    shortlisted_applicants: int
    scheduled_interviews: int
    offers_issued: int
    conversion_rate_percent: float

class OfficerAnalyticsResponse(BaseModel):
    total_students: int
    placed_students: int
    placement_rate_percent: float
    verified_companies: int
    total_opportunities: int
    department_wise_placements: List[Dict[str, Any]]
    top_hiring_companies: List[Dict[str, Any]]

class AdminAnalyticsResponse(BaseModel):
    total_users: int
    students_count: int
    companies_count: int
    officers_count: int
    pending_company_approvals: int
    active_internships: int
    system_health: str
