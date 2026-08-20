import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Scissors, ArrowLeft, CheckCircle, Shapes, HelpCircle } from 'lucide-react';
import Stage1_Investigate from './components/Stage1_Investigate';
import Stage2_BreakingMagnet from './components/Stage2_BreakingMagnet';
import Stage3_Sandbox from './components/Stage3_Sandbox';
import Quiz from './Quiz';
import DidYouKnow from './DidYouKnow';

export default function MagneticPolesActivity({ onBackToDashboard, onComplete }) {
  const [activeTab, setActiveTab] = useState('investigate');
  const [progress, setProgress] = useState({
    investigate: false,
    breaking: false,
    sandbox: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, investigate: true }));
    setActiveTab('breaking');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, breaking: true }));
    setActiveTab('sandbox');
  };

  const handleStage3Complete = () => {
    setProgress(prev => ({ ...prev, sandbox: true }));
    setActiveTab('quiz');
  };

  const handleQuizComplete = () => {
    setProgress(prev => ({ ...prev, quiz: true }));
    if (onComplete) onComplete();
  };

  const tabs = [
    { id: 'investigate', name: '1. Let us Investigate', icon: Compass, component: <Stage1_Investigate onComplete={handleStage1Complete} /> },
    { id: 'breaking', name: '2. Breaking a Magnet', icon: Scissors, component: <Stage2_BreakingMagnet onComplete={handleStage2Complete} />, locked: !progress.investigate },
    { id: 'sandbox', name: '3. Other Shapes', icon: Shapes, component: <Stage3_Sandbox onComplete={handleStage3Complete} />, locked: !progress.breaking },
    { id: 'quiz', name: '4. Quiz', icon: HelpCircle, component: <Quiz onComplete={handleQuizComplete} />, locked: !progress.sandbox }
  ];

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
      padding: '0.5rem 0.75rem',
      backgroundColor: '#0F1015',
      position: 'relative'
    }}>
      {/* Lighter & Blurred Physics Lab Background Image Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('/MagneticPoles/vintage_lab_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(3px) brightness(1.18) contrast(0.96)',
        transform: 'scale(1.02)',
        zIndex: 0
      }} />

      {/* Light Overlay to keep background bright & clearly recognizable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(18, 18, 24, 0.38) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Light Magnetic Field Vector Lines Overlay */}
      <svg 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.35
        }} 
        viewBox="0 0 1440 900" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-100 450 C 200 100, 500 100, 720 450 C 940 800, 1240 800, 1540 450" stroke="rgba(250, 204, 21, 0.3)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 180, 500 180, 720 450 C 940 720, 1240 720, 1540 450" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 260, 500 260, 720 450 C 940 640, 1240 640, 1540 450" stroke="rgba(250, 204, 21, 0.2)" strokeWidth="2" fill="none" />
        <path d="M-100 450 C 200 340, 500 340, 720 450 C 940 560, 1240 560, 1540 450" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none" />
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
        borderRadius: '14px',
        border: '1px solid #3F3F46',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left: Midnight Gray Back Button with Crisp White Text */}
        <button 
          onClick={onBackToDashboard} 
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.45rem 0.9rem', 
            fontSize: '0.8rem', 
            gap: '0.35rem',
            background: '#18181B',
            color: '#FFFFFF',
            border: '1px solid #3F3F46',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={14} color="#FFFFFF" /> Back to Class 6 Chapter 4
        </button>

        {/* Center: Pure Snow White Title & Light Graphite Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.18rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', color: '#FFFFFF', fontWeight: 800 }}>
            <Compass size={19} style={{ color: '#F59E0B', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' }} />
            Activity 4.2: Poles of Magnet
          </h2>
          <span style={{ fontSize: '0.74rem', color: '#71717A', fontWeight: 600, letterSpacing: '0.02em' }}>Class 6 Science: Chapter 4 — Observe iron filings & magnetic poles</span>
        </div>

        {/* Right: Tabbed Navigation Bar */}
        <nav className="tabs-container" style={{ display: 'flex', gap: '0.35rem', margin: 0 }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCompleted = progress[tab.id];
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                disabled={tab.locked}
                style={{
                  opacity: tab.locked ? 0.4 : 1,
                  cursor: tab.locked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  borderRadius: '8px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#18181B',
                  color: activeTab === tab.id ? '#000000' : '#71717A',
                  border: activeTab === tab.id ? 'none' : '1px solid #3F3F46',
                  boxShadow: activeTab === tab.id ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={13} color={activeTab === tab.id ? '#000000' : (activeTab === tab.id ? '#F59E0B' : '#71717A')} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={11} style={{ color: activeTab === tab.id ? '#000000' : '#22C55E', marginLeft: '0.15rem' }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Active Stage Panel (Non-scrolling flex child) */}
      <main style={{ 
        width: '100%', 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {tabs.find(t => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Footer Bar */}
      {activeTab !== 'quiz' && (
        <footer style={{ marginTop: '0.4rem', width: '100%', flexShrink: 0, position: 'relative', zIndex: 99999 }}>
          <DidYouKnow />
        </footer>
      )}
    </div>
  );
}
