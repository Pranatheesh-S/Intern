import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Map, MapPin, Compass, ArrowLeft, Maximize2, Minimize2, Navigation, ZoomIn, ZoomOut, Move, RotateCcw, CheckCircle, HelpCircle } from 'lucide-react';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';
import townMapFig from './assets/town_map_fig1.jpg';

/* ── 1. CLASSIC GRID MAP CONFIG (Fig. 1.1) ─────────────────────── */
const N_CLASSIC = {
  RS: { x: 150, y: 360, label: 'Railway Station', type: 'station', start: true },
  HO: { x: 350, y: 360, label: 'Hospital', type: 'hospital' },
  NP: { x: 550, y: 360, label: 'Nagar Panchayat', type: 'civic' },
  BK: { x: 740, y: 560, label: 'Bank', type: 'bank', goal: true },
  SC: { x: 150, y: 560, label: 'School', type: 'school' },
  MK: { x: 350, y: 560, label: 'Market', type: 'market' },
  JT: { x: 550, y: 560, label: 'Junction', type: 'junction' },
  MU: { x: 740, y: 360, label: 'Museum', type: 'museum' },
  AP: { x: 350, y: 165, label: 'Apartments', type: 'apartment' },
  PG: { x: 740, y: 165, label: 'Public Garden', type: 'garden' },
};

const EDGES_CLASSIC = [
  ['RS', 'HO'], ['HO', 'NP'], ['NP', 'MU'], ['SC', 'MK'], ['MK', 'JT'], ['JT', 'BK'],
  ['RS', 'SC'], ['AP', 'HO'], ['HO', 'MK'], ['NP', 'JT'], ['PG', 'MU'], ['MU', 'BK']
];

/* ── 2. 3D MODEL MAP CONFIG (Precision 1024 x 571 Pixel Tarmac Alignment) ── */
const N_3D = {
  RS: { x: 235, y: 310, label: 'Railway Station', type: 'station', start: true },
  HO: { x: 390, y: 310, label: 'Hospital', type: 'hospital' },
  NP: { x: 630, y: 255, label: 'Nagar Panchayat', type: 'civic' },
  BK: { x: 765, y: 305, label: 'Bank', type: 'bank', goal: true },
  SC: { x: 240, y: 520, label: 'School', type: 'school' },
  MK: { x: 500, y: 520, label: 'Market', type: 'market' },
  JT: { x: 695, y: 365, label: 'Junction', type: 'junction' },
  MU: { x: 780, y: 480, label: 'Museum', type: 'museum' },
  AP: { x: 550, y: 170, label: 'Apartments', type: 'apartment' },
  PG: { x: 830, y: 190, label: 'Public Garden', type: 'garden' },
};

// Smooth Catmull-Rom spline algorithm ensuring lines follow curves perfectly within the asphalt road
function smoothSpline(points, numOfSegments = 16) {
  if (points.length <= 2) return points;
  const result = [];
  const pts = [points[0], ...points, points[points.length - 1]];
  
  for (let i = 1; i < pts.length - 2; i++) {
    for (let t = 0; t <= numOfSegments; t++) {
      const st = t / numOfSegments;
      const st2 = st * st;
      const st3 = st2 * st;

      const p0 = pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2];

      const x = 0.5 * (
        (2 * p1[0]) +
        (-p0[0] + p2[0]) * st +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * st2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * st3
      );

      const y = 0.5 * (
        (2 * p1[1]) +
        (-p0[1] + p2[1]) * st +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * st2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * st3
      );

      result.push([x, y]);
    }
  }
  return result;
}

// 100% True-to-Image Road Tarmac Coordinates in 1024 x 571 Space
const RAW_PATHS_3D = {
  'RS|HO': [[235, 310], [285, 310], [335, 310], [390, 310]],
  'RS|SC': [[235, 310], [170, 310], [130, 320], [122, 380], [125, 440], [140, 485], [180, 520], [240, 520]],
  'SC|MK': [[240, 520], [310, 525], [380, 525], [440, 525], [500, 520]],
  'MK|JT': [[500, 520], [560, 520], [620, 515], [665, 470], [690, 420], [695, 365]],
  'HO|NP': [[390, 310], [450, 310], [490, 300], [525, 265], [560, 240], [595, 240], [630, 255]],
  'NP|BK': [[630, 255], [655, 305], [695, 365], [740, 335], [765, 305]],
  'NP|JT': [[630, 255], [655, 305], [695, 365]],
  'JT|BK': [[695, 365], [740, 335], [765, 305]],
  'BK|PG': [[765, 305], [820, 325], [875, 310], [915, 275], [925, 235], [910, 195], [865, 185], [830, 190]],
  'PG|AP': [[830, 190], [775, 175], [710, 170], [640, 172], [550, 170]],
  'AP|HO': [[550, 170], [480, 168], [410, 165], [350, 162], [290, 170], [250, 220], [235, 310], [310, 310], [390, 310]],
  'HO|MK': [[390, 310], [420, 310], [425, 360], [425, 420], [425, 475], [455, 515], [500, 520]],
  'JT|MU': [[695, 365], [695, 420], [710, 465], [745, 480], [780, 480]],
  'MU|BK': [[780, 480], [830, 480], [880, 450], [915, 395], [915, 345], [860, 315], [765, 305]],
  'NP|MU': [[630, 255], [655, 305], [695, 365], [695, 420], [710, 465], [745, 480], [780, 480]],
};

// Generate dense spline curves
const PATHS_3D = {};
Object.entries(RAW_PATHS_3D).forEach(([key, rawPts]) => {
  PATHS_3D[key] = smoothSpline(rawPts, 18);
});

// Road name metadata placed squarely inside asphalt corridors
const ROAD_NAMES = [
  { id: 'station_rd', name: 'STATION ROAD', x: 310, y: 296, angle: 0, edge: 'RS|HO' },
  { id: 'school_lane', name: 'SCHOOL LANE', x: 104, y: 410, angle: -90, edge: 'RS|SC' },
  { id: 'market_rd_w', name: 'MARKET ROAD', x: 360, y: 538, angle: 0, edge: 'SC|MK' },
  { id: 'market_rd_e', name: 'MARKET ROAD', x: 610, y: 538, angle: 0, edge: 'MK|JT' },
  { id: 'panchayat_marg', name: 'NAGAR PANCHAYAT MARG', x: 530, y: 270, angle: -18, edge: 'HO|NP' },
  { id: 'bank_road', name: 'BANK ROAD', x: 740, y: 345, angle: -24, edge: 'JT|BK' },
  { id: 'garden_way', name: 'GARDEN WAY', x: 938, y: 245, angle: 90, edge: 'BK|PG' },
  { id: 'apartment_dr', name: 'APARTMENT DRIVE', x: 680, y: 156, angle: 0, edge: 'PG|AP' },
  { id: 'museum_st', name: 'MUSEUM STREET', x: 755, y: 495, angle: 0, edge: 'JT|MU' },
];

function get3DRoadPoints(a, b) {
  const fwd = PATHS_3D[`${a}|${b}`];
  if (fwd) return fwd;
  const back = PATHS_3D[`${b}|${a}`];
  if (back) return [...back].reverse();
  return [[N_3D[a].x, N_3D[a].y], [N_3D[b].x, N_3D[b].y]];
}

const ptsAttr = pts => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

function pathLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1]);
  }
  return len;
}

function pointAlong(pts, dist) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (acc + seg >= dist || i === pts.length - 1) {
      const t = seg > 0 ? (dist - acc) / seg : 0;
      const clampedT = Math.max(0, Math.min(1, t));
      return { x: x0 + (x1 - x0) * clampedT, y: y0 + (y1 - y0) * clampedT };
    }
    acc += seg;
  }
  return { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] };
}

/* ── 3. GRAPH ADJACENCY & NAVIGATION ────────────────────────────── */
const ADJ = {};
Object.keys(N_CLASSIC).forEach(k => ADJ[k] = {});
function dirOf(a, b) {
  const dx = N_CLASSIC[b].x - N_CLASSIC[a].x, dy = N_CLASSIC[b].y - N_CLASSIC[a].y;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'E' : 'W') : (dy > 0 ? 'S' : 'N');
}
EDGES_CLASSIC.forEach(([a, b]) => {
  ADJ[a][dirOf(a, b)] = b;
  ADJ[b][dirOf(b, a)] = a;
});

function bfs(start, goal) {
  const q = [[start]], seen = { [start]: 1 };
  while (q.length) {
    const p = q.shift(), last = p[p.length - 1];
    if (last === goal) return p;
    for (const d in ADJ[last]) {
      const nx = ADJ[last][d];
      if (!seen[nx]) { seen[nx] = 1; q.push([...p, nx]); }
    }
  }
  return null;
}

const short = { RS: 'RS', HO: 'Hosp', NP: 'NP', BK: 'Bank', SC: 'Sch', MK: 'Mkt', JT: 'Jn', MU: 'Mus', AP: 'Apt', PG: 'PG' };

const IMAGE_MAP = {
  station: 'railway_station', hospital: 'hospital', civic: 'nagar_panchayat', 
  bank: 'bank', school: 'school', market: 'market', museum: 'museum', 
  apartment: 'apartments', garden: 'public_garden'
};

/* ── 4. CLASSIC 3D BUILDING COMPONENT ───────────────────────────── */
const MapBuilding = ({ id, onClick, isPulsing }) => {
  const n = N_CLASSIC[id];
  const { x, y, type, label } = n;

  let icon = null;
  if (type === 'junction') {
    icon = <circle cx={x} cy={y} r={7} fill="#fff" stroke="#8a94a1" strokeWidth={2} />;
  } else {
    const imgName = IMAGE_MAP[type];
    const isStation = type === 'station';
    const imgWidth = isStation ? 110 : 54;
    const imgHeight = isStation ? 60 : 54;
    const imgX = x - imgWidth / 2;
    const imgY = y - (isStation ? 35 : 30);
    icon = (
      <image 
        href={`/buildings/${imgName}.png?v=5`}
        x={imgX}
        y={imgY}
        width={imgWidth}
        height={imgHeight}
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.95)) drop-shadow(0px 4px 8px rgba(0,0,0,0.5))' }}
      />
    );
  }

  return (
    <g style={{ cursor: 'pointer' }} onClick={() => onClick(id)} transform={`translate(${x}, ${y}) scale(1.4) translate(-${x}, -${y})`}>
      {icon}
      <rect x={x - label.length * 3.4} y={y + 18} width={label.length * 6.8} height={16} rx={4} fill="#fff" opacity={0.9} />
      <text x={x} y={y + 29} textAnchor="middle" fontFamily="Space Grotesk, system-ui, sans-serif" fontSize={10.5} fontWeight={700} fill="#20303f">{label}</text>
      {isPulsing && (
        <circle cx={x} cy={y} r={40} fill="none" stroke="#e74c3c" strokeWidth={3}>
          <animate attributeName="r" from="40" to="30" dur="0.6s" repeatCount="2" />
        </circle>
      )}
    </g>
  );
};

/* ── 5. REALISTIC ANIMATED PERSON (PROPORTIONAL TO 1024x571 ROAD) ── */
const RealisticWalker = ({ pos, isWalking, walkProgress, angle, currentRoadName }) => {
  const strideCycle = isWalking ? Math.sin(walkProgress * Math.PI * 12) : 0;
  const legAngle = strideCycle * 24;
  const armAngle = -strideCycle * 20;
  const bodyBob = isWalking ? Math.abs(Math.sin(walkProgress * Math.PI * 12)) * 2.5 : 0;

  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      {/* Radar Pulse Beacon on road */}
      <circle cx="0" cy="0" r="22" fill="#EF4444" opacity="0.25">
        <animate attributeName="r" from="10" to="30" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
      </circle>

      {/* Floating Road Status Badge */}
      {currentRoadName && (
        <g transform="translate(0, -48)">
          <rect x="-56" y="-10" width="112" height="20" rx="6" fill="#0F172A" stroke="#F5A623" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }} />
          <text x="0" y="3.5" textAnchor="middle" fill="#FEF08A" fontFamily="Space Grotesk, sans-serif" fontWeight="900" fontSize="9.5" letterSpacing="0.4">
            🚶 {currentRoadName}
          </text>
        </g>
      )}

      {/* Ground Footstep Shadow */}
      <ellipse cx="0" cy="4" rx="10" ry="4" fill="rgba(0,0,0,0.45)" style={{ filter: 'blur(1px)' }} />

      {/* Stylized Human Traveler Scaled to 1024x571 Canvas */}
      <g transform={`translate(0, ${-20 - bodyBob}) scale(0.72)`}>
        {/* BACK ARM */}
        <g transform={`translate(5, 10) rotate(${armAngle})`}>
          <rect x="-1.8" y="0" width="3.6" height="11" rx="1.8" fill="#CBD5E1" stroke="#334155" strokeWidth="0.6" />
          <circle cx="0" cy="11" r="2" fill="#FBBF24" />
        </g>

        {/* BACK LEG */}
        <g transform={`translate(-3.5, 18) rotate(${-legAngle})`}>
          <rect x="-2" y="0" width="4" height="13" rx="1.5" fill="#1E293B" />
          <rect x="-2" y="11" width="5.5" height="3.5" rx="1.2" fill="#EF4444" />
        </g>

        {/* FRONT LEG */}
        <g transform={`translate(3.5, 18) rotate(${legAngle})`}>
          <rect x="-2" y="0" width="4" height="13" rx="1.5" fill="#334155" />
          <rect x="-2" y="11" width="5.5" height="3.5" rx="1.2" fill="#EF4444" />
        </g>

        {/* BACKPACK */}
        <rect x="-8" y="7" width="4.5" height="12" rx="2" fill="#2563EB" stroke="#1E40AF" strokeWidth="0.8" />

        {/* TORSO / JACKET */}
        <rect x="-6" y="5" width="12" height="14" rx="3" fill="#EA580C" stroke="#9A3412" strokeWidth="1" />
        <polygon points="0,5 -2.5,9 2.5,9" fill="#FFFFFF" />

        {/* FRONT ARM */}
        <g transform={`translate(-5, 10) rotate(${-armAngle})`}>
          <rect x="-1.8" y="0" width="3.6" height="11" rx="1.8" fill="#EA580C" stroke="#9A3412" strokeWidth="0.6" />
          <circle cx="0" cy="11" r="2" fill="#FBBF24" />
        </g>

        {/* HEAD */}
        <circle cx="0" cy="-3" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
        
        {/* HAIR */}
        <path d="M -7 -4 C -7 -10 7 -10 7 -4 C 6 -7 -6 -7 -7 -4 Z" fill="#451A03" />
        
        {/* EYES & SMILE */}
        <circle cx="2" cy="-3" r="1" fill="#1C1917" />
        <path d="M 0 0.5 Q 2 2.5 4 0.5" fill="none" stroke="#78350F" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </g>
  );
};

/* ── 6. LIVE COMPASS WITH HIGHLIGHTED CARDINAL WORD (FOR 3D MAP ONLY) ── */
const LiveCompassHUD = ({ angle = 0, currentDir = 'N' }) => {
  const norm = (angle % 360 + 360) % 360;
  let activeCardinal = currentDir || 'N';
  if (norm >= 315 || norm < 45) activeCardinal = 'N';
  else if (norm >= 45 && norm < 135) activeCardinal = 'E';
  else if (norm >= 135 && norm < 225) activeCardinal = 'S';
  else if (norm >= 225 && norm < 315) activeCardinal = 'W';

  const dirFullNames = { N: 'NORTH', E: 'EAST', S: 'SOUTH', W: 'WEST' };

  return (
    <div style={{
      position: 'absolute',
      top: '14px',
      right: '68px',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(15, 23, 42, 0.94)',
      backdropFilter: 'blur(8px)',
      border: '2px solid #F5A623',
      borderRadius: '16px',
      padding: '6px 14px 6px 10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
    }}>
      <svg width="44" height="44" viewBox="-24 -24 48 48" style={{ display: 'block', overflow: 'visible' }}>
        <circle r="21" fill="#1E293B" stroke="#475569" strokeWidth="2" />
        
        <g transform={`rotate(${angle})`} style={{ transition: 'transform 0.25s ease-out' }}>
          <polygon points="0,-18 4.5,0 0,-2" fill="#EF4444" />
          <polygon points="0,-18 -4.5,0 0,-2" fill="#F87171" />
          <polygon points="0,18 4.5,0 0,2" fill="#94A3B8" />
          <polygon points="0,18 -4.5,0 0,2" fill="#CBD5E1" />
          <circle r="3.5" fill="#F5A623" stroke="#0F172A" strokeWidth="1" />
        </g>

        <text 
          x="0" y="-12" 
          textAnchor="middle" 
          fontSize="7.5" 
          fontWeight="900" 
          fill={activeCardinal === 'N' ? '#FEF08A' : '#EF4444'}
          style={activeCardinal === 'N' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          N
        </text>
        <text 
          x="0" y="18" 
          textAnchor="middle" 
          fontSize="7.5" 
          fontWeight="900" 
          fill={activeCardinal === 'S' ? '#FEF08A' : '#94A3B8'}
          style={activeCardinal === 'S' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          S
        </text>
        <text 
          x="-14" y="3" 
          textAnchor="middle" 
          fontSize="7" 
          fontWeight="900" 
          fill={activeCardinal === 'W' ? '#FEF08A' : '#94A3B8'}
          style={activeCardinal === 'W' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          W
        </text>
        <text 
          x="14" y="3" 
          textAnchor="middle" 
          fontSize="7" 
          fontWeight="900" 
          fill={activeCardinal === 'E' ? '#FEF08A' : '#94A3B8'}
          style={activeCardinal === 'E' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          E
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Live Compass
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: 900,
          color: '#FEF08A',
          letterSpacing: '0.08em',
          textShadow: '0 0 10px rgba(254, 240, 138, 0.6)'
        }}>
          HEADING: {dirFullNames[activeCardinal]}
        </div>
      </div>
    </div>
  );
};

/* ── 7. DRAGGABLE & ZOOMABLE DIRECTION CARD HUD ─────────────────── */
const DraggableDirectionHUD = ({
  cur,
  short,
  ADJ,
  isMoving,
  hintDir,
  handleMove,
  giveHint,
  handleBack,
  pathLength,
  onExitFullScreen,
  isFullScreen,
  mapTitle = "Direction Controls"
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0, isCustom: false });
  const [scale, setScale] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, initX: 0, initY: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    if (!coords.isCustom) {
      setCoords({
        x: window.innerWidth - 240,
        y: window.innerHeight - 340,
        isCustom: true
      });
    }
  }, []);

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    dragStart.current = {
      x: clientX,
      y: clientY,
      initX: coords.x,
      initY: coords.y
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;
      
      const newX = Math.max(10, Math.min(window.innerWidth - 200, dragStart.current.initX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 200, dragStart.current.initY + dy));
      setCoords({ x: newX, y: newY, isCustom: true });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  const zoomIn = (e) => {
    e.stopPropagation();
    setScale(s => Math.min(1.6, +(s + 0.15).toFixed(2)));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setScale(s => Math.max(0.7, +(s - 0.15).toFixed(2)));
  };

  const resetZoom = (e) => {
    e.stopPropagation();
    setScale(1.0);
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        zIndex: 99999,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        background: '#1A2338',
        border: '3px solid #F5A623',
        borderRadius: '24px',
        padding: '12px 14px 14px',
        boxShadow: '0 20px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.1)',
        userSelect: 'none',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        minWidth: '190px'
      }}
    >
      {/* Top Drag Handle & Zoom Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#CBD5E1', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <Move size={13} style={{ color: '#F5A623' }} /> {mapTitle}
        </div>
        
        {/* Zoom In & Out Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={zoomOut}
            title="Zoom Out Card"
            style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: '13px', fontWeight: 900 }}
          >
            −
          </button>
          <span onClick={resetZoom} title="Click to Reset 100%" style={{ fontSize: '10px', fontWeight: 800, color: '#F5A623', cursor: 'pointer', padding: '0 3px' }}>
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            title="Zoom In Card"
            style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: '13px', fontWeight: 900 }}
          >
            +
          </button>
        </div>
      </div>

      {/* D-Pad Buttons Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 56px)', gridTemplateRows: 'repeat(3, 56px)', gap: '8px', margin: '0 auto', justifyContent: 'center', opacity: isMoving ? 0.6 : 1 }}>
        
        {/* NORTH */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'N' ? 'hint' : ''}`}
          style={{ gridColumn: 2, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['N']) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['N']}
          onClick={() => handleMove('N')}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>▲</span>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>N</span>
        </button>

        {/* WEST */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'W' ? 'hint' : ''}`}
          style={{ gridColumn: 1, gridRow: 2, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['W']) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['W']}
          onClick={() => handleMove('W')}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>◀</span>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>W</span>
        </button>

        {/* CENTER NODE */}
        <div style={{ gridColumn: 2, gridRow: 2, background: '#FFFFFF', borderRadius: '16px', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 900, color: '#0E3556', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.25)' }}>
          {short[cur]}
        </div>

        {/* EAST */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'E' ? 'hint' : ''}`}
          style={{ gridColumn: 3, gridRow: 2, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['E']) ? 'not-allowed' : 'pointer', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['E']}
          onClick={() => handleMove('E')}
        >
          {ADJ[cur]['E'] && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#2563EB', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '1px 4px', borderRadius: '4px' }}>E</span>
          )}
          <span style={{ fontSize: '12px', lineHeight: 1 }}>▶</span>
        </button>

        {/* SOUTH */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'S' ? 'hint' : ''}`}
          style={{ gridColumn: 2, gridRow: 3, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['S']) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['S']}
          onClick={() => handleMove('S')}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>▼</span>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>S</span>
        </button>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '12px' }}>
        <button
          type="button"
          onClick={giveHint}
          disabled={isMoving}
          style={{ background: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', color: '#0E3556', fontWeight: 800, cursor: isMoving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
        >
          💡 Hint
        </button>
        <button
          type="button"
          onClick={handleBack}
          disabled={isMoving || pathLength <= 1}
          style={{ background: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', color: '#0E3556', fontWeight: 800, cursor: isMoving || pathLength <= 1 ? 'not-allowed' : 'pointer', opacity: isMoving || pathLength <= 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
        >
          ↩ Back
        </button>
        {isFullScreen && (
          <button
            type="button"
            onClick={onExitFullScreen}
            style={{ background: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
          >
            ✕ Exit
          </button>
        )}
      </div>
    </div>
  );
};

/* ── 8. MAIN ROUTE ACTIVITY COMPONENT ───────────────────────────── */
export default function FindingRoutePage({ onMissionUnlock, onBeginChapter, onBack }) {
  // Current active map tab: '3d' or 'classic'
  const [mapMode, setMapMode] = useState('3d'); 
  const [mapFull, setMapFull] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  /* ── 8A. SEPARATE STATE FOR 3D ILLUSTRATED MAP ── */
  const [cur3D, setCur3D] = useState('RS');
  const [path3D, setPath3D] = useState(['RS']);
  const [logs3D, setLogs3D] = useState([{ html: 'Departed from <b>Railway Station</b> on 3D Map', ok: true }]);
  const [win3D, setWin3D] = useState(false);
  const [hintDir3D, setHintDir3D] = useState(null);
  const [isWalking3D, setIsWalking3D] = useState(false);
  const [walkerPos3D, setWalkerPos3D] = useState({ x: N_3D.RS.x, y: N_3D.RS.y });
  const [walkProgress3D, setWalkProgress3D] = useState(0);
  const [walkerAngle3D, setWalkerAngle3D] = useState(0);
  const [activeRoadName3D, setActiveRoadName3D] = useState(null);
  const [currentHeadingDir3D, setCurrentHeadingDir3D] = useState('N');
  const [activeWalkSegmentPts3D, setActiveWalkSegmentPts3D] = useState([]);

  /* ── 8B. SEPARATE STATE FOR CLASSIC TOWN MAP (FIG 1.1) ── */
  const [curClassic, setCurClassic] = useState('RS');
  const [pathClassic, setPathClassic] = useState(['RS']);
  const [logsClassic, setLogsClassic] = useState([{ html: 'Started at <b>Railway Station</b> (Fig 1.1)', ok: true }]);
  const [winClassic, setWinClassic] = useState(false);
  const [hintDirClassic, setHintDirClassic] = useState(null);
  const [isMovingClassic, setIsMovingClassic] = useState(false);

  /* ── 8C. 3-QUESTION QUIZ STATE (FOR CLASS 6 STUDENTS) ── */
  const [q1Ans, setQ1Ans] = useState(null); // Correct: 'South'
  const [q2Ans, setQ2Ans] = useState(null); // Correct: 'Hospital'
  const [q3Ans, setQ3Ans] = useState(null); // Correct: 'Water (Lake & River)'

  const logRef = useRef(null);
  const elementsRef = useRef(null);

  // Keyboard shortcut: Esc to exit full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mapFull) {
        setMapFull(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapFull]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs3D, logsClassic, mapMode]);

  /* ── 9. SEPARATE 3D MAP MOVEMENT LOGIC ──────────────────────────── */
  const getRoadName = (from, to) => {
    const key1 = `${from}|${to}`, key2 = `${to}|${from}`;
    const road = ROAD_NAMES.find(r => r.edge === key1 || r.edge === key2);
    return road ? road.name : 'ROAD';
  };

  const animateWalkAlong3DRoad = (fromNode, toNode, dir) => {
    const pts = get3DRoadPoints(fromNode, toNode);
    const totalDist = pathLength(pts);
    const roadName = getRoadName(fromNode, toNode);
    setActiveRoadName3D(roadName);
    setActiveWalkSegmentPts3D(pts);
    if (dir) setCurrentHeadingDir3D(dir);

    const DURATION = 2600; // 2.6 seconds realistic human walk
    const startTime = performance.now();
    setIsWalking3D(true);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);
      
      const easeT = -(Math.cos(Math.PI * progress) - 1) / 2;
      const currentPt = pointAlong(pts, easeT * totalDist);
      const aheadPt = pointAlong(pts, Math.min(totalDist, easeT * totalDist + 6));
      const headingAngle = Math.atan2(aheadPt.y - currentPt.y, aheadPt.x - currentPt.x) * (180 / Math.PI);

      setWalkerPos3D(currentPt);
      setWalkProgress3D(progress);
      setWalkerAngle3D(headingAngle);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsWalking3D(false);
        setWalkerPos3D({ x: N_3D[toNode].x, y: N_3D[toNode].y });
        setWalkProgress3D(0);
        setTimeout(() => {
          setActiveRoadName3D(null);
          setActiveWalkSegmentPts3D([]);
        }, 1200);
      }
    };

    requestAnimationFrame(step);
  };

  const handleMove3D = (dir) => {
    if (isWalking3D) return;
    const next = ADJ[cur3D][dir];
    if (!next) return;

    const fromNode = cur3D;
    const dirNames = { N: 'North', S: 'South', E: 'East', W: 'West' };
    const nextLabel = N_3D[next].label;
    const roadName = getRoadName(fromNode, next);
    const newLogs = [...logs3D, { html: `3D Walk: <b>${dirNames[dir]}</b> along <b>${roadName}</b> to <b>${nextLabel}</b>`, ok: true }];
    const newPath = [...path3D, next];

    setCur3D(next);
    setPath3D(newPath);
    setLogs3D(newLogs);
    setHintDir3D(null);
    setCurrentHeadingDir3D(dir);

    animateWalkAlong3DRoad(fromNode, next, dir);

    if (next === 'BK') {
      setTimeout(() => {
        setWin3D(true);
        if (onMissionUnlock) onMissionUnlock();
      }, 2700);
    }
  };

  const handleBack3D = () => {
    if (isWalking3D || path3D.length <= 1) return;
    const newPath = path3D.slice(0, -1);
    const prev = newPath[newPath.length - 1];
    const fromNode = cur3D;
    setCur3D(prev);
    setPath3D(newPath);
    setLogs3D([...logs3D, { html: `Walked back to <b>${N_3D[prev].label}</b>`, ok: false }]);
    setWin3D(false);
    setHintDir3D(null);

    animateWalkAlong3DRoad(fromNode, prev);
  };

  const resetGame3D = () => {
    if (isWalking3D) return;
    setCur3D('RS');
    setPath3D(['RS']);
    setLogs3D([{ html: 'Restarted at <b>Railway Station</b> on 3D Map', ok: true }]);
    setWin3D(false);
    setHintDir3D(null);
    setWalkerPos3D({ x: N_3D.RS.x, y: N_3D.RS.y });
    setActiveRoadName3D(null);
    setActiveWalkSegmentPts3D([]);
    setCurrentHeadingDir3D('N');
  };

  const giveHint3D = () => {
    const route = bfs(cur3D, 'BK');
    if (!route || route.length < 2) return;
    const next = route[1];
    for (const d in ADJ[cur3D]) {
      if (ADJ[cur3D][d] === next) {
        setHintDir3D(d);
        break;
      }
    }
  };

  /* ── 10. SEPARATE CLASSIC TOWN MAP MOVEMENT LOGIC ──────────────── */
  const handleMoveClassic = (dir) => {
    if (isMovingClassic) return;
    const next = ADJ[curClassic][dir];
    if (!next) return;

    const dirNames = { N: 'North', S: 'South', E: 'East', W: 'West' };
    const nextLabel = N_CLASSIC[next].label;
    const newLogs = [...logsClassic, { html: `Town Map: Moved <b>${dirNames[dir]}</b> to <b>${nextLabel}</b>`, ok: true }];
    const newPath = [...pathClassic, next];

    setIsMovingClassic(true);
    setCurClassic(next);
    setPathClassic(newPath);
    setLogsClassic(newLogs);
    setHintDirClassic(null);

    setTimeout(() => {
      setIsMovingClassic(false);
    }, 400);

    if (next === 'BK') {
      setTimeout(() => {
        setWinClassic(true);
        if (onMissionUnlock) onMissionUnlock();
      }, 450);
    }
  };

  const handleBackClassic = () => {
    if (isMovingClassic || pathClassic.length <= 1) return;
    const newPath = pathClassic.slice(0, -1);
    const prev = newPath[newPath.length - 1];
    setCurClassic(prev);
    setPathClassic(newPath);
    setLogsClassic([...logsClassic, { html: `Stepped back to <b>${N_CLASSIC[prev].label}</b>`, ok: false }]);
    setWinClassic(false);
    setHintDirClassic(null);
  };

  const resetGameClassic = () => {
    if (isMovingClassic) return;
    setCurClassic('RS');
    setPathClassic(['RS']);
    setLogsClassic([{ html: 'Restarted at <b>Railway Station</b> (Fig 1.1)', ok: true }]);
    setWinClassic(false);
    setHintDirClassic(null);
  };

  const giveHintClassic = () => {
    const route = bfs(curClassic, 'BK');
    if (!route || route.length < 2) return;
    const next = route[1];
    for (const d in ADJ[curClassic]) {
      if (ADJ[curClassic][d] === next) {
        setHintDirClassic(d);
        break;
      }
    }
  };

  // Build smooth curve points for 3D travelled history
  const full3DTravelledPoints = [];
  for (let i = 1; i < path3D.length; i++) {
    const seg = get3DRoadPoints(path3D[i - 1], path3D[i]);
    if (full3DTravelledPoints.length > 0) {
      full3DTravelledPoints.push(...seg.slice(1));
    } else {
      full3DTravelledPoints.push(...seg);
    }
  }

  const currentEdgeKey1_3D = path3D.length > 1 ? `${path3D[path3D.length - 2]}|${path3D[path3D.length - 1]}` : null;
  const currentEdgeKey2_3D = path3D.length > 1 ? `${path3D[path3D.length - 1]}|${path3D[path3D.length - 2]}` : null;

  const isQuizComplete = (q1Ans === 'South' && q2Ans === 'Hospital' && q3Ans === 'Water (Lake & River)');
  const hasWonAny = win3D || winClassic;

  // Active Map Specific Variables
  const is3DActive = mapMode === '3d';
  const activeCur = is3DActive ? cur3D : curClassic;
  const activePath = is3DActive ? path3D : pathClassic;
  const activeLogs = is3DActive ? logs3D : logsClassic;
  const activeIsMoving = is3DActive ? isWalking3D : isMovingClassic;
  const activeHintDir = is3DActive ? hintDir3D : hintDirClassic;
  const activeWin = is3DActive ? win3D : winClassic;
  const activeMoveHandler = is3DActive ? handleMove3D : handleMoveClassic;
  const activeBackHandler = is3DActive ? handleBack3D : handleBackClassic;
  const activeResetHandler = is3DActive ? resetGame3D : resetGameClassic;
  const activeHintHandler = is3DActive ? giveHint3D : giveHintClassic;

  const optTook = bfs('RS', 'BK').length - 1;
  const userTook = activePath.length - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: '"Space Grotesk", system-ui, sans-serif', background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)' }}>
      
      {/* Quiz Top Action Bar */}
      {showQuiz && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1.5rem', background: '#FFF9F0', borderBottom: '2px solid #F2DFBC' }}>
          <button
            onClick={() => setShowQuiz(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: '#92400E', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'color 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#78350F'}
            onMouseOut={(e) => e.currentTarget.style.color = '#92400E'}
          >
            <ArrowLeft size={18} color="#92400E" /> Back to {is3DActive ? '3D Map' : 'Town Map'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: isQuizComplete ? '#16A34A' : '#D97706' }}>
            {isQuizComplete ? '🎉 All 3 Questions Correct!' : 'Solve all 3 questions to complete'}
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* LEFT PAGE - MAP CONTAINER */}
      <div style={{ flex: 1.4, padding: mapFull ? 0 : '16px', display: 'flex', flexDirection: 'column', borderRight: '2px solid #F2DFBC', position: 'relative', background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)' }}>
        
        {/* The Map Frame (Expands to Fullscreen when mapFull is true) */}
        <div style={{
          position: mapFull ? 'fixed' : 'relative',
          inset: mapFull ? 0 : 'auto',
          width: mapFull ? '100vw' : '100%',
          height: mapFull ? '100vh' : '100%',
          zIndex: mapFull ? 9999 : 1,
          background: '#FFF9F0',
          border: mapFull ? 'none' : '2px solid #F2DFBC',
          borderRadius: mapFull ? 0 : '18px',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: mapFull ? 'none' : '0 8px 30px rgba(60,40,20,0.06)'
        }}>
          
          {/* Top Bar Controls — Map Mode Switcher */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, display: 'flex', gap: '6px', background: 'rgba(255,249,240,0.95)', backdropFilter: 'blur(6px)', padding: '4px 6px', borderRadius: '12px', border: '1.5px solid #F2DFBC', boxShadow: '0 4px 14px rgba(60,40,20,0.08)' }}>
            <button
              type="button"
              onClick={() => setMapMode('3d')}
              style={{
                border: 'none',
                background: mapMode === '3d' ? '#92400E' : 'transparent',
                color: mapMode === '3d' ? '#ffffff' : '#78350F',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              🎨 3D Illustrated Map
            </button>
            <button
              type="button"
              onClick={() => setMapMode('classic')}
              style={{
                border: 'none',
                background: mapMode === 'classic' ? '#0E3556' : 'transparent',
                color: mapMode === 'classic' ? '#ffffff' : '#475569',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              🗺️ Town Map (Fig. 1.1)
            </button>
          </div>

          {/* LIVE COMPASS HUD: DISPLAYED ONLY ON 3D ILLUSTRATED MAP */}
          {mapMode === '3d' && (
            <LiveCompassHUD angle={walkerAngle3D} currentDir={currentHeadingDir3D} />
          )}

          {/* Enlarge / Full Screen Button */}
          <button
            onClick={() => setMapFull(v => !v)}
            title={mapFull ? 'Exit full screen (Esc)' : 'View the map full screen'}
            aria-label={mapFull ? 'Exit full screen' : 'View the map full screen'}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              border: '1px solid #d6e0ec',
              background: 'rgba(255,255,255,0.92)',
              color: '#0E3556',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(14,42,69,0.14)',
              transition: 'background 0.15s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#fff'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
          >
            {mapFull ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* ── MODE 1: 3D CLAY ILLUSTRATED MAP (DEFAULT) ── */}
          {mapMode === '3d' && (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'center', alignItems: 'center', justifyContent: 'center', background: '#F5EFE0', overflow: 'hidden' }}>
              <style>{`
                @keyframes flowingRoadDashes {
                  from { stroke-dashoffset: 0; }
                  to { stroke-dashoffset: -40; }
                }
                @keyframes flowingWalkGlow {
                  0% { stroke-dashoffset: 0; opacity: 0.85; }
                  50% { opacity: 1; }
                  100% { stroke-dashoffset: -50; opacity: 0.85; }
                }
                .flowing-curved-road {
                  animation: flowingRoadDashes 1.2s linear infinite;
                }
                .flowing-active-walk {
                  animation: flowingWalkGlow 0.9s linear infinite;
                }
              `}</style>
              
              <svg 
                viewBox="0 0 1024 571" 
                preserveAspectRatio="xMidYMid meet" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'block' 
                }}
              >
                {/* Map Graphic Embedded Directly inside SVG Frame for 100% Pixel Alignment */}
                <image 
                  href={townMapFig} 
                  x="0" 
                  y="0" 
                  width="1024" 
                  height="571" 
                  preserveAspectRatio="xMidYMid slice" 
                />
                
                {/* Visual Glow Route along the Actual Curved Tarmac */}
                {full3DTravelledPoints.length > 1 && (
                  <>
                    {/* Outer blue shadow halo along curves */}
                    <polyline 
                      points={ptsAttr(full3DTravelledPoints)}
                      fill="none"
                      stroke="#1D4ED8"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.38"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(37,99,235,0.8))' }}
                    />
                    
                    {/* Solid cyan highway core following curve */}
                    <polyline 
                      points={ptsAttr(full3DTravelledPoints)}
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.9"
                    />
                    
                    {/* Inner Moving Dash Line Along the Entire Curvy Route */}
                    <polyline 
                      points={ptsAttr(full3DTravelledPoints)}
                      className="flowing-curved-road"
                      fill="none"
                      stroke="#FEF08A"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="12 8"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(254, 240, 138, 0.9))' }}
                    />
                  </>
                )}

                {/* Active Walk Segment Live Flowing Glow */}
                {isWalking3D && activeWalkSegmentPts3D.length > 1 && (
                  <polyline 
                    points={ptsAttr(activeWalkSegmentPts3D)}
                    className="flowing-active-walk"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="14 10"
                    style={{ filter: 'drop-shadow(0 0 12px #F59E0B)' }}
                  />
                )}

                {/* Road Names Embedded Directly along Road Segments */}
                <g id="road-names-layer" pointerEvents="none">
                  {ROAD_NAMES.map(r => {
                    const isRoadActive = (currentEdgeKey1_3D === r.edge || currentEdgeKey2_3D === r.edge);
                    return (
                      <g key={r.id} transform={`translate(${r.x}, ${r.y}) rotate(${r.angle})`}>
                        <rect 
                          x={-(r.name.length * 3.4 + 10)} 
                          y="-10" 
                          width={r.name.length * 6.8 + 20} 
                          height="20" 
                          rx="6" 
                          fill={isRoadActive ? '#FEF08A' : '#0F172A'} 
                          opacity={isRoadActive ? 0.98 : 0.92} 
                          stroke={isRoadActive ? '#F59E0B' : '#E2E8F0'} 
                          strokeWidth={isRoadActive ? 1.8 : 1}
                          style={{
                            filter: isRoadActive 
                              ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.85)) drop-shadow(0 3px 8px rgba(0,0,0,0.4))' 
                              : 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))'
                          }} 
                        />
                        <text 
                          x="0" 
                          y="3.5" 
                          textAnchor="middle" 
                          fontFamily="Space Grotesk, sans-serif" 
                          fontSize="9.5" 
                          fontWeight="900" 
                          fill={isRoadActive ? '#78350F' : '#FFFFFF'} 
                          letterSpacing="0.6"
                        >
                          {r.name}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Node Target Pulsing Rings */}
                {Object.entries(N_3D).map(([id, n]) => {
                  const isCur = cur3D === id;
                  const isBank = id === 'BK';
                  return (
                    <g key={id} transform={`translate(${n.x}, ${n.y})`} style={{ cursor: 'pointer' }}>
                      {isBank && (
                        <circle cx="0" cy="0" r="22" fill="#10B981" opacity="0.3">
                          <animate attributeName="r" from="14" to="28" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.7" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle cx="0" cy="0" r={isCur ? 11 : 7} fill={isCur ? '#EF4444' : isBank ? '#10B981' : '#3B82F6'} stroke="#FFFFFF" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }} />
                    </g>
                  );
                })}

                {/* Realistic Animated Traveler Person */}
                <RealisticWalker
                  pos={isWalking3D ? walkerPos3D : N_3D[cur3D]}
                  isWalking={isWalking3D}
                  walkProgress={walkProgress3D}
                  angle={walkerAngle3D}
                  currentRoadName={activeRoadName3D}
                />
              </svg>
            </div>
          )}

          {/* ── MODE 2: CLASSIC TOWN MAP (FIG 1.1) ── */}
          {mapMode === 'classic' && (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#204060' }}>
              <svg viewBox="50 90 790 560" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
                <image href="/buildings/background_map.jpg" x="0" y="0" width="880" height="720" preserveAspectRatio="xMidYMid slice" />
                
                {/* Roads */}
                {EDGES_CLASSIC.map(([a, b], idx) => {
                  const A = N_CLASSIC[a], B = N_CLASSIC[b];
                  return (
                    <g key={idx}>
                      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#6f7a88" strokeWidth={26} strokeLinecap="round" />
                      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#8a94a1" strokeWidth={22} strokeLinecap="round" />
                      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#e9edf1" strokeWidth={1.5} strokeDasharray="7 9" />
                    </g>
                  );
                })}
                
                {/* Travelled Route */}
                {pathClassic.length > 1 && (
                  <polyline 
                    points={pathClassic.map(n => `${N_CLASSIC[n].x},${N_CLASSIC[n].y}`).join(' ')}
                    fill="none"
                    stroke="#e74c3c"
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="0 20"
                  />
                )}

                {/* Buildings */}
                {Object.keys(N_CLASSIC).map(k => (
                  <MapBuilding key={k} id={k} onClick={() => {}} isPulsing={false} />
                ))}

                {/* Classic Compass */}
                <g transform="translate(818,64)">
                  <circle r={26} fill="#fff" opacity={0.9} />
                  <polygon points="0,-22 5,0 0,0" fill="#c0392b" /><polygon points="0,-22 -5,0 0,0" fill="#e88b80" />
                  <polygon points="0,22 5,0 0,0" fill="#334" /><polygon points="0,22 -5,0 0,0" fill="#889" />
                  <text x={0} y={-28} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0E3556">N</text>
                  <text x={0} y={36} textAnchor="middle" fontSize={9} fill="#5c6b7a">S</text>
                  <text x={-34} y={4} textAnchor="middle" fontSize={9} fill="#5c6b7a">W</text>
                  <text x={34} y={4} textAnchor="middle" fontSize={9} fill="#5c6b7a">E</text>
                </g>

                {/* Player Token Pin */}
                <g id="player" style={{ transform: `translate(${N_CLASSIC[curClassic].x}px, ${N_CLASSIC[curClassic].y - 20}px)`, transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <circle cx="0" cy="0" r="32" fill="#e74c3c">
                    <animate attributeName="r" from="20" to="50" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <g transform="translate(0, -35)">
                    <path d="M0,35 C0,35 -20,15 -20,-2 A20,20 0 1,1 20,-2 C20,15 0,35 0,35 Z" fill="#e74c3c" stroke="#fff" strokeWidth="4" style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))' }} />
                    <circle cx="0" cy="-2" r="8" fill="#fff" />
                  </g>
                </g>
              </svg>
            </div>
          )}

          {/* DRAGGABLE & ZOOMABLE FLOATING DIRECTION CARD (ACTIVE MAP SPECIFIC) */}
          {mapFull && (
            <DraggableDirectionHUD
              cur={activeCur}
              short={short}
              ADJ={ADJ}
              isMoving={activeIsMoving}
              hintDir={activeHintDir}
              handleMove={activeMoveHandler}
              giveHint={activeHintHandler}
              handleBack={activeBackHandler}
              pathLength={activePath.length}
              onExitFullScreen={() => setMapFull(false)}
              isFullScreen={true}
              mapTitle={is3DActive ? "3D Walker" : "Town Map"}
            />
          )}
          
          {/* Win Overlay */}
          {(activeWin && !showQuiz) && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(9,26,44,0.55)', backdropFilter: 'blur(3px)', zIndex: 25, animation: 'fadeIn 0.4s ease' }}>
              <div style={{ background: '#fff', borderRadius: '18px', padding: '30px 34px', textAlign: 'center', maxWidth: '380px', boxShadow: '0 30px 70px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize: '44px' }}>🎉</div>
                <h3 style={{ fontFamily: '"Fraunces", serif', color: '#12a15f', fontSize: '26px', margin: '6px 0 8px' }}>You reached the Bank!</h3>
                <p style={{ color: '#5c6b7a', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>
                  {userTook === optTook ? (
                    <span>Perfect route in <b>{userTook} roads</b> — that's the shortest possible! Railway Station → Hospital → Nagar Panchayat → Junction → Bank.</span>
                  ) : (
                    <span>You made it in <b>{userTook} roads</b>. The shortest route is <b>{optTook}</b> (for example: Hospital → Nagar Panchayat → Junction → Bank).</span>
                  )}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={activeResetHandler} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: '1px solid #d6e0ec', cursor: 'pointer', background: '#fff', color: '#5c6b7a', padding: '12px 20px', borderRadius: '999px', fontSize: '14px' }}>Play again</button>
                  <button onClick={() => setShowQuiz(true)} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer', background: '#F5A623', color: '#fff', padding: '12px 24px', borderRadius: '999px', fontSize: '15px', boxShadow: '0 4px 15px rgba(245, 166, 35, 0.4)' }}>Proceed to Quiz →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PAGE - CONTROLS & 3-QUESTION QUIZ */}
      <div style={{ flex: 1, minHeight: 0, padding: 'clamp(16px, 2vw, 28px) clamp(16px, 2vw, 28px) 10px clamp(16px, 2vw, 28px)', position: 'relative', background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)', color: '#3D2E24', display: 'flex', flexDirection: 'column', borderRadius: '0 18px 18px 0', borderLeft: '2px solid #F2DFBC', overflow: 'hidden' }}>
        
        {!showQuiz && (
          <>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '999px', color: '#92400E', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'flex-start' }}>
              ◎ Let's play a game
            </div>
            <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 900, color: '#78350F', fontSize: 'clamp(20px, 2.2vw, 26px)', margin: '6px 0 2px' }}>
              Reach the Bank
            </div>
            <div style={{ color: '#3D2E24', fontSize: '13.5px', lineHeight: 1.45, fontWeight: 600 }}>
              {is3DActive ? (
                <>Walk the realistic curved asphalt roads on the <b>3D Illustrated Map</b> from the <b>Railway Station</b> to the <b>Bank</b>.</>
              ) : (
                <>Move the player pin along the grid roads on <b>Town Map (Fig. 1.1)</b> from the <b>Railway Station</b> to the <b>Bank</b>.</>
              )}
            </div>

            <ScrollableWithNav containerStyle={{ flex: 1, minHeight: 0, marginTop: '12px' }} scrollStyle={{ paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Controls Box (Dedicated functionality per active map) */}
              <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: '14px', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', fontWeight: 800 }}>
                    {is3DActive ? (isWalking3D ? `🚶 Walking on ${activeRoadName3D || 'road'}...` : '🎨 3D Walker Controls') : (isMovingClassic ? '🧭 Moving Pin...' : '🗺️ Town Map Controls')}
                  </span>
                  <span style={{ fontSize: '11px', background: is3DActive ? '#FEF3C7' : '#DCFCE7', color: is3DActive ? '#92400E' : '#166534', border: is3DActive ? '1px solid #FDE68A' : '1px solid #86EFAC', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                    {is3DActive ? '3D Active' : 'Fig. 1.1 Active'}
                  </span>
                </div>
                
                {/* D-Pad Buttons Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, auto)', gap: '7px', maxWidth: '220px', margin: '0 auto', opacity: activeIsMoving ? 0.6 : 1 }}>
                  <button className={`dpad-btn ${activeHintDir === 'N' ? 'hint' : ''}`} style={{ gridColumn: 2 }} disabled={activeIsMoving || !ADJ[activeCur]['N']} onClick={() => activeMoveHandler('N')}>▲ N</button>
                  <button className={`dpad-btn ${activeHintDir === 'W' ? 'hint' : ''}`} style={{ gridColumn: 1, gridRow: 2 }} disabled={activeIsMoving || !ADJ[activeCur]['W']} onClick={() => activeMoveHandler('W')}>◀ W</button>
                  <div style={{ gridColumn: 2, gridRow: 2, background: '#FFF9F0', borderRadius: '10px', border: '1.5px solid #F2DFBC', display: 'grid', placeItems: 'center', fontSize: '12.5px', fontWeight: 800, color: '#78350F' }}>{short[activeCur]}</div>
                  <button className={`dpad-btn ${activeHintDir === 'E' ? 'hint' : ''}`} style={{ gridColumn: 3, gridRow: 2 }} disabled={activeIsMoving || !ADJ[activeCur]['E']} onClick={() => activeMoveHandler('E')}>E ▶</button>
                  <button className={`dpad-btn ${activeHintDir === 'S' ? 'hint' : ''}`} style={{ gridColumn: 2, gridRow: 3 }} disabled={activeIsMoving || !ADJ[activeCur]['S']} onClick={() => activeMoveHandler('S')}>▼ S</button>
                </div>

                {/* Bottom Helper Buttons */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                  <button onClick={activeHintHandler} disabled={activeIsMoving} style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#78350F', cursor: activeIsMoving ? 'not-allowed' : 'pointer', fontWeight: 700 }}>💡 Hint</button>
                  <button onClick={activeBackHandler} disabled={activeIsMoving || activePath.length <= 1} style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#78350F', cursor: activeIsMoving || activePath.length <= 1 ? 'not-allowed' : 'pointer', opacity: activeIsMoving || activePath.length <= 1 ? 0.4 : 1, fontWeight: 700 }}>↩ Back</button>
                  <button onClick={activeResetHandler} disabled={activeIsMoving} style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#78350F', cursor: activeIsMoving ? 'not-allowed' : 'pointer', fontWeight: 700 }}>↺ Restart</button>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' }}>
                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', fontWeight: 800, marginBottom: '8px' }}>
                  Progress ({is3DActive ? '3D Map' : 'Town Map'})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
                  {activePath.map((p, i) => (
                    <React.Fragment key={i}>
                      <span style={{ fontWeight: 800, color: i === activePath.length - 1 ? '#D97706' : '#166534' }}>{N_CLASSIC[p].label}</span>
                      <span style={{ color: '#B45309', fontWeight: 900 }}>→</span>
                    </React.Fragment>
                  ))}
                  <span style={{ color: '#92400E', fontWeight: 800, border: '1.5px dashed #D97706', padding: '2px 8px', borderRadius: '6px', background: '#FEF3C7' }}>🏦 Bank</span>
                </div>
              </div>

              {/* Journey Log */}
              <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' }}>
                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', fontWeight: 800, marginBottom: '8px' }}>
                  Journey log ({is3DActive ? '3D Map' : 'Town Map'})
                </div>
                <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', maxHeight: '90px', overflowY: 'auto' }}>
                  {activeLogs.map((log, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#3D2E24', fontWeight: 600 }}>
                      <span style={{ color: log.ok ? '#166534' : '#991B1B', flex: '0 0 auto', fontWeight: 900 }}>{log.ok ? '✓' : '✗'}</span>
                      <span dangerouslySetInnerHTML={{ __html: log.html }}></span>
                    </div>
                  ))}
                </div>
              </div>
              
            </ScrollableWithNav>
          </>
        )}

        {showQuiz && (
          <ScrollableWithNav containerStyle={{ flex: 1, minHeight: 0 }} scrollStyle={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Header Box */}
            <div style={{ background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)', border: '1.5px solid #F2DFBC', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 14px rgba(60,40,20,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontFamily: '"Space Grotesk", sans-serif', fontSize: '11.5px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                <HelpCircle size={16} color="#D97706" /> Map Activity Questions (Class 6)
              </div>
              <div style={{ color: '#78350F', fontSize: '18px', fontWeight: 900, fontFamily: '"Fraunces", serif' }}>
                Explore the Map Features
              </div>
              <div style={{ color: '#3D2E24', fontSize: '13px', marginTop: '4px', fontWeight: 600 }}>
                Look at the map on the left and select the correct answer for each question below:
              </div>
            </div>

            {/* ── QUESTION 1: Direction Finder ── */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(60,40,20,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #FDE68A' }}>QUESTION 1</span>
              </div>
              <p style={{ fontSize: '14px', color: '#3D2E24', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.45 }}>
                In which direction is the <b>School</b> located from the <b>Railway Station</b> along School Lane?
              </p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['South', 'North', 'East'].map(opt => {
                  const isPicked = q1Ans === opt;
                  const isCorrect = opt === 'South';
                  let btnBg = '#FFF9F0';
                  let btnBorder = '#F2DFBC';
                  let btnColor = '#3D2E24';
                  
                  if (q1Ans !== null) {
                    if (isCorrect) {
                      btnBg = '#DCFCE7';
                      btnBorder = '#16A34A';
                      btnColor = '#166534';
                    } else if (isPicked) {
                      btnBg = '#FEE2E2';
                      btnBorder = '#EF4444';
                      btnColor = '#991B1B';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => setQ1Ans(opt)}
                      style={{
                        flex: '1 1 110px',
                        padding: '9px 12px',
                        background: btnBg,
                        border: `2px solid ${btnBorder}`,
                        borderRadius: '10px',
                        color: btnColor,
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: '"Space Grotesk", sans-serif'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              
              {q1Ans && (
                <div style={{ fontSize: '12.5px', marginTop: '8px', color: q1Ans === 'South' ? '#166534' : '#991B1B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {q1Ans === 'South' ? (
                    <>✓ Correct! The School is located directly South (downwards) of the Railway Station.</>
                  ) : (
                    <>✗ Look at the compass heading: South points downwards towards the School.</>
                  )}
                </div>
              )}
            </div>

            {/* ── QUESTION 2: Landmark Identification ── */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(60,40,20,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #FDE68A' }}>QUESTION 2</span>
              </div>
              <p style={{ fontSize: '14px', color: '#3D2E24', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.45 }}>
                Which place is located between the <b>Railway Station</b> and <b>Nagar Panchayat</b> along Station Road?
              </p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Hospital', 'Public Garden', 'Museum'].map(opt => {
                  const isPicked = q2Ans === opt;
                  const isCorrect = opt === 'Hospital';
                  let btnBg = '#FFF9F0';
                  let btnBorder = '#F2DFBC';
                  let btnColor = '#3D2E24';
                  
                  if (q2Ans !== null) {
                    if (isCorrect) {
                      btnBg = '#DCFCE7';
                      btnBorder = '#16A34A';
                      btnColor = '#166534';
                    } else if (isPicked) {
                      btnBg = '#FEE2E2';
                      btnBorder = '#EF4444';
                      btnColor = '#991B1B';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => setQ2Ans(opt)}
                      style={{
                        flex: '1 1 110px',
                        padding: '9px 12px',
                        background: btnBg,
                        border: `2px solid ${btnBorder}`,
                        borderRadius: '10px',
                        color: btnColor,
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: '"Space Grotesk", sans-serif'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              
              {q2Ans && (
                <div style={{ fontSize: '12.5px', marginTop: '8px', color: q2Ans === 'Hospital' ? '#166534' : '#991B1B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {q2Ans === 'Hospital' ? (
                    <>✓ Correct! The Hospital lies directly between Railway Station and Nagar Panchayat.</>
                  ) : (
                    <>✗ Check the road connecting Railway Station and Nagar Panchayat: Hospital stands right in between.</>
                  )}
                </div>
              )}
            </div>

            {/* ── QUESTION 3: Map Colors & Symbols ── */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(60,40,20,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #FDE68A' }}>QUESTION 3</span>
              </div>
              <p style={{ fontSize: '14px', color: '#3D2E24', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.45 }}>
                What do the <b>blue-coloured areas</b> (water lake & river) on the map represent?
              </p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Water (Lake & River)', 'Forests & Trees', 'Roads & Tracks'].map(opt => {
                  const isPicked = q3Ans === opt;
                  const isCorrect = opt === 'Water (Lake & River)';
                  let btnBg = '#FFF9F0';
                  let btnBorder = '#F2DFBC';
                  let btnColor = '#3D2E24';
                  
                  if (q3Ans !== null) {
                    if (isCorrect) {
                      btnBg = '#DCFCE7';
                      btnBorder = '#16A34A';
                      btnColor = '#166534';
                    } else if (isPicked) {
                      btnBg = '#FEE2E2';
                      btnBorder = '#EF4444';
                      btnColor = '#991B1B';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => setQ3Ans(opt)}
                      style={{
                        flex: '1 1 130px',
                        padding: '9px 12px',
                        background: btnBg,
                        border: `2px solid ${btnBorder}`,
                        borderRadius: '10px',
                        color: btnColor,
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: '"Space Grotesk", sans-serif'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              
              {q3Ans && (
                <div style={{ fontSize: '12.5px', marginTop: '8px', color: q3Ans === 'Water (Lake & River)' ? '#166534' : '#991B1B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {q3Ans === 'Water (Lake & River)' ? (
                    <>✓ Correct! On standard maps, blue color always represents water bodies like lakes, rivers, and ponds.</>
                  ) : (
                    <>✗ Maps always use blue color to show water bodies such as lakes, ponds, and rivers.</>
                  )}
                </div>
              )}
            </div>

            {/* Elements of a Map Context Box */}
            <div ref={elementsRef} style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontFamily: '"Space Grotesk", sans-serif', fontSize: '11.5px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '10px' }}>
                <Compass size={16} color="#D97706" /> Key Elements of a Map
              </div>
              
              <div style={{ display: 'grid', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: '0 0 3px 0', color: '#78350F', fontSize: '14px', fontWeight: 800 }}>1. Directions & Compass</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#3D2E24', lineHeight: 1.45, fontWeight: 600 }}>
                    The compass indicates cardinal directions: North (top), South (bottom), East (right), and West (left).
                  </p>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 3px 0', color: '#78350F', fontSize: '14px', fontWeight: 800 }}>2. Conventional Colors & Symbols</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#3D2E24', lineHeight: 1.45, fontWeight: 600 }}>
                    Blue is used for water bodies, green for gardens and trees, and yellow/red for civic landmarks.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 3px 0', color: '#78350F', fontSize: '14px', fontWeight: 800 }}>3. Distance & Road Routes</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#3D2E24', lineHeight: 1.45, fontWeight: 600 }}>
                    Roads accurately connect landmarks across distances to guide travelers safely to their destinations.
                  </p>
                </div>
              </div>
            </div>

          </ScrollableWithNav>
        )}
        {/* Bottom Footer Area */}
        <div style={{ marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', borderTop: '1.5px solid #F2DFBC', paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 800, fontSize: '12.5px' }}>
              <MapPin size={16} color="#D97706" />
              Interactive {is3DActive ? '3D Illustrated Map' : 'Town Map'} Activity
            </div>
          </div>
        </div>

      </div>
    </div>
    <ChapterBackFooter
      onBack={onBack}
      nextLabel={isQuizComplete && hasWonAny ? 'Next Activity' : (hasWonAny ? 'Answer all 3 questions to proceed' : 'Reach the Bank to unlock')}
      onNext={onBeginChapter}
      nextDisabled={!(isQuizComplete && hasWonAny)}
      nextVariant="green"
    />
    </div>
  );
}
