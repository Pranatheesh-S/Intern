import React, { useState } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import MagneticTable from './MagneticTable';
import DidYouKnow from './DidYouKnow';
import Quiz from './Quiz';

export default function Activity4_1({ onBackToDashboard, onComplete, onNext }) {
  const [stage, setStage] = useState('table');

  const handleTableComplete = () => {
    setStage('quiz');
  };

  const handleQuizComplete = () => {
    if (onComplete) onComplete();
    if (onNext) onNext();
  };

  return (
    <div style={{ 
      width: '100%', 
      height: 'calc(100vh - 16px)', 
      maxHeight: '100vh', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '0.25rem 0.75rem'
    }}>
      {/* Top Header */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        paddingBottom: '0.4rem',
        marginBottom: '0.4rem',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0
      }}>
        <button 
          onClick={onBackToDashboard} 
          className="outline" 
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.35rem 0.75rem', 
            fontSize: '0.78rem', 
            gap: '0.35rem',
            borderColor: 'var(--border)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Chapter 4
        </button>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Compass size={18} style={{ color: 'var(--accent)' }} />
            Activity 4.1: Magnetic and Non-Magnetic Materials
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Class 6 Science: Chapter 4 — Find and test materials</span>
        </div>

        {/* Balancing spacer to keep title exactly centered */}
        <div style={{ width: '180px', visibility: 'hidden' }} />
      </div>

      {/* Main Experiment / Quiz Content */}
      <main style={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {stage === 'table' ? (
          <MagneticTable onComplete={handleTableComplete} />
        ) : (
          <Quiz 
            onComplete={handleQuizComplete} 
            onBack={() => setStage('table')} 
          />
        )}
      </main>

      {/* Bottom Footer Bar */}
      {stage !== 'quiz' && (
        <footer style={{ marginTop: '0.4rem', width: '100%', flexShrink: 0, position: 'relative', zIndex: 99999 }}>
          <DidYouKnow />
        </footer>
      )}
    </div>
  );
}
