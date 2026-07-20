import React, { useState } from 'react';
import { Sparkles, Check, FileText, Lightbulb, LightbulbOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const DeskLamp = ({ lightOn }) => {
  // Lamp sits to the right of the scene, arm reaching left toward the object
  // Base center at world origin of the group, positioned via parent group in scene
  return (
    <group>
      {/* === BASE === */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 0.18, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Base top disc */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.45, 0.9, 0.12, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* === LOWER PIVOT / STEM === */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* === LOWER HINGE (horizontal cylinder) === */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.55, 16]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* === LOWER ARM - goes up and slightly left === */}
      {/* Rotation: z=0.25 tilts it slightly left from vertical */}
      <group position={[0, 0.4, 0]} rotation={[0, 0, -0.25]}>
        {/* Left strut */}
        <mesh position={[-0.12, 1.5, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 3.0, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Right strut */}
        <mesh position={[0.12, 1.5, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 3.0, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* === MIDDLE HINGE === */}
        <mesh position={[0, 3.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* === UPPER ARM - bends more to the left and slightly down === */}
        {/* rotation z=1.1 means it swings ~63deg to the left */}
        <group position={[0, 3.05, 0]} rotation={[0, 0, 1.1]}>
          {/* Left strut */}
          <mesh position={[-0.12, 1.2, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 2.4, 12]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Right strut */}
          <mesh position={[0.12, 1.2, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 2.4, 12]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
          </mesh>

          {/* === HEAD HINGE === */}
          <mesh position={[0, 2.45, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
            <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* === LAMP HEAD (shade pointing down-left at object) === */}
          {/* rotation z=-1.4 tilts the shade to point left/down */}
          <group position={[0, 2.45, 0]} rotation={[0, 0, -1.4]}>
            {/* Shade outer shell - truncated cone open at bottom */}
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.38, 0.9, 1.4, 32, 1, true]} />
              <meshStandardMaterial color="#252525" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
            </mesh>
            {/* Shade top cap */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.38, 0.38, 0.14, 32]} />
              <meshStandardMaterial color="#252525" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Inner reflector glow */}
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.36, 0.88, 1.38, 32, 1, true]} />
              <meshStandardMaterial
                color={lightOn ? '#fff8e1' : '#888'}
                emissive={lightOn ? '#ffedcc' : '#000'}
                emissiveIntensity={lightOn ? 1.2 : 0}
                side={THREE.BackSide}
              />
            </mesh>
            {/* Bulb */}
            <mesh position={[0, -0.35, 0]}>
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial
                color={lightOn ? '#ffffff' : '#666'}
                emissive={lightOn ? '#ffe8b0' : '#000'}
                emissiveIntensity={lightOn ? 5 : 0}
                transparent
                opacity={lightOn ? 1 : 0.5}
              />
            </mesh>
            {/* Point light from bulb */}
            {lightOn && <pointLight position={[0, -1, 0]} intensity={4} distance={20} color="#ffedcc" castShadow />}
          </group>
        </group>
      </group>
    </group>
  );
};


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
                  <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
                    <ambientLight intensity={lightOn ? 0.6 : 1.5} />

                    {lightOn ? (
                      <>
                        <spotLight position={[4, 6, 3]} angle={0.4} penumbra={1} intensity={1} castShadow />
                        <Environment preset="studio" />
                      </>
                    ) : (
                      <>
                        <directionalLight position={[5, 5, 5]} intensity={1.5} />
                        <directionalLight position={[-5, 5, -5]} intensity={1} />
                        <directionalLight position={[0, -5, 0]} intensity={0.5} />
                      </>
                    )}

                    {/* Material model at center-left with PresentationControls so it rotates independently */}
                    <PresentationControls
                      global={false}
                      cursor={true}
                      snap={true}
                      speed={1.5}
                      zoom={1}
                      rotation={[0, 0, 0]}
                      polar={[-Math.PI / 4, Math.PI / 4]}
                      azimuth={[-Math.PI / 2, Math.PI / 2]}
                    >
                      <group position={[-1.5, 0, 0]}>
                        <MaterialModel activeObject={activeObject} lightOn={lightOn} />
                      </group>
                    </PresentationControls>

                    {/* Lamp in world space, base on the right, arm reaching left */}
                    <group position={[3.2, -2.5, 0]}>
                      <DeskLamp lightOn={lightOn} />
                    </group>
                    <ContactShadows position={[0, -2.5, 0]} opacity={lightOn ? 0.4 : 0.1} scale={10} blur={2} far={4} />
                  </Canvas>
                </div>

                {/* Info overlay when light is on */}
                {lightOn && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute', bottom: '1.5rem', right: '1.5rem',
                      background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)',
                      padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      color: 'white', display: 'flex', gap: '2rem', fontSize: '0.9rem',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600' }}>Colour:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ 
                          width: '14px', height: '14px', borderRadius: '50%', 
                          background: activeObjDetails.propColour === 'White' ? '#ffffff' : 
                                      activeObjDetails.propColour === 'Brown' ? '#8b4513' : 
                                      activeObjDetails.propColour === 'Reddish' ? '#cd5c5c' : '#c0c0c0',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.2)'
                        }} />
                        <span style={{ fontWeight: '500' }}>{activeObjDetails.propColour}</span>
                      </div>
                    </div>
                    
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600' }}>Texture:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: '500' }}>{activeObjDetails.propTexture}</span>
                        <span style={{ opacity: 0.7 }}>{activeObjDetails.propTexture === 'Smooth' ? '〰️' : '🌫️'}</span>
                      </div>
                    </div>
                    
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600' }}>Surface:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: '500' }}>{activeObjDetails.isShiny ? 'Shiny' : 'Dull'}</span>
                        <span>{activeObjDetails.isShiny ? '✨' : '🪨'}</span>
                      </div>
                    </div>
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
