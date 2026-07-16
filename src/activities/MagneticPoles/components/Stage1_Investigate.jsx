import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, AlertCircle, CheckCircle, Hand, RotateCcw, ArrowRight } from 'lucide-react';

// Generates random filing positions
const generateFilings = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const width = 6 + Math.random() * 18; // Much longer to form continuous strings
    const color = Math.random() > 0.5 ? 'rgba(30, 41, 59, 0.65)' : 'rgba(51, 65, 85, 0.65)'; // Semi-transparent
    return {
      id: i,
      x: Math.random() * 600 - 300, // wider spread to cover whole paper
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
  const [shape, setShape] = useState('bar'); // 'bar', 'horseshoe', or 'ring'

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
      
      let poleNx, poleNy, poleSx, poleSy;

      if (shape === 'ring') {
        // Ring magnet has poles on top/bottom faces. In 2D, field radiates perfectly outward from the center.
        const dist = Math.hypot(nx, ny) || 1;
        const targetRadius = 60; // Outer edge of ring
        
        const targetX = (nx / dist) * targetRadius;
        const targetY = (ny / dist) * targetRadius;
        
        // Strong pull towards the magnet edge to form the thick dark fuzz
        const distFromEdge = Math.abs(dist - targetRadius);
        let pullFactor = Math.pow(Math.E, -distFromEdge / 120) * 0.3;
        if (distFromEdge < 50) {
           pullFactor = Math.max(pullFactor, Math.pow(Math.E, -distFromEdge / 30) * 0.7);
        }
        
        nx = nx + (targetX - nx) * pullFactor;
        ny = ny + (targetY - ny) * pullFactor;

        // Perfectly radial angle
        let angle = Math.atan2(ny, nx) * (180 / Math.PI);
        angle += (Math.random() - 0.5) * 4; // Tiny noise

        nx += (Math.random() - 0.5) * 5;
        ny += (Math.random() - 0.5) * 5;

        // If it got pulled perfectly to 0,0, fix it
        if (nx === 0 && ny === 0) nx = 1;

        return { ...f, x: nx, y: ny, rotation: angle };
      }

      if (shape === 'horseshoe') {
        poleNx = -40; poleNy = 60;
        poleSx = 40; poleSy = 60;
      } else {
        poleNx = -90; poleNy = 0;
        poleSx = 90; poleSy = 0;
      }
      
      const distN = Math.hypot(nx - poleNx, ny - poleNy);
      const distS = Math.hypot(nx - poleSx, ny - poleSy);
      
      const minDist = Math.min(distN, distS);
      const isNorth = distN < distS;
      const targetX = isNorth ? poleNx : poleSx;
      const targetY = isNorth ? poleNy : poleSy;

      // Base pull for continuous strings
      let pullFactor = Math.pow(Math.E, -minDist / 120) * 0.3;
      
      // Increased pull near poles to simulate thick fuzzy clumps (as seen in image)
      if (minDist < 60) {
         pullFactor = Math.max(pullFactor, Math.pow(Math.E, -minDist / 40) * 0.7);
      }
      
      if (shape === 'bar') {
        if (Math.abs(nx) < 90 && Math.abs(ny) < 60) {
           const bodyPull = Math.pow(Math.E, -Math.abs(ny) / 40);
           ny = ny - ny * bodyPull * 0.4;
        }
      } else if (shape === 'horseshoe') {
        if (Math.hypot(nx, ny) < 80) {
           nx = nx * 0.8 + (Math.random() - 0.5) * 5;
           ny = ny * 0.8 + (Math.random() - 0.5) * 5;
        }
      }

      nx = nx + (targetX - nx) * pullFactor;
      ny = ny + (targetY - ny) * pullFactor;

      const dxN = nx - poleNx;
      const dyN = ny - poleNy;
      const dN3 = Math.pow(dxN*dxN + dyN*dyN, 1.5) || 1;
      const bxN = dxN / dN3;
      const byN = dyN / dN3;

      const dxS = nx - poleSx;
      const dyS = ny - poleSy;
      const dS3 = Math.pow(dxS*dxS + dyS*dyS, 1.5) || 1;
      const bxS = -dxS / dS3;
      const byS = -dyS / dS3;

      const bx = bxN + bxS;
      const by = byN + byS;

      // Calculate angle of the B vector
      let angle = Math.atan2(by, bx) * (180 / Math.PI);
      
      // Minimal noise to keep continuous chains
      angle += (Math.random() - 0.5) * 4;

      // Add a tiny bit of spatial noise
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

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => handleShapeChange('bar')}
            className={shape === 'bar' ? 'primary' : 'outline'}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            Bar Magnet
          </button>
          <button 
            onClick={() => handleShapeChange('horseshoe')}
            className={shape === 'horseshoe' ? 'primary' : 'outline'}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            Horseshoe Magnet
          </button>
          <button 
            onClick={() => handleShapeChange('ring')}
            className={shape === 'ring' ? 'primary' : 'outline'}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            Ring Magnet
          </button>
        </div>

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
          {shape === 'bar' && (
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
          )}

          {/* Horseshoe Magnet */}
          {shape === 'horseshoe' && (
            <div style={{
              position: 'absolute', width: '120px', height: '140px',
              border: '25px solid #1e293b', borderBottom: 'none', borderRadius: '60px 60px 0 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10
            }}>
              <div style={{ width: '25px', height: '40px', background: '#ef4444', marginLeft: '-25px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>N</div>
              <div style={{ width: '25px', height: '40px', background: '#3b82f6', marginRight: '-25px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>S</div>
            </div>
          )}

          {/* Ring Magnet (Dark grey ferrite look to match image) */}
          {shape === 'ring' && (
            <div style={{
              position: 'absolute', width: '120px', height: '120px',
              borderRadius: '50%', background: '#334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.4)', zIndex: 10
            }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#f8fafc', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }} />
            </div>
          )}

          {/* Iron Filings (Optimized rendering for 4000 items) */}
          {filings.map(f => (
            <div
              key={f.id}
              style={{
                position: 'absolute',
                width: `${f.width}px`,
                height: '1px',
                background: f.color,
                borderRadius: '1px',
                transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rotation}deg)`,
                opacity: step === 'initial' ? 0 : 1,
                transition: step === 'scattered' ? 'opacity 0.2s' : 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
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
