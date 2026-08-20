import React from 'react';

// Common style wrapper
const DraggableStyle = { userSelect: 'none' };

export const LemonSVG = ({ x = 0, y = 0, scale = 1, isPlaced = false, hasCopper = false, hasIron = false }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} style={DraggableStyle}>
    {/* Shadow */}
    <ellipse cx="50" cy="85" rx="45" ry="15" fill="rgba(0,0,0,0.15)" />
    
    {/* Lemon Body (Half Cut) */}
    {/* Base */}
    <path d="M 10 50 A 40 30 0 0 0 90 50 Z" fill="url(#lemonGrad)" stroke="#a1a11f" strokeWidth="2" />
    
    {/* Cut Surface (Top) */}
    <ellipse cx="50" cy="50" rx="40" ry="15" fill="#fef08a" stroke="#a1a11f" strokeWidth="2" />
    
    {/* Inner Flesh Segments */}
    <ellipse cx="50" cy="50" rx="36" ry="12" fill="#fde047" />
    <path d="M 14 50 Q 50 50 86 50 M 50 38 Q 50 50 50 62 M 25 41 Q 50 50 75 59 M 25 59 Q 50 50 75 41" stroke="#fef08a" strokeWidth="1.5" fill="none" />
    
    {/* Small seeds */}
    <ellipse cx="40" cy="45" rx="1.5" ry="2.5" fill="#eab308" transform="rotate(30, 40, 45)" />
    <ellipse cx="60" cy="55" rx="1.5" ry="2.5" fill="#eab308" transform="rotate(210, 60, 55)" />

    {/* Slits for electrodes (now on the cut surface) */}
    <line x1="25" y1="50" x2="35" y2="50" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round" />
    <line x1="65" y1="50" x2="75" y2="50" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round" />
    
    {hasCopper && (
      <g transform="translate(24, 15)">
        <rect x="0" y="0" width="12" height="35" fill="#ca8a04" stroke="#a16207" />
        <circle cx="6" cy="5" r="2" fill="var(--danger)" /> {/* Connection point */}
      </g>
    )}

    {hasIron && (
      <g transform="translate(64, 15)">
        {/* Nail Head */}
        <ellipse cx="5" cy="0" rx="8" ry="3" fill="#6b7280" stroke="#374151" />
        {/* Nail Body */}
        <polygon points="2,0 8,0 6,35 4,35" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
        <circle cx="5" cy="0" r="2" fill="var(--text-primary)" /> {/* Connection point */}
      </g>
    )}
    
    <defs>
      <radialGradient id="lemonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="70%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
    </defs>
  </g>
);

export const CopperStripSVG = ({ x = 0, y = 0, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} style={DraggableStyle}>
    <rect x="0" y="0" width="15" height="60" rx="2" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
    <line x1="2" y1="5" x2="13" y2="5" stroke="#fef08a" opacity="0.5" />
    <line x1="2" y1="10" x2="13" y2="10" stroke="#fef08a" opacity="0.5" />
    {/* Hole for wire */}
    <circle cx="7.5" cy="8" r="3" fill="#333" />
  </g>
);

export const IronNailSVG = ({ x = 0, y = 0, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} style={DraggableStyle}>
    {/* Head */}
    <ellipse cx="7.5" cy="2" rx="10" ry="3" fill="#9ca3af" stroke="#4b5563" />
    {/* Body */}
    <polygon points="4,2 11,2 9,60 6,60" fill="#d1d5db" stroke="#6b7280" />
    <line x1="7.5" y1="2" x2="7.5" y2="58" stroke="#f3f4f6" opacity="0.4" />
  </g>
);

export const LEDSVG = ({ x = 0, y = 0, scale = 1, isGlowing = false }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} style={DraggableStyle}>
    {/* Long Lead (Anode) */}
    <path d="M 30,50 L 30,80" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
    {/* Short Lead (Cathode) */}
    <path d="M 50,50 L 50,70" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
    
    {/* Bulb Base */}
    <path d="M 25,45 Q 40,55 55,45 L 50,50 L 30,50 Z" fill="#d1d5db" />
    
    {/* Bulb Glass */}
    <path d="M 25,45 C 25,10 55,10 55,45 Z" fill={isGlowing ? "#f87171" : "rgba(255,255,255,0.4)"} stroke={isGlowing ? "#ef4444" : "#cbd5e1"} strokeWidth="2" />
    
    {/* Glow Effect */}
    {isGlowing && (
      <circle cx="40" cy="30" r="25" fill="url(#ledGlow)" opacity="0.8" />
    )}
    
    {/* Terminal labels */}
    <text x="18" y="85" fontSize="14" fontWeight="bold" fill="var(--danger)">+</text>
    <text x="58" y="75" fontSize="14" fontWeight="bold" fill="var(--text-primary)">-</text>

    <defs>
      <radialGradient id="ledGlow">
        <stop offset="0%" stopColor="#fca5a5" stopOpacity="1" />
        <stop offset="50%" stopColor="#ef4444" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
      </radialGradient>
    </defs>
  </g>
);

export const VoltmeterSVG = ({ x = 0, y = 0, scale = 1, voltage = 0.00 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} style={DraggableStyle}>
    {/* Body */}
    <rect x="0" y="0" width="100" height="130" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="3" />
    
    {/* Screen bezel */}
    <rect x="10" y="10" width="80" height="40" rx="4" fill="#0f172a" />
    {/* Screen */}
    <rect x="12" y="12" width="76" height="36" rx="2" fill="#84cc16" />
    
    {/* Digital Text */}
    <text x="50" y="40" fontSize="24" fontFamily="monospace" fontWeight="bold" fill="#064e3b" textAnchor="middle">
      {voltage.toFixed(2)}
    </text>
    <text x="80" y="40" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="#064e3b">V</text>

    {/* Dial */}
    <circle cx="50" cy="80" r="20" fill="#334155" />
    <circle cx="50" cy="80" r="16" fill="#1e293b" />
    <path d="M 50,80 L 35,70" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />

    {/* Ports */}
    <circle cx="30" cy="115" r="6" fill="#ef4444" /> {/* V/Omega/mA */}
    <circle cx="70" cy="115" r="6" fill="#111827" /> {/* COM */}
    
    <text x="30" y="105" fontSize="8" fill="#ef4444" textAnchor="middle">VΩmA</text>
    <text x="70" y="105" fontSize="8" fill="#9ca3af" textAnchor="middle">COM</text>
  </g>
);
