import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Map, MapPin, Compass, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import ExploreIndiaActivity from './ExploreIndiaActivity';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';
import townMapFig from './assets/town_map_fig1.jpg';

const N = {
  RS: {x: 330, y: 425, label: 'Railway Station', type: 'station', start: true},
  HO: {x: 585, y: 440, label: 'Hospital', type: 'hospital'},
  NP: {x: 865, y: 415, label: 'Nagar Panchayat', type: 'civic'},
  BK: {x: 1040, y: 428, label: 'Bank', type: 'bank', goal: true},
  SC: {x: 344, y: 615, label: 'School', type: 'school'},
  MK: {x: 690, y: 645, label: 'Market', type: 'market'},
  JT: {x: 940, y: 470, label: 'Junction', type: 'junction'},
  MU: {x: 1020, y: 656, label: 'Museum', type: 'museum'},
  AP: {x: 762, y: 228, label: 'Apartments', type: 'apartment'},
  PG: {x: 1140, y: 245, label: 'Public Garden', type: 'garden'},
};

// Each road is traced along the actual tarmac in town_map_fig1.jpg,
// from one place to the next. Points are in the image's own 1376 x 768 space.
const PATHS = {
  'RS|HO': [[330,425],[400,427],[470,428],[522,428],[560,434],[585,440]],
  'RS|SC': [[330,425],[255,424],[199,434],[196,490],[196,570],[205,640],[233,686],[282,716],[313,708],[331,668],[344,615]],
  'SC|MK': [[344,615],[331,668],[313,708],[380,727],[480,730],[580,730],[650,722],[688,690],[690,645]],
  'MK|JT': [[690,645],[688,690],[760,726],[840,728],[900,716],[932,678],[940,600],[940,520],[940,470]],
  'HO|NP': [[585,440],[585,505],[578,538],[615,545],[680,520],[745,495],[800,470],[850,455],[870,430],[866,415],[865,415]],
  'NP|BK': [[865,415],[900,428],[960,428],[1010,428],[1040,428]],
  'NP|JT': [[865,415],[895,432],[925,450],[940,470]],
  'BK|PG': [[1040,428],[1090,428],[1140,420],[1185,395],[1210,340],[1205,280],[1180,248],[1140,245]],
  'PG|AP': [[1140,245],[1080,240],[1010,238],[960,244],[920,228],[880,232],[820,240],[770,228],[762,228]],
  'AP|HO': [[762,228],[790,262],[762,298],[710,330],[665,368],[630,400],[600,420],[585,440]],
  'JT|MU': [[940,470],[940,560],[942,640],[965,660],[1020,656]],
};

const EDGES = Object.keys(PATHS).map(k => k.split('|'));

// the tarmac between two adjoining places, in the direction of travel
function roadPoints(a, b) {
  const fwd = PATHS[`${a}|${b}`];
  if (fwd) return fwd;
  const back = PATHS[`${b}|${a}`];
  if (back) return [...back].reverse();
  return [[N[a].x, N[a].y], [N[b].x, N[b].y]];
}

const ptsAttr = pts => pts.map(([x, y]) => `${x},${y}`).join(' ');

// Which way a road SETS OFF, read off the tarmac itself — not the straight
// line between two buildings. Leaving the Hospital for the Nagar Panchayat you
// drive south out of the gate first, so that road is 'S' even though the Nagar
// Panchayat sits to the east.
function pointAlong(pts, dist) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (acc + seg >= dist) {
      const t = (dist - acc) / seg;
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
    }
    acc += seg;
  }
  return pts[pts.length - 1];
}

// Explicit, 100% accurate 4-way cardinal adjacency map (North, South, East, West)
const ADJ = {
  RS: { E: 'HO', S: 'SC' },
  HO: { W: 'RS', E: 'NP', N: 'AP', S: 'SC' },
  NP: { W: 'HO', E: 'BK', S: 'JT' },
  BK: { W: 'NP', E: 'PG' },
  JT: { N: 'NP', E: 'BK', W: 'MK', S: 'MU' },
  SC: { N: 'RS', E: 'MK' },
  MK: { W: 'SC', E: 'JT' },
  MU: { N: 'JT' },
  AP: { S: 'HO', E: 'PG' },
  PG: { W: 'AP', S: 'BK' },
};

// Official road names connecting each pair of locations
const ROAD_NAMES = {
  'RS|HO': 'STATION ROAD', 'HO|RS': 'STATION ROAD',
  'RS|SC': 'SCHOOL LANE', 'SC|RS': 'SCHOOL LANE',
  'SC|MK': 'MARKET ROAD', 'MK|SC': 'MARKET ROAD',
  'MK|JT': 'MARKET ROAD', 'JT|MK': 'MARKET ROAD',
  'JT|NP': 'PANCHAYAT MARG', 'NP|JT': 'PANCHAYAT MARG',
  'HO|NP': 'PANCHAYAT MARG', 'NP|HO': 'PANCHAYAT MARG',
  'HO|AP': 'APARTMENT DRIVE', 'AP|HO': 'APARTMENT DRIVE',
  'AP|PG': 'GARDEN WAY', 'PG|AP': 'GARDEN WAY',
  'PG|BK': 'BANK ROAD', 'BK|PG': 'BANK ROAD',
  'JT|MU': 'MUSEUM STREET', 'MU|JT': 'MUSEUM STREET',
  'NP|BK': 'BANK ROAD', 'BK|NP': 'BANK ROAD',
  'JT|BK': 'BANK ROAD', 'BK|JT': 'BANK ROAD',
};

