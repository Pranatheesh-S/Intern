import React, { useState } from 'react';
import { IndiaMapData } from './IndiaMapData';

export default function IndiaSVGMap({
  activeRoute, // { to: string, showBoth: boolean }
  animating,
  missionIndex,
  missions
}) {
  const [localHover, setLocalHover] = useState(null);

  const projectCoordinates = (lat, lon) => {
    // Calibrated affine transformation using 12 geographic control points across India
    const a = 20.6606;
    const b = 0.5652;
    const c = -1416.7303;
    const d = 0.4941;
    const e = -23.4696;
    const f = 836.2510;

    return {
      x: a * lon + b * lat + c,
      y: d * lon + e * lat + f
    };
  };

  const cityData = {
    tn: { lat: 13.0827, lon: 80.2707, state: "Tamil Nadu", name: "Chennai", anchor: "start", dx: 8, dy: 4 },
    ka: { lat: 12.9716, lon: 77.5946, state: "Karnataka", name: "Bengaluru", anchor: "end", dx: -8, dy: 12 },
    mh: { lat: 19.0760, lon: 72.8777, state: "Maharashtra", name: "Mumbai", anchor: "start", dx: 8, dy: 12 },
    ap: { lat: 16.5193, lon: 80.5153, state: "Andhra Pradesh", name: "Amaravati", anchor: "start", dx: 8, dy: 4 },
    wb: { lat: 22.5726, lon: 88.3639, state: "West Bengal", name: "Kolkata", anchor: "end", dx: -8, dy: 12 },
    rj: { lat: 26.9124, lon: 75.7873, state: "Rajasthan", name: "Jaipur", anchor: "end", dx: -8, dy: -12 },
    as: { lat: 26.1445, lon: 91.7362, state: "Assam", name: "Dispur (Assam)", anchor: "start", dx: 8, dy: -12 }
  };

  const stateCentroids = {};
  for (const id in cityData) {
    stateCentroids[id] = projectCoordinates(cityData[id].lat, cityData[id].lon);
  }

  const startNode = stateCentroids['tn'];

  if (!IndiaMapData || !IndiaMapData.locations) {
    return <div>Error loading map data</div>;
  }

  // Determine current destination state
  const currentMission = missionIndex >= 0 && missionIndex < missions.length ? missions[missionIndex] : null;
  const currentDestinationId = currentMission ? currentMission.id : null;

  // Determine which states have been completed to keep their routes/dots on map
  const completedMissionIds = [];
  if (missionIndex >= 0) {
    for (let i = 0; i < Math.min(missionIndex, missions.length); i++) {
      completedMissionIds.push(missions[i].id);
    }
  }

  // Draw Route Helper
  const drawRoute = (toId, animate = false, delay = 0, isExtra = false) => {
    const endNode = stateCentroids[toId];
    if (!endNode) return null;

    const angle = Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x) * (180 / Math.PI);
    
    // Create unique animation names for dynamic CSS
    const trainAnimName = `trainMove_${toId}`;
    const routeAnimName = `routeDraw_${toId}`;

    return (
      <g key={`route-${toId}${isExtra ? '-extra' : ''}`}>
        {animate && (
          <style>{`
            @keyframes ${trainAnimName} {
              0% { transform: translate(${startNode.x}px, ${startNode.y}px); opacity: 0; }
              5% { opacity: 1; }
              90% { transform: translate(${endNode.x}px, ${endNode.y}px); opacity: 1; }
              100% { transform: translate(${endNode.x}px, ${endNode.y}px); opacity: 0; }
            }
            @keyframes ${routeAnimName} {
              from { stroke-dashoffset: 1000; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes pulseEnd {
              0% { r: 4; opacity: 1; }
              100% { r: 15; opacity: 0; }
            }
          `}</style>
        )}
        
        {/* Dotted Route */}
        <line
          x1={startNode.x}
          y1={startNode.y}
          x2={endNode.x}
          y2={endNode.y}
          stroke={isExtra ? "#64748b" : "#6366f1"}
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeDashoffset={animate ? 1000 : 0}
          style={animate ? { animation: `${routeAnimName} 2s linear forwards ${delay}s` } : {}}
        />
        
        {/* End Node */}
        <circle 
          cx={endNode.x} 
          cy={endNode.y} 
          r="4" 
          fill={isExtra ? "#64748b" : "#6366f1"} 
          opacity={animate ? 0 : 1}
          style={animate ? { animation: `fade-in 0.3s ease-out forwards ${delay + 1.8}s` } : {}}
        />

        {/* Pulse effect on destination if animating */}
        {animate && !isExtra && (
          <circle 
            cx={endNode.x} 
            cy={endNode.y} 
            r="4" 
            fill="#6366f1" 
            style={{ animation: `pulseEnd 1.5s infinite ${delay + 1.8}s` }}
          />
        )}

        {/* Moving Train Icon */}
        {animate && (
          <g style={{ animation: `${trainAnimName} 2s ease-in-out forwards ${delay}s`, opacity: 0 }}>
            <g transform={`rotate(${angle + 90}) translate(-10, -10)`}>
              {/* Simple train/bus SVG */}
              <rect x="2" y="2" width="16" height="16" rx="4" fill="#ef4444" />
              <rect x="4" y="4" width="12" height="6" rx="2" fill="white" />
              <circle cx="6" cy="14" r="2" fill="#1e293b" />
              <circle cx="14" cy="14" r="2" fill="#1e293b" />
            </g>
          </g>
        )}
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        viewBox={IndiaMapData.viewBox}
        style={{ width: '100%', height: '100%', maxHeight: '600px' }}
      >
        <style>{`
          @keyframes fade-in {
            to { opacity: 1; }
          }
          @keyframes state-pulse {
            0% { fill: #a5b4fc; }
            50% { fill: #dbeafe; }
            100% { fill: #a5b4fc; }
          }
        `}</style>

        {/* States Layer */}
        <g stroke="#d6e0ec" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
          {IndiaMapData.locations.map((loc) => {
            const isDestination = currentDestinationId === loc.id;
            const isCompleted = completedMissionIds.includes(loc.id);
            const isStart = loc.id === 'tn';
            const isHovered = localHover === loc.id;
            
            let fill = '#fcfcfc';
            let stroke = '#d1d5db';
            let strokeWidth = 1;
            
            if (isStart) {
              fill = '#f0fdf4';
              stroke = '#16a34a';
              strokeWidth = 1.5;
            } else if (isDestination && !animating) {
              fill = '#a5b4fc';
              stroke = '#6366f1';
              strokeWidth = 1.5;
            } else if (isCompleted || (animating && isDestination)) {
              fill = '#eff6ff';
              stroke = '#94a3b8';
            } else if (isHovered) {
              fill = '#f3f4f6';
            }

            return (
              <path
                key={loc.id}
                id={loc.id}
                d={loc.path}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                style={{ 
                  transition: 'fill 0.4s, stroke 0.4s, stroke-width 0.4s', 
                  animation: (isDestination && !animating) ? 'state-pulse 2s infinite' : 'none'
                }}
                onMouseEnter={() => setLocalHover(loc.id)}
                onMouseLeave={() => setLocalHover(null)}
              />
            );
          })}
        </g>
        
        {/* Routes Layer */}
        <g>
          {/* Permanent Start Node */}
          {missionIndex >= 0 && (
            <circle cx={startNode.x} cy={startNode.y} r="5" fill="#16a34a" />
          )}

          {/* Render already completed routes statically */}
          {completedMissionIds.map(toId => {
            // Special case for Mumbai distance mission: keep Bengaluru route as extra
            if (toId === 'mh') {
               return (
                 <React.Fragment key={`comp-mh`}>
                   {drawRoute('ka', false, 0, true)}
                   {drawRoute('mh', false, 0, false)}
                 </React.Fragment>
               );
            }
            return drawRoute(toId, false);
          })}

          {/* Render active animation route */}
          {animating && activeRoute && (
            <>
              {activeRoute.showBoth && drawRoute('ka', true, 0, true) /* Short route for distance comparison */}
              {drawRoute(activeRoute.to, true, 0, false)}
            </>
          )}
        </g>

        {/* Labels Layer (Clean labels for important destinations) */}
        {missionIndex >= 0 && (
          <g fontSize="11" fontWeight="600" fill="#334155" style={{ pointerEvents: 'none' }}>
            {/* Start Node (Chennai) */}
            <g>
              <text x={startNode.x} y={startNode.y + 2} textAnchor="middle" fontSize="14">📍</text>
              <text x={startNode.x + cityData.tn.dx} y={startNode.y + cityData.tn.dy} fill="#166534" textAnchor={cityData.tn.anchor}>
                <tspan x={startNode.x + cityData.tn.dx} dy="0">{cityData.tn.name}</tspan>
                <tspan x={startNode.x + cityData.tn.dx} dy="14" fontSize="9" fill="#64748b">{cityData.tn.state}</tspan>
              </text>
            </g>
            
            {/* Show destination label if active or completed */}
            {missions.map((m) => {
              const isActive = m.id === currentDestinationId;
              const isComp = completedMissionIds.includes(m.id);
              if (!isActive && !isComp) return null;
              
              const node = stateCentroids[m.id];
              const city = cityData[m.id];
              if (!node || !city) return null;

              return (
                <g 
                  key={`label-${m.id}`}
                  style={{ 
                    animation: (isActive && !animating) ? 'fade-in 0.5s forwards' : 'none',
                    opacity: isComp ? 1 : (animating ? 1 : 0)
                  }}
                >
                  <text x={node.x} y={node.y + 2} textAnchor="middle" fontSize="14">📍</text>
                  <text 
                    x={node.x + city.dx} 
                    y={node.y + city.dy}
                    fill={isActive ? '#6366f1' : '#475569'}
                    textAnchor={city.anchor}
                  >
                    <tspan x={node.x + city.dx} dy="0">{city.name}</tspan>
                    <tspan x={node.x + city.dx} dy="14" fontSize="9" fill="#64748b">{city.state}</tspan>
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
      
      {/* Tooltip */}
      {localHover && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)',
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
