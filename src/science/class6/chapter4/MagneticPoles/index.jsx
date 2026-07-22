import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Scissors, ArrowLeft, Info, CheckCircle, Shapes } from 'lucide-react';
import Stage1_Investigate from './components/Stage1_Investigate';
import Stage2_BreakingMagnet from './components/Stage2_BreakingMagnet';
import Stage3_Sandbox from './components/Stage3_Sandbox';
import Quiz from './Quiz';
import DidYouKnow from './DidYouKnow';
import { HelpCircle } from 'lucide-react';

export default function MagneticPolesActivity({ onBackToDashboard, onComplete }) {
  const [activeTab, setActiveTab] = useState('investigate');
  const [progress, setProgress] = useState({
    investigate: false,
    breaking: false,
    sandbox: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, investigate: true }));
    setActiveTab('breaking');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, breaking: true }));
    setActiveTab('sandbox');
  };

  const handleStage3Complete = () => {
    setProgress(prev => ({ ...prev, sandbox: true }));
    setActiveTab('quiz');
  };

  const handleQuizComplete = () => {
    setProgress(prev => ({ ...prev, quiz: true }));
    if (onComplete) onComplete();
  };

  const tabs = [
    { id: 'investigate', name: '1. Let us Investigate', icon: Compass, component: <Stage1_Investigate onComplete={handleStage1Complete} /> },
    { id: 'breaking', name: '2. Breaking a Magnet', icon: Scissors, component: <Stage2_BreakingMagnet onComplete={handleStage2Complete} />, locked: !progress.investigate },
    { id: 'sandbox', name: '3. Other Shapes', icon: Shapes, component: <Stage3_Sandbox onComplete={handleStage3Complete} />, locked: !progress.breaking },
    { id: 'quiz', name: '4. Quiz', icon: HelpCircle, component: <Quiz onComplete={handleQuizComplete} />, locked: !progress.sandbox }
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
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 4.2: Let us investigate</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Magnetic Poles and Iron Filings</span>
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
        {activeTab !== 'quiz' && (
          <aside style={{ width: '280px', flexShrink: 0 }}>
            <DidYouKnow />
          </aside>
        )}
      </div>
    </div>
  );
}
