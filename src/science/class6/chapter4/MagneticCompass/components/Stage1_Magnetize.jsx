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

      const width = 4 + Math.random() * 7;
      const color = Math.random() > 0.5 ? '#1e293b' : '#334155';

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
      background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0f172a 100%)',
      border: '1.5px solid #1e40af',
      borderRadius: '20px',
      boxShadow: '0 12px 35px rgba(11, 19, 43, 0.4)'
    }}>
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1.35', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Magnetization Process
          </h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
            Drag the magnet across the iron needle, or click Auto Magnetize.
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '550px', 
          height: '280px', 
          background: '#f8fafc',
          border: '2px solid #cbd5e1',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.05), 0 8px 25px rgba(0,0,0,0.07)',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}>
          {/* Iron Needle Image */}
          <img 
            src="/MagneticCompass/magnetic_needle.png" 
            alt="Magnetic Needle"
            draggable="false"
            style={{
              position: 'absolute',
              bottom: '55px',
              width: '250px',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
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
                      height: '2.8px',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>
            <span>Strokes: {strokeCount} / {maxStrokes}</span>
            <span>{Math.round((strokeCount / maxStrokes) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '5px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${(strokeCount / maxStrokes) * 100}%` }}
              style={{ height: '100%', background: isMagnetized ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' }}
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
                background: !isAutoStroking ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
                color: !isAutoStroking ? '#ffffff' : '#1e3a8a',
                border: !isAutoStroking ? 'none' : '2px solid #3b82f6',
                cursor: !isAutoStroking ? 'pointer' : 'not-allowed',
                opacity: !isAutoStroking ? 1 : 0.85,
                boxShadow: !isAutoStroking ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Play size={18} color={!isAutoStroking ? '#ffffff' : '#1e3a8a'} /> {isAutoStroking ? 'Magnetizing...' : 'Auto Magnetize'}
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
                background: !isTesting ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
                color: !isTesting ? '#ffffff' : '#1e3a8a',
                border: !isTesting ? 'none' : '2px solid #3b82f6',
                cursor: !isTesting ? 'pointer' : 'not-allowed',
                opacity: !isTesting ? 1 : 0.85,
                boxShadow: !isTesting ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Beaker size={18} color={!isTesting ? '#ffffff' : '#1e3a8a'} /> {isTesting ? 'Testing...' : 'Test Magnetization'}
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
              background: (strokeCount > 0 || isAutoStroking || isTesting) ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#ffffff',
              color: (strokeCount > 0 || isAutoStroking || isTesting) ? '#ffffff' : '#1e3a8a',
              border: (strokeCount > 0 || isAutoStroking || isTesting) ? 'none' : '2px solid #3b82f6',
              cursor: (strokeCount > 0 || isAutoStroking || isTesting) ? 'pointer' : 'not-allowed',
              opacity: (strokeCount > 0 || isAutoStroking || isTesting) ? 1 : 0.85,
              boxShadow: (strokeCount > 0 || isAutoStroking || isTesting) ? '0 6px 20px rgba(255, 119, 0, 0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <RotateCcw size={18} color={(strokeCount > 0 || isAutoStroking || isTesting) ? '#ffffff' : '#1e3a8a'} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Instructions */}
      <div style={{ flex: '0.85', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
        <div style={{ 
          padding: '1.35rem 1.6rem', 
          background: '#ffffff', 
          border: '2px solid #2563eb', 
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ color: '#1e3a8a', margin: '0 0 0.75rem 0', fontSize: '1.2rem', fontWeight: 800 }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e40af', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.98rem', lineHeight: '1.6', fontWeight: 600 }}>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#ea580c' : '#1e40af' }}>
              Place the iron sewing needle on a wooden table.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#ea580c' : '#1e40af' }}>
              Keep any one pole of the magnet at one end of the needle. <strong>Drag</strong> the magnet over the needle along its length.
            </li>
            <li style={{ fontWeight: !isMagnetized ? 800 : 600, color: !isMagnetized ? '#ea580c' : '#1e40af' }}>
              When it reaches the other end, lift it up. Bring the same pole back to the start. Repeat this at least 5 times.
            </li>
            <li style={{ fontWeight: isMagnetized && !testComplete ? 800 : 600, color: isMagnetized && !testComplete ? '#ea580c' : '#1e40af' }}>
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
                padding: '1.35rem 1.6rem', 
                background: '#ffffff', 
                border: '2px solid #10b981', 
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}
            >
              <h4 style={{ color: '#1e3a8a', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>
                <CheckCircle size={22} style={{ color: '#10b981' }} /> 
                Success!
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: '#065f46', fontSize: '0.98rem', fontWeight: '700' }}>
                The steel pins are attracted to the needle! This means the needle has successfully become a magnet.
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
                  background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(255, 119, 0, 0.45)',
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
