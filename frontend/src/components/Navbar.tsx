import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchInvestigationById,
  startNewInvestigation,
  saveCurrentInvestigation,
  setViewMode,
  clearSaveSuccess,
} from '../store/slices/investigationSlice';
import { loadPresetData } from '../store/slices/aiSlice';
import {
  Activity,
  Plus,
  Save,
  Key,
  ShieldCheck,
  FileCheck,
  Columns,
  Maximize2,
  Minimize2,
  Check,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onOpenGroqModal: () => void;
  onOpenQPSignoffModal: () => void;
  onOpenAuditModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  onOpenGroqModal,
  onOpenQPSignoffModal,
  onOpenAuditModal,
}) => {
  const dispatch = useAppDispatch();
  const { current, list, activeId, saving, saveSuccessMessage, viewMode } = useAppSelector(
    (state) => state.investigations
  );
  const { isGroqConnected, presets } = useAppSelector((state) => state.ai);

  const handleSelectInvestigation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    if (!isNaN(id)) {
      dispatch(fetchInvestigationById(id));
    }
  };

  const handleNew = () => {
    dispatch(startNewInvestigation());
  };

  const handleSave = async () => {
    await dispatch(saveCurrentInvestigation());
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.1 },
    });
    setTimeout(() => {
      dispatch(clearSaveSuccess());
    }, 4000);
  };

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      dispatch(loadPresetData(val));
    }
  };

  return (
    <header className="app-header">
      {/* Brand & Title */}
      <div className="brand-wrapper">
        <div className="brand-logo-icon">
          <Activity size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">Qualis AI</span>
            <span className="brand-badge">cGMP Pharma RCA</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>
            Active Pharmaceutical Ingredient (API) Quality Intelligence
          </div>
        </div>
      </div>

      {/* Center Controls: Investigation Selector & Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Investigation Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <select
            className="form-select"
            style={{ padding: '6px 10px', fontSize: '0.78rem', minWidth: '220px', background: 'rgba(30, 41, 59, 0.8)' }}
            value={activeId || ''}
            onChange={handleSelectInvestigation}
          >
            {list.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.deviation_number} - {inv.product_name?.slice(0, 18) || 'Draft'} ({inv.severity})
              </option>
            ))}
            {!activeId && <option value="">New / Unsaved Deviation</option>}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={handleNew} title="Start New Deviation Investigation">
            <Plus size={15} /> New
          </button>
        </div>

        {/* Quick API Scenario Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <select
            className="form-select"
            style={{
              padding: '6px 10px',
              fontSize: '0.78rem',
              borderColor: 'rgba(99, 102, 241, 0.4)',
              background: 'rgba(99, 102, 241, 0.08)',
              color: '#c7d2fe',
            }}
            defaultValue=""
            onChange={handleSelectPreset}
          >
            <option value="" disabled>
              ⚡ Load Preset API Deviation...
            </option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.product}: {p.name.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Actions: AI Settings, View Layout, QP Signoff, Export, Save */}
      <div className="header-actions">
        {/* Groq Key Indicator */}
        <button
          className="btn btn-outline btn-sm"
          onClick={onOpenGroqModal}
          title="Configure Groq AI LLM Key"
          style={{
            borderColor: isGroqConnected ? 'var(--success-border)' : 'var(--border-ai)',
            color: isGroqConnected ? '#34d399' : '#a5b4fc',
          }}
        >
          <Key size={14} />
          <span>{isGroqConnected ? 'Groq Active' : 'Groq AI Config'}</span>
        </button>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn-icon ${viewMode === 'split' ? 'active' : ''}`}
            style={{ padding: '5px 8px', background: viewMode === 'split' ? '#334155' : 'transparent', color: viewMode === 'split' ? '#ffffff' : 'var(--text-muted)' }}
            onClick={() => dispatch(setViewMode('split'))}
            title="Split Screen: AI Copilot + Form"
          >
            <Columns size={15} />
          </button>
          <button
            className={`btn-icon ${viewMode === 'form_only' ? 'active' : ''}`}
            style={{ padding: '5px 8px', background: viewMode === 'form_only' ? '#334155' : 'transparent', color: viewMode === 'form_only' ? '#ffffff' : 'var(--text-muted)' }}
            onClick={() => dispatch(setViewMode('form_only'))}
            title="Full Screen Investigation Form"
          >
            <Maximize2 size={15} />
          </button>
        </div>

        {/* Audit Export */}
        <button className="btn btn-secondary btn-sm" onClick={onOpenAuditModal} title="View GMP Audit Inspection Record">
          <FileCheck size={15} /> Audit Dossier
        </button>

        {/* QP Sign-Off Button */}
        <button
          className={`btn btn-sm ${current.qp_signoff?.signed ? 'btn-success' : 'btn-outline'}`}
          onClick={onOpenQPSignoffModal}
          title="Qualified Person Sign-Off (21 CFR Part 11)"
          style={{ borderColor: current.qp_signoff?.signed ? undefined : '#f59e0b', color: current.qp_signoff?.signed ? undefined : '#fbbf24' }}
        >
          <ShieldCheck size={15} />
          <span>{current.qp_signoff?.signed ? 'QP Approved' : 'QP Sign-Off'}</span>
        </button>

        {/* Save Investigation */}
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
          <Save size={15} />
          <span>{saving ? 'Saving...' : 'Save Investigation'}</span>
        </button>
      </div>

      {/* Floating Save Toast */}
      {saveSuccessMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'rgba(16, 185, 129, 0.95)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1000,
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <Check size={18} />
          <span>{saveSuccessMessage}</span>
        </div>
      )}
    </header>
  );
};
