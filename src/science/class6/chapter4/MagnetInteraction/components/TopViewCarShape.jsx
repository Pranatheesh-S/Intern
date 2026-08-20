import React from 'react';

export default function TopViewCarShape({ 
  carType = 'carA', // 'carA' (Red Car with Mini Man) or 'carB' (Blue Car)
  poleRight = 'S',  // 'S' or 'N' for right side of car magnet
  width = 220,
  height = 95,
  style = {}
}) {
  const isCarA = carType === 'carA';
  const poleLeft = poleRight === 'S' ? 'N' : 'S';

  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.75))',
        pointerEvents: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 240 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Car A Red Metallic Gradient */}
          <linearGradient id="carBodyRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="30%" stopColor="#EF4444" />
            <stop offset="70%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Car B Blue Metallic Gradient */}
          <linearGradient id="carBodyBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Windshield Glass Gradient */}
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
          </linearGradient>

          {/* Magnet Pole Gradients */}
          <linearGradient id="northMag" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="southMag" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          {/* Mini Man Helmet Gradient */}
          <linearGradient id="manHelmet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Mini Man Suit */}
          <linearGradient id="manSuit" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* 4 Rubber Tires (Top View Sides) */}
        {/* Top-Left Wheel */}
        <rect x="35" y="6" width="38" height="14" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />
        {/* Top-Right Wheel */}
        <rect x="165" y="6" width="38" height="14" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />
        {/* Bottom-Left Wheel */}
        <rect x="35" y="80" width="38" height="14" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />
        {/* Bottom-Right Wheel */}
        <rect x="165" y="80" width="38" height="14" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />

        {/* Main Aerodynamic Car Body (Top View) */}
        <path
          d="M 20 50 C 20 28 35 16 60 16 L 180 16 C 205 16 220 28 220 50 C 220 72 205 84 180 84 L 60 84 C 35 84 20 72 20 50 Z"
          fill={isCarA ? "url(#carBodyRed)" : "url(#carBodyBlue)"}
          stroke="#09090B"
          strokeWidth="2"
        />

        {/* Front & Rear Windshields */}
        <path d="M 65 24 C 80 24 85 24 95 24 L 95 76 C 85 76 80 76 65 76 Z" fill="url(#glassGrad)" stroke="#1E293B" strokeWidth="1" />
        <path d="M 175 26 C 165 26 160 26 155 26 L 155 74 C 160 74 165 74 175 74 Z" fill="url(#glassGrad)" stroke="#1E293B" strokeWidth="1" />

        {/* Car Roof Rack */}
        <rect x="95" y="22" width="60" height="56" rx="6" fill="rgba(24,24,27,0.7)" stroke="#52525B" strokeWidth="1" />

        {/* Bar Magnet Mounted on Roof */}
        <g transform="translate(40, 36)">
          <rect x="0" y="0" width="160" height="28" rx="6" fill="#18181B" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Left Pole */}
          <path
            d="M 0 0 L 80 0 L 80 28 L 0 28 Z"
            fill={poleLeft === 'N' ? "url(#northMag)" : "url(#southMag)"}
            clipPath="inset(0 0 0 0 round 6px 0 0 6px)"
          />
          {/* Right Pole */}
          <path
            d="M 80 0 L 160 0 L 160 28 L 80 28 Z"
            fill={poleRight === 'N' ? "url(#northMag)" : "url(#southMag)"}
            clipPath="inset(0 0 0 0 round 0 6px 6px 0)"
          />
          {/* Divider */}
          <line x1="80" y1="0" x2="80" y2="28" stroke="#FFFFFF" strokeWidth="2" />

          {/* Pole Letters */}
          <text x="40" y="19" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle">{poleLeft}</text>
          <text x="120" y="19" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle">{poleRight}</text>
        </g>

        {/* Mini Man Toy Figure Riding on Top of Car A */}
        {isCarA && (
          <g transform="translate(120, 20)">
            {/* Man Hands / Arms holding Roof Handles */}
            <path d="M -18 8 Q 0 -6 18 8" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" fill="none" />
            
            {/* Man Shoulders / Vest */}
            <ellipse cx="0" cy="14" rx="14" ry="10" fill="url(#manSuit)" stroke="#065F46" strokeWidth="1" />

            {/* Man Helmet Head (Top View) */}
            <circle cx="0" cy="4" r="11" fill="url(#manHelmet)" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="0" cy="2" r="8" fill="#FCD34D" opacity="0.6" />
            
            {/* Goggles / Visor */}
            <rect x="-7" y="-1" width="14" height="4" rx="2" fill="#0F172A" />

            {/* Floating "MINI MAN" Tag */}
            <rect x="-24" y="-22" width="48" height="15" rx="4" fill="#18181B" stroke="#F59E0B" strokeWidth="1" />
            <text x="0" y="-11" fill="#F59E0B" fontSize="9" fontWeight="900" textAnchor="middle">
              DRIVER MAN
            </text>
          </g>
        )}

        {/* Car Name Label */}
        <text x="120" y="96" fill="#F59E0B" fontSize="11" fontWeight="800" textAnchor="middle">
          {isCarA ? "🚘 CAR A (With Driver Man)" : "🏎️ CAR B"}
        </text>
      </svg>
    </div>
  );
}
