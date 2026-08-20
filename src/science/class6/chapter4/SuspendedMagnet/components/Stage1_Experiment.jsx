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
    <div style={{ 
      padding: '1.25rem 1.75rem', 
      display: 'flex', 
      gap: '1.75rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0f172a 100%)',
      border: '1.5px solid #1e40af',
      borderRadius: '20px',
      boxShadow: '0 12px 35px rgba(11, 19, 43, 0.4)'
    }}>
      {/* Left Side: Interactive Setup (Enlarged & Centered to fill empty space) */}
      <div style={{ 
        flex: '1.35', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center', 
        minWidth: 0,
        height: '100%'
      }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Interactive Setup
          </h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
            A bar magnet is freely suspended by a thread. Rotate it and see where it settles!
          </p>
        </div>

        {/* Canvas (Enlarged to 380px Height, 650px Max Width to fill empty space) */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '650px', 
          height: '380px', 
          background: '#f8fafc',
          border: '2px solid #cbd5e1',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.05), 0 8px 25px rgba(0,0,0,0.07)'
        }}>
          <img src="/SuspendedMagnet/hello.jpeg" alt="Experiment Setup" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
          
          {/* Rope */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '95px',
            width: '2.5px',
            height: '195px',
            background: '#1e293b',
            zIndex: 9
          }} />
          
          {/* Magnet Wrapper for 3D Perspective */}
          <div style={{
            position: 'absolute',
            bottom: '75px',
            width: '230px',
            height: '42px',
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
                  borderRadius: '6px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.45)',
                  cursor: isSpinning ? 'wait' : 'grab'
                }}
              >
                <div style={{ flex: 1, backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  N
                </div>
                <div style={{ flex: 1, backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  S
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Controls (Enlarged Action Buttons with High Visibility) */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button 
            onClick={handleSpin}
            disabled={isSpinning || quizAnswer === 'yes'}
            style={{ 
              padding: '0.9rem 1.8rem', 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: (!isSpinning && quizAnswer !== 'yes') ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
              color: (!isSpinning && quizAnswer !== 'yes') ? '#ffffff' : '#1e3a8a',
              border: (!isSpinning && quizAnswer !== 'yes') ? 'none' : '2px solid #3b82f6',
              cursor: (!isSpinning && quizAnswer !== 'yes') ? 'pointer' : 'not-allowed',
              opacity: (!isSpinning && quizAnswer !== 'yes') ? 1 : 0.85,
              boxShadow: (!isSpinning && quizAnswer !== 'yes') ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <RotateCw size={20} color={(!isSpinning && quizAnswer !== 'yes') ? '#ffffff' : '#1e3a8a'} className={isSpinning ? 'spin-animation' : ''} /> 
            {isSpinning ? 'Spinning...' : 'Rotate Magnet'}
          </button>
          
          <button 
            onClick={handleReset}
            disabled={isSpinning || spinCount === 0}
            style={{ 
              padding: '0.9rem 1.8rem', 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: (!isSpinning && spinCount > 0) ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
              color: (!isSpinning && spinCount > 0) ? '#ffffff' : '#1e3a8a',
              border: (!isSpinning && spinCount > 0) ? 'none' : '2px solid #3b82f6',
              cursor: (!isSpinning && spinCount > 0) ? 'pointer' : 'not-allowed',
              opacity: (!isSpinning && spinCount > 0) ? 1 : 0.85,
              boxShadow: (!isSpinning && spinCount > 0) ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <RotateCcw size={20} color={(!isSpinning && spinCount > 0) ? '#ffffff' : '#1e3a8a'} /> Reset
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
        {/* Instructions Box */}
        <div style={{ 
          padding: '1.35rem 1.6rem', 
          background: '#ffffff', 
          border: '2px solid #2563eb', 
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ color: '#1e3a8a', margin: '0 0 0.75rem 0', fontSize: '1.2rem', fontWeight: 800 }}>
            Instructions
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e40af', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.98rem', lineHeight: '1.6', fontWeight: 600 }}>
            <li>Drag or click "Rotate Magnet" to disturb the freely suspended bar magnet.</li>
            <li>Observe which direction the magnet points when it comes to rest.</li>
            <li>Repeat 2-3 times to see if it settles in the same direction every time!</li>
          </ol>
        </div>

        {/* Observation Question Box */}
        <AnimatePresence>
          {showObservation && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                padding: '1.35rem 1.6rem', 
                background: '#ffffff', 
                border: '2px solid #2563eb', 
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}
            >
              <h4 style={{ color: '#1e3a8a', margin: '0 0 0.6rem 0', fontSize: '1.18rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={22} style={{ color: '#2563eb' }} /> 
                Observation Question
              </h4>
              <p style={{ margin: '0 0 0.85rem 0', color: '#1e40af', fontSize: '0.98rem', lineHeight: 1.55, fontWeight: 600 }}>
                Does the bar magnet always come to rest in the same direction (North-South)?
              </p>

              <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => handleQuizAnswer('yes')}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.1rem',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    background: quizAnswer === 'yes' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f8fafc',
                    borderColor: quizAnswer === 'yes' ? '#047857' : '#cbd5e1',
                    borderStyle: 'solid',
                    borderWidth: '2px',
                    color: quizAnswer === 'yes' ? '#ffffff' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: quizAnswer === 'yes' ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                >
                  Yes, always N-S {quizAnswer === 'yes' && <CheckCircle size={18} color="#ffffff" />}
                </button>
                
                <button
                  onClick={() => handleQuizAnswer('no')}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.1rem',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    background: quizAnswer === 'no' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#f8fafc',
                    borderColor: quizAnswer === 'no' ? '#b91c1c' : '#cbd5e1',
                    borderStyle: 'solid',
                    borderWidth: '2px',
                    color: quizAnswer === 'no' ? '#ffffff' : '#1e293b',
                    boxShadow: quizAnswer === 'no' ? '0 4px 15px rgba(239, 68, 68, 0.4)' : 'none'
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
                  <p style={{ margin: '0 0 0.85rem 0', color: '#065f46', fontSize: '0.98rem', fontWeight: '700' }}>
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
                      background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 6px 20px rgba(255, 119, 0, 0.45)',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Next Section: Conclusion <ArrowRight size={22} color="#ffffff" />
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
