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
          stroke={isExtra ? "#64748b" : "#B45309"}
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeDashoffset={animate ? 1000 : 0}
          style={animate ? { animation: `${routeAnimName} 1.8s ease-out forwards ${delay}s` } : {}}
        />

        {/* Solid connection line for completed routes */}
        {!animate && (
          <line
            x1={startNode.x}
            y1={startNode.y}
            x2={endNode.x}
            y2={endNode.y}
            stroke={isExtra ? "#94a3b8" : "#D97706"}
            strokeWidth="2"
            opacity="0.8"
          />
        )}

        {/* Destination Node */}
        <circle 
          cx={endNode.x} 
          cy={endNode.y} 
          r={isExtra ? "4" : "6"} 
          fill={isExtra ? "#64748b" : "#D97706"} 
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity={animate ? 0 : 1}
          style={animate ? { animation: `fade-in 0.3s ease-out forwards ${delay + 1.8}s` } : {}}
        />

        {/* Pulse effect on destination if animating */}
        {animate && !isExtra && (
          <circle 
            cx={endNode.x} 
            cy={endNode.y} 
            r="5" 
            fill="#D97706" 
            style={{ animation: `pulseEnd 1.5s infinite ${delay + 1.8}s` }}
          />
        )}

        {/* Moving Vehicle Icon */}
        {animate && (
          <g style={{ animation: `${trainAnimName} 2s ease-in-out forwards ${delay}s`, opacity: 0 }}>
            <g transform={`rotate(${angle + 90}) translate(-10, -10)`}>
              <rect x="2" y="2" width="16" height="16" rx="4" fill="#D97706" />
              <rect x="4" y="4" width="12" height="6" rx="2" fill="#FFFFFF" />
              <circle cx="6" cy="14" r="2" fill="#1E293B" />
              <circle cx="14" cy="14" r="2" fill="#1E293B" />
            </g>
          </g>
        )}
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        viewBox="10 0 575 680"
        style={{ width: '100%', height: '100%', maxHeight: '100%', objectFit: 'contain' }}
      >
        <style>{`
          @keyframes fade-in {
            to { opacity: 1; }
          }
          @keyframes state-pulse {
            0% { fill: #FEF3C7; }
            50% { fill: #FDE68A; }
            100% { fill: #FEF3C7; }
          }
        `}</style>

        {/* States Layer */}
        <g stroke="#CBD5E1" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
          {IndiaMapData.locations.map((loc) => {
            const isDestination = currentDestinationId === loc.id;
            const isCompleted = completedMissionIds.includes(loc.id);
            const isStart = loc.id === 'tn';
            const isHovered = localHover === loc.id;
            
            let fill = '#FAFAFA';
            let stroke = '#CBD5E1';
            let strokeWidth = 1;
            
            if (isStart) {
              fill = '#DCFCE7';
              stroke = '#16A34A';
              strokeWidth = 1.8;
            } else if (isDestination && !animating) {
              fill = '#FEF3C7';
              stroke = '#D97706';
              strokeWidth = 2;
            } else if (isCompleted || (animating && isDestination)) {
              fill = '#EFF6FF';
              stroke = '#3B82F6';
              strokeWidth = 1.5;
            } else if (isHovered) {
              fill = '#F1F5F9';
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
            <circle cx={startNode.x} cy={startNode.y} r="6" fill="#16A34A" stroke="#FFFFFF" strokeWidth="1.5" />
          )}

          {/* Render already completed routes statically */}
          {completedMissionIds.map(toId => {
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
              {activeRoute.showBoth && drawRoute('ka', true, 0, true)}
              {drawRoute(activeRoute.to, true, 0, false)}
            </>
          )}
        </g>

        {/* Labels Layer */}
        {missionIndex >= 0 && (
          <g fontSize="13.5" fontWeight="700" fontFamily="'Space Grotesk', sans-serif" style={{ pointerEvents: 'none' }}>
            {/* Start Node (Chennai) */}
            <g>
              <text x={startNode.x} y={startNode.y + 2} textAnchor="middle" fontSize="13">📍</text>
              <text x={startNode.x + cityData.tn.dx} y={startNode.y + cityData.tn.dy} fill="#166534" textAnchor={cityData.tn.anchor}>
                <tspan x={startNode.x + cityData.tn.dx} dy="0" fontWeight="900">{cityData.tn.name}</tspan>
                <tspan x={startNode.x + cityData.tn.dx} dy="13" fontSize="11" fill="#15803D" fontWeight="700">{cityData.tn.state}</tspan>
              </text>
            </g>
            
            {/* Show destination label if active or completed */}
            {missions.map((m) => {
              const isActive = m.id === currentDestinationId;
              const isComp = completedMissionIds.includes(m.id);
              
              if (!isActive && !isComp) return null;
              
              const c = cityData[m.id];
              const node = stateCentroids[m.id];
              if (!c || !node) return null;
              
              return (
                <g key={m.id} style={{ transition: 'all 0.3s' }}>
                  <text 
                    x={node.x + c.dx} 
                    y={node.y + c.dy} 
                    fill={isActive ? "#92400E" : "#1E40AF"}
                    textAnchor={c.anchor}
                  >
                    <tspan x={node.x + c.dx} dy="0" fontWeight="900" fontSize="13.5">{c.name}</tspan>
                    <tspan x={node.x + c.dx} dy="13" fontSize="11" fill={isActive ? "#B45309" : "#3B82F6"} fontWeight="700">{c.state}</tspan>
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
