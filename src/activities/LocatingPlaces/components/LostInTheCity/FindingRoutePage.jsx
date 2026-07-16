import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Map, MapPin, Compass } from 'lucide-react';

const N = {
  RS: {x: 150, y: 360, label: 'Railway Station', type: 'station', start: true},
  HO: {x: 350, y: 360, label: 'Hospital', type: 'hospital'},
  NP: {x: 550, y: 360, label: 'Nagar Panchayat', type: 'civic'},
  BK: {x: 740, y: 360, label: 'Bank', type: 'bank', goal: true},
  SC: {x: 150, y: 560, label: 'School', type: 'school'},
  MK: {x: 350, y: 560, label: 'Market', type: 'market'},
  JT: {x: 550, y: 560, label: 'Junction', type: 'junction'},
  MU: {x: 740, y: 560, label: 'Museum', type: 'museum'},
  AP: {x: 350, y: 165, label: 'Apartments', type: 'apartment'},
  PG: {x: 740, y: 165, label: 'Public Garden', type: 'garden'},
};

const EDGES = [
  ['RS', 'HO'], ['HO', 'NP'], ['NP', 'BK'], ['SC', 'MK'], ['MK', 'JT'], ['JT', 'MU'],
  ['RS', 'SC'], ['AP', 'HO'], ['HO', 'MK'], ['NP', 'JT'], ['PG', 'BK'], ['BK', 'MU']
];

