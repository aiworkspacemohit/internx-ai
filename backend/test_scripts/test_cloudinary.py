import os
# pyrefly: ignore [missing-import]
import cloudinary
# pyrefly: ignore [missing-import]
import cloudinary.uploader
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def test_upload():
    print("Testing upload to Cloudinary...")
    try:
        # Uploads a sample image from the web to verify configuration
        response = cloudinary.uploader.upload(
            "https://cloudinary-devs.github.io/cld-docs-assets/assets/images/butterfly.jpeg",
            folder="internx_test"
        )
        print("[SUCCESS] Upload Successful!")
        print(f"Secure URL: {response.get('secure_url')}")
    except Exception as e:
        print("[ERROR] Upload Failed:", str(e))

if __name__ == "__main__":
    test_upload()