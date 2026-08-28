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
const MaterialBarrierVisual = ({ type, thickness = 1 }) => {
  const width = getMaterialWidth(type, thickness);
  const height = BARRIER_HEIGHT;
  return <Barrier3DCanvas type={type} thickness={thickness} width={width} height={height} />;
};

const MATERIALS = [
  { id: 'wood', name: 'Living Oak Tree', materialName: 'Wood (Natural Oak)', icon: '🌳', desc: 'Natural organic tree barrier' },
  { id: 'plastic', name: 'PET Plastic Bottle', materialName: 'Plastic (PET Polymer)', icon: '🧴', desc: 'Molded beverage bottle' },
  { id: 'glass', name: 'Crystal Glass Tumbler', materialName: 'Glass (Crystal Silicate)', icon: '🥛', desc: 'Heavy-base glass vessel' },
  { id: 'cardboard', name: 'Corrugated Shipping Box', materialName: 'Cardboard (Kraft Fiber)', icon: '📦', desc: 'Heavy-duty carton box' }
];

const ACTION_POPUP_DATA = {
  1: {
    step: 1,
    title: "Action 1: Select a Barrier Object",
    badge: "Step 1 of 5",
    icon: "🌳",
    instruction: "Choose any material on the left panel (Living Oak Tree, PET Bottle, Crystal Glass, or Cardboard Box). It will slide directly into the center testing zone!",
    actionPrompt: "Click an object card on the left panel",
    btnLabel: "Got it! Selecting Object ➔"
  },
  2: {
    step: 2,
    title: "Action 2: Drag the Bar Magnet Closer",
    badge: "Step 2 of 5",
    icon: "🧲",
    instruction: "Grab and drag the Bar Magnet on the left toward the central object barrier to see if magnetic field lines pass through it.",
    actionPrompt: "Drag the magnet toward the center",
    btnLabel: "Got it! Dragging Magnet ➔"
  },
  3: {
    step: 3,
    title: "Action 3: Observe & Flip Poles",
    badge: "Step 3 of 5",
    icon: "🔄",
    instruction: "Notice the compass needle deflected! Now click 'Flip Magnet' (or double-click the magnet) to test reverse magnetic poles (N ↔ S).",
    actionPrompt: "Click 'Flip Magnet' to invert deflection",
    btnLabel: "Got it! Flipping Poles ➔"
  },
  4: {
    step: 4,
    title: "Action 4: Adjust Barrier Thickness",
    badge: "Step 4 of 5",
    icon: "📏",
    instruction: "Try sliding the 'Barrier Thickness' slider (1 to 5) to observe how the object scales in 3D while the compass automatically adjusts safe clearance.",
    actionPrompt: "Move the thickness slider",
    btnLabel: "Got it! Adjusting Thickness ➔"
  },
  5: {
    step: 5,
    title: "Action 5: Test Remaining Objects",
    badge: "Step 5 of 5",
    icon: "📦",
    instruction: "Great! Now click 'Next Object ➔' to test the other 3 materials. Once all 4 are tested, you'll review the key scientific takeaway and advance to the Concept Check!",
    actionPrompt: "Click 'Next Object' to continue testing",
    btnLabel: "Got it! Testing Next Object ➔"
  }
};

const COMPASS_SIZE = 280;
const COMPASS_RADIUS = 140;
const MIN_OBJECT_COMPASS_GAP = 55;
const MIN_MAGNET_GAP = 30;

