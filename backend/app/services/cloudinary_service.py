import os
import logging
from typing import Dict, Any, Optional
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.core.config import settings

logger = logging.getLogger("cloudinary_service")

# Configure Cloudinary globally if credentials are available
if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )

class CloudinaryService:
    @staticmethod
    def is_configured() -> bool:
        return bool(
            settings.CLOUDINARY_CLOUD_NAME and 
            settings.CLOUDINARY_API_KEY and 
            settings.CLOUDINARY_API_SECRET
        )

    @staticmethod
    def upload_profile_picture(file: UploadFile, user_id: int) -> str:
        """
        Uploads avatar image to Cloudinary folder 'internx_avatars' and returns secure URL.
        """
        if not CloudinaryService.is_configured():
            raise HTTPException(status_code=500, detail="Cloudinary credentials are not configured in backend environment.")

        try:
            filename = f"avatar_user_{user_id}_{file.filename}"
            upload_result = cloudinary.uploader.upload(
                file.file,
                folder="internx_avatars",
                public_id=filename.split(".")[0],
                resource_type="image",
                overwrite=True
            )
            secure_url = upload_result.get("secure_url")
            logger.info(f"Successfully uploaded avatar for user {user_id} to Cloudinary: {secure_url}")
            return secure_url
        except Exception as e:
            logger.error(f"Cloudinary Avatar Upload Error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to upload profile picture: {str(e)}")

    @staticmethod
    def upload_resume(file: UploadFile, user_id: int) -> Dict[str, Any]:
        """
        Uploads resume document (PDF/DOCX/TXT) to Cloudinary folder 'internx_resumes'.
        Returns dictionary with 'resume_url', 'filename', and 'extracted_text'.
        """
        if not CloudinaryService.is_configured():
            raise HTTPException(status_code=500, detail="Cloudinary credentials are not configured in backend environment.")

        try:
            file_bytes = file.file.read()

            extracted_text = ""
            file_type = file.content_type or file.filename.lower()

            if "pdf" in file_type:
                try:
                    import io
                    import pypdf
                    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                    extracted_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
                except Exception as pdf_err:
                    logger.warning(f"Could not extract PDF text using pypdf: {pdf_err}")
            
            if not extracted_text:
                try:
                    extracted_text = file_bytes.decode("utf-8", errors="ignore")
                except Exception:
                    extracted_text = ""

            file.file.seek(0)
            filename = f"resume_user_{user_id}_{file.filename}"
            
            upload_result = cloudinary.uploader.upload(
                file.file,
                folder="internx_resumes",
                resource_type="raw",
                public_id=filename.split(".")[0],
                overwrite=True
            )

            secure_url = upload_result.get("secure_url")
            logger.info(f"Successfully uploaded resume for user {user_id} to Cloudinary: {secure_url}")

            return {
                "resume_url": secure_url,
                "filename": file.filename,
                "extracted_text": extracted_text.strip()
            }
        except Exception as e:
            logger.error(f"Cloudinary Resume Upload Error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to upload resume document: {str(e)}")
