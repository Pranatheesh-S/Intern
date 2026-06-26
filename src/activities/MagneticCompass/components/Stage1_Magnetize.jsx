import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnet, CheckCircle, RotateCcw, ArrowRight, Activity, Beaker, MousePointer2 } from 'lucide-react';

export default function Stage1_Magnetize({ onComplete }) {
  const [strokeCount, setStrokeCount] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  
  const maxStrokes = 5;
  const isMagnetized = strokeCount >= maxStrokes;

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
            Manually drag the magnet across the iron needle from left to right.
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
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
          userSelect: 'none',
          WebkitUserSelect: 'none'
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
              const progressRatio = Math.min(strokeCount / maxStrokes, 1);
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

          {/* Steel Pins / Iron Filings (for testing) */}
          <AnimatePresence>
            {isMagnetized && (
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '40px' }}>
                {[...Array(40)].map((_, i) => {
                  const pseudoX = (i * 137) % 300 - 150; // spread from -150 to +150
                  const pseudoY = (i * 93) % 40; // spread from 0 to 40 (on the table)
                  const rot = ((i * 71) % 360) - 180;
                  
                  // Target positions at the poles (needle is ~250px wide, so poles at -110 and +110 relative to center)
                  const isLeftPole = pseudoX < 0;
                  const targetX = isLeftPole ? -110 + ((i*17)%40 - 20) : 110 + ((i*17)%40 - 20);
                  // Needle is at bottom: 70px. Container is at bottom: 20px. Diff is 50px up (y = -50).
                  const targetY = -50 + ((i*23)%20 - 10);
                  const targetRot = isLeftPole ? -90 + ((i*11)%180) : 90 + ((i*11)%180);
                  
                  return (
                    <motion.div
                      key={`pin-${i}`}
                      initial={{ y: pseudoY, x: pseudoX, rotate: rot }}
                      animate={
                        isTesting 
                          ? { y: targetY, x: targetX, rotate: targetRot } 
                          : { y: pseudoY, x: pseudoX, rotate: rot }
                      }
                      transition={{ type: 'spring', stiffness: 50, damping: 10, delay: (i % 10) * 0.02 }}
                      style={{ 
                        position: 'absolute', 
                        left: '50%',
                        bottom: '0',
                        width: '3px', 
                        height: '10px', 
                        background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)', // Light silver to slate
                        borderRadius: '2px', 
                        boxShadow: '0 0 2px rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.9)',
                        marginLeft: '-1.5px'
                      }}
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* Drag Indicator */}
          {!isMagnetized && strokeCount === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.6, x: -50 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              style={{ position: 'absolute', bottom: '150px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}
            >
              <MousePointer2 size={24} /> <span>Drag right</span> <ArrowRight size={18} />
            </motion.div>
          )}

          {/* Bar Magnet */}
          <AnimatePresence>
            {!isTesting && (
              <motion.div
                initial={{ x: -125, y: -60, rotate: 10 }}
                animate={{ x: -125, y: -60, rotate: 10 }}
                drag={!isMagnetized}
                dragSnapToOrigin={true}
                dragElastic={0.1}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 150) {
                    setStrokeCount(prev => Math.min(prev + 1, maxStrokes));
                  }
                }}
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
                  zIndex: 10,
                  cursor: isMagnetized ? 'default' : 'grab'
                }}
                whileTap={{ cursor: 'grabbing', scale: 1.05 }}
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
            <span>Strokes: {strokeCount} / {maxStrokes}</span>
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
          {isMagnetized && (
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
              Keep any one pole of the magnet at one end of the needle. <strong>Drag</strong> the magnet over the needle along its length.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 'bold' : 'normal', color: !isMagnetized ? 'var(--accent-text)' : 'inherit' }}>
              When it reaches the other end, lift it up. Bring the same pole back to the start. Repeat this at least 5 times.
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
