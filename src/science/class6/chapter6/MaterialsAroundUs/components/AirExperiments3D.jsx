import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, OrbitControls, Sphere, Cylinder, Box } from '@react-three/drei';
import ErrorBoundary from '../../../../../components/ErrorBoundary';

function BalloonExperiment({ inflating }) {
   const balloonRef = useRef();

   useFrame((state, delta) => {
      if (inflating && balloonRef.current && balloonRef.current.scale.x < 2.5) {
         const newScale = Math.min(balloonRef.current.scale.x + delta * 1.5, 2.5);
         balloonRef.current.scale.set(newScale, newScale, newScale);
      }
   });

   return (
      <group>
         {/* Simple pump base */}
         <Cylinder args={[0.4, 0.4, 0.8]} position={[0, -1, 0]}>
            <meshStandardMaterial color="#3b82f6" />
         </Cylinder>
         <Cylinder args={[0.05, 0.05, 0.5]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#64748b" />
         </Cylinder>
         
         {/* Balloon */}
         <group position={[0, -0.1, 0]}>
            <Sphere ref={balloonRef} args={[0.3, 32, 32]} position={[0, 0.3, 0]}>
               <meshPhysicalMaterial 
                  color="#ef4444" 
                  roughness={0.2} 
                  clearcoat={1} 
                  clearcoatRoughness={0.1}
               />
            </Sphere>
         </group>
         
         <Environment preset="studio" />
         <PerspectiveCamera makeDefault position={[0, 0, 4]} />
         <OrbitControls enableZoom={false} enablePan={false} />
      </group>
   );
}

function ScaleExperiment({ weighing }) {
   const scaleRef = useRef();

   useFrame((state, delta) => {
      if (weighing && scaleRef.current && scaleRef.current.rotation.z > -0.25) {
         scaleRef.current.rotation.z = Math.max(scaleRef.current.rotation.z - delta * 0.5, -0.25);
      }
   });

   return (
      <group>
         {/* Scale base */}
         <Cylinder args={[0.3, 0.4, 0.2]} position={[0, -1.5, 0]}>
            <meshStandardMaterial color="#1e293b" />
         </Cylinder>
         <Cylinder args={[0.05, 0.05, 2]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color="#94a3b8" />
         </Cylinder>
         
         {/* Pivot point and beam */}
         <group ref={scaleRef} position={[0, 0.5, 0]}>
            <Box args={[3, 0.1, 0.2]} position={[0, 0, 0]}>
               <meshStandardMaterial color="#475569" />
            </Box>
            
            {/* Left side: Deflated balloon */}
            <group position={[-1.4, -0.5, 0]}>
               <Cylinder args={[0.01, 0.01, 1]} position={[0, 0.5, 0]}>
                  <meshStandardMaterial color="#94a3b8" />
               </Cylinder>
               <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]} scale={[1, 0.2, 1]}>
                  <meshPhysicalMaterial color="#3b82f6" roughness={0.3} />
               </Sphere>
            </group>
            
            {/* Right side: Inflated balloon */}
            <group position={[1.4, -0.5, 0]}>
               <Cylinder args={[0.01, 0.01, 1]} position={[0, 0.5, 0]}>
                  <meshStandardMaterial color="#94a3b8" />
               </Cylinder>
               <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
                  <meshPhysicalMaterial color="#ef4444" roughness={0.1} clearcoat={1} />
               </Sphere>
            </group>
         </group>
         
         <Environment preset="studio" />
         <PerspectiveCamera makeDefault position={[0, -0.2, 4]} />
         <OrbitControls enableZoom={false} enablePan={false} />
      </group>
   );
}

export default function AirExperiments3D() {
   const [inflate, setInflate] = useState(false);
   const [weigh, setWeigh] = useState(false);

   return (
      <div style={{ display: 'flex', gap: '12px', width: '100%', height: '180px' }}>
         {/* Experiment 1 */}
         <div style={{ flex: 1, background: 'var(--lesson-background)', borderRadius: '12px', border: '1px solid var(--lesson-border)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '6px 8px', background: 'var(--lesson-surface)', borderBottom: '1px solid var(--lesson-border)', fontSize: '0.75rem', fontWeight: '800', color: 'var(--lesson-primary)' }}>
               1. Air occupies space
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
               <ErrorBoundary fallback={<div style={{padding: '10px'}}>3D render failed</div>}>
                  <Canvas>
                     <Suspense fallback={null}>
                        <BalloonExperiment inflating={inflate} />
                     </Suspense>
                  </Canvas>
               </ErrorBoundary>
               <button 
                  onClick={() => setInflate(true)}
                  style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', background: 'var(--lesson-primary)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
               >
                  Pump Air
               </button>
               {inflate && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--lesson-success)', pointerEvents: 'none' }}>
                     Volume increases!
                  </div>
               )}
            </div>
         </div>

         {/* Experiment 2 */}
         <div style={{ flex: 1, background: 'var(--lesson-background)', borderRadius: '12px', border: '1px solid var(--lesson-border)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '6px 8px', background: 'var(--lesson-surface)', borderBottom: '1px solid var(--lesson-border)', fontSize: '0.75rem', fontWeight: '800', color: 'var(--lesson-primary)' }}>
               2. Air has mass
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
               <ErrorBoundary fallback={<div style={{padding: '10px'}}>3D render failed</div>}>
                  <Canvas>
                     <Suspense fallback={null}>
                        <ScaleExperiment weighing={weigh} />
                     </Suspense>
                  </Canvas>
               </ErrorBoundary>
               <button 
                  onClick={() => setWeigh(true)}
                  style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', background: 'var(--lesson-primary)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
               >
                  Weigh
               </button>
               {weigh && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--lesson-success)', pointerEvents: 'none' }}>
                     Inflated balloon is heavier!
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
