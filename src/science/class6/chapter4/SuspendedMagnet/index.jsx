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
      padding: '0.5rem 0.75rem',
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
        {/* Left: Back Button */}
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

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            <Compass size={22} style={{ color: '#F59E0B', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' }} />
            Activity 4.3: Finding Directions
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 600 }}>Class 6 Science: Chapter 4 — A Freely Suspended Bar Magnet</span>
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
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderRadius: '20px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#18181B',
                  color: activeTab === tab.id ? '#000000' : tab.locked ? '#52525B' : '#71717A',
                  border: activeTab === tab.id ? 'none' : '1px solid #3F3F46',
                  boxShadow: activeTab === tab.id ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={activeTab === tab.id ? '#000000' : tab.locked ? '#52525B' : '#71717A'} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={12} style={{ color: activeTab === tab.id ? '#000000' : '#22C55E', marginLeft: '0.15rem' }} />
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
