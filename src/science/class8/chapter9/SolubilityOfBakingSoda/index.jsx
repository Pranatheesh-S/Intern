import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FlaskConical, HelpCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Stage1_Build from './components/Stage1_Build';
import Stage2_Lab from './components/Stage2_Lab';
import Stage3_Assessment from './components/Stage3_Assessment';

export default function SolubilityOfBakingSoda({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [progress, setProgress] = useState({
    intro: false,
    lab: false,
    assessment: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, intro: true }));
    setActiveTab('lab');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, lab: true }));
    setActiveTab('assessment');
  };

  const tabs = [
    { id: 'intro', name: '1. Experimental Setup', icon: BookOpen, component: <Stage1_Build onComplete={handleStage1Complete} /> },
    { id: 'lab', name: '2. Virtual Lab', icon: FlaskConical, component: <Stage2_Lab onComplete={handleStage2Complete} />, locked: !progress.intro },
    { id: 'assessment', name: '3. Assessment', icon: HelpCircle, component: <Stage3_Assessment />, locked: !progress.lab }
  ];

  return (
    <div>
      {/* Subheader Navigation */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--border)' }}
          >
            <ArrowLeft size={14} /> Back to Class 8 Chapter 9
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 9.2: Solubility of Baking Soda</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Effect of Temperature on Solubility</span>
          </div>
        </div>

        {/* Tabs */}
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
                  display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', fontSize: '0.85rem'
                }}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
                {isCompleted && <CheckCircle size={12} style={{ color: 'var(--success)', marginLeft: '0.15rem' }} />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'stretch' }}>
        <main style={{ flex: 1, minHeight: '480px', marginBottom: '2rem' }}>
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
        
        {/* Right Sidebar */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div className="glass-panel" style={{ padding: '1.25rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>💡</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>
                  Solubility
                </h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  Key Principle
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  A saturated solution at a lower temperature behaves as an unsaturated solution when heated. This means that if you heat a saturated solution, it can dissolve more solute.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
