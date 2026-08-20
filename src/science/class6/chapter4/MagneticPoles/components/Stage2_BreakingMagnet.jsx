import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, AlertCircle, CheckCircle, XCircle, ArrowRight, BookOpen } from 'lucide-react';

const MagnetPart = ({ isLeft, isFull = false, showNewPoles, width = 200 }) => {
  return (
    <div style={{
      width: `${width}px`,
      height: '80px',
      display: 'flex',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 16px 35px rgba(0,0,0,0.6), 0 0 25px rgba(250, 204, 21, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.35)',
      position: 'relative',
      zIndex: 30,
      background: '#18181B'
    }}>
      {/* North Pole Block */}
      {(isFull || isLeft) && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
        }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>
            N
          </span>
          <div style={{ position: 'absolute', top: 5, left: 8, fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)' }}>
            NORTH
          </div>
        </div>
      )}

      {/* Break Cut Seam or Newly Formed Pole */}
      {!isFull && isLeft && showNewPoles && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)'
        }}>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1.25 }} style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', textShadow: '0 0 12px #FACC15' }}>
            S
          </motion.span>
          <div style={{ position: 'absolute', top: 5, right: 8, fontSize: '0.62rem', fontWeight: 800, color: '#FACC15' }}>
            NEW POLE
          </div>
        </div>
      )}

      {!isFull && !isLeft && showNewPoles && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)'
        }}>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1.25 }} style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', textShadow: '0 0 12px #FACC15' }}>
            N
          </motion.span>
          <div style={{ position: 'absolute', top: 5, left: 8, fontSize: '0.62rem', fontWeight: 800, color: '#FACC15' }}>
            NEW POLE
          </div>
        </div>
      )}

      {/* Center Seam */}
      {isFull && (
        <div style={{
          width: '6px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)',
          boxShadow: '0 0 8px rgba(0,0,0,0.8)',
          zIndex: 2
        }} />
      )}

      {/* South Pole Block */}
      {(isFull || !isLeft) && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
        }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>
            S
          </span>
          <div style={{ position: 'absolute', top: 5, right: 8, fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)' }}>
            SOUTH
          </div>
        </div>
      )}
    </div>
  );
};

