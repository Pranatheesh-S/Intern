import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus, Info, CheckCircle2 } from 'lucide-react';
import { LemonSVG, VoltmeterSVG } from './CircuitElements2D';

export default function Stage2_Test({ onComplete }) {
  const [lemonCount, setLemonCount] = useState(1);
  const [connected, setConnected] = useState(false);
  const [voltage, setVoltage] = useState(0.00);

  useEffect(() => {
    if (connected) {
      setVoltage(lemonCount * 0.92);
    } else {
      setVoltage(0.00);
    }
  }, [lemonCount, connected]);

  const addLemon = () => { if (lemonCount < 5) setLemonCount(p => p + 1); };
  const removeLemon = () => { if (lemonCount > 1) setLemonCount(p => p - 1); };

  const isSuccess = voltage >= 2.0;

  // Base positions for up to 5 lemons
  const getLemonPos = (i, total) => {
    const spacing = 100;
    const startX = 400 - ((total - 1) * spacing) / 2;
    return { x: startX + (i * spacing) - 100, y: 250 };
  };

  const voltmeterPos = { x: 600, y: 80 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Instructions */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '12px' }}>
          <Info size={24} color="var(--primary)" />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Measure the Voltage</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.95rem' }}>
            {!connected 
              ? "Click the dotted lines to connect the voltmeter to your lemon cell."
              : isSuccess 
                ? "Great! The voltage is now high enough (> 2.0V) to power a red LED."
                : "A single lemon only produces about 0.9V. Connect more lemons in series to reach the 2.0V needed for the LED!"}
          </p>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="glass-panel" style={{ position: 'relative', height: '400px', background: 'var(--canvas-bg)', overflow: 'hidden' }}>
        <div className="canvas-bg-grid" />
        
        <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ position: "absolute", top: 0, left: 0 }}>
          
          {/* Voltmeter Probes / Wires */}
          {!connected && (
            <g>
              <path 
                d={`M ${voltmeterPos.x + 30} ${voltmeterPos.y + 115} Q ${voltmeterPos.x - 50} ${voltmeterPos.y + 200} ${getLemonPos(0, lemonCount).x - 20} ${getLemonPos(0, lemonCount).y - 30}`} 
                fill="none" stroke="rgba(0,0,0,0)" strokeWidth="24" style={{ cursor: "pointer", pointerEvents: "stroke" }}
                onClick={() => setConnected(true)}
              />
              <path 
                d={`M ${voltmeterPos.x + 70} ${voltmeterPos.y + 115} Q ${voltmeterPos.x + 150} ${voltmeterPos.y + 200} ${getLemonPos(lemonCount - 1, lemonCount).x + 19} ${getLemonPos(lemonCount - 1, lemonCount).y - 35}`} 
                fill="none" stroke="rgba(0,0,0,0)" strokeWidth="24" style={{ cursor: "pointer", pointerEvents: "stroke" }}
                onClick={() => setConnected(true)}
              />

              <path d={`M ${voltmeterPos.x + 30} ${voltmeterPos.y + 115} Q ${voltmeterPos.x - 50} ${voltmeterPos.y + 200} ${getLemonPos(0, lemonCount).x - 20} ${getLemonPos(0, lemonCount).y - 30}`} fill="none" stroke="#fca5a5" strokeWidth="3" strokeDasharray="6,6" style={{ pointerEvents: "none" }} />
              <path d={`M ${voltmeterPos.x + 70} ${voltmeterPos.y + 115} Q ${voltmeterPos.x + 150} ${voltmeterPos.y + 200} ${getLemonPos(lemonCount - 1, lemonCount).x + 19} ${getLemonPos(lemonCount - 1, lemonCount).y - 35}`} fill="none" stroke="#93c5fd" strokeWidth="3" strokeDasharray="6,6" style={{ pointerEvents: "none" }} />
              
              <circle cx={voltmeterPos.x - 10} cy={voltmeterPos.y + 160} r="6" fill="#ef4444" style={{ animation: "pulse 1.5s infinite" }} />
              <circle cx={voltmeterPos.x + 110} cy={voltmeterPos.y + 160} r="6" fill="#3b82f6" style={{ animation: "pulse 1.5s infinite" }} />
            </g>
          )}

          {connected && (
            <g>
              <path d={`M ${voltmeterPos.x + 30} ${voltmeterPos.y + 115} Q ${voltmeterPos.x - 50} ${voltmeterPos.y + 200} ${getLemonPos(0, lemonCount).x - 20} ${getLemonPos(0, lemonCount).y - 30}`} fill="none" stroke="#ef4444" strokeWidth="4" />
              <path d={`M ${voltmeterPos.x + 70} ${voltmeterPos.y + 115} Q ${voltmeterPos.x + 150} ${voltmeterPos.y + 200} ${getLemonPos(lemonCount - 1, lemonCount).x + 19} ${getLemonPos(lemonCount - 1, lemonCount).y - 35}`} fill="none" stroke="#3b82f6" strokeWidth="4" />
            </g>
          )}

          {/* Inter-Lemon Wires */}
          {Array.from({ length: lemonCount - 1 }).map((_, i) => {
            const startX = getLemonPos(i, lemonCount).x + 19;
            const startY = getLemonPos(i, lemonCount).y - 35;
            const endX = getLemonPos(i + 1, lemonCount).x - 20;
            const endY = getLemonPos(i + 1, lemonCount).y - 30;
            const midX = (startX + endX) / 2;
            const midY = Math.min(startY, endY) - 20;
            return (
              <path key={`wire-${i}`} d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`} fill="none" stroke="#3b82f6" strokeWidth="4" />
            );
          })}

          {/* Lemons */}
          {Array.from({ length: lemonCount }).map((_, i) => {
            const pos = getLemonPos(i, lemonCount);
            return (
              <LemonSVG key={`lemon-${i}`} x={pos.x - 50} y={pos.y - 50} hasCopper={true} hasIron={true} scale={1} />
            );
          })}

          {/* Voltmeter */}
          <VoltmeterSVG x={voltmeterPos.x} y={voltmeterPos.y} scale={1.2} voltage={voltage} />
        </svg>

        {/* Controls */}
        <AnimatePresence>
          {connected && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Cells in Series:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={removeLemon} disabled={lemonCount === 1} className="icon-btn" style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '50%' }}><Minus size={16} /></button>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '24px', textAlign: 'center', color: 'var(--text-heading)' }}>{lemonCount}</span>
                <button onClick={addLemon} disabled={lemonCount === 5} className="icon-btn" style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '50%' }}><Plus size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSuccess && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem' }}>
              <button onClick={onComplete} className="primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                Continue to Sandbox <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
