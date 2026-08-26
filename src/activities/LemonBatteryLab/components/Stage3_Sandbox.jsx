import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Info, Zap } from 'lucide-react';
import { VoltmeterSVG, LEDSVG, LemonSVG } from './CircuitElements2D';

const METALS = {
  copper: { name: 'Copper (Cu)', potential: 0.34, color: '#ca8a04', stroke: '#a16207' },
  zinc:   { name: 'Zinc (Zn)', potential: -0.76, color: '#cbd5e1', stroke: '#94a3b8' },
  iron:   { name: 'Iron (Fe)', potential: -0.44, color: '#6b7280', stroke: '#374151' },
  carbon: { name: 'Carbon (C)', potential: 0.70, color: '#374151', stroke: '#111827' }
};

const ELECTROLYTES = {
  lemon:     { name: 'Lemon', factor: 0.85, type: 'solid', color: '#fef08a' },
  potato:    { name: 'Potato', factor: 0.80, type: 'solid', color: '#d4a373' },
  saltwater: { name: 'Saltwater', factor: 1.0, type: 'liquid', color: '#bae6fd' },
  distilled: { name: 'Distilled Water', factor: 0.0, type: 'liquid', color: '#f8fafc' }
};

export default function Stage3_Sandbox({ onComplete }) {
  const [metal1, setMetal1] = useState('copper');
  const [metal2, setMetal2] = useState('zinc');
  const [electrolyte, setElectrolyte] = useState('lemon');
  const [cells, setCells] = useState(1);

  const m1 = METALS[metal1];
  const m2 = METALS[metal2];
  const el = ELECTROLYTES[electrolyte];

  const getUnitName = (type, count) => {
    if (type === 'lemon') return count === 1 ? 'Lemon' : 'Lemons';
    if (type === 'potato') return count === 1 ? 'Potato' : 'Potatoes';
    if (type === 'saltwater' || type === 'distilled') return count === 1 ? 'Beaker' : 'Beakers';
    return count === 1 ? 'Cell' : 'Cells';
  };

  // Base voltage is difference in standard potential
  const baseVoltage = Math.abs(m1.potential - m2.potential);
  // Total voltage includes conductivity factor and number of cells
  const voltage = baseVoltage * el.factor * cells;
  const isGlowing = voltage >= 2.0;

  // Determine polarity
  const isM1Positive = m1.potential > m2.potential;
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
      
      {/* Configuration Panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={18} /> Lab Variables
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Electrode 1 (Left)</label>
          <select value={metal1} onChange={e => setMetal1(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            {Object.entries(METALS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Electrode 2 (Right)</label>
          <select value={metal2} onChange={e => setMetal2(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            {Object.entries(METALS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Electrolyte</label>
          <select value={electrolyte} onChange={e => setElectrolyte(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            {Object.entries(ELECTROLYTES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{getUnitName(electrolyte, 2)} in Series</label>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}>{cells}</span>
          </div>
          <input 
            type="range" min="1" max="10" step="1" 
            value={cells} onChange={e => setCells(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
        </div>
        
        <div style={{ marginTop: 'auto', background: 'var(--primary-light)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-dark)', fontSize: '0.9rem' }}>
            <Zap size={14} /> Total Voltage
          </h4>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-heading)' }}>
            {voltage.toFixed(2)} V
          </div>
          {voltage === 0 && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--danger)' }}>No potential difference!</p>}
        </div>

        <button onClick={onComplete} className="primary" style={{ width: '100%' }}>Complete Lab</button>
      </div>

      {/* Canvas */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', background: 'var(--canvas-bg)' }}>
        <div className="canvas-bg-grid" />
        
        <svg width="100%" height="100%" viewBox="0 0 800 500" style={{ position: "absolute", top: 0, left: 0 }}>
          
          {/* Dynamic Wiring based on Polarity */}
          {(() => {
            const spacing = 130;
            const startX = -((cells - 1) * spacing) / 2;
            // Ensure cells fit by shrinking the group scale if there are too many
            const groupScale = Math.min(1.2, 600 / (cells * spacing || 1));
            
            const getCellX = (i) => startX + (i * spacing);

            // Compute main wire connection points (scaled and translated to absolute coords)
            const getAbsolutePoint = (localX, localY) => ({
              x: 400 + localX * groupScale,
              y: 300 + localY * groupScale
            });

            // The absolute positions of the leftmost and rightmost connection points
            const eLeftPos = getAbsolutePoint(getCellX(0) - 30, -40);
            const eRightPos = getAbsolutePoint(getCellX(cells - 1) + 30, -40);

            const voltV = { x: 56, y: 198 };
            const voltCom = { x: 104, y: 198 };
            const ledAnode = { x: 415, y: 140 };
            const ledCathode = { x: 445, y: 125 };

            const posElectrode = isM1Positive ? eLeftPos : eRightPos;
            const negElectrode = isM1Positive ? eRightPos : eLeftPos;

            return (
              <g>
                {/* Voltmeter Wires (looping from below) */}
                <path d={`M ${voltV.x} ${voltV.y} C ${voltV.x} ${voltV.y + 150}, ${posElectrode.x - 50} ${posElectrode.y + 120}, ${posElectrode.x} ${posElectrode.y}`} fill="none" stroke="#ef4444" strokeWidth="4" />
                <path d={`M ${voltCom.x} ${voltCom.y} C ${voltCom.x} ${voltCom.y + 200}, ${negElectrode.x} ${negElectrode.y + 150}, ${negElectrode.x} ${negElectrode.y}`} fill="none" stroke="#3b82f6" strokeWidth="4" />
                
                {/* LED Wires (looping from above) */}
                <path d={`M ${ledAnode.x} ${ledAnode.y} C ${ledAnode.x} ${ledAnode.y + 80}, ${posElectrode.x} ${posElectrode.y - 80}, ${posElectrode.x} ${posElectrode.y}`} fill="none" stroke="#ef4444" strokeWidth="3" />
                <path d={`M ${ledCathode.x} ${ledCathode.y} C ${ledCathode.x} ${ledCathode.y + 80}, ${negElectrode.x} ${negElectrode.y - 80}, ${negElectrode.x} ${negElectrode.y}`} fill="none" stroke="#3b82f6" strokeWidth="3" />

                {/* Sandbox Cells Group */}
                <g transform={`translate(400, 300) scale(${groupScale})`}>
                  
                  {/* Inter-cell Series Wires */}
                  {cells > 1 && Array.from({ length: cells - 1 }).map((_, i) => {
                    const startXWire = getCellX(i) + 30; // Right electrode of cell i
                    const endXWire = getCellX(i + 1) - 30; // Left electrode of cell i+1
                    const startYWire = -40;
                    return (
                      <path 
                        key={`wire-${i}`}
                        d={`M ${startXWire} ${startYWire} Q ${(startXWire + endXWire)/2} ${startYWire - 40} ${endXWire} ${startYWire}`}
                        fill="none" stroke="#64748b" strokeWidth="3"
                      />
                    );
                  })}

                  {/* Render Cells */}
                  {Array.from({ length: cells }).map((_, i) => {
                    const cellX = getCellX(i);
                    return (
                      <g key={`cell-${i}`} transform={`translate(${cellX}, 0)`}>
                        {/* Electrolyte */}
                        {electrolyte === 'lemon' ? (
                          <LemonSVG x={-75} y={-75} scale={1.5} hasCopper={false} hasIron={false} />
                        ) : el.type === 'solid' ? (
                          <g transform="scale(1.5)">
                            <ellipse cx="0" cy="35" rx="45" ry="15" fill="rgba(0,0,0,0.15)" />
                            <path d="M -40 0 A 40 30 0 0 0 40 0 Z" fill={el.color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                            <ellipse cx="0" cy="0" rx="40" ry="15" fill={el.color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                          </g>
                        ) : (
                          <g transform="scale(1.5)">
                            <path d="M -40 -10 L -35 40 Q -35 50 -25 50 L 25 50 Q 35 50 35 40 L 40 -10" fill={el.color} opacity="0.6" />
                            <path d="M -40 -10 L -35 40 Q -35 50 -25 50 L 25 50 Q 35 50 35 40 L 40 -10" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                            <ellipse cx="0" cy="-10" rx="40" ry="5" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                            <ellipse cx="0" cy="5" rx="38" ry="4" fill={el.color} opacity="0.8" />
                          </g>
                        )}

                        {/* Electrode 1 (Left) */}
                        {(() => {
                          const metal = METALS[metal1];
                          const isIron = metal1 === 'iron';
                          const isCarbon = metal1 === 'carbon';
                          return (
                            <g transform="translate(-30, 0)">
                              {isIron ? (
                                <g>
                                  <polygon points="-4,0 4,0 6,-50 -6,-50" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
                                  <ellipse cx="0" cy="-50" rx="10" ry="3" fill="#6b7280" stroke="#374151" />
                                </g>
                              ) : isCarbon ? (
                                <rect x="-8" y="-55" width="16" height="55" rx="3" fill="#1f2937" stroke="#111827" strokeWidth="2" />
                              ) : (
                                <rect x="-8" y="-50" width="16" height="50" rx="2" fill={metal.color} stroke={metal.stroke} strokeWidth="2" />
                              )}
                              <text x="0" y="-65" textAnchor="middle" fontSize="14" fontWeight="bold" fill={metal.color}>{metal.name.match(/\((.*?)\)/)?.[1] || metal1}</text>
                              <circle cx="0" cy="-40" r="4" fill={isM1Positive ? "#ef4444" : "#3b82f6"} />
                            </g>
                          );
                        })()}

                        {/* Electrode 2 (Right) */}
                        {(() => {
                          const metal = METALS[metal2];
                          const isIron = metal2 === 'iron';
                          const isCarbon = metal2 === 'carbon';
                          return (
                            <g transform="translate(30, 0)">
                              {isIron ? (
                                <g>
                                  <polygon points="-4,0 4,0 6,-50 -6,-50" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
                                  <ellipse cx="0" cy="-50" rx="10" ry="3" fill="#6b7280" stroke="#374151" />
                                </g>
                              ) : isCarbon ? (
                                <rect x="-8" y="-55" width="16" height="55" rx="3" fill="#1f2937" stroke="#111827" strokeWidth="2" />
                              ) : (
                                <rect x="-8" y="-50" width="16" height="50" rx="2" fill={metal.color} stroke={metal.stroke} strokeWidth="2" />
                              )}
                              <text x="0" y="-65" textAnchor="middle" fontSize="14" fontWeight="bold" fill={metal.color}>{metal.name.match(/\((.*?)\)/)?.[1] || metal2}</text>
                              <circle cx="0" cy="-40" r="4" fill={!isM1Positive ? "#ef4444" : "#3b82f6"} />
                            </g>
                          );
                        })()}
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })()}

          {/* Voltmeter and LED */}
          <VoltmeterSVG x={20} y={60} scale={1.2} voltage={voltage} />
          <LEDSVG x={370} y={20} scale={1.5} isGlowing={isGlowing} />
          
        </svg>

        {/* Info Overlay */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.9)', padding: '1rem', borderRadius: '12px', width: '250px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-heading)' }}><Info size={14} /> Live Analysis</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {baseVoltage === 0 
              ? "Identical metals have no potential difference. Electrons will not flow!"
              : el.factor === 0 
                ? "Distilled water has no free ions to carry charge. The circuit is open."
                : isGlowing 
                  ? "Voltage exceeds 2.0V! The LED is glowing brightly."
                  : "Voltage is too low. The LED needs at least 2.0V to emit light."}
          </p>
        </div>

      </div>
    </div>
  );
}
