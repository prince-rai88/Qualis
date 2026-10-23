import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  updateFormField,
  addContainmentAction,
  removeContainmentAction,
  toggleContainmentVerified,
} from '../store/slices/investigationSlice';
import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ContainmentAction } from '../types';

export const InvestigationDetailsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.investigations.current);
  const { appliedFieldKeys } = useAppSelector((state) => state.ai);

  // New Containment Form
  const [showAddContainment, setShowAddContainment] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('Quarantine');
  const [newTakenBy, setNewTakenBy] = useState('Shift Supervisor');

  const handleAddContainment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    const action: ContainmentAction = {
      id: 'cont-' + Date.now(),
      description: newDesc.trim(),
      action_type: newType,
      taken_by: newTakenBy,
      timestamp: new Date().toISOString().slice(0, 16),
      verified: true,
    };
    dispatch(addContainmentAction(action));
    setNewDesc('');
    setShowAddContainment(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Investigation Status Banner */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: current.severity === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: current.severity === 'Critical' ? '#f87171' : '#fbbf24',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {current.deviation_number || 'DEV-DRAFT'}
              </span>
              <span className={`badge badge-${current.severity.toLowerCase()}`}>
                {current.severity} Severity
              </span>
              <span className="badge badge-ai">
                Status: {current.status}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              API Quality Incident Investigation under cGMP 21 CFR Part 211.192 & ICH Q7 § 12.2
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="form-group" style={{ minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Workflow Status</label>
            <select
              className="form-select"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
              value={current.status}
              onChange={(e) => dispatch(updateFormField({ field: 'status', value: e.target.value as any }))}
            >
              <option value="Draft">Draft</option>
              <option value="In Investigation">In Investigation</option>
              <option value="Under QA Review">Under QA Review</option>
              <option value="CAPA Approved">CAPA Approved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Core Identification Form */}
      <div className="form-card">
        <div className="card-title-bar">
          <div className="card-title">
            <FileText size={18} color="#818cf8" />
            <span>Deviation Identification & Manufacturing Context</span>
          </div>
          {appliedFieldKeys.length > 0 && (
            <span style={{ fontSize: '0.75rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> {appliedFieldKeys.length} fields AI-assisted
            </span>
          )}
        </div>

        <div className="grid-3" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Deviation ID</span>
              {appliedFieldKeys.includes('deviation_number') && <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>AI</span>}
            </label>
            <input
              type="text"
              className={`form-input ${appliedFieldKeys.includes('deviation_number') ? 'ai-suggested-highlight' : ''}`}
              value={current.deviation_number}
              onChange={(e) => dispatch(updateFormField({ field: 'deviation_number', value: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Active Pharmaceutical Ingredient (API)</span>
              {appliedFieldKeys.includes('product_name') && <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>AI</span>}
            </label>
            <input
              type="text"
              className={`form-input ${appliedFieldKeys.includes('product_name') ? 'ai-suggested-highlight' : ''}`}
              placeholder="e.g. Atorvastatin Calcium Trihydrate"
              value={current.product_name}
              onChange={(e) => dispatch(updateFormField({ field: 'product_name', value: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Batch / Lot Number</span>
              {appliedFieldKeys.includes('batch_number') && <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>AI</span>}
            </label>
            <input
              type="text"
              className={`form-input ${appliedFieldKeys.includes('batch_number') ? 'ai-suggested-highlight' : ''}`}
              placeholder="e.g. B-ATV-260401"
              value={current.batch_number}
              onChange={(e) => dispatch(updateFormField({ field: 'batch_number', value: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label">
            <span>Deviation Incident Title</span>
            {appliedFieldKeys.includes('title') && <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>AI</span>}
          </label>
          <input
            type="text"
            className={`form-input ${appliedFieldKeys.includes('title') ? 'ai-suggested-highlight' : ''}`}
            placeholder="Technical summary of the quality failure..."
            value={current.title}
            onChange={(e) => dispatch(updateFormField({ field: 'title', value: e.target.value }))}
          />
        </div>

        <div className="grid-3" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Unit Operation / Mfg Step</span>
              {appliedFieldKeys.includes('manufacturing_step') && <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>AI</span>}
            </label>
            <input
              type="text"
              className={`form-input ${appliedFieldKeys.includes('manufacturing_step') ? 'ai-suggested-highlight' : ''}`}
              placeholder="e.g. Step 4: Crystallization & Isolation"
              value={current.manufacturing_step}
              onChange={(e) => dispatch(updateFormField({ field: 'manufacturing_step', value: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Equipment / Vessel ID</span>
              {appliedFieldKeys.includes('equipment_id') && <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>AI</span>}
            </label>
            <input
              type="text"
              className={`form-input ${appliedFieldKeys.includes('equipment_id') ? 'ai-suggested-highlight' : ''}`}
              placeholder="e.g. Reactor RX-402 (5,000L Glass-Lined)"
              value={current.equipment_id}
              onChange={(e) => dispatch(updateFormField({ field: 'equipment_id', value: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Occurrence Date & Time</label>
            <input
              type="text"
              className="form-input"
              value={current.occurrence_date}
              onChange={(e) => dispatch(updateFormField({ field: 'occurrence_date', value: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Severity Classification</label>
            <select
              className="form-select"
              value={current.severity}
              onChange={(e) => dispatch(updateFormField({ field: 'severity', value: e.target.value as any }))}
            >
              <option value="Critical">Critical (Immediate Patient/Quality Risk or OOS)</option>
              <option value="Major">Major (Process Parameter Excursion)</option>
              <option value="Minor">Minor (Non-critical Documentation/Operational)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reported By</label>
            <input
              type="text"
              className="form-input"
              value={current.reported_by}
              onChange={(e) => dispatch(updateFormField({ field: 'reported_by', value: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-input"
              value={current.department}
              onChange={(e) => dispatch(updateFormField({ field: 'department', value: e.target.value }))}
            />
          </div>
        </div>

        {/* Narrative / Description */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">
            <span>Detailed Technical Deviation Description</span>
            {appliedFieldKeys.includes('deviation_description') && <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>AI</span>}
          </label>
          <textarea
            className={`textarea-clean ${appliedFieldKeys.includes('deviation_description') ? 'ai-suggested-highlight' : ''}`}
            rows={4}
            value={current.deviation_description}
            onChange={(e) => dispatch(updateFormField({ field: 'deviation_description', value: e.target.value }))}
            placeholder="Detailed description of the excursion, telemetry observations, and analytical assay results..."
          />
        </div>
      </div>

      {/* Immediate Containment Actions Table */}
      <div className="form-card">
        <div className="card-title-bar">
          <div className="card-title">
            <AlertTriangle size={18} color="#fbbf24" />
            <span>Immediate Containment Actions (GMP § 211.192 Quarantine & Isolation)</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAddContainment(true)}>
            <Plus size={14} /> Add Containment Action
          </button>
        </div>

        {/* Add Form */}
        {showAddContainment && (
          <form
            onSubmit={handleAddContainment}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Action Type</label>
                <select className="form-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                  <option value="Quarantine">Quarantine (Physical/ERP Tag)</option>
                  <option value="Line Stop">Line Stop / Equipment LOTO</option>
                  <option value="Sample Retention">Sample Retention for Expanded QC</option>
                  <option value="Engineering Isolation">Engineering / Utility Isolation</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Action Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Quarantined 450 kg batch in warehouse room 4 under Yellow Tag #QT-2026-0199"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddContainment(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Containment Action
              </button>
            </div>
          </form>
        )}

        {/* Table of Containment Actions */}
        {current.immediate_containment.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No containment actions recorded yet. Use the AI Copilot to extract immediate containment or click "Add Containment Action" above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {current.immediate_containment.map((action, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="btn-icon"
                    style={{
                      background: action.verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                      color: action.verified ? '#34d399' : 'var(--text-muted)',
                      border: 'none',
                    }}
                    onClick={() => dispatch(toggleContainmentVerified(idx))}
                    title={action.verified ? 'Verified Active Containment' : 'Click to Verify'}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-minor">{action.action_type || 'Containment'}</span>
                      <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{action.description}</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      Enacted by: {action.taken_by || 'Operations Team'} • Status: {action.verified ? 'Verified Active' : 'Pending Verification'}
                    </div>
                  </div>
                </div>

                <button
                  className="btn-icon"
                  style={{ color: '#ef4444' }}
                  onClick={() => dispatch(removeContainmentAction(idx))}
                  title="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