const ADJ = {};
Object.keys(N).forEach(k => ADJ[k] = {});
function dirOf(a, b) {
  const dx = N[b].x - N[a].x, dy = N[b].y - N[a].y;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'E' : 'W') : (dy > 0 ? 'S' : 'N');
}
EDGES.forEach(([a, b]) => {
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

const ROOF = {
  station: '#c0392b', hospital: '#e74c3c', civic: '#5b7fa6', bank: '#34618e', school: '#e0a020',
  market: '#7c5cff', museum: '#4a6072', apartment: '#c98a4b', garden: '#2e8b57', junction: '#8a94a1'
};
const short = { RS: 'RS', HO: 'Hosp', NP: 'NP', BK: 'Bank', SC: 'Sch', MK: 'Mkt', JT: 'Jn', MU: 'Mus', AP: 'Apt', PG: 'PG' };

const GrassGrid = () => {
  const blocks = [];
  for (let gx = 0; gx < 880; gx += 44) {
    for (let gy = 0; gy < 720; gy += 44) {
      if ((gx / 44 + gy / 44) % 2 === 0) {
        blocks.push(<rect key={`${gx}-${gy}`} x={gx} y={gy} width={44} height={44} fill="#b6da7e" opacity={0.5} />);
      }
    }
  }
  return <g>{blocks}</g>;
};

const MapBuilding = ({ id, onClick, isPulsing }) => {
  const n = N[id];
  const { x, y, type, label } = n;
  const c = ROOF[type] || '#888';

  let icon = null;
  if (type === 'junction') {
    icon = <circle cx={x} cy={y} r={7} fill="#fff" stroke="#8a94a1" strokeWidth={2} />;
  } else if (type === 'garden') {
    icon = (
      <g>
        <ellipse cx={x} cy={y - 4} rx={26} ry={18} fill="#8fd06a" stroke="#5aa03c" strokeWidth={2} />
        <ellipse cx={x + 4} cy={y} rx={12} ry={7} fill="#7cc0ea" />
      </g>
    );
  } else if (type === 'bank' || type === 'museum') {
    const isBank = type === 'bank';
    const bg = isBank ? '#eef3f8' : '#eef1f4';
    const sC = isBank ? '#34618e' : '#4a6072';
    icon = (
      <g>
        <rect x={x - 26} y={y - 8} width={52} height={26} fill={bg} stroke={sC} strokeWidth={2} />
        <polygon points={`${x - 30},${y - 8} ${x},${y - 24} ${x + 30},${y - 8}`} fill={c} />
        {[-16, -6, 4, 14].map(o => <line key={o} x1={x + o} y1={y - 6} x2={x + o} y2={y + 16} stroke={sC} strokeWidth={2.4} />)}
      </g>
    );
  } else if (type === 'hospital') {
    icon = (
      <g>
        <rect x={x - 24} y={y - 20} width={48} height={38} rx={3} fill="#fdf2f2" stroke="#e74c3c" strokeWidth={2} />
        <rect x={x - 4} y={y - 14} width={8} height={8} fill="#e74c3c" />
        <rect x={x - 8} y={y - 10} width={16} height={0} />
        <path d={`M${x - 8} ${y - 10}h16M${x} ${y - 18}v16`} stroke="#e74c3c" strokeWidth={3} />
        {[-14, 0, 14].map(o => <rect key={o} x={x + o - 4} y={y + 2} width={8} height={9} fill="#cfe0ee" />)}
      </g>
    );
  } else {
    const w = type === 'apartment' ? 58 : 48, h = type === 'station' ? 30 : 34;
    icon = (
      <g>
        <rect x={x - w / 2} y={y - 8} width={w} height={h} rx={2} fill="#f6efe0" stroke={c} strokeWidth={2} />
        <polygon points={`${x - w / 2 - 4},${y - 8} ${x},${y - 24} ${x + w / 2 + 4},${y - 8}`} fill={c} />
        {Array.from({ length: Math.floor(w / 16) }, (_, i) => {
          const wx = x - w / 2 + 10 + i * 16;
          return <rect key={i} x={wx - 4} y={y - 2} width={8} height={9} fill="#cfe0ee" />;
        })}
        {type === 'station' && (
          <g>
            <rect x={x - w / 2 - 40} y={y + 2} width={34} height={10} fill="#8a94a1" />
            {[-36, -26, -16].map(o => <line key={o} x1={x - w / 2 + o} y1={y + 2} x2={x - w / 2 + o} y2={y + 12} stroke="#6f7a88" strokeWidth={1} />)}
          </g>
        )}
      </g>
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

export default function FindingRoutePage({ onMissionUnlock, onBeginChapter }) {
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

  const logRef = useRef(null);
  const elementsRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

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
    <div style={{ display: 'flex', width: '100%', height: '100%', fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      <style>{`
        .dpad-btn { font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 700; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #0E3556; border-radius: 11px; padding: 12px 0; font-size: 14px; transition: all 0.15s; }
        .dpad-btn:hover:not(:disabled) { border-color: #7c5cff; background: #f4f1ff; }
        .dpad-btn:disabled { opacity: 0.28; cursor: not-allowed; }
        .dpad-btn.hint { border-color: #F5A623; background: #fff6e6; animation: pulseHint 1.2s ease-in-out infinite; }
        @keyframes pulseHint { 0%, 100% { box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(245, 166, 35, 0); } }
        .opts-btn { font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 600; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #20303f; border-radius: 9px; padding: 7px 12px; font-size: 12.5px; transition: all 0.15s; }
        .opts-btn:hover:not(:disabled) { border-color: #7c5cff; }
        .opts-btn.ok { border-color: #12a15f; background: #eafaf1; color: #12a15f; }
        .opts-btn.bad { border-color: #e0552f; background: #fdeee9; color: #e0552f; }
      `}</style>
      
      {/* LEFT PAGE - MAP */}
      <div style={{ flex: 1.4, padding: '24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative' }}>
        
        <div style={{ background: '#dfeeff', border: '6px solid #0E3556', borderRadius: '18px', overflow: 'hidden', position: 'relative', flex: 1, boxShadow: '0 24px 60px rgba(14,42,69,0.1)' }}>
          <svg viewBox="0 0 880 720" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
            <GrassGrid />
            {/* River */}
            <path d="M0 690 Q220 660 440 690 T880 686 L880 720 L0 720 Z" fill="#7cc0ea" />
            <path d="M0 690 Q220 660 440 690 T880 686" fill="none" stroke="#9fd2f2" strokeWidth={3} />
            {[180, 560].map(bx => (
              <g key={bx}>
                <rect x={bx - 18} y={678} width={36} height={20} fill="#c69b63" stroke="#8a6a3a" />
                {[-12, -4, 4, 12].map(o => <line key={o} x1={bx + o} y1={678} x2={bx + o} y2={698} stroke="#8a6a3a" strokeWidth={1.4} />)}
              </g>
            ))}
            
            {/* Lake */}
            <ellipse cx={470} cy={255} rx={40} ry={24} fill="#7cc0ea" stroke="#4a9ed6" strokeWidth={2} />
            <text x={470} y={259} textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize={10} fontWeight={700} fill="#2c6a92">LAKE</text>
            
            {/* Roads */}
            {EDGES.map(([a, b], idx) => {
              const A = N[a], B = N[b];
              return (
                <g key={idx}>
                  <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#6f7a88" strokeWidth={26} strokeLinecap="round" />
                  <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#8a94a1" strokeWidth={22} strokeLinecap="round" />
                  <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#e9edf1" strokeWidth={1.5} strokeDasharray="7 9" />
                </g>
              );
            })}
            
            {/* Trees */}
            {[[60,120],[100,470],[260,260],[470,130],[650,270],[840,120],[820,460],[70,640],[300,470],[640,470],[500,640],[840,640],[240,120],[660,120]].map(([tx, ty], i) => (
              <g key={i}>
                <circle cx={tx} cy={ty + 6} r={4} fill="#7a5a34" />
                <circle cx={tx} cy={ty} r={12} fill="#5fa84a" />
                <circle cx={tx - 5} cy={ty + 3} r={8} fill="#6db857" />
                <circle cx={tx + 5} cy={ty + 3} r={8} fill="#6db857" />
              </g>
            ))}
            
            {/* Buildings */}
            {Object.keys(N).map(k => (
              <MapBuilding key={k} id={k} onClick={tapBuilding} isPulsing={k === 'HO' && pulseHO} />
            ))}

            {/* Compass */}
            <g transform="translate(818,64)">
              <circle r={26} fill="#fff" opacity={0.9} />
              <polygon points="0,-22 5,0 0,0" fill="#c0392b" /><polygon points="0,-22 -5,0 0,0" fill="#e88b80" />
              <polygon points="0,22 5,0 0,0" fill="#334" /><polygon points="0,22 -5,0 0,0" fill="#889" />
              <text x={0} y={-28} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0E3556">N</text>
              <text x={0} y={36} textAnchor="middle" fontSize={9} fill="#5c6b7a">S</text>
              <text x={-34} y={4} textAnchor="middle" fontSize={9} fill="#5c6b7a">W</text>
              <text x={34} y={4} textAnchor="middle" fontSize={9} fill="#5c6b7a">E</text>
            </g>

            {/* Player Token */}
            <g id="player">
              <circle cx={N[cur].x} cy={N[cur].y - 52} r={16} fill="#7c5cff" stroke="#fff" strokeWidth={3.5} style={{ transition: 'all 0.3s ease' }} />
              <circle cx={N[cur].x} cy={N[cur].y - 57} r={5.5} fill="#fff" style={{ transition: 'all 0.3s ease' }} />
              <path d={`M${N[cur].x - 6} ${N[cur].y - 42} a6 7 0 0 1 12 0`} fill="#fff" style={{ transition: 'all 0.3s ease' }} />
            </g>
          </svg>
          
          {/* Map HUD */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(255,255,255,0.92)', borderRadius: '12px', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 16px rgba(14,42,69,0.14)' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#e7efff', display: 'grid', placeItems: 'center' }}>
              <Map size={20} color="#2f6df0" />
            </div>
            <div>
              <b style={{ fontSize: '14px', color: '#0E3556', display: 'block', lineHeight: 1.1 }}>Town Map</b>
              <span style={{ fontSize: '11px', color: '#5c6b7a' }}>Top-down view · Fig. 1.1</span>
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
                    <span>You made it in <b>{userTook} roads</b>. The shortest route is <b>{optTook}</b> (straight east: Hospital → Nagar Panchayat → Bank).</span>
                  )}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={resetGame} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: '1px solid #d6e0ec', cursor: 'pointer', background: '#fff', color: '#5c6b7a', padding: '12px 20px', borderRadius: '999px', fontSize: '14px' }}>Play again</button>
                  <button onClick={() => setShowQuiz(true)} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer', background: '#F5A623', color: '#fff', padding: '12px 24px', borderRadius: '999px', fontSize: '15px', boxShadow: '0 4px 15px rgba(245, 166, 35, 0.4)' }}>Proceed to Quiz →</button>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7c5cff', fontWeight: 600 }}>
              ◎ Let's play a game
            </div>
            <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 600, color: '#0E3556', fontSize: 'clamp(20px, 2.2vw, 28px)', margin: '6px 0 4px' }}>
              Reach the Bank
            </div>
            <div style={{ color: '#5c6b7a', fontSize: '13.5px', lineHeight: 1.5 }}>
              You just got off a train at the <b>Railway Station</b>. Travel the roads to reach the <b>Bank</b>. There is more than one correct path — pick a road at each junction.
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: '14px', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Controls */}
              <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 600, marginBottom: '10px', textAlign: 'center' }}>Choose a direction</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, auto)', gap: '7px', maxWidth: '220px', margin: '0 auto' }}>
                  <button className={`dpad-btn ${hintDir === 'N' ? 'hint' : ''}`} style={{ gridColumn: 2 }} disabled={!ADJ[cur]['N']} onClick={() => handleMove('N')}>▲ N</button>
                  <button className={`dpad-btn ${hintDir === 'W' ? 'hint' : ''}`} style={{ gridColumn: 1, gridRow: 2 }} disabled={!ADJ[cur]['W']} onClick={() => handleMove('W')}>◀ W</button>
                  
                  <div style={{ gridColumn: 2, gridRow: 2, display: 'grid', placeItems: 'center' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px dashed #c3cfdd', display: 'grid', placeItems: 'center', fontSize: '11px', color: '#5c6b7a', fontFamily: '"IBM Plex Mono", monospace' }}>
                      {short[cur]}
                    </div>
                  </div>
                  
                  <button className={`dpad-btn ${hintDir === 'E' ? 'hint' : ''}`} style={{ gridColumn: 3, gridRow: 2 }} disabled={!ADJ[cur]['E']} onClick={() => handleMove('E')}>E ▶</button>
                  <button className={`dpad-btn ${hintDir === 'S' ? 'hint' : ''}`} style={{ gridColumn: 2, gridRow: 3 }} disabled={!ADJ[cur]['S']} onClick={() => handleMove('S')}>▼ S</button>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
                  <button onClick={handleHint} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '10px', padding: '8px 14px', fontSize: '12.5px' }}>💡 Hint</button>
                  <button onClick={resetGame} style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, cursor: 'pointer', border: '1px solid #d6e0ec', background: '#fff', color: '#5c6b7a', borderRadius: '10px', padding: '8px 14px', fontSize: '12.5px' }}>↺ Restart</button>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 600, marginBottom: '10px' }}>Progress</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
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
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 600, marginBottom: '10px' }}>Journey log</div>
                <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', maxHeight: '100px', overflowY: 'auto' }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#20303f' }}>
                      <span style={{ color: log.ok ? '#12a15f' : '#e0552f', flex: '0 0 auto' }}>{log.ok ? '✓' : '✗'}</span>
                      <span dangerouslySetInnerHTML={{ __html: log.html }}></span>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </>
        )}

        {showQuiz && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Explore Tasks */}
            <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '24px' }}>
              <div style={{ color: '#b45309', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '20px' }}>◎ Let's explore — Fig. 1.1</div>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14.5px', color: '#20303f', fontWeight: 600, marginBottom: '10px' }}>1 · Tap the <b>Hospital</b> on the map to mark it.</p>
                {t1Done && <div style={{ fontSize: '13px', marginTop: '8px', color: '#12a15f' }}>✓ Marked! The hospital is near the town centre.</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14.5px', color: '#20303f', fontWeight: 600, marginBottom: '10px' }}>2 · What do the blue-coloured areas mean?</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className={`opts-btn ${t2Ans === 1 ? 'ok' : ''}`} disabled={t2Ans !== null} onClick={() => setT2Ans(1)} style={{ fontSize: '13.5px', padding: '10px 16px' }}>Water (lake & river)</button>
                  <button className={`opts-btn ${t2Ans === 0 ? 'bad' : ''}`} disabled={t2Ans !== null} onClick={() => setT2Ans(0)} style={{ fontSize: '13.5px', padding: '10px 16px' }}>Forests</button>
                  <button className={`opts-btn ${t2Ans === 2 ? 'bad' : ''}`} disabled={t2Ans !== null} onClick={() => setT2Ans(2)} style={{ fontSize: '13.5px', padding: '10px 16px' }}>Roads</button>
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
                      <button key={opt} className={`opts-btn ${cls}`} disabled={t3Ans !== null} onClick={() => checkT3(opt)} style={{ fontSize: '13.5px', padding: '10px 16px' }}>{opt}</button>
                    );
                  })}
                </div>
                {t3Ans && (
                  <div style={{ fontSize: '13px', marginTop: '10px', color: '#12a15f', lineHeight: 1.5 }}>
                    Computed from the map: Public Garden ≈ {Math.round(t3Ans.dists['Public Garden'])}, Nagar Panchayat ≈ {Math.round(t3Ans.dists['Nagar Panchayat'])}, School ≈ {Math.round(t3Ans.dists['School'])} units → <b>{t3Ans.far}</b> is farthest.
                  </div>
                )}
              </div>
            </div>

            {/* Elements of a Map Context Box */}
            <div ref={elementsRef} style={{ marginTop: '20px', background: '#fff9f0', border: '1px solid #fce7c8', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>
                <Compass size={16} /> Elements of a Map
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '14.5px' }}>Symbols</h4>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#b45309', lineHeight: 1.5 }}>
                    Maps use symbols to show real-world features like hospitals, schools, and parks without cluttering the page.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '14.5px' }}>Distance</h4>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#b45309', lineHeight: 1.5 }}>
                    Maps are drawn to reduced scales. This reduction is done very carefully so that the distance between places is kept accurate.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '14.5px' }}>Directions</h4>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#b45309', lineHeight: 1.5 }}>
                    The compass rose on the map helps us orient ourselves. North is typically at the top, helping us navigate from place to place.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
        {/* Bottom Footer Area */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e4ebf3', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5c6b7a', fontWeight: 600, fontSize: '13px' }}>
              <MapPin size={18} strokeWidth={2} />
              Interactive Map Activity
            </div>
            
            <div style={{ opacity: (t1Done && t2Ans !== null && t3Ans !== null && win) ? 1 : 0, transition: 'opacity 0.5s', pointerEvents: (t1Done && t2Ans !== null && t3Ans !== null && win) ? 'auto' : 'none' }}>
              <button 
                onClick={onBeginChapter} 
                style={{ 
                  background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', 
                  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)', 
                  transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Next Lesson <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
