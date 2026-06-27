import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnet, Compass, ArrowLeft, Info, CheckCircle } from 'lucide-react';
import Stage1_Magnetize from './components/Stage1_Magnetize';
import Stage2_Floating from './components/Stage2_Floating';

export default function MagneticCompassActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('magnetize');
  const [progress, setProgress] = useState({
    magnetize: false,
    floating: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, magnetize: true }));
    // Manual tab transition rule: do not transition automatically
    setActiveTab('floating');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, floating: true }));
  };

  const tabs = [
    { id: 'magnetize', name: '1. Magnetize', icon: Magnet, component: <Stage1_Magnetize onComplete={handleStage1Complete} /> },
    { id: 'floating', name: '2. Make a Compass', icon: Compass, component: <Stage2_Floating onComplete={handleStage2Complete} />, locked: !progress.magnetize }
  ];

  return (
    <div>
      {/* Subheader Navigation with Back Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.8rem', 
              gap: '0.35rem',
              borderColor: 'var(--border)'
            }}
          >
            <ArrowLeft size={14} /> Back to Class 6 Chapter 4
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 4.4: Let us construct</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Making a Simple Magnetic Compass</span>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <nav className="tabs-container">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCompleted = progress[tab.id];
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                disabled={tab.locked}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                style={{
                  opacity: tab.locked ? 0.4 : 1,
                  cursor: tab.locked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.85rem'
                }}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={12} style={{ color: 'var(--success)', marginLeft: '0.15rem' }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Stage Panel */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'stretch' }}>
        <main style={{ flex: 1,  minHeight: '480px', marginBottom: '2rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find(t => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </main>

        {/* Right Sidebar (Educational Tip) */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div className="glass-panel" style={{ padding: '1.25rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🧠</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>
                  Did you know?
                </h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  Science Insights
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  We can magnetize an iron object, like a sewing needle, by rubbing it with a permanent magnet in the same direction repeatedly. Once magnetized, it behaves like a bar magnet and aligns North-South when floating freely!
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
