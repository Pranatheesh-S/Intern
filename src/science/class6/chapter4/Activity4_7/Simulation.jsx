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
   Ultra-Realistic 3D Material Barrier Components:
   - Wood = Living Oak Tree with Multi-Tier Foliage & Roots
   - Plastic = Molded PET Spring Water Bottle with Bubbles & Cap
   - Glass = Heavy-Base Crystal Glass Tumbler with Water & Ice
   - Cardboard = Corrugated Kraft Shipping Carton Box with Tape & Stamps
-------------------------------------------------------------- */

// Standard material thickness width calculator
const getMaterialWidth = (type, thickness) => {
  if (type === 'wood') return 120 + thickness * 18;
  if (type === 'cardboard') return 80 + thickness * 18;
  return 68 + thickness * 16;
};

// 1. Ultra-Realistic Living Oak Tree (Natural Wood Material)
const TreeWoodVisual = ({ thickness }) => {
  const width = getMaterialWidth('wood', thickness);
  const height = 290;
  const trunkW = 26 + thickness * 9;
  const trunkLeft = (width - trunkW) / 2;

  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 18px 36px rgba(0,0,0,0.65)) drop-shadow(0 6px 14px rgba(0,0,0,0.45))'
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
        🌳 Living Oak Tree (Wood)
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          {/* Rich Hardwood Bark Shading */}
          <linearGradient id="oakBarkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A0A02" />
            <stop offset="15%" stopColor="#3E1A04" />
            <stop offset="45%" stopColor="#682A09" />
            <stop offset="70%" stopColor="#854114" />
            <stop offset="90%" stopColor="#4A1C06" />
            <stop offset="100%" stopColor="#1C0A02" />
          </linearGradient>

          {/* Sunlit Canopy Top Foliage */}
          <radialGradient id="sunlitCanopyTop" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="25%" stopColor="#34D399" />
            <stop offset="55%" stopColor="#059669" />
            <stop offset="85%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          {/* Deep Ambient Mid Canopy */}
          <radialGradient id="midCanopyGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="30%" stopColor="#10B981" />
            <stop offset="65%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022C22" />
          </radialGradient>

          {/* Earthen Root Mound */}
          <linearGradient id="earthGrassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="30%" stopColor="#15803D" />
            <stop offset="70%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#1C0A02" />
          </linearGradient>
        </defs>

        {/* 1. Ground Shadow & Earth Mound */}
        <ellipse cx={width / 2} cy={height - 12} rx={width * 0.44} ry="14" fill="rgba(15, 23, 42, 0.6)" style={{ filter: 'blur(3px)' }} />
        <ellipse cx={width / 2} cy={height - 15} rx={width * 0.4} ry="12" fill="url(#earthGrassGrad)" stroke="#14532D" strokeWidth="1.5" />
        
        {/* Grass Tufts on Mound */}
        <path d={`M ${width/2 - 35} ${height - 16} Q ${width/2 - 40} ${height - 25} ${width/2 - 45} ${height - 23}`} stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d={`M ${width/2 - 32} ${height - 16} Q ${width/2 - 30} ${height - 26} ${width/2 - 27} ${height - 24}`} stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d={`M ${width/2 + 30} ${height - 16} Q ${width/2 + 35} ${height - 26} ${width/2 + 40} ${height - 23}`} stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Small River Pebbles */}
        <ellipse cx={width/2 - 25} cy={height - 11} rx="5" ry="3" fill="#64748B" stroke="#334155" strokeWidth="0.8" />
        <ellipse cx={width/2 + 22} cy={height - 10} rx="4" ry="2.5" fill="#94A3B8" stroke="#475569" strokeWidth="0.8" />

        {/* 2. Spreading Organic Root Buttresses */}
        <path d={`M ${trunkLeft - 18} ${height - 15} Q ${trunkLeft} ${height - 35} ${trunkLeft + 4} ${height - 75} L ${trunkLeft + trunkW - 4} ${height - 75} Q ${trunkLeft + trunkW} ${height - 35} ${trunkLeft + trunkW + 18} ${height - 15} Z`}
          fill="url(#oakBarkGrad)" stroke="#1A0A02" strokeWidth="1.5" />

        {/* 3. Main Sturdy Hardwood Trunk Body */}
        <path d={`M ${trunkLeft + 4} ${height - 75} Q ${trunkLeft + 6} ${height * 0.55} ${trunkLeft + 2} 120 L ${trunkLeft + trunkW - 2} 120 Q ${trunkLeft + trunkW - 6} ${height * 0.55} ${trunkLeft + trunkW - 4} ${height - 75} Z`}
          fill="url(#oakBarkGrad)" stroke="#1A0A02" strokeWidth="1.5" />

        {/* Vertical Bark Texture Ridges */}
        <line x1={trunkLeft + trunkW * 0.3} y1="125" x2={trunkLeft + trunkW * 0.28} y2={height - 25} stroke="#1A0A02" strokeWidth="2.2" strokeDasharray="25 8 40 10" opacity="0.85" />
        <line x1={trunkLeft + trunkW * 0.52} y1="130" x2={trunkLeft + trunkW * 0.5} y2={height - 28} stroke="#4A1C06" strokeWidth="1.8" strokeDasharray="30 12 20 8" opacity="0.75" />
        <line x1={trunkLeft + trunkW * 0.74} y1="125" x2={trunkLeft + trunkW * 0.76} y2={height - 22} stroke="#1A0A02" strokeWidth="2.4" strokeDasharray="35 10 30 12" opacity="0.85" />

        {/* Realistic Knot Hole */}
        <g transform={`translate(${trunkLeft + trunkW * 0.55}, ${height * 0.65})`}>
          <ellipse cx="0" cy="0" rx={Math.min(7, trunkW * 0.18)} ry="11" fill="#1A0A02" stroke="#451A03" strokeWidth="1.5" />
          <ellipse cx="0" cy="0" rx={Math.min(4.5, trunkW * 0.12)} ry="7" fill="#0A0401" />
          <path d="M -8 -13 Q 0 -16 8 -13 Q 10 0 7 13 Q 0 16 -7 13 Z" fill="none" stroke="#5A2407" strokeWidth="1.2" opacity="0.8" />
        </g>

        {/* 4. Natural Forking Branches Extending into Canopy */}
        <path d={`M ${trunkLeft + 4} 140 Q ${trunkLeft - 18} 105 ${trunkLeft - 28} 85 Q ${trunkLeft - 22} 82 ${trunkLeft - 8} 100 Q ${trunkLeft + 8} 118 ${trunkLeft + trunkW * 0.4} 125 Z`}
          fill="url(#oakBarkGrad)" stroke="#1A0A02" strokeWidth="1.2" />
        <path d={`M ${trunkLeft + trunkW - 4} 135 Q ${trunkLeft + trunkW + 18} 100 ${trunkLeft + trunkW + 28} 80 Q ${trunkLeft + trunkW + 22} 77 ${trunkLeft + trunkW + 8} 95 Q ${trunkLeft + trunkW - 6} 115 ${trunkLeft + trunkW * 0.6} 125 Z`}
          fill="url(#oakBarkGrad)" stroke="#1A0A02" strokeWidth="1.2" />

        {/* 5. Volumetric Multi-Layer Foliage Canopy */}
        <ellipse cx={width * 0.28} cy="115" rx={width * 0.24} ry="38" fill="url(#midCanopyGrad)" stroke="#064E3B" strokeWidth="1.5" />
        <ellipse cx={width * 0.72} cy="110" rx={width * 0.24} ry="38" fill="url(#midCanopyGrad)" stroke="#064E3B" strokeWidth="1.5" />
        <ellipse cx={width * 0.5} cy="120" rx={width * 0.32} ry="40" fill="url(#midCanopyGrad)" stroke="#064E3B" strokeWidth="1.5" />

        {/* Mid-Tier Canopy Cloud Lobes */}
        <ellipse cx={width * 0.22} cy="75" rx={width * 0.22} ry="38" fill="url(#midCanopyGrad)" stroke="#064E3B" strokeWidth="1.5" />
        <ellipse cx={width * 0.78} cy="70" rx={width * 0.22} ry="38" fill="url(#midCanopyGrad)" stroke="#064E3B" strokeWidth="1.5" />
        <ellipse cx={width * 0.5} cy="72" rx={width * 0.38} ry="45" fill="url(#sunlitCanopyTop)" stroke="#064E3B" strokeWidth="1.5" />

        {/* Upper Sun-Dappled Canopy Dome */}
        <ellipse cx={width * 0.36} cy="42" rx={width * 0.26} ry="32" fill="url(#sunlitCanopyTop)" stroke="#047857" strokeWidth="1.2" />
        <ellipse cx={width * 0.64} cy="40" rx={width * 0.26} ry="32" fill="url(#sunlitCanopyTop)" stroke="#047857" strokeWidth="1.2" />
        <ellipse cx={width * 0.5} cy="32" rx={width * 0.28} ry="26" fill="url(#sunlitCanopyTop)" stroke="#047857" strokeWidth="1.5" />

        {/* Leaf Cluster Details & Sunlit Specular Glints */}
        <circle cx={width * 0.42} cy="26" r="8" fill="#A7F3D0" opacity="0.4" style={{ filter: 'blur(2px)' }} />
        <circle cx={width * 0.58} cy="36" r="10" fill="#6EE7B7" opacity="0.35" style={{ filter: 'blur(2px)' }} />
        <circle cx={width * 0.32} cy="65" r="12" fill="#34D399" opacity="0.3" style={{ filter: 'blur(2px)' }} />
        <circle cx={width * 0.68} cy="68" r="14" fill="#34D399" opacity="0.3" style={{ filter: 'blur(2px)' }} />
      </svg>
    </div>
  );
};

