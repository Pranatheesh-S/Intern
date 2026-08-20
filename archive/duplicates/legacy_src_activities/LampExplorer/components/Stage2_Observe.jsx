import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, QuadraticBezierLine } from '@react-three/drei';
import { ArrowRight, Power, Lightbulb, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Lamp3D from './Lamp3D';

export default function Stage2_Observe({ onComplete }) {
  const [switchOn, setSwitchOn] = useState(false);
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
          Observing the Glow
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Connect the lamp to a battery and turn on the switch. Observe exactly which part of the lamp produces the light.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flex: 1 }}>
        
        {/* 3D Canvas */}
        <div 
          className="glass-panel" 
          style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0f172a', minHeight: '500px' }}
        >
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
            <ambientLight intensity={switchOn ? 0.2 : 0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <Environment preset="city" />
            
            {/* The Lamp */}
            <group position={[0, 1, 0]}>
              <Lamp3D 
                exploded={false} 
                onPartSelect={() => {}} 
                selectedPart={null}
                isGlowing={switchOn}
                isLED={false}
              />
            </group>

            {/* Simple Battery Representation */}
            <group position={[-2, -1.5, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 1.5, 32]} />
                <meshStandardMaterial color="#1e40af" metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
            </group>

            {/* Simple Switch Representation */}
            <group position={[2, -1.5, 0]}>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[1.5, 0.2, 1]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              <mesh position={[0, 0.1, 0]} rotation={[switchOn ? Math.PI/8 : -Math.PI/8, 0, 0]}>
                <boxGeometry args={[0.8, 0.1, 0.8]} />
                <meshStandardMaterial color={switchOn ? "#10b981" : "#ef4444"} />
              </mesh>
            </group>

            {/* Wires */}
            {/* Battery + to Switch Left */}
            <QuadraticBezierLine 
              start={[-2, -0.6, 0]} 
              end={[1.25, -1.4, 0]} 
              mid={[-0.5, -2.5, 0]} 
              color="#ef4444" 
              lineWidth={5} 
            />
            {/* Switch Right to Lamp Tip */}
            <QuadraticBezierLine 
              start={[2.75, -1.4, 0]} 
              end={[0, -0.05, 0]} 
              mid={[1.5, -0.5, 0]} 
              color="#3b82f6" 
              lineWidth={5} 
            />
            {/* Lamp Case to Battery - */}
            <QuadraticBezierLine 
              start={[-0.55, 0.6, 0]} 
              end={[-2, -2.25, 0]} 
              mid={[-3, -1, 0]} 
              color="#10b981" 
              lineWidth={5} 
            />
            
            {/* Animated Current (Electrons) */}
            {switchOn && (
              <group>
                 {/* Simulate moving electrons using simple scaled spheres moving in a loop - can be complex in pure JSX, 
                     so we rely on the glowing filament instead for visual feedback. */}
              </group>
            )}

            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            <OrbitControls ref={controlsRef} enableZoom={false} enablePan={true} minDistance={4} maxDistance={12} dampingFactor={0.05} />
          </Canvas>
        </div>

        {/* Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Circuit Switch</h4>
            
            <button
              onClick={() => setSwitchOn(!switchOn)}
              style={{
                width: '100px', height: '50px', borderRadius: '25px',
                background: switchOn ? 'var(--success)' : '#64748b',
                border: 'none', position: 'relative', cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              <motion.div
                animate={{ x: switchOn ? 50 : 0 }}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'white', position: 'absolute', top: '3px', left: '3px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Power size={24} color={switchOn ? 'var(--success)' : '#64748b'} />
              </motion.div>
            </button>

            <div style={{ padding: '1rem', background: switchOn ? 'var(--success-bg)' : 'var(--surface)', borderRadius: '8px', border: `1px solid ${switchOn ? 'var(--success-border)' : 'var(--border)'}`, textAlign: 'center', width: '100%' }}>
              {switchOn ? (
                <>
                  <Lightbulb size={24} color="var(--warning)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--success)' }}>
                    <strong>The circuit is complete!</strong> Current flows through the filament. The filament gets extremely hot and glows brightly, producing light.
                  </p>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  The circuit is broken. No current flows, and the filament remains cool and dark.
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={onComplete}
            disabled={!switchOn}
            className={switchOn ? "primary" : "outline"}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', marginTop: 'auto' }}
          >
            Compare with LED <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
