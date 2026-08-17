import React, { useState, useRef, useCallback } from 'react';
import Globe3D from '../Globe3D';

/**
 * The cover's interactive stage. Three small toys, one per idea the chapter
 * teaches — plot a coordinate, spin the globe, move the sun — so a student is
 * already doing geography before they open the chapter.
 */

const MODES = [
  { id: 'plot',  label: 'PLOT A POINT' },
  { id: 'globe', label: 'SPIN THE GLOBE' },
  { id: 'sun',   label: 'DAY & NIGHT' }
];

const CITIES = [
  { name: 'Delhi',     lat: 28.6,  lon: 77.2 },
  { name: 'Greenwich', lat: 51.5,  lon: 0 },
  { name: 'Tokyo',     lat: 35.7,  lon: 139.7 },
  { name: 'Nairobi',   lat: -1.3,  lon: 36.8 }
];

const clampNum = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rad = d => (d * Math.PI) / 180;

function useDrag(onMove) {
  const ref = useRef(null);
  const dragging = useRef(false);

  // map the pointer into the svg's own coordinates — getScreenCTM accounts for
  // the letterboxing that preserveAspectRatio introduces, which a plain
  // bounding-box ratio does not
  const point = useCallback(e => {
    const el = ref.current;
    if (!el) return null;
    if (el.getScreenCTM && el.createSVGPoint) {
      const m = el.getScreenCTM();
      if (m) {
        const sp = el.createSVGPoint();
        sp.x = e.clientX; sp.y = e.clientY;
        const r = sp.matrixTransform(m.inverse());
        return { x: r.x, y: r.y };
      }
    }
    const r = el.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 300, y: ((e.clientY - r.top) / r.height) * 300 };
  }, []);

  const down = e => { dragging.current = true; el_capture(e); const p = point(e); if (p) onMove(p); };
  const move = e => { if (!dragging.current) return; const p = point(e); if (p) onMove(p); };
  const up = () => { dragging.current = false; };
  const el_capture = e => { if (e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} } };

  return { ref, handlers: { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerLeave: up } };
}

/* ── 1. plot a point ───────────────────────────────────────────── */
function Plotter() {
  const [p, setP] = useState({ x: 186, y: 118 });
  const { ref, handlers } = useDrag(np => setP({ x: clampNum(np.x, 12, 288), y: clampNum(np.y, 12, 288) }));

  const lat = ((150 - p.y) / 138) * 90;
  const lon = ((p.x - 150) / 138) * 180;

  return (
    <>
      <svg ref={ref} viewBox="0 0 300 300" {...handlers}
           style={{ flex: 1, minHeight: 0, width: '100%', display: 'block', cursor: 'grab', touchAction: 'none' }}>
        <defs>
          <radialGradient id="cs-sheetglow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#7FD0F0" stopOpacity=".14" /><stop offset="100%" stopColor="#7FD0F0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cs-pinglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5A623" stopOpacity=".55" /><stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="8" y="8" width="284" height="284" rx="10" fill="url(#cs-sheetglow)" />
        <g stroke="rgba(127,208,240,.13)" strokeWidth=".7">
          {[20,40,60,80,100,120,140,160,180,200,220,240,260,280].map(v => <line key={`fh${v}`} x1="8" y1={v} x2="292" y2={v} />)}
          {[20,40,60,80,100,120,140,160,180,200,220,240,260,280].map(v => <line key={`fv${v}`} x1={v} y1="8" x2={v} y2="292" />)}
        </g>
        <g stroke="rgba(127,208,240,.30)" strokeWidth="1">
          {[30,60,90,120,180,210,240,270].map(v => <line key={`h${v}`} x1="8" y1={v} x2="292" y2={v} />)}
          {[30,60,90,120,180,210,240,270].map(v => <line key={`v${v}`} x1={v} y1="8" x2={v} y2="292" />)}
        </g>

        <line x1="8" y1="150" x2="292" y2="150" stroke="#F5A623" strokeWidth="1.7" opacity=".8" />
        <line x1="150" y1="8" x2="150" y2="292" stroke="#F5A623" strokeWidth="1.7" opacity=".8" />
        <text x="14" y="144" fontSize="14" fill="#7FD0F0" opacity=".85" fontFamily="monospace" letterSpacing="1">EQUATOR</text>
        <text x="156" y="20" fontSize="14" fill="#7FD0F0" opacity=".85" fontFamily="monospace" letterSpacing="1">0°</text>

        <g stroke="rgba(127,208,240,.55)" strokeWidth="1.4" fill="none">
          <path d="M8 26 V8 H26" /><path d="M274 8 H292 V26" />
          <path d="M292 274 V292 H274" /><path d="M26 292 H8 V274" />
        </g>

        <line x1={p.x} y1="8" x2={p.x} y2="292" stroke="#7FD0F0" strokeWidth="1" strokeDasharray="4 5" opacity=".9" />
        <line x1="8" y1={p.y} x2="292" y2={p.y} stroke="#7FD0F0" strokeWidth="1" strokeDasharray="4 5" opacity=".9" />
        <circle cx={p.x} cy={p.y} r="30" fill="url(#cs-pinglow)" />
        <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#F5A623" strokeWidth="1.4" opacity=".7">
          <animate attributeName="r" values="10;22;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".75;0;.75" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={p.x} cy={p.y} r="7.5" fill="#F5A623" stroke="#062033" strokeWidth="2.2" />
        <circle cx={p.x - 2} cy={p.y - 2.5} r="2" fill="#fff" opacity=".7" />
      </svg>
      <Readout text={`◎ ${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`}
               hint="Drag the pin to plot a place" />
    </>
  );
}

