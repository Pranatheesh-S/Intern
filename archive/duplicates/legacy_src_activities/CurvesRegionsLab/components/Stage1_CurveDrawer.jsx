import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Info, Sparkles, CheckSquare, RefreshCw, PenTool, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage1_CurveDrawer({ onComplete, addXp }) {
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [classification, setClassification] = useState(null); // 'Open Simple' | 'Closed Simple' | 'Open Complex' | 'Closed Complex'
  
  // Checklist goals
  const [hasDrawnOpen, setHasDrawnOpen] = useState(false);
  const [hasDrawnClosed, setHasDrawnClosed] = useState(false);
  const [dogRunning, setDogRunning] = useState(false);
  const [dogInsidePen, setDogInsidePen] = useState(false);

  const svgRef = useRef(null);
  const dogControls = useAnimation();

  // Convert screen coords to SVG space
  const getSVGCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
  };

  // Line segment intersection math
  const segmentsIntersect = (p1, p2, p3, p4) => {
    const det = (p2.x - p1.x) * (p4.y - p3.y) - (p4.x - p3.x) * (p2.y - p1.y);
    if (det === 0) return false; // Parallel
    const lambda = ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
    const gamma = ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;
    return (0.01 < lambda && lambda < 0.99) && (0.01 < gamma && gamma < 0.99);
  };

  // Downsample coordinates and check self-intersection
  const checkSelfIntersection = (pts) => {
    if (pts.length < 8) return false;
    const ds = [];
    // Downsample to keep logic fast (O(N^2) for N <= 50)
    const step = Math.max(1, Math.floor(pts.length / 35));
    for (let i = 0; i < pts.length; i += step) {
      ds.push(pts[i]);
    }
    if (ds[ds.length - 1] !== pts[pts.length - 1]) {
      ds.push(pts[pts.length - 1]);
    }

    for (let i = 0; i < ds.length - 1; i++) {
      for (let j = i + 2; j < ds.length - 1; j++) {
        // Skip connecting end to start segment
        if (i === 0 && j === ds.length - 2) continue;
        if (segmentsIntersect(ds[i], ds[i + 1], ds[j], ds[j + 1])) {
          return true;
        }
      }
    }
    return false;
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setPoints([]);
    setClassification(null);
    setDrawing(true);
    const coords = getSVGCoordinates(e.clientX, e.clientY);
    setPoints([coords]);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const coords = getSVGCoordinates(e.clientX, e.clientY);
    
    // Add point if we moved at least 5px to avoid flooding
    const lastPt = points[points.length - 1];
    if (lastPt) {
      const dist = Math.sqrt(Math.pow(coords.x - lastPt.x, 2) + Math.pow(coords.y - lastPt.y, 2));
      if (dist >= 5) {
        setPoints(prev => [...prev, coords]);
      }
    }
  };

  const handleMouseUp = () => {
    if (!drawing || points.length < 5) {
      setDrawing(false);
      setPoints([]);
      return;
    }
    setDrawing(false);

    // Calculate details
    const start = points[0];
    const end = points[points.length - 1];
    const endToStartDist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const isClosed = endToStartDist < 45; // Auto-closure threshold
    
    const selfIntersects = checkSelfIntersection(points);

    let type = '';
    if (selfIntersects) {
      type = isClosed ? 'Closed Non-Simple' : 'Open Non-Simple';
    } else {
      type = isClosed ? 'Closed Simple' : 'Open Simple';
    }

    setClassification(type);

    if (type === 'Open Simple') {
      // Auto-connect wasn't triggered, it is open
      setHasDrawnOpen(true);
      addXp(50);
      triggerDogEscape(points);
    } else if (type === 'Closed Simple') {
      // It is closed! We snap the end to the start point to render a perfect loop
      setPoints(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = copy[0]; // snap endpoints
        return copy;
      });
      setHasDrawnClosed(true);
      setDogInsidePen(true);
      addXp(50);
      confetti({ particleCount: 30, spread: 40 });
    }
  };

  const triggerDogEscape = async (pathPoints) => {
    if (!pathPoints || pathPoints.length < 2) return;
    setDogRunning(true);
    
    const start = pathPoints[0];
    const end = pathPoints[pathPoints.length - 1];
    
    // Puppy center in global SVG coordinates is (400, 230)
    // (x: 380, y: 210 in local coords + 20 px offsets)
    const px = 400;
    const py = 230;
    
    // 1. Try to find the midpoint of the gap between the endpoints
    const gapMidX = (start.x + end.x) / 2;
    const gapMidY = (start.y + end.y) / 2;
    
    // Check if the line segment from the puppy center to the gap midpoint crosses the curve
    let gapBlocked = false;
    for (let i = 0; i < pathPoints.length - 1; i++) {
      if (segmentsIntersect({ x: px, y: py }, { x: gapMidX, y: gapMidY }, pathPoints[i], pathPoints[i+1])) {
        gapBlocked = true;
        break;
      }
    }
    
    let waypointX, waypointY, offscreenX, offscreenY;
    
    if (!gapBlocked) {
      // Escape path is clear! Go directly through the center of the gap
      waypointX = gapMidX;
      waypointY = gapMidY;
      
      const dx = gapMidX - px;
      const dy = gapMidY - py;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      offscreenX = waypointX + (dx / dist) * 450;
      offscreenY = waypointY + (dy / dist) * 450;
    } else {
      // Try to find a clear ray among 12 directions (30 degree intervals)
      let clearAngle = null;
      let minAngleDiff = Infinity;
      
      const preferredAngle = Math.atan2(gapMidY - py, gapMidX - px);
      
      for (let k = 0; k < 12; k++) {
        const angle = (k * Math.PI) / 6;
        const tx = px + Math.cos(angle) * 300;
        const ty = py + Math.sin(angle) * 300;
        
        let rayBlocked = false;
        for (let i = 0; i < pathPoints.length - 1; i++) {
          if (segmentsIntersect({ x: px, y: py }, { x: tx, y: ty }, pathPoints[i], pathPoints[i+1])) {
            rayBlocked = true;
            break;
          }
        }
        
        if (!rayBlocked) {
          let diff = Math.abs(angle - preferredAngle);
          if (diff > Math.PI) diff = 2 * Math.PI - diff;
          if (diff < minAngleDiff) {
            minAngleDiff = diff;
            clearAngle = angle;
          }
        }
      }
      
      if (clearAngle !== null) {
        waypointX = px + Math.cos(clearAngle) * 160;
        waypointY = py + Math.sin(clearAngle) * 160;
        offscreenX = px + Math.cos(clearAngle) * 600;
        offscreenY = py + Math.sin(clearAngle) * 600;
      } else {
        // Fallback: escape past the closer endpoint to go around the barrier tip
        const dStart = Math.sqrt(Math.pow(start.x - px, 2) + Math.pow(start.y - py, 2));
        const dEnd = Math.sqrt(Math.pow(end.x - px, 2) + Math.pow(end.y - py, 2));
        const escapeEnd = dStart < dEnd ? start : end;
        
        const dx = escapeEnd.x - px;
        const dy = escapeEnd.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        waypointX = escapeEnd.x + (dx / dist) * 55;
        waypointY = escapeEnd.y + (dy / dist) * 55;
        offscreenX = waypointX + (dx / dist) * 450;
        offscreenY = waypointY + (dy / dist) * 450;
      }
    }
    
    // Adjust waypoint for the 40x40 dog component top-left position
    const runWaypointX = waypointX - 20;
    const runWaypointY = waypointY - 20;
    const runOffscreenX = offscreenX - 20;
    const runOffscreenY = offscreenY - 20;
    
    const angle1 = Math.atan2(runWaypointY - 210, runWaypointX - 380) * (180 / Math.PI) - 90;
    const angle2 = Math.atan2(runOffscreenY - runWaypointY, runOffscreenX - runWaypointX) * (180 / Math.PI) - 90;
    
    // Reset starting state
    dogControls.set({ x: 380, y: 210, rotate: 0, opacity: 1 });
    
    // 1. Quick, alert steering rotation to face the waypoint (0.35s)
    await dogControls.start({
      rotate: angle1,
      transition: { duration: 0.35, ease: 'easeInOut' }
    });
    
    // 2. Jog towards the waypoint/exit (1.3s)
    await dogControls.start({
      x: runWaypointX,
      y: runWaypointY,
      transition: { duration: 1.3, ease: 'easeOut' }
    });
    
    // 3. Smoothly steer towards the final dash direction while accelerating offscreen
    await Promise.all([
      dogControls.start({
        rotate: angle2,
        transition: { duration: 0.35, ease: 'easeInOut' }
      }),
      dogControls.start({
        x: runOffscreenX,
        y: runOffscreenY,
        transition: { duration: 1.2, ease: 'easeIn' }
      })
    ]);
    
    setDogRunning(false);
  };

  const handleReset = () => {
    setPoints([]);
    setClassification(null);
    setDogInsidePen(false);
    dogControls.set({ x: 380, y: 210, rotate: 0, opacity: 1 });
  };

  // Convert points array to smooth SVG path
  const getPathData = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
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
              A <strong>simple curve</strong> is a curve that does not cross itself. If its endpoints meet, it is a <strong>closed curve</strong>; otherwise, it is an <strong>open curve</strong>.
            </p>
          </div>
        </div>

        {/* Quest Checklist */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckSquare size={14} /> Mission Checklist:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hasDrawnOpen ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={hasDrawnOpen} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>1. Draw an Open Simple Curve (Let Pup escape)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hasDrawnClosed ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={hasDrawnClosed} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>2. Draw a Closed Simple Curve (Enclose Pup)</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Drawing Controls:</h3>
          
          <button 
            onClick={handleReset}
            className="outline"
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem'
            }}
          >
            <RefreshCw size={14} />
            <span>Reset Canvas</span>
          </button>
        </div>

        {/* Real-time Guidance */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px dashed var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {points.length === 0 && !hasDrawnOpen && (
            <span>👈 Click and drag inside the dark canvas to draw a line path. Draw an <strong>Open Curve</strong> (ends apart, without crossing) to help the puppy run!</span>
          )}
          {points.length === 0 && hasDrawnOpen && !hasDrawnClosed && (
            <span style={{ color: 'var(--accent-text)', fontWeight: 'bold' }}>
              🎉 Open curve verified! Now click Reset and draw a <strong>Simple Closed Curve</strong> (connect the loop without crossing) to build a closed yard.
            </span>
          )}
          {classification && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ color: '#fff', fontSize: '0.85rem' }}>Curve Classified As:</span>
              <strong style={{ 
                color: classification.includes('Simple') ? 'var(--success)' : '#ef4444', 
                fontSize: '0.9rem' 
              }}>
                {classification}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {classification === 'Open Simple' ? '✅ Great! The path remains open.' :
                 classification === 'Closed Simple' ? '✅ Great! You made a closed loop!' :
                 '⚠️ Non-Simple curves cross themselves. Try drawing a clean shape without self-intersections!'}
              </span>
            </div>
          )}
        </div>

        {/* Proceed to stage 2 */}
        <div style={{ marginTop: 'auto' }}>
          {hasDrawnOpen && hasDrawnClosed ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Sparkles size={16} /> Stage Cleared!
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  You successfully mastered open vs. closed simple curves. Proceed to Region Rescue.
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Next: Region Rescue
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete both drawing challenges to proceed.</span>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANEL: DRAWING CANVAS */}
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
          <PenTool size={14} style={{ color: 'var(--accent)' }} />
          <span>{drawing ? '✍️ Drawing path...' : '🖌️ Draw Curve on Canvas'}</span>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <svg 
            ref={svgRef}
            viewBox="0 0 800 460"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair', overflow: 'visible' }}
          >
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="curve-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#curve-grid)" />

            {/* CURVE FENCE OUTLINE (GREEN GLOW IF CLOSED SIMPLE) */}
            {points.length > 0 && (
              <path 
                d={getPathData()} 
                fill={classification === 'Closed Simple' ? 'rgba(16, 185, 129, 0.08)' : 'none'}
                stroke={classification === 'Closed Simple' ? '#34d399' : drawing ? 'var(--accent)' : 'rgba(255,255,255,0.4)'}
                strokeWidth={5} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            )}

            {/* START POINT */}
            {points.length > 0 && (
              <circle cx={points[0].x} cy={points[0].y} r={6} fill="#fbbf24" stroke="#fff" strokeWidth={1} />
            )}

            {/* PUPPY CHARACTER */}
            <motion.g 
              animate={dogControls} 
              initial={{ x: 380, y: 210, opacity: 1, rotate: 0 }}
              style={{ originX: '20px', originY: '20px' }}
            >
              <motion.g
                animate={dogRunning ? {
                  y: [0, -5, 0],
                  scaleY: [1, 0.85, 1.05, 1],
                  scaleX: [1, 1.05, 0.95, 1],
                  transition: {
                    duration: 0.35,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                } : {
                  y: 0,
                  scaleY: 1,
                  scaleX: 1
                }}
                style={{ originX: '20px', originY: '20px' }}
              >
                {/* Tail (Wags when running or happy inside pen) */}
                <motion.path 
                  d="M 20 6 Q 20 -4 26 -2" 
                  stroke="#94a3b8" 
                  strokeWidth={4.5} 
                  strokeLinecap="round" 
                  fill="none"
                  animate={dogRunning ? {
                    rotate: [-35, 35, -35],
                    transition: { duration: 0.2, repeat: Infinity, ease: "linear" }
                  } : dogInsidePen ? {
                    rotate: [-15, 15, -15],
                    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                  } : { rotate: 0 }}
                  style={{ originX: '20px', originY: '6px' }}
                />

                {/* Back Paws (Rendered behind the body) */}
                <motion.ellipse 
                  cx="8" cy="8" rx="4" ry="5" fill="#cbd5e1" stroke="#475569" strokeWidth={1.5}
                  animate={dogRunning ? {
                    y: [0, -3, 3, 0],
                    transition: { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
                  } : {}}
                />
                <motion.ellipse 
                  cx="32" cy="8" rx="4" ry="5" fill="#cbd5e1" stroke="#475569" strokeWidth={1.5}
                  animate={dogRunning ? {
                    y: [0, 3, -3, 0],
                    transition: { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
                  } : {}}
                />

                {/* Front Paws (Rendered behind the body) */}
                <motion.ellipse 
                  cx="6" cy="32" rx="4.5" ry="5.5" fill="#e2e8f0" stroke="#475569" strokeWidth={1.5}
                  animate={dogRunning ? {
                    y: [0, 3, -3, 0],
                    transition: { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
                  } : {}}
                />
                <motion.ellipse 
                  cx="34" cy="32" rx="4.5" ry="5.5" fill="#e2e8f0" stroke="#475569" strokeWidth={1.5}
                  animate={dogRunning ? {
                    y: [0, -3, 3, 0],
                    transition: { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
                  } : {}}
                />

                {/* Body/Head Circle */}
                <circle cx="20" cy="20" r="18" fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
                
                {/* Cute Spots on the Puppy's Back */}
                <circle cx="12" cy="14" r="4.5" fill="#94a3b8" opacity={0.6} />
                <circle cx="27" cy="24" r="3" fill="#94a3b8" opacity={0.6} />

                {/* Ears */}
                <motion.ellipse 
                  cx="3" cy="6" rx="5" ry="11" fill="#94a3b8" stroke="#475569" strokeWidth={1.5}
                  animate={dogRunning ? {
                    rotate: [-20, 10, -20],
                    transition: { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
                  } : { rotate: 0 }}
                  style={{ originX: '8px', originY: '6px' }}
                />
                <motion.ellipse 
                  cx="37" cy="6" rx="5" ry="11" fill="#94a3b8" stroke="#475569" strokeWidth={1.5}
                  animate={dogRunning ? {
                    rotate: [20, -10, 20],
                    transition: { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
                  } : { rotate: 0 }}
                  style={{ originX: '32px', originY: '6px' }}
                />

                {/* Eyes */}
                <circle cx="12" cy="18" r="2.5" fill="#1e293b" />
                <circle cx="28" cy="18" r="2.5" fill="#1e293b" />
                
                {/* Snout Detail */}
                <ellipse cx="20" cy="23" rx="4" ry="3" fill="#f1f5f9" />
                <polygon points="20,21 17.5,23.5 22.5,23.5" fill="#1e293b" />
                
                {/* Tongue (Panting if running, happy if in pen) */}
                {(dogInsidePen || dogRunning) && (
                  <motion.ellipse 
                    cx="20" cy="27" rx="2.5" ry="4.5" fill="#f87171" 
                    animate={dogRunning ? { scaleY: [1, 1.25, 1] } : {}}
                    transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: '20px', originY: '25px' }}
                  />
                )}

                {/* Status Overlay */}
                {dogInsidePen && (
                  <text x="20" y="-12" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">💤 Happy & Safe</text>
                )}
              </motion.g>
            </motion.g>

          </svg>
        </div>

        {/* Canvas Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            {dogInsidePen ? '🎉 Awesome! The closed curve represents a boundary enclosing the puppy inside its interior region.' :
             dogRunning ? '🐕 The open curve allows the puppy to run past its open endpoints!' :
             '👉 Try dragging your mouse inside the grid. Drag ends close to each other to form a closed shape.'}
          </span>
        </div>
      </div>
    </div>
  );
}
