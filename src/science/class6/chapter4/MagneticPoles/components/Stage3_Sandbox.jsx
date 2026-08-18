import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, RotateCcw, Shapes, CheckCircle, Flag } from 'lucide-react';

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

export default function Stage3_Sandbox({ onComplete }) {
  const [step, setStep] = useState('initial');
  const [filings, setFilings] = useState([]);
  const [shape, setShape] = useState('horseshoe'); // 'horseshoe', 'ring', 'bar'

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

      if (shape === 'horseshoe') {
        poleNx = -40; poleNy = 60;
        poleSx = 40; poleSy = 60;
      } else if (shape === 'ring') {
        poleNx = -60; poleNy = 0;
        poleSx = 60; poleSy = 0;
      } else {
        // bar
        poleNx = -90; poleNy = 0;
        poleSx = 90; poleSy = 0;
      }

      // Pull towards poles
      const distN = Math.hypot(nx - poleNx, ny - poleNy);
      const distS = Math.hypot(nx - poleSx, ny - poleSy);
      
      const minDist = Math.min(distN, distS);
      const isNorth = distN < distS;
      const targetX = isNorth ? poleNx : poleSx;
      const targetY = isNorth ? poleSy : poleSy;

      let pullFactor = Math.pow(Math.E, -minDist / 120) * 0.3;
      
      if (shape === 'bar') {
        if (Math.abs(nx) < 90 && Math.abs(ny) < 60) {
           const bodyPull = Math.pow(Math.E, -Math.abs(ny) / 40);
           ny = ny - ny * bodyPull * 0.4;
        }
      } else {
        if (Math.hypot(nx, ny) < 80) {
           nx = nx * 0.8 + (Math.random() - 0.5) * 5;
           ny = ny * 0.8 + (Math.random() - 0.5) * 5;
        }
      }

      nx = nx + (targetX - nx) * pullFactor;
      ny = ny + (targetY - ny) * pullFactor;

      // Calculate magnetic field vector B
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
  };

  const handleFinish = () => {
    onComplete();
  };

  const handleReset = () => {
    setStep('initial');
    setFilings([]);
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
      {/* Left Side: Interactive Sandbox Area (Enlarged & Centered to fill empty space) */}
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
            Sandbox: Magnet Shapes
          </h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
            Choose a shape, scatter filings, and observe the poles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => handleShapeChange('horseshoe')}
            className={shape === 'horseshoe' ? 'primary' : 'outline'}
            style={{ padding: '0.65rem 1.75rem', fontSize: '1.02rem', fontWeight: 700, borderRadius: '12px' }}
          >
            Horseshoe
          </button>
          <button 
            onClick={() => handleShapeChange('ring')}
            className={shape === 'ring' ? 'primary' : 'outline'}
            style={{ padding: '0.65rem 1.75rem', fontSize: '1.02rem', fontWeight: 700, borderRadius: '12px' }}
          >
            Ring Magnet
          </button>
          <button 
            onClick={() => handleShapeChange('bar')}
            className={shape === 'bar' ? 'primary' : 'outline'}
            style={{ padding: '0.65rem 1.75rem', fontSize: '1.02rem', fontWeight: 700, borderRadius: '12px' }}
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

          {shape === 'horseshoe' && (
            <img 
              src="/MagneticPoles/horseshoe_magnet.png" 
              alt="Horseshoe Magnet"
              style={{
                position: 'absolute',
                width: '200px',
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))'
              }}
            />
          )}

          {shape === 'ring' && (
            <img 
              src="/MagneticPoles/ring_magnet.png" 
              alt="Ring Magnet"
              style={{
                position: 'absolute',
                width: '190px',
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

        {/* Action Controls (Enlarged Action Buttons) */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button 
            onClick={handleScatter} 
            disabled={step !== 'initial'}
            className={step === 'initial' ? 'primary' : 'outline'}
            style={{ padding: '0.9rem 1.75rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: '14px' }}
          >
            1. Scatter Iron Filings
          </button>
          
          <button 
            onClick={handleTap}
            disabled={step !== 'scattered'}
            className={step === 'scattered' ? 'primary' : 'outline'}
            style={{ padding: '0.9rem 1.75rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <Hand size={20} /> 2. Tap Paper
          </button>

          <button 
            onClick={handleReset}
            className="outline"
            style={{ padding: '0.9rem 1.75rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            disabled={step === 'initial'}
          >
            <RotateCcw size={20} /> Reset Activity
          </button>
        </div>
      </div>

      {/* Right Side: Educational Info & Finish Activity Button */}
      <div style={{ 
        flex: '0.85', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        gap: '0.85rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'rgba(15, 23, 42, 0.65)', border: '1.5px solid #3b82f6' }}>
          <h4 style={{ color: '#38bdf8', margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shapes size={20} style={{ color: '#38bdf8' }} /> 
            Other Shapes
          </h4>
          <p style={{ margin: '0 0 0.85rem 0', color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.5' }}>
            If we repeat this activity with magnets of other shapes, do we get the same result?
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
            <li><strong style={{ color: '#ffffff' }}>Horseshoe Magnet:</strong> The poles are located at the two ends.</li>
            <li><strong style={{ color: '#ffffff' }}>Ring Magnet:</strong> The poles are usually on opposite faces or halves.</li>
            <li><strong style={{ color: '#ffffff' }}>Bar Magnet:</strong> The poles are located at the two ends.</li>
          </ul>
        </div>

        <AnimatePresence>
          {step === 'tapped' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: '1.35rem 1.6rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <h4 style={{ color: 'var(--text-heading)', margin: '0 0 0.65rem 0', fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={22} style={{ color: 'var(--success)' }} /> 
                  Observation
                </h4>
                <p style={{ margin: 0, color: 'var(--success)', fontSize: '1.05rem', fontWeight: '600', lineHeight: '1.6' }}>
                  Yes! No matter the shape of the magnet, the iron filings always stick maximally at the regions called poles. The poles are always in pairs.
                </p>
              </div>

              <button 
                onClick={handleFinish}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.6rem',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  borderRadius: '35px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                <Flag size={20} /> Finish Activity
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
