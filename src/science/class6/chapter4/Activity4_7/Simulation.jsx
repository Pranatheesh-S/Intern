import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Compass as CompassIcon,
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import ExactCompass from '../components/ExactCompass.jsx';
import Barrier3DCanvas from './components/Barrier3DCanvas.jsx';

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
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'whoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) { }
}

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

// -------------------------------------------------------------
// 1. Ultra-Realistic 3D Alnico Steel Bar Magnet Component (210px x 62px)
// -------------------------------------------------------------
const MagnetVisual = ({ isFlipped, isTesting }) => (
  <div style={{
    width: '210px',
    height: '62px',
    position: 'relative',
    userSelect: 'none',
    filter: isTesting
      ? 'drop-shadow(0 22px 35px rgba(0,0,0,0.75)) drop-shadow(0 0 20px rgba(56, 189, 248, 0.45))'
      : 'drop-shadow(0 14px 24px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
    transform: isTesting ? 'scale(1.03)' : 'scale(1)',
    transition: 'transform 0.2s ease, filter 0.2s ease'
  }}>
    <svg width="210" height="62" viewBox="0 0 210 62" style={{ overflow: 'visible' }}>
      <defs>
        {/* Soft Dynamic Ground Ambient Shadow */}
        <filter id="magSoftShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
        </filter>

        {/* North Pole (Metallic Lacquered Red) */}
        <linearGradient id="northMetalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA4A4" />
          <stop offset="8%" stopColor="#EF4444" />
          <stop offset="45%" stopColor="#DC2626" />
          <stop offset="75%" stopColor="#B91C1C" />
          <stop offset="92%" stopColor="#7F1D1D" />
          <stop offset="100%" stopColor="#450A0A" />
        </linearGradient>

        {/* South Pole (Metallic Lacquered Cobalt Blue) */}
        <linearGradient id="southMetalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="8%" stopColor="#3B82F6" />
          <stop offset="45%" stopColor="#2563EB" />
          <stop offset="75%" stopColor="#1D4ED8" />
          <stop offset="92%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Polished Nickel Steel Center Band */}
        <linearGradient id="nickelCenterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="85%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* 3D Cylindrical Top Highlight Reflection */}
        <linearGradient id="specularHighlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.65)" />
        </linearGradient>
      </defs>

      {/* Main Bar Magnet Chassis */}
      <g transform={isFlipped ? "rotate(180 105 31)" : ""}>
        {/* Outer Steel Bevel Edge */}
        <rect x="2" y="2" width="206" height="58" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />

        {/* Left Pole (North - Red) */}
        <path d="M 12 4 L 102 4 L 102 58 L 12 58 C 7 58 3 54 3 49 L 3 13 C 3 8 7 4 12 4 Z" fill="url(#northMetalGrad)" />

        {/* Right Pole (South - Blue) */}
        <path d="M 108 4 L 198 4 C 203 4 207 8 207 13 L 207 49 C 207 54 203 58 198 58 L 108 58 Z" fill="url(#southMetalGrad)" />

        {/* Center Polished Nickel Isolation Joint */}
        <rect x="102" y="4" width="6" height="54" fill="url(#nickelCenterGrad)" stroke="#1E293B" strokeWidth="0.8" />
        <line x1="105" y1="4" x2="105" y2="58" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.8" />

        {/* Top Edge Cylindrical Specular Glint */}
        <rect x="8" y="5" width="194" height="4" rx="2" fill="url(#specularHighlight)" opacity="0.45" />

        {/* Bottom Ambient Reflection Rim */}
        <rect x="8" y="54" width="194" height="2" rx="1" fill="#000000" opacity="0.5" />

        {/* North Pole 3D Engraved 'N' Typography */}
        <g transform="translate(52, 33)">
          <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fill="#450A0A" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            N
          </text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            N
          </text>
        </g>

        {/* South Pole 3D Engraved 'S' Typography */}
        <g transform="translate(158, 33)">
          <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fill="#0F172A" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            S
          </text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            S
          </text>
        </g>
      </g>
    </svg>
  </div>
);

const BARRIER_HEIGHT = 420;

// Standard material thickness width calculator for physical clearance & collision
const getMaterialWidth = (type, thickness, stage = 1) => {
  if (type === 'wood' && stage === 4) return 880 + thickness * 20;
  if (type === 'wood') return 360 + thickness * 20;
  if (type === 'cardboard') return 280 + thickness * 20;
  return 240 + thickness * 18;
};

