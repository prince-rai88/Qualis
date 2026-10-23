import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setGroqApiKey, setGroqModel, testGroqApiKey } from '../store/slices/aiSlice';
import { Key, CheckCircle, AlertTriangle, Cpu, ExternalLink, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GroqKeyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { groqApiKey, groqModel, isGroqConnected, testingKey, keyStatusMessage } = useAppSelector(
    (state) => state.ai
  );

  const [inputKey, setInputKey] = useState(groqApiKey);
  const [selectedModel, setSelectedModel] = useState(groqModel);

  if (!isOpen) return null;

  const handleSave = () => {
    dispatch(setGroqApiKey(inputKey.trim()));
    dispatch(setGroqModel(selectedModel));
    if (inputKey.trim()) {
      dispatch(testGroqApiKey(inputKey.trim()));
    }
    onClose();
  };

  const handleTest = () => {
    if (inputKey.trim()) {
      dispatch(testGroqApiKey(inputKey.trim()));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '8px', borderRadius: '8px', color: '#818cf8' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Groq AI LLM Settings</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure your Groq API credentials for live inference</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">
              <span>Groq API Key</span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#818cf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
              >
                Get API Key <ExternalLink size={11} />
              </a>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="gsk_..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Note: If no key is provided, Qualis AI uses high-fidelity pharmaceutical pre-analyzed domain models so you can test all features seamlessly.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">AI Inference Model</label>
            <select
              className="form-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended - High Analytical Accuracy)</option>
              <option value="gemma2-9b-it">gemma2-9b-it (Ultra Fast)</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
            </select>
          </div>

          {keyStatusMessage && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isGroqConnected ? 'var(--success-bg)' : 'var(--warning-bg)',
                border: `1px solid ${isGroqConnected ? 'var(--success-border)' : 'var(--warning-border)'}`,
                color: isGroqConnected ? '#34d399' : '#fbbf24',
              }}
            >
              {isGroqConnected ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              <span>{keyStatusMessage}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={handleTest} disabled={testingKey || !inputKey.trim()}>
            {testingKey ? 'Testing Connection...' : 'Test Connection'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
