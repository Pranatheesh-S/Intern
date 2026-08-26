import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

export default function ManActivity() {
  const [isPlaying, setIsPlaying] = useState(true);
  
  const requestRef = useRef();
  const lastTimeRef = useRef();
  
  const GROUND_Y = 280;
  const START_X = 110;
  const START_Y = 160;
  const GRAVITY = 800;
  const VX = 200;
  
  const bounceVys = [
    -Math.sqrt(2 * GRAVITY * 100), // Bounce 1 (70cm)
    -Math.sqrt(2 * GRAVITY * 50),  // Bounce 2 (35cm)
    -Math.sqrt(2 * GRAVITY * 25),  // Bounce 3 (18cm)
  ];

  const stateRef = useRef({
    x: START_X,
    y: START_Y,
    vy: -Math.sqrt(2 * GRAVITY * 120) + 100, // Initial throw
    bounceIndex: 0,
    trail: [],
    timer: 0 
  });

  const [renderState, setRenderState] = useState({ x: START_X, y: START_Y, trail: [] });

  const resetPhysics = () => {
    stateRef.current = {
      x: START_X,
      y: START_Y,
      vy: -350,
      bounceIndex: 0,
      trail: [],
      timer: 0
    };
  };

  const update = (time) => {
    if (lastTimeRef.current != undefined && isPlaying) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      
      let { x, y, vy, bounceIndex, trail, timer } = stateRef.current;
      
      timer += deltaTime;
      if (timer > 0.05) { 
        trail.push({ x, y, opacity: 1 });
        timer = 0;
      }
      
      trail = trail.map(t => ({ ...t, opacity: t.opacity - deltaTime * 0.8 })).filter(t => t.opacity > 0);

      vy += GRAVITY * deltaTime;
      x += VX * deltaTime;
      y += vy * deltaTime;

      if (y >= GROUND_Y) {
        y = GROUND_Y;
        if (bounceIndex < bounceVys.length) {
          vy = bounceVys[bounceIndex];
          bounceIndex++;
        } else {
          if (x > 850) {
            resetPhysics();
            lastTimeRef.current = time;
            if (isPlaying) {
              requestRef.current = requestAnimationFrame(update);
            }
            return;
          }
        }
      }

      stateRef.current = { x, y, vy, bounceIndex, trail, timer };
      setRenderState({ x, y, trail: [...trail] });
    }
    lastTimeRef.current = time;
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '1.5rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      maxWidth: '100%',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
        <span style={{ fontSize: '1.5rem' }}>⚽</span>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e3a8a', margin: 0 }}>
          Every bounce obeys the same curve
        </h3>
        <span style={{
          background: '#f1f5f9',
          color: '#475569',
          fontSize: '0.85rem',
          fontWeight: '700',
          padding: '0.35rem 1rem',
          borderRadius: '9999px',
          border: '1.5px solid #cbd5e1'
        }}>
          living picture · a real case, moving
        </span>
      </div>
      
      <p style={{
        fontSize: '1.25rem',
        fontWeight: '500',
        color: '#475569',
        lineHeight: '1.7',
        margin: '0 0 1.5rem 0'
      }}>
        Throw a ball and physics draws the same arch every time — and each bounce rises to about half the height of the one before. Two patterns in one game.
      </p>

      <div style={{
        background: '#fffdf5',
        border: '1px solid #fde68a',
        borderRadius: '16px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0
      }}>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <svg viewBox="0 0 800 350" style={{ width: '100%', height: '100%', display: 'block' }}>
          {/* Ground */}
          <rect x="50" y={GROUND_Y} width="700" height="10" fill="#4ade80" />
          
          {/* Peak 1 */}
          <line x1="220" y1="80" x2="220" y2={GROUND_Y} stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6 6" />
          <text x="220" y="70" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">140 cm</text>
          
          {/* Peak 2 */}
          <line x1="430" y1="180" x2="430" y2={GROUND_Y} stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6 6" />
          <text x="430" y="170" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">70 cm</text>

          {/* Peak 3 */}
          <line x1="570" y1="230" x2="570" y2={GROUND_Y} stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6 6" />
          <text x="570" y="220" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">35 cm</text>

          {/* Peak 4 */}
          <line x1="660" y1="255" x2="660" y2={GROUND_Y} stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6 6" />
          <text x="660" y="245" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">18 cm</text>

          {/* Stick Figure */}
          <g transform="translate(80, 160)">
            {/* Head */}
            <circle cx="0" cy="-20" r="15" fill="#f59e0b" />
            {/* Body */}
            <line x1="0" y1="-5" x2="0" y2="60" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            {/* Arms */}
            <line x1="0" y1="10" x2="30" y2="-10" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            {/* Legs */}
            <line x1="0" y1="60" x2="-20" y2="120" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            <line x1="0" y1="60" x2="20" y2="120" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          </g>

          {/* Trail */}
          {renderState.trail.map((t, i) => (
            <circle key={i} cx={t.x} cy={t.y} r="10" fill="#fca5a5" opacity={t.opacity * 0.5} />
          ))}

          {/* The Ball */}
          <circle cx={renderState.x} cy={renderState.y} r="12" fill="#b91c1c" />
          <circle cx={renderState.x - 3} cy={renderState.y - 3} r="4" fill="#f87171" opacity="0.6" />
        </svg>
        </div>

        {/* Footer controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '1rem', borderTop: '1px solid #fef3c7', background: '#fff', flexShrink: 0 }}>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', 
              padding: '0.5rem 1.25rem', color: '#1e40af', fontWeight: 'bold', cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />} {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#475569' }}>
            the same arch every time — mathematicians call it a parabola
          </span>
        </div>
      </div>
    </div>
  );
}
