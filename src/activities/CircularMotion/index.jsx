import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import Stage1_Experiment from './components/Stage1_Experiment';
import Stage2_Conclusion from './components/Stage2_Conclusion';

export default function CircularMotionActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('experiment');
  const [progress, setProgress] = useState({
    experiment: false,
    conclusion: false
  });

  const [experimentCompleted, setExperimentCompleted] = useState(false);

  const handleExperimentComplete = () => {
    setExperimentCompleted(true);
    setProgress(prev => ({ ...prev, experiment: true }));
    setActiveTab('conclusion');
  };

  const tabs = [
    { id: 'experiment', name: '1. Investigate', icon: Beaker, component: <Stage1_Experiment onComplete={handleExperimentComplete} /> },
    { id: 'conclusion', name: '2. Conclude', icon: CheckCircle, component: <Stage2_Conclusion />, locked: !progress.experiment }
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
            <ArrowLeft size={14} /> Back to Class 6 Chapter 5
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 5.4: Circular Motion</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Let us investigate</span>
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

      {/* Footer Educational Box */}
      <footer className="glass-panel" style={{ marginTop: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0 }} size={20} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
              Educational Tip
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
              When an object moves along a circular path, its motion is called <strong>Circular Motion</strong>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
