import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setInputText,
  setSourceType,
  uploadPdfFile,
  runAIExtraction,
  runAIFishbone,
  runAIFiveWhys,
  runAIGaps,
  runAICapa,
  runAIFullPipeline,
  sendCopilotMessage,
  markFieldApplied,
  markAllFieldsApplied,
  loadPresetData,
} from '../store/slices/aiSlice';
import {
  updateFormField,
  addContainmentAction,
  setFishboneData,
  setFiveWhys,
  setMissingEvidence,
  setCAPARecommendations,
  setActiveTab,
} from '../store/slices/investigationSlice';
import {
  Sparkles,
  Upload,
  FileText,
  Mail,
  Play,
  CheckCircle,
  ArrowRight,
  Send,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Check,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export const AICopilotPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    rawInputText,
    sourceType,
    filename,
    presets,
    currentStep,
    isProcessing,
    processingTask,
    progressPercent,
    extractedFields,
    appliedFieldKeys,
    aiFishbone,
    aiFiveWhys,
    aiSuspectedRootCause,
    aiContributingFactors,
    aiMissingEvidence,
    aiCapaRecommendations,
    chatMessages,
    chatLoading,
  } = useAppSelector((state) => state.ai);

  const currentInvestigation = useAppSelector((state) => state.investigations.current);
  const [chatInput, setChatInput] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      dispatch(uploadPdfFile(file));
    }
  };

  // Pipeline Triggers
  const handleRunFullPipeline = async () => {
    if (!rawInputText.trim()) return;
    await dispatch(runAIFullPipeline());
  };

  const handleStepExtract = () => {
    dispatch(runAIExtraction());
  };

  const handleStepFishbone = () => {
    dispatch(runAIFishbone());
  };

  const handleStepFiveWhys = () => {
    dispatch(runAIFiveWhys());
  };

  const handleStepGaps = () => {
    dispatch(runAIGaps());
  };

  const handleStepCapa = () => {
    dispatch(runAICapa());
  };

  // Apply Individual Extracted Field to Form
  const handleApplyField = (key: string, value: any) => {
    if (key === 'immediate_containment') {
      if (Array.isArray(value)) {
        value.forEach((item) => dispatch(addContainmentAction(item)));
      }
    } else {
      dispatch(updateFormField({ field: key as any, value }));
    }
    dispatch(markFieldApplied(key));
  };

  // Apply All Extracted Fields to Form
  const handleApplyAllFields = () => {
    if (!extractedFields) return;
    const keysToApply: string[] = [];

    if (extractedFields.deviation_number) {
      dispatch(updateFormField({ field: 'deviation_number', value: extractedFields.deviation_number }));
      keysToApply.push('deviation_number');
    }
    if (extractedFields.title) {
      dispatch(updateFormField({ field: 'title', value: extractedFields.title }));
      keysToApply.push('title');
    }
    if (extractedFields.product_name) {
      dispatch(updateFormField({ field: 'product_name', value: extractedFields.product_name }));
      keysToApply.push('product_name');
    }
    if (extractedFields.batch_number) {
      dispatch(updateFormField({ field: 'batch_number', value: extractedFields.batch_number }));
      keysToApply.push('batch_number');
    }
    if (extractedFields.manufacturing_step) {
      dispatch(updateFormField({ field: 'manufacturing_step', value: extractedFields.manufacturing_step }));
      keysToApply.push('manufacturing_step');
    }
    if (extractedFields.equipment_id) {
      dispatch(updateFormField({ field: 'equipment_id', value: extractedFields.equipment_id }));
      keysToApply.push('equipment_id');
    }
    if (extractedFields.occurrence_date) {
      dispatch(updateFormField({ field: 'occurrence_date', value: extractedFields.occurrence_date }));
      keysToApply.push('occurrence_date');
    }
    if (extractedFields.reported_by) {
      dispatch(updateFormField({ field: 'reported_by', value: extractedFields.reported_by }));
      keysToApply.push('reported_by');
    }
    if (extractedFields.department) {
      dispatch(updateFormField({ field: 'department', value: extractedFields.department }));
      keysToApply.push('department');
    }
    if (extractedFields.severity) {
      dispatch(updateFormField({ field: 'severity', value: extractedFields.severity }));
      keysToApply.push('severity');
    }
    if (extractedFields.deviation_description) {
      dispatch(updateFormField({ field: 'deviation_description', value: extractedFields.deviation_description }));
      keysToApply.push('deviation_description');
    }
    if (extractedFields.immediate_containment) {
      dispatch(updateFormField({ field: 'immediate_containment', value: extractedFields.immediate_containment }));
      keysToApply.push('immediate_containment');
    }

    dispatch(markAllFieldsApplied(keysToApply));
  };

  // Apply Fishbone to Form
  const handleApplyFishbone = () => {
    if (aiFishbone) {
      dispatch(setFishboneData(aiFishbone));
      dispatch(setActiveTab('root_cause'));
    }
  };

  // Apply 5 Whys to Form
  const handleApplyFiveWhys = () => {
    if (aiFiveWhys) {
      dispatch(setFiveWhys(aiFiveWhys));
      if (aiSuspectedRootCause) {
        dispatch(updateFormField({ field: 'suspected_root_cause', value: aiSuspectedRootCause }));
      }
      if (aiContributingFactors) {
        dispatch(updateFormField({ field: 'contributing_factors', value: aiContributingFactors }));
      }
      dispatch(setActiveTab('root_cause'));
    }
  };

  // Apply Gaps to Form
  const handleApplyGaps = () => {
    if (aiMissingEvidence) {
      dispatch(setMissingEvidence(aiMissingEvidence));
      dispatch(setActiveTab('evidence_gaps'));
    }
  };

  // Apply CAPA to Form
  const handleApplyCapa = () => {
    if (aiCapaRecommendations) {
      dispatch(setCAPARecommendations(aiCapaRecommendations));
      dispatch(setActiveTab('capa'));
    }
  };

  // Send Copilot Chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    dispatch(sendCopilotMessage({ message: chatInput.trim(), context: currentInvestigation }));
    setChatInput('');
  };

  return (
    <aside className="ai-copilot-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title">
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', padding: '6px', borderRadius: '8px', color: 'white' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>AI Investigation Copilot</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LangGraph + Groq cGMP Intelligence</div>
          </div>
        </div>
        <span className="badge badge-ai">v1.2 Agent</span>
      </div>

      <div className="panel-body">
        {/* Document Intake Selector */}
        <div className="form-group">
          <label className="form-label">
            <span>Evidence Intake Source</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>PDF / Raw Text / Shift Email</span>
          </label>
          <div className="intake-tabs">
            <button
              className={`intake-tab-btn ${sourceType === 'pdf' ? 'active' : ''}`}
              onClick={() => dispatch(setSourceType('pdf'))}
            >
              <Upload size={14} /> Upload PDF
            </button>
            <button
              className={`intake-tab-btn ${sourceType === 'text' ? 'active' : ''}`}
              onClick={() => dispatch(setSourceType('text'))}
            >
              <FileText size={14} /> Pasted Text
            </button>
            <button
              className={`intake-tab-btn ${sourceType === 'email' ? 'active' : ''}`}
              onClick={() => dispatch(setSourceType('email'))}
            >
              <Mail size={14} /> Email Memo
            </button>
          </div>
        </div>

        {/* Upload Dropzone if PDF selected */}
        {sourceType === 'pdf' && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              style={{ display: 'none' }}
            />
            <div className="file-dropzone" onClick={() => fileInputRef.current?.click()}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '50%', color: '#818cf8' }}>
                <Upload size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {filename ? filename : 'Drop incident PDF or click to browse'}
                </strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Extracts deviation logs, BPR batch extracts, and HPLC certificates
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Raw Text Input Box */}
        <div className="form-group">
          <label className="form-label">
            <span>Incident Description / Evidence Text</span>
            {rawInputText && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{rawInputText.length} chars</span>
            )}
          </label>
          <textarea
            className="textarea-clean"
            rows={5}
            placeholder="Paste investigation report, SCADA alarm logs, operator interview notes, or quality deviation email here..."
            value={rawInputText}
            onChange={(e) => dispatch(setInputText(e.target.value))}
          />
        </div>

        {/* Quick Sample Preset Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Quick API Pharma Test Scenarios
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {presets.map((p) => (
              <button
                key={p.id}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.7rem', padding: '6px 8px', whiteSpace: 'normal', height: '100%', textAlign: 'center' }}
                onClick={() => dispatch(loadPresetData(p.id))}
              >
                {p.product.split(' ')[0]} API
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
              AI Investigation Workflow
            </span>
            <span style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 600 }}>
              {progressPercent}% Complete
            </span>
          </div>

          <div className="stepper-nav">
            <div className="stepper-progress-bg">
              <div className="stepper-progress-bar" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className={`step-node ${extractedFields ? 'completed' : 'current'}`} onClick={handleStepExtract}>
              <div className="step-bubble">{extractedFields ? <Check size={14} /> : '1'}</div>
              <span className="step-label">Extract</span>
            </div>

            <div className={`step-node ${aiFishbone ? 'completed' : currentStep >= 2 ? 'current' : ''}`} onClick={handleStepFishbone}>
              <div className="step-bubble">{aiFishbone ? <Check size={14} /> : '2'}</div>
              <span className="step-label">Fishbone</span>
            </div>

            <div className={`step-node ${aiFiveWhys ? 'completed' : currentStep >= 3 ? 'current' : ''}`} onClick={handleStepFiveWhys}>
              <div className="step-bubble">{aiFiveWhys ? <Check size={14} /> : '3'}</div>
              <span className="step-label">5 Whys</span>
            </div>

            <div className={`step-node ${aiMissingEvidence ? 'completed' : currentStep >= 4 ? 'current' : ''}`} onClick={handleStepGaps}>
              <div className="step-bubble">{aiMissingEvidence ? <Check size={14} /> : '4'}</div>
              <span className="step-label">Gaps</span>
            </div>

            <div className={`step-node ${aiCapaRecommendations ? 'completed' : currentStep >= 5 ? 'current' : ''}`} onClick={handleStepCapa}>
              <div className="step-bubble">{aiCapaRecommendations ? <Check size={14} /> : '5'}</div>
              <span className="step-label">CAPA</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button: Run Full LangGraph Pipeline */}
        <div>
          <button
            className="btn btn-primary pulse-glow"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
            onClick={handleRunFullPipeline}
            disabled={isProcessing || !rawInputText.trim()}
          >
            <Play size={16} fill="white" />
            <span>{isProcessing ? processingTask || 'Processing...' : 'Run Full AI RCA Pipeline'}</span>
          </button>
        </div>

        {/* Live Processing Indicator */}
        {isProcessing && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--border-ai)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#c7d2fe',
            }}
          >
            <Cpu size={18} className="spin-slow" />
            <span>{processingTask}</span>
          </div>
        )}

        {/* STEP 1: Extracted Fields Review & Acceptance Section */}
        {extractedFields && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="#10b981" />
                <span>Extracted Deviation Fields</span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                onClick={handleApplyAllFields}
              >
                Apply All to Form
              </button>
            </div>

            {/* Deviation # */}
            {extractedFields.deviation_number && (
              <div className="extraction-card">
                <div className="extraction-header">
                  <span className="field-pill">Deviation Number</span>
                  <div className="confidence-meter">
                    <span>99% Conf.</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                      onClick={() => handleApplyField('deviation_number', extractedFields.deviation_number)}
                    >
                      {appliedFieldKeys.includes('deviation_number') ? <Check size={12} /> : 'Apply'}
                    </button>
                  </div>
                </div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{extractedFields.deviation_number}</strong>
              </div>
            )}

            {/* Title */}
            {extractedFields.title && (
              <div className="extraction-card">
                <div className="extraction-header">
                  <span className="field-pill">Incident Title</span>
                  <div className="confidence-meter">
                    <span>95% Conf.</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                      onClick={() => handleApplyField('title', extractedFields.title)}
                    >
                      {appliedFieldKeys.includes('title') ? <Check size={12} /> : 'Apply'}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#ffffff' }}>{extractedFields.title}</div>
                {extractedFields.evidence_citations?.title && (
                  <div className="citation-box">"{extractedFields.evidence_citations.title}"</div>
                )}
              </div>
            )}

            {/* Product & Batch */}
            <div className="grid-2">
              {extractedFields.product_name && (
                <div className="extraction-card">
                  <div className="extraction-header">
                    <span className="field-pill">Product</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                      onClick={() => handleApplyField('product_name', extractedFields.product_name)}
                    >
                      {appliedFieldKeys.includes('product_name') ? <Check size={11} /> : 'Apply'}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{extractedFields.product_name}</div>
                </div>
              )}
              {extractedFields.batch_number && (
                <div className="extraction-card">
                  <div className="extraction-header">
                    <span className="field-pill">Batch #</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                      onClick={() => handleApplyField('batch_number', extractedFields.batch_number)}
                    >
                      {appliedFieldKeys.includes('batch_number') ? <Check size={11} /> : 'Apply'}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{extractedFields.batch_number}</div>
                </div>
              )}
            </div>

            {/* Step & Equipment */}
            <div className="grid-2">
              {extractedFields.manufacturing_step && (
                <div className="extraction-card">
                  <div className="extraction-header">
                    <span className="field-pill">Mfg Step</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                      onClick={() => handleApplyField('manufacturing_step', extractedFields.manufacturing_step)}
                    >
                      {appliedFieldKeys.includes('manufacturing_step') ? <Check size={11} /> : 'Apply'}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>{extractedFields.manufacturing_step}</div>
                </div>
              )}
              {extractedFields.equipment_id && (
                <div className="extraction-card">
                  <div className="extraction-header">
                    <span className="field-pill">Equipment</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                      onClick={() => handleApplyField('equipment_id', extractedFields.equipment_id)}
                    >
                      {appliedFieldKeys.includes('equipment_id') ? <Check size={11} /> : 'Apply'}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>{extractedFields.equipment_id}</div>
                </div>
              )}
            </div>

            {/* Severity Pill */}
            {extractedFields.severity && (
              <div className="extraction-card">
                <div className="extraction-header">
                  <span className="field-pill">Severity Assessment</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                    onClick={() => handleApplyField('severity', extractedFields.severity)}
                  >
                    {appliedFieldKeys.includes('severity') ? <Check size={12} /> : 'Apply'}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-${extractedFields.severity.toLowerCase()}`}>
                    {extractedFields.severity} Severity
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    GMP ICH Q7 Classification
                  </span>
                </div>
              </div>
            )}

            {/* Immediate Containment Actions */}
            {extractedFields.immediate_containment && extractedFields.immediate_containment.length > 0 && (
              <div className="extraction-card">
                <div className="extraction-header">
                  <span className="field-pill">Immediate Containment ({extractedFields.immediate_containment.length})</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                    onClick={() => handleApplyField('immediate_containment', extractedFields.immediate_containment)}
                  >
                    {appliedFieldKeys.includes('immediate_containment') ? <Check size={12} /> : 'Apply Containment'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {extractedFields.immediate_containment.map((c, i) => (
                    <div key={i} style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>•</span>
                      <span><strong>[{c.action_type || 'Quarantine'}]:</strong> {c.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 & 3: Root Cause Findings Card */}
        {(aiFishbone || aiFiveWhys) && (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} /> Root Cause Investigation Ready
              </div>
            </div>

            {aiSuspectedRootCause && (
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>
                  Suspected Systemic Root Cause
                </div>
                <div style={{ fontSize: '0.78rem', color: '#fecaca', marginTop: '4px', lineHeight: '1.4' }}>
                  {aiSuspectedRootCause}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {aiFishbone && (
                <button className="btn btn-secondary btn-sm" onClick={handleApplyFishbone}>
                  Apply 6M Fishbone
                </button>
              )}
              {aiFiveWhys && (
                <button className="btn btn-secondary btn-sm" onClick={handleApplyFiveWhys}>
                  Apply 5 Whys Chain
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Missing Evidence Card */}
        {aiMissingEvidence && aiMissingEvidence.length > 0 && (
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} /> {aiMissingEvidence.length} Regulatory Gaps Flagged
              </div>
              <button className="btn btn-outline btn-sm" style={{ padding: '3px 8px', fontSize: '0.7rem' }} onClick={handleApplyGaps}>
                Apply to Form
              </button>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              Critical documents (SCADA logs, OEM failure reports, re-testing) needed before closing per 21 CFR 211.192.
            </div>
          </div>
        )}

        {/* STEP 5: CAPA Recommendations Card */}
        {aiCapaRecommendations && aiCapaRecommendations.length > 0 && (
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> {aiCapaRecommendations.length} CAPAs Formulated
              </div>
              <button className="btn btn-outline btn-sm" style={{ padding: '3px 8px', fontSize: '0.7rem' }} onClick={handleApplyCapa}>
                Apply to Form
              </button>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              Includes Corrective containment and systemic Preventive recurrence controls with quantifiable effectiveness checks.
            </div>
          </div>
        )}

        {/* Collapsible Copilot Chat Assistant */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '6px 0',
            }}
            onClick={() => setChatExpanded(!chatExpanded)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#a5b4fc' }}>
              <MessageSquare size={16} />
              <span>Ask Quality Copilot</span>
            </div>
            {chatExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>

          {chatExpanded && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                }}
              >
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? '#4f46e5' : '#1e293b',
                      color: msg.sender === 'user' ? 'white' : '#cbd5e1',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      maxWidth: '85%',
                      lineHeight: '1.4',
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontStyle: 'italic' }}>
                    Quality Copilot is consulting GMP regulations...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  placeholder="Ask about ICH Q7, OOS rules, or testing..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={chatLoading || !chatInput.trim()}>
                  <Send size={13} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
