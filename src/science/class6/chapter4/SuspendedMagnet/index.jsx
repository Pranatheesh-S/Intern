import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, RotateCw, ArrowLeft, CheckCircle, HelpCircle } from 'lucide-react';
import Stage1_Experiment from './components/Stage1_Experiment';
import Stage2_Conclusion from './components/Stage2_Conclusion';
import Quiz from './Quiz';
import DidYouKnow from './DidYouKnow';

export default function SuspendedMagnetActivity({ onBackToDashboard, onComplete }) {
  const [activeTab, setActiveTab] = useState('experiment');
  const [progress, setProgress] = useState({
    experiment: false,
    conclusion: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, experiment: true }));
    setActiveTab('conclusion');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, conclusion: true }));
    setActiveTab('quiz');
  };

  const handleQuizComplete = () => {
    setProgress(prev => ({ ...prev, quiz: true }));
    if (onComplete) onComplete();
  };

  const tabs = [
    { id: 'experiment', name: '1. Let us Experiment', icon: RotateCw, component: <Stage1_Experiment onComplete={handleStage1Complete} /> },
    { id: 'conclusion', name: '2. Conclusion', icon: Compass, component: <Stage2_Conclusion onComplete={handleStage2Complete} />, locked: !progress.experiment },
    { id: 'quiz', name: '3. Quiz', icon: HelpCircle, component: <Quiz onComplete={handleQuizComplete} />, locked: !progress.conclusion }
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
      padding: '0.5rem 0.75rem'
    }}>
      {/* Top Header Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        paddingBottom: '0.4rem',
        marginBottom: '0.4rem',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0
      }}>
        {/* Left: Back Button */}
        <button 
          onClick={onBackToDashboard} 
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.4rem 0.85rem', 
            fontSize: '0.8rem', 
            gap: '0.35rem',
            background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(255, 119, 0, 0.35)'
          }}
        >
          <ArrowLeft size={14} color="#ffffff" /> Back to Class 6 Chapter 4
        </button>

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Compass size={18} style={{ color: '#ff7700' }} />
            Activity 4.3: Finding Directions
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Class 6 Science: Chapter 4 — A Freely Suspended Bar Magnet</span>
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
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : 'rgba(255, 255, 255, 0.08)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text)',
                  border: activeTab === tab.id ? 'none' : '1px solid var(--border)',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(255, 119, 0, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={13} color={activeTab === tab.id ? '#ffffff' : 'currentColor'} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={11} style={{ color: activeTab === tab.id ? '#ffffff' : 'var(--success)', marginLeft: '0.15rem' }} />
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
        alignItems: 'center',
        justifyContent: 'center',
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
