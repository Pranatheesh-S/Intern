import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight, 
  Compass as CompassIcon, 
  CheckCircle2, 
  Sparkles,
  Move,
  Layers,
  Info
} from 'lucide-react';
import ExactCompass from '../components/ExactCompass.jsx';

const getBearingName = (deg) => {
  const norm = ((deg % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) return 'N';
  if (norm >= 22.5 && norm < 67.5) return 'NE';
  if (norm >= 67.5 && norm < 112.5) return 'E';
  if (norm >= 112.5 && norm < 157.5) return 'SE';
  if (norm >= 157.5 && norm < 202.5) return 'S';
  if (norm >= 202.5 && norm < 247.5) return 'SW';
  if (norm >= 247.5 && norm < 292.5) return 'W';
  if (norm >= 292.5 && norm < 337.5) return 'NW';
  return '';
};

const STEPS = [
  {
    step: 1,
    title: "Step 1: Normal Compass",
    desc: "Look at the compass. With no magnets nearby, the red North needle rests pointing straight to North (0°)."
  },
  {
    step: 2,
    title: "Step 2: Drag the 🔴 North Magnet",
    desc: "Drag the 🔴 North Magnet near the compass. Like poles repel, so the red North needle pushes away from it!"
  },
  {
    step: 3,
    title: "Step 3: Drag the 🔵 South Magnet",
    desc: "Drag the 🔵 South Magnet near the compass. Opposite poles attract, so the red North needle pulls directly towards it!"
  },
  {
    step: 4,
    title: "Step 4: Explore Both Magnets",
    desc: "Move both magnets around the compass. Watch the needle find a balance between being pushed by North and pulled by South!"
  }
];

export default function Simulation({ onComplete, onNext }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [compassAngle, setCompassAngle] = useState(0);
  const [northDist, setNorthDist] = useState(400);
  const [southDist, setSouthDist] = useState(400);
  const [testedNorth, setTestedNorth] = useState(false);
  const [testedSouth, setTestedSouth] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const containerRef = useRef(null);
  const workspaceRef = useRef(null);
  const compassRef = useRef(null);
  const northMagnetRef = useRef(null);
  const southMagnetRef = useRef(null);

  // Motion values for separate North Magnet position (starting in right tray)
  const northMagX = useMotionValue(260);
  const northMagY = useMotionValue(-110);

  // Motion values for separate South Magnet position (starting in right tray)
  const southMagX = useMotionValue(260);
  const southMagY = useMotionValue(110);

  // Vector Physics: Compute compass deflection based on live magnet positions
  // Polarity Rules:
  // - North magnet repels North needle tip (pushes it away) and attracts South needle tip (pulls it closer)
  // - South magnet attracts North needle tip (pulls it closer) and repels South needle tip (pushes it away)
  const updateCompassPhysics = () => {
    // Relative coordinates directly from motion values (center of workspace is 0,0)
    const nX = northMagX.get();
    const nY = northMagY.get();
    const sX = southMagX.get();
    const sY = southMagY.get();

    // Constants for Inverse-Square Law Physics:
    // Earth's natural uniform geomagnetic field pointing North (0°: vector (0, -1) in screen space)
    const B_EARTH = 1.0;
    const K_MAGNETIC = 550000; // Strong magnetic coupling constant
    const EPSILON_SQ = 2500;   // Softening parameter to prevent singularity
    const R_MAX = 420;         // Interaction cutoff radius in pixels

    let fx = 0;
    let fy = -B_EARTH; // Start with Earth's natural North vector

    // 1. North Magnet Contribution (Repels North needle, attracts South needle)
    const distN = Math.sqrt(nX * nX + nY * nY);
    setNorthDist(distN);

    if (distN < R_MAX) {
      const windowFalloff = Math.max(0, 1 - distN / R_MAX);
      const forceMag = (K_MAGNETIC / (distN * distN + EPSILON_SQ)) * windowFalloff * windowFalloff;

      // North repels North needle -> force vector points AWAY from North magnet (nX, nY)
      const unitX = -nX / distN;
      const unitY = -nY / distN;

      fx += unitX * forceMag;
      fy += unitY * forceMag;
    }

    // 2. South Magnet Contribution (Attracts North needle, repels South needle)
    const distS = Math.sqrt(sX * sX + sY * sY);
    setSouthDist(distS);

    if (distS < R_MAX) {
      const windowFalloff = Math.max(0, 1 - distS / R_MAX);
      const forceMag = (K_MAGNETIC / (distS * distS + EPSILON_SQ)) * windowFalloff * windowFalloff;

      // South attracts North needle -> force vector points TOWARDS South magnet (sX, sY)
      const unitX = sX / distS;
      const unitY = sY / distS;

      fx += unitX * forceMag;
      fy += unitY * forceMag;
    }

    // Resulting Compass Angle (0 deg = (0, -1) screen up)
    // Angle in radians from -Y axis clockwise: Math.atan2(fx, -fy)
    const targetRad = Math.atan2(fx, -fy);
    const targetDeg = targetRad * (180 / Math.PI);
    setCompassAngle(targetDeg);

    // Step progression checks
    let nTested = testedNorth;
    let sTested = testedSouth;

    if (distN < 260 && !testedNorth) {
      setTestedNorth(true);
      nTested = true;
      if (currentStep === 2 || currentStep === 1) setCurrentStep(3);
    }

    if (distS < 260 && !testedSouth) {
      setTestedSouth(true);
      sTested = true;
      if (currentStep === 3 || currentStep === 2 || currentStep === 1) setCurrentStep(4);
    }

    if (nTested && sTested && !isCompleted) {
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  };

  // Subscribe to live motion values so compass reacts continuously on drag
  useEffect(() => {
    const unsubNX = northMagX.on('change', updateCompassPhysics);
    const unsubNY = northMagY.on('change', updateCompassPhysics);
    const unsubSX = southMagX.on('change', updateCompassPhysics);
    const unsubSY = southMagY.on('change', updateCompassPhysics);

    // Initial evaluation
    updateCompassPhysics();

    return () => {
      unsubNX();
      unsubNY();
      unsubSX();
      unsubSY();
    };
  }, [testedNorth, testedSouth, currentStep, isCompleted]);

  const handleReset = () => {
    setCurrentStep(1);
    setTestedNorth(false);
    setTestedSouth(false);
    setIsCompleted(false);
    northMagX.set(260);
    northMagY.set(-110);
    southMagX.set(260);
    southMagY.set(110);
    setNorthDist(400);
    setSouthDist(400);
    setCompassAngle(0);
  };

  // Realign needle back to normal North and South by returning magnets to home
  const handleRealignCompass = () => {
    northMagX.set(260);
    northMagY.set(-110);
    southMagX.set(260);
    southMagY.set(110);
    setNorthDist(400);
    setSouthDist(400);
    setCompassAngle(0);
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: '1rem',
        padding: '0.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Left Column: Activity Step Instructions */}
      <div className="custom-scroll" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1.5px solid #A7F3D0',
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(6, 78, 59, 0.08)',
        zIndex: 10,
        overflowY: 'auto'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
            <CompassIcon size={24} color="#D97706" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#064E3B', fontWeight: 900 }}>
              Activity 4.6 Steps
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {STEPS.map((s) => {
              const isCurrent = currentStep === s.step;
              const isPast = currentStep > s.step || (s.step === 2 && testedNorth) || (s.step === 3 && testedSouth);

              return (
                <div
                  key={s.step}
                  style={{
                    padding: '0.9rem 1.05rem',
                    borderRadius: '14px',
                    background: isCurrent ? '#FEF3C7' : isPast ? '#ECFDF5' : '#F8FAFC',
                    border: `2px solid ${isCurrent ? '#F59E0B' : isPast ? '#10B981' : '#E2E8F0'}`,
                    boxShadow: isCurrent ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: isCurrent ? '#92400E' : isPast ? '#065F46' : '#475569' }}>
                      {s.title}
                    </span>
                    {isPast && <CheckCircle2 size={18} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Actions & Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.2rem' }}>
          {isCompleted ? (
            <button
              onClick={onNext}
              style={{
                width: '100%',
                padding: '0.95rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
                transition: 'all 0.25s ease'
              }}
            >
              Proceed to Concept Check <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              <RotateCcw size={15} /> Reset Experiment
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Nautical Sea Workspace */}
      <div 
        ref={workspaceRef}
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1.5px solid #A7F3D0',
          background: 'radial-gradient(ellipse at center, #1E3A8A 0%, #0F172A 100%)',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 0 8px 32px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
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
          background: 'rgba(255, 253, 245, 0.95)',
          border: '1.5px solid #EADBB6',
          borderRadius: '16px',
          padding: '0.4rem 0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#78350F', fontSize: '0.85rem', fontWeight: 900 }}>
            <CompassIcon size={17} color="#D97706" />
            <span>BEARING: <strong style={{ color: '#C2410C' }}>{Math.round((compassAngle % 360 + 360) % 360)}°</strong> {getBearingName(compassAngle)}</span>
          </div>
        </div>

        {/* Magnet Tray Legend Info */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(15, 23, 42, 0.88)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          padding: '0.4rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.78rem',
          color: '#E2E8F0',
          fontWeight: 800,
          zIndex: 20
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F87171' }}>
            🔴 North
          </span>
          <span style={{ color: '#64748B' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#60A5FA' }}>
            🔵 South
          </span>
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
          
          {/* Exact Vintage Brass Compass Display (Click center to return needle to normal North & South) */}
          <div
            ref={compassRef}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
          >
            <ExactCompass 
              rotation={compassAngle} 
              size={320} 
              onCenterClick={handleRealignCompass} 
              onClick={handleRealignCompass} 
            />
          </div>

          {/* 🔴 SEPARATE MAGNET 1: NORTH POLE MAGNET (Solid Red with "North") */}
          <motion.div
            ref={northMagnetRef}
            drag
            dragConstraints={workspaceRef}
            dragElastic={0}
            dragMomentum={false}
            style={{
              x: northMagX,
              y: northMagY,
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
              gap: '0.35rem'
            }}>
              {/* Solid Red Magnet Bar Body with "North" */}
              <div style={{
                width: '160px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 28px rgba(0,0,0,0.5), 0 0 20px rgba(239, 68, 68, 0.45)',
                border: '2px solid #FCA5A5',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1.15rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                userSelect: 'none'
              }}>
                North
              </div>

              {/* Drag Prompt */}
              <div style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: '6px',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}>
                <Move size={11} /> Drag North Pole
              </div>
            </div>
          </motion.div>

          {/* 🔵 SEPARATE MAGNET 2: SOUTH POLE MAGNET (Solid Blue with "South") */}
          <motion.div
            ref={southMagnetRef}
            drag
            dragConstraints={workspaceRef}
            dragElastic={0}
            dragMomentum={false}
            style={{
              x: southMagX,
              y: southMagY,
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
              gap: '0.35rem'
            }}>
              {/* Solid Blue Magnet Bar Body with "South" */}
              <div style={{
                width: '160px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 28px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.45)',
                border: '2px solid #93C5FD',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1.15rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                userSelect: 'none'
              }}>
                South
              </div>

              {/* Drag Prompt */}
              <div style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: '6px',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}>
                <Move size={11} /> Drag South Pole
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}