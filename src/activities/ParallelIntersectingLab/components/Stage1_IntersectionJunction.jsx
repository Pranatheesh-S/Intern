import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles, CheckSquare, TrafficCone, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage1_IntersectionJunction({ onComplete, addXp }) {
  // Endpoints of Street A (Line 1) - Left side, vertical-ish slope
  const [p1, setP1] = useState({ x: 180, y: 120 });
  const [p2, setP2] = useState({ x: 250, y: 320 });

  // Endpoints of Street B (Line 2) - Right side, vertical-ish slope
  const [p3, setP3] = useState({ x: 580, y: 120 });
  const [p4, setP4] = useState({ x: 510, y: 320 });

  const [activeTool, setActiveTool] = useState('drag'); // 'drag' | 'traffic_light'
  const [trafficLightPlaced, setTrafficLightPlaced] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null); // { line: 1|2, point: 1|2 }

  const svgRef = useRef(null);

  // Convert client coordinates to SVG viewBox space using CTM matrix
  const getSVGCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
  };

  // Drag handlers for endpoints
  const handleMouseDown = (line, point, e) => {
    e.stopPropagation();
    if (activeTool !== 'drag') return;
    setDraggingNode({ line, point });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode || !svgRef.current) return;
    const coords = getSVGCoordinates(e.clientX, e.clientY);

    // Limit movements to canvas bounds
    const boundedX = Math.max(50, Math.min(750, coords.x));
    const boundedY = Math.max(50, Math.min(410, coords.y));

    if (draggingNode.line === 1) {
      if (draggingNode.point === 1) setP1({ x: boundedX, y: boundedY });
      else setP2({ x: boundedX, y: boundedY });
    } else {
      if (draggingNode.point === 1) setP3({ x: boundedX, y: boundedY });
      else setP4({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [draggingNode]);

  // Calculate mathematical intersection of two line segments
  const getIntersection = () => {
    // Line 1: a1*x + b1*y = c1
    const a1 = p2.y - p1.y;
    const b1 = p1.x - p2.x;
    const c1 = a1 * p1.x + b1 * p1.y;

    // Line 2: a2*x + b2*y = c2
    const a2 = p4.y - p3.y;
    const b2 = p3.x - p4.x;
    const c2 = a2 * p3.x + b2 * p3.y;

    const D = a1 * b2 - a2 * b1;
    if (Math.abs(D) < 0.001) return null; // Parallel

    const ix = (c1 * b2 - c2 * b1) / D;
    const iy = (a1 * c2 - a2 * c1) / D;

    // Check if the intersection point lies within the bounding box of both segments
    const onSegment1 = 
      ix >= Math.min(p1.x, p2.x) - 1 &&
      ix <= Math.max(p1.x, p2.x) + 1 &&
      iy >= Math.min(p1.y, p2.y) - 1 &&
      iy <= Math.max(p1.y, p2.y) + 1;

    const onSegment2 = 
      ix >= Math.min(p3.x, p4.x) - 1 &&
      ix <= Math.max(p3.x, p4.x) + 1 &&
      iy >= Math.min(p3.y, p4.y) - 1 &&
      iy <= Math.max(p3.y, p4.y) + 1;

    if (onSegment1 && onSegment2) {
      return { x: Math.round(ix), y: Math.round(iy) };
    }
    return null;
  };

  const intersection = getIntersection();

  const handleCanvasClick = (e) => {
    if (activeTool !== 'traffic_light' || !intersection || trafficLightPlaced) return;
    const coords = getSVGCoordinates(e.clientX, e.clientY);
    
    // Check distance to intersection point
    const dist = Math.sqrt(Math.pow(coords.x - intersection.x, 2) + Math.pow(coords.y - intersection.y, 2));
    if (dist < 30) {
      setTrafficLightPlaced(true);
      addXp(100);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.75 } });
    }
  };

  // Checklist states
  const questLinesCrossed = intersection !== null;
  const questLightPlaced = trafficLightPlaced;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
      {/* LEFT PANEL */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Goal Indicator */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--neutral-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} size={18} />
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)', textTransform: 'uppercase' }}>Core Concept:</span>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              When two lines share exactly one common point, they are called <strong>Intersecting Lines</strong>. The common point is the <strong>Point of Intersection</strong>.
            </p>
          </div>
        </div>

        {/* Quest Checklist */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckSquare size={14} /> Mission Checklist:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: questLinesCrossed ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={questLinesCrossed} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>1. Drag streets to intersect (cross)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: questLightPlaced ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={questLightPlaced} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>2. Place traffic light at intersection</span>
            </div>
          </div>
        </div>

        {/* Tool Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Select Active Tool:</h3>
          
          <button 
            onClick={() => setActiveTool('drag')}
            className={activeTool === 'drag' ? 'primary' : 'outline'}
            style={{ justifyContent: 'flex-start', gap: '0.5rem', padding: '0.75rem' }}
            disabled={trafficLightPlaced}
          >
            <span>👉 Drag Streets Tool</span>
          </button>

          <button 
            onClick={() => setActiveTool('traffic_light')}
            className={activeTool === 'traffic_light' ? 'primary' : 'outline'}
            style={{ justifyContent: 'flex-start', gap: '0.5rem', padding: '0.75rem' }}
            disabled={!questLinesCrossed || trafficLightPlaced}
          >
            <span>🚥 Place Traffic Light Tool</span>
          </button>
        </div>

        {/* Real-time Interactive Guidance */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px dashed var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {!questLinesCrossed && (
            <span>👈 Drag any of the glowing circular nodes at the ends of Street A (purple) or Street B (blue) to make them cross!</span>
          )}
          {questLinesCrossed && !questLightPlaced && activeTool === 'drag' && (
            <span style={{ color: 'var(--accent-text)', fontWeight: 'bold' }}>
              🎉 Streets cross! Now select the <strong>Place Traffic Light Tool</strong> from the list above.
            </span>
          )}
          {questLinesCrossed && !questLightPlaced && activeTool === 'traffic_light' && (
            <span style={{ color: 'var(--accent-text)', fontWeight: 'bold' }}>
              🎯 Click directly on the pulsing yellow intersection node inside the canvas to install the traffic light!
            </span>
          )}
          {questLightPlaced && (
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
              🌟 Excellent! You locked the junction point. Notice how two straight lines can cross at exactly ONE point!
            </span>
          )}
        </div>

        {/* Next Stage Complete card */}
        <div style={{ marginTop: 'auto' }}>
          {trafficLightPlaced ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Sparkles size={16} /> Stage Cleared!
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  You successfully constructed a crossing junction. Next, let's explore lines that never meet.
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Next: Parallel Rails
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intersect streets and place the light to proceed.</span>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANEL: CANVAS */}
      <div 
        className="glass-panel" 
        style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
      >
        {/* Dynamic header status */}
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
          <Eye size={14} style={{ color: 'var(--accent)' }} />
          <span>
            {trafficLightPlaced ? '🚥 Intersection Junction Active' : 
             intersection ? '🚧 Common Intersection Found' : 
             '🛣️ Streets do not intersect'}
          </span>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <svg 
            ref={svgRef}
            viewBox="0 0 800 460"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible', cursor: activeTool === 'traffic_light' ? 'crosshair' : 'default' }}
          >
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="street-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#street-grid)" />

            {/* STREET A (LINE 1) */}
            <g>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#818cf8" strokeWidth={16} strokeLinecap="round" opacity={0.3} />
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#6366f1" strokeWidth={4} strokeLinecap="round" strokeDasharray="6,4" />
              {/* Street Label */}
              <text x={(p1.x + p2.x)/2 - 10} y={(p1.y + p2.y)/2 - 15} fill="#a5b4fc" fontSize="10" fontWeight="bold">STREET A</text>
            </g>

            {/* STREET B (LINE 2) */}
            <g>
              <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke="#60a5fa" strokeWidth={16} strokeLinecap="round" opacity={0.3} />
              <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke="#3b82f6" strokeWidth={4} strokeLinecap="round" strokeDasharray="6,4" />
              {/* Street Label */}
              <text x={(p3.x + p4.x)/2 + 15} y={(p3.y + p4.y)/2 - 15} fill="#93c5fd" fontSize="10" fontWeight="bold">STREET B</text>
            </g>

            {/* INTERSECTION POINT */}
            {intersection && (
              <g>
                {!trafficLightPlaced ? (
                  <>
                    <circle cx={intersection.x} cy={intersection.y} r={18} fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="4,4" className="pulse-target" />
                    <circle cx={intersection.x} cy={intersection.y} r={8} fill="#f59e0b" />
                    <text x={intersection.x} y={intersection.y - 25} fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Point of Intersection
                    </text>
                  </>
                ) : (
                  <g transform={`translate(${intersection.x}, ${intersection.y})`}>
                    <circle cx="0" cy="0" r={22} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth={2} />
                    {/* Drawing a simple traffic light icon inside SVG */}
                    <rect x="-8" y="-18" width="16" height="36" rx="4" fill="#1f2937" stroke="#cbd5e1" strokeWidth={1} />
                    <circle cx="0" cy="-10" r="4" fill="#ef4444" />
                    <circle cx="0" cy="0" r="4" fill="#f59e0b" />
                    <circle cx="0" cy="10" r="4" fill="#10b981" className="pulse-target" />
                    <text x="0" y="-24" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">🚥 Junction Active</text>
                  </g>
                )}
              </g>
            )}

            {/* DRAGGABLE HANDLES */}
            {!trafficLightPlaced && (
              <>
                {/* Street A handles */}
                <circle cx={p1.x} cy={p1.y} r={12} fill="#6366f1" stroke="#fff" strokeWidth={2} style={{ cursor: 'grab' }} onMouseDown={(e) => handleMouseDown(1, 1, e)} />
                <circle cx={p2.x} cy={p2.y} r={12} fill="#6366f1" stroke="#fff" strokeWidth={2} style={{ cursor: 'grab' }} onMouseDown={(e) => handleMouseDown(1, 2, e)} />

                {/* Street B handles */}
                <circle cx={p3.x} cy={p3.y} r={12} fill="#3b82f6" stroke="#fff" strokeWidth={2} style={{ cursor: 'grab' }} onMouseDown={(e) => handleMouseDown(2, 1, e)} />
                <circle cx={p4.x} cy={p4.y} r={12} fill="#3b82f6" stroke="#fff" strokeWidth={2} style={{ cursor: 'grab' }} onMouseDown={(e) => handleMouseDown(2, 2, e)} />
              </>
            )}

          </svg>
        </div>

        {/* Canvas Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            {trafficLightPlaced ? '🎉 Congratulations! You have learned that two intersecting lines have exactly one intersection point.' :
             intersection ? '🚦 Intersection found! Switch to the "Traffic Light Tool" above and click the node to install the signal.' :
             '👉 Drag the circular street handles around. Notice that if you make them cross, they will share exactly one common node.'}
          </span>
        </div>
      </div>
    </div>
  );
}
