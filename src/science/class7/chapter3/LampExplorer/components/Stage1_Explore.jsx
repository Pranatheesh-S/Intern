import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ArrowRight, Maximize2, Minimize2, Info, BookOpen, ZoomIn, ZoomOut } from 'lucide-react';
import Lamp3D from './Lamp3D';

const partDetails = {
  bulb: { title: "Glass Bulb", desc: "A sealed glass case that protects the filament. It is usually filled with an inert gas like Argon to prevent the filament from burning out." },
  filament: { title: "Filament", desc: "A very thin wire (usually made of Tungsten) that becomes extremely hot and glows when electric current passes through it, producing light." },
  support: { title: "Thick Support Wires", desc: "These wires hold the delicate filament in place. One wire connects to the metal case, and the other connects to the metal tip at the base." },
  case: { title: "Metal Case", desc: "The threaded metal base of the bulb. This acts as one of the two electrical terminals." },
  tip: { title: "Metal Tip", desc: "The very bottom of the bulb. This acts as the second electrical terminal. It must not touch the metal case directly!" },
  insulator: { title: "Insulator", desc: "A black non-conducting material that separates the metal tip from the metal case, ensuring current flows *through* the filament." }
};

export default function Stage1_Explore({ onComplete }) {
  const [exploded, setExploded] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
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

  const handlePartSelect = (partId) => {
    setSelectedPart(partId);
  };

  const handlePointerMissed = () => {
    setSelectedPart(null);
  };

  const selectedInfo = selectedPart ? partDetails[selectedPart] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>
            Inside an Incandescent Lamp
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            What exactly is inside a torch bulb? Toggle the exploded view and click on the different parts to learn about their functions.
          </p>
        </div>
        <button 
          onClick={() => { setExploded(!exploded); setSelectedPart(null); }}
          className="primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: exploded ? 'var(--warning)' : 'var(--accent)' }}
        >
          {exploded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          {exploded ? 'Reassemble Lamp' : 'Exploded View'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flex: 1 }}>
        
        {/* 3D Canvas */}
        <div 
          className="glass-panel" 
          style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0f172a', minHeight: '500px' }}
        >
          {/* Instructions Overlay */}
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
            <Info size={16} /> Left-click/drag to rotate. Right-click to pan.
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

          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} onPointerMissed={handlePointerMissed}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <Environment preset="city" />
            
            <Lamp3D 
              exploded={exploded} 
              onPartSelect={handlePartSelect} 
              selectedPart={selectedPart}
              isGlowing={false}
              isLED={false}
            />

            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            <OrbitControls ref={controlsRef} enableZoom={false} enablePan={true} minDistance={4} maxDistance={12} dampingFactor={0.05} />
          </Canvas>
        </div>

        {/* Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              Component Inspection
            </h4>
            
            {selectedInfo ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h5 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent)' }}>{selectedInfo.title}</h5>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {selectedInfo.desc}
                </p>
                {selectedPart === 'filament' && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <strong>Did you know?</strong> The filament gets so hot that if it were exposed to normal air, it would instantly catch fire and break. That's why the glass bulb is sealed!
                  </div>
                )}
                <div style={{ marginTop: '1rem', height: '150px', background: 'var(--bg-color)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
                    <Lamp3D exploded={true} onPartSelect={() => {}} selectedPart={null} isGlowing={false} isLED={false} isolatePart={selectedPart} />
                    <OrbitControls enableZoom={true} enablePan={true} autoRotate={true} autoRotateSpeed={2} minDistance={2} maxDistance={10} />
                  </Canvas>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-faint)', textAlign: 'center', gap: '1rem' }}>
                {exploded ? (
                  <>
                    <Maximize2 size={32} style={{ opacity: 0.5 }} />
                    <p style={{ margin: 0 }}>Click on any floating component to read about its function.</p>
                  </>
                ) : (
                  <>
                    <BookOpen size={32} style={{ opacity: 0.5 }} />
                    <p style={{ margin: 0 }}>Click <strong>Exploded View</strong> to break the lamp apart and see what's inside.</p>
                  </>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={onComplete}
            className="primary"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
          >
            Continue to Observation <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}

// Ensure BookOpen is imported, or remove if not used. Wait, I used BookOpen but didn't import it.
// Let me just swap BookOpen with Info in the placeholder.
