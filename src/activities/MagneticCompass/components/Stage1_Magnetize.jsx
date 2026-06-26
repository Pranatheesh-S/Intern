import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnet, CheckCircle, RotateCcw, ArrowRight, Activity, Beaker } from 'lucide-react';

export default function Stage1_Magnetize({ onComplete }) {
  const [strokeCount, setStrokeCount] = useState(0);
  const [isStroking, setIsStroking] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  
  const maxStrokes = 5;
  const isMagnetized = strokeCount >= maxStrokes;

  const handleStroke = () => {
    if (isStroking || isMagnetized) return;
    setIsStroking(true);
    
    // Animation lasts about 1.5 seconds
    setTimeout(() => {
      setStrokeCount(prev => prev + 1);
      setIsStroking(false);
    }, 1500);
  };

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestComplete(true);
    }, 1000);
  };

  const handleNextSection = () => {
    onComplete();
  };

  const handleReset = () => {
    setStrokeCount(0);
    setIsStroking(false);
    setIsTesting(false);
    setTestComplete(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Magnetization Process</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Rub one pole of the magnet along the iron needle.
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '500px', 
          height: '250px', 
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
          {/* Iron Needle Container */}
          <div style={{
            position: 'absolute',
            bottom: '70px',
            width: '250px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
            zIndex: 2
          }}>
            {/* Needle Body */}
            <div style={{
              flex: 1,
              height: '100%',
              background: 'linear-gradient(to bottom, #f8fafc 0%, #94a3b8 50%, #64748b 100%)',
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '6px'
            }}>
              {/* Needle Eye */}
              <div style={{ width: '12px', height: '4px', background: 'var(--surface)', borderRadius: '2px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }} />
            </div>
            {/* Needle Point */}
            <div style={{
              width: '40px',
              height: '100%',
              background: 'linear-gradient(to bottom, #f8fafc 0%, #94a3b8 50%, #64748b 100%)',
              clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
            }} />
          </div>

          {/* Magnetic domains inside needle */}
          <div style={{
            position: 'absolute',
            bottom: '74px',
            width: '210px',
            height: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            pointerEvents: 'none',
            zIndex: 5
          }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const progressRatio = strokeCount / maxStrokes;
              const initialRot = i % 2 === 0 ? 55 + (i * 5) : -45 - (i * 5);
              const currentRot = initialRot * (1 - progressRatio);
              
              return (
                <motion.div
                  key={i}
                  animate={{ rotate: currentRot }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  style={{ 
                    width: '14px', 
                    height: '6px', 
                    display: 'flex', 
                    borderRadius: '2px', 
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    opacity: 0.9
                  }}
                >
                  <div style={{ flex: 1, background: '#ef4444' }} /> {/* North */}
                  <div style={{ flex: 1, background: '#3b82f6' }} /> {/* South */}
                </motion.div>
              );
            })}
          </div>

          {/* Steel Pins (for testing) */}
          <AnimatePresence>
            {isMagnetized && (
              <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px' }}>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`pin-${i}`}
                    initial={{ y: 0, rotate: (i - 1.5) * 20 }}
                    animate={
                      isTesting 
                        ? { y: -25, rotate: 0, x: (i - 1.5) * -5 } 
                        : { y: 0, rotate: (i - 1.5) * 20 }
                    }
                    transition={{ type: 'spring', stiffness: 60, delay: i * 0.1 }}
                    style={{ width: '2px', height: '12px', background: '#94a3b8', borderRadius: '1px', boxShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Bar Magnet */}
          <AnimatePresence>
            {!isTesting && (
              <motion.div
                initial={{ x: -125, y: -60, rotate: 10 }}
                animate={
                  isStroking 
                  ? [
                      { x: -125, y: -60, rotate: 10 }, // start position
                      { x: -125, y: -10, rotate: 10 }, // move down to touch needle
                      { x: 125, y: -10, rotate: 10 },  // drag across needle
                      { x: 125, y: -80, rotate: 10 },  // lift up
                      { x: -125, y: -80, rotate: 10 }, // return over top
                      { x: -125, y: -60, rotate: 10 }  // back to start
                    ]
                  : { x: -125, y: -60, rotate: 10 }
                }
                transition={isStroking ? { duration: 1.5, times: [0, 0.15, 0.6, 0.75, 0.9, 1], ease: "easeInOut" } : { duration: 0.5 }}
                exit={{ opacity: 0, y: -100 }}
                style={{
                  position: 'absolute',
                  bottom: '70px',
                  width: '30px',
                  height: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  zIndex: 10
                }}
              >
                <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>N</div>
                <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>S</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: '500px', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Magnetization Level</span>
            <span>{Math.round((strokeCount / maxStrokes) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${(strokeCount / maxStrokes) * 100}%` }}
              style={{ height: '100%', background: isMagnetized ? 'var(--success)' : 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {!isMagnetized ? (
            <button 
              onClick={handleStroke} 
              disabled={isStroking}
              className="primary"
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Activity size={18} /> Stroke Needle
            </button>
          ) : (
            <button 
              onClick={handleTest} 
              disabled={isTesting}
              className="primary"
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f59e0b', borderColor: '#f59e0b' }}
            >
              <Beaker size={18} /> {isTesting ? 'Testing...' : 'Test Magnetization'}
            </button>
          )}
          
          <button 
            onClick={handleReset}
            className="outline"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Instructions */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <li style={{ fontWeight: !isMagnetized ? 'bold' : 'normal', color: !isMagnetized ? 'var(--accent-text)' : 'inherit' }}>
              Place the iron sewing needle on a wooden table.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 'bold' : 'normal', color: !isMagnetized ? 'var(--accent-text)' : 'inherit' }}>
              Keep any one pole of the magnet at one end of the needle. Move the magnet over the needle along its length.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 'bold' : 'normal', color: !isMagnetized ? 'var(--accent-text)' : 'inherit' }}>
              When it reaches the other end, lift it up. Bring the same pole back to the start. Repeat this at least 30 to 40 times.
            </li>
            <li style={{ fontWeight: isMagnetized && !testComplete ? 'bold' : 'normal', color: isMagnetized && !testComplete ? 'var(--accent-text)' : 'inherit' }}>
              Bring some iron filings or steel pins near the needle to test if it has become a magnet.
            </li>
          </ol>
        </div>

        <AnimatePresence>
          {testComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: '1.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}
            >
              <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--success)' }} /> 
                Success!
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--success)', fontSize: '0.9rem', fontWeight: '500' }}>
                The steel pins are attracted to the needle! This means the needle has successfully become a magnet.
              </p>
              
              <button 
                onClick={handleNextSection}
                className="primary"
                style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                Next Section: Make a Compass <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
