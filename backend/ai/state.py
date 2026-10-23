from typing import TypedDict, List, Dict, Any, Optional

class RCAState(TypedDict):
    raw_text: str
    source_type: str # pdf, text, email
    filename: Optional[str]
    groq_api_key: Optional[str]
    
    # Node 1: Extracted Information
    extracted_fields: Dict[str, Any]
    
    # Node 2: Ishikawa 6M Fishbone Analysis
    fishbone_data: Dict[str, List[Dict[str, Any]]]
    
    # Node 3: 5 Whys Causal Tree
    five_whys_data: List[Dict[str, Any]]
    
    # Identified Root Cause & Contributing Factors
    suspected_root_cause: str
    contributing_factors: List[str]
    
    # Node 4: Missing Evidence & Regulatory Gaps
    missing_evidence: List[Dict[str, Any]]
    
    # Node 5: CAPA Recommendations
    capa_recommendations: List[Dict[str, Any]]
    
    # Overall Audit Summary
    reasoning_summary: str
    errors: List[str]
