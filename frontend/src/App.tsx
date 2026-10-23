import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store';
import { fetchInvestigations, setActiveTab } from './store/slices/investigationSlice';
import { loadPresetsList } from './store/slices/aiSlice';

import { Navbar } from './components/Navbar';
import { AICopilotPanel } from './components/AICopilotPanel';
import { InvestigationDetailsTab } from './components/InvestigationDetailsTab';
import { RootCauseTab } from './components/RootCauseTab';
import { EvidenceGapsTab } from './components/EvidenceGapsTab';
import { CAPATab } from './components/CAPATab';
import { GroqKeyModal } from './components/GroqKeyModal';
import { QPSignoffModal } from './components/QPSignoffModal';
import { AuditSummaryModal } from './components/AuditSummaryModal';

import {
  FileText,
  GitBranch,
  ShieldAlert,
  CheckSquare,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { current, activeTab, viewMode } = useAppSelector((state) => state.investigations);

  // Modals state
  const [isGroqModalOpen, setIsGroqModalOpen] = useState(false);
  const [isQPSignoffModalOpen, setIsQPSignoffModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInvestigations());
    dispatch(loadPresetsList());
  }, [dispatch]);

  return (
    <div className="app-container">
      <div className="app-bg-glow" />

      {/* Top Navigation */}
      <Navbar
        onOpenGroqModal={() => setIsGroqModalOpen(true)}
        onOpenQPSignoffModal={() => setIsQPSignoffModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* Split Workspace */}
      <main className={`workspace-container ${viewMode}`}>
        {/* Left: AI Copilot Panel (shown in 'split' or 'copilot_only') */}
        {viewMode !== 'form_only' && <AICopilotPanel />}

        {/* Right: Main Investigation Dossier & RCA Form */}
        {viewMode !== 'copilot_only' && (
          <section className="main-dossier">
            {/* Dossier Tabs Subnav */}
            <div className="dossier-subnav">
              <div className="tab-nav-group">
                <button
                  className={`tab-nav-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => dispatch(setActiveTab('details'))}
                >
                  <FileText size={15} />
                  <span>1. Incident Details & Containment</span>
                </button>

                <button
                  className={`tab-nav-btn ${activeTab === 'root_cause' ? 'active' : ''}`}
                  onClick={() => dispatch(setActiveTab('root_cause'))}
                >
                  <GitBranch size={15} />
                  <span>2. Root Cause (5 Whys & 6M)</span>
                </button>

                <button
                  className={`tab-nav-btn ${activeTab === 'evidence_gaps' ? 'active' : ''}`}
                  onClick={() => dispatch(setActiveTab('evidence_gaps'))}
                >
                  <ShieldAlert size={15} />
                  <span>3. Missing Evidence ({current.missing_evidence?.length || 0})</span>
                </button>

                <button
                  className={`tab-nav-btn ${activeTab === 'capa' ? 'active' : ''}`}
                  onClick={() => dispatch(setActiveTab('capa'))}
                >
                  <CheckSquare size={15} />
                  <span>4. CAPA Actions ({current.capa_recommendations?.length || 0})</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {current.qp_signoff?.signed ? (
                  <span className="badge badge-success" style={{ padding: '4px 10px' }}>
                    <ShieldCheck size={13} /> QP Approved
                  </span>
                ) : (
                  <span className="badge badge-major" style={{ padding: '4px 10px' }}>
                    Under Investigation
                  </span>
                )}
              </div>
            </div>

            {/* Dossier Content Area */}
            <div className="dossier-body">
              {activeTab === 'details' && <InvestigationDetailsTab />}
              {activeTab === 'root_cause' && <RootCauseTab />}
              {activeTab === 'evidence_gaps' && <EvidenceGapsTab />}
              {activeTab === 'capa' && <CAPATab />}
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      <GroqKeyModal isOpen={isGroqModalOpen} onClose={() => setIsGroqModalOpen(false)} />
      <QPSignoffModal isOpen={isQPSignoffModalOpen} onClose={() => setIsQPSignoffModalOpen(false)} />
      <AuditSummaryModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
