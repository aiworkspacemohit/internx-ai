import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger("internx_backend")

Base = declarative_base()

def create_db_engine():
    db_url = settings.DATABASE_URL
    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    
    try:
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            pool_pre_ping=True
        )
        # Verify connection
        with engine.connect() as conn:
            logger.info(f"Successfully connected to database: {db_url.split('@')[-1] if '@' in db_url else db_url}")
        return engine
    except Exception as e:
        logger.warning(f"Could not connect to configured DATABASE_URL ({e}). Falling back to local SQLite database.")
        sqlite_url = "sqlite:///./internx.db"
        return create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},
            pool_pre_ping=True
        )

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
