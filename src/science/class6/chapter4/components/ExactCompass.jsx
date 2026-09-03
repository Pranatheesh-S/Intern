import React from 'react';
import { motion } from 'framer-motion';

export default function ExactCompass({ 
  rotation = 0, 
  size = 300, 
  scale = 1,
  style = {},
  onClick,
  onCenterClick,
  transition,
  showThumbLoop = true
}) {
  return (
    <div 
      onClick={onClick}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'center center',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 300 300" 
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <defs>
          {/* Metallic Antique Brass Outer Bezel Gradient */}
          <radialGradient id="exactCompassBrassBezel" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="15%" stopColor="#E6B743" />
            <stop offset="42%" stopColor="#A87319" />
            <stop offset="70%" stopColor="#6E440C" />
            <stop offset="90%" stopColor="#452705" />
            <stop offset="100%" stopColor="#2A1602" />
          </radialGradient>

          {/* Stepped Brass Inner Lip Gradient */}
          <radialGradient id="exactCompassInnerLip" cx="50%" cy="50%" r="50%">
            <stop offset="84%" stopColor="#1E0E01" />
            <stop offset="91%" stopColor="#784C0E" />
            <stop offset="97%" stopColor="#F5D061" />
            <stop offset="100%" stopColor="#3B1E04" />
          </radialGradient>

          {/* Dial Face Cream Parchment Gradient */}
          <radialGradient id="exactCompassDialParchment" cx="48%" cy="48%" r="52%">
            <stop offset="0%" stopColor="#FFFEFA" />
            <stop offset="45%" stopColor="#FAF4E4" />
            <stop offset="80%" stopColor="#EDE0C1" />
            <stop offset="100%" stopColor="#D9C79E" />
          </radialGradient>

          {/* Center Pivot Golden Spherical Gradient */}
          <radialGradient id="exactCompassPivotSphere" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FEE08B" />
            <stop offset="55%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#854D0E" />
            <stop offset="100%" stopColor="#451A03" />
          </radialGradient>

          {/* Drop Shadows */}
          <filter id="exactCompassCasingShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#000000" floodOpacity="0.55" />
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.4" />
          </filter>

          {/* Thumb Loop Linear Antique Brass Gradient (Matching Compass Casing) */}
          <linearGradient id="exactCompassThumbLoopGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="18%" stopColor="#E6B743" />
            <stop offset="45%" stopColor="#A87319" />
            <stop offset="75%" stopColor="#6E440C" />
            <stop offset="90%" stopColor="#452705" />
            <stop offset="100%" stopColor="#2A1602" />
          </linearGradient>

          {/* Hinge Mounting Bracket Gradient */}
          <linearGradient id="exactCompassHingeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#452705" />
            <stop offset="25%" stopColor="#E6B743" />
            <stop offset="50%" stopColor="#FFF8C4" />
            <stop offset="75%" stopColor="#A87319" />
            <stop offset="100%" stopColor="#2A1602" />
          </linearGradient>

          {/* Thumb Loop Drop Shadow */}
          <filter id="exactCompassThumbLoopShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
          </filter>

          <filter id="exactCompassNeedleShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 0. Top Brass Thumb Loop / Carry Ring (Behind Main Casing) */}
        {showThumbLoop && (
          <g filter="url(#exactCompassThumbLoopShadow)">
            {/* Outer Rim Contour */}
            <ellipse cx="150" cy="-26" rx="35" ry="33" fill="none" stroke="#1F1002" strokeWidth="1.5" />
            {/* Main Volumetric Brass Loop */}
            <ellipse cx="150" cy="-26" rx="29.5" ry="27.5" fill="none" stroke="url(#exactCompassThumbLoopGrad)" strokeWidth="11" />
            {/* Top-Left Specular Highlight Sheen */}
            <path
              d="M 124 -36 A 29.5 27.5 0 0 1 176 -36"
              fill="none"
              stroke="#FFFAD2"
              strokeWidth="2.2"
              opacity="0.8"
            />
            {/* Inner Dark Contour */}
            <ellipse cx="150" cy="-26" rx="24" ry="22" fill="none" stroke="#2A1602" strokeWidth="1.5" />
          </g>
        )}

        {/* 1. Heavy Polished Antique Brass Outer Casing */}
        <circle 
          cx="150" 
          cy="150" 
          r="146" 
          fill="url(#exactCompassBrassBezel)" 
          stroke="#1F1002" 
          strokeWidth="3" 
          filter="url(#exactCompassCasingShadow)" 
        />

        {/* Top Brass Hinge / Mounting Bracket (Locking Thumb Loop to Casing) */}
        {showThumbLoop && (
          <g>
            {/* Bracket Base Block */}
            <rect 
              x="133" 
              y="-4" 
              width="34" 
              height="16" 
              rx="4" 
              ry="4" 
              fill="url(#exactCompassHingeGrad)" 
              stroke="#1F1002" 
              strokeWidth="2" 
            />
            {/* Stepped Inner Inset */}
            <rect 
              x="136" 
              y="-2" 
              width="28" 
              height="12" 
              rx="2.5" 
              ry="2.5" 
              fill="none" 
              stroke="#FFF8C4" 
              strokeWidth="1.2" 
              opacity="0.6" 
            />
            {/* Center Pivot Brass Rivet Pin */}
            <circle cx="150" cy="4" r="4.2" fill="url(#exactCompassPivotSphere)" stroke="#1F1002" strokeWidth="1.2" />
            {/* Pivot Specular Dot */}
            <circle cx="148.5" cy="2.5" r="1.3" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {/* 2. Stepped Bezel Rings */}
        <circle 
          cx="150" 
          cy="150" 
          r="133" 
          fill="none" 
          stroke="url(#exactCompassInnerLip)" 
          strokeWidth="7" 
        />
        <circle 
          cx="150" 
          cy="150" 
          r="126.5" 
          fill="none" 
          stroke="#261302" 
          strokeWidth="2" 
        />

        {/* 3. Warm Cream Parchment Dial Face */}
        <circle 
          cx="150" 
          cy="150" 
          r="125.5" 
          fill="url(#exactCompassDialParchment)" 
        />
        <circle 
          cx="150" 
          cy="150" 
          r="125.5" 
          fill="none" 
          stroke="rgba(70, 35, 5, 0.25)" 
          strokeWidth="1.5" 
        />

        {/* 4. Radial Degree Guideline Track */}
        <circle 
          cx="150" 
          cy="150" 
          r="116" 
          fill="none" 
          stroke="rgba(120, 75, 15, 0.45)" 
          strokeWidth="1" 
        />

        {/* 5. 360-Degree Radial Precision Tick Marks */}
        {Array.from({ length: 72 }).map((_, idx) => {
          const deg = idx * 5;
          const isCardinal = deg % 90 === 0;
          const isMajor = deg % 30 === 0 && !isCardinal;
          const isMinor = deg % 10 === 0 && !isMajor && !isCardinal;

          const rad = (deg - 90) * (Math.PI / 180);
          const rOuter = 116;
          const rInner = isCardinal ? 104 : isMajor ? 107 : isMinor ? 110 : 112.5;

          const x1 = 150 + Math.cos(rad) * rOuter;
          const y1 = 150 + Math.sin(rad) * rOuter;
          const x2 = 150 + Math.cos(rad) * rInner;
          const y2 = 150 + Math.sin(rad) * rInner;

          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isCardinal ? '#451A03' : isMajor ? '#78350F' : '#A16207'}
              strokeWidth={isCardinal ? 2.2 : isMajor ? 1.6 : isMinor ? 1.1 : 0.75}
              strokeLinecap="round"
            />
          );
        })}

        {/* 6. 3D Faceted Compass Rose Star on Dial Face */}
        {/* Secondary 4 Intercardinal Pointers (NE, NW, SE, SW) */}
        <g opacity="0.95">
          {/* North-East */}
          <polygon points="198,102 150,150 178,114" fill="#E8DEC5" />
          <polygon points="198,102 186,122 150,150" fill="#BFAF93" />

          {/* North-West */}
          <polygon points="102,102 150,150 114,122" fill="#E8DEC5" />
          <polygon points="102,102 122,114 150,150" fill="#BFAF93" />

          {/* South-East */}
          <polygon points="198,198 150,150 186,178" fill="#E8DEC5" />
          <polygon points="198,198 178,186 150,150" fill="#BFAF93" />

          {/* South-West */}
          <polygon points="102,198 150,150 122,186" fill="#E8DEC5" />
          <polygon points="102,198 114,178 150,150" fill="#BFAF93" />
        </g>

        {/* Primary 4 Cardinal Pointers (North, South, East, West) with Chiseled Ridge */}
        <g>
          {/* NORTH Pointer (Elongated Flared Gold/Bronze Arrowhead) */}
          <polygon points="150,48 150,150 143,84" fill="#F59E0B" />
          <polygon points="150,48 157,84 150,150" fill="#92400E" />

          {/* SOUTH Pointer */}
          <polygon points="150,252 150,150 143,216" fill="#F59E0B" />
          <polygon points="150,252 157,216 150,150" fill="#92400E" />

          {/* EAST Pointer */}
          <polygon points="252,150 150,150 216,143" fill="#F59E0B" />
          <polygon points="252,150 216,157 150,150" fill="#92400E" />

          {/* WEST Pointer */}
          <polygon points="48,150 150,150 84,143" fill="#F59E0B" />
          <polygon points="48,150 84,157 150,150" fill="#92400E" />
        </g>

        {/* 7. Cardinal Typography & Degree Labels */}
        {/* NORTH */}
        <text 
          x="150" 
          y="42" 
          textAnchor="middle" 
          fill="#6B2808" 
          fontSize="24" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, serif"
        >
          N
        </text>
        <text 
          x="150" 
          y="54" 
          textAnchor="middle" 
          fill="#78350F" 
          fontSize="10" 
          fontWeight="800" 
          fontFamily="system-ui, sans-serif"
        >
          0°
        </text>

        {/* EAST */}
        <text 
          x="256" 
          y="158" 
          textAnchor="middle" 
          fill="#1E293B" 
          fontSize="22" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          E
        </text>
        <text 
          x="233" 
          y="146" 
          textAnchor="middle" 
          fill="#78350F" 
          fontSize="10" 
          fontWeight="800" 
          fontFamily="system-ui, sans-serif"
        >
          90°
        </text>

        {/* SOUTH */}
        <text 
          x="150" 
          y="270" 
          textAnchor="middle" 
          fill="#1E293B" 
          fontSize="22" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          S
        </text>
        <text 
          x="150" 
          y="244" 
          textAnchor="middle" 
          fill="#78350F" 
          fontSize="10" 
          fontWeight="800" 
          fontFamily="system-ui, sans-serif"
        >
          180°
        </text>

        {/* WEST */}
        <text 
          x="44" 
          y="158" 
          textAnchor="middle" 
          fill="#1E293B" 
          fontSize="22" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          W
        </text>
        <text 
          x="67" 
          y="146" 
          textAnchor="middle" 
          fill="#78350F" 
          fontSize="10" 
          fontWeight="800" 
          fontFamily="system-ui, sans-serif"
        >
          270°
        </text>
      </svg>

      {/* 8. Rotating 3D Chiseled Magnetic Needle & Center Orb Pivot */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={transition || { type: 'spring', stiffness: 75, damping: 14 }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 300 300" 
          style={{ overflow: 'visible', filter: 'url(#exactCompassNeedleShadow)' }}
        >
          {/* North Half (Crimson Red with Left Bevel Specular Highlight) */}
          <g>
            {/* Left Bright Red Bevel */}
            <polygon points="150,38 150,150 137,126" fill="#EF4444" />
            {/* Right Deep Carmine Red Body */}
            <polygon points="150,38 163,126 150,150" fill="#B91C1C" />
            {/* Specular Highlight Streak */}
            <polygon points="150,44 150,140 141,124" fill="rgba(255, 255, 255, 0.35)" />
            {/* Bold White Letter N on North Blade */}
            <text 
              x="150" 
              y="100" 
              textAnchor="middle" 
              fill="#FFFFFF" 
              fontSize="14" 
              fontWeight="900" 
              fontFamily="system-ui, serif"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
            >
              N
            </text>
          </g>

          {/* South Half (Deep Midnight Navy with Specular Bevel) */}
          <g>
            {/* Left Dark Slate Blue Bevel */}
            <polygon points="150,262 150,150 137,174" fill="#334155" />
            {/* Right Midnight Blue Navy Body */}
            <polygon points="150,262 163,174 150,150" fill="#0F172A" />
            {/* Specular Highlight Streak */}
            <polygon points="150,256 150,160 141,176" fill="rgba(255, 255, 255, 0.2)" />
            {/* Bold White Letter S on South Blade */}
            <text 
              x="150" 
              y="210" 
              textAnchor="middle" 
              fill="#FFFFFF" 
              fontSize="14" 
              fontWeight="900" 
              fontFamily="system-ui, serif"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
            >
              S
            </text>
          </g>

          {/* 3D Polished Golden Center Pivot Orb */}
          <circle 
            cx="150" 
            cy="150" 
            r="16" 
            fill="url(#exactCompassPivotSphere)" 
            stroke="#451A03" 
            strokeWidth="1.5" 
          />
          <circle 
            cx="146" 
            cy="146" 
            r="4" 
            fill="rgba(255, 255, 255, 0.75)" 
          />
        </svg>
      </motion.div>

      {/* 9. Convex Glass Cover Reflection Sheen */}
      <div 
        style={{
          position: 'absolute',
          width: '84%',
          height: '84%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0) 65%)',
          pointerEvents: 'none',
          zIndex: 30
        }} 
      />

      {/* 10. Interactive Center Pivot Button (Click center to realign needle North-South) */}
      {(onCenterClick || onClick) && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            if (onCenterClick) onCenterClick();
            else if (onClick) onClick();
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          title="Click center to return needle to normal North & South"
          style={{
            position: 'absolute',
            width: `${Math.max(28, size * 0.12)}px`,
            height: `${Math.max(28, size * 0.12)}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 32%, #FFFFFF 0%, #FEE08B 25%, #D97706 55%, #854D0E 85%, #451A03 100%)',
            border: '2px solid #FEF08A',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.6), 0 4px 10px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            outline: 'none'
          }}
        >
          <div style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 0 3px #FFFFFF'
          }} />
        </motion.button>
      )}
    </div>
  );
}
