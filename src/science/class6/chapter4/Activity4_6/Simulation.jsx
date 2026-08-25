import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
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
  Navigation,
  HelpCircle,
  X
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

const ACTION_POPUP_DATA = {
  1: {
    step: 1,
    badge: "Step 1 of 4",
    title: "Action 1: Observe Natural Compass Alignment",
    icon: "🧭",
    instruction: "With no magnets placed near the compass, observe how Earth's geomagnetic field naturally points the red needle toward North (0° / Bearing: 0° N).",
    actionPrompt: "Observe initial North alignment",
    btnLabel: "Got it! Let's Bring Magnet ➔"
  },
  2: {
    step: 2,
    badge: "Step 2 of 4",
    title: "Action 2: Move Bar Magnet Around Compass",
    icon: "🧲",
    instruction: "Drag the Bar Magnet along the circular orbit (or click the West, North, East, South buttons) to see how the compass needle deflects in real time!",
    actionPrompt: "Drag magnet or click cardinal stations",
    btnLabel: "Got it! Dragging Magnet ➔"
  },
  3: {
    step: 3,
    badge: "Step 3 of 4",
    title: "Action 3: Flip Magnet Polarity",
    icon: "🔄",
    instruction: "Click 'Flip Magnet' to reverse the poles (N ↔ S). Watch the magnet automatically orbit through North → East → South → West while pausing at each station!",
    actionPrompt: "Click 'Flip Magnet' to start auto-tour",
    btnLabel: "Got it! Let's Flip Magnet ➔"
  },
  4: {
    step: 4,
    badge: "Action 4 of 4",
    title: "Action 4: Observation Complete",
    icon: "🎯",
    instruction: "Unlike magnetic poles attract (South attracts North) and like poles repel! You're now ready to test your knowledge in the Challenge Mode & Questions!",
    actionPrompt: "Proceed to next learning stage",
    btnLabel: "Proceed to Concept Check ➔"
  }
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
    title: "Step 3: Orbit through North → East → South → West",
    desc: "Observe how the compass needle continuously turns as the magnet visits and pauses at each cardinal direction."
  },
  {
    step: 4,
    title: "Step 4: Flip Magnet Polarity",
    desc: "Click 'Flip Magnet' to reverse poles (N ↔ S). The magnet will automatically move to North (wait), East (wait), South (wait), and West (wait)!"
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
  const [tourStatus, setTourStatus] = useState('');
  const [activeInteraction, setActiveInteraction] = useState('Repelling'); // 'Repelling' | 'Attracting'
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentActionStep, setCurrentActionStep] = useState(1);
  const [showActionModal, setShowActionModal] = useState(true);

  const handleAdvanceAction = () => {
    setShowActionModal(false);
    if (currentActionStep === 1) {
      setCurrentActionStep(2);
    } else if (currentActionStep === 4) {
      if (onNext) onNext();
    }
  };

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
  // Automated 4-Station Tour: North (wait) → East (wait) → South (wait) → West (settle)
  // -------------------------------------------------------------------
  const startOrbitalSequence = useCallback((options = {}) => {
    if (orbitAnimRef.current) {
      cancelAnimationFrame(orbitAnimRef.current);
    }

    setIsOrbiting(true);
    playMagneticSound('whoosh');

    const R = 230; // Orbital radius
    const startX = magX.get();
    const startY = magY.get();
    const startRot = magnetRotation;
    const isAlreadyAtWest = Math.hypot(startX - (-R), startY - 0) < 20;

    const MOVE_DUR = 1000;
    const PAUSE_DUR = 1300;

    const segments = [
      // 1. Move to North
      {
        type: 'move',
        station: 'north',
        fromPhi: isAlreadyAtWest ? Math.PI : Math.atan2(-startY, startX),
        toPhi: Math.PI / 2,
        duration: MOVE_DUR,
        status: '🧭 Moving to North Station...',
        useDirectInterpolation: !isAlreadyAtWest
      },
      // 2. Pause at North
      {
        type: 'pause',
        station: 'north',
        phi: Math.PI / 2,
        x: 0,
        y: -R,
        rot: 90,
        duration: PAUSE_DUR,
        status: '⏸️ Paused at North Station — Observing needle response'
      },
      // 3. Move to East
      {
        type: 'move',
        station: 'east',
        fromPhi: Math.PI / 2,
        toPhi: 0,
        duration: MOVE_DUR,
        status: '🧭 Moving to East Station...'
      },
      // 4. Pause at East
      {
        type: 'pause',
        station: 'east',
        phi: 0,
        x: R,
        y: 0,
        rot: 180,
        duration: PAUSE_DUR,
        status: '⏸️ Paused at East Station — Observing needle response'
      },
      // 5. Move to South
      {
        type: 'move',
        station: 'south',
        fromPhi: 0,
        toPhi: -Math.PI / 2,
        duration: MOVE_DUR,
        status: '🧭 Moving to South Station...'
      },
      // 6. Pause at South
      {
        type: 'pause',
        station: 'south',
        phi: -Math.PI / 2,
        x: 0,
        y: R,
        rot: 270,
        duration: PAUSE_DUR,
        status: '⏸️ Paused at South Station — Observing needle response'
      },
      // 7. Move to West
      {
        type: 'move',
        station: 'west',
        fromPhi: -Math.PI / 2,
        toPhi: -Math.PI,
        duration: MOVE_DUR,
        status: '🧭 Moving to West Station...'
      },
      // 8. Settle at West
      {
        type: 'pause',
        station: 'west',
        phi: -Math.PI,
        x: -R,
        y: 0,
        rot: 0,
        duration: 600,
        status: '✅ Station Tour Complete at West Station'
      }
    ];

    let accum = 0;
    const timeline = segments.map((seg) => {
      const start = accum;
      const end = start + seg.duration;
      accum = end;
      return { ...seg, start, end };
    });

    const totalDuration = accum;
    const startTime = performance.now();
    let lastSegIndex = -1;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;

      if (elapsed >= totalDuration) {
        magX.set(-R);
        magY.set(0);
        setMagnetRotation(0);
        setCurrentStation('west');
        setTourStatus('');
        setIsOrbiting(false);
        setTestedOrbit(true);
        if (currentStep < 4) setCurrentStep(4);
        if (currentActionStep === 3) {
          setCurrentActionStep(4);
          setShowActionModal(true);
        }
        if (options.onFinish) options.onFinish();
        return;
      }

      let activeIdx = timeline.findIndex(seg => elapsed >= seg.start && elapsed < seg.end);
      if (activeIdx === -1) activeIdx = timeline.length - 1;
      const seg = timeline[activeIdx];

      if (activeIdx !== lastSegIndex) {
        lastSegIndex = activeIdx;
        if (seg.type === 'pause') {
          playMagneticSound('snap');
        } else {
          playMagneticSound('whoosh');
        }
      }

      setTourStatus(seg.status);
      setCurrentStation(seg.station);

      if (seg.type === 'pause') {
        magX.set(seg.x);
        magY.set(seg.y);
        setMagnetRotation(seg.rot);
      } else {
        const segElapsed = elapsed - seg.start;
        const progress = Math.min(segElapsed / seg.duration, 1);
        const ease = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        if (seg.useDirectInterpolation) {
          const curX = startX + (0 - startX) * ease;
          const curY = startY + (-R - startY) * ease;
          const curRot = startRot + (90 - startRot) * ease;
          magX.set(curX);
          magY.set(curY);
          setMagnetRotation(curRot);
        } else {
          const curPhi = seg.fromPhi + (seg.toPhi - seg.fromPhi) * ease;
          const curX = R * Math.cos(curPhi);
          const curY = -R * Math.sin(curPhi);
          const phiDeg = (curPhi * 180) / Math.PI;
          const curRot = (180 - phiDeg + 360) % 360;
          magX.set(curX);
          magY.set(curY);
          setMagnetRotation(curRot);
        }
      }

      orbitAnimRef.current = requestAnimationFrame(animate);
    };

    orbitAnimRef.current = requestAnimationFrame(animate);
  }, [magX, magY, magnetRotation, currentStep]);

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

    // Automatically trigger North -> wait -> East -> wait -> South -> wait -> West
    startOrbitalSequence();
  };

  // -------------------------------------------------------------------
  // Jump to Cardinal Station (West, North, East, South)
  // -------------------------------------------------------------------
  const jumpToStation = (station) => {
    if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    setIsOrbiting(false);
    setTourStatus('');
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

    if (currentActionStep === 2) {
      setCurrentActionStep(3);
      setShowActionModal(true);
    }
  };

  // Reset Experiment
  const handleReset = () => {
    if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    setIsOrbiting(false);
    setTourStatus('');
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
    setCurrentActionStep(1);
    setShowActionModal(true);
  };

  // Return needle to normal North & South
  const handleRealignCompass = () => {
    if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    setIsOrbiting(false);
    setTourStatus('');
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
        gridTemplateColumns: '460px 1fr',
        gap: '1.25rem',
        padding: '0.65rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Left Column: Activity Step Instructions & Controls */}
      <div className="custom-scroll" style={{
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(14px)',
        borderRadius: '24px',
        border: '2px solid #A7F3D0',
        padding: '1.6rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 10px 36px rgba(6, 78, 59, 0.09)',
        zIndex: 10,
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CompassIcon size={28} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.45rem', color: '#064E3B', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Activity 4.6 Lab
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <button
                type="button"
                onClick={() => setShowActionModal(true)}
                style={{
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(6, 78, 59, 0.06)'
                }}
                title="View action guidance"
              >
                <span>💡 Action Step {currentActionStep} Guide</span>
              </button>
              <span style={{
                background: '#FEF3C7',
                color: '#92400E',
                fontWeight: 900,
                fontSize: '0.86rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '12px',
                border: '1.5px solid #FDE68A'
              }}>
                Step {currentStep} of 4
              </span>
            </div>
          </div>

          {/* All 4 Interactive Steps Fully Visible from Initial Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {STEPS.map((s) => {
              const isCurrent = currentStep === s.step;
              const isPast = currentStep > s.step || (s.step === 3 && testedOrbit) || (s.step === 4 && testedFlip);

              return (
                <div
                  key={s.step}
                  style={{
                    padding: '1.05rem 1.35rem',
                    borderRadius: '18px',
                    background: isCurrent ? '#FEF3C7' : isPast ? '#ECFDF5' : '#F8FAFC',
                    border: isCurrent 
                      ? '2.5px solid #F59E0B' 
                      : isPast 
                      ? '2px solid #10B981' 
                      : '2px solid #CBD5E1',
                    boxShadow: isCurrent 
                      ? '0 6px 20px rgba(245, 158, 11, 0.22)' 
                      : isPast
                      ? '0 4px 12px rgba(16, 185, 129, 0.12)'
                      : '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isCurrent ? '#D97706' : isPast ? '#059669' : '#64748B',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        flexShrink: 0
                      }}>
                        {s.step}
                      </span>
                      <span style={{ fontWeight: 900, fontSize: '1.12rem', color: isCurrent ? '#92400E' : isPast ? '#065F46' : '#1E293B' }}>
                        {s.title}
                      </span>
                    </div>
                    {isPast && <CheckCircle2 size={22} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.96rem', color: '#1E293B', lineHeight: 1.55, fontWeight: 600 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Live Status Diagnostic Card */}
          <div style={{
            padding: '1.15rem 1.4rem',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '20px',
            border: '2px solid #38BDF8',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.98rem' }}>
              <span style={{ color: '#94A3B8', fontWeight: 700 }}>Facing Pole:</span>
              <strong style={{ color: isFlipped ? '#60A5FA' : '#F87171', fontSize: '1.05rem' }}>
                {isFlipped ? '🔵 South Pole (S)' : '🔴 North Pole (N)'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.98rem' }}>
              <span style={{ color: '#94A3B8', fontWeight: 700 }}>Cardinal Station:</span>
              <strong style={{ color: '#FDE047', textTransform: 'uppercase', fontSize: '1.05rem' }}>{currentStation}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tourStatus ? '8px' : '0', fontSize: '0.98rem' }}>
              <span style={{ color: '#94A3B8', fontWeight: 700 }}>Needle Response:</span>
              <strong style={{ color: '#34D399', fontSize: '1.05rem' }}>{activeInteraction}</strong>
            </div>
            {tourStatus && (
              <div style={{ 
                marginTop: '10px', 
                padding: '8px 14px', 
                background: 'rgba(56, 189, 248, 0.2)', 
                borderRadius: '12px', 
                border: '1.5px solid rgba(56, 189, 248, 0.5)', 
                color: '#BAE6FD', 
                fontWeight: 900,
                fontSize: '0.94rem'
              }}>
                {tourStatus}
              </div>
            )}
          </div>
        </div>

        {/* Primary Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.25rem' }}>
          {/* Main Flip Magnet Button */}
          <button
            type="button"
            onClick={handleFlipMagnet}
            disabled={isOrbiting}
            style={{
              width: '100%',
              padding: '1.15rem',
              borderRadius: '20px',
              border: 'none',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.12rem',
              cursor: isOrbiting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 6px 22px rgba(217, 119, 6, 0.45)',
              transition: 'all 0.25s ease',
              opacity: isOrbiting ? 0.7 : 1
            }}
          >
            <RefreshCw size={22} className={isOrbiting ? 'animate-spin' : ''} />
            {isOrbiting ? 'Auto-Touring (N → E → S → W)...' : 'Flip Magnet (Auto-Tour: N → E → S → W)'}
          </button>

          {/* Cardinal Stations Quick Jump Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => jumpToStation('west')}
              disabled={isOrbiting}
              style={{
                padding: '0.8rem 0',
                borderRadius: '14px',
                border: currentStation === 'west' ? '2.5px solid #F59E0B' : '1.5px solid #CBD5E1',
                background: currentStation === 'west' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'west' ? '#92400E' : '#1E293B',
                fontSize: '0.98rem',
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🧭 West
            </button>
            <button
              type="button"
              onClick={() => jumpToStation('north')}
              disabled={isOrbiting}
              style={{
                padding: '0.8rem 0',
                borderRadius: '14px',
                border: currentStation === 'north' ? '2.5px solid #F59E0B' : '1.5px solid #CBD5E1',
                background: currentStation === 'north' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'north' ? '#92400E' : '#1E293B',
                fontSize: '0.98rem',
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🧭 North
            </button>
            <button
              type="button"
              onClick={() => jumpToStation('east')}
              disabled={isOrbiting}
              style={{
                padding: '0.8rem 0',
                borderRadius: '14px',
                border: currentStation === 'east' ? '2.5px solid #F59E0B' : '1.5px solid #CBD5E1',
                background: currentStation === 'east' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'east' ? '#92400E' : '#1E293B',
                fontSize: '0.98rem',
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🧭 East
            </button>
            <button
              type="button"
              onClick={() => jumpToStation('south')}
              disabled={isOrbiting}
              style={{
                padding: '0.8rem 0',
                borderRadius: '14px',
                border: currentStation === 'south' ? '2.5px solid #F59E0B' : '1.5px solid #CBD5E1',
                background: currentStation === 'south' ? '#FEF3C7' : '#F8FAFC',
                color: currentStation === 'south' ? '#92400E' : '#1E293B',
                fontSize: '0.98rem',
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🧭 South
            </button>
          </div>

          {/* Reset & Proceed Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#1E293B',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={18} /> Reset
            </button>

            {isCompleted && (
              <button
                type="button"
                onClick={onNext}
                style={{
                  flex: 1.4,
                  padding: '0.85rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.02rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                Next Step <ArrowRight size={18} />
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

        {/* Orbit Path Guide Ring Overlay (Clean Dotted Arc) */}
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
            opacity="0.35"
          />
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
            onDragEnd={() => {
              if (currentActionStep === 2) {
                setCurrentActionStep(3);
                setShowActionModal(true);
              }
            }}
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

      {/* Contextual Single-Action Guidance Pop-Up Modal */}
      <AnimatePresence>
        {showActionModal && ACTION_POPUP_DATA[currentActionStep] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(6, 78, 59, 0.45)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 10, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '26px',
                border: '2px solid #A7F3D0',
                boxShadow: '0 25px 60px -12px rgba(6, 78, 59, 0.35)',
                width: '100%',
                maxWidth: '560px',
                padding: '2.2rem 2.4rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowActionModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.2rem',
                  right: '1.2rem',
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} />
              </button>

              {/* Step Badge & Icon Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '2px solid #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)'
                }}>
                  {ACTION_POPUP_DATA[currentActionStep].icon}
                </div>
                <div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#D97706',
                    background: '#FEF3C7',
                    padding: '3px 10px',
                    borderRadius: '10px',
                    border: '1px solid #FCD34D'
                  }}>
                    {ACTION_POPUP_DATA[currentActionStep].badge}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.28rem', fontWeight: 900, color: '#064E3B' }}>
                    {ACTION_POPUP_DATA[currentActionStep].title}
                  </h3>
                </div>
              </div>

              {/* Instruction Content Card */}
              <div style={{
                background: '#F0FDF4',
                border: '1.5px solid #A7F3D0',
                borderLeft: '5px solid #D97706',
                borderRadius: '16px',
                padding: '1.15rem 1.35rem',
                color: '#1E293B',
                fontSize: '1.02rem',
                lineHeight: 1.55,
                fontWeight: 600
              }}>
                {ACTION_POPUP_DATA[currentActionStep].instruction}
              </div>

              {/* Action Hint Prompt */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#065F46',
                fontWeight: 800,
                background: '#ECFDF5',
                padding: '0.5rem 0.9rem',
                borderRadius: '12px'
              }}>
                <span>👉</span>
                <span><strong>Next Action:</strong> {ACTION_POPUP_DATA[currentActionStep].actionPrompt}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAdvanceAction}
                style={{
                  padding: '0.9rem 1.6rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease',
                  marginTop: '0.25rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {ACTION_POPUP_DATA[currentActionStep].btnLabel}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}