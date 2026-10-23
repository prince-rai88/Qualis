# Qualis AI • Pharmaceutical Root Cause Analysis (RCA) & CAPA Module

A cGMP-compliant AI-powered Root Cause Analysis and CAPA management platform designed for Active Pharmaceutical Ingredient (API) manufacturers, following ICH Q7, ICH Q10, and FDA 21 CFR Part 211 / 21 CFR Part 11 guidelines.

---

## 🌟 Key Capabilities

1. **Intake & Multi-Modal Evidence Processing**:
   - Accept incident documents (PDF), shift handover emails, or pasted investigation memos.
   - Intelligent OCR / PDF table and text extraction (`pypdf`).
   - 3 Pre-configured real-world API manufacturing presets:
     - **Atorvastatin Calcium Trihydrate API**: Crystallization temperature excursion & Impurity B OOS.
     - **Metformin Hydrochloride API**: Fluid Bed Dryer air distribution mesh blinding & degradation degradant.
     - **Paracetamol (Acetaminophen) API**: Centrifuge mechanical seal carbon face degradation & foreign particulate matter.

2. **AI Copilot & Form Auto-Population (The AIVOA Workflow)**:
   - Split-screen workspace following the reference interaction pattern.
   - Side panel displays extracted fields with **confidence scores**, **regulatory citations**, and individual or bulk "Apply to Form" controls.
   - Interactive Quality Copilot chat assistant for real-time ICH Q7 / 21 CFR regulatory Q&A.

3. **Dual Investigation Frameworks**:
   - **5 Whys Progressive Causal Chain**: Step-by-step causal escalation from physical symptom down to management and preventive system failures.
   - **Ishikawa 6Ms Fishbone Diagram**: Interactive visual matrix across Man, Machine, Material, Method, Measurement, and Milieu, with likelihood ratings (High, Medium, Low, Ruled Out) and investigator verification toggles.

4. **Missing Evidence & 21 CFR 211.192 Regulatory Gap Detection**:
   - Automated detection of missing records (e.g. SCADA 1-second trend logs, thermocouple calibration certificates, raw material vendor CoAs, OEM failure reports) required before an investigation can be closed.

5. **ICH Q10 CAPA Formulation & Tracking**:
   - Clear distinction between **Corrective Actions** (immediate containment & batch disposition) and **Preventive Actions** (systemic recurrence prevention).
   - Mandatory **Effectiveness Check Plan** metrics (e.g. "Zero recurring excursions across next 5 commercial batches").

6. **21 CFR Part 11 Electronic Signature & Audit Dossier**:
   - Qualified Person (QP) Electronic Sign-off with cryptographic timestamp and justification.
   - Complete PostgreSQL audit trail of all field edits and approvals.
   - Inspection-ready Audit Dossier modal with 1-click Print / PDF generation for FDA / EMA inspectors.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Redux Toolkit, TypeScript, Lucide Icons, Canvas Confetti.
  - UI styled with clean, vanilla CSS design tokens, glassmorphism, and responsive layout.
- **Backend**: Python 3.14 + FastAPI asynchronous REST API.
- **Database**: PostgreSQL (`qualis_rca` via SQLAlchemy 2.0 & psycopg2-binary) with automatic schema creation and fallback support.
- **AI Orchestration**: LangGraph StateGraph pipeline with 5 specialized nodes:
  1. `IntakeAndEntityExtractorNode`
  2. `Fishbone6MAnalysisNode`
  3. `FiveWhysNode`
  4. `EvidenceGapAnalyzerNode`
  5. `CAPARecommendationNode`
- **LLM Integration**: Groq API (`llama-3.3-70b-versatile` or `gemma2-9b-it`) with built-in high-fidelity domain fallback mode when testing without an API key.

---

## 🚀 Running the Application Locally

### 1. Prerequisites
- Python 3.10+ (Python 3.14 supported)
- Node.js 18+ and npm
- PostgreSQL running locally (database: `qualis_rca`)

### 2. Start Backend Server
```bash
# In project root:
source venv/bin/activate
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Start Frontend Dev Server
```bash
# In frontend directory:
cd frontend
npm run dev
```
Open your browser at: **[http://127.0.0.1:5173](http://127.0.0.1:5173)**

---

## 🎥 Recording Guide for Challenge Submission

### Video 1: Product Demonstration (5–8 minutes)
1. **Introduction**: Introduce Qualis AI as a cGMP-compliant RCA & CAPA module for Active Pharmaceutical Ingredient (API) manufacturers.
2. **Intake Flow**:
   - Show the 3 intake options: PDF upload, raw text paste, or preset loading.
   - Load the **Atorvastatin Calcium** crystallization temperature excursion scenario.
3. **AI Copilot & Form Auto-Population**:
   - Highlight the side-by-side interaction pattern.
   - Click "Run Full AI RCA Pipeline" and watch the live stepper progress through Extraction, Fishbone, 5 Whys, Evidence Gaps, and CAPA.
   - Show the extracted field review cards with confidence scores and document citations.
   - Click "Apply All to Form" and show the form fields populating smoothly.
4. **Root Cause Analysis (5 Whys & Ishikawa 6M)**:
   - Switch to Tab 2: Show the progressive 5 Whys chain down to the systemic PM deferral root cause.
   - Show the Ishikawa 6M visual grid (Man, Machine, Material, Method, Measurement, Milieu).
   - Toggle "Confirmed by Investigator" on a step.
5. **Evidence Gaps & Missing Information (21 CFR 211.192)**:
   - Switch to Tab 3: Explain why missing records (SCADA logs, OEM failure analysis) must be gathered before batch disposition. Click "Mark Provided".
6. **CAPA Recommendations (ICH Q10)**:
   - Switch to Tab 4: Show the separation of Corrective vs. Preventive actions and the mandatory quantifiable Effectiveness Check Criteria.
7. **Human Review & Qualified Person (QP) Electronic Sign-off**:
   - Click "QP Sign-Off", enter QP review comments, and affix the electronic signature under 21 CFR Part 11.
   - Click "Audit Dossier" to show the print-ready regulatory inspection defense record.

### Video 2: Technical Walkthrough (5–10 minutes)
1. **Frontend Architecture**:
   - React + Redux Toolkit structure in `frontend/src/store/slices/`.
   - Form-filling interaction state and optimistic UI updates.
2. **FastAPI Endpoints**:
   - Route modules in `backend/routes/investigations.py` and `backend/routes/ai_rca.py`.
   - Streaming/stepper execution and PDF parsing via `pypdf`.
3. **LangGraph StateGraph Workflow**:
   - Explain `backend/ai/graph.py` and the 5 sequential nodes in `backend/ai/nodes.py`.
   - Groq integration using `llama-3.3-70b-versatile` with structured JSON output enforcement.
4. **Database & Compliance**:
   - PostgreSQL schema in `backend/models.py` (`investigations` and `audit_logs`).
   - Immutable audit trail recording for regulatory inspections.
