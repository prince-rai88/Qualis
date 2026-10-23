import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { performQPSignoff } from '../store/slices/investigationSlice';
import { ShieldCheck, UserCheck, Calendar, FileText, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const QPSignoffModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.investigations.current);

  const [signerName, setSignerName] = useState(current.qp_signoff?.signer_name || 'Dr. Arthur Vance, Ph.D.');
  const [signerRole, setSignerRole] = useState(current.qp_signoff?.signer_role || 'Qualified Person / Head of QA');
  const [comments, setComments] = useState(
    current.qp_signoff?.comments ||
      'I have thoroughly reviewed the RCA investigation, evaluated the 5 Whys and Fishbone causal evidence, verified that missing GMP documentation has been addressed, and approve the recommended Corrective and Preventive Actions.'
  );

  if (!isOpen) return null;

  const handleSign = async () => {
    if (!current.id) return;
    await dispatch(
      performQPSignoff({
        id: current.id,
        signoffData: {
          signer_name: signerName,
          signer_role: signerRole,
          comments: comments,
        },
      })
    );

    // Confetti celebration for formal GMP signoff approval
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#6366f1', '#3b82f6'],
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '8px', borderRadius: '8px', color: 'var(--success-text)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Qualified Person (QP) Electronic Sign-Off
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                cGMP Compliance & 21 CFR Part 11 Electronic Signature
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--canvas-elevated)',
              border: '1px solid var(--glass-border)',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Deviation ID:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{current.deviation_number}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Product & Batch:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{current.product_name} ({current.batch_number})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Verified Root Cause:</span>
              <span style={{ color: 'var(--critical-text)', maxWidth: '340px', textAlign: 'right', fontSize: '0.75rem' }}>
                {current.suspected_root_cause || 'Root cause under investigation'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Signer Full Name</label>
              <input
                type="text"
                className="form-input"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Signer Role</label>
              <input
                type="text"
                className="form-input"
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Regulatory Review Comments & Disposition Justification</label>
            <textarea
              className="form-input"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: '1.4' }}>
            By clicking "Affix Electronic Signature", I confirm under penalty of cGMP regulatory sanction that the root cause analysis has been verified with objective evidence and the CAPA plan meets ICH Q10 standards.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSign} disabled={!signerName.trim()}>
            <UserCheck size={16} /> Affix Electronic Signature
          </button>
        </div>
      </div>
    </div>
  );
};
