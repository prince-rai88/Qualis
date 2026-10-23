import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setMissingEvidence,
  updateEvidenceGapStatus,
} from '../store/slices/investigationSlice';
import {
  ShieldAlert,
  FileCheck2,
  AlertCircle,
  Plus,
  CheckCircle,
  Clock,
  Building,
  Sparkles,
} from 'lucide-react';
import { MissingEvidenceItem } from '../types';

export const EvidenceGapsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.investigations.current);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newRationale, setNewRationale] = useState('');
  const [newDept, setNewDept] = useState('QC Analytical');
  const [newPriority, setNewPriority] = useState<'Critical' | 'High' | 'Medium'>('High');

  const handleAddGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const item: MissingEvidenceItem = {
      id: 'gap-' + Date.now(),
      item: newItem.trim(),
      rationale: newRationale.trim() || 'Required for cGMP 21 CFR 211.192 batch record completion.',
      source_department: newDept,
      priority: newPriority,
      status: 'Pending',
    };
    dispatch(setMissingEvidence([...current.missing_evidence, item]));
    setNewItem('');
    setNewRationale('');
    setShowAddModal(false);
  };

  const pendingCount = current.missing_evidence.filter((g) => g.status === 'Pending').length;
  const providedCount = current.missing_evidence.filter((g) => g.status === 'Provided').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Compliance Header Banner */}
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
          <div style={{ background: 'var(--major-bg)', border: '1px solid var(--major-border)', padding: '10px', borderRadius: 'var(--radius-md)', color: 'var(--major-text)' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Missing Evidence & Regulatory Audit Trail Gaps
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Compliance Checklist per FDA 21 CFR 211.192 & ICH Q7 (Required prior to QP batch disposition)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: pendingCount > 0 ? 'var(--critical-text)' : 'var(--success-text)' }}>
              {pendingCount} Pending Gaps
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {providedCount} Provided
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Requirement
          </button>
        </div>
      </div>

      {/* Add Custom Gap Form */}
      {showAddModal && (
        <form
          onSubmit={handleAddGap}
          className="ws-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: 'rgba(25, 34, 58, 0.7)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Required Document / Test / Record</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. SCADA 1-second interval historical trend export for RX-402"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={newPriority} onChange={(e) => setNewPriority(e.target.value as any)}>
                <option value="Critical">Critical (Halts Batch Disposition)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Source Department</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Automation & Engineering"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Regulatory Rationale</label>
              <input
                type="text"
                className="form-input"
                placeholder="Why is this evidence required for compliance?"
                value={newRationale}
                onChange={(e) => setNewRationale(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Evidence Item
            </button>
          </div>
        </form>
      )}

      {/* Evidence Gaps List */}
      <div className="ws-card">
        <div className="ws-card-header">
          <div className="ws-card-title">
            <FileCheck2 size={18} color="#f59e0b" />
            <span>Investigation Evidence Registry</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Each item must be provided or waived with QA justification prior to formal closure
          </span>
        </div>

        {current.missing_evidence.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
            No missing evidence items identified yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {current.missing_evidence.map((gap) => {
              const isPending = gap.status === 'Pending';
              const isProvided = gap.status === 'Provided';

              return (
                <div
                  key={gap.id}
                  style={{
                    background: isProvided ? 'var(--success-bg)' : 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'var(--glass-blur)',
                    WebkitBackdropFilter: 'var(--glass-blur)',
                    border: `1px solid ${isProvided ? 'var(--success-border)' : 'var(--glass-border)'}`,
                    borderTop: `1px solid ${isProvided ? 'var(--success-border)' : 'var(--glass-border-top)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                    <div
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        background: isProvided ? 'var(--success-bg)' : 'var(--major-bg)',
                        border: `1px solid ${isProvided ? 'var(--success-border)' : 'var(--major-border)'}`,
                        color: isProvided ? 'var(--success-text)' : 'var(--major-text)',
                        marginTop: '2px',
                      }}
                    >
                      {isProvided ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge badge-${gap.priority.toLowerCase()}`}>
                          {gap.priority} Priority
                        </span>
                        <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{gap.item}</strong>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <strong>Rationale:</strong> {gap.rationale}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={12} />
                        <span>Source Department: {gap.source_department || 'QC / Operations'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: isProvided ? 'var(--success-bg)' : 'rgba(255, 255, 255, 0.06)',
                        color: isProvided ? 'var(--success-text)' : 'var(--text-secondary)',
                        borderColor: isProvided ? 'var(--success-border)' : 'var(--glass-border)',
                        fontSize: '0.74rem',
                      }}
                      onClick={() =>
                        dispatch(updateEvidenceGapStatus({ id: gap.id, status: isProvided ? 'Pending' : 'Provided' }))
                      }
                    >
                      {isProvided ? '✓ Provided' : 'Mark Provided'}
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{
                        background: gap.status === 'Waived' ? 'rgba(148, 163, 184, 0.2)' : 'transparent',
                        color: gap.status === 'Waived' ? '#cbd5e1' : 'var(--text-dim)',
                        borderColor: 'var(--glass-border)',
                        fontSize: '0.74rem',
                      }}
                      onClick={() =>
                        dispatch(updateEvidenceGapStatus({ id: gap.id, status: gap.status === 'Waived' ? 'Pending' : 'Waived' }))
                      }
                    >
                      {gap.status === 'Waived' ? 'Waived by QA' : 'Waive'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
