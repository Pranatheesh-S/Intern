import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles, CheckSquare, Shield, HelpCircle, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage2_RegionRescue({ onComplete, addXp }) {
  // Pre-drawn polygon vertices forming a closed loop shape (fence/yard)
  const polygon = [
    { x: 320, y: 100 },
    { x: 520, y: 100 },
    { x: 650, y: 220 },
    { x: 550, y: 360 },
    { x: 380, y: 380 },
    { x: 200, y: 310 },
    { x: 180, y: 190 }
  ];

  // Draggable items initial positions (tray coordinates)
  const [bonePos, setBonePos] = useState({ x: 80, y: 120 });     // Target: Interior
  const [sensorPos, setSensorPos] = useState({ x: 80, y: 220 });   // Target: Boundary
  const [puddlePos, setPuddlePos] = useState({ x: 80, y: 320 });   // Target: Exterior

  const [activeDrag, setActiveDrag] = useState(null); // 'bone' | 'sensor' | 'puddle'
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Verification checks
  const [boneInInterior, setBoneInInterior] = useState(false);
  const [sensorOnBoundary, setSensorOnBoundary] = useState(false);
  const [puddleInExterior, setPuddleInExterior] = useState(false);

  const svgRef = useRef(null);

  // Convert page coordinates to SVG viewbox coords
  const getSVGCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
  };

  // Math: Point-in-Polygon Ray Casting algorithm
  const isPointInPolygon = (pt, vs) => {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x, yi = vs[i].y;
      const xj = vs[j].x, yj = vs[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y))
          && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Math: Perpendicular distance from point to segment
  const distToSegment = (p, v, w) => {
    const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
    if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt(Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) + Math.pow(p.y - (v.y + t * (w.y - v.y)), 2));
  };

  const isPointOnBoundary = (pt, vs) => {
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i];
      const w = vs[(i + 1) % vs.length];
      if (distToSegment(pt, v, w) < 22) { // 22px threshold for student friendliness
        return true;
      }
    }
    return false;
  };

  // Snapping: Find closest point on boundary
  const getClosestPointOnBoundary = (pt, vs) => {
    let minDist = Infinity;
    let closestPt = { x: pt.x, y: pt.y };
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i];
      const w = vs[(i + 1) % vs.length];
      const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
      let t = ((pt.x - v.x) * (w.x - v.x) + (pt.y - v.y) * (w.y - v.y)) / l2;
      t = Math.max(0, Math.min(1, t));
      const projected = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
      const d = Math.sqrt(Math.pow(pt.x - projected.x, 2) + Math.pow(pt.y - projected.y, 2));
      if (d < minDist) {
        minDist = d;
        closestPt = projected;
      }
    }
    return closestPt;
  };

  // Drag handlers
  const startDrag = (item, pos, e) => {
    e.stopPropagation();
    const coords = getSVGCoordinates(e.clientX, e.clientY);
    setDragOffset({ x: coords.x - pos.x, y: coords.y - pos.y });
    setActiveDrag(item);
  };

  const handleMouseMove = (e) => {
    if (!activeDrag || !svgRef.current) return;
    const coords = getSVGCoordinates(e.clientX, e.clientY);
    const targetX = coords.x - dragOffset.x;
    const targetY = coords.y - dragOffset.y;

    if (activeDrag === 'bone') {
      setBonePos({ x: targetX, y: targetY });
    } else if (activeDrag === 'sensor') {
      setSensorPos({ x: targetX, y: targetY });
    } else if (activeDrag === 'puddle') {
      setPuddlePos({ x: targetX, y: targetY });
    }
  };

  const handleMouseUp = () => {
    if (!activeDrag) return;
    
    // Evaluate regions on drop
    if (activeDrag === 'bone') {
      const inside = isPointInPolygon(bonePos, polygon) && !isPointOnBoundary(bonePos, polygon);
      setBoneInInterior(inside);
      if (inside) addXp(50);
    } else if (activeDrag === 'sensor') {
      const onBoundary = isPointOnBoundary(sensorPos, polygon);
      setSensorOnBoundary(onBoundary);
      if (onBoundary) {
        // Snap sensor precisely to the boundary line
        const snapped = getClosestPointOnBoundary(sensorPos, polygon);
        setSensorPos(snapped);
        addXp(50);
      }
    } else if (activeDrag === 'puddle') {
      const outside = !isPointInPolygon(puddlePos, polygon) && !isPointOnBoundary(puddlePos, polygon);
      setPuddleInExterior(outside);
      if (outside) addXp(50);
    }

    setActiveDrag(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [activeDrag, bonePos, sensorPos, puddlePos]);

  // Check if everything is successfully cleared
  const allClear = boneInInterior && sensorOnBoundary && puddleInExterior;

  useEffect(() => {
    if (allClear) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.75 } });
    }
  }, [allClear]);

  // SVG string path for the closed polygon loop
  const getPolygonPathData = () => {
    let d = `M ${polygon[0].x} ${polygon[0].y}`;
    for (let i = 1; i < polygon.length; i++) {
      d += ` L ${polygon[i].x} ${polygon[i].y}`;
    }
    return d + ' Z';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
      {/* LEFT PANEL */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Concept Card */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--neutral-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} size={18} />
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)', textTransform: 'uppercase' }}>Core Concept:</span>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              A closed curve divides the plane into three distinct parts:
              <br />1. <strong>Interior:</strong> inside the loop.
              <br />2. <strong>Boundary:</strong> on the outline.
              <br />3. <strong>Exterior:</strong> outside the loop.
            </p>
          </div>
        </div>

        {/* Quest Checklist */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckSquare size={14} /> Mission Checklist:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: boneInInterior ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={boneInInterior} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>1. Place Pup's Bone in the <strong>Interior</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: sensorOnBoundary ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={sensorOnBoundary} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>2. Place Boundary Sensor on the <strong>Boundary</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: puddleInExterior ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={puddleInExterior} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>3. Place Water Puddle in the <strong>Exterior</strong></span>
            </div>
          </div>
        </div>

        {/* Real-time Guidance */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px dashed var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {!allClear ? (
            <span>👈 Grab items from the tool tray on the left of the canvas and drag them into the correct mathematical zones!</span>
          ) : (
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
              🌟 Superb! You correctly identified all three regions of the closed curve. The puppy is safe, fed, and hydrated!
            </span>
          )}
        </div>

        {/* Proceed button */}
        <div style={{ marginTop: 'auto' }}>
          {allClear ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Sparkles size={16} /> Stage Cleared!
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  You successfully verified spatial regions. Proceed to the Concept Checkup quiz!
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Next: Take Concept Quiz
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Place all three items correctly to proceed.</span>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANEL: REGION CANVAS */}
      <div 
        className="glass-panel" 
        style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
      >
        <div style={{ 
          position: 'absolute', 
          top: '15px', 
          left: '15px', 
          background: 'rgba(9, 13, 22, 0.85)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '8px', 
          padding: '0.5rem 0.8rem', 
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: '#f8fafc'
        }}>
          <Shield size={14} style={{ color: 'var(--accent)' }} />
          <span>📍 Curve Region Explorer</span>
        </div>

        <div style={{ flex: 1, position: 'relative' }} onMouseMove={handleMouseMove}>
          <svg 
            ref={svgRef}
            viewBox="0 0 800 460"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Grid background */}
            <defs>
              <pattern id="region-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#region-grid)" />

            {/* FENCE TRAY SEPARATOR BAR */}
            <line x1="140" y1="0" x2="140" y2="460" stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4,4" />
            <text x="70" y="35" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">TOOL TRAY</text>

            {/* CLOSED CURVE LOOP (SHAPE) */}
            <path 
              d={getPolygonPathData()} 
              fill="rgba(139, 92, 246, 0.04)"
              stroke="#8b5cf6" 
              strokeWidth={8} 
              strokeLinejoin="round" 
              opacity={0.8}
            />
            {/* Inner guideline border */}
            <path 
              d={getPolygonPathData()} 
              fill="none" 
              stroke="#a78bfa" 
              strokeWidth={2} 
              strokeLinejoin="round" 
            />

            {/* REGION TEXT LABELS */}
            <text x="380" y="240" fill="rgba(167, 139, 250, 0.4)" fontSize="18" fontWeight="bold" textAnchor="middle">
              INTERIOR
            </text>
            <text x="530" y="390" fill="rgba(255, 255, 255, 0.25)" fontSize="16" fontWeight="bold" textAnchor="middle">
              EXTERIOR
            </text>
            <text x="590" y="115" fill="rgba(167, 139, 250, 0.4)" fontSize="10" fontWeight="bold">
              BOUNDARY
            </text>

            {/* PUPPY DRAG SENSOR OBJECT */}
            {/* 1. Bone (Interior Target) */}
            <g 
              transform={`translate(${bonePos.x}, ${bonePos.y})`}
              onMouseDown={(e) => startDrag('bone', bonePos, e)}
              style={{ cursor: 'grab' }}
            >
              <rect x="-35" y="-22" width="70" height="44" rx="8" fill="#1e293b" stroke={boneInInterior ? '#10b981' : 'rgba(255,255,255,0.15)'} strokeWidth={2} />
              {/* Bone Icon drawing */}
              <path d="M-15,-6 C-20,-12 -25,-6 -20,0 C-25,6 -20,12 -15,6 L15,6 C20,12 25,6 20,0 C25,-6 20,-12 15,-6 Z" fill="#fff" />
              <text x="0" y="16" fill={boneInInterior ? '#34d399' : '#94a3b8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                {boneInInterior ? '🦴 Inside' : '🦴 Bone'}
              </text>
            </g>

            {/* 2. Boundary Sensor (Boundary Target) */}
            <g 
              transform={`translate(${sensorPos.x}, ${sensorPos.y})`}
              onMouseDown={(e) => startDrag('sensor', sensorPos, e)}
              style={{ cursor: 'grab' }}
            >
              <rect x="-35" y="-22" width="70" height="44" rx="8" fill="#1e293b" stroke={sensorOnBoundary ? '#10b981' : 'rgba(255,255,255,0.15)'} strokeWidth={2} />
              {/* Sensor Icon drawing */}
              <circle cx="0" cy="-4" r="6" fill="#3b82f6" className={sensorOnBoundary ? 'pulse-target' : ''} />
              <line x1="-10" y1="8" x2="0" y2="-4" stroke="#fff" strokeWidth={1} />
              <line x1="10" y1="8" x2="0" y2="-4" stroke="#fff" strokeWidth={1} />
              <text x="0" y="16" fill={sensorOnBoundary ? '#34d399' : '#94a3b8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                {sensorOnBoundary ? '📡 Snapped' : '📡 Sensor'}
              </text>
            </g>

            {/* 3. Water Puddle (Exterior Target) */}
            <g 
              transform={`translate(${puddlePos.x}, ${puddlePos.y})`}
              onMouseDown={(e) => startDrag('puddle', puddlePos, e)}
              style={{ cursor: 'grab' }}
            >
              <rect x="-35" y="-22" width="70" height="44" rx="8" fill="#1e293b" stroke={puddleInExterior ? '#10b981' : 'rgba(255,255,255,0.15)'} strokeWidth={2} />
              {/* Puddle icon drawing */}
              <path d="M-12,4 C-18,2 -14,-6 -8,-6 C-4,-6 -2,-10 4,-8 C10,-6 14,0 8,4 C2,8 -6,6 -12,4 Z" fill="#60a5fa" />
              <text x="0" y="16" fill={puddleInExterior ? '#34d399' : '#94a3b8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                {puddleInExterior ? '💧 Outside' : '💧 Puddle'}
              </text>
            </g>

          </svg>
        </div>

        {/* Canvas Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            {allClear ? '🎉 Correct layout! You placed the bone inside, the sensor on the fence boundary, and the water outside!' :
             '👉 Drag the Bone inside, the Sensor directly onto the purple outline, and the Water Puddle completely outside.'}
          </span>
        </div>
      </div>
    </div>
  );
}
