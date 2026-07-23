import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, HelpCircle, Compass, CheckSquare, ArrowLeft, Info, CheckCircle } from 'lucide-react';
import Stage1_Build from './components/Stage1_Build';
import Stage3_Explore from './components/Stage3_Explore';
import Stage4_Quiz from './components/Stage4_Quiz';
import DidYouKnow from './DidYouKnow';

export default function MagnetInteractionActivity({ onBackToDashboard, onComplete }) {
  const [activeTab, setActiveTab] = useState('build');
  const [progress, setProgress] = useState({
    build: false,
    explore: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, build: true }));
  };

  const handleStage3Complete = () => {
    setProgress(prev => ({ ...prev, explore: true }));
  };

  const handleStage4Complete = () => {
    setProgress(prev => ({ ...prev, quiz: true }));
    if (onComplete) onComplete();
  };

  const tabs = [
    { id: 'build', name: '1. Build', icon: Hammer, component: <Stage1_Build onComplete={handleStage1Complete} onNext={() => setActiveTab('explore')} /> },
    { id: 'explore', name: '2. Explore', icon: Compass, component: <Stage3_Explore onComplete={handleStage3Complete} onNext={() => setActiveTab('quiz')} />, locked: !progress.build },
    { id: 'quiz', name: '3. Quiz', icon: CheckSquare, component: <Stage4_Quiz onComplete={handleStage4Complete} />, locked: !progress.explore }
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
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 4.5: Interaction Between Two Bar Magnets</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Understanding magnetic attraction and repulsion</span>
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
          <aside style={{ width: '380px', flexShrink: 0 }}>
            <DidYouKnow />
          </aside>
        )}
      </div>
    </div>
  );
}
