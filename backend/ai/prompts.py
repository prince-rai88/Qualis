EXTRACTION_PROMPT = """
You are a Principal Pharmaceutical Quality Assurance Investigator specializing in Active Pharmaceutical Ingredient (API) cGMP manufacturing (ICH Q7, ICH Q10, 21 CFR Part 211).
Your task is to analyze the provided incident document, quality notification, or email and extract structured Root Cause Analysis (RCA) fields.

Extract the following in strict JSON format:
{
  "deviation_number": "string (e.g. DEV-2026-XXXX or generate a realistic code if not found)",
  "title": "concise, accurate technical summary of the deviation",
  "product_name": "API name (e.g. Atorvastatin Calcium Trihydrate, Metformin HCl)",
  "batch_number": "batch or lot number",
  "manufacturing_step": "specific unit operation (e.g. Step 4: Crystallization & Isolation, Reaction, Centrifugation, Fluid Bed Drying)",
  "equipment_id": "equipment tag/name (e.g. RX-402 5000L Reactor, FBD-101)",
  "occurrence_date": "date and time of incident",
  "reported_by": "person or title who reported",
  "department": "manufacturing department (e.g. Chemical Synthesis Operations, QC Analytical)",
  "severity": "Minor" | "Major" | "Critical",
  "deviation_description": "detailed technical narrative of what occurred, parameters exceeded, and observed impact",
  "immediate_containment": [
    {
      "id": "cont-1",
      "description": "specific action taken immediately (e.g. Quarantined 450 kg batch in warehouse, suspended downstream drying, tagged out RX-402, sampled for emergency HPLC)",
      "action_type": "Quarantine" | "Line Stop" | "Sample Retention" | "Equipment Isolation",
      "taken_by": "Shift Supervisor",
      "timestamp": "immediate",
      "verified": true
    }
  ],
  "confidence_scores": {
    "deviation_number": 0.95,
    "product_name": 0.95,
    "batch_number": 0.95,
    "severity": 0.90
  },
  "evidence_citations": {
    "title": "exact quote or sentence from document supporting this",
    "batch_number": "quote",
    "severity": "rationale quote"
  }
}

Incident Document Content:
{raw_text}
"""

FISHBONE_PROMPT = """
You are an expert GMP Quality Investigator. Based on the pharmaceutical API deviation details provided below, perform an Ishikawa (Fishbone) 6M Root Cause Analysis:
1. Man (Personnel, training, qualifications, fatigue, SOP adherence, shift turnover)
2. Machine (Equipment, reactors, valves, seals, chillers, sensors, mechanical wear, calibration)
3. Material (Starting materials, reagents, solvents, impurities, water content, vendor lot variability)
4. Method (Batch Production Record instructions, charging rates, stirring speeds, cooling curves, hold times)
5. Measurement (HPLC assay, thermocouples, pH meters, sampling techniques, analytical drift)
6. Milieu / Environment (Cleanroom humidity, HVAC differential pressures, temperature, ambient contamination)

For each branch, provide 2 to 4 potential causal factors.
Crucially: Distinguish between factors that are "Ruled Out", "Low", "Medium", or "High" likelihood.
Indicate which factor is the suspected Primary Root Cause (`is_root_cause: true`) and which are Contributing Factors (`is_contributing: true`).
Include the exact supporting evidence or scientific rationale.

Return strict JSON:
{
  "man": [
    {
      "id": "man-1",
      "text": "description of factor",
      "likelihood": "Ruled Out" | "Low" | "Medium" | "High",
      "is_contributing": false,
      "is_root_cause": false,
      "evidence": "justification or observation",
      "ai_suggested": true,
      "investigator_confirmed": false
    }
  ],
  "machine": [...],
  "material": [...],
  "method": [...],
  "measurement": [...],
  "milieu": [...]
}

Deviation Details:
{deviation_context}
"""

