import React, { useState, useEffect } from 'react';

function getClimate(lat) {
  const a = Math.abs(lat);
  return a <= 23.5 ? ['Torrid (hot)', 'b-torrid'] : a <= 66.5 ? ['Temperate (moderate)', 'b-temperate'] : ['Frigid (cold)', 'b-frigid'];
}

export default function CoordinatesPage({ onNextActivity }) {
  const [activeTab, setActiveTab] = useState('co');
  
  // Chess state
  const [blkInput, setBlkInput] = useState('');
  const [chessFb, setChessFb] = useState({ text: '', ok: true });
  const [coStage, setCoStage] = useState(1);
  const [missionStep, setMissionStep] = useState(0);
  const [missionFb, setMissionFb] = useState(null);

  // Lat state
  const [latVal, setLatVal] = useState(0);

  // Lon state
  const [lonVal, setLonVal] = useState(0);
  const [lonName, setLonName] = useState('');

  // Grid state
  const [gridLat, setGridLat] = useState(29);
  const [gridLon, setGridLon] = useState(77);
  const [gridName, setGridName] = useState('Delhi');

  const [completedActivities, setCompletedActivities] = useState({ co: false, lat: false, lon: false, grid: false });

  useEffect(() => {
    if (coStage === 4) setCompletedActivities(p => ({ ...p, co: true }));
  }, [coStage]);

  useEffect(() => {
    if (latVal !== 0) setCompletedActivities(p => ({ ...p, lat: true }));
  }, [latVal]);

  useEffect(() => {
    if (lonVal !== 0) setCompletedActivities(p => ({ ...p, lon: true }));
  }, [lonVal]);

  useEffect(() => {
    if (gridLat !== 29 || gridLon !== 77) setCompletedActivities(p => ({ ...p, grid: true }));
  }, [gridLat, gridLon]);

  const allCompleted = Object.values(completedActivities).every(Boolean);

  const tabs = [
    { id: 'co', label: 'Coordinates', sub: 'Chess & market' },
    { id: 'lat', label: 'Latitudes', sub: 'Distance from Equator' },
    { id: 'lon', label: 'Longitudes', sub: 'Prime Meridian' },
    { id: 'grid', label: 'Grid & Hemispheres', sub: 'Locate any place' }
  ];

  const handleChessCheck = () => {
    const v = blkInput.trim().toLowerCase().replace(/[^a-h1-8]/g, '');
    if (/^[a-h][1-8][a-h][1-8]$/.test(v)) {
      setChessFb({ text: v.slice(0, 2) + ' → ' + v.slice(2) + (v === 'd7d5' ? ' — the classic mirror! ✓' : ' — valid ✓'), ok: true });
    } else {
      setChessFb({ text: 'use file+rank, e.g. d7 d5', ok: false });
    }
  };

  const renderChessboard = ({ 
    highlightSquare = null, 
    highlightCol = null, 
    highlightRow = null, 
    showPieces = false,
    arrow = null,
    interactive = false,
    onSquareClick = null
  } = {}) => {
    const sz = 42, ox = 22, oy = 22;
    const squares = [];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const file = 'abcdefgh'[f];
        const rank = 8 - r;
        const sqName = `${file}${rank}`;
        
        let light = (r + f) % 2 === 0;
        let fill = light ? '#bfe6ec' : '#3a94a3';

        const isTarget = highlightSquare === sqName;
        const isCol = highlightCol === file;
        const isRow = highlightRow === rank.toString();

        if (isTarget) fill = '#F5A623';
        else if (isCol || isRow) fill = light ? '#ffeccb' : '#d2963c';

        squares.push(
          <rect key={sqName} x={ox + f * sz} y={oy + r * sz} width={sz} height={sz} 
            fill={fill} style={{ cursor: interactive ? 'pointer' : 'default', transition: 'fill 0.2s' }} 
            onClick={() => {
              if (interactive && onSquareClick) onSquareClick(sqName);
            }} />
        );
        if (f === 0) {
          squares.push(<text key={`r${rank}`} x={ox - 9} y={oy + r * sz + sz / 2 + 4} fontSize="11" fill={isRow ? '#F5A623' : '#5c6b7a'} fontWeight={isRow ? 'bold' : 'normal'} textAnchor="middle">{rank}</text>);
        }
        if (rank === 1) {
          squares.push(<text key={`f${file}`} x={ox + f * sz + sz / 2} y={oy + 8 * sz + 16} fontSize="11" fill={isCol ? '#F5A623' : '#5c6b7a'} fontWeight={isCol ? 'bold' : 'normal'} textAnchor="middle">{file}</text>);
        }
      }
    }

    const mkCircle = (file, rank, col, t) => {
      const f = 'abcdefgh'.indexOf(file);
      const r = 8 - rank;
      return (
        <g key={t}>
          <circle cx={ox + f * sz + sz / 2} cy={oy + r * sz + sz / 2} r="13" fill={col} />
          <text x={ox + f * sz + sz / 2} y={oy + r * sz + sz / 2 + 4} fontSize="10" fontWeight="700" textAnchor="middle" fill="#0d1017">{t}</text>
        </g>
      );
    };

    let arrowSvg = null;
    if (arrow) {
      const f1 = 'abcdefgh'.indexOf(arrow.from[0]);
      const r1 = 8 - parseInt(arrow.from[1]);
      const f2 = 'abcdefgh'.indexOf(arrow.to[0]);
      const r2 = 8 - parseInt(arrow.to[1]);
      const startX = ox + f1 * sz + sz / 2;
      const startY = oy + r1 * sz + sz / 2;
      const endX = ox + f2 * sz + sz / 2;
      const endY = oy + r2 * sz + sz / 2 + 10;
      
      arrowSvg = (
        <g>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#d94a3d" />
            </marker>
          </defs>
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#d94a3d" strokeWidth="4" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />
        </g>
      );
    }

    return (
      <svg viewBox="0 0 380 385" style={{ width: '100%', height: '100%', maxHeight: '350px', maxWidth: '100%', display: 'block', margin: '0 auto' }}>
        {squares}
        {showPieces && mkCircle('d', 2, '#eef4fb', 'P')}
        {arrowSvg}
      </svg>
    );
  };

  const renderLatGlobe = () => {
    const cx = 180, cy = 180, R = 150;
    const rad = Math.PI / 180;
    
    const getLatParams = (lat) => {
      const rx = R * Math.cos(lat * rad);
      const ry = rx * 0.25; 
      const y = cy - R * Math.sin(lat * rad);
      return { rx, ry, y };
    };

    const generateLatPath = (lat) => {
      const { rx, ry, y } = getLatParams(lat);
      if (rx < 0.1) return ''; 
      return `M ${cx - rx} ${y} A ${rx} ${ry} 0 0 0 ${cx + rx} ${y}`;
    };

    const generateZonePath = (latTop, latBot) => {
      const top = getLatParams(latTop);
      const bot = getLatParams(latBot);
      return `
        M ${cx - top.rx} ${top.y}
        A ${top.rx} ${top.ry} 0 0 0 ${cx + top.rx} ${top.y}
        L ${cx + R + 10} ${top.y}
        L ${cx + R + 10} ${bot.y}
        L ${cx + bot.rx} ${bot.y}
        A ${bot.rx} ${bot.ry} 0 0 1 ${cx - bot.rx} ${bot.y}
        L ${cx - R - 10} ${bot.y}
        L ${cx - R - 10} ${top.y}
        Z
      `;
    };

    const parallels = [-60, -30, 30, 60].map(f => {
      return (
        <path key={`p${f}`} d={generateLatPath(f)} 
          fill="none" stroke="#7fa8c8" strokeWidth={1} opacity={0.5} />
      );
    });

    const eq = getLatParams(0);
    const highlightParams = getLatParams(latVal);

    return (
      <svg viewBox="0 0 360 360" style={{ width: 'auto', height: 'auto', maxHeight: '45vh', maxWidth: '100%', display: 'block', margin: '0 auto' }}>
        <defs>
          <radialGradient id="globeShading" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f4f9ff" />
            <stop offset="40%" stopColor="#dcefff" />
            <stop offset="90%" stopColor="#abcdec" />
            <stop offset="100%" stopColor="#8cb4db" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <clipPath id="globeClip">
            <circle cx={cx} cy={cy} r={R} />
          </clipPath>
        </defs>

        <circle cx={cx} cy={cy} r={R + 4} fill="none" stroke="#b1dbff" strokeWidth="6" opacity="0.4" filter="blur(3px)" />
        <circle cx={cx} cy={cy} r={R + 1} fill="none" stroke="#b1dbff" strokeWidth="2" opacity="0.6" />

        <circle cx={cx} cy={cy} r={R} fill="url(#globeShading)" stroke="#5b7fa6" strokeWidth="1" />

        <g opacity="0.15" fill="#588c5f" clipPath="url(#globeClip)">
          <path d={`M ${cx-110} ${cy-50} C ${cx-80} ${cy-80}, ${cx-40} ${cy-10}, ${cx-60} ${cy+20} C ${cx-80} ${cy+60}, ${cx-40} ${cy+100}, ${cx-30} ${cy+120} C ${cx-20} ${cy+130}, ${cx-50} ${cy+90}, ${cx-50} ${cy+70} C ${cx-50} ${cy+50}, ${cx-90} ${cy}, ${cx-110} ${cy-50} Z`} />
          <path d={`M ${cx-10} ${cy-90} C ${cx+50} ${cy-110}, ${cx+120} ${cy-60}, ${cx+110} ${cy-20} C ${cx+90} ${cy+10}, ${cx+80} ${cy+50}, ${cx+70} ${cy+80} C ${cx+50} ${cy+110}, ${cx+30} ${cy+90}, ${cx+40} ${cy+50} C ${cx+50} ${cy+10}, ${cx-10} ${cy-20}, ${cx-10} ${cy-90} Z`} />
        </g>

        <g clipPath="url(#globeClip)">
          <path d={generateZonePath(90, 66.5)} fill="#2f6df0" opacity="0.08" />
          <path d={generateZonePath(66.5, 23.5)} fill="#12a15f" opacity="0.08" />
          <path d={generateZonePath(23.5, -23.5)} fill="#d94a3d" opacity="0.08" />
          <path d={generateZonePath(-23.5, -66.5)} fill="#12a15f" opacity="0.08" />
          <path d={generateZonePath(-66.5, -90)} fill="#2f6df0" opacity="0.08" />
        </g>

        {parallels}
        
        <path d={generateLatPath(0)} fill="none" stroke="#F5A623" strokeWidth={3} filter="url(#glow)" opacity="0.6" />
        <path d={generateLatPath(0)} fill="none" stroke="#d94a3d" strokeWidth={1.5} />
        
        {Math.abs(latVal) !== 0 && (
          <path d={generateLatPath(latVal)} fill="none" stroke="#F5A623" strokeWidth={3} filter="url(#glow)" style={{ transition: 'all 0.3s ease-out' }} />
        )}
        
        <circle cx={cx} cy={cy - R} r="3.5" fill="#fff" stroke="#12a15f" strokeWidth="2" filter="url(#glow)" />
        <text x={cx} y={cy - R - 10} fontSize="11" fontWeight="900" fill="#12a15f" textAnchor="middle">90°N</text>
        
        <circle cx={cx} cy={cy + R} r="3.5" fill="#fff" stroke="#2f6df0" strokeWidth="2" filter="url(#glow)" />
        <text x={cx} y={cy + R + 16} fontSize="11" fontWeight="900" fill="#2f6df0" textAnchor="middle">90°S</text>
        
        <text x={cx + eq.rx + 8} y={eq.y + 12} fontSize="11" fontWeight="900" fill="#d94a3d" textAnchor="start">0° Equator</text>

        {Math.abs(latVal) !== 0 && (
          <text 
            x={cx - highlightParams.rx - 12} 
            y={highlightParams.y + highlightParams.ry + 4} 
            fontSize="12" 
            fontWeight="900" 
            fill="#F5A623" 
            textAnchor="end"
            style={{ transition: 'all 0.3s ease-out' }}
          >
            {Math.abs(latVal)}° {latVal > 0 ? 'N' : 'S'}
          </text>
        )}
      </svg>
    );
  };

  const renderLonGlobe = () => {
    const cx = 180, cy = 180, R = 150;
    const rad = Math.PI / 180;
    const meridians = [-90, -60, -30, 0, 30, 60, 90].map(l => {
      const rx = Math.abs(R * Math.sin(l * rad));
      return (
        <ellipse key={`m${l}`} cx={cx} cy={cy} rx={rx} ry={R} fill="none" 
          stroke={l === 0 ? '#c79a3e' : '#7fa8c8'} strokeWidth={l === 0 ? 2 : 1} opacity={l === 0 ? 1 : 0.55} />
      );
    });

    const shown = Math.max(-90, Math.min(90, lonVal));
    const rx = Math.abs(R * Math.sin(shown * rad));

    return (
      <svg viewBox="0 0 360 360" style={{ width: 'auto', height: 'auto', maxHeight: '45vh', maxWidth: '100%', display: 'block', margin: '0 auto' }}>
        <circle cx={cx} cy={cy} r={R} fill="#dcefff" stroke="#5b7fa6" strokeWidth="1.4" />
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#d94a3d" strokeWidth="1.4" />
        {meridians}
        <ellipse cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke="#F5A623" strokeWidth="3.5" />
        <text x={cx} y={cy - R - 6} fontSize="10" fill="#c79a3e" textAnchor="middle">Prime Meridian 0°</text>
      </svg>
    );
  };

  const renderGrid = () => {
    const X = 10, Y = 10, W = 400, H = 200;
    const px = X + ((gridLon + 180) / 360) * W;
    const py = Y + ((90 - gridLat) / 180) * H;
    
    const hLines = [];
    for (let i = 1; i < 6; i++) hLines.push(<line key={`hl${i}`} x1={X} y1={Y + i * H / 6} x2={X + W} y2={Y + i * H / 6} stroke="#cbdcec" />);
    const vLines = [];
    for (let i = 1; i < 12; i++) vLines.push(<line key={`vl${i}`} x1={X + i * W / 12} y1={Y} x2={X + i * W / 12} y2={Y + H} stroke="#cbdcec" />);

    return (
      <svg viewBox="0 0 420 300" style={{ width: 'auto', height: 'auto', maxHeight: '45vh', maxWidth: '100%', display: 'block', margin: '0 auto' }}>
        <rect x={X} y={Y} width={W} height={H} fill="#eaf3fb" stroke="#9fbdd8" />
        {hLines}
        {vLines}
        <line x1={X} y1={Y + H / 2} x2={X + W} y2={Y + H / 2} stroke="#d94a3d" strokeWidth="1.6" />
        <line x1={X + W / 2} y1={Y} x2={X + W / 2} y2={Y + H} stroke="#c79a3e" strokeWidth="1.6" />
        <text x={X + 4} y={Y + H / 2 - 4} fontSize="9" fill="#d94a3d">Equator 0°</text>
        <text x={X + W / 2 + 3} y={Y + 12} fontSize="9" fill="#c79a3e">Prime Meridian</text>
        <text x={X + 6} y={Y + 16} fontSize="9" fill="#5c6b7a">NW · Northern+Western</text>
        <text x={X + W - 6} y={Y + H - 6} fontSize="9" fill="#5c6b7a" textAnchor="end">SE · Southern+Eastern</text>
        <line x1={px} y1={Y} x2={px} y2={Y + H} stroke="#7c5cff" strokeDasharray="3 3" opacity=".7" />
        <line x1={X} y1={py} x2={X + W} y2={py} stroke="#7c5cff" strokeDasharray="3 3" opacity=".7" />
        <circle cx={px} cy={py} r="6" fill="#7c5cff" stroke="#fff" strokeWidth="2" />
        <text x={px} y={py - 12} fontSize="11" fontWeight="700" fill="#0E3556" textAnchor="middle">{gridName}</text>
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      <style>{`
        .tab-btn { flex: 1; font-family: inherit; font-weight: 700; cursor: pointer; border: none; background: transparent; color: var(--text-muted, #5c6b7a); border-radius: 10px; padding: 11px 8px; font-size: clamp(12px, 1.3vw, 14.5px); transition: all 0.2s; display: flex; flexDirection: column; gap: 1px; align-items: center; }
        .tab-btn.active { background: var(--navy, #0E3556); color: #fff; }
        .tab-btn small { font-weight: 400; font-size: 10.5px; opacity: 0.7; }
        .tab-btn.active small { opacity: 0.85; }
        
        .kbox { background: #fbf5e6; border-left: 4px solid #F5A623; border-radius: 9px; padding: 11px 13px; margin: 10px 0; font-size: 13px; line-height: 1.5; color: #7a5a2a; }
        .explore-box { background: #e6f4fb; border: 1px solid #bfe0f0; border-radius: 11px; padding: 12px 14px; margin-top: 10px; font-size: 12.5px; color: #25607e; line-height: 1.5; }
        .readout { background: #f4f7fb; border: 1px solid #e4ebf3; border-radius: 12px; padding: 12px 15px; margin-top: 10px; }
        .readout .big { font-size: clamp(18px, 2.2vw, 26px); font-weight: 800; color: #0E3556; }
        .readout .big span { color: #F5A623; }
        .readout .work { font-family: "IBM Plex Mono", monospace; font-size: 12px; color: #5c6b7a; margin-top: 5px; line-height: 1.5; }
        
        .badge { display: inline-block; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 9px; margin-right: 6px; }
        .b-torrid { background: #fdeee2; color: #d2691e; }
        .b-temperate { background: #eafaf1; color: #12a15f; }
        .b-frigid { background: #e7f1fb; color: #2f6df0; }
        .b-hemi { background: #f1ecff; color: #7c5cff; }
        
        .chip { font-family: inherit; font-weight: 600; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #0E3556; border-radius: 8px; padding: 6px 11px; font-size: 12px; transition: all 0.15s; }
        .chip:hover { border-color: #7c5cff; background: #f5f2ff; }
        
        .c-input { background: #f7f9fc; border: 1px solid #d6e0ec; border-radius: 9px; padding: 9px 12px; font-size: 14px; font-family: inherit; max-width: 170px; }
        .c-input:focus { outline: none; border-color: #7c5cff; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '6px', background: '#fff', borderRadius: '14px', padding: '6px', boxShadow: '0 8px 24px rgba(14,42,69,.1)', flexShrink: 0, marginBottom: '16px' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
            <small>{t.sub}</small>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '18px', minHeight: 0 }}>
        {/* LEFT PANEL */}
        <div style={{ flex: 0.82, background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRadius: '16px', padding: '24px', overflowY: 'auto', boxShadow: '0 16px 40px rgba(14,42,69,.12)' }}>
          {activeTab === 'co' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Big Question 2 · (a)</div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>Understanding coordinates</h1>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Imagine a large market where every shop looks the same.</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Suppose your friend asks, <b style={{ color: '#0E3556' }}>"Where is the stationery shop?"</b> Simply saying, <b style={{ color: '#0E3556' }}>"Near the market"</b> is not enough.</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '16px' }}>Instead, you say, <b style={{ color: '#0E3556' }}>"The 7th shop in the 5th row."</b> Now your friend knows the exact location.</p>
              
              <div style={{ background: '#fff', padding: '24px 16px', borderRadius: '12px', border: '1px solid #d6e0ec', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(8, 1fr)', gap: '8px', alignItems: 'center', justifyItems: 'center' }}>
                  {/* Top Header Row */}
                  <div />
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <div key={`c${n}`} style={{ fontSize: '11px', fontWeight: 'bold', color: n === 7 ? '#F5A623' : '#9fbdd8', paddingBottom: '4px' }}>{n}</div>
                  ))}
                  
                  {/* Grid Rows */}
                  {Array.from({ length: 5 }).map((_, r) => (
                    <React.Fragment key={`r${r}`}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: r === 4 ? '#0E3556' : '#9fbdd8', paddingRight: '4px' }}>{r + 1}</div>
                      {Array.from({ length: 8 }).map((_, c) => {
                        const isTarget = r === 4 && c === 6;
                        return (
                          <div key={`s${r}-${c}`} style={{ 
                            width: '32px', height: '32px', 
                            backgroundColor: isTarget ? '#F5A623' : '#fff', 
                            border: `1.5px solid ${isTarget ? '#d98b12' : '#d6e0ec'}`, 
                            borderRadius: '6px', 
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: isTarget ? '0 4px 12px rgba(245, 166, 35, 0.4)' : '0 2px 4px rgba(0,0,0,0.02)',
                            transform: isTarget ? 'scale(1.15)' : 'scale(1)',
                            zIndex: isTarget ? 10 : 1
                          }}>
                            {/* Striped Awning */}
                            <div style={{ 
                              position: 'absolute', top: 0, left: 0, right: 0, height: '12px', 
                              background: isTarget ? 'repeating-linear-gradient(90deg, #F5A623, #F5A623 4px, #ffbc4f 4px, #ffbc4f 8px)' : 'repeating-linear-gradient(90deg, #e4ebf3, #e4ebf3 4px, #f4f7fb 4px, #f4f7fb 8px)',
                              borderBottom: `1px solid ${isTarget ? '#d98b12' : '#d6e0ec'}`
                            }} />
                            {/* Doorway / Window */}
                            <div style={{ 
                              position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)', 
                              width: '14px', height: '14px', 
                              background: isTarget ? '#fff' : '#f4f7fb', 
                              border: `1px solid ${isTarget ? '#d98b12' : '#d6e0ec'}`,
                              borderTopLeftRadius: '4px', borderTopRightRadius: '4px' 
                            }} />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                  <span style={{ color: '#0E3556', background: '#f4f7fb', padding: '6px 12px', borderRadius: '20px' }}>Row 5</span>
                  <span style={{ color: '#d98b12', background: '#fff9ef', padding: '6px 12px', borderRadius: '20px' }}>Shop 7</span>
                </div>
                <div style={{ marginTop: '12px', fontSize: '13.5px', color: '#5c6b7a' }}>Two values identify one exact place.</div>
              </div>

              <div style={{ background: '#fbf5e6', borderLeft: '4px solid #F5A623', borderRadius: '9px', padding: '14px', fontSize: '14px', lineHeight: 1.5, color: '#7a5a2a' }}>
                Just like a market, every square on a chessboard also has its own address. Let's explore how.
              </div>
            </>
          )}
          {activeTab === 'lat' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Big Question 2 · (b)</div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>Latitudes</h1>
                <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '20px' }}>On a globe, the fixed top and bottom points are the <b style={{ color: '#0E3556' }}>North Pole</b> and <b style={{ color: '#0E3556' }}>South Pole</b>; halfway between is the <b style={{ color: '#0E3556' }}>Equator</b>.</p>
                
                <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '20px', boxShadow: '0 4px 12px rgba(14,42,69,.05)' }}>
                  <div style={{ fontSize: '15px', lineHeight: 1.55, color: '#3a3a66' }}>
                    <b style={{ color: '#0E3556' }}>Latitude</b> measures how far you are from the Equator. <b style={{ color: '#0E3556' }}>Latitudes are expressed in degrees.</b> A line running east–west, parallel to the Equator, is a <b style={{ color: '#0E3556' }}>parallel of latitude</b> — it draws a circle around the Earth. Parallels grow smaller toward the poles.
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ flex: 1, background: '#fff9f0', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#d94a3d' }}>0°</div>
                    <div style={{ fontSize: '13px', color: '#b45309', fontWeight: 'bold' }}>Equator</div>
                  </div>
                  <div style={{ flex: 1, background: '#f0fdf4', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a' }}>90°N</div>
                    <div style={{ fontSize: '13px', color: '#166534', fontWeight: 'bold' }}>North Pole</div>
                  </div>
                  <div style={{ flex: 1, background: '#eff6ff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#2563eb' }}>90°S</div>
                    <div style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 'bold' }}>South Pole</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#0E3556', marginBottom: '12px' }}>Climate Zones</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#ef4444', marginBottom: '4px' }}>Torrid</div>
                    <div style={{ fontSize: '12px', color: '#991b1b', lineHeight: 1.4 }}>Hot<br/>(Near Equator)</div>
                  </div>
                  <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#22c55e', marginBottom: '4px' }}>Temperate</div>
                    <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>Moderate<br/>(Mid-latitudes)</div>
                  </div>
                  <div style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#3b82f6', marginBottom: '4px' }}>Frigid</div>
                    <div style={{ fontSize: '12px', color: '#1e3a8a', lineHeight: 1.4 }}>Cold<br/>(Near Poles)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'lon' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Big Question 2 · (c)</div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>Longitudes</h1>
                <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '20px' }}>Travel pole to pole by the shortest line and you trace a <b style={{ color: '#0E3556' }}>meridian of longitude</b> — a half-circle from one pole to the other.</p>
                
                <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '20px', boxShadow: '0 4px 12px rgba(14,42,69,.05)' }}>
                  <div style={{ fontSize: '15px', lineHeight: 1.55, color: '#3a3a66' }}>
                    The reference is the <b style={{ color: '#0E3556' }}>Prime Meridian</b> (Greenwich Meridian). In <b style={{ color: '#0E3556' }}>1884</b>, nations agreed the meridian through Greenwich (London) would be the standard <b style={{ color: '#0E3556' }}>0° longitude</b>.
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ flex: 1, background: '#fef2f2', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#ef4444' }}>0°</div>
                    <div style={{ fontSize: '13px', color: '#991b1b', fontWeight: 'bold' }}>Prime Meridian</div>
                  </div>
                  <div style={{ flex: 1, background: '#f4f7fb', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e4ebf3' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#0E3556' }}>0° to 180°</div>
                    <div style={{ fontSize: '13px', color: '#5c6b7a', fontWeight: 'bold' }}>West or East</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>New York 74°W</div>
                  <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Delhi 77°E</div>
                  <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Tokyo 140°E</div>
                </div>
              </div>

              <div className="kbox">Because the Earth spins on its axis, <b>longitude also marks the time</b> — that's the next big idea. Note: 180°W = 180°E = simply <b>180°</b>.</div>
            </div>
          )}
          {activeTab === 'grid' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Big Question 2 · together</div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>The grid & hemispheres</h1>
                <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '20px' }}>Latitude and longitude together are a place's two <b style={{ color: '#0E3556' }}>coordinates</b>. With them you can locate anywhere — for example, <b style={{ color: '#0E3556' }}>Delhi lies at ~29°N, 77°E</b>.</p>
                
                <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '20px', boxShadow: '0 4px 12px rgba(14,42,69,.05)' }}>
                  <div style={{ fontSize: '15px', lineHeight: 1.55, color: '#3a3a66' }}>
                    All the parallels and meridians together form a <b style={{ color: '#0E3556' }}>grid</b> (grid lines) over the globe.
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ flex: 1, background: '#fdf4ff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #fbcfe8' }}>
                    <div style={{ fontSize: '13px', color: '#9d174d', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Equator Splits</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#be185d' }}>North / South</div>
                    <div style={{ fontSize: '12px', color: '#9d174d', marginTop: '4px' }}>Hemispheres</div>
                  </div>
                  <div style={{ flex: 1, background: '#f0fdfa', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: '13px', color: '#0f766e', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Prime Meridian Splits</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#0d9488' }}>West / East</div>
                    <div style={{ fontSize: '12px', color: '#0f766e', marginTop: '4px' }}>Hemispheres</div>
                  </div>
                </div>
              </div>

              <div className="explore-box" style={{ margin: 0 }}>✏️ <b style={{ color: '#1877a8' }}>Let's explore:</b> use a globe or atlas to note the latitude and longitude of Mumbai, Kolkata, Singapore and Paris — then check them with the buttons on the right.</div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1.18, background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: '0 16px 40px rgba(14,42,69,.12)' }}>
          {activeTab === 'co' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
              
              {/* STAGE 1 */}
              {coStage === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeIn 0.3s', minHeight: 0 }}>
                  <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px', minHeight: 0 }}>
                    {renderChessboard({ highlightSquare: 'd2', highlightCol: 'd', highlightRow: '2' })}
                  </div>
                  <div className="readout" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0E3556', marginBottom: '8px' }}>Every Square Has an Address</div>
                    <div style={{ fontSize: '14px', color: '#5c6b7a', marginBottom: '16px' }}>A chessboard uses <b style={{color: '#0E3556'}}>letters</b> and <b style={{color: '#0E3556'}}>numbers</b> to identify every square.</div>
                    
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #d6e0ec' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 'bold', textTransform: 'uppercase' }}>Column</span>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#F5A623' }}>d</span>
                      </div>
                      <div style={{ fontSize: '20px', color: '#9fbdd8', fontWeight: 'bold' }}>+</div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 'bold', textTransform: 'uppercase' }}>Row</span>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#F5A623' }}>2</span>
                      </div>
                      <div style={{ fontSize: '20px', color: '#9fbdd8', fontWeight: 'bold' }}>=</div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 'bold', textTransform: 'uppercase' }}>Address</span>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#0E3556' }}>d2</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button className="chip active" style={{ padding: '10px 20px', fontSize: '14px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556' }} onClick={() => setCoStage(2)}>Next →</button>
                  </div>
                </div>
              )}

              {/* STAGE 2 */}
              {coStage === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeIn 0.3s', minHeight: 0 }}>
                  <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px', minHeight: 0 }}>
                    {renderChessboard({ 
                      interactive: true,
                      highlightSquare: missionFb === 'success' ? (missionStep === 0 ? 'd2' : missionStep === 1 ? 'h6' : 'b4') : null,
                      highlightCol: missionFb === 'success' ? (missionStep === 0 ? 'd' : missionStep === 1 ? 'h' : 'b') : null,
                      highlightRow: missionFb === 'success' ? (missionStep === 0 ? '2' : missionStep === 1 ? '6' : '4') : null,
                      onSquareClick: (sq) => {
                        const target = missionStep === 0 ? 'd2' : missionStep === 1 ? 'h6' : 'b4';
                        if (sq === target) {
                          setMissionFb('success');
                          setTimeout(() => {
                            setMissionFb(null);
                            if (missionStep < 2) {
                              setMissionStep(s => s + 1);
                            } else {
                              setCoStage(3);
                            }
                          }, 1500);
                        }
                      }
                    })}
                  </div>
                  <div className="readout" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0E3556', marginBottom: '8px' }}>Let's Find Some Squares</div>
                    
                    {!missionFb && (
                      <div style={{ fontSize: '16px', color: '#5c6b7a' }}>
                        Mission {missionStep + 1} of 3: Find <b style={{ fontSize: '20px', color: '#0E3556' }}>{missionStep === 0 ? 'd2' : missionStep === 1 ? 'h6' : 'b4'}</b>
                      </div>
                    )}
                    {missionFb === 'success' && (
                      <div style={{ fontSize: '16px', color: '#12a15f', fontWeight: 'bold' }}>
                        Great! {missionStep === 0 ? 'd2' : missionStep === 1 ? 'h6' : 'b4'} means Column {missionStep === 0 ? 'd' : missionStep === 1 ? 'h' : 'b'}, Row {missionStep === 0 ? '2' : missionStep === 1 ? '6' : '4'}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
                    <button className="chip" style={{ padding: '10px 20px', fontSize: '14px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => { if (missionStep > 0) setMissionStep(s => s - 1); else setCoStage(1); }}>← Back</button>
                  </div>
                </div>
              )}

              {/* STAGE 3 */}
              {coStage === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeIn 0.3s', minHeight: 0 }}>
                  <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px', minHeight: 0 }}>
                    {renderChessboard({ showPieces: true, arrow: { from: 'd2', to: 'd4' } })}
                  </div>
                  <div className="readout" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0E3556', marginBottom: '12px' }}>How Do Chess Players Write Their Moves?</div>
                    
                    <div style={{ fontSize: '15px', color: '#5c6b7a', lineHeight: 1.5, marginBottom: '12px' }}>
                      Instead of drawing the move, players simply write <b style={{ color: '#0E3556' }}>d2 → d4</b>.
                    </div>
                    <div style={{ fontSize: '14px', color: '#5c6b7a', lineHeight: 1.5 }}>
                      This tells us exactly <b>where the piece started</b> and <b>where it moved</b>.
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
                    <button className="chip" style={{ padding: '10px 20px', fontSize: '14px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => setCoStage(2)}>← Back</button>
                    <button className="chip active" style={{ padding: '10px 20px', fontSize: '14px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556' }} onClick={() => setCoStage(4)}>How Does This Help Us Read Maps? →</button>
                  </div>
                </div>
              )}



              {/* STAGE 4 */}
              {coStage === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeIn 0.3s', minHeight: 0, justifyContent: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0E3556', textAlign: 'center', marginTop: '10px', marginBottom: '16px' }}>How Does This Help Us Read Maps?</div>
                  
                  <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
                    <div style={{ flex: 1, background: '#f4f7fb', borderRadius: '16px', border: '1px solid #e4ebf3', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0E3556', marginBottom: '16px' }}>Chess</div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: 'bold', color: '#5c6b7a', fontSize: '14px' }}>
                        <span>Column</span>
                        <span style={{ color: '#9fbdd8' }}>+</span>
                        <span>Row</span>
                      </div>
                      <div style={{ fontSize: '20px', color: '#9fbdd8', margin: '8px 0' }}>↓</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#F5A623' }}>d4</div>
                    </div>

                    <div style={{ flex: 1, background: '#f4f7fb', borderRadius: '16px', border: '1px solid #e4ebf3', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0E3556', marginBottom: '16px' }}>Maps</div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: 'bold', color: '#5c6b7a', fontSize: '14px' }}>
                        <span>Longitude</span>
                        <span style={{ color: '#9fbdd8' }}>+</span>
                        <span>Latitude</span>
                      </div>
                      <div style={{ fontSize: '20px', color: '#9fbdd8', margin: '8px 0' }}>↓</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#1877a8' }}>Location</div>
                    </div>
                  </div>

                  <div className="readout" style={{ marginTop: '16px', textAlign: 'center', padding: '12px 16px' }}>
                    <div style={{ fontSize: '15px', color: '#0E3556', lineHeight: 1.5 }}>
                      Chess uses <b>letters and numbers</b> to locate a square.<br/>
                      Maps use <b>latitude and longitude</b> to locate places on Earth.<br/>
                      <span style={{ color: '#1877a8', fontWeight: 'bold', display: 'block', marginTop: '8px', fontSize: '16px' }}>Both use coordinates to find an exact location.</span>
                    </div>
                  </div>

                  <div style={{ background: '#eef3ff', borderRadius: '12px', padding: '12px 16px', border: '1px solid #dce4ff', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#7c5cff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>You discovered</div>
                      <div style={{ fontSize: '14px', color: '#3a3a66', fontWeight: 500 }}>how coordinates help us find exact locations.</div>
                    </div>
                    <div style={{ background: '#7c5cff', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px' }}>
                      Coordinates Explorer
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
                    <button className="chip" style={{ padding: '12px 24px', fontSize: '16px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => setCoStage(3)}>← Back</button>
                    <button className="chip active" style={{ padding: '12px 24px', fontSize: '16px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556' }} onClick={() => setActiveTab('lat')}>
                      Continue → Latitude & Longitude
                    </button>
                  </div>
                  <div className="work" style={{ marginTop: '16px', textAlign: 'center' }}>Latitude (N/S) + Longitude (E/W) locate any point uniquely on Earth.</div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'lat' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px' }}>
                {renderLatGlobe()}
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Latitude (drag)</label>
                <input type="range" style={{ width: '100%', accentColor: '#7c5cff' }} min="-90" max="90" value={latVal} onChange={e => setLatVal(Number(e.target.value))} />
              </div>
              <div className="readout">
                <div className="big">Latitude <span>{Math.abs(latVal)}°{latVal > 0 ? 'N' : latVal < 0 ? 'S' : ''}</span></div>
                <div style={{ marginTop: '8px' }}>
                  <span className={`badge ${getClimate(latVal)[1]}`}>{getClimate(latVal)[0]}</span>
                  <span className="badge b-hemi">{latVal > 0 ? 'Northern' : latVal < 0 ? 'Southern' : 'Equator'} Hemisphere</span>
                </div>
                <div className="work">The parallel of latitude is a circle; it shrinks as you move toward a pole (width = R·cos {Math.abs(latVal)}°).</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button className="chip" style={{ padding: '10px 20px', fontSize: '14px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => setActiveTab('co')}>← Back to Coordinates</button>
                <button className="chip active" style={{ padding: '10px 20px', fontSize: '14px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556' }} onClick={() => setActiveTab('lon')}>Continue → Longitude</button>
              </div>
            </div>
          )}

          {activeTab === 'lon' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px' }}>
                {renderLonGlobe()}
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Longitude (drag)</label>
                <input type="range" style={{ width: '100%', accentColor: '#7c5cff' }} min="-180" max="180" value={lonVal} onChange={e => { setLonVal(Number(e.target.value)); setLonName(''); }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#5c6b7a', fontWeight: 600 }}>Round figures:</span>
                <button className="chip" onClick={() => { setLonVal(-74); setLonName('New York'); }}>New York 74°W</button>
                <button className="chip" onClick={() => { setLonVal(77); setLonName('Delhi'); }}>Delhi 77°E</button>
                <button className="chip" onClick={() => { setLonVal(140); setLonName('Tokyo'); }}>Tokyo 140°E</button>
              </div>
              <div className="readout">
                <div className="big">Longitude <span>{Math.abs(lonVal) === 180 ? '180°' : `${Math.abs(lonVal)}°${lonVal > 0 ? 'E' : lonVal < 0 ? 'W' : ''}`}</span>{lonName && ` · ${lonName}`}</div>
                <div style={{ marginTop: '8px' }}>
                  <span className="badge b-hemi">{lonVal > 0 ? 'Eastern' : lonVal < 0 ? 'Western' : 'Prime Meridian'} Hemisphere</span>
                </div>
                <div className="work">Measured from the Prime Meridian (0°) along the Equator, up to 180°. West or East add the W/E tag; 180°W and 180°E are the same line.</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button className="chip" style={{ padding: '10px 20px', fontSize: '14px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => setActiveTab('lat')}>← Back to Latitude</button>
                <button className="chip active" style={{ padding: '10px 20px', fontSize: '14px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556' }} onClick={() => setActiveTab('grid')}>Continue → Grid</button>
              </div>
            </div>
          )}

          {activeTab === 'grid' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px' }}>
                {renderGrid()}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Latitude</label>
                  <input type="range" style={{ width: '100%', accentColor: '#7c5cff' }} min="-90" max="90" value={gridLat} onChange={e => { setGridLat(Number(e.target.value)); setGridName(''); }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Longitude</label>
                  <input type="range" style={{ width: '100%', accentColor: '#7c5cff' }} min="-180" max="180" value={gridLon} onChange={e => { setGridLon(Number(e.target.value)); setGridName(''); }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#5c6b7a' }}>Let's explore — find these cities:</span>
                <button className="chip" onClick={() => { setGridLat(29); setGridLon(77); setGridName('Delhi'); }}>Delhi</button>
                <button className="chip" onClick={() => { setGridLat(19); setGridLon(73); setGridName('Mumbai'); }}>Mumbai</button>
                <button className="chip" onClick={() => { setGridLat(22); setGridLon(88); setGridName('Kolkata'); }}>Kolkata</button>
                <button className="chip" onClick={() => { setGridLat(1); setGridLon(104); setGridName('Singapore'); }}>Singapore</button>
                <button className="chip" onClick={() => { setGridLat(49); setGridLon(2); setGridName('Paris'); }}>Paris</button>
              </div>
              <div className="readout">
                <div className="big"><span>{Math.abs(gridLat)}°{gridLat >= 0 ? 'N' : 'S'}, {Math.abs(gridLon)}°{gridLon >= 0 ? 'E' : 'W'}</span>{gridName && ` · ${gridName}`}</div>
                <div style={{ marginTop: '8px' }}>
                  <span className="badge b-hemi">{gridLat > 0 ? 'Northern' : gridLat < 0 ? 'Southern' : 'Equator'} Hemisphere</span>
                  <span className="badge b-hemi">{gridLon > 0 ? 'Eastern' : gridLon < 0 ? 'Western' : 'Prime Meridian'} Hemisphere</span>
                  <span className={`badge ${getClimate(gridLat)[1]}`}>{getClimate(gridLat)[0]}</span>
                </div>
                <div className="work">Two coordinates pin the spot on the grid. Latitude sign → N/S hemisphere; longitude sign → E/W hemisphere.</div>
              </div>
            </div>
          )}

          <div style={{ flexGrow: 1 }} />
          {/* Next Activity Button */}
          {allCompleted && (
            <div style={{ marginTop: '16px', animation: 'fadeIn 0.4s' }}>
              <button onClick={onNextActivity} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
                Next Activity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
