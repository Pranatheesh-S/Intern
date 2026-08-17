import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Hand, RotateCcw, ArrowRight } from 'lucide-react';

// Generates random filing positions (Original style)
const generateFilings = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const width = 6 + Math.random() * 18;
    const color = Math.random() > 0.5 ? 'rgba(30, 41, 59, 0.65)' : 'rgba(51, 65, 85, 0.65)';
    return {
      id: i,
      x: Math.random() * 600 - 300,
      y: Math.random() * 400 - 200,
      rotation: Math.random() * 360,
      width,
      color
    };
  });
};

export default function Stage1_Investigate({ onComplete }) {
  const [step, setStep] = useState('initial'); // initial, scattered, tapped, quiz, complete
  const [filings, setFilings] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [shape, setShape] = useState('bar');

  const handleShapeChange = (newShape) => {
    setShape(newShape);
    handleReset();
  };

  const handleScatter = () => {
    setFilings(generateFilings(2500));
    setStep('scattered');
  };

  const handleTap = () => {
    const clusteredFilings = filings.map(f => {
      let nx = f.x;
      let ny = f.y;
      
      let poleNx = -90; 
      let poleNy = 0;
      let poleSx = 90; 
      let poleSy = 0;

      const distN = Math.hypot(nx - poleNx, ny - poleNy);
      const distS = Math.hypot(nx - poleSx, ny - poleSy);
      
      const minDist = Math.min(distN, distS);
      const isNorth = distN < distS;
      const targetX = isNorth ? poleNx : poleSx;
      const targetY = isNorth ? poleSy : poleSy;

      let pullFactor = Math.pow(Math.E, -minDist / 120) * 0.3;
      
      if (minDist < 60) {
        pullFactor = Math.max(pullFactor, Math.pow(Math.E, -minDist / 40) * 0.7);
      }
      
      if (Math.abs(nx) < 90 && Math.abs(ny) < 60) {
        const bodyPull = Math.pow(Math.E, -Math.abs(ny) / 40);
        ny = ny - ny * bodyPull * 0.4;
      }

      nx = nx + (targetX - nx) * pullFactor;
      ny = ny + (targetY - ny) * pullFactor;

      const dxN = nx - poleNx;
      const dyN = ny - poleNy;
      const dN3 = Math.pow(dxN * dxN + dyN * dyN, 1.5) || 1;
      const bxN = dxN / dN3;
      const byN = dyN / dN3;

      const dxS = nx - poleSx;
      const dyS = ny - poleSy;
      const dS3 = Math.pow(dxS * dxS + dyS * dyS, 1.5) || 1;
      const bxS = -dxS / dS3;
      const byS = -dyS / dS3;

      const bx = bxN + bxS;
      const by = byN + byS;

      let angle = Math.atan2(by, bx) * (180 / Math.PI);
      angle += (Math.random() - 0.5) * 4;

      nx += (Math.random() - 0.5) * 5;
      ny += (Math.random() - 0.5) * 5;

      return {
        ...f,
        x: nx,
        y: ny,
        rotation: angle, 
      };
    });

    setFilings(clusteredFilings);
    setStep('tapped');
    
    setTimeout(() => {
      setStep('quiz');
    }, 1200);
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
    <div className="glass-panel" style={{ 
      padding: '1.25rem 1.75rem', 
      display: 'flex', 
      gap: '1.75rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box' 
    }}>
      {/* Left Side: Interactive Area (Enlarged & Centered) */}
      <div style={{ 
        flex: '1.15', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center', 
        minWidth: 0 
      }}>
        <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            Interactive Board
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Follow the steps to investigate magnetic poles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button 
            onClick={() => handleShapeChange('bar')}
            className={shape === 'bar' ? 'primary' : 'outline'}
            style={{ padding: '0.45rem 1.25rem', fontSize: '0.88rem', fontWeight: 600 }}
          >
            Bar Magnet
          </button>
        </div>

        {/* Paper Board (Enlarged 290px Height, 520px Width) */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '520px', 
          height: '290px', 
          background: '#f8fafc',
          border: '1.5px solid #cbd5e1',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.06), 0 4px 15px rgba(0,0,0,0.05)'
        }}>
          {/* Bar Magnet */}
          {shape === 'bar' && (
            <img 
              src="/MagneticPoles/horizontal_magnet.png" 
              alt="Bar Magnet"
              style={{
                position: 'absolute',
                width: '220px',
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
              }}
            />
          )}

          {/* Render Filings */}
          {filings.map((f) => (
            <div
              key={f.id}
              style={{
                position: 'absolute',
                left: `calc(50% + ${f.x}px)`,
                top: `calc(50% + ${f.y}px)`,
                width: `${f.width}px`,
                height: '2.5px',
                backgroundColor: f.color,
                transform: `rotate(${f.rotation}deg)`,
                borderRadius: '1px',
                pointerEvents: 'none',
                zIndex: 20
              }}
            />
          ))}
        </div>

        {/* Action Controls (Enlarged Buttons) */}
        <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1rem' }}>
          <button 
            onClick={handleScatter} 
            disabled={step !== 'initial'}
            className={step === 'initial' ? 'primary' : 'outline'}
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', fontWeight: 600 }}
          >
            1. Scatter Iron Filings
          </button>
          
          <button 
            onClick={handleTap}
            disabled={step !== 'scattered'}
            className={step === 'scattered' ? 'primary' : 'outline'}
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Hand size={18} /> 2. Tap Paper
          </button>
          
          <button 
            onClick={handleReset}
            className="outline"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={step === 'initial'}
          >
            <RotateCcw size={18} /> Reset Activity
          </button>
        </div>
      </div>

      {/* Right Side: Instructions & Observation Quiz Card (Enlarged to fill vertical space) */}
      <div style={{ 
        flex: '0.85', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        {/* Instructions Panel */}
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 700 }}>
            Instructions
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
            <li style={{ fontWeight: step === 'initial' ? 'bold' : 'normal', color: step === 'initial' ? 'var(--accent-text)' : 'inherit' }}>
              Spread iron filings uniformly on the sheet of paper over the magnet.
            </li>
            <li style={{ fontWeight: step === 'scattered' ? 'bold' : 'normal', color: step === 'scattered' ? 'var(--accent-text)' : 'inherit' }}>
              Gently tap the paper and observe how the filings orient along field lines.
            </li>
            <li style={{ fontWeight: step === 'quiz' || step === 'complete' ? 'bold' : 'normal', color: step === 'quiz' || step === 'complete' ? 'var(--accent-text)' : 'inherit' }}>
              Answer the observation question below.
            </li>
          </ol>
        </div>

        {/* Observation Quiz & Continue Section */}
        <AnimatePresence>
          {(step === 'quiz' || step === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: '1.25rem 1.5rem', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <h4 style={{ color: 'var(--text-heading)', margin: '0 0 0.6rem 0', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={20} style={{ color: 'var(--accent-text)' }} /> 
                  Observation Question
                </h4>
                <p style={{ margin: '0 0 0.85rem 0', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Do the iron filings stick uniformly all over the magnet, or do they stick more at specific places?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button
                    onClick={() => handleQuizAnswer('uniformly')}
                    className="outline"
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.88rem',
                      background: quizAnswer === 'uniformly' ? 'var(--danger-bg)' : 'transparent',
                      borderColor: quizAnswer === 'uniformly' ? 'var(--danger)' : 'var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>They stick uniformly all over the magnet</span>
                      {quizAnswer === 'uniformly' && <XCircle size={18} style={{ color: 'var(--danger)' }} />}
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizAnswer('middle')}
                    className="outline"
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.88rem',
                      background: quizAnswer === 'middle' ? 'var(--danger-bg)' : 'transparent',
                      borderColor: quizAnswer === 'middle' ? 'var(--danger)' : 'var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>They stick mostly in the middle</span>
                      {quizAnswer === 'middle' && <XCircle size={18} style={{ color: 'var(--danger)' }} />}
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizAnswer('ends')}
                    className="outline"
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.88rem',
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
              </div>

              {quizAnswer === 'ends' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '1rem' }}
                >
                  <p style={{ margin: '0 0 0.85rem 0', color: 'var(--success)', fontSize: '0.9rem', fontWeight: '600' }}>
                    Correct! The regions where the maximum iron filings stick are called the <strong>poles</strong> of the magnet.
                  </p>
                  <button 
                    onClick={handleNextSection}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: 800,
                      borderRadius: '35px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                  >
                    Next Section: Breaking a Magnet <ArrowRight size={20} />
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