FIVE_WHYS_PROMPT = """
You are an expert API Pharmaceutical Quality Investigator. Construct a rigorous, scientifically grounded 5 Whys Root Cause Analysis chain for the deviation below.
The 5 Whys must transition logically from the immediate physical symptom down to the underlying systemic/procedural root cause (such as preventive maintenance failure, design flaw, or quality oversight).

Return strict JSON:
{
  "five_whys": [
    {
      "step": 1,
      "question": "Why did [observed symptom] occur?",
      "answer": "Direct immediate cause based on evidence",
      "evidence": "Data, log snippet, or reading supporting this step",
      "is_root_cause": false,
      "confidence": 0.95,
      "confirmed": false
    },
    {
      "step": 2,
      "question": "Why did [answer 1] happen?",
      "answer": "Intermediate physical cause",
      "evidence": "Data snippet",
      "is_root_cause": false,
      "confidence": 0.90,
      "confirmed": false
    },
    {
      "step": 3,
      "question": "Why did [answer 2] occur?",
      "answer": "Mechanism cause",
      "evidence": "Supporting observation",
      "is_root_cause": false,
      "confidence": 0.88,
      "confirmed": false
    },
    {
      "step": 4,
      "question": "Why did [answer 3] happen?",
      "answer": "Process or procedural breakdown",
      "evidence": "Maintenance / SOP / calibration record",
      "is_root_cause": false,
      "confidence": 0.85,
      "confirmed": false
    },
    {
      "step": 5,
      "question": "Why did [answer 4] persist without detection?",
      "answer": "Systemic root cause (e.g. inadequate PM interval, lack of automated interlock, vendor qualification gap)",
      "evidence": "Quality management / system evidence",
      "is_root_cause": true,
      "confidence": 0.92,
      "confirmed": false
    }
  ],
  "suspected_root_cause": "A concise summary of the primary root cause identified in Step 5",
  "contributing_factors": [
    "Contributing factor 1",
    "Contributing factor 2"
  ]
}

Deviation Details:
{deviation_context}
"""

EVIDENCE_GAPS_PROMPT = """
You are a senior FDA/EMA GMP Regulatory Compliance Auditor.
Review the deviation investigation below and identify critical missing evidence, incomplete tests, or audit trail verification gaps required by 21 CFR 211.192 and ICH Q7 before this investigation can be closed and approved by the Qualified Person.

Examples of missing evidence in API manufacturing:
- SCADA historical trend logs (temperature, pressure, agitation RPM)
- Calibration verification certificates for temperature probes / sensors
- Preventive maintenance service history for affected valves or pumps
- Chromatographic raw data (integration baselines, system suitability checks)
- Raw material vendor Certificate of Analysis (CoA) confirmatory re-testing
- Operator interview records and shift handover logbooks
- Cleaning validation swab testing for cross-contamination

Return strict JSON:
{
  "missing_evidence": [
    {
      "id": "gap-1",
      "item": "Specific document, log, or analytical test missing",
      "rationale": "Why this evidence is required per GMP / risk assessment",
      "source_department": "QC Analytical" | "Engineering/Maintenance" | "Production Operations" | "Supply Chain Quality",
      "priority": "Critical" | "High" | "Medium",
      "status": "Pending"
    }
  ]
}

Deviation & Current Investigation Context:
{deviation_context}
"""

CAPA_PROMPT = """
You are a Pharmaceutical Quality Systems Director.
Based on the identified root cause and contributing factors for the API deviation below, recommend comprehensive Corrective and Preventive Actions (CAPA) compliant with ICH Q10.

Distinguish clearly between:
1. CORRECTIVE ACTIONS (Remediate the immediate problem, address the quarantined API batch, repair equipment).
2. PREVENTIVE ACTIONS (Address the systemic root cause to prevent recurrence across the facility or product family).

Every CAPA must have:
- Specific action title & technical description
- Root cause addressed
- Assigned functional owner role (e.g. Validation Manager, Maintenance Supervisor, QC Manager)
- Suggested realistic timeframe (e.g. 14 days, 30 days, 60 days)
- EFFECTIVENESS CHECK CRITERIA (quantifiable metric, e.g. "Review temperature control and impurity profile of next 5 consecutive commercial batches without excursion").

Return strict JSON:
{
  "capa_recommendations": [
    {
      "id": "capa-1",
      "capa_type": "Corrective",
      "title": "Title of corrective action",
      "description": "Detailed step-by-step implementation instructions",
      "root_cause_addressed": "Direct cause or equipment failure",
      "owner": "Maintenance Lead / Production Supervisor",
      "target_date": "14 Calendar Days",
      "effectiveness_criteria": "Successful hydrostatic pressure test and cold-water commissioning run with zero leakage",
      "status": "Proposed",
      "ai_suggested": true,
      "confirmed": false
    },
    {
      "id": "capa-2",
      "capa_type": "Preventive",
      "title": "Title of systemic preventive action",
      "description": "Systemic procedure, PM schedule update, or automated engineering control",
      "root_cause_addressed": "Systemic root cause identified in 5-Whys",
      "owner": "Head of Engineering / Quality Assurance",
      "target_date": "45 Calendar Days",
      "effectiveness_criteria": "Zero recurring excursions across the next 10 commercial batches and 100% compliance on updated 60-day PM task in SAP",
      "status": "Proposed",
      "ai_suggested": true,
      "confirmed": false
    }
  ],
  "reasoning_summary": "Executive summary of the investigation, root cause rationale, and CAPA defense for regulatory inspection"
}

Investigation Summary & Root Causes:
{deviation_context}
"""
