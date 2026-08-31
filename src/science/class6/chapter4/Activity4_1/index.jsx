import React, { useState } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import MagneticTable from './MagneticTable';
import DidYouKnow from './DidYouKnow';
import Quiz from './Quiz';
import './Activity4_1.css';

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
      padding: '0.65rem 0.85rem',
      backgroundColor: '#FFFFFF',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      {/* Top Header Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.25rem 0.5rem',
        marginBottom: '0.5rem',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left Column: Back Button */}
        <button 
          onClick={onBackToDashboard}
          className="gold-glow-btn"
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.6rem 1.25rem', 
            fontSize: '0.9rem', 
            borderRadius: '14px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={18} color="#FFFFFF" /> Back to Chapter 4
        </button>

        {/* Center Column: Title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', color: '#064E3B', letterSpacing: '-0.01em' }}>
            <Compass size={24} style={{ color: '#D97706' }} />
            Activity 4.1 & 4.2: Magnetic & Non-Magnetic Materials
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>Class 6 Science — Finding Magnetic Materials & Sorting Objects</span>
        </div>

        {/* Right Column: Stage Navigation Pill */}
        <div style={{ display: 'flex', gap: '0.5rem', margin: 0 }}>
          <button
            onClick={() => setStage('table')}
            className={stage === 'table' ? 'gold-glow-btn' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.15rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '25px',
              background: stage === 'table' ? undefined : '#F8FAFC',
              color: stage === 'table' ? '#FFFFFF' : '#334155',
              border: stage === 'table' ? 'none' : '1.5px solid #CBD5E1',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            1. Classification Table
          </button>
          <button
            onClick={() => setStage('quiz')}
            className={stage === 'quiz' ? 'gold-glow-btn' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.15rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '25px',
              background: stage === 'quiz' ? undefined : '#F8FAFC',
              color: stage === 'quiz' ? '#FFFFFF' : '#334155',
              border: stage === 'quiz' ? 'none' : '1.5px solid #CBD5E1',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            2. Knowledge Quiz
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
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
