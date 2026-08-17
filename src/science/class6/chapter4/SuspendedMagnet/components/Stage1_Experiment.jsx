import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, AlertCircle, CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function Stage1_Experiment({ onComplete }) {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [magnetRotation, setMagnetRotation] = useState(15);
  const [showObservation, setShowObservation] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const handleSpin = () => {
    setIsSpinning(true);
    const targetRotation = magnetRotation + 1080 - (magnetRotation % 360);
    
    setMagnetRotation(targetRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setSpinCount(prev => prev + 1);
      
      if (spinCount >= 1) {
        setShowObservation(true);
      }
    }, 3000);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
  };

  const handleNextSection = () => {
    onComplete();
  };

  const handleReset = () => {
    setSpinCount(0);
    setIsSpinning(false);
    setMagnetRotation(15);
    setShowObservation(false);
    setQuizAnswer(null);
  };

  return (
    <div className="glass-panel" style={{ 
      padding: '1.25rem 1.75rem', 
      display: 'flex', 
      gap: '1.75rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Left Side: Interactive Setup (Centered) */}
      <div style={{ 
        flex: '1.15', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center', 
        minWidth: 0 
      }}>
        <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            Interactive Setup
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            A bar magnet is freely suspended by a thread. Rotate it and see where it settles!
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '480px', 
          height: '330px', 
          background: '#f8fafc',
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}>
          <img src="/SuspendedMagnet/hello.jpeg" alt="Experiment Setup" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
          
          {/* Rope */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '85px',
            width: '2px',
            height: '165px',
            background: '#1e293b',
            zIndex: 9
          }} />
          
          {/* Magnet Wrapper for 3D Perspective */}
          <div style={{
            position: 'absolute',
            bottom: '70px',
            width: '175px',
            height: '32px',
            perspective: '1000px',
            zIndex: 10
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(60deg)'
            }}>
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(e, info) => {
                  if (Math.abs(info.offset.x) > 20 || Math.abs(info.velocity.x) > 100) {
                    if (!isSpinning && quizAnswer !== 'yes') {
                      handleSpin();
                    }
                  }
                }}
                animate={{ rotateZ: magnetRotation }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 40, 
                  damping: 8, 
                  mass: 1.5,
                  restDelta: 0.1 
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 15px rgba(0,0,0,0.4)',
                  cursor: isSpinning ? 'wait' : 'grab'
                }}
              >
                <div style={{ flex: 1, backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.15rem' }}>
                  N
                </div>
                <div style={{ flex: 1, backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.15rem' }}>
                  S
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1rem' }}>
          <button 
            onClick={handleSpin}
            disabled={isSpinning || quizAnswer === 'yes'}
            className="primary"
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.94rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RotateCw size={18} className={isSpinning ? 'spin-animation' : ''} /> 
            {isSpinning ? 'Spinning...' : 'Rotate Magnet'}
          </button>
          
          <button 
            onClick={handleReset}
            className="outline"
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.94rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={isSpinning || spinCount === 0}
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Instructions & Observation (Centered) */}
      <div style={{ 
        flex: '0.85', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div className="glass-panel" style={{ padding: '1.35rem 1.6rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 0.75rem 0', fontSize: '1.18rem', fontWeight: 700 }}>
            Instructions
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.98rem', lineHeight: '1.6' }}>
            <li>Drag or click "Rotate Magnet" to disturb the freely suspended bar magnet.</li>
            <li>Observe which direction the magnet points when it comes to rest.</li>
            <li>Repeat 2-3 times to see if it settles in the same direction every time!</li>
          </ol>
        </div>

        <AnimatePresence>
          {showObservation && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: '1.35rem 1.6rem', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}
            >
              <h4 style={{ color: 'var(--text-heading)', margin: '0 0 0.6rem 0', fontSize: '1.18rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={22} style={{ color: 'var(--accent-text)' }} /> 
                Observation Question
              </h4>
              <p style={{ margin: '0 0 0.85rem 0', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.55 }}>
                Does the bar magnet always come to rest in the same direction (North-South)?
              </p>

              <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => handleQuizAnswer('yes')}
                  className="outline"
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.1rem',
                    fontSize: '0.96rem',
                    fontWeight: 600,
                    background: quizAnswer === 'yes' ? 'var(--success-bg)' : 'transparent',
                    borderColor: quizAnswer === 'yes' ? 'var(--success)' : 'var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Yes, always N-S {quizAnswer === 'yes' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
                </button>
                
                <button
                  onClick={() => handleQuizAnswer('no')}
                  className="outline"
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.1rem',
                    fontSize: '0.96rem',
                    fontWeight: 600,
                    background: quizAnswer === 'no' ? 'var(--danger-bg)' : 'transparent',
                    borderColor: quizAnswer === 'no' ? 'var(--danger)' : 'var(--border)'
                  }}
                >
                  No, random
                </button>
              </div>

              {quizAnswer === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p style={{ margin: '0 0 0.85rem 0', color: 'var(--success)', fontSize: '0.96rem', fontWeight: '600' }}>
                    Correct! A freely suspended magnet always comes to rest in the North-South direction!
                  </p>
                  <button 
                    onClick={handleNextSection}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.6rem',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      borderRadius: '35px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                  >
                    Next Section: Conclusion <ArrowRight size={22} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
