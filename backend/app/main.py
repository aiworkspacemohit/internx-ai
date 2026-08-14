import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1.api import api_router
from app.db.init_db import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("internx_backend")

# Automatically create tables if not existing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="InternX AI - End-to-End AI-Powered Placement and Internship Management System API"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    logger.info("Initializing InternX AI Database and default admin accounts...")
    db = SessionLocal()
    try:
        init_db(db)
        logger.info("Database initialized & seeded successfully!")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "Online & Healthy",
        "docs": "/docs",
        "version": "1.0.0"
    }

app.include_router(api_router, prefix=settings.API_V1_STR)
