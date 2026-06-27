import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Play, 
  HelpCircle, 
  CheckCircle, 
  ArrowLeft,
  Info
} from 'lucide-react';
import Stage1_Build from './Stage1_Build';
import Stage2_Test from './Stage2_Test';
import QuizPanel from './QuizPanel';

export default function MagneticEffectOfCurrentActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('build');
  const [progress, setProgress] = useState({
    build: false,
    test: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, build: true }));
    setActiveTab('test');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, test: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'build', name: '1. Build Circuit', icon: Wrench, component: <Stage1_Build onComplete={handleStage1Complete} /> },
    { id: 'test', name: '2. Test Effect', icon: Play, component: <Stage2_Test onComplete={handleStage2Complete} />, locked: !progress.build },
    { id: 'quiz', name: '3. Concept Quiz', icon: HelpCircle, component: <QuizPanel />, locked: !progress.test }
  ];

  return (
    <div>
      {/* Subheader Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border)',
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
              gap: '0.35rem'
            }}
          >
            <ArrowLeft size={14} /> Back to Labs
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Magnetic Effect of Current</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 8 Activity 4.1 (Oersted's Experiment)</span>
          </div>
        </div>

        {/* Tabbed Navigation */}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Active Stage */}
        <main style={{ minHeight: '480px', marginBottom: '2rem' }}>
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

        {/* Right Column: Did you know? */}
        <aside className="glass-panel" style={{ padding: '1rem', position: 'sticky', top: '2rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <Info style={{ color: 'var(--accent)', flexShrink: 0 }} size={20} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)' }}>
              Did you know?
            </h4>
          </div>
          <div style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
            <p style={{ margin: '0 0 0.75rem 0', fontWeight: 'bold', color: 'var(--text)' }}>
              Science Insights
            </p>
            <p style={{ margin: '0 0 0.75rem 0' }}>
              Hans Christian Oersted discovered in 1820 that an electric current flowing through a wire creates a magnetic field around it.
            </p>
            <p style={{ margin: '0 0 0.75rem 0' }}>
              This is demonstrated by a magnetic compass needle deflecting when placed near the wire. 
            </p>
            <p style={{ margin: '0' }}>
              This fundamental principle led to the invention of electromagnets, electric motors, and modern power generation!
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
