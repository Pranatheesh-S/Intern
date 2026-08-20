import React, { useState, useRef, useEffect, useCallback } from 'react';
import cityExplorerRealisticMap from './assets/city_explorer_realistic_map.jpg';

/* ═══════════════════════════════════════════════════════════════════════
   CITY EXPLORER MAP  —  Realistic 3D Town Map Activity
   
   Navigation uses road-intersection nodes placed at crossroads between
   buildings. The walker moves ONLY along road corridors (horizontal
   and vertical) and NEVER crosses over any building.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── 1. VIEWPORT ────────────────────────────────────────────────────── */
const VIEW_W = 1400;
const VIEW_H = 760;

/* ── 2. ROAD INTERSECTION GRID ──────────────────────────────────────
   The map has 4 columns × 3 rows of building blocks.
   Roads run between them forming a grid.
   Intersections (crossroads) are at the corners of building blocks.
   
   We have 5 vertical road lines × 4 horizontal road lines = 20 intersections.
   
   Vertical road X positions (left edge → right edge):
     RX0=30   RX1=365   RX2=710   RX3=1050   RX4=1370
   
   Horizontal road Y positions (top edge → bottom edge):
     RY0=18   RY1=253   RY2=505   RY3=740
   ───────────────────────────────────────────────────────────────────── */
const RX = [18, 355, 700, 1055, 1382];  // 5 vertical road X coords
const RY = [12, 250, 498, 740];           // 4 horizontal road Y coords

/* Building center positions (for sign plates, in the middle of each cell) */
const cellCenterX = (col) => (RX[col] + RX[col + 1]) / 2;
const cellCenterY = (row) => (RY[row] + RY[row + 1]) / 2;

/* ── 3. PLACES & THEIR ASSOCIATED ROAD NODES ────────────────────────
   Each building occupies a cell [col, row].
   Each building is associated with a specific road intersection corner.
   
   We pick the BOTTOM-RIGHT corner of each building's cell as the
   "arrival node" — this puts the node on the road intersection
   closest to the building without overlapping it.
   
   Grid layout:
   ┌──────┬──────┬──────┬──────┐
   │ AIR  │ CIN  │ MALL │ HTL  │  row 0
   ├──────┼──────┼──────┼──────┤
   │ PARK │ LIB  │ HOSP │ BUS  │  row 1
   ├──────┼──────┼──────┼──────┤
   │ STAD │ FIRE │ POL  │ BEACH│  row 2
   └──────┴──────┴──────┴──────┘
     col0   col1   col2   col3
   
   Each place's navigation node is at a specific intersection:
   ───────────────────────────────────────────────────────────────────── */
const PLACES = [
  // Row 0
  { id: 'AIRPORT',  col: 0, row: 0, nodeIx: 0, nodeIy: 0, name: 'Airport',       full: 'Skyline International Airport',   icon: '✈️',  type: 'airport',  start: true, blurb: 'Planes take off and land here.' },
  { id: 'CINEMA',   col: 1, row: 0, nodeIx: 1, nodeIy: 0, name: 'Movie Theatre', full: 'Star Cineplex Cinema',             icon: '🎬',  type: 'cinema',   blurb: 'Watch the latest films on big screens.' },
  { id: 'MALL',     col: 2, row: 0, nodeIx: 2, nodeIy: 0, name: 'Shopping Mall', full: 'City Centre Mall',                 icon: '🛍️', type: 'mall',     blurb: 'Shops, food court and department stores.' },
  { id: 'HOTEL',    col: 3, row: 0, nodeIx: 3, nodeIy: 0, name: 'Hotel',         full: 'The Coastal Grand Hotel',          icon: '🏨',  type: 'hotel',    blurb: 'Luxury rooms and rooftop pool.' },
  // Row 1
  { id: 'PARK',     col: 0, row: 1, nodeIx: 0, nodeIy: 1, name: 'Park',          full: 'Greenfield City Park',             icon: '🌳',  type: 'park',     blurb: 'Lush greenery, pond and walking paths.' },
  { id: 'LIBRARY',  col: 1, row: 1, nodeIx: 1, nodeIy: 1, name: 'Library',       full: 'Central Public Library',           icon: '📚',  type: 'library',  blurb: 'Classic library with reading halls and books.' },
  { id: 'HOSPITAL', col: 2, row: 1, nodeIx: 2, nodeIy: 1, name: 'Hospital',      full: 'St. Mary Central Hospital',        icon: '🏥',  type: 'hospital', blurb: 'Emergency care, doctors and ambulance bay.' },
  { id: 'BUSSTOP',  col: 3, row: 1, nodeIx: 3, nodeIy: 1, name: 'Bus Stop',      full: 'Marina Bus Terminal',              icon: '🚌',  type: 'busstop',  blurb: 'Catch city and regional transit buses.' },
  // Row 2
  { id: 'STADIUM',  col: 0, row: 2, nodeIx: 0, nodeIy: 2, name: 'Stadium',       full: 'Victory Sports Stadium',           icon: '🏟️', type: 'stadium',  blurb: 'Football pitch, running tracks and grandstands.' },
  { id: 'FIRE',     col: 1, row: 2, nodeIx: 1, nodeIy: 2, name: 'Fire Station',  full: 'City Fire & Rescue Station',       icon: '🚒',  type: 'fire',     blurb: 'Fire engines rush out from the garage bays.' },
  { id: 'POLICE',   col: 2, row: 2, nodeIx: 2, nodeIy: 2, name: 'Police Station',full: 'Central Police Department',        icon: '🚓',  type: 'police',   blurb: 'Keeps the town safe and secure.' },
  { id: 'BEACH',    col: 3, row: 2, nodeIx: 3, nodeIy: 2, name: 'Beach',         full: 'Sunset Bay Beach & Coast',         icon: '🏖️', type: 'beach',    goal: true, blurb: 'Golden sand, palm trees and turquoise ocean.' },
];

const BY_ID = {};
PLACES.forEach(p => { BY_ID[p.id] = p; });

/* ── 4. ROAD INTERSECTION NODE GRAPH ────────────────────────────────
   Nodes are at road intersections. Each place's node is at the 
   BOTTOM-RIGHT corner of its building cell. The walker moves from
   intersection to intersection along the roads.
   
   For navigation, each place maps to a unique intersection node.
   When moving N/S/E/W, we find the adjacent place whose node is
   in that direction along the road grid.
   ───────────────────────────────────────────────────────────────────── */

/* Get the road intersection position for a place */
const placeNodePos = (p) => {
  // Place the node at the bottom-right corner of the building cell
  // This ensures nodes are always on road intersections
  return { x: RX[p.col + 1], y: RY[p.row + 1] };
};

const nodeXY = (id) => placeNodePos(BY_ID[id]);

/* Direction movement */
const DIR_DELTA = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
const DIR_WORD = { N: 'North', S: 'South', E: 'East', W: 'West' };
const DIR_ANGLE = { N: -90, S: 90, E: 0, W: 180 };

function neighbourOf(id, dir) {
  const p = BY_ID[id];
  if (!p) return null;
  const [dc, dr] = DIR_DELTA[dir];
  const nc = p.col + dc;
  const nr = p.row + dr;
  if (nc < 0 || nc > 3 || nr < 0 || nr > 2) return null;
  return PLACES.find(pl => pl.col === nc && pl.row === nr) || null;
}

/* ── 5. STREET NAMES ────────────────────────────────────────────────── */
/*
   Roads have unique names. Horizontal roads run between rows,
   vertical roads run between columns. Labels sit in the road
   corridor midpoints, well clear of building blocks.
*/

/* Horizontal road Y midpoints (center of the road corridor between rows) */
const HRY = [
  (RY[0] + RY[0]) / 2 + 6,          // top edge road
  (RY[0] + RY[1]) / 2 + (RY[1] - RY[0]) * 0.52, // road between row 0-1 (slight offset below center to sit on asphalt)
  (RY[1] + RY[2]) / 2 + (RY[2] - RY[1]) * 0.02, // road between row 1-2
  RY[3] - 8,                          // bottom edge road
];

/* Vertical road X midpoints */
const VRX = [
  RX[0] + 8,                           // left edge road
  (RX[1] + RX[0]) / 2 + (RX[1] - RX[0]) * 0.25, // between col 0-1
  (RX[1] + RX[2]) / 2,                 // between col 1-2
  (RX[2] + RX[3]) / 2,                 // between col 2-3
  RX[4] - 8,                           // right edge road
];

const STREETS = [
  // 4 Horizontal roads (unique names)
  { id: 's_runway',    name: 'RUNWAY BOULEVARD',   x: VIEW_W / 2, y: RY[0] + 8,   angle: 0 },
  { id: 's_central',   name: 'CENTRAL AVENUE',     x: VIEW_W / 2, y: RY[1],        angle: 0 },
  { id: 's_garden',    name: 'GARDEN STREET',       x: VIEW_W / 2, y: RY[2],        angle: 0 },
  { id: 's_coastal',   name: 'COASTAL DRIVE',       x: VIEW_W / 2, y: RY[3] - 8,   angle: 0 },
  // 5 Vertical roads (unique names)
  { id: 's_west',      name: 'WEST END ROAD',       x: RX[0] + 8,  y: VIEW_H / 2,  angle: -90 },
  { id: 's_maple',     name: 'MAPLE LANE',          x: RX[1],       y: VIEW_H / 2,  angle: -90 },
  { id: 's_heritage',  name: 'HERITAGE ROAD',       x: RX[2],       y: VIEW_H / 2,  angle: -90 },
  { id: 's_cross',     name: 'CROSSFIELD AVE',      x: RX[3],       y: VIEW_H / 2,  angle: -90 },
  { id: 's_east',      name: 'EAST SHORE ROAD',     x: RX[4] - 8,  y: VIEW_H / 2,  angle: -90 },
];

/* Map direction + row/col to the correct road name */
const H_ROAD_NAMES = ['RUNWAY BOULEVARD', 'CENTRAL AVENUE', 'GARDEN STREET', 'COASTAL DRIVE'];
const V_ROAD_NAMES = ['WEST END ROAD', 'MAPLE LANE', 'HERITAGE ROAD', 'CROSSFIELD AVE', 'EAST SHORE ROAD'];

function streetBetween(aId, bId) {
  const a = BY_ID[aId], b = BY_ID[bId];
  if (!a || !b) return 'the road';
  if (a.row === b.row) {
    // Horizontal movement along the road at the bottom of row
    return H_ROAD_NAMES[a.row + 1] || 'the road';
  }
  // Vertical movement along the road at the right of column
  return V_ROAD_NAMES[a.col + 1] || 'the road';
}

/* ── 6. BUILDING SIGN PLATES ────────────────────────────────────────── */
/*
   Each building has a unique display name. Sign plates are positioned
   at the CENTER of each building cell, well clear of road corridors
   and intersection node markers.
*/
const BUILDING_NAMES = {
  AIRPORT:  'SKYLINE AIRPORT',
  CINEMA:   'STAR CINEPLEX',
  MALL:     'CITY CENTRE MALL',
  HOTEL:    'GRAND HOTEL',
  PARK:     'GREENFIELD PARK',
  LIBRARY:  'PUBLIC LIBRARY',
  HOSPITAL: 'CENTRAL HOSPITAL',
  BUSSTOP:  'BUS TERMINAL',
  STADIUM:  'VICTORY STADIUM',
  FIRE:     'FIRE STATION',
  POLICE:   'POLICE HQ',
  BEACH:    'SUNSET BEACH',
};

const BUILDING_COLORS = {
  AIRPORT: '#1E40AF', CINEMA: '#831843', MALL: '#0369A1', HOTEL: '#78350F',
  PARK: '#15803D', LIBRARY: '#92400E', HOSPITAL: '#B91C1C', BUSSTOP: '#047857',
  STADIUM: '#1E3A8A', FIRE: '#C2410C', POLICE: '#1E293B', BEACH: '#0891B2',
};

const SIGN_PLATES = PLACES.map(p => ({
  id: p.id,
  x: cellCenterX(p.col),
  y: cellCenterY(p.row) - 30,   // pushed up toward center of building, well above road node
  label: BUILDING_NAMES[p.id],
  bg: BUILDING_COLORS[p.id],
}));

/** Sign plate badge for buildings */
const SignPlate = ({ x, y, label, bg }) => {
  const wdt = label.length * 7.4 + 22;
  return (
    <g transform={`translate(${x},${y})`} pointerEvents="none">
      <rect
        x={-wdt / 2}
        y={-10}
        width={wdt}
        height="22"
        rx="6"
        fill={bg}
        opacity="0.95"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))' }}
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill="#FFFFFF"
        fontFamily="Space Grotesk, sans-serif"
        letterSpacing="0.6px"
      >
        {label}
      </text>
    </g>
  );
};

/* ── 7. THE WALKING PERSON ──────────────────────────────────────────── */
const Walker = ({ pos, isWalking, progress, angle, streetName }) => {
  const facingLeft = angle > 90 || angle < -90;
  const stride = isWalking ? Math.sin(progress * Math.PI * 16) : 0;
  const legA = stride * 28;
  const armA = -stride * 24;
  const bob = isWalking ? Math.abs(Math.sin(progress * Math.PI * 16)) * 2.5 : 0;

  return (
    <g transform={`translate(${pos.x},${pos.y})`} pointerEvents="none">
      {/* Ground shadow & pulse ring */}
      <circle cx="0" cy="0" r="18" fill="#F59E0B" opacity="0.28">
        <animate attributeName="r" from="8" to="26" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="0" cy="4" rx="11" ry="4.5" fill="rgba(0,0,0,0.5)" style={{ filter: 'blur(1.5px)' }} />

      {/* Street indicator bubble above head */}
      {streetName && (
        <g transform="translate(0,-56)">
          <rect
            x="-68"
            y="-11"
            width="136"
            height="22"
            rx="7"
            fill="#0F172A"
            stroke="#F5A623"
            strokeWidth="1.8"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}
          />
          <text
            x="0"
            y="4.5"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="10.5"
            fontWeight="900"
            fontFamily="Space Grotesk, sans-serif"
          >
            🚶 {streetName}
          </text>
        </g>
      )}

      {/* 3D Character Walker */}
      <g transform={`translate(0,${-20 - bob}) scale(0.82) scale(${facingLeft ? -1 : 1},1)`}>
        {/* Backpack */}
        <rect x="-8.5" y="5" width="6" height="13" rx="2.5" fill="#D97706" stroke="#B45309" strokeWidth="0.8" />
        {/* Left arm */}
        <g transform={`translate(4,7) rotate(${armA})`}>
          <rect x="-2" y="0" width="4" height="12" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="0.6" />
          <circle cx="0" cy="12" r="2.2" fill="#FCD34D" />
        </g>
        {/* Left leg */}
        <g transform={`translate(-3,17) rotate(${-legA})`}>
          <rect x="-2" y="0" width="4" height="14" rx="1.6" fill="#1E293B" />
          <rect x="-2" y="12" width="6" height="4" rx="1.4" fill="#DC2626" />
        </g>
        {/* Right leg */}
        <g transform={`translate(3,17) rotate(${legA})`}>
          <rect x="-2" y="0" width="4" height="14" rx="1.6" fill="#334155" />
          <rect x="-2" y="12" width="6" height="4" rx="1.4" fill="#DC2626" />
        </g>
        {/* Body jacket */}
        <rect x="-6" y="4" width="12" height="15" rx="3.5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
        <line x1="0" y1="4" x2="0" y2="19" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Right arm */}
        <g transform={`translate(-4,7) rotate(${-armA})`}>
          <rect x="-2" y="0" width="4" height="12" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.6" />
          <circle cx="0" cy="12" r="2.2" fill="#FCD34D" />
        </g>
        {/* Head & cap */}
        <circle cx="0" cy="-4" r="6.2" fill="#FCD34D" stroke="#D97706" strokeWidth="0.8" />
        <path d="M -5.8 -4.6 Q 0 -9.2 5.8 -4.6 L 7.5 -3.2 L 3.5 -2.8 Z" fill="#DC2626" />
        <circle cx="2.1" cy="-4" r="1.1" fill="#1E293B" />
      </g>
    </g>
  );
};

/* ── 8. PATH FINDING — Walker stays on roads ────────────────────────
   When moving from one place to an adjacent place, the walker must
   travel along the road grid (road intersections only). 
   
   Movement goes from the current place's intersection node to the 
   target place's intersection node. Since each place maps to the
   bottom-right corner of its cell, moving E/W or N/S may require
   going through intermediate road nodes to stay on the road.
   
   For adjacent cells:
   - Moving EAST (col+1): from (col+1, row+1) → (col+2, row+1) 
     → straight horizontal along road, no building in the way ✓
   - Moving SOUTH (row+1): from (col+1, row+1) → (col+1, row+2)
     → straight vertical along road, no building in the way ✓
   - Moving WEST (col-1): from (col+1, row+1) → (col, row+1)
     → straight horizontal along road ✓
   - Moving NORTH (row-1): from (col+1, row+1) → (col+1, row)
     → straight vertical along road ✓
   
   All movements are along road corridors — no diagonal, no crossing
   through building blocks!
   ───────────────────────────────────────────────────────────────────── */

/* ── 9. MAIN COMPONENT ──────────────────────────────────────────────── */
const CityExplorerMap = ({ onComplete, onNext }) => {
  const START = 'AIRPORT';
  const GOAL = 'BEACH';

  const [cur, setCur] = useState(START);
  const [walkerPos, setWalkerPos] = useState(nodeXY(START));
  const [isWalking, setIsWalking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [angle, setAngle] = useState(0);
  const [heading, setHeading] = useState('N');
  const [activeStreet, setActiveStreet] = useState(null);
  const [trail, setTrail] = useState([nodeXY(START)]);
  const [visited, setVisited] = useState({ [START]: true });
  const [log, setLog] = useState([{ text: `You start at the ${BY_ID[START].name}. Reach the ${BY_ID[GOAL].name}!`, ok: true }]);
  const [won, setWon] = useState(false);
  const [blocked, setBlocked] = useState(null);

  const logRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const move = (dir) => {
    if (isWalking || won) return;
    const target = neighbourOf(cur, dir);
    if (!target) {
      setBlocked(dir);
      setTimeout(() => setBlocked(null), 900);
      setLog(l => [...l, { text: `There is no road going ${DIR_WORD[dir]} from here.`, ok: false }]);
      return;
    }

    const from = nodeXY(cur);
    const to = nodeXY(target.id);
    const street = streetBetween(cur, target.id);

    setActiveStreet(street);
    setHeading(dir);
    setAngle(DIR_ANGLE[dir]);
    setIsWalking(true);

    const DURATION = 1500;
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - t0) / DURATION);
      const e = -(Math.cos(Math.PI * p) - 1) / 2;   // smooth ease in-out
      setWalkerPos({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setWalkerPos(to);
        setProgress(0);
        setIsWalking(false);
        setCur(target.id);
        setTrail(tr => [...tr, to]);
        setVisited(v => ({ ...v, [target.id]: true }));
        setLog(l => [...l, { text: `Walked ${DIR_WORD[dir]} along ${street} to the ${target.name}.`, ok: true }]);
        setTimeout(() => setActiveStreet(null), 1100);
        if (target.id === GOAL) {
          setWon(true);
          setLog(l => [...l, { text: `🎉 You reached the ${BY_ID[GOAL].name}! Mission complete.`, ok: true }]);
          if (onComplete) onComplete();
        }
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setCur(START);
    setWalkerPos(nodeXY(START));
    setIsWalking(false);
    setProgress(0);
    setAngle(0);
    setHeading('N');
    setActiveStreet(null);
    setTrail([nodeXY(START)]);
    setVisited({ [START]: true });
    setWon(false);
    setLog([{ text: `Back at the ${BY_ID[START].name}. Reach the ${BY_ID[GOAL].name}!`, ok: true }]);
  };

  const curPlace = BY_ID[cur];
  const available = { N: neighbourOf(cur, 'N'), S: neighbourOf(cur, 'S'), E: neighbourOf(cur, 'E'), W: neighbourOf(cur, 'W') };
  const visitedCount = Object.keys(visited).length;

  /* ── Direction button component (Strictly enable only valid directions) ── */
  const DirBtn = ({ dir, label, arrow, gridArea }) => {
    const nb = available[dir];
    const off = !nb || isWalking || won;
    return (
      <button
        type="button"
        onClick={() => move(dir)}
        disabled={off}
        title={nb ? `Go ${DIR_WORD[dir]} to ${nb.name}` : `No road going ${DIR_WORD[dir]}`}
        style={{
          gridArea,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '2px',
          border: off ? '1.5px dashed #CBD5E1' : '2px solid #F59E0B',
          background: off
            ? '#F1F5F9'
            : 'linear-gradient(145deg, #FEF08A 0%, #F59E0B 60%, #D97706 100%)',
          color: off ? '#94A3B8' : '#78350F',
          opacity: off ? 0.35 : 1,
          borderRadius: '14px',
          padding: '8px 4px',
          cursor: off ? 'not-allowed' : 'pointer',
          pointerEvents: off ? 'none' : 'auto',
          fontWeight: 900,
          transition: 'all 0.2s ease',
          boxShadow: off
            ? 'none'
            : '0 4px 14px rgba(245,158,11,0.45), inset 0 1px 1px rgba(255,255,255,0.7)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '13px', lineHeight: 1, opacity: off ? 0.4 : 1 }}>{arrow}</span>
          <span style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.5px' }}>{label}</span>
        </div>
        <span style={{ fontSize: '9px', fontWeight: 800, opacity: off ? 0.4 : 0.95, maxWidth: '78px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
          {nb ? nb.name : '—'}
        </span>
      </button>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', background: '#0F172A', overflow: 'hidden' }}>

      {/* ══════════ REALISTIC 3D MAP VIEWPORT ══════════ */}
      <div style={{ flex: 1, position: 'relative', minWidth: 0, background: '#0F172A', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <style>{`
              @keyframes ceDash { to { stroke-dashoffset: -44; } }
              .ce-flow { animation: ceDash 1.1s linear infinite; }
            `}</style>
          </defs>

          {/* ---------- 1. Realistic 3D Architectural Map Image ---------- */}
          <image
            href={cityExplorerRealisticMap}
            x="0"
            y="0"
            width={VIEW_W}
            height={VIEW_H}
            preserveAspectRatio="none"
          />

          {/* ---------- 2. Road Grid Overlay (subtle) ---------- */}
          <g id="ce-road-grid" pointerEvents="none" opacity="0.08">
            {/* Horizontal roads */}
            {RY.map((y, i) => (
              <line key={`rh${i}`} x1="0" y1={y} x2={VIEW_W} y2={y} stroke="#FFFFFF" strokeWidth="3" />
            ))}
            {/* Vertical roads */}
            {RX.map((x, i) => (
              <line key={`rv${i}`} x1={x} y1="0" x2={x} y2={VIEW_H} stroke="#FFFFFF" strokeWidth="3" />
            ))}
          </g>

          {/* ---------- 3. Landmark Name Badges ---------- */}
          <g id="ce-sign-plates">
            {SIGN_PLATES.map(sp => (
              <SignPlate key={sp.id} x={sp.x} y={sp.y} label={sp.label} bg={sp.bg} />
            ))}
          </g>

          {/* ---------- 4. Street Name Plates ---------- */}
          <g id="ce-streets" pointerEvents="none">
            {STREETS.map(s => {
              const hot = activeStreet === s.name;
              const wdt = s.name.length * 6.6 + 18;
              return (
                <g key={s.id} transform={`translate(${s.x},${s.y}) rotate(${s.angle})`}>
                  <rect
                    x={-wdt / 2}
                    y="-10"
                    width={wdt}
                    height="20"
                    rx="6"
                    fill={hot ? '#FEF08A' : 'rgba(15,23,42,0.92)'}
                    stroke={hot ? '#F59E0B' : '#F2C744'}
                    strokeWidth={hot ? 2 : 1.2}
                    style={{ filter: hot ? 'drop-shadow(0 0 10px rgba(245,158,11,0.9))' : 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="900"
                    fill={hot ? '#78350F' : '#FEF08A'}
                    fontFamily="Space Grotesk, sans-serif"
                    letterSpacing="0.6px"
                  >
                    {s.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ---------- 5. Route Trail Glow Line ---------- */}
          {trail.length > 1 && (
            <>
              <polyline
                points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />
              <polyline
                points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#0284C7"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              <polyline
                className="ce-flow"
                points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#FEF08A"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="14 10"
              />
            </>
          )}

          {/* ---------- 6. Road Intersection Node Markers ---------- */}
          {PLACES.map(p => {
            const pos = placeNodePos(p);
            const isCur = cur === p.id;
            const isGoal = p.id === GOAL;
            const seen = visited[p.id];
            return (
              <g key={p.id} transform={`translate(${pos.x},${pos.y})`} pointerEvents="none">
                <circle
                  cx="0"
                  cy="0"
                  r={isCur ? 19 : isGoal ? 20 : 13}
                  fill={isCur ? '#EF4444' : isGoal ? '#10B981' : '#3B82F6'}
                  opacity="0.3"
                >
                  {(isCur || isGoal) && (
                    <>
                      <animate attributeName="r" from="13" to="30" dur="1.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.7" to="0" dur="1.4s" repeatCount="indefinite" />
                    </>
                  )}
                </circle>
                <circle
                  cx="0"
                  cy="0"
                  r={isCur ? 11 : isGoal ? 10.5 : 8.5}
                  fill={isCur ? '#EF4444' : isGoal ? '#10B981' : seen ? '#2563EB' : '#475569'}
                  stroke="#FFFFFF"
                  strokeWidth="2.8"
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
                />
                <circle cx="0" cy="0" r="3.4" fill="#FFFFFF" opacity="0.95" />
                <g transform="translate(0,-32)">
                  <rect
                    x="-16"
                    y="-16"
                    width="32"
                    height="28"
                    rx="8"
                    fill="rgba(15,23,42,0.92)"
                    stroke={isGoal ? '#10B981' : '#F5A623'}
                    strokeWidth="1.8"
                    style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }}
                  />
                  <text x="0" y="5" textAnchor="middle" fontSize="15">{p.icon}</text>
                </g>
              </g>
            );
          })}

          {/* ---------- 7. Animated Walking Character ---------- */}
          <Walker
            pos={walkerPos}
            isWalking={isWalking}
            progress={progress}
            angle={angle}
            streetName={activeStreet}
          />
        </svg>

        {/* Compass HUD */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(15,23,42,0.95)', border: '2px solid #F5A623', borderRadius: '14px', padding: '6px 14px 6px 10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
          <svg width="42" height="42" viewBox="-24 -24 48 48">
            <circle r="21" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <g transform={`rotate(${{ N: 0, E: 90, S: 180, W: 270 }[heading]})`} style={{ transition: 'transform 0.3s ease-out' }}>
              <polygon points="0,-18 4.5,0 0,-2" fill="#EF4444" />
              <polygon points="0,-18 -4.5,0 0,-2" fill="#F87171" />
              <polygon points="0,18 4.5,0 0,2" fill="#94A3B8" />
              <polygon points="0,18 -4.5,0 0,2" fill="#CBD5E1" />
              <circle r="3.5" fill="#F5A623" stroke="#0F172A" strokeWidth="1" />
            </g>
            {[['N', 0, -13], ['S', 0, 17], ['E', 14, 3], ['W', -14, 3]].map(([d, dx, dy]) => (
              <text key={d} x={dx} y={dy} textAnchor="middle" fontSize="8" fontWeight="900"
                fill={heading === d ? '#FEF08A' : d === 'N' ? '#EF4444' : '#94A3B8'}>{d}</text>
            ))}
          </svg>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>HEADING</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#FEF08A', letterSpacing: '0.6px' }}>{DIR_WORD[heading].toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT CONTROL PANEL ══════════ */}
      <div style={{
        width: '310px', flexShrink: 0, borderLeft: '2px solid #F2DFBC', background: 'linear-gradient(170deg,#FFFDF7,#F7F1E2)',
        display: 'flex', flexDirection: 'column', padding: '12px', gap: '10px', overflowY: 'auto'
      }}>
        {/* Mission Card */}
        <div style={{
          background: won ? 'linear-gradient(150deg,#D1FAE5,#A7F3D0)' : 'linear-gradient(150deg,#FEF3C7,#FDE68A)',
          border: `2px solid ${won ? '#10B981' : '#F59E0B'}`, borderRadius: '14px', padding: '10px 12px'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: won ? '#065F46' : '#92400E', letterSpacing: '1px' }}>🎯 MISSION</div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: won ? '#065F46' : '#78350F', marginTop: '3px', lineHeight: 1.35 }}>
            {won ? '🎉 Well done! You found the Beach.' : <>Walk from the <b>Airport</b> to the <b>Beach</b> using the direction buttons.</>}
          </div>
          {won && onNext && (
            <button
              type="button"
              onClick={onNext}
              style={{
                marginTop: '10px',
                width: '100%',
                background: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 14px',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#059669'}
              onMouseOut={e => e.currentTarget.style.background = '#10B981'}
            >
              Next Activity ➔
            </button>
          )}
        </div>

        {/* Current Location Card */}
        <div style={{ background: '#FFFFFF', border: '2px solid #E7D9B8', borderRadius: '14px', padding: '11px 12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', letterSpacing: '1px' }}>📍 YOU ARE AT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '4px' }}>
            <span style={{ fontSize: '24px' }}>{curPlace.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>{curPlace.name}</div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>{curPlace.full}</div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.35 }}>{curPlace.blurb}</div>
        </div>

        {/* Direction Controls Pad (Attractive Sleek Design) */}
        <div style={{ background: '#FFFFFF', border: '2px solid #E7D9B8', borderRadius: '16px', padding: '12px 10px', boxShadow: '0 4px 16px rgba(60,40,20,0.05)' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#92400E', letterSpacing: '1px', marginBottom: '10px', textAlign: 'center' }}>
            🧭 DIRECTION CONTROLS
          </div>
          <div style={{
            display: 'grid',
            gridTemplateAreas: `". n ." "w c e" ". s ."`,
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px'
          }}>
            <DirBtn dir="N" label="N" arrow="▲" gridArea="n" />
            <DirBtn dir="W" label="W" arrow="◀" gridArea="w" />
            <DirBtn dir="E" label="E" arrow="▶" gridArea="e" />
            <DirBtn dir="S" label="S" arrow="▼" gridArea="s" />
            <button
              type="button"
              onClick={reset}
              title="Reset to Starting Position"
              style={{
                gridArea: 'c', border: '2px solid #CBD5E1', background: 'linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)', borderRadius: '14px',
                cursor: 'pointer', fontWeight: 900, fontSize: '11px', color: '#475569', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08), inset 0 1px 0 #FFFFFF',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.color = '#0F172A'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#475569'; }}
            >
              <span style={{ fontSize: '15px' }}>🔄</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.4px' }}>RESET</span>
            </button>
          </div>
          <div style={{ fontSize: '9.5px', color: '#94A3B8', marginTop: '10px', textAlign: 'center', fontWeight: 700 }}>
            Buttons highlight when a road leads that way.
          </div>
        </div>

        {/* Places Visited Progress */}
        <div style={{ background: '#FFFFFF', border: '2px solid #E7D9B8', borderRadius: '14px', padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 900, color: '#475569' }}>
            <span>PLACES VISITED</span><span>{visitedCount} / {PLACES.length}</span>
          </div>
          <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${(visitedCount / PLACES.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#F59E0B,#10B981)', transition: 'width 0.4s' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {PLACES.map(p => (
              <span key={p.id} title={p.name} style={{
                fontSize: '12px', padding: '2px 4px', borderRadius: '6px',
                background: visited[p.id] ? '#D1FAE5' : '#F1F5F9',
                border: `1px solid ${visited[p.id] ? '#10B981' : '#E2E8F0'}`,
                opacity: visited[p.id] ? 1 : 0.5
              }}>{p.icon}</span>
            ))}
          </div>
        </div>

        {/* log */}
        <div style={{ background: '#0F172A', borderRadius: '12px', padding: '9px', flex: 1, minHeight: '92px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#F5A623', letterSpacing: '1px', marginBottom: '5px' }}>📋 TRAVEL LOG</div>
          <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {log.map((l, i) => (
              <div key={i} style={{
                fontSize: '10.5px', lineHeight: 1.4, padding: '4px 7px', borderRadius: '7px',
                background: l.ok ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.16)',
                color: l.ok ? '#A7F3D0' : '#FCA5A5',
                borderLeft: `3px solid ${l.ok ? '#10B981' : '#EF4444'}`
              }}>{l.text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityExplorerMap;
