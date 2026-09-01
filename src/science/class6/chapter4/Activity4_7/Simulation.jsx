import React, { useState, useEffect, useRef } from 'react';
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
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import ExactCompass from '../components/ExactCompass.jsx';
import Barrier3DCanvas from './components/Barrier3DCanvas.jsx';

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

// Helper: Calculate angle between two points
const calculateAngle = (cx, cy, px, py) => {
  const dy = py - cy;
  const dx = px - cx;
  let theta = Math.atan2(dy, dx);
  return theta * (180 / Math.PI);
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

/* -------------------------------------------------------------
   3D Photorealistic WebGL Material Barrier Components:
   - Wood = Living Oak Tree with Multi-Tier Foliage & Roots
   - Plastic = Molded PET Spring Water Bottle with Bubbles & Cap
   - Glass = Heavy-Base Crystal Glass Tumbler with Water & Ice
   - Cardboard = Corrugated Kraft Shipping Carton Box with Tape & Stamps
-------------------------------------------------------------- */

const BARRIER_HEIGHT = 420;

// Standard material thickness width calculator for physical clearance & collision
const getMaterialWidth = (type, thickness) => {
  if (type === 'wood') return 360 + thickness * 20;
  if (type === 'cardboard') return 280 + thickness * 20;
  return 240 + thickness * 18;
};

// 3D WebGL Material Barrier Visual Renderer
const MaterialBarrierVisual = ({ type, stage = 1, thickness = 1 }) => {
  const width = getMaterialWidth(type, thickness);
  const height = BARRIER_HEIGHT;
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
const MIN_OBJECT_COMPASS_GAP = 55;
const MIN_MAGNET_GAP = 30;

// Exact needle deflection angles matching user reference images:
// - Stage 1 (Image 1): Level 1 Maximum Deflection (Red tip at 258° / Blue tip at 78°) -> Angle -102°
// - Stage 2 (Image 2): Level 2 High Deflection (Red tip at 236° / Blue tip at 56°) -> Angle -124°
// - Stage 3 (Image 3): Level 3 Moderate Deflection (Red tip at 215° / Blue tip at 35°) -> Angle -145°
// - Stage 4 (Image 4): Level 4 Subtle Deflection (Red tip at 195° / Blue tip at 15°) -> Angle -165°
const STAGE_DEFLECTIONS = {
  1: { angle: -102, label: 'Level 1: Max Deflection', fieldPower: '95%' },
  2: { angle: -124, label: 'Level 2: High Deflection', fieldPower: '80%' },
  3: { angle: -145, label: 'Level 3: Moderate Deflection', fieldPower: '60%' },
  4: { angle: -165, label: 'Level 4: Subtle Deflection', fieldPower: '35%' }
};

export default function Simulation({ onComplete, onNext }) {
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [materialStages, setMaterialStages] = useState({
    wood: 1,
    plastic: 2,
    glass: 2,
    cardboard: 4
  });
  const [workspaceSize, setWorkspaceSize] = useState({ width: 840, height: 560 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState({
    type: 'success',
    text: `✨ Magnetic field passes directly through Paper Sheet! Needle deflected to Level 1!`
  });
  const [thickness, setThickness] = useState(1);
  const [observations, setObservations] = useState({
    wood: 'deflects',
    cardboard: null,
    plastic: null,
    glass: null
  });

  const workspaceContainerRef = useRef(null);

  const activeMaterialObj = MATERIALS[selectedMaterialIndex] || MATERIALS[0];
  const activeMaterial = activeMaterialObj.id;
  const currentStage = materialStages[activeMaterial] || 1;

  // Measure dynamic workspace dimensions to ensure 100% perfect vertical centering
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
  const matWidth = getMaterialWidth(activeMaterial, thickness);

  // Completely fixed, stationary compass position on the right side
  const compassX = Math.max(500, workspaceSize.width - COMPASS_RADIUS - 35);

  // Completely fixed, stationary magnet position on the left side (Non-draggable)
  const magnetX = 145;

  // Dynamic needle deflection based on active stage level (1 to 4) & magnetic pole flip
  const stageDeflection = STAGE_DEFLECTIONS[currentStage] || STAGE_DEFLECTIONS[1];
  const needleRotation = isFlipped ? -stageDeflection.angle : stageDeflection.angle;

  // Switch to next object
  const handleNextObject = () => {
    const nextIdx = (selectedMaterialIndex + 1) % MATERIALS.length;
    handleSelectObject(nextIdx);
  };

  // Select specific object
  const handleSelectObject = (idx) => {
    setSelectedMaterialIndex(idx);
    const selectedMat = MATERIALS[idx];
    const targetStage = materialStages[selectedMat.id] || 1;
    const stageInfo = STAGE_CONFIG[selectedMat.id]?.stages.find(s => s.stage === targetStage);
    const stageName = stageInfo ? stageInfo.fullName : selectedMat.name;
    const targetDefl = STAGE_DEFLECTIONS[targetStage] || STAGE_DEFLECTIONS[1];

    setFeedback({
      type: 'success',
      text: `✨ Magnetic field passes through ${stageName}! Needle deflected (${targetDefl.label})!`
    });
    setObservations(prev => {
      const updated = { ...prev, [selectedMat.id]: 'deflects' };
      const allTested = MATERIALS.every(m => updated[m.id] === 'deflects');
      if (allTested && onComplete) {
        onComplete();
      }
      return updated;
    });
  };

  const handleSelectStage = (stage) => {
    setMaterialStages(prev => ({ ...prev, [activeMaterial]: stage }));
    const stageInfo = STAGE_CONFIG[activeMaterial]?.stages.find(s => s.stage === stage);
    const stageName = stageInfo ? stageInfo.fullName : 'Object';
    const targetDefl = STAGE_DEFLECTIONS[stage] || STAGE_DEFLECTIONS[1];
    setFeedback({
      type: 'success',
      text: `✨ Magnetic field passes through ${stageName}! Needle deflected (${targetDefl.label})!`
    });
  };

  const flipMagnet = () => {
    setIsFlipped(prev => !prev);
  };

  const handleThicknessChange = (newVal) => {
    setThickness(newVal);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setFeedback(null);
    setThickness(1);
    setSelectedMaterialIndex(0);
    setMaterialStages({ wood: 1, plastic: 2, glass: 2, cardboard: 4 });
    setObservations({ wood: 'deflects', cardboard: null, plastic: null, glass: null });
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
        padding: '1.75rem 1.65rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
        zIndex: 10,
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', height: '100%', justifyContent: 'space-between' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={32} color="#D97706" />
                <h3 style={{ margin: 0, fontSize: '1.52rem', color: '#064E3B', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Material Barrier Testing
                </h3>
              </div>
              <span style={{ fontSize: '0.88rem', background: '#DCFCE7', color: '#15803D', padding: '5px 12px', borderRadius: '14px', fontWeight: 900, border: '1.5px solid #86EFAC' }}>
                Auto-Slide
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '1.05rem', color: '#065F46', lineHeight: 1.6, fontWeight: 600 }}>
              Select an object to slide it into the center. Observe how the magnetic field passes through each non-magnetic barrier to deflect the compass needle.
            </p>
          </div>

          {/* Material Barrier Cards List (Expanded & Larger Typography) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', flex: 1, justifyContent: 'space-around', margin: '0.35rem 0' }}>
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
                    padding: '1.15rem 1.35rem',
                    borderRadius: '20px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: isSelected ? '#FDE68A' : '#FEF3C7',
                      border: isSelected ? '2px solid #F59E0B' : '1.5px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      flexShrink: 0
                    }}>
                      {mat.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.2rem', color: isSelected ? '#92400E' : '#064E3B' }}>
                        {mat.name}
                      </div>
                      <div style={{ fontSize: '0.94rem', color: '#64748B', fontWeight: 700, marginTop: '3px' }}>
                        {mat.materialName}
                      </div>
                    </div>
                  </div>

                  {isObserved ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 900, color: '#15803D', background: '#DCFCE7', padding: '7px 14px', borderRadius: '14px', border: '1.5px solid #86EFAC' }}>
                      <CheckCircle2 size={17} color="#16A34A" /> Deflects
                    </span>
                  ) : isSelected ? (
                    <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#92400E', background: '#FDE68A', padding: '7px 14px', borderRadius: '14px', border: '1.5px solid #F59E0B' }}>
                      Active Object
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#94A3B8', padding: '6px 12px' }}>
                      Ready to Test
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Summary & Proceed Action when all tested */}
          {allCompleted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {/* Highlighted Inline Scientific Takeaway Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
                border: '2px solid #10B981',
                borderRadius: '18px',
                padding: '1rem 1.15rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#047857', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Scientific Conclusion 💡
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  color: '#065F46',
                  lineHeight: 1.45
                }}>
                  Remember: Magnetic induction passes through wood, glass, plastic, and cardboard.
                </p>
              </div>

              <button
                onClick={onNext}
                className="gold-glow-btn"
                style={{
                  width: '100%',
                  padding: '1.05rem 1.6rem',
                  borderRadius: '18px',
                  fontSize: '1.12rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={20} /> Proceed to Concept Check <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Ocean Themed Interactive Stage */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem', height: '100%', minHeight: 0 }}>
        
        {/* Top Header Stage Bar */}
        <div style={{ 
          padding: '0.5rem 1rem', 
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{activeMaterialObj.icon}</span>
            <span style={{ fontWeight: 800, color: '#064E3B', fontSize: '0.88rem' }}>
              Barrier: <strong>{activeMaterialObj.name}</strong>
            </span>
          </div>

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={flipMagnet}
              className="gold-glow-btn"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 900,
                borderRadius: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <RotateCcw size={13} /> Flip Magnet
            </button>
            <button
              onClick={handleNextObject}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                borderRadius: '18px',
                border: '1.5px solid #A7F3D0',
                background: '#ECFDF5',
                color: '#065F46',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              Next Object <ChevronRight size={14} />
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
          {/* Compass Live Bearing Tag */}
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
            gap: '0.75rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#78350F', fontSize: '0.82rem', fontWeight: 900 }}>
              <CompassIcon size={16} color="#D97706" />
              <span>BEARING: <strong style={{ color: '#C2410C' }}>{Math.round((needleRotation % 360 + 360) % 360)}°</strong> {getBearingName(needleRotation)}</span>
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              color: '#92400E',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 900,
              border: '1px solid #F59E0B'
            }}>
              {stageDeflection.label}
            </span>
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

          {/* Horizontal Axis Guide Line */}
          <div style={{
            position: 'absolute',
            top: `${centerY}px`,
            left: '5%',
            right: '5%',
            height: '1px',
            borderTop: '1px dashed rgba(56, 189, 248, 0.25)',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          {/* Draggable / Fixed Objects Stage */}
          <div style={{ position: 'absolute', inset: 0 }}>
            
            {/* Center Material Barrier Visual - Automatically Slides in from Left Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeMaterial}-${currentStage}`}
                initial={{ x: -280, opacity: 0, scale: 0.85 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 280, opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                style={{
                  position: 'absolute',
                  left: centerX - (matWidth / 2),
                  top: centerY - (BARRIER_HEIGHT / 2),
                  zIndex: 15,
                  pointerEvents: 'none'
                }}
              >
                <MaterialBarrierVisual type={activeMaterial} stage={currentStage} thickness={thickness} />
              </motion.div>
            </AnimatePresence>

            {/* Completely Fixed Stationary Compass on Right Side (Non-draggable & Non-moving) */}
            <div 
              style={{ 
                position: 'absolute', 
                left: compassX - COMPASS_RADIUS, 
                top: centerY - COMPASS_RADIUS,
                zIndex: 20, 
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              <ExactCompass rotation={needleRotation} size={COMPASS_SIZE} />
            </div>

            {/* Left Bar Magnet (Stationary Fixed Position - Non-draggable & Non-moving) */}
            <div 
              style={{ 
                position: 'absolute', 
                left: magnetX - 105, 
                top: centerY - 31,
                zIndex: 25, 
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={flipMagnet}
              title="Click or use 'Flip Magnet' to reverse magnetic poles (N ↔ S)"
            >
              <MagnetVisual isFlipped={isFlipped} isTesting={true} />
            </div>

            {/* Dynamic Magnetic Penetration Beam through barrier */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 0.75, 0.35] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              style={{
                position: 'absolute',
                left: magnetX + 105,
                top: centerY - 20,
                width: Math.max(0, compassX - COMPASS_RADIUS - (magnetX + 105)),
                height: 40,
                background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.3) 0%, rgba(56, 189, 248, 0.4) 50%, rgba(59, 130, 246, 0.3) 100%)',
                borderRadius: '20px',
                filter: 'blur(8px)',
                pointerEvents: 'none',
                zIndex: 12
              }}
            />

          </div>

          {/* In-situ Feedback Alert */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#FFFFFF',
                  color: feedback.type === 'success' ? '#065F46' : '#1E3A8A',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '25px',
                  border: `2px solid ${feedback.type === 'success' ? '#10B981' : '#3B82F6'}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  zIndex: 30,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}