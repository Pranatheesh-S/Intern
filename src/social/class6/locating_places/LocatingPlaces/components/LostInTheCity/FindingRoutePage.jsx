import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Map, MapPin, Compass, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import ExploreIndiaActivity from './ExploreIndiaActivity';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';
import townMapFig from './assets/town_map_fig1.jpg';

const N = {
  RS: {x: 335, y: 320, label: 'Railway Station', type: 'station', start: true},
  HO: {x: 585, y: 440, label: 'Hospital', type: 'hospital'},
  NP: {x: 865, y: 360, label: 'Nagar Panchayat', type: 'civic'},
  BK: {x: 1042, y: 372, label: 'Bank', type: 'bank', goal: true},
  SC: {x: 352, y: 565, label: 'School', type: 'school'},
  MK: {x: 690, y: 645, label: 'Market', type: 'market'},
  JT: {x: 940, y: 470, label: 'Junction', type: 'junction'},
  MU: {x: 1100, y: 570, label: 'Museum', type: 'museum'},
  AP: {x: 760, y: 175, label: 'Apartments', type: 'apartment'},
  PG: {x: 1140, y: 245, label: 'Public Garden', type: 'garden'},
};

// Each road is traced along the actual tarmac in town_map_fig1.jpg,
// from one place to the next. Points are in the image's own 1376 x 768 space.
const PATHS = {
  'RS|HO': [[335,320],[330,425],[400,427],[470,428],[522,428],[560,434],[585,440]],
  'RS|SC': [[335,320],[330,425],[255,424],[199,434],[196,490],[196,570],[205,640],[233,686],[282,716],[313,708],[331,668],[344,615],[352,565]],
  'SC|MK': [[352,565],[344,615],[331,668],[313,708],[380,727],[480,730],[580,730],[650,722],[688,690],[690,645]],
  'MK|JT': [[690,645],[688,690],[760,726],[840,728],[900,716],[932,678],[940,600],[940,520],[940,470]],
  'HO|NP': [[585,440],[585,505],[578,538],[615,545],[680,520],[745,495],[800,470],[850,455],[870,430],[866,400],[865,360]],
  'NP|BK': [[865,360],[865,415],[900,428],[960,428],[1010,428],[1040,428],[1042,372]],
  'NP|JT': [[865,360],[865,415],[895,432],[925,450],[940,470]],
  'BK|PG': [[1042,372],[1040,428],[1090,428],[1140,420],[1185,395],[1210,340],[1205,280],[1180,248],[1140,245]],
  'PG|AP': [[1140,245],[1080,240],[1010,238],[960,244],[920,228],[880,232],[820,240],[770,228],[760,175]],
  'AP|HO': [[760,175],[762,228],[790,262],[762,298],[710,330],[665,368],[630,400],[600,420],[585,440]],
  'JT|MU': [[940,470],[940,560],[942,640],[965,660],[1020,656],[1080,640],[1100,570]],
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

function compass([x0, y0], [x1, y1]) {
  const dx = x1 - x0, dy = y1 - y0;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'E' : 'W') : (dy > 0 ? 'S' : 'N');
}

const NEIGHBOURS = {};
Object.keys(N).forEach(k => NEIGHBOURS[k] = []);
EDGES.forEach(([a, b]) => { NEIGHBOURS[a].push(b); NEIGHBOURS[b].push(a); });

