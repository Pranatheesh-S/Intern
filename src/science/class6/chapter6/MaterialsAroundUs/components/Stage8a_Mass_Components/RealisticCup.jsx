import React from 'react';

const WaterMaterial = () => (
  <div style={{ 
    width: '100%', height: '100%', position: 'relative',
    background: 'linear-gradient(180deg, rgba(140, 200, 255, 0.5) 0%, rgba(50, 150, 230, 0.7) 100%)',
    boxShadow: 'inset 0 -5px 10px rgba(0,50,150,0.3), inset 0 2px 5px rgba(255,255,255,0.5)'
  }}>
    {/* Surface Ellipse */}
    <div style={{
      position: 'absolute', top: '-4px', left: 0, right: 0, height: '8px',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.7)',
      background: 'rgba(140, 200, 255, 0.4)'
    }} />
    {/* Internal light refraction */}
    <div style={{
      position: 'absolute', bottom: '5px', left: '10%', right: '10%', height: '10px',
      background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)'
    }} />
  </div>
);

const SandMaterial = () => {
  // Using an inline data URI for noise to avoid cross-component ID collisions
  const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`;
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#b89467' }}>
      {/* Noise Texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("${noiseSvg}")`,
        opacity: 0.4,
        mixBlendMode: 'multiply'
      }} />
      
      {/* Gradient shading for 3D depth */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'linear-gradient(180deg, transparent 0%, rgba(60,30,0,0.6) 100%)',
        boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)'
      }} />
      
      {/* Uneven surface line */}
      <svg style={{ position: 'absolute', top: '-2px', left: 0, width: '100%', height: '6px' }} preserveAspectRatio="none">
        <path d="M0,4 Q20,1 40,3 T80,4 L100,2 L100,6 L0,6 Z" fill="#cfab7e" />
      </svg>
    </div>
  );
};

const PebblesMaterial = () => {
  // Hardcoded realistic pebble positions to fill the container volume
  const pebbles = [
    { cx: 10, cy: 38, rx: 12, ry: 8, fill: '#4a4a4c', rot: 15 },
    { cx: 28, cy: 40, rx: 14, ry: 9, fill: '#6c6d70', rot: -10 },
    { cx: 50, cy: 37, rx: 15, ry: 10, fill: '#3d3e40', rot: 25 },
    { cx: 68, cy: 39, rx: 13, ry: 9, fill: '#787774', rot: 5 },
    
    { cx: 15, cy: 25, rx: 13, ry: 10, fill: '#555659', rot: -20 },
    { cx: 35, cy: 28, rx: 16, ry: 11, fill: '#807e7b', rot: 45 },
    { cx: 55, cy: 24, rx: 12, ry: 8, fill: '#454648', rot: -30 },
    { cx: 70, cy: 26, rx: 10, ry: 7, fill: '#5e5d5b', rot: 10 },
    
    { cx: 22, cy: 15, rx: 11, ry: 8, fill: '#3a3a3c', rot: 35 },
    { cx: 42, cy: 16, rx: 14, ry: 9, fill: '#606163', rot: -15 },
    { cx: 62, cy: 14, rx: 12, ry: 9, fill: '#706e6b', rot: 50 },
    
    { cx: 32, cy: 6, rx: 10, ry: 6, fill: '#4d4d4f', rot: -5 },
    { cx: 52, cy: 7, rx: 11, ry: 7, fill: '#5b5a58', rot: 20 },
  ];
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#2c2c2e' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 80 45" preserveAspectRatio="none">
        <defs>
          <radialGradient id="pebbleGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </radialGradient>
        </defs>
        {pebbles.map((p, i) => (
          <g key={i} transform={`translate(${p.cx}, ${p.cy}) rotate(${p.rot})`}>
            {/* Ambient occlusion shadow */}
            <ellipse cx={0} cy={2} rx={p.rx} ry={p.ry} fill="rgba(0,0,0,0.7)" />
            {/* Base Color */}
            <ellipse cx={0} cy={0} rx={p.rx} ry={p.ry} fill={p.fill} />
            {/* 3D Shading highlight */}
            <ellipse cx={0} cy={0} rx={p.rx} ry={p.ry} fill="url(#pebbleGrad)" />
          </g>
        ))}
      </svg>
      {/* Overall cup depth shading */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export const RealisticCup = ({ material }) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      borderRadius: '4px 4px 16px 16px',
      // We apply drop-shadow here so it casts a shadow during drag, 
      // but when on the scale, the scale renders its own contact shadow.
      filter: 'drop-shadow(0 15px 10px rgba(0,0,0,0.2))'
    }}>
      
      {/* Back wall of glass */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
        borderRadius: 'inherit',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
      }} />
      
      {/* Material Container (Masked to internal cup shape) */}
      <div style={{
        position: 'absolute', bottom: '8px', left: '3px', right: '3px', height: '42%',
        borderRadius: '2px 2px 12px 12px',
        overflow: 'hidden'
      }}>
         {material === 'water' && <WaterMaterial />}
         {material === 'sand' && <SandMaterial />}
         {material === 'pebbles' && <PebblesMaterial />}
      </div>

      {/* Thick Glass Base */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0.3) 100%)',
        borderRadius: '0 0 16px 16px',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 2px rgba(0,0,0,0.2)'
      }} />

      {/* Front wall glass & reflections */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: 'inset 3px 0 10px rgba(255,255,255,0.5), inset -5px 0 15px rgba(0,0,0,0.1), inset 0 -10px 10px rgba(255,255,255,0.2)'
      }}>
        {/* Harsh specular highlight mimicking lab lighting */}
        <div style={{
          position: 'absolute', top: '2px', bottom: '12px', left: '15%', width: '12%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: '10px',
          transform: 'skewX(-2deg)'
        }} />
      </div>

      {/* Top Rim */}
      <div style={{
        position: 'absolute', top: '-3px', left: '-1px', right: '-1px', height: '6px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,1)',
        background: 'rgba(255,255,255,0.2)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.9)'
      }} />
      
    </div>
  );
};
