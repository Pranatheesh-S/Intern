import React from 'react';
import { motion, useTransform } from 'framer-motion';

const WaterMaterial = ({ velocityX }) => {
  // Map horizontal drag velocity to a very subtle liquid surface tilt (max ~3deg)
  const surfaceTilt = velocityX ? useTransform(velocityX, [-600, 600], [-3, 3]) : 0;
  const meniscusShift = velocityX ? useTransform(velocityX, [-600, 600], [2, -2]) : 0;

  return (
    <div style={{ 
      width: '100%', height: '100%', position: 'relative',
      background: 'linear-gradient(180deg, rgba(160, 210, 230, 0.1) 0%, rgba(130, 190, 220, 0.25) 50%, rgba(80, 150, 190, 0.6) 100%)',
      boxShadow: 'inset 0 -15px 25px rgba(0, 60, 100, 0.4), inset 5px 0 12px rgba(255,255,255,0.25), inset -5px 0 12px rgba(0, 30, 50, 0.1)',
      borderRadius: 'inherit'
    }}>
      
      {/* Meniscus / Liquid Surface Boundary with physics inertia */}
      <motion.div 
        style={{
          position: 'absolute', top: '-6px', left: 0, right: 0, height: '12px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 255, 255, 0.8)',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(180, 210, 230, 0.1) 60%, rgba(120, 180, 210, 0.4) 100%)',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0, 80, 130, 0.25), 0 3px 6px rgba(0, 50, 90, 0.15)',
          overflow: 'hidden',
          rotate: surfaceTilt,
          x: meniscusShift
        }}
      >
        {/* Soft horizontal surface reflection */}
        <div style={{
          position: 'absolute', top: '2px', left: '15%', right: '15%', height: '3px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '50%',
          filter: 'blur(1px)'
        }} />
      </motion.div>
      
      {/* Meniscus upward curvature climbing the cup wall */}
      <motion.div 
        style={{
          position: 'absolute', top: '-4px', left: '-2px', right: '-2px', height: '16px',
          borderRadius: '50%',
          borderTop: '2px solid rgba(255,255,255,0.6)',
          filter: 'blur(1px)',
          pointerEvents: 'none',
          rotate: surfaceTilt
        }} 
      />

      {/* Volume Refraction */}
      <div style={{
        position: 'absolute', inset: 0,
        backdropFilter: 'blur(3px)',
        pointerEvents: 'none',
        borderRadius: 'inherit'
      }} />

      {/* Internal light scattering */}
      <div style={{
        position: 'absolute', top: '25%', bottom: '10%', left: '20%', right: '20%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 60%)',
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        filter: 'blur(3px)'
      }} />
    </div>
  );
};

const SandMaterial = ({ velocityX }) => {
  const sandShift = velocityX ? useTransform(velocityX, [-600, 600], [-1.5, 1.5]) : 0;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#d3ba9b' }}>
      
      {/* Photorealistic Sand Grain Texture */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="sandGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise" />
            <feDiffuseLighting in="noise" surfaceScale="2" diffuseConstant="1.1" lightingColor="#fff8f0" result="light">
              <feDistantLight azimuth="45" elevation="45" />
            </feDiffuseLighting>
            <feBlend mode="overlay" in="light" in2="SourceGraphic" result="lit" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 1 0 0 0 0, 1 0 0 0 0, 0 0 0 0.4 0" in="noise" result="crevices" />
            <feBlend mode="multiply" in="lit" in2="crevices" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#cca985" filter="url(#sandGrain)" />
      </svg>
      
      {/* Compaction depth */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'linear-gradient(180deg, transparent 30%, rgba(50, 25, 0, 0.5) 100%)',
        pointerEvents: 'none'
      }} />

      {/* 3D Cylinder Shading */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none'
      }} />
      
      {/* Uneven natural sand surface at the top with slight physics response */}
      <motion.svg 
        style={{ position: 'absolute', top: '-5px', left: 0, width: '100%', height: '14px', x: sandShift }} 
        preserveAspectRatio="none"
      >
        <path d="M0,7 Q15,1 40,4 T80,3 T100,6 L100,14 L0,14 Z" fill="rgba(60, 40, 20, 0.6)" />
        <path d="M0,8 Q20,3 45,7 T85,5 T100,9 L100,14 L0,14 Z" fill="#ddc3a3" />
        <path d="M0,8 Q20,3 45,7 T85,5 T100,9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      </motion.svg>
    </div>
  );
};

