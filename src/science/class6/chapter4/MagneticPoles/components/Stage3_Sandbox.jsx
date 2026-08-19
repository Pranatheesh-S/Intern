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
        poleNx = -40; poleNy = 60;
        poleSx = 40; poleSy = 60;
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
      const targetY = isNorth ? poleSy : poleSy;

      let pullFactor = Math.pow(Math.E, -minDist / (130 - Math.min(newTapCount, 4) * 20)) * (0.25 * newTapCount);
      
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
      angle += (Math.random() - 0.5) * (10 / newTapCount);

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
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center', 
        minWidth: 0,
        height: '100%'
      }}>
        {/* Content Above Activity Canvas */}
        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Sandbox: Magnet Shapes
          </h3>
          <p style={{ margin: 0, color: '#0F766E', fontSize: '1.02rem', fontWeight: 700 }}>
            {step === 'initial' && ' Choose a magnet shape below, then click "Sprinkle Filings".'}
            {step === 'scattered' && '🖐️ Click directly on the paper board to TAP it and reveal magnetic poles!'}
            {(step === 'tapped' || step === 'complete') && '🧲 Filings clustered at the poles! Try switching magnet shapes.'}
          </p>
        </div>

        {/* Shape Selectors */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem' }}>
          <button 
            onClick={() => handleShapeChange('horseshoe')}
            style={{ 
              padding: '0.55rem 1.5rem', 
              fontSize: '0.96rem', 
              fontWeight: 700, 
              borderRadius: '12px',
              background: shape === 'horseshoe' ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
              color: shape === 'horseshoe' ? '#ffffff' : '#0F766E',
              border: shape === 'horseshoe' ? 'none' : '1.5px solid #CCECE7',
              cursor: 'pointer',
              boxShadow: shape === 'horseshoe' ? '0 4px 15px rgba(244, 63, 94, 0.4)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            Horseshoe
          </button>
          <button 
            onClick={() => handleShapeChange('ring')}
            style={{ 
              padding: '0.55rem 1.5rem', 
              fontSize: '0.96rem', 
              fontWeight: 700, 
              borderRadius: '12px',
              background: shape === 'ring' ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
              color: shape === 'ring' ? '#ffffff' : '#0F766E',
              border: shape === 'ring' ? 'none' : '1.5px solid #CCECE7',
              cursor: 'pointer',
              boxShadow: shape === 'ring' ? '0 4px 15px rgba(244, 63, 94, 0.4)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            Ring Magnet
          </button>
          <button 
            onClick={() => handleShapeChange('bar')}
            style={{ 
              padding: '0.55rem 1.5rem', 
              fontSize: '0.96rem', 
              fontWeight: 700, 
              borderRadius: '12px',
              background: shape === 'bar' ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
              color: shape === 'bar' ? '#ffffff' : '#0F766E',
              border: shape === 'bar' ? 'none' : '1.5px solid #CCECE7',
              cursor: 'pointer',
              boxShadow: shape === 'bar' ? '0 4px 15px rgba(244, 63, 94, 0.4)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            Bar Magnet
          </button>
        </div>

        {/* Paper Board Canvas (Direct Click / Tap Interactive with Vibration) */}
        <motion.div 
          onClick={() => {
            if (step === 'scattered' || step === 'tapped') {
              handleTap();
            }
          }}
          animate={isVibrating ? { x: [-5, 5, -4, 4, -2, 2, 0], y: [-3, 3, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
          whileTap={(step === 'scattered' || step === 'tapped') ? { scale: 0.98 } : {}}
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '650px', 
            height: '340px', 
            background: '#FFFFFF',
            border: (step === 'scattered' || step === 'tapped') ? '3px dashed #0D9488' : '2px solid #CBD5E1',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: (step === 'scattered' || step === 'tapped') ? 'pointer' : 'default',
            boxShadow: (step === 'scattered' || step === 'tapped') ? '0 0 25px rgba(13, 148, 136, 0.25), inset 0 0 30px rgba(0,0,0,0.04)' : 'inset 0 0 30px rgba(0,0,0,0.04), 0 8px 25px rgba(0,0,0,0.06)'
          }}
        >
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
                  fontSize: '2.5rem',
                  filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
                  pointerEvents: 'none'
                }}
              >
                🧂
              </motion.div>
            )}
          </AnimatePresence>

          {/* Direct Tap Prompt Banner */}
          {step === 'scattered' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
              style={{
                position: 'absolute',
                top: '12px',
                zIndex: 35,
                background: '#0D9488',
                color: '#FFFFFF',
                padding: '0.4rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(13, 148, 136, 0.4)'
              }}
            >
              <Hand size={18} color="#FFFFFF" /> Click anywhere on the paper board to TAP!
            </motion.div>
          )}

          {shape === 'bar' && (
            <motion.img 
              drag
              dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
              src="/MagneticPoles/horizontal_magnet.png" 
              alt="Bar Magnet"
              style={{
                position: 'absolute',
                width: '280px',
                zIndex: 10,
                cursor: 'grab',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))'
              }}
              whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
            />
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
                zIndex: 10,
                cursor: 'grab',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))'
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
                zIndex: 10,
                cursor: 'grab',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))'
              }}
              whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
            />
          )}

          {/* Render Filings with smooth spring physics */}
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
                height: '2.8px',
                backgroundColor: f.color,
                borderRadius: '1px',
                pointerEvents: 'none',
                zIndex: 20
              }}
            />
          ))}
        </motion.div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={handleScatter} 
            disabled={step !== 'initial' || isSprinkling}
            style={{ 
              padding: '0.85rem 1.6rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px',
              background: step === 'initial' ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
              color: step === 'initial' ? '#ffffff' : '#64748B',
              border: step === 'initial' ? 'none' : '1.5px solid #E2E8F0',
              cursor: step === 'initial' ? 'pointer' : 'not-allowed',
              opacity: step === 'initial' ? 1 : 0.6,
              boxShadow: step === 'initial' ? '0 6px 20px rgba(244, 63, 94, 0.4)' : '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🧪 1. Sprinkle Filings
          </button>
          
          <button 
            onClick={handleTap}
            disabled={step !== 'scattered' || tapCount >= 1}
            style={{ 
              padding: '0.85rem 1.6rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: (step === 'scattered' && tapCount === 0) ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
              color: (step === 'scattered' && tapCount === 0) ? '#ffffff' : '#64748B',
              border: (step === 'scattered' && tapCount === 0) ? 'none' : '1.5px solid #E2E8F0',
              cursor: (step === 'scattered' && tapCount === 0) ? 'pointer' : 'not-allowed',
              opacity: (step === 'scattered' && tapCount === 0) ? 1 : 0.6,
              boxShadow: (step === 'scattered' && tapCount === 0) ? '0 6px 20px rgba(244, 63, 94, 0.4)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Hand size={18} color={(step === 'scattered' && tapCount === 0) ? '#ffffff' : '#64748B'} /> 
            {tapCount === 0 ? '2. Tap Paper' : 'Paper Tapped ✓'}
          </button>
          
          <button 
            onClick={handleReset}
            disabled={step === 'initial'}
            style={{ 
              padding: '0.85rem 1.6rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: '#ffffff',
              color: '#64748B',
              border: '1.5px solid #E2E8F0',
              cursor: step !== 'initial' ? 'pointer' : 'not-allowed',
              opacity: step !== 'initial' ? 1 : 0.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <RotateCcw size={18} color="#64748B" /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Frosted Glacial Teal (Modern Magnetics Lab) Panel */}
      <div style={{ 
        flex: '0.95', 
        background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)',
        border: '1.5px solid #CCECE7',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div>
          {/* Badge Tag & Title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#CCFBF1', border: '1px solid #5EEAD4', color: '#0F766E', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>
            🧲 STAGE 3: MAGNET SHAPES
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#134E4A' }}>
            Poles in Different Magnet Shapes
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#115E59', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            Follow the activity procedure below, then examine the summary.
          </p>

          {/* Activity Procedure / Instructions Card */}
          <div style={{ 
            background: '#FFFFFF', 
            border: '1.5px solid #CCECE7', 
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 4px 14px rgba(15, 118, 110, 0.04)',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h4 style={{ color: '#134E4A', margin: 0, fontSize: '0.98rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} color="#0D9488" /> Stage 3 Instructions
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.15rem', color: '#115E59', fontSize: '0.86rem', lineHeight: '1.45', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Select Horseshoe, Ring, or Bar magnet.</li>
              <li>Sprinkle iron filings on the paper.</li>
              <li>Tap the paper sheet to align iron filings.</li>
              <li>Notice how filings cluster at the 2 poles for every shape.</li>
            </ol>
          </div>
        </div>

        {/* Inner Controls Card (Pure White with #CCECE7 pale seafoam border) */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #CCECE7', 
          borderRadius: '16px',
          padding: '1.15rem',
          boxShadow: '0 4px 14px rgba(15, 118, 110, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <h4 style={{ color: '#134E4A', margin: 0, fontSize: '1.02rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shapes size={20} color="#0D9488" /> 
            Observation Summary
          </h4>
          <p style={{ margin: 0, color: '#115E59', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            If we repeat this activity with magnets of other shapes, do we get the same pole behavior?
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.15rem', color: '#115E59', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem', lineHeight: '1.45', fontWeight: 600 }}>
            <li><strong>Horseshoe Magnet:</strong> Filings cluster at the two ends.</li>
            <li><strong>Ring Magnet:</strong> Filings cluster at opposite faces or ends.</li>
            <li><strong>Bar Magnet:</strong> Filings cluster at the two ends.</li>
          </ul>

          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ margin: '0 0 0.75rem 0', color: '#047857', fontSize: '0.88rem', fontWeight: 600 }}>
              Conclusion: No matter the shape, every magnet has two poles where attraction is strongest.
            </p>
            <button 
              onClick={handleFinish}
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '35px',
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Flag size={18} color="#ffffff" /> Finish Activity & Proceed to Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
