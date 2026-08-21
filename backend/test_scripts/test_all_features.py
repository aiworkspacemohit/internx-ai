import os
import sys
import json
import logging
import warnings
warnings.filterwarnings("ignore")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from dotenv import load_dotenv
load_dotenv()

from app.core.config import settings
from app.services.cloudinary_service import CloudinaryService
from app.services.ai_service import AIService
from app.services.email_service import send_otp_email, send_notification_email

logging.basicConfig(level=logging.INFO)

def test_gemini_integration():
    print("\n--- 1. Testing Gemini AI Integrations ---")
    print(f"Using GEMINI_API_KEY: {'[SET]' if settings.GEMINI_API_KEY else '[MISSING]'}")

    # Resume Review
    print("\n[A] Testing AIService.review_resume...")
    review = AIService.review_resume(
        resume_text="Experienced Python software engineering student with expertise in FastAPI, React, SQL, and Git. Built web applications.",
        target_role="Full Stack Developer Intern"
    )
    print(f"Resume Review Match Score: {review.get('match_score')}%")
    print(f"Summary: {review.get('summary_verdict')}")

    # Chatbot
    print("\n[B] Testing AIService.chat_with_gemini...")
    reply = AIService.chat_with_gemini(
        message="What are top 3 tips for cracking a backend engineering internship interview?",
        user_context={"name": "Alex", "role": "STUDENT"}
    )
    print(f"Gemini Chatbot Response:\n{reply}\n")

    # Candidate Suggestion
    print("\n[C] Testing AIService.suggest_candidates...")
    candidates = [
        {"id": 1, "name": "Alice", "skills": "Python, FastAPI, SQL, Docker", "cgpa": "3.9"},
        {"id": 2, "name": "Bob", "skills": "HTML, CSS", "cgpa": "3.0"}
    ]
    ranked = AIService.suggest_candidates("Backend Intern", "Requires Python, FastAPI, and SQL experience.", candidates)
    print(f"Ranked Candidates: {json.dumps(ranked, indent=2)}")

def test_cloudinary_configuration():
    print("\n--- 2. Testing Cloudinary Credentials ---")
    print(f"Cloud Name: {settings.CLOUDINARY_CLOUD_NAME}")
    print(f"Configured: {CloudinaryService.is_configured()}")
    if CloudinaryService.is_configured():
        print("[SUCCESS] Cloudinary credentials loaded correctly.")
    else:
        print("[ERROR] Cloudinary credentials missing in .env.")

def test_gmail_otp_dispatch():
    print("\n--- 3. Testing Gmail OTP & Email Service ---")
    print(f"SMTP Server: {settings.SMTP_SERVER}:{settings.SMTP_PORT}")
    print(f"SMTP User: {settings.SMTP_USER}")
    
    test_email = settings.SMTP_USER or "aiworkspacemohit@gmail.com"
    print(f"Sending test 6-digit OTP code to {test_email}...")
    try:
        send_otp_email(test_email, "Test Student", "849201")
        print(f"[SUCCESS] OTP email function executed cleanly for {test_email}.")
    except Exception as e:
        print(f"[ERROR] Failed to send OTP email: {e}")

if __name__ == "__main__":
    test_cloudinary_configuration()
    test_gemini_integration()
    test_gmail_otp_dispatch()
