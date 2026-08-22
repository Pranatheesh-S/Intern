import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Power, CheckCircle2, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Electromagnet3D from './Electromagnet3D';

export default function Stage2_Test({ onComplete }) {
  const [investigation, setInvestigation] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [hasTested, setHasTested] = useState(false);
  const [polesGuessed, setPolesGuessed] = useState({ A: null, B: null });

  const investigations = {
    1: {
      question: "Investigation 1: What will happen when current flows through the air-core coil?",
      options: [
        { id: "nothing", text: "Nothing happens" },
        { id: "deflect", text: "The compass needles deflect" },
        { id: "battery", text: "The battery becomes magnetic" }
      ],
      correct: "deflect",
      setup: { nailPlaced: false, reverseBattery: false },
      successMessage: "A current-carrying coil behaves like a magnet!"
    },
    2: {
      question: "Investigation 2: What happens after inserting the iron nail?",
      options: [
        { id: "stronger", text: "Magnet becomes stronger" },
        { id: "weaker", text: "Magnet becomes weaker" },
        { id: "nothing", text: "Nothing changes" }
      ],
      correct: "stronger",
      setup: { nailPlaced: true, reverseBattery: false },
      successMessage: "The iron core concentrates the magnetic field, producing a stronger electromagnet."
    },
    3: {
      question: "Investigation 3: What happens to the iron clips when the switch is turned ON with the iron core?",
      options: [
        { id: "nothing", text: "Nothing happens" },
        { id: "attract", text: "The clips are attracted to the nail" },
        { id: "repel", text: "The clips are repelled away" }
      ],
      correct: "attract",
      setup: { nailPlaced: true, reverseBattery: false, clipsPlaced: true },
      successMessage: "The strong magnetic field of the iron-core electromagnet attracts magnetic materials like iron clips!"
    },
    4: {
      question: "Investigation 4: What happens when the switch is turned OFF?",
      options: [
        { id: "stays", text: "Magnetism stays" },
        { id: "disappears", text: "Magnetism disappears" }
      ],
      correct: "disappears",
      setup: { nailPlaced: true, reverseBattery: false, clipsPlaced: true },
      successMessage: "Without current, the electromagnet loses its magnetism. The paper clips will fall off!"
    }
  };

  const handlePredict = (value) => {
    setPrediction(value);
  };

  const submitPrediction = () => {
    if (prediction) {
      setPredictionSubmitted(true);
      if (investigation === 4) {
        setSwitchOn(true); // force on before test
      }
    }
  };

  const toggleSwitch = () => {
    const newState = !switchOn;
    setSwitchOn(newState);
    
    if (investigation === 1 && newState) setHasTested(true);
    if (investigation === 2 && newState) setHasTested(true);
    if (investigation === 3 && newState) setHasTested(true);
    if (investigation === 4 && !newState) setHasTested(true);
    
    if (prediction === investigations[investigation]?.correct) {
      if ((investigation === 1 && newState) || (investigation === 2 && newState) || (investigation === 3 && newState) || (investigation === 4 && !newState)) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  const nextInvestigation = () => {
    setInvestigation(prev => prev + 1);
    setPrediction(null);
    setPredictionSubmitted(false);
    setHasTested(false);
    setSwitchOn(false);
  };

  const currentSetup = investigation <= 4 ? investigations[investigation].setup : { nailPlaced: true, reverseBattery: false, clipsPlaced: true };

  return (
    <div className="main-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Stage 2: Predict and Test
          </span>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem' }}>Investigate Properties</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1rem', alignItems: 'stretch' }}>
        {/* Left Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
          
          <AnimatePresence mode="wait">
            {investigation <= 4 && !predictionSubmitted ? (
              <motion.div key={`predict-${investigation}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--warning-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--warning-border)', marginBottom: '1rem' }}>
                  <HelpCircle style={{ color: 'var(--warning)', flexShrink: 0 }} size={20} />
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--warning-text)', fontSize: '0.95rem' }}>Prediction</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{investigations[investigation].question}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {investigations[investigation].options.map(opt => (
                    <button 
                      key={opt.id}
                      className={`outline ${prediction === opt.id ? 'active' : ''}`}
                      onClick={() => handlePredict(opt.id)}
                      style={{ justifyContent: 'flex-start', textAlign: 'left', borderColor: prediction === opt.id ? 'var(--accent)' : '' }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>

                <button onClick={submitPrediction} disabled={!prediction} className="primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                  Lock Prediction
                </button>
              </motion.div>
            ) : investigation <= 3 ? (
              <motion.div key={`test-${investigation}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Circuit Controls</h4>
                  <button onClick={toggleSwitch} className="primary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: switchOn ? 'var(--danger)' : 'var(--success)' }}>
                    <Power size={18} /> {switchOn ? "TURN OFF" : "TURN ON"}
                  </button>
                </div>

                {hasTested && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: prediction === investigations[investigation].correct ? 'var(--success-bg)' : 'var(--danger-bg)', borderRadius: '8px', borderLeft: `3px solid ${prediction === investigations[investigation].correct ? 'var(--success)' : 'var(--danger)'}` }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: prediction === investigations[investigation].correct ? 'var(--success)' : 'var(--danger)' }}>
                      {prediction === investigations[investigation].correct ? "Correct Prediction!" : "Observation:"}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {investigations[investigation].successMessage}
                    </p>
                  </div>
                )}

                {hasTested && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'auto' }}>
                    <button onClick={nextInvestigation} className="primary" style={{ width: '100%', gap: '0.5rem' }}>
                      Next <ChevronRight size={16} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="inv-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--accent-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-border)', marginBottom: '1rem' }}>
                  <HelpCircle style={{ color: 'var(--accent)', flexShrink: 0 }} size={20} />
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--accent-text)', fontSize: '0.95rem' }}>Determine Polarity</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
                      Turn the switch ON and look at the compass at <strong>End A</strong>. The Red needle (North) is being attracted toward the electromagnet.<br/><br/>
                      Since opposite magnetic poles attract each other, which pole must be at End A?
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                   <button className="primary" style={{ background: switchOn ? 'var(--danger)' : 'var(--success)' }} onClick={() => setSwitchOn(!switchOn)}>
                      {switchOn ? "Switch OFF" : "Switch ON"}
                   </button>
                </div>

                <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>End A is:</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <button className={`outline ${polesGuessed.A === 'North' ? 'active' : ''}`} onClick={() => setPolesGuessed({...polesGuessed, A: 'North'})}>North</button>
                  <button className={`outline ${polesGuessed.A === 'South' ? 'active' : ''}`} onClick={() => setPolesGuessed({...polesGuessed, A: 'South'})}>South</button>
                  {polesGuessed.A && (
                    <span style={{ fontSize: '0.8rem', color: polesGuessed.A === 'South' ? 'var(--success)' : 'var(--danger)', marginLeft: '0.5rem' }}>
                      {polesGuessed.A === 'South' ? '✅ Correct! South attracts North.' : '❌ Incorrect. Remember, opposites attract!'}
                    </span>
                  )}
                </div>

                <p style={{ margin: '1rem 0 0.25rem 0', fontSize: '0.85rem' }}>
                  Now look at <strong>End B</strong>. The Red needle (North) is being pushed away.<br/>
                  Since like poles repel, what pole must be at End B?
                </p>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>End B is:</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className={`outline ${polesGuessed.B === 'North' ? 'active' : ''}`} onClick={() => setPolesGuessed({...polesGuessed, B: 'North'})}>North</button>
                  <button className={`outline ${polesGuessed.B === 'South' ? 'active' : ''}`} onClick={() => setPolesGuessed({...polesGuessed, B: 'South'})}>South</button>
                  {polesGuessed.B && (
                    <span style={{ fontSize: '0.8rem', color: polesGuessed.B === 'North' ? 'var(--success)' : 'var(--danger)', marginLeft: '0.5rem' }}>
                      {polesGuessed.B === 'North' ? '✅ Correct! North repels North.' : '❌ Incorrect. The Red needle is being repelled!'}
                    </span>
                  )}
                </div>

                {polesGuessed.A === 'South' && polesGuessed.B === 'North' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--success-bg)', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--success)' }}>Correct! The two ends of an electromagnet always have opposite poles.</p>
                  </div>
                )}

                {polesGuessed.A === 'South' && polesGuessed.B === 'North' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'auto' }}>
                    <button onClick={onComplete} className="primary" style={{ width: '100%', gap: '0.5rem' }}>
                      Proceed to Sandbox <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Canvas */}
        <div className="glass-panel" style={{ padding: 0, minHeight: '480px', position: 'relative', overflow: 'hidden' }}>
          <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />
            
            <Electromagnet3D 
              switchOn={switchOn}
              turns={50}
              cells={1}
              core={currentSetup.nailPlaced ? "iron" : "air"}
              showCompass={true}
              showFieldLines={investigation === 2 && switchOn}
              reverseBattery={false}
              paperClipsPlaced={currentSetup.clipsPlaced || false}
            />
            
            <OrbitControls enablePan={true} enableZoom={true} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
