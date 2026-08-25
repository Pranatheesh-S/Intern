import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Pointer, 
  Compass as CompassIcon,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  DndContext, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  TouchSensor, 
  useDraggable, 
  useDroppable, 
  DragOverlay 
} from '@dnd-kit/core';
import ExactCompass from '../components/ExactCompass.jsx';

const FIXED_Y = 270; // Strictly locked horizontal drag line

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
const MagnetVisual = ({ isFlipped, isDragging }) => (
  <div style={{ 
    width: '210px', 
    height: '62px', 
    position: 'relative',
    userSelect: 'none',
    filter: isDragging 
      ? 'drop-shadow(0 22px 35px rgba(0,0,0,0.75)) drop-shadow(0 0 20px rgba(56, 189, 248, 0.45))' 
      : 'drop-shadow(0 14px 24px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
    transform: isDragging ? 'scale(1.03)' : 'scale(1)',
    transition: 'transform 0.15s ease, filter 0.15s ease'
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
          {/* Debossed Shadow */}
          <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fill="#450A0A" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            N
          </text>
          {/* Main White Emboss */}
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            N
          </text>
        </g>

        {/* South Pole 3D Engraved 'S' Typography */}
        <g transform="translate(158, 33)">
          {/* Debossed Shadow */}
          <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fill="#0F172A" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            S
          </text>
          {/* Main White Emboss */}
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
            S
          </text>
        </g>
      </g>
    </svg>
  </div>
);

const DraggableMagnet = ({ isFlipped, onDoubleClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'bar_magnet' });
  return (
    <div 
      ref={setNodeRef} 
      style={{ opacity: isDragging ? 0 : 1, zIndex: 25, cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }} 
      {...listeners} 
      {...attributes} 
      onDoubleClick={onDoubleClick}
    >
      <MagnetVisual isFlipped={isFlipped} isDragging={false} />
    </div>
  );
};

const SidebarDraggableCompass = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'sidebar_compass' });
  return (
    <div ref={setNodeRef} style={{ opacity: isDragging ? 0 : 1, zIndex: 10, cursor: 'grab', touchAction: 'none' }} {...listeners} {...attributes}>
      <ExactCompass rotation={0} size={100} />
    </div>
  );
};

const SidebarDraggableMagnet = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'sidebar_magnet' });
  return (
    <div ref={setNodeRef} style={{ opacity: isDragging ? 0 : 1, zIndex: 10, cursor: 'grab', touchAction: 'none' }} {...listeners} {...attributes}>
      <MagnetVisual isFlipped={false} isDragging={false} />
    </div>
  );
};

/* -------------------------------------------------------------
   Ultra-Realistic 3D Material Barrier Components:
   - Wood = Natural Organic Oak Tree Log with Authentic Bark & Growth Rings
   - Plastic = Translucent Molded PET Water Bottle with Spring Water
   - Glass = Heavy-Base Crystal Glass Tumbler with Water Meniscus
   - Cardboard = Heavy-Duty Corrugated Kraft Shipping Carton with Tape & Stamps
-------------------------------------------------------------- */

