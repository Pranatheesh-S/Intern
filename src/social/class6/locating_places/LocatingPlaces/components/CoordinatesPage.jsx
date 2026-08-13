import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Ticket } from 'lucide-react';
import worldMapUrl from './world-map.jpg';
import { WorldMapPath } from './WorldMapPath';
import ChapterBackFooter from './ChapterBackFooter';
import { ScrollableWithNav } from './ContentScrollNav';

function getClimate(lat) {
  const a = Math.abs(lat);
  return a <= 23.5 ? ['Torrid (hot)', 'b-torrid'] : a <= 66.5 ? ['Temperate (moderate)', 'b-temperate'] : ['Frigid (cold)', 'b-frigid'];
}

export default function CoordinatesPage({ onNextActivity, onBack }) {
  const [activeTab, setActiveTab] = useState('co');
  
  // Theatre state
  const [theatreStep, setTheatreStep] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [clickedSeat, setClickedSeat] = useState(null);
  const [seatFeedback, setSeatFeedback] = useState(null); // 'success' or 'error'
  const targetSeats = ['C5', 'E2']; // 2 tickets
  const currentTarget = targetSeats[theatreStep] || null;

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
  const [exploredCities, setExploredCities] = useState({ Delhi: false, Mumbai: false, Kolkata: false, Singapore: false, Paris: false });

  useEffect(() => {
    if (theatreStep === 2) setCompletedActivities(p => ({ ...p, co: true }));
  }, [theatreStep]);

  useEffect(() => {
    if (latVal !== 0) setCompletedActivities(p => ({ ...p, lat: true }));
  }, [latVal]);

  useEffect(() => {
    if (lonVal !== 0) setCompletedActivities(p => ({ ...p, lon: true }));
  }, [lonVal]);

  useEffect(() => {
    if (Object.values(exploredCities).every(Boolean)) setCompletedActivities(p => ({ ...p, grid: true }));
  }, [exploredCities]);

  // The user might skip interacting with some tabs, so we only strictly require the final grid activity to show "Next Activity"
  const allCompleted = completedActivities.grid;

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

        if (isTarget) {
          squares.push(
            <g key={`${sqName}-target`} style={{ pointerEvents: 'none' }}>
              <rect x={ox + f * sz} y={oy + r * sz} width={sz} height={sz} fill="none" stroke="#fff" strokeWidth="2" />
              <rect x={ox + f * sz + 1} y={oy + r * sz + 1} width={sz - 2} height={sz - 2} fill="none" stroke="#d94a3d" strokeWidth="2" />
              <circle cx={ox + f * sz + sz/2} cy={oy + r * sz + sz/2} r="12" fill="#d94a3d">
                <animate attributeName="r" values="10;15;10" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={ox + f * sz + sz/2} cy={oy + r * sz + sz/2} r="5" fill="#fff" />
              <circle cx={ox + f * sz + sz/2} cy={oy + r * sz + sz/2} r="2" fill="#d94a3d" />
            </g>
          );
        }
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
    const cx = 300, cy = 300, R = 250;
    const rad = Math.PI / 180;
    
    const getLatParams = (lat) => {
      const rx = R * Math.cos(lat * rad);
      const ry = rx * 0.25; 
      const y = cy - R * Math.sin(lat * rad);
      return { rx, ry, y };
    };

    const generateLatPath = (lat, front=true) => {
      const { rx, ry, y } = getLatParams(lat);
      if (rx < 0.1) return ''; 
      return front 
        ? `M ${cx - rx} ${y} A ${rx} ${ry} 0 0 0 ${cx + rx} ${y}`
        : `M ${cx + rx} ${y} A ${rx} ${ry} 0 0 0 ${cx - rx} ${y}`;
    };

    const parallelsFront = [-60, -30, 30, 60].map(f => (
      <path key={`pf${f}`} d={generateLatPath(f, true)} fill="none" stroke="#7dd3fc" strokeWidth={1.5} opacity={0.8} filter="url(#glowLight)" />
    ));
    const parallelsBack = [-60, -30, 30, 60].map(f => (
      <path key={`pb${f}`} d={generateLatPath(f, false)} fill="none" stroke="#7dd3fc" strokeWidth={1} opacity={0.3} strokeDasharray="4 6" />
    ));

    const eq = getLatParams(0);
    const highlightParams = getLatParams(latVal);

    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', marginTop: '20px', marginBottom: '40px' }}>
        <style>{`
          @keyframes earthSpin {
            from { transform: translateX(0px); }
            to { transform: translateX(-1000px); }
          }
        `}</style>
        <svg viewBox="0 0 600 660" style={{ width: '100%', height: 'auto', maxHeight: '70vh' }}>
          <defs>
            <radialGradient id="oceanGradLat" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4189d9" />
              <stop offset="50%" stopColor="#1a5b9e" />
              <stop offset="85%" stopColor="#0a2a52" />
              <stop offset="100%" stopColor="#031024" />
            </radialGradient>
            
            <radialGradient id="specularLight" cx="25%" cy="25%" r="45%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <filter id="glowLight">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="atmosGlowLat">
              <feGaussianBlur stdDeviation="5"/>
            </filter>

            <filter id="dropShadowFilter">
              <feGaussianBlur stdDeviation="12"/>
            </filter>

            <clipPath id="globeClipLat">
              <circle cx={cx} cy={cy} r={R} />
            </clipPath>
          </defs>

          {/* Soft Shadow */}
          <ellipse cx={cx} cy={cy + R + 35} rx={R * 0.8} ry="18" fill="#000000" opacity="0.25" filter="url(#dropShadowFilter)" />

          {/* Atmosphere Bloom */}
          <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#7dd3fc" strokeWidth="8" opacity="0.3" filter="url(#atmosGlowLat)" />
          <circle cx={cx} cy={cy} r={R + 1} fill="none" stroke="#e0f2fe" strokeWidth="2" opacity="0.5" />

          {/* Base Ocean */}
          <circle cx={cx} cy={cy} r={R} fill="url(#oceanGradLat)" />

          {/* Continents */}
          <g clipPath="url(#globeClipLat)">
            <g transform="translate(-200, 50)">
              <g style={{ animation: 'earthSpin 40s linear infinite' }}>
                <path d={WorldMapPath} fill="#2ea85c" opacity="0.25" stroke="#1c6b39" strokeWidth="0.8" />
                <path d={WorldMapPath} fill="#2ea85c" opacity="0.25" stroke="#1c6b39" strokeWidth="0.8" transform="translate(1000, 0)" />
              </g>
            </g>
          </g>

          {/* Back Parallels */}
          {parallelsBack}
          <path d={generateLatPath(0, false)} fill="none" stroke="#ef4444" strokeWidth={1.5} opacity={0.3} strokeDasharray="4 6" />

          {/* Front Parallels */}
          {parallelsFront}
          
          {/* Equator */}
          <path d={generateLatPath(0, true)} fill="none" stroke="#ff5c5c" strokeWidth={3} filter="url(#glowLight)" />
          <path d={generateLatPath(0, true)} fill="none" stroke="#ffb3b3" strokeWidth={1} />
          
          {/* Highlighted Latitude */}
          {Math.abs(latVal) !== 0 && (
            <>
              <path d={generateLatPath(latVal, false)} fill="none" stroke="#F5A623" strokeWidth={1.5} opacity={0.4} strokeDasharray="4 6" style={{ transition: 'all 0.3s ease-out' }} />
              <path d={generateLatPath(latVal, true)} fill="none" stroke="#F5A623" strokeWidth={3.5} filter="url(#glowLight)" style={{ transition: 'all 0.3s ease-out' }} />
              <path d={generateLatPath(latVal, true)} fill="none" stroke="#fef08a" strokeWidth={1.5} style={{ transition: 'all 0.3s ease-out' }} />
            </>
          )}

          {/* Specular Lighting Overlay (adds volume above continents and lines) */}
          <circle cx={cx} cy={cy} r={R} fill="url(#specularLight)" style={{ pointerEvents: 'none' }} />
          
          {/* North Pole */}
          <circle cx={cx} cy={cy - R} r="5" fill="#fff" stroke="#12a15f" strokeWidth="2.5" filter="url(#glowLight)" />
          <text x={cx} y={cy - R - 14} fontSize="14" fontWeight="900" fill="#12a15f" textAnchor="middle">90°N</text>
          
          {/* South Pole */}
          <circle cx={cx} cy={cy + R} r="5" fill="#fff" stroke="#2f6df0" strokeWidth="2.5" filter="url(#glowLight)" />
          <text x={cx} y={cy + R + 22} fontSize="14" fontWeight="900" fill="#2f6df0" textAnchor="middle">90°S</text>
          
          {/* Equator Label */}
          <text x={cx + eq.rx + 12} y={eq.y + 14} fontSize="15" fontWeight="900" fill="#ef4444" textAnchor="start" filter="url(#glowLight)">0° Equator</text>

          {/* Highlight Label */}
          {Math.abs(latVal) !== 0 && (
            <text 
              x={cx - highlightParams.rx - 16} 
              y={highlightParams.y + highlightParams.ry + 8} 
              fontSize="16" 
              fontWeight="900" 
              fill="#F5A623" 
              textAnchor="end"
              filter="url(#glowLight)"
              style={{ transition: 'all 0.3s ease-out' }}
            >
              {Math.abs(latVal)}° {latVal > 0 ? 'N' : 'S'}
            </text>
          )}
        </svg>
      </div>
    );
  };

  const renderLonGlobe = () => {
    const cx = 300, cy = 300, R = 250;
    const rad = Math.PI / 180;

    const getLonPath = (lon, isFront=true) => {
      const rx = Math.abs(R * Math.sin(lon * rad));
      if (rx < 0.1) {
        return isFront ? `M ${cx} ${cy - R} L ${cx} ${cy + R}` : `M ${cx} ${cy - R} L ${cx} ${cy + R}`;
      }
      const sweep = lon > 0 ? 1 : 0;
      return isFront 
        ? `M ${cx} ${cy - R} A ${rx} ${R} 0 0 ${sweep} ${cx} ${cy + R}`
        : `M ${cx} ${cy + R} A ${rx} ${R} 0 0 ${sweep} ${cx} ${cy - R}`;
    };

    const getLatParams = (lat) => {
      const rx = R * Math.cos(lat * rad);
      const ry = rx * 0.25; 
      const y = cy - R * Math.sin(lat * rad);
      return { rx, ry, y };
    };

    const eq = getLatParams(0);
    const generateLatPath = (lat, front=true) => {
      const { rx, ry, y } = getLatParams(lat);
      return front 
        ? `M ${cx - rx} ${y} A ${rx} ${ry} 0 0 0 ${cx + rx} ${y}`
        : `M ${cx + rx} ${y} A ${rx} ${ry} 0 0 0 ${cx - rx} ${y}`;
    };

    const meridiansFront = [-90, -60, -30, 30, 60, 90].map(l => (
      <path key={`mf${l}`} d={getLonPath(l, true)} fill="none" stroke="#7dd3fc" strokeWidth={1.5} opacity={0.8} filter="url(#glowLightLon)" />
    ));
    const meridiansBack = [-60, -30, 30, 60].map(l => (
      <path key={`mb${l}`} d={getLonPath(l, false)} fill="none" stroke="#7dd3fc" strokeWidth={1} opacity={0.3} strokeDasharray="4 6" />
    ));

    const shown = Math.max(-90, Math.min(90, lonVal));
    const hlX = cx + Math.sin(shown * rad) * R;

    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', marginTop: '20px', marginBottom: '40px' }}>
        <style>{`
          @keyframes earthSpinLon {
            from { transform: translateX(0px); }
            to { transform: translateX(-1000px); }
          }
        `}</style>
        <svg viewBox="0 0 600 660" style={{ width: '100%', height: 'auto', maxHeight: '70vh' }}>
          <defs>
            <radialGradient id="oceanGradLon" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4189d9" />
              <stop offset="50%" stopColor="#1a5b9e" />
              <stop offset="85%" stopColor="#0a2a52" />
              <stop offset="100%" stopColor="#031024" />
            </radialGradient>

            <radialGradient id="specularLightLon" cx="25%" cy="25%" r="45%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <filter id="glowLightLon">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="atmosGlowLon">
              <feGaussianBlur stdDeviation="5"/>
            </filter>

            <filter id="dropShadowFilterLon">
              <feGaussianBlur stdDeviation="12"/>
            </filter>

            <clipPath id="globeClipLon">
              <circle cx={cx} cy={cy} r={R} />
            </clipPath>
          </defs>

          {/* Soft Shadow */}
          <ellipse cx={cx} cy={cy + R + 35} rx={R * 0.8} ry="18" fill="#000000" opacity="0.25" filter="url(#dropShadowFilterLon)" />

          {/* Atmosphere Bloom */}
          <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#7dd3fc" strokeWidth="8" opacity="0.3" filter="url(#atmosGlowLon)" />
          <circle cx={cx} cy={cy} r={R + 1} fill="none" stroke="#e0f2fe" strokeWidth="2" opacity="0.5" />

          {/* Base Ocean */}
          <circle cx={cx} cy={cy} r={R} fill="url(#oceanGradLon)" />

          {/* Continents */}
          <g clipPath="url(#globeClipLon)">
            <g transform="translate(-200, 50)">
              <g style={{ animation: 'earthSpinLon 40s linear infinite' }}>
                <path d={WorldMapPath} fill="#2ea85c" opacity="0.25" stroke="#1c6b39" strokeWidth="0.8" />
                <path d={WorldMapPath} fill="#2ea85c" opacity="0.25" stroke="#1c6b39" strokeWidth="0.8" transform="translate(1000, 0)" />
              </g>
            </g>
          </g>

          {/* Back Equator */}
          <path d={generateLatPath(0, false)} fill="none" stroke="#ef4444" strokeWidth={1.5} opacity={0.3} strokeDasharray="4 6" />
          <path d={generateLatPath(0, true)} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.5} />

          {meridiansBack}
          {meridiansFront}
          
          {/* Prime Meridian */}
          <path d={getLonPath(0, false)} fill="none" stroke="#fcd34d" strokeWidth={1.5} opacity={0.4} strokeDasharray="4 6" />
          <path d={getLonPath(0, true)} fill="none" stroke="#fbbf24" strokeWidth={3.5} filter="url(#glowLightLon)" />
          <path d={getLonPath(0, true)} fill="none" stroke="#fef3c7" strokeWidth={1.5} />
          
          {/* Highlighted Longitude */}
          <path d={getLonPath(shown, false)} fill="none" stroke="#F5A623" strokeWidth={1.5} opacity={0.4} strokeDasharray="4 6" style={{ transition: 'all 0.3s ease-out' }} />
          <path d={getLonPath(shown, true)} fill="none" stroke="#F5A623" strokeWidth={3.5} filter="url(#glowLightLon)" style={{ transition: 'all 0.3s ease-out' }} />
          <path d={getLonPath(shown, true)} fill="none" stroke="#fef08a" strokeWidth={1.5} style={{ transition: 'all 0.3s ease-out' }} />

          {/* Specular Lighting */}
          <circle cx={cx} cy={cy} r={R} fill="url(#specularLightLon)" style={{ pointerEvents: 'none' }} />
          
          {/* North Pole */}
          <circle cx={cx} cy={cy - R} r="5" fill="#fff" stroke="#12a15f" strokeWidth="2.5" filter="url(#glowLightLon)" />
          <text x={cx} y={cy - R - 14} fontSize="14" fontWeight="900" fill="#12a15f" textAnchor="middle">90°N</text>
          
          {/* South Pole */}
          <circle cx={cx} cy={cy + R} r="5" fill="#fff" stroke="#2f6df0" strokeWidth="2.5" filter="url(#glowLightLon)" />
          <text x={cx} y={cy + R + 22} fontSize="14" fontWeight="900" fill="#2f6df0" textAnchor="middle">90°S</text>
          
          {/* Prime Meridian Label */}
          <text x={cx - 16} y={cy - R + 28} fontSize="15" fontWeight="900" fill="#fbbf24" textAnchor="end" filter="url(#glowLightLon)">0° Prime Meridian</text>
          <text x={cx + eq.rx + 12} y={eq.y + 6} fontSize="14" fontWeight="900" fill="#ef4444" textAnchor="start" opacity={0.7}>Equator</text>

          {/* Highlight Label */}
          <text 
            x={hlX + (shown >= 0 ? 14 : -14)} 
            y={cy + eq.ry + 24} 
            fontSize="16" 
            fontWeight="900" 
            fill="#F5A623" 
            textAnchor={shown >= 0 ? "start" : "end"}
            filter="url(#glowLightLon)"
            style={{ transition: 'all 0.3s ease-out' }}
          >
            {Math.abs(shown)}° {shown === 0 ? '' : (shown > 0 ? 'E' : 'W')}
          </text>
        </svg>
      </div>
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
      <svg viewBox="0 0 420 220" style={{ width: '100%', height: 'auto', maxHeight: '55vh', display: 'block', margin: '0 auto' }}>
        <rect x={X} y={Y} width={W} height={H} fill="#eaf3fb" stroke="#9fbdd8" />
        <image href={worldMapUrl} x={X} y={Y} width={W} height={H} preserveAspectRatio="none" opacity="0.65" />
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
        <text x={px} y={py - 12} fontSize="12" fontWeight="800" fill="#0E3556" textAnchor="middle" stroke="#fff" strokeWidth="3" paintOrder="stroke">{gridName}</text>
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
        <div style={{ flex: 0.82, background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRadius: '16px', boxShadow: '0 16px 40px rgba(14,42,69,.12)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ScrollableWithNav scrollStyle={{ padding: '24px' }}>
          {activeTab === 'co' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Big Question 2 · (a)</div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>Understanding coordinates</h1>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Imagine you are playing a game of chess.</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Every square on the chessboard has its own address.</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Instead of saying, <b style={{ color: '#0E3556' }}>"Move to the middle,"</b> players use a letter and a number, like <b style={{ color: '#0E3556' }}>d2</b> or <b style={{ color: '#0E3556' }}>e4</b>.</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '16px' }}>This tells everyone the exact square.</p>
              
              <div style={{ background: '#fff', padding: '24px 16px', borderRadius: '12px', border: '1px solid #d6e0ec', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {renderChessboard({ highlightSquare: 'd2', highlightCol: 'd', highlightRow: '2' })}
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#f4f7fb', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e4ebf3', marginTop: '20px' }}>
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

              <div style={{ background: '#ffeccb', borderLeft: '6px solid #F5A623', borderRadius: '12px', padding: '20px', fontSize: '18px', lineHeight: 1.6, color: '#7a5a2a', marginBottom: '20px' }}>
                Maps use the same idea.<br/><br/>
                <b>Latitude</b> and <b>longitude</b> also work as two coordinates that identify one exact place.
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
          </ScrollableWithNav>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1.18, background: '#fff', borderRadius: '16px', boxShadow: '0 16px 40px rgba(14,42,69,.12)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ScrollableWithNav scrollStyle={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'co' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0E3556', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Ticket size={24} color="#F5A623" />
                  Let's Explore — Find Your Seat
                </h2>
                {theatreStep < 2 && (
                  <div style={{ background: '#f4f7fb', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, color: '#5c6b7a', border: '1px solid #d6e0ec' }}>
                    Progress: {theatreStep} / 2
                  </div>
                )}
              </div>

              {theatreStep < 2 && (
                <div style={{ fontSize: '15px', color: '#5c6b7a', marginBottom: '24px' }}>
                  Use the seat ticket below to find the correct seat in the theatre.
                </div>
              )}

              {/* Theatre Illustration */}
              {theatreStep < 2 && (
                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {/* Screen */}
                  <div style={{ width: '70%', height: '30px', background: '#334155', borderRadius: '50% / 100% 100% 0 0', border: '3px solid #cbd5e1', borderBottom: 'none', boxShadow: '0 -4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '12px', letterSpacing: '0.4em', fontWeight: 800 }}>SCREEN</span>
                  </div>

                  {/* Seat Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(8, 40px)', gap: '12px 14px', alignItems: 'center', justifyItems: 'center' }}>
                    {/* Columns */}
                    <div />
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(c => (
                      <div key={`col-${c}`} style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>{c}</div>
                    ))}
                    
                    {/* Rows */}
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(r => {
                      const showRowHint = failedAttempts >= 2 && currentTarget?.startsWith(r);
                      
                      return (
                        <React.Fragment key={`row-${r}`}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: showRowHint ? '#F5A623' : '#94a3b8', paddingRight: '8px', transition: 'color 0.3s' }}>
                            {r}
                          </div>
                          
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(c => {
                            const seatId = `${r}${c}`;
                            const isTarget = seatId === currentTarget;
                            const isClicked = seatId === clickedSeat;
                            const showSeatHint = failedAttempts >= 4 && isTarget;
                            
                            let seatBg = '#475569';
                            let seatBottomBg = '#64748b';
                            let borderCol = '#334155';
                            let anim = '';
                            
                            if (isClicked && seatFeedback === 'success') {
                              seatBg = '#10b981';
                              seatBottomBg = '#34d399';
                              borderCol = '#059669';
                              anim = 'pulse';
                            } else if (isClicked && seatFeedback === 'error') {
                              seatBg = '#ef4444';
                              seatBottomBg = '#f87171';
                              borderCol = '#b91c1c';
                              anim = 'shake';
                            } else if (showRowHint) {
                              seatBg = '#cbd5e1';
                              seatBottomBg = '#e2e8f0';
                            }
                            
                            return (
                              <motion.div
                                key={seatId}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (seatFeedback) return;
                                  setClickedSeat(seatId);
                                  if (seatId === currentTarget) {
                                    setSeatFeedback('success');
                                    setFailedAttempts(0);
                                    setTimeout(() => {
                                      setSeatFeedback(null);
                                      setClickedSeat(null);
                                      setTheatreStep(s => s + 1);
                                    }, 2000);
                                  } else {
                                    setSeatFeedback('error');
                                    setFailedAttempts(f => f + 1);
                                    setTimeout(() => {
                                      setSeatFeedback(null);
                                      setClickedSeat(null);
                                    }, 800);
                                  }
                                }}
                                style={{
                                  position: 'relative',
                                  width: '36px', height: '36px',
                                  cursor: 'pointer',
                                  transform: 'perspective(300px) rotateX(15deg)',
                                }}
                                animate={
                                  anim === 'shake' ? { x: [-4, 4, -4, 4, 0] } :
                                  anim === 'pulse' ? { scale: [1, 1.15, 1], boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)' } : {}
                                }
                                transition={{ duration: anim === 'shake' ? 0.3 : 0.5 }}
                              >
                                {showSeatHint && !seatFeedback && (
                                  <motion.div 
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    style={{ position: 'absolute', inset: -4, borderRadius: '8px', border: '2px solid #F5A623', pointerEvents: 'none' }}
                                  />
                                )}
                                <div style={{
                                  position: 'absolute', top: 0, left: '10%', width: '80%', height: '60%',
                                  background: seatBg, borderRadius: '6px 6px 2px 2px',
                                  border: `1px solid ${borderCol}`, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)'
                                }} />
                                <div style={{
                                  position: 'absolute', bottom: '10%', left: 0, width: '100%', height: '40%',
                                  background: seatBottomBg, borderRadius: '4px',
                                  border: `1px solid ${borderCol}`, boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                              </motion.div>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Feedback and Ticket Panel */}
              {theatreStep < 2 && (
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Current Ticket */}
                  <motion.div 
                    key={currentTarget}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ position: 'relative', width: '160px', height: '80px', background: '#fff', border: `3px solid ${seatFeedback === 'success' ? '#10b981' : '#F5A623'}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}
                  >
                    <div style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', background: '#fff', borderRadius: '50%', borderRight: `3px solid ${seatFeedback === 'success' ? '#10b981' : '#F5A623'}`, zIndex: 2 }} />
                    <div style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', background: '#fff', borderRadius: '50%', borderLeft: `3px solid ${seatFeedback === 'success' ? '#10b981' : '#F5A623'}`, zIndex: 2 }} />
                    
                    <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#64748b', fontWeight: 800, marginBottom: '6px' }}>YOUR TICKET</div>
                    <div style={{ display: 'flex', gap: '12px', color: seatFeedback === 'success' ? '#10b981' : '#F5A623', fontWeight: 900, fontSize: '18px' }}>
                      <span>ROW {currentTarget?.[0]}</span>
                      <span>SEAT {currentTarget?.[1]}</span>
                    </div>
                  </motion.div>

                  {/* Feedback Message */}
                  <div style={{ flex: 1, background: seatFeedback === 'success' ? '#ecfdf5' : seatFeedback === 'error' ? '#fef2f2' : '#f8fafc', border: `1px solid ${seatFeedback === 'success' ? '#a7f3d0' : seatFeedback === 'error' ? '#fecaca' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
                    {seatFeedback === 'success' ? (
                      <>
                        <CheckCircle2 size={32} color="#10b981" />
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46', marginBottom: '4px' }}>Excellent!</div>
                          <div style={{ fontSize: '14px', color: '#047857' }}>You found <b>Row {currentTarget?.[0]}, Seat {currentTarget?.[1]}</b>. The row and seat number together identify one exact location.</div>
                        </div>
                      </>
                    ) : seatFeedback === 'error' ? (
                      <>
                        <XCircle size={32} color="#ef4444" />
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#991b1b', marginBottom: '4px' }}>Not quite.</div>
                          <div style={{ fontSize: '14px', color: '#b91c1c' }}>Look carefully. First find the correct row, then count the seat number.</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '16px' }}>👆</span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                          Click the correct seat inside the theatre.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE 3 (Completion) */}
              {theatreStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeIn 0.3s', minHeight: 0, justifyContent: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0E3556', textAlign: 'center', marginTop: '10px', marginBottom: '16px' }}>How Does This Help Us Read Maps?</div>
                  
                  <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
                    <div style={{ flex: 1, background: '#f4f7fb', borderRadius: '16px', border: '1px solid #e4ebf3', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0E3556', marginBottom: '16px' }}>Theatre</div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: 'bold', color: '#5c6b7a', fontSize: '14px' }}>
                        <span>Row</span>
                        <span style={{ color: '#9fbdd8' }}>+</span>
                        <span>Seat No.</span>
                      </div>
                      <div style={{ fontSize: '20px', color: '#9fbdd8', margin: '8px 0' }}>↓</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#F5A623' }}>Seat</div>
                    </div>

                    <div style={{ flex: 1, background: '#f4f7fb', borderRadius: '16px', border: '1px solid #e4ebf3', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0E3556', marginBottom: '16px' }}>Maps</div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: 'bold', color: '#5c6b7a', fontSize: '14px' }}>
                        <span>Latitude</span>
                        <span style={{ color: '#9fbdd8' }}>+</span>
                        <span>Longitude</span>
                      </div>
                      <div style={{ fontSize: '20px', color: '#9fbdd8', margin: '8px 0' }}>↓</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#1877a8' }}>Location</div>
                    </div>
                  </div>

                  <div className="readout" style={{ marginTop: '16px', textAlign: 'center', padding: '12px 16px' }}>
                    <div style={{ fontSize: '15px', color: '#0E3556', lineHeight: 1.5 }}>
                      Theatres use <b>rows and seat numbers</b> to locate a seat.<br/>
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
                    <button className="chip" style={{ padding: '12px 24px', fontSize: '16px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => setTheatreStep(1)}>← Back</button>
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
              
              {latVal === 0 && (
                <div style={{ background: '#fff9f0', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px', marginTop: '12px', color: '#b45309', fontSize: '13px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.3s' }}>
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>🌍</div>
                  <div><b style={{ color: '#d94a3d', fontSize: '14px' }}>The Equator (0°)</b><br/>The longest parallel of latitude. It divides the Earth perfectly into the Northern and Southern Hemispheres.</div>
                </div>
              )}
              {latVal === 90 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px', marginTop: '12px', color: '#166534', fontSize: '13px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.3s' }}>
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>❄️</div>
                  <div><b style={{ color: '#16a34a', fontSize: '14px' }}>The North Pole (90°N)</b><br/>The northernmost point on Earth. Here, the parallel shrinks to a single point!</div>
                </div>
              )}
              {latVal === -90 && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px', marginTop: '12px', color: '#1e3a8a', fontSize: '13px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.3s' }}>
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>🐧</div>
                  <div><b style={{ color: '#2563eb', fontSize: '14px' }}>The South Pole (90°S)</b><br/>The southernmost point on Earth. Like the North Pole, it is just a point, not a circle.</div>
                </div>
              )}

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

              {lonVal === 0 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px', marginTop: '12px', color: '#991b1b', fontSize: '13px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.3s' }}>
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>⏱️</div>
                  <div><b style={{ color: '#ef4444', fontSize: '14px' }}>The Prime Meridian (0°)</b><br/>The starting point for measuring longitude and time. It passes through Greenwich, London.</div>
                </div>
              )}
              {Math.abs(lonVal) === 180 && (
                <div style={{ background: '#f4f7fb', border: '1px solid #e4ebf3', borderRadius: '12px', padding: '12px', marginTop: '12px', color: '#5c6b7a', fontSize: '13px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.3s' }}>
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>📅</div>
                  <div><b style={{ color: '#0E3556', fontSize: '14px' }}>The 180° Meridian</b><br/>Exactly opposite the Prime Meridian. The International Date Line roughly follows this path!</div>
                </div>
              )}

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
                <button className="chip" onClick={() => { setGridLat(29); setGridLon(77); setGridName('Delhi'); setExploredCities(p => ({...p, Delhi: true})); }}>Delhi {exploredCities.Delhi && <span style={{color: '#16a34a'}}>✓</span>}</button>
                <button className="chip" onClick={() => { setGridLat(19); setGridLon(73); setGridName('Mumbai'); setExploredCities(p => ({...p, Mumbai: true})); }}>Mumbai {exploredCities.Mumbai && <span style={{color: '#16a34a'}}>✓</span>}</button>
                <button className="chip" onClick={() => { setGridLat(22); setGridLon(88); setGridName('Kolkata'); setExploredCities(p => ({...p, Kolkata: true})); }}>Kolkata {exploredCities.Kolkata && <span style={{color: '#16a34a'}}>✓</span>}</button>
                <button className="chip" onClick={() => { setGridLat(1); setGridLon(104); setGridName('Singapore'); setExploredCities(p => ({...p, Singapore: true})); }}>Singapore {exploredCities.Singapore && <span style={{color: '#16a34a'}}>✓</span>}</button>
                <button className="chip" onClick={() => { setGridLat(49); setGridLon(2); setGridName('Paris'); setExploredCities(p => ({...p, Paris: true})); }}>Paris {exploredCities.Paris && <span style={{color: '#16a34a'}}>✓</span>}</button>
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

          </ScrollableWithNav>
        </div>
      </div>
      <ChapterBackFooter
        onBack={onBack}
        nextLabel={allCompleted ? 'Next Activity' : undefined}
        onNext={allCompleted ? onNextActivity : undefined}
        nextVariant="blue"
      />
    </div>
  );
}
