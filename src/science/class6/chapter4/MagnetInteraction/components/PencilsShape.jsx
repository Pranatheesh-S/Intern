import React from 'react';

export default function PencilsShape({ 
  width = 200, 
  height = 110,
  style = {}
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.65))',
        pointerEvents: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 220 110" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pencil Wooden Body Gradient */}
          <linearGradient id="pencilWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Eraser Pink Gradient */}
          <linearGradient id="pencilEraser" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>

          {/* Metallic Ferrule Gradient */}
          <linearGradient id="pencilFerrule" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Sharpened Wood Tip */}
          <linearGradient id="pencilTipWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Graphite Lead */}
          <linearGradient id="pencilGraphite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* 3 Parallel Straight Pencils */}
        {[30, 110, 190].map((cx, idx) => (
          <g key={idx} transform={`translate(${cx - 15}, 5)`}>
            {/* Soft Shadow under each pencil */}
            <rect x="2" y="10" width="22" height="92" rx="11" fill="rgba(0,0,0,0.3)" />

            {/* Pink Eraser Top */}
            <rect x="4" y="2" width="18" height="14" rx="4" fill="url(#pencilEraser)" stroke="#9d174d" strokeWidth="0.5" />

            {/* Silver Metallic Ferrule Band */}
            <rect x="3" y="15" width="20" height="10" rx="1" fill="url(#pencilFerrule)" stroke="#334155" strokeWidth="0.5" />
            <line x1="3" y1="18" x2="23" y2="18" stroke="#f8fafc" strokeWidth="0.75" opacity="0.8" />
            <line x1="3" y1="22" x2="23" y2="22" stroke="#475569" strokeWidth="0.75" opacity="0.8" />

            {/* Yellow Hexagonal Hex Body */}
            <rect x="4" y="25" width="18" height="60" fill="url(#pencilWood)" stroke="#a16207" strokeWidth="0.5" />
            {/* Longitudinal Facet Highlight Lines */}
            <line x1="10" y1="25" x2="10" y2="85" stroke="#fef08a" strokeWidth="1" opacity="0.6" />
            <line x1="16" y1="25" x2="16" y2="85" stroke="#a16207" strokeWidth="1" opacity="0.5" />

            {/* Sharpened Cone Tip */}
            <polygon points="4,85 22,85 13,98" fill="url(#pencilTipWood)" stroke="#b45309" strokeWidth="0.5" />

            {/* Graphite Point */}
            <polygon points="10,93.5 16,93.5 13,98" fill="url(#pencilGraphite)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
