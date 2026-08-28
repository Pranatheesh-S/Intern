import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, RotateCw, ArrowLeft, CheckCircle, HelpCircle } from 'lucide-react';
import Stage1_Experiment from './components/Stage1_Experiment';
import Stage2_Conclusion from './components/Stage2_Conclusion';
import Quiz from './Quiz';
import DidYouKnow from './DidYouKnow';
import './SuspendedMagnet.css';

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
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      {/* Top Header Bar */}
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
          className="gold-glow-btn"
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.6rem 1.25rem', 
            fontSize: '0.9rem', 
            gap: '0.5rem',
            borderRadius: '14px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={18} color="#FFFFFF" /> Back to Chapter 4
        </button>

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.35rem', 
            fontWeight: 900, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.65rem', 
            color: '#064E3B', 
            letterSpacing: '-0.01em' 
          }}>
            <Compass size={26} style={{ color: '#D97706' }} />
            Activity 4.4: Finding Directions
          </h2>
          <span style={{ 
            fontSize: '0.82rem', 
            color: '#047857', 
            fontWeight: 700 
          }}>
            Class 6 Science — A Freely Suspended Bar Magnet
          </span>
        </div>

        {/* Right: Tab Navigation Bar */}
        <nav style={{ display: 'flex', gap: '0.5rem', margin: 0, background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '28px', padding: '0.25rem' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCompleted = progress[tab.id];
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                disabled={tab.locked}
                className={isActive ? 'gold-glow-btn' : ''}
                style={{
                  opacity: tab.locked ? 0.45 : 1,
                  cursor: tab.locked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  borderRadius: '24px',
                  background: isActive ? undefined : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : tab.locked ? '#94A3B8' : '#334155',
                  border: isActive ? 'none' : '1.5px solid #CBD5E1',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#FFFFFF' : tab.locked ? '#94A3B8' : '#059669'} />
                <span>{tab.name}</span>
                {isCompleted && !isActive && <CheckCircle size={14} color="#10B981" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Stage Canvas (Sage Mint Light Theme) */}
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
