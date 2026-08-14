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
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: '#070b19',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      padding: '0.75rem 1.25rem',
      boxSizing: 'border-box',
      gap: '0.6rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Top Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexShrink: 0,
        padding: '0 0.5rem'
      }}>
        <button 
          onClick={onBackToDashboard} 
          style={{ 
            padding: '0.4rem 0.9rem', 
            fontSize: '0.82rem', 
            borderRadius: '20px',
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover:bg-slate-700/60"
        >
          <ArrowLeft size={14} /> Back to Class 6 Chapter 4
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ffffff' }}>
            <Compass size={20} style={{ color: '#60a5fa' }} />
            Activity 4.1: Magnetic and Non-Magnetic Materials
          </h2>
        </div>

        <div style={{ width: '160px' }} />
      </div>

      {/* Main Stage (Table or Quiz) */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {stage === 'table' ? (
          <MagneticTable onComplete={handleTableComplete} />
        ) : (
          <Quiz 
            onComplete={handleQuizComplete} 
            onBack={() => setStage('table')} 
          />
        )}
      </div>

      {/* Bottom Did You Know Bar */}
      {stage !== 'quiz' && (
        <div style={{ flexShrink: 0, width: '100%' }}>
          <DidYouKnow />
        </div>
      )}
    </div>
  );
}

