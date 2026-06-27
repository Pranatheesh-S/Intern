import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Power, Settings2, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import Electromagnet3D from './Electromagnet3D';

export default function Stage3_Sandbox({ onComplete }) {
  const [switchOn, setSwitchOn] = useState(false);
  const [turns, setTurns] = useState(20);
  const [cells, setCells] = useState(1);
  const [material, setMaterial] = useState('iron');
  const [distance, setDistance] = useState(0.8);
  
  const [timeOn, setTimeOn] = useState(0);
  const [batteryWarn, setBatteryWarn] = useState(false);

  // Monitor how long switch is ON
  useEffect(() => {
    let interval;
    if (switchOn) {
      interval = setInterval(() => {
        setTimeOn(prev => {
          const newTime = prev + 1;
          if (newTime > 5) setBatteryWarn(true);
          return newTime;
        });
      }, 1000);
    } else {
      setTimeOn(0);
      setBatteryWarn(false);
    }
    return () => clearInterval(interval);
  }, [switchOn]);

  const toggleSwitch = () => {
    setSwitchOn(!switchOn);
  };

  return (
    <div className="main-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Stage 3: Sandbox Explore
          </span>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem' }}>Experiment with Variables</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1rem', alignItems: 'stretch' }}>
        {/* Controls Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto', maxHeight: '600px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <Settings2 size={18} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Parameters</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Number of Coil Turns: {turns}</label>
            <input 
              type="range" 
              min="5" max="40" step="5"
              value={turns} 
              onChange={(e) => setTurns(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>More turns produce a stronger electromagnet.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Battery Voltage (Cells): {cells}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3].map(c => (
                <button 
                  key={c}
                  onClick={() => setCells(c)}
                  className={`outline ${cells === c ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderColor: cells === c ? 'var(--accent)' : '' }}
                >
                  {c}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Increasing current strengthens the electromagnet.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Core Material</label>
            <select 
              value={material} 
              onChange={(e) => setMaterial(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
            >
              <option value="iron">Iron</option>
              <option value="steel">Steel</option>
              <option value="wood">Wood</option>
              <option value="plastic">Plastic</option>
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {material === 'iron' ? 'Iron is easily magnetized temporarily.' : 
               material === 'steel' ? 'Steel can be magnetized but tends to retain it permanently.' : 
               'Non-magnetic materials cannot form an electromagnet core.'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Distance to Paper Clips</label>
            <input 
              type="range" 
              min="0.1" max="1.5" step="0.1"
              value={distance} 
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center', marginTop: 'auto' }}>
            <button 
              onClick={toggleSwitch}
              className="primary" 
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: switchOn ? 'var(--danger)' : 'var(--success)' }}
            >
              <Power size={18} /> {switchOn ? "TURN OFF" : "TURN ON"}
            </button>
          </div>

          <AnimatePresence>
            {batteryWarn && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div style={{ background: 'var(--danger-bg)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--danger)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                  <AlertTriangle size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--danger-text)' }}>
                    Warning: Leaving the battery connected for too long may weaken or drain it quickly!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={onComplete} className="primary" style={{ width: '100%', gap: '0.5rem', marginTop: '0.5rem' }}>
            Proceed to Quiz <ChevronRight size={16} />
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="glass-panel" style={{ padding: 0, minHeight: '480px', position: 'relative', overflow: 'hidden' }}>
          <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />
            
            <Electromagnet3D 
              buildStep={5} 
              switchOn={switchOn}
              turns={turns}
              cells={cells}
              material={material}
              paperClipDistance={distance}
            />
            
            <OrbitControls enablePan={true} enableZoom={true} />
          </Canvas>
          
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', padding: '0.5rem 1rem', borderRadius: '20px', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              Strength: {switchOn ? Math.round((turns/40)*(cells/3)*(material==='iron'?1:material==='steel'?0.7:0)*100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
