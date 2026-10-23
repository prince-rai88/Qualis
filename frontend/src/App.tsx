import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store';
import { fetchInvestigations } from './store/slices/investigationSlice';
import { loadPresetsList } from './store/slices/aiSlice';

import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ProcessingView } from './components/ProcessingView';
import { WorkspaceView } from './components/WorkspaceView';
import { GroqKeyModal } from './components/GroqKeyModal';
import { QPSignoffModal } from './components/QPSignoffModal';
import { AuditSummaryModal } from './components/AuditSummaryModal';
import { CopilotDrawer } from './components/CopilotDrawer';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentView } = useAppSelector((state) => state.investigations);

  // Modals & Drawers state
  const [isGroqModalOpen, setIsGroqModalOpen] = useState(false);
  const [isQPSignoffModalOpen, setIsQPSignoffModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInvestigations());
    dispatch(loadPresetsList());
  }, [dispatch]);

  return (
    <div className="app-container">
      {/* Apple Pro OLED Spatial Ambient Lights */}
      <div className="ambient-volumetric-orbs" aria-hidden="true">
        <div className="orb-indigo" />
        <div className="orb-cyan" />
        <div className="orb-violet" />
      </div>

      {/* Minimal Top Navigation */}
      <Navbar
        onOpenGroqModal={() => setIsGroqModalOpen(true)}
        onOpenQPSignoffModal={() => setIsQPSignoffModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onToggleCopilotDrawer={() => setIsCopilotDrawerOpen(true)}
      />

      {/* Main Screen Switcher: Home vs Processing vs Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'home' && <HomeView />}
        {currentView === 'processing' && <ProcessingView />}
        {currentView === 'workspace' && (
          <WorkspaceView
            isCopilotDrawerOpen={isCopilotDrawerOpen}
            onCloseCopilotDrawer={() => setIsCopilotDrawerOpen(false)}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <GroqKeyModal isOpen={isGroqModalOpen} onClose={() => setIsGroqModalOpen(false)} />
      <QPSignoffModal isOpen={isQPSignoffModalOpen} onClose={() => setIsQPSignoffModalOpen(false)} />
      <AuditSummaryModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
      <CopilotDrawer
        isOpen={isCopilotDrawerOpen}
        onClose={() => setIsCopilotDrawerOpen(false)}
      />
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
