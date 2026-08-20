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
            Interactive Board (Fig. 4.2)
          </h3>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
            {step === 'initial' && '✨ Step 1: Click "Sprinkle Filings" to cover the paper with iron filings.'}
            {step === 'scattered' && '🖐️ Step 2: Click directly on the paper board to TAP it once!'}
            {(step === 'tapped' || step === 'quiz' || step === 'complete') && '🧲 Filings have gathered in curved chains near the poles! Answer the observation below.'}
          </p>
        </div>

        {/* Physics Lab Board Canvas */}
        <motion.div 
          onClick={() => {
            if (step === 'scattered' && tapCount === 0) {
              handleTap();
            }
          }}
          animate={isVibrating ? { x: [-6, 6, -4, 4, -2, 2, 0], y: [-4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
          whileTap={(step === 'scattered' && tapCount === 0) ? { scale: 0.98 } : {}}
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
            cursor: (step === 'scattered' && tapCount === 0) ? 'pointer' : 'default',
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

          {/* Magnetic Field Lines Arcs Overlay */}
          {tapCount > 0 && (
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, opacity: 0.65 }}>
              <path d="M 225 175 Q 325 95 425 175" fill="none" stroke="#D97706" strokeWidth="2.5" strokeDasharray="8,5" />
              <path d="M 225 175 Q 325 65 425 175" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="8,5" />
              <path d="M 225 175 Q 325 255 425 175" fill="none" stroke="#D97706" strokeWidth="2.5" strokeDasharray="8,5" />
              <path d="M 225 175 Q 325 285 425 175" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="8,5" />
            </svg>
          )}

          {/* 3D Bar Magnet Component */}
          {shape === 'bar' && (
            <motion.div 
              drag
              dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
              dragElastic={0.1}
              whileGrab={{ scale: 1.06, cursor: 'grabbing' }}
              style={{
                position: 'absolute',
                width: '300px',
                height: '80px',
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
              {/* North Pole */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.8)' }}>
                  N
                </span>
                <div style={{ position: 'absolute', top: 6, left: 10, fontSize: '0.68rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>
                  NORTH
                </div>
              </div>

              {/* Center Metallic Seam */}
              <div style={{
                width: '5px',
                background: '#FFFFFF',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                zIndex: 2
              }} />

              {/* South Pole */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.8)' }}>
                  S
                </span>
                <div style={{ position: 'absolute', top: 6, right: 10, fontSize: '0.68rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>
                  SOUTH
                </div>
              </div>
            </motion.div>
          )}

          {/* Render Scattered / Clustered Iron Filings */}
          {filings.map(f => (
            <div
              key={f.id}
              style={{
                position: 'absolute',
                left: `calc(50% + ${f.x}px)`,
                top: `calc(50% + ${f.y}px)`,
                width: `${f.width}px`,
                height: '3px',
                backgroundColor: f.color,
                borderRadius: '2px',
                transform: `rotate(${f.rotation}deg)`,
                pointerEvents: 'none',
                zIndex: 4,
                boxShadow: tapCount > 0 ? '0 0 3px rgba(30, 41, 59, 0.4)' : 'none'
              }}
            />
          ))}
        </motion.div>

        {/* Action Controls Row under Canvas */}
        <div style={{ width: '100%', display: 'flex', gap: '0.75rem' }}>
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
            {tapCount === 0 ? '2. Tap Paper' : 'Paper Tapped ✓'}
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
            ⚡ LET'S INVESTIGATE
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.5rem', fontWeight: 900, color: '#064E3B' }}>
            Observe Magnetic Poles
          </h3>
          <p style={{ margin: '0 0 0.85rem 0', color: '#334155', fontSize: '0.92rem', lineHeight: 1.55, fontWeight: 600 }}>
            Follow the activity procedure below, then complete the observation.
          </p>

          {/* Activity Procedure / Instructions Card */}
          <div style={{ 
            background: '#F0FDF4', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h4 style={{ color: '#064E3B', margin: 0, fontSize: '0.98rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} color="#047857" /> Activity 4.2 Instructions
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.15rem', color: '#334155', fontSize: '0.88rem', lineHeight: '1.5', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Spread iron filings evenly on a sheet of paper.</li>
              <li>Place a bar magnet over the iron filings.</li>
              <li>Tap the paper sheet gently a few times.</li>
              <li>Observe where filings stick most tightly.</li>
            </ol>
          </div>
        </div>

        {/* Inner Controls / Observation Question Card */}
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
            <AlertCircle size={20} color="#D97706" /> 
            Observation Question
          </h4>
          <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: 1.55, fontWeight: 600 }}>
            Do the iron filings stick uniformly all over the magnet, or do they stick more at specific places?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <button
              onClick={() => handleQuizAnswer('uniformly')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: 800,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: quizAnswer === 'uniformly' ? '#FEE2E2' : '#FFFFFF',
                borderColor: quizAnswer === 'uniformly' ? '#EF4444' : '#CBD5E1',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: quizAnswer === 'uniformly' ? '#991B1B' : '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <span>A) Filings stick uniformly all over the magnet</span>
              {quizAnswer === 'uniformly' && <XCircle size={18} color="#EF4444" />}
            </button>

            <button
              onClick={() => handleQuizAnswer('ends')}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: 800,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: (quizAnswer === 'ends' || step === 'complete') ? '#DCFCE7' : '#FFFFFF',
                borderColor: (quizAnswer === 'ends' || step === 'complete') ? '#16A34A' : '#CBD5E1',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                color: (quizAnswer === 'ends' || step === 'complete') ? '#065F46' : '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <span>B) Most filings cluster at the two ends (Poles)</span>
              {(quizAnswer === 'ends' || step === 'complete') && <CheckCircle size={18} color="#16A34A" />}
            </button>
          </div>

          {/* Feedback Explanation */}
          {quizAnswer === 'uniformly' && (
            <div style={{ fontSize: '0.85rem', color: '#991B1B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={16} /> Incorrect. Look closely — iron filings cluster heavily near the two ends!
            </div>
          )}

          {(quizAnswer === 'ends' || step === 'complete') && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.75rem 0', color: '#065F46', fontSize: '0.88rem', fontWeight: 800 }}>
                Correct! The two ends where attraction is strongest are called <strong>Poles</strong>.
              </p>
              <button 
                onClick={handleNextSection}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.8rem',
                  fontSize: '0.92rem',
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
                Proceed to Stage 2 <ArrowRight size={18} color="#FFFFFF" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
