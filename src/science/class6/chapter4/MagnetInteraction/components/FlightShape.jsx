import React from 'react';

export default function FlightShape({ 
  flightType = 'flightA', // 'flightA' (Left Jet) or 'flightB' (Right Jet)
  poleLeft = 'N',         // 'N' or 'S' for left wing
  width = 240,
  height = 280,
  style = {}
}) {
  const poleRight = poleLeft === 'N' ? 'S' : 'N';

  const leftWingColor = poleLeft === 'N' ? '#EF4444' : '#3B82F6';
  const leftWingDark = poleLeft === 'N' ? '#B91C1C' : '#1D4ED8';
  const leftWingLight = poleLeft === 'N' ? '#FCA5A5' : '#93C5FD';

  const rightWingColor = poleRight === 'N' ? '#EF4444' : '#3B82F6';
  const rightWingDark = poleRight === 'N' ? '#B91C1C' : '#1D4ED8';
  const rightWingLight = poleRight === 'N' ? '#FCA5A5' : '#93C5FD';

  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.55)) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.35))',
        pointerEvents: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 300 350" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fuselage Metallic Shading */}
          <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="25%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Fuselage Top Highlight Spine */}
          <linearGradient id="spineHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Left Wing Gradient */}
          <linearGradient id="leftWingFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={leftWingLight} />
            <stop offset="35%" stopColor={leftWingColor} />
            <stop offset="100%" stopColor={leftWingDark} />
          </linearGradient>

          {/* Right Wing Gradient */}
          <linearGradient id="rightWingFill" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={rightWingLight} />
            <stop offset="35%" stopColor={rightWingColor} />
            <stop offset="100%" stopColor={rightWingDark} />
          </linearGradient>

          {/* Engine Nacelle Gradient */}
          <linearGradient id="engineNacelle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="40%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Vertical Stabilizer Fin Gradient */}
          <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* 1. HORIZONTAL TAIL STABILIZERS (Rear Wings at bottom) */}
        <g id="tail-stabilizers">
          {/* Left Tail Wing */}
          <path 
            d="M 138 275 L 60 300 L 68 312 L 140 295 Z" 
            fill="#E2E8F0" 
            stroke="#94A3B8" 
            strokeWidth="1.5" 
          />
          {/* Right Tail Wing */}
          <path 
            d="M 162 275 L 240 300 L 232 312 L 160 295 Z" 
            fill="#E2E8F0" 
            stroke="#94A3B8" 
            strokeWidth="1.5" 
          />
        </g>

        {/* 2. LEFT MAIN WING (Swept back with Pole Color) */}
        <g id="left-main-wing">
          <path 
            d="M 132 155 L 15 210 L 10 200 L 128 120 Z" 
            fill="url(#leftWingFill)" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
          />
          {/* Winglet (Upturned tip) */}
          <path d="M 10 200 L 15 210 L 8 185 Z" fill={leftWingDark} stroke="#FFFFFF" strokeWidth="1" />

          {/* Left Jet Engine under wing */}
          <rect x="85" y="172" width="22" height="42" rx="11" fill="url(#engineNacelle)" stroke="#475569" strokeWidth="1.2" />
          {/* Engine Exhaust & Turbine Details */}
          <ellipse cx="96" cy="212" rx="9" ry="4" fill="#0F172A" />
          <ellipse cx="96" cy="174" rx="9" ry="4" fill="#334155" />

          {/* Left Wing Magnetic Pole Badge */}
          <g transform="translate(48, 172)">
            <rect x="0" y="0" width="34" height="22" rx="6" fill="#FFFFFF" stroke={leftWingColor} strokeWidth="2.5" />
            <text x="17" y="16" textAnchor="middle" fill={leftWingColor} fontSize="14" fontWeight="900" fontFamily="sans-serif">
              {poleLeft}
            </text>
          </g>
        </g>

        {/* 3. RIGHT MAIN WING (Swept back with Pole Color) */}
        <g id="right-main-wing">
          <path 
            d="M 168 155 L 285 210 L 290 200 L 172 120 Z" 
            fill="url(#rightWingFill)" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
          />
          {/* Winglet (Upturned tip) */}
          <path d="M 290 200 L 285 210 L 292 185 Z" fill={rightWingDark} stroke="#FFFFFF" strokeWidth="1" />

          {/* Right Jet Engine under wing */}
          <rect x="193" y="172" width="22" height="42" rx="11" fill="url(#engineNacelle)" stroke="#475569" strokeWidth="1.2" />
          {/* Engine Exhaust & Turbine Details */}
          <ellipse cx="204" cy="212" rx="9" ry="4" fill="#0F172A" />
          <ellipse cx="204" cy="174" rx="9" ry="4" fill="#334155" />

          {/* Right Wing Magnetic Pole Badge */}
          <g transform="translate(218, 172)">
            <rect x="0" y="0" width="34" height="22" rx="6" fill="#FFFFFF" stroke={rightWingColor} strokeWidth="2.5" />
            <text x="17" y="16" textAnchor="middle" fill={rightWingColor} fontSize="14" fontWeight="900" fontFamily="sans-serif">
              {poleRight}
            </text>
          </g>
        </g>

        {/* 4. MAIN FUSELAGE (Sleek White Cylindrical Airliner Body) */}
        <g id="fuselage">
          <path 
            d="M 150 25 C 166 25, 172 65, 172 135 L 170 255 C 168 285, 158 315, 150 315 C 142 315, 132 285, 130 255 L 128 135 C 128 65, 134 25, 150 25 Z" 
            fill="url(#fuselageGrad)" 
            stroke="#94A3B8" 
            strokeWidth="1.5" 
          />

          {/* Top Spine Highlight */}
          <path 
            d="M 150 35 L 150 295" 
            stroke="url(#spineHighlight)" 
            strokeWidth="6" 
            strokeLinecap="round" 
          />

          {/* Cockpit Windshield (tinted dark glass at nose) */}
          <path 
            d="M 143 42 C 147 38, 153 38, 157 42 C 161 46, 159 52, 150 54 C 141 52, 139 46, 143 42 Z" 
            fill="#0F172A" 
            stroke="#64748B" 
            strokeWidth="1" 
          />

          {/* Auxiliary Power Unit (APU) Tail Cone exhaust */}
          <circle cx="150" cy="314" r="3.5" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
        </g>

        {/* 5. VERTICAL STABILIZER (Tail Fin viewed from above/behind) */}
        <g id="vertical-tail-fin">
          <path 
            d="M 148 215 L 152 215 L 154 290 L 146 290 Z" 
            fill="url(#finGrad)" 
            stroke="#64748B" 
            strokeWidth="1" 
          />
          <path 
            d="M 150 215 L 150 290" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
          />
        </g>
      </svg>
    </div>
  );
}
