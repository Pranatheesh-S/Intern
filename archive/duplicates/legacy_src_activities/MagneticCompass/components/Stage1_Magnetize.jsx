import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnet, CheckCircle, RotateCcw, ArrowRight, Activity, Beaker, MousePointer2, Play } from 'lucide-react';

export default function Stage1_Magnetize({ onComplete }) {
  const [strokeCount, setStrokeCount] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [isAutoStroking, setIsAutoStroking] = useState(false);
  
  const maxStrokes = 5;
  const isMagnetized = strokeCount >= maxStrokes;

  useEffect(() => {
    let interval;
    if (isAutoStroking && strokeCount < maxStrokes) {
      interval = setInterval(() => {
        setStrokeCount(prev => {
          if (prev + 1 >= maxStrokes) {
            setIsAutoStroking(false);
          }
          return prev + 1;
        });
      }, 1500);
    } else if (strokeCount >= maxStrokes) {
      setIsAutoStroking(false);
    }
    return () => clearInterval(interval);
  }, [isAutoStroking, strokeCount]);

  const filings = useMemo(() => {
    const items = [];
    const poleNx = -110; const poleNy = 47;
    const poleSx = 110; const poleSy = 47;

    for (let i = 0; i < 1500; i++) {
      const width = 4 + Math.random() * 12;
      const color = Math.random() > 0.5 ? 'rgba(30, 41, 59, 0.65)' : 'rgba(51, 65, 85, 0.65)';
      
      const initX = Math.random() * 500 - 250;
      const initY = Math.random() * 45 + 80;
      const initRot = Math.random() * 360;

      let targetX = initX;
      let targetY = initY;

      const distN = Math.hypot(targetX - poleNx, targetY - poleNy);
      const distS = Math.hypot(targetX - poleSx, targetY - poleSy);
      const minDist = Math.min(distN, distS);
      const isNorth = distN < distS;
      const targetPoleX = isNorth ? poleNx : poleSx;
      const targetPoleY = isNorth ? poleNy : poleSy;

      let pullFactor = Math.pow(Math.E, -minDist / 100) * 0.4;
      if (minDist < 60) {
         pullFactor = Math.max(pullFactor, Math.pow(Math.E, -minDist / 30) * 0.8);
      }
      
      if (Math.abs(targetX) < 100 && targetY > 30 && targetY < 65) {
         const bodyPull = Math.pow(Math.E, -Math.abs(targetY - 47) / 20);
         targetY = targetY - (targetY - 47) * bodyPull * 0.6;
      }

      targetX = targetX + (targetPoleX - targetX) * pullFactor;
      targetY = targetY + (targetPoleY - targetY) * pullFactor;

      const dxN = targetX - poleNx;
      const dyN = targetY - poleNy;
      const dN3 = Math.pow(dxN*dxN + dyN*dyN, 1.5) || 1;
      const bxN = dxN / dN3;
      const byN = dyN / dN3;

      const dxS = targetX - poleSx;
      const dyS = targetY - poleSy;
      const dS3 = Math.pow(dxS*dxS + dyS*dyS, 1.5) || 1;
      const bxS = -dxS / dS3;
      const byS = -dyS / dS3;

      const bx = bxN + bxS;
      const by = byN + byS;

      let targetRot = Math.atan2(by, bx) * (180 / Math.PI);
      targetRot += (Math.random() - 0.5) * 4;
      targetX += (Math.random() - 0.5) * 4;
      targetY += (Math.random() - 0.5) * 4;

      items.push({
        id: i,
        width, color,
        initX, initY, initRot,
        targetX, targetY, targetRot
      });
    }
    return items;
  }, []);


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
    setIsAutoStroking(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Magnetization Process</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Drag the magnet across the iron needle, or click Auto Magnetize.
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

          {/* Iron Filings (for testing) */}
          <AnimatePresence>
            {isMagnetized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 3 }}
              >
                {filings.map(f => (
                  <div
                    key={`filing-${f.id}`}
                    style={{
                      position: 'absolute',
                      width: `${f.width}px`,
                      height: '1px',
                      background: f.color,
                      borderRadius: '1px',
                      transform: isTesting 
                        ? `translate(${f.targetX}px, ${f.targetY}px) rotate(${f.targetRot}deg)`
                        : `translate(${f.initX}px, ${f.initY}px) rotate(${f.initRot}deg)`,
                      transition: 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag Indicator */}
          {!isMagnetized && strokeCount === 0 && !isAutoStroking && (
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
                initial={{ x: -125, y: -22, rotate: 10 }}
                animate={isAutoStroking ? {
                  x: [-125, 125, 125, -125, -125],
                  y: [-22, -22, -80, -80, -22],
                  rotate: [10, 10, 10, 10, 10]
                } : { x: -125, y: -22, rotate: 10 }}
                transition={isAutoStroking ? {
                  duration: 1.5,
                  repeat: Infinity,
                  times: [0, 0.4, 0.5, 0.9, 1],
                  ease: "easeInOut"
                } : {}}
                drag={!isMagnetized && !isAutoStroking}
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
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {!isMagnetized && (
            <button 
              onClick={() => setIsAutoStroking(true)} 
              disabled={isAutoStroking}
              className="primary"
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Play size={18} /> {isAutoStroking ? 'Magnetizing...' : 'Auto Magnetize'}
            </button>
          )}

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
