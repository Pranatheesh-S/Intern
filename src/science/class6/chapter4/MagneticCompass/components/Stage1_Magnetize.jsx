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
    const poleNx = -115; const poleNy = 27;
    const poleSx = 115; const poleSy = 27;

    for (let i = 0; i < 800; i++) { // Rich denses 800 filings field
      // Uniform random initial scatter
      const initX = (Math.random() - 0.5) * 480;
      const initY = (Math.random() - 0.5) * 230;
      const initRot = Math.random() * 360;

      // Start target at random position
      let targetX = (Math.random() - 0.5) * 480;
      let targetY = (Math.random() - 0.5) * 230;

      const distN = Math.hypot(targetX - poleNx, targetY - poleNy);
      const distS = Math.hypot(targetX - poleSx, targetY - poleSy);
      
      // Pull heavily towards the two poles (ends of needle)
      let pullN = Math.exp(-distN / 50) * 0.85;
      let pullS = Math.exp(-distS / 50) * 0.85;
      
      if (distN < 45) pullN += Math.exp(-distN / 18) * 0.9;
      if (distS < 45) pullS += Math.exp(-distS / 18) * 0.9;

      targetX += (poleNx - targetX) * pullN;
      targetY += (poleNy - targetY) * pullN;
      
      targetX += (poleSx - targetX) * pullS;
      targetY += (poleSy - targetY) * pullS;

      // Keep filings slightly offset vertically from exact center axis so needle body stays clear
      if (Math.abs(targetY - poleNy) < 12 && targetX > poleNx + 25 && targetX < poleSx - 25) {
        targetY += (targetY >= poleNy ? 12 : -12);
      }

      // Calculate magnetic field direction at target position
      const dxN = targetX - poleNx;
      const dyN = targetY - poleNy;
      const dN3 = Math.pow(dxN * dxN + dyN * dyN, 1.5) || 1;
      const bxN = dxN / dN3;
      const byN = dyN / dN3;

      const dxS = targetX - poleSx;
      const dyS = targetY - poleSy;
      const dS3 = Math.pow(dxS * dxS + dyS * dyS, 1.5) || 1;
      const bxS = -dxS / dS3;
      const byS = -dyS / dS3;

      const bx = bxN + bxS;
      const by = byN + byS;

      let targetRot = Math.atan2(by, bx) * (180 / Math.PI);
      targetRot += (Math.random() - 0.5) * 12;

      const width = 8 + Math.random() * 12;
      const color = Math.random() > 0.5 ? '#0f172a' : '#1e293b';

      items.push({
        id: i,
        width,
        color,
        initX,
        initY,
        initRot,
        targetX,
        targetY,
        targetRot
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
    <div style={{ 
      padding: '1.25rem 1.75rem', 
      display: 'flex', 
      gap: '1.75rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1.35', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        {/* Top Header Container */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #3F3F46',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.01em' }}>
            Magnetization Process
          </h3>
          <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.92rem', fontWeight: 700 }}>
            Drag the magnet across the iron needle, or click Auto Magnetize.
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '280px', 
          background: 'rgba(18, 18, 20, 0.95)',
          border: '1.5px solid #3F3F46',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}>
          {/* Iron Needle Image (Larger & Thicker) */}
          <img 
            src="/MagneticCompass/magnetic_needle.png" 
            alt="Magnetic Needle"
            draggable="false"
            style={{
              position: 'absolute',
              width: '380px',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />

          {/* Iron Filings (for testing) */}
          <AnimatePresence>
            {isTesting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}
              >
                {filings.map(f => (
                  <motion.div
                    key={f.id}
                    initial={{ x: f.initX, y: f.initY, rotate: f.initRot, opacity: 0.2 }}
                    animate={{ 
                      x: testComplete ? f.targetX : f.initX, 
                      y: testComplete ? f.targetY : f.initY,
                      rotate: testComplete ? f.targetRot : f.initRot,
                      opacity: 1 
                    }}
                    transition={{ type: 'spring', damping: 18, stiffness: 60 }}
                    style={{
                      position: 'absolute',
                      left: 'calc(50% - 2.5px)',
                      top: 'calc(50% - 1.5px)',
                      width: `${f.width}px`,
                      height: '2px',
                      background: testComplete ? '#F59E0B' : '#71717A',
                      boxShadow: testComplete ? '0 0 4px rgba(245, 158, 11, 0.7)' : 'none',
                      borderRadius: '1px'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Bar Magnet */}
          <AnimatePresence>
            {!isMagnetized && (
              <motion.div
                drag={!isAutoStroking}
                dragConstraints={{ left: -220, right: 220, top: -100, bottom: 80 }}
                dragElastic={0.1}
                animate={isAutoStroking ? {
                  x: [-180, 180, -180],
                  y: [-30, -30, -30],
                  rotate: [0, 0, 0]
                } : {}}
                transition={isAutoStroking ? {
                  repeat: maxStrokes - strokeCount - 1,
                  duration: 1.5,
                  ease: 'easeInOut'
                } : { type: 'spring', stiffness: 300, damping: 25 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 150) {
                    setStrokeCount(prev => Math.min(prev + 1, maxStrokes));
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '40px',
                  width: '140px',
                  height: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 20,
                  cursor: isMagnetized ? 'default' : 'grab'
                }}
                whileTap={{ cursor: 'grabbing', scale: 1.05 }}
              >
                <img 
                  src="/Shared/bar_magnet.png" 
                  alt="Bar Magnet"
                  draggable="false"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5))'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', color: '#A1A1AA', fontWeight: 700 }}>
            <span>Strokes: {strokeCount} / {maxStrokes}</span>
            <span style={{ color: '#F59E0B', fontWeight: 800 }}>{Math.round((strokeCount / maxStrokes) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#18181B', border: '1px solid #3F3F46', borderRadius: '5px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${(strokeCount / maxStrokes) * 100}%` }}
              style={{ height: '100%', background: isMagnetized ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
            />
          </div>
        </div>

        {/* Controls (Equal Big Buttons matching 100% width) */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', width: '100%' }}>
          {!isMagnetized && (
            <button 
              onClick={() => setIsAutoStroking(true)} 
              disabled={isAutoStroking}
              style={{ 
                flex: 1,
                padding: '0.85rem 1rem', 
                fontSize: '1rem', 
                fontWeight: 800, 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.6rem',
                background: !isAutoStroking ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#18181B',
                color: !isAutoStroking ? '#000000' : '#71717A',
                border: !isAutoStroking ? 'none' : '1.5px solid #3F3F46',
                cursor: !isAutoStroking ? 'pointer' : 'not-allowed',
                opacity: !isAutoStroking ? 1 : 0.85,
                boxShadow: !isAutoStroking ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none'
              }}
            >
              <Play size={18} color={!isAutoStroking ? '#000000' : '#71717A'} /> {isAutoStroking ? 'Magnetizing...' : 'Auto Magnetize'}
            </button>
          )}

          {isMagnetized && (
            <button 
              onClick={handleTest} 
              disabled={isTesting}
              style={{ 
                flex: 1,
                padding: '0.85rem 1rem', 
                fontSize: '1rem', 
                fontWeight: 800, 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.6rem',
                background: !isTesting ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#18181B',
                color: !isTesting ? '#000000' : '#71717A',
                border: !isTesting ? 'none' : '1.5px solid #3F3F46',
                cursor: !isTesting ? 'pointer' : 'not-allowed',
                opacity: !isTesting ? 1 : 0.85,
                boxShadow: !isTesting ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none'
              }}
            >
              <Beaker size={18} color={!isTesting ? '#000000' : '#71717A'} /> {isTesting ? 'Testing...' : 'Test Magnetization'}
            </button>
          )}
          
          <button 
            onClick={handleReset}
            disabled={strokeCount === 0 && !isAutoStroking && !isTesting}
            style={{ 
              flex: 1,
              padding: '0.85rem 1rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: '#18181B',
              color: (strokeCount > 0 || isAutoStroking || isTesting) ? '#FAFAFA' : '#71717A',
              border: '1.5px solid #3F3F46',
              cursor: (strokeCount > 0 || isAutoStroking || isTesting) ? 'pointer' : 'not-allowed',
              opacity: (strokeCount > 0 || isAutoStroking || isTesting) ? 1 : 0.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            <RotateCcw size={18} color={(strokeCount > 0 || isAutoStroking || isTesting) ? '#FAFAFA' : '#71717A'} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Midnight Carbon Panel */}
      <div style={{ 
        flex: '0.85', 
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid #3F3F46',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.25rem', 
        overflowY: 'auto' 
      }}>
        <div style={{ 
          padding: '1.25rem 1.4rem', 
          background: '#18181B', 
          border: '1.5px solid #3F3F46', 
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}>
          <h4 style={{ color: '#F59E0B', margin: '0 0 0.75rem 0', fontSize: '1.15rem', fontWeight: 800 }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem', lineHeight: '1.6', fontWeight: 600 }}>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#F59E0B' : '#A1A1AA' }}>
              Place the iron sewing needle on a wooden table.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#F59E0B' : '#A1A1AA' }}>
              Keep any one pole of the magnet at one end of the needle. <strong>Drag</strong> the magnet over the needle along its length.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#F59E0B' : '#A1A1AA' }}>
              When it reaches the other end, lift it up. Bring the same pole back to the start. Repeat this at least 5 times.
            </li>
            <li style={{ fontWeight: isMagnetized && !testComplete ? 800 : 600, color: isMagnetized && !testComplete ? '#F59E0B' : '#A1A1AA' }}>
              Bring some iron filings or steel pins near the needle to test if it has become a magnet.
            </li>
          </ol>
        </div>

        <AnimatePresence>
          {testComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                padding: '1.25rem 1.4rem', 
                background: '#18181B', 
                border: '1.5px solid #3F3F46', 
                borderRadius: '16px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
              }}
            >
              <h4 style={{ color: '#86EFAC', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
                <CheckCircle size={22} color="#86EFAC" /> 
                Success!
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: '#A1A1AA', fontSize: '0.92rem', fontWeight: '700' }}>
                The steel pins & iron filings are attracted to the needle! This means the needle has successfully become a magnet.
              </p>
              
              <button 
                onClick={handleNextSection}
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1.6rem', 
                  fontSize: '1.05rem', 
                  fontWeight: 800, 
                  borderRadius: '35px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#000000',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.25s ease'
                }}
              >
                Next Section: Make a Compass <ArrowRight size={20} color="#000000" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
