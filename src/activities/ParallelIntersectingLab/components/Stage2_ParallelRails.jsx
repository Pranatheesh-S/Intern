import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Info, Sparkles, CheckSquare, Play, HelpCircle, Train } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage2_ParallelRails({ onComplete, addXp }) {
  // Rail A (Static Reference Line)
  const p1 = { x: 100, y: 160 };
  const p2 = { x: 700, y: 160 };

  // Rail B (Draggable/Adjustable Line)
  const [p3, setP3] = useState({ x: 100, y: 250 });
  const [p4, setP4] = useState({ x: 700, y: 310 }); // Starts angled/non-parallel

  const [isParallel, setIsParallel] = useState(false);
  const [trainRunning, setTrainRunning] = useState(false);
  const [trainRunCompleted, setTrainRunCompleted] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null); // 'left' | 'right'

  const svgRef = useRef(null);
  const trainControls = useAnimation();

  // Convert client coordinates to SVG space using CTM matrix
  const getSVGCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
  };

  // Drag handlers for Rail B
  const handleMouseDown = (node, e) => {
    e.stopPropagation();
    setDraggingNode(node);
  };

  const handleMouseMove = (e) => {
    if (!draggingNode || !svgRef.current) return;
    const coords = getSVGCoordinates(e.clientX, e.clientY);

    // Limit movements to reasonable zones
    const boundedX = Math.max(50, Math.min(750, coords.x));
    const boundedY = Math.max(200, Math.min(420, coords.y)); // bottom half of the canvas

    if (draggingNode === 'left') {
      setP3({ x: p3.x, y: boundedY }); // keep X fixed, adjust height/slope
    } else {
      setP4({ x: p4.x, y: boundedY }); // keep X fixed, adjust height/slope
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [draggingNode]);

  // Check parallel status: Rail A is perfectly horizontal, so Rail B is parallel
  // if the Y coordinates of both ends are practically equal (distance constant).
  const parallelMatched = Math.abs(p3.y - p4.y) <= 2;

  useEffect(() => {
    setIsParallel(parallelMatched);
    if (!parallelMatched) {
      setTrainRunCompleted(false);
    }
  }, [parallelMatched]);

  const handleLaunchTrain = async () => {
    if (!isParallel || trainRunning) return;
    setTrainRunning(true);
    
    // Animate train from left to right along Rail A and Rail B
    trainControls.set({ x: 100, opacity: 1 });
    await trainControls.start({
      x: 700,
      transition: { duration: 3.5, ease: 'easeInOut' }
    });

    addXp(100);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    setTrainRunning(false);
    setTrainRunCompleted(true);
  };

  // Checklist status
  const questRailsParallel = isParallel;
  const questTrainSuccess = trainRunCompleted; 

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
              Lines like railway tracks or opposite edges of a book which do not intersect, however far they are extended, are called <strong>Parallel Lines</strong>.
            </p>
          </div>
        </div>

        {/* Quest Checklist */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckSquare size={14} /> Mission Checklist:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: questRailsParallel ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={questRailsParallel} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>1. Align Rail B parallel to Rail A</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: questTrainSuccess ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={questTrainSuccess} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>2. Launch the train successfully</span>
            </div>
          </div>
        </div>

        {/* Train Launcher Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Engine Controls:</h3>
          
          <button 
            onClick={handleLaunchTrain}
            className={isParallel ? 'primary' : 'outline'}
            disabled={!isParallel || trainRunning}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.8rem',
              borderColor: isParallel ? 'var(--success-border)' : 'var(--border)',
              background: isParallel ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: isParallel ? '#10b981' : 'var(--text-muted)'
            }}
          >
            <Play size={16} fill={isParallel ? '#10b981' : 'transparent'} />
            <span>{trainRunning ? 'Train Running...' : 'Launch Test Train'}</span>
          </button>
        </div>

        {/* Real-time Interactive Guidance */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px dashed var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {!questRailsParallel && (
            <span>👈 Drag the glowing nodes of Rail B (blue) up or down to make it perfectly horizontal and parallel to Rail A (purple)!</span>
          )}
          {questRailsParallel && !trainRunning && (
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
              🎯 Perfect parallel alignment! The distance between the rails is now uniform. Click "Launch Test Train" to run the engine!
            </span>
          )}
          {trainRunning && (
            <span style={{ color: 'var(--accent-text)', fontWeight: 'bold' }}>
              🚂 Chugga-chugga! The parallel tracks keep a constant separation, allowing the train wheels to hold their span perfectly!
            </span>
          )}
        </div>

        {/* Stage complete navigation card */}
        <div style={{ marginTop: 'auto' }}>
          {trainRunCompleted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Sparkles size={16} /> Stage Cleared!
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  You successfully verified parallel rail configurations. Proceed to the Concept Checkup quiz!
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Next: Take Concept Quiz
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Align rails and launch test train to proceed.</span>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANEL: CANVAS */}
      <div 
        className="glass-panel" 
        style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
      >
        {/* Dynamic header status overlay */}
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
          <Train size={14} style={{ color: 'var(--accent)' }} />
          <span>
            {isParallel ? '🟢 Rails Parallel (Distance Constant)' : '🔴 Rails Not Parallel (Will Intersect)'}
          </span>
        </div>

        <div style={{ flex: 1, position: 'relative' }} onMouseMove={handleMouseMove}>
          <svg 
            ref={svgRef}
            viewBox="0 0 800 460"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="rail-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rail-grid)" />

            {/* RAIL TILES (WOODEN SLAT TIES) */}
            <g opacity={0.4}>
              {Array.from({ length: 16 }).map((_, idx) => {
                const xPos = 120 + idx * 36;
                // Height of Rail A is 160, Height of Rail B is interpolated
                const yA = 160;
                const ratio = (xPos - p3.x) / (p4.x - p3.x);
                const yB = p3.y + ratio * (p4.y - p3.y);
                return (
                  <line 
                    key={idx}
                    x1={xPos} 
                    y1={yA} 
                    x2={xPos} 
                    y2={yB} 
                    stroke="#a16207" 
                    strokeWidth={4} 
                    strokeDasharray={isParallel ? 'none' : '2,2'}
                  />
                );
              })}
            </g>

            {/* RAIL A (TOP LINE - PURPLE STEEL RAIL) */}
            <g>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#c084fc" strokeWidth={6} strokeLinecap="round" />
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#a855f7" strokeWidth={2} strokeLinecap="round" />
              <text x={p1.x} y={p1.y - 12} fill="#c084fc" fontSize="10" fontWeight="bold">RAIL A (Reference)</text>
            </g>

            {/* RAIL B (BOTTOM LINE - BLUE ADJUSTABLE STEEL RAIL) */}
            <g>
              <line 
                x1={p3.x} 
                y1={p3.y} 
                x2={p4.x} 
                y2={p4.y} 
                stroke={isParallel ? '#34d399' : '#60a5fa'} 
                strokeWidth={6} 
                strokeLinecap="round" 
                style={{ transition: draggingNode ? 'none' : 'all 0.2s' }}
              />
              <line 
                x1={p3.x} 
                y1={p3.y} 
                x2={p4.x} 
                y2={p4.y} 
                stroke={isParallel ? '#059669' : '#2563eb'} 
                strokeWidth={2} 
                strokeLinecap="round" 
                style={{ transition: draggingNode ? 'none' : 'all 0.2s' }}
              />
              <text x={p3.x} y={p3.y + 24} fill={isParallel ? '#34d399' : '#93c5fd'} fontSize="10" fontWeight="bold">RAIL B (Adjustable)</text>
            </g>

            {/* DYNAMIC SPAN LABELS (DISTANCE CHECKS) */}
            <g opacity={0.85}>
              {/* Left span check */}
              <line x1={p1.x + 20} y1={p1.y} x2={p1.x + 20} y2={p3.y} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3,3" />
              <circle cx={p1.x + 20} cy={(p1.y + p3.y)/2} r={12} fill="#1f2937" stroke="#fbbf24" strokeWidth={1} />
              <text x={p1.x + 20} y={(p1.y + p3.y)/2 + 3} fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
                {Math.round(Math.abs(p3.y - p1.y) * 0.25)} cm
              </text>

              {/* Right span check */}
              <line x1={p2.x - 20} y1={p2.y} x2={p2.x - 20} y2={p4.y} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3,3" />
              <circle cx={p2.x - 20} cy={(p2.y + p4.y)/2} r={12} fill="#1f2937" stroke="#fbbf24" strokeWidth={1} />
              <text x={p2.x - 20} y={(p2.y + p4.y)/2 + 3} fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
                {Math.round(Math.abs(p4.y - p2.y) * 0.25)} cm
              </text>
            </g>

            {/* ANIMATED TEST TRAIN ENGINE */}
            <motion.g 
              animate={trainControls} 
              initial={{ x: 100, opacity: 0 }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              {/* Train wheels snapping onto the rails */}
              {/* Wheel 1 (Rail A) */}
              <circle cx="0" cy="160" r="8" fill="#d1d5db" stroke="#1f2937" strokeWidth={2} />
              <circle cx="0" cy="160" r="3" fill="#374151" />
              
              {/* Wheel 2 (Rail B) */}
              <circle cx="0" cy={isParallel ? p3.y : 160 + (p3.y - 160)} r="8" fill="#d1d5db" stroke="#1f2937" strokeWidth={2} />
              <circle cx="0" cy={isParallel ? p3.y : 160 + (p3.y - 160)} r="3" fill="#374151" />

              {/* Connecting chassis bracket */}
              <line x1="0" y1="160" x2="0" y2={p3.y} stroke="#ef4444" strokeWidth={4} strokeLinecap="round" />
              <rect x="-12" y="145" width="24" height="15" rx="2" fill="#ef4444" />
              <rect x="-12" y={p3.y - 15} width="24" height="15" rx="2" fill="#ef4444" />
              
              {/* Red Light Indicator */}
              <circle cx="0" cy={(160 + p3.y)/2} r="5" fill="#22c55e" className="pulse-target" />
            </motion.g>

            {/* DRAGGABLE PEGS (RAIL B ENDPOINTS) */}
            {!trainRunning && (
              <>
                <circle cx={p3.x} cy={p3.y} r={12} fill="#60a5fa" stroke="#fff" strokeWidth={2} style={{ cursor: 'ns-resize' }} onMouseDown={(e) => handleMouseDown('left', e)} />
                <circle cx={p4.x} cy={p4.y} r={12} fill="#60a5fa" stroke="#fff" strokeWidth={2} style={{ cursor: 'ns-resize' }} onMouseDown={(e) => handleMouseDown('right', e)} />
              </>
            )}

          </svg>
        </div>

        {/* Canvas Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            {isParallel ? '🚂 Slopes are parallel. Launch the train to verify!' :
             '⚠️ Derail Alert: The spans at both ends must read the same (e.g. 23 cm) for the rails to be parallel!'}
          </span>
        </div>
      </div>
    </div>
  );
}
