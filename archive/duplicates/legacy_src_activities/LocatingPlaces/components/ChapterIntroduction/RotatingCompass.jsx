import React, { useState, useEffect, useRef } from 'react';
import { Compass, RotateCw, Play, Pause } from 'lucide-react';

const CARDINALS = [
  { label: 'NORTH', deg: 0, abbr: 'N' },
  { label: 'NORTH EAST', deg: 45, abbr: 'NE' },
  { label: 'EAST', deg: 90, abbr: 'E' },
  { label: 'SOUTH EAST', deg: 135, abbr: 'SE' },
  { label: 'SOUTH', deg: 180, abbr: 'S' },
  { label: 'SOUTH WEST', deg: 225, abbr: 'SW' },
  { label: 'WEST', deg: 270, abbr: 'W' },
  { label: 'NORTH WEST', deg: 315, abbr: 'NW' }
];

export default function RotatingCompass() {
  const [targetDeg, setTargetDeg] = useState(0);
  const [currentDeg, setCurrentDeg] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const [cardinalIdx, setCardinalIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const compassRef = useRef(null);

  // Auto-cycle through cardinal bearings every 2.4s
  useEffect(() => {
    if (!isAuto || isDragging) return;
    const interval = setInterval(() => {
      setCardinalIdx(prev => {
        const next = (prev + 1) % CARDINALS.length;
        setTargetDeg(CARDINALS[next].deg);
        return next;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [isAuto, isDragging]);

  // Smooth lerp physics movement with shortest rotation path
  useEffect(() => {
    let animFrame;
    const animate = () => {
      setCurrentDeg(prev => {
        let diff = (targetDeg - prev) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        if (Math.abs(diff) < 0.2) return targetDeg;
        return prev + diff * 0.12;
      });
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [targetDeg]);

  // Helper to format degree bearing and heading text
  const displayDeg = Math.round((currentDeg % 360 + 360) % 360);
  const getBearingAbbr = (deg) => {
    const idx = Math.round(deg / 45) % 8;
    return CARDINALS[idx].abbr;
  };

  // Pointer drag logic to rotate needle manually
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAuto(false);
    updateAngleFromEvent(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateAngleFromEvent(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateAngleFromEvent = (e) => {
    if (!compassRef.current) return;
    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX == null || clientY == null) return;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let rad = Math.atan2(dy, dx);
    let deg = (rad * 180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    setTargetDeg(Math.round(deg));
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'space-between',
      background: 'radial-gradient(130% 120% at 50% 20%, #FFFDF9, #F7F1E2)',
      borderRadius: '16px',
      border: '1px solid #F2DFBC',
      padding: '14px 16px',
      boxSizing: 'border-box',
      boxShadow: '0 6px 20px rgba(60,40,20,0.06)',
      position: 'relative',
      userSelect: 'none'
    }}>
      {/* Top Bearing Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        width: '100%',
        padding: '6px 12px',
        background: '#FAF6EE',
        border: '1px solid #E5D5C0',
        borderRadius: '10px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="#B45309" />
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: '13px', color: '#2C1A0E', letterSpacing: '.06em' }}>
            BEARING: <span style={{ color: '#B45309' }}>{displayDeg}° {getBearingAbbr(displayDeg)}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAuto(!isAuto)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isAuto ? '#B45309' : '#0A2540',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
        >
          {isAuto ? <Pause size={12} /> : <Play size={12} />}
          {isAuto ? 'AUTO SPIN' : 'MANUAL'}
        </button>
      </div>

      {/* Main Vintage Compass Dial Plate */}
      <div
        ref={compassRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 0',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
      >
        <svg
          viewBox="0 0 300 300"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: 'min(50vh, 380px)',
            maxHeight: 'min(50vh, 380px)',
            aspectRatio: '1',
            filter: 'drop-shadow(0 12px 28px rgba(60,40,20,0.22))'
          }}
        >
          <defs>
            {/* Outer Brass Bezel Gradient */}
            <radialGradient id="brassBezel" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF2D4" />
              <stop offset="35%" stopColor="#E3B359" />
              <stop offset="70%" stopColor="#A87425" />
              <stop offset="100%" stopColor="#5E3C0C" />
            </radialGradient>
            
            {/* Parchment Dial Surface */}
            <radialGradient id="parchmentFace" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="75%" stopColor="#F7EED8" />
              <stop offset="100%" stopColor="#EADBBD" />
            </radialGradient>

            {/* Needle North Crimson Gradient */}
            <linearGradient id="needleNorth" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EE4444" />
              <stop offset="50%" stopColor="#C92A2A" />
              <stop offset="100%" stopColor="#9B1C1C" />
            </linearGradient>

            {/* Needle South Steel Gradient */}
            <linearGradient id="needleSouth" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Brass Center Cap */}
            <radialGradient id="goldCap" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
          </defs>

          {/* Outer Brass Rim & Screw Accents */}
          <circle cx="150" cy="150" r="146" fill="url(#brassBezel)" stroke="#3D2305" strokeWidth="2" />
          <circle cx="150" cy="150" r="136" fill="#42290A" />
          <circle cx="150" cy="150" r="132" fill="url(#brassBezel)" />
          <circle cx="150" cy="150" r="124" fill="url(#parchmentFace)" stroke="#8C5C1E" strokeWidth="2" />

          {/* Degree Ticks Ring (36 Ticks every 10°) */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const rad = (angle - 90) * (Math.PI / 180);
            const isMajor = i % 9 === 0;
            const isMedium = i % 3 === 0;
            const r1 = 120;
            const r2 = isMajor ? 106 : isMedium ? 112 : 115;
            const x1 = 150 + r1 * Math.cos(rad);
            const y1 = 150 + r1 * Math.sin(rad);
            const x2 = 150 + r2 * Math.cos(rad);
            const y2 = 150 + r2 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? '#B45309' : isMedium ? '#8C5C1E' : '#BFA475'}
                strokeWidth={isMajor ? 2.5 : isMedium ? 1.5 : 1}
              />
            );
          })}

          {/* Compass Rose Star (16-Point Nautical Star) */}
          <g transform="translate(150,150) scale(0.9)">
            {/* Primary Cardinal Points (N, E, S, W) */}
            {[0, 90, 180, 270].map(rot => (
              <g key={rot} transform={`rotate(${rot})`}>
                <polygon points="0,0 -12,-90 0,-102" fill="#B45309" />
                <polygon points="0,0 12,-90 0,-102" fill="#D79A2B" />
              </g>
            ))}
            {/* Secondary Points (NE, SE, SW, NW) */}
            {[45, 135, 225, 315].map(rot => (
              <g key={rot} transform={`rotate(${rot})`}>
                <polygon points="0,0 -8,-65 0,-76" fill="#8C5C1E" opacity="0.85" />
                <polygon points="0,0 8,-65 0,-76" fill="#CBB38B" opacity="0.85" />
              </g>
            ))}
          </g>

          {/* Dial Cardinal Labels (N, E, S, W) - Extra Bold */}
          <text x="150" y="44" textAnchor="middle" dominantBaseline="middle" fill="#B45309" stroke="#B45309" strokeWidth="0.8" fontFamily="'Space Grotesk', system-ui, sans-serif" fontWeight="900" fontSize="28">N</text>
          <text x="258" y="150" textAnchor="middle" dominantBaseline="middle" fill="#1E293B" stroke="#1E293B" strokeWidth="0.8" fontFamily="'Space Grotesk', system-ui, sans-serif" fontWeight="900" fontSize="26">E</text>
          <text x="150" y="258" textAnchor="middle" dominantBaseline="middle" fill="#1E293B" stroke="#1E293B" strokeWidth="0.8" fontFamily="'Space Grotesk', system-ui, sans-serif" fontWeight="900" fontSize="26">S</text>
          <text x="42" y="150" textAnchor="middle" dominantBaseline="middle" fill="#1E293B" stroke="#1E293B" strokeWidth="0.8" fontFamily="'Space Grotesk', system-ui, sans-serif" fontWeight="900" fontSize="26">W</text>
          
          {/* Degree Numbers for N, E, S, W */}
          <text x="150" y="60" textAnchor="middle" fill="#8C5C1E" fontFamily="monospace" fontSize="10" fontWeight="700">0°</text>
          <text x="238" y="150" textAnchor="middle" dominantBaseline="middle" fill="#8C5C1E" fontFamily="monospace" fontSize="10" fontWeight="700">90°</text>
          <text x="150" y="240" textAnchor="middle" fill="#8C5C1E" fontFamily="monospace" fontSize="10" fontWeight="700">180°</text>
          <text x="62" y="150" textAnchor="middle" dominantBaseline="middle" fill="#8C5C1E" fontFamily="monospace" fontSize="10" fontWeight="700">270°</text>

          {/* DUAL-ENDED MAGNETIC COMPASS NEEDLE (ROTATES) */}
          <g transform={`translate(150, 150) rotate(${currentDeg})`}>
            {/* Shadow under needle */}
            <g transform="translate(3, 4)" opacity="0.3">
              <polygon points="0,-115 -11,0 0,15" fill="#000" />
              <polygon points="0,-115 11,0 0,15" fill="#000" />
              <polygon points="0,115 -11,0 0,-15" fill="#000" />
              <polygon points="0,115 11,0 0,-15" fill="#000" />
            </g>

            {/* NORTH TIP (Crimson Red) */}
            <polygon points="0,-116 -12,0 0,-12" fill="url(#needleNorth)" />
            <polygon points="0,-116 12,0 0,-12" fill="#EF4444" />
            <text x="0" y="-68" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" stroke="#ffffff" strokeWidth="0.6" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="15">N</text>

            {/* SOUTH TIP (Dark Steel) */}
            <polygon points="0,116 -12,0 0,12" fill="url(#needleSouth)" />
            <polygon points="0,116 12,0 0,12" fill="#475569" />
            <text x="0" y="72" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" stroke="#ffffff" strokeWidth="0.6" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="15">S</text>

            {/* Central Brass Pivot Cap */}
            <circle cx="0" cy="0" r="16" fill="url(#goldCap)" stroke="#452608" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#FFF9E6" opacity="0.9" />
          </g>
        </svg>
      </div>

      {/* Quick Cardinal Direction Select Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
        {[
          { label: 'NORTH', deg: 0 },
          { label: 'EAST', deg: 90 },
          { label: 'SOUTH', deg: 180 },
          { label: 'WEST', deg: 270 }
        ].map((item) => {
          const active = displayDeg >= item.deg - 20 && displayDeg <= item.deg + 20;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setTargetDeg(item.deg);
                setIsAuto(false);
              }}
              style={{
                background: active ? '#B45309' : '#FFFDF9',
                color: active ? '#ffffff' : '#2C1A0E',
                border: active ? '1.5px solid #B45309' : '1.5px solid #E5D5C0',
                borderRadius: '10px',
                padding: '8px 4px',
                fontSize: '12px',
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: active ? '0 4px 12px rgba(180,83,9,0.3)' : 'none'
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
