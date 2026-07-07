import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import IntroductionPage from './components/IntroductionPage';

export default function GeographyExpeditionActivity({ onBackToDashboard }) {
  // For now, this just wraps the IntroductionPage
  // In the future, it can manage the state between the intro and the actual activities.
  const [stage, setStage] = useState('intro');

  return (
    <div style={{ width: '100%', padding: '0 2rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBackToDashboard} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--border)', borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>FuturaX Social Lab</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 7 • Geography • Chapter 1</span>
          </div>
        </div>
        
        <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontWeight: 'bold', fontSize: '0.85rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', boxShadow: '0 0 8px #eab308' }} />
          0 XP
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {stage === 'intro' && (
          <IntroductionPage 
            onBeginExpedition={() => setStage('activities')} 
          />
        )}
      
      {stage === 'activities' && (
        <div style={{ padding: '2rem', color: 'white' }}>
          <h2>Expedition Started</h2>
          <p>This is where the chapter activities will take place.</p>
          <button 
            className="primary"
            onClick={onBackToDashboard}
            style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', borderRadius: '8px' }}
          >
            End Expedition
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
