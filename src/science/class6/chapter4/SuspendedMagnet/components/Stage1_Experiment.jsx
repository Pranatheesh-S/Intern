import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, AlertCircle, CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function Stage1_Experiment({ onComplete }) {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [magnetRotation, setMagnetRotation] = useState(15);
  const [showObservation, setShowObservation] = useState(true);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const handleSpin = () => {
    setIsSpinning(true);
    const targetRotation = magnetRotation + 1080 - (magnetRotation % 360);
    
    setMagnetRotation(targetRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setSpinCount(prev => prev + 1);
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
        justifyContent: 'space-between',
        alignItems: 'center', 
        textAlign: 'center', 
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Content Above Activity Canvas (Left Top Bar Container) */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #3F3F46',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.01em' }}>
            Interactive Setup
          </h3>
          <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.92rem', fontWeight: 700 }}>
            A bar magnet is freely suspended by a thread. Rotate it and see where it settles!
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '650px', 
          height: '380px', 
          background: 'rgba(18, 18, 20, 0.95)',
          border: '1.5px solid #3F3F46',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
        }}>
          <img src="/SuspendedMagnet/hello.jpeg" alt="Experiment Setup" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
          
          {/* Rope */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '2px',
            height: '185px',
            background: '#A1A1AA',
            zIndex: 10,
            transform: 'translateX(-50%)'
          }} />

          {/* 3D Cinematic Bar Magnet Component */}
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
              borderRadius: '12px',
              display: 'flex',
              zIndex: 20,
              cursor: 'grab',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(250, 204, 21, 0.25)',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.35)',
              background: '#18181B'
            }}
            whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
          >
            {/* North Pole (Red Side) */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
            }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.8)' }}>
                N
              </span>
              <div style={{ position: 'absolute', top: 4, left: 8, fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.85)', letterSpacing: '1px' }}>
                NORTH
              </div>
              <motion.div 
                animate={{ opacity: [0.4, 0.85, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '20px',
                  background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.6), transparent)',
                  pointerEvents: 'none'
                }}
              />
            </div>

            {/* Center Metallic Seam */}
            <div style={{
              width: '5px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)',
              boxShadow: '0 0 8px rgba(0,0,0,0.8)',
              zIndex: 2
            }} />

            {/* South Pole (Blue Side) */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
            }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.8)' }}>
                S
              </span>
              <div style={{ position: 'absolute', top: 4, right: 8, fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.85)', letterSpacing: '1px' }}>
                SOUTH
              </div>
              <motion.div 
                animate={{ opacity: [0.4, 0.85, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '20px',
                  background: 'linear-gradient(-90deg, rgba(59, 130, 246, 0.6), transparent)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </motion.div>

          {/* Direction Indicator overlay */}
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(24, 24, 27, 0.9)', border: '1px solid #3F3F46', borderRadius: '12px', padding: '0.4rem 0.85rem', zIndex: 30, fontSize: '0.85rem', fontWeight: 800, color: '#F59E0B', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
            📍 North-South Axis
          </div>
        </div>

        {/* Action Controls (Equal Big Buttons matching Activity Area Width 100%) */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', width: '100%' }}>
          <button 
            onClick={handleSpin} 
            disabled={isSpinning}
            style={{ 
              flex: 1,
              padding: '0.85rem 1rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#000000',
              border: 'none',
              cursor: isSpinning ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
            }}
          >
            <RotateCw size={20} color="#000000" className={isSpinning ? 'animate-spin' : ''} /> 
            {isSpinning ? 'Magnet Spinning...' : '1. Rotate Magnet'}
          </button>
          
          <button 
            onClick={handleReset}
            disabled={isSpinning || spinCount === 0}
            style={{ 
              flex: 1,
              padding: '0.85rem 1rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: '#18181B',
              color: (!isSpinning && spinCount > 0) ? '#FAFAFA' : '#71717A',
              border: '1.5px solid #3F3F46',
              cursor: (!isSpinning && spinCount > 0) ? 'pointer' : 'not-allowed',
              opacity: (!isSpinning && spinCount > 0) ? 1 : 0.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            <RotateCcw size={20} color={(!isSpinning && spinCount > 0) ? '#FAFAFA' : '#71717A'} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Midnight Carbon Panel */}
      <div style={{ 
        flex: '0.85', 
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid #3F3F46',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
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
          background: '#18181B', 
          border: '1.5px solid #3F3F46', 
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}>
          <h4 style={{ color: '#F59E0B', margin: '0 0 0.6rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
            Activity 4.3 Instructions
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', lineHeight: '1.5', fontWeight: 600 }}>
            <li>Drag or click "Rotate Magnet" to disturb the suspended bar magnet.</li>
            <li>Observe which direction the magnet points when it comes to rest.</li>
            <li>Repeat 2-3 times to see if it settles in the same direction every time!</li>
          </ol>
        </div>

        {/* Observation Question Box - Visible from the initial itself */}
        <div style={{ 
          padding: '1.15rem', 
          background: '#18181B', 
          border: '1.5px solid #3F3F46', 
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}>
          <h4 style={{ color: '#F59E0B', margin: '0 0 0.5rem 0', fontSize: '1.02rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={20} color="#F59E0B" /> 
            Observation Question
          </h4>
          <p style={{ margin: '0 0 0.75rem 0', color: '#FAFAFA', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
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
                background: quizAnswer === 'yes' ? 'rgba(34, 197, 94, 0.2)' : '#27272A',
                borderColor: quizAnswer === 'yes' ? '#22C55E' : '#3F3F46',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'yes' ? '#86EFAC' : '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              Yes, always N-S {quizAnswer === 'yes' && <CheckCircle size={18} color="#22C55E" />}
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
                background: quizAnswer === 'no' ? 'rgba(239, 68, 68, 0.2)' : '#27272A',
                borderColor: quizAnswer === 'no' ? '#EF4444' : '#3F3F46',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'no' ? '#FCA5A5' : '#FAFAFA'
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
              <p style={{ margin: '0 0 0.75rem 0', color: '#86EFAC', fontSize: '0.88rem', fontWeight: '700' }}>
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
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#000000',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.25s ease'
                }}
              >
                Next Section: Conclusion <ArrowRight size={20} color="#000000" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
