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
      padding: '0.25rem 0.75rem',
      backgroundColor: '#09090B',
      position: 'relative'
    }}>
      {/* High Quality Recognizeable Physics Lab Background with Controlled Blur */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/MagneticPoles/vintage_lab_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px) brightness(1.18) contrast(0.96)',
          transform: 'scale(1.02)',
          zIndex: 0
        }}
      />

      {/* Dark Vector Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(9, 9, 11, 0.45)',
          zIndex: 0
        }}
      />

      {/* Magnetic Field Lines SVG */}
      <svg 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }} 
        viewBox="0 0 1440 900" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-100 450 C 200 100, 500 100, 720 450 C 940 800, 1240 800, 1540 450" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 180, 500 180, 720 450 C 940 720, 1240 720, 1540 450" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="3" fill="none" />
      </svg>

      {/* Top Header Bar with Midnight Carbon Contrast Theme */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.45rem 0.85rem',
        marginBottom: '0.4rem',
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #3F3F46',
        borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(245, 158, 11, 0.15)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        <button 
          onClick={onBackToDashboard} 
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.45rem 0.95rem', 
            fontSize: '0.82rem', 
            gap: '0.4rem',
            background: '#18181B',
            color: '#FFFFFF',
            border: '1px solid #3F3F46',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} color="#FFFFFF" /> Back to Class 6 Chapter 4
        </button>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            <Compass size={22} style={{ color: '#F59E0B', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' }} />
            Activity 4.1: Magnetic and Non-Magnetic Materials
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 600 }}>Class 6 Science: Chapter 4 — Find and test materials</span>
        </div>

        {/* Balancing spacer */}
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