/* ── 2. spin the globe ─────────────────────────────────────────── */
// coarse continent outlines in (lat, lon); projected orthographically so they
// turn with the globe instead of sitting on it like stickers
const LAND = [
  [[35,-6],[37,10],[32,32],[30,32],[15,40],[12,44],[0,42],[-12,40],[-25,33],[-34,26],[-34,18],[-22,14],[-10,13],[0,9],[5,-4],[10,-15],[20,-17],[28,-13]],
  [[36,-9],[43,-9],[48,-5],[50,2],[58,5],[62,5],[70,25],[66,35],[60,30],[55,38],[45,40],[41,29],[37,15]],
  [[41,29],[45,40],[55,60],[70,80],[72,110],[68,140],[60,160],[52,140],[43,132],[35,127],[30,122],[22,110],[10,105],[8,98],[15,95],[22,90],[20,72],[8,77],[23,68],[25,60],[30,48],[37,35]],
  [[70,-160],[68,-140],[60,-140],[55,-130],[48,-125],[38,-122],[32,-117],[23,-106],[18,-95],[20,-88],[30,-83],[35,-76],[45,-67],[50,-56],[60,-64],[66,-80],[70,-95],[70,-130]],
  [[10,-75],[0,-80],[-10,-77],[-20,-70],[-35,-72],[-50,-72],[-55,-68],[-40,-62],[-30,-52],[-20,-40],[-5,-35],[5,-52],[10,-62]],
  [[-12,131],[-11,142],[-20,148],[-28,153],[-38,146],[-35,138],[-32,128],[-22,114],[-15,124]]
];

