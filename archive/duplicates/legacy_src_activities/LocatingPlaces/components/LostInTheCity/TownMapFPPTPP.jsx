import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import townMapImg from './assets/town_map_straight_3d.jpg';

/* ═══════════════════════════════════════════════════════════════════════════
   PUBG-STYLE FREE-ROAM PHOTOREALISTIC FPP STREET VIEW EXPLORER
   ─────────────────────────────────────────────────────────────────────────
   • Free 360° continuous movement & rotation anywhere in town.
   • Smooth 60 FPS physics game-loop (WASD / Arrows / Touch D-Pad / Drag to look).
   • Dynamic 3D perspective field-of-view (FOV 120°) with distance depth scaling.
   • Authentic NASA optical solar capture & atmospheric sky horizon.
   • Real-time tactical military compass ribbon & satellite radar minimap.
   • Interactive NCERT landmark inspection dossier.
   ═══════════════════════════════════════════════════════════════════════════ */

const MAP_W = 1376;
const MAP_H = 768;

/* ── 1. TOWN MAP LANDMARKS ── */
const BUILDINGS = [
  {
    id: 'RS',
    name: 'Central Junction Railway Station',
    shortName: 'Railway Station',
    icon: '🚂',
    type: 'station',
    img: '/buildings/railway_station.png',
    street: 'Northern Avenue',
    x: 180, y: 215,
    color: '#F59E0B',
    desc: 'Express passenger rail terminal with clock tower and platform concourse.',
    ncertFact: 'Railway lines on maps are indicated by cross-barred track symbols.'
  },
  {
    id: 'AP',
    name: 'Sunview Heights Residency',
    shortName: 'Sunview Heights',
    icon: '🏢',
    type: 'apartment',
    img: '/buildings/apartments.png',
    street: 'Northern Avenue',
    x: 835, y: 215,
    color: '#38BDF8',
    desc: 'Modern multi-storey residential apartment tower overlooking the park.',
    ncertFact: 'Residential zones on town plans provide housing for the community.'
  },
  {
    id: 'PG',
    name: 'Rosewood Botanical Garden',
    shortName: 'Botanical Garden',
    icon: '🌿',
    type: 'garden',
    img: '/buildings/public_garden.png',
    street: 'Northern Avenue',
    x: 1115, y: 215,
    color: '#10B981',
    desc: 'Botanical flora greenhouse conservatory, exotic trees, and walking paths.',
    ncertFact: 'Green conventional signs universally represent parks, forests, and flora.'
  },
  {
    id: 'HO',
    name: 'City Care Hospital',
    shortName: 'City Hospital',
    icon: '🏥',
    type: 'hospital',
    img: '/buildings/hospital.png',
    street: 'Central Boulevard & Hospital Way',
    x: 230, y: 460,
    color: '#EF4444',
    desc: '24/7 emergency trauma care hospital with red cross ambulance portico.',
    ncertFact: 'A red cross symbol on white is the international symbol for healthcare facilities.'
  },
  {
    id: 'NP',
    name: 'Nagar Panchayat Office',
    shortName: 'Nagar Panchayat',
    icon: '🏛️',
    type: 'civic',
    img: '/buildings/nagar_panchayat.png',
    street: 'Central Boulevard & Panchayat Road',
    x: 690, y: 460,
    color: '#F59E0B',
    desc: 'Municipal town administrative council hall with grand classical columns and dome.',
    ncertFact: 'Nagar Panchayat governs transitional urban areas between villages and cities.'
  },
  {
    id: 'BK',
    name: 'Apex National Bank',
    shortName: 'Apex Bank',
    icon: '🏦',
    type: 'bank',
    img: '/buildings/bank.png',
    street: 'Central Boulevard & Bank Road',
    x: 1115, y: 460,
    color: '#06B6D4',
    desc: 'Commercial national bank, treasury forex vault, and financial services.',
    ncertFact: 'Commercial centers are strategically placed near central crossroads.'
  },
  {
    id: 'SC',
    name: 'Greenwood Public School',
    shortName: 'Greenwood School',
    icon: '🏫',
    type: 'school',
    img: '/buildings/school.png',
    street: 'Southern Road & West Lane',
    x: 230, y: 680,
    color: '#818CF8',
    desc: 'Primary and secondary education campus with sports field and courtyard.',
    ncertFact: 'Schools and educational buildings are marked with specialized cartographic icons.'
  },
  {
    id: 'MK',
    name: 'Janata Central Bazaar',
    shortName: 'Central Market',
    icon: '🛍️',
    type: 'market',
    img: '/buildings/market.png',
    street: 'Southern Road & Bazaar Street',
    x: 690, y: 625,
    color: '#F59E0B',
    desc: 'Bustling town central bazaar with colorful canopy stalls and fresh produce.',
    ncertFact: 'Marketplaces are key landmark nodes connecting residential and transport corridors.'
  },
  {
    id: 'MU',
    name: 'Heritage Antiquities Museum',
    shortName: 'Heritage Museum',
    icon: '🏛️',
    type: 'museum',
    img: '/buildings/museum.png',
    street: 'Southern Road & East Lane',
    x: 1115, y: 680,
    color: '#A78BFA',
    desc: 'Historical museum displaying ancient sculptures, coins, and heritage artifacts.',
    ncertFact: 'Historical monuments and museums preserve cultural heritage on town surveys.'
  }
];

/* ── 2. DYNAMIC STREET CORRIDOR DETECTOR ── */
function getActiveStreetName(x, y) {
  if (y < 350) return 'NORTHERN AVENUE';
  if (y >= 350 && y <= 600) return 'CENTRAL BOULEVARD';
  if (y > 600) return 'SOUTHERN ROAD';
  return 'TOWN CORRIDOR';
}

function getNearestLandmark(x, y) {
  let nearest = null;
  let minDist = Infinity;
  BUILDINGS.forEach(b => {
    const dist = Math.hypot(b.x - x, b.y - y);
    if (dist < minDist) {
      minDist = dist;
      nearest = { ...b, dist: Math.round(dist) };
    }
  });
  return nearest;
}

/* ── 3. TACTICAL MILITARY COMPASS RIBBON ── */
const TacticalCompassBar = ({ bearing }) => {
  const normBearing = (bearing % 360 + 360) % 360;
  const markers = [];

  for (let deg = -90; deg <= 90; deg += 15) {
    const currentDeg = (Math.round(normBearing + deg) + 360) % 360;
    let label = '';
    let isCardinal = false;

    if (currentDeg === 0) { label = 'N'; isCardinal = true; }
    else if (currentDeg === 90) { label = 'E'; isCardinal = true; }
    else if (currentDeg === 180) { label = 'S'; isCardinal = true; }
    else if (currentDeg === 270) { label = 'W'; isCardinal = true; }
    else if (currentDeg % 45 === 0) {
      if (currentDeg === 45) label = 'NE';
      if (currentDeg === 135) label = 'SE';
      if (currentDeg === 225) label = 'SW';
      if (currentDeg === 315) label = 'NW';
    } else {
      label = `${currentDeg}`;
    }

    markers.push({ deg, currentDeg, label, isCardinal, xPct: 50 + (deg / 90) * 44 });
  }

  return (
    <div style={{
      position: 'absolute',
      top: '14px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(440px, 78vw)',
      height: '42px',
      background: 'linear-gradient(180deg, rgba(15,23,42,0.94) 0%, rgba(10,15,30,0.98) 100%)',
      border: '1.5px solid rgba(245, 158, 11, 0.45)',
      borderRadius: '12px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
      overflow: 'hidden',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      {/* Center Reticle */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: '#EF4444', zIndex: 4 }} />
      <div style={{
        position: 'absolute', top: '1px', left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #EF4444',
        zIndex: 5
      }} />

      {markers.map((m, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${m.xPct}%`,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: Math.max(0.15, 1 - Math.abs(m.deg) / 85),
          transition: 'left 0.05s linear'
        }}>
          <div style={{
            width: m.isCardinal ? '2.5px' : '1px',
            height: m.isCardinal ? '10px' : '6px',
            background: m.isCardinal ? '#F59E0B' : '#94A3B8',
            marginBottom: '2px'
          }} />
          <span style={{
            fontSize: m.isCardinal ? '12px' : '9px',
            fontWeight: m.isCardinal ? 900 : 700,
            color: m.isCardinal ? (m.label === 'N' ? '#EF4444' : '#FEF08A') : '#CBD5E1',
            fontFamily: 'Space Grotesk, monospace',
            letterSpacing: '0.4px',
            textShadow: m.isCardinal ? '0 0 8px rgba(245,158,11,0.6)' : 'none'
          }}>
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── 4. SATELLITE RADAR MINIMAP ── */
const TacticalMinimap = ({ playerPos, bearing }) => {
  const miniW = 168, miniH = 94;
  const px = (playerPos.x / MAP_W) * miniW;
  const py = (playerPos.y / MAP_H) * miniH;

  return (
    <div style={{
      position: 'absolute',
      bottom: '18px',
      right: '18px',
      width: `${miniW}px`,
      height: `${miniH}px`,
      borderRadius: '14px',
      overflow: 'hidden',
      border: '2px solid rgba(245, 158, 11, 0.6)',
      boxShadow: '0 10px 35px rgba(0,0,0,0.85), 0 0 20px rgba(245,158,11,0.3)',
      zIndex: 100,
      background: '#0B1120',
      pointerEvents: 'none'
    }}>
      <img
        src={townMapImg}
        alt="radar-map"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.88) contrast(1.18)'
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(rgba(14, 165, 233, 0.08) 50%, rgba(0, 0, 0, 0.25) 50%)',
        backgroundSize: '100% 4px',
        pointerEvents: 'none'
      }} />

      {/* Building Radar Pings */}
      {BUILDINGS.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          left: `${(b.x / MAP_W) * miniW - 3}px`,
          top: `${(b.y / MAP_H) * miniH - 3}px`,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: b.color,
          boxShadow: `0 0 6px ${b.color}`,
          border: '1px solid #FFFFFF'
        }} />
      ))}

      {/* Live Player GPS Location with Vision Cone */}
      <div style={{
        position: 'absolute',
        left: `${px}px`,
        top: `${py}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10
      }}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: '20px', height: '20px', borderRadius: '50%',
          border: '1.5px solid #38BDF8',
          animation: 'radarPing 1.8s infinite'
        }} />
        <div style={{
          width: '9px', height: '9px', borderRadius: '50%',
          background: '#F59E0B', border: '2px solid #FFFFFF',
          boxShadow: '0 0 10px #F59E0B'
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 0, height: 0,
          borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
          borderBottom: '26px solid rgba(245, 158, 11, 0.55)',
          transform: `translate(-50%, -100%) rotate(${bearing}deg)`,
          transformOrigin: '50% 100%',
          pointerEvents: 'none'
        }} />
      </div>

      <div style={{
        position: 'absolute', top: '4px', left: '8px',
        fontSize: '8.5px', fontWeight: 900, color: '#38BDF8',
        fontFamily: 'Space Grotesk, monospace', letterSpacing: '0.6px'
      }}>
        GPS RADAR • FREE ROAM
      </div>
    </div>
  );
};

/* ── 5. PUBG-STYLE FLUID D-PAD CONTROLLER ── */
const FreeRoamDPad = ({ onStartMove, onStopMove }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '18px',
      left: '18px',
      width: '156px',
      height: '156px',
      zIndex: 100,
      userSelect: 'none'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '48px 48px 48px',
        gridTemplateRows: '48px 48px 48px',
        gap: '6px',
        justifyContent: 'center',
        alignContent: 'center'
      }}>
        <div style={{ gridColumn: 1, gridRow: 1 }} />

        {/* FORWARD BUTTON (Walk Forward) */}
        <button
          onMouseDown={() => onStartMove('forward')}
          onMouseUp={() => onStopMove('forward')}
          onMouseLeave={() => onStopMove('forward')}
          onTouchStart={() => onStartMove('forward')}
          onTouchEnd={() => onStopMove('forward')}
          title="Walk Forward (W / Up Arrow)"
          style={{
            gridColumn: 2,
            gridRow: 1,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: '2px solid #F59E0B',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            color: '#FEF08A',
            fontSize: '18px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
        >
          <span>▲</span>
          <span style={{ fontSize: '7.5px', fontWeight: 800, marginTop: '2px', color: '#F59E0B' }}>FORWARD</span>
        </button>

        <div style={{ gridColumn: 3, gridRow: 1 }} />

        {/* TURN LEFT (Rotate Camera Left) */}
        <button
          onMouseDown={() => onStartMove('left')}
          onMouseUp={() => onStopMove('left')}
          onMouseLeave={() => onStopMove('left')}
          onTouchStart={() => onStartMove('left')}
          onTouchEnd={() => onStopMove('left')}
          title="Turn Left (A / Left Arrow)"
          style={{
            gridColumn: 1,
            gridRow: 2,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: '2px solid #F59E0B',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            color: '#FEF08A',
            fontSize: '18px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
        >
          <span>◀</span>
          <span style={{ fontSize: '7.5px', fontWeight: 800, marginTop: '2px', color: '#F59E0B' }}>TURN L</span>
        </button>

        {/* Center Navigation Icon */}
        <div style={{
          gridColumn: 2,
          gridRow: 2,
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'radial-gradient(circle, #1E293B 0%, #0F172A 100%)',
          border: '1.5px solid rgba(245,158,11,0.5)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '15px' }}>🧭</span>
          <span style={{ fontSize: '7.5px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.5px' }}>NAV</span>
        </div>

        {/* TURN RIGHT (Rotate Camera Right) */}
        <button
          onMouseDown={() => onStartMove('right')}
          onMouseUp={() => onStopMove('right')}
          onMouseLeave={() => onStopMove('right')}
          onTouchStart={() => onStartMove('right')}
          onTouchEnd={() => onStopMove('right')}
          title="Turn Right (D / Right Arrow)"
          style={{
            gridColumn: 3,
            gridRow: 2,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: '2px solid #F59E0B',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            color: '#FEF08A',
            fontSize: '18px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
        >
          <span>▶</span>
          <span style={{ fontSize: '7.5px', fontWeight: 800, marginTop: '2px', color: '#F59E0B' }}>TURN R</span>
        </button>

        <div style={{ gridColumn: 1, gridRow: 3 }} />

        {/* BACKWARD BUTTON (Walk Backward) */}
        <button
          onMouseDown={() => onStartMove('backward')}
          onMouseUp={() => onStopMove('backward')}
          onMouseLeave={() => onStopMove('backward')}
          onTouchStart={() => onStartMove('backward')}
          onTouchEnd={() => onStopMove('backward')}
          title="Walk Backward (S / Down Arrow)"
          style={{
            gridColumn: 2,
            gridRow: 3,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: '2px solid #F59E0B',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            color: '#FEF08A',
            fontSize: '18px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
        >
          <span>▼</span>
          <span style={{ fontSize: '7.5px', fontWeight: 800, marginTop: '2px', color: '#F59E0B' }}>BACK</span>
        </button>

        <div style={{ gridColumn: 3, gridRow: 3 }} />
      </div>
    </div>
  );
};

/* ── 6. PHOTOREALISTIC 3D STREET STAGE WITH DYNAMIC VIEWPORT ── */
const FreeRoam3DStage = ({ playerPos, bearing, isMoving, walkDistance, onInspectBuilding }) => {
  // Calculate ONLY ONE primary landmark directly in front of player in current facing direction
  const targetBuilding = useMemo(() => {
    let bestMatch = null;
    let minDiff = Infinity;

    BUILDINGS.forEach(b => {
      const dx = b.x - playerPos.x;
      const dy = b.y - playerPos.y;
      const dist = Math.hypot(dx, dy);

      // Angle from player to building (0=North, 90=East, 180=South, 270=West)
      const bldgAngle = (Math.atan2(dx, -dy) * (180 / Math.PI) + 360) % 360;

      // Angular difference relative to camera bearing
      const diff = ((bldgAngle - bearing + 540) % 360) - 180; // range -180° to +180°

      // Only consider if in front (within 45° of camera) and within reasonable distance (380m)
      if (Math.abs(diff) < 45 && dist < 380) {
        if (Math.abs(diff) < minDiff) {
          minDiff = Math.abs(diff);
          const screenXPct = 50 + (diff / 45) * 18; // Smoothly centered (32% to 68%)
          const scale = Math.max(0.4, Math.min(1.2, 280 / (dist + 50)));
          const opacity = Math.max(0.7, Math.min(1, 1 - (dist - 150) / 450));
          bestMatch = { ...b, dist: Math.round(dist), screenXPct, scale, opacity, diff };
        }
      }
    });

    return bestMatch;
  }, [playerPos, bearing]);

  const nearestBldg = getNearestLandmark(playerPos.x, playerPos.y);
  const isNearLandmark = nearestBldg && nearestBldg.dist <= 130;

  // Road center stripe scroll offset based on distance walked
  const stripeOffset = (walkDistance * 1.5) % 80;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0C1A30 0%, #152642 40%, #0F172A 100%)',
      animation: isMoving ? 'fppWalkBob 0.35s infinite ease-in-out' : 'none'
    }}>
      {/* ── 1. ATMOSPHERIC SKY & HORIZON ── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '46%',
        background: 'linear-gradient(180deg, #0F4C81 0%, #2563EB 25%, #60A5FA 60%, #BAE6FD 85%, #E0F2FE 100%)',
        overflow: 'hidden'
      }}>
        {/* NASA Optical Atmospheric Sun & Corona Flare */}
        <div style={{
          position: 'absolute',
          top: '18%',
          right: '22%',
          transform: 'translate(50%, -50%)',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 250, 230, 0.45) 0%, rgba(254, 240, 138, 0.22) 30%, rgba(245, 158, 11, 0.08) 60%, transparent 80%)',
            filter: 'blur(12px)'
          }} />

          {/* Optical Corona Ray Spikes */}
          <svg
            width="280"
            height="280"
            viewBox="-140 -140 280 280"
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              overflow: 'visible',
              animation: 'nasaSolarRays 40s linear infinite'
            }}
          >
            <defs>
              <linearGradient id="nasaRayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="20%" stopColor="#FEF08A" stopOpacity="0.5" />
                <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <g key={i} transform={`rotate(${ang})`}>
                <polygon
                  points="-2.5,0 2.5,0 0.4,-130 -0.4,-130"
                  fill="url(#nasaRayGrad)"
                  opacity={i % 2 === 0 ? 0.8 : 0.45}
                />
              </g>
            ))}
          </svg>

          {/* Anamorphic Lens Flare */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '420px', height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(186, 230, 253, 0.25) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(254, 240, 138, 0.25) 80%, transparent 100%)',
            filter: 'blur(0.6px)',
            boxShadow: '0 0 16px rgba(255, 255, 255, 0.95), 0 0 30px rgba(254, 240, 138, 0.6)'
          }} />

          {/* Solar Chromosphere */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90px', height: '90px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(254, 240, 138, 0.85) 38%, rgba(245, 158, 11, 0.35) 72%, transparent 100%)',
            boxShadow: '0 0 50px 18px rgba(254, 240, 138, 0.8), 0 0 110px 40px rgba(245, 158, 11, 0.4)'
          }} />

          {/* NASA Pure White Photosphere Disk */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '42px', height: '42px', borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 0 24px 8px #FFFFFF, 0 0 45px 16px rgba(254, 240, 138, 0.95)'
          }} />
        </div>

        {/* Soft Cirrus Clouds */}
        <div style={{
          position: 'absolute', top: '18%', left: '15%',
          width: '240px', height: '35px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.45)', filter: 'blur(16px)'
        }} />
        <div style={{
          position: 'absolute', top: '28%', right: '35%',
          width: '320px', height: '40px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)', filter: 'blur(20px)'
        }} />

        {/* Distant Town Greenery Horizon */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '32px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(20,83,45,0.7) 40%, rgba(22,101,52,0.95) 100%)'
        }} />
      </div>

      {/* ── 2. DYNAMIC ASPHALT ROAD CORRIDOR & SIDEWALKS ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '54%',
        overflow: 'hidden'
      }}>
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <linearGradient id="roadAsphaltFree" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B4654" />
              <stop offset="25%" stopColor="#2D3748" />
              <stop offset="65%" stopColor="#1E2530" />
              <stop offset="100%" stopColor="#121820" />
            </linearGradient>

            <linearGradient id="sidewalkPaveL" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="85%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="sidewalkPaveR" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="85%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="lawnGrassL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15803D" />
              <stop offset="50%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>
            <linearGradient id="lawnGrassR" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15803D" />
              <stop offset="50%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>
          </defs>

          {/* Left Landscaped Lawn */}
          <polygon points="0,0 340,0 0,500" fill="url(#lawnGrassL)" />
          {/* Right Landscaped Lawn */}
          <polygon points="1000,0 660,0 1000,500" fill="url(#lawnGrassR)" />

          {/* Sidewalks */}
          <polygon points="340,0 415,0 110,500 0,500" fill="url(#sidewalkPaveL)" />
          <polygon points="660,0 585,0 890,500 1000,500" fill="url(#sidewalkPaveR)" />

          {/* Curb Highlights */}
          <polygon points="413,0 417,0 116,500 110,500" fill="#F1F5F9" opacity="0.95" />
          <polygon points="583,0 587,0 884,500 890,500" fill="#F1F5F9" opacity="0.95" />

          {/* Main Asphalt Road */}
          <polygon points="415,0 585,0 890,500 110,500" fill="url(#roadAsphaltFree)" />

          {/* Shoulder Lines */}
          <polygon points="426,0 429,0 148,500 140,500" fill="#FFFFFF" opacity="0.9" />
          <polygon points="571,0 574,0 860,500 852,500" fill="#FFFFFF" opacity="0.9" />

          {/* Continuous Moving Center Dashed Stripes */}
          {Array.from({ length: 9 }).map((_, i) => {
            const rawT = (i + (stripeOffset / 80)) / 9;
            const t0 = rawT % 1;
            const t1 = (rawT + 0.55 / 9) % 1;
            if (t1 < t0) return null;

            const y0 = Math.pow(t0, 1.6) * 500;
            const y1 = Math.pow(t1, 1.6) * 500;
            const w0 = 1.5 + t0 * 10;
            const w1 = 1.5 + t1 * 10;

            return (
              <polygon
                key={i}
                points={`
                  ${500 - w0 / 2},${y0}
                  ${500 + w0 / 2},${y0}
                  ${500 + w1 / 2},${y1}
                  ${500 - w1 / 2},${y1}
                `}
                fill="#FEF08A"
                opacity="0.9"
                style={{ filter: 'drop-shadow(0 0 2px rgba(254, 240, 138, 0.4))' }}
              />
            );
          })}
        </svg>
      </div>

      {/* ── 3. SINGLE TARGET LANDMARK IN CURRENT FACING DIRECTION ── */}
      {targetBuilding && (
        <div
          style={{
            position: 'absolute',
            top: `${Math.max(6, 18 - targetBuilding.scale * 10)}%`,
            left: `${targetBuilding.screenXPct}%`,
            transform: `translate(-50%, 0) scale(${targetBuilding.scale})`,
            zIndex: 40,
            opacity: targetBuilding.opacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease-out'
          }}
        >
          {/* Ground Plaza Contact Shadow */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.7)',
            filter: 'blur(12px)',
            zIndex: 1
          }} />

          {/* Crisp High-Res Single Building Render */}
          <img
            src={targetBuilding.img}
            alt={targetBuilding.name}
            style={{
              maxHeight: '340px',
              maxWidth: '520px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.7))',
              display: 'block',
              position: 'relative',
              zIndex: 2
            }}
          />

          {/* AR Building Title Pin */}
          <div style={{
            marginTop: '-6px',
            background: 'rgba(15,23,42,0.94)',
            border: `1.5px solid ${targetBuilding.color}`,
            borderRadius: '10px',
            padding: '5px 14px',
            boxShadow: `0 8px 20px rgba(0,0,0,0.8), 0 0 15px ${targetBuilding.color}40`,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10
          }}>
            <span style={{ fontSize: '15px' }}>{targetBuilding.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
              {targetBuilding.name} <b style={{ color: targetBuilding.color }}>({targetBuilding.dist}m)</b>
            </span>
          </div>
        </div>
      )}

      {/* ── 4. NEAREST LANDMARK INTERACTIVE AR CARD (Bottom Center) ── */}
      {isNearLandmark && (
        <div style={{
          position: 'absolute',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.98))',
          border: `2px solid ${nearestBldg.color}`,
          borderRadius: '16px',
          padding: '10px 22px',
          boxShadow: `0 12px 35px rgba(0,0,0,0.85), 0 0 25px ${nearestBldg.color}50`,
          backdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          maxWidth: 'min(540px, 92vw)'
        }}>
          <div style={{ fontSize: '28px' }}>{nearestBldg.icon}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 900, color: nearestBldg.color, letterSpacing: '1px', textTransform: 'uppercase' }}>
              📍 REACHED LANDMARK • {nearestBldg.dist}m
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>
              {nearestBldg.name}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '1px' }}>
              {nearestBldg.desc}
            </div>
          </div>

          <button
            onClick={() => onInspectBuilding(nearestBldg)}
            style={{
              border: 'none',
              background: nearestBldg.color,
              color: '#0F172A',
              fontWeight: 900,
              fontSize: '12px',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${nearestBldg.color}60`,
              whiteSpace: 'nowrap',
              transition: 'transform 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            📖 Info
          </button>
        </div>
      )}

      {/* ── 5. TACTICAL FPP AIM CROSSHAIR ── */}
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: 0.6
      }}>
        <svg width="44" height="44" viewBox="-22 -22 44 44">
          <circle r="14" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="-18" y1="0" x2="-6" y2="0" stroke="#FEF08A" strokeWidth="1.5" />
          <line x1="6" y1="0" x2="18" y2="0" stroke="#FEF08A" strokeWidth="1.5" />
          <line x1="0" y1="-18" x2="0" y2="-6" stroke="#FEF08A" strokeWidth="1.5" />
          <line x1="0" y1="6" x2="0" y2="18" stroke="#FEF08A" strokeWidth="1.5" />
          <circle r="2.5" fill="#EF4444" />
        </svg>
      </div>
    </div>
  );
};

/* ── 7. MAIN FREE-ROAM FPP COMPONENT ── */
export default function TownMapFPPTPP({ onComplete, onNext }) {
  // Start on Northern Avenue in front of Railway Station
  const [playerPos, setPlayerPos] = useState({ x: 180, y: 245 });
  const [bearing, setBearing] = useState(90); // 90° = Facing East
  const [isMoving, setIsMoving] = useState(false);
  const [walkDistance, setWalkDistance] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [inspectedBuilding, setInspectedBuilding] = useState(null);

  // Active key states for smooth 60 FPS continuous movement
  const keysRef = useRef({ forward: false, backward: false, left: false, right: false, sprint: false });
  const playerPosRef = useRef({ x: 180, y: 245 });
  const bearingRef = useRef(90);
  const rafRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  // Keep refs in sync
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  useEffect(() => {
    bearingRef.current = bearing;
  }, [bearing]);

  /* ── 60 FPS CONTINUOUS PHYSICS GAME LOOP ── */
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = (now) => {
      const deltaMs = Math.min(32, now - lastTime);
      lastTime = now;

      const keys = keysRef.current;
      const speed = keys.sprint ? 5.8 : 3.6;
      const turnSpeed = 2.5;

      let hasMoved = false;
      let curBearing = bearingRef.current;
      let curX = playerPosRef.current.x;
      let curY = playerPosRef.current.y;

      // Turning Left / Right
      if (keys.left) {
        curBearing = (curBearing - turnSpeed + 360) % 360;
        bearingRef.current = curBearing;
        setBearing(curBearing);
      }
      if (keys.right) {
        curBearing = (curBearing + turnSpeed) % 360;
        bearingRef.current = curBearing;
        setBearing(curBearing);
      }

      // Moving Forward / Backward
      if (keys.forward || keys.backward) {
        hasMoved = true;
        const rad = (curBearing * Math.PI) / 180;
        const dir = keys.forward ? 1 : -0.7;

        // dx = sin(rad), dy = -cos(rad) (North is Y = 0)
        const dx = Math.sin(rad) * speed * dir;
        const dy = -Math.cos(rad) * speed * dir;

        // Clamp inside town map coordinates
        const nextX = Math.max(50, Math.min(MAP_W - 50, curX + dx));
        const nextY = Math.max(80, Math.min(MAP_H - 40, curY + dy));

        curX = nextX;
        curY = nextY;
        playerPosRef.current = { x: curX, y: curY };
        setPlayerPos({ x: curX, y: curY });
        setWalkDistance(d => d + speed);
        setStepCount(s => s + 1);

        // Check if reached Apex Bank (Goal)
        const distToBank = Math.hypot(1115 - curX, 460 - curY);
        if (distToBank < 70) {
          if (onComplete) onComplete({ steps: Math.round(stepCount / 15) });
        }
      }

      setIsMoving(hasMoved);
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stepCount, onComplete]);

  /* ── KEYBOARD CONTROLS (WASD + ARROWS + SHIFT) ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.forward = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.backward = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === 'Shift') keysRef.current.sprint = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.forward = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.backward = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === 'Shift') keysRef.current.sprint = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  /* ── MOUSE / TOUCH DRAG TO FREE-LOOK ── */
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - lastMouseXRef.current;
    lastMouseXRef.current = clientX;

    const newBearing = (bearingRef.current + deltaX * 0.35 + 360) % 360;
    bearingRef.current = newBearing;
    setBearing(newBearing);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  /* ── ON-SCREEN BUTTON HANDLERS ── */
  const handleStartMove = (dir) => {
    if (dir === 'forward') keysRef.current.forward = true;
    if (dir === 'backward') keysRef.current.backward = true;
    if (dir === 'left') keysRef.current.left = true;
    if (dir === 'right') keysRef.current.right = true;
  };

  const handleStopMove = (dir) => {
    if (dir === 'forward') keysRef.current.forward = false;
    if (dir === 'backward') keysRef.current.backward = false;
    if (dir === 'left') keysRef.current.left = false;
    if (dir === 'right') keysRef.current.right = false;
  };

  const activeStreet = getActiveStreetName(playerPos.x, playerPos.y);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#040711',
        fontFamily: '"Space Grotesk", sans-serif',
        userSelect: 'none',
        cursor: 'grab'
      }}
    >
      <style>{`
        @keyframes radarPing {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
        @keyframes nasaSolarRays {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fppWalkBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* ── 1. REALISTIC 3D PERSPECTIVE FREE-ROAM STAGE ── */}
      <FreeRoam3DStage
        playerPos={playerPos}
        bearing={bearing}
        isMoving={isMoving}
        walkDistance={walkDistance}
        onInspectBuilding={(b) => setInspectedBuilding(b)}
      />

      {/* ── 2. MILITARY COMPASS TAPE ── */}
      <TacticalCompassBar bearing={bearing} />

      {/* ── 3. TOP-LEFT STREET STATUS CARD ── */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '16px',
        zIndex: 100,
        background: 'rgba(15,23,42,0.94)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(245,158,11,0.45)',
        borderRadius: '14px',
        padding: '8px 18px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.65)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        pointerEvents: 'none'
      }}>
        <div style={{ fontSize: '9px', fontWeight: 800, color: '#F59E0B', letterSpacing: '1px' }}>
          🛣️ FREE ROAM • {activeStreet}
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.4px' }}>
          GPS: X {Math.round(playerPos.x)}, Y {Math.round(playerPos.y)}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', marginTop: '1px' }}>
          Bearing: <b style={{ color: '#FEF08A' }}>{Math.round(bearing)}°</b> • Speed: <b style={{ color: '#38BDF8' }}>{isMoving ? '12 km/h' : '0 km/h'}</b>
        </div>
      </div>

      {/* ── 4. CONTROLS GUIDE (Top Right) ── */}
      <div style={{
        position: 'absolute',
        top: '14px',
        right: '16px',
        zIndex: 100,
        background: 'rgba(15,23,42,0.92)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        <span style={{ fontSize: '12px' }}>🎮</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#CBD5E1' }}>
          WASD / D-Pad to Walk • Drag to Look 360°
        </span>
      </div>

      {/* ── 5. FREE-ROAM PUBG D-PAD & SATELLITE RADAR MINIMAP ── */}
      <FreeRoamDPad onStartMove={handleStartMove} onStopMove={handleStopMove} />
      <TacticalMinimap playerPos={playerPos} bearing={bearing} />

      {/* ── 6. LANDMARK EDUCATIONAL INSPECTION MODAL ── */}
      {inspectedBuilding && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(9, 13, 22, 0.82)',
          backdropFilter: 'blur(8px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
            border: `2px solid ${inspectedBuilding.color}`,
            borderRadius: '22px',
            padding: '28px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: `0 25px 60px rgba(0,0,0,0.9), 0 0 40px ${inspectedBuilding.color}40`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '36px' }}>{inspectedBuilding.icon}</span>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: inspectedBuilding.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    NCERT Class 6 Map Landmark
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                    {inspectedBuilding.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setInspectedBuilding(null)}
                style={{
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#94A3B8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: '#0B1120',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <img
                src={inspectedBuilding.img}
                alt={inspectedBuilding.name}
                style={{ maxHeight: '170px', objectFit: 'contain' }}
              />
            </div>

            <div style={{ fontSize: '12.5px', color: '#E2E8F0', lineHeight: 1.6 }}>
              {inspectedBuilding.desc}
            </div>

            <div style={{
              background: 'rgba(245,158,11,0.12)',
              borderLeft: '4px solid #F59E0B',
              padding: '10px 14px',
              borderRadius: '0 10px 10px 0',
              fontSize: '11.5px',
              color: '#FEF08A'
            }}>
              <b>Cartography Fact:</b> {inspectedBuilding.ncertFact}
            </div>

            <button
              onClick={() => setInspectedBuilding(null)}
              style={{
                border: 'none',
                background: inspectedBuilding.color,
                color: '#0F172A',
                fontWeight: 900,
                fontSize: '13px',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: `0 4px 14px ${inspectedBuilding.color}50`
              }}
            >
              Continue Exploring ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
