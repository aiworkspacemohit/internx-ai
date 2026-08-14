from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, companies, internships,
    applications, interviews, announcements,
    notifications, ai, analytics
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(internships.router, prefix="/internships", tags=["Internships"])
api_router.include_router(applications.router, prefix="/applications", tags=["Applications"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["Interviews"])
api_router.include_router(announcements.router, prefix="/announcements", tags=["Announcements"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Assistance"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
