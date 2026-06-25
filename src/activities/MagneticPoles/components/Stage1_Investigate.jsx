import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, AlertCircle, CheckCircle, Hand, RotateCcw, ArrowRight } from 'lucide-react';

// Generates random filing positions
const generateFilings = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 400 - 200, // random x between -200 and 200
    y: Math.random() * 200 - 100, // random y between -100 and 100
    rotation: Math.random() * 360,
  }));
};

export default function Stage1_Investigate({ onComplete }) {
  const [step, setStep] = useState('initial'); // initial, scattered, tapped, quiz, complete
  const [filings, setFilings] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const handleScatter = () => {
    setFilings(generateFilings(150));
    setStep('scattered');
  };

  const handleTap = () => {
    // Animate filings to poles
    // Poles are at roughly x: -100 and x: 100
    const clusteredFilings = filings.map(f => {
      const isLeft = Math.random() > 0.5;
      const poleX = isLeft ? -100 : 100;
      
      // Add some random spread around the pole
      const clusterSpreadX = (Math.random() - 0.5) * 40;
      const clusterSpreadY = (Math.random() - 0.5) * 60;

      // Make a few stick to the middle just to be realistic
      const isMiddle = Math.random() > 0.9;
      
      return {
        ...f,
        x: isMiddle ? (Math.random() - 0.5) * 50 : poleX + clusterSpreadX,
        y: isMiddle ? (Math.random() - 0.5) * 20 : clusterSpreadY,
        rotation: isMiddle ? f.rotation : (isLeft ? (Math.random() * 40 - 20) : (Math.random() * 40 - 20)), 
        // filings align roughly with the magnetic field (horizontal near poles)
      };
    });

    setFilings(clusteredFilings);
    setStep('tapped');
    
    // Show quiz after a short delay
    setTimeout(() => {
      setStep('quiz');
    }, 1500);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
    if (answer === 'ends') {
      setStep('complete');
    }
  };

  const handleNextSection = () => {
    onComplete();
  };

  const handleReset = () => {
    setStep('initial');
    setFilings([]);
    setQuizAnswer(null);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Interactive Board</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Follow the steps to investigate magnetic poles.
          </p>
        </div>

        {/* Paper / Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '500px', 
          height: '300px', 
          background: '#f8fafc', // Paper color
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}>
          {/* Bar Magnet */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '40px',
            display: 'flex',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            zIndex: 10
          }}>
            <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>N</div>
            <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>S</div>
          </div>

          {/* Iron Filings */}
          {filings.map(f => (
            <motion.div
              key={f.id}
              animate={{ x: f.x, y: f.y, rotate: f.rotation }}
              transition={{ type: 'spring', stiffness: 50, damping: 10 }}
              style={{
                position: 'absolute',
                width: '6px',
                height: '2px',
                background: '#1e293b',
                borderRadius: '1px',
                opacity: 0.8,
                zIndex: 20
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={handleScatter} 
            disabled={step !== 'initial'}
            className={step === 'initial' ? 'primary' : 'outline'}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            1. Scatter Iron Filings
          </button>
          
          <button 
            onClick={handleTap}
            disabled={step !== 'scattered'}
            className={step === 'scattered' ? 'primary' : 'outline'}
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Hand size={18} /> 2. Tap Paper
          </button>
          
          <button 
            onClick={handleReset}
            className="outline"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={step === 'initial'}
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
            <li style={{ fontWeight: step === 'initial' ? 'bold' : 'normal', color: step === 'initial' ? 'var(--accent-text)' : 'inherit' }}>
              Spread some iron filings uniformly on the sheet of paper over the magnet.
            </li>
            <li style={{ fontWeight: step === 'scattered' ? 'bold' : 'normal', color: step === 'scattered' ? 'var(--accent-text)' : 'inherit' }}>
              Gently tap the paper and observe carefully what happens to the filings.
            </li>
            <li style={{ fontWeight: step === 'quiz' || step === 'complete' ? 'bold' : 'normal', color: step === 'quiz' || step === 'complete' ? 'var(--accent-text)' : 'inherit' }}>
              Answer the observation question.
            </li>
          </ol>
        </div>

        <AnimatePresence>
          {(step === 'quiz' || step === 'complete') && (
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
                Do the iron filings stick uniformly all over the magnet, or do they stick more at specific places?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => handleQuizAnswer('uniformly')}
                  className="outline"
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: quizAnswer === 'uniformly' ? 'var(--danger-bg)' : 'transparent',
                    borderColor: quizAnswer === 'uniformly' ? 'var(--danger)' : 'var(--border)'
                  }}
                >
                  They stick uniformly all over the magnet
                </button>
                <button
                  onClick={() => handleQuizAnswer('middle')}
                  className="outline"
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: quizAnswer === 'middle' ? 'var(--danger-bg)' : 'transparent',
                    borderColor: quizAnswer === 'middle' ? 'var(--danger)' : 'var(--border)'
                  }}
                >
                  They stick mostly in the middle
                </button>
                <button
                  onClick={() => handleQuizAnswer('ends')}
                  className="outline"
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: quizAnswer === 'ends' || step === 'complete' ? 'var(--success-bg)' : 'transparent',
                    borderColor: quizAnswer === 'ends' || step === 'complete' ? 'var(--success)' : 'var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>They stick maximum near the ends</span>
                    {(quizAnswer === 'ends' || step === 'complete') && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
                  </div>
                </button>
              </div>

              {quizAnswer === 'ends' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: '1rem' }}
                >
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--success)', fontSize: '0.9rem', fontWeight: '500' }}>
                    Correct! The regions where the maximum iron filings stick are called the <strong>poles</strong> of the magnet.
                  </p>
                  <button 
                    onClick={handleNextSection}
                    className="primary"
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Next Section: Breaking a Magnet <ArrowRight size={16} />
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
