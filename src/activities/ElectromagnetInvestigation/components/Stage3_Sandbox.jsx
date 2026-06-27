import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Power, RotateCcw, Sliders, Battery, Zap, Eye, ChevronRight } from 'lucide-react';
import Electromagnet3D from './Electromagnet3D';

export default function Stage3_Sandbox({ onComplete }) {
  const [switchOn, setSwitchOn] = useState(false);
  const [turns, setTurns] = useState(50);
  const [cells, setCells] = useState(1);
  const [material, setMaterial] = useState('iron');
  const [reverseBattery, setReverseBattery] = useState(false);
  const [showFieldLines, setShowFieldLines] = useState(false);
  
  // A simple heuristic for magnetic strength 0.0 - 1.0
  const maxTurns = 70;
  const maxCells = 3;
  const matFactor = material === 'iron' ? 1.0 : material === 'steel' ? 0.7 : 0.1;
  const strength = (turns / maxTurns) * (cells / maxCells) * matFactor;

  // Map strength to paper clip distance logic inside Electromagnet3D
  // E.g., at max strength (1.0), distance is 0.0 (fully attached).
  // At strength 0.1 (air core), distance is maybe 0.8 (barely attached or not).
  
  return (
    <div className="main-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Stage 3: Sandbox Explore
          </span>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem' }}>Electromagnet Sandbox</h2>
        </div>
        <button onClick={onComplete} className="primary" style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}>
          Take the Concept Quiz <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1rem', alignItems: 'stretch' }}>
        
        {/* Left Panel: Controls */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
          
          {/* Main Switch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Power Switch</label>
            <button 
              onClick={() => setSwitchOn(!switchOn)}
              className="primary" 
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', background: switchOn ? 'var(--danger)' : 'var(--success)' }}
            >
              <Power size={18} /> {switchOn ? "TURN OFF" : "TURN ON"}
            </button>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: 0 }} />

          {/* Properties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Battery Polarity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <RotateCcw size={14} /> Battery Direction
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`outline ${!reverseBattery ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setReverseBattery(false)}>Standard</button>
                <button className={`outline ${reverseBattery ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setReverseBattery(true)}>Reversed</button>
              </div>
            </div>

            {/* Core Material */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sliders size={14} /> Core Material
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`outline ${material === 'iron' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setMaterial('iron')}>Iron Core</button>
                <button className={`outline ${material === 'air' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setMaterial('air')}>Air Core</button>
              </div>
            </div>

            {/* Number of Turns */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Zap size={14} /> Number of Turns
                </label>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold' }}>{turns} turns</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="70" 
                step="10"
                value={turns} 
                onChange={(e) => setTurns(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            {/* Battery Cells */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Battery size={14} /> Battery Cells
                </label>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold' }}>{cells} {cells === 1 ? 'Cell' : 'Cells'}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="1"
                value={cells} 
                onChange={(e) => setCells(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: 0 }} />

          {/* Visualization Controls */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
              <Eye size={14} /> Visualizations
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showFieldLines} 
                onChange={(e) => setShowFieldLines(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
              />
              Show Magnetic Field Lines
            </label>
          </div>

          <div style={{ marginTop: 'auto', padding: '0.75rem', background: 'var(--neutral-bg)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-faint)' }}>
            💡 Notice how reversing the battery changes the direction of the compass needles!
          </div>

        </div>

        {/* 3D Canvas */}
        <div className="glass-panel" style={{ padding: 0, minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
          
          {/* HUD for Magnetic Strength */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '180px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
              Magnetic Strength
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>
                {switchOn ? Math.round(strength * 100) : 0}%
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${switchOn ? strength * 100 : 0}%`, height: '100%', background: strength > 0.6 ? '#22c55e' : strength > 0.3 ? '#eab308' : '#ef4444', transition: 'width 0.3s ease, background 0.3s ease' }} />
            </div>
          </div>

          <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Environment preset="city" />
            
            <Electromagnet3D 
              switchOn={switchOn}
              turns={turns}
              cells={cells}
              material={material}
              reverseBattery={reverseBattery}
              showCompass={true}
              showFieldLines={showFieldLines}
              strength={strength}
            />
            
            <OrbitControls enablePan={true} enableZoom={true} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
