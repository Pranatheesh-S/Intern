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

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '8px' }}>👉</span>
      <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
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
    </div>
  );
};

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

      {/* Main Grid with Side Sidebar Panel */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Active Stage */}
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

        {/* Right Column: Did you know? / Why? Sidebar Panel */}
        {activeTab !== 'quiz' && (
          <aside style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '2rem', marginTop: '1rem' }}>
            {activeTab === 'build' && (
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🧠</span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', marginTop: '4px' }}>
                    Did you know?
                  </h4>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Air Gap & Switches
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5', textAlign: 'justify' }}>
                      An electric switch creates a physical gap in the circuit. Air is an insulator, stopping electric current from jumping across the gap when open!
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Conductors & Insulators
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5', textAlign: 'justify' }}>
                      The safety pin and drawing pins are metal conductors. The cardboard base is an insulator, keeping the electricity safely in the wire path.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Complete Circuit Loop
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5', textAlign: 'justify' }}>
                      Current only flows when there is an unbroken pathway from the positive battery terminal to the bulb and back to the negative terminal.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab === 'test' || activeTab === 'explore') && (
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🤔</span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', marginTop: '4px' }}>
                    Why?
                  </h4>
                </div>
                
                <div style={{ marginTop: '0.5rem' }}>
                  <FAQItem 
                    question="Why does the bulb glow when the safety pin touches the second drawing pin?"
                    answer={"Touching the second drawing pin bridges the physical gap.\nThis completes the circuit loop and lets electricity flow to the bulb."}
                  />
                  
                  <FAQItem 
                    question="Why does the bulb turn OFF when the safety pin is swung away?"
                    answer={"Swinging the safety pin away creates an air gap.\nSince air is an insulator, current cannot cross the gap and the bulb turns off."}
                  />
                  
                  <FAQItem 
                    question="Why do we place drawing pins on cardboard instead of metal?"
                    answer={"Cardboard is an insulator that prevents current from leaking out.\nIf placed on a metal surface, the electricity would short-circuit!"}
                  />
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