// 1. Natural Organic Wood Log
const TreeWoodVisual = ({ thickness }) => {
  const width = 68 + thickness * 16;
  const height = 280;
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.6)) drop-shadow(0 4px 10px rgba(0,0,0,0.4))'
    }}>
      {/* Nature Badge */}
      <div style={{
        position: 'absolute',
        top: '-26px',
        background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
        color: '#FFFFFF',
        padding: '4px 12px',
        borderRadius: '14px',
        fontSize: '11px',
        fontWeight: 900,
        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        border: '1.5px solid #86EFAC',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 5,
        whiteSpace: 'nowrap'
      }}>
        🌲 Wood (Oak Log)
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          {/* Cylindrical Bark Shading */}
          <linearGradient id="barkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2A1204" />
            <stop offset="12%" stopColor="#57280B" />
            <stop offset="35%" stopColor="#854114" />
            <stop offset="60%" stopColor="#9C4D18" />
            <stop offset="85%" stopColor="#5E2A0B" />
            <stop offset="100%" stopColor="#250F03" />
          </linearGradient>

          {/* End-grain Heartwood Rings Gradient */}
          <radialGradient id="woodRings" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="20%" stopColor="#FDE68A" />
            <stop offset="45%" stopColor="#D97706" />
            <stop offset="70%" stopColor="#B45309" />
            <stop offset="90%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#3E1A04" />
          </radialGradient>

          {/* Bottom Root Shadow Gradient */}
          <linearGradient id="bottomShadowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
          </linearGradient>
        </defs>

        {/* Tree Trunk Vertical Body */}
        <rect x="2" y="20" width={width - 4} height={height - 40} fill="url(#barkGrad)" rx="8" stroke="#1C0901" strokeWidth="1.5" />

        {/* Deep Organic Furrowed Bark Crevices */}
        <line x1={width * 0.22} y1="28" x2={width * 0.22} y2={height - 28} stroke="#1A0A02" strokeWidth="2.5" strokeDasharray="30 12 45 8" opacity="0.85" />
        <line x1={width * 0.45} y1="36" x2={width * 0.45} y2={height - 36} stroke="#381504" strokeWidth="2" strokeDasharray="40 18 25 14" opacity="0.75" />
        <line x1={width * 0.72} y1="26" x2={width * 0.72} y2={height - 26} stroke="#150802" strokeWidth="3" strokeDasharray="25 15 50 10" opacity="0.9" />
        <line x1={width * 0.86} y1="38" x2={width * 0.86} y2={height - 38} stroke="#150802" strokeWidth="1.8" strokeDasharray="35 20" opacity="0.8" />

        {/* Natural Tree Knot Hole */}
        <g transform={`translate(${width * 0.55}, ${height * 0.52})`}>
          <ellipse cx="0" cy="0" rx="9" ry="16" fill="#1C0901" stroke="#451A03" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="6" ry="11" fill="#0E0400" />
          <path d="M -12 -18 Q 0 -22 12 -18 Q 14 0 10 18 Q 0 22 -10 18 Z" fill="none" stroke="#682A09" strokeWidth="1.5" opacity="0.8" />
        </g>

        {/* Moss/Lichen flecks near bottom */}
        <ellipse cx={width * 0.3} cy={height - 35} rx="8" ry="14" fill="#166534" opacity="0.4" />
        <ellipse cx={width * 0.7} cy={height - 42} rx="6" ry="10" fill="#15803D" opacity="0.35" />

        {/* Bottom Ambient Shadow Overlap */}
        <rect x="2" y={height - 60} width={width - 4} height="40" fill="url(#bottomShadowGrad)" rx="8" />

        {/* Top Cross-Section Wood Rings Face */}
        <ellipse cx={width / 2} cy="20" rx={width / 2 - 2} ry="16" fill="url(#woodRings)" stroke="#451A03" strokeWidth="2.5" />
        <ellipse cx={width / 2} cy="20" rx={width * 0.38} ry="12" fill="none" stroke="#92400E" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
        <ellipse cx={width / 2} cy="20" rx={width * 0.26} ry="8" fill="none" stroke="#78350F" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.75" />
        <ellipse cx={width / 2} cy="20" rx={width * 0.14} ry="4.5" fill="none" stroke="#92400E" strokeWidth="1.2" opacity="0.7" />
        <circle cx={width / 2 - 1} cy="20" r="2.5" fill="#451A03" />

        {/* Radial Heartwood Fissure Crack */}
        <path d={`M ${width/2 - 1} 20 L ${width * 0.8} 14`} stroke="#2B1103" strokeWidth="1.5" />
        <path d={`M ${width/2 - 1} 20 L ${width * 0.25} 24`} stroke="#2B1103" strokeWidth="1.2" />

        {/* Outer Top Bark Rim Edge */}
        <ellipse cx={width / 2} cy="20" rx={width / 2 - 2} ry="16" fill="none" stroke="#250F03" strokeWidth="3" strokeDasharray="18 4" />
      </svg>
    </div>
  );
};

// 2. Ultra-Realistic Translucent PET Plastic Water Bottle
const PlasticBottleVisual = ({ thickness }) => {
  const width = 68 + thickness * 14;
  const height = 280;
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 16px 32px rgba(14, 165, 233, 0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.35))'
    }}>
      {/* Plastic Badge */}
      <div style={{
        position: 'absolute',
        top: '-26px',
        background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
        color: '#FFFFFF',
        padding: '4px 12px',
        borderRadius: '14px',
        fontSize: '11px',
        fontWeight: 900,
        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        border: '1.5px solid #7DD3FC',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 5,
        whiteSpace: 'nowrap'
      }}>
        🧴 Plastic (PET Bottle)
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          {/* Realistic Translucent Glassy PET Plastic Shading */}
          <linearGradient id="petPlasticGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="12%" stopColor="rgba(186, 230, 253, 0.45)" />
            <stop offset="40%" stopColor="rgba(56, 189, 248, 0.2)" />
            <stop offset="70%" stopColor="rgba(14, 165, 233, 0.35)" />
            <stop offset="90%" stopColor="rgba(186, 230, 253, 0.65)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
          </linearGradient>

          {/* Pure Spring Water Volume */}
          <linearGradient id="springWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.55)" />
            <stop offset="40%" stopColor="rgba(14, 165, 233, 0.75)" />
            <stop offset="100%" stopColor="rgba(2, 132, 199, 0.9)" />
          </linearGradient>

          {/* Ribbed Blue Cap */}
          <linearGradient id="bottleCapGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="35%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Foil Mineral Water Brand Label */}
          <linearGradient id="brandLabelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Blue Ribbed Bottle Cap */}
        <rect x={width / 2 - 13} y="8" width="26" height="20" rx="3" fill="url(#bottleCapGrad)" stroke="#0369A1" strokeWidth="1.2" />
        {/* Cap Grip Ribs */}
        <line x1={width/2 - 9} y1="10" x2={width/2 - 9} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
        <line x1={width/2 - 4} y1="10" x2={width/2 - 4} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
        <line x1={width/2 + 1} y1="10" x2={width/2 + 1} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
        <line x1={width/2 + 6} y1="10" x2={width/2 + 6} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
        {/* Tamper Security Ring */}
        <rect x={width / 2 - 14} y="28" width="28" height="5" rx="1.5" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />

        {/* Pure Water Filling Lower 75% of Bottle */}
        <path d={`M ${width/2 - 16} 78 Q ${width/2} 75 ${width/2 + 16} 78 L ${width - 6} 95 L ${width - 6} ${height - 24} Q ${width/2} ${height - 10} 6 ${height - 24} L 6 95 Z`}
          fill="url(#springWaterGrad)" />

        {/* Effervescent Rising Bubbles inside Water */}
        <circle cx={width * 0.38} cy={height * 0.65} r="2.5" fill="#FFFFFF" opacity="0.75" />
        <circle cx={width * 0.42} cy={height * 0.55} r="1.8" fill="#FFFFFF" opacity="0.65" />
        <circle cx={width * 0.62} cy={height * 0.72} r="2.2" fill="#FFFFFF" opacity="0.7" />
        <circle cx={width * 0.55} cy={height * 0.45} r="1.5" fill="#FFFFFF" opacity="0.8" />

        {/* Contoured PET Outer Bottle Shell */}
        <path d={`M ${width/2 - 14} 33 L ${width/2 + 14} 33 L ${width/2 + 18} 55 L ${width - 5} 90 L ${width - 5} ${height - 22} Q ${width/2} ${height - 8} 5 ${height - 22} L 5 90 L ${width/2 - 18} 55 Z`}
          fill="url(#petPlasticGrad)" stroke="#38BDF8" strokeWidth="2" />

        {/* Mineral Spring Water Wrap Label */}
        <g transform={`translate(6, ${height * 0.38})`}>
          <rect x="0" y="0" width={width - 12} height="58" rx="4" fill="url(#brandLabelGrad)" opacity="0.95" stroke="#60A5FA" strokeWidth="1" />
          {/* Mountain Graphic */}
          <path d={`M ${width/2 - 18} 34 L ${width/2 - 6} 14 L ${width/2 + 6} 34 Z`} fill="#FFFFFF" opacity="0.35" />
          <path d={`M ${width/2 - 4} 34 L ${width/2 + 8} 10 L ${width/2 + 20} 34 Z`} fill="#FFFFFF" opacity="0.5" />
          <text x={(width - 12) / 2} y="38" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="1.2">
            PURE WATER
          </text>
          <text x={(width - 12) / 2} y="49" fill="#93C5FD" fontSize="7" fontWeight="800" textAnchor="middle" letterSpacing="0.8">
            100% RECYCLED PET
          </text>
        </g>

        {/* Ergonomic Grip Grooves (Horizontal Reinforcement Rings) */}
        <path d={`M 9 ${height * 0.68} Q ${width/2} ${height * 0.66} ${width - 9} ${height * 0.68}`} stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" />
        <path d={`M 9 ${height * 0.76} Q ${width/2} ${height * 0.74} ${width - 9} ${height * 0.76}`} stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" />
        <path d={`M 9 ${height * 0.84} Q ${width/2} ${height * 0.82} ${width - 9} ${height * 0.84}`} stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" />

        {/* Razor-Sharp Left Specular Highlight Glint */}
        <path d={`M 10 95 L 14 95 L 14 ${height - 30} L 10 ${height - 30} Z`} fill="#FFFFFF" opacity="0.75" />
      </svg>
    </div>
  );
};

