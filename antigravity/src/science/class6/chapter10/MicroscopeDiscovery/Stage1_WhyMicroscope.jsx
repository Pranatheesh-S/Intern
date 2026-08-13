import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, HelpCircle, Droplet, Beaker } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage1_WhyMicroscope({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', { volume: 0.5 });
  
  const [step, setStep] = useState(0); 
  const [flaskPosition, setFlaskPosition] = useState({ x: 0, y: 0 });
  const [isMagnifying, setIsMagnifying] = useState(false);
  const containerRef = useRef(null);

  const handleNextStep = () => {
    playClick();
    setStep(prev => prev + 1);
  };

  const handleObservationAnswer = (isCorrect) => {
    if (isCorrect) {
      playSuccess();
      addXp(10);
      setStep(6);
    } else {
      playClick(); // or error sound
      alert("Try again! Look closely at the letters.");
    }
  };

  const handleFinalAnswer = (isCorrect) => {
    if (isCorrect) {
      playSuccess();
      addXp(10);
      setStep(8);
    } else {
      playClick();
      alert("Think about how small cells really are!");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Can We See Tiny Things?</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          Scientists were always curious about tiny organisms around us. Before microscopes were invented, how could they see such tiny structures? Let's try a simple experiment.
        </p>
      </div>

      {/* Main Interactive Area */}
      <div 
        ref={containerRef}
        style={{ 
          flex: 1, 
          position: 'relative', 
          background: 'var(--surface)', 
          borderRadius: '16px', 
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ textAlign: 'center' }}
            >
              <button className="primary" onClick={handleNextStep} style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '30px' }}>
                Start Experiment <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step >= 1 && step <= 4 && (
            <motion.div 
              key="experiment"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Instructions Panel */}
              <div style={{ background: 'var(--bg)', padding: '1rem 2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--accent-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', zIndex: 10 }}>
                <h3 style={{ margin: 0, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={20} /> 
                  {step === 1 && "Step 1: Place the flask on the table."}
                  {step === 2 && "Step 2: Pour water into the flask."}
                  {step === 3 && "Step 3: Close the flask with a cork."}
                  {step === 4 && "Step 4: Drag the flask over the book to observe the letters."}
                </h3>
              </div>

              {/* Lab Table */}
              <div style={{ width: '80%', height: '300px', background: '#e2e8f0', borderRadius: '8px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '20px solid #cbd5e1' }}>
                
                {/* Book */}
                <div style={{ 
                  width: '300px', height: '200px', background: 'white', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.5', fontFamily: 'serif' }}>
                    Microbes are everywhere around us. They are in the air we breathe, the water we drink, and the soil we walk on. Some are useful, while others cause diseases. Antibodies help our body fight these microbes to keep us healthy.
                  </div>
                </div>

                {/* Flask */}
                <motion.div
                  drag={step === 4}
                  dragConstraints={containerRef}
                  dragElastic={0.1}
                  onDrag={(e, info) => {
                    if (step === 4) {
                      setFlaskPosition({ x: info.point.x, y: info.point.y });
                      setIsMagnifying(true);
                    }
                  }}
                  onDragEnd={() => setIsMagnifying(false)}
                  style={{
                    width: '120px', height: '120px', borderRadius: '50%', 
                    background: step >= 2 ? 'rgba(186, 230, 253, 0.4)' : 'rgba(255,255,255,0.4)',
                    border: '4px solid rgba(255,255,255,0.8)',
                    boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.15)',
                    position: 'absolute',
                    top: step === 1 ? '-100px' : '50%',
                    left: step === 1 ? '-100px' : '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    cursor: step === 4 ? 'grab' : 'default',
                    zIndex: 20,
                    backdropFilter: step >= 2 ? 'blur(2px)' : 'none', // Simple magnification effect
                  }}
                  animate={{
                    top: step >= 2 ? '50%' : '10%',
                    left: step >= 2 ? '50%' : '10%',
                  }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  {/* Cork */}
                  {step >= 3 && (
                    <div style={{ position: 'absolute', top: '-15px', width: '30px', height: '20px', background: '#d97706', borderRadius: '4px' }} />
                  )}
                  {/* Water Fill Animation */}
                  {step === 2 && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: '80%' }} 
                      transition={{ duration: 1.5 }}
                      onAnimationComplete={() => { playSuccess(); setStep(3); }}
                      style={{ position: 'absolute', bottom: '10%', width: '90%', background: 'rgba(56, 189, 248, 0.4)', borderRadius: '0 0 50px 50px' }} 
                    />
                  )}
                  
                  {/* CSS Magnification Trick (when dragging over book) */}
                  {isMagnifying && step === 4 && (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
                       {/* This is a simplified visual representation. In a real complex app, we'd use a clip-path or canvas. 
                           For this React UI, the backdrop-filter blur above gives a glass effect, and we'll show a prompt after they drag. */}
                    </div>
                  )}
                </motion.div>

              </div>

              {/* Controls for non-drag steps */}
              {step === 1 && (
                <button className="primary" onClick={() => { playClick(); setStep(2); }} style={{ marginTop: '2rem' }}>
                  Place Flask & Pour Water
                </button>
              )}
              {step === 3 && (
                <button className="primary" onClick={() => { playClick(); setStep(4); }} style={{ marginTop: '2rem' }}>
                  Close with Cork
                </button>
              )}
              {step === 4 && (
                <button className="outline" onClick={() => { playClick(); setStep(5); }} style={{ marginTop: '2rem' }}>
                  I've observed the letters
                </button>
              )}

            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="question1"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
            >
              <h2 style={{ fontSize: '2rem', color: 'var(--text-heading)' }}>What do you observe?</h2>
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', width: '300px' }}>
                <button className="glass-panel" onClick={() => handleObservationAnswer(false)} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border)' }}>
                  A) Letters become smaller
                </button>
                <button className="glass-panel" onClick={() => handleObservationAnswer(true)} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--accent)', background: 'var(--accent-bg)' }}>
                  B) Letters become larger
                </button>
                <button className="glass-panel" onClick={() => handleObservationAnswer(false)} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border)' }}>
                  C) Nothing changes
                </button>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div 
              key="zoom"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}
            >
              <h2 style={{ color: 'var(--accent)' }}>Correct! (+10 XP)</h2>
              <p style={{ fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>
                The water-filled flask acts like a magnifying glass. Let's zoom in further...
              </p>
              
              <div style={{ width: '300px', height: '300px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '4px solid var(--accent)' }}>
                <motion.div
                  initial={{ scale: 1, filter: 'blur(0px)' }}
                  animate={{ scale: 10, filter: 'blur(10px)', opacity: 0 }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  onAnimationComplete={() => setStep(7)}
                  style={{ fontSize: '3rem', fontWeight: 'bold' }}
                >
                  a
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div 
              key="question2"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
            >
              <div style={{ width: '300px', height: '300px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '4px solid var(--border)', filter: 'blur(4px)' }}>
                {/* Empty blur */}
              </div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-heading)', textAlign: 'center' }}>Can this flask help us observe cells?</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="outline" onClick={() => handleFinalAnswer(false)} style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                  Yes
                </button>
                <button className="primary" onClick={() => handleFinalAnswer(true)} style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
                  No
                </button>
              </div>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div 
              key="conclusion"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', textAlign: 'center', maxWidth: '600px' }}
            >
              <CheckCircle size={64} color="var(--success)" />
              <h2 style={{ color: 'var(--text-heading)', margin: 0 }}>You are Right! (+10 XP)</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                The water-filled flask works like a simple magnifying lens. It enlarges objects, but cells are far too small to be seen this way. Scientists needed a much more powerful instrument.
              </p>
              
              {/* Transition to Microscope */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '80px', height: '80px', background: 'var(--accent-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}
              >
                🔬
              </motion.div>

              <button className="primary" onClick={onComplete} style={{ padding: '1rem 2rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: '30px' }}>
                Next: Prepare a Microscope Slide <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
