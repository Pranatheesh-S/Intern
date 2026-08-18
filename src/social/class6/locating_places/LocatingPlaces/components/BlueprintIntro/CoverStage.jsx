import React, { useState, useRef, useCallback, useEffect } from 'react';
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

const COUNTRIES = [
  { id: 'india',  name: 'India',          city: 'New Delhi', lat: 28.6,  lon: 77.2,  flag: '🇮🇳' },
  { id: 'uk',     name: 'United Kingdom', city: 'London',    lat: 51.5,  lon: -0.1,  flag: '🇬🇧' },
  { id: 'japan',  name: 'Japan',          city: 'Tokyo',     lat: 35.7,  lon: 139.7, flag: '🇯🇵' },
  { id: 'brazil', name: 'Brazil',         city: 'Brasília',  lat: -15.8, lon: -47.9, flag: '🇧🇷' }
];

const lonToX = lon => 150 + (lon / 180) * 138;
const latToY = lat => 150 - (lat / 90) * 138;
const clampNum = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rad = d => (d * Math.PI) / 180;

function useDrag(onMove) {
  const ref = useRef(null);
  const dragging = useRef(false);

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
  const [countryIdx, setCountryIdx] = useState(0);

  // Automatically cycle through all 4 country target coordinates within the 8.0s animation (2.0s per country)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountryIdx(prev => (prev + 1) % COUNTRIES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeCountry = COUNTRIES[countryIdx];
  const targetX = lonToX(activeCountry.lon);
  const targetY = latToY(activeCountry.lat);

  const [p, setP] = useState({ x: targetX, y: targetY });

  // Smooth lerp movement animation towards target country coordinates
  useEffect(() => {
    let animFrame;
    const animate = () => {
      setP(prev => {
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        if (Math.hypot(dx, dy) < 0.1) return { x: targetX, y: targetY };
        return { x: prev.x + dx * 0.10, y: prev.y + dy * 0.10 };
      });
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [targetX, targetY]);

  const { ref, handlers } = useDrag(np => {
    setP({ x: clampNum(np.x, 12, 288), y: clampNum(np.y, 12, 288) });
  });

  const lat = ((150 - p.y) / 138) * 90;
  const lon = ((p.x - 150) / 138) * 180;

  // Check if current pin is near any of the 4 countries
  const matchedCountry = COUNTRIES.find(c => {
    const cx = lonToX(c.lon);
    const cy = latToY(c.lat);
    return Math.hypot(cx - p.x, cy - p.y) < 16;
  });

  const snapToCountry = (c) => {
    const idx = COUNTRIES.findIndex(item => item.id === c.id);
    if (idx !== -1) setCountryIdx(idx);
    setP({ x: lonToX(c.lon), y: latToY(c.lat) });
  };

  return (
    <>
      {/* 4 COUNTRY QUICK SELECT BUTTONS */}
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', padding: '6px 8px 0', flexWrap: 'wrap' }}>
        {COUNTRIES.map(c => {
          const isSelected = matchedCountry?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => snapToCountry(c)}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                border: isSelected ? '1px solid #F5A623' : '1px solid rgba(127,208,240,0.3)',
                background: isSelected ? 'rgba(245,166,35,0.22)' : 'rgba(6,32,53,0.7)',
                color: isSelected ? '#F5A623' : 'rgba(234,246,251,0.85)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

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

        {/* Primary Axes: Equator (0° Lat) & Prime Meridian (0° Lon) */}
        <line x1="8" y1="150" x2="292" y2="150" stroke="#F5A623" strokeWidth="1.7" opacity=".8" />
        <line x1="150" y1="8" x2="150" y2="292" stroke="#F5A623" strokeWidth="1.7" opacity=".8" />
        
        {/* Accurate Axis & Grid Labels */}
        <text x="14" y="144" fontSize="11" fill="#7FD0F0" opacity=".85" fontFamily="monospace" letterSpacing="1">EQUATOR · 0°</text>
        <text x="150" y="20" fontSize="10" fill="#F5A623" opacity=".9" textAnchor="middle" fontFamily="monospace" fontWeight="700">0° MERIDIAN</text>
        <text x="12" y="20" fontSize="10" fill="rgba(127,208,240,0.65)" fontFamily="monospace">90°N · 180°W</text>
        <text x="288" y="20" fontSize="10" fill="rgba(127,208,240,0.65)" textAnchor="end" fontFamily="monospace">90°N · 180°E</text>
        <text x="12" y="286" fontSize="10" fill="rgba(127,208,240,0.65)" fontFamily="monospace">90°S · 180°W</text>
        <text x="288" y="286" fontSize="10" fill="rgba(127,208,240,0.65)" textAnchor="end" fontFamily="monospace">90°S · 180°E</text>

        <g stroke="rgba(127,208,240,.55)" strokeWidth="1.4" fill="none">
          <path d="M8 26 V8 H26" /><path d="M274 8 H292 V26" />
          <path d="M292 274 V292 H274" /><path d="M26 292 H8 V274" />
        </g>

        {/* 4 COUNTRY TARGET MARKERS ON GRID */}
        {COUNTRIES.map(c => {
          const cx = lonToX(c.lon);
          const cy = latToY(c.lat);
          const isTargeted = matchedCountry?.id === c.id;
          return (
            <g key={c.id} onClick={(e) => { e.stopPropagation(); snapToCountry(c); }} cursor="pointer">
              <circle cx={cx} cy={cy} r="12" fill="none" stroke={isTargeted ? "#F5A623" : "rgba(127,208,240,0.5)"} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={cx} cy={cy} r="4" fill={isTargeted ? "#F5A623" : "#7FD0F0"} />
              <text x={cx} y={cy - 8} fontSize="11" fill={isTargeted ? "#F5A623" : "#7FD0F0"} textAnchor="middle" fontFamily="monospace" fontWeight="600">
                {c.name}
              </text>
            </g>
          );
        })}

        {/* ACTIVE CROSSHAIRS */}
        <line x1={p.x} y1="8" x2={p.x} y2="292" stroke="#7FD0F0" strokeWidth="1" strokeDasharray="4 5" opacity=".9" />
        <line x1="8" y1={p.y} x2="292" y2={p.y} stroke="#7FD0F0" strokeWidth="1" strokeDasharray="4 5" opacity=".9" />

        {/* ACTIVE PIN */}
        <circle cx={p.x} cy={p.y} r="30" fill="url(#cs-pinglow)" />
        <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#F5A623" strokeWidth="1.4" opacity=".7">
          <animate attributeName="r" values="10;22;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".75;0;.75" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={p.x} cy={p.y} r="7.5" fill="#F5A623" stroke="#062033" strokeWidth="2.2" />
        <circle cx={p.x - 2} cy={p.y - 2.5} r="2" fill="#fff" opacity=".7" />
      </svg>

      <Readout
        text={`◎ ${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}${
          matchedCountry ? ` — ${matchedCountry.flag} ${matchedCountry.name.toUpperCase()}` : ''
        }`}
        hint={matchedCountry ? `${matchedCountry.name} (${matchedCountry.city})` : "Drag pin to target coordinates or click country buttons"}
      />
    </>
  );
}

/* ── 2. spin the globe ─────────────────────────────────────────── */
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
  const [sun, setSun] = useState(0); // 0° = Noon at Prime Meridian
  const [isPlaying, setIsPlaying] = useState(true);

  // Animation loop: advances sun position continuously across 24h cycle
  useEffect(() => {
    if (!isPlaying) return;
    let animationFrameId;
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      // Advance sun position: 360° in 48 seconds = 7.5° per sec (smooth & gentle)
      setSun(prev => {
        let next = prev - delta * 7.5;
        if (next < -180) next += 360;
        return next;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const { ref, handlers } = useDrag(np => {
    setIsPlaying(false);
    setSun(clampNum(((np.x - 4) / 292) * 360 - 180, -180, 180));
  });

  const xOf = lon => 4 + ((lon + 180) / 360) * 292;

  // Local time in hours at longitude `lon`
  const getTimeObjAt = lon => {
    let h = 12 + (lon - sun) / 15;
    h = ((h % 24) + 24) % 24;
    const hr = Math.floor(h);
    const mins = Math.floor((h - hr) * 60);
    const suffix = hr < 12 ? 'AM' : 'PM';
    const dispHr = hr % 12 === 0 ? 12 : hr % 12;
    return {
      totalHours: h,
      dispHr,
      mins,
      suffix,
      formattedStr: `${dispHr}:${mins < 10 ? '0' : ''}${mins} ${suffix}`,
      shortStr: `${dispHr} ${suffix}`
    };
  };

  const primeMeridianTime = getTimeObjAt(0);
  const hour0 = primeMeridianTime.totalHours; // 0..24

  // Sun brightness curve (0.0 at night, up to 1.0 at 12 PM Noon)
  // Peak brightness at hour 12 (Noon), zero at night (hour <= 4 or hour >= 20)
  let brightness = 0;
  if (hour0 >= 4 && hour0 <= 12) {
    brightness = (hour0 - 4) / 8; // 0 at 4 AM -> 1.0 at 12 PM
  } else if (hour0 > 12 && hour0 <= 20) {
    brightness = (20 - hour0) / 8; // 1.0 at 12 PM -> 0 at 8 PM
  }

  // Is Day vs Night for celestial body display at Prime Meridian / current sun lon
  const isDaytime = hour0 >= 5.5 && hour0 <= 18.5;

  // Star visibility: 0 in middle of day, 1.0 deep night
  let starOpacity = 0;
  if (hour0 <= 5) {
    starOpacity = 1.0 - hour0 / 5;
  } else if (hour0 >= 19) {
    starOpacity = (hour0 - 19) / 5;
  }

  // Fixed star data
  const starData = [
    { x: 18, y: 78, size: 1.5, delay: '0s', isCross: true },
    { x: 42, y: 115, size: 1.0, delay: '0.7s', isCross: false },
    { x: 68, y: 88, size: 2.2, delay: '1.2s', isCross: true },
    { x: 95, y: 140, size: 1.2, delay: '0.4s', isCross: false },
    { x: 120, y: 75, size: 1.8, delay: '1.8s', isCross: false },
    { x: 145, y: 110, size: 2.5, delay: '0.2s', isCross: true },
    { x: 165, y: 155, size: 1.0, delay: '1.5s', isCross: false },
    { x: 190, y: 82, size: 2.0, delay: '0.9s', isCross: true },
    { x: 215, y: 125, size: 1.2, delay: '2.1s', isCross: false },
    { x: 240, y: 72, size: 1.6, delay: '0.5s', isCross: false },
    { x: 265, y: 148, size: 2.2, delay: '1.1s', isCross: true },
    { x: 282, y: 95, size: 1.0, delay: '1.7s', isCross: false },
    { x: 30, y: 180, size: 1.5, delay: '0.3s', isCross: false },
    { x: 78, y: 205, size: 2.0, delay: '1.4s', isCross: true },
    { x: 135, y: 190, size: 1.2, delay: '0.8s', isCross: false },
    { x: 180, y: 215, size: 1.8, delay: '2.3s', isCross: false },
    { x: 230, y: 195, size: 2.4, delay: '0.6s', isCross: true },
    { x: 275, y: 210, size: 1.2, delay: '1.9s', isCross: false },
  ];

  return (
    <>
      <style>{`
        @keyframes cs-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes cs-sunpulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .cs-star { animation: cs-twinkle 2.5s ease-in-out infinite; transform-origin: center; }
        .cs-sun-glow { animation: cs-sunpulse 3s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <svg ref={ref} viewBox="0 0 300 300" {...handlers}
           style={{ flex: 1, minHeight: 0, width: '100%', display: 'block', cursor: 'ew-resize', touchAction: 'none' }}>
        <defs>
          <linearGradient id="cs-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040d1a" />
            <stop offset="100%" stopColor="#020812" />
          </linearGradient>

          <radialGradient id="cs-day" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFD000" stopOpacity={0.15 + brightness * 0.55} />
            <stop offset="50%" stopColor="#F5A623" stopOpacity={0.08 + brightness * 0.3} />
            <stop offset="100%" stopColor="#7FD0F0" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cs-sunglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF59D" stopOpacity={0.9} />
            <stop offset="40%" stopColor="#FFC107" stopOpacity={0.65} />
            <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cs-moonglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>

          <clipPath id="cs-strip"><rect x="4" y="60" width="292" height="175" rx="14" /></clipPath>
        </defs>

        <rect x="4" y="60" width="292" height="175" rx="14" fill="url(#cs-night)" stroke="rgba(127,208,240,.45)" strokeWidth="1.5" />

        <g clipPath="url(#cs-strip)">
          {/* STARS (Visible in Evening & Night) */}
          {starOpacity > 0.02 && (
            <g opacity={starOpacity}>
              {starData.map((st, i) => (
                <g key={i} className="cs-star" style={{ animationDelay: st.delay }}>
                  {st.isCross ? (
                    <path
                      d={`M ${st.x} ${st.y - st.size * 2} Q ${st.x} ${st.y} ${st.x + st.size * 2} ${st.y} Q ${st.x} ${st.y} ${st.x} ${st.y + st.size * 2} Q ${st.x} ${st.y} ${st.x - st.size * 2} ${st.y} Z`}
                      fill="#EAF6FB"
                    />
                  ) : (
                    <circle cx={st.x} cy={st.y} r={st.size} fill="#EAF6FB" />
                  )}
                </g>
              ))}
            </g>
          )}

          {/* DAYLIGHT ELLIPSE OVER MAP */}
          <ellipse cx={xOf(sun)} cy="147.5" rx="160" ry="135" fill="url(#cs-day)" />

          {/* Longitude grid lines */}
          {[-180,-120,-60,0,60,120,180].map(l => (
            <line key={l} x1={xOf(l)} y1="60" x2={xOf(l)} y2="235" stroke="rgba(127,208,240,.20)" strokeWidth="1" />
          ))}
          <line x1={xOf(0)} y1="60" x2={xOf(0)} y2="235" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 5" opacity=".85" />
        </g>

        <rect x="4" y="60" width="292" height="175" rx="14" fill="none" stroke="rgba(127,208,240,.45)" strokeWidth="1.5" />
        <text x={xOf(0)} y="52" fontSize="14" fill="#F5A623" textAnchor="middle" fontFamily="monospace" fontWeight="700">0°</text>

        {/* CELESTIAL BODY: SUN or MOON */}
        <g transform={`translate(${xOf(sun)}, 34)`} cursor="pointer">
          {isDaytime ? (
            /* SUN (Bigger with radiant glow) */
            <g className="cs-sun-glow">
              {/* Outer Corona Glow (scaled by sun brightness) */}
              <circle r={32 + brightness * 12} fill="url(#cs-sunglow)" opacity={0.6 + brightness * 0.4} />
              
              {/* Radiant Sun Beams */}
              <g stroke="#FFC107" strokeWidth="2" strokeLinecap="round" opacity={0.7 + brightness * 0.3}>
                <path d="M0 -22 v-6" /><path d="M0 22 v6" /><path d="M-22 0 h-6" /><path d="M22 0 h6" />
                <path d="M-15 -15 l-4 -4" /><path d="M15 15 l4 4" /><path d="M15 -15 l4 -4" /><path d="M-15 15 l-4 4" />
              </g>

              {/* Core Sun Circle (Bigger: r=15) */}
              <circle r="15" fill="#FFE082" stroke="#F5A623" strokeWidth="2" />
              <circle cx="-4" cy="-4" r="4" fill="#FFF" opacity="0.8" />
            </g>
          ) : (
            /* MOON (Glowing Crescent Moon & Ethereal Blue Glow) */
            <g className="cs-sun-glow">
              {/* Lunar Halo Glow */}
              <circle r="36" fill="url(#cs-moonglow)" opacity="0.85" />

              {/* Moon Core Base */}
              <circle r="15" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.8" />

              {/* Crescent Shadow Mask */}
              <circle cx="6" cy="-4" r="13" fill="#062033" />

              {/* Subtle Crater highlights */}
              <circle cx="-6" cy="4" r="2.2" fill="#CBD5E1" opacity="0.7" />
              <circle cx="-2" cy="8" r="1.5" fill="#CBD5E1" opacity="0.6" />
              <circle cx="-8" cy="-3" r="1.8" fill="#CBD5E1" opacity="0.6" />
            </g>
          )}
        </g>

        <line x1={xOf(sun)} y1="46" x2={xOf(sun)} y2="60" stroke={isDaytime ? "#F5A623" : "#38BDF8"} strokeWidth="1.5" opacity=".8" />

        {/* LONGITUDE TIME LABELS */}
        {[-120,-60,0,60,120].map(l => {
          const tObj = getTimeObjAt(l);
          return (
            <g key={l}>
              <text x={xOf(l)} y="252" fontSize="13" fill="#7FD0F0" textAnchor="middle" fontFamily="monospace" fontWeight="600">
                {Math.abs(l)}°{l === 0 ? '' : l > 0 ? 'E' : 'W'}
              </text>
              <text x={xOf(l)} y="270" fontSize="13" fill={l === 0 ? "#F5A623" : "#EAF6FB"} textAnchor="middle" fontFamily="monospace" fontWeight="700">
                {tObj.shortStr}
              </text>
            </g>
          );
        })}
      </svg>

      <Readout
        text={`◎ 0° TIME: ${primeMeridianTime.formattedStr} · ${
          isDaytime
            ? `SUN BRIGHTNESS: ${Math.round(brightness * 100)}%`
            : 'NIGHT TIME · MOON & STARS VISIBLE'
        }`}
        hint="Animating 24-hour cycle · Drag celestial body to adjust time"
      />
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
  const [modeIndex, setModeIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const MODES_KEYS = ['plot', 'globe', 'sun'];

  // Smoothly auto-switch modes across all 3 modes every 24.0 seconds total (8.0s per mode, exactly 4 × 2.0s for the 4 places)
  useEffect(() => {
    let animFrame;
    let lastTime = performance.now();

    const updateTimer = (now) => {
      const delta = now - lastTime;
      lastTime = now;
      setElapsedMs(prev => {
        const next = (prev + delta) % 24000;
        const newModeIdx = Math.floor((next / 24000) * 3) % 3;
        setModeIndex(newModeIdx);
        return next;
      });
      animFrame = requestAnimationFrame(updateTimer);
    };

    animFrame = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const handleModeSelect = (mId) => {
    const idx = MODES_KEYS.indexOf(mId);
    if (idx !== -1) {
      setModeIndex(idx);
      setElapsedMs(idx * (24000 / 3));
    }
  };

  const currentMode = MODES_KEYS[modeIndex];
  const progressPct = (elapsedMs / 24000) * 100;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 'min(54vh, 520px)', justifySelf: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {MODES.map(m => {
            const on = m.id === currentMode;
            return (
              <button key={m.id} type="button" onClick={() => handleModeSelect(m.id)}
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 'clamp(12px, .75vw, 13px)',
                  letterSpacing: '.12em',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: `1px solid ${on ? '#F5A623' : 'rgba(255,255,255,.22)'}`,
                  background: on ? 'rgba(245,166,35,.22)' : 'transparent',
                  color: on ? '#F5A623' : 'rgba(234,246,251,.7)',
                  boxShadow: on ? '0 0 12px rgba(245,166,35,0.3)' : 'none',
                  transition: 'all .2s'
                }}>
                {m.label}
              </button>
            );
          })}
        </div>

        {/* 8-SECOND SHOWCASE CONTINUOUS PROGRESS BAR */}
        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: '#F5A623', boxShadow: '0 0 8px #F5A623', transition: 'width 0.05s linear' }} />
        </div>
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
        {currentMode === 'plot' && <Plotter />}
        {currentMode === 'globe' && <Globe />}
        {currentMode === 'sun' && <DayNight />}
      </div>
    </div>
  );
}
