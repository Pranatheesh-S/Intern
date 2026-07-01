import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Sparkles, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage1_ThreadExplorer({ onComplete, addXp }) {
  const [pegA, setPegA] = useState({ x: 150, y: 220 });
  const [pegB, setPegB] = useState({ x: 450, y: 220 });
  const [draggingPeg, setDraggingPeg] = useState(null);
  
  // Track which spools are active / connected
  const [connected, setConnected] = useState({
    red: false,
    blue: false,
    purple: false,
    yellow: false
  });

  const svgRef = useRef(null);

  // Sound effects fallback
  const playSnap = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {}
  };

  // Distance calculation
  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const distPx = getDistance(pegA, pegB);
  // Scale to cm (1px = 0.04cm)
  const distCm = (distPx * 0.04).toFixed(1);

  // Path formulas & approximate lengths based on current coordinates
  const dx = pegB.x - pegA.x;
  const dy = pegB.y - pegA.y;
  const len = Math.max(0.1, getDistance(pegA, pegB));
  const nx = -dy / len; // Perpendicular normal X
  const ny = dx / len;  // Perpendicular normal Y

  // 1. Red (Straight): line segment
  const pathRed = `M ${pegA.x},${pegA.y} L ${pegB.x},${pegB.y}`;
  const lenRed = distCm;

  // 2. Blue (Curved Arc): parabolic droop
  const midX = (pegA.x + pegB.x) / 2;
  const midY = (pegA.y + pegB.y) / 2;
  const arcHeight = 70;
  const ctrlX = midX + nx * arcHeight;
  const ctrlY = midY + ny * arcHeight;
  const pathBlue = `M ${pegA.x},${pegA.y} Q ${ctrlX},${ctrlY} ${pegB.x},${pegB.y}`;
  // Arc length approximation
  const lenBlue = (distPx * 0.04 * 1.22).toFixed(1);

  // 3. Purple (Zigzag): 5 points
  const zigzagPoints = [];
  const steps = 6;
  const amp = 30;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bx = pegA.x + t * dx;
    const by = pegA.y + t * dy;
    if (i > 0 && i < steps) {
      const offset = i % 2 === 0 ? amp : -amp;
      zigzagPoints.push(`${bx + nx * offset},${by + ny * offset}`);
    } else {
      zigzagPoints.push(`${bx},${by}`);
    }
  }
  const pathPurple = `M ${pegA.x},${pegA.y} L ${zigzagPoints.join(' L ')}`;
  const lenPurple = (distPx * 0.04 * 1.48).toFixed(1);

  // 4. Yellow (Wavy Sine): 30 points for smooth waves
  const wavePoints = [];
  const waveSteps = 40;
  const waveAmp = 20;
  const cycles = 4;
  for (let i = 0; i <= waveSteps; i++) {
    const t = i / waveSteps;
    const bx = pegA.x + t * dx;
    const by = pegA.y + t * dy;
    const offset = Math.sin(t * Math.PI * 2 * cycles) * waveAmp;
    wavePoints.push(`${bx + nx * offset},${by + ny * offset}`);
  }
  const pathYellow = `M ${pegA.x},${pegA.y} L ${wavePoints.join(' L ')}`;
  const lenYellow = (distPx * 0.04 * 1.65).toFixed(1);

  // Drag listeners
  const handleMouseDown = (peg) => {
    setDraggingPeg(peg);
  };

  const handleMouseMove = (e) => {
    if (!draggingPeg || !svgRef.current) return;
    
    // Get mouse position relative to SVG viewport
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constraint to screen bounds
    const boundedX = Math.max(40, Math.min(rect.width - 40, x));
    const boundedY = Math.max(40, Math.min(rect.height - 40, y));

    if (draggingPeg === 'A') {
      // Prevent A from getting too close to B
      if (getDistance({ x: boundedX, y: boundedY }, pegB) > 80) {
        setPegA({ x: Math.round(boundedX), y: Math.round(boundedY) });
      }
    } else if (draggingPeg === 'B') {
      // Prevent B from getting too close to A
      if (getDistance(pegA, { x: boundedX, y: boundedY }) > 80) {
        setPegB({ x: Math.round(boundedX), y: Math.round(boundedY) });
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

  const handleToggleSpool = (color) => {
    playSnap();
    setConnected(prev => {
      const nextState = { ...prev, [color]: !prev[color] };
      // Check if this action completed all spools
      if (nextState.red && nextState.blue && nextState.purple && nextState.yellow) {
        // Delay complete slightly for confetti
        addXp(100);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
      return nextState;
    });
  };

  const allConnected = connected.red && connected.blue && connected.purple && connected.yellow;

  const handleReset = () => {
    setPegA({ x: 150, y: 220 });
    setPegB({ x: 450, y: 220 });
    setConnected({ red: false, blue: false, purple: false, yellow: false });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
      {/* LEFT PANEL */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--neutral-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0 }} size={18} />
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            A line segment represents the **shortest path** between two points. Let's verify this experimentally.
          </p>
        </div>

        {/* Spools Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Thread Spools:</h3>
          
          {/* Spool 1: Red */}
          <div 
            onClick={() => handleToggleSpool('red')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.75rem', 
              background: 'var(--surface)', 
              border: `1px solid ${connected.red ? '#ef4444' : 'var(--border)'}`, 
              borderRadius: '10px', 
              cursor: 'pointer',
              opacity: connected.red ? 1 : 0.7,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '12px', height: '24px', background: '#ef4444', borderRadius: '4px', border: '1.5px solid rgba(255,255,255,0.2)' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Straight (Red)</span>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Taut metallic wire</p>
              </div>
            </div>
            {connected.red ? <Check size={16} color="#ef4444" /> : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pin</span>}
          </div>

          {/* Spool 2: Blue */}
          <div 
            onClick={() => handleToggleSpool('blue')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.75rem', 
              background: 'var(--surface)', 
              border: `1px solid ${connected.blue ? '#3b82f6' : 'var(--border)'}`, 
              borderRadius: '10px', 
              cursor: 'pointer',
              opacity: connected.blue ? 1 : 0.7,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '12px', height: '24px', background: '#3b82f6', borderRadius: '4px', border: '1.5px solid rgba(255,255,255,0.2)' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Curved (Blue)</span>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Loose silk thread</p>
              </div>
            </div>
            {connected.blue ? <Check size={16} color="#3b82f6" /> : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pin</span>}
          </div>

          {/* Spool 3: Purple */}
          <div 
            onClick={() => handleToggleSpool('purple')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.75rem', 
              background: 'var(--surface)', 
              border: `1px solid ${connected.purple ? '#a855f7' : 'var(--border)'}`, 
              borderRadius: '10px', 
              cursor: 'pointer',
              opacity: connected.purple ? 1 : 0.7,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '12px', height: '24px', background: '#a855f7', borderRadius: '4px', border: '1.5px solid rgba(255,255,255,0.2)' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Zigzag (Purple)</span>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bent iron wire</p>
              </div>
            </div>
            {connected.purple ? <Check size={16} color="#a855f7" /> : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pin</span>}
          </div>

          {/* Spool 4: Yellow */}
          <div 
            onClick={() => handleToggleSpool('yellow')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.75rem', 
              background: 'var(--surface)', 
              border: `1px solid ${connected.yellow ? '#eab308' : 'var(--border)'}`, 
              borderRadius: '10px', 
              cursor: 'pointer',
              opacity: connected.yellow ? 1 : 0.7,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '12px', height: '24px', background: '#eab308', borderRadius: '4px', border: '1.5px solid rgba(255,255,255,0.2)' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Wavy (Yellow)</span>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Coiled copper cable</p>
              </div>
            </div>
            {connected.yellow ? <Check size={16} color="#eab308" /> : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pin</span>}
          </div>
        </div>

        {/* Reset button */}
        <button onClick={handleReset} className="outline" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          <RefreshCcw size={14} /> Reset Pegboard
        </button>

        {/* Complete Dialog */}
        <div style={{ marginTop: 'auto' }}>
          {allConnected ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Sparkles size={16} /> Experiment complete!
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Notice that no matter how you drag Peg A and B, the **Red (Straight)** thread is *always* the shortest length. This shortest path defines a **Line Segment**!
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Next: Infinite Horizons
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pin all 4 threads to peg A and B to start comparing lengths!</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: INTERACTIVE PEGBOARD */}
      <div className="glass-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        
        {/* Dimensions/Leaderboard overlay */}
        <div style={{ 
          position: 'absolute', 
          top: '15px', 
          right: '15px', 
          background: 'rgba(9, 13, 22, 0.85)', 
          border: '1px solid var(--border)', 
          borderRadius: '12px', 
          padding: '0.75rem 1rem', 
          width: '240px', 
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-heading)', borderBottom: '1px solid var(--border)', paddingBottom: '0.3rem' }}>
            Thread Length Leaderboard
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: connected.red ? '#ef4444' : 'var(--text-muted)' }}>
              <span>🔴 Red (Straight):</span>
              <span style={{ fontWeight: 'bold' }}>{connected.red ? `${lenRed} cm` : 'Disconnected'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: connected.blue ? '#3b82f6' : 'var(--text-muted)' }}>
              <span>🔵 Blue (Curved):</span>
              <span style={{ fontWeight: 'bold' }}>{connected.blue ? `${lenBlue} cm` : 'Disconnected'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: connected.purple ? '#a855f7' : 'var(--text-muted)' }}>
              <span>🟣 Purple (Zigzag):</span>
              <span style={{ fontWeight: 'bold' }}>{connected.purple ? `${lenPurple} cm` : 'Disconnected'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: connected.yellow ? '#eab308' : 'var(--text-muted)' }}>
              <span>🟡 Yellow (Wavy):</span>
              <span style={{ fontWeight: 'bold' }}>{connected.yellow ? `${lenYellow} cm` : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Canvas area */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg 
            ref={svgRef}
            width="100%" 
            height="460" 
            onMouseMove={handleMouseMove}
            style={{ display: 'block', overflow: 'visible', cursor: draggingPeg ? 'grabbing' : 'default' }}
          >
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="peg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#peg-grid)" />
            
            {/* Dynamic Threads */}
            {connected.yellow && (
              <path d={pathYellow} fill="none" stroke="#eab308" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
            )}
            {connected.purple && (
              <path d={pathPurple} fill="none" stroke="#a855f7" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
            )}
            {connected.blue && (
              <path d={pathBlue} fill="none" stroke="#3b82f6" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
            )}
            {connected.red && (
              <path d={pathRed} fill="none" stroke="#ef4444" strokeWidth={4} strokeLinecap="round" />
            )}

            {/* Glowing Peg Connections */}
            {connected.red && (
              <g opacity={0.5}>
                <line x1={pegA.x} y1={pegA.y} x2={pegB.x} y2={pegB.y} stroke="#ef4444" strokeWidth={12} filter="blur(6px)" />
              </g>
            )}

            {/* Distance Dimension Line Label */}
            {allConnected && (
              <g transform={`translate(${midX + nx * 35}, ${midY + ny * 35})`}>
                <rect x="-50" y="-12" width="100" height="24" rx="6" fill="#090d16" stroke="var(--border)" strokeWidth={1.5} />
                <text x="0" y="4" fill="var(--text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {distCm} cm
                </text>
              </g>
            )}

            {/* PEGS */}
            {/* Peg A */}
            <g 
              transform={`translate(${pegA.x}, ${pegA.y})`}
              onMouseDown={() => handleMouseDown('A')}
              style={{ cursor: draggingPeg === 'A' ? 'grabbing' : 'grab' }}
            >
              {/* Outer drag glow */}
              <circle cx="0" cy="0" r={22} fill="transparent" />
              <circle cx="0" cy="0" r={16} fill="rgba(99, 102, 241, 0.15)" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" className="pulse-target" />
              {/* Metal peg body */}
              <circle cx="0" cy="0" r={10} fill="#6366f1" stroke="#a5b4fc" strokeWidth={2} />
              <circle cx="-3" cy="-3" r={3} fill="#fff" opacity={0.7} />
              {/* Text label */}
              <text x="0" y="-24" fill="var(--accent)" fontSize="12" fontWeight="bold" textAnchor="middle">Peg A</text>
            </g>

            {/* Peg B */}
            <g 
              transform={`translate(${pegB.x}, ${pegB.y})`}
              onMouseDown={() => handleMouseDown('B')}
              style={{ cursor: draggingPeg === 'B' ? 'grabbing' : 'grab' }}
            >
              {/* Outer drag glow */}
              <circle cx="0" cy="0" r={22} fill="transparent" />
              <circle cx="0" cy="0" r={16} fill="rgba(99, 102, 241, 0.15)" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" className="pulse-target" />
              {/* Metal peg body */}
              <circle cx="0" cy="0" r={10} fill="#6366f1" stroke="#a5b4fc" strokeWidth={2} />
              <circle cx="-3" cy="-3" r={3} fill="#fff" opacity={0.7} />
              {/* Text label */}
              <text x="0" y="-24" fill="var(--accent)" fontSize="12" fontWeight="bold" textAnchor="middle">Peg B</text>
            </g>

          </svg>
        </div>
        
        {/* Footnote instruction */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            💡 Try dragging **Peg A** or **Peg B** to see how lengths change in real-time.
          </span>
        </div>
      </div>
    </div>
  );
}