function getRoadName(a, b) {
  if (!a || !b) return '';
  return ROAD_NAMES[`${a}|${b}`] || 'TOWN ROAD';
}

function bfs(start, goal) {
  const q = [[start]], seen = { [start]: 1 };
  while (q.length) {
    const p = q.shift(), last = p[p.length - 1];
    if (last === goal) return p;
    for (const d in ADJ[last]) {
      const nx = ADJ[last][d];
      if (nx && !seen[nx]) { seen[nx] = 1; q.push([...p, nx]); }
    }
  }
  return null;
}

const ROOF = {
  station: '#c0392b', hospital: '#e74c3c', civic: '#5b7fa6', bank: '#34618e', school: '#e0a020',
  market: '#7c5cff', museum: '#4a6072', apartment: '#c98a4b', garden: '#2e8b57', junction: '#8a94a1'
};
const short = { RS: 'RS', HO: 'Hosp', NP: 'NP', BK: 'Bank', SC: 'Sch', MK: 'Mkt', JT: 'Jn', MU: 'Mus', AP: 'Apt', PG: 'PG' };

const MapBuilding = ({ id, onClick, isPulsing, isConnected }) => {
  const n = N[id];
  const { x, y, type, label } = n;
  const isJunction = type === 'junction';

  return (
    <g style={{ cursor: isConnected ? 'pointer' : 'default' }} onClick={() => onClick(id)}>
      {/* generous invisible hit area over the building in the photograph */}
      <circle cx={x} cy={y} r={54} fill="transparent" />
      <circle
        cx={x}
        cy={y}
        r={isJunction ? 11 : 15}
        fill={isConnected ? '#2563eb' : (isJunction ? '#ffffff' : 'rgba(255,255,255,0.55)')}
        stroke={isConnected ? '#ffffff' : (isJunction ? '#8a94a1' : '#0E3556')}
        strokeWidth={isJunction ? 3 : 2.5}
        style={{ filter: isConnected ? 'drop-shadow(0 0 8px rgba(37,99,235,0.8))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
      />
      {isJunction && (
        <>
          <rect x={x - label.length * 4.2} y={y + 18} width={label.length * 8.4} height={20} rx={5} fill="#fff" opacity={0.92} />
          <text x={x} y={y + 32} textAnchor="middle" fontFamily="Space Grotesk, system-ui, sans-serif" fontSize={14} fontWeight={700} fill="#20303f">{label}</text>
        </>
      )}
      {isPulsing && (
        <circle cx={x} cy={y} r={44} fill="none" stroke="#e74c3c" strokeWidth={4}>
          <animate attributeName="r" from="44" to="30" dur="0.6s" repeatCount="2" />
        </circle>
      )}
    </g>
  );
};

export default function FindingRoutePage({ onMissionUnlock, onBeginChapter, onBack }) {
  const [cur, setCur] = useState('RS');
  const [travelMode, setTravelMode] = useState('walk'); // 'walk' | 'car'
  const [walker, setWalker] = useState({ x: N.RS.x, y: N.RS.y, face: 1 });
  const walkFrom = useRef('RS');
  const walkRaf = useRef(null);
  const [path, setPath] = useState(['RS']);
  const [logs, setLogs] = useState([{ html: 'Started at <b>Railway Station</b>', ok: true }]);
  const [win, setWin] = useState(false);
  const [hintDir, setHintDir] = useState(null);

  const [t1Done, setT1Done] = useState(false);
  const [pulseHO, setPulseHO] = useState(false);
  const [t2Ans, setT2Ans] = useState(null);
  const [t3Ans, setT3Ans] = useState(null);
  const [t4Ans, setT4Ans] = useState(null);
  const [t5Ans, setT5Ans] = useState(null);
  const [t6Ans, setT6Ans] = useState(null);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPage, setQuizPage] = useState(1);
  const [mapFull, setMapFull] = useState(false);

  const logRef = useRef(null);
  const elementsRef = useRef(null);


  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  // Walk the actual road between two places instead of cutting across the town.
  // Constant speed along the traced polyline — a steady strolling pace.
  useEffect(() => {
    const from = walkFrom.current;
    walkFrom.current = cur;
    if (from === cur) return;

    const pts = roadPoints(from, cur);
    const segs = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      segs.push({ a: pts[i - 1], b: pts[i], d, from: total });
      total += d;
    }
    if (!total) return;

    const SPEED = travelMode === 'car' ? 140 : 78; // faster pace for car
    const duration = (total / SPEED) * 1000;
    const start = performance.now();

    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      const travelled = t * total;
      let seg = segs[segs.length - 1];
      for (const s2 of segs) { if (travelled <= s2.from + s2.d) { seg = s2; break; } }
      const local = seg.d ? (travelled - seg.from) / seg.d : 1;
      const x = seg.a[0] + (seg.b[0] - seg.a[0]) * local;
      const y = seg.a[1] + (seg.b[1] - seg.a[1]) * local;
      setWalker({ x, y, face: seg.b[0] < seg.a[0] ? -1 : 1 });
      if (t < 1) walkRaf.current = requestAnimationFrame(step);
    };

    cancelAnimationFrame(walkRaf.current);
    walkRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(walkRaf.current);
  }, [cur, travelMode]);

  useEffect(() => {
    if (!mapFull) return;
    const onKey = e => { if (e.key === 'Escape') setMapFull(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mapFull]);

  useEffect(() => {
    if (t1Done && t2Ans !== null && t3Ans !== null && t4Ans !== null && t5Ans !== null && t6Ans !== null && win && onMissionUnlock) {
      onMissionUnlock();
    }
    
    // Auto-scroll to Elements of a Map box when quiz completes
    if (t1Done && t2Ans !== null && t3Ans !== null && t4Ans !== null && t5Ans !== null && t6Ans !== null && elementsRef.current) {
      setTimeout(() => {
        if (elementsRef.current) {
          elementsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600); // Small delay to let user see their last answer result
    }
  }, [t1Done, t2Ans, t3Ans, t4Ans, t5Ans, t6Ans, win, onMissionUnlock]);

  const addLog = (html, ok) => {
    setLogs(prev => [...prev, { html, ok }]);
  };

  const handleMove = (dir) => {
    if (win) return;
    const nx = ADJ[cur][dir];
    if (!nx) return;
    const nameMap = { N: 'North', E: 'East', S: 'South', W: 'West' };
    const name = nameMap[dir] || dir;
    const roadName = getRoadName(cur, nx);

    setCur(nx);
    setPath(prev => [...prev, nx]);
    addLog(`Went <b>${name}</b> via <b>${roadName}</b> (${travelMode === 'car' ? '🚗 By Car' : '🚶 On Foot'}) → ${N[nx].label}`, true);
    setHintDir(null);

    if (nx === 'BK') {
      setWin(true);
    }
  };

  const handleHint = () => {
    const best = bfs(cur, 'BK');
    if (!best || best.length < 2) return;
    const next = best[1];
    let hd = null;
    for (const d in ADJ[cur]) {
      if (ADJ[cur][d] === next) hd = d;
    }
    setHintDir(hd);
    const nameMap = { N: 'North', E: 'East', S: 'South', W: 'West' };
    const name = nameMap[hd] || hd;
    const roadName = getRoadName(cur, next);
    addLog(`Hint: head <b>${name}</b> on <b>${roadName}</b> (${best.length - 1} roads left).`, true);
  };

  const resetGame = () => {
    cancelAnimationFrame(walkRaf.current);
    walkFrom.current = 'RS';
    setCur('RS');
    setWalker({ x: N.RS.x, y: N.RS.y, face: 1 });
    setPath(['RS']);
    setLogs([{ html: 'Started at <b>Railway Station</b>', ok: true }]);
    setWin(false);
    setHintDir(null);
  };

  const handleUndo = () => {
    if (path.length > 1 && !win) {
      const newPath = [...path];
      newPath.pop();
      const prevLoc = newPath[newPath.length - 1];
      setCur(prevLoc);
      setPath(newPath);
      setHintDir(null);
      addLog(`Went back to <b>${N[prevLoc].label}</b>`, true);
    }
  };

  const tapBuilding = (k) => {
    if (k === 'HO') {
      setT1Done(true);
      setPulseHO(true);
      setTimeout(() => setPulseHO(false), 1200);
    }
    // Direct tap navigation if building is connected to current location!
    if (!win && Object.values(ADJ[cur]).includes(k)) {
      let foundDir = null;
      for (const d in ADJ[cur]) {
        if (ADJ[cur][d] === k) foundDir = d;
      }
      if (foundDir) handleMove(foundDir);
    }
  };

  const checkT3 = (name) => {
    if (t3Ans) return;
    const rs = N.RS, d = n => Math.hypot(N[n].x - rs.x, N[n].y - rs.y);
    const dists = { 'School': d('SC'), 'Nagar Panchayat': d('NP'), 'Public Garden': d('PG') };
    const far = Object.keys(dists).reduce((a, b) => dists[b] > dists[a] ? b : a);
    const ok = name === far;
    setT3Ans({ ok, picked: name, far, dists });
  };

  const optTook = bfs('RS', 'BK') ? bfs('RS', 'BK').length - 1 : 3;
  const userTook = path.length - 1;

  // Calculate live Journey Progress Percentage
  const shortestToGoalFromStart = 3;
  const currentBestPath = bfs(cur, 'BK');
  const shortestToGoalFromCur = currentBestPath ? currentBestPath.length - 1 : 0;
  const progressPercent = cur === 'BK' ? 100 : Math.min(95, Math.max(0, Math.round(((shortestToGoalFromStart - shortestToGoalFromCur) / shortestToGoalFromStart) * 100)));
  const currentRoadName = path.length > 1 ? getRoadName(path[path.length - 2], path[path.length - 1]) : 'Station Gate';


  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      <style>{`
        .dpad-btn { font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 700; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #0E3556; border-radius: 11px; padding: 13px 0; font-size: 15px; transition: all 0.15s; }
        .dpad-btn:hover:not(:disabled) { border-color: #2563eb; background: #dbeafe; color: #1e40af; }
        .dpad-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .dpad-btn.hint { border-color: #F5A623; background: #fff6e6; animation: pulseHint 1.2s ease-in-out infinite; }
        @keyframes pulseHint { 0%, 100% { box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(245, 166, 35, 0); } }
        .opts-btn { font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 600; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #20303f; border-radius: 99px; padding: 9px 14px; font-size: 15px; transition: all 0.15s; }
        .opts-btn:hover:not(:disabled) { border-color: #7c5cff; }
        .opts-btn.ok { border-color: #12a15f; background: #eafaf1; color: #12a15f; }
        .opts-btn.bad { border-color: #e0552f; background: #fdeee9; color: #e0552f; }
      `}</style>
      
      {showQuiz && (
        <div style={{ padding: '0.75rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fff', zIndex: 10 }}>
          <button 
            onClick={() => setShowQuiz(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: '#5c6b7a', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#20303f'}
            onMouseOut={(e) => e.currentTarget.style.color = '#5c6b7a'}
          >
            <ArrowLeft size={18} /> Back to Map
          </button>
        </div>
      )}
      
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* LEFT PAGE - MAP */}
      <div style={{ flex: 1.4, padding: '10px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative', background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)' }}>
        
        <div style={mapFull
          ? { background: '#ECE3D2', border: 'none', borderRadius: 0, overflow: 'hidden', position: 'fixed', inset: 0, zIndex: 100001, boxShadow: 'none' }
          : { background: '#ECE3D2', border: '2px solid #0E3556', borderRadius: '14px', overflow: 'hidden', position: 'relative', flex: 1, minHeight: 0, boxShadow: '0 6px 18px rgba(14,42,69,0.08)' }}>

          {/* Enlarge / restore the map */}
          <button
            onClick={() => setMapFull(v => !v)}
            title={mapFull ? 'Exit full screen (Esc)' : 'View the map full screen'}
            aria-label={mapFull ? 'Exit full screen' : 'View the map full screen'}
            style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 7, width: '44px', height: '44px', borderRadius: '12px', border: '1px solid #d6e0ec', background: 'rgba(255,255,255,0.92)', color: '#0E3556', display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(14,42,69,0.14)', transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = '#fff'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
          >
            {mapFull ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <img 
            src={townMapFig} 
            alt="Town Map" 
            style={{ 
              position: 'absolute', 
              top: 0,
              left: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              pointerEvents: 'none',
              zIndex: 1 
            }} 
          />

          <svg viewBox="0 0 1376 768" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 2 }}>
            <image href={townMapFig} xlinkHref={townMapFig} x="0" y="0" width="1376" height="768" preserveAspectRatio="xMidYMid meet" />

            {/* Road links — traced along the tarmac in the photograph */}
            {EDGES.map(([a, b], idx) => (
              <polyline key={idx} points={ptsAttr(roadPoints(a, b))} fill="none" stroke="#0E3556"
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 9" opacity={0.35} />
            ))}

            {/* HIGHLY VISIBLE & HIGHLIGHTED ROAD NAMES — Embedded strictly INSIDE the open road tarmac with zero overlap */}
            <g id="road-names-inline" pointerEvents="none">
              {/* Station Road */}
              <g transform="translate(380, 427)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">STATION ROAD</text>
              </g>
              {/* School Lane */}
              <g transform="translate(196, 530) rotate(-90)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">SCHOOL LANE</text>
              </g>
              {/* Market Road */}
              <g transform="translate(500, 730)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">MARKET ROAD</text>
              </g>
              {/* Panchayat Marg */}
              <g transform="translate(710, 508) rotate(-18)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">PANCHAYAT MARG</text>
              </g>
              {/* Bank Road */}
              <g transform="translate(950, 428)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">BANK ROAD</text>
              </g>
              {/* Garden Way */}
              <g transform="translate(1195, 330) rotate(90)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">GARDEN WAY</text>
              </g>
              {/* Apartment Drive */}
              <g transform="translate(960, 240)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">APARTMENT DRIVE</text>
              </g>
              {/* Museum Street */}
              <g transform="translate(1015, 655)">
                <text x="0" y="0" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="800" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" paintOrder="stroke fill" letterSpacing="0.8">MUSEUM STREET</text>
              </g>
            </g>

            {/* REALISTIC GPS NAVIGATION ROUTE LINE — Traced strictly WITHIN the center of the road tarmac */}
            {path.length > 1 && !showQuiz && (
              <g id="travelled-route-gps" pointerEvents="none">
                {/* Outer Glow Path */}
                <polyline
                  points={ptsAttr(path.slice(1).reduce((acc, n, i) => acc.concat(roadPoints(path[i], n).slice(1)), [[N[path[0]].x, N[path[0]].y]]))}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.65}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(37,99,235,0.4))' }}
                />
                {/* Inner Centerline Dash */}
                <polyline
                  points={ptsAttr(path.slice(1).reduce((acc, n, i) => acc.concat(roadPoints(path[i], n).slice(1)), [[N[path[0]].x, N[path[0]].y]]))}
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 6"
                  opacity={0.9}
                />
              </g>
            )}

            {/* Buildings */}
            {Object.keys(N).map(k => (
              <MapBuilding key={k} id={k} onClick={tapBuilding} isPulsing={k === 'HO' && pulseHO} isConnected={Object.values(ADJ[cur]).includes(k)} />
            ))}

            {/* INTERACTIVE PLAYER TOKEN — SWITCHABLE BETWEEN WALKING PERSON AND REALISTIC CAR */}
            {travelMode === 'car' ? (
              <g id="player-car" style={{ transform: `translate(${walker.x}px, ${walker.y}px)` }}>
                <ellipse cx="0" cy="5" rx="20" ry="10" fill="rgba(9,26,44,0.35)" />
                <g transform={`scale(${walker.face * 1.5}, 1.5)`}>
                  {/* Realistic Car Body */}
                  <rect x="-15" y="-9" width="30" height="18" rx="5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
                  {/* Car Roof & Glass */}
                  <rect x="-7" y="-11" width="15" height="22" rx="3.5" fill="#0f172a" />
                  <rect x="-5" y="-9" width="11" height="18" rx="2.5" fill="#38bdf8" opacity="0.85" />
                  {/* 4 Wheels */}
                  <rect x="-13" y="-11" width="6" height="3.5" rx="1" fill="#020617" />
                  <rect x="7" y="-11" width="6" height="3.5" rx="1" fill="#020617" />
                  <rect x="-13" y="7.5" width="6" height="3.5" rx="1" fill="#020617" />
                  <rect x="7" y="7.5" width="6" height="3.5" rx="1" fill="#020617" />
                  {/* Headlights */}
                  <circle cx="14" cy="-4" r="2" fill="#fef08a" />
                  <circle cx="14" cy="4" r="2" fill="#fef08a" />
                  {/* Taillights */}
                  <rect x="-15" y="-6" width="2" height="3.5" rx="0.5" fill="#ef4444" />
                  <rect x="-15" y="2.5" width="2" height="3.5" rx="0.5" fill="#ef4444" />
                </g>
              </g>
            ) : (
              <g id="player-walk" style={{ transform: `translate(${walker.x}px, ${walker.y}px)` }}>
                <ellipse cx="0" cy="8" rx="17" ry="6" fill="rgba(9,26,44,0.30)" />
                <circle cx="0" cy="-16" r="30" fill="#fff" opacity="0.28" />
                <g transform={`translate(0,-8) scale(${1.9 * walker.face}, 1.9)`}>
                  {/* legs with slow stroll animation */}
                  <g stroke="#22364f" strokeWidth="4" strokeLinecap="round">
                    <line x1="0" y1="1" x2="-3.5" y2="11">
                      <animate attributeName="x2" values="-5.5;4.5;-5.5" dur="1.4s" repeatCount="indefinite" />
                      <animate attributeName="y2" values="11;10;11" dur="1.4s" repeatCount="indefinite" />
                    </line>
                    <line x1="0" y1="1" x2="4.5" y2="11">
                      <animate attributeName="x2" values="4.5;-5.5;4.5" dur="1.4s" repeatCount="indefinite" />
                      <animate attributeName="y2" values="10;11;10" dur="1.4s" repeatCount="indefinite" />
                    </line>
                  </g>
                  {/* shoes */}
                  <g fill="#14243a">
                    <ellipse cx="-4" cy="12" rx="3" ry="1.5">
                      <animate attributeName="cx" values="-6;5;-6" dur="1.4s" repeatCount="indefinite" />
                    </ellipse>
                    <ellipse cx="5" cy="12" rx="3" ry="1.5">
                      <animate attributeName="cx" values="5;-6;5" dur="1.4s" repeatCount="indefinite" />
                    </ellipse>
                  </g>
                  {/* torso */}
                  <path d="M-5.4 -9 h10.8 a2.4 2.4 0 0 1 2.4 2.4 v8.4 a2.4 2.4 0 0 1 -2.4 2.4 h-10.8 a2.4 2.4 0 0 1 -2.4 -2.4 v-8.4 a2.4 2.4 0 0 1 2.4 -2.4 z"
                        fill="#e04b3c" stroke="#fff" strokeWidth="1.1" />
                  {/* arms */}
                  <g stroke="#e04b3c" strokeWidth="3.4" strokeLinecap="round">
                    <line x1="-4.5" y1="-7" x2="-7" y2="0">
                      <animate attributeName="x2" values="-8;-3;-8" dur="1.4s" repeatCount="indefinite" />
                    </line>
                    <line x1="4.5" y1="-7" x2="7" y2="0">
                      <animate attributeName="x2" values="7;3;7" dur="1.4s" repeatCount="indefinite" />
                    </line>
                  </g>
                  {/* head, hair, face */}
                  <circle cx="0" cy="-14.5" r="5.2" fill="#f2c9a0" stroke="#fff" strokeWidth="1.1" />
                  <path d="M-5.2 -15.6 a5.2 5.2 0 0 1 10.4 0 a6 6 0 0 0 -10.4 0 z" fill="#3b2a20" />
                  <circle cx="2.1" cy="-14.4" r="0.75" fill="#2b2018" />
                  {/* slow bobbing animation */}
                  <animateTransform attributeName="transform" type="translate" additive="sum"
                                    values="0 0; 0 -1.1; 0 0" dur="1.4s" repeatCount="indefinite" />
                </g>
              </g>
            )}
          </svg>
          
          {/* Map HUD — Compact, Frosted Glass & Translucent */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 5,
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            borderRadius: '10px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(14,42,69,0.10)',
            pointerEvents: 'none'
          }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '999px', background: '#dbeafe', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Map size={15} color="#1d4ed8" />
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <b style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Town Map</b>
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Top-down view · Fig. 1.1</span>
            </div>
          </div>
          
          {/* Win Overlay */}
          {(win && !showQuiz) && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(9,26,44,0.55)', backdropFilter: 'blur(3px)', zIndex: 6, animation: 'fadeIn 0.4s ease' }}>
              <div style={{ background: '#fff', borderRadius: '18px', padding: '30px 34px', textAlign: 'center', maxWidth: '380px', boxShadow: '0 30px 70px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize: '44px' }}>🎉</div>
                <h3 style={{ fontFamily: '"Fraunces", serif', color: '#12a15f', fontSize: '26px', margin: '6px 0 8px' }}>You reached the Bank!</h3>
                <p style={{ color: '#5c6b7a', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>
                  {userTook === optTook ? (
                    <span>Perfect route in <b>{userTook} roads</b> — that's the shortest possible! Railway Station → Hospital → Nagar Panchayat → Bank.</span>
                  ) : (
                    <span>You made it in <b>{userTook} roads</b>. The shortest route is <b>{optTook}</b> (for example: Hospital → Nagar Panchayat → Bank).</span>
                  )}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={resetGame} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: '1px solid #d6e0ec', cursor: 'pointer', background: '#fff', color: '#5c6b7a', padding: '12px 20px', borderRadius: '999px', fontSize: '14px' }}>Play again</button>
                  <button onClick={() => setShowQuiz(true)} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer', background: '#F5A623', color: '#fff', padding: '12px 24px', borderRadius: '999px', fontSize: '14px', boxShadow: '0 4px 15px rgba(245, 166, 35, 0.4)' }}>Proceed to Quiz →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PAGE - CONTROLS & D-PAD GAME */}
      <div style={{ flex: 1, padding: 'clamp(18px, 2.2vw, 32px)', position: 'relative', backgroundColor: '#ffffff', color: '#20303f', display: 'flex', flexDirection: 'column', borderRadius: '0 4px 4px 0', overflow: 'hidden' }}>
        
        {!showQuiz && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0, justifyContent: 'space-between' }}>
            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7c5cff', fontWeight: 600 }}>
                ◎ Let's play a game
              </div>
              <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, color: '#0E3556', fontSize: 'clamp(22px, 2.2vw, 26px)', margin: '4px 0 2px' }}>
                Reach the Bank
              </div>
              <div style={{ color: '#5c6b7a', fontSize: '14px', lineHeight: 1.4 }}>
                You just got off a train at the <b>Railway Station</b>. Travel the roads to reach the <b>Bank</b>. Pick a road at each junction.
              </div>
            </div>

            {/* Travel Mode Toggle (Walk vs Car) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '12px', padding: '8px 12px', flexShrink: 0 }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0E3556', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Travel Mode:</span>
              <button
                type="button"
                onClick={() => setTravelMode('walk')}
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  border: travelMode === 'walk' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: travelMode === 'walk' ? '#dbeafe' : '#ffffff',
                  color: travelMode === 'walk' ? '#1e40af' : '#475569',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                  boxShadow: travelMode === 'walk' ? '0 2px 6px rgba(37,99,235,0.2)' : 'none'
                }}
              >
                🚶 Walk
              </button>
              <button
                type="button"
                onClick={() => setTravelMode('car')}
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  border: travelMode === 'car' ? '2px solid #d97706' : '1px solid #cbd5e1',
                  background: travelMode === 'car' ? '#fef3c7' : '#ffffff',
                  color: travelMode === 'car' ? '#92400e' : '#475569',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                  boxShadow: travelMode === 'car' ? '0 2px 6px rgba(217,119,6,0.2)' : 'none'
                }}
              >
                🚗 Car
              </button>
            </div>

            {/* Choose a Direction 4-Way D-Pad Game Box */}
            <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '14px 16px', flexShrink: 0 }}>
              <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 700, marginBottom: '10px', textAlign: 'center' }}>Choose a direction</div>
              
              {/* 4-Directional Compass D-Pad Grid (North, South, East, West) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, auto)', gap: '8px', maxWidth: '230px', margin: '0 auto' }}>
                {/* Top: North */}
                <button className={`dpad-btn ${hintDir === 'N' ? 'hint' : ''}`} style={{ gridColumn: 2 }} disabled={!ADJ[cur]['N']} onClick={() => handleMove('N')}>▲ N</button>
                
                {/* Left: West */}
                <button className={`dpad-btn ${hintDir === 'W' ? 'hint' : ''}`} style={{ gridColumn: 1, gridRow: 2 }} disabled={!ADJ[cur]['W']} onClick={() => handleMove('W')}>◀ W</button>
                
                {/* Center Badge */}
                <div style={{ gridColumn: 2, gridRow: 2, display: 'grid', placeItems: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #2563eb', background: '#dbeafe', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 800, color: '#1e40af', fontFamily: '"IBM Plex Mono", monospace' }}>
                    {short[cur]}
                  </div>
                </div>
                
                {/* Right: East */}
                <button className={`dpad-btn ${hintDir === 'E' ? 'hint' : ''}`} style={{ gridColumn: 3, gridRow: 2 }} disabled={!ADJ[cur]['E']} onClick={() => handleMove('E')}>E ▶</button>
                
                {/* Bottom: South */}
                <button className={`dpad-btn ${hintDir === 'S' ? 'hint' : ''}`} style={{ gridColumn: 2, gridRow: 3 }} disabled={!ADJ[cur]['S']} onClick={() => handleMove('S')}>▼ S</button>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
                <button onClick={handleHint} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '8px', padding: '8px 14px', fontSize: '14px' }}>💡 Hint</button>
                <button onClick={handleUndo} disabled={path.length <= 1 || win} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '8px', padding: '8px 14px', fontSize: '14px', opacity: path.length <= 1 || win ? 0.5 : 1 }}>↩ Back</button>
                <button onClick={resetGame} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '8px', padding: '8px 14px', fontSize: '14px' }}>↺ Restart</button>
              </div>
            </div>

            {/* Progress Breadcrumbs with Road Names */}
            <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '12px', padding: '10px 14px', flexShrink: 0 }}>
              <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 700, marginBottom: '6px' }}>Road-by-Road Journey Path</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
                {path.map((p, i) => {
                  const roadToNext = i < path.length - 1 ? getRoadName(p, path[i + 1]) : null;
                  return (
                    <React.Fragment key={i}>
                      <span style={{ fontWeight: 700, color: i === path.length - 1 ? '#2563eb' : '#0E3556', background: '#fff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px' }}>
                        {N[p].label}
                      </span>
                      {roadToNext && (
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#854d0e', background: '#fef08a', border: '1px solid #eab308', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          🛣️ {roadToNext} →
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {showQuiz && (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 20px', boxSizing: 'border-box', overflow: 'hidden' }}>
            
            {/* Header / Progress bar for Quiz */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexShrink: 0 }}>
              <div style={{ color: '#b45309', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                ◎ Let's explore — Fig. 1.1 (Page {quizPage} of 2)
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: quizPage === 1 ? '#F5A623' : '#cbd5e1' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: quizPage === 2 ? '#F5A623' : '#cbd5e1' }} />
              </div>
            </div>

            {/* QUIZ PAGE 1: Questions 1, 2, 3 */}
            {quizPage === 1 && (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
                {/* Question 1 */}
                <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '12px', padding: '12px 16px' }}>
                  <p style={{ fontSize: '14px', color: '#20303f', fontWeight: 600, margin: '0 0 8px 0' }}>1 · Tap the <b>Hospital</b> on the map to mark it.</p>
                  {t1Done ? (
                    <div style={{ fontSize: '14px', color: '#12a15f', fontWeight: 600 }}>✓ Marked! The hospital is near the town centre.</div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Click on the Hospital building on the map image on the left.</div>
                  )}
                </div>

                {/* Question 2 */}
                <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '12px', padding: '12px 16px' }}>
                  <p style={{ fontSize: '14px', color: '#20303f', fontWeight: 600, margin: '0 0 8px 0' }}>2 · Which road connects the <b>Railway Station</b> to the <b>Hospital</b>?</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['STATION ROAD', 'SCHOOL LANE', 'BANK ROAD'].map((opt, idx) => {
                      let cls = '';
                      if (t2Ans !== null) {
                        if (idx === 0) cls = 'ok';
                        else if (t2Ans === idx) cls = 'bad';
                      }
                      return (
                        <button key={opt} className={`opts-btn ${cls}`} disabled={t2Ans !== null} onClick={() => setT2Ans(idx)} style={{ fontSize: '14px', padding: '8px 14px' }}>{opt}</button>
                      );
                    })}
                  </div>
                  {t2Ans !== null && (
                    <div style={{ fontSize: '14px', marginTop: '6px', color: t2Ans === 0 ? '#12a15f' : '#e0552f', fontWeight: 600 }}>
                      {t2Ans === 0 ? '✓ Correct! STATION ROAD connects the Railway Station to the Hospital.' : 'STATION ROAD is the correct answer.'}
                    </div>
                  )}
                </div>

                {/* Question 3 */}
                <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '12px', padding: '12px 16px' }}>
                  <p style={{ fontSize: '14px', color: '#20303f', fontWeight: 600, margin: '0 0 8px 0' }}>3 · Which is farthest from the Railway Station?</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['School', 'Nagar Panchayat', 'Public Garden'].map(opt => {
                      let cls = '';
                      if (t3Ans) {
                        if (opt === t3Ans.far) cls = 'ok';
                        else if (opt === t3Ans.picked) cls = 'bad';
                      }
                      return (
                        <button key={opt} className={`opts-btn ${cls}`} disabled={t3Ans !== null} onClick={() => checkT3(opt)} style={{ fontSize: '14px', padding: '8px 14px' }}>{opt}</button>
                      );
                    })}
                  </div>
                  {t3Ans && (
                    <div style={{ fontSize: '14px', marginTop: '6px', color: '#12a15f', lineHeight: 1.4, fontWeight: 600 }}>
                      ✓ <b>{t3Ans.far}</b> is farthest from the Railway Station.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QUIZ PAGE 2: Questions 4, 5, 6 & Elements of a Map */}
            {quizPage === 2 && (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'space-between' }}>
                {/* Question 4 */}
                <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '10px', padding: '10px 14px' }}>
                  <p style={{ fontSize: '14px', color: '#20303f', fontWeight: 600, margin: '0 0 6px 0' }}>4 · Which road leads directly to the <b>Bank</b> from the <b>Nagar Panchayat</b>?</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['BANK ROAD', 'MARKET ROAD', 'APARTMENT DRIVE'].map(opt => {
                      let cls = '';
                      if (t4Ans) {
                        if (opt === 'BANK ROAD') cls = 'ok';
                        else if (opt === t4Ans) cls = 'bad';
                      }
                      return (
                        <button key={opt} className={`opts-btn ${cls}`} disabled={t4Ans !== null} onClick={() => setT4Ans(opt)} style={{ fontSize: '14px', padding: '6px 12px' }}>{opt}</button>
                      );
                    })}
                  </div>
                  {t4Ans && (
                    <div style={{ fontSize: '14px', marginTop: '4px', color: t4Ans === 'BANK ROAD' ? '#12a15f' : '#e0552f', fontWeight: 600 }}>
                      {t4Ans === 'BANK ROAD' ? '✓ Correct! BANK ROAD connects the Nagar Panchayat directly to the Bank.' : 'BANK ROAD is the correct answer.'}
                    </div>
                  )}
                </div>

                {/* Question 5 */}
                <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '10px', padding: '10px 14px' }}>
                  <p style={{ fontSize: '14px', color: '#20303f', fontWeight: 600, margin: '0 0 6px 0' }}>5 · Where on the map is the Museum located?</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['South-East corner', 'Next to the Railway Station', 'Above the Lake'].map(opt => {
                      let cls = '';
                      if (t5Ans) {
                        if (opt === 'South-East corner') cls = 'ok';
                        else if (opt === t5Ans) cls = 'bad';
                      }
                      return (
                        <button key={opt} className={`opts-btn ${cls}`} disabled={t5Ans !== null} onClick={() => setT5Ans(opt)} style={{ fontSize: '14px', padding: '6px 12px' }}>{opt}</button>
                      );
                    })}
                  </div>
                  {t5Ans && (
                    <div style={{ fontSize: '14px', marginTop: '4px', color: t5Ans === 'South-East corner' ? '#12a15f' : '#e0552f', fontWeight: 600 }}>
                      {t5Ans === 'South-East corner' ? '✓ Correct! The Museum is in the South-East corner.' : 'South-East corner is correct.'}
                    </div>
                  )}
                </div>

                {/* Question 6 */}
                <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '10px', padding: '10px 14px' }}>
                  <p style={{ fontSize: '14px', color: '#20303f', fontWeight: 600, margin: '0 0 6px 0' }}>6 · Which landmark is located immediately to the East of the Lake?</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['Apartments', 'Public Garden', 'School'].map(opt => {
                      let cls = '';
                      if (t6Ans) {
                        if (opt === 'Apartments') cls = 'ok';
                        else if (opt === t6Ans) cls = 'bad';
                      }
                      return (
                        <button key={opt} className={`opts-btn ${cls}`} disabled={t6Ans !== null} onClick={() => setT6Ans(opt)} style={{ fontSize: '14px', padding: '6px 12px' }}>{opt}</button>
                      );
                    })}
                  </div>
                  {t6Ans && (
                    <div style={{ fontSize: '14px', marginTop: '4px', color: t6Ans === 'Apartments' ? '#12a15f' : '#e0552f', fontWeight: 600 }}>
                      {t6Ans === 'Apartments' ? '✓ Correct! Apartments is located immediately to the East of the Lake.' : 'Apartments is correct.'}
                    </div>
                  )}
                </div>

                {/* Elements of a Map Context Box */}
                <div style={{ background: '#fff9f0', border: '1px solid #fce7c8', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    <Compass size={14} /> Elements of a Map
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '14px' }}>
                    <div><b>Symbols:</b> Show real-world features cleanly.</div>
                    <div><b>Distance &amp; Scale:</b> Keeps distances accurate.</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
    <ChapterBackFooter
      onBack={
        showQuiz
          ? (quizPage === 2 ? () => setQuizPage(1) : () => setShowQuiz(false))
          : onBack
      }
      nextLabel={
        showQuiz
          ? (quizPage === 1 ? 'Next' : 'Next Activity')
          : 'Next'
      }
      onNext={
        showQuiz
          ? (quizPage === 1 ? () => setQuizPage(2) : onBeginChapter)
          : () => { setQuizPage(1); setShowQuiz(true); }
      }
      nextDisabled={
        showQuiz
          ? (quizPage === 1
              ? !(t1Done && t2Ans !== null && t3Ans !== null)
              : !(t4Ans !== null && t5Ans !== null && t6Ans !== null))
          : false
      }
      nextVariant={showQuiz && quizPage === 2 ? 'green' : 'navy'}
      centerContent={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5c6b7a', fontWeight: 600, fontSize: '14px' }}>
          <MapPin size={18} strokeWidth={2} />
          {showQuiz ? `Interactive Quiz · Page ${quizPage} of 2` : 'Interactive Map Activity'}
        </div>
      }
    />
    </div>
  );
}
