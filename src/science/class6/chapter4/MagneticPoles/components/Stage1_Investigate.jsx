import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Hand, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';

// Generates random filing positions
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

export default function Stage1_Investigate({ onComplete }) {
  const [step, setStep] = useState('initial'); // initial, scattered, tapped, quiz, complete
  const [tapCount, setTapCount] = useState(0);
  const [filings, setFilings] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [shape, setShape] = useState('bar');
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
      
      let poleNx = -100; 
      let poleNy = 0;
      let poleSx = 100; 
      let poleSy = 0;

      const distN = Math.hypot(nx - poleNx, ny - poleNy);
      const distS = Math.hypot(nx - poleSx, ny - poleSy);
      
      const minDist = Math.min(distN, distS);
      const isNorth = distN < distS;
      const targetX = isNorth ? poleNx : poleSx;
      const targetY = isNorth ? poleNy : poleSy;

      let pullFactor = Math.pow(Math.E, -minDist / 110) * 0.35;
      
      if (minDist < 70) {
        pullFactor = Math.max(pullFactor, Math.pow(Math.E, -minDist / 35) * 0.75);
      }
      
      if (Math.abs(nx) < 95 && Math.abs(ny) < 65) {
        const bodyPull = Math.pow(Math.E, -Math.abs(ny) / 35);
        ny = ny - ny * bodyPull * 0.45;
      }

      nx = nx + (targetX - nx) * Math.min(pullFactor, 0.85);
      ny = ny + (targetY - ny) * Math.min(pullFactor, 0.85);

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
      angle += (Math.random() - 0.5) * 10;

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

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
    if (answer === 'ends') {
      setStep('complete');
    }
  };

  const handleNextSection = () => {
    onComplete();
  };

  const handleReset = () => {
    setStep('initial');
    setTapCount(0);
    setFilings([]);
    setQuizAnswer(null);
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
        <div style={{ marginBottom: '0.6rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Interactive Board
          </h3>
          <p style={{ margin: 0, color: '#F43F5E', fontSize: '1.02rem', fontWeight: 700 }}>
            {step === 'initial' && '✨ Step 1: Click "Sprinkle Filings" to cover the paper with iron filings.'}
            {step === 'scattered' && '🖐️ Step 2: Click directly on the paper board to TAP it once!'}
            {(step === 'tapped' || step === 'quiz' || step === 'complete') && '🧲 Filings have gathered in curved chains near the poles! Answer the observation below.'}
          </p>
        </div>

        {/* Paper Board Canvas (Direct Click / Tap Interactive with Vibration) */}
        <motion.div 
          onClick={() => {
            if (step === 'scattered' && tapCount === 0) {
              handleTap();
            }
          }}
          animate={isVibrating ? { x: [-5, 5, -4, 4, -2, 2, 0], y: [-3, 3, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
          whileTap={(step === 'scattered' && tapCount === 0) ? { scale: 0.98 } : {}}
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '650px', 
            height: '350px', 
            background: '#FFFFFF',
            border: (step === 'scattered' && tapCount === 0) ? '3px dashed #F43F5E' : '2px solid #CBD5E1',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: (step === 'scattered' && tapCount === 0) ? 'pointer' : 'default',
            boxShadow: (step === 'scattered' && tapCount === 0) ? '0 0 25px rgba(244, 63, 94, 0.25), inset 0 0 30px rgba(0,0,0,0.04)' : 'inset 0 0 30px rgba(0,0,0,0.04), 0 8px 25px rgba(0,0,0,0.06)'
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

          {/* Magnetic Field Lines Arcs Overlay (Shows when tapped) */}
          {tapCount > 0 && (
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, opacity: 0.45 }}>
              <path d="M 225 175 Q 325 105 425 175" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6,4" />
              <path d="M 225 175 Q 325 75 425 175" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6,4" />
              <path d="M 225 175 Q 325 245 425 175" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6,4" />
              <path d="M 225 175 Q 325 275 425 175" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6,4" />
            </svg>
          )}

          {/* Direct Tap Prompt Banner */}
          {step === 'scattered' && tapCount === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
              style={{
                position: 'absolute',
                top: '12px',
                zIndex: 35,
                background: '#F43F5E',
                color: '#FFFFFF',
                padding: '0.4rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)'
              }}
            >
              <Hand size={18} color="#FFFFFF" /> Click anywhere on the paper board to TAP!
            </motion.div>
          )}

          {/* Bar Magnet */}
          {shape === 'bar' && (
            <motion.img 
              drag
              dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
              dragElastic={0.1}
              src="/MagneticPoles/horizontal_magnet.png" 
              alt="Bar Magnet"
              style={{
                position: 'absolute',
                width: '280px',
                zIndex: 10,
                cursor: 'grab',
                filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.3))'
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
            ⚡ LET'S INVESTIGATE
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#134E4A' }}>
            Observe Magnetic Poles
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#115E59', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            Follow the activity procedure below, then complete the observation.
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
              <BookOpen size={18} color="#0D9488" /> Activity 4.2 Instructions
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.15rem', color: '#115E59', fontSize: '0.86rem', lineHeight: '1.45', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Spread iron filings evenly on a sheet of paper.</li>
              <li>Place a bar magnet over the iron filings.</li>
              <li>Tap the paper sheet gently a few times.</li>
              <li>Observe where filings stick most tightly.</li>
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
            <AlertCircle size={20} color="#0D9488" /> 
            Observation Question
          </h4>
          <p style={{ margin: 0, color: '#115E59', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 600 }}>
            Do the iron filings stick uniformly all over the magnet, or do they stick more at specific places?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <button
              onClick={() => handleQuizAnswer('uniformly')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: quizAnswer === 'uniformly' ? 'rgba(239, 68, 68, 0.1)' : '#F0FDF9',
                borderColor: quizAnswer === 'uniformly' ? '#ef4444' : '#CCECE7',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'uniformly' ? '#991b1b' : '#134E4A'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>They stick uniformly all over the magnet</span>
                {quizAnswer === 'uniformly' && <XCircle size={18} color="#ef4444" />}
              </div>
            </button>

            <button
              onClick={() => handleQuizAnswer('middle')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: quizAnswer === 'middle' ? 'rgba(239, 68, 68, 0.1)' : '#F0FDF9',
                borderColor: quizAnswer === 'middle' ? '#ef4444' : '#CCECE7',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'middle' ? '#991b1b' : '#134E4A'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>They stick mostly in the middle</span>
                {quizAnswer === 'middle' && <XCircle size={18} color="#ef4444" />}
              </div>
            </button>

            <button
              onClick={() => handleQuizAnswer('ends')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: (quizAnswer === 'ends' || step === 'complete') ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF9',
                borderColor: (quizAnswer === 'ends' || step === 'complete') ? '#10b981' : '#CCECE7',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: (quizAnswer === 'ends' || step === 'complete') ? '#065f46' : '#134E4A'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>They stick maximum near the ends</span>
                {(quizAnswer === 'ends' || step === 'complete') && <CheckCircle size={18} color="#10b981" />}
              </div>
            </button>
          </div>

          {(quizAnswer === 'ends' || step === 'complete') && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.75rem 0', color: '#047857', fontSize: '0.88rem', fontWeight: 600 }}>
                Correct! The regions where the maximum iron filings stick are called the <strong>poles</strong> of the magnet.
              </p>
              <button 
                onClick={handleNextSection}
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
                Continue to Stage 2 <ArrowRight size={18} color="#ffffff" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
