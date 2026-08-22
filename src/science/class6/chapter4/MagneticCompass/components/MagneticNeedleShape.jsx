import React from 'react';

export default function MagneticNeedleShape({ 
  width = 380, 
  height = 40, 
  orientation = 'horizontal', // 'horizontal' (North left/right) or 'vertical' (North top)
  isGlowing = false,
  style = {}
}) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      style={{
        position: 'relative',
        width: isVertical ? `${height}px` : `${width}px`,
        height: isVertical ? `${width}px` : `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: isGlowing 
          ? 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.95)) drop-shadow(0 6px 14px rgba(0,0,0,0.8))'
          : 'drop-shadow(0 6px 14px rgba(0,0,0,0.75))',
        transition: 'filter 0.3s ease',
        transform: isVertical ? 'rotate(-90deg)' : 'none',
        pointerEvents: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 400 44" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Steel Gradient */}
          <linearGradient id="needleSteel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="25%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* North Pole Red Gradient */}
          <linearGradient id="northRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* South Pole Blue Gradient */}
          <linearGradient id="southBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Steel Highlight */}
          <linearGradient id="steelHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Outer Shadow Path */}
        <path
          d="M 12 22 L 70 12 L 330 14 L 380 20 C 388 22 388 22 380 24 L 330 30 L 70 32 Z"
          fill="rgba(0,0,0,0.3)"
          transform="translate(2, 4)"
        />

        {/* Main Needle Body - Polished Chrome Steel */}
        <path
          d="M 70 13 L 330 14 C 350 15 375 18 384 22 C 375 26 350 29 330 30 L 70 31 Z"
          fill="url(#needleSteel)"
          stroke="#1e293b"
          strokeWidth="1"
        />

        {/* North Pole Cap (Red Tip on Left - Pointing North) */}
        <path
          d="M 14 22 L 70 13 L 70 31 Z"
          fill="url(#northRed)"
          stroke="#7f1d1d"
          strokeWidth="1"
        />
        {/* Sharp Needle Point */}
        <path
          d="M 4 22 L 14 21.5 L 14 22.5 Z"
          fill="#f87171"
        />

        {/* South Pole Cap (Blue Tail on Right with Eye Hole) */}
        <path
          d="M 320 14 C 345 15 372 18 384 22 C 372 26 345 29 320 30 Z"
          fill="url(#southBlue)"
          stroke="#1e3a8a"
          strokeWidth="1"
        />

        {/* Sewing Needle Eye Slot */}
        <ellipse 
          cx="355" 
          cy="22" 
          rx="12" 
          ry="3.5" 
          fill="#0f172a" 
          stroke="#94a3b8" 
          strokeWidth="1" 
        />

        {/* Longitudinal Shine / Highlight Line */}
        <path
          d="M 20 20 L 370 20"
          stroke="url(#steelHighlight)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* North Pole Marker "N" */}
        <text 
          x="42" 
          y="26" 
          fill="#ffffff" 
          fontSize="13" 
          fontWeight="900" 
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }}
        >
          N
        </text>

        {/* South Pole Marker "S" */}
        <text 
          x="332" 
          y="26" 
          fill="#ffffff" 
          fontSize="13" 
          fontWeight="900" 
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }}
        >
          S
        </text>
      </svg>
    </div>
  );
}
