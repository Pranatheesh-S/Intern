import React from 'react';

export const IronNailSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      {/* Shadow */}
      <rect x={-80} y={-8} width={160} height={16} rx={8} fill="rgba(0,0,0,0.3)" />
      
      {/* Nail Head */}
      <rect x={-80} y={-10} width={10} height={20} fill="#64748b" stroke="#475569" strokeWidth={2} />
      
      {/* Nail Body */}
      <rect x={-70} y={-6} width={130} height={12} fill="#94a3b8" stroke="#475569" strokeWidth={1} />
      <rect x={-70} y={-3} width={130} height={6} fill="#cbd5e1" />
      
      {/* Nail Tip */}
      <polygon points="60,-6 60,6 80,0" fill="#94a3b8" stroke="#475569" strokeWidth={1} />
    </g>
  );
};

export const CopperCoilSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      {/* Coils wrapped around (horizontal) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <path key={i} d={`M ${-50 + i * 8} -8 C ${-48 + i * 8} -14, ${-42 + i * 8} -14, ${-42 + i * 8} -8 L ${-42 + i * 8} 8 C ${-44 + i * 8} 14, ${-50 + i * 8} 14, ${-50 + i * 8} 8 Z`} fill="none" stroke="#b45309" strokeWidth={3} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <path key={i} d={`M ${-50 + i * 8} -8 C ${-48 + i * 8} -14, ${-42 + i * 8} -14, ${-42 + i * 8} -8 L ${-42 + i * 8} 8 C ${-44 + i * 8} 14, ${-50 + i * 8} 14, ${-50 + i * 8} 8 Z`} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      ))}
      
      {/* Wire Ends */}
      <path d="M -50 0 Q -70 -30 -70 -50" fill="none" stroke="#b45309" strokeWidth={4} />
      <path d="M 62 0 Q 80 -30 80 -50" fill="none" stroke="#b45309" strokeWidth={4} />
      
      <path d="M -50 0 Q -70 -30 -70 -50" fill="none" stroke="#f59e0b" strokeWidth={2} />
      <path d="M 62 0 Q 80 -30 80 -50" fill="none" stroke="#f59e0b" strokeWidth={2} />
      
      {/* Terminals (Connection points) */}
      <circle cx={-70} cy={-50} r={6} fill="#fbbf24" stroke="#b45309" strokeWidth={1} />
      <circle cx={80} cy={-50} r={6} fill="#fbbf24" stroke="#b45309" strokeWidth={1} />
    </g>
  );
};
