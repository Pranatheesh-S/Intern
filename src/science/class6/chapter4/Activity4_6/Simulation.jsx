import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  RotateCcw, 
  ArrowRight, 
  Compass as CompassIcon, 
  CheckCircle2, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Play, 
  ArrowUpRight, 
  ArrowDownRight 
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
    title: "Step 1: Start at Bottom-Left Corner",
    desc: "Click 'Run the flow' at the bottom-right corner. The flat bar magnet rests at the bottom-left corner while the compass needle points naturally to Earth's Magnetic North (0° N)."
  },
  {
    step: 2,
    title: "Step 2: Move to Top-Left Station",
    desc: "The magnet moves to the Top-Left station without flipping. Watch the compass needle deflect towards the magnet's pole and observe its direction."
  },
  {
    step: 3,
    title: "Step 3: Move to Bottom-Right Station",
    desc: "The magnet revolves around to the Bottom-Right station maintaining the same orientation. Observe the compass needle deflect to follow the magnet."
  },
  {
    step: 4,
    title: "Step 4: Return to Starting Stage",
    desc: "The magnet smoothly returns along the bottom path to the starting position and settles. The compass needle restores naturally to 0° North."
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

// Smooth Catmull-Rom Spline Interpolation for Curved Orbits
function getCatmullRomSplinePoint(points, t) {
  const numSegments = points.length - 3;
  const p = Math.max(0, Math.min(t, 1)) * numSegments;
  const i = Math.min(Math.floor(p), numSegments - 1);
  const u = p - i;

  const p0 = points[i];
  const p1 = points[i + 1];
  const p2 = points[i + 2];
  const p3 = points[i + 3];

  const u2 = u * u;
  const u3 = u2 * u;

  const x = 0.5 * (
    (2 * p1[0]) +
    (-p0[0] + p2[0]) * u +
    (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 +
    (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3
  );

  const y = 0.5 * (
    (2 * p1[1]) +
    (-p0[1] + p2[1]) * u +
    (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 +
    (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3
  );

  return { x, y };
}

export default function Simulation({ onComplete, onNext }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [compassAngle, setCompassAngle] = useState(0);
  const compassAngleRef = useRef(0);

  // Continuous angle unwrapping so Framer Motion needle never spins 360° across 0°
  const setContinuousCompassAngle = useCallback((targetDeg) => {
    const prev = compassAngleRef.current;
    const delta = ((targetDeg - prev) % 360 + 540) % 360 - 180;
    const nextAngle = prev + delta;
    compassAngleRef.current = nextAngle;
    setCompassAngle(nextAngle);
  }, []);

  // false: Left = North (🔴 N), Right = South (🔵 S)
  // true:  Left = South (🔵 S), Right = North (🔴 N)
  const [isFlipped, setIsFlipped] = useState(false);
  const isFlippedRef = useRef(false);
  isFlippedRef.current = isFlipped;

  // Initial Magnet Position in Bottom-Left Corner
  const [pos, setPos] = useState({ x: -260, y: 230 });
  const posRef = useRef({ x: -260, y: 230 });
  posRef.current = pos;

  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStation, setCurrentStation] = useState('corner'); // 'corner', 'top-left', 'bottom-right'
  const [statusMessage, setStatusMessage] = useState('Magnet resting at bottom-left corner');
  const [activeInteraction, setActiveInteraction] = useState('Natural Earth Alignment (0° N)');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Trajectory exploration tracker
  const [hasVisitedTopLeft, setHasVisitedTopLeft] = useState(false);
  const [hasVisitedBottomRight, setHasVisitedBottomRight] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  const containerRef = useRef(null);
  const workspaceRef = useRef(null);
  const animFrameRef = useRef(null);
  const cancelSequenceRef = useRef(false);
  const timeoutsRef = useRef([]);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

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
  // Accurate Magnetic Dipole & Deflection Rules
  // -------------------------------------------------------------------
  const updateCompassPhysics = useCallback((x, y, flipped) => {
    const distCenter = Math.hypot(x, y);

    // When magnet is far in the corner, Earth's natural magnetic field dominates
    if (distCenter >= 330) {
      setContinuousCompassAngle(0);
      setActiveInteraction('Natural Earth Alignment (0° N)');
      return;
    }

    // Measure proximity to Top-Left station (-215, -210) and Bottom-Right station (215, 205)
    const distTopLeft = Math.hypot(x - (-215), y - (-210));
    const distBottomRight = Math.hypot(x - 215, y - 205);

    // 1. Top-Left Region (-215, -210):
    // - [[N][S]]: Red North needle faces North-West -> 315° NW
    // - [[S][N]]: Red North needle faces North-East -> 45° NE
    if (distTopLeft < 90) {
      const blend = Math.max(0, 1 - distTopLeft / 90);
      const finalAngle = !flipped 
        ? 360 - 45 * blend // approaches 315° NW
        : 45 * blend;       // approaches 45° NE
      setContinuousCompassAngle((finalAngle + 360) % 360);

      if (flipped) {
        setActiveInteraction('🔴 Red North needle pointing to North-East (45° NE)');
      } else {
        setActiveInteraction('🔴 Red North needle pointing to North-West (315° NW)');
      }
      return;
    }

    // 2. Bottom-Right Region (215, 205):
    // - [[N][S]]: Blue South needle faces South-East (135° SE) [Red North needle points 315° NW]
    // - [[S][N]]: Blue South needle faces South-West (225° SW) [Red North needle points 45° NE]
    if (distBottomRight < 90) {
      const blend = Math.max(0, 1 - distBottomRight / 90);
      const finalAngle = !flipped 
        ? 360 - 45 * blend // North needle at 315° NW -> South needle faces 135° SE
        : 45 * blend;       // North needle at 45° NE  -> South needle faces 225° SW
      setContinuousCompassAngle((finalAngle + 360) % 360);

      if (flipped) {
        setActiveInteraction('🔵 Blue South needle pointing to South-West (225° SW)');
      } else {
        setActiveInteraction('🔵 Blue South needle pointing to South-East (135° SE)');
      }
      return;
    }

    // General Smooth Orbit Deflection along the path
    // Calculate dipole forces
    const halfLen = 42;
    const leftPoleX = x - halfLen;
    const leftPoleY = y;
    const rightPoleX = x + halfLen;
    const rightPoleY = y;

    const northPoleX = flipped ? rightPoleX : leftPoleX;
    const northPoleY = flipped ? rightPoleY : leftPoleY;
    const southPoleX = flipped ? leftPoleX : rightPoleX;
    const southPoleY = flipped ? leftPoleY : rightPoleY;

    const B_EARTH = 1.0;
    const K_MAGNETIC = 1200000;
    const EPSILON_SQ = 2400;
    const R_MAX = 560;

    let fx = 0;
    let fy = -B_EARTH;

    const distN = Math.hypot(northPoleX, northPoleY);
    if (distN < R_MAX) {
      const falloff = Math.max(0, 1 - distN / R_MAX);
      const forceN = (K_MAGNETIC / (distN * distN + EPSILON_SQ)) * falloff * falloff;
      fx += (-northPoleX / distN) * forceN;
      fy += (-northPoleY / distN) * forceN;
    }

    const distS = Math.hypot(southPoleX, southPoleY);
    if (distS < R_MAX) {
      const falloff = Math.max(0, 1 - distS / R_MAX);
      const forceS = (K_MAGNETIC / (distS * distS + EPSILON_SQ)) * falloff * falloff;
      fx += (southPoleX / distS) * forceS;
      fy += (southPoleY / distS) * forceS;
    }

    const targetRad = Math.atan2(fx, -fy);
    let targetDeg = targetRad * (180 / Math.PI);
    targetDeg = (targetDeg + 360) % 360;

    setContinuousCompassAngle(targetDeg);

    if (distN < distS) {
      setActiveInteraction('🔴 Like North Pole Repelling Needle');
    } else {
      setActiveInteraction('🔵 Opposite South Pole Attracting Needle');
    }
  }, [setContinuousCompassAngle]);

  // Update physics on initial render & state changes
  useEffect(() => {
    updateCompassPhysics(pos.x, pos.y, isFlipped);
  }, [pos, isFlipped, updateCompassPhysics]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(() => {
      if (!cancelSequenceRef.current) fn();
    }, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // -------------------------------------------------------------------
  // Smooth Spline Animation Controller
  // -------------------------------------------------------------------
  const animateAlongSpline = useCallback((points, duration = 1400, onCompleteCallback) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsAnimating(true);
    playMagneticSound('whoosh');

    const startTime = performance.now();

    const frame = (currentTime) => {
      if (cancelSequenceRef.current) {
        setIsAnimating(false);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth cubic easing
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentPoint = getCatmullRomSplinePoint(points, ease);
      setPos(currentPoint);
      updateCompassPhysics(currentPoint.x, currentPoint.y, isFlippedRef.current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(frame);
      } else {
        const lastPoint = points[points.length - 2]; // Destination
        setPos({ x: lastPoint[0], y: lastPoint[1] });
        updateCompassPhysics(lastPoint[0], lastPoint[1], isFlippedRef.current);
        setIsAnimating(false);
        playMagneticSound('snap');
        if (onCompleteCallback && !cancelSequenceRef.current) onCompleteCallback();
      }
    };

    animFrameRef.current = requestAnimationFrame(frame);
  }, [updateCompassPhysics]);

  // -------------------------------------------------------------------
  // Individual Segment Actions
  // -------------------------------------------------------------------

  // 1. Move from Corner to Top-Left Station with [[N][S]]
  const moveToTopLeft = () => {
    if (isAnimating) return;
    clearAllTimeouts();
    cancelSequenceRef.current = false;
    
    setIsFlipped(false);
    setStatusMessage('Revolving along left arc to Top-Left station with [[ N ][ S ]]...');
    setCurrentStation('top-left');
    setHasVisitedTopLeft(true);
    setCurrentStep(2);

    const startX = posRef.current.x;
    const startY = posRef.current.y;

    const splinePoints = [
      [startX, startY],
      [startX, startY],
      [-260, 60],
      [-245, -80],
      [-215, -210],
      [-215, -210]
    ];

    animateAlongSpline(splinePoints, 1400, () => {
      setStatusMessage('Top-Left with [[ N ][ S ]]: Red North needle pointing to North-West (315° NW)...');

      // Wait 2.5s then flip to test [[S][N]]
      addTimeout(() => {
        playMagneticSound('snap');
        setIsFlipped(true);
        updateCompassPhysics(-215, -210, true);
        setStatusMessage('Flipped to [[ S ][ N ]]: Red North needle pointing to North-East (45° NE)... Click Bottom-Rt to continue!');
      }, 2500);
    });
  };

  // 2. Move to Bottom-Right Station: Arrive in [[S][N]], wait for South needle to face South-West, flip to [[N][S]], wait for South needle to face towards magnet, then return & settle
  const moveToBottomRight = () => {
    if (isAnimating) return;
    clearAllTimeouts();
    cancelSequenceRef.current = false;

    isFlippedRef.current = true;
    setIsFlipped(true);
    setStatusMessage('Revolving around perimeter to Bottom-Right station in [[ S ][ N ]]...');
    setCurrentStation('bottom-right');
    setHasVisitedBottomRight(true);
    setCurrentStep(3);

    const startX = posRef.current.x;
    const startY = posRef.current.y;

    const splinePoints = [
      [startX, startY],
      [startX, startY],
      [-80, -250],
      [80, -250],
      [240, -100],
      [250, 60],
      [215, 205],
      [215, 205]
    ];

    animateAlongSpline(splinePoints, 1700, () => {
      // 1) When magnet arrives at Bottom-Right in [[S][N]]: wait while South needle faces South-West
      isFlippedRef.current = true;
      setIsFlipped(true);
      updateCompassPhysics(215, 205, true);
      setStatusMessage('📍 Bottom-Right holding in [[ S ][ N ]]: Blue South needle facing South-West (225° SW)...');

      // Wait 3.5s in [S][N] state to clearly observe South needle facing South-West
      addTimeout(() => {
        // 2) Magnet stays in place and flips to [[N][S]], waiting for South needle to face towards the magnet
        playMagneticSound('snap');
        isFlippedRef.current = false;
        setIsFlipped(false);
        updateCompassPhysics(215, 205, false);
        setStatusMessage('🔄 Flipped to [[ N ][ S ]]: Blue South needle facing towards the magnet (135° SE)...');

        // Wait 3.5s in [N][S] state to clearly observe South needle facing towards the magnet
        addTimeout(() => {
          // 3) Come and settle in the initial stage
          setStatusMessage('Step 4: Returning along bottom path and settling in Initial Corner...');
          setCurrentStation('corner');
          setCurrentStep(4);

          const splinePointsReturn = [
            [215, 205],
            [215, 205],
            [80, 260],
            [-80, 265],
            [-260, 230],
            [-260, 230]
          ];

          animateAlongSpline(splinePointsReturn, 1400, () => {
            isFlippedRef.current = false;
            setIsFlipped(false);
            compassAngleRef.current = 0;
            setCompassAngle(0);
            updateCompassPhysics(-260, 230, false);
            setStatusMessage('Magnet settled in initial stage! Compass needle restored to 0° North.');
            setHasCompletedTour(true);
            setIsCompleted(true);
            if (onComplete) onComplete();
          });
        }, 3500);
      });
    });
  };

  // 3. Move from Bottom-Right along Bottom Arc to Initial Corner
  const moveToCorner = () => {
    if (isAnimating) return;
    clearAllTimeouts();
    cancelSequenceRef.current = false;
    setStatusMessage('Returning along bottom arc to Initial Corner...');
    setCurrentStation('corner');

    const startX = posRef.current.x;
    const startY = posRef.current.y;

    const splinePoints = [
      [startX, startY],
      [startX, startY],
      [80, 260],
      [-80, 265],
      [-260, 230],
      [-260, 230]
    ];

    animateAlongSpline(splinePoints, 1300, () => {
      setIsFlipped(false);
      compassAngleRef.current = 0;
      setCompassAngle(0);
      updateCompassPhysics(-260, 230, false);
      setStatusMessage('Magnet settled at initial corner position. Compass needle at 0° North.');
      setCurrentStep(4);
      setHasCompletedTour(true);
      setIsCompleted(true);
      if (onComplete) onComplete();
    });
  };

  const handleFlipMagnet = () => {
    if (isAnimating) return;
    playMagneticSound('snap');
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    isFlippedRef.current = nextFlipped;
    updateCompassPhysics(pos.x, pos.y, nextFlipped);
    setStatusMessage(nextFlipped ? 'Flipped magnet polarity to [[ 🔵 S ][ 🔴 N ]]!' : 'Flipped magnet polarity to [[ 🔴 N ][ 🔵 S ]]!');
  };

  // -------------------------------------------------------------------
  // Automated Sequential Experiment Flow:
  // 1. Move to Top-Left station (without flip)
  // 2. Wait for needle to show deflection in that direction
  // 3. Move to Bottom-Right station with SAME magnet shape without flip
  // 4. Wait for needle to show deflection at Bottom-Right
  // 5. Return to starting stage and settle at 0° North
  // -------------------------------------------------------------------
  const runFullSequence = () => {
    if (isAnimating) return;

    clearAllTimeouts();
    cancelSequenceRef.current = false;

    // Preserve the current magnet orientation throughout the sequence (no flipping during flow)
    const currentFlipped = isFlippedRef.current;
    setStatusMessage(`Step 1: Moving to Top-Left station with [[ ${currentFlipped ? 'S' : 'N'} ][ ${currentFlipped ? 'N' : 'S'} ]]...`);
    setCurrentStation('top-left');
    setCurrentStep(2);
    setHasVisitedTopLeft(true);

    const startX = posRef.current.x;
    const startY = posRef.current.y;

    const splinePoints1 = [
      [startX, startY],
      [startX, startY],
      [-260, 60],
      [-245, -80],
      [-215, -210],
      [-215, -210]
    ];

    animateAlongSpline(splinePoints1, 1400, () => {
      // Arrived at Top-Left: show deflection and wait for observation (WITHOUT FLIP)
      updateCompassPhysics(-215, -210, currentFlipped);
      setStatusMessage(currentFlipped 
        ? 'Top-Left station: Compass needle deflects towards magnet pole (45° NE)...' 
        : 'Top-Left station: Red North needle deflects towards magnet pole (315° NW)...');

      // Wait 2.8s for needle deflection observation
      addTimeout(() => {
        // Step 2: Move to Bottom-Right with the SAME magnet shape (WITHOUT FLIP)
        setStatusMessage(`Step 2: Moving along perimeter to Bottom-Right station with [[ ${currentFlipped ? 'S' : 'N'} ][ ${currentFlipped ? 'N' : 'S'} ]]...`);
        setCurrentStation('bottom-right');
        setCurrentStep(3);
        setHasVisitedBottomRight(true);

        const splinePoints2 = [
          [-215, -210],
          [-215, -210],
          [-80, -250],
          [80, -250],
          [240, -100],
          [250, 60],
          [215, 205],
          [215, 205]
        ];

        animateAlongSpline(splinePoints2, 1800, () => {
          // Arrived at Bottom-Right in SAME orientation without flip
          updateCompassPhysics(215, 205, currentFlipped);
          setStatusMessage(currentFlipped
            ? 'Bottom-Right station: Compass needle deflects towards the magnet (225° SW)...'
            : 'Bottom-Right station: Blue South needle deflects towards the magnet (135° SE)...');

          // Wait 3.0s to observe needle deflection at bottom-right
          addTimeout(() => {
            // Step 3: Return to starting stage
            setStatusMessage('Step 4: Returning along bottom path to starting stage...');
            setCurrentStation('corner');
            setCurrentStep(4);

            const splinePoints3 = [
              [215, 205],
              [215, 205],
              [80, 260],
              [-80, 265],
              [-260, 230],
              [-260, 230]
            ];

            animateAlongSpline(splinePoints3, 1400, () => {
              compassAngleRef.current = 0;
              setCompassAngle(0);
              updateCompassPhysics(-260, 230, currentFlipped);
              setStatusMessage('Sequence Complete! Magnet settled in starting stage. Compass needle restored to 0° North.');
              setHasCompletedTour(true);
              setIsCompleted(true);
              if (onComplete) onComplete();
            });
          }, 3000);
        });
      }, 2800);
    });
  };

  const handleReset = () => {
    cancelSequenceRef.current = true;
    clearAllTimeouts();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsAnimating(false);
    setIsFlipped(false);
    setPos({ x: -260, y: 230 });
    setCurrentStation('corner');
    setCurrentStep(1);
    setHasVisitedTopLeft(false);
    setHasVisitedBottomRight(false);
    setHasCompletedTour(false);
    setIsCompleted(false);
    compassAngleRef.current = 0;
    setCompassAngle(0);
    setStatusMessage('Magnet resting at bottom-left corner');
    updateCompassPhysics(-260, 230, false);
  };

  // Direct Interactive Pointer Dragging Handlers
  const handlePointerDown = (e) => {
    if (isAnimating) return;
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    const newX = Math.max(-290, Math.min(290, dragStartRef.current.startX + dx));
    const newY = Math.max(-260, Math.min(260, dragStartRef.current.startY + dy));
    setPos({ x: newX, y: newY });
    updateCompassPhysics(newX, newY, isFlipped);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Identify facing pole toward compass center
  let facingPoleName = '';
  if (currentStation === 'top-left') {
    facingPoleName = isFlipped ? '🔴 North Pole (Right Half facing Compass)' : '🔵 South Pole (Right Half facing Compass)';
  } else if (currentStation === 'bottom-right') {
    facingPoleName = isFlipped ? '🔵 South Pole (Left Half facing Compass)' : '🔴 North Pole (Left Half facing Compass)';
  } else {
    facingPoleName = 'Bottom-Left Corner (Out of Direct Pull)';
  }

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
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        borderRadius: '24px',
        border: '1.5px solid #FDE68A',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
        zIndex: 10,
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CompassIcon size={28} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.45rem', color: '#78350F', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Activity 4.6 Lab
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span style={{
                background: '#FEF3C7',
                color: '#92400E',
                fontWeight: 900,
                fontSize: '0.92rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #F59E0B',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.12)'
              }}>
                Step {currentStep} of 4
              </span>
            </div>
          </div>

          {/* How to Operate & Experiment Flow Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid #FDE68A',
            borderRadius: '22px',
            padding: '1.5rem 1.6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 6px 20px rgba(217, 119, 6, 0.08)'
          }}>
            {/* Title */}
            <h4 style={{ 
              margin: 0, 
              fontSize: '1.4rem', 
              fontWeight: 900, 
              color: '#78350F',
              letterSpacing: '-0.02em',
              lineHeight: 1.25
            }}>
              How to Operate & Experiment Flow
            </h4>

            {/* Run the Flow Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ 
                fontSize: '1.18rem', 
                fontWeight: 900, 
                color: '#92400E', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.55rem' 
              }}>
                <Play size={20} fill="#D97706" color="#D97706" />
                <span>Run the Flow (Step-by-Step Tour):</span>
              </div>

              {/* Steps 1 to 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    num: 1,
                    label: "Step 1 (Bottom-Left):",
                    text: "Magnet starts at rest; compass points naturally to Magnetic North (0° N)."
                  },
                  {
                    num: 2,
                    label: "Step 2 (Top-Left):",
                    text: "Moves upward without flipping. Needle deflects toward the magnet's pole."
                  },
                  {
                    num: 3,
                    label: "Step 3 (Bottom-Right):",
                    text: "Shifts across in the same orientation. Needle tracks the magnet's movement."
                  },
                  {
                    num: 4,
                    label: "Step 4 (Return to Start):",
                    text: "Smoothly returns along the base to rest. Needle realigns to 0° North."
                  }
                ].map((s) => {
                  const isCurrent = currentStep === s.num;
                  const isPast = (s.num === 1 && currentStep > 1) ||
                                 (s.num === 2 && hasVisitedTopLeft) ||
                                 (s.num === 3 && hasVisitedBottomRight) ||
                                 (s.num === 4 && hasCompletedTour);

                  return (
                    <div
                      key={s.num}
                      style={{
                        padding: '0.95rem 1.25rem',
                        borderRadius: '16px',
                        background: isPast ? '#DCFCE7' : isCurrent ? '#FEF3C7' : 'rgba(255, 255, 255, 0.98)',
                        border: isPast 
                          ? '1.5px solid #86EFAC' 
                          : isCurrent 
                            ? '2px solid #F59E0B' 
                            : '1.5px solid #FDE68A',
                        boxShadow: isPast 
                          ? '0 3px 10px rgba(16, 185, 129, 0.12)' 
                          : isCurrent 
                            ? '0 4px 14px rgba(245, 158, 11, 0.16)' 
                            : '0 2px 8px rgba(217, 119, 6, 0.04)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ flex: 1, fontSize: '1.08rem', lineHeight: 1.6 }}>
                        <strong style={{ 
                          color: isPast ? '#15803D' : isCurrent ? '#B45309' : '#78350F', 
                          fontWeight: 900 
                        }}>
                          {s.label}
                        </strong>{' '}
                        <span style={{ 
                          color: isPast ? '#166534' : isCurrent ? '#78350F' : '#92400E', 
                          fontWeight: isPast ? 700 : 650 
                        }}>
                          {s.text}
                        </span>
                      </div>
                      {isPast && <CheckCircle2 size={22} color="#16A34A" style={{ flexShrink: 0, marginTop: '3px' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Operating Controls */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              paddingTop: '0.9rem',
              borderTop: '1.5px solid #FDE68A'
            }}>
              <div style={{ fontSize: '1.08rem', lineHeight: 1.6 }}>
                <strong style={{ color: (isFlipped || isCompleted) ? '#15803D' : '#78350F', fontWeight: 900 }}>Flip Magnet:</strong>{' '}
                <span style={{ color: (isFlipped || isCompleted) ? '#166534' : '#92400E', fontWeight: 650 }}>
                  Inverts polarity (N ↔ S) to test opposite needle deflections.
                </span>
              </div>
              <div style={{ fontSize: '1.08rem', lineHeight: 1.6 }}>
                <strong style={{ color: isCompleted ? '#15803D' : '#78350F', fontWeight: 900 }}>Drag Magnet:</strong>{' '}
                <span style={{ color: isCompleted ? '#166534' : '#92400E', fontWeight: 650 }}>
                  Freely reposition the bar magnet anywhere around the compass via touch or mouse.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Proceed to Quiz Button (when completed) */}
        {isCompleted && (
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={onNext}
              className="gold-glow-btn"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '18px',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1.12rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                transition: 'all 0.2s ease'
              }}
            >
              Proceed to Quiz <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Nautical Sea Workspace Arena with Vintage Parchment Map Background */}
      <div 
        ref={workspaceRef}
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '2px solid #D97706',
          backgroundImage: `url('/Activity4_6/nautical_map_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.25), 0 8px 32px rgba(6, 78, 59, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none'
        }}
      >
        {/* Top Control Bar across Activity Area (Zero Overlap, Clean Separation) */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 30,
          pointerEvents: 'none',
          gap: '0.75rem'
        }}>
          {/* Left: Live Bearing Badge (Moved Leftside, Fully Visible & Clear of Fullscreen) */}
          <div style={{
            pointerEvents: 'auto',
            background: 'rgba(255, 253, 245, 0.96)',
            border: '1.5px solid #EADBB6',
            borderRadius: '16px',
            padding: '0.45rem 1.05rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#78350F', fontSize: '0.9rem', fontWeight: 900 }}>
              <CompassIcon size={18} color="#D97706" />
              <span>BEARING: <strong style={{ color: '#C2410C' }}>{Math.round((compassAngle % 360 + 360) % 360)}°</strong> {getBearingName(compassAngle)}</span>
            </div>
          </div>

          {/* Right: Fullscreen Button */}
          <div style={{ pointerEvents: 'auto', flexShrink: 0 }}>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                border: '1.5px solid rgba(255, 255, 255, 0.85)',
                borderRadius: '14px',
                padding: '0.45rem 0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#0F172A',
                fontSize: '0.82rem',
                fontWeight: 800,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              {isFullscreen ? <Minimize2 size={15} color="#0F172A" /> : <Maximize2 size={15} color="#0F172A" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Central Arena: Compass + Flat Horizontal Dual-Pole Bar Magnet */}
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
              size={310} 
              onCenterClick={() => setCompassAngle(0)} 
              onClick={() => setCompassAngle(0)} 
            />
          </div>

          {/* 🧲 FLAT HORIZONTAL DUAL-POLE BAR MAGNET [[ N ][ S ]] */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0px)`,
              position: 'absolute',
              cursor: isAnimating ? 'default' : 'grab',
              zIndex: 30,
              userSelect: 'none',
              touchAction: 'none',
              willChange: 'transform'
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              {/* Flat Horizontal 3D Bar Magnet Body */}
              <div 
                onClick={!isAnimating ? handleFlipMagnet : undefined}
                title="Click to Flip Polarity (North ↔ South)"
                style={{
                  width: '140px',
                  height: '46px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'row',
                  overflow: 'hidden',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.65), 0 0 24px rgba(56, 189, 248, 0.35)',
                  border: '2px solid rgba(255,255,255,0.9)',
                  position: 'relative',
                  cursor: isAnimating ? 'default' : 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                {/* Left Half of Magnet */}
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
                  fontSize: '1.25rem',
                  letterSpacing: '1.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                  borderRight: '1.5px solid rgba(255,255,255,0.4)'
                }}>
                  {isFlipped ? 'S' : 'N'}
                </div>

                {/* Central Metallic Chrome Joint Seam */}
                <div style={{
                  width: '6px',
                  height: '100%',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 50%, #475569 100%)',
                  boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5)',
                  zIndex: 2
                }} />

                {/* Right Half of Magnet */}
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
                  fontSize: '1.25rem',
                  letterSpacing: '1.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                  borderLeft: '1.5px solid rgba(255,255,255,0.4)'
                }}>
                  {isFlipped ? 'N' : 'S'}
                </div>

                {/* Top Glass Specular Highlight Sheen */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom-Right Corner Action Controls: "Flip Magnet" & "Run the flow" */}
        <div style={{
          position: 'absolute',
          bottom: '1.25rem',
          right: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 35,
          pointerEvents: 'auto'
        }}>
          {/* Flip Magnet Button */}
          <button
            type="button"
            onClick={handleFlipMagnet}
            disabled={isAnimating}
            title="Flip Magnet Polarity (North ↔ South)"
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1.5px solid #FDE68A',
              color: '#92400E',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              opacity: isAnimating ? 0.6 : 1
            }}
          >
            <RefreshCw size={17} color="#D97706" />
            <span>Flip Magnet</span>
          </button>

          {/* Run the flow Button */}
          <button
            type="button"
            onClick={runFullSequence}
            disabled={isAnimating}
            className="gold-glow-btn"
            style={{
              padding: '0.65rem 1.65rem',
              borderRadius: '16px',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              transition: 'all 0.25s ease',
              opacity: isAnimating ? 0.85 : 1,
              boxShadow: '0 4px 18px rgba(217, 119, 6, 0.45)'
            }}
          >
            <Play size={18} fill="#FFFFFF" color="#FFFFFF" className={isAnimating ? 'animate-pulse' : ''} />
            <span>{isAnimating ? 'Running...' : 'Run the flow'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}