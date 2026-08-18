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
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0f172a 100%)',
      border: '1.5px solid #1e40af',
      borderRadius: '20px',
      boxShadow: '0 12px 35px rgba(11, 19, 43, 0.4)'
    }}>
      {/* Left Side: Interactive Area */}
      <div style={{ 
        flex: '1.35', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center', 
        minWidth: 0,
        height: '100%'
      }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Interactive Board
          </h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
            Follow the steps to investigate magnetic poles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => handleShapeChange('bar')}
            style={{ 
              padding: '0.65rem 1.75rem', 
              fontSize: '1.02rem', 
              fontWeight: 700, 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 119, 0, 0.4)'
            }}
          >
            Bar Magnet
          </button>
        </div>

        {/* Paper Board (Enlarged to 360px Height, 650px Max Width to fill empty space) */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '650px', 
          height: '360px', 
          background: '#f8fafc',
          border: '2px solid #cbd5e1',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.06), 0 8px 25px rgba(0,0,0,0.07)'
        }}>
          {/* Bar Magnet */}
          {shape === 'bar' && (
            <img 
              src="/MagneticPoles/horizontal_magnet.png" 
              alt="Bar Magnet"
              style={{
                position: 'absolute',
                width: '280px',
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))'
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
                height: '2.8px',
                backgroundColor: f.color,
                transform: `rotate(${f.rotation}deg)`,
                borderRadius: '1px',
                pointerEvents: 'none',
                zIndex: 20
              }}
            />
          ))}
        </div>

        {/* Action Controls (Enlarged Action Buttons with High Visibility) */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button 
            onClick={handleScatter} 
            disabled={step !== 'initial'}
            style={{ 
              padding: '0.9rem 1.75rem', 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              borderRadius: '14px',
              background: step === 'initial' ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
              color: step === 'initial' ? '#ffffff' : '#1e3a8a',
              border: step === 'initial' ? 'none' : '2px solid #3b82f6',
              cursor: step === 'initial' ? 'pointer' : 'not-allowed',
              opacity: step === 'initial' ? 1 : 0.85,
              boxShadow: step === 'initial' ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            1. Scatter Iron Filings
          </button>
          
          <button 
            onClick={handleTap}
            disabled={step !== 'scattered'}
            style={{ 
              padding: '0.9rem 1.75rem', 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: step === 'scattered' ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
              color: step === 'scattered' ? '#ffffff' : '#1e3a8a',
              border: step === 'scattered' ? 'none' : '2px solid #3b82f6',
              cursor: step === 'scattered' ? 'pointer' : 'not-allowed',
              opacity: step === 'scattered' ? 1 : 0.85,
              boxShadow: step === 'scattered' ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Hand size={20} color={step === 'scattered' ? '#ffffff' : '#1e3a8a'} /> 2. Tap Paper
          </button>
          
          <button 
            onClick={handleReset}
            disabled={step === 'initial'}
            style={{ 
              padding: '0.9rem 1.75rem', 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: step !== 'initial' ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
              color: step !== 'initial' ? '#ffffff' : '#1e3a8a',
              border: step !== 'initial' ? 'none' : '2px solid #3b82f6',
              cursor: step !== 'initial' ? 'pointer' : 'not-allowed',
              opacity: step !== 'initial' ? 1 : 0.85,
              boxShadow: step !== 'initial' ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <RotateCcw size={20} color={step !== 'initial' ? '#ffffff' : '#1e3a8a'} /> Reset Activity
          </button>
        </div>
      </div>

      {/* Right Side: Instructions & Observation Quiz Card */}
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
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          background: '#ffffff', 
          border: '2px solid #2563eb', 
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ color: '#1e3a8a', margin: '0 0 0.75rem 0', fontSize: '1.2rem', fontWeight: 800 }}>
            Instructions
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e40af', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.98rem', lineHeight: '1.6', fontWeight: 600 }}>
            <li style={{ fontWeight: step === 'initial' ? 800 : 600, color: step === 'initial' ? '#ea580c' : '#1e40af' }}>
              Spread iron filings uniformly on the sheet of paper over the magnet.
            </li>
            <li style={{ fontWeight: step === 'scattered' ? 800 : 600, color: step === 'scattered' ? '#ea580c' : '#1e40af' }}>
              Gently tap the paper and observe how the filings orient along field lines.
            </li>
            <li style={{ fontWeight: (step === 'quiz' || step === 'complete') ? 800 : 600, color: (step === 'quiz' || step === 'complete') ? '#ea580c' : '#1e40af' }}>
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
              style={{ 
                padding: '1.25rem 1.5rem', 
                background: '#ffffff', 
                border: '2px solid #2563eb', 
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between' 
              }}
            >
              <div>
                <h4 style={{ color: '#1e3a8a', margin: '0 0 0.6rem 0', fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={22} style={{ color: '#2563eb' }} /> 
                  Observation Question
                </h4>
                <p style={{ margin: '0 0 0.85rem 0', color: '#1e40af', fontSize: '0.98rem', lineHeight: 1.5, fontWeight: 600 }}>
                  Do the iron filings stick uniformly all over the magnet, or do they stick more at specific places?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button
                    onClick={() => handleQuizAnswer('uniformly')}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      background: quizAnswer === 'uniformly' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#f8fafc',
                      borderColor: quizAnswer === 'uniformly' ? '#b91c1c' : '#cbd5e1',
                      borderStyle: 'solid',
                      borderWidth: '2px',
                      color: quizAnswer === 'uniformly' ? '#ffffff' : '#1e293b',
                      boxShadow: quizAnswer === 'uniformly' ? '0 4px 15px rgba(239, 68, 68, 0.4)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>They stick uniformly all over the magnet</span>
                      {quizAnswer === 'uniformly' && <XCircle size={18} color="#ffffff" />}
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizAnswer('middle')}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      background: quizAnswer === 'middle' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#f8fafc',
                      borderColor: quizAnswer === 'middle' ? '#b91c1c' : '#cbd5e1',
                      borderStyle: 'solid',
                      borderWidth: '2px',
                      color: quizAnswer === 'middle' ? '#ffffff' : '#1e293b',
                      boxShadow: quizAnswer === 'middle' ? '0 4px 15px rgba(239, 68, 68, 0.4)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>They stick mostly in the middle</span>
                      {quizAnswer === 'middle' && <XCircle size={18} color="#ffffff" />}
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizAnswer('ends')}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      background: (quizAnswer === 'ends' || step === 'complete') ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f8fafc',
                      borderColor: (quizAnswer === 'ends' || step === 'complete') ? '#047857' : '#cbd5e1',
                      borderStyle: 'solid',
                      borderWidth: '2px',
                      color: (quizAnswer === 'ends' || step === 'complete') ? '#ffffff' : '#1e293b',
                      boxShadow: (quizAnswer === 'ends' || step === 'complete') ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>They stick maximum near the ends</span>
                      {(quizAnswer === 'ends' || step === 'complete') && <CheckCircle size={18} color="#ffffff" />}
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
                      background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 6px 20px rgba(255, 119, 0, 0.4)',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Next Section: Breaking a Magnet <ArrowRight size={20} color="#ffffff" />
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
