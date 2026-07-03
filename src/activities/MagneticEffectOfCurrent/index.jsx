import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Play, 
  HelpCircle, 
  CheckCircle, 
  ArrowLeft,
  Info,
  Volume2,
  Pause,
  Box
} from 'lucide-react';
import Stage1_Build from './Stage1_Build';
import Stage2_Test from './Stage2_Test';
import Stage3_3DView from './Stage3_3DView';
import QuizPanel from './QuizPanel';
import { CompassSVG } from './CircuitElements';
import { toggleAudio } from './audioManager';

const FAQItem = ({ question, answer, audioSrc }) => {
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    {answer.split('\n').map((line, i) => <div key={i} style={{ marginBottom: i !== answer.split('\n').length - 1 ? '0.4rem' : 0 }}>{line}</div>)}
                  </div>
                  {audioSrc && <AudioButton audioSrc={audioSrc} />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function AudioButton({ audioSrc }) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = () => {
    toggleAudio(audioSrc, setIsPlaying);
  };

  return (
    <button 
      onClick={togglePlay}
      style={{ 
        background: 'var(--primary, #007bff)', 
        border: 'none', 
        cursor: 'pointer', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.2rem',
        borderRadius: '50%',
        marginLeft: '0.5rem',
        width: '24px',
        height: '24px'
      }}
      title={isPlaying ? "Pause Audio" : "Play Audio"}
    >
      {isPlaying ? <Pause size={12} /> : <Volume2 size={12} />}
    </button>
  );
};

export default function MagneticEffectOfCurrentActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('build');
  const [progress, setProgress] = useState({
    build: false,
    test: false,
    threed: false,
    quiz: false
  });

  const handleStage1Complete = () => {
    setProgress(prev => ({ ...prev, build: true }));
    setActiveTab('test');
  };

  const handleStage2Complete = () => {
    setProgress(prev => ({ ...prev, test: true }));
    setActiveTab('threed');
  };

  const handleStage3Complete = () => {
    setProgress(prev => ({ ...prev, threed: true }));
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'build', name: '1. Build Circuit', icon: Wrench, component: <Stage1_Build onComplete={handleStage1Complete} /> },
    { id: 'test', name: '2. Test Effect', icon: Play, component: <Stage2_Test onComplete={handleStage2Complete} />, locked: !progress.build },
    { id: 'threed', name: '3. 3D View', icon: Box, component: <Stage3_3DView onComplete={handleStage3Complete} />, locked: !progress.test },
    { id: 'quiz', name: '4. Concept Quiz', icon: HelpCircle, component: <QuizPanel />, locked: !progress.threed }
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
          <aside style={{ width: '280px', flexShrink: 0, marginTop: activeTab === 'build' ? '6rem' : '6.5rem' }}>
            {activeTab === 'build' && (
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🧠</span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', marginTop: '4px' }}>
                    Did you know?
                  </h4>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        Science Insights
                      </div>
                      <AudioButton audioSrc="/diduknow1.mp3" />
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', textAlign: 'justify' }}>
                      In 1820, Hans Christian Ørsted accidentally discovered that an electric current creates a magnetic field. When he turned on a circuit, a nearby compass needle twitched!
                    </p>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        Tiny Magnets
                      </div>
                      <AudioButton audioSrc="/diduknow2.mp3" />
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', textAlign: 'justify' }}>
                      A compass needle is actually a tiny magnet! When it's placed near a wire carrying electric current, the magnetic field produced by the current exerts a force on the compass needle, causing it to deflect.
                    </p>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>👉</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        Magnetic Reversals
                      </div>
                      <AudioButton audioSrc="/diduknow3.mp3" />
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', textAlign: 'justify' }}>
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
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
                  <FAQItem 
                    question="Why does the compass needle stop moving after a few seconds?"
                    answer="The compass needle stops moving because it aligns itself with the combined magnetic field of the Earth and the current-carrying wire. Once it reaches this position, it becomes stable."
                    audioSrc="/why1.mp3"
                  />
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                  <FAQItem 
                    question="Why does the compass needle return to its original position when the switch is turned OFF?"
                    answer="When the switch is turned OFF, current stops flowing through the wire. The magnetic field produced by the wire disappears, so the compass aligns only with Earth's magnetic field and returns to its original north-south direction."
                    audioSrc="/why2.mp3"
                  />
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                  <FAQItem 
                    question="Why should the wire be placed close to the compass?"
                    answer="The magnetic field is strongest near the current-carrying wire. Keeping the wire close to the compass makes the magnetic effect stronger, allowing the compass needle to deflect clearly."
                    audioSrc="/why3.mp3"
                  />
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                  <FAQItem 
                    question="Why does the compass needle not touch the wire even though it moves?"
                    answer="The compass needle moves because it responds to the magnetic field around the wire, not because of physical contact. A magnetic field can act through space without touching the compass."
                    audioSrc="/why4.mp3"
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
