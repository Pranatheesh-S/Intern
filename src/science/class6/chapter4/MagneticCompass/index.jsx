import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnet, Compass, ArrowLeft, Info, CheckCircle } from 'lucide-react';
import Stage1_Magnetize from './components/Stage1_Magnetize';
import Stage2_Floating from './components/Stage2_Floating';
import Quiz from './Quiz';
import DidYouKnow from './DidYouKnow';
import { HelpCircle } from 'lucide-react';

export default function MagneticCompassActivity({ onBackToDashboard, onComplete }) {
  const [activeTab, setActiveTab] = useState('magnetize');
  const [progress, setProgress] = useState({
    magnetize: false,
    floating: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, magnetize: true }));
    // Manual tab transition rule: do not transition automatically
    setActiveTab('floating');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, floating: true }));
    setActiveTab('quiz');
  };

  const handleQuizComplete = () => {
    setProgress(prev => ({ ...prev, quiz: true }));
    if (onComplete) onComplete();
  };

  const tabs = [
    { id: 'magnetize', name: '1. Magnetize', icon: Magnet, component: <Stage1_Magnetize onComplete={handleStage1Complete} /> },
    { id: 'floating', name: '2. Make a Compass', icon: Compass, component: <Stage2_Floating onComplete={handleStage2Complete} />, locked: !progress.magnetize },
    { id: 'quiz', name: '3. Quiz', icon: HelpCircle, component: <Quiz onComplete={handleQuizComplete} />, locked: !progress.floating }
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
      padding: '0.65rem 0.85rem',
      backgroundColor: '#ECFDF5',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Soft Decorative Ambient Background Glows */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.45) 0%, rgba(236, 253, 245, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(253, 230, 138, 0.35) 0%, rgba(236, 253, 245, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Header Bar matching Activity 4.3 styling */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.65rem 1.25rem',
        marginBottom: '0.65rem',
        background: '#FFFFFF',
        border: '2px solid #A7F3D0',
        borderRadius: '24px',
        boxShadow: '0 6px 24px rgba(6, 78, 59, 0.07)',
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
            fontWeight: 900,
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
          <h2 style={{ margin: 0, fontSize: '1.42rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', color: '#064E3B', letterSpacing: '-0.02em' }}>
            <Compass size={28} style={{ color: '#D97706' }} />
            Activity 4.5: Making a Simple Magnetic Compass
          </h2>
          <span style={{ fontSize: '0.88rem', color: '#047857', fontWeight: 800 }}>Class 6 Science — Constructing a Floating Compass</span>
        </div>

        {/* Right: Tabbed Navigation Bar */}
        <nav className="tabs-container" style={{ display: 'flex', gap: '0.5rem', margin: 0 }}>
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
                  padding: '0.6rem 1.15rem',
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  borderRadius: '25px',
                  background: isActive ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : tab.locked ? '#94A3B8' : '#334155',
                  border: isActive ? 'none' : '1.5px solid #CBD5E1',
                  boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
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
