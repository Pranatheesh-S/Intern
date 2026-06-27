import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Play, 
  Globe, 
  HelpCircle, 
  CheckCircle, 
  ArrowLeft,
} from 'lucide-react';
import Stage1_Build from './components/Stage1_Build';
import Stage2_Test from './components/Stage2_Test';
import Stage3_Sandbox from './components/Stage3_Sandbox';
import Stage4_Quiz from './components/Stage4_Quiz';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ marginTop: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.6rem 0.8rem', background: 'var(--surface)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-heading)', fontWeight: '600', gap: '0.5rem' }}
      >
        <span style={{ flex: 1, lineHeight: '1.3' }}>{question}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '0.8rem', flexShrink: 0, marginTop: '2px' }}>▼</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--neutral-bg)', borderTop: '1px solid var(--border)', lineHeight: '1.4' }}>
              {answer.split('\n').map((line, i) => <div key={i} style={{ marginBottom: i !== answer.split('\n').length - 1 ? '0.4rem' : 0 }}>{line}</div>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function LemonBatteryLabActivity({ onBackToDashboard }) {
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
    { id: 'build', name: '1. Build Battery', icon: Wrench, component: <Stage1_Build onComplete={handleStage1Complete} /> },
    { id: 'test', name: '2. Predict & Test', icon: Play, component: <Stage2_Test onComplete={handleStage2Complete} />, locked: !progress.build },
    { id: 'explore', name: '3. Sandbox Explore', icon: Globe, component: <Stage3_Sandbox onComplete={handleStage3Complete} />, locked: !progress.test },
    { id: 'quiz', name: '4. Concept Quiz', icon: HelpCircle, component: <Stage4_Quiz onComplete={onBackToDashboard} />, locked: !progress.explore }
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
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
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Activity 4.6</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 8 • Electricity: Chemical Effects (Lemon Battery)</span>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.5rem', alignItems: 'start' }}>
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

        <aside style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🧠</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>
                  Did you know?
                </h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  Chemical to Electrical Energy
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  A battery doesn't "store" electricity! It stores chemical energy. When you connect a circuit, a chemical reaction between the metals and the acid produces an electrical current.
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.25rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🤔</span>
              <div style={{ width: '100%' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>
                  Why?
                </h4>
                
                <FAQItem 
                  question="Why use a lemon?"
                  answer={"Lemon juice contains citric acid. The acid acts as an 'electrolyte'—a liquid that allows charged particles to move between the metals to complete the circuit."}
                />
                
                <FAQItem 
                  question="Why do we need two different metals?"
                  answer={"Different metals have different tendencies to hold onto their electrons. Zinc (or iron) wants to give electrons away, while copper holds onto them tightly. This difference is what pushes the current!"}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
