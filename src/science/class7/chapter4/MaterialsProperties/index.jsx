import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Hammer, HelpCircle, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import Stage1_Observation from './components/Stage1_Observation';
import Stage2_HammerTest from './components/Stage2_HammerTest';
import QuizPanel from './components/QuizPanel';

export default function MaterialsPropertiesActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('observe');
  const [progress, setProgress] = useState({
    observe: false,
    hammer: false,
    quiz: false
  });

  // Store observations to pass between stages/quiz
  const [observations, setObservations] = useState({});

  const handleStage1Complete = (stageData) => {
    setObservations(prev => ({ ...prev, observe: stageData }));
    setProgress(prev => ({ ...prev, observe: true }));
    setActiveTab('hammer');
  };

  const handleStage2Complete = (stageData) => {
    setObservations(prev => ({ ...prev, hammer: stageData }));
    setProgress(prev => ({ ...prev, hammer: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'observe', name: '1. Observe Appearance', icon: Eye, component: <Stage1_Observation onComplete={handleStage1Complete} /> },
    { id: 'hammer', name: '2. Hammer Test', icon: Hammer, component: <Stage2_HammerTest onComplete={handleStage2Complete} />, locked: !progress.observe },
    { id: 'quiz', name: '3. Record Observations', icon: HelpCircle, component: <QuizPanel observations={observations} />, locked: !progress.hammer }
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
              position: 'relative', zIndex: 100,
              padding: '0.4rem 0.8rem', 
              fontSize: '0.8rem', 
              gap: '0.35rem',
              borderColor: 'var(--border)'
            }}
          >
            <ArrowLeft size={14} /> Back to Class 6 Chapter 4
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 4.1: Properties of Materials</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Appearance, Hardness, and Hammering Effect</span>
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
                  Materials have different properties. Some are lustrous (shiny) and hard, while others are dull and soft. Metals generally flatten when beaten (malleability), whereas non-metals like coal and sulfur break into pieces (brittleness).
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
