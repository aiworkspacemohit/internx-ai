import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAILS_FROM_EMAIL = os.getenv("EMAILS_FROM_EMAIL")
EMAILS_FROM_NAME = os.getenv("EMAILS_FROM_NAME", "InternX AI")

# Put your own recipient email here to verify receipt:
RECIPIENT_EMAIL = SMTP_USER 

def send_test_email():
    print(f"Connecting to {SMTP_SERVER}:{SMTP_PORT} as {SMTP_USER}...")

    if not SMTP_USER or not SMTP_PASSWORD:
        print("❌ Error: SMTP_USER or SMTP_PASSWORD is not set in your .env file.")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = " InternX AI SMTP Test Notification"
        msg["From"] = f"{EMAILS_FROM_NAME} <{EMAILS_FROM_EMAIL}>"
        msg["To"] = RECIPIENT_EMAIL

        html_body = """
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #4F46E5;">InternX AI Placement Portal</h2>
            <p>This is a test notification confirming that your <strong>Gmail SMTP setup</strong> is working correctly!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
            <p style="font-size: 12px; color: #666;">Status: Connected & Authenticated</p>
        </div>
        """
        msg.attach(MIMEText(html_body, "html"))

        # Connect, upgrade to TLS, authenticate, and send
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(EMAILS_FROM_EMAIL, RECIPIENT_EMAIL, msg.as_string())

        print(f" Email sent successfully to {RECIPIENT_EMAIL}!")
        print("👉 Check your Gmail inbox (and Spam/Promotions folder).")

    except smtplib.SMTPAuthenticationError:
        print("❌ SMTP Authentication Failed!")
        print("👉 Check your 16-character App Password. Ensure 2-Step Verification is ON and you removed all spaces.")
    except Exception as e:
        print("❌ Failed to send email:", str(e))

if __name__ == "__main__":
    send_test_email()