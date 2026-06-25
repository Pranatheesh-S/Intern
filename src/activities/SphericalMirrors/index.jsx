import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  HelpCircle, 
  CheckCircle, 
  BookOpen, 
  Info,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import Stage1_Experiment from './components/Stage1_Experiment';
import PredictionPanel from './components/PredictionPanel';
import QuizPanel from './components/QuizPanel';

export default function SphericalMirrorsActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('experiment');
  const [progress, setProgress] = useState({
    experiment: false,
    prediction: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, experiment: true }));
    setActiveTab('prediction');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, prediction: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'experiment', name: '1. Virtual Experiment', icon: Play, component: <Stage1_Experiment onComplete={handleStage1Complete} /> },
    { id: 'prediction', name: '2. Prediction Check', icon: Lightbulb, component: <PredictionPanel onComplete={handleStage2Complete} />, locked: !progress.experiment },
    { id: 'quiz', name: '3. Concept Quiz', icon: HelpCircle, component: <QuizPanel />, locked: !progress.prediction }
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
              <h1>Spherical Mirrors Lab</h1>
            </div>
            <p className="header-subtitle">
              Explore Image Formation using Concave and Convex Surfaces
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
      <main style={{ minHeight: '520px', marginBottom: '2rem' }}>
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

      {/* Footer Educational Box */}
      <footer className="glass-panel" style={{ marginTop: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0 }} size={20} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
              Did you know? (Science Insights)
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
              A <strong>spherical mirror</strong> is a mirror which has the shape of a piece cut out of a spherical surface. 
              The inner curved surface of a shining spoon acts as a concave mirror, while its outer surface acts as a convex mirror. 
              The most common example of curved mirrors in everyday life are the rear-view mirrors in vehicles, which are convex to provide a wider field of view!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
