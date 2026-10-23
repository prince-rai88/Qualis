import json
import logging
from typing import Dict, Any
from backend.ai.state import RCAState
from backend.ai.groq_service import GroqService
from backend.ai.prompts import (
    EXTRACTION_PROMPT,
    FISHBONE_PROMPT,
    FIVE_WHYS_PROMPT,
    EVIDENCE_GAPS_PROMPT,
    CAPA_PROMPT
)

logger = logging.getLogger(__name__)

def extraction_node(state: RCAState) -> Dict[str, Any]:
    """Node 1: Extract structured deviation fields from raw document/text/email."""
    raw_text = state.get("raw_text", "")
    api_key = state.get("groq_api_key")
    groq_service = GroqService(api_key=api_key)

    prompt = EXTRACTION_PROMPT.replace("{raw_text}", raw_text)
    try:
        data = groq_service.generate_json(prompt)
        return {"extracted_fields": data}
    except Exception as e:
        logger.error(f"Error in extraction_node: {e}")
        return {
            "extracted_fields": {},
            "errors": state.get("errors", []) + [f"Extraction failed: {str(e)}"]
        }


def fishbone_node(state: RCAState) -> Dict[str, Any]:
    """Node 2: Ishikawa 6M root cause causal breakdown."""
    extracted = state.get("extracted_fields", {})
    raw_text = state.get("raw_text", "")
    api_key = state.get("groq_api_key")
    groq_service = GroqService(api_key=api_key)

    context = f"""
Deviation Number: {extracted.get('deviation_number')}
Title: {extracted.get('title')}
Product: {extracted.get('product_name')}
Batch: {extracted.get('batch_number')}
Step: {extracted.get('manufacturing_step')}
Equipment: {extracted.get('equipment_id')}
Severity: {extracted.get('severity')}
Description: {extracted.get('deviation_description')}

Raw Narrative & Observations:
{raw_text[:3000]}
"""
    prompt = FISHBONE_PROMPT.replace("{deviation_context}", context)
    try:
        data = groq_service.generate_json(prompt)
        # Ensure 6M keys exist
        for branch in ["man", "machine", "material", "method", "measurement", "milieu"]:
            if branch not in data:
                data[branch] = []
        return {"fishbone_data": data}
    except Exception as e:
        logger.error(f"Error in fishbone_node: {e}")
        return {"fishbone_data": {}, "errors": state.get("errors", []) + [f"Fishbone failed: {str(e)}"]}


def five_whys_node(state: RCAState) -> Dict[str, Any]:
    """Node 3: Progressive 5 Whys causal interrogation chain."""
    extracted = state.get("extracted_fields", {})
    fishbone = state.get("fishbone_data", {})
    raw_text = state.get("raw_text", "")
    api_key = state.get("groq_api_key")
    groq_service = GroqService(api_key=api_key)

    # Highlight any high likelihood fishbone items
    high_factors = []
    for branch, items in fishbone.items():
        if isinstance(items, list):
            for it in items:
                if it.get("likelihood") == "High" or it.get("is_contributing"):
                    high_factors.append(f"[{branch.upper()}] {it.get('text')}")

    context = f"""
Deviation Number: {extracted.get('deviation_number')}
Title: {extracted.get('title')}
Product: {extracted.get('product_name')}
Batch: {extracted.get('batch_number')}
Description: {extracted.get('deviation_description')}
High Likelihood 6M Factors: {', '.join(high_factors) if high_factors else 'None specified'}

Raw Context:
{raw_text[:3000]}
"""
    prompt = FIVE_WHYS_PROMPT.replace("{deviation_context}", context)
    try:
        data = groq_service.generate_json(prompt)
        return {
            "five_whys_data": data.get("five_whys", []),
            "suspected_root_cause": data.get("suspected_root_cause", ""),
            "contributing_factors": data.get("contributing_factors", [])
        }
    except Exception as e:
        logger.error(f"Error in five_whys_node: {e}")
        return {
            "five_whys_data": [],
            "suspected_root_cause": "",
            "contributing_factors": [],
            "errors": state.get("errors", []) + [f"5 Whys failed: {str(e)}"]
        }


def evidence_gap_node(state: RCAState) -> Dict[str, Any]:
    """Node 4: Identify missing documents, analytical tests, and regulatory gaps."""
    extracted = state.get("extracted_fields", {})
    five_whys = state.get("five_whys_data", [])
    root_cause = state.get("suspected_root_cause", "")
    raw_text = state.get("raw_text", "")
    api_key = state.get("groq_api_key")
    groq_service = GroqService(api_key=api_key)

    context = f"""
Deviation Number: {extracted.get('deviation_number')}
Title: {extracted.get('title')}
Product: {extracted.get('product_name')}
Equipment: {extracted.get('equipment_id')}
Identified Root Cause: {root_cause}
5 Whys Sequence: {json.dumps(five_whys, indent=2)}

Raw Investigation Text:
{raw_text[:3000]}
"""
    prompt = EVIDENCE_GAPS_PROMPT.replace("{deviation_context}", context)
    try:
        data = groq_service.generate_json(prompt)
        return {"missing_evidence": data.get("missing_evidence", [])}
    except Exception as e:
        logger.error(f"Error in evidence_gap_node: {e}")
        return {"missing_evidence": [], "errors": state.get("errors", []) + [f"Evidence gap failed: {str(e)}"]}


def capa_node(state: RCAState) -> Dict[str, Any]:
    """Node 5: Formulate Corrective and Preventive Actions with effectiveness metrics."""
    extracted = state.get("extracted_fields", {})
    five_whys = state.get("five_whys_data", [])
    root_cause = state.get("suspected_root_cause", "")
    contributing = state.get("contributing_factors", [])
    api_key = state.get("groq_api_key")
    groq_service = GroqService(api_key=api_key)

    context = f"""
Deviation: {extracted.get('deviation_number')} - {extracted.get('title')}
Product / Batch: {extracted.get('product_name')} / {extracted.get('batch_number')}
Equipment: {extracted.get('equipment_id')}
Primary Root Cause: {root_cause}
Contributing Factors: {json.dumps(contributing, indent=2)}
5 Whys Analysis: {json.dumps(five_whys, indent=2)}
"""
    prompt = CAPA_PROMPT.replace("{deviation_context}", context)
    try:
        data = groq_service.generate_json(prompt)
        return {
            "capa_recommendations": data.get("capa_recommendations", []),
            "reasoning_summary": data.get("reasoning_summary", "")
        }
    except Exception as e:
        logger.error(f"Error in capa_node: {e}")
        return {
            "capa_recommendations": [],
            "reasoning_summary": "",
            "errors": state.get("errors", []) + [f"CAPA failed: {str(e)}"]
        }
