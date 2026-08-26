import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, HelpCircle, Compass, CheckSquare, ArrowLeft, Info, CheckCircle } from 'lucide-react';
import Stage1_Build from './components/Stage1_Build';
import Stage3_Explore from './components/Stage3_Explore';
import Stage4_Quiz from './components/Stage4_Quiz';
import DidYouKnow from './DidYouKnow';

export default function MagnetInteractionActivity({ onBackToDashboard, onComplete }) {
  const [activeTab, setActiveTab] = useState('build');
  const [progress, setProgress] = useState({
    build: false,
    explore: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, build: true }));
  };

  const handleStage3Complete = () => {
    setProgress(prev => ({ ...prev, explore: true }));
  };

  const handleStage4Complete = () => {
    setProgress(prev => ({ ...prev, quiz: true }));
    if (onComplete) onComplete();
  };

  const tabs = [
    { id: 'build', name: '1. Build', icon: Hammer, component: <Stage1_Build onComplete={handleStage1Complete} onNext={() => setActiveTab('explore')} /> },
    { id: 'explore', name: '2. Explore', icon: Compass, component: <Stage3_Explore onComplete={handleStage3Complete} onNext={() => setActiveTab('quiz')} />, locked: !progress.build },
    { id: 'quiz', name: '3. Quiz', icon: CheckSquare, component: <Stage4_Quiz onComplete={handleStage4Complete} />, locked: !progress.explore }
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
      backgroundColor: '#ECFDF5',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(167, 243, 208, 0.45) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(253, 230, 138, 0.35) 0%, transparent 40%)
      `,
      position: 'relative'
    }}>
      {/* Top Header Bar with Sage Mint Light Theme */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.55rem 1.15rem',
        marginBottom: '0.4rem',
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '20px',
        boxShadow: '0 6px 20px rgba(6, 78, 59, 0.06)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left: Back Button */}
        <button 
          onClick={onBackToDashboard} 
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.55rem 1.25rem', 
            fontSize: '0.85rem', 
            gap: '0.4rem',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} color="#FFFFFF" /> Back to Chapter 4
        </button>

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#064E3B', letterSpacing: '-0.01em' }}>
            <Compass size={22} style={{ color: '#D97706' }} />
            Activity 4.6: Attraction and Repulsion of Magnets
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>Class 6 Science — Attraction & Repulsion Between Magnetic Poles</span>
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
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  borderRadius: '20px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : tab.locked ? '#94A3B8' : '#334155',
                  border: activeTab === tab.id ? 'none' : '1.5px solid #CBD5E1',
                  boxShadow: activeTab === tab.id ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={activeTab === tab.id ? '#FFFFFF' : tab.locked ? '#94A3B8' : '#334155'} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={13} style={{ color: activeTab === tab.id ? '#FFFFFF' : '#16A34A', marginLeft: '0.15rem' }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Active Stage Panel (Non-scrolling standalone flex child) */}
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
