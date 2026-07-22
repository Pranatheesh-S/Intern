import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  HelpCircle, 
  CheckCircle, 
  BookOpen, 
  Info,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import Stage1_Experiment from './components/Stage1_Experiment';
import QuizPanel from './components/QuizPanel';

export default function ProteinTestingActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('experiment');
  const [progress, setProgress] = useState({
    experiment: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, experiment: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'experiment', name: '1. Virtual Experiment', icon: Play, component: <Stage1_Experiment onComplete={handleStage1Complete} /> },
    { id: 'quiz', name: '2. Concept Quiz', icon: HelpCircle, component: <QuizPanel />, locked: !progress.experiment }
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
              <h1>Protein Testing Lab</h1>
            </div>
            <p className="header-subtitle">
              Class 6 Chapter 3 (Activity 3.7): Testing for the presence of proteins
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

      {/* Safety Warning */}
      {activeTab === 'experiment' && (
        <div style={{ 
          margin: '0 2rem 2rem 2rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          borderRadius: '12px', 
          padding: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '0.2rem' }} size={24} />
          <div>
            <h4 style={{ margin: 0, color: 'var(--danger)', fontSize: '1rem' }}>Safety Precautions</h4>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-heading)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <li>These chemicals are harmful and need to be handled with care. Do not touch any of these chemicals unless asked to do so.</li>
              <li>If any chemical gets spilled on your body, immediately wash the affected area with water.</li>
              <li>Do not put any of these chemicals into your mouth, or try to smell them.</li>
            </ul>
          </div>
        </div>
      )}

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
                  Science Insights
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  <strong>Proteins</strong> react with copper sulfate and caustic soda (sodium hydroxide) to form a distinct violet-colored complex. This is known as the Biuret test.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
