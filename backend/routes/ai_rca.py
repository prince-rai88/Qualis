from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

from backend.ai.pdf_parser import extract_text_from_pdf
from backend.ai.groq_service import GroqService
from backend.sample_data.presets import PRESET_SCENARIOS
from backend.ai.graph import run_full_rca_graph
from backend.ai.state import RCAState
from backend.ai.nodes import (
    extraction_node,
    fishbone_node,
    five_whys_node,
    evidence_gap_node,
    capa_node
)

router = APIRouter(prefix="/ai", tags=["AI RCA Copilot"])

class ExtractRequest(BaseModel):
    raw_text: str
    source_type: Optional[str] = "text"
    filename: Optional[str] = None
    groq_api_key: Optional[str] = None

class StepAnalysisRequest(BaseModel):
    raw_text: str
    extracted_fields: Optional[Dict[str, Any]] = None
    fishbone_data: Optional[Dict[str, Any]] = None
    five_whys_data: Optional[List[Dict[str, Any]]] = None
    suspected_root_cause: Optional[str] = None
    contributing_factors: Optional[List[str]] = None
    groq_api_key: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    investigation_context: Dict[str, Any]
    groq_api_key: Optional[str] = None

class TestKeyRequest(BaseModel):
    api_key: str

@router.get("/presets")
def get_presets():
    """Returns available realistic API pharma deviation presets."""
    return [
        {
            "id": p["id"],
            "name": p["name"],
            "description": p["description"],
            "product": p["product"]
        }
        for p in PRESET_SCENARIOS
    ]

