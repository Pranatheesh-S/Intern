import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, AlertCircle, CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function Stage1_Experiment({ onComplete }) {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [magnetRotation, setMagnetRotation] = useState(15); // Start slightly off
  const [showObservation, setShowObservation] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const handleSpin = () => {
    setIsSpinning(true);
    // Spin it multiple times and settle exactly at 0 degrees (or 180 degrees)
    // We can simulate physical settling by rotating it a lot, then bouncing
    const targetRotation = magnetRotation + 1080 - (magnetRotation % 360);
    
    setMagnetRotation(targetRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setSpinCount(prev => prev + 1);
      
      if (spinCount >= 1) {
        setShowObservation(true);
      }
    }, 3000); // Wait for the spring animation to finish
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
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Interactive Setup</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            A bar magnet is freely suspended by a thread.
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '400px', 
          height: '350px', 
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}>
          {/* Ceiling / Stand */}
          <div style={{ width: '60%', height: '10px', background: '#64748b', borderBottomRadius: '4px' }} />
          
          {/* String */}
          <div style={{ width: '2px', height: '140px', background: '#cbd5e1' }} />
          
          {/* Magnet Container */}
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
            animate={{ rotate: magnetRotation }}
            transition={{ 
              type: 'spring', 
              stiffness: 40, 
              damping: 8, 
              mass: 1.5,
              restDelta: 0.1 
            }}
            style={{
              position: 'relative',
              width: '160px',
              height: '30px',
              marginTop: '-5px',
              zIndex: 10,
              cursor: isSpinning || quizAnswer === 'yes' ? 'default' : 'grab'
            }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>N</div>
              <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>S</div>
            </div>
            {/* Knot */}
            <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%' }} />
          </motion.div>

          {/* Ground Markings */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            width: '200px',
            height: '60px',
            border: '2px dashed #94a3b8',
            borderRadius: '50%',
            transform: 'rotateX(60deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>N</span>
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>S</span>
          </div>
          
          {/* Rest Line (appears after first spin) */}
          <AnimatePresence>
            {spinCount > 0 && !isSpinning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  bottom: '70px',
                  width: '180px',
                  height: '2px',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent)'
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={handleSpin} 
            disabled={isSpinning || quizAnswer === 'yes'}
            className="primary"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RotateCw size={18} /> {spinCount === 0 ? '1. Push Magnet' : '2. Push Again'}
          </button>
          
          <button 
            onClick={handleReset}
            className="outline"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RotateCcw size={18} /> Reset Activity
          </button>
        </div>
      </div>

      {/* Right Side: Quiz & Instructions */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li style={{ fontWeight: spinCount === 0 ? 'bold' : 'normal', color: spinCount === 0 ? 'var(--accent-text)' : 'inherit' }}>
              Give the magnet a gentle push to rotate it and let it come to rest.
            </li>
            <li style={{ fontWeight: spinCount === 1 && !showObservation ? 'bold' : 'normal', color: spinCount === 1 && !showObservation ? 'var(--accent-text)' : 'inherit' }}>
              Observe the line it rests on. Now, push it again.
            </li>
            <li style={{ fontWeight: showObservation ? 'bold' : 'normal', color: showObservation ? 'var(--accent-text)' : 'inherit' }}>
              Answer the observation question below.
            </li>
          </ol>
        </div>

        <AnimatePresence>
          {showObservation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: '1.5rem', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}
            >
              <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} style={{ color: 'var(--accent-text)' }} /> 
                Observation
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>
                Does the magnet always come to rest along the exact same line when you spin it?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => handleQuizAnswer('no')}
                  className="outline"
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: quizAnswer === 'no' ? 'var(--danger-bg)' : 'transparent',
                    borderColor: quizAnswer === 'no' ? 'var(--danger)' : 'var(--border)'
                  }}
                >
                  No, it rests in random directions
                </button>
                <button
                  onClick={() => handleQuizAnswer('yes')}
                  className="outline"
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: quizAnswer === 'yes' ? 'var(--success-bg)' : 'transparent',
                    borderColor: quizAnswer === 'yes' ? 'var(--success)' : 'var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Yes, it rests along the same line</span>
                    {quizAnswer === 'yes' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
                  </div>
                </button>
              </div>

              {quizAnswer === 'yes' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: '1rem' }}
                >
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--success)', fontSize: '0.9rem', fontWeight: '500' }}>
                    Correct! A freely suspended bar magnet always comes to rest in the <strong>North-South</strong> direction.
                  </p>
                  <button 
                    onClick={handleNextSection}
                    className="primary"
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Next Section: Conclusion <ArrowRight size={16} />
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
