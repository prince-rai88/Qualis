import React from 'react';
import { useAppSelector } from '../store';
import {
  FileText,
  GitBranch,
  ShieldAlert,
  CheckSquare,
  Check,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const ProcessingView: React.FC = () => {
  const {
    isProcessing,
    processingTask,
    progressPercent,
    error,
    extractedFields,
    aiFishbone,
    aiFiveWhys,
    aiMissingEvidence,
    aiCapaRecommendations,
  } = useAppSelector((state) => state.ai);
  const { current } = useAppSelector((state) => state.investigations);

  // Timeline step statuses based strictly on ACTUAL backend state
  const steps = [
    {
      id: 1,
      title: 'Extracting Incident Information',
      desc: extractedFields
        ? `Identified ${extractedFields.product_name || 'API'} (Batch: ${extractedFields.batch_number || 'N/A'}) • ${extractedFields.severity || 'Major'} Severity`
        : 'Parsing narrative, equipment logs, and immediate containment...',
      isCompleted: !!extractedFields,
      isActive: isProcessing && !extractedFields,
      icon: FileText,
    },
    {
      id: 2,
      title: 'Root Cause Analysis (5 Whys & 6M)',
      desc: aiFiveWhys
        ? `Constructed 5 Whys progression and 6M Ishikawa factor matrix`
        : 'Interrogating causal chain down to systemic management failure...',
      isCompleted: !!aiFiveWhys,
      isActive: isProcessing && !!extractedFields && !aiFiveWhys,
      icon: GitBranch,
    },
    {
      id: 3,
      title: 'Detecting Regulatory Evidence Gaps',
      desc: aiMissingEvidence
        ? `Checked 21 CFR 211.192 requirements; ${aiMissingEvidence.length} items cataloged`
        : 'Checking SCADA trends, calibration records, and vendor CoAs...',
      isCompleted: !!aiMissingEvidence,
      isActive: isProcessing && !!aiFiveWhys && !aiMissingEvidence,
      icon: ShieldAlert,
    },
    {
      id: 4,
      title: 'Synthesizing CAPA Recommendations',
      desc: aiCapaRecommendations
        ? `Formulated ${aiCapaRecommendations.length} Corrective & Preventive Actions with effectiveness metrics`
        : 'Drafting targeted actions and quantifiable success checks...',
      isCompleted: !!aiCapaRecommendations,
      isActive: isProcessing && !!aiMissingEvidence && !aiCapaRecommendations,
      icon: CheckSquare,
    },
  ];

  return (
    <div className="processing-screen">
      {/* Compact Processing Header */}
      <div className="processing-header">
        <span className="badge badge-neutral" style={{ alignSelf: 'center', marginBottom: '4px' }}>
          {current.deviation_number || 'DEV-2026-PROCESSING'}
        </span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Investigating Incident
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          LangGraph multi-agent causal workflow is analyzing the evidence dossier
        </p>
      </div>

      {/* AI Processing Timeline */}
      <div className="processing-timeline">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`timeline-step ${step.isCompleted ? 'completed' : ''} ${step.isActive ? 'active' : ''}`}
            >
              <div className="timeline-step-icon">
                {step.isCompleted ? (
                  <Check size={14} />
                ) : step.isActive ? (
                  <Loader2 size={14} className="spin-slow" />
                ) : (
                  <Icon size={13} />
                )}
              </div>

              <div className="timeline-step-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="timeline-step-title">{step.title}</span>
                  {step.isCompleted && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--success-text)', fontWeight: 600 }}>
                      Complete
                    </span>
                  )}
                  {step.isActive && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-text)', fontWeight: 600 }}>
                      Analyzing...
                    </span>
                  )}
                </div>
                <span className="timeline-step-desc">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Error Warning if any step failed */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--critical-bg)',
            border: '1px solid var(--critical-border)',
            color: 'var(--critical-text)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