const getMaterialHeight = (type, stage = 1) => {
  if (type === 'wood' && stage === 4) return 560;
  return BARRIER_HEIGHT;
};

// 3D WebGL Material Barrier Visual Renderer
const MaterialBarrierVisual = ({ type, stage = 1, thickness = 1 }) => {
  const isTree = type === 'wood' && stage === 4;
  const width = isTree ? '100%' : getMaterialWidth(type, thickness, stage);
  const height = isTree ? '100%' : getMaterialHeight(type, stage);
  return <Barrier3DCanvas type={type} stage={stage} thickness={thickness} width={width} height={height} />;
};

const STAGE_CONFIG = {
  wood: {
    categoryLabel: 'Wood Types:',
    stages: [
      { stage: 1, label: '1. Paper', fullName: 'Paper Sheet (Wood Cellulose)', icon: '📄' },
      { stage: 2, label: '2. Wood Log', fullName: 'Rustic Timber Log (Wood Piece)', icon: '🪵' },
      { stage: 3, label: '3. Plant', fullName: 'Sprouting Potted Plant (Sapling)', icon: '🌱' },
      { stage: 4, label: '4. Tree', fullName: 'Living Oak Tree (Full Tree)', icon: '🌳' }
    ]
  },
  plastic: {
    categoryLabel: 'Bottle Types:',
    stages: [
      { stage: 1, label: '1. 200mL', fullName: '200 mL Pocket Water Bottle', icon: '🧴' },
      { stage: 2, label: '2. 500mL', fullName: '500 mL Spring Water Bottle', icon: '🧴' },
      { stage: 3, label: '3. 1 Litre', fullName: '1 Litre Sports Water Bottle', icon: '🍶' },
      { stage: 4, label: '4. 20 Litre', fullName: '20 Litre Water Canister Jug', icon: '🛢️' }
    ]
  },
  glass: {
    categoryLabel: 'Glass Types:',
    stages: [
      { stage: 1, label: '1. Small Glass', fullName: 'Small Shot Glass Tumbler', icon: '🥃' },
      { stage: 2, label: '2. Big Glass', fullName: 'Big Highball Glass with Ice', icon: '🥛' },
      { stage: 3, label: '3. Glass Bowl', fullName: 'Curved Pyrex Glass Bowl', icon: '🥣' },
      { stage: 4, label: '4. Container', fullName: 'Glass Storage Container Jar', icon: '🫙' }
    ]
  },
  cardboard: {
    categoryLabel: 'Cardboard Types:',
    stages: [
      { stage: 1, label: '1. Small Box', fullName: 'Small Gift Carton Box', icon: '📦' },
      { stage: 2, label: '2. Sheet', fullName: 'Single-Wall Cardboard Sheet', icon: '📄' },
      { stage: 3, label: '3. 3 Layers', fullName: '3 Layers Cardboard Sheet', icon: '📚' },
      { stage: 4, label: '4. Shipping Box', fullName: 'Large Shipping Cardboard Box', icon: '📦' }
    ]
  }
};

const MATERIALS = [
  { id: 'wood', name: 'Wood & Plant (4 Stages)', materialName: 'Paper ➔ Wood Log ➔ Plant ➔ Tree', icon: '🌳', desc: 'Paper, Wood Log, Plant, and Tree' },
  { id: 'plastic', name: 'PET Plastic Bottle (4 Sizes)', materialName: '200mL ➔ 500mL ➔ 1L ➔ 20L Can', icon: '🧴', desc: 'From pocket bottle to 20L water can' },
  { id: 'glass', name: 'Crystal Glass (4 Vessels)', materialName: 'Small Glass ➔ Big Glass ➔ Bowl ➔ Jar', icon: '🥛', desc: 'Small glass, big tumbler, bowl, and jar' },
  { id: 'cardboard', name: 'Cardboard (4 Types)', materialName: 'Small Box ➔ Sheet ➔ 3 Layers ➔ Carton', icon: '📦', desc: 'Small box, sheets, triple-layer, and carton' }
];

const COMPASS_SIZE = 280;
const COMPASS_RADIUS = 140;

// Exact Red North Needle deflection angles facing North-West (NW) in normal polarity, and North-East (NE) when flipped:
// - Stage 1: Level 1 Maximum Deflection -> Red North needle faces 300° NW (-60°) / when flipped: 60° NE (+60°)
// - Stage 2: Level 2 High Deflection -> Red North needle faces 315° NW (-45°) / when flipped: 45° NE (+45°)
// - Stage 3: Level 3 Moderate Deflection -> Red North needle faces 330° NW (-30°) / when flipped: 30° NE (+30°)
// - Stage 4: Level 4 Subtle Deflection -> Red North needle faces 342° NNW (-18°) / when flipped: 18° NNE (+18°)
const STAGE_DEFLECTIONS = {
  1: { angle: -60, label: 'Level 1: Max Deflection', fieldPower: '95%' },
  2: { angle: -45, label: 'Level 2: High Deflection', fieldPower: '80%' },
  3: { angle: -30, label: 'Level 3: Moderate Deflection', fieldPower: '60%' },
  4: { angle: -18, label: 'Level 4: Subtle Deflection', fieldPower: '35%' }
};

export default function Simulation({ onComplete, onNext }) {
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [materialStages, setMaterialStages] = useState({
    wood: 1,
    plastic: 1,
    glass: 1,
    cardboard: 1
  });
  const [workspaceSize, setWorkspaceSize] = useState({ width: 840, height: 560 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isObjectArrived, setIsObjectArrived] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [needleRotation, setNeedleRotation] = useState(0); // Holds active North needle deflection angle
  const [thickness, setThickness] = useState(1);
  const [observations, setObservations] = useState({
    wood: null,
    cardboard: null,
    plastic: null,
    glass: null
  });

  const [feedback, setFeedback] = useState({
    type: 'info',
    text: '🚀 Starting Auto Demo: Object moving into center position...'
  });

  const workspaceContainerRef = useRef(null);
  const arrivalTimerRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);

  const activeMaterialObj = MATERIALS[selectedMaterialIndex] || MATERIALS[0];
  const activeMaterial = activeMaterialObj.id;
  const currentStage = materialStages[activeMaterial] || 1;

  // Measure dynamic workspace dimensions
  useEffect(() => {
    if (!workspaceContainerRef.current) return;
    const updateSize = () => {
      if (workspaceContainerRef.current) {
        const rect = workspaceContainerRef.current.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 50) {
          setWorkspaceSize({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(workspaceContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Midpoints
  const centerY = workspaceSize.height ? (workspaceSize.height / 2) : 280;
  const centerX = workspaceSize.width ? (workspaceSize.width / 2) : 420;

  // Geometry calculations
  const matWidth = getMaterialWidth(activeMaterial, thickness, currentStage);
  const matHeight = getMaterialHeight(activeMaterial, currentStage);
  const compassX = Math.max(500, workspaceSize.width - COMPASS_RADIUS - 35);
  const magnetX = 145;

  const stageDeflection = STAGE_DEFLECTIONS[currentStage] || STAGE_DEFLECTIONS[1];
  const isTreeStage = activeMaterial === 'wood' && currentStage === 4;

  // Helper to trigger object slide-in and delayed needle deflection
  // The compass needle stays at its current angle and NEVER moves to North-South (0°) while another object is coming
  const triggerObjectArrival = useCallback((targetStageNum, targetMatId = activeMaterial, isAutoMode = isAutoPlaying) => {
    // Clear any previous timers
    if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    // 1. Mark object as transitioning (isObjectArrived = false)
    // NOTE: We do NOT reset needleRotation here, avoiding any unwanted swing back to 0° North-South!
    setIsObjectArrived(false);
    playMagneticSound('whoosh');

    const stageConfigObj = STAGE_CONFIG[targetMatId]?.stages.find(s => s.stage === targetStageNum);
    const stageName = stageConfigObj ? stageConfigObj.fullName : `Stage ${targetStageNum}`;
    const targetDefl = STAGE_DEFLECTIONS[targetStageNum] || STAGE_DEFLECTIONS[1];
    const targetAngle = isFlipped ? -targetDefl.angle : targetDefl.angle;

    setFeedback({
      type: 'info',
      text: `📦 Moving ${stageName} into center station... (North needle holding deflection)`
    });

    arrivalTimerRef.current = setTimeout(() => {
      setIsObjectArrived(true);
      setNeedleRotation(targetAngle); // Smoothly moves North needle directly to new deflection angle
      playMagneticSound('snap');

      const dirName = targetAngle < 0 ? 'North-West (NW)' : 'North-East (NE)';
      const degVal = Math.round(((targetAngle % 360) + 360) % 360);

      setFeedback({
        type: 'success',
        text: `✨ ${stageName} in position! Magnetic field penetrates barrier ➔ Red North Needle points to ${degVal}° ${dirName} (${targetDefl.label})!`
      });

      // Mark observation
      setObservations(prev => {
        const updated = { ...prev, [targetMatId]: 'deflects' };
        const allTested = MATERIALS.every(m => updated[m.id] === 'deflects');
        if (allTested && onComplete) {
          onComplete();
        }
        return updated;
      });

      // 3. If in Auto-Play mode, wait for observation dwell time then auto-advance to next type!
      if (isAutoMode) {
        if (targetStageNum < 4) {
          autoAdvanceTimerRef.current = setTimeout(() => {
            const nextStage = targetStageNum + 1;
            setMaterialStages(prev => ({ ...prev, [targetMatId]: nextStage }));
            triggerObjectArrival(nextStage, targetMatId, true);
          }, 3000); // 3.0s dwell time for clear student observation
        } else {
          // Reached Type 4: auto-tour completed for this material
          autoAdvanceTimerRef.current = setTimeout(() => {
            setIsAutoPlaying(false);
            setFeedback({
              type: 'success',
              text: `🎉 Auto-Demo complete for ${MATERIALS.find(m => m.id === targetMatId)?.name}! All 4 types demonstrate magnetic penetration.`
            });
          }, 3200);
        }
      }
    }, 650); // 650ms slide-in animation duration
  }, [activeMaterial, isAutoPlaying, isFlipped, onComplete]);

  // Initial enter behavior: automatically run from Type 1 to Type 4
  useEffect(() => {
    // Start at Type 1 for wood on entry
    setMaterialStages(prev => ({ ...prev, [activeMaterial]: 1 }));
    setIsAutoPlaying(true);
    triggerObjectArrival(1, activeMaterial, true);

    return () => {
      if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []); // Run once on mount

  // Handle Manual Material Switching
  const handleSelectObject = (idx) => {
    if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    setSelectedMaterialIndex(idx);
    const selectedMat = MATERIALS[idx];
    const targetStage = 1; // Start from type 1 when switching material
    setMaterialStages(prev => ({ ...prev, [selectedMat.id]: targetStage }));
    setIsAutoPlaying(true); // Auto-advance types 1 to 4 for new material
    triggerObjectArrival(targetStage, selectedMat.id, true);
  };

  // Handle Next Object Button
  const handleNextObject = () => {
    const nextIdx = (selectedMaterialIndex + 1) % MATERIALS.length;
    handleSelectObject(nextIdx);
  };

  // Handle Manual Stage/Type Button Click (e.g. 1. Paper, 2. Wood Log, 3. Plant, 4. Tree)
  const handleSelectStage = (stage) => {
    if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    setIsAutoPlaying(false); // Switch to manual observation
    setMaterialStages(prev => ({ ...prev, [activeMaterial]: stage }));
    triggerObjectArrival(stage, activeMaterial, false);
  };

  // Toggle Auto-Demo Play/Pause
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      // Pause
      if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      setIsAutoPlaying(false);
      setFeedback({
        type: 'info',
        text: '⏸ Auto-Demo paused. Click any stage to test manually or resume Auto-Demo.'
      });
    } else {
      // Resume / Start 1 -> 4
      setIsAutoPlaying(true);
      const startStage = currentStage >= 4 ? 1 : currentStage;
      setMaterialStages(prev => ({ ...prev, [activeMaterial]: startStage }));
      triggerObjectArrival(startStage, activeMaterial, true);
    }
  };

  // Replay from Type 1 to 4
  const handleReplayDemo = () => {
    if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    setIsAutoPlaying(true);
    setMaterialStages(prev => ({ ...prev, [activeMaterial]: 1 }));
    triggerObjectArrival(1, activeMaterial, true);
  };

  const flipMagnet = () => {
    playMagneticSound('snap');
    setIsFlipped(prev => {
      const nextFlipped = !prev;
      const targetDefl = STAGE_DEFLECTIONS[currentStage] || STAGE_DEFLECTIONS[1];
      // In [N][S] (nextFlipped === false): angle is negative -> North-West (NW)
      // In [S][N] (nextFlipped === true): angle is positive -> North-East (NE)
      const newAngle = nextFlipped ? -targetDefl.angle : targetDefl.angle;
      setNeedleRotation(newAngle);

      const dirName = newAngle < 0 ? 'North-West (NW)' : 'North-East (NE)';
      const degVal = Math.round(((newAngle % 360) + 360) % 360);
      const polarityLabel = nextFlipped ? '[S][N]' : '[N][S]';

      setFeedback({
        type: 'info',
        text: `🔄 Flipped to ${polarityLabel}! Red North Needle now faces ${degVal}° in ${dirName}.`
      });

      return nextFlipped;
    });
  };

  const handleReset = () => {
    if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    setIsFlipped(false);
    setThickness(1);
    setSelectedMaterialIndex(0);
    setNeedleRotation(0);
    setMaterialStages({ wood: 1, plastic: 1, glass: 1, cardboard: 1 });
    setObservations({ wood: null, cardboard: null, plastic: null, glass: null });
    setIsAutoPlaying(true);
    triggerObjectArrival(1, 'wood', true);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

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
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const allCompleted = MATERIALS.every(m => observations[m.id] === 'deflects');

  return (
    <div style={{
      padding: '0.65rem',
      display: 'grid',
      gridTemplateColumns: '430px 1fr',
      gap: '1.25rem',
      height: '100%',
      minHeight: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
      position: 'relative'
    }}>

      {/* Left Column: Automatic Object Selection & Testing Hub */}
      <div className="custom-scroll" style={{
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
        backdropFilter: 'blur(14px)',
        borderRadius: '24px',
        border: '1.5px solid #FDE68A',
        padding: '1.5rem 1.45rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
        zIndex: 10,
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', height: '100%', justifyContent: 'space-between' }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={32} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.65rem', color: '#064E3B', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Material Barrier Testing
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: '1.14rem', color: '#065F46', lineHeight: 1.55, fontWeight: 600 }}>
              Watch the objects automatically advance from <strong>Type 1 to Type 4</strong>. The <strong>Red North Needle</strong> alone deflects to the specified direction upon each object's arrival, maintaining its steady position during object transitions.
            </p>
          </div>

          {/* Material Barrier Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, justifyContent: 'space-around', margin: '0.25rem 0' }}>
            {MATERIALS.map((mat, idx) => {
              const isSelected = selectedMaterialIndex === idx;
              const isObserved = observations[mat.id] === 'deflects';

              return (
                <button
                  key={mat.id}
                  onClick={() => handleSelectObject(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.15rem',
                    borderRadius: '18px',
                    border: isSelected ? '2.5px solid #F59E0B' : '1.5px solid #FDE68A',
                    background: isSelected ? '#FEF3C7' : '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 6px 18px rgba(245, 158, 11, 0.22)' : '0 2px 8px rgba(217, 119, 6, 0.04)',
                    transition: 'all 0.25s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#F59E0B';
                      e.currentTarget.style.background = '#FFFBEB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#FDE68A';
                      e.currentTarget.style.background = '#FFFFFF';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: isSelected ? '#FDE68A' : '#FEF3C7',
                      border: isSelected ? '2px solid #F59E0B' : '1.5px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.7rem',
                      flexShrink: 0
                    }}>
                      {mat.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.08rem', color: isSelected ? '#92400E' : '#064E3B' }}>
                        {mat.name}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>
                        {mat.materialName}
                      </div>
                    </div>
                  </div>

                  {isObserved ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 900, color: '#15803D', background: '#DCFCE7', padding: '6px 12px', borderRadius: '12px', border: '1.5px solid #86EFAC' }}>
                      <CheckCircle2 size={15} color="#16A34A" /> Tested
                    </span>
                  ) : isSelected ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#92400E', background: '#FDE68A', padding: '6px 12px', borderRadius: '12px', border: '1.5px solid #F59E0B' }}>
                      Testing (1-4)
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#94A3B8', padding: '5px 10px' }}>
                      Ready
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Summary & Proceed Action when all tested */}
          {allCompleted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.35rem' }}>
              {/* Highlighted Inline Scientific Takeaway Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
                border: '2px solid #10B981',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#047857', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Scientific Conclusion 💡
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#065F46',
                  lineHeight: 1.4
                }}>
                  Magnetic force easily penetrates through non-magnetic objects: Wood, Plastic, Glass, and Cardboard!
                </p>
              </div>

              <button
                onClick={onNext}
                className="gold-glow-btn"
                style={{
                  width: '100%',
                  padding: '0.95rem 1.4rem',
                  borderRadius: '16px',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={18} /> Proceed to Concept Check <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Ocean Themed Interactive Stage */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem', height: '100%', minHeight: 0 }}>

        {/* Top Header Stage Bar */}
        <div style={{
          padding: '0.5rem 0.9rem',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {/* Dynamic 4-Part Evolution / Size Switcher for Active Material */}
          {STAGE_CONFIG[activeMaterial] && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '20px',
              border: '1.5px solid #FDE68A',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)'
            }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 900, color: '#92400E', padding: '0 4px' }}>
                {STAGE_CONFIG[activeMaterial].categoryLabel}
              </span>
              {STAGE_CONFIG[activeMaterial].stages.map(s => {
                const isCurrent = currentStage === s.stage;
                return (
                  <button
                    key={s.stage}
                    onClick={() => handleSelectStage(s.stage)}
                    title={s.fullName}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: 900,
                      borderRadius: '14px',
                      border: isCurrent ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                      background: isCurrent ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' : '#F8FAFC',
                      color: isCurrent ? '#92400E' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: isCurrent ? '0 2px 6px rgba(245, 158, 11, 0.25)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Auto-Demo Tour Control & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              onClick={toggleAutoPlay}
              className={isAutoPlaying ? "gold-glow-btn" : ""}
              title={isAutoPlaying ? "Pause Auto-Tour (1 to 4)" : "Start Auto-Tour (1 to 4)"}
              style={{
                padding: '0.42rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                borderRadius: '16px',
                border: isAutoPlaying ? 'none' : '1.5px solid #F59E0B',
                background: isAutoPlaying ? undefined : '#FFFBEB',
                color: isAutoPlaying ? '#FFFFFF' : '#92400E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease'
              }}
            >
              {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isAutoPlaying ? 'Pause Demo' : 'Play Auto (1➔4)'}
            </button>

            <button
              onClick={flipMagnet}
              style={{
                padding: '0.42rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                borderRadius: '16px',
                border: isFlipped ? '1.5px solid #93C5FD' : '1.5px solid #FDE68A',
                background: isFlipped ? '#EFF6FF' : '#FEF3C7',
                color: isFlipped ? '#1D4ED8' : '#92400E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={13} /> {isFlipped ? 'Flip: [S][N] (NE)' : 'Flip: [N][S] (NW)'}
            </button>
          </div>
        </div>

        {/* Deep Ocean Interactive Workspace */}
        <div
          id="simulation-workspace"
          ref={workspaceContainerRef}
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            borderRadius: '20px',
            overflow: 'hidden',
            border: '2px solid #A7F3D0',
            background: 'radial-gradient(ellipse at center, #1E3A8A 0%, #0F172A 100%)',
            boxShadow: 'inset 0 0 70px rgba(0,0,0,0.5)'
          }}
        >
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

          {/* Draggable / Fixed Objects Stage */}
          <div style={{ position: 'absolute', inset: 0 }}>

            {/* Center Material Barrier Visual - Automatically Slides in from Left Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeMaterial}-${currentStage}`}
                initial={{ x: -280, opacity: 0, scale: 0.85 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 280, opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', damping: 22, stiffness: 200 }}
                style={{
                  position: 'absolute',
                  left: isTreeStage ? 0 : centerX - (matWidth / 2),
                  top: isTreeStage ? 0 : centerY - (matHeight / 2),
                  width: isTreeStage ? '100%' : undefined,
                  height: isTreeStage ? '100%' : undefined,
                  zIndex: 15,
                  pointerEvents: 'none'
                }}
              >
                <MaterialBarrierVisual type={activeMaterial} stage={currentStage} thickness={thickness} />
              </motion.div>
            </AnimatePresence>

            {/* Stationary Compass on Right Side with Smooth Red North Needle Deflection */}
            <div 
              style={{ 
                position: 'absolute', 
                left: isTreeStage ? compassX - COMPASS_RADIUS - 10 : compassX - COMPASS_RADIUS, 
                top: isTreeStage ? centerY + 175 - COMPASS_RADIUS : centerY - COMPASS_RADIUS,
                transform: isTreeStage ? 'scale(0.55)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 20, 
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              <ExactCompass rotation={needleRotation} size={COMPASS_SIZE} />
            </div>

            {/* Left Bar Magnet (Stationary Fixed Position) */}
            <div 
              style={{ 
                position: 'absolute', 
                left: isTreeStage ? magnetX - 70 : magnetX - 105, 
                top: isTreeStage ? centerY + 175 - 31 : centerY - 31,
                transform: isTreeStage ? 'scale(0.55)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 25, 
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={flipMagnet}
              title={`Click to flip magnet polarity (${isFlipped ? '[S][N] ➔ [N][S]' : '[N][S] ➔ [S][N]'})`}
            >
              <MagnetVisual isFlipped={isFlipped} isTesting={true} />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}