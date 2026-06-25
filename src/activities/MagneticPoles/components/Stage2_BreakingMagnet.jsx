import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const MagnetPart = ({ isLeft, showNewPoles, width = 200 }) => {
  return (
    <div style={{
      width: `${width}px`,
      height: '60px',
      display: 'flex',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    }}>
      <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
        {isLeft ? 'N' : (showNewPoles ? 'N' : '')}
      </div>
      <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
        {!isLeft ? 'S' : (showNewPoles ? 'S' : '')}
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
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Breaking a Magnet</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            What happens if we break a magnet in half? Let's try it.
          </p>
        </div>

        {/* Paper / Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '500px', 
          height: '300px', 
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}>
          {!broken ? (
            <motion.div exit={{ opacity: 0, scale: 0.9 }}>
              <MagnetPart isLeft={true} showNewPoles={false} width={400} />
            </motion.div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                initial={{ x: 100 }}
                animate={{ x: -10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <MagnetPart isLeft={true} showNewPoles={showPoles} width={180} />
              </motion.div>

              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <MagnetPart isLeft={false} showNewPoles={showPoles} width={180} />
              </motion.div>
            </div>
          )}

          {/* Flash Effect on Break */}
          <AnimatePresence>
            {broken && !showPoles && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'white',
                  zIndex: 20
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={handleBreak} 
            disabled={broken}
            className={!broken ? 'primary' : 'outline'}
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Scissors size={18} /> Break Magnet
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
              style={{ padding: '1.5rem', background: 'var(--surface)' }}
            >
              <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Observation</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
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
              style={{ padding: '1.5rem', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}
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
                  Yes, we can isolate a North or South pole.
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
