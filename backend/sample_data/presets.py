PRESET_SCENARIOS = [
    {
        "id": "atorvastatin-crystallization",
        "name": "DEV-2026-0842: Atorvastatin Calcium - Temperature Excursion & Impurity B Spike",
        "description": "Excursion during crystallization step in 5000L glass-lined reactor RX-402 resulting in elevated diastereomeric Impurity B (0.24% vs limit 0.15%).",
        "product": "Atorvastatin Calcium Trihydrate API",
        "raw_text": """QUALITY DEVIATION REPORT (FORM QA-DEV-001)
Facility: API Manufacturing Block B, Synthesis Unit 3
Date of Occurrence: 2026-04-14 03:15 UTC | Shift: Night Shift (23:00 - 07:00)
Deviation ID: DEV-2026-0842
Product Name: Atorvastatin Calcium Trihydrate (USP/Ph.Eur Grade)
Batch / Lot Number: B-ATV-260401
Batch Size: 450.0 kg (Target Yield)
Unit Operation: Step 4: Final Anti-Solvent Crystallization and Desolvation
Equipment: Reactor RX-402 (5,000L Glass-Lined Hastelloy C-22 Vessel)
Reported By: Dr. Elena Rostova, Lead Synthesis Chemist & Night Shift Supervisor
Department: Chemical Synthesis Operations

1. INCIDENT DESCRIPTION & CHRONOLOGY
During the cooling crystallization phase of Atorvastatin Calcium batch B-ATV-260401, the recipe mandated controlled cooling from 65.0°C to 20.0°C over 4.5 hours at a linear ramp rate of 0.17°C/min under gentle agitation (42 RPM) with addition of anti-solvent (methyl tert-butyl ether / heptane mixture).
At 03:12 UTC, SCADA alarm 'ALM-RX402-TC-HI' tripped. The batch temperature unexpectedly spiked from 41.2°C to 58.7°C within 18 minutes instead of maintaining the cooling profile.
The temperature remained above 52.0°C for approximately 52 minutes before secondary manual glycol bypass was engaged by the operator at 04:04 UTC.
Subsequent HPLC in-process analytical testing of the isolated wet cake revealed Diastereomeric Impurity B at 0.24% w/w, exceeding the strict internal release specification of <= 0.15% w/w. Assay content was 98.1% (spec: 98.0 - 102.0%).

2. IMMEDIATE CONTAINMENT ACTIONS TAKEN (GMP § 211.192)
- At 04:15 UTC, Batch B-ATV-260401 wet cake was quarantined under Yellow Tag #QT-2026-0199 in Cleanroom Drying Room 4; downstream vacuum pan drying was halted.
- Reactor RX-402 was placed into Lockout/Tagout (LOTO) status pending engineering assessment.
- Retained mother liquor and crystalline cake samples (250g x 3) were transferred to the QC Analytical Laboratory under chain of custody for expanded impurity profiling and chiral chromatography.
- Quality Assurance on-call manager (M. Jenkins) was formally notified at 04:30 UTC.

3. PRELIMINARY INVESTIGATION EVIDENCE
- Chilled water / secondary glycol jacket return flow sensor FT-402 showed flow dropped from 18.5 m³/h to 1.2 m³/h at 03:08 UTC.
- Physical inspection of pneumatic modulation control valve CV-402 revealed the elastomer diaphragm was torn, causing the valve to fail in the closed position rather than fail-open.
- Preventive maintenance records for Reactor RX-402 show valve CV-402 last overhauled 14 months ago; recommended manufacturer service interval is every 6 months.
- Operator logs indicate the visual temperature trend was not actively flagged until the audible alarm sounded at 55°C because the control room HMI screen was switched to the distillation feed page.""",
        "mock_analysis": {
            "extracted_fields": {
                "deviation_number": "DEV-2026-0842",
                "title": "Crystallization Temperature Excursion Leading to Diastereomeric Impurity B OOS",
                "product_name": "Atorvastatin Calcium Trihydrate API",
                "batch_number": "B-ATV-260401",
                "manufacturing_step": "Step 4: Final Anti-Solvent Crystallization and Desolvation",
                "equipment_id": "Reactor RX-402 (5,000L Glass-Lined Hastelloy C-22)",
                "occurrence_date": "2026-04-14 03:15 UTC",
                "reported_by": "Dr. Elena Rostova, Lead Synthesis Chemist",
                "department": "Chemical Synthesis Operations",
                "severity": "Critical",
                "deviation_description": "During the controlled cooling crystallization phase, temperature spiked from 41.2°C to 58.7°C and persisted above 52°C for 52 minutes due to sudden cooling jacket flow restriction. In-process HPLC assay showed Diastereomeric Impurity B at 0.24%, breaching specification limit <= 0.15%.",
                "immediate_containment": [
                    {
                        "id": "cont-1",
                        "description": "Quarantined 450 kg batch B-ATV-260401 under Yellow Tag #QT-2026-0199; halted downstream vacuum pan drying",
                        "action_type": "Quarantine",
                        "taken_by": "Night Shift Supervisor",
                        "timestamp": "2026-04-14 04:15 UTC",
                        "verified": True
                    },
                    {
                        "id": "cont-2",
                        "description": "Placed Reactor RX-402 in Lockout/Tagout (LOTO) status pending engineering assessment",
                        "action_type": "Equipment Isolation",
                        "taken_by": "Maintenance Supervisor",
                        "timestamp": "2026-04-14 04:20 UTC",
                        "verified": True
                    },
                    {
                        "id": "cont-3",
                        "description": "Transferred retained wet cake and mother liquor samples to QC Analytical Lab under chain of custody",
                        "action_type": "Sample Retention",
                        "taken_by": "QC Analyst",
                        "timestamp": "2026-04-14 04:30 UTC",
                        "verified": True
                    }
                ],
                "confidence_scores": {
                    "deviation_number": 0.99,
                    "product_name": 0.98,
                    "batch_number": 0.99,
                    "severity": 0.95
                },
                "evidence_citations": {
                    "title": "Batch temperature spiked from 41.2°C to 58.7°C; Impurity B at 0.24% vs limit 0.15%",
                    "batch_number": "Batch / Lot Number: B-ATV-260401",
                    "severity": "Breach of API release specification Diastereomeric Impurity B constitutes Critical deviation per ICH Q7"
                }
            },
            "fishbone": {
                "man": [
                    {
                        "id": "man-1",
                        "text": "Control room operator focused on distillation HMI page; missed early cooling slowdown until audible alarm sounded",
                        "likelihood": "Medium",
                        "is_contributing": True,
                        "is_root_cause": False,
                        "evidence": "Operator logs show screen navigation away from crystallization profile between 03:00 and 03:12 UTC",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    },
                    {
                        "id": "man-2",
                        "text": "Operator competence on manual cooling glycol bypass",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Training records verified; operator successfully engaged manual bypass at 04:04 UTC",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ],
                "machine": [
                    {
                        "id": "mac-1",
                        "text": "Pneumatic cooling control valve CV-402 elastomer diaphragm rupture caused fail-closed status",
                        "likelihood": "High",
                        "is_contributing": True,
                        "is_root_cause": False,
                        "evidence": "Physical maintenance inspection verified elastomer diaphragm tear and 93% flow reduction",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    },
                    {
                        "id": "mac-2",
                        "text": "Preventive maintenance overdue: valve overhauled 14 months ago vs 6-month OEM requirement",
                        "likelihood": "High",
                        "is_contributing": False,
                        "is_root_cause": True,
                        "evidence": "SAP PM maintenance log shows PM work order #PM-2025-0811 deferred twice due to production scheduling",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "material": [
                    {
                        "id": "mat-1",
                        "text": "Raw material reagent or anti-solvent quality variation",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "CoA for Heptane and MTBE lots confirmed compliant with GC purity > 99.8%",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ],
                "method": [
                    {
                        "id": "met-1",
                        "text": "Lack of automated SCADA early-warning rate-of-change (dT/dt) interlock alarm",
                        "likelihood": "High",
                        "is_contributing": True,
                        "is_root_cause": False,
                        "evidence": "SCADA alarm configuration only triggered on absolute high temperature threshold (55°C)",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "measurement": [
                    {
                        "id": "mea-1",
                        "text": "Thermocouple TT-402 calibration drift or lag",
                        "likelihood": "Low",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Dual RTD verification showed identical temperature readings within +/- 0.1°C",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ],
                "milieu": [
                    {
                        "id": "mil-1",
                        "text": "Cooling utility header pressure fluctuation from central glycol chiller",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Utility log showed central glycol header pressure stable at 4.2 bar throughout the night",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ]
            },
            "five_whys": [
                {
                    "step": 1,
                    "question": "Why did Atorvastatin Calcium batch B-ATV-260401 fail release specification for Diastereomeric Impurity B (0.24% vs limit <= 0.15%)?",
                    "answer": "Thermal degradation and thermodynamic epimerization occurred during the crystallization step due to sustained elevated temperature.",
                    "evidence": "In-process HPLC assay certificate QC-2026-4412; crystallization temperature remained > 52°C for 52 minutes.",
                    "is_root_cause": False,
                    "confidence": 0.98,
                    "confirmed": False
                },
                {
                    "step": 2,
                    "question": "Why did the crystallization vessel temperature spike and remain elevated above 52°C?",
                    "answer": "Cooling jacket chilled glycol flow dropped from 18.5 m³/h to 1.2 m³/h, preventing removal of exothermic crystallization heat.",
                    "evidence": "Flow sensor FT-402 SCADA trend line dropping sharply at 03:08 UTC.",
                    "is_root_cause": False,
                    "confidence": 0.96,
                    "confirmed": False
                },
                {
                    "step": 3,
                    "question": "Why did the jacket coolant flow drop abruptly?",
                    "answer": "Pneumatic modulation control valve CV-402 failed in the fully closed position.",
                    "evidence": "Engineering physical inspection confirmed actuator stem retracted and valve seated shut.",
                    "is_root_cause": False,
                    "confidence": 0.94,
                    "confirmed": False
                },
                {
                    "step": 4,
                    "question": "Why did control valve CV-402 fail closed?",
                    "answer": "The internal EPDM/PTFE elastomer diaphragm suffered fatigue rupture, losing air pressure to the spring actuator.",
                    "evidence": "Maintenance teardown photograph of torn diaphragm with radial elastomeric cracking.",
                    "is_root_cause": False,
                    "confidence": 0.95,
                    "confirmed": False
                },
                {
                    "step": 5,
                    "question": "Why did the elastomer diaphragm suffer fatigue failure during a critical commercial synthesis run?",
                    "answer": "The preventive maintenance schedule for valve CV-402 had elapsed (14 months in service vs 6-month OEM replacement specification) because the maintenance work order was deferred without engineering risk assessment or Quality review.",
                    "evidence": "SAP PM maintenance work order #PM-2025-0811 deferred on two occasions due to synthesis block production backlog.",
                    "is_root_cause": True,
                    "confidence": 0.96,
                    "confirmed": False
                }
            ],
            "suspected_root_cause": "Systemic failure in maintenance work order governance: Critical process valve CV-402 elastomer diaphragm exceeded OEM service lifecycle by 8 months due to unapproved PM deferrals, leading to fatigue rupture during crystallization.",
            "contributing_factors": [
                "Absence of a rate-of-change (dT/dt) early-warning alarm in SCADA system",
                "Control room HMI layout allowed operator to navigate away from primary crystallization trend during critical cooling phase",
                "Valve CV-402 was configured fail-closed rather than fail-open for cooling safety"
            ],
            "missing_evidence": [
                {
                    "id": "gap-1",
                    "item": "SCADA 1-second interval historical trend export for RX-402 (temperature, flow, pressure, stirrer torque)",
                    "rationale": "Required to calculate exact thermal kinetic exposure and validate kinetic degradation rate against laboratory scale models (21 CFR 211.192).",
                    "source_department": "Automation & Engineering",
                    "priority": "Critical",
                    "status": "Pending"
                },
                {
                    "id": "gap-2",
                    "item": "Metallurgical and elastomeric failure analysis report from valve OEM (Fisher/Emerson)",
                    "rationale": "Verify whether diaphragm fatigue was accelerated by chemical vapor exposure, improper torque, or pure cycle fatigue.",
                    "source_department": "Reliability Engineering",
                    "priority": "High",
                    "status": "Pending"
                },
                {
                    "id": "gap-3",
                    "item": "Laboratory re-crystallization and charcoal treatment study report on quarantined batch wet cake",
                    "rationale": "Determine rework/reprocessing feasibility and purge factor for Impurity B under Section 12.2 of ICH Q7.",
                    "source_department": "Chemical R&D / Process Chemistry",
                    "priority": "High",
                    "status": "Pending"
                },
                {
                    "id": "gap-4",
                    "item": "Comprehensive review of all other critical pneumatic valves in Block B for overdue PM status",
                    "rationale": "Determine potential facility-wide systemic risk and immediate impact on concurrent API batches.",
                    "source_department": "Plant Maintenance Quality",
                    "priority": "Critical",
                    "status": "Pending"
                }
            ],
            "capa_recommendations": [
                {
                    "id": "capa-1",
                    "capa_type": "Corrective",
                    "title": "Replace and Qualify Valve CV-402 Actuator & Diaphragm Assembly",
                    "description": "Install brand-new OEM certified PTFE/EPDM diaphragm assembly on CV-402; perform hydrostatic pressure testing and 4-hour cold-water mock cooling cycle qualification.",
                    "root_cause_addressed": "Damaged valve diaphragm on Reactor RX-402",
                    "owner": "Maintenance Lead Engineer",
                    "target_date": "7 Calendar Days",
                    "effectiveness_criteria": "Hydrostatic zero-leakage test and successful temperature control stability test within +/- 0.2°C of setpoint.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                },
                {
                    "id": "capa-2",
                    "capa_type": "Corrective",
                    "title": "Complete Expanded Retesting & Formal Batch Disposition for B-ATV-260401",
                    "description": "Perform full compendial testing (HPLC assay, related substances, enantiomeric purity, polymorphic XRPD, residual solvents). Submit Formal Batch Disposition Protocol to Quality Unit.",
                    "root_cause_addressed": "Impurity B OOS result in quarantined wet cake",
                    "owner": "QC Laboratory Manager & QA Director",
                    "target_date": "14 Calendar Days",
                    "effectiveness_criteria": "Completion of QA disposition report with QP sign-off prior to any material destruction or reprocessing.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                },
                {
                    "id": "capa-3",
                    "capa_type": "Preventive",
                    "title": "Implement Quality Lock on SAP PM Deferrals for Critical Equipment",
                    "description": "Configure SAP PM to restrict postponement of preventive maintenance orders on GMP-critical Class A instruments without joint sign-off from Head of Maintenance and QA Director.",
                    "root_cause_addressed": "Systemic recurrence of PM deferral on critical synthesis equipment",
                    "owner": "QA Systems Manager & SAP Maintenance Admin",
                    "target_date": "30 Calendar Days",
                    "effectiveness_criteria": "100% on-time completion of Class A PM orders across next 6 months with zero unapproved deferrals.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                },
                {
                    "id": "capa-4",
                    "capa_type": "Preventive",
                    "title": "Configure SCADA Predictive Cooling Rate-of-Change Alarm & HMI Lock",
                    "description": "Add Delta-T / Delta-t rate-of-change alarming in SCADA to alert operators within 2 minutes of cooling rate deviation; enforce sticky main reactor overview screen during crystallization phase.",
                    "root_cause_addressed": "Delayed operator detection of cooling slowdown",
                    "owner": "Lead Automation / DCS Engineer",
                    "target_date": "21 Calendar Days",
                    "effectiveness_criteria": "Successful simulated fault injection testing in DCS sandbox and zero alarm omissions across next 10 commercial batches.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                }
            ],
            "reasoning_summary": "Investigation established that the Impurity B specification failure in Atorvastatin Calcium was directly caused by crystallization temperature elevation to 58.7°C, triggered by a torn pneumatic cooling valve diaphragm. The underlying systemic root cause is the deferral of scheduled preventive maintenance beyond OEM lifespan without Quality Unit authorization. Recommended CAPAs address immediate mechanical replacement, CMMS work order governance, and automated predictive alarms."
        }
    },
    {
        "id": "metformin-fbd-degradation",
        "name": "DEV-2026-0519: Metformin HCl - Fluid Bed Dryer Hot Spot & Degradation",
        "description": "Air distribution plate clogging in Fluid Bed Dryer FBD-101 caused localized hot spot (88°C vs 65°C spec) during drying of Metformin Hydrochloride API, yielding an unknown degradation impurity at 0.12%.",
        "product": "Metformin Hydrochloride API",
        "raw_text": """QUALITY DEVIATION MEMORANDUM
Dev ID: DEV-2026-0519 | Department: Secondary Processing & Drying
Product: Metformin Hydrochloride API | Batch: MET-26-0912 (Batch Size: 1,200 kg)
Equipment: Fluid Bed Dryer FBD-101 (Glatt Multiprocess FBD)
Date: 2026-03-28 | Reported By: S. Chen, Senior Validation Specialist

During fluid bed drying of Metformin HCl batch MET-26-0912, inlet temperature was set to 75°C to achieve product bed temperature of 60-65°C.
At drying cycle hour 2.5, bed thermocouple probe TT-101-B registered 88.4°C while probe TT-101-A registered 59.1°C, indicating severe temperature stratification.
Post-drying analytical HPLC testing revealed an unknown related substance peak at RRT 1.42 at 0.12% (identification threshold: 0.10%, individual unspecified impurity limit: <= 0.10%).
Physical teardown of FBD-101 post-quarantine discovered that the perforated stainless steel Dutch-weave air distribution mesh was 40% blinded by caked Metformin fines from the previous campaign due to incomplete clean-in-place (CIP) spray coverage in the perimeter zone.""",
        "mock_analysis": {
            "extracted_fields": {
                "deviation_number": "DEV-2026-0519",
                "title": "Fluid Bed Dryer Air Mesh Blinding Causing Localized Hot Spot and Degradant Impurity",
                "product_name": "Metformin Hydrochloride API",
                "batch_number": "MET-26-0912",
                "manufacturing_step": "Step 5: Fluid Bed Drying & Moisture Control",
                "equipment_id": "Fluid Bed Dryer FBD-101 (Glatt Multiprocess)",
                "occurrence_date": "2026-03-28",
                "reported_by": "S. Chen, Senior Validation Specialist",
                "department": "Secondary Processing & Drying",
                "severity": "Major",
                "deviation_description": "Air distribution screen blinding led to maldistributed fluidization airflow, creating an 88.4°C localized hot spot that thermally degraded Metformin into an unknown related substance at 0.12% (limit <= 0.10%).",
                "immediate_containment": [
                    {
                        "id": "cont-1",
                        "description": "Quarantined 1,200 kg Metformin HCl batch MET-26-0912 in double-lined HDPE drums",
                        "action_type": "Quarantine",
                        "taken_by": "Drying Operations Supervisor",
                        "timestamp": "2026-03-28",
                        "verified": True
                    },
                    {
                        "id": "cont-2",
                        "description": "Stopped production on FBD-101 and initiated emergency engineering inspection",
                        "action_type": "Line Stop",
                        "taken_by": "Production Manager",
                        "timestamp": "2026-03-28",
                        "verified": True
                    }
                ],
                "confidence_scores": {
                    "deviation_number": 0.98,
                    "product_name": 0.99,
                    "batch_number": 0.99,
                    "severity": 0.90
                },
                "evidence_citations": {
                    "title": "Air distribution mesh 40% blinded by caked fines causing localized hot spot 88.4°C",
                    "batch_number": "Batch: MET-26-0912",
                    "severity": "Unknown impurity at 0.12% exceeds ICH Q3A qualification threshold of 0.10%"
                }
            },
            "fishbone": {
                "man": [
                    {
                        "id": "man-1",
                        "text": "Cleaning operators did not inspect screen perimeter with mirrors/borescope post CIP",
                        "likelihood": "High",
                        "is_contributing": True,
                        "is_root_cause": False,
                        "evidence": "Cleaning log lacked specific sign-off requirement for 360-degree borescope inspection",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "machine": [
                    {
                        "id": "mac-1",
                        "text": "Rotary CIP spray ball in FBD lower plenum had two blocked nozzles, leaving shadow zone",
                        "likelihood": "High",
                        "is_contributing": False,
                        "is_root_cause": True,
                        "evidence": "CIP spray coverage riboflavin test revealed zero wash impingement along outer 15% perimeter",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "material": [
                    {
                        "id": "mat-1",
                        "text": "Feed wet cake moisture variation leading to agglomeration",
                        "likelihood": "Low",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Centrifuge moisture before drying was within standard 8-11% w/w window",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ],
                "method": [
                    {
                        "id": "met-1",
                        "text": "CIP validation re-qualification frequency was set at 3 years instead of annual",
                        "likelihood": "Medium",
                        "is_contributing": True,
                        "is_root_cause": False,
                        "evidence": "Last riboflavin cleanability verification was performed 28 months ago",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "measurement": [
                    {
                        "id": "mea-1",
                        "text": "Bed differential pressure transmitter calibration",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Calibration certificate valid and verified accurate within 0.05 kPa",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ],
                "milieu": [
                    {
                        "id": "mil-1",
                        "text": "Supply air dehumidification coil condensate carryover",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "HVAC AHU-4 dew point was consistently maintained at 8.0°C",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ]
            },
            "five_whys": [
                {
                    "step": 1,
                    "question": "Why did Metformin HCl batch MET-26-0912 contain an unknown impurity peak at 0.12%?",
                    "answer": "A localized region of the powder bed suffered thermal degradation at 88.4°C during drying.",
                    "evidence": "Bed probe TT-101-B registered 88.4°C vs nominal specification of 65°C.",
                    "is_root_cause": False,
                    "confidence": 0.95,
                    "confirmed": False
                },
                {
                    "step": 2,
                    "question": "Why did the powder bed develop an 88.4°C localized hot spot?",
                    "answer": "Air distribution was severely channeling due to 40% blinding of the lower inlet air distribution screen.",
                    "evidence": "Visual inspection photographs showing caked powder obstruction along screen periphery.",
                    "is_root_cause": False,
                    "confidence": 0.94,
                    "confirmed": False
                },
                {
                    "step": 3,
                    "question": "Why was the air distribution screen blinded by powder cake?",
                    "answer": "The automated Clean-In-Place (CIP) cycle failed to dissolve and remove residual Metformin fines from the previous batch.",
                    "evidence": "Screen had not been physically removed for ultrasonic bath cleaning between campaigns.",
                    "is_root_cause": False,
                    "confidence": 0.92,
                    "confirmed": False
                },
                {
                    "step": 4,
                    "question": "Why did the CIP cycle fail to clean the screen perimeter?",
                    "answer": "Two spray orifices on the rotating CIP wash head were partially blocked by scale, creating a spray shadow.",
                    "evidence": "Riboflavin fluorescent rinse test confirmed no cleaning solution impinged upon outer perimeter.",
                    "is_root_cause": False,
                    "confidence": 0.96,
                    "confirmed": False
                },
                {
                    "step": 5,
                    "question": "Why were the blocked spray orifices not detected prior to batch processing?",
                    "answer": "The CIP system lacked automated pressure/flow verification sensors, and visual inspection of spray patterns was not mandated in the post-CIP verification SOP.",
                    "evidence": "SOP-CLN-FBD-04 requires only visual check of dryer bowl interior, omitting spray ball nozzle inspection.",
                    "is_root_cause": True,
                    "confidence": 0.94,
                    "confirmed": False
                }
            ],
            "suspected_root_cause": "CIP spray ball nozzle obstruction caused wash shadow and screen blinding, leading to airflow channeling, bed hot spots, and thermal degradation of Metformin.",
            "contributing_factors": [
                "Absence of spray nozzle visual inspection checklist in post-CIP clearance SOP",
                "Lack of automated CIP header flow rate monitoring"
            ],
            "missing_evidence": [
                {
                    "id": "gap-1",
                    "item": "LC-MS/MS structural elucidation report for unknown impurity at RRT 1.42",
                    "rationale": "Required to determine chemical structure, mutagenic potential (ICH M7), and toxicological qualification.",
                    "source_department": "Analytical Chemistry & Toxicology",
                    "priority": "Critical",
                    "status": "Pending"
                },
                {
                    "id": "gap-2",
                    "item": "Pre-drying wet cake Karl Fischer and particle size distribution (PSD) records",
                    "rationale": "Validate that incoming agglomerate size was not an additional fluidization barrier.",
                    "source_department": "QC In-Process",
                    "priority": "Medium",
                    "status": "Pending"
                }
            ],
            "capa_recommendations": [
                {
                    "id": "capa-1",
                    "capa_type": "Corrective",
                    "title": "Ultrasonic Cleaning and Re-verification of FBD Air Mesh",
                    "description": "Dismantle FBD-101 lower screen assembly, conduct ultrasonic acid bath cleaning, inspect 100% mesh under stereomicroscope, and perform differential pressure airflow verification.",
                    "root_cause_addressed": "Blinded air distribution mesh",
                    "owner": "Maintenance Lead",
                    "target_date": "5 Calendar Days",
                    "effectiveness_criteria": "Screen differential air pressure baseline restored to 1.2 mbar +/- 0.1 mbar at 3000 m³/h air flow.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                },
                {
                    "id": "capa-2",
                    "capa_type": "Preventive",
                    "title": "Revise CIP SOP to Mandate Spray Ball Inspection & Annual Riboflavin Validation",
                    "description": "Revise SOP-CLN-FBD-04 to include mandatory spray ball nozzle inspection with borescope and implement annual riboflavin fluorescent cleanability testing.",
                    "root_cause_addressed": "Undetected spray nozzle blockage and CIP wash shadow",
                    "owner": "Cleaning Validation Specialist & Operations QA",
                    "target_date": "20 Calendar Days",
                    "effectiveness_criteria": "Zero CIP visual failures across next 20 cleaning cycles and 100% riboflavin clearance on re-qualification.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                }
            ],
            "reasoning_summary": "Thermal degradation of Metformin HCl in FBD-101 was caused by uneven fluidization due to caked powder on 40% of the air distribution mesh. A blocked CIP spray nozzle prevented proper cleaning. CAPAs include ultrasonic mesh cleaning, revised CIP SOP, and annual cleanability validation."
        }
    },
    {
        "id": "paracetamol-centrifuge-seal",
        "name": "DEV-2026-0311: Paracetamol API - Mechanical Seal Degradation & Foreign Particulate",
        "description": "Hastelloy peeler centrifuge CF-201 mechanical face seal carbon wear shed foreign black specks into Paracetamol crystal cake during mother liquor separation.",
        "product": "Paracetamol (Acetaminophen) API",
        "raw_text": """INCIDENT INVESTIGATION FORM
Deviation: DEV-2026-0311 | Severity: Critical
Product: Paracetamol Micronized API | Batch: PAR-2026-0771 (1,800 kg)
Facility: API Plant 1, Isolation Suite C | Equipment: Inverting Peeler Centrifuge CF-201
Date of Event: 2026-02-18 | Reported By: R. Patel, QA Inspector

During discharge of Paracetamol batch PAR-2026-0771 from peeler centrifuge CF-201, the visual inspection operator observed discrete black specks (0.2 mm to 1.0 mm) on the outer perimeter of the white crystal cake bed.
Immediate containment was enacted: discharge hopper was sealed and cake collection drum tagged for quarantine.
QC micro-FTIR spectroscopy of isolated particulate identified the black material as carbon-graphite composite with trace fluorocarbon elastomer binder, matching the rotary face seal of centrifuge main shaft mechanical seal MS-201.
Review of vibration monitoring logs revealed centrifuge vibration spiked to 4.8 mm/s RMS (alert threshold: 2.8 mm/s) three hours prior to discharge, but no interlock was programmed to stop the drive.""",
        "mock_analysis": {
            "extracted_fields": {
                "deviation_number": "DEV-2026-0311",
                "title": "Mechanical Seal Carbon Face Degradation Resulting in Foreign Particulate Contamination",
                "product_name": "Paracetamol (Acetaminophen) API",
                "batch_number": "PAR-2026-0771",
                "manufacturing_step": "Step 3: Centrifugal Solid-Liquid Isolation",
                "equipment_id": "Inverting Peeler Centrifuge CF-201",
                "occurrence_date": "2026-02-18",
                "reported_by": "R. Patel, QA Inspector",
                "department": "API Plant 1, Isolation Suite C",
                "severity": "Critical",
                "deviation_description": "During crystal cake discharge from centrifuge CF-201, discrete black specks (0.2 - 1.0 mm) were observed on the product cake. Micro-FTIR confirmed particles as carbon-graphite from mechanical seal MS-201, which degraded following excessive vibration (4.8 mm/s).",
                "immediate_containment": [
                    {
                        "id": "cont-1",
                        "description": "Sealed discharge hopper and quarantined 1,800 kg Paracetamol batch PAR-2026-0771 in locked warehouse",
                        "action_type": "Quarantine",
                        "taken_by": "QA Inspector",
                        "timestamp": "2026-02-18",
                        "verified": True
                    },
                    {
                        "id": "cont-2",
                        "description": "Tagged out Centrifuge CF-201 with Red Tag #RT-2026-0044",
                        "action_type": "Equipment Isolation",
                        "taken_by": "Shift Maintenance Engineer",
                        "timestamp": "2026-02-18",
                        "verified": True
                    }
                ],
                "confidence_scores": {
                    "deviation_number": 0.99,
                    "product_name": 0.99,
                    "batch_number": 0.99,
                    "severity": 0.98
                },
                "evidence_citations": {
                    "title": "Micro-FTIR matched black specks to mechanical seal MS-201 carbon face",
                    "batch_number": "Batch: PAR-2026-0771",
                    "severity": "Foreign particulate matter in active pharmaceutical ingredient represents direct patient hazard / critical cGMP violation"
                }
            },
            "fishbone": {
                "man": [
                    {
                        "id": "man-1",
                        "text": "Operator continued centrifugation cycle despite vibration telemetry warning banner",
                        "likelihood": "Medium",
                        "is_contributing": True,
                        "is_root_cause": False,
                        "evidence": "Operator thought vibration was transient slurry unbalance during initial slurry charging",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "machine": [
                    {
                        "id": "mac-1",
                        "text": "Mechanical seal MS-201 barrier fluid loss caused dry-running of carbon/silicon carbide faces",
                        "likelihood": "High",
                        "is_contributing": False,
                        "is_root_cause": True,
                        "evidence": "Seal reservoir nitrogen pressurization regulator failed, dropping barrier fluid pressure below process pressure",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "material": [
                    {
                        "id": "mat-1",
                        "text": "Carbon seal material lot quality defect",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Vendor certificate of compliance verified; material meets FDA 21 CFR 177.2600 standards",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ],
                "method": [
                    {
                        "id": "met-1",
                        "text": "Centrifuge control system lacked automated trip interlock on sustained high vibration",
                        "likelihood": "High",
                        "is_contributing": True,
                        "is_root_cause": False,
                        "evidence": "PLC program only logged warning above 2.8 mm/s; hard trip was set at 8.0 mm/s",
                        "ai_suggested": True,
                        "investigator_confirmed": False
                    }
                ],
                "measurement": [
                    {
                        "id": "mea-1",
                        "text": "Micro-FTIR analytical identification of particulate",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Spectral match > 96% with reference carbon-graphite spectrum",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ],
                "milieu": [
                    {
                        "id": "mil-1",
                        "text": "Cleanroom air particulate level",
                        "likelihood": "Ruled Out",
                        "is_contributing": False,
                        "is_root_cause": False,
                        "evidence": "Room particulate counter showed ISO 7 compliance (zero excursions)",
                        "ai_suggested": True,
                        "investigator_confirmed": True
                    }
                ]
            },
            "five_whys": [
                {
                    "step": 1,
                    "question": "Why did Paracetamol crystal cake contain foreign black particulate matter?",
                    "answer": "Carbon-graphite fragments were shed directly into the spinning centrifuge basket.",
                    "evidence": "Micro-FTIR spectroscopy confirmed 96.4% match to mechanical seal face material.",
                    "is_root_cause": False,
                    "confidence": 0.99,
                    "confirmed": False
                },
                {
                    "step": 2,
                    "question": "Why did the mechanical seal shed carbon-graphite fragments?",
                    "answer": "The seal faces experienced catastrophic dry-running friction and chattering during high-speed rotation.",
                    "evidence": "Severe mechanical face gouging and thermal discoloration discovered during teardown.",
                    "is_root_cause": False,
                    "confidence": 0.97,
                    "confirmed": False
                },
                {
                    "step": 3,
                    "question": "Why did the mechanical seal experience dry-running friction?",
                    "answer": "The barrier fluid (USP Purified Water) lubricating film boiled off because barrier pressure collapsed.",
                    "evidence": "Barrier fluid reservoir level sensor recorded sudden depletion and loss of pressure.",
                    "is_root_cause": False,
                    "confidence": 0.95,
                    "confirmed": False
                },
                {
                    "step": 4,
                    "question": "Why did the barrier fluid pressure collapse during operation?",
                    "answer": "The nitrogen gas overpressure regulator on the seal pot had a ruptured sensing bellow, venting pressure to ambient.",
                    "evidence": "Regulator leak test showed 0 bar delivery pressure despite 4 bar supply pressure.",
                    "is_root_cause": False,
                    "confidence": 0.94,
                    "confirmed": False
                },
                {
                    "step": 5,
                    "question": "Why did the centrifuge continue to spin at 1200 RPM after seal barrier pressure was lost?",
                    "answer": "The centrifuge safety PLC lacked a low barrier fluid pressure interlock to initiate emergency stop, allowing the machine to run unlubricated for 45 minutes.",
                    "evidence": "Centrifuge I/O logic review confirmed barrier pressure transmitter PT-201 was only wired to display, not to safety trip.",
                    "is_root_cause": True,
                    "confidence": 0.96,
                    "confirmed": False
                }
            ],
            "suspected_root_cause": "Centrifuge safety interlock architecture deficiency: Barrier fluid pressure transmitter was not wired into the safety emergency trip logic, allowing the mechanical seal to dry-run and shatter carbon faces after regulator failure.",
            "contributing_factors": [
                "Nitrogen pressure regulator sensing bellow failure",
                "Centrifuge vibration trip limit set excessively high (8.0 mm/s vs industry standard 3.5 mm/s)"
            ],
            "missing_evidence": [
                {
                    "id": "gap-1",
                    "item": "Centrifuge PLC ladder logic printout and safety interlock functional test protocol",
                    "rationale": "Required to verify SIL rating and safety lifecycle management per IEC 61511 and GMP annex 11.",
                    "source_department": "Automation & Controls",
                    "priority": "Critical",
                    "status": "Pending"
                },
                {
                    "id": "gap-2",
                    "item": "Rejection and formal destruction protocol for contaminated batch PAR-2026-0771",
                    "rationale": "Direct foreign particulate contamination cannot be blended or reprocessed per FDA guidance.",
                    "source_department": "Quality Assurance",
                    "priority": "Critical",
                    "status": "Pending"
                }
            ],
            "capa_recommendations": [
                {
                    "id": "capa-1",
                    "capa_type": "Corrective",
                    "title": "Replace Mechanical Seal & Nitrogen Pressure Regulator on CF-201",
                    "description": "Install new silicon carbide / silicon carbide mechanical seal (eliminating carbon face wear) and stainless steel nitrogen regulator; perform dynamic seal run-in test.",
                    "root_cause_addressed": "Destroyed mechanical seal assembly",
                    "owner": "Centrifuge Specialist Engineer",
                    "target_date": "10 Calendar Days",
                    "effectiveness_criteria": "Zero leakage in 24-hour nitrogen pressure hold test and vibration < 1.5 mm/s at 1400 RPM.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                },
                {
                    "id": "capa-2",
                    "capa_type": "Preventive",
                    "title": "Implement Hardwired Safety Interlock on Barrier Pressure & Vibration",
                    "description": "Rewire barrier pressure transmitter PT-201 and vibration sensor into the centrifuge safety circuit to automatically initiate controlled regenerative braking if barrier pressure drops below 1.5 bar or vibration exceeds 3.2 mm/s.",
                    "root_cause_addressed": "Lack of automated safety interlock on dry-run conditions",
                    "owner": "Lead Instrumentation & Controls Engineer",
                    "target_date": "14 Calendar Days",
                    "effectiveness_criteria": "Successful interlock fault injection challenge during IQ/OQ requalification with 100% verified trip response.",
                    "status": "Proposed",
                    "ai_suggested": True,
                    "confirmed": False
                }
            ],
            "reasoning_summary": "Carbon particulate contamination in Paracetamol API batch was traced to catastrophic dry-running of mechanical seal MS-201 after barrier fluid pressure failed. The critical systemic flaw was that centrifuge safety logic lacked an automated shutoff interlock for low barrier pressure. CAPAs upgrade the seal metallurgy to SiC/SiC and implement hardwired safety trip interlocks."
        }
    }
]
