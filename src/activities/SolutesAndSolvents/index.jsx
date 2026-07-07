import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  HelpCircle, 
  CheckCircle, 
  BookOpen, 
  ArrowLeft,
  Wrench
} from 'lucide-react';
import Stage1_Setup from './components/Stage1_Setup';
import Stage2_Experiment from './components/Stage2_Experiment';
import QuizPanel from './components/QuizPanel';

export default function SolutesAndSolventsActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('setup');
  const [progress, setProgress] = useState({
    setup: false,
    experiment: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, setup: true }));
    setActiveTab('experiment');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, experiment: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'setup', name: '1. Setup Experiment', icon: Wrench, component: <Stage1_Setup onComplete={handleStage1Complete} /> },
    { id: 'experiment', name: '2. Virtual Experiment', icon: Play, component: <Stage2_Experiment onComplete={handleStage2Complete} />, locked: !progress.setup },
    { id: 'quiz', name: '3. Concept Quiz', icon: HelpCircle, component: <QuizPanel />, locked: !progress.experiment }
  ];

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          {onBackToDashboard && (
            <button 
              onClick={onBackToDashboard}
              className="outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--border)', height: 'fit-content' }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}
          <div>
            <div className="header-title">
              <BookOpen style={{ color: 'var(--accent)' }} size={24} />
              <h1>Activity 9.1: Solutes, Solvents, and Solutions</h1>
            </div>
            <p className="header-subtitle">
              Class 8 Chapter 9: What will happen if we keep on adding more salt in a given amount of water?
            </p>
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
      </header>

      {/* Main Workspace content */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'stretch' }}>
        <main style={{ flex: 1,  minHeight: '520px', marginBottom: '2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
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
                  Dilute vs Concentrated
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  The amount of solute present in a fixed quantity of solution is its <strong>concentration</strong>. A solution with less solute is <em>dilute</em>, while one with more is <em>concentrated</em>. These are relative terms!
                </p>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  Saturated Solutions
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  When no more solute can be dissolved at a given temperature, it becomes a <strong>saturated solution</strong>. The maximum amount of solute that dissolves is called its <em>solubility</em>.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
