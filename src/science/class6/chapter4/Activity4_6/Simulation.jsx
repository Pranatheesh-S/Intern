import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight, 
  Compass as CompassIcon, 
  CheckCircle2, 
  Sparkles,
  Move,
  RefreshCw
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: "Step 1: Workspace Setup",
    desc: "Take the magnetic compass and bar magnet. Drag the magnet into the central workspace near the compass."
  },
  {
    step: 2,
    title: "Step 2: Observe Earth's Polarity",
    desc: "With the magnet placed at a distance, observe the compass needle pointing naturally towards North (0°)."
  },
  {
    step: 3,
    title: "Step 3: Repulsion Test (Like Poles)",
    desc: "Bring the magnet's North Pole close to the compass North needle. Notice how like poles repel!"
  },
  {
    step: 4,
    title: "Step 4: Attraction Test (Unlike Poles)",
    desc: "Flip the magnet to bring the South Pole near the compass North needle. Notice how unlike poles attract!"
  }
];

export default function Simulation({ onComplete, onNext }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [magnetFlipped, setMagnetFlipped] = useState(false); // false: N on left/top, true: S on left/top
  const [compassAngle, setCompassAngle] = useState(0);
  const [distance, setDistance] = useState(400);
  const [isCompleted, setIsCompleted] = useState(false);

  const containerRef = useRef(null);
  const compassRef = useRef(null);
  const magnetRef = useRef(null);

  // Motion values for magnet drag position
  const magnetX = useMotionValue(220);
  const magnetY = useMotionValue(0);

  // Compute needle deflection based on magnet position and orientation
  const updateCompassPhysics = () => {
    if (!compassRef.current || !magnetRef.current) return;

    const cRect = compassRef.current.getBoundingClientRect();
    const mRect = magnetRef.current.getBoundingClientRect();

    const compassCenter = {
      x: cRect.left + cRect.width / 2,
      y: cRect.top + cRect.height / 2
    };

    const magnetCenter = {
      x: mRect.left + mRect.width / 2,
      y: mRect.top + mRect.height / 2
    };

    const dx = magnetCenter.x - compassCenter.x;
    const dy = magnetCenter.y - compassCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    setDistance(dist);

    // If magnet is far, natural North (0 deg)
    if (dist > 350) {
      setCompassAngle(0);
      return;
    }

    // Angle from compass to magnet
    let angleToMagnet = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    // Magnet field influence
    // If North facing compass: Repels North needle (points opposite: +180 deg)
    // If South facing compass: Attracts North needle (points directly towards magnet)
    let targetAngle = magnetFlipped ? angleToMagnet : angleToMagnet + 180;
    
    // Proportional influence based on distance
    const influence = Math.max(0, Math.min(1, (350 - dist) / 200));
    const finalAngle = targetAngle * influence;

    setCompassAngle(finalAngle);

    // Step progression checks
    if (currentStep === 1 && dist < 300) {
      setCurrentStep(2);
    } else if (currentStep === 2 && dist < 180 && !magnetFlipped) {
      setCurrentStep(3);
    } else if (currentStep === 3 && dist < 180 && magnetFlipped) {
      setCurrentStep(4);
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const handleFlipMagnet = () => {
    setMagnetFlipped(!magnetFlipped);
    if (currentStep === 3 && distance < 200) {
      setCurrentStep(4);
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMagnetFlipped(false);
    setCompassAngle(0);
    setIsCompleted(false);
    magnetX.set(220);
    magnetY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '1rem',
        padding: '0.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Left Column: Activity Step Instructions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1.5px solid #A7F3D0',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(6, 78, 59, 0.08)',
        zIndex: 10
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CompassIcon size={22} color="#D97706" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#064E3B', fontWeight: 900 }}>
              Activity 4.6 Steps
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STEPS.map((s) => {
              const isCurrent = currentStep === s.step;
              const isPast = currentStep > s.step;

              return (
                <div
                  key={s.step}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: '14px',
                    background: isCurrent ? '#FEF3C7' : isPast ? '#ECFDF5' : '#F8FAFC',
                    border: `1.5px solid ${isCurrent ? '#F59E0B' : isPast ? '#10B981' : '#E2E8F0'}`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isCurrent ? '#92400E' : isPast ? '#065F46' : '#64748B' }}>
                      {s.title}
                    </span>
                    {isPast && <CheckCircle2 size={16} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: '#334155', lineHeight: 1.4 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Actions & Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          {isCompleted ? (
            <button
              onClick={onNext}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              Proceed to Concept Check <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <RotateCcw size={14} /> Reset Experiment
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Nautical Sea Workspace */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1.5px solid #A7F3D0',
        background: 'radial-gradient(ellipse at center, #1E3A8A 0%, #0F172A 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 0 8px 32px rgba(6, 78, 59, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Deep Ocean Waves Grid Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        {/* Live Bearing Top Badge */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid #D97706',
          borderRadius: '20px',
          padding: '0.35rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#FCD34D',
          fontSize: '0.8rem',
          fontWeight: 800,
          zIndex: 20
        }}>
          <CompassIcon size={16} color="#F59E0B" />
          BEARING: {Math.round((compassAngle % 360 + 360) % 360)}° {Math.abs(compassAngle) < 15 ? 'NORTH' : ''}
        </div>

        {/* Workspace Central Arena */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* Golden Vintage Brass Compass Display */}
          <div
            ref={compassRef}
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFFBEB 0%, #FEF3C7 65%, #DEB887 100%)',
              border: '12px solid #854D0E',
              boxShadow: '0 0 0 6px #CA8A04, 0 16px 40px rgba(0,0,0,0.6), inset 0 4px 12px rgba(0,0,0,0.3)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
          >
            {/* Compass Cardinal Points */}
            <span style={{ position: 'absolute', top: 10, fontWeight: 900, color: '#B45309', fontSize: '1.2rem' }}>N</span>
            <span style={{ position: 'absolute', right: 14, fontWeight: 900, color: '#1E3A8A', fontSize: '1.1rem' }}>E</span>
            <span style={{ position: 'absolute', bottom: 10, fontWeight: 900, color: '#1E3A8A', fontSize: '1.1rem' }}>S</span>
            <span style={{ position: 'absolute', left: 14, fontWeight: 900, color: '#1E3A8A', fontSize: '1.1rem' }}>W</span>

            {/* Inner Brass Ring */}
            <div style={{
              width: '230px',
              height: '230px',
              borderRadius: '50%',
              border: '2px dashed #B45309',
              position: 'absolute',
              opacity: 0.5
            }} />

            {/* Rotating Needle */}
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              animate={{ rotate: compassAngle }}
              transition={{ type: 'spring', stiffness: 90, damping: 14 }}
            >
              {/* North Needle (Red) */}
              <div style={{
                position: 'absolute',
                top: '26px',
                width: 0,
                height: 0,
                borderLeft: '11px solid transparent',
                borderRight: '11px solid transparent',
                borderBottom: '114px solid #DC2626',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
              }} />

              {/* South Needle (Dark Blue) */}
              <div style={{
                position: 'absolute',
                bottom: '26px',
                width: 0,
                height: 0,
                borderLeft: '11px solid transparent',
                borderRight: '11px solid transparent',
                borderTop: '114px solid #1E293B',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
              }} />

              {/* Center Golden Pin Cap */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FDE047 0%, #D97706 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                border: '2px solid #78350F',
                zIndex: 5
              }} />
            </motion.div>
          </div>

          {/* Interactive 3D Draggable Bar Magnet */}
          <motion.div
            ref={magnetRef}
            drag
            dragConstraints={containerRef}
            style={{
              x: magnetX,
              y: magnetY,
              position: 'absolute',
              cursor: 'grab',
              zIndex: 30
            }}
            onDrag={updateCompassPhysics}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              {/* Magnet Bar Body */}
              <div style={{
                width: '170px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                boxShadow: '0 12px 28px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
                overflow: 'hidden',
                border: '2px solid #334155',
                position: 'relative'
              }}>
                {/* Left Half Pole */}
                <div style={{
                  flex: 1,
                  background: !magnetFlipped ? 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)' : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  letterSpacing: '1px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                }}>
                  {!magnetFlipped ? 'N' : 'S'}
                </div>

                {/* Right Half Pole */}
                <div style={{
                  flex: 1,
                  background: !magnetFlipped ? 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)' : 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  letterSpacing: '1px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                }}>
                  {!magnetFlipped ? 'S' : 'N'}
                </div>
              </div>

              {/* Magnet Floating Controls */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={handleFlipMagnet}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    borderRadius: '8px',
                    border: '1px solid #64748B',
                    background: '#0F172A',
                    color: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  <RefreshCw size={12} /> Flip Poles
                </button>
                <div style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  <Move size={12} /> Drag me
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}