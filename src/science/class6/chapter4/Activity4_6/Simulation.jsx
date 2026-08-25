import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight, 
  Compass as CompassIcon, 
  CheckCircle2, 
  Sparkles,
  Move,
  Maximize2,
  Minimize2,
  RefreshCw,
  Play,
  Pause,
  Navigation
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
    desc: "With no magnets nearby, the compass aligns with Earth's magnetic field and the red needle points North (0°)."
  },
  {
    step: 2,
    title: "Step 2: Combined Bar Magnet at West",
    desc: "Place the magnet at West. Notice how the closer pole strongly influences the needle (repels like pole, attracts opposite pole)."
  },
  {
    step: 3,
    title: "Step 3: Orbit from West → North → East → South",
    desc: "As the magnet orbits and rotates around the compass, the needle continuously turns to track the magnetic field."
  },
  {
    step: 4,
    title: "Step 4: Flip Magnet Polarity",
    desc: "Click 'Flip Magnet' to reverse the poles (N ↔ S). Watch the compass needle completely reverse its attraction and repulsion!"
  }
];

// Web Audio API Sound Synthesizer for Magnetic Clicks & Whoosh
function playMagneticSound(type = 'snap') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    if (type === 'snap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'whoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {}
}

export default function Simulation({ onComplete, onNext }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [compassAngle, setCompassAngle] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false); // false: Left=S, Right=N; true: Left=N, Right=S
  const [magnetRotation, setMagnetRotation] = useState(0); // in degrees
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [currentStation, setCurrentStation] = useState('west'); // 'west', 'north', 'east', 'south', 'custom'
  const [activeInteraction, setActiveInteraction] = useState('Repelling'); // 'Repelling' | 'Attracting'
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Trajectory exploration tracker
  const [testedOrbit, setTestedOrbit] = useState(false);
  const [testedFlip, setTestedFlip] = useState(false);

  const containerRef = useRef(null);
  const workspaceRef = useRef(null);
  const orbitAnimRef = useRef(null);

  // Motion values for combined Bar Magnet position (center of workspace is 0,0)
  const magX = useMotionValue(-230);
  const magY = useMotionValue(0);

  // Fullscreen Handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Fullscreen request failed: ${err.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // -------------------------------------------------------------------
  // Vector Physics: Inverse-Square Law Magnetic Interaction
  // -------------------------------------------------------------------
  const updateCompassPhysics = useCallback(() => {
    const x = magX.get();
    const y = magY.get();
    const rad = (magnetRotation * Math.PI) / 180;

    // Bar magnet length is 160px, half-span of each pole is 46px from center
    const POLE_OFFSET = 46;
    const p1X = x + POLE_OFFSET * Math.cos(rad);
    const p1Y = y + POLE_OFFSET * Math.sin(rad);
    const p2X = x - POLE_OFFSET * Math.cos(rad);
    const p2Y = y - POLE_OFFSET * Math.sin(rad);

    // If not flipped: Pole 1 (Right) is North, Pole 2 (Left) is South
    // If flipped:     Pole 1 (Right) is South, Pole 2 (Left) is North
    const nX = isFlipped ? p2X : p1X;
    const nY = isFlipped ? p2Y : p1Y;
    const sX = isFlipped ? p1X : p2X;
    const sY = isFlipped ? p1Y : p2Y;

    // Physical Constants:
    const B_EARTH = 1.0;       // Earth's natural geomagnetic North field (0, -1)
    const K_MAGNETIC = 650000; // Strong bar magnet dipole moment
    const EPSILON_SQ = 2400;   // Softening constant
    const R_MAX = 520;         // Influence boundary

    let fx = 0;
    let fy = -B_EARTH;

    // 1. North Pole Force on Compass Red North Needle (Repels North needle tip)
    const distN = Math.sqrt(nX * nX + nY * nY);
    if (distN < R_MAX) {
      const falloff = Math.max(0, 1 - distN / R_MAX);
      const forceN = (K_MAGNETIC / (distN * distN + EPSILON_SQ)) * falloff * falloff;
      // Repel North needle -> force points AWAY from North pole (nX, nY)
      fx += (-nX / distN) * forceN;
      fy += (-nY / distN) * forceN;
    }

    // 2. South Pole Force on Compass Red North Needle (Attracts North needle tip)
    const distS = Math.sqrt(sX * sX + sY * sY);
    if (distS < R_MAX) {
      const falloff = Math.max(0, 1 - distS / R_MAX);
      const forceS = (K_MAGNETIC / (distS * distS + EPSILON_SQ)) * falloff * falloff;
      // Attract North needle -> force points TOWARDS South pole (sX, sY)
      fx += (sX / distS) * forceS;
      fy += (sY / distS) * forceS;
    }

    // Resulting Compass Angle (0° = (0, -1) North / Top)
    const targetRad = Math.atan2(fx, -fy);
    const targetDeg = targetRad * (180 / Math.PI);
    setCompassAngle(targetDeg);

    // Active interaction indicator for pedagogical clarity
    const closestIsNorth = distN < distS;
    setActiveInteraction(closestIsNorth ? '🔴 North Repelling' : '🔵 South Attracting');

    // Progression triggers
    if (Math.hypot(x, y) < 320 && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [isFlipped, magnetRotation, currentStep]);

  // Subscribe to live motion values
  useEffect(() => {
    const unsubX = magX.on('change', updateCompassPhysics);
    const unsubY = magY.on('change', updateCompassPhysics);
    updateCompassPhysics();
    return () => {
      unsubX();
      unsubY();
    };
  }, [magX, magY, updateCompassPhysics]);

  // -------------------------------------------------------------------
  // Automated Smooth Orbital Tour: West → North → East → South → West
  // -------------------------------------------------------------------
  const startOrbitalSequence = useCallback((options = {}) => {
    if (orbitAnimRef.current) {
      cancelAnimationFrame(orbitAnimRef.current);
    }

    setIsOrbiting(true);
    playMagneticSound('whoosh');

    const R = 230; // Orbital orbit radius around compass
    const DURATION = 7000; // 7 seconds full orbit
    const startTime = performance.now();

    // Start angle is 180° (West). It sweeps clockwise: 180° (West) -> 90° (North) -> 0° (East) -> -90° (South) -> -180° (West)
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      // Smooth easeInOut curve
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Angle phi from π (West) to -π (West, full 360 loop)
      const phi = Math.PI - ease * 2 * Math.PI;

      // Position: (-Y is up in screen coordinates)
      const curX = R * Math.cos(phi);
      const curY = -R * Math.sin(phi);

      // Magnet rotation: Keep the inner pole facing directly towards compass center (0,0)
      // At West (phi = π): rotation = 0° (right pole points East towards center)
      // At North (phi = π/2): rotation = 90° (right pole points South towards center)
      // At East (phi = 0): rotation = 180° (right pole points West towards center)
      // At South (phi = -π/2): rotation = 270° (right pole points North towards center)
      const phiDeg = (phi * 180) / Math.PI;
      const rot = (180 - phiDeg + 360) % 360;

      magX.set(curX);
      magY.set(curY);
      setMagnetRotation(rot);

      // Update current station label
      if (progress < 0.22) setCurrentStation('west');
      else if (progress < 0.48) setCurrentStation('north');
      else if (progress < 0.73) setCurrentStation('east');
      else if (progress < 0.95) setCurrentStation('south');
      else setCurrentStation('west');

      if (progress < 1) {
        orbitAnimRef.current = requestAnimationFrame(animate);
      } else {
        setIsOrbiting(false);
        setCurrentStation('west');
        setTestedOrbit(true);
        if (currentStep < 4) setCurrentStep(4);
        if (options.onFinish) options.onFinish();
      }
    };

    orbitAnimRef.current = requestAnimationFrame(animate);
  }, [magX, magY, currentStep]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    };
  }, []);

  // -------------------------------------------------------------------
  // Flip Magnet & Auto-Tour Action
  // -------------------------------------------------------------------
  const handleFlipMagnet = () => {
    playMagneticSound('snap');
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    setTestedFlip(true);

    if (currentStep <= 3) {
      setCurrentStep(4);
    }
    if (!isCompleted) {
      setIsCompleted(true);
      if (onComplete) onComplete();
    }

    // Automatically place magnet at West and execute orbital sequence
    startOrbitalSequence();
  };

  // -------------------------------------------------------------------
  // Jump to Cardinal Station (West, North, East, South)
  // -------------------------------------------------------------------
  const jumpToStation = (station) => {
    if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    setIsOrbiting(false);
    playMagneticSound('snap');

    const R = 230;
    if (station === 'west') {
      magX.set(-R);
      magY.set(0);
      setMagnetRotation(0);
      setCurrentStation('west');
    } else if (station === 'north') {
      magX.set(0);
      magY.set(-R);
      setMagnetRotation(90);
      setCurrentStation('north');
    } else if (station === 'east') {
      magX.set(R);
      magY.set(0);
      setMagnetRotation(180);
      setCurrentStation('east');
    } else if (station === 'south') {
      magX.set(0);
      magY.set(R);
      setMagnetRotation(270);
      setCurrentStation('south');
    }
  };

  // Reset Experiment
  const handleReset = () => {
    if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    setIsOrbiting(false);
    setIsFlipped(false);
    setMagnetRotation(0);
    magX.set(-230);
    magY.set(0);
    setCurrentStation('west');
    setCurrentStep(1);
    setTestedOrbit(false);
    setTestedFlip(false);
    setIsCompleted(false);
    setCompassAngle(0);
  };

  // Return needle to normal North & South
  const handleRealignCompass = () => {
    if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    setIsOrbiting(false);
    magX.set(-230);
    magY.set(0);
    setMagnetRotation(0);
    setCurrentStation('west');
    setCompassAngle(0);
  };

  // Closest pole to compass center for badge visual
  const closestPole = isFlipped ? 'South (🔵)' : 'North (🔴)';

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '370px 1fr',
        gap: '1rem',
        padding: '0.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Left Column: Activity Step Instructions & Controls */}
      <div className="custom-scroll" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1.5px solid #A7F3D0',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(6, 78, 59, 0.08)',
        zIndex: 10,
        overflowY: 'auto'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <CompassIcon size={22} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#064E3B', fontWeight: 900 }}>
                Activity 4.6 Lab
              </h3>
            </div>
            <span style={{
              background: '#FEF3C7',
              color: '#92400E',
              fontWeight: 900,
              fontSize: '0.75rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '8px',
              border: '1px solid #FDE68A'
            }}>
              Step {currentStep} of 4
            </span>
          </div>

          {/* Interactive Steps Carousel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {STEPS.map((s) => {
              const isCurrent = currentStep === s.step;
              const isPast = currentStep > s.step || (s.step === 3 && testedOrbit) || (s.step === 4 && testedFlip);

              return (
                <div
                  key={s.step}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: '12px',
                    background: isCurrent ? '#FEF3C7' : isPast ? '#ECFDF5' : '#F8FAFC',
                    border: `1.5px solid ${isCurrent ? '#F59E0B' : isPast ? '#10B981' : '#E2E8F0'}`,
                    boxShadow: isCurrent ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isCurrent ? '#92400E' : isPast ? '#065F46' : '#475569' }}>
                      {s.title}
                    </span>
                    {isPast && <CheckCircle2 size={16} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: '#1E293B', lineHeight: 1.45, fontWeight: 500 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Live Status Diagnostic Card */}
          <div style={{
            marginTop: '0.85rem',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '14px',
            border: '1.5px solid #38BDF8',
            color: '#FFFFFF',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#94A3B8', fontWeight: 700 }}>Facing Pole:</span>
              <strong style={{ color: isFlipped ? '#60A5FA' : '#F87171' }}>
                {isFlipped ? '🔵 South Pole (S)' : '🔴 North Pole (N)'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#94A3B8', fontWeight: 700 }}>Cardinal Station:</span>
              <strong style={{ color: '#FDE047', textTransform: 'uppercase' }}>{currentStation}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8', fontWeight: 700 }}>Needle Response:</span>
              <strong style={{ color: '#34D399' }}>{activeInteraction}</strong>
            </div>
          </div>
        </div>

        {/* Primary Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.85rem' }}>
          {/* Main Flip Magnet Button */}
          <button
            type="button"
            onClick={handleFlipMagnet}
            disabled={isOrbiting}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.98rem',
              cursor: isOrbiting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
              transition: 'all 0.2s ease',
              opacity: isOrbiting ? 0.7 : 1
            }}
          >
            <RefreshCw size={18} className={isOrbiting ? 'animate-spin' : ''} />
            Flip Magnet & Auto-Orbit (N ↔ S)
          </button>

          {/* Cardinal Stations Quick Jump Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            <button
              type="button"
              onClick={() => jumpToStation('west')}
              disabled={isOrbiting}
              style={{
                padding: '0.4rem 0',
                borderRadius: '8px',
                border: currentStation === 'west' ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                background: currentStation === 'west' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'west' ? '#92400E' : '#334155',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🧭 West
            </button>
            <button
              type="button"
              onClick={() => jumpToStation('north')}
              disabled={isOrbiting}
              style={{
                padding: '0.4rem 0',
                borderRadius: '8px',
                border: currentStation === 'north' ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                background: currentStation === 'north' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'north' ? '#92400E' : '#334155',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🧭 North
            </button>
            <button
              type="button"
              onClick={() => jumpToStation('east')}
              disabled={isOrbiting}
              style={{
                padding: '0.4rem 0',
                borderRadius: '8px',
                border: currentStation === 'east' ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                background: currentStation === 'east' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'east' ? '#92400E' : '#334155',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🧭 East
            </button>
            <button
              type="button"
              onClick={() => jumpToStation('south')}
              disabled={isOrbiting}
              style={{
                padding: '0.4rem 0',
                borderRadius: '8px',
                border: currentStation === 'south' ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                background: currentStation === 'south' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'south' ? '#92400E' : '#334155',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🧭 South
            </button>
          </div>

          {/* Reset & Proceed Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>

            {isCompleted && (
              <button
                type="button"
                onClick={onNext}
                style={{
                  flex: 1.4,
                  padding: '0.55rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                Next Step <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Nautical Sea Workspace Arena */}
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

        {/* Orbit Path Guide Ring Overlay (Dotted Arc) */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          {/* Circular Orbit Ring (R=230) */}
          <circle
            cx="50%"
            cy="50%"
            r="230"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.4"
          />

          {/* Cardinal Markers on Ring */}
          <g transform="translate(50%, 50%)">
            {/* West Marker */}
            <circle cx="-230" cy="0" r="5" fill="#38BDF8" opacity="0.8" />
            <text x="-248" y="4" textAnchor="end" fill="#93C5FD" fontSize="11" fontWeight="800" fontFamily="sans-serif">WEST</text>

            {/* North Marker */}
            <circle cx="0" cy="-230" r="5" fill="#38BDF8" opacity="0.8" />
            <text x="0" y="-242" textAnchor="middle" fill="#93C5FD" fontSize="11" fontWeight="800" fontFamily="sans-serif">NORTH</text>

            {/* East Marker */}
            <circle cx="230" cy="0" r="5" fill="#38BDF8" opacity="0.8" />
            <text x="248" y="4" textAnchor="start" fill="#93C5FD" fontSize="11" fontWeight="800" fontFamily="sans-serif">EAST</text>

            {/* South Marker */}
            <circle cx="0" cy="230" r="5" fill="#38BDF8" opacity="0.8" />
            <text x="0" y="252" textAnchor="middle" fill="#93C5FD" fontSize="11" fontWeight="800" fontFamily="sans-serif">SOUTH</text>
          </g>
        </svg>

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
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#78350F', fontSize: '0.85rem', fontWeight: 900 }}>
            <CompassIcon size={17} color="#D97706" />
            <span>BEARING: <strong style={{ color: '#C2410C' }}>{Math.round((compassAngle % 360 + 360) % 360)}°</strong> {getBearingName(compassAngle)}</span>
          </div>
        </div>

        {/* Live Interaction Badge (Repel vs Attract) */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '8.8rem',
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '0.4rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.78rem',
          color: '#E2E8F0',
          fontWeight: 800,
          zIndex: 20
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isFlipped ? '#3B82F6' : '#EF4444',
            boxShadow: `0 0 8px ${isFlipped ? '#3B82F6' : '#EF4444'}`
          }} />
          <span>{activeInteraction}</span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1.5px solid rgba(255, 255, 255, 0.85)',
            borderRadius: '14px',
            padding: '0.4rem 0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#0F172A',
            fontSize: '0.78rem',
            fontWeight: 800,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.2s ease',
          }}
        >
          {isFullscreen ? <Minimize2 size={15} color="#0F172A" /> : <Maximize2 size={15} color="#0F172A" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>

        {/* Central Arena: Compass + Single Combined Bar Magnet */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* Antique Brass Compass Display */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              zIndex: 10
            }}
          >
            <ExactCompass 
              rotation={compassAngle} 
              size={320} 
              onCenterClick={handleRealignCompass} 
              onClick={handleRealignCompass} 
            />
          </div>

          {/* 🧲 COMBINED DUAL-POLE BAR MAGNET (Red North + Blue South in One Body) */}
          <motion.div
            drag={!isOrbiting}
            dragConstraints={workspaceRef}
            dragElastic={0}
            dragMomentum={false}
            style={{
              x: magX,
              y: magY,
              rotate: magnetRotation,
              position: 'absolute',
              cursor: isOrbiting ? 'default' : 'grab',
              zIndex: 30,
              userSelect: 'none'
            }}
            onDrag={updateCompassPhysics}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              {/* 3D Realistic Combined Bar Magnet Body */}
              <div 
                onClick={!isOrbiting ? handleFlipMagnet : undefined}
                title="Click to Flip Polarity (N ↔ S)"
                style={{
                  width: '160px',
                  height: '46px',
                  borderRadius: '10px',
                  display: 'flex',
                  overflow: 'hidden',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 24px rgba(56, 189, 248, 0.35)',
                  border: '2px solid rgba(255,255,255,0.85)',
                  position: 'relative',
                  cursor: isOrbiting ? 'default' : 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                {/* Left Half (South if normal, North if flipped) */}
                <div style={{
                  flex: 1,
                  background: isFlipped
                    ? 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)'
                    : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  letterSpacing: '1.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                  borderRight: '1.5px solid rgba(255,255,255,0.4)'
                }}>
                  {isFlipped ? 'N' : 'S'}
                </div>

                {/* Central Metallic Chrome Joint Seam */}
                <div style={{
                  width: '6px',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 50%, #475569 100%)',
                  boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5)',
                  zIndex: 2
                }} />

                {/* Right Half (North if normal, South if flipped) */}
                <div style={{
                  flex: 1,
                  background: isFlipped
                    ? 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)'
                    : 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  letterSpacing: '1.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                  borderLeft: '1.5px solid rgba(255,255,255,0.4)'
                }}>
                  {isFlipped ? 'S' : 'N'}
                </div>

                {/* Top Glass Specular Highlight Sheen */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '42%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Magnet Quick Drag / Flip Pill */}
              <div style={{
                padding: '0.2rem 0.55rem',
                fontSize: '0.68rem',
                fontWeight: 800,
                borderRadius: '6px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}>
                <Move size={10} /> Drag or Click to Flip
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}