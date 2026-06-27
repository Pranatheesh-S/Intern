import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Power, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Electromagnet3D from './Electromagnet3D';

export default function Stage2_Test({ onComplete }) {
  const [prediction, setPrediction] = useState(null); // null, 'nothing', 'magnetic', 'battery'
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [hasTestedOn, setHasTestedOn] = useState(false);
  const [hasTestedOff, setHasTestedOff] = useState(false);

  const handlePredict = (value) => {
    setPrediction(value);
  };

  const submitPrediction = () => {
    if (prediction) {
      setPredictionSubmitted(true);
    }
  };

  const toggleSwitch = () => {
    const newState = !switchOn;
    setSwitchOn(newState);
    
    if (newState && !hasTestedOn) {
      setHasTestedOn(true);
      if (prediction === 'magnetic') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
    
    if (!newState && hasTestedOn && !hasTestedOff) {
      setHasTestedOff(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const isTestingComplete = hasTestedOn && hasTestedOff;

  return (
    <div className="main-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Stage 2: Predict and Test
          </span>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem' }}>Test the Electromagnet</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', alignItems: 'stretch' }}>
        {/* Left Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
          
          <AnimatePresence mode="wait">
            {!predictionSubmitted ? (
              <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--warning-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--warning-border)', marginBottom: '1rem' }}>
                  <HelpCircle style={{ color: 'var(--warning)' }} size={20} />
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--warning-text)', fontSize: '0.95rem' }}>Prediction</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>What will happen when the switch is turned ON?</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    className={`outline ${prediction === 'nothing' ? 'active' : ''}`}
                    onClick={() => handlePredict('nothing')}
                    style={{ justifyContent: 'flex-start', textAlign: 'left', borderColor: prediction === 'nothing' ? 'var(--accent)' : '' }}
                  >
                    Nothing happens
                  </button>
                  <button 
                    className={`outline ${prediction === 'magnetic' ? 'active' : ''}`}
                    onClick={() => handlePredict('magnetic')}
                    style={{ justifyContent: 'flex-start', textAlign: 'left', borderColor: prediction === 'magnetic' ? 'var(--accent)' : '' }}
                  >
                    The nail becomes magnetic
                  </button>
                  <button 
                    className={`outline ${prediction === 'battery' ? 'active' : ''}`}
                    onClick={() => handlePredict('battery')}
                    style={{ justifyContent: 'flex-start', textAlign: 'left', borderColor: prediction === 'battery' ? 'var(--accent)' : '' }}
                  >
                    The battery becomes magnetic
                  </button>
                </div>

                <button 
                  onClick={submitPrediction} 
                  disabled={!prediction}
                  className="primary" 
                  style={{ width: '100%', marginTop: '1.5rem' }}
                >
                  Lock Prediction
                </button>
              </motion.div>
            ) : (
              <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Circuit Controls</h4>
                  <button 
                    onClick={toggleSwitch}
                    className="primary" 
                    style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: switchOn ? 'var(--danger)' : 'var(--success)' }}
                  >
                    <Power size={18} /> {switchOn ? "TURN OFF" : "TURN ON"}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: hasTestedOn ? 0.5 : 1 }}>
                    {hasTestedOn ? <CheckCircle2 size={16} color="var(--success)" /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--text-faint)' }} />}
                    <span style={{ fontSize: '0.85rem' }}>1. Turn switch ON</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: hasTestedOff ? 0.5 : 1 }}>
                    {hasTestedOff ? <CheckCircle2 size={16} color="var(--success)" /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--text-faint)' }} />}
                    <span style={{ fontSize: '0.85rem' }}>2. Turn switch OFF</span>
                  </div>
                </div>

                {/* Explanation text based on current state */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--accent-bg)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {switchOn 
                      ? "When electric current flows through the coil, the iron nail becomes an electromagnet and attracts the paper clips!" 
                      : hasTestedOn 
                        ? "When current stops, the iron nail loses its temporary magnetism and the paper clips fall away." 
                        : "Turn on the switch to see what happens to the paper clips."}
                  </p>
                </div>

                {isTestingComplete && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'auto' }}>
                    <button onClick={onComplete} className="primary" style={{ width: '100%', gap: '0.5rem' }}>
                      Proceed to Explore <ChevronRight size={16} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Canvas */}
        <div className="glass-panel" style={{ padding: 0, minHeight: '480px', position: 'relative', overflow: 'hidden' }}>
          <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />
            
            <Electromagnet3D 
              buildStep={5} 
              switchOn={switchOn}
              turns={20}
              cells={1}
              material="iron"
              paperClipDistance={1.0}
            />
            
            <OrbitControls enablePan={true} enableZoom={true} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
