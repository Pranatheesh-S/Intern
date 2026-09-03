import React from 'react';
import { BookOpen, Check } from 'lucide-react';
import './animations.css';

export default function DetectiveNotebook({ observations }) {
  return (
    <div style={{ background: 'var(--lesson-background)', border: '1px solid var(--lesson-border)', borderRadius: '4px', padding: '1rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)', position: 'relative' }}>
      {/* Notebook spine */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '20px', borderRight: '2px double var(--lesson-border)', background: 'var(--lesson-surface)', borderRadius: '4px 0 0 4px' }} />
      
      <div style={{ marginLeft: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--lesson-text)', fontSize: '1.1rem', borderBottom: '2px solid var(--lesson-border)', paddingBottom: '0.5rem' }}>
          <BookOpen size={18} style={{ color: 'var(--lesson-muted)' }} />
          Detective Notebook
        </h4>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {observations.map((obs, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--lesson-text)', borderBottom: '1px dashed var(--lesson-border)', paddingBottom: '0.5rem' }}>
              <Check size={16} style={{ color: 'var(--lesson-success)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>{obs.object}</strong> → <span style={{ color: 'var(--lesson-accent)', fontWeight: 'bold' }}>{obs.finding}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