function landPaths(rot, R, CX, CY) {
  const out = [];
  LAND.forEach((ring, i) => {
    let run = [];
    const push = () => { if (run.length > 1) out.push(`${i}-${out.length}|M` + run.map(q => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L') + ' Z'); run = []; };
    ring.concat([ring[0]]).forEach(([lat, lon]) => {
      const la = rad(lat), lo = rad(lon - rot);
      if (Math.cos(la) * Math.cos(lo) > 0) run.push([CX + R * Math.cos(la) * Math.sin(lo), CY - R * Math.sin(la)]);
      else push();
    });
    push();
  });
  return out;
}
function Globe() {
  return (
    <>
      <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Globe3D currentTask={0} />
      </div>
      <Readout text="◎ 3D GLOBE · SPIN THE EARTH" hint="Drag to rotate the 3D Earth, scroll to zoom" />
    </>
  );
}

/* ── 3. day and night ──────────────────────────────────────────── */
function DayNight() {
  const [sun, setSun] = useState(20);
  const { ref, handlers } = useDrag(np => setSun(clampNum(((np.x - 4) / 292) * 360 - 180, -180, 180)));

  const xOf = lon => 4 + ((lon + 180) / 360) * 292;
  const timeAt = lon => {
    let h = 12 + (lon - sun) / 15;
    h = ((h % 24) + 24) % 24;
    const hr = Math.floor(h);
    const suffix = hr < 12 ? 'AM' : 'PM';
    const disp = hr % 12 === 0 ? 12 : hr % 12;
    return `${disp} ${suffix}`;
  };

  return (
    <>
      <svg ref={ref} viewBox="0 0 300 300" {...handlers}
           style={{ flex: 1, minHeight: 0, width: '100%', display: 'block', cursor: 'ew-resize', touchAction: 'none' }}>
        <defs>
          <linearGradient id="cs-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a2b47" /><stop offset="100%" stopColor="#041824" />
          </linearGradient>
          <radialGradient id="cs-day" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F5A623" stopOpacity=".42" /><stop offset="70%" stopColor="#F5A623" stopOpacity=".12" /><stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cs-sunglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD27A" stopOpacity=".85" /><stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </radialGradient>
          <clipPath id="cs-strip"><rect x="4" y="60" width="292" height="175" rx="14" /></clipPath>
        </defs>

        <rect x="4" y="60" width="292" height="175" rx="14" fill="url(#cs-night)" stroke="rgba(127,208,240,.45)" strokeWidth="1.5" />
        <g clipPath="url(#cs-strip)">
          {[[20,85],[56,120],[84,78],[128,145],[168,90],[202,135],[238,82],[276,128],[44,178],[108,198],[218,196],[284,182]].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={i % 3 === 0 ? 1.5 : 1} fill="#EAF6FB" opacity={0.25 + (i % 4) * 0.14} />
          ))}
          <ellipse cx={xOf(sun)} cy="147.5" rx="145" ry="125" fill="url(#cs-day)" />
          {[-180,-120,-60,0,60,120,180].map(l => (
            <line key={l} x1={xOf(l)} y1="60" x2={xOf(l)} y2="235" stroke="rgba(127,208,240,.20)" strokeWidth="1" />
          ))}
          <line x1={xOf(0)} y1="60" x2={xOf(0)} y2="235" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 5" opacity=".85" />
        </g>
        <rect x="4" y="60" width="292" height="175" rx="14" fill="none" stroke="rgba(127,208,240,.45)" strokeWidth="1.5" />
        <text x={xOf(0)} y="52" fontSize="14" fill="#F5A623" textAnchor="middle" fontFamily="monospace" fontWeight="700">0°</text>

        <g transform={`translate(${xOf(sun)},34)`}>
          <circle r="26" fill="url(#cs-sunglow)" />
          <circle r="10" fill="#FFC454" stroke="#062033" strokeWidth="1.6" />
          <circle cx="-3" cy="-3" r="2.8" fill="#fff" opacity=".7" />
          <g stroke="#F5A623" strokeWidth="1.6" strokeLinecap="round" opacity=".8">
            <path d="M0 -15 v-5" /><path d="M0 15 v5" /><path d="M-15 0 h-5" /><path d="M15 0 h5" />
          </g>
        </g>
        <line x1={xOf(sun)} y1="46" x2={xOf(sun)} y2="60" stroke="#F5A623" strokeWidth="1.5" opacity=".8" />

        {[-120,-60,0,60,120].map(l => (
          <g key={l}>
            <text x={xOf(l)} y="252" fontSize="14" fill="#7FD0F0" textAnchor="middle" fontFamily="monospace" fontWeight="600">
              {Math.abs(l)}°{l === 0 ? '' : l > 0 ? 'E' : 'W'}
            </text>
            <text x={xOf(l)} y="270" fontSize="14" fill="#EAF6FB" textAnchor="middle" fontFamily="monospace" fontWeight="700">
              {timeAt(l)}
            </text>
          </g>
        ))}
      </svg>
      <Readout text={`◎ SUN OVER ${Math.abs(Math.round(sun))}°${sun >= 0 ? 'E' : 'W'} · NOON THERE`}
               hint="Drag the sun — every 15° is one hour" />
    </>
  );
}

function Readout({ text, hint }) {
  return (
    <div style={{ flexShrink: 0, textAlign: 'center', pointerEvents: 'none', padding: '2px 8px 8px' }}>
      <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, 1vw, 14px)', letterSpacing: '.08em', color: '#F5A623' }}>{text}</div>
      <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(14px, .8vw, 14px)', letterSpacing: '.1em', color: 'rgba(234,246,251,.55)', marginTop: '3px' }}>{hint}</div>
    </div>
  );
}

export default function CoverStage() {
  const [mode, setMode] = useState('plot');

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 'min(54vh, 520px)', justifySelf: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        {MODES.map(m => {
          const on = m.id === mode;
          return (
            <button key={m.id} type="button" onClick={() => setMode(m.id)}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 'clamp(14px, .78vw, 14px)',
                letterSpacing: '.12em',
                padding: '7px 10px',
                borderRadius: '999px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: `1px solid ${on ? '#F5A623' : 'rgba(255,255,255,.22)'}`,
                background: on ? 'rgba(245,166,35,.16)' : 'transparent',
                color: on ? '#F5A623' : 'rgba(234,246,251,.7)',
                transition: 'all .2s'
              }}>
              {m.label}
            </button>
          );
        })}
      </div>

      <div style={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: '14px',
        border: '1px solid rgba(127,208,240,.28)',
        background: 'rgba(6,32,53,.35)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {mode === 'plot' && <Plotter />}
        {mode === 'globe' && <Globe />}
        {mode === 'sun' && <DayNight />}
      </div>
    </div>
  );
}
