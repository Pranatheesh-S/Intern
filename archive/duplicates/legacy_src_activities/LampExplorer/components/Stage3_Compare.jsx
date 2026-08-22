import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text } from '@react-three/drei';
import { ArrowRight, Info, AlertTriangle, CheckCircle2, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Lamp3D from './Lamp3D';

export default function Stage3_Compare({ onComplete }) {
  const [ledReversed, setLedReversed] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const controlsRef = React.useRef();

  const handleZoom = (direction) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      const target = controls.target;
      
      const vx = camera.position.x - target.x;
      const vy = camera.position.y - target.y;
      const vz = camera.position.z - target.z;
      
      const dist = Math.sqrt(vx*vx + vy*vy + vz*vz);
      const newDist = Math.max(4, Math.min(12, dist + (direction * 1.5)));
      const ratio = newDist / dist;
      
      camera.position.x = target.x + vx * ratio;
      camera.position.y = target.y + vy * ratio;
      camera.position.z = target.z + vz * ratio;
      controls.update();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>
          Compare with an LED
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Modern torches use Light Emitting Diodes (LEDs) instead of incandescent lamps. Explore how they differ and test the LED's polarity!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flex: 1 }}>
        
        {/* 3D Canvas */}
        <div 
          className="glass-panel" 
          style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0f172a', minHeight: '500px' }}
        >
          {/* Instructions Overlay */}
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
            <Info size={16} /> Drag to rotate the LED and Lamp.
          </div>

          {/* Zoom Controls Overlay */}
          <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={(e) => { e.preventDefault(); handleZoom(-1); }} className="primary" style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.8)' }}>
              <ZoomIn size={20} />
            </button>
            <button onClick={(e) => { e.preventDefault(); handleZoom(1); }} className="primary" style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.8)' }}>
              <ZoomOut size={20} />
            </button>
          </div>

          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <Environment preset="city" />
            
            {/* The LED (Left) */}
            <group position={[-2, -0.25, 0]} rotation={[0, ledReversed ? Math.PI : 0, 0]}>
              <Lamp3D 
                exploded={true} 
                onPartSelect={() => {}} 
                selectedPart={null}
                isGlowing={!ledReversed} // LED only glows if not reversed
                isLED={true}
              />
            </group>

            {/* The Incandescent Lamp (Right) */}
            <group position={[3, 1, 0]}>
              <Lamp3D 
                exploded={false} 
                onPartSelect={() => {}} 
                selectedPart={null}
                isGlowing={true}
                isLED={false}
              />
            </group>

            {/* Circuit Base & Battery for LED */}
            <group position={[-2, -2.5, 0]}>
               <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 0.5, 1]} />
                <meshStandardMaterial color="#475569" />
               </mesh>
               {/* Terminals in base: Left is +, Right is - */}
               <group position={[-0.25, 0.25, 0]}>
                 <boxGeometry args={[0.25, 0.1, 0.3]} />
                 <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
                 <Text position={[0, 0.06, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">+</Text>
               </group>
               <group position={[0.25, 0.25, 0]}>
                 <boxGeometry args={[0.25, 0.1, 0.3]} />
                 <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.2} />
                 <Text position={[0, 0.06, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">-</Text>
               </group>
            </group>

            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            <OrbitControls ref={controlsRef} enableZoom={false} enablePan={true} minDistance={4} maxDistance={12} dampingFactor={0.05} />
          </Canvas>
        </div>

        {/* Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>LED Polarity Test</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <p style={{ margin: 0 }}>
                Unlike a filament bulb which works in any direction, an LED has a strict polarity. The <strong>longer wire</strong> is the positive (+) terminal.
              </p>
              <p style={{ margin: 0, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                In a basic circuit, the longer lead (positive terminal / anode) should be connected to the positive (+) terminal of the battery or power source.<br/><br/>
                The shorter lead (negative terminal / cathode) should be connected back to the negative (−) terminal.
              </p>
            </div>

            <button
              onClick={() => setLedReversed(!ledReversed)}
              className="outline"
              style={{ padding: '0.75rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
              {ledReversed ? "Restore Correct Polarity" : "Reverse the LED Polarity"}
            </button>

            {ledReversed ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--warning)', background: 'var(--warning-bg)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid var(--warning-border)' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>LED does not glow! The positive (long) terminal is connected to the negative side of the battery.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--success)', background: 'var(--success-bg)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid var(--success-border)' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>LED glows! The positive terminal is correctly connected to the positive side of the circuit.</span>
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="primary"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
            >
              {showComparison ? "Hide Table" : "Show Comparison Table"}
            </button>

            {showComparison && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontWeight: 'bold', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--text-heading)' }}>
                  <div>Incandescent</div>
                  <div>LED</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Has a hot filament</div>
                  <div style={{ color: 'var(--accent)' }}>No filament (semiconductor)</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Produces much heat</div>
                  <div style={{ color: 'var(--accent)' }}>Produces very little heat</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Uses more energy</div>
                  <div style={{ color: 'var(--accent)' }}>Highly energy-efficient</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.25rem 0' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Works in any direction</div>
                  <div style={{ color: 'var(--accent)' }}>Strict polarity (+ and -)</div>
                </div>
              </motion.div>
            )}
            
            <button 
              onClick={onComplete}
              className="primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', marginTop: 'auto' }}
            >
              Proceed to Quiz <ArrowRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
