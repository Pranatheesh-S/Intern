import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';

export default function AIMentor({ state, text, hint }) {
  // state can be: 'idle', 'hint', 'success', 'error'
  
  const getTheme = () => {
    switch (state) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: '#10b981',
          iconColor: '#34d399',
          title: 'Detective Mentor (Correct!)',
          icon: CheckCircle
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: '#f87171',
          iconColor: '#fca5a5',
          title: 'Detective Mentor (Hint)',
          icon: AlertCircle
        };
      case 'hint':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.3)',
          text: '#f59e0b',
          iconColor: '#fcd34d',
          title: 'Detective Mentor (Observation)',
          icon: HelpCircle
        };
      default:
        return {
          bg: 'var(--accent-bg)',
          border: 'var(--accent-border)',
          text: 'var(--accent-text)',
          iconColor: 'var(--accent)',
          title: 'Detective Mentor',
          icon: Sparkles
        };
    }
  };

  const currentTheme = getTheme();
  const IconComponent = currentTheme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel"
      style={{
        background: currentTheme.bg,
        borderColor: currentTheme.border,
        padding: '1.25rem',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: 'var(--card-shadow)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: currentTheme.iconColor
        }}>
          <IconComponent size={18} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)' }}>
            {currentTheme.title}
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class 6 Science Guide</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '1.75rem', lineHeight: '1' }}>🕵️‍♂️</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {text}
          </p>
          {hint && (
            <div style={{ 
              marginTop: '0.5rem', 
              paddingTop: '0.5rem', 
              borderTop: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.8rem', 
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}>
              <strong>💡 Clue:</strong> {hint}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
