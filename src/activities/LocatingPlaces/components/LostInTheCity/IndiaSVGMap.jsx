import React, { useState } from 'react';
import { IndiaMapData } from './IndiaMapData';

export default function IndiaSVGMap({
  activeState,
  hoveredState,
  onStateClick,
  completedJourneys,
}) {
  const [localHover, setLocalHover] = useState(null);

  // States to highlight based on missions
  const activeStateId = activeState?.id;

  const stateCentroids = {
    tn: { x: 230, y: 550 },
    ka: { x: 190, y: 500 },
    tg: { x: 250, y: 440 },
    mh: { x: 160, y: 390 },
    mp: { x: 230, y: 330 },
    up: { x: 270, y: 250 },
    dl: { x: 190, y: 205 },
    wb: { x: 420, y: 330 },
    rj: { x: 130, y: 260 },
  };
  if (!IndiaMapData) {
    return <div>Error: IndiaMapData is undefined</div>;
  }

  if (!IndiaMapData.locations) {
    return <div>Error: IndiaMapData.locations is undefined</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        viewBox={IndiaMapData.viewBox}
        style={{ width: '100%', height: '100%', maxHeight: '600px' }}
      >
        <g stroke="var(--border)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
          {IndiaMapData.locations.map((loc) => {
            const isActive = activeStateId === loc.id;
            const isHovered = localHover === loc.id || hoveredState === loc.id;
            
            // Highlight logic
            let fill = '#fcfcfc';
            let stroke = '#d1d5db';
            let strokeWidth = 1;
            let filter = 'none';
            
            if (isActive) {
              fill = 'var(--primary-light)';
              stroke = 'var(--primary)';
              strokeWidth = 1.5;
            } else if (isHovered) {
              fill = '#f3f4f6';
              stroke = '#9ca3af';
              strokeWidth = 1.5;
            }

            return (
              <path
                key={loc.id}
                id={loc.id}
                d={loc.path}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                filter={filter}
                style={{ 
                  transition: 'fill 0.2s, stroke 0.2s, stroke-width 0.2s', 
                  cursor: 'pointer' 
                }}
                onMouseEnter={() => setLocalHover(loc.id)}
                onMouseLeave={() => setLocalHover(null)}
                onClick={() => onStateClick && onStateClick(loc)}
              />
            );
          })}
        </g>
        
        {/* Draw Journey Lines */}
        <g>
          {completedJourneys.map((journey, index) => {
            const startNode = stateCentroids[journey.from];
            const endNode = stateCentroids[journey.to];
            if (!startNode || !endNode) return null;

            return (
              <g key={`journey-${index}`}>
                <line
                  x1={startNode.x}
                  y1={startNode.y}
                  x2={endNode.x}
                  y2={endNode.y}
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  opacity="0"
                  style={{ animation: 'fade-in 0.3s ease-out forwards' }}
                />
                <circle cx={startNode.x} cy={startNode.y} r="4" fill="var(--primary)" opacity="0" style={{ animation: 'fade-in 0.3s ease-out forwards' }} />
                <circle cx={endNode.x} cy={endNode.y} r="4" fill="var(--primary)" opacity="0" style={{ animation: 'fade-in 0.3s ease-out forwards' }} />
              </g>
            );
          })}
        </g>
      </svg>
      <style>{`
        @keyframes fade-in {
          to { opacity: 0.7; }
        }
      `}</style>
      
      {/* Tooltip */}
      {localHover && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 600,
          pointerEvents: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {IndiaMapData.locations.find(l => l.id === localHover)?.name}
        </div>
      )}
    </div>
  );
}
