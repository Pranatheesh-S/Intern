import React from 'react';

export default function FlightShape({ 
  flightType = 'flightA', // 'flightA' (Red Airline Accent) or 'flightB' (Blue Airline Accent)
  poleLeft = 'N',         // 'N' or 'S' for left wing
  width = 250,
  height = 120,
  isVertical = true,
  style = {}
}) {
  const isFlightA = flightType === 'flightA';
  const poleRight = poleLeft === 'N' ? 'S' : 'N';

  const containerWidth = isVertical ? height : width;
  const containerHeight = isVertical ? width : height;

  const leftWingColor = poleLeft === 'N' ? '#DC2626' : '#2563EB';
  const rightWingColor = poleRight === 'N' ? '#DC2626' : '#2563EB';

  return (
    <div
      style={{
        position: 'relative',
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 16px 26px rgba(0, 0, 0, 0.45))',
        pointerEvents: 'none',
        userSelect: 'none',
        transform: isVertical ? 'rotate(-90deg)' : 'none',
        ...style
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 270 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pristine White Fuselage Gradient */}
          <linearGradient id="whiteFuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F8FAFC" />
            <stop offset="85%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Cockpit Dark Tinted Glass */}
          <linearGradient id="cockpitGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Left Wing Gradient */}
          <linearGradient id="leftWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={poleLeft === 'N' ? "#EF4444" : "#3B82F6"} />
            <stop offset="100%" stopColor={poleLeft === 'N' ? "#991B1B" : "#1E3A8A"} />
          </linearGradient>

          {/* Right Wing Gradient */}
          <linearGradient id="rightWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={poleRight === 'N' ? "#EF4444" : "#3B82F6"} />
            <stop offset="100%" stopColor={poleRight === 'N' ? "#991B1B" : "#1E3A8A"} />
          </linearGradient>

          {/* Jet Turbine Engine Metal */}
          <linearGradient id="engineMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* REAR HORIZONTAL TAIL STABILIZERS */}
        <path d="M 40 55 L 12 18 L 32 18 L 65 52 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.2" />
        <path d="M 40 65 L 12 102 L 32 102 L 65 68 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.2" />

        {/* LEFT MAIN WING (Red for North / Blue for South) */}
        <g>
          <path 
            d="M 115 48 L 175 6 L 198 10 L 165 50 Z" 
            fill="url(#leftWingGrad)" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
          />
          {/* Left Wing Engine Pod */}
          <rect x="135" y="24" width="28" height="10" rx="5" fill="url(#engineMetal)" stroke="#475569" strokeWidth="1" />
          <circle cx="163" cy="29" r="4" fill="#0F172A" />

          {/* Left Wing Pole Badge Pill */}
          <rect x="142" y="14" width="34" height="20" rx="6" fill="#FFFFFF" stroke={leftWingColor} strokeWidth="2.5" />
          <text x="159" y="29" textAnchor="middle" fill={leftWingColor} fontSize="14" fontWeight="900">
            {poleLeft}
          </text>
        </g>

        {/* RIGHT MAIN WING (Blue for South / Red for North) */}
        <g>
          <path 
            d="M 115 72 L 175 114 L 198 110 L 165 70 Z" 
            fill="url(#rightWingGrad)" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
          />
          {/* Right Wing Engine Pod */}
          <rect x="135" y="86" width="28" height="10" rx="5" fill="url(#engineMetal)" stroke="#475569" strokeWidth="1" />
          <circle cx="163" cy="91" r="4" fill="#0F172A" />

          {/* Right Wing Pole Badge Pill */}
          <rect x="142" y="86" width="34" height="20" rx="6" fill="#FFFFFF" stroke={rightWingColor} strokeWidth="2.5" />
          <text x="159" y="101" textAnchor="middle" fill={rightWingColor} fontSize="14" fontWeight="900">
            {poleRight}
          </text>
        </g>

        {/* PRISTINE WHITE AIRPLANE FUSELAGE (MAIN BODY) */}
        <path 
          d="M 20 60 C 20 46, 70 38, 185 38 C 225 38, 255 48, 258 60 C 255 72, 225 82, 185 82 C 70 82, 20 74, 20 60 Z" 
          fill="url(#whiteFuselageGrad)" 
          stroke="#94A3B8" 
          strokeWidth="1.5" 
        />

        {/* PASSENGER WINDOWS STRIPE */}
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} cx={75 + i * 14} cy="53" r="2.2" fill="#334155" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} cx={75 + i * 14} cy="67" r="2.2" fill="#334155" />
        ))}

        {/* AIRLINE LOGO TAIL FIN TRIME */}
        <path d="M 28 60 L 15 28 L 38 28 L 54 56 Z" fill={isFlightA ? "#DC2626" : "#2563EB"} />
        <path d="M 28 60 L 15 92 L 38 92 L 54 64 Z" fill={isFlightA ? "#DC2626" : "#2563EB"} />

        {/* COCKPIT WINDSHIELD GLASS */}
        <path d="M 225 52 C 238 52, 248 56, 252 60 C 248 64, 238 68, 225 68 C 220 64, 220 56, 225 52 Z" fill="url(#cockpitGlass)" stroke="#FFFFFF" strokeWidth="1" />
        <path d="M 228 54 C 238 56, 244 58, 248 60" stroke="#38BDF8" strokeWidth="1.5" opacity="0.85" />
      </svg>
    </div>
  );
}
