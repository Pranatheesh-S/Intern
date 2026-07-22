import React from 'react';
import { motion } from 'framer-motion';

// A simple Mirror SVG showing the curved surface.
export function MirrorSVG({ type = 'concave', width = 160, height = 300 }) {
  const isConcave = type === 'concave';
  
  return (
    <svg width={width} height={height} viewBox="0 0 160 300">
      <defs>
        <linearGradient id="mirrorMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--border)" />
          <stop offset="50%" stopColor="var(--text-faint)" />
          <stop offset="100%" stopColor="var(--text-secondary)" />
        </linearGradient>
        {/* Concave depth */}
        <radialGradient id="concaveDepth" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </radialGradient>
        {/* Convex bulge */}
        <radialGradient id="convexBulge" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="var(--surface)" />
        </radialGradient>
      </defs>

      {/* Stand base */}
      <path d="M 40 280 L 120 280 L 100 250 L 60 250 Z" fill="var(--text-secondary)" />
      {/* Stand pole */}
      <rect x="75" y="160" width="10" height="100" fill="var(--text-secondary)" />

      {/* Mirror Frame */}
      <circle cx="80" cy="90" r="75" fill="var(--text-primary)" />
      <circle cx="80" cy="90" r="70" fill="url(#mirrorMetal)" />
      
      {/* Glass Surface */}
      <circle 
        cx="80" cy="90" r="65" 
        fill={isConcave ? "url(#concaveDepth)" : "url(#convexBulge)"}
      />
    </svg>
  );
}

// An object (candle) to be reflected in the mirror
export function ReflectedObject({ scale = 1, isVerticallyInverted = false, opacity = 1 }) {
  return (
    <motion.div
      animate={{ 
        scaleX: scale,
        scaleY: isVerticallyInverted ? -scale : scale,
        opacity: opacity
      }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      style={{ display: 'inline-block' }}
    >
      <svg width="80" height="120" viewBox="0 0 80 120">
        {/* Candle body */}
        <rect x="25" y="40" width="30" height="80" fill="var(--text-heading)" rx="2" />
        <path d="M 25 40 Q 40 35 55 40" fill="var(--border)" />
        <rect x="25" y="45" width="30" height="75" fill="var(--neutral-bg)" />
        {/* Wick */}
        <path d="M 40 40 Q 38 30 40 25" fill="none" stroke="var(--text-secondary)" strokeWidth="2" />
        {/* Flame */}
        <path d="M 40 5 Q 50 15 40 25 Q 30 15 40 5" fill="#fde047" />
        <path d="M 40 10 Q 45 15 40 25 Q 35 15 40 10" fill="#f97316" />
      </svg>
    </motion.div>
  );
}
