import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setActiveTab,
  updateFormField,
  toggleContainmentVerified,
  addContainmentAction,
  removeContainmentAction,
} from '../store/slices/investigationSlice';
import {
  FileText,
  GitBranch,
  ShieldAlert,
  CheckSquare,
  AlertOctagon,
  Shield,
  Layers,
  Edit3,
  X,
  Plus,
  CheckCircle2,
  Trash2,
  Building,
} from 'lucide-react';
import { RootCauseTab } from './RootCauseTab';
import { EvidenceGapsTab } from './EvidenceGapsTab';
import { CAPATab } from './CAPATab';
import { ContainmentAction } from '../types';

interface Props {
  isCopilotDrawerOpen: boolean;
  onCloseCopilotDrawer: () => void;
}

export const WorkspaceView: React.FC<Props> = ({
  isCopilotDrawerOpen,
  onCloseCopilotDrawer,
}) => {
  const dispatch = useAppDispatch();
  const { current, activeTab } = useAppSelector((state) => state.investigations);

  // Drawer for full incident details
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  // New Containment Form
  const [showAddContainment, setShowAddContainment] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('Quarantine');

  const handleAddContainment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    const action: ContainmentAction = {
      id: 'cont-' + Date.now(),
      description: newDesc.trim(),
      action_type: newType,
      taken_by: 'Shift Supervisor',
      timestamp: new Date().toISOString().slice(0, 16),
      verified: true,
    };
    dispatch(addContainmentAction(action));
    setNewDesc('');
    setShowAddContainment(false);
  };

  return (
    <div className="workspace-wrapper">
      {/* Subheader: Deviation Identifier & Primary Context */}
      <div className="workspace-subheader">
        <div className="workspace-title-group">
          <span className="workspace-id">{current.deviation_number}</span>
          <span className={`badge badge-${current.severity?.toLowerCase() || 'minor'}`}>
            {current.severity} Severity
          </span>
          <span className="badge badge-neutral">
            {current.status}
          </span>
          <span className="workspace-title-text">• {current.title}</span>
        </div>

        <div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsDetailsDrawerOpen(true)}
          >
            <Edit3 size={13} />
            <span>Review incident details</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="workspace-nav-bar">
        <div className="workspace-tabs">
          <button
            className={`ws-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('overview'))}
          >
            <FileText size={15} />
            <span>Overview</span>
          </button>

          <button
            className={`ws-tab-btn ${activeTab === 'root_cause' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('root_cause'))}
          >
            <GitBranch size={15} />
            <span>Root Cause Analysis</span>
          </button>

          <button
            className={`ws-tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('evidence'))}
          >
            <ShieldAlert size={15} />
            <span>Evidence ({current.missing_evidence?.length || 0})</span>
          </button>

          <button
            className={`ws-tab-btn ${activeTab === 'capa' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('capa'))}
          >
            <CheckSquare size={15} />
            <span>CAPA ({current.capa_recommendations?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Workspace Body */}
      <div className="workspace-body">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Primary Root Cause Highlight Banner */}
            <div
              className="ws-card"
              style={{
                background: 'rgba(244, 63, 94, 0.07)',
                borderColor: 'var(--critical-border)',
                boxShadow: '0 0 30px rgba(244, 63, 94, 0.12), var(--glass-shadow)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--critical-text)', fontWeight: 600, fontSize: '0.84rem' }}>
                <AlertOctagon size={16} />
                <span>Primary Systemic Root Cause (ICH Q7 § 12.2)</span>
              </div>
              <p style={{ fontSize: '0.94rem', color: '#ffffff', lineHeight: '1.6' }}>
                {current.suspected_root_cause || 'Root cause investigation in progress.'}
              </p>
            </div>

            {/* Key Parameters Cards */}
            <div className="params-grid">
              <div className="param-item">
                <span className="param-label">API Product</span>
                <span className="param-value">{current.product_name || 'N/A'}</span>
              </div>
              <div className="param-item">
                <span className="param-label">Batch / Lot #</span>
                <span className="param-value">{current.batch_number || 'N/A'}</span>
              </div>
              <div className="param-item">
                <span className="param-label">Manufacturing Step</span>
                <span className="param-value">{current.manufacturing_step || 'N/A'}</span>
              </div>
              <div className="param-item">
                <span className="param-label">Equipment / Vessel</span>
                <span className="param-value">{current.equipment_id || 'N/A'}</span>
              </div>
            </div>

            {/* Narrative Summary */}
            <div className="ws-card">
              <div className="ws-card-header">
                <div className="ws-card-title">
                  <FileText size={16} />
                  <span>Technical Description & Chronology</span>
                </div>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {current.deviation_description || 'No description provided.'}
              </div>
            </div>

            {/* Immediate Containment Actions */}
            <div className="ws-card">
              <div className="ws-card-header">
                <div className="ws-card-title">
                  <Shield size={16} />
                  <span>Immediate Containment Actions (GMP § 211.192 Quarantine)</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddContainment(true)}
                >
                  <Plus size={13} /> Add action
                </button>
              </div>

              {showAddContainment && (
                <form
                  onSubmit={handleAddContainment}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '10px' }}>
                    <select
                      className="form-select"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                    >
                      <option value="Quarantine">Quarantine</option>
                      <option value="Line Stop">Line Stop</option>
                      <option value="Sample Retention">Sample Retention</option>
                      <option value="Equipment LOTO">Equipment LOTO</option>
                    </select>

                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Quarantined 450 kg batch in warehouse room 4 under Yellow Tag #QT-2026-0199"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowAddContainment(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Containment
                    </button>
                  </div>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {current.immediate_containment.length === 0 ? (
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', padding: '12px 0' }}>
                    No immediate containment actions recorded.
                  </div>
                ) : (
                  current.immediate_containment.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
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
                            color: c.verified ? 'var(--success-text)' : 'var(--text-muted)',
                            background: c.verified ? 'var(--success-bg)' : 'transparent',
                            borderColor: c.verified ? 'var(--success-border)' : 'var(--glass-border)',
                          }}
                          onClick={() => dispatch(toggleContainmentVerified(idx))}
                          title={c.verified ? 'Verified Active' : 'Click to Verify'}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <div>
                          <span className="badge badge-neutral" style={{ marginRight: '8px' }}>
                            {c.action_type || 'Containment'}
                          </span>
                          <span style={{ fontSize: '0.86rem', color: '#ffffff' }}>{c.description}</span>
                        </div>
                      </div>

                      <button
                        className="btn-icon"
                        style={{ color: 'var(--critical-text)' }}
                        onClick={() => dispatch(removeContainmentAction(idx))}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROOT CAUSE ANALYSIS */}
        {activeTab === 'root_cause' && <RootCauseTab />}

        {/* TAB 3: EVIDENCE */}
        {activeTab === 'evidence' && <EvidenceGapsTab />}

        {/* TAB 4: CAPA */}
        {activeTab === 'capa' && <CAPATab />}
      </div>

      {/* Slide-over Drawer: Review & Edit Full Incident Details */}
      {isDetailsDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDetailsDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>Incident Details</h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Edit underlying GMP deviation metadata</p>
              </div>
              <button className="btn-icon" onClick={() => setIsDetailsDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="form-group">
                <label className="form-label">Deviation Identifier</label>
                <input
                  type="text"
                  className="form-input"
                  value={current.deviation_number}
                  onChange={(e) => dispatch(updateFormField({ field: 'deviation_number', value: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Incident Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={current.title}
                  onChange={(e) => dispatch(updateFormField({ field: 'title', value: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Active Pharmaceutical Ingredient (API)</label>
                <input
                  type="text"
                  className="form-input"
                  value={current.product_name}
                  onChange={(e) => dispatch(updateFormField({ field: 'product_name', value: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Batch / Lot Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={current.batch_number}
                  onChange={(e) => dispatch(updateFormField({ field: 'batch_number', value: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Manufacturing Step</label>
                <input
                  type="text"
                  className="form-input"
                  value={current.manufacturing_step}
                  onChange={(e) => dispatch(updateFormField({ field: 'manufacturing_step', value: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Equipment / Vessel Tag</label>
                <input
                  type="text"
                  className="form-input"
                  value={current.equipment_id}
                  onChange={(e) => dispatch(updateFormField({ field: 'equipment_id', value: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Severity Classification</label>
                <select
                  className="form-select"
                  value={current.severity}
                  onChange={(e) => dispatch(updateFormField({ field: 'severity', value: e.target.value as any }))}
                >
                  <option value="Critical">Critical</option>
                  <option value="Major">Major</option>
                  <option value="Minor">Minor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Narrative</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={current.deviation_description}
                  onChange={(e) => dispatch(updateFormField({ field: 'deviation_description', value: e.target.value }))}
                />
              </div>
            </div>

            <div className="drawer-footer">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsDetailsDrawerOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
