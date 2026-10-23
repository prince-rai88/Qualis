import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setInputText,
  setSourceType,
  uploadPdfFile,
  loadPresetData,
  runAIFullPipeline,
} from '../store/slices/aiSlice';
import {
  setCurrentView,
  fetchInvestigationById,
  updateFormField,
  setFiveWhys,
  setFishboneData,
  setMissingEvidence,
  setCAPARecommendations,
} from '../store/slices/investigationSlice';
import {
  ArrowRight,
  FileText,
  Mail,
  Sparkles,
  Paperclip,
  X,
  Zap,
  Shield,
  GitBranch,
  Clock,
  ChevronRight,
  Database,
} from 'lucide-react';
import { Investigation } from '../types';

export const HomeView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rawInputText, sourceType, filename, presets, isProcessing } = useAppSelector(
    (state) => state.ai
  );
  const { list } = useAppSelector((state) => state.investigations);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      dispatch(uploadPdfFile(e.target.files[0]));
    }
  };

  const handleStartInvestigation = async () => {
    if (!rawInputText.trim()) return;

    // Transition immediately to the focused AI Processing screen
    dispatch(setCurrentView('processing'));

    // Execute the full LangGraph pipeline
    const resultAction = await dispatch(runAIFullPipeline());
    if (runAIFullPipeline.fulfilled.match(resultAction)) {
      const res = resultAction.payload;

      // Populate extracted fields into the active investigation form
      if (res.extracted_fields) {
        const fields = res.extracted_fields;
        if (fields.deviation_number) dispatch(updateFormField({ field: 'deviation_number', value: fields.deviation_number }));
        if (fields.title) dispatch(updateFormField({ field: 'title', value: fields.title }));
        if (fields.product_name) dispatch(updateFormField({ field: 'product_name', value: fields.product_name }));
        if (fields.batch_number) dispatch(updateFormField({ field: 'batch_number', value: fields.batch_number }));
        if (fields.manufacturing_step) dispatch(updateFormField({ field: 'manufacturing_step', value: fields.manufacturing_step }));
        if (fields.equipment_id) dispatch(updateFormField({ field: 'equipment_id', value: fields.equipment_id }));
        if (fields.occurrence_date) dispatch(updateFormField({ field: 'occurrence_date', value: fields.occurrence_date }));
        if (fields.reported_by) dispatch(updateFormField({ field: 'reported_by', value: fields.reported_by }));
        if (fields.department) dispatch(updateFormField({ field: 'department', value: fields.department }));
        if (fields.severity) dispatch(updateFormField({ field: 'severity', value: fields.severity }));
        if (fields.deviation_description) dispatch(updateFormField({ field: 'deviation_description', value: fields.deviation_description }));
        if (fields.immediate_containment) dispatch(updateFormField({ field: 'immediate_containment', value: fields.immediate_containment }));
      }

      if (res.five_whys_data) dispatch(setFiveWhys(res.five_whys_data));
      if (res.suspected_root_cause) dispatch(updateFormField({ field: 'suspected_root_cause', value: res.suspected_root_cause }));
      if (res.contributing_factors) dispatch(updateFormField({ field: 'contributing_factors', value: res.contributing_factors }));
      if (res.fishbone_data) dispatch(setFishboneData(res.fishbone_data));
      if (res.missing_evidence) dispatch(setMissingEvidence(res.missing_evidence));
      if (res.capa_recommendations) dispatch(setCAPARecommendations(res.capa_recommendations));

      // Transition smoothly into workspace
      setTimeout(() => {
        dispatch(setCurrentView('workspace'));
      }, 800);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    dispatch(loadPresetData(presetId));
  };

  const handleOpenExisting = (inv: Investigation) => {
    if (inv.id) {
      dispatch(fetchInvestigationById(inv.id));
    }
  };

  // Helper metadata for presets
  const getPresetMeta = (index: number) => {
    const meta = [
      { tag: 'API Fermentation', batch: 'Batch #PAR-2024-089', severity: 'critical' },
      { tag: 'Solvent Recovery', batch: 'Batch #AMX-2024-042', severity: 'major' },
      { tag: 'Fluidized Drying', batch: 'Batch #MET-2024-118', severity: 'minor' },
    ];
    return meta[index] || { tag: 'Active Synthesis', batch: 'Batch #API-GEN', severity: 'major' };
  };

  return (
    <div className="home-container">
      {/* Central Hero Heading */}
      <div className="home-hero">
        <div className="hero-eyebrow-chip">
          <span className="pulse-dot" />
          <span>QUALIS INTELLIGENCE CORE v2.4 • cGMP 21 CFR PART 11</span>
        </div>

        <h1 className="home-headline">What happened in this batch?</h1>

        <p className="home-subhead">
          Autonomous AI-assisted Root Cause Analysis and CAPA management engineered for Active Pharmaceutical Ingredient (API) manufacturing.
        </p>

        {/* High-Tech Capabilities Ribbon */}
        <div className="features-ribbon">
          <div className="feature-pill">
            <Zap size={13} style={{ color: '#2997ff' }} />
            <span>5-Stage LangGraph AI</span>
          </div>
          <div className="feature-pill">
            <Shield size={13} style={{ color: '#30d158' }} />
            <span>ICH Q9 / Q10 Compliant</span>
          </div>
          <div className="feature-pill">
            <GitBranch size={13} style={{ color: '#bf5af2' }} />
            <span>6M Ishikawa Matrix</span>
          </div>
          <div className="feature-pill">
            <Clock size={13} style={{ color: '#ff9f0a' }} />
            <span>Autonomous Synthesis</span>
          </div>
        </div>
      </div>

      {/* Primary Multiline Investigation Input Box */}
      <div className="deviation-input-box">
        <textarea
          className="deviation-textarea"
          rows={5}
          placeholder="Describe the deviation, paste the shift handover report, SCADA alarm chronology, or attach an incident document..."
          value={rawInputText}
          onChange={(e) => dispatch(setInputText(e.target.value))}
        />

        {/* Input Attachments / Mode Bar */}
        <div className="deviation-input-footer">
          <div className="input-modes">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              style={{ display: 'none' }}
            />

            <button
              className={`mode-btn ${sourceType === 'text' ? 'active' : ''}`}
              onClick={() => dispatch(setSourceType('text'))}
            >
              <FileText size={13} /> Text Narrative
            </button>

            <button
              className={`mode-btn ${sourceType === 'pdf' ? 'active' : ''}`}
              onClick={() => {
                dispatch(setSourceType('pdf'));
                fileInputRef.current?.click();
              }}
            >
              <Paperclip size={13} /> PDF Document
            </button>

            <button
              className={`mode-btn ${sourceType === 'email' ? 'active' : ''}`}
              onClick={() => dispatch(setSourceType('email'))}
            >
              <Mail size={13} /> Email Memo
            </button>

            {filename && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent-text)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                }}
              >
                {filename}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => dispatch(setInputText(''))}
                />
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {rawInputText.length > 0 ? `${rawInputText.length} characters` : 'Ready for input'}
            </span>

            <button
              className="btn btn-primary"
              onClick={handleStartInvestigation}
              disabled={!rawInputText.trim() || isProcessing}
            >
              <Sparkles size={14} />
              <span>Synthesize RCA</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Try a Sample Investigation */}
      <div className="samples-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-label">Try a verified benchmark investigation</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click to auto-populate</span>
        </div>

        <div className="samples-grid">
          {presets.map((preset, idx) => {
            const meta = getPresetMeta(idx);
            return (
              <div
                key={preset.id}
                className="sample-card"
                onClick={() => handleSelectPreset(preset.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge badge-${meta.severity}`}>
                    {meta.severity.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {meta.batch}
                  </span>
                </div>

                <div>
                  <h4 className="sample-card-title">{preset.product}</h4>
                  <div style={{ fontSize: '0.72rem', color: '#5ac8fa', marginTop: '2px' }}>
                    {meta.tag}
                  </div>
                </div>

                <p className="sample-card-desc">{preset.description}</p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#5ac8fa', fontSize: '0.75rem', fontWeight: 500 }}>
                  <span>Load scenario</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Investigations List */}
      <div className="recent-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-label">Recent Investigations</div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <Database size={13} />
            {list.length} saved in PostgreSQL
          </span>
        </div>

        <div className="recent-table-card">
          <div className="recent-row recent-header-row">
            <div>Deviation ID</div>
            <div>Product & Batch</div>
            <div>Primary Cause / Title</div>
            <div>Severity</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {list.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No recent investigations recorded in PostgreSQL database.
            </div>
          ) : (
            list.map((inv) => (
              <div
                key={inv.id}
                className="recent-row"
                onClick={() => handleOpenExisting(inv)}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#5ac8fa' }}>
                  {inv.deviation_number}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{inv.product_name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inv.batch_number}</div>
                </div>
                <div style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {inv.suspected_root_cause ? inv.suspected_root_cause.slice(0, 75) + '...' : inv.title}
                </div>
                <div>
                  <span className={`badge badge-${inv.severity?.toLowerCase() || 'minor'}`}>
                    {inv.severity}
                  </span>
                </div>
                <div>
                  <span className="badge badge-neutral">
                    {inv.status}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#5ac8fa', fontSize: '0.76rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    Open <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