const PebblesMaterial = ({ velocityX }) => {
  const pebbleShift = velocityX ? useTransform(velocityX, [-600, 600], [-1, 1]) : 0;

  const pathA = "M -10,-5 C -2,-12 8,-10 14,-2 C 18,6 12,12 4,14 C -6,16 -14,8 -10,-5 Z";
  const pathB = "M 0,-12 C 10,-9 14,-1 10,7 C 6,15 -7,13 -11,5 C -15,-3 -8,-14 0,-12 Z";
  const pathC = "M -14,-3 C -9,-9 11,-7 16,-1 C 21,5 12,11 0,13 C -11,15 -19,4 -14,-3 Z";
  const pathD = "M -7,-10 C 6,-11 11,-4 9,6 C 7,16 -4,13 -9,9 C -14,4 -17,-5 -7,-10 Z";
  const pathE = "M -12,-6 C -6,-15 8,-12 12,-4 C 16,4 10,14 0,16 C -10,18 -18,2 -12,-6 Z";
  const pathF = "M 2,-14 C 12,-11 15,1 9,10 C 3,18 -8,15 -12,7 C -16,-1 -8,-16 2,-14 Z";

  const c = {
    slate: '#6B7075',
    limestone: '#C2BBB1',
    sandstone: '#B3997A',
    granite: '#85817B',
    basalt: '#4A4A4A',
    quartz: '#DED7CE',
    flint: '#5A5652',
    warmGray: '#8F8982',
    earth: '#87705B'
  };

  const pebbles = [
    { d: pathC, x: 10, y: 41, s: 0.9, r: 10, f: c.flint },
    { d: pathE, x: 25, y: 40, s: 1.1, r: -20, f: c.granite },
    { d: pathA, x: 42, y: 42, s: 0.8, r: 45, f: c.basalt },
    { d: pathF, x: 55, y: 39, s: 1.0, r: -15, f: c.earth },
    { d: pathB, x: 68, y: 40, s: 0.9, r: 30, f: c.slate },
    { d: pathA, x: 5,  y: 33, s: 1.0, r: 70, f: c.sandstone },
    { d: pathD, x: 20, y: 34, s: 1.2, r: 15, f: c.warmGray },
    { d: pathC, x: 38, y: 32, s: 0.9, r: -35, f: c.quartz },
    { d: pathE, x: 52, y: 33, s: 1.1, r: 85, f: c.limestone },
    { d: pathF, x: 68, y: 31, s: 0.8, r: -50, f: c.granite },
    { d: pathB, x: 12, y: 24, s: 0.9, r: -10, f: c.slate },
    { d: pathC, x: 30, y: 26, s: 1.0, r: 50, f: c.flint },
    { d: pathA, x: 48, y: 24, s: 1.1, r: -80, f: c.earth },
    { d: pathD, x: 65, y: 25, s: 0.9, r: 25, f: c.basalt },
    { d: pathE, x: 8,  y: 15, s: 0.8, r: 35, f: c.quartz },
    { d: pathD, x: 25, y: 16, s: 1.0, r: -40, f: c.sandstone },
    { d: pathF, x: 40, y: 14, s: 0.9, r: 120, f: c.limestone },
    { d: pathB, x: 58, y: 15, s: 1.1, r: 15, f: c.warmGray },
    { d: pathC, x: 72, y: 17, s: 0.8, r: -60, f: c.slate },
  ];
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1c1b1a' }}>
      <motion.svg 
        width="100%" height="100%" 
        style={{ position: 'absolute', inset: 0, x: pebbleShift }} 
        viewBox="0 0 74 42" 
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="stoneTexture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 1 0 0 0 0, 1 0 0 0 0, 0 0 0 0.15 0" in="noise" result="coloredNoise" />
            <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
          </filter>

          <linearGradient id="stoneLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="65%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.8)" />
          </linearGradient>

          <radialGradient id="stoneHighlight" cx="25%" cy="25%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        
        <g>
          {pebbles.map((p, i) => (
            <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.r}) scale(${p.s})`}>
              <path d={p.d} fill="rgba(0,0,0,0.9)" transform="translate(1, 2.5) scale(1.05)" filter="blur(1.5px)" />
              <path d={p.d} fill={p.f} filter="url(#stoneTexture)" />
              <path d={p.d} fill="url(#stoneLight)" />
              <path d={p.d} fill="url(#stoneHighlight)" />
            </g>
          ))}
        </g>
      </motion.svg>

      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none'
      }} />
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export const RealisticCup = ({ material, velocityX = 0 }) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      borderRadius: '4px 4px 16px 16px',
      transform: 'translateZ(0)'
    }}>
      
      {/* Grounding Contact Shadows */}
      <div style={{
        position: 'absolute', bottom: '-8px', left: '10%', right: '10%', height: '10px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        filter: 'blur(5px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'absolute', bottom: '-4px', left: '20%', right: '20%', height: '5px',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: -1
      }} />
      
      {/* Back wall of the glass */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.02) 80%, rgba(255,255,255,0.25) 100%)',
        borderRadius: 'inherit',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), inset 6px 0 10px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(1px) brightness(1.02)'
      }} />
      
      {/* The actual material filling the cup */}
      <div style={{
        position: 'absolute', bottom: '10px', left: '4px', right: '4px', height: '42%',
        borderRadius: '2px 2px 10px 10px',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
      }}>
         {material === 'water' && <WaterMaterial velocityX={velocityX} />}
         {material === 'sand' && <SandMaterial velocityX={velocityX} />}
         {material === 'pebbles' && <PebblesMaterial velocityX={velocityX} />}
      </div>

      {/* Solid Thick Glass Base */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '12px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.8) 80%, rgba(255,255,255,0.5) 100%)',
        borderRadius: '0 0 16px 16px',
        boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.9), inset 0 -4px 6px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(3px)'
      }} />

      {/* Front wall glass & specular highlights */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        borderLeft: '1.5px solid rgba(255,255,255,0.95)',
        borderRight: '2px solid rgba(255,255,255,0.7)',
        borderBottom: '1.5px solid rgba(255,255,255,0.5)',
        boxShadow: 'inset 8px 0 15px rgba(255,255,255,0.8), inset -8px 0 20px rgba(0,0,0,0.3), inset 0 -12px 15px rgba(255,255,255,0.5)',
        pointerEvents: 'none'
      }}>
        {/* Specular reflection */}
        <div style={{
          position: 'absolute', top: '10%', bottom: '15%', left: '12%', width: '25%',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
          borderRadius: '50%',
          transform: 'skewX(-4deg)',
          filter: 'blur(3px)'
        }} />

        {/* Sharp lab ceiling highlight */}
        <div style={{
          position: 'absolute', top: '2px', bottom: '14px', left: '18%', width: '6%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)',
          borderRadius: '10px',
          transform: 'skewX(-2deg)'
        }} />
      </div>

      {/* Top Rim of the Cup */}
      <div style={{
        position: 'absolute', top: '-5px', left: '-1.5px', right: '-1.5px', height: '10px',
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,1), inset 0 -1px 2px rgba(255,255,255,0.6)',
        backdropFilter: 'blur(1px)'
      }} />
      
    </div>
  );
};
