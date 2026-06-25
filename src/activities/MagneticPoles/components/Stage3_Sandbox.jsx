import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, AlertCircle, CheckCircle, Hand, RotateCcw, Shapes, Flag } from 'lucide-react';

const generateFilings = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 400 - 200,
    y: Math.random() * 200 - 100,
    rotation: Math.random() * 360,
  }));
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
    setFilings(generateFilings(150));
    setStep('scattered');
  };

  const handleTap = () => {
    const clusteredFilings = filings.map(f => {
      let poleX = 0;
      let poleY = 0;
      let isMiddle = Math.random() > 0.9;

      if (shape === 'horseshoe') {
        const isLeft = Math.random() > 0.5;
        poleX = isLeft ? -50 : 50;
        poleY = 60; // Tips of the horseshoe
      } else if (shape === 'ring') {
        // For a ring magnet, poles are often on the faces, so filings stick around the rim or halves.
        // Let's simulate left/right halves as poles for simplicity in 2D
        const isLeft = Math.random() > 0.5;
        poleX = isLeft ? -60 : 60;
        poleY = (Math.random() - 0.5) * 40;
      } else if (shape === 'bar') {
        const isLeft = Math.random() > 0.5;
        poleX = isLeft ? -100 : 100;
        poleY = 0;
      }
      
      const clusterSpreadX = (Math.random() - 0.5) * 40;
      const clusterSpreadY = (Math.random() - 0.5) * 60;

      return {
        ...f,
        x: isMiddle ? (Math.random() - 0.5) * 50 : poleX + clusterSpreadX,
        y: isMiddle ? (Math.random() - 0.5) * 20 : poleY + clusterSpreadY,
        rotation: isMiddle ? f.rotation : (Math.random() * 40 - 20), 
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
            <div style={{
              position: 'absolute', width: '200px', height: '40px', display: 'flex',
              borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', zIndex: 10
            }}>
              <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>N</div>
              <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>S</div>
            </div>
          )}

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

          {shape === 'ring' && (
            <div style={{
              position: 'absolute', width: '120px', height: '120px',
              borderRadius: '50%', background: 'linear-gradient(90deg, #ef4444 50%, #3b82f6 50%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', zIndex: 10
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f8fafc', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
            </div>
          )}

          {filings.map(f => (
            <motion.div
              key={f.id}
              animate={{ x: f.x, y: f.y, rotate: f.rotation }}
              transition={{ type: 'spring', stiffness: 50, damping: 10 }}
              style={{
                position: 'absolute', width: '6px', height: '2px', background: '#1e293b',
                borderRadius: '1px', opacity: 0.8, zIndex: 20
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
