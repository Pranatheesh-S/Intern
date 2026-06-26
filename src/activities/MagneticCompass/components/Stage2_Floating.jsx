import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle, RotateCcw, AlertCircle, Flag } from 'lucide-react';

export default function Stage2_Floating({ onComplete }) {
  const [step, setStep] = useState('initial'); // 'initial', 'floating', 'settled'
  const [rotationAngle, setRotationAngle] = useState(0);

  const handlePlaceCork = () => {
    // Random starting rotation
    const initialRotation = (Math.random() > 0.5 ? 1 : -1) * (45 + Math.random() * 90);
    setRotationAngle(initialRotation);
    setStep('floating');

    // After a short delay, let it settle to 0 degrees (North-South)
    setTimeout(() => {
      setRotationAngle(0);
      setTimeout(() => {
        setStep('settled');
      }, 1500); // settling time
    }, 1000);
  };

  const handleFinish = () => {
    onComplete();
  };

  const handleReset = () => {
    setStep('initial');
    setRotationAngle(0);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Floating the Compass</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Place the cork with the magnetized needle into the bowl of water.
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
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}>
          {/* Compass Rose Background */}
          <div style={{ position: 'absolute', opacity: 0.1, pointerEvents: 'none' }}>
            <Compass size={250} />
          </div>

          {/* North/South Labels on the Bowl rim */}
          <div style={{ position: 'absolute', top: '10px', fontWeight: 'bold', color: '#1e293b' }}>N</div>
          <div style={{ position: 'absolute', bottom: '10px', fontWeight: 'bold', color: '#1e293b' }}>S</div>
          <div style={{ position: 'absolute', right: '15px', fontWeight: 'bold', color: '#1e293b' }}>E</div>
          <div style={{ position: 'absolute', left: '15px', fontWeight: 'bold', color: '#1e293b' }}>W</div>

          {/* Water Bowl */}
          <div style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #bae6fd 0%, #38bdf8 100%)',
            border: '4px solid #cbd5e1',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Water ripples animation */}
            {step === 'floating' && (
              <motion.div 
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', border: '2px solid white' }}
              />
            )}

            {/* Cork with Needle */}
            <AnimatePresence>
              {step !== 'initial' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: rotationAngle }}
                  transition={{ 
                    rotate: { type: 'spring', stiffness: 30, damping: 10, mass: 2 },
                    scale: { duration: 0.3 }
                  }}
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#d97706', // Cork color
                    boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Needle */}
                  <div style={{
                    position: 'absolute',
                    width: '6px',
                    height: '140px',
                    background: 'linear-gradient(to bottom, #ef4444 0%, #ef4444 10%, #cbd5e1 50%, #3b82f6 90%, #3b82f6 100%)',
                    borderRadius: '3px',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {/* Needle Eye */}
                    <div style={{ position: 'absolute', top: '5px', left: '2px', width: '2px', height: '6px', background: 'white', borderRadius: '1px' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={handlePlaceCork} 
            disabled={step !== 'initial'}
            className="primary"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Place Cork in Water
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

      {/* Right Side: Instructions */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <li style={{ fontWeight: step === 'initial' ? 'bold' : 'normal', color: step === 'initial' ? 'var(--accent-text)' : 'inherit' }}>
              Insert the magnetized needle through a small piece of cork.
            </li>
            <li style={{ fontWeight: step === 'initial' ? 'bold' : 'normal', color: step === 'initial' ? 'var(--accent-text)' : 'inherit' }}>
              Let the cork float in a glass bowl or tub containing water. Make sure the needle does not touch the water.
            </li>
            <li style={{ fontWeight: step !== 'initial' ? 'bold' : 'normal', color: step !== 'initial' ? 'var(--accent-text)' : 'inherit' }}>
              Observe the direction in which the needle points when the cork stops rotating.
            </li>
          </ol>
        </div>

        <AnimatePresence>
          {step === 'settled' && (
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
              <p style={{ margin: '0 0 1rem 0', color: 'var(--success)', fontSize: '0.9rem', fontWeight: '500' }}>
                The magnetized needle, floating freely in the water, comes to rest pointing in the <strong>North-South</strong> direction, just like a standard magnetic compass!
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
