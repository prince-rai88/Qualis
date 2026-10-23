from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings
import logging

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
connect_args = {}

if "sqlite" in db_url:
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
    with engine.connect() as conn:
        logger.info("Successfully connected to PostgreSQL database: qualis_rca")
except Exception as e:
    logger.warning(f"Could not connect to configured DB ({e}). Falling back to local SQLite.")
    db_url = "sqlite:///./qualis_rca.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from backend.models import Investigation, AuditLog
    Base.metadata.create_all(bind=engine)
