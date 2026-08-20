import React from 'react';
import { BatteryHolderSVG, BulbHolderSVG } from '../../ElectricSwitch/CircuitElements';

export default function ReferenceDiagram({ arrangementId }) {
  // Terminals coordinates
  const posT = { x: 215, y: 274 };
  const negT = { x: 85, y: 274 };
  const leftT = { x: 320, y: 137 };
  const rightT = { x: 380, y: 137 };

  // Define which wires exist for each arrangement
  const getWires = () => {
    switch (arrangementId) {
      case 1: return [{ start: negT, end: leftT }, { start: posT, end: rightT }];
      case 2: return [{ start: posT, end: leftT }];
      case 3: return [{ start: negT, end: leftT }];
      case 4: return [{ start: negT, end: leftT }, { start: posT, end: leftT }];
      case 5: return [{ start: negT, end: rightT }];
      case 6: return [{ start: negT, end: rightT }, { start: posT, end: leftT }];
      default: return [];
    }
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
      maxWidth: '400px'
    }}>
      <h5 style={{ margin: '0.5rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Target Circuit</h5>
      <svg width="100%" height="auto" viewBox="0 0 500 360" style={{ display: 'block', maxWidth: '100%' }}>
        {/* Wires */}
        {wires.map((wire, i) => {
          const controlY = Math.max(wire.start.y, wire.end.y) + 40;
          const path = `M ${wire.start.x},${wire.start.y} C ${wire.start.x},${controlY} ${wire.end.x},${controlY} ${wire.end.x},${wire.end.y}`;
          return (
            <g key={i}>
              <path d={path} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
              <path d={path} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
            </g>
          );
        })}

        {/* Components */}
        <g transform="translate(100, 250)">
          <BatteryHolderSVG hasCell={true} />
        </g>
        <g transform="translate(350, 80)">
          <BulbHolderSVG hasBulb={true} isOn={false} />
        </g>
      </svg>
    </div>
  );
}