export default function Stage2_BreakingMagnet({ onComplete }) {
  const [broken, setBroken] = useState(false);
  const [showPoles, setShowPoles] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const handleBreak = () => {
    setBroken(true);
    setTimeout(() => {
      setShowPoles(true);
    }, 600);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
  };

  const handleNextSection = () => {
    onComplete();
  };

  return (
    <div style={{ 
      padding: '0.5rem', 
      display: 'flex', 
      gap: '1.25rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box'
    }}>
      {/* Left Side: Activity Interactive Area */}
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
        {/* Top Header Card above Canvas */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.06)',
          boxSizing: 'border-box',
          marginBottom: '0.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
            Breaking a Magnet Experiment (Fig. 4.4)
          </h3>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
            {!broken ? '✂️ Click "Break Magnet" to cut the bar magnet directly in half.' : '🎉 The magnet is broken into two independent pieces!'}
          </p>
        </div>

        {/* Physics Lab Board Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          flex: 1,
          minHeight: '380px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)'
        }}>
          {/* Finding Directions Physics Lab Background Image */}
          <img 
            src="/SuspendedMagnet/wooden_stand_lab_bg.jpg" 
            alt="Physics Lab Background" 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'brightness(1.05) contrast(0.95)',
              zIndex: 1 
            }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.25)', zIndex: 1, pointerEvents: 'none' }} />
          
          {/* Transparent White Sheet of Paper matching Iron Filings area width (560px x 340px) */}
          <div style={{
            position: 'absolute',
            width: '560px',
            maxWidth: '92%',
            height: '340px',
            maxHeight: '86%',
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(3px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12), inset 0 0 20px rgba(255, 255, 255, 0.6)',
            zIndex: 2,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: '8px 12px'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.75 }}>
              📄 White Paper Sheet
            </span>
          </div>
          
          {/* Magnet Container */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: broken ? '40px' : '0px', transition: 'all 0.5s ease', zIndex: 2 }}>
            {!broken ? (
              <MagnetPart isFull={true} showNewPoles={false} width={340} />
            ) : (
              <>
                <motion.div initial={{ x: 0 }} animate={{ x: -25 }} transition={{ duration: 0.5 }}>
                  <MagnetPart isLeft={true} isFull={false} showNewPoles={showPoles} width={160} />
                </motion.div>
                <motion.div initial={{ x: 0 }} animate={{ x: 25 }} transition={{ duration: 0.5 }}>
                  <MagnetPart isLeft={false} isFull={false} showNewPoles={showPoles} width={160} />
                </motion.div>
              </>
            )}
          </div>

          {/* Interactive Scissors Indicator */}
          <AnimatePresence>
            {!broken && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={handleBreak}
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  zIndex: 40
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Scissors size={36} color="#D97706" style={{ filter: 'drop-shadow(0 4px 10px rgba(217, 119, 6, 0.5))' }} />
                  <motion.span
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                      position: 'absolute',
                      top: '-32px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#FFFFFF',
                      padding: '4px 14px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Scissors size={14} color="#FFFFFF" /> Click to Cut Here!
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
          <button 
            onClick={handleBreak} 
            disabled={broken}
            style={{ 
              width: '100%',
              padding: '0.85rem 1.8rem', 
              fontSize: '1rem', 
              fontWeight: 900, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: !broken ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
              color: !broken ? '#FFFFFF' : '#94A3B8',
              border: !broken ? 'none' : '1.5px solid #CBD5E1',
              cursor: !broken ? 'pointer' : 'not-allowed',
              opacity: !broken ? 1 : 0.6,
              boxShadow: !broken ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
            }}
          >
            <Scissors size={20} color={!broken ? '#FFFFFF' : '#94A3B8'} /> Break Magnet
          </button>
        </div>
      </div>

      {/* Right Side: Control Panel (Activity 4.3 Theme) */}
      <div style={{ 
        flex: '0.95', 
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div>
          {/* Badge Tag & Title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#D1FAE5', color: '#047857', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
            ✂️ STAGE 2: BREAKING A MAGNET
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.5rem', fontWeight: 900, color: '#064E3B' }}>
            Do Isolated Poles Exist?
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#334155', fontSize: '0.92rem', lineHeight: 1.55, fontWeight: 600 }}>
            Follow the activity procedure below, then answer the question.
          </p>

          {/* Activity Procedure / Instructions Card */}
          <div style={{ 
            background: '#F0FDF4', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h4 style={{ color: '#064E3B', margin: 0, fontSize: '0.98rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} color="#047857" /> Stage 2 Instructions
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.15rem', color: '#334155', fontSize: '0.88rem', lineHeight: '1.5', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Take a bar magnet with North (N) & South (S) poles.</li>
              <li>Click to cut/break the magnet into two pieces.</li>
              <li>Observe the newly formed poles at the cut ends.</li>
              <li>Determine if single isolated poles (monopoles) can exist.</li>
            </ol>
          </div>
        </div>

        {/* Inner Controls Card */}
        <div style={{ 
          background: '#F0FDF4', 
          border: '1.5px solid #A7F3D0', 
          borderRadius: '16px',
          padding: '1.15rem',
          boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <h4 style={{ color: '#064E3B', margin: 0, fontSize: '1.02rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={20} color="#D97706" /> 
            Observation & Conclusion
          </h4>
          <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: 1.55, fontWeight: 600 }}>
            Based on what happens when a magnet breaks, is it possible to obtain a magnet with only a single pole?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <button
              onClick={() => handleQuizAnswer('yes')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: quizAnswer === 'yes' ? '#FEE2E2' : '#FFFFFF',
                borderColor: quizAnswer === 'yes' ? '#EF4444' : '#CBD5E1',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'yes' ? '#991B1B' : '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <span>Yes, we can isolate a single North or South pole.</span>
              {quizAnswer === 'yes' && <XCircle size={18} color="#EF4444" />}
            </button>

            <button
              onClick={() => handleQuizAnswer('no')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: quizAnswer === 'no' ? '#DCFCE7' : '#FFFFFF',
                borderColor: quizAnswer === 'no' ? '#16A34A' : '#CBD5E1',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'no' ? '#065F46' : '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <span>No, a single isolated pole cannot exist.</span>
              {quizAnswer === 'no' && <CheckCircle size={18} color="#16A34A" />}
            </button>
          </div>

          {quizAnswer === 'no' && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.75rem 0', color: '#065F46', fontSize: '0.88rem', fontWeight: 800 }}>
                Correct! North and South poles <strong>always exist in pairs</strong>, even in the smallest pieces of a magnet.
              </p>
              <button 
                onClick={handleNextSection}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  borderRadius: '25px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Proceed to Stage 3 <ArrowRight size={18} color="#FFFFFF" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
