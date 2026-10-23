import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.config import settings
from backend.database import engine, Base, SessionLocal, init_db
from backend.models import Investigation, AuditLog
from backend.routes.investigations import router as investigations_router
from backend.routes.ai_rca import router as ai_router
from backend.sample_data.presets import PRESET_SCENARIOS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("qualis-rca")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB Tables
    logger.info("Initializing database tables...")
    init_db()

    # Seed initial sample investigations if table is empty
    db = SessionLocal()
    try:
        count = db.query(Investigation).count()
        if count == 0:
            logger.info("Database empty; seeding 3 realistic API Pharma RCA investigations...")
            for preset in PRESET_SCENARIOS:
                mock = preset["mock_analysis"]
                extracted = mock["extracted_fields"]
                inv = Investigation(
                    deviation_number=extracted["deviation_number"],
                    title=extracted["title"],
                    product_name=extracted["product_name"],
                    batch_number=extracted["batch_number"],
                    manufacturing_step=extracted["manufacturing_step"],
                    equipment_id=extracted["equipment_id"],
                    occurrence_date=extracted["occurrence_date"],
                    reported_by=extracted["reported_by"],
                    department=extracted["department"],
                    severity=extracted["severity"],
                    status="In Investigation" if preset["id"] == "atorvastatin-crystallization" else "Under Review",
                    deviation_description=extracted["deviation_description"],
                    immediate_containment=extracted["immediate_containment"],
                    investigation_approach="both",
                    fishbone_data=mock["fishbone"],
                    five_whys_data=mock["five_whys"],
                    suspected_root_cause=mock["suspected_root_cause"],
                    contributing_factors=mock["contributing_factors"],
                    missing_evidence=mock["missing_evidence"],
                    capa_recommendations=mock["capa_recommendations"],
                    investigator_notes=f"Auto-seeded from API manufacturing baseline scenario: {preset['name']}",
                    qp_signoff={"signed": False, "signer_name": "", "comments": ""},
                    raw_input_text=preset["raw_text"],
                    source_filename=f"{preset['id']}_report.txt"
                )
                db.add(inv)
            db.commit()
            logger.info("Seeded 3 investigations successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

    yield
    logger.info("Shutting down Qualis RCA API server...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="cGMP-Compliant AI Root Cause Analysis (RCA) & CAPA Module for API Manufacturers",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(investigations_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": str(engine.url).split("@")[-1] if "@" in str(engine.url) else str(engine.url)
    }