// 3. Ultra-Realistic Heavy-Base Crystal Glass Tumbler
const WaterGlassVisual = ({ thickness }) => {
  const width = 68 + thickness * 14;
  const height = 280;
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 16px 34px rgba(56, 189, 248, 0.5)) drop-shadow(0 4px 12px rgba(0,0,0,0.35))'
    }}>
      {/* Glass Badge */}
      <div style={{
        position: 'absolute',
        top: '-26px',
        background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
        color: '#FFFFFF',
        padding: '4px 12px',
        borderRadius: '14px',
        fontSize: '11px',
        fontWeight: 900,
        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        border: '1.5px solid #BAE6FD',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 5,
        whiteSpace: 'nowrap'
      }}>
        🥛 Crystal Glass
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          {/* Pure Crystal Glass Refraction */}
          <linearGradient id="crystalGlassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="15%" stopColor="rgba(224, 242, 254, 0.45)" />
            <stop offset="50%" stopColor="rgba(56, 189, 248, 0.12)" />
            <stop offset="85%" stopColor="rgba(186, 230, 253, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
          </linearGradient>

          {/* Sparkling Fresh Water */}
          <linearGradient id="waterCausticGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.65)" />
            <stop offset="60%" stopColor="rgba(14, 165, 233, 0.85)" />
            <stop offset="100%" stopColor="rgba(2, 132, 199, 0.95)" />
          </linearGradient>

          {/* Heavy Crystal Base Gradient */}
          <linearGradient id="heavyBaseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="50%" stopColor="rgba(186, 230, 253, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
          </linearGradient>
        </defs>

        {/* Fresh Water Column Inside Tumbler */}
        <path d={`M 11 92 L ${width - 11} 92 L ${width - 14} ${height - 35} Q ${width/2} ${height - 24} 14 ${height - 35} Z`}
          fill="url(#waterCausticGrad)" />

        {/* Curved Surface Water Meniscus */}
        <ellipse cx={width / 2} cy="92" rx={width / 2 - 11} ry="9" fill="rgba(224, 242, 254, 0.85)" stroke="#FFFFFF" strokeWidth="1" />

        {/* 3D Floating Ice Cube Inside Water */}
        <g transform={`translate(${width/2 - 12}, 108)`}>
          <rect x="0" y="0" width="24" height="24" rx="4" fill="rgba(255,255,255,0.75)" stroke="#BAE6FD" strokeWidth="1.5" />
          <path d="M 0 0 L 16 -6 L 36 -6 L 24 0 Z" fill="rgba(255,255,255,0.9)" />
          <path d="M 24 0 L 36 -6 L 36 18 L 24 24 Z" fill="rgba(186,230,253,0.8)" />
        </g>

        {/* Heavy Solid Crystal Base */}
        <path d={`M 12 ${height - 38} L ${width - 12} ${height - 38} L ${width - 10} ${height - 18} Q ${width/2} ${height - 6} 10 ${height - 18} Z`}
          fill="url(#heavyBaseGrad)" stroke="#E0F2FE" strokeWidth="2.5" />
        {/* Crystal Base Internal Prismatic Facet Line */}
        <line x1="16" y1={height - 28} x2={width - 16} y2={height - 28} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />

        {/* Outer Crystal Glass Tumbler Shell */}
        <path d={`M 6 28 L ${width - 6} 28 L ${width - 10} ${height - 18} Q ${width/2} ${height - 6} 10 ${height - 18} Z`}
          fill="url(#crystalGlassGrad)" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Smooth Rounded Top Crystal Rim */}
        <ellipse cx={width / 2} cy="28" rx={width / 2 - 6} ry="9" fill="none" stroke="#FFFFFF" strokeWidth="3" />

        {/* Left Vertical High-Gloss Specular Reflection */}
        <path d={`M 12 38 L 18 38 L 21 ${height - 40} L 15 ${height - 40} Z`} fill="rgba(255,255,255,0.85)" />
        {/* Right Soft Specular Highlight */}
        <path d={`M ${width - 18} 38 L ${width - 14} 38 L ${width - 17} ${height - 40} L ${width - 21} ${height - 40} Z`} fill="rgba(255,255,255,0.4)" />
      </svg>
    </div>
  );
};

