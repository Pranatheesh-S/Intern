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
      background: 'linear-gradient(135deg, #EBF5F6 0%, #EDF8F7 100%)',
      position: 'relative'
    }}>
      {/* Light Pastel Magnetic Field Vector Lines Background SVG */}
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
        <path d="M-100 450 C 200 100, 500 100, 720 450 C 940 800, 1240 800, 1540 450" stroke="rgba(13, 148, 136, 0.15)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 180, 500 180, 720 450 C 940 720, 1240 720, 1540 450" stroke="rgba(244, 63, 94, 0.15)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 260, 500 260, 720 450 C 940 640, 1240 640, 1540 450" stroke="rgba(13, 148, 136, 0.12)" strokeWidth="2" fill="none" />
        <path d="M-100 450 C 200 340, 500 340, 720 450 C 940 560, 1240 560, 1540 450" stroke="rgba(244, 63, 94, 0.12)" strokeWidth="2" fill="none" />
        <circle cx="350" cy="450" r="280" stroke="rgba(13, 148, 136, 0.06)" strokeWidth="40" fill="none" />
        <circle cx="1090" cy="450" r="280" stroke="rgba(244, 63, 94, 0.06)" strokeWidth="40" fill="none" />
      </svg>
      {/* Top Header Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        paddingBottom: '0.4rem',
        marginBottom: '0.4rem',
        borderBottom: '1px solid #CCECE7',
        flexShrink: 0
      }}>
        {/* Left: Crimson Red Back Button */}
        <button 
          onClick={onBackToDashboard} 
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.4rem 0.85rem', 
            fontSize: '0.8rem', 
            gap: '0.35rem',
            background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.35)'
          }}
        >
          <ArrowLeft size={14} color="#ffffff" /> Back to Class 6 Chapter 4
        </button>

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#134E4A' }}>
            <Compass size={18} style={{ color: '#F43F5E' }} />
            Activity 4.2: Poles of Magnet
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600 }}>Class 6 Science: Chapter 4 — Observe iron filings & magnetic poles</span>
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
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === tab.id ? 700 : 600,
                  borderRadius: '8px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#FFFFFF',
                  color: activeTab === tab.id ? '#ffffff' : '#E11D48',
                  border: activeTab === tab.id ? 'none' : '1.5px solid #FECDD3',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(244, 63, 94, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={13} color={activeTab === tab.id ? '#ffffff' : '#F43F5E'} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={11} style={{ color: activeTab === tab.id ? '#ffffff' : '#10B981', marginLeft: '0.15rem' }} />
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
