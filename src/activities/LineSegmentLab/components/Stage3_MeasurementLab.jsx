import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles, RotateCw, RefreshCcw, CheckSquare, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage3_MeasurementLab({ onComplete, addXp }) {
  const [activeTool, setActiveTool] = useState('none'); // 'none' | 'tracing' | 'ruler' | 'divider'
  
  // Tracing paper state
  const [tracingPos, setTracingPos] = useState({ x: 100, y: 300 });
  const [isTraced, setIsTraced] = useState(false);
  const [tracingDragActive, setTracingDragActive] = useState(false);

  // Ruler state
  const [rulerPos, setRulerPos] = useState({ x: 300, y: 300 });
  const [rulerRotation, setRulerRotation] = useState(0);
  const [rulerDragActive, setRulerDragActive] = useState(false);
  const [rulerRotateActive, setRulerRotateActive] = useState(false);
  const [parallaxAngle, setParallaxAngle] = useState('center'); // 'left' | 'center' | 'right'

  // Divider state
  const [dividerPos, setDividerPos] = useState({ x: 380, y: 300 });
  const [dividerRotation, setDividerRotation] = useState(0);
  const [dividerSpan, setDividerSpan] = useState(60); // px span between legs
  const [dividerDragActive, setDividerDragActive] = useState(false);
  const [dividerSpanActive, setDividerSpanActive] = useState(false);
  const [dividerRotateActive, setDividerRotateActive] = useState(false);

  // Completed check: must compare using divider
  const [compareCompleted, setCompareCompleted] = useState(false);

  // Segment geometries (centered within 800x460 space)
  // Segment PQ (7.2 cm = 144px at 15 degrees)
  const pQ = {
    start: { x: 150, y: 150 },
    end: { x: 289, y: 187 } // dx=139, dy=37 -> len = 144 (approx 7.2cm)
  };

  // Segment RS (7.6 cm = 152px at -20 degrees)
  const rS = {
    start: { x: 450, y: 220 },
    end: { x: 593, y: 168 } // dx=143, dy=-52 -> len = 152 (approx 7.6cm)
  };

  const containerRef = useRef(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const rotateStartAngle = useRef(0);

  // Convert client mouse coordinates to SVG viewBox coordinates using CTM matrix
  const getSVGCoordinates = (clientX, clientY) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const svg = rect.height === 0 ? null : containerRef.current.querySelector('svg');
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
  };

  // Sound effects fallback
  const playSnap = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {}
  };

  // SVG Mouse event listeners
  const handleMouseDown = (tool, type, e) => {
    e.stopPropagation();
    const coords = getSVGCoordinates(e.clientX, e.clientY);

    if (tool === 'tracing') {
      setTracingDragActive(true);
      dragStartOffset.current = { x: coords.x - tracingPos.x, y: coords.y - tracingPos.y };
    } else if (tool === 'ruler') {
      if (type === 'drag') {
        setRulerDragActive(true);
        dragStartOffset.current = { x: coords.x - rulerPos.x, y: coords.y - rulerPos.y };
      } else if (type === 'rotate') {
        setRulerRotateActive(true);
        const dx = coords.x - rulerPos.x;
        const dy = coords.y - rulerPos.y;
        rotateStartAngle.current = Math.atan2(dy, dx) * 180 / Math.PI - rulerRotation;
      }
    } else if (tool === 'divider') {
      if (type === 'drag') {
        setDividerDragActive(true);
        dragStartOffset.current = { x: coords.x - dividerPos.x, y: coords.y - dividerPos.y };
      } else if (type === 'rotate') {
        setDividerRotateActive(true);
        const dx = coords.x - dividerPos.x;
        const dy = coords.y - dividerPos.y;
        rotateStartAngle.current = Math.atan2(dy, dx) * 180 / Math.PI - dividerRotation;
      } else if (type === 'span') {
        setDividerSpanActive(true);
        dragStartOffset.current = { x: coords.x, y: coords.y };
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const coords = getSVGCoordinates(e.clientX, e.clientY);

    // Tracing paper drag
    if (tracingDragActive) {
      setTracingPos({
        x: coords.x - dragStartOffset.current.x,
        y: coords.y - dragStartOffset.current.y
      });
    }

    // Ruler drag or rotate
    if (rulerDragActive) {
      setRulerPos({
        x: coords.x - dragStartOffset.current.x,
        y: coords.y - dragStartOffset.current.y
      });
    } else if (rulerRotateActive) {
      const dx = coords.x - rulerPos.x;
      const dy = coords.y - rulerPos.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI - rotateStartAngle.current;
      setRulerRotation(angle);
    }

    // Divider drag, rotate, or span adjustment
    if (dividerDragActive) {
      setDividerPos({
        x: coords.x - dragStartOffset.current.x,
        y: coords.y - dragStartOffset.current.y
      });
    } else if (dividerRotateActive) {
      const dx = coords.x - dividerPos.x;
      const dy = coords.y - dividerPos.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI - rotateStartAngle.current;
      setDividerRotation(angle);
    } else if (dividerSpanActive) {
      const dist = Math.sqrt(Math.pow(coords.x - dividerPos.x, 2) + Math.pow(coords.y - dividerPos.y, 2));
      const boundedSpan = Math.max(20, Math.min(200, dist * 0.8));
      setDividerSpan(Math.round(boundedSpan));
    }
  };

  const handleMouseUp = () => {
    setTracingDragActive(false);
    setRulerDragActive(false);
    setRulerRotateActive(false);
    setDividerDragActive(false);
    setDividerRotateActive(false);
    setDividerSpanActive(false);

    // Check if divider is placed near Segment RS to evaluate comparison
    if (activeTool === 'divider') {
      const distToR = Math.sqrt(Math.pow(dividerPos.x - rS.start.x, 2) + Math.pow(dividerPos.y - rS.start.y, 2));
      const spanMatched = Math.abs(dividerSpan - 144) < 15;
      
      if (distToR < 35 && spanMatched && !compareCompleted) {
        setCompareCompleted(true);
        addXp(100);
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.75 } });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [tracingDragActive, rulerDragActive, rulerRotateActive, dividerDragActive, dividerRotateActive, dividerSpanActive, activeTool, dividerSpan, dividerPos]);

  const handleReset = () => {
    setActiveTool('none');
    setIsTraced(false);
    setTracingPos({ x: 100, y: 300 });
    setRulerPos({ x: 300, y: 300 });
    setRulerRotation(0);
    setDividerPos({ x: 380, y: 300 });
    setDividerRotation(0);
    setDividerSpan(60);
  };

  const rulerTicks = [];
  for (let i = 0; i <= 80; i += 2) {
    rulerTicks.push(i);
  }

  const halfSpan = dividerSpan / 2;
  const legLength = 160;
  const height = Math.sqrt(Math.max(0, legLength * legLength - halfSpan * halfSpan));

  // Quest validation checks
  const questToolSelected = activeTool !== 'none';
  const questSpanMatched = activeTool === 'divider' && Math.abs(dividerSpan - 144) < 15;
  const questDividerPlaced = compareCompleted;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
      {/* LEFT PANEL */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Mission Goal Box */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--neutral-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <Target style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} size={18} />
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)', textTransform: 'uppercase' }}>Your Mission:</span>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Prove with 100% accuracy which segment is longer: <strong>PQ</strong> or <strong>RS</strong>?
            </p>
          </div>
        </div>

        {/* Mission Checklist */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckSquare size={14} /> Mission Checklist:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: questToolSelected ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={questToolSelected} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>1. Choose any tool to explore</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: questSpanMatched ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={questSpanMatched} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>2. Fit Divider span to PQ (7.2 cm)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: questDividerPlaced ? 'var(--success)' : 'var(--text-muted)' }}>
              <input type="checkbox" checked={questDividerPlaced} readOnly style={{ accentColor: 'var(--success)' }} />
              <span>3. Place Divider on Point R to compare</span>
            </div>
          </div>
        </div>

        {/* Tool Selector Tray */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Select Measurement Tool:</h3>
          
          <button 
            onClick={() => setActiveTool('none')}
            className={activeTool === 'none' ? 'primary' : 'outline'}
            style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
          >
            Observation (Just Looking)
          </button>

          <button 
            onClick={() => { setActiveTool('tracing'); setIsTraced(false); }}
            className={activeTool === 'tracing' ? 'primary' : 'outline'}
            style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
          >
            Tracing Paper Method
          </button>

          <button 
            onClick={() => setActiveTool('ruler')}
            className={activeTool === 'ruler' ? 'primary' : 'outline'}
            style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
          >
            Standard Ruler (Scale)
          </button>

          <button 
            onClick={() => setActiveTool('divider')}
            className={activeTool === 'divider' ? 'primary' : 'outline'}
            style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
          >
            Geometrical Divider (Calipers)
          </button>
        </div>

        {/* Parallax controls (if ruler is active) */}
        {activeTool === 'ruler' && (
          <div style={{ 
            background: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '10px', 
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Eye View Angle (Parallax Error):</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button 
                onClick={() => setParallaxAngle('left')} 
                className="outline" 
                style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem', background: parallaxAngle === 'left' ? 'var(--danger-bg)' : 'transparent', color: parallaxAngle === 'left' ? 'var(--danger)' : 'var(--text-primary)' }}
              >
                Left Offset
              </button>
              <button 
                onClick={() => setParallaxAngle('center')} 
                className="outline" 
                style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem', background: parallaxAngle === 'center' ? 'var(--success-bg)' : 'transparent', color: parallaxAngle === 'center' ? 'var(--success)' : 'var(--text-primary)' }}
              >
                Straight
              </button>
              <button 
                onClick={() => setParallaxAngle('right')} 
                className="outline" 
                style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem', background: parallaxAngle === 'right' ? 'var(--danger-bg)' : 'transparent', color: parallaxAngle === 'right' ? 'var(--danger)' : 'var(--text-primary)' }}
              >
                Right Offset
              </button>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Notice how viewing tick marks from an angle shifts the measurement readouts slightly!
            </span>
          </div>
        )}

        <button onClick={handleReset} className="outline" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          <RefreshCcw size={14} /> Reset Lab Tools
        </button>

        {/* Dynamic Instructional Quest Guide */}
        <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px dashed var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {activeTool === 'none' && (
            <span>👈 Select a tool above to start. Notice how PQ and RS are angled differently, making comparison by observation hard!</span>
          )}
          {activeTool === 'tracing' && (
            <span>📖 Drag the translucent tracing paper over PQ, click <strong>Trace Line PQ</strong>, then align it over RS to visually compare them.</span>
          )}
          {activeTool === 'ruler' && (
            <span>📏 Align the ruler with PQ and RS to read their measurements. Try changing the <strong>Eye View Angle</strong> to observe parallax error.</span>
          )}
          {activeTool === 'divider' && !questSpanMatched && (
            <span style={{ color: 'var(--accent-text)', fontWeight: 'bold' }}>
              📐 Stretch the divider's span to match PQ: drag the circular handle (↔) on the right tip until the label reads exactly <strong>7.2 cm</strong>!
            </span>
          )}
          {activeTool === 'divider' && questSpanMatched && !compareCompleted && (
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
              🎯 Span locked! Now drag the divider body and align the left metal point directly onto <strong>Point R</strong> of segment RS to compare!
            </span>
          )}
          {compareCompleted && (
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
              🎉 Mission Clear! The Divider proves that RS is longer than PQ. Click Proceed below!
            </span>
          )}
        </div>

        {/* Complete Dialog */}
        <div style={{ marginTop: 'auto' }}>
          {compareCompleted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Sparkles size={16} /> Accurate Comparison!
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  By locking the span of <strong>PQ</strong> (7.2 cm) inside the <strong>Divider</strong> and matching it against <strong>RS</strong> (7.6 cm), you have proved RS is longer with 100% accuracy!
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Proceed to Quiz
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Measure segment PQ, lock it in the <strong>Divider</strong>, and overlay it on segment RS to proceed.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: SVG CANVAS */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="glass-panel" 
        style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <svg 
            viewBox="0 0 800 460"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Grid background */}
            <defs>
              <pattern id="measurement-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#measurement-grid)" />

            {/* Glowing guide highlights for active quests */}
            {activeTool === 'divider' && !questSpanMatched && (
              <g opacity={0.6}>
                {/* Highlight segment PQ ends to help them stretch */}
                <circle cx={pQ.end.x} cy={pQ.end.y} r={18} fill="none" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3,3" className="pulse-target" />
              </g>
            )}

            {activeTool === 'divider' && questSpanMatched && !compareCompleted && (
              <g opacity={0.75}>
                {/* Highlight Point R to guide the drop */}
                <circle cx={rS.start.x} cy={rS.start.y} r={28} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="4,4" className="pulse-target" />
              </g>
            )}

            {/* SEGMENTS */}
            {/* Segment PQ */}
            <g>
              <line x1={pQ.start.x} y1={pQ.start.y} x2={pQ.end.x} y2={pQ.end.y} stroke="#3b82f6" strokeWidth={4} strokeLinecap="round" />
              <circle cx={pQ.start.x} cy={pQ.start.y} r={6} fill="#60a5fa" stroke="#1d4ed8" strokeWidth={1.5} />
              <circle cx={pQ.end.x} cy={pQ.end.y} r={6} fill="#60a5fa" stroke="#1d4ed8" strokeWidth={1.5} />
              <text x={pQ.start.x - 12} y={pQ.start.y - 8} fill="#f8fafc" fontSize="12" fontWeight="bold">P</text>
              <text x={pQ.end.x + 12} y={pQ.end.y - 8} fill="#f8fafc" fontSize="12" fontWeight="bold">Q</text>
            </g>

            {/* Segment RS */}
            <g>
              <line x1={rS.start.x} y1={rS.start.y} x2={rS.end.x} y2={rS.end.y} stroke="#10b981" strokeWidth={4} strokeLinecap="round" />
              <circle cx={rS.start.x} cy={rS.start.y} r={6} fill="#34d399" stroke="#047857" strokeWidth={1.5} />
              <circle cx={rS.end.x} cy={rS.end.y} r={6} fill="#34d399" stroke="#047857" strokeWidth={1.5} />
              <text x={rS.start.x - 12} y={rS.start.y + 16} fill="#f8fafc" fontSize="12" fontWeight="bold">R</text>
              <text x={rS.end.x + 12} y={rS.end.y + 16} fill="#f8fafc" fontSize="12" fontWeight="bold">S</text>
            </g>

            {/* 1. TRACING PAPER OVERLAY */}
            {activeTool === 'tracing' && (
              <g 
                transform={`translate(${tracingPos.x}, ${tracingPos.y})`}
                style={{ cursor: tracingDragActive ? 'grabbing' : 'grab' }}
              >
                {/* Translucent Tracing Paper Sheet */}
                <rect 
                  x="0" 
                  y="0" 
                  width="180" 
                  height="120" 
                  rx="6" 
                  fill="rgba(255,255,255,0.15)" 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth={1.5}
                  onMouseDown={(e) => handleMouseDown('tracing', 'drag', e)}
                />
                
                {/* Drag Handle Tag */}
                <g onMouseDown={(e) => handleMouseDown('tracing', 'drag', e)}>
                  <rect x="5" y="-18" width="80" height="18" rx="4" fill="#1f2937" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                  <text x="45" y="-5" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">TRACING PAPER</text>
                </g>

                {/* Tracing actions buttons inside the paper */}
                <foreignObject x="15" y="68" width="150" height="40">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTraced(true);
                      playSnap();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.3rem',
                      fontSize: '0.75rem',
                      background: 'rgba(99,102,241,0.85)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {isTraced ? '⚡ PQ Traced Successfully' : '🖊️ Trace Line PQ'}
                  </button>
                </foreignObject>

                {/* Traced Red Segment on the Paper */}
                {isTraced && (
                  <g>
                    <line x1="20" y1="40" x2="164" y2="40" stroke="#ef4444" strokeWidth={3.5} strokeDasharray="3,3" />
                    <circle cx="20" cy="40" r="5" fill="#f87171" stroke="#b91c1c" strokeWidth={1} />
                    <circle cx="164" cy="40" r="5" fill="#f87171" stroke="#b91c1c" strokeWidth={1} />
                    <text x="20" y="32" fill="#ef4444" fontSize="9" fontWeight="bold">P'</text>
                    <text x="164" y="32" fill="#ef4444" fontSize="9" fontWeight="bold">Q'</text>
                  </g>
                )}
              </g>
            )}

            {/* 2. ROTATABLE RULER OVERLAY */}
            {activeTool === 'ruler' && (
              <g 
                transform={`translate(${rulerPos.x}, ${rulerPos.y}) rotate(${rulerRotation})`}
                style={{ cursor: rulerDragActive ? 'grabbing' : 'default' }}
              >
                <rect 
                  x="-20" 
                  y="-20" 
                  width="220" 
                  height="40" 
                  rx="4" 
                  fill="rgba(243,244,246,0.18)" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth={1.5}
                  onMouseDown={(e) => handleMouseDown('ruler', 'drag', e)}
                  style={{ cursor: 'grab' }}
                />

                {/* Tick marks */}
                {rulerTicks.map((tick) => {
                  const tickX = tick * 2.2;
                  const isCm = tick % 10 === 0;
                  const tickHeight = isCm ? 12 : (tick % 5 === 0 ? 8 : 5);
                  
                  let pShift = 0;
                  if (parallaxAngle === 'left') pShift = -3.5;
                  if (parallaxAngle === 'right') pShift = 3.5;

                  return (
                    <g key={tick} transform={`translate(${tickX}, 0)`}>
                      <line x1={pShift} y1={-20} x2={pShift} y2={-20 + tickHeight} stroke="#cbd5e1" strokeWidth={isCm ? 1 : 0.5} />
                      {isCm && (
                        <text x={pShift} y={5} fill="#94a3b8" fontSize="8" textAnchor="middle">
                          {tick / 10}
                        </text>
                      )}
                    </g>
                  );
                })}

                <g 
                  transform="translate(190, 0)" 
                  onMouseDown={(e) => handleMouseDown('ruler', 'rotate', e)}
                  style={{ cursor: 'crosshair' }}
                >
                  <circle cx="0" cy="0" r="10" fill="var(--accent)" stroke="#fff" strokeWidth={1} />
                  <RotateCw size={10} color="#fff" style={{ transform: 'translate(-5px, -5px)' }} />
                </g>
                <text x="180" y="24" fill="#94a3b8" fontSize="8" textAnchor="end">Drag handle to rotate</text>
              </g>
            )}

            {/* 3. METALLIC DIVIDER TOOL */}
            {activeTool === 'divider' && (
              <g 
                transform={`translate(${dividerPos.x}, ${dividerPos.y}) rotate(${dividerRotation})`}
                style={{ cursor: dividerDragActive ? 'grabbing' : 'default' }}
              >
                <circle cx="0" cy={-height} r="8" fill="rgba(0,0,0,0.4)" />
                
                {/* Left Leg */}
                <line x1={-halfSpan} y1="0" x2="0" y2={-height} stroke="#d1d5db" strokeWidth={6} strokeLinecap="round" />
                <line x1={-halfSpan} y1="0" x2="0" y2={-height} stroke="#9ca3af" strokeWidth={3} strokeLinecap="round" />
                <polygon points={`${-halfSpan - 1.5},0 ${-halfSpan + 1.5},0 ${-halfSpan},15`} fill="#9ca3af" />

                {/* Right Leg */}
                <line x1={halfSpan} y1="0" x2="0" y2={-height} stroke="#d1d5db" strokeWidth={6} strokeLinecap="round" />
                <line x1={halfSpan} y1="0" x2="0" y2={-height} stroke="#9ca3af" strokeWidth={3} strokeLinecap="round" />
                <polygon points={`${halfSpan - 1.5},0 ${halfSpan + 1.5},0 ${halfSpan},15`} fill="#9ca3af" />

                <circle cx="0" cy={-height} r="6" fill="#fbbf24" stroke="#d97706" strokeWidth={1.5} />
                <circle cx="0" cy={-height} r="1.5" fill="#fff" />

                <rect 
                  x={-halfSpan} 
                  y={-height} 
                  width={dividerSpan} 
                  height={height} 
                  fill="transparent" 
                  onMouseDown={(e) => handleMouseDown('divider', 'drag', e)}
                  style={{ cursor: 'grab' }}
                />

                {/* Span width adjuster handle at the tip */}
                <g 
                  transform={`translate(${halfSpan}, 0)`}
                  onMouseDown={(e) => handleMouseDown('divider', 'span', e)}
                  style={{ cursor: 'ew-resize' }}
                >
                  <circle cx="0" cy="0" r={10} fill="var(--accent)" stroke="#fff" strokeWidth={1} opacity={0.8} />
                  <text x="0" y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">↔</text>
                  
                  {/* Glowing halo guide if not yet matched to PQ */}
                  {!questSpanMatched && (
                    <circle cx="0" cy="0" r={16} fill="none" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3,3" className="pulse-target" />
                  )}
                </g>

                <g 
                  transform={`translate(0, ${-height - 18})`}
                  onMouseDown={(e) => handleMouseDown('divider', 'rotate', e)}
                  style={{ cursor: 'crosshair' }}
                >
                  <circle cx="0" cy="0" r={8} fill="#10b981" stroke="#fff" strokeWidth={1} />
                  <RotateCw size={8} color="#fff" style={{ transform: 'translate(-4px, -4px)' }} />
                </g>

                <g transform="translate(0, -30)">
                  <rect x="-30" y="-8" width="60" height="15" rx="3" fill="#1f2937" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                  <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle">
                    {(dividerSpan * 0.05).toFixed(1)} cm
                  </text>
                </g>
              </g>
            )}

          </svg>
        </div>

        {/* Footer info text (fixed light text color) */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            {activeTool === 'none' ? '👀 Tap Tracing, Ruler, or Divider to begin precise measurements.' :
             activeTool === 'tracing' ? '📖 Drag Tracing Paper over PQ, trace it, then compare it directly by dragging it over RS.' :
             activeTool === 'ruler' ? '📏 Align the ruler with segments to read them. Toggle viewpoints to see parallax.' :
             '📐 Stretch the divider tips to fit PQ, then drag it and align the left tip with point R on segment RS.'}
          </span>
        </div>
      </div>
    </div>
  );
}