// 2. Ultra-Realistic Translucent PET Plastic Water Bottle
const PlasticBottleVisual = ({ thickness }) => {
  const width = getMaterialWidth('plastic', thickness);
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
      filter: 'drop-shadow(0 16px 34px rgba(14, 165, 233, 0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.35))'
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
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.88)" />
            <stop offset="12%" stopColor="rgba(186, 230, 253, 0.45)" />
            <stop offset="40%" stopColor="rgba(56, 189, 248, 0.15)" />
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

          {/* Ribbed Blue Sports Cap */}
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

        {/* Ambient Ground Shadow */}
        <ellipse cx={width / 2} cy={height - 8} rx={width * 0.42} ry="7" fill="rgba(15, 23, 42, 0.5)" style={{ filter: 'blur(2px)' }} />

        {/* Blue Ribbed Bottle Cap */}
        <rect x={width / 2 - 13} y="8" width="26" height="20" rx="3" fill="url(#bottleCapGrad)" stroke="#0369A1" strokeWidth="1.2" />
        <line x1={width/2 - 9} y1="10" x2={width/2 - 9} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
        <line x1={width/2 - 4} y1="10" x2={width/2 - 4} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
        <line x1={width/2 + 1} y1="10" x2={width/2 + 1} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
        <line x1={width/2 + 6} y1="10" x2={width/2 + 6} y2="26" stroke="#BAE6FD" strokeWidth="1.2" />
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
          <path d={`M ${width/2 - 18} 34 L ${width/2 - 6} 14 L ${width/2 + 6} 34 Z`} fill="#FFFFFF" opacity="0.35" />
          <path d={`M ${width/2 - 4} 34 L ${width/2 + 8} 10 L ${width/2 + 20} 34 Z`} fill="#FFFFFF" opacity="0.5" />
          <text x={(width - 12) / 2} y="38" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="1.2">
            PURE WATER
          </text>
          <text x={(width - 12) / 2} y="49" fill="#93C5FD" fontSize="7" fontWeight="800" textAnchor="middle" letterSpacing="0.8">
            100% RECYCLED PET
          </text>
        </g>

        {/* Ergonomic Grip Grooves */}
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
  const width = getMaterialWidth('glass', thickness);
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
        🥛 Crystal Glass Tumbler
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="crystalGlassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="15%" stopColor="rgba(224, 242, 254, 0.45)" />
            <stop offset="50%" stopColor="rgba(56, 189, 248, 0.12)" />
            <stop offset="85%" stopColor="rgba(186, 230, 253, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
          </linearGradient>

          <linearGradient id="waterCausticGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.65)" />
            <stop offset="60%" stopColor="rgba(14, 165, 233, 0.85)" />
            <stop offset="100%" stopColor="rgba(2, 132, 199, 0.95)" />
          </linearGradient>

          <linearGradient id="heavyBaseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="50%" stopColor="rgba(186, 230, 253, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx={width / 2} cy={height - 8} rx={width * 0.44} ry="8" fill="rgba(15, 23, 42, 0.55)" style={{ filter: 'blur(2px)' }} />

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

// 4. Ultra-Realistic Heavy-Duty Corrugated Shipping Box
const CardboardBoxVisual = ({ thickness }) => {
  const width = getMaterialWidth('cardboard', thickness);
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
      filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.65)) drop-shadow(0 4px 12px rgba(0,0,0,0.45))'
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
        📦 Corrugated Cardboard Box
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="kraftCardboardGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="15%" stopColor="#B45309" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="packagingTapeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A16207" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx={width / 2} cy={height - 10} rx={width * 0.46} ry="8" fill="rgba(15, 23, 42, 0.55)" style={{ filter: 'blur(2px)' }} />

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
          <path d="M 12 8 L 20 8 L 20 18 Q 16 24 16 26 L 16 32 L 22 32 L 22 34 L 10 34 L 10 32 L 16 32 L 16 26 Q 12 24 12 18 Z" fill="#451A03" />
          <line x1="16" y1="10" x2="16" y2="16" stroke="#451A03" strokeWidth="1" />
        </g>

        {/* Barcode Shipping Sticker */}
        <rect x={width / 2 - 20} y={height - 95} width="40" height="26" fill="#FFFBEB" rx="3" stroke="#92400E" strokeWidth="1" />
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
  const barrierRightEdge = centerX + matWidth / 2;
  const barrierLeftEdge = centerX - matWidth / 2;

  // Compass dynamic placement with auto gap
  const targetRightCompassX = workspaceSize.width - COMPASS_RADIUS - 45;
  const dynamicCompassX = Math.max(barrierRightEdge + MIN_OBJECT_COMPASS_GAP + COMPASS_RADIUS, targetRightCompassX);

  // Maximum Magnet Approach X
  const maxMagnetX = barrierLeftEdge - MIN_MAGNET_GAP - 105;

  const getNeedleRotation = (mX, mY, cX, cY, flipped) => {
    const magnetWidth = 210;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = cY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const minDist = Math.min(distN, distS);

    if (minDist > 750) return 0;

    const angleToN = calculateAngle(cX, cY, nPoleX, poleY);
    const angleToS = calculateAngle(cX, cY, sPoleX, poleY);

    let targetAngle = distN < distS ? angleToN + 90 : angleToS - 90;
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;

    const deflectionFactor = Math.max(0, Math.min(1, 1 - (minDist - 180) / 450));
    return targetAngle * deflectionFactor;
  };

  // Update needle angle on state changes
  useEffect(() => {
    setNeedleRotation(getNeedleRotation(magnetX, centerY, dynamicCompassX, centerY, isFlipped));
  }, [magnetX, centerY, dynamicCompassX, isFlipped]);

  // Handle Automatic Object Testing
  const handleTestCurrentObject = () => {
    setIsTesting(true);
    // Glide magnet smoothly toward object
    const targetX = Math.min(maxMagnetX, 235);
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
    setMagnetX(135);
    setFeedback(null);
  };

  // Select specific object
  const handleSelectObject = (idx) => {
    setSelectedMaterialIndex(idx);
    setMagnetX(135);
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
    const minX = 115;
    const clampedX = Math.max(minX, Math.min(maxMagnetX, clientX));
    setMagnetX(clampedX);

    // If dragged close to the barrier, trigger deflection observation
    if (clampedX >= Math.min(maxMagnetX - 15, 205)) {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', height: '100%' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={28} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.38rem', color: '#064E3B', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Material Barrier Testing
              </h3>
            </div>
            <span style={{ fontSize: '0.82rem', background: '#ECFDF5', color: '#047857', padding: '4px 10px', borderRadius: '14px', fontWeight: 800, border: '1.5px solid #A7F3D0' }}>
              Auto-Slide Stage
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.96rem', color: '#475569', lineHeight: 1.55, fontWeight: 600 }}>
            Select an object to slide it into the center. Test how magnetic field passes through each non-magnetic barrier to deflect the compass needle.
          </p>

          {/* Material Barrier Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-around' }}>
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
                    padding: '0.95rem 1.25rem',
                    borderRadius: '18px',
                    border: isSelected ? '2.5px solid #F59E0B' : '1.5px solid #E2E8F0',
                    background: isSelected ? '#FEF3C7' : '#F8FAFC',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 6px 18px rgba(245, 158, 11, 0.22)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.25s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#A7F3D0';
                      e.currentTarget.style.background = '#F0FDF4';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.background = '#F8FAFC';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: isSelected ? '#FDE68A' : '#FFFFFF',
                      border: isSelected ? '1.5px solid #F59E0B' : '1px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      flexShrink: 0
                    }}>
                      {mat.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.05rem', color: isSelected ? '#92400E' : '#1E293B' }}>
                        {mat.name}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                        {mat.materialName}
                      </div>
                    </div>
                  </div>

                  {isObserved ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: 900, color: '#15803D', background: '#DCFCE7', padding: '5px 11px', borderRadius: '12px', border: '1.5px solid #86EFAC' }}>
                      <CheckCircle2 size={15} color="#16A34A" /> Deflects
                    </span>
                  ) : isSelected ? (
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#B45309', background: '#FDE68A', padding: '5px 11px', borderRadius: '12px', border: '1px solid #F59E0B' }}>
                      Active Object
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>
                      Ready to Test
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Object Testing Controls */}
          <div style={{ 
            background: '#F0FDF4', 
            borderRadius: '20px', 
            padding: '1.2rem 1.4rem', 
            border: '2px solid #BBF7D0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#14532D' }}>
                Active: {activeMaterialObj.name}
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857', background: '#FFFFFF', padding: '3px 10px', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                Barrier Thickness: {thickness}
              </span>
            </div>

            {/* Thickness Slider */}
            <div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={thickness} 
                onChange={(e) => handleThicknessChange(Number(e.target.value))} 
                style={{ width: '100%', cursor: 'pointer', accentColor: '#D97706', height: '8px' }} 
              />
            </div>
          </div>


        </div>

        {/* Bottom Hub Actions */}
        <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {allCompleted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <button
                onClick={() => setShowTakeawayModal(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1.5px solid #FCD34D',
                  background: '#FFFBEB',
                  color: '#92400E',
                  fontWeight: 900,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)'
                }}
              >
                💡 View Key Scientific Takeaway
              </button>

              <button
                onClick={onNext}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={18} /> Proceed to Concept Check <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={flipMagnet}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '10px',
                  border: '1.5px solid #FCD34D',
                  background: '#FFFBEB',
                  color: '#92400E',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <RotateCcw size={13} /> Flip Poles (N ↔ S)
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '0.55rem 0.8rem',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  cursor: 'pointer'
                }}
              >
                Reset
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
          background: '#FFFFFF', 
          border: '1.5px solid #A7F3D0', 
          borderRadius: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 4px 14px rgba(6, 78, 59, 0.04)'
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
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                borderRadius: '18px',
                border: 'none',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 3px 10px rgba(217, 119, 6, 0.3)'
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
                  top: centerY - (activeMaterial === 'wood' ? 145 : 140),
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
                  style={{
                    width: '100%',
                    padding: '0.8rem 1.6rem',
                    borderRadius: '25px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
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
                  style={{
                    flex: 1.4,
                    padding: '0.9rem',
                    borderRadius: '25px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.96rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
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