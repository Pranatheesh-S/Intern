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
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #3F3F46',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.01em' }}>
            Sandbox: Magnet Shapes
          </h3>
          <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.92rem', fontWeight: 700 }}>
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
              background: shape === 'horseshoe' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#27272A',
              color: shape === 'horseshoe' ? '#000000' : '#FAFAFA',
              border: shape === 'horseshoe' ? 'none' : '1.5px solid #3F3F46',
              cursor: 'pointer',
              boxShadow: shape === 'horseshoe' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)'
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
              background: shape === 'ring' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#27272A',
              color: shape === 'ring' ? '#000000' : '#FAFAFA',
              border: shape === 'ring' ? 'none' : '1.5px solid #3F3F46',
              cursor: 'pointer',
              boxShadow: shape === 'ring' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)'
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
              background: shape === 'bar' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#27272A',
              color: shape === 'bar' ? '#000000' : '#FAFAFA',
              border: shape === 'bar' ? 'none' : '1.5px solid #3F3F46',
              cursor: 'pointer',
              boxShadow: shape === 'bar' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            Bar Magnet
          </button>
        </div>

        {/* Cinematic Physics Lab Board Canvas */}
        <motion.div 
          onClick={() => {
            if (step === 'scattered' || step === 'tapped') {
              handleTap();
            }
          }}
          animate={isVibrating ? { x: [-6, 6, -4, 4, -2, 2, 0], y: [-4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
          whileTap={(step === 'scattered' || step === 'tapped') ? { scale: 0.98 } : {}}
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: '340px', 
            background: 'radial-gradient(circle at center, #F8FAFC 0%, #E2E8F0 100%)',
            backgroundImage: `
              radial-gradient(circle at center, rgba(250, 204, 21, 0.22) 0%, rgba(226, 232, 240, 0.98) 75%),
              linear-gradient(rgba(217, 119, 6, 0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(217, 119, 6, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 25px 25px, 25px 25px',
            border: '2px solid #FACC15',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: (step === 'scattered' || step === 'tapped') ? 'pointer' : 'default',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)'
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
                  fontSize: '2.8rem',
                  filter: 'drop-shadow(0 8px 18px rgba(250, 204, 21, 0.6))',
                  pointerEvents: 'none'
                }}
              >
                🧂
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cinematic Tapping Energy Shockwave Ripple */}
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
                  border: '3px solid #F59E0B',
                  boxShadow: '0 0 35px #F59E0B, inset 0 0 25px #F59E0B',
                  pointerEvents: 'none',
                  zIndex: 8
                }}
              />
            )}
          </AnimatePresence>

          {/* 3D Cinematic Bar Magnet */}
          {shape === 'bar' && (
            <motion.div 
              drag
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
                boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(245, 158, 11, 0.25)',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.35)',
                background: '#18181B'
              }}
            >
              <div style={{ flex: 1, background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>N</span>
              </div>
              <div style={{ width: '6px', background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)', zIndex: 2 }} />
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
                filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(245, 158, 11, 0.3))'
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
                filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(245, 158, 11, 0.3))'
              }}
              whileGrab={{ cursor: 'grabbing', scale: 1.05 }}
            />
          )}

          {/* Render Filings with smooth spring physics & metallic shine */}
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
                backgroundColor: tapCount > 0 ? '#334155' : '#1E293B',
                boxShadow: tapCount > 0 ? '0 0 3px rgba(255, 255, 255, 0.3)' : 'none',
                borderRadius: '1.5px',
                pointerEvents: 'none',
                zIndex: 15
              }}
            />
          ))}
        </motion.div>

        {/* Action Controls (Equal Big Buttons matching Activity Area Width) */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
          <button 
            onClick={handleScatter} 
            disabled={step !== 'initial' || isSprinkling}
            style={{ 
              flex: 1,
              padding: '0.95rem 1rem', 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              borderRadius: '14px',
              background: step === 'initial' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#27272A',
              color: step === 'initial' ? '#000000' : '#A1A1AA',
              border: step === 'initial' ? 'none' : '1.5px solid #3F3F46',
              cursor: step === 'initial' ? 'pointer' : 'not-allowed',
              opacity: step === 'initial' ? 1 : 0.6,
              boxShadow: step === 'initial' ? '0 6px 20px rgba(245, 158, 11, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
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
              padding: '0.95rem 1rem', 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: (step === 'scattered' && tapCount === 0) ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#27272A',
              color: (step === 'scattered' && tapCount === 0) ? '#000000' : '#A1A1AA',
              border: (step === 'scattered' && tapCount === 0) ? 'none' : '1.5px solid #3F3F46',
              cursor: (step === 'scattered' && tapCount === 0) ? 'pointer' : 'not-allowed',
              opacity: (step === 'scattered' && tapCount === 0) ? 1 : 0.6,
              boxShadow: (step === 'scattered' && tapCount === 0) ? '0 6px 20px rgba(245, 158, 11, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <Hand size={20} color={(step === 'scattered' && tapCount === 0) ? '#000000' : '#A1A1AA'} /> 
            {tapCount === 0 ? '2. Tap Paper' : 'Paper Tapped ✓'}
          </button>
          
          <button 
            onClick={handleReset}
            disabled={step === 'initial'}
            style={{ 
              flex: 1,
              padding: '0.95rem 1rem', 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: '#27272A',
              color: step !== 'initial' ? '#FAFAFA' : '#A1A1AA',
              border: '1.5px solid #3F3F46',
              cursor: step !== 'initial' ? 'pointer' : 'not-allowed',
              opacity: step !== 'initial' ? 1 : 0.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <RotateCcw size={20} color={step !== 'initial' ? '#FAFAFA' : '#A1A1AA'} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Pitch Charcoal Panel */}
      <div style={{ 
        flex: '0.95', 
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid #3F3F46',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div>
          {/* Badge Tag & Title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #F59E0B', color: '#F59E0B', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>
            🧲 STAGE 3: MAGNET SHAPES
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B' }}>
            Poles in Different Magnet Shapes
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#FAFAFA', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            Follow the activity procedure below, then examine the summary.
          </p>

          {/* Activity Procedure / Instructions Card */}
          <div style={{ 
            background: '#27272A', 
            border: '1.5px solid #3F3F46', 
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h4 style={{ color: '#F59E0B', margin: 0, fontSize: '0.98rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} color="#F59E0B" /> Stage 3 Instructions
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.15rem', color: '#A1A1AA', fontSize: '0.86rem', lineHeight: '1.45', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Select a magnet shape (Horseshoe, Ring, or Bar).</li>
              <li>Click "Sprinkle Filings" to scatter iron filings on the paper.</li>
              <li>Click to TAP the paper and observe filings line up at the poles.</li>
              <li>Observe where the magnetic force is concentrated on each shape.</li>
            </ol>
          </div>
        </div>

        {/* Inner Controls Card */}
        <div style={{ 
          background: '#27272A', 
          border: '1.5px solid #3F3F46', 
          borderRadius: '16px',
          padding: '1.15rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <h4 style={{ color: '#F59E0B', margin: 0, fontSize: '1.02rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shapes size={20} color="#F59E0B" /> 
            Observation Summary
          </h4>
          <p style={{ margin: 0, color: '#FAFAFA', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            If we repeat this activity with magnets of other shapes, do we get the same pole behavior?
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.15rem', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem', lineHeight: '1.45', fontWeight: 600 }}>
            <li><strong>Horseshoe Magnet:</strong> Filings cluster at the two ends.</li>
            <li><strong>Ring Magnet:</strong> Filings cluster at opposite faces or ends.</li>
            <li><strong>Bar Magnet:</strong> Filings cluster at the two ends.</li>
          </ul>

          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ margin: '0 0 0.75rem 0', color: '#F59E0B', fontSize: '0.88rem', fontWeight: 600 }}>
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
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#000000',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Flag size={18} color="#000000" /> Finish Activity & Proceed to Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
