from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class ContainmentAction(BaseModel):
    id: Optional[str] = None
    description: str
    action_type: Optional[str] = "Immediate Containment" # e.g. Quarantine, Sample Retention, Line Stop
    taken_by: Optional[str] = "Operations Supervisor"
    timestamp: Optional[str] = None
    verified: Optional[bool] = True

class FishboneCause(BaseModel):
    id: str
    text: str
    likelihood: str = "Medium" # High, Medium, Low, Ruled Out
    is_contributing: bool = False
    is_root_cause: bool = False
    evidence: Optional[str] = ""
    ai_suggested: bool = True
    investigator_confirmed: bool = False

class FishboneStructure(BaseModel):
    man: List[FishboneCause] = []
    machine: List[FishboneCause] = []
    material: List[FishboneCause] = []
    method: List[FishboneCause] = []
    measurement: List[FishboneCause] = []
    milieu: List[FishboneCause] = []

class FiveWhysStep(BaseModel):
    step: int
    question: str
    answer: str
    evidence: Optional[str] = ""
    is_root_cause: bool = False
    confidence: Optional[float] = 0.85
    confirmed: bool = False

class MissingEvidenceItem(BaseModel):
    id: str
    item: str
    rationale: str
    source_department: Optional[str] = "QC Analytical / Maintenance"
    priority: str = "High" # Critical, High, Medium, Low
    status: str = "Pending" # Pending, Provided, Waived

class CAPAItem(BaseModel):
    id: str
    capa_type: str = "Corrective" # Corrective vs Preventive
    title: str
    description: str
    root_cause_addressed: Optional[str] = ""
    owner: str = "Process Engineering Lead"
    target_date: Optional[str] = None
    effectiveness_criteria: str
    status: str = "Proposed" # Proposed, Approved, In Progress, Verified
    ai_suggested: bool = True
    confirmed: bool = False

class QPSignoff(BaseModel):
    signed: bool = False
    signer_name: Optional[str] = ""
    signer_role: Optional[str] = "Qualified Person / QA Lead"
    signed_at: Optional[str] = None
    comments: Optional[str] = ""

class ExtractedFormFields(BaseModel):
    deviation_number: Optional[str] = None
    title: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturing_step: Optional[str] = None
    equipment_id: Optional[str] = None
    occurrence_date: Optional[str] = None
    reported_by: Optional[str] = None
    department: Optional[str] = None
    severity: Optional[str] = "Major"
    deviation_description: Optional[str] = None
    immediate_containment: List[ContainmentAction] = []
    confidence_scores: Dict[str, float] = {}
    evidence_citations: Dict[str, str] = {}

class InvestigationBase(BaseModel):
    deviation_number: str
    title: str
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturing_step: Optional[str] = None
    equipment_id: Optional[str] = None
    occurrence_date: Optional[str] = None
    reported_by: Optional[str] = None
    department: Optional[str] = None
    severity: str = "Major"
    status: str = "In Investigation"
    deviation_description: Optional[str] = None
    immediate_containment: List[Dict[str, Any]] = []
    investigation_approach: str = "both"
    fishbone_data: Dict[str, Any] = {}
    five_whys_data: List[Dict[str, Any]] = []
    suspected_root_cause: Optional[str] = None
    contributing_factors: List[str] = []
    missing_evidence: List[Dict[str, Any]] = []
    capa_recommendations: List[Dict[str, Any]] = []
    investigator_notes: Optional[str] = None
    qp_signoff: Dict[str, Any] = {}
    raw_input_text: Optional[str] = None
    source_filename: Optional[str] = None

class InvestigationCreate(InvestigationBase):
    pass

class InvestigationUpdate(BaseModel):
    title: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturing_step: Optional[str] = None
    equipment_id: Optional[str] = None
    occurrence_date: Optional[str] = None
    reported_by: Optional[str] = None
    department: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    deviation_description: Optional[str] = None
    immediate_containment: Optional[List[Dict[str, Any]]] = None
    investigation_approach: Optional[str] = None
    fishbone_data: Optional[Dict[str, Any]] = None
    five_whys_data: Optional[List[Dict[str, Any]]] = None
    suspected_root_cause: Optional[str] = None
    contributing_factors: Optional[List[str]] = None
    missing_evidence: Optional[List[Dict[str, Any]]] = None
    capa_recommendations: Optional[List[Dict[str, Any]]] = None
    investigator_notes: Optional[str] = None
    qp_signoff: Optional[Dict[str, Any]] = None

class InvestigationOut(InvestigationBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class IntakeRequest(BaseModel):
    raw_text: str
    source_type: str = "text" # pdf, text, email
    filename: Optional[str] = None
    api_key_override: Optional[str] = None

class AIWorkflowResponse(BaseModel):
    extracted_fields: ExtractedFormFields
    fishbone: Dict[str, List[Dict[str, Any]]]
    five_whys: List[Dict[str, Any]]
    suspected_root_cause: str
    contributing_factors: List[str]
    missing_evidence: List[Dict[str, Any]]
    capa_recommendations: List[Dict[str, Any]]
    reasoning_summary: str
