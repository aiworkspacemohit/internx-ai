from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.application import Application, ApplicationStatus
from app.models.interview import Interview
from app.models.announcement import Announcement
from app.models.notification import Notification

def init_db(db: Session) -> None:
    # 1. Seed System Admin
    admin = db.query(User).filter(User.email == "admin@internx.ai").first()
    if not admin:
        admin = User(
            email="admin@internx.ai",
            password_hash=get_password_hash("Admin@123"),
            full_name="Prof. Rajesh Sharma (System Administrator)",
            role=UserRole.ADMIN,
            department="Placement Administration Cell",
            phone="+91 98765 43210"
        )
        db.add(admin)
        db.commit()

    # 2. Seed Placement Officer
    officer = db.query(User).filter(User.email == "officer@university.edu").first()
    if not officer:
        officer = User(
            email="officer@university.edu",
            password_hash=get_password_hash("Officer@123"),
            full_name="Dr. Ananya Iyer",
            role=UserRole.OFFICER,
            department="Computer Science & Engineering",
            phone="+91 91234 56789"
        )
        db.add(officer)
        db.commit()

    # 3. Seed Companies
    c1_user = db.query(User).filter(User.email == "recruiter@google.com").first()
    if not c1_user:
        c1_user = User(
            email="recruiter@google.com",
            password_hash=get_password_hash("Company@123"),
            full_name="Vikram Malhotra (Google India University Recruiting)",
            role=UserRole.COMPANY
        )
        db.add(c1_user)
        db.commit()
        db.refresh(c1_user)

        c1_profile = CompanyProfile(
            user_id=c1_user.id,
            company_name="Google India",
            industry="Technology & Cloud",
            website="https://careers.google.com",
            location="Bangalore, Karnataka (Hybrid)",
            description="Google LLC is an American multinational technology company focusing on artificial intelligence, search engine technology, cloud computing, and computer software.",
            logo_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
            is_approved=True,
            verification_status="APPROVED",
            contact_person="Vikram Malhotra",
            contact_email="recruiter@google.com"
        )
        db.add(c1_profile)
        db.commit()
        db.refresh(c1_profile)

        # Post Internships for Google India
        job1 = Internship(
            company_id=c1_profile.id,
            title="Software Engineering Intern - Summer 2026",
            role_category="Full Stack",
            description="Join Google's core engineering team in Bangalore to build scalable cloud infrastructure, backend microservices, and modern frontend interfaces using Python, Go, React, and Kubernetes.",
            requirements="Python, C++, React, Data Structures & Algorithms, Git, System Design basics",
            stipend="₹45,000/month + Accommodation Allowance",
            location="Bangalore, Karnataka (Hybrid)",
            duration="12 Weeks",
            openings=5,
            deadline=datetime.now(timezone.utc) + timedelta(days=30)
        )
        job2 = Internship(
            company_id=c1_profile.id,
            title="AI & Machine Learning Research Intern",
            role_category="AI/ML",
            description="Work alongside Google DeepMind research scientists on multimodal Gemini architectures, LLM fine-tuning pipelines, and high-throughput evaluation models.",
            requirements="Python, PyTorch, TensorFlow, NLP, Linear Algebra, Multimodal AI experience",
            stipend="₹55,000/month",
            location="Bangalore / Remote",
            duration="16 Weeks",
            openings=3,
            deadline=datetime.now(timezone.utc) + timedelta(days=45)
        )
        db.add_all([job1, job2])
        db.commit()

    c2_user = db.query(User).filter(User.email == "recruiter@stripe.com").first()
    if not c2_user:
        c2_user = User(
            email="recruiter@stripe.com",
            password_hash=get_password_hash("Company@123"),
            full_name="Pooja Sharma (Stripe India Tech Recruiting)",
            role=UserRole.COMPANY
        )
        db.add(c2_user)
        db.commit()
        db.refresh(c2_user)

        c2_profile = CompanyProfile(
            user_id=c2_user.id,
            company_name="Stripe India",
            industry="Fintech & Payments",
            website="https://stripe.com",
            location="Hyderabad, Telangana (Remote)",
            description="Stripe builds financial infrastructure for the internet. Businesses of every size use our software to accept payments and manage their businesses online.",
            logo_url="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
            is_approved=True,
            verification_status="APPROVED",
            contact_person="Pooja Sharma",
            contact_email="recruiter@stripe.com"
        )
        db.add(c2_profile)
        db.commit()
        db.refresh(c2_profile)

        job3 = Internship(
            company_id=c2_profile.id,
            title="Backend Systems Intern (FastAPI / Go)",
            role_category="Backend",
            description="Build high-performance microservices processing millions of daily API requests securely with sub-50ms latency.",
            requirements="FastAPI, Python, SQL, Redis, Distributed Systems",
            stipend="₹40,000/month",
            location="Remote",
            duration="12 Weeks",
            openings=4,
            deadline=datetime.now(timezone.utc) + timedelta(days=20)
        )
        db.add(job3)
        db.commit()

    # Pending company request for Admin/Officer approval demonstration
    c3_user = db.query(User).filter(User.email == "hiring@quantum-ai.io").first()
    if not c3_user:
        c3_user = User(
            email="hiring@quantum-ai.io",
            password_hash=get_password_hash("Company@123"),
            full_name="Dr. Suresh Pillai",
            role=UserRole.COMPANY
        )
        db.add(c3_user)
        db.commit()
        db.refresh(c3_user)

        c3_profile = CompanyProfile(
            user_id=c3_user.id,
            company_name="Quantum AI Labs India",
            industry="Quantum Computing & AI",
            website="https://quantum-ai.io",
            location="Pune, Maharashtra",
            description="Cutting-edge research laboratory pioneering quantum machine learning algorithms.",
            logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
            is_approved=False,
            verification_status="PENDING",
            contact_person="Dr. Suresh Pillai",
            contact_email="hiring@quantum-ai.io"
        )
        db.add(c3_profile)
        db.commit()

    # 4. Seed Student Accounts & Applications
    student = db.query(User).filter(User.email == "aarav.sharma@gmail.com").first()
    if not student:
        student = User(
            email="aarav.sharma@gmail.com",
            password_hash=get_password_hash("Student@123"),
            full_name="Aarav Sharma",
            role=UserRole.STUDENT,
            phone="+91 98200 11223",
            department="Computer Science",
            cgpa="8.95 / 10.0",
            skills="Python, React, FastAPI, SQL, Tailwind CSS, Git, PyTorch",
            bio="Passionate 3rd-year CS student specializing in full-stack web applications and machine learning integrations.",
            github_url="https://github.com/aaravsharma-dev",
            linkedin_url="https://linkedin.com/in/aaravsharma-cs"
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        # Create demo application for Aarav
        first_job = db.query(Internship).first()
        if first_job:
            app1 = Application(
                student_id=student.id,
                internship_id=first_job.id,
                cover_letter="I am extremely excited to apply for the Software Engineering Internship at Google India. My experience building production FastAPI microservices and React frontends aligns directly with your engineering requirements.",
                resume_url="https://cloudinary.com/demo/aarav_sharma_resume.pdf",
                status=ApplicationStatus.INTERVIEW_ROUND,
                feedback="Candidate performed exceptionally in the initial code challenge."
            )
            db.add(app1)
            db.commit()
            db.refresh(app1)

            # Schedule an interview for Aarav
            interview1 = Interview(
                application_id=app1.id,
                round_name="Technical Round 1 - Data Structures & System Design",
                scheduled_at=datetime.now(timezone.utc) + timedelta(days=2, hours=4),
                duration_minutes=60,
                meeting_link="https://meet.google.com/internx-tech-interview-demo",
                interviewer_name="Rohan Deshmukh (Senior Tech Lead)",
                notes="Focus on algorithm complexity, REST API design, and SQL indexing.",
                status="SCHEDULED"
            )
            db.add(interview1)

            # Notifications
            n1 = Notification(
                user_id=student.id,
                title="Interview Scheduled!",
                message=f"Google India scheduled your 'Technical Round 1' interview for {interview1.scheduled_at.strftime('%b %d at %I:%M %p')}.",
                type="INTERVIEW"
            )
            db.add(n1)
            db.commit()

    # Seed placement announcements
    ann = db.query(Announcement).first()
    if not ann:
        a1 = Announcement(
            author_id=officer.id,
            title="Important: Summer 2026 Campus Placement Registration Deadline",
            content="All final-year and pre-final-year students must update their verified resume, CGPA, and portfolio links in the InternX AI portal before August 30th to qualify for upcoming drive referrals.",
            target_department="ALL",
            priority="HIGH"
        )
        a2 = Announcement(
            author_id=officer.id,
            title="Google India & Stripe Campus Recruitment Drive Announced",
            content="Google India and Stripe have officially opened applications on InternX AI for Summer 2026 roles. Apply through your student dashboard to submit verified resumes.",
            target_department="Computer Science",
            priority="URGENT"
        )
        db.add_all([a1, a2])
        db.commit()
