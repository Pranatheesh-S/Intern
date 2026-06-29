import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Play, 
  Globe, 
  HelpCircle, 
  CheckCircle, 
  ArrowLeft
} from 'lucide-react';
import Stage1_Build from './Stage1_Build';
import Stage2_Test from './Stage2_Test';
import Stage3_Explore from './Stage3_Explore';
import QuizPanel from './QuizPanel';

export default function ElectricSwitchActivity({ onBackToDashboard }) {
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
    { id: 'build', name: '1. Build Switch', icon: Wrench, component: <Stage1_Build onComplete={handleStage1Complete} /> },
    { id: 'test', name: '2. Test Switch', icon: Play, component: <Stage2_Test onComplete={handleStage2Complete} />, locked: !progress.build },
    { id: 'explore', name: '3. Explore Sandbox', icon: Globe, component: <Stage3_Explore onComplete={handleStage3Complete} />, locked: !progress.build },
    { id: 'quiz', name: '4. Concept Quiz', icon: HelpCircle, component: <QuizPanel />, locked: !progress.build }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Subheader Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
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
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Electric Switch Science Lab</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Activities 3.8 & 3.9</span>
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

      {/* Active Stage View */}
      <main style={{ width: '100%', minHeight: '480px', marginBottom: '1.5rem' }}>
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
    </div>
  );
}