// Roads out of a place often share the same driveway for the first stretch, so
// read the heading far enough along that every road out of this place is
// heading somewhere different.
const ADJ = {};
Object.keys(N).forEach(place => {
  const outs = NEIGHBOURS[place];
  let settled = null;
  for (const reach of [80, 120, 160, 200, 250, 300, 400, 600]) {
    const dirs = {};
    let clash = false;
    for (const other of outs) {
      const pts = roadPoints(place, other);
      const dir = compass(pts[0], pointAlong(pts, reach));
      if (dirs[dir]) { clash = true; break; }
      dirs[dir] = other;
    }
    if (!clash) { settled = dirs; break; }
  }
  // last resort: straight line between the two places
  if (!settled) {
    settled = {};
    outs.forEach(other => { settled[compass([N[place].x, N[place].y], [N[other].x, N[other].y])] = other; });
  }
  ADJ[place] = settled;
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

const ROOF = {
  station: '#c0392b', hospital: '#e74c3c', civic: '#5b7fa6', bank: '#34618e', school: '#e0a020',
  market: '#7c5cff', museum: '#4a6072', apartment: '#c98a4b', garden: '#2e8b57', junction: '#8a94a1'
};
const short = { RS: 'RS', HO: 'Hosp', NP: 'NP', BK: 'Bank', SC: 'Sch', MK: 'Mkt', JT: 'Jn', MU: 'Mus', AP: 'Apt', PG: 'PG' };

const MapBuilding = ({ id, onClick, isPulsing }) => {
  const n = N[id];
  const { x, y, type, label } = n;
  const isJunction = type === 'junction';

  return (
    <g style={{ cursor: 'pointer' }} onClick={() => onClick(id)}>
      {/* generous invisible hit area over the building in the photograph */}
      <circle cx={x} cy={y} r={54} fill="transparent" />
      <circle
        cx={x}
        cy={y}
        r={isJunction ? 11 : 15}
        fill={isJunction ? '#ffffff' : 'rgba(255,255,255,0.55)'}
        stroke={isJunction ? '#8a94a1' : '#0E3556'}
        strokeWidth={isJunction ? 3 : 2.5}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
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
  const [path, setPath] = useState(['RS']);
  const [logs, setLogs] = useState([{ html: 'Started at <b>Railway Station</b>', ok: true }]);
  const [win, setWin] = useState(false);
  const [hintDir, setHintDir] = useState(null);

  const [t1Done, setT1Done] = useState(false);
  const [pulseHO, setPulseHO] = useState(false);
  const [t2Ans, setT2Ans] = useState(null);
  const [t3Ans, setT3Ans] = useState(null);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [mapFull, setMapFull] = useState(false);

  const logRef = useRef(null);
  const elementsRef = useRef(null);


  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (!mapFull) return;
    const onKey = e => { if (e.key === 'Escape') setMapFull(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mapFull]);

  useEffect(() => {
    if (t1Done && t2Ans !== null && t3Ans !== null && win && onMissionUnlock) {
      onMissionUnlock();
    }
    
    // Auto-scroll to Elements of a Map box when quiz completes
    if (t1Done && t2Ans !== null && t3Ans !== null && elementsRef.current) {
      setTimeout(() => {
        if (elementsRef.current) {
          elementsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600); // Small delay to let user see their last answer result
    }
  }, [t1Done, t2Ans, t3Ans, win, onMissionUnlock]);

  const addLog = (html, ok) => {
    setLogs(prev => [...prev, { html, ok }]);
  };

  const handleMove = (dir) => {
    if (win) return;
    const nx = ADJ[cur][dir];
    if (!nx) return;
    const name = { N: 'North', E: 'East', S: 'South', W: 'West' }[dir];

    setCur(nx);
    setPath(prev => [...prev, nx]);
    addLog(`Went <b>${name}</b> → ${N[nx].label}`, true);
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
    const name = { N: 'North', E: 'East', S: 'South', W: 'West' }[hd];
    addLog(`Hint: the shortest way is <b>${name}</b> (${best.length - 1} roads left).`, true);
  };

  const resetGame = () => {
    setCur('RS');
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
  };

  const checkT3 = (name) => {
    if (t3Ans) return;
    const rs = N.RS, d = n => Math.hypot(N[n].x - rs.x, N[n].y - rs.y);
    const dists = { 'School': d('SC'), 'Nagar Panchayat': d('NP'), 'Public Garden': d('PG') };
    const far = Object.keys(dists).reduce((a, b) => dists[b] > dists[a] ? b : a);
    const ok = name === far;
    setT3Ans({ ok, picked: name, far, dists });
  };

  const optTook = bfs('RS', 'BK').length - 1;
  const userTook = path.length - 1;


  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      <style>{`
        .dpad-btn { font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 700; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #0E3556; border-radius: 11px; padding: 12px 0; font-size: clamp(14px, 0.6vw + 0.82vh, 19px); transition: all 0.15s; }
        .dpad-btn:hover:not(:disabled) { border-color: #7c5cff; background: #f4f1ff; }
        .dpad-btn:disabled { opacity: 0.28; cursor: not-allowed; }
        .dpad-btn.hint { border-color: #F5A623; background: #fff6e6; animation: pulseHint 1.2s ease-in-out infinite; }
        @keyframes pulseHint { 0%, 100% { box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(245, 166, 35, 0); } }
        .opts-btn { font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 600; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #20303f; border-radius: 9px; padding: 7px 12px; font-size: clamp(14px, 0.6vw + 0.82vh, 19px); transition: all 0.15s; }
        .opts-btn:hover:not(:disabled) { border-color: #7c5cff; }
        .opts-btn.ok { border-color: #12a15f; background: #eafaf1; color: #12a15f; }
        .opts-btn.bad { border-color: #e0552f; background: #fdeee9; color: #e0552f; }
      `}</style>
      
      {showQuiz && (
        <div style={{ padding: '0.75rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fff', zIndex: 10 }}>
          <button 
            onClick={() => setShowQuiz(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: '#5c6b7a', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
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

          <svg viewBox="0 0 1376 768" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
            <image href={townMapFig} x="0" y="0" width="1376" height="768" preserveAspectRatio="xMidYMid meet" />

            {/* Road links — traced along the tarmac in the photograph */}
            {EDGES.map(([a, b], idx) => (
              <polyline key={idx} points={ptsAttr(roadPoints(a, b))} fill="none" stroke="#0E3556"
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 9" opacity={0.3} />
            ))}
            
            {/* Travelled Route */}
            {path.length > 1 && !showQuiz && (
              <polyline 
                points={ptsAttr(path.slice(1).reduce((acc, n, i) => acc.concat(roadPoints(path[i], n).slice(1)), [[N[path[0]].x, N[path[0]].y]]))}
                fill="none"
                stroke="#e74c3c"
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0 22"
              />
            )}

            {/* Buildings */}
            {Object.keys(N).map(k => (
              <MapBuilding key={k} id={k} onClick={tapBuilding} isPulsing={k === 'HO' && pulseHO} />
            ))}


            {/* Player Token */}
            <g id="player" style={{ transform: `translate(${N[cur].x}px, ${N[cur].y - 20}px)`, transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
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
          
          {/* Map HUD */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(255,255,255,0.92)', borderRadius: '12px', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 16px rgba(14,42,69,0.14)' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#e7efff', display: 'grid', placeItems: 'center' }}>
              <Map size={20} color="#2f6df0" />
            </div>
            <div>
              <b style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', color: '#0E3556', display: 'block', lineHeight: 1.1 }}>Town Map</b>
              <span style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', color: '#5c6b7a' }}>Top-down view · Fig. 1.1</span>
            </div>
          </div>
          
          {/* Win Overlay */}
          {(win && !showQuiz) && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(9,26,44,0.55)', backdropFilter: 'blur(3px)', zIndex: 6, animation: 'fadeIn 0.4s ease' }}>
              <div style={{ background: '#fff', borderRadius: '18px', padding: '30px 34px', textAlign: 'center', maxWidth: '380px', boxShadow: '0 30px 70px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize: '44px' }}>🎉</div>
                <h3 style={{ fontFamily: '"Fraunces", serif', color: '#12a15f', fontSize: '26px', margin: '6px 0 8px' }}>You reached the Bank!</h3>
                <p style={{ color: '#5c6b7a', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', lineHeight: 1.5, marginBottom: '24px' }}>
                  {userTook === optTook ? (
                    <span>Perfect route in <b>{userTook} roads</b> — that's the shortest possible! Railway Station → Hospital → Nagar Panchayat → Bank.</span>
                  ) : (
                    <span>You made it in <b>{userTook} roads</b>. The shortest route is <b>{optTook}</b> (for example: Hospital → Nagar Panchayat → Bank).</span>
                  )}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={resetGame} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: '1px solid #d6e0ec', cursor: 'pointer', background: '#fff', color: '#5c6b7a', padding: '12px 20px', borderRadius: '999px', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)' }}>Play again</button>
                  <button onClick={() => setShowQuiz(true)} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer', background: '#F5A623', color: '#fff', padding: '12px 24px', borderRadius: '999px', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', boxShadow: '0 4px 15px rgba(245, 166, 35, 0.4)' }}>Proceed to Quiz →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PAGE - CONTROLS */}
      <div style={{ flex: 1, padding: 'clamp(20px, 2.6vw, 42px) clamp(20px, 2.6vw, 42px) 16px clamp(20px, 2.6vw, 42px)', position: 'relative', backgroundColor: '#ffffff', color: '#20303f', display: 'flex', flexDirection: 'column', borderRadius: '0 4px 4px 0' }}>
        
        {!showQuiz && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, 0.5vw + 0.75vh, 16px)', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7c5cff', fontWeight: 600 }}>
              ◎ Let's play a game
            </div>
            <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 600, color: '#0E3556', fontSize: 'clamp(20px, 2.2vw, 28px)', margin: '6px 0 4px' }}>
              Reach the Bank
            </div>
            <div style={{ color: '#5c6b7a', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', lineHeight: 1.5 }}>
              You just got off a train at the <b>Railway Station</b>. Travel the roads to reach the <b>Bank</b>. There is more than one correct path — pick a road at each junction.
            </div>

            <ScrollableWithNav containerStyle={{ marginTop: '14px' }} scrollStyle={{ paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Textbook passage */}
              <div style={{ background: '#fbf5e6', borderLeft: '4px solid #F5A623', borderRadius: '12px', padding: '14px 16px' }}>
                <p style={{ margin: 0, color: '#7a5a2a', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', lineHeight: 1.6 }}>
                  Examine the map of this small city (<b>Fig. 1.1</b>). Imagine that you just got off a train at the
                  railway station, and you want to visit the bank marked on the map. <b>Which way would you go?</b>
                  Are there other possible ways? Can you locate the <b>public garden</b>, the <b>school</b> and the
                  <b> museum</b>? If you want to proceed from the bank to the market, which way will you go?
                  This is where a map comes in handy.
                </p>
              </div>

              {/* Controls */}
              <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, 0.5vw + 0.75vh, 16px)', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 600, marginBottom: '10px', textAlign: 'center' }}>Choose a direction</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, auto)', gap: '7px', maxWidth: '220px', margin: '0 auto' }}>
                  <button className={`dpad-btn ${hintDir === 'N' ? 'hint' : ''}`} style={{ gridColumn: 2 }} disabled={!ADJ[cur]['N']} onClick={() => handleMove('N')}>▲ N</button>
                  <button className={`dpad-btn ${hintDir === 'W' ? 'hint' : ''}`} style={{ gridColumn: 1, gridRow: 2 }} disabled={!ADJ[cur]['W']} onClick={() => handleMove('W')}>◀ W</button>
                  
                  <div style={{ gridColumn: 2, gridRow: 2, display: 'grid', placeItems: 'center' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px dashed #c3cfdd', display: 'grid', placeItems: 'center', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', color: '#5c6b7a', fontFamily: '"IBM Plex Mono", monospace' }}>
                      {short[cur]}
                    </div>
                  </div>
                  
                  <button className={`dpad-btn ${hintDir === 'E' ? 'hint' : ''}`} style={{ gridColumn: 3, gridRow: 2 }} disabled={!ADJ[cur]['E']} onClick={() => handleMove('E')}>E ▶</button>
                  <button className={`dpad-btn ${hintDir === 'S' ? 'hint' : ''}`} style={{ gridColumn: 2, gridRow: 3 }} disabled={!ADJ[cur]['S']} onClick={() => handleMove('S')}>▼ S</button>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
                  <button onClick={handleHint} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '10px', padding: '8px 14px', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)' }}>💡 Hint</button>
                  <button onClick={handleUndo} disabled={path.length <= 1 || win} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '10px', padding: '8px 14px', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', opacity: path.length <= 1 || win ? 0.5 : 1 }}>↩ Back</button>
                  <button onClick={resetGame} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '10px', padding: '8px 14px', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)' }}>↺ Restart</button>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, 0.5vw + 0.75vh, 16px)', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 600, marginBottom: '10px' }}>Progress</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)' }}>
                  {path.map((p, i) => (
                    <React.Fragment key={i}>
                      <span style={{ fontWeight: 700, color: i === path.length - 1 ? '#7c5cff' : '#12a15f' }}>{N[p].label}</span>
                      <span style={{ color: '#c3cfdd' }}>→</span>
                    </React.Fragment>
                  ))}
                  <span style={{ color: '#0E3556', fontWeight: 700, border: '1px dashed #c3cfdd', padding: '2px 8px', borderRadius: '6px' }}>🏦 Bank</span>
                </div>
              </div>

              {/* Log */}
              <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, 0.5vw + 0.75vh, 16px)', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 600, marginBottom: '10px' }}>Journey log</div>
                <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', overflow: 'hidden' }}>
                  {logs.slice(-4).map((log, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#20303f' }}>
                      <span style={{ color: log.ok ? '#12a15f' : '#e0552f', flex: '0 0 auto' }}>{log.ok ? '✓' : '✗'}</span>
                      <span dangerouslySetInnerHTML={{ __html: log.html }}></span>
                    </div>
                  ))}
                </div>
              </div>
              
            </ScrollableWithNav>
          </>
        )}

        {showQuiz && (
          <ScrollableWithNav scrollStyle={{ display: 'flex', flexDirection: 'column' }}>
            {/* Explore Tasks */}
            <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '24px' }}>
              <div style={{ color: '#b45309', fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, 0.5vw + 0.75vh, 16px)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '20px' }}>◎ Let's explore — Fig. 1.1</div>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14.5px', color: '#20303f', fontWeight: 600, marginBottom: '10px' }}>1 · Tap the <b>Hospital</b> on the map to mark it.</p>
                {t1Done && <div style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', marginTop: '8px', color: '#12a15f' }}>✓ Marked! The hospital is near the town centre.</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14.5px', color: '#20303f', fontWeight: 600, marginBottom: '10px' }}>2 · What do the blue-coloured areas mean?</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className={`opts-btn ${t2Ans === 1 ? 'ok' : ''}`} disabled={t2Ans !== null} onClick={() => setT2Ans(1)} style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', padding: '10px 16px' }}>Water (lake & river)</button>
                  <button className={`opts-btn ${t2Ans === 0 ? 'bad' : ''}`} disabled={t2Ans !== null} onClick={() => setT2Ans(0)} style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', padding: '10px 16px' }}>Forests</button>
                  <button className={`opts-btn ${t2Ans === 2 ? 'bad' : ''}`} disabled={t2Ans !== null} onClick={() => setT2Ans(2)} style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', padding: '10px 16px' }}>Roads</button>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14.5px', color: '#20303f', fontWeight: 600, marginBottom: '10px' }}>3 · Which is farthest from the Railway Station?</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['School', 'Nagar Panchayat', 'Public Garden'].map(opt => {
                    let cls = '';
                    if (t3Ans) {
                      if (opt === t3Ans.far) cls = 'ok';
                      else if (opt === t3Ans.picked) cls = 'bad';
                    }
                    return (
                      <button key={opt} className={`opts-btn ${cls}`} disabled={t3Ans !== null} onClick={() => checkT3(opt)} style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', padding: '10px 16px' }}>{opt}</button>
                    );
                  })}
                </div>
                {t3Ans && (
                  <div style={{ fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', marginTop: '10px', color: '#12a15f', lineHeight: 1.5 }}>
                    Computed from the map: Public Garden ≈ {Math.round(t3Ans.dists['Public Garden'])}, Nagar Panchayat ≈ {Math.round(t3Ans.dists['Nagar Panchayat'])}, School ≈ {Math.round(t3Ans.dists['School'])} units → <b>{t3Ans.far}</b> is farthest.
                  </div>
                )}
              </div>
            </div>

            {/* Elements of a Map Context Box */}
            <div ref={elementsRef} style={{ marginTop: '20px', background: '#fff9f0', border: '1px solid #fce7c8', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, 0.5vw + 0.75vh, 16px)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>
                <Compass size={16} /> Elements of a Map
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '14.5px' }}>Symbols</h4>
                  <p style={{ margin: 0, fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', color: '#b45309', lineHeight: 1.5 }}>
                    Maps use symbols to show real-world features like hospitals, schools, and parks without cluttering the page.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '14.5px' }}>Distance</h4>
                  <p style={{ margin: 0, fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', color: '#b45309', lineHeight: 1.5 }}>
                    Maps are drawn to reduced scales. This reduction is done very carefully so that the distance between places is kept accurate.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '14.5px' }}>Directions</h4>
                  <p style={{ margin: 0, fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)', color: '#b45309', lineHeight: 1.5 }}>
                    The compass rose on the map helps us orient ourselves. North is typically at the top, helping us navigate from place to place.
                  </p>
                </div>
              </div>
            </div>

          </ScrollableWithNav>
        )}
        {/* Bottom Footer Area */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #e4ebf3', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5c6b7a', fontWeight: 600, fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)' }}>
              <MapPin size={18} strokeWidth={2} />
              Interactive Map Activity
            </div>
          </div>
        </div>

      </div>
    </div>
    <ChapterBackFooter
      onBack={onBack}
      nextLabel={(t1Done && t2Ans !== null && t3Ans !== null && win) ? 'Next Activity' : 'Finish quiz to proceed'}
      onNext={onBeginChapter}
      nextDisabled={!(t1Done && t2Ans !== null && t3Ans !== null && win)}
      nextVariant="green"
    />
    </div>
  );
}