// 4. Ultra-Realistic Heavy-Duty Corrugated Kraft Cardboard Box
const CardboardBoxVisual = ({ thickness }) => {
  const width = 68 + thickness * 16;
  const height = 280;
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.6)) drop-shadow(0 4px 10px rgba(0,0,0,0.4))'
    }}>
      {/* Cardboard Badge */}
      <div style={{
        position: 'absolute',
        top: '-26px',
        background: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
        color: '#FFFFFF',
        padding: '4px 12px',
        borderRadius: '14px',
        fontSize: '11px',
        fontWeight: 900,
        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        border: '1.5px solid #FDE68A',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 5,
        whiteSpace: 'nowrap'
      }}>
        📦 Cardboard Box
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          {/* Natural Corrugated Kraft Fiber Shading */}
          <linearGradient id="kraftCardboardGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="15%" stopColor="#B45309" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Realistic High-Gloss Golden Packaging Tape */}
          <linearGradient id="packagingTapeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A16207" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
        </defs>

        {/* Main Corrugated Kraft Carton Body */}
        <rect x="4" y="20" width={width - 8} height={height - 40} fill="url(#kraftCardboardGrad)" rx="8" stroke="#78350F" strokeWidth="2.5" />

        {/* Corrugated Vertical Fluting Lines */}
        {Array.from({ length: Math.floor((width - 16) / 9) }).map((_, i) => (
          <line key={i} x1={12 + i * 9} y1="24" x2={12 + i * 9} y2={height - 24} stroke="#78350F" strokeWidth="1.2" opacity="0.45" />
        ))}

        {/* Top and Bottom Folded Flap Crease Lines */}
        <line x1="4" y1="42" x2={width - 4} y2="42" stroke="#451A03" strokeWidth="2" strokeDasharray="6 3" />
        <line x1="4" y1={height - 42} x2={width - 4} y2={height - 42} stroke="#451A03" strokeWidth="2" strokeDasharray="6 3" />

        {/* Center Golden Packaging Tape Seam */}
        <rect x={width / 2 - 12} y="18" width="24" height={height - 36} fill="url(#packagingTapeGrad)" opacity="0.9" rx="2" stroke="#854D0E" strokeWidth="1" />
        <line x1={width / 2 - 6} y1="18" x2={width / 2 - 6} y2={height - 18} stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

        {/* Fragile Glass Stamp Icon */}
        <g transform={`translate(${width/2 - 16}, ${height/2 - 40})`} opacity="0.9">
          <rect x="-4" y="-4" width="40" height="48" rx="4" fill="rgba(0,0,0,0.12)" />
          {/* Wine Glass Icon */}
          <path d="M 12 8 L 20 8 L 20 18 Q 16 24 16 26 L 16 32 L 22 32 L 22 34 L 10 34 L 10 32 L 16 32 L 16 26 Q 12 24 12 18 Z" fill="#451A03" />
          <line x1="16" y1="10" x2="16" y2="16" stroke="#451A03" strokeWidth="1" />
        </g>

        {/* Barcode Shipping Sticker */}
        <rect x={width / 2 - 20} y={height - 95} width="40" height="26" fill="#FFFBEB" rx="3" stroke="#92400E" strokeWidth="1" />
        {/* Barcode Lines */}
        <line x1={width/2 - 16} y1={height - 90} x2={width/2 - 16} y2={height - 76} stroke="#451A03" strokeWidth="2.5" />
        <line x1={width/2 - 11} y1={height - 90} x2={width/2 - 11} y2={height - 76} stroke="#451A03" strokeWidth="1" />
        <line x1={width/2 - 7} y1={height - 90} x2={width/2 - 7} y2={height - 76} stroke="#451A03" strokeWidth="2" />
        <line x1={width/2 - 1} y1={height - 90} x2={width/2 - 1} y2={height - 76} stroke="#451A03" strokeWidth="1.5" />
        <line x1={width/2 + 5} y1={height - 90} x2={width/2 + 5} y2={height - 76} stroke="#451A03" strokeWidth="3" />
        <line x1={width/2 + 11} y1={height - 90} x2={width/2 + 11} y2={height - 76} stroke="#451A03" strokeWidth="1.2" />
        <line x1={width/2 + 15} y1={height - 90} x2={width/2 + 15} y2={height - 76} stroke="#451A03" strokeWidth="2" />
        <text x={width/2} y={height - 72} fill="#78350F" fontSize="6" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
          FRAGILE 047
        </text>
      </svg>
    </div>
  );
};

// Material barrier renderer
const MaterialBarrierVisual = ({ type, thickness = 1 }) => {
  if (type === 'wood') return <TreeWoodVisual thickness={thickness} />;
  if (type === 'plastic') return <PlasticBottleVisual thickness={thickness} />;
  if (type === 'glass') return <WaterGlassVisual thickness={thickness} />;
  if (type === 'cardboard') return <CardboardBoxVisual thickness={thickness} />;
  return null;
};

