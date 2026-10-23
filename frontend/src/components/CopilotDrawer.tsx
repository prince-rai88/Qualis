import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { sendCopilotMessage } from '../store/slices/aiSlice';
import { X, Send, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CopilotDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { chatMessages, chatLoading } = useAppSelector((state) => state.ai);
  const { current } = useAppSelector((state) => state.investigations);
  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    dispatch(sendCopilotMessage({ message: inputMessage.trim(), context: current }));
    setInputMessage('');
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent-subtle)', padding: '6px', borderRadius: '6px', color: 'var(--accent-text)' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>Quality Copilot</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ICH Q7, Q10 & 21 CFR guidance</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="drawer-body">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-elevated)',
                color: msg.sender === 'user' ? '#ffffff' : 'var(--text-secondary)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                maxWidth: '90%',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
              }}
            >
              {msg.text}
            </div>
          ))}

          {chatLoading && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontStyle: 'italic' }}>
              Consulting regulatory knowledge base...
            </div>
          )}
        </div>

        <div className="drawer-footer" style={{ padding: '12px 20px' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, fontSize: '0.82rem' }}
              placeholder="Ask about batch disposition, OOS, or testing..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={chatLoading || !inputMessage.trim()}
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
