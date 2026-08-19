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
      background: 'transparent'
    }}>
      {/* Left Side: Interactive Setup */}
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
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#134E4A', letterSpacing: '-0.01em' }}>
            Interactive Setup
          </h3>
          <p style={{ margin: 0, color: '#0F766E', fontSize: '1.05rem', fontWeight: 600 }}>
            A bar magnet is freely suspended by a thread. Rotate it and see where it settles!
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '650px', 
          height: '380px', 
          background: '#ffffff',
          border: '2px solid #CCECE7',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.03), 0 8px 25px rgba(15, 118, 110, 0.07)'
        }}>
          <img src="/SuspendedMagnet/hello.jpeg" alt="Experiment Setup" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
          
          {/* Rope */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '2px',
            height: '185px',
            background: '#64748b',
            zIndex: 10,
            transform: 'translateX(-50%)'
          }} />

          {/* Magnet Container */}
          <motion.div
            drag
            dragConstraints={{ left: -150, right: 150, top: -50, bottom: 50 }}
            dragElastic={0.2}
            animate={{ rotate: magnetRotation }}
            transition={isSpinning ? { duration: 3, ease: 'easeOut' } : { type: 'spring', stiffness: 60 }}
            style={{
              position: 'absolute',
              top: '185px',
              left: 'calc(50% - 130px)',
              width: '260px',
              height: '55px',
              zIndex: 20,
              cursor: 'grab',
              display: 'flex',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))'
            }}
            whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
          >
            <img src="/horizontal_magnet.png" alt="Bar Magnet" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </motion.div>

          {/* Direction Indicator overlay */}
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: '#FFFFFF', border: '1.5px solid #CCECE7', borderRadius: '12px', padding: '0.4rem 0.85rem', zIndex: 30, fontSize: '0.85rem', fontWeight: 800, color: '#0F766E', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            📍 North-South Axis
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={handleSpin} 
            disabled={isSpinning}
            style={{ 
              padding: '0.85rem 1.8rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: isSpinning ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(244, 63, 94, 0.4)'
            }}
          >
            <RotateCw size={20} color="#ffffff" className={isSpinning ? 'animate-spin' : ''} /> 
            {isSpinning ? 'Magnet Spinning...' : '1. Rotate Magnet'}
          </button>
          
          <button 
            onClick={handleReset}
            disabled={isSpinning || spinCount === 0}
            style={{ 
              padding: '0.85rem 1.8rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: '#ffffff',
              color: '#64748B',
              border: '1.5px solid #E2E8F0',
              cursor: (!isSpinning && spinCount > 0) ? 'pointer' : 'not-allowed',
              opacity: (!isSpinning && spinCount > 0) ? 1 : 0.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <RotateCcw size={20} color="#64748B" /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Frosted Glacial Teal Panel */}
      <div style={{ 
        flex: '0.85', 
        background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)',
        border: '1.5px solid #CCECE7',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        {/* Instructions Box */}
        <div style={{ 
          padding: '1.15rem', 
          background: '#ffffff', 
          border: '1.5px solid #CCECE7', 
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(15, 118, 110, 0.04)'
        }}>
          <h4 style={{ color: '#134E4A', margin: '0 0 0.6rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
            Activity 4.3 Instructions
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#115E59', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', lineHeight: '1.5', fontWeight: 600 }}>
            <li>Drag or click "Rotate Magnet" to disturb the suspended bar magnet.</li>
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
                padding: '1.15rem', 
                background: '#ffffff', 
                border: '1.5px solid #CCECE7', 
                borderRadius: '16px',
                boxShadow: '0 4px 14px rgba(15, 118, 110, 0.05)'
              }}
            >
              <h4 style={{ color: '#134E4A', margin: '0 0 0.5rem 0', fontSize: '1.02rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={20} color="#F43F5E" /> 
                Observation Question
              </h4>
              <p style={{ margin: '0 0 0.75rem 0', color: '#115E59', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
                Does the bar magnet always come to rest in the same direction (North-South)?
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <button
                  onClick={() => handleQuizAnswer('yes')}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    background: quizAnswer === 'yes' ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF9',
                    borderColor: quizAnswer === 'yes' ? '#10b981' : '#CCECE7',
                    borderStyle: 'solid',
                    borderWidth: '1.5px',
                    color: quizAnswer === 'yes' ? '#065f46' : '#134E4A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  Yes, always N-S {quizAnswer === 'yes' && <CheckCircle size={18} color="#10b981" />}
                </button>
                
                <button
                  onClick={() => handleQuizAnswer('no')}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    background: quizAnswer === 'no' ? 'rgba(239, 68, 68, 0.1)' : '#F0FDF9',
                    borderColor: quizAnswer === 'no' ? '#ef4444' : '#CCECE7',
                    borderStyle: 'solid',
                    borderWidth: '1.5px',
                    color: quizAnswer === 'no' ? '#991b1b' : '#134E4A'
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
                  <p style={{ margin: '0 0 0.75rem 0', color: '#047857', fontSize: '0.88rem', fontWeight: '700' }}>
                    Correct! A freely suspended magnet always comes to rest in the North-South direction!
                  </p>
                  <button 
                    onClick={handleNextSection}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: 800,
                      borderRadius: '35px',
                      background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    Next Section: Conclusion <ArrowRight size={20} color="#ffffff" />
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
