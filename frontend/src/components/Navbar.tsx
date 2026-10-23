import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  startNewInvestigation,
  setCurrentView,
  saveCurrentInvestigation,
  clearSaveSuccess,
} from '../store/slices/investigationSlice';
import {
  ArrowLeft,
  Key,
  ShieldCheck,
  FileCheck,
  Save,
  Check,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onOpenGroqModal: () => void;
  onOpenQPSignoffModal: () => void;
  onOpenAuditModal: () => void;
  onToggleCopilotDrawer: () => void;
}

export const Navbar: React.FC<Props> = ({
  onOpenGroqModal,
  onOpenQPSignoffModal,
  onOpenAuditModal,
  onToggleCopilotDrawer,
}) => {
  const dispatch = useAppDispatch();
  const { current, currentView, saving, saveSuccessMessage } = useAppSelector(
    (state) => state.investigations
  );
  const { isGroqConnected } = useAppSelector((state) => state.ai);

  const handleSave = async () => {
    await dispatch(saveCurrentInvestigation());
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.1 },
    });
    setTimeout(() => {
      dispatch(clearSaveSuccess());
    }, 3500);
  };

  return (
    <header className="nav-header">
      {/* Brand & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          className="nav-brand"
          onClick={() => dispatch(setCurrentView('home'))}
          title="Go to Investigation Home"
        >
          <div className="brand-dot" />
          <span className="brand-name">Qualis</span>
          <span className="brand-sub">Pharma RCA</span>
        </div>

        {currentView === 'workspace' && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch(setCurrentView('home'))}
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={14} /> Back to all investigations
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="nav-right">
        {/* Groq Key Indicator */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={onOpenGroqModal}
          title="Groq AI Inference Settings"
          style={{
            color: isGroqConnected ? 'var(--success-text)' : 'var(--text-muted)',
          }}
        >
          <Key size={13} />
          <span>{isGroqConnected ? 'Groq Active' : 'Groq Config'}</span>
        </button>

        {currentView === 'workspace' && (
          <>
            {/* Ask Copilot Drawer Trigger */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={onToggleCopilotDrawer}
              title="Open Regulatory Copilot Assistant"
            >
              <MessageSquare size={13} />
              <span>Ask AI</span>
            </button>

            {/* Audit Dossier Export */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenAuditModal}
              title="View GMP Regulatory Inspection Dossier"
            >
              <FileCheck size={14} /> Audit Dossier
            </button>

            {/* QP Sign-Off Button (Reflects ACTUAL DB State) */}
            <button
              className={`btn btn-sm ${current.qp_signoff?.signed ? 'badge-success' : 'btn-secondary'}`}
              onClick={onOpenQPSignoffModal}
              title="Qualified Person Electronic Signature (21 CFR Part 11)"
              style={{
                borderColor: current.qp_signoff?.signed ? 'var(--success-border)' : 'var(--border-medium)',
              }}
            >
              <ShieldCheck size={14} />
              <span>{current.qp_signoff?.signed ? 'QP Approved' : 'QP Sign-Off'}</span>
            </button>

            {/* Save Investigation Button */}
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={13} />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </>
        )}

        {currentView === 'home' && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => dispatch(startNewInvestigation())}
          >
            New Investigation
          </button>
        )}
      </div>

      {/* Floating Save Toast Notification */}
      {saveSuccessMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--success-border)',
            color: 'var(--success-text)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1000,
            fontSize: '0.82rem',
            fontWeight: 500,
          }}
        >
          <Check size={16} />
          <span>{saveSuccessMessage}</span>
        </div>
      )}
    </header>
  );
};
