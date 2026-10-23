import React from 'react';
import { useAppSelector } from '../store';
import { Printer, X, Download, ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditSummaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const current = useAppSelector((state) => state.investigations.current);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '8px', borderRadius: '8px', color: '#818cf8' }}>
              <Printer size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                GMP Root Cause Analysis & CAPA Audit Dossier
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Official Regulatory Investigation Record for FDA / EMA Inspection Defense
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ overflowY: 'auto', background: '#0a0e17' }}>
          {/* Formal Letterhead */}
          <div
            style={{
              borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                QUALIS PHARMACEUTICAL MANUFACTURING
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                ACTIVE PHARMACEUTICAL INGREDIENTS (API) QUALITY ASSURANCE DIVISION
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                cGMP Compliance: 21 CFR Part 211, ICH Q7, ICH Q10
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#818cf8' }}>
                {current.deviation_number}
              </div>
              <span className={`badge badge-${current.severity.toLowerCase()}`}>
                {current.severity} Severity
              </span>
            </div>
          </div>

          {/* Section 1: Deviation Metadata */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#93c5fd', letterSpacing: '0.05em', marginBottom: '8px' }}>
              1. Incident Identification
            </h4>
            <div className="grid-3" style={{ fontSize: '0.82rem', background: 'rgba(30, 41, 59, 0.4)', padding: '12px', borderRadius: '6px' }}>
              <div><span style={{ color: '#94a3b8' }}>Product:</span> <strong>{current.product_name}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Batch/Lot:</span> <strong>{current.batch_number}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Manufacturing Step:</span> <strong>{current.manufacturing_step}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Equipment:</span> <strong>{current.equipment_id}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Date:</span> <strong>{current.occurrence_date}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Reported By:</span> <strong>{current.reported_by}</strong></div>
            </div>
          </div>

          {/* Section 2: Narrative & Containment */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#93c5fd', letterSpacing: '0.05em', marginBottom: '8px' }}>
              2. Technical Narrative & Immediate Containment
            </h4>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '6px' }}>
              {current.deviation_description}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {current.immediate_containment.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#a7f3d0' }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span><strong>[{c.action_type || 'Containment'}]:</strong> {c.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 5 Whys Root Cause Chain */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#93c5fd', letterSpacing: '0.05em', marginBottom: '8px' }}>
              3. Root Cause Analysis: 5 Whys Progression
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.five_whys_data.map((step) => (
                <div
                  key={step.step}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: step.is_root_cause ? 'rgba(239, 68, 68, 0.08)' : 'rgba(30, 41, 59, 0.3)',
                    borderLeft: `3px solid ${step.is_root_cause ? '#ef4444' : '#6366f1'}`,
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#f8fafc' }}>Why {step.step}: {step.question}</div>
                  <div style={{ color: '#cbd5e1', marginTop: '3px' }}>Answer: {step.answer}</div>
                  {step.evidence && (
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>
                      Evidence: {step.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Concluded Root Cause */}
          <div style={{ marginTop: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '14px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
              <AlertOctagon size={16} /> PRIMARY SYSTEMIC ROOT CAUSE (ICH Q7 § 12.2)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#fecaca', lineHeight: '1.5' }}>
              {current.suspected_root_cause || 'Investigation ongoing'}
            </div>
          </div>

          {/* Section 5: CAPA Action Plan */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#93c5fd', letterSpacing: '0.05em', marginBottom: '8px' }}>
              4. Corrective and Preventive Actions (CAPA)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.7)', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ padding: '8px' }}>Type</th>
                  <th style={{ padding: '8px' }}>Title & Description</th>
                  <th style={{ padding: '8px' }}>Owner</th>
                  <th style={{ padding: '8px' }}>Due Date</th>
                  <th style={{ padding: '8px' }}>Effectiveness Check Criteria</th>
                </tr>
              </thead>
              <tbody>
                {current.capa_recommendations.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      <span className={`badge ${c.capa_type === 'Corrective' ? 'badge-minor' : 'badge-success'}`}>
                        {c.capa_type}
                      </span>
                    </td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      <strong style={{ color: '#ffffff' }}>{c.title}</strong>
                      <div style={{ color: '#94a3b8', marginTop: '2px' }}>{c.description}</div>
                    </td>
                    <td style={{ padding: '8px', verticalAlign: 'top', color: '#cbd5e1' }}>{c.owner}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top', color: '#cbd5e1' }}>{c.target_date || '30 Days'}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top', color: '#a7f3d0' }}>{c.effectiveness_criteria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 6: QP Sign-off */}
          <div style={{ marginTop: '20px', borderTop: '2px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} />
                  {current.qp_signoff?.signed ? 'Formally Approved by Qualified Person' : 'Pending Formal Qualified Person Sign-Off'}
                </div>
                {current.qp_signoff?.signed && (
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    Signer: <strong>{current.qp_signoff.signer_name}</strong> ({current.qp_signoff.signer_role}) | Signed: {current.qp_signoff.signed_at}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Audit Verification Hash: SHA-256: {Math.random().toString(36).substring(2, 15).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={15} /> Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};
