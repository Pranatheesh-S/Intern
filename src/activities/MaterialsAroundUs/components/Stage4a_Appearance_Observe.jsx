import React, { useState } from 'react';
import { Sparkles, Check, FileText, Lightbulb, LightbulbOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const MaterialModel = ({ activeObject, lightOn }) => {
  const shinyMaterialProps = {
    metalness: lightOn ? 0.9 : 0.2,
    roughness: lightOn ? 0.1 : 0.8,
    envMapIntensity: lightOn ? 2 : 0,
  };
  const dullMaterialProps = {
    metalness: 0.1,
    roughness: 0.9,
    envMapIntensity: 0,
  };

  const getModel = () => {
    switch (activeObject) {
      case 'paper':
        return (
          <mesh>
            <boxGeometry args={[3, 4, 0.05]} />
            <meshStandardMaterial color="#ffffff" {...dullMaterialProps} />
          </mesh>
        );
      case 'cardboard':
        return (
          <group>
            <mesh>
              <boxGeometry args={[2.5, 2.5, 2.5]} />
              <meshStandardMaterial color="#c49c71" {...dullMaterialProps} />
            </mesh>
            {/* Tape on top */}
            <mesh position={[0, 1.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
               <planeGeometry args={[0.8, 2.5]} />
               <meshStandardMaterial color="#a07b55" {...dullMaterialProps} />
            </mesh>
          </group>
        );
      case 'wood':
        return (
          <mesh rotation={[Math.PI / 4, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1, 1, 3.5, 32]} />
            <meshStandardMaterial color="#8b5a2b" {...dullMaterialProps} />
          </mesh>
        );
      case 'copper':
        return (
          <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
            <torusGeometry args={[1.2, 0.08, 16, 100, Math.PI * 1.75]} />
            <meshStandardMaterial color="#b87333" {...shinyMaterialProps} />
          </mesh>
        );
      case 'aluminium':
        return (
          <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.4, 0.4, 4, 32]} />
            <meshStandardMaterial color="#e0e0e0" {...shinyMaterialProps} />
          </mesh>
        );
      case 'steel':
        return (
          <group rotation={[Math.PI / 8, Math.PI / 4, -Math.PI / 6]}>
            {/* Handle */}
            <mesh position={[0, -1.7, -0.05]}>
              <cylinderGeometry args={[0.15, 0.08, 3, 16]} />
              <meshStandardMaterial color="#d1d5db" {...shinyMaterialProps} />
            </mesh>
            {/* Bowl */}
            <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.8, 0.2, 1.2]}>
              <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#d1d5db" side={THREE.DoubleSide} {...shinyMaterialProps} />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return <group>{getModel()}</group>;
};

export default function Stage4a_Appearance_Observe({ onComplete, addXp }) {
  const [inspectedObjects, setInspectedObjects] = useState({});
  const [activeObject, setActiveObject] = useState(null);
  const [lightOn, setLightOn] = useState(false);

  const objects = [
    { id: 'paper', name: 'Paper', icon: '📄', isShiny: false, propColour: 'White', propTexture: 'Smooth' },
    { id: 'cardboard', name: 'Cardboard', icon: '📦', isShiny: false, propColour: 'Brown', propTexture: 'Rough' },
    { id: 'wood', name: 'Wood', icon: '🪵', isShiny: false, propColour: 'Brown', propTexture: 'Rough' },
    { id: 'copper', name: 'Copper Wire', icon: '➰', isShiny: true, propColour: 'Reddish', propTexture: 'Smooth' },
    { id: 'aluminium', name: 'Aluminium Rod', icon: <div style={{ width: '14px', height: '42px', background: 'linear-gradient(to right, #9ca3af, #f9fafb, #6b7280)', borderRadius: '4px', transform: 'rotate(20deg)' }} />, isShiny: true, propColour: 'Silver', propTexture: 'Smooth' },
    { id: 'steel', name: 'Steel Spoon', icon: '🥄', isShiny: true, propColour: 'Silver', propTexture: 'Smooth' }
  ];

  const handleSelect = (objId) => {
    setActiveObject(objId);
    setLightOn(false);
  };

  const handleToggleLight = () => {
    setLightOn(!lightOn);
    if (!lightOn && activeObject && !inspectedObjects[activeObject]) {
      setInspectedObjects(prev => {
        const next = { ...prev, [activeObject]: true };
        if (Object.keys(next).length === objects.length) {
          addXp(50);
          setTimeout(() => onComplete(), 2000);
        }
        return next;
      });
    }
  };

  const activeObjDetails = objects.find(o => o.id === activeObject);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} style={{ color: 'var(--accent)' }} /> 6.3.1 Observe and Identify Appearance of Materials
        </h3>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          "Do any of these materials shine when light falls on them?" Select a material, drag to rotate it, turn on the light, and observe.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* Top Row: Materials & Viewer */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1rem', flex: 2, minHeight: 0 }}>
          {/* Left: Evidence Box */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '1rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', textAlign: 'center' }}>
            Materials to Test
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1, alignContent: 'start' }}>
            {objects.map(obj => (
              <div
                key={obj.id}
                onClick={() => handleSelect(obj.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                  cursor: 'pointer', position: 'relative',
                  opacity: activeObject === obj.id ? 1 : 0.6,
                  transform: activeObject === obj.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s',
                  padding: '0.5rem'
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  filter: activeObject === obj.id ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' : 'none',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '56px'
                }}>
                  {obj.icon}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: activeObject === obj.id ? '600' : '400', color: 'var(--text-primary)', textAlign: 'center' }}>
                  {obj.name}
                </span>
              </div>
            ))}
          </div>
        </div>

          {/* Right: 3D Viewer Area */}
          <div 
            className="glass-panel" 
            style={{ 
              flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', 
              background: 'radial-gradient(circle at center, #334155, #0f172a)', 
              border: '2px solid var(--border)', borderRadius: '16px', overflow: 'hidden',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
            }}
          >
            {activeObject ? (
              <>
                {/* Viewer Controls */}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleLight(); }}
                    className={lightOn ? 'outline' : 'primary'}
                    style={{ 
                      padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: lightOn ? 'rgba(255, 255, 255, 0.1)' : 'var(--accent)',
                      color: 'white', border: lightOn ? '1px solid rgba(255,255,255,0.3)' : 'none',
                      boxShadow: lightOn ? 'none' : '0 0 15px rgba(99, 102, 241, 0.6)',
                      pointerEvents: 'all',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {lightOn ? <LightbulbOff size={18} /> : <Lightbulb size={18} color="var(--warning)" />}
                    {lightOn ? 'Turn Light OFF' : 'Turn Light ON'}
                  </button>
                </div>
                
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                  Drag to rotate
                </div>

                {/* The 3D Stage */}
                <div style={{ flex: 1, position: 'relative', cursor: 'grab' }}>
                  <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={lightOn ? 1.0 : 1.5} />
                    {lightOn ? (
                      <>
                        <spotLight position={[4, 4, 2]} angle={0.4} penumbra={1} intensity={2} castShadow />
                        <spotLight position={[-4, 0, 4]} angle={0.4} penumbra={1} intensity={1} />
                        <Environment preset="studio" />
                      </>
                    ) : (
                      <>
                        <directionalLight position={[5, 5, 5]} intensity={1.5} />
                        <directionalLight position={[-5, 5, -5]} intensity={1} />
                        <directionalLight position={[0, -5, 0]} intensity={0.5} />
                      </>
                    )}
                    
                    <MaterialModel activeObject={activeObject} lightOn={lightOn} />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={2} />
                    <ContactShadows position={[0, -2.5, 0]} opacity={lightOn ? 0.4 : 0.1} scale={10} blur={2} far={4} />
                  </Canvas>
                </div>

                {/* Info overlay when light is on */}
                {lightOn && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--card-bg)', backdropFilter: 'blur(8px)',
                      padding: '0.75rem 1.5rem', borderRadius: '20px', border: '1px solid var(--border)',
                      boxShadow: 'var(--card-shadow)',
                      color: 'var(--text-primary)', display: 'flex', gap: '1.5rem', fontSize: '0.95rem',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  >
                    <span><strong>Colour:</strong> {activeObjDetails.propColour}</span>
                    <span><strong>Texture:</strong> {activeObjDetails.propTexture}</span>
                    <span style={{ color: activeObjDetails.isShiny ? 'var(--warning)' : 'var(--text-secondary)' }}>
                      <strong>Surface:</strong> {activeObjDetails.isShiny ? 'Shiny ✨' : 'Dull 🪨'}
                    </span>
                  </motion.div>
                )}
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', pointerEvents: 'none' }}>
                Select a material from the Evidence Box
              </div>
            )}
          </div>
        </div>

        {/* Detective Log (Bottom half) */}
        <div className="glass-panel" style={{ flex: 1.5, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--accent)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--accent)' }}>
                🕵️ Detective Log
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {Object.keys(inspectedObjects).length} / {objects.length} Observed
              </div>
            </div>
            
            <div style={{ 
              flex: 1, overflowY: 'auto', paddingRight: '0.5rem',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', alignContent: 'start'
            }}>
              <AnimatePresence>
                {Object.keys(inspectedObjects).map(id => {
                  const obj = objects.find(o => o.id === id);
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ 
                        background: 'var(--surface)', padding: '1rem', borderRadius: '12px', 
                        borderTop: `4px solid ${obj.isShiny ? 'var(--warning)' : 'var(--text-muted)'}`,
                        boxShadow: 'var(--card-shadow)',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-heading)' }}>
                        <span style={{ fontSize: '1.2rem' }}>{obj.icon}</span> {obj.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Colour:</span> <span style={{ fontWeight: '500' }}>{obj.propColour}</span>
                        <span style={{ color: 'var(--text-muted)' }}>Texture:</span> <span style={{ fontWeight: '500' }}>{obj.propTexture}</span>
                        <span style={{ color: 'var(--text-muted)' }}>Surface:</span> 
                        <span style={{ fontWeight: '600', color: obj.isShiny ? 'var(--warning)' : 'inherit' }}>
                          {obj.isShiny ? 'Shiny' : 'Dull'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {Object.keys(inspectedObjects).length === 0 && (
                <div style={{ gridColumn: '1 / -1', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                  Turn on the light to record observations...
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
