import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addCAPAItem,
  updateCAPAItem,
  removeCAPAItem,
} from '../store/slices/investigationSlice';
import {
  CheckSquare,
  ShieldCheck,
  Plus,
  Trash2,
  Calendar,
  User,
  Target,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { CAPAItem } from '../types';

export const CAPATab: React.FC = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.investigations.current);

  const [showAddModal, setShowAddModal] = useState(false);
  const [capaType, setCapaType] = useState<'Corrective' | 'Preventive'>('Corrective');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rootCauseAddressed, setRootCauseAddressed] = useState(current.suspected_root_cause || '');
  const [owner, setOwner] = useState('Maintenance Engineering Lead');
  const [targetDate, setTargetDate] = useState('14 Calendar Days');
  const [effectivenessCriteria, setEffectivenessCriteria] = useState('');

  const handleCreateCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item: CAPAItem = {
      id: 'capa-' + Date.now(),
      capa_type: capaType,
      title: title.trim(),
      description: description.trim(),
      root_cause_addressed: rootCauseAddressed.trim(),
      owner: owner.trim(),
      target_date: targetDate.trim(),
      effectiveness_criteria:
        effectivenessCriteria.trim() || 'Zero recurring excursions across the next 5 commercial batches.',
      status: 'Proposed',
      ai_suggested: false,
      confirmed: true,
    };
    dispatch(addCAPAItem(item));
    setTitle('');
    setDescription('');
    setEffectivenessCriteria('');
    setShowAddModal(false);
  };

  const correctiveItems = current.capa_recommendations.filter((c) => c.capa_type === 'Corrective');
  const preventiveItems = current.capa_recommendations.filter((c) => c.capa_type === 'Preventive');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* CAPA Header Banner */}
      <div
        className="ws-card"
        style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '10px', borderRadius: 'var(--radius-md)', color: 'var(--success-text)' }}>
            <CheckSquare size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Corrective and Preventive Action (CAPA) Plan
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              ICH Q10 Pharmaceutical Quality System • Root Cause Remediation & Recurrence Prevention
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add CAPA Action
          </button>
        </div>
      </div>

      {/* Add CAPA Form Modal/Section */}
      {showAddModal && (
        <form
          onSubmit={handleCreateCapa}
          className="ws-card"
          style={{
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(25, 34, 58, 0.7)',
          }}
        >
          <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff' }}>
            New CAPA Assignment
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">CAPA Type</label>
              <select className="form-select" value={capaType} onChange={(e) => setCapaType(e.target.value as any)}>
                <option value="Corrective">Corrective Action (Immediate Fix / Quarantined Batch)</option>
                <option value="Preventive">Preventive Action (Systemic Recurrence Prevention)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Action Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Overhaul and Re-qualify Pneumatic Valve CV-402 Actuator"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Implementation Instructions</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Detailed step-by-step technical implementation instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Action Owner</label>
              <input
                type="text"
                className="form-input"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Completion Timeframe</label>
              <input
                type="text"
                className="form-input"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Root Cause Addressed</label>
              <input
                type="text"
                className="form-input"
                value={rootCauseAddressed}
                onChange={(e) => setRootCauseAddressed(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Effectiveness Check Plan (GMP Mandatory Metric)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Zero recurring excursions across next 5 consecutive commercial batches and 100% PM audit verification."
              value={effectivenessCriteria}
              onChange={(e) => setEffectivenessCriteria(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save CAPA Task
            </button>
          </div>
        </form>
      )}

      {/* Corrective Actions Section */}
      <div className="ws-card">
        <div className="ws-card-header">
          <div className="ws-card-title">
            <Shield size={18} color="#38bdf8" />
            <span>1. Corrective Actions (Immediate Remediation & Batch Containment)</span>
          </div>
          <span className="badge badge-minor">{correctiveItems.length} Actions</span>
        </div>

        {correctiveItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
            No corrective actions defined.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {correctiveItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  border: '1px solid var(--glass-border)',
                  borderTop: '1px solid var(--glass-border-top)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-minor">Corrective</span>
                    <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>{item.title}</strong>
                    {item.ai_suggested && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem', color: 'var(--accent-light)' }}>
                        <Sparkles size={11} /> AI Suggested
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      className="form-select"
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                      value={item.status}
                      onChange={(e) =>
                        dispatch(updateCAPAItem({ id: item.id, field: 'status', value: e.target.value }))
                      }
                    >
                      <option value="Proposed">Proposed</option>
                      <option value="Approved">Approved</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="btn-icon"
                      style={{ color: 'var(--critical-text)' }}
                      onClick={() => dispatch(removeCAPAItem(item.id))}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {item.description}
                </div>

                <div
                  style={{
                    background: 'rgba(14, 165, 233, 0.08)',
                    borderLeft: '3px solid #0ea5e9',
                    padding: '8px 12px',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '0.78rem',
                    color: '#bae6fd',
                  }}
                >
                  <strong>Effectiveness Check Criteria:</strong> {item.effectiveness_criteria}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.75rem', color: 'var(--text-dim)', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} />
                    <span>Owner: <strong style={{ color: '#ffffff' }}>{item.owner}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} />
                    <span>Target Date: <strong style={{ color: '#ffffff' }}>{item.target_date || '14 Days'}</strong></span>
                  </div>
                  {item.root_cause_addressed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={13} />
                      <span>Addresses: {item.root_cause_addressed.slice(0, 40)}...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preventive Actions Section */}
      <div className="ws-card">
        <div className="ws-card-header">
          <div className="ws-card-title">
            <ShieldCheck size={18} color="#10b981" />
            <span>2. Preventive Actions (Systemic Engineering & Process Controls)</span>
          </div>
          <span className="badge badge-success">{preventiveItems.length} Actions</span>
        </div>

        {preventiveItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
            No preventive actions defined.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {preventiveItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderTop: '1px solid var(--glass-border-top)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-success">Preventive</span>
                    <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>{item.title}</strong>
                    {item.ai_suggested && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem', color: 'var(--accent-light)' }}>
                        <Sparkles size={11} /> AI Suggested
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      className="form-select"
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                      value={item.status}
                      onChange={(e) =>
                        dispatch(updateCAPAItem({ id: item.id, field: 'status', value: e.target.value }))
                      }
                    >
                      <option value="Proposed">Proposed</option>
                      <option value="Approved">Approved</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="btn-icon"
                      style={{ color: 'var(--critical-text)' }}
                      onClick={() => dispatch(removeCAPAItem(item.id))}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {item.description}
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderLeft: '3px solid #10b981',
                    padding: '8px 12px',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '0.78rem',
                    color: '#a7f3d0',
                  }}
                >
                  <strong>Effectiveness Check Criteria:</strong> {item.effectiveness_criteria}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.75rem', color: 'var(--text-dim)', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} />
                    <span>Owner: <strong style={{ color: '#ffffff' }}>{item.owner}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} />
                    <span>Target Date: <strong style={{ color: '#ffffff' }}>{item.target_date || '30 Days'}</strong></span>
                  </div>
                  {item.root_cause_addressed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={13} />
                      <span>Addresses Root Cause: {item.root_cause_addressed.slice(0, 40)}...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
