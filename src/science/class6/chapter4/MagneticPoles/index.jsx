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
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh', 
      zIndex: 101,
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '0.65rem 0.85rem',
      backgroundColor: '#FFFFFF',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>

      {/* Top Header Bar (Orange Theme) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.2rem 0.5rem',
        marginBottom: '0.5rem',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left: Back Button */}
        <button 
          onClick={onBackToDashboard} 
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.6rem 1.15rem', 
            fontSize: '0.92rem', 
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={18} color="#FFFFFF" /> Back to Chapter 4
        </button>

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.42rem', 
            fontWeight: 800, 
            fontFamily: "'Inter', sans-serif",
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.65rem', 
            color: '#0F172A', 
            letterSpacing: '-0.02em' 
          }}>
            <Compass size={28} style={{ color: '#D97706' }} />
            Activity 4.3: Poles of Magnet
          </h2>
          <span style={{ 
            fontSize: '0.88rem', 
            color: '#D97706', 
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700 
          }}>
            Class 6 Science — Observe iron filings & magnetic poles
          </span>
        </div>

        {/* Right: Tabbed Navigation Bar */}
        <nav className="tabs-container" style={{ display: 'flex', gap: '0.5rem', margin: 0, background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '28px', padding: '0.25rem' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCompleted = progress[tab.id];
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                disabled={tab.locked}
                style={{
                  opacity: tab.locked ? 0.45 : 1,
                  cursor: tab.locked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.92rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  borderRadius: '24px',
                  background: isActive ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : tab.locked ? '#94A3B8' : '#334155',
                  border: isActive ? 'none' : '1.5px solid #CBD5E1',
                  boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.35)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#FFFFFF' : tab.locked ? '#94A3B8' : '#334155'} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={16} style={{ color: isActive ? '#FFFFFF' : '#16A34A', marginLeft: '0.2rem' }} />
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
