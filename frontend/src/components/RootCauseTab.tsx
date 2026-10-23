import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  updateFiveWhyStep,
  updateFishboneItem,
  toggleFishboneConfirmed,
  updateFormField,
} from '../store/slices/investigationSlice';
import {
  GitCommit,
  Network,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Edit2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { FishboneStructure, FishboneCause } from '../types';

export const RootCauseTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.investigations.current);
  const [approachView, setApproachView] = useState<'both' | 'five_whys' | 'fishbone'>('both');

  const fishboneBranches: { key: keyof FishboneStructure; label: string; icon: string; description: string }[] = [
    { key: 'man', label: '1. Man (Personnel)', icon: '👤', description: 'Training, fatigue, qualifications, SOP adherence' },
    { key: 'machine', label: '2. Machine (Equipment)', icon: '⚙️', description: 'Reactors, seals, valves, chillers, PM status' },
    { key: 'material', label: '3. Material (Inputs)', icon: '🧪', description: 'Reagents, solvents, moisture, vendor lot CoA' },
    { key: 'method', label: '4. Method (Process)', icon: '📋', description: 'BPR instructions, cooling ramp, charging rates' },
    { key: 'measurement', label: '5. Measurement (QC)', icon: '🔬', description: 'HPLC assay, sensors, thermocouple calibration' },
    { key: 'milieu', label: '6. Milieu (Environment)', icon: '🌡️', description: 'HVAC, cleanroom humidity, utilities, ambient' },
  ];

  const getLikelihoodBadge = (likelihood: string) => {
    switch (likelihood) {
      case 'High':
        return <span className="badge badge-critical">High Likelihood</span>;
      case 'Medium':
        return <span className="badge badge-major">Medium</span>;
      case 'Low':
        return <span className="badge badge-minor">Low</span>;
      default:
        return <span className="badge" style={{ background: '#334155', color: '#94a3b8' }}>Ruled Out</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls & View Selector */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Root Cause Investigation Framework
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Investigate causal pathways using 5 Whys causal interrogation and Ishikawa 6M classification
          </div>
        </div>

        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn-icon ${approachView === 'both' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.78rem', background: approachView === 'both' ? '#334155' : 'transparent', color: approachView === 'both' ? '#ffffff' : 'var(--text-muted)' }}
            onClick={() => setApproachView('both')}
          >
            View Both
          </button>
          <button
            className={`btn-icon ${approachView === 'five_whys' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.78rem', background: approachView === 'five_whys' ? '#334155' : 'transparent', color: approachView === 'five_whys' ? '#ffffff' : 'var(--text-muted)' }}
            onClick={() => setApproachView('five_whys')}
          >
            5 Whys Tree
          </button>
          <button
            className={`btn-icon ${approachView === 'fishbone' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.78rem', background: approachView === 'fishbone' ? '#334155' : 'transparent', color: approachView === 'fishbone' ? '#ffffff' : 'var(--text-muted)' }}
            onClick={() => setApproachView('fishbone')}
          >
            Ishikawa 6M
          </button>
        </div>
      </div>

      {/* Primary Suspected Root Cause Summary Card */}
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, fontSize: '0.9rem' }}>
            <AlertOctagon size={18} />
            <span>Concluded Primary Systemic Root Cause</span>
            <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>AI Suggested / Review</span>
          </div>
        </div>

        <textarea
          className="textarea-clean"
          rows={2}
          style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
          value={current.suspected_root_cause}
          onChange={(e) => dispatch(updateFormField({ field: 'suspected_root_cause', value: e.target.value }))}
          placeholder="Systemic root cause identified through 5 Whys and physical evidence..."
        />

        {current.contributing_factors.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Contributing Factors (Secondary Causal Catalysts):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {current.contributing_factors.map((factor, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid var(--border-medium)',
                    color: '#e2e8f0',
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  • {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5 Whys Progression Tree */}
      {(approachView === 'both' || approachView === 'five_whys') && (
        <div className="form-card">
          <div className="card-title-bar">
            <div className="card-title">
              <GitCommit size={18} color="#818cf8" />
              <span>5 Whys Root Cause Interrogation Chain</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Transitions from physical symptom down to management / preventive failure
            </span>
          </div>

          {current.five_whys_data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              No 5 Whys analysis loaded yet. Use the AI Copilot to generate the causal chain from your incident report.
            </div>
          ) : (
            <div className="five-whys-container">
              {current.five_whys_data.map((step, idx) => (
                <div key={step.step} className={`why-step-card ${step.is_root_cause ? 'is-root-cause' : ''}`}>
                  <div className="why-step-number">{step.step}</div>

                  <div className="why-step-content">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="why-question">Why {step.step}: {step.question}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {step.is_root_cause && (
                          <span className="badge badge-critical">Root Cause</span>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.7rem',
                            color: step.confirmed ? '#34d399' : 'var(--text-muted)',
                            borderColor: step.confirmed ? 'var(--success-border)' : undefined,
                          }}
                          onClick={() =>
                            dispatch(updateFiveWhyStep({ index: idx, field: 'confirmed', value: !step.confirmed }))
                          }
                        >
                          <ShieldCheck size={13} />
                          {step.confirmed ? 'Confirmed by Investigator' : 'Confirm Step'}
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.86rem', padding: '8px 10px' }}
                      value={step.answer}
                      onChange={(e) =>
                        dispatch(updateFiveWhyStep({ index: idx, field: 'answer', value: e.target.value }))
                      }
                    />

                    {step.evidence && (
                      <div className="why-evidence-snippet">
                        <strong>Evidence Snippet:</strong> {step.evidence}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ishikawa (Fishbone) 6M Analysis Visual Grid */}
      {(approachView === 'both' || approachView === 'fishbone') && (
        <div className="form-card">
          <div className="card-title-bar">
            <div className="card-title">
              <Network size={18} color="#38bdf8" />
              <span>Ishikawa 6M Cause-and-Effect Fishbone Matrix</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Comprehensive evaluation across all 6 manufacturing domains
            </span>
          </div>

          <div className="fishbone-grid">
            {fishboneBranches.map(({ key, label, icon, description }) => {
              const causes: FishboneCause[] = current.fishbone_data[key] || [];

              return (
                <div key={key} className="fishbone-branch-card">
                  <div className="branch-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{icon}</span>
                      <span>{label}</span>
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {causes.length} factors
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{description}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    {causes.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '8px' }}>
                        No factors identified in this branch
                      </div>
                    ) : (
                      causes.map((cause) => (
                        <div
                          key={cause.id}
                          className={`cause-item ${cause.is_root_cause ? 'root-cause' : ''}`}
                          onClick={() => dispatch(toggleFishboneConfirmed({ branch: key, id: cause.id }))}
                          title="Click to toggle Investigator Confirmation"
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            {getLikelihoodBadge(cause.likelihood)}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {cause.is_root_cause && (
                                <span className="badge badge-critical" style={{ fontSize: '0.62rem' }}>
                                  Root Cause
                                </span>
                              )}
                              {cause.investigator_confirmed ? (
                                <span style={{ color: '#34d399' }} title="Investigator Confirmed">
                                  <CheckCircle size={14} />
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-dim)' }} title="AI Suggestion (Unverified)">
                                  <Sparkles size={12} />
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: '#f1f5f9', lineHeight: '1.4' }}>
                            {cause.text}
                          </div>

                          {cause.evidence && (
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '4px 6px', borderRadius: '4px' }}>
                              Evid: {cause.evidence}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
