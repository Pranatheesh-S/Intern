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
      triggerDogEscape();
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

  const triggerDogEscape = async () => {
    setDogRunning(true);
    // Animate puppy running to the right off screen
    dogControls.set({ x: 380, y: 210, opacity: 1 });
    await dogControls.start({
      x: 820,
      transition: { duration: 2.2, ease: 'easeIn' }
    });
    setDogRunning(false);
  };

  const handleReset = () => {
    setPoints([]);
    setClassification(null);
    setDogInsidePen(false);
    dogControls.set({ x: 380, y: 210, opacity: 1 });
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
              initial={{ x: 380, y: 210, opacity: 1 }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              {/* Cute puppy illustration */}
              <circle cx="20" cy="20" r="18" fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
              {/* Ears */}
              <ellipse cx="2" cy="5" rx="6" ry="12" fill="#94a3b8" />
              <ellipse cx="38" cy="5" rx="6" ry="12" fill="#94a3b8" />
              {/* Eyes */}
              <circle cx="12" cy="18" r="2.5" fill="#1e293b" />
              <circle cx="28" cy="18" r="2.5" fill="#1e293b" />
              {/* Nose */}
              <polygon points="20,22 17,25 23,25" fill="#1e293b" />
              {/* Tongue if happy */}
              {dogInsidePen && <ellipse cx="20" cy="28" rx="3" ry="5" fill="#f87171" />}
              {/* Sleeping state visual check overlay */}
              {dogInsidePen && (
                <text x="20" y="-12" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">💤 Happy & Safe</text>
              )}
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
