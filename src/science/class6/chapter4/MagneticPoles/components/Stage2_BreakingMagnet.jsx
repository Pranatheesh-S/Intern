import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, AlertCircle, CheckCircle, XCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const MagnetPart = ({ isLeft, isFull = false, showNewPoles, width = 200 }) => {
  const bgSize = isFull ? '100% 100%' : '200% 100%';
  const bgPos = isFull ? 'center' : (isLeft ? 'left center' : 'right center');

  return (
    <div style={{
      width: `${width}px`,
      height: '85px',
      display: 'flex',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
      backgroundImage: 'url(/MagneticPoles/horizontal_magnet.png)',
      backgroundSize: bgSize,
      backgroundPosition: bgPos,
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.65rem', textShadow: '0 2px 5px rgba(0,0,0,0.85)' }}>
        {isFull || isLeft ? 'N' : (showNewPoles ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1.2, color: '#10B981' }}>N</motion.span> : '')}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.65rem', textShadow: '0 2px 5px rgba(0,0,0,0.85)' }}>
        {isFull || !isLeft ? 'S' : (showNewPoles ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1.2, color: '#EF4444' }}>S</motion.span> : '')}
      </div>
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
      <div style={{ flex: '1.35', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        {/* Content Above Activity Canvas */}
        <div style={{ marginBottom: '0.6rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Breaking a Magnet
          </h3>
          <p style={{ margin: 0, color: '#0F766E', fontSize: '1.02rem', fontWeight: 700 }}>
            {!broken ? '✂️ Click on the dashed Red Cut Line or button below to break the magnet!' : '🧲 Notice how new North (N) and South (S) poles instantly form at the broken ends!'}
          </p>
        </div>

        {/* Canvas (Direct Interactive Click/Cut Area) */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '650px', 
          height: '350px', 
          background: '#FFFFFF',
          border: '2px solid #CBD5E1',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.04), 0 8px 25px rgba(0,0,0,0.06)'
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
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
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
                  borderLeft: '4px dashed #ef4444',
                  height: '130px',
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
                      background: '#ef4444',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Scissors size={14} color="#ffffff" /> Click to Cut Here!
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={handleBreak} 
            disabled={broken}
            style={{ 
              padding: '0.85rem 1.8rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: !broken ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
              color: !broken ? '#ffffff' : '#64748B',
              border: !broken ? 'none' : '1.5px solid #E2E8F0',
              cursor: !broken ? 'pointer' : 'not-allowed',
              opacity: !broken ? 1 : 0.6,
              boxShadow: !broken ? '0 6px 20px rgba(244, 63, 94, 0.4)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Scissors size={20} color={!broken ? '#ffffff' : '#64748B'} /> Break Magnet
          </button>
        </div>
      </div>

      {/* Right Side: Frosted Glacial Teal (Modern Magnetics Lab) Panel */}
      <div style={{ 
        flex: '0.95', 
        background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)',
        border: '1.5px solid #CCECE7',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div>
          {/* Badge Tag & Title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#CCFBF1', border: '1px solid #5EEAD4', color: '#0F766E', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>
            ✂️ STAGE 2: BREAKING A MAGNET
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#134E4A' }}>
            Do Isolated Poles Exist?
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#115E59', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            Follow the activity procedure below, then answer the question.
          </p>

          {/* Activity Procedure / Instructions Card */}
          <div style={{ 
            background: '#FFFFFF', 
            border: '1.5px solid #CCECE7', 
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 4px 14px rgba(15, 118, 110, 0.04)',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h4 style={{ color: '#134E4A', margin: 0, fontSize: '0.98rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} color="#0D9488" /> Stage 2 Instructions
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.15rem', color: '#115E59', fontSize: '0.86rem', lineHeight: '1.45', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Take a bar magnet with North (N) & South (S) poles.</li>
              <li>Click to cut/break the magnet into two pieces.</li>
              <li>Observe the newly formed poles at the cut ends.</li>
              <li>Determine if single isolated poles (monopoles) can exist.</li>
            </ol>
          </div>
        </div>

        {/* Inner Controls Card (Pure White with #CCECE7 pale seafoam border) */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #CCECE7', 
          borderRadius: '16px',
          padding: '1.15rem',
          boxShadow: '0 4px 14px rgba(15, 118, 110, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <h4 style={{ color: '#134E4A', margin: 0, fontSize: '1.02rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={20} color="#0D9488" /> 
            Observation & Conclusion
          </h4>
          <p style={{ margin: 0, color: '#115E59', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
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
                background: quizAnswer === 'yes' ? 'rgba(239, 68, 68, 0.1)' : '#F0FDF9',
                borderColor: quizAnswer === 'yes' ? '#ef4444' : '#CCECE7',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'yes' ? '#991b1b' : '#134E4A'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Yes, we can isolate a single North or South pole.</span>
                {quizAnswer === 'yes' && <XCircle size={18} color="#ef4444" />}
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
                background: quizAnswer === 'no' ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF9',
                borderColor: quizAnswer === 'no' ? '#10b981' : '#CCECE7',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'no' ? '#065f46' : '#134E4A'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>No, a single isolated pole cannot exist.</span>
                {quizAnswer === 'no' && <CheckCircle size={18} color="#10b981" />}
              </div>
            </button>
          </div>

          {quizAnswer === 'no' && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.75rem 0', color: '#047857', fontSize: '0.88rem', fontWeight: 600 }}>
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
                  background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                Next Section: Other Shapes <ArrowRight size={18} color="#ffffff" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
