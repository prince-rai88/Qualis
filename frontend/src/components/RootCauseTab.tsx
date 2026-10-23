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
        className="ws-card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>
            Root Cause Investigation Framework
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Investigate causal pathways using 5 Whys causal interrogation and Ishikawa 6M classification
          </div>
        </div>

        <div className="input-modes">
          <button
            className={`mode-btn ${approachView === 'both' ? 'active' : ''}`}
            onClick={() => setApproachView('both')}
          >
            View Both
          </button>
          <button
            className={`mode-btn ${approachView === 'five_whys' ? 'active' : ''}`}
            onClick={() => setApproachView('five_whys')}
          >
            5 Whys Chain
          </button>
          <button
            className={`mode-btn ${approachView === 'fishbone' ? 'active' : ''}`}
            onClick={() => setApproachView('fishbone')}
          >
            Ishikawa 6M
          </button>
        </div>
      </div>

      {/* Primary Suspected Root Cause Summary Card */}
      <div
        className="ws-card"
        style={{
          background: 'rgba(244, 63, 94, 0.07)',
          borderColor: 'var(--critical-border)',
          boxShadow: '0 0 30px rgba(244, 63, 94, 0.12), var(--glass-shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--critical-text)', fontWeight: 700, fontSize: '0.9rem' }}>
            <AlertOctagon size={18} />
            <span>Concluded Primary Systemic Root Cause (ICH Q7 § 12.2)</span>
          </div>
          <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>Verified Causal Driver</span>
        </div>

        <textarea
          className="form-input"
          rows={2}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.25)',
            borderColor: 'var(--critical-border)',
            color: '#ffffff',
            fontSize: '0.92rem',
            lineHeight: '1.5',
            resize: 'vertical',
          }}
          value={current.suspected_root_cause}
          onChange={(e) => dispatch(updateFormField({ field: 'suspected_root_cause', value: e.target.value }))}
          placeholder="Systemic root cause identified through 5 Whys and physical evidence..."
        />

        {current.contributing_factors.length > 0 && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Contributing Factors (Secondary Causal Catalysts):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {current.contributing_factors.map((factor, i) => (
                <span
                  key={i}
                  className="badge badge-neutral"
                  style={{
                    fontSize: '0.76rem',
                    padding: '4px 10px',
                    color: 'var(--text-secondary)',
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
        <div className="ws-card">
          <div className="ws-card-header">
            <div className="ws-card-title">
              <GitCommit size={18} color="#818cf8" />
              <span>5 Whys Root Cause Interrogation Chain</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Transitions from physical symptom down to systemic management failure
            </span>
          </div>

          {current.five_whys_data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
              No 5 Whys analysis loaded yet. Describe the deviation or load a preset on the home screen.
            </div>
          ) : (
            <div className="whys-chain">
              {current.five_whys_data.map((step, idx) => (
                <div key={step.step} className={`why-row ${step.is_root_cause ? 'root-cause-row' : ''}`}>
                  <div className="why-badge-num">{step.step}</div>

                  <div className="why-content">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div className="why-q">Why {step.step}: {step.question}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {step.is_root_cause && (
                          <span className="badge badge-critical">Root Cause</span>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '3px 10px',
                            fontSize: '0.72rem',
                            color: step.confirmed ? 'var(--success-text)' : 'var(--text-muted)',
                            borderColor: step.confirmed ? 'var(--success-border)' : undefined,
                            background: step.confirmed ? 'var(--success-bg)' : undefined,
                          }}
                          onClick={() =>
                            dispatch(updateFiveWhyStep({ index: idx, field: 'confirmed', value: !step.confirmed }))
                          }
                        >
                          <ShieldCheck size={13} />
                          {step.confirmed ? 'Confirmed' : 'Verify'}
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      className="why-a-input"
                      value={step.answer}
                      onChange={(e) =>
                        dispatch(updateFiveWhyStep({ index: idx, field: 'answer', value: e.target.value }))
                      }
                      placeholder="Investigator answer..."
                    />

                    {step.evidence && (
                      <div className="why-evidence">
                        <strong>Evidence:</strong> {step.evidence}
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
        <div className="ws-card">
          <div className="ws-card-header">
            <div className="ws-card-title">
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 600, fontSize: '0.84rem', color: '#ffffff' }}>
                      <span>{icon}</span>
                      <span>{label}</span>
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.66rem' }}>
                      {causes.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{description}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    {causes.length === 0 ? (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '12px 6px', textAlign: 'center' }}>
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
                                <span style={{ color: 'var(--success-text)' }} title="Investigator Confirmed">
                                  <CheckCircle size={14} />
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-dim)' }} title="AI Suggestion (Unverified)">
                                  <Sparkles size={12} />
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#f1f5f9', lineHeight: '1.4' }}>
                            {cause.text}
                          </div>

                          {cause.evidence && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(0,0,0,0.25)', padding: '5px 8px', borderRadius: '4px' }}>
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
