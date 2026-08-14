import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger("email_service")

def generate_html_template(title: str, recipient_name: str, main_content: str, cta_text: str = "View Dashboard", cta_url: str = None) -> str:
    action_url = cta_url or settings.FRONTEND_URL
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 16px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        .header {{ background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: center; }}
        .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }}
        .content {{ padding: 32px 24px; line-height: 1.6; font-size: 15px; color: #cbd5e1; }}
        .greeting {{ font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 16px; }}
        .card-box {{ background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 20px; margin: 20px 0; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); }}
        .footer {{ background-color: #0b0f19; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1f2937; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>InternX AI • Placement Portal</h1>
        </div>
        <div class="content">
          <div class="greeting">Hi {recipient_name},</div>
          <p>{title}</p>
          <div class="card-box">
            {main_content}
          </div>
          <div style="text-align: center;">
            <a href="{action_url}" class="btn">{cta_text}</a>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 InternX AI Management Platform. All rights reserved.</p>
          <p>Automated notification email from university placement cell.</p>
        </div>
      </div>
    </body>
    </html>
    """

def send_notification_email(to_email: str, recipient_name: str, subject: str, title: str, main_content: str, cta_text: str = "Go to Dashboard", cta_url: str = None):
    """
    Sends background email notifications via SMTP, or logs structured simulated email if SMTP is inactive.
    """
    if not settings.ENABLE_EMAIL_NOTIFICATIONS:
        logger.info(f"[EMAIL NOTIFICATIONS DISABLED] Skipped email to {to_email}")
        return

    html_body = generate_html_template(title, recipient_name, main_content, cta_text, cta_url)

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.info(f"==================================================")
        logger.info(f"[SIMULATED EMAIL NOTIFICATION SENT]")
        logger.info(f"To: {to_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Title: {title}")
        logger.info(f"Action Link: {cta_url or settings.FRONTEND_URL}")
        logger.info(f"==================================================")
        return

    try:
        msg = MIMEMultipart()
        sender_name = settings.EMAILS_FROM_NAME or "InternX AI Placement Cell"
        sender_email = settings.EMAILS_FROM_EMAIL or settings.SMTP_USER
        msg["From"] = f"{sender_name} <{sender_email}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html"))

        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"Successfully delivered email notification to {to_email}")
    except Exception as e:
        logger.error(f"Failed to deliver email to {to_email}: {e}")
