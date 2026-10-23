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
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '8px', color: '#fbbf24' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Missing Evidence & Regulatory Audit Trail Gaps
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Compliance Checklist per FDA 21 CFR 211.192 & ICH Q7 (Required prior to QP batch disposition)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: pendingCount > 0 ? '#f87171' : '#34d399' }}>
              {pendingCount} Pending Gaps
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              {providedCount} Provided
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Evidence Requirement
          </button>
        </div>
      </div>

      {/* Add Custom Gap Form */}
      {showAddModal && (
        <form
          onSubmit={handleAddGap}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div className="grid-3">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
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

          <div className="grid-2">
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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
      <div className="form-card">
        <div className="card-title-bar">
          <div className="card-title">
            <FileCheck2 size={18} color="#f59e0b" />
            <span>Investigation Evidence Registry</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Each item must be provided or waived with QA justification prior to formal closure
          </span>
        </div>

        {current.missing_evidence.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No missing evidence items identified yet. Run Step 4 in the AI Copilot to automatically detect regulatory gaps.
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
                    background: isProvided ? 'rgba(16, 185, 129, 0.05)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isProvided ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: isProvided ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: isProvided ? '#34d399' : '#fbbf24',
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
                        <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{gap.item}</strong>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                        <strong>Rationale:</strong> {gap.rationale}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={12} />
                        <span>Source Department: {gap.source_department || 'QC / Operations'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: isProvided ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                        color: isProvided ? '#34d399' : 'var(--text-muted)',
                        borderColor: isProvided ? 'var(--success-border)' : 'var(--border-subtle)',
                        fontSize: '0.72rem',
                        padding: '5px 10px',
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
                        background: gap.status === 'Waived' ? 'rgba(148, 163, 184, 0.25)' : 'transparent',
                        color: gap.status === 'Waived' ? '#cbd5e1' : 'var(--text-dim)',
                        borderColor: 'var(--border-subtle)',
                        fontSize: '0.72rem',
                        padding: '5px 8px',
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
