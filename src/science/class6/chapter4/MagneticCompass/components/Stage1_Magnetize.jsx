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
      <div style={{ flex: '1.35', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#134E4A', letterSpacing: '-0.01em' }}>
            Magnetization Process
          </h3>
          <p style={{ margin: 0, color: '#0F766E', fontSize: '1.05rem', fontWeight: 600 }}>
            Drag the magnet across the iron needle, or click Auto Magnetize.
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '550px', 
          height: '280px', 
          background: '#ffffff',
          border: '2px solid #CCECE7',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.03), 0 8px 25px rgba(15, 118, 110, 0.07)',
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
              bottom: '40px',
              width: '380px',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />

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
                      height: '4px',
                      background: f.color,
                      borderRadius: '2px',
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
              style={{ position: 'absolute', bottom: '150px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontWeight: 600 }}
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
                  zIndex: 10,
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
                    filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: '550px', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', color: '#0F766E', fontWeight: 700 }}>
            <span>Strokes: {strokeCount} / {maxStrokes}</span>
            <span>{Math.round((strokeCount / maxStrokes) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#CCECE7', borderRadius: '5px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${(strokeCount / maxStrokes) * 100}%` }}
              style={{ height: '100%', background: isMagnetized ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {!isMagnetized && (
            <button 
              onClick={() => setIsAutoStroking(true)} 
              disabled={isAutoStroking}
              style={{ 
                padding: '0.85rem 1.75rem', 
                fontSize: '1.02rem', 
                fontWeight: 700, 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem',
                background: !isAutoStroking ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
                color: !isAutoStroking ? '#ffffff' : '#64748B',
                border: !isAutoStroking ? 'none' : '1.5px solid #E2E8F0',
                cursor: !isAutoStroking ? 'pointer' : 'not-allowed',
                opacity: !isAutoStroking ? 1 : 0.85,
                boxShadow: !isAutoStroking ? '0 6px 20px rgba(244, 63, 94, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Play size={18} color={!isAutoStroking ? '#ffffff' : '#64748B'} /> {isAutoStroking ? 'Magnetizing...' : 'Auto Magnetize'}
            </button>
          )}

          {isMagnetized && (
            <button 
              onClick={handleTest} 
              disabled={isTesting}
              style={{ 
                padding: '0.85rem 1.75rem', 
                fontSize: '1.02rem', 
                fontWeight: 700, 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem',
                background: !isTesting ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
                color: !isTesting ? '#ffffff' : '#64748B',
                border: !isTesting ? 'none' : '1.5px solid #E2E8F0',
                cursor: !isTesting ? 'pointer' : 'not-allowed',
                opacity: !isTesting ? 1 : 0.85,
                boxShadow: !isTesting ? '0 6px 20px rgba(244, 63, 94, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Beaker size={18} color={!isTesting ? '#ffffff' : '#64748B'} /> {isTesting ? 'Testing...' : 'Test Magnetization'}
            </button>
          )}
          
          <button 
            onClick={handleReset}
            disabled={strokeCount === 0 && !isAutoStroking && !isTesting}
            style={{ 
              padding: '0.85rem 1.75rem', 
              fontSize: '1.02rem', 
              fontWeight: 700, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: '#ffffff',
              color: '#64748B',
              border: '1.5px solid #E2E8F0',
              cursor: (strokeCount > 0 || isAutoStroking || isTesting) ? 'pointer' : 'not-allowed',
              opacity: (strokeCount > 0 || isAutoStroking || isTesting) ? 1 : 0.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <RotateCcw size={18} color="#64748B" /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Frosted Glacial Teal Panel */}
      <div style={{ 
        flex: '0.85', 
        background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)',
        border: '1.5px solid #CCECE7',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.25rem', 
        overflowY: 'auto' 
      }}>
        <div style={{ 
          padding: '1.25rem 1.4rem', 
          background: '#ffffff', 
          border: '1.5px solid #CCECE7', 
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(15, 118, 110, 0.04)'
        }}>
          <h4 style={{ color: '#134E4A', margin: '0 0 0.75rem 0', fontSize: '1.15rem', fontWeight: 800 }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#115E59', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem', lineHeight: '1.6', fontWeight: 600 }}>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#F43F5E' : '#115E59' }}>
              Place the iron sewing needle on a wooden table.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#F43F5E' : '#115E59' }}>
              Keep any one pole of the magnet at one end of the needle. <strong>Drag</strong> the magnet over the needle along its length.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#F43F5E' : '#115E59' }}>
              When it reaches the other end, lift it up. Bring the same pole back to the start. Repeat this at least 5 times.
            </li>
            <li style={{ fontWeight: isMagnetized && !testComplete ? 800 : 600, color: isMagnetized && !testComplete ? '#F43F5E' : '#115E59' }}>
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
                background: '#ffffff', 
                border: '1.5px solid #CCECE7', 
                borderRadius: '16px',
                boxShadow: '0 4px 14px rgba(15, 118, 110, 0.05)'
              }}
            >
              <h4 style={{ color: '#134E4A', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
                <CheckCircle size={22} style={{ color: '#10b981' }} /> 
                Success!
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: '#047857', fontSize: '0.92rem', fontWeight: '700' }}>
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
                  background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)',
                  transition: 'all 0.25s ease'
                }}
              >
                Next Section: Make a Compass <ArrowRight size={20} color="#ffffff" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
