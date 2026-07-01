import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Sparkles, ZoomIn, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage2_HorizonLab({ onComplete, addXp }) {
  const [pegA, setPegA] = useState({ x: 200, y: 220 });
  const [pegB, setPegB] = useState({ x: 400, y: 220 });
  const [mode, setMode] = useState('segment'); // 'segment' | 'ray' | 'line'
  const [zoom, setZoom] = useState(1); // 1 to 10
  const [draggingPeg, setDraggingPeg] = useState(null);

  // Completed tracking for each mode to ensure they explore all three
  const [explored, setExplored] = useState({
    segment: true, // starts with segment
    ray: false,
    line: false
  });

  const svgRef = useRef(null);

  const handleSelectMode = (newMode) => {
    setMode(newMode);
    setExplored(prev => {
      const updated = { ...prev, [newMode]: true };
      if (updated.segment && updated.ray && updated.line && !prev[newMode]) {
        addXp(100);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
      return updated;
    });
  };

  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // Drag handlers
  const handleMouseDown = (peg) => {
    setDraggingPeg(peg);
  };

  const handleMouseMove = (e) => {
    if (!draggingPeg || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const boundedX = Math.max(50, Math.min(rect.width - 50, x));
    const boundedY = Math.max(50, Math.min(rect.height - 50, y));

    // When zoomed out, we scale our movements back to the absolute coordinate space
    const center = { x: 300, y: 220 };
    
    // Reverse the zoom formula: inputCoord = center + (movedCoord - center) * zoom
    const absX = center.x + (boundedX - center.x) * zoom;
    const absY = center.y + (boundedY - center.y) * zoom;

    if (draggingPeg === 'A') {
      if (getDistance({ x: absX, y: absY }, pegB) > 50) {
        setPegA({ x: Math.round(absX), y: Math.round(absY) });
      }
    } else if (draggingPeg === 'B') {
      if (getDistance(pegA, { x: absX, y: absY }) > 50) {
        setPegB({ x: Math.round(absX), y: Math.round(absY) });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingPeg(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggingPeg(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Compute rendered positions based on zoom level relative to canvas center
  const center = { x: 300, y: 220 };
  const rA = {
    x: center.x + (pegA.x - center.x) / zoom,
    y: center.y + (pegA.y - center.y) / zoom
  };
  const rB = {
    x: center.x + (pegB.x - center.x) / zoom,
    y: center.y + (pegB.y - center.y) / zoom
  };

  // Vector coordinates for drawing Ray and Line
  const dx = rB.x - rA.x;
  const dy = rB.y - rA.y;
  const len = Math.max(0.1, getDistance(rA, rB));
  const vx = dx / len; // unit vector towards B
  const vy = dy / len;

  // Infinite extension length
  const infLen = 1500; 

  const allExplored = explored.segment && explored.ray && explored.line;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
      {/* LEFT PANEL */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--neutral-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0 }} size={18} />
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            In geometry, paths behave differently under scaling. Explore all three modes to see their shapes expand!
          </p>
        </div>

        {/* Mode Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Select Path Type:</h3>
          
          {/* Mode 1: Segment */}
          <button 
            onClick={() => handleSelectMode('segment')}
            className={mode === 'segment' ? 'primary' : 'outline'}
            style={{ 
              justifyContent: 'flex-start', 
              gap: '0.75rem', 
              padding: '0.8rem', 
              borderColor: mode === 'segment' ? 'var(--accent)' : 'var(--border)' 
            }}
          >
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: mode === 'segment' ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
              {explored.segment ? <Check size={10} color={mode === 'segment' ? 'var(--accent)' : '#fff'} /> : ''}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Line Segment (A—B)</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Finite path. Starts at A, ends at B.</span>
            </div>
          </button>

          {/* Mode 2: Ray */}
          <button 
            onClick={() => handleSelectMode('ray')}
            className={mode === 'ray' ? 'primary' : 'outline'}
            style={{ 
              justifyContent: 'flex-start', 
              gap: '0.75rem', 
              padding: '0.8rem',
              borderColor: mode === 'ray' ? 'var(--accent)' : 'var(--border)' 
            }}
          >
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: mode === 'ray' ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
              {explored.ray ? <Check size={10} color={mode === 'ray' ? 'var(--accent)' : '#fff'} /> : ''}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Ray (A—B→)</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>One-sided infinity. Starts at A, goes past B.</span>
            </div>
          </button>

          {/* Mode 3: Line */}
          <button 
            onClick={() => handleSelectMode('line')}
            className={mode === 'line' ? 'primary' : 'outline'}
            style={{ 
              justifyContent: 'flex-start', 
              gap: '0.75rem', 
              padding: '0.8rem',
              borderColor: mode === 'line' ? 'var(--accent)' : 'var(--border)' 
            }}
          >
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: mode === 'line' ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
              {explored.line ? <Check size={10} color={mode === 'line' ? 'var(--accent)' : '#fff'} /> : ''}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Line (←A—B→)</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Double-sided infinity. No end points.</span>
            </div>
          </button>
        </div>

        {/* Zoom Slider */}
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--border)', 
          borderRadius: '10px', 
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ZoomIn size={14} /> Zoom Out Simulator
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold' }}>
              {zoom}x
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.5" 
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }}
          />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Slide to zoom out and witness the infinity of lines!
          </span>
        </div>

        {/* Complete Dialog */}
        <div style={{ marginTop: 'auto' }}>
          {allExplored ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Sparkles size={16} /> Discovery Made!
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Zooming out shows that the **Segment** stays locked, the **Ray** stretches off-canvas in one direction, and the **Line** stretches off-screen in both directions!
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Next: Measuring Tools
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore all 3 path types to proceed!</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: INTERACTIVE CANVAS */}
      <div className="glass-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        
        {/* Visual Cue Overlay */}
        <div style={{ 
          position: 'absolute', 
          top: '15px', 
          left: '15px', 
          background: 'rgba(9, 13, 22, 0.85)', 
          border: '1px solid var(--border)', 
          borderRadius: '8px', 
          padding: '0.5rem 0.8rem', 
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--text-primary)'
        }}>
          <Eye size={14} style={{ color: 'var(--accent)' }} />
          <span>
            {mode === 'segment' ? 'Showing Finite Line Segment' : 
             mode === 'ray' ? 'Showing Ray extending to infinity (→)' : 
             'Showing Infinite Line (← →)'}
          </span>
        </div>

        {/* Dynamic Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg 
            ref={svgRef}
            width="100%" 
            height="460" 
            onMouseMove={handleMouseMove}
            style={{ display: 'block', overflow: 'hidden', cursor: draggingPeg ? 'grabbing' : 'default' }}
          >
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="peg-grid-stage2" width="40" height="40" patternUnits="userSpaceOnUse">
                {/* Dynamically scale grid spacing with zoom */}
                <circle cx={20} cy={20} r="1" fill="rgba(255,255,255,0.05)" />
              </pattern>
              
              {/* Arrow Markers for Rays and Lines */}
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent)" />
              </marker>
            </defs>
            
            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#peg-grid-stage2)" />

            {/* Infinite extension indicator shading */}
            {zoom > 1.5 && (
              <g opacity={0.1}>
                {/* Infinite boundaries */}
                <circle cx={center.x} cy={center.y} r={180} fill="none" stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="5,5" />
                <text x={center.x} y={center.y + 195} fill="var(--text-muted)" fontSize="9" textAnchor="middle">Simulation Viewport Horizon</text>
              </g>
            )}

            {/* DYNAMIC PATH DRAWING */}
            {mode === 'segment' && (
              <g>
                {/* Line segment AB */}
                <line x1={rA.x} y1={rA.y} x2={rB.x} y2={rB.y} stroke="var(--accent)" strokeWidth={3} strokeLinecap="round" />
                {/* Infinite border glow indicator (none for segment) */}
              </g>
            )}

            {mode === 'ray' && (
              <g>
                {/* Ray starts at A and goes past B to infinity */}
                <line 
                  x1={rA.x} 
                  y1={rA.y} 
                  x2={rA.x + infLen * vx} 
                  y2={rA.y + infLen * vy} 
                  stroke="var(--accent)" 
                  strokeWidth={3} 
                  markerEnd="url(#arrow)" 
                />
              </g>
            )}

            {mode === 'line' && (
              <g>
                {/* Line goes to infinity in both directions */}
                <line 
                  x1={rA.x - infLen * vx} 
                  y1={rA.y - infLen * vy} 
                  x2={rA.x + infLen * vx} 
                  y2={rA.y + infLen * vy} 
                  stroke="var(--accent)" 
                  strokeWidth={3} 
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)" 
                />
              </g>
            )}

            {/* PEGS */}
            {/* Peg A */}
            <g 
              transform={`translate(${rA.x}, ${rA.y})`}
              onMouseDown={() => handleMouseDown('A')}
              style={{ cursor: draggingPeg === 'A' ? 'grabbing' : 'grab' }}
            >
              <circle cx="0" cy="0" r={18} fill="transparent" />
              <circle cx="0" cy="0" r={13} fill="rgba(99, 102, 241, 0.15)" stroke="var(--accent)" strokeWidth={1} strokeDasharray="3,3" />
              <circle cx="0" cy="0" r={8} fill={mode === 'line' ? 'transparent' : '#6366f1'} stroke="#a5b4fc" strokeWidth={2} />
              {mode !== 'line' && <circle cx="-2.5" cy="-2.5" r={2} fill="#fff" opacity={0.7} />}
              <text x="0" y="-18" fill="var(--accent)" fontSize="10" fontWeight="bold" textAnchor="middle">
                {mode === 'line' ? 'A (Point on Line)' : 'Endpoint A'}
              </text>
            </g>

            {/* Peg B */}
            <g 
              transform={`translate(${rB.x}, ${rB.y})`}
              onMouseDown={() => handleMouseDown('B')}
              style={{ cursor: draggingPeg === 'B' ? 'grabbing' : 'grab' }}
            >
              <circle cx="0" cy="0" r={18} fill="transparent" />
              <circle cx="0" cy="0" r={13} fill="rgba(99, 102, 241, 0.15)" stroke="var(--accent)" strokeWidth={1} strokeDasharray="3,3" />
              <circle cx="0" cy="0" r={8} fill={mode === 'segment' ? '#6366f1' : 'transparent'} stroke="#a5b4fc" strokeWidth={2} />
              {mode === 'segment' && <circle cx="-2.5" cy="-2.5" r={2} fill="#fff" opacity={0.7} />}
              <text x="0" y="-18" fill="var(--accent)" fontSize="10" fontWeight="bold" textAnchor="middle">
                {mode === 'segment' ? 'Endpoint B' : 'Point B'}
              </text>
            </g>

          </svg>
        </div>

        {/* Footer info text */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            💡 Try changing the **Zoom Out** slider to observe how endpoints behave. Notice how infinite rays and lines keep stretching off-screen!
          </span>
        </div>
      </div>
    </div>
  );
}
