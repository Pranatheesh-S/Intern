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
        {/* Content Above Activity Canvas (Left Top Bar) */}
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
            Breaking a Magnet
          </h3>
          <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.92rem', fontWeight: 700 }}>
            {!broken ? '✂️ Click on the dashed Cut Line or button below to break the magnet!' : '🧲 Notice how new North (N) and South (S) poles instantly form at the broken ends!'}
          </p>
        </div>

        {/* Cinematic Physics Lab Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '350px', 
          background: 'radial-gradient(circle at center, #F8FAFC 0%, #E2E8F0 100%)',
          backgroundImage: `
            radial-gradient(circle at center, rgba(250, 204, 21, 0.22) 0%, rgba(226, 232, 240, 0.98) 75%),
            linear-gradient(rgba(217, 119, 6, 0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 119, 6, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 25px 25px, 25px 25px',
          border: '2px solid #FACC15',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {!broken ? (
            <motion.div 
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ cursor: 'pointer' }}
              onClick={handleBreak}
            >
              <MagnetPart isLeft={true} isFull={true} showNewPoles={false} width={480} />
            </motion.div>
          ) : (
            <div style={{ display: 'flex', gap: '35px', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                drag
                dragConstraints={{ left: -100, right: 20, top: -60, bottom: 60 }}
                initial={{ x: 80, rotate: 0 }}
                animate={{ x: -15, rotate: -4 }}
                transition={{ type: 'spring', damping: 14 }}
                style={{ cursor: 'grab' }}
                whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
              >
                <MagnetPart isLeft={true} isFull={false} showNewPoles={showPoles} width={220} />
              </motion.div>

              <motion.div
                drag
                dragConstraints={{ left: -20, right: 100, top: -60, bottom: 60 }}
                initial={{ x: -80, rotate: 0 }}
                animate={{ x: 15, rotate: 4 }}
                transition={{ type: 'spring', damping: 14 }}
                style={{ cursor: 'grab' }}
                whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
              >
                <MagnetPart isLeft={false} isFull={false} showNewPoles={showPoles} width={220} />
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {!broken && (
              <motion.div
                onClick={handleBreak}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 25,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  borderLeft: '4px dashed #F59E0B',
                  height: '140px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    style={{
                      position: 'absolute',
                      top: '-32px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#000000',
                      padding: '4px 14px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Scissors size={14} color="#000000" /> Click to Cut Here!
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
              padding: '0.95rem 1.8rem', 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: !broken ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#27272A',
              color: !broken ? '#000000' : '#A1A1AA',
              border: !broken ? 'none' : '1.5px solid #3F3F46',
              cursor: !broken ? 'pointer' : 'not-allowed',
              opacity: !broken ? 1 : 0.6,
              boxShadow: !broken ? '0 6px 20px rgba(245, 158, 11, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <Scissors size={20} color={!broken ? '#000000' : '#A1A1AA'} /> Break Magnet
          </button>
        </div>
      </div>

      {/* Right Side: Pitch Charcoal Panel */}
      <div style={{ 
        flex: '0.95', 
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid #3F3F46',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div>
          {/* Badge Tag & Title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #F59E0B', color: '#F59E0B', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>
            ✂️ STAGE 2: BREAKING A MAGNET
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B' }}>
            Do Isolated Poles Exist?
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#FAFAFA', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            Follow the activity procedure below, then answer the question.
          </p>

          {/* Activity Procedure / Instructions Card */}
          <div style={{ 
            background: '#27272A', 
            border: '1.5px solid #3F3F46', 
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h4 style={{ color: '#F59E0B', margin: 0, fontSize: '0.98rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} color="#F59E0B" /> Stage 2 Instructions
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.15rem', color: '#A1A1AA', fontSize: '0.86rem', lineHeight: '1.45', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Take a bar magnet with North (N) & South (S) poles.</li>
              <li>Click to cut/break the magnet into two pieces.</li>
              <li>Observe the newly formed poles at the cut ends.</li>
              <li>Determine if single isolated poles (monopoles) can exist.</li>
            </ol>
          </div>
        </div>

        {/* Inner Controls Card */}
        <div style={{ 
          background: '#27272A', 
          border: '1.5px solid #3F3F46', 
          borderRadius: '16px',
          padding: '1.15rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <h4 style={{ color: '#F59E0B', margin: 0, fontSize: '1.02rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={20} color="#F59E0B" /> 
            Observation & Conclusion
          </h4>
          <p style={{ margin: 0, color: '#FAFAFA', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
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
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: quizAnswer === 'yes' ? 'rgba(239, 68, 68, 0.2)' : '#18181B',
                borderColor: quizAnswer === 'yes' ? '#EF4444' : '#3F3F46',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'yes' ? '#FCA5A5' : '#FAFAFA'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Yes, we can isolate a single North or South pole.</span>
                {quizAnswer === 'yes' && <XCircle size={18} color="#EF4444" />}
              </div>
            </button>

            <button
              onClick={() => handleQuizAnswer('no')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: quizAnswer === 'no' ? 'rgba(34, 197, 94, 0.2)' : '#18181B',
                borderColor: quizAnswer === 'no' ? '#22C55E' : '#3F3F46',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'no' ? '#86EFAC' : '#FAFAFA'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>No, a single isolated pole cannot exist.</span>
                {quizAnswer === 'no' && <CheckCircle size={18} color="#22C55E" />}
              </div>
            </button>
          </div>

          {quizAnswer === 'no' && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.75rem 0', color: '#F59E0B', fontSize: '0.88rem', fontWeight: 600 }}>
                Correct! North and South poles <strong>always exist in pairs</strong>, even in the smallest pieces of a magnet.
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
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                Continue to Sandbox <ArrowRight size={18} color="#000000" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
