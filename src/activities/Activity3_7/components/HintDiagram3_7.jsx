import React from 'react';
import { DoubleBatteryHolderSVG, LEDSVG } from '../../ElectricSwitch/CircuitElements';

export default function HintDiagram3_7({ arrangementId }) {
  // Battery terminals
  const posT = { x: 277, y: 234 };
  const negT = { x: 55, y: 234 };
  
  // LED terminals
  const ledShortT = { x: 135, y: 95 };
  const ledLongT = { x: 165, y: 105 };

  const getWires = () => {
    if (arrangementId === 1) return [
      { start: posT, end: ledLongT, main: '#ef4444', outline: '#b91c1c' },
      { start: negT, end: ledShortT, main: '#3b82f6', outline: '#1d4ed8' }
    ];
    if (arrangementId === 2) return [
      { start: posT, end: ledShortT, main: '#ef4444', outline: '#b91c1c' },
      { start: negT, end: ledLongT, main: '#3b82f6', outline: '#1d4ed8' }
    ];
    return [];
  };

  const wires = getWires();

  return (
    <div style={{ 
      background: 'var(--canvas-bg)', 
      border: '1px solid var(--border)', 
      borderRadius: '8px',
      padding: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '300px'
    }}>
      <h5 style={{ margin: '0.5rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Target Circuit</h5>
      <svg width="100%" height="auto" viewBox="0 0 350 300" style={{ display: 'block', maxWidth: '100%' }}>
        <g transform="translate(50, 200)">
          <DoubleBatteryHolderSVG cellsCount={2} />
        </g>
        <g transform="translate(150, 50)">
          <LEDSVG isOn={false} />
        </g>

        {wires.map((wire, i) => {
          const controlY = Math.max(wire.start.y, wire.end.y) + 30;
          const path = `M ${wire.start.x},${wire.start.y} C ${wire.start.x},${controlY} ${wire.end.x},${controlY} ${wire.end.x},${wire.end.y}`;
          return (
            <g key={i}>
              <path d={path} fill="none" stroke={wire.outline} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
              <path d={path} fill="none" stroke={wire.main} strokeWidth={2.5} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