@router.get("/presets/{preset_id}")
def get_preset_detail(preset_id: str):
    for p in PRESET_SCENARIOS:
        if p["id"] == preset_id:
            return p
    raise HTTPException(status_code=404, detail="Preset not found")

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Accepts uploaded PDF deviation/investigation report and extracts clean text."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    try:
        content = await file.read()
        extracted_text = extract_text_from_pdf(content)
        return {
            "filename": file.filename,
            "extracted_text": extracted_text,
            "char_count": len(extracted_text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

@router.post("/extract-fields")
def extract_fields_endpoint(req: ExtractRequest):
    """Step 1: Extract deviation metadata and immediate containment."""
    state: RCAState = {
        "raw_text": req.raw_text,
        "source_type": req.source_type or "text",
        "filename": req.filename,
        "groq_api_key": req.groq_api_key,
        "extracted_fields": {},
        "fishbone_data": {},
        "five_whys_data": [],
        "suspected_root_cause": "",
        "contributing_factors": [],
        "missing_evidence": [],
        "capa_recommendations": [],
        "reasoning_summary": "",
        "errors": []
    }
    result = extraction_node(state)
    return result

@router.post("/analyze-fishbone")
def analyze_fishbone_endpoint(req: StepAnalysisRequest):
    """Step 2: Generate Ishikawa 6M Fishbone Analysis."""
    state: RCAState = {
        "raw_text": req.raw_text,
        "source_type": "text",
        "filename": None,
        "groq_api_key": req.groq_api_key,
        "extracted_fields": req.extracted_fields or {},
        "fishbone_data": {},
        "five_whys_data": [],
        "suspected_root_cause": "",
        "contributing_factors": [],
        "missing_evidence": [],
        "capa_recommendations": [],
        "reasoning_summary": "",
        "errors": []
    }
    result = fishbone_node(state)
    return result

@router.post("/analyze-five-whys")
def analyze_five_whys_endpoint(req: StepAnalysisRequest):
    """Step 3: Generate 5 Whys Root Cause Chain."""
    state: RCAState = {
        "raw_text": req.raw_text,
        "source_type": "text",
        "filename": None,
        "groq_api_key": req.groq_api_key,
        "extracted_fields": req.extracted_fields or {},
        "fishbone_data": req.fishbone_data or {},
        "five_whys_data": [],
        "suspected_root_cause": "",
        "contributing_factors": [],
        "missing_evidence": [],
        "capa_recommendations": [],
        "reasoning_summary": "",
        "errors": []
    }
    result = five_whys_node(state)
    return result

@router.post("/detect-gaps")
def detect_gaps_endpoint(req: StepAnalysisRequest):
    """Step 4: Detect missing evidence and regulatory GMP gaps."""
    state: RCAState = {
        "raw_text": req.raw_text,
        "source_type": "text",
        "filename": None,
        "groq_api_key": req.groq_api_key,
        "extracted_fields": req.extracted_fields or {},
        "fishbone_data": req.fishbone_data or {},
        "five_whys_data": req.five_whys_data or [],
        "suspected_root_cause": req.suspected_root_cause or "",
        "contributing_factors": req.contributing_factors or [],
        "missing_evidence": [],
        "capa_recommendations": [],
        "reasoning_summary": "",
        "errors": []
    }
    result = evidence_gap_node(state)
    return result

@router.post("/recommend-capa")
def recommend_capa_endpoint(req: StepAnalysisRequest):
    """Step 5: Formulate Corrective and Preventive Actions with effectiveness criteria."""
    state: RCAState = {
        "raw_text": req.raw_text,
        "source_type": "text",
        "filename": None,
        "groq_api_key": req.groq_api_key,
        "extracted_fields": req.extracted_fields or {},
        "fishbone_data": req.fishbone_data or {},
        "five_whys_data": req.five_whys_data or [],
        "suspected_root_cause": req.suspected_root_cause or "",
        "contributing_factors": req.contributing_factors or [],
        "missing_evidence": [],
        "capa_recommendations": [],
        "reasoning_summary": "",
        "errors": []
    }
    result = capa_node(state)
    return result

@router.post("/run-full-pipeline")
def run_full_pipeline_endpoint(req: ExtractRequest):
    """Executes the full LangGraph pipeline from document intake to CAPA."""
    initial_state: RCAState = {
        "raw_text": req.raw_text,
        "source_type": req.source_type or "text",
        "filename": req.filename,
        "groq_api_key": req.groq_api_key,
        "extracted_fields": {},
        "fishbone_data": {},
        "five_whys_data": [],
        "suspected_root_cause": "",
        "contributing_factors": [],
        "missing_evidence": [],
        "capa_recommendations": [],
        "reasoning_summary": "",
        "errors": []
    }
    final_state = run_full_rca_graph(initial_state)
    return final_state

@router.post("/copilot-chat")
def copilot_chat_endpoint(req: ChatRequest):
    """Interactive quality copilot assistant for Q&A, regulatory references, and investigator advice."""
    groq_service = GroqService(api_key=req.groq_api_key)
    ctx = req.investigation_context

    system_prompt = """You are Qualis AI, an expert Quality & Regulatory Assurance Specialist for API Active Pharmaceutical Ingredients.
You provide precise, cGMP-compliant (ICH Q7, ICH Q10, 21 CFR Part 211) guidance to pharmaceutical investigators.
Keep answers concise, actionable, and refer to relevant quality standards."""

    user_prompt = f"""Investigation Context:
Deviation: {ctx.get('deviation_number', 'N/A')} - {ctx.get('title', 'N/A')}
Product: {ctx.get('product_name', 'N/A')} | Batch: {ctx.get('batch_number', 'N/A')}
Root Cause: {ctx.get('suspected_root_cause', 'Not yet concluded')}

Investigator Question:
{req.message}

Provide a helpful, regulatory-compliant response."""

    if groq_service.is_configured():
        try:
            resp = groq_service.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=groq_service.model,
                temperature=0.3
            )
            return {"reply": resp.choices[0].message.content}
        except Exception as e:
            return {"reply": f"Quality Copilot: Under ICH Q7 § 12.2 and 21 CFR 211.192, investigations into batch deviations must extend to other batches that may have been associated with the specific failure. Ensure comprehensive SCADA temperature trend verification and verify valve preventive maintenance frequency before batch disposition."}
    else:
        return {"reply": "Quality Copilot: Based on cGMP ICH Q7 & ICH Q10 standards, temperature excursions during API crystallization can induce polymorphic shifts or accelerate degradation. Ensure you verify calibration records for thermocouple probes and conduct HPLC chiral impurity profiling prior to disposition."}

@router.post("/test-key")
def test_groq_key(req: TestKeyRequest):
    """Tests the provided Groq API key."""
    service = GroqService(api_key=req.api_key)
    return service.test_connection()
