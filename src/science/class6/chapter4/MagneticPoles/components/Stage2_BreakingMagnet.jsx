import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, AlertCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

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
        {isFull || isLeft ? 'N' : (showNewPoles ? 'N' : '')}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.65rem', textShadow: '0 2px 5px rgba(0,0,0,0.85)' }}>
        {isFull || !isLeft ? 'S' : (showNewPoles ? 'S' : '')}
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
    // Show the new poles appearing after a short delay
    setTimeout(() => {
      setShowPoles(true);
    }, 1000);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
  };

  const handleNextSection = () => {
    onComplete();
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
      background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0f172a 100%)',
      border: '1.5px solid #1e40af',
      borderRadius: '20px',
      boxShadow: '0 12px 35px rgba(11, 19, 43, 0.4)'
    }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1.35', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Breaking a Magnet
          </h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
            What happens if we break a magnet in half? Let's try it.
          </p>
        </div>

        {/* Canvas (Enlarged to 360px Height, 650px Max Width to fill empty space) */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '650px', 
          height: '360px', 
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.05), 0 8px 25px rgba(0,0,0,0.07)'
        }}>
          {!broken ? (
            <motion.div exit={{ opacity: 0, scale: 0.9 }}>
              <MagnetPart isLeft={true} isFull={true} showNewPoles={false} width={480} />
            </motion.div>
          ) : (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                initial={{ x: 100 }}
                animate={{ x: -10 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <MagnetPart isLeft={true} isFull={false} showNewPoles={showPoles} width={220} />
              </motion.div>

              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 10 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <MagnetPart isLeft={false} isFull={false} showNewPoles={showPoles} width={220} />
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {!broken && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                  pointerEvents: 'none'
                }}
              >
                <div style={{
                  borderLeft: '3px dashed #ef4444',
                  height: '110px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ef4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}>
                    Cut Line
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button 
            onClick={handleBreak} 
            disabled={broken}
            className={!broken ? 'primary' : 'outline'}
            style={{ padding: '0.9rem 1.8rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <Scissors size={20} /> Break Magnet
          </button>
        </div>
      </div>

      {/* Right Side: Quiz & Explanation */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <AnimatePresence>
          {showPoles && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel"
              style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.65)', border: '1.5px solid #3b82f6' }}
            >
              <h4 style={{ color: '#38bdf8', margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800 }}>Observation</h4>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.95rem' }}>
                When the magnet is broken into two pieces, each piece immediately develops a new pole at the broken end! 
                The left piece grew a new South pole, and the right piece grew a new North pole.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPoles && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="glass-panel"
              style={{ padding: '1.5rem', background: 'rgba(30, 58, 138, 0.5)', border: '1.5px solid #60a5fa' }}
            >
              <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} style={{ color: 'var(--accent-text)' }} /> 
                Conclusion
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>
                Based on this, is it possible to obtain a magnet with only a single pole?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => handleQuizAnswer('yes')}
                  className="outline"
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: quizAnswer === 'yes' ? 'var(--danger-bg)' : 'transparent',
                    borderColor: quizAnswer === 'yes' ? 'var(--danger)' : 'var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Yes, we can isolate a North or South pole.</span>
                    {quizAnswer === 'yes' && <XCircle size={18} style={{ color: 'var(--danger)' }} />}
                  </div>
                </button>
                <button
                  onClick={() => handleQuizAnswer('no')}
                  className="outline"
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: quizAnswer === 'no' ? 'var(--success-bg)' : 'transparent',
                    borderColor: quizAnswer === 'no' ? 'var(--success)' : 'var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>No, a single pole cannot exist.</span>
                    {quizAnswer === 'no' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
                  </div>
                </button>
              </div>

              {quizAnswer === 'no' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: '1rem' }}
                >
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--success)', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.5' }}>
                    Correct! North and South poles <strong>always exist in pairs</strong>, even in the smallest pieces of a magnet.
                  </p>
                  <button 
                    onClick={handleNextSection}
                    className="primary"
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Next Section: Other Shapes <ArrowRight size={16} />
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
