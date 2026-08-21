import json
import logging
import warnings
warnings.filterwarnings("ignore")
from typing import Dict, Any, List
from app.core.config import settings

logger = logging.getLogger("ai_service")

class AIService:
    @staticmethod
    def _get_gemini_model():
        """
        Helper method to instantiate Gemini GenerativeModel with active key.
        Prefers gemini-3.6-flash, fallback to gemini-flash-latest.
        """
        if not settings.GEMINI_API_KEY:
            return None

        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        for model_name in ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash']:
            try:
                return genai.GenerativeModel(model_name)
            except Exception:
                continue
        return None

    @staticmethod
    def review_resume(resume_text: str, target_role: str) -> Dict[str, Any]:
        """
        Uses Gemini API to evaluate resume for target role.
        """
        model = AIService._get_gemini_model()
        if model:
            try:
                prompt = f"""
                Analyze the following resume text for the role of '{target_role}'.
                Respond strictly in valid JSON format with keys:
                - match_score: integer (0-100)
                - strengths: list of strings
                - improvements: list of strings
                - missing_keywords: list of strings
                - summary_verdict: string summary
                
                Resume Text:
                {resume_text}
                """
                response = model.generate_content(prompt)
                clean_json = response.text.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini API Resume Review Error: {e}")

        # Fallback Engine
        keywords = ["python", "react", "fastapi", "sql", "git", "rest api", "docker", "testing", "agile"]
        found_kw = [kw for kw in keywords if kw in resume_text.lower()]
        missing_kw = [kw for kw in keywords if kw not in resume_text.lower()]
        score = min(95, 60 + len(found_kw) * 4)

        return {
            "match_score": score,
            "strengths": [
                "Strong structure with clear experience sections.",
                f"Includes relevant technical competencies: {', '.join(found_kw[:3]) if found_kw else 'core programming'}.",
                "Clear bullet points describing contributions."
            ],
            "improvements": [
                "Quantify achievements using metrics (e.g. improved performance by 30%).",
                "Highlight target industry certifications or hackathon participation.",
                "Tailor summary objective specifically for the target role."
            ],
            "missing_keywords": missing_kw[:4] if missing_kw else ["Docker", "CI/CD", "PostgreSQL"],
            "summary_verdict": f"Solid resume tailored for {target_role}. Match score is {score}%. Addressing key improvements will boost callback rates."
        }

    @staticmethod
    def generate_interview_questions(role_title: str, tech_stack: str) -> Dict[str, Any]:
        """
        Generates technical and behavioral interview questions via Gemini.
        """
        model = AIService._get_gemini_model()
        if model:
            try:
                prompt = f"""
                Generate 5 interview questions with category and sample answers for position '{role_title}' with tech stack '{tech_stack}'.
                Return strictly JSON with key 'questions' containing list of objects with: question, category, sample_answer.
                """
                response = model.generate_content(prompt)
                clean_json = response.text.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini API Interview Questions Error: {e}")

        return {
            "questions": [
                {
                    "question": f"How do you optimize asynchronous API endpoints in {tech_stack.split(',')[0] if tech_stack else 'FastAPI'} under high concurrency?",
                    "category": "Technical",
                    "sample_answer": "By using async/await non-blocking I/O calls, database connection pooling, Redis caching, and delegating background tasks."
                },
                {
                    "question": "Can you explain state management patterns in modern web apps?",
                    "category": "Frontend Architecture",
                    "sample_answer": "Use global state for auth/theme state while retaining localized state for controlled inputs and ephemeral UI state."
                },
                {
                    "question": "Describe how you debug transaction deadlocks or concurrency bottlenecks.",
                    "category": "Database / Systems",
                    "sample_answer": "Check transaction isolation levels, use indexing on query keys, analyze query execution plans, and convert query loops to bulk operations."
                }
            ]
        }

    @staticmethod
    def generate_career_roadmap(current_skills: str, target_role: str) -> Dict[str, Any]:
        """
        Generates 3-month milestone roadmap for placement readiness.
        """
        model = AIService._get_gemini_model()
        if model:
            try:
                prompt = f"""
                Create a 3-month milestone career roadmap for a student with skills '{current_skills}' aiming for '{target_role}'.
                Return JSON with key 'target_role' and key 'roadmap' (list of milestone objects with week_or_month, focus_topic, action_items, recommended_projects).
                """
                response = model.generate_content(prompt)
                clean_json = response.text.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini API Career Roadmap Error: {e}")

        return {
            "target_role": target_role,
            "roadmap": [
                {
                    "week_or_month": "Month 1: Core Fundamentals & API Mastery",
                    "focus_topic": f"Strengthen core programming and framework skills for {target_role}.",
                    "action_items": [
                        "Master advanced data structures & algorithms.",
                        "Build RESTful APIs with JWT authentication.",
                        "Solve 30 targeted technical coding challenges."
                    ],
                    "recommended_projects": ["Full-stack Microservice with JWT Authentication"]
                },
                {
                    "week_or_month": "Month 2: Systems & Cloud Storage Integration",
                    "focus_topic": "Database optimization, background pipelines, and third-party APIs.",
                    "action_items": [
                        "Integrate relational databases with Alembic migrations.",
                        "Implement Cloudinary file storage & background email notifications.",
                        "Deploy containerized apps with Docker."
                    ],
                    "recommended_projects": ["Internship & Placement Cell Portal with RBAC"]
                },
                {
                    "week_or_month": "Month 3: Interview Preparation & Portfolio Polish",
                    "focus_topic": "Mock interviews, resume ATS optimization, and system design readiness.",
                    "action_items": [
                        "Conduct mock technical interview sessions.",
                        "Publish open-source projects on GitHub with full documentation.",
                        "Apply to top verified company opportunities on InternX AI."
                    ],
                    "recommended_projects": ["Production Deployment on Cloud Platforms"]
                }
            ]
        }

    @staticmethod
    def suggest_candidates(job_title: str, job_description: str, candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Uses Gemini API to match, score, and rank candidate applicants for a specific internship role.
        """
        model = AIService._get_gemini_model()
        if model and candidates:
            try:
                candidate_summaries = [
                    f"Candidate ID {c['id']} ({c['name']}): CGPA={c.get('cgpa','N/A')}, Skills={c.get('skills','')}, Bio={c.get('bio','')}"
                    for c in candidates
                ]
                prompt = f"""
                Rank the following candidate applicants for the position of '{job_title}'.
                Job Description: {job_description}

                Candidates:
                {chr(10).join(candidate_summaries)}

                Respond strictly in JSON format as a list of candidate ranking objects, each having:
                - candidate_id: integer
                - fit_score: integer (0 to 100)
                - match_reason: string summary explaining why candidate fits or lacks skills
                - key_highlights: list of matching skills
                """
                response = model.generate_content(prompt)
                clean_json = response.text.replace("```json", "").replace("```", "").strip()
                rankings = json.loads(clean_json)

                # Merge rankings back into candidates
                ranking_map = {r.get("candidate_id"): r for r in rankings if isinstance(r, dict)}
                scored = []
                for c in candidates:
                    match_data = ranking_map.get(c["id"], {})
                    scored.append({
                        **c,
                        "fit_score": match_data.get("fit_score", 75),
                        "match_reason": match_data.get("match_reason", "Matches primary requirements."),
                        "key_highlights": match_data.get("key_highlights", c.get("skills", "").split(","))
                    })
                scored.sort(key=lambda x: x.get("fit_score", 0), reverse=True)
                return scored
            except Exception as e:
                logger.error(f"Gemini Candidate Suggestion Error: {e}")

        # Fallback ranking logic based on skill keyword matching
        req_words = set(job_title.lower().split() + job_description.lower().split())
        scored = []
        for c in candidates:
            c_skills = [s.strip().lower() for s in c.get("skills", "").split(",") if s.strip()]
            matches = [s for s in c_skills if any(w in s for w in req_words)]
            base_score = 65 + min(30, len(matches) * 10)
            scored.append({
                **c,
                "fit_score": base_score,
                "match_reason": f"Strong background in {', '.join(c_skills[:3]) if c_skills else 'software development'}.",
                "key_highlights": c_skills[:4]
            })
        scored.sort(key=lambda x: x["fit_score"], reverse=True)
        return scored

    @staticmethod
    def chat_with_gemini(message: str, history: List[Dict[str, str]] = None, user_context: Dict[str, Any] = None) -> str:
        """
        Interactive placement cell AI assistant chatbot powered by Gemini.
        """
        model = AIService._get_gemini_model()
        
        user_name = user_context.get("name", "Student") if user_context else "Student"
        user_role = user_context.get("role", "STUDENT") if user_context else "STUDENT"
        
        system_instruction = f"""
        You are InternX AI Assistant, an expert campus placement advisor, career counselor, and recruiter helper.
        You are speaking with {user_name} (Role: {user_role}).
        Keep answers clear, encouraging, structured with bullet points when appropriate, and focused on internships, resume building, technical interview prep, and career growth.
        """

        if model:
            try:
                formatted_prompt = f"{system_instruction}\n\nUser Question: {message}"
                if history:
                    recent_hist = "\n".join([f"{h.get('sender','User')}: {h.get('text','')}" for h in history[-4:]])
                    formatted_prompt = f"{system_instruction}\n\nRecent Conversation History:\n{recent_hist}\n\nUser Question: {message}"

                response = model.generate_content(formatted_prompt)
                return response.text.strip()
            except Exception as e:
                logger.error(f"Gemini Chatbot Error: {e}")

        # Intelligent Fallback Response Engine
        msg_lower = message.lower()
        if "resume" in msg_lower:
            return f"Hi {user_name}! For a standout resume, keep it to 1 page, highlight metrics (e.g. 'Improved API response time by 40%'), and list top skills like Python, React, and SQL near the top. You can also upload your resume on the AI Hub for automated evaluation!"
        elif "interview" in msg_lower or "question" in msg_lower:
            return f"Great question, {user_name}! Preparation is key. Review core Data Structures, system design concepts for full-stack roles, and practice explaining your projects clearly using the STAR method (Situation, Task, Action, Result)."
        elif "apply" in msg_lower or "internship" in msg_lower:
            return f"You can explore all open opportunities in the Internship Portal. Filter by department or stipend, and ensure your profile picture and resume are uploaded for quick 1-click applications!"
        else:
            return f"Hello {user_name}! I'm your InternX AI assistant. Ask me anything about building your resume, preparing for technical interviews, tracking your applications, or finding top internship roles!"
