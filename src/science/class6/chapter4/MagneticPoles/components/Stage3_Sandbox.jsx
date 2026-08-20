import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, RotateCcw, Shapes, CheckCircle, Flag, BookOpen } from 'lucide-react';

const generateFilings = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const width = 6 + Math.random() * 18;
    const color = Math.random() > 0.5 ? 'rgba(30, 41, 59, 0.75)' : 'rgba(15, 23, 42, 0.8)';
    return {
      id: i,
      x: Math.random() * 560 - 280,
      y: Math.random() * 340 - 170,
      rotation: Math.random() * 360,
      width,
      color
    };
  });
};

export default function Stage3_Sandbox({ onComplete }) {
  const [step, setStep] = useState('initial');
  const [tapCount, setTapCount] = useState(0);
  const [filings, setFilings] = useState([]);
  const [shape, setShape] = useState('horseshoe'); // 'horseshoe', 'ring', 'bar'
  const [isSprinkling, setIsSprinkling] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  const handleShapeChange = (newShape) => {
    setShape(newShape);
    handleReset();
  };

  const handleScatter = () => {
    setIsSprinkling(true);
    setFilings([]);
    setTimeout(() => {
      setFilings(generateFilings(2200));
      setIsSprinkling(false);
      setStep('scattered');
    }, 900);
  };

  const handleTap = () => {
    if (tapCount >= 1) return;
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 350);

    setTapCount(1);

    const clusteredFilings = filings.map(f => {
      let nx = f.x;
      let ny = f.y;
      
      let poleNx, poleNy, poleSx, poleSy;

      if (shape === 'horseshoe') {
        poleNx = -45; poleNy = 45;
        poleSx = 45; poleSy = 45;
      } else if (shape === 'ring') {
        poleNx = -60; poleNy = 0;
        poleSx = 60; poleSy = 0;
      } else {
        // bar
        poleNx = -100; poleNy = 0;
        poleSx = 100; poleSy = 0;
      }

      // Pull towards poles
      const distN = Math.hypot(nx - poleNx, ny - poleNy);
      const distS = Math.hypot(nx - poleSx, ny - poleSy);
      
      const minDist = Math.min(distN, distS);
      const isNorth = distN < distS;
      const targetX = isNorth ? poleNx : poleSx;
      const targetY = isNorth ? poleNy : poleSy;

      let pullFactor = Math.pow(Math.E, -minDist / 90) * 0.75;
      
      if (shape === 'bar') {
        if (Math.abs(nx) < 95 && Math.abs(ny) < 65) {
           const bodyPull = Math.pow(Math.E, -Math.abs(ny) / 35);
           ny = ny - ny * bodyPull * 0.45;
        }
      } else {
        if (Math.hypot(nx, ny) < 80) {
           nx = nx * 0.8 + (Math.random() - 0.5) * 5;
           ny = ny * 0.8 + (Math.random() - 0.5) * 5;
        }
      }

      nx = nx + (targetX - nx) * Math.min(pullFactor, 0.85);
      ny = ny + (targetY - ny) * Math.min(pullFactor, 0.85);

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
      angle += (Math.random() - 0.5) * 8;

      nx += (Math.random() - 0.5) * 4;
      ny += (Math.random() - 0.5) * 4;

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
    setTapCount(0);
    setFilings([]);
    setIsSprinkling(false);
  };

  return (
    <div style={{ 
      padding: '0.5rem', 
      display: 'flex', 
      gap: '1.25rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box'
    }}>
      {/* Left Side: Activity Interactive Area */}
      <div style={{ 
        flex: '1.35', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        textAlign: 'center', 
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Content Above Activity Canvas (Left Top Bar) */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.06)',
          boxSizing: 'border-box',
          marginBottom: '0.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
            Sandbox: Magnet Shapes
          </h3>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
            {step === 'initial' && '✨ Choose a magnet shape below, then click "Sprinkle Filings".'}
            {step === 'scattered' && '🖐️ Click directly on the paper board to TAP it and reveal magnetic poles!'}
            {(step === 'tapped' || step === 'complete') && '🧲 Filings clustered at the poles! Try switching magnet shapes.'}
          </p>
        </div>

        {/* Physics Lab Board Canvas */}
        <motion.div 
          onClick={() => {
            if ((step === 'scattered' || step === 'tapped') && tapCount === 0) {
              handleTap();
            }
          }}
          animate={isVibrating ? { x: [-6, 6, -4, 4, -2, 2, 0], y: [-4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
          whileTap={(step === 'scattered' || step === 'tapped') ? { scale: 0.98 } : {}}
          style={{ 
            position: 'relative', 
            width: '100%', 
            flex: 1,
            minHeight: '380px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: (step === 'scattered' || step === 'tapped') ? 'pointer' : 'default',
            border: '1.5px solid #A7F3D0',
            boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)'
          }}
        >
          {/* Finding Directions Physics Lab Background Image */}
          <img 
            src="/SuspendedMagnet/wooden_stand_lab_bg.jpg" 
            alt="Physics Lab Background" 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'brightness(1.05) contrast(0.95)',
              zIndex: 1 
            }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.25)', zIndex: 1, pointerEvents: 'none' }} />

          {/* Transparent White Sheet of Paper matching Iron Filings area width (560px x 340px) */}
          <div style={{
            position: 'absolute',
            width: '560px',
            maxWidth: '92%',
            height: '340px',
            maxHeight: '86%',
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(3px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12), inset 0 0 20px rgba(255, 255, 255, 0.6)',
            zIndex: 2,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: '8px 12px'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.75 }}>
              📄 White Paper Sheet
            </span>
          </div>

          {/* Animated Shaker Tool Pouring Filings */}
          <AnimatePresence>
            {isSprinkling && (
              <motion.div
                initial={{ opacity: 0, x: -180, y: -80, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  x: [-180, 0, 180], 
                  y: [-80, -90, -80], 
                  rotate: [-15, 25, -15, 25] 
                }}
                transition={{ duration: 0.9 }}
                style={{
                  position: 'absolute',
                  zIndex: 50,
                  fontSize: '2.8rem',
                  filter: 'drop-shadow(0 8px 18px rgba(217, 119, 6, 0.4))',
                  pointerEvents: 'none'
                }}
              >
                🧂
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tapping Energy Shockwave Ripple */}
          <AnimatePresence>
            {isVibrating && (
              <motion.div
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 2.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: '220px',
                  height: '220px',
                  borderRadius: '50%',
                  border: '3px solid #D97706',
                  boxShadow: '0 0 35px #D97706, inset 0 0 25px #D97706',
                  pointerEvents: 'none',
                  zIndex: 8
                }}
              />
            )}
          </AnimatePresence>

          {/* 3D Bar Magnet */}
          {shape === 'bar' && (
            <motion.div
              dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
              dragElastic={0.1}
              whileGrab={{ scale: 1.06, cursor: 'grabbing' }}
              style={{
                position: 'absolute',
                width: '290px',
                height: '75px',
                borderRadius: '12px',
                display: 'flex',
                zIndex: 30,
                cursor: 'grab',
                boxShadow: '0 20px 40px rgba(0,0,0,0.35), 0 0 25px rgba(245, 158, 11, 0.35)',
                overflow: 'hidden',
                border: '2.5px solid #FFFFFF',
                background: '#18181B'
              }}
            >
              <div style={{ flex: 1, background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>N</span>
              </div>
              <div style={{ width: '5px', background: '#FFFFFF', zIndex: 2 }} />
              <div style={{ flex: 1, background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>S</span>
              </div>
            </motion.div>
          )}

          {shape === 'horseshoe' && (
            <motion.img 
              drag
              dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
              src="/horse-magnet.png" 
              alt="Horseshoe Magnet"
              style={{
                position: 'absolute',
                width: '200px',
                zIndex: 30,
                cursor: 'grab',
                filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.4))'
              }}
              whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
            />
          )}

          {shape === 'ring' && (
            <motion.img 
              drag
              dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
              src="/MagneticPoles/ring_magnet.png" 
              alt="Ring Magnet"
              style={{
                position: 'absolute',
                width: '180px',
                zIndex: 30,
                cursor: 'grab',
                filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.4))'
              }}
              whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
            />
          )}

          {/* Render Filings */}
          {filings.map((f) => (
            <motion.div
              key={f.id}
              animate={{
                x: f.x,
                y: f.y,
                rotate: f.rotation
              }}
              transition={{ type: 'spring', damping: 18, stiffness: 120 }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: `${f.width}px`,
                height: '3px',
                backgroundColor: f.color,
                borderRadius: '1.5px',
                pointerEvents: 'none',
                zIndex: 15
              }}
            />
          ))}
        </motion.div>

        {/* Action Controls Row under Canvas */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
          <button 
            onClick={handleScatter} 
            disabled={step !== 'initial' || isSprinkling}
            style={{ 
              flex: 1,
              padding: '0.85rem 1rem', 
              fontSize: '0.95rem', 
              fontWeight: 900, 
              borderRadius: '14px',
              background: step === 'initial' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
              color: step === 'initial' ? '#FFFFFF' : '#94A3B8',
              border: step === 'initial' ? 'none' : '1.5px solid #CBD5E1',
              cursor: step === 'initial' ? 'pointer' : 'not-allowed',
              opacity: step === 'initial' ? 1 : 0.6,
              boxShadow: step === 'initial' ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            🧪 1. Sprinkle Filings
          </button>
          
          <button 
            onClick={handleTap}
            disabled={step !== 'scattered' || tapCount >= 1}
            style={{ 
              flex: 1,
              padding: '0.85rem 1rem', 
              fontSize: '0.95rem', 
              fontWeight: 900, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: (step === 'scattered' && tapCount === 0) ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
              color: (step === 'scattered' && tapCount === 0) ? '#FFFFFF' : '#94A3B8',
              border: (step === 'scattered' && tapCount === 0) ? 'none' : '1.5px solid #CBD5E1',
              cursor: (step === 'scattered' && tapCount === 0) ? 'pointer' : 'not-allowed',
              opacity: (step === 'scattered' && tapCount === 0) ? 1 : 0.6,
              boxShadow: (step === 'scattered' && tapCount === 0) ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
            }}
          >
            <Hand size={20} color={(step === 'scattered' && tapCount === 0) ? '#FFFFFF' : '#94A3B8'} /> 
            {tapCount === 0 ? '2. Tap Board' : 'Board Tapped ✓'}
          </button>
          
          <button 
            onClick={handleReset}
            disabled={step === 'initial'}
            style={{ 
              flex: 1,
              padding: '0.85rem 1rem', 
              fontSize: '0.95rem', 
              fontWeight: 900, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: '#FFFFFF',
              color: step !== 'initial' ? '#1E293B' : '#94A3B8',
              border: '1.5px solid #CBD5E1',
              cursor: step !== 'initial' ? 'pointer' : 'not-allowed',
              opacity: step !== 'initial' ? 1 : 0.6,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <RotateCcw size={20} color={step !== 'initial' ? '#1E293B' : '#94A3B8'} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Control Panel (Activity 4.3 Reference Theme) */}
      <div style={{ 
        flex: '0.95', 
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div>
          {/* Badge Tag & Title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#D1FAE5', color: '#047857', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
            🧲 STAGE 3: MAGNET SHAPES
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.5rem', fontWeight: 900, color: '#064E3B' }}>
            Poles in Different Magnets
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#334155', fontSize: '0.92rem', lineHeight: 1.55, fontWeight: 600 }}>
            Select different magnet shapes to verify that poles exist in all magnets!
          </p>

          {/* Magnet Shape Selector Card */}
          <div style={{ 
            background: '#F0FDF4', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h4 style={{ color: '#064E3B', margin: 0, fontSize: '0.98rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shapes size={18} color="#047857" /> Choose Magnet Shape
            </h4>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleShapeChange('horseshoe')}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: shape === 'horseshoe' ? '#16A34A' : '#CBD5E1',
                  background: shape === 'horseshoe' ? '#DCFCE7' : '#FFFFFF',
                  color: shape === 'horseshoe' ? '#065F46' : '#1E293B',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Horseshoe 🧲
              </button>

              <button
                onClick={() => handleShapeChange('ring')}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: shape === 'ring' ? '#16A34A' : '#CBD5E1',
                  background: shape === 'ring' ? '#DCFCE7' : '#FFFFFF',
                  color: shape === 'ring' ? '#065F46' : '#1E293B',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Ring ⭕
              </button>

              <button
                onClick={() => handleShapeChange('bar')}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: shape === 'bar' ? '#16A34A' : '#CBD5E1',
                  background: shape === 'bar' ? '#DCFCE7' : '#FFFFFF',
                  color: shape === 'bar' ? '#065F46' : '#1E293B',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Bar 🔲
              </button>
            </div>
          </div>
        </div>

        {/* Observation Summary Card */}
        <div style={{ 
          background: '#F0FDF4', 
          border: '1.5px solid #A7F3D0', 
          borderRadius: '16px',
          padding: '1.15rem',
          boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <h4 style={{ color: '#064E3B', margin: 0, fontSize: '1.02rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shapes size={20} color="#D97706" /> 
            Observation Summary
          </h4>
          <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: 1.55, fontWeight: 600 }}>
            If we repeat this activity with magnets of other shapes, do we get the same pole behavior?
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.15rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', lineHeight: '1.5', fontWeight: 600 }}>
            <li><strong>Horseshoe Magnet:</strong> Filings cluster at the two ends.</li>
            <li><strong>Ring Magnet:</strong> Filings cluster at opposite faces/poles.</li>
            <li><strong>Bar Magnet:</strong> Filings cluster at the two ends.</li>
          </ul>

          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ margin: '0 0 0.75rem 0', color: '#065F46', fontSize: '0.88rem', fontWeight: 800 }}>
              Conclusion: No matter the shape, every magnet has two poles where attraction is strongest.
            </p>
            <button 
              onClick={() => { if (onComplete) onComplete(); }}
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Flag size={18} color="#FFFFFF" /> Finish Activity & Proceed to Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