export default function Simulation({ onComplete, onNext }) {
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [workspaceSize, setWorkspaceSize] = useState({ width: 840, height: 560 });
  const [magnetX, setMagnetX] = useState(135);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [thickness, setThickness] = useState(1);
  const [observations, setObservations] = useState({
    wood: null,
    cardboard: null,
    plastic: null,
    glass: null
  });
  const [showTakeawayModal, setShowTakeawayModal] = useState(false);
  const [currentActionStep, setCurrentActionStep] = useState(1);
  const [showActionModal, setShowActionModal] = useState(true);

  const workspaceContainerRef = useRef(null);
  const actionTimeoutRef = useRef(null);
  const takeawayTimeoutRef = useRef(null);

  const activeMaterialObj = MATERIALS[selectedMaterialIndex];
  const activeMaterial = activeMaterialObj ? activeMaterialObj.id : 'wood';

  // Helper to trigger the next action popup with a clean 2-second delay
  const triggerNextActionStep = (nextStep, delay = 2000) => {
    setCurrentActionStep(nextStep);
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      setShowActionModal(true);
    }, delay);
  };

  // Helper to trigger the takeaway conclusion popup with a 2-second delay
  const triggerTakeawayModal = (delay = 2000) => {
    if (takeawayTimeoutRef.current) clearTimeout(takeawayTimeoutRef.current);
    takeawayTimeoutRef.current = setTimeout(() => {
      setShowTakeawayModal(true);
    }, delay);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
      if (takeawayTimeoutRef.current) clearTimeout(takeawayTimeoutRef.current);
    };
  }, []);

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
  const obstacleHalfWidth = activeMaterial === 'wood' ? (42 + thickness * 5) : activeMaterial === 'cardboard' ? (48 + thickness * 6) : (38 + thickness * 5);
  const barrierRightEdge = centerX + obstacleHalfWidth;
  const barrierLeftEdge = centerX - obstacleHalfWidth;

  // Compass dynamic placement with auto gap
  const targetRightCompassX = workspaceSize.width - COMPASS_RADIUS - 35;
  const dynamicCompassX = Math.max(barrierRightEdge + MIN_OBJECT_COMPASS_GAP + COMPASS_RADIUS, targetRightCompassX);

  // Maximum Magnet Approach X (allows dragging right up close to the tree barrier)
  const maxMagnetX = Math.min(centerX - obstacleHalfWidth - 15 - 105, 270);

  const getNeedleRotation = (mX, mY, cX, cY, flipped) => {
    const magnetTipX = mX + 105; // Right pole tip of magnet facing compass
    const distToCompass = Math.max(60, cX - magnetTipX);

    // Normal resting needle is at 0 degrees.
    // As the magnet approaches the non-magnetic tree barrier, the field penetrates through it,
    // vigorously deflecting the compass needle!
    const maxDeflection = flipped ? -72 : 72;
    
    // Proximity factor: 0 when far (dist > 580), smoothly scaling to 1.0 when close to barrier
    const proximity = Math.max(0, Math.min(1, (580 - distToCompass) / 320));
    const smoothFactor = Math.sin((proximity * Math.PI) / 2); // Smooth sinusoidal ease-in-out
    
    return maxDeflection * smoothFactor;
  };

  // Update needle angle on state changes
  useEffect(() => {
    setNeedleRotation(getNeedleRotation(magnetX, centerY, dynamicCompassX, centerY, isFlipped));
  }, [magnetX, centerY, dynamicCompassX, isFlipped]);

  // Handle Automatic Object Testing
  const handleTestCurrentObject = () => {
    setIsTesting(true);
    // Glide magnet smoothly toward object
    const targetX = maxMagnetX;
    setMagnetX(targetX);

    setTimeout(() => {
      // Record observation
      const updated = { ...observations, [activeMaterial]: 'deflects' };
      setObservations(updated);
      setFeedback({
        type: 'success',
        text: `✨ Magnetic field passed directly through ${activeMaterialObj.name}! Compass needle deflected!`
      });
      setIsTesting(false);

      if (currentActionStep === 2) {
        triggerNextActionStep(3, 2000);
      }

      // Check if all tested -> open center pop-up takeaway modal after 2 seconds
      const allTested = MATERIALS.every(m => updated[m.id] === 'deflects');
      if (allTested) {
        if (onComplete) onComplete();
        triggerTakeawayModal(2000);
      }
    }, 700);
  };

  // Switch to next object
  const handleNextObject = () => {
    const nextIdx = (selectedMaterialIndex + 1) % MATERIALS.length;
    setSelectedMaterialIndex(nextIdx);
    setMagnetX(120);
    setFeedback(null);
  };

  // Select specific object
  const handleSelectObject = (idx) => {
    setSelectedMaterialIndex(idx);
    setMagnetX(120);
    setFeedback(null);
    if (currentActionStep === 1) {
      triggerNextActionStep(2, 2000);
    }
  };

  const isDraggingRef = useRef(false);
  const [isManualDragging, setIsManualDragging] = useState(false);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsManualDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !workspaceContainerRef.current) return;
    const rect = workspaceContainerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const minX = 90;
    const clampedX = Math.max(minX, Math.min(maxMagnetX, clientX));
    setMagnetX(clampedX);

    // If dragged close to the barrier, trigger deflection observation
    if (clampedX >= maxMagnetX - 45) {
      if (observations[activeMaterial] !== 'deflects') {
        const updated = { ...observations, [activeMaterial]: 'deflects' };
        setObservations(updated);
        setFeedback({
          type: 'success',
          text: `✨ Magnetic field passed directly through ${activeMaterialObj.name}! Compass needle deflected!`
        });

        const allTested = MATERIALS.every(m => updated[m.id] === 'deflects');
        if (allTested) {
          if (onComplete) onComplete();
          triggerTakeawayModal(2000);
        }
      }

      if (currentActionStep === 2) {
        triggerNextActionStep(3, 2000);
      }
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    setIsManualDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const flipMagnet = () => {
    setIsFlipped(prev => !prev);
    if (currentActionStep === 3) {
      triggerNextActionStep(4, 2000);
    }
  };

  const handleThicknessChange = (newVal) => {
    setThickness(newVal);
    if (currentActionStep === 4) {
      triggerNextActionStep(5, 2000);
    }
  };

  const handleReset = () => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    if (takeawayTimeoutRef.current) clearTimeout(takeawayTimeoutRef.current);
    setMagnetX(135);
    setIsFlipped(false);
    setFeedback(null);
    setThickness(1);
    setSelectedMaterialIndex(0);
    setObservations({ wood: null, cardboard: null, plastic: null, glass: null });
    setCurrentActionStep(1);
    setShowActionModal(true);
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

          {/* Bottom Proceed Action when all tested */}
          {allCompleted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.4rem' }}>
              <button
                onClick={() => setShowTakeawayModal(true)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '14px',
                  border: '1.5px solid #FDE68A',
                  background: '#FFFFFF',
                  color: '#92400E',
                  fontWeight: 900,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.12)'
                }}
              >
                💡 View Key Scientific Takeaway
              </button>

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
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{activeMaterialObj.icon}</span>
            <span style={{ fontWeight: 800, color: '#064E3B', fontSize: '0.88rem' }}>
              Current Center Barrier: <strong>{activeMaterialObj.name}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setShowActionModal(true)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                borderRadius: '18px',
                border: '1.5px solid #FCD34D',
                background: '#FFFBEB',
                color: '#92400E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.15)'
              }}
            >
              💡 Action Step {currentActionStep} Guide
            </button>
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
            gap: '0.6rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#78350F', fontSize: '0.82rem', fontWeight: 900 }}>
              <CompassIcon size={16} color="#D97706" />
              <span>BEARING: <strong style={{ color: '#C2410C' }}>{Math.round((needleRotation % 360 + 360) % 360)}°</strong> {getBearingName(needleRotation)}</span>
            </div>
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
                key={activeMaterial}
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
                <MaterialBarrierVisual type={activeMaterial} thickness={thickness} />
              </motion.div>
            </AnimatePresence>

            {/* Fixed Magnetic Compass on Right Side (Auto-Positioned & Maintaining Gap) */}
            <motion.div 
              initial={false}
              animate={{ left: dynamicCompassX - COMPASS_RADIUS, top: centerY - COMPASS_RADIUS }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              style={{ 
                position: 'absolute', 
                zIndex: 20, 
                pointerEvents: 'none' 
              }}
            >
              <ExactCompass rotation={needleRotation} size={COMPASS_SIZE} />
            </motion.div>

            {/* Left Bar Magnet (Manually Draggable with Mouse/Touch) */}
            <motion.div 
              animate={{ left: magnetX - 105, top: centerY - 31 }}
              transition={isManualDragging ? { duration: 0 } : { type: 'spring', damping: 28, stiffness: 180 }}
              style={{ 
                position: 'absolute', 
                zIndex: 25, 
                cursor: isManualDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none'
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onDoubleClick={flipMagnet}
              title="Drag magnet left & right manually to test field penetration. Double-click to flip poles."
            >
              <MagnetVisual isFlipped={isFlipped} isTesting={isTesting || isManualDragging} />
            </motion.div>

            {/* Dynamic Magnetic Penetration Beam when magnet approaches */}
            {magnetX > 180 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{
                  position: 'absolute',
                  left: magnetX + 105,
                  top: centerY - 20,
                  width: Math.max(0, dynamicCompassX - COMPASS_RADIUS - (magnetX + 105)),
                  height: 40,
                  background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.3) 0%, rgba(56, 189, 248, 0.4) 50%, rgba(59, 130, 246, 0.3) 100%)',
                  borderRadius: '20px',
                  filter: 'blur(8px)',
                  pointerEvents: 'none',
                  zIndex: 12
                }}
              />
            )}

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

      {/* Focused Individual Action Pop-up Modal (Appears before each action) */}
      <AnimatePresence>
        {showActionModal && ACTION_POPUP_DATA[currentActionStep] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99998,
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '26px',
                padding: '2.2rem 2.4rem',
                maxWidth: '520px',
                width: '100%',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                border: '2px solid #A7F3D0',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
                position: 'relative'
              }}
            >
              {/* Header Badge and Dismiss */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  color: '#047857',
                  background: '#ECFDF5',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: '1px solid #A7F3D0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {ACTION_POPUP_DATA[currentActionStep].badge}
                </span>

                <button
                  onClick={() => setShowActionModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Close hint"
                >
                  Dismiss ✕
                </button>
              </div>

              {/* Icon & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '1.5px solid #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  flexShrink: 0
                }}>
                  {ACTION_POPUP_DATA[currentActionStep].icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.24rem', fontWeight: 900, color: '#064E3B' }}>
                    {ACTION_POPUP_DATA[currentActionStep].title}
                  </h3>
                </div>
              </div>

              {/* Instruction Box */}
              <div style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '1.1rem 1.25rem',
                color: '#334155',
                fontSize: '0.94rem',
                lineHeight: 1.55,
                fontWeight: 600
              }}>
                {ACTION_POPUP_DATA[currentActionStep].instruction}
              </div>

              {/* Action Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#92400E',
                background: '#FEF3C7',
                padding: '0.55rem 0.85rem',
                borderRadius: '12px',
                border: '1px solid #FCD34D'
              }}>
                <span>👉 Action:</span>
                <span>{ACTION_POPUP_DATA[currentActionStep].actionPrompt}</span>
              </div>

              {/* Action Proceed Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="gold-glow-btn"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.6rem',
                    borderRadius: '25px',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {ACTION_POPUP_DATA[currentActionStep].btnLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Pop-up Modal: Key Science Takeaway */}
      <AnimatePresence>
        {showTakeawayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.78)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.82, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '28px',
                padding: '2.5rem 2.75rem',
                maxWidth: '580px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                border: '2.5px solid #A7F3D0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                position: 'relative'
              }}
            >
              {/* Top Sparkle Icon */}
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                border: '2px solid #F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
              }}>
                <Sparkles size={34} color="#D97706" />
              </div>

              {/* Title */}
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#047857', textTransform: 'uppercase', letterSpacing: '1px', background: '#ECFDF5', padding: '4px 12px', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                  Scientific Conclusion 💡
                </span>
                <h2 style={{ margin: '0.6rem 0 0 0', color: '#064E3B', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Attraction & Magnetic Induction
                </h2>
              </div>

              {/* Highlighted Banner with User's Exact Takeaway */}
              <div style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
                border: '2px solid #10B981',
                borderRadius: '20px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.15)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '1.18rem',
                  fontWeight: 900,
                  color: '#065F46',
                  lineHeight: 1.45,
                  letterSpacing: '-0.01em'
                }}>
                  Remember: Magnetic induction passes through wood, glass, plastic, and cardboard.
                </p>
              </div>

              {/* 4 Materials Quick Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                width: '100%'
              }}>
                {MATERIALS.map(m => (
                  <div key={m.id} style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '0.6rem 0.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1E293B' }}>{m.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#15803D' }}>Passed ✓</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.4rem' }}>
                <button
                  onClick={() => setShowTakeawayModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    borderRadius: '25px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Review Lab
                </button>

                <button
                  onClick={() => {
                    setShowTakeawayModal(false);
                    if (onNext) onNext();
                  }}
                  className="gold-glow-btn"
                  style={{
                    flex: 1.4,
                    padding: '0.95rem',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Proceed to Concept Check <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}