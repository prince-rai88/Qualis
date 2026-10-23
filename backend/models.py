from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    deviation_number = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    product_name = Column(String(150), nullable=True)
    batch_number = Column(String(100), nullable=True, index=True)
    manufacturing_step = Column(String(150), nullable=True)
    equipment_id = Column(String(100), nullable=True)
    occurrence_date = Column(String(50), nullable=True)
    reported_by = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    severity = Column(String(20), default="Major") # Minor, Major, Critical
    status = Column(String(50), default="In Investigation") # Draft, In Investigation, Under Review, CAPA Approved, Closed

    # Narrative & Containment
    deviation_description = Column(Text, nullable=True)
    immediate_containment = Column(JSON, default=list) # List of containment actions taken

    # RCA Frameworks
    investigation_approach = Column(String(50), default="both") # 5_whys, fishbone, both
    fishbone_data = Column(JSON, default=dict) # 6Ms: Man, Machine, Material, Method, Measurement, Milieu
    five_whys_data = Column(JSON, default=list) # Progressive 5 Whys steps
    
    # Root Cause & Contributing Factors
    suspected_root_cause = Column(Text, nullable=True)
    contributing_factors = Column(JSON, default=list) # list of contributing factors
    
    # Regulatory & Audit Trail Compliance
    missing_evidence = Column(JSON, default=list) # Missing records / tests needed before closing
    capa_recommendations = Column(JSON, default=list) # Corrective & Preventive Action items
    
    # Human Review & Qualified Person Sign-Off
    investigator_notes = Column(Text, nullable=True)
    qp_signoff = Column(JSON, default=dict) # { "signed": False, "signer_name": "", "signed_at": "", "comments": "" }
    
    # Input source preservation
    raw_input_text = Column(Text, nullable=True)
    source_filename = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id", ondelete="CASCADE"), nullable=True)
    action = Column(String(100), nullable=False) # e.g. "CREATED", "AI_EXTRACTED", "FIELD_MODIFIED", "QP_SIGNED"
    actor = Column(String(100), default="Quality Professional")
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