export default function Simulation({ onComplete, onNext }) {
  const [step, setStep] = useState(1);
  const [magnetPos, setMagnetPos] = useState({ x: 180, y: FIXED_Y });
  const [compassPos, setCompassPos] = useState({ x: 570, y: FIXED_Y });
  const [isFlipped, setIsFlipped] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [thickness, setThickness] = useState(1);
  const [observations, setObservations] = useState({
    wood: null,
    cardboard: null,
    plastic: null,
    glass: null
  });

  // Fixed X anchors
  const FIXED_COMPASS_X = 580;
  const FIXED_BARRIER_X = 380;

  // When barrier or thickness changes, only adjust magnet if it overlaps the fixed barrier
  useEffect(() => {
    if (activeMaterial) {
      const matWidth = 64 + thickness * 16;
      const maxMX = FIXED_BARRIER_X - (matWidth / 2) - 110;
      if (magnetPos.x > maxMX) {
        setMagnetPos({ x: maxMX, y: FIXED_Y });
        setNeedleRotation(getNeedleRotation(maxMX, FIXED_Y, FIXED_COMPASS_X, FIXED_Y, isFlipped));
      }
    }
  }, [activeMaterial, thickness]);

  const handleObservation = (material, result) => {
    const newObservations = { ...observations, [material]: result };
    setObservations(newObservations);

    if (step === 3) {
      const allCorrect = Object.values(newObservations).every(val => val === 'deflects');
      if (allCorrect) {
        setFeedback({ type: 'success', text: '✅ Great job! Non-magnetic materials do not block magnetic field lines!' });
        setTimeout(() => { setStep(4); setFeedback(null); }, 1500);
      } else {
        const isFull = Object.values(newObservations).every(val => val !== null);
        if (isFull && !allCorrect) {
          setFeedback({ type: 'info', text: 'Remember: Magnetic induction passes through wood, glass, plastic, and cardboard.' });
        }
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const { setNodeRef: setWorkspaceRef } = useDroppable({ id: 'workspace' });

  // Strictly horizontal modifier: only the bar magnet moves, strictly bounded before barrier / compass
  const distanceModifier = ({ transform, active }) => {
    if (!active || active.id !== 'bar_magnet') return transform;

    const minX = 115;
    const matWidth = 64 + thickness * 16;
    const maxMagnetX = activeMaterial 
      ? (FIXED_BARRIER_X - matWidth / 2 - 110) 
      : (FIXED_COMPASS_X - 145 - 110);

    let newX = magnetPos.x + transform.x;
    newX = Math.max(minX, Math.min(maxMagnetX, newX));

    return {
      x: newX - magnetPos.x,
      y: FIXED_Y - magnetPos.y, // Lock Y to FIXED_Y strictly
    };
  };

  const getNeedleRotation = (mX, mY, cX, cY, flipped) => {
    const magnetWidth = 210;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = FIXED_Y;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const minDist = Math.min(distN, distS);

    if (minDist > 550) return 0;

    const angleToN = calculateAngle(cX, cY, nPoleX, poleY);
    const angleToS = calculateAngle(cX, cY, sPoleX, poleY);

    let targetAngle = distN < distS ? angleToN + 90 : angleToS - 90;
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;

    const deflectionFactor = Math.max(0, Math.min(1, 1 - (minDist - 180) / 320));
    return targetAngle * deflectionFactor;
  };

  const handleDragStart = (event) => setActiveDragId(event.active.id);

  const handleDragMove = (event) => {
    const { active, delta } = event;
    if (active.id === 'bar_magnet') {
      const minX = 115;
      const matWidth = 64 + thickness * 16;
      const maxMagnetX = activeMaterial 
        ? (FIXED_BARRIER_X - matWidth / 2 - 110) 
        : (FIXED_COMPASS_X - 145 - 110);

      const mX = Math.max(minX, Math.min(maxMagnetX, magnetPos.x + delta.x));
      setNeedleRotation(getNeedleRotation(mX, FIXED_Y, FIXED_COMPASS_X, FIXED_Y, isFlipped));
    }
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    const { active, delta } = event;

    if (active.id === 'sidebar_compass') {
      setStep(2);
      return;
    }
    if (active.id === 'sidebar_magnet') {
      setStep(3);
      return;
    }

    if (active.id === 'bar_magnet') {
      const minX = 115;
      const matWidth = 64 + thickness * 16;
      const maxMagnetX = activeMaterial 
        ? (FIXED_BARRIER_X - matWidth / 2 - 110) 
        : (FIXED_COMPASS_X - 145 - 110);

      const newMX = Math.max(minX, Math.min(maxMagnetX, magnetPos.x + delta.x));
      setMagnetPos({ x: newMX, y: FIXED_Y });
      setNeedleRotation(getNeedleRotation(newMX, FIXED_Y, FIXED_COMPASS_X, FIXED_Y, isFlipped));
    }
  };

  const flipMagnet = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    setNeedleRotation(getNeedleRotation(magnetPos.x, FIXED_Y, FIXED_COMPASS_X, FIXED_Y, newFlipped));
  };

  const handleReset = () => {
    setMagnetPos({ x: 180, y: FIXED_Y });
    setCompassPos({ x: FIXED_COMPASS_X, y: FIXED_Y });
    setIsFlipped(false);
    setNeedleRotation(0);
    setFeedback(null);
    setActiveMaterial(null);
    setThickness(1);
    setObservations({ wood: null, cardboard: null, plastic: null, glass: null });
    setStep(1);
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

  useEffect(() => {
    if (step === 4 && onComplete) onComplete();
  }, [step, onComplete]);

  return (
    <DndContext sensors={sensors} modifiers={[distanceModifier]} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{
        padding: '0.5rem',
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: '1rem',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        
        {/* Left Column: Activity Step Instructions matching Activity 4.6 structure & color */}
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
                Activity 4.7 Steps
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Step 1 */}
              <div
                style={{
                  padding: '0.9rem 1.05rem',
                  borderRadius: '14px',
                  background: step === 1 ? '#FEF3C7' : step > 1 ? '#ECFDF5' : '#F8FAFC',
                  border: `2px solid ${step === 1 ? '#F59E0B' : step > 1 ? '#10B981' : '#E2E8F0'}`,
                  boxShadow: step === 1 ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: step === 1 ? '#92400E' : step > 1 ? '#065F46' : '#475569' }}>
                    Step 1: Get Compass
                  </span>
                  {step > 1 && <CheckCircle2 size={18} color="#10B981" />}
                </div>
                <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                  Take a magnetic compass and a bar magnet.
                </p>
                {step === 1 && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', padding: '0.6rem', background: '#FEF3C7', borderRadius: '12px', border: '2px dashed #D97706' }}>
                    <div style={{ fontSize: '0.78rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800 }}>
                      <Pointer size={14} /> Drag into workspace
                    </div>
                    <SidebarDraggableCompass />
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div
                style={{
                  padding: '0.9rem 1.05rem',
                  borderRadius: '14px',
                  background: step === 2 ? '#FEF3C7' : step > 2 ? '#ECFDF5' : '#F8FAFC',
                  border: `2px solid ${step === 2 ? '#F59E0B' : step > 2 ? '#10B981' : '#E2E8F0'}`,
                  boxShadow: step === 2 ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: step === 2 ? '#92400E' : step > 2 ? '#065F46' : '#475569' }}>
                    Step 2: Place Magnet
                  </span>
                  {step > 2 && <CheckCircle2 size={18} color="#10B981" />}
                </div>
                <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                  Place compass on surface. Observe it resting towards North.
                </p>
                {step === 2 && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', padding: '0.6rem', background: '#FEF3C7', borderRadius: '12px', border: '2px dashed #D97706' }}>
                    <div style={{ fontSize: '0.78rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800 }}>
                      <Pointer size={14} /> Drag into workspace
                    </div>
                    <SidebarDraggableMagnet />
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div
                style={{
                  padding: '0.9rem 1.05rem',
                  borderRadius: '14px',
                  background: step === 3 ? '#FEF3C7' : step > 3 ? '#ECFDF5' : '#F8FAFC',
                  border: `2px solid ${step === 3 ? '#F59E0B' : step > 3 ? '#10B981' : '#E2E8F0'}`,
                  boxShadow: step === 3 ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: step === 3 ? '#92400E' : step > 3 ? '#065F46' : '#475569' }}>
                    Step 3: Test Barriers
                  </span>
                  {step > 3 && <CheckCircle2 size={18} color="#10B981" />}
                </div>
                <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                  Place non-magnetic materials between magnet and compass. Test deflection.
                </p>
                {step === 3 && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
                      {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                        <button
                          key={mat}
                          onClick={() => setActiveMaterial(activeMaterial === mat ? null : mat)}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeMaterial === mat ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
                            color: activeMaterial === mat ? '#ffffff' : '#334155',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                          }}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>

                    {activeMaterial && (
                      <div style={{ background: '#F8FAFC', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155' }}>
                          Barrier Thickness: {thickness}
                        </label>
                        <input 
                          type="range" 
                          min="1" 
                          max="5" 
                          value={thickness} 
                          onChange={(e) => setThickness(Number(e.target.value))} 
                          style={{ width: '100%', cursor: 'pointer', accentColor: '#D97706' }} 
                        />
                      </div>
                    )}

                    {/* Observation Table */}
                    <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', background: '#F1F5F9', padding: '0.35rem 0.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#475569' }}>
                        <div>Material</div>
                        <div style={{ textAlign: 'center' }}>Deflects</div>
                        <div style={{ textAlign: 'center' }}>Blocked</div>
                      </div>
                      {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                        <div key={mat} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '0.3rem 0.5rem', fontSize: '0.75rem', borderTop: '1px solid #F1F5F9', alignItems: 'center' }}>
                          <div style={{ textTransform: 'capitalize', fontWeight: 700 }}>{mat}</div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleObservation(mat, 'deflects')}
                              style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #10B981', background: observations[mat] === 'deflects' ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              {observations[mat] === 'deflects' && <CheckCircle2 size={12} color="white" />}
                            </button>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleObservation(mat, 'no_deflect')}
                              style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #EF4444', background: observations[mat] === 'no_deflect' ? '#EF4444' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              {observations[mat] === 'no_deflect' && <CheckCircle2 size={12} color="white" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Complete Step */}
              <div
                style={{
                  padding: '0.9rem 1.05rem',
                  borderRadius: '14px',
                  background: step >= 4 ? '#ECFDF5' : '#F8FAFC',
                  border: `2px solid ${step >= 4 ? '#10B981' : '#E2E8F0'}`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: step >= 4 ? '#065F46' : '#475569' }}>
                    Complete
                  </span>
                  {step >= 4 && <CheckCircle2 size={18} color="#10B981" />}
                </div>
                <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                  Experiment completed! Proceed to concept check.
                </p>
              </div>

            </div>
          </div>

          {/* Step Actions & Navigation matching Activity 4.6 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.2rem' }}>
            {step >= 4 ? (
              <button
                onClick={onNext}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)',
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

        {/* Right Column: Ocean Themed Simulation Stage */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem', height: '100%', minHeight: 0 }}>
          
          {/* Top Controls Bar */}
          <div style={{ 
            padding: '0.5rem 1rem', 
            background: '#FFFFFF', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(6, 78, 59, 0.04)'
          }}>
            <button
              onClick={flipMagnet}
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                borderRadius: '20px',
                border: 'none',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
              }}
            >
              <RotateCcw size={14} /> Flip Magnet Poles
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '20px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Reset Workspace
            </button>
          </div>

          {/* Deep Ocean Interactive Workspace */}
          <div 
            id="simulation-workspace" 
            ref={setWorkspaceRef} 
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
              top: `${FIXED_Y}px`,
              left: '5%',
              right: '5%',
              height: '1px',
              borderTop: '1px dashed rgba(56, 189, 248, 0.25)',
              pointerEvents: 'none',
              zIndex: 1
            }} />

            {/* Draggable / Fixed Objects Stage */}
            <div style={{ position: 'absolute', inset: 0 }}>
              {/* Material Barrier Visual strictly at fixed center axis (stationary) */}
              {activeMaterial && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    position: 'absolute',
                    left: FIXED_BARRIER_X - (32 + thickness * 8),
                    top: FIXED_Y - 140,
                    zIndex: 15,
                    pointerEvents: 'none'
                  }}
                >
                  <MaterialBarrierVisual type={activeMaterial} thickness={thickness} />
                </motion.div>
              )}

              {/* Fixed Compass (Stationary - Only Needle Deflects) */}
              {step >= 2 && (
                <div style={{ position: 'absolute', left: FIXED_COMPASS_X - 145, top: FIXED_Y - 145, zIndex: 20, pointerEvents: 'none' }}>
                  <ExactCompass rotation={needleRotation} size={290} />
                </div>
              )}

              {/* Movable Bar Magnet (The only element that moves) */}
              {step >= 3 && (
                <div style={{ position: 'absolute', left: magnetPos.x - 105, top: FIXED_Y - 29 }}>
                  <DraggableMagnet isFlipped={isFlipped} onDoubleClick={flipMagnet} />
                </div>
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
                    zIndex: 30
                  }}
                >
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
              }}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '25px',
                  padding: '2.5rem',
                  maxWidth: '480px',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <Sparkles size={42} color="#D97706" />
                <h2 style={{ margin: 0, color: '#064E3B', fontSize: '1.6rem', fontWeight: 900 }}>
                  Experiment Completed! 🎉
                </h2>
                <p style={{ margin: 0, color: '#334155', fontSize: '1rem', lineHeight: 1.5, fontWeight: 600 }}>
                  You demonstrated that non-magnetic barriers like wood (tree), glass (water glass), cardboard box, and plastic bottle do not block magnetic field lines.
                </p>
                <button
                  onClick={onNext}
                  style={{
                    padding: '0.9rem 2rem',
                    borderRadius: '30px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)'
                  }}
                >
                  Proceed to Concept Check <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <DragOverlay zIndex={2000}>
        {activeDragId === 'sidebar_compass' && <ExactCompass rotation={0} size={110} />}
        {activeDragId === 'sidebar_magnet' && <MagnetVisual isFlipped={false} isDragging={true} />}
        {activeDragId === 'compass' && <ExactCompass rotation={needleRotation} size={290} />}
        {activeDragId === 'bar_magnet' && <MagnetVisual isFlipped={isFlipped} isDragging={true} />}
      </DragOverlay>
    </DndContext>
  );
}