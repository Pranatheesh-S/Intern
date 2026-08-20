import React, { useState, useRef, useEffect } from 'react';
import townMapStraightFig from './assets/town_map_straight_3d.jpg';

/* ═══════════════════════════════════════════════════════════════════════
   3D ILLUSTRATED MAP (TOWN MAP 3D EXPLORER)
   Exact same 1400x760 viewport width & breadth as City Explorer Map,
   matching right-side control panel alignment, Compass HUD,
   road-locked movement, and unified direction pad.
   ═══════════════════════════════════════════════════════════════════════ */

/* Exact 1400 x 760 Viewport to match City Explorer */
const VIEW_W = 1400;
const VIEW_H = 760;

/* ── 1. PLACES CONFIG (Strictly on Asphalt Road Intersections at 1400x760) ── */
const PLACES = [
  { id: 'RS', x: 438, y: 261, name: 'Railway Station', full: 'Central Junction Railway Station', icon: '🚂', type: 'station', start: true, blurb: 'Express rail terminal. Trains depart and arrive here.' },
  { id: 'HO', x: 438, y: 375, name: 'Hospital', full: 'City Care Hospital', icon: '🏥', type: 'hospital', blurb: '24/7 emergency care, doctors and ambulance bay.' },
  { id: 'NP', x: 779, y: 375, name: 'Town Hall', full: 'Civic Nagar Panchayat Town Hall', icon: '🏛️', type: 'civic', blurb: 'Municipal council and public administrative office.' },
  { id: 'BK', x: 898, y: 490, name: 'Bank', full: 'Apex National Bank', icon: '🏦', type: 'bank', goal: true, blurb: 'Treasury, currency exchange and banking vaults.' },
  { id: 'SC', x: 438, y: 490, name: 'School', full: 'Greenwood Public School', icon: '🏫', type: 'school', blurb: 'Primary & high school with student playground.' },
  { id: 'MK', x: 608, y: 490, name: 'Market', full: 'Janata Central Bazaar', icon: '🛍️', type: 'market', blurb: 'Daily fresh fruits, vegetables and grocery stalls.' },
  { id: 'JT', x: 779, y: 490, name: 'Junction', full: 'Central Town Crossroads', icon: '🚦', type: 'junction', blurb: 'Four-way town road traffic crossing.' },
  { id: 'MU', x: 1017, y: 490, name: 'Museum', full: 'Heritage Antiquities Museum', icon: '🏛️', type: 'museum', blurb: 'Classical historical museum with ancient sculptures.' },
  { id: 'AP', x: 779, y: 261, name: 'Apartments', full: 'Sunview Heights Residency', icon: '🏢', type: 'apartment', blurb: 'Multi-story residential apartment towers.' },
  { id: 'PG', x: 1017, y: 261, name: 'Public Garden', full: 'Rosewood Botanical Garden', icon: '🌳', type: 'garden', blurb: 'Botanical flora, flower beds and walking paths.' },
];

const BY_ID = {};
PLACES.forEach(p => { BY_ID[p.id] = p; });

const nodeXY = (id) => ({ x: BY_ID[id].x, y: BY_ID[id].y });

/* ── 2. ADJACENCY & ROAD PATHS (Road-locked) ───────────────────────── */
const ADJ = {
  RS: { S: 'HO', E: 'AP' },
  HO: { N: 'RS', S: 'SC', E: 'NP' },
  SC: { N: 'HO', E: 'MK' },
  MK: { W: 'SC', E: 'JT', N: 'NP' },
  NP: { W: 'HO', N: 'AP', S: 'JT', E: 'BK' },
  JT: { W: 'MK', N: 'NP', E: 'BK' },
  BK: { W: 'JT', E: 'MU', N: 'PG' },
  MU: { W: 'BK', N: 'PG' },
  AP: { W: 'RS', S: 'NP', E: 'PG' },
  PG: { W: 'AP', S: 'BK' },
};

const RAW_PATHS = {
  'RS|HO': [[438, 261], [438, 375]],
  'HO|SC': [[438, 375], [438, 490]],
  'RS|SC': [[438, 261], [438, 375], [438, 490]],
  'HO|NP': [[438, 375], [438, 261], [779, 261], [779, 375]],
  'NP|BK': [[779, 375], [779, 490], [898, 490]],
  'AP|NP': [[779, 261], [779, 375]],
  'BK|PG': [[898, 490], [1017, 490], [1017, 261]],
  'BK|MU': [[898, 490], [1017, 490]],
  'JT|BK': [[779, 490], [898, 490]],
  'JT|MU': [[779, 490], [898, 490], [1017, 490]],
  'MK|JT': [[608, 490], [779, 490]],
  'SC|MK': [[438, 490], [608, 490]],
  'NP|MK': [[779, 375], [779, 490], [608, 490]],
  'HO|MK': [[438, 375], [438, 490], [608, 490]],
  'NP|JT': [[779, 375], [779, 490]],
  'PG|AP': [[1017, 261], [779, 261]],
  'AP|HO': [[779, 261], [438, 261], [438, 375]],
  'RS|AP': [[438, 261], [779, 261]],
  'AP|PG': [[779, 261], [1017, 261]],
  'MU|PG': [[1017, 490], [1017, 261]],
};

function getRoadPoints(a, b) {
  const fwd = RAW_PATHS[`${a}|${b}`];
  if (fwd) return fwd;
  const back = RAW_PATHS[`${b}|${a}`];
  if (back) return [...back].reverse();
  const ax = BY_ID[a].x, ay = BY_ID[a].y;
  const bx = BY_ID[b].x, by = BY_ID[b].y;
  if (ax === bx || ay === by) return [[ax, ay], [bx, by]];
  return [[ax, ay], [bx, ay], [bx, by]];
}

const DIR_WORD = { N: 'North', S: 'South', E: 'East', W: 'West' };
const DIR_ANGLE = { N: -90, S: 90, E: 0, W: 180 };

/* ── 3. STREET NAME PLATES ─────────────────────────────────────────── */
const STREETS = [
  { id: 's_station_rd', name: 'STATION MARG', x: 438, y: 318, angle: -90, edge: 'RS|HO' },
  { id: 's_station_lane', name: 'STATION LANE', x: 438, y: 432, angle: -90, edge: 'HO|SC' },
  { id: 's_mg_road', name: 'M.G. ROAD', x: 608, y: 261, angle: 0, edge: 'RS|AP' },
  { id: 's_park_blvd', name: 'PARK BOULEVARD', x: 898, y: 261, angle: 0, edge: 'AP|PG' },
  { id: 's_bank_street', name: 'BANK STREET', x: 838, y: 490, angle: 0, edge: 'JT|BK' },
  { id: 's_apartment_dr', name: 'APARTMENT DRIVE', x: 779, y: 318, angle: -90, edge: 'AP|NP' },
  { id: 's_panchayat_rd', name: 'PANCHAYAT ROAD', x: 779, y: 432, angle: -90, edge: 'NP|JT' },
  { id: 's_garden_way', name: 'GARDEN WAY', x: 1017, y: 375, angle: -90, edge: 'BK|PG' },
  { id: 's_vidya_marg', name: 'VIDYA MARG', x: 523, y: 490, angle: 0, edge: 'SC|MK' },
  { id: 's_bazaar_rd', name: 'BAZAAR ROAD', x: 693, y: 490, angle: 0, edge: 'MK|JT' },
  { id: 's_museum_st', name: 'MUSEUM STREET', x: 958, y: 490, angle: 0, edge: 'JT|MU' },
];

function streetBetween(aId, bId) {
  const k1 = `${aId}|${bId}`, k2 = `${bId}|${aId}`;
  const matched = STREETS.find(s => s.edge === k1 || s.edge === k2);
  return matched ? matched.name : 'the road';
}

/* ── 4. BUILDING SIGN PLATES (Clean, High Contrast) ────────────────── */
const SIGN_PLATES = [
  { id: 'RS', x: 252, y: 85, label: 'RAILWAY STATION', bg: '#991B1B' },
  { id: 'LK', x: 600, y: 130, label: 'SCENIC LAKE', bg: '#0369A1' },
  { id: 'AP', x: 895, y: 60, label: 'SUNVIEW HEIGHTS', bg: '#0284C7' },
  { id: 'PG', x: 1175, y: 90, label: 'PUBLIC GARDEN', bg: '#15803D' },
  { id: 'HO', x: 285, y: 310, label: 'CITY CARE HOSPITAL', bg: '#DC2626' },
  { id: 'NP', x: 662, y: 310, label: 'CIVIC TOWN HALL', bg: '#4338CA' },
  { id: 'BK', x: 902, y: 310, label: 'APEX BANK', bg: '#047857' },
  { id: 'SC', x: 252, y: 585, label: 'GREENWOOD SCHOOL', bg: '#B45309' },
  { id: 'MK', x: 615, y: 585, label: 'CENTRAL BAZAAR', bg: '#C2410C' },
  { id: 'MU', x: 1175, y: 585, label: 'HERITAGE MUSEUM', bg: '#854D0E' },
];

const SignPlate = ({ x, y, label, bg }) => {
  const wdt = label.length * 7.4 + 26;
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

/* ── 5. THE WALKING PERSON ──────────────────────────────────────────── */
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

/* ── 6. MAIN COMPONENT ──────────────────────────────────────────────── */
const TownMap3DExplorer = ({ onComplete, onNext }) => {
  const START = 'RS';
  const GOAL = 'BK';

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
    const targetId = ADJ[cur] && ADJ[cur][dir];
    if (!targetId) {
      setBlocked(dir);
      setTimeout(() => setBlocked(null), 900);
      setLog(l => [...l, { text: `There is no road going ${DIR_WORD[dir]} from here.`, ok: false }]);
      return;
    }

    const target = BY_ID[targetId];
    const pathPts = getRoadPoints(cur, targetId);
    const street = streetBetween(cur, targetId);

    setActiveStreet(street);
    setHeading(dir);
    setAngle(DIR_ANGLE[dir]);
    setIsWalking(true);

    const DURATION = 1600;
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - t0) / DURATION);
      const e = -(Math.cos(Math.PI * p) - 1) / 2; // smooth ease in-out

      let totalLen = 0;
      const segLens = [];
      for (let i = 0; i < pathPts.length - 1; i++) {
        const d = Math.hypot(pathPts[i + 1][0] - pathPts[i][0], pathPts[i + 1][1] - pathPts[i][1]);
        segLens.push(d);
        totalLen += d;
      }

      const targetDist = e * totalLen;
      let acc = 0;
      let curX = pathPts[0][0], curY = pathPts[0][1];

      for (let i = 0; i < segLens.length; i++) {
        if (acc + segLens[i] >= targetDist || i === segLens.length - 1) {
          const rem = targetDist - acc;
          const t = segLens[i] > 0 ? rem / segLens[i] : 0;
          curX = pathPts[i][0] + (pathPts[i + 1][0] - pathPts[i][0]) * t;
          curY = pathPts[i][1] + (pathPts[i + 1][1] - pathPts[i][1]) * t;
          break;
        }
        acc += segLens[i];
      }

      setWalkerPos({ x: curX, y: curY });
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        const dest = nodeXY(targetId);
        setWalkerPos(dest);
        setProgress(0);
        setIsWalking(false);
        setCur(targetId);
        setTrail(tr => [...tr, dest]);
        setVisited(v => ({ ...v, [targetId]: true }));
        setLog(l => [...l, { text: `Walked ${DIR_WORD[dir]} along ${street} to the ${target.name}.`, ok: true }]);
        setTimeout(() => setActiveStreet(null), 1100);

        if (targetId === GOAL) {
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
  const available = {
    N: ADJ[cur]?.N ? BY_ID[ADJ[cur].N] : null,
    S: ADJ[cur]?.S ? BY_ID[ADJ[cur].S] : null,
    E: ADJ[cur]?.E ? BY_ID[ADJ[cur].E] : null,
    W: ADJ[cur]?.W ? BY_ID[ADJ[cur].W] : null,
  };
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

      {/* ══════════ REALISTIC 3D MAP VIEWPORT (1400 x 760 Proportions) ══════════ */}
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
            href={townMapStraightFig}
            x="0"
            y="0"
            width={VIEW_W}
            height={VIEW_H}
            preserveAspectRatio="none"
          />

          {/* ---------- 2. Landmark Name Badges ---------- */}
          <g id="ce-sign-plates">
            {SIGN_PLATES.map(sp => (
              <SignPlate key={sp.id} x={sp.x} y={sp.y} label={sp.label} bg={sp.bg} />
            ))}
          </g>

          {/* ---------- 3. Street Name Plates ---------- */}
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

          {/* ---------- 4. Route Trail Glow Line ---------- */}
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

          {/* ---------- 5. Place Node Markers & Target Indicators ---------- */}
          {PLACES.map(p => {
            const isCur = cur === p.id;
            const isGoal = p.id === GOAL;
            const seen = visited[p.id];
            return (
              <g key={p.id} transform={`translate(${p.x},${p.y})`} pointerEvents="none">
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

          {/* ---------- 6. Animated Walking Character ---------- */}
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

      {/* ══════════ RIGHT CONTROL PANEL (Exact City Explorer Match) ══════════ */}
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
            {won ? '🎉 Well done! You reached the Bank.' : <>Walk from the <b>Railway Station</b> to the <b>Bank</b> using the direction buttons.</>}
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

        {/* Travel Log */}
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

export default TownMap3DExplorer;
