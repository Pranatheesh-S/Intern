import React from 'react';

export const ChartPaperSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      <rect x={-80} y={-8} width={160} height={16} rx={8} fill="rgba(0,0,0,0.3)" />
      <rect x={-70} y={-10} width={140} height={20} fill="#fef3c7" stroke="#d97706" strokeWidth={1} rx={2} />
      {/* Hollow center indication */}
      <ellipse cx={-70} cy={0} rx={4} ry={10} fill="#fcd34d" stroke="#d97706" strokeWidth={1} />
      <ellipse cx={70} cy={0} rx={4} ry={10} fill="#fcd34d" stroke="#d97706" strokeWidth={1} />
      <path d="M -70 -10 L 70 -10 M -70 10 L 70 10" stroke="#d97706" strokeWidth={1} />
    </g>
  );
};

export const IronNailSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      <rect x={-80} y={-8} width={160} height={16} rx={8} fill="rgba(0,0,0,0.3)" />
      <rect x={-80} y={-10} width={10} height={20} fill="#64748b" stroke="#475569" strokeWidth={2} />
      <rect x={-70} y={-6} width={130} height={12} fill="#94a3b8" stroke="#475569" strokeWidth={1} />
      <rect x={-70} y={-3} width={130} height={6} fill="#cbd5e1" />
      <polygon points="60,-6 60,6 80,0" fill="#94a3b8" stroke="#475569" strokeWidth={1} />
    </g>
  );
};

export const CopperCoilSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <path key={i} d={`M ${-50 + i * 8} -10 C ${-48 + i * 8} -16, ${-42 + i * 8} -16, ${-42 + i * 8} -10 L ${-42 + i * 8} 10 C ${-44 + i * 8} 16, ${-50 + i * 8} 16, ${-50 + i * 8} 10 Z`} fill="none" stroke="#b45309" strokeWidth={3} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <path key={i} d={`M ${-50 + i * 8} -10 C ${-48 + i * 8} -16, ${-42 + i * 8} -16, ${-42 + i * 8} -10 L ${-42 + i * 8} 10 C ${-44 + i * 8} 16, ${-50 + i * 8} 16, ${-50 + i * 8} 10 Z`} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      ))}
      <path d="M -50 0 Q -70 -30 -70 -50" fill="none" stroke="#b45309" strokeWidth={4} />
      <path d="M 62 0 Q 80 -30 80 -50" fill="none" stroke="#b45309" strokeWidth={4} />
      <path d="M -50 0 Q -70 -30 -70 -50" fill="none" stroke="#f59e0b" strokeWidth={2} />
      <path d="M 62 0 Q 80 -30 80 -50" fill="none" stroke="#f59e0b" strokeWidth={2} />
      <circle cx={-70} cy={-50} r={6} fill="#fbbf24" stroke="#b45309" strokeWidth={1} />
      <circle cx={80} cy={-50} r={6} fill="#fbbf24" stroke="#b45309" strokeWidth={1} />
    </g>
  );
};

export const SwitchSVG = ({ isPlaced = true, isClosed = false, x = 0, y = 0 }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-40} y={-25} width={80} height={50} rx={4} fill="#eaddcf" stroke="#d4bb9e" strokeWidth={2} />
      <circle cx={-20} cy={0} r={5} fill="#eab308" />
      <circle cx={20} cy={0} r={5} fill="#eab308" />
      <line 
        x1={-20} y1={0} 
        x2={isClosed ? 20 : 15} 
        y2={isClosed ? 0 : -20} 
        stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" 
      />
    </g>
  );
};

export const PaperClipsSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Clip 1 */}
      <path d="M-5,-10 C-10,-10 -10,10 -5,10 L5,10 C10,10 10,-5 5,-5 L-2,-5 C-5,-5 -5,5 -2,5 L2,5" stroke="#64748b" strokeWidth="3" fill="none" />
      {/* Clip 2 */}
      <path d="M10,-5 C5,-5 5,15 10,15 L20,15 C25,15 25,0 20,0 L13,0 C10,0 10,10 13,10 L17,10" stroke="#475569" strokeWidth="3" fill="none" />
      {/* Clip 3 */}
      <path d="M-15,5 C-20,5 -20,25 -15,25 L-5,25 C0,25 0,10 -5,10 L-12,10 C-15,10 -15,20 -12,20 L-8,20" stroke="#334155" strokeWidth="3" fill="none" />
    </g>
  );
};

export const CompassSVG = ({ x = 0, y = 0, isPlaced, needleRotation = 0 }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      <circle r={22} fill="rgba(0,0,0,0.2)" cy={2} />
      <circle r={20} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} />
      <circle r={16} fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <text x={0} y={-11} fontSize="6" fill="#ef4444" textAnchor="middle" fontWeight="bold">N</text>
      <text x={0} y={15} fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="bold">S</text>
      <text x={13} y={2} fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="bold">E</text>
      <text x={-13} y={2} fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="bold">W</text>
      <g transform={`rotate(${needleRotation})`}>
        <polygon points="-3,0 0,-12 3,0" fill="#ef4444" />
        <polygon points="-3,0 0,12 3,0" fill="#3b82f6" />
        <circle r={1.5} fill="#1e293b" />
      </g>
    </g>
  );
};


