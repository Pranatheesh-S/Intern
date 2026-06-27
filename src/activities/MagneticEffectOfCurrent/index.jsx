import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Play, 
  HelpCircle, 
  CheckCircle, 
  ArrowLeft,
  Info
} from 'lucide-react';
import Stage1_Build from './Stage1_Build';
import Stage2_Test from './Stage2_Test';
import QuizPanel from './QuizPanel';
import { CompassSVG } from './CircuitElements';

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

export default function MagneticEffectOfCurrentActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('build');
  const [progress, setProgress] = useState({
    build: false,
    test: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, build: true }));
    setActiveTab('test');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, test: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'build', name: '1. Build Circuit', icon: Wrench, component: <Stage1_Build onComplete={handleStage1Complete} /> },
    { id: 'test', name: '2. Test Effect', icon: Play, component: <Stage2_Test onComplete={handleStage2Complete} />, locked: !progress.build },
    { id: 'quiz', name: '3. Concept Quiz', icon: HelpCircle, component: <QuizPanel />, locked: !progress.test }
  ];

  return (
    <div>
      {/* Subheader Navigation */}
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
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Magnetic Effect of Current</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 8 Activity 4.1 (Oersted's Experiment)</span>
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

        {/* Right Column: Did you know? / Why? */}
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
                      Science Insights
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5', textAlign: 'justify' }}>
                      In 1820, Hans Christian Ørsted accidentally discovered that an electric current creates a magnetic field. When he turned on a circuit, a nearby compass needle twitched!
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Tiny Magnets
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5', textAlign: 'justify' }}>
                      A compass needle is actually a tiny magnet! When it's placed near a wire carrying electric current, the magnetic field produced by the current exerts a force on the compass needle, causing it to deflect.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Magnetic Reversals
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5', textAlign: 'justify' }}>
                      The direction of the magnetic field depends on the direction of the electric current. If you reverse the battery connections, the compass needle will deflect in the opposite direction!
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'test' && (
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🤔</span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', marginTop: '4px' }}>
                    Why?
                  </h4>
                </div>
                
                <div style={{ marginTop: '0.5rem' }}>
                  <FAQItem 
                    question="Why does the compass needle deflect when the switch is turned ON?"
                    answer={"When the switch is turned ON, electric current flows through the wire.\nThe current creates a magnetic field that causes the compass needle to deflect."}
                  />
                  
                  <FAQItem 
                    question="Why does the compass needle return to its original position when the switch is turned OFF?"
                    answer={"When the switch is turned OFF, the electric current stops flowing.\nThe magnetic field disappears, so the compass needle returns to its original position."}
                  />
                  
                  <FAQItem 
                    question="Why is the magnetic field present only when current flows through the wire?"
                    answer={"A magnetic field is produced only when electric current flows through the wire.\nWhen the current stops, the magnetic field disappears."}
                  />
                  
                  <FAQItem 
                    question="Why does the compass respond to the current-carrying wire even though the wire is not a magnet?"
                    answer={"The current-carrying wire produces a magnetic field around it.\nThe compass needle detects this magnetic field and deflects."}
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
