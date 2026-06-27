import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Play, 
  Globe, 
  HelpCircle, 
  CheckCircle, 
  ArrowLeft,
  Info
} from 'lucide-react';
import Stage1_Build from './components/Stage1_Build';
import Stage2_Test from './components/Stage2_Test';
import Stage3_Sandbox from './components/Stage3_Sandbox';
import Stage4_Quiz from './components/Stage4_Quiz';

export default function ElectromagnetBuilderActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('build');
  const [progress, setProgress] = useState({
    build: false,
    test: false,
    explore: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, build: true }));
    setActiveTab('test');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, test: true }));
    setActiveTab('explore');
  };

  const handleStage3Complete = () => {
    setProgress(prev => ({ ...prev, explore: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'build', name: '1. Build', icon: Wrench, component: <Stage1_Build onComplete={handleStage1Complete} /> },
    { id: 'test', name: '2. Predict & Test', icon: Play, component: <Stage2_Test onComplete={handleStage2Complete} />, locked: !progress.build },
    { id: 'explore', name: '3. Sandbox Explore', icon: Globe, component: <Stage3_Sandbox onComplete={handleStage3Complete} />, locked: !progress.test },
    { id: 'quiz', name: '4. Concept Quiz', icon: HelpCircle, component: <Stage4_Quiz />, locked: !progress.explore }
  ];

  return (
    <div>
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
            <ArrowLeft size={14} /> Back to Labs
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 4.2</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 8 • Electromagnet Builder</span>
          </div>
        </div>

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

      <footer className="glass-panel" style={{ marginTop: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0 }} size={20} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
              Temporary Magnetism
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
              An electromagnet is a temporary magnet. Its magnetism is only present when an electric current is flowing through the coil of wire wrapped around the iron core.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
