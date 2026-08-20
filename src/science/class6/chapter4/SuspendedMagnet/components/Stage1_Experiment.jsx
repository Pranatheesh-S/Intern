import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, AlertCircle, CheckCircle, RotateCcw, ArrowRight, Compass, Info, Sparkles } from 'lucide-react';

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
      padding: '0.5rem 1rem', 
      display: 'flex', 
      gap: '1.25rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* Left Side: Interactive 3D Setup (Sage Mint Light Theme) */}
      <div style={{ 
        flex: '1.75', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        textAlign: 'center', 
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left Top Card Header matching reference style */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '0.55rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.06)',
          boxSizing: 'border-box',
          marginBottom: '0.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
            🧲 Suspended Magnet Experiment (Fig. 4.7)
          </h3>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
            A bar magnet is freely suspended by a thread. Rotate it and observe where it comes to rest!
          </p>
        </div>

        {/* Activity Canvas Scene Area */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '100%', 
          flex: 1,
          minHeight: '260px', 
          background: '#F0FDF4',
          border: '1.5px solid #A7F3D0',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)'
        }}>
          {/* Top Left Floating Badge Overlay matching reference style */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
              border: '1.5px solid #B45309',
              borderRadius: '20px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 900,
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(69, 26, 3, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <Compass size={16} color="#F59E0B" /> HEADING: NORTH-SOUTH
            </div>
          </div>

          <img 
            src="/SuspendedMagnet/wooden_stand_lab_bg.jpg" 
            alt="Experiment Setup Stand" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} 
          />
          
          {/* Hanging Thread Rope */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '3px',
            height: '42%',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
            boxShadow: '0 0 4px rgba(0,0,0,0.4)',
            zIndex: 10,
            transform: 'translateX(-50%)'
          }} />

          {/* 3D Cinematic Bar Magnet Component */}
          <motion.div
            drag
            dragConstraints={{ left: -180, right: 180, top: -60, bottom: 60 }}
            dragElastic={0.2}
            animate={{ rotate: magnetRotation }}
            transition={isSpinning ? { duration: 3, ease: 'easeOut' } : { type: 'spring', stiffness: 60 }}
            style={{
              position: 'absolute',
              top: '42%',
              left: 'calc(50% - 140px)',
              width: '280px',
              height: '58px',
              borderRadius: '14px',
              display: 'flex',
              zIndex: 20,
              cursor: 'grab',
              boxShadow: '0 16px 35px rgba(0,0,0,0.5), 0 0 25px rgba(245, 158, 11, 0.4)',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.6)',
              background: '#18181B'
            }}
          >
            {/* North Pole (Red) */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.4rem',
              letterSpacing: '2px',
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              position: 'relative'
            }}>
              N (North)
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '2px', background: '#FFFFFF' }} />
            </div>
            
            {/* South Pole (Blue) */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.4rem',
              letterSpacing: '2px',
              textShadow: '0 2px 4px rgba(0,0,0,0.4)'
            }}>
              S (South)
            </div>
          </motion.div>

          {/* Real-world North-South Geographic Line */}
          <div style={{
            position: 'absolute',
            bottom: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '0.45rem 1.25rem',
            borderRadius: '25px',
            border: '1.5px solid #A7F3D0',
            boxShadow: '0 4px 14px rgba(6, 78, 59, 0.1)',
            zIndex: 10
          }}>
            <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '0.9rem' }}>🔴 NORTH (N)</span>
            <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, #EF4444 0%, #3B82F6 100%)' }} />
            <span style={{ color: '#3B82F6', fontWeight: 900, fontSize: '0.9rem' }}>🔵 SOUTH (S)</span>
          </div>
        </div>
      </div>

      {/* Right Side: Guide & Control Pad (Matching Reference Screenshot Layout) */}
      <div style={{ 
        flex: '0.75', 
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '24px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto' 
      }}>
        <div>
          {/* Kicker Badge matching reference style */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            background: '#D1FAE5',
            color: '#065F46',
            padding: '0.35rem 0.85rem',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '1.2px',
            marginBottom: '0.65rem'
          }}>
            <Sparkles size={14} color="#065F46" /> LET'S PLAY & OBSERVE
          </div>

          <h3 style={{ margin: '0 0 0.4rem 0', color: '#064E3B', fontSize: '1.55rem', fontWeight: 900, lineHeight: '1.2' }}>
            Rotate & Find North
          </h3>

          <p style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '0.92rem', lineHeight: '1.5', fontWeight: 600 }}>
            Rotate the suspended magnet by clicking <strong style={{ color: '#D97706' }}>"Rotate Magnet"</strong> or dragging it. Observe which direction the red North pole settling line points!
          </p>

          {/* Physics Control Pad Container matching reference screenshot */}
          <div style={{ 
            background: '#F0FDF4', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '20px', 
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCw size={15} color="#047857" /> 3D MAGNET CONTROLS
            </div>

            {/* Control Pad Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button 
                onClick={handleSpin} 
                disabled={isSpinning}
                style={{ 
                  gridColumn: '1 / -1',
                  padding: '0.85rem 1.25rem', 
                  fontSize: '0.95rem', 
                  fontWeight: 900, 
                  borderRadius: '14px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '0.55rem',
                  background: isSpinning ? '#CBD5E1' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: isSpinning ? '#64748B' : '#FFFFFF',
                  border: 'none',
                  cursor: isSpinning ? 'not-allowed' : 'pointer',
                  boxShadow: isSpinning ? 'none' : '0 4px 14px rgba(217, 119, 6, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCw size={18} className={isSpinning ? 'spin-anim' : ''} /> {isSpinning ? 'Spinning...' : 'Rotate Magnet'}
              </button>

              <button 
                onClick={handleReset} 
                style={{ 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.85rem', 
                  fontWeight: 800, 
                  borderRadius: '12px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                }}
              >
                <RotateCcw size={15} color="#1E293B" /> Restart
              </button>

              <button 
                onClick={() => setShowObservation(!showObservation)} 
                style={{ 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.85rem', 
                  fontWeight: 800, 
                  borderRadius: '12px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Info size={15} color="#D97706" /> {showObservation ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700, textAlign: 'center' }}>
              Rotations Performed: <strong style={{ color: '#D97706', fontSize: '0.9rem' }}>{spinCount}</strong>
            </div>
                   {/* Quick Check Question (Visible Initially) */}
          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '0.9rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Quick Check: Does a freely suspended magnet always settle in the North-South direction?
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleQuizAnswer('yes')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: quizAnswer === 'yes' ? '#16A34A' : '#FFFFFF',
                  color: quizAnswer === 'yes' ? '#FFFFFF' : '#1E293B',
                  border: quizAnswer === 'yes' ? 'none' : '1.5px solid #CBD5E1'
                }}
              >
                Yes, Always!
              </button>
              <button
                onClick={() => handleQuizAnswer('no')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: quizAnswer === 'no' ? '#EF4444' : '#FFFFFF',
                  color: quizAnswer === 'no' ? '#FFFFFF' : '#1E293B',
                  border: quizAnswer === 'no' ? 'none' : '1.5px solid #CBD5E1'
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar matching reference style */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
            Stage 1 of 2 ● ○
          </span>

          <button
            onClick={handleNextSection}
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              fontWeight: 900,
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            Next <ArrowRight size={18} color="#FFFFFF" />
          </button>
        </div>       </div>
      </div>
    </div>
  );
}
