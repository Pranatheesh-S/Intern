import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, AlertCircle, CheckCircle, Hand, RotateCcw, Shapes, Flag } from 'lucide-react';

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
      const targetY = isNorth ? poleNy : poleSy;

      const pullFactor = Math.pow(Math.E, -minDist / 120) * 0.3;
      
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

      // Physics: Calculate magnetic field vector B
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

      let angle = Math.atan2(by, bx) * (180 / Math.PI);
      angle += (Math.random() - 0.5) * 4; // noise

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
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Sandbox: Magnet Shapes</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Choose a shape, scatter filings, and observe the poles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => handleShapeChange('horseshoe')}
            className={shape === 'horseshoe' ? 'primary' : 'outline'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Horseshoe
          </button>
          <button 
            onClick={() => handleShapeChange('ring')}
            className={shape === 'ring' ? 'primary' : 'outline'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Ring Magnet
          </button>
          <button 
            onClick={() => handleShapeChange('bar')}
            className={shape === 'bar' ? 'primary' : 'outline'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Bar Magnet
          </button>
        </div>

        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '500px', 
          height: '300px', 
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}>
          {shape === 'bar' && (
            <img 
              src="/horizontal_magnet.png" 
              alt="Bar Magnet"
              style={{
                position: 'absolute',
                width: '200px',
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
              }}
            />
          )}

          {shape === 'horseshoe' && (
            <img 
              src="/horse-magnet.png" 
              alt="Horseshoe Magnet"
              style={{
                position: 'absolute', 
                width: '140px', 
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
              }}
            />
          )}

          {shape === 'ring' && (
            <img 
              src="/ring_magnet.png" 
              alt="Ring Magnet"
              style={{
                position: 'absolute', 
                width: '120px', 
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
              }}
            />
          )}

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
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shapes size={20} style={{ color: 'var(--accent)' }} /> 
            Other Shapes
          </h4>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>
            If we repeat this activity with magnets of other shapes, do we get the same result?
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li><strong>Horseshoe Magnet:</strong> The poles are located at the two ends.</li>
            <li><strong>Ring Magnet:</strong> The poles are usually on opposite faces or halves.</li>
          </ul>
        </div>

        <AnimatePresence>
          {step === 'tapped' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: '1.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}
            >
              <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--success)' }} /> 
                Observation
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--success)', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.5' }}>
                Yes! No matter the shape of the magnet, the iron filings always stick maximally at the regions called poles. The poles are always in pairs.
              </p>
              <button 
                onClick={handleFinish}
                className="primary"
                style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#10b981', borderColor: '#10b981' }}
              >
                <Flag size={16} /> Finish Activity
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
