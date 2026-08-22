import React from 'react';

export default function SupercarShape({ 
  carType = 'supercarA', // 'supercarA' (Red Lightning Supercar with Driver Man) or 'supercarB' (Blue Nitro Racer)
  poleRight = 'S',       // 'S' or 'N' for right side of car magnet
  width = 240,
  height = 100,
  isVertical = false,
  style = {}
}) {
  const isCarA = carType === 'supercarA';
  const poleLeft = poleRight === 'S' ? 'N' : 'S';

  const containerWidth = isVertical ? height : width;
  const containerHeight = isVertical ? width : height;

  return (
    <div
      style={{
        position: 'relative',
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.85))',
        pointerEvents: 'none',
        userSelect: 'none',
        transform: isVertical ? 'rotate(-90deg)' : 'none',
        ...style
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 260 110" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Supercar A (Red Lightning) Gradient */}
          <linearGradient id="redSupercarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="25%" stopColor="#EF4444" />
            <stop offset="70%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          {/* Supercar B (Blue Nitro) Gradient */}
          <linearGradient id="blueSupercarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="25%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Racing Windshield Glass */}
          <linearGradient id="windshieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.85" />
          </linearGradient>

          {/* Lightning Bolt Yellow Gradient */}
          <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          {/* Magnet Pole Gradients */}
          <linearGradient id="magNorth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="magSouth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>

        {/* 4 Wide Racing Tires with Silver Alloys */}
        {/* Front-Left Wheel */}
        <rect x="35" y="4" width="44" height="16" rx="5" fill="#090D16" stroke="#3F3F46" strokeWidth="1.5" />
        <rect x="42" y="7" width="30" height="10" rx="3" fill="#64748B" />
        {/* Front-Right Wheel */}
        <rect x="180" y="4" width="44" height="16" rx="5" fill="#090D16" stroke="#3F3F46" strokeWidth="1.5" />
        <rect x="187" y="7" width="30" height="10" rx="3" fill="#64748B" />
        {/* Rear-Left Wheel */}
        <rect x="35" y="90" width="44" height="16" rx="5" fill="#090D16" stroke="#3F3F46" strokeWidth="1.5" />
        <rect x="42" y="93" width="30" height="10" rx="3" fill="#64748B" />
        {/* Rear-Right Wheel */}
        <rect x="180" y="90" width="44" height="16" rx="5" fill="#090D16" stroke="#3F3F46" strokeWidth="1.5" />
        <rect x="187" y="93" width="30" height="10" rx="3" fill="#64748B" />

        {/* Supercar Rear Wing Spoiler */}
        <rect x="18" y="30" width="12" height="50" rx="4" fill="#090D16" />
        <path d="M 12 25 L 28 25 L 24 85 L 12 85 Z" fill={isCarA ? "#DC2626" : "#1E40AF"} />

        {/* Aerodynamic Supercar Body Shell */}
        <path
          d="M 15 55 C 15 32 30 16 65 16 L 195 16 C 225 16 245 32 245 55 C 245 78 225 94 195 94 L 65 94 C 30 94 15 78 15 55 Z"
          fill={isCarA ? "url(#redSupercarGrad)" : "url(#blueSupercarGrad)"}
          stroke="#09090B"
          strokeWidth="2.5"
        />

        {/* Movie Supercar Racing Eyes Windshield */}
        <path d="M 68 24 C 85 24 92 24 105 24 L 105 86 C 92 86 85 86 68 86 Z" fill="url(#windshieldGrad)" stroke="#090D16" strokeWidth="1.5" />
        {/* Expressive Racing Eyes */}
        <ellipse cx="85" cy="40" rx="6" ry="9" fill="#FFFFFF" />
        <circle cx="86" cy="40" r="4" fill="#0F172A" />
        <ellipse cx="85" cy="70" rx="6" ry="9" fill="#FFFFFF" />
        <circle cx="86" cy="70" r="4" fill="#0F172A" />

        {/* Racing Decals & Lightning Bolt */}
        {isCarA ? (
          <g>
            {/* Lightning Bolt Decal */}
            <path d="M 140 28 L 175 28 L 155 52 L 180 52 L 135 82 L 148 58 L 130 58 Z" fill="url(#lightningGrad)" stroke="#B45309" strokeWidth="1" />
            {/* Race Number 95 */}
            <text x="120" y="59" fill="#FFFFFF" fontSize="22" fontWeight="900" fontStyle="italic" textAnchor="middle">95</text>
          </g>
        ) : (
          <g>
            {/* Twin Racing Stripes */}
            <rect x="65" y="48" width="135" height="6" fill="#FDE047" />
            <rect x="65" y="56" width="135" height="6" fill="#FDE047" />
            {/* Race Number 01 */}
            <text x="150" y="42" fill="#FFFFFF" fontSize="18" fontWeight="900" fontStyle="italic" textAnchor="middle">01</text>
          </g>
        )}

        {/* Bar Magnet Mounted on Supercar Roof */}
        <g transform="translate(50, 41)">
          <rect x="0" y="0" width="160" height="28" rx="6" fill="#18181B" stroke="#FFFFFF" strokeWidth="2" />
          {/* Left Pole */}
          <path
            d="M 0 0 L 80 0 L 80 28 L 0 28 Z"
            fill={poleLeft === 'N' ? "url(#magNorth)" : "url(#magSouth)"}
            clipPath="inset(0 0 0 0 round 6px 0 0 6px)"
          />
          {/* Right Pole */}
          <path
            d="M 80 0 L 160 0 L 160 28 L 80 28 Z"
            fill={poleRight === 'N' ? "url(#magNorth)" : "url(#magSouth)"}
            clipPath="inset(0 0 0 0 round 0 6px 6px 0)"
          />
          {/* Seam */}
          <line x1="80" y1="0" x2="80" y2="28" stroke="#FFFFFF" strokeWidth="2" />

          <text x="40" y="19" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle">{poleLeft}</text>
          <text x="120" y="19" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle">{poleRight}</text>
        </g>

        {/* Driver Man sitting in Cockpit on Supercar A */}
        {isCarA && (
          <g transform="translate(130, 22)">
            {/* Helmet Head (Top View) */}
            <circle cx="0" cy="0" r="10" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="0" cy="-2" r="7" fill="#FDE047" opacity="0.7" />
            {/* Visor */}
            <rect x="-6" y="-4" width="12" height="4" rx="2" fill="#0F172A" />
            {/* Label */}
            <rect x="-24" y="-22" width="48" height="14" rx="4" fill="#18181B" stroke="#F59E0B" strokeWidth="1" />
            <text x="0" y="-12" fill="#F59E0B" fontSize="8.5" fontWeight="900" textAnchor="middle">DRIVER MAN</text>
          </g>
        )}

        {/* Supercar Title */}
        <text x="130" y="106" fill="#F59E0B" fontSize="11" fontWeight="900" textAnchor="middle">
          {isCarA ? "🏎️ LIGHTNING SUPERCAR A (Driver Man)" : "⚡ NITRO SUPERCAR B"}
        </text>
      </svg>
    </div>
  );
}
