import React, { useState, useRef } from 'react';
import { Sparkles, Check, FileText, Lightbulb, LightbulbOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stage4a_Appearance_Observe({ onComplete, addXp }) {
  const [inspectedObjects, setInspectedObjects] = useState({});
  const [activeObject, setActiveObject] = useState(null);
  const [lightOn, setLightOn] = useState(false);
  
  // Manual Rotation State
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const objects = [
    { id: 'paper', name: 'Paper', icon: '📄', isShiny: false, propColour: 'White', propTexture: 'Smooth' },
    { id: 'cardboard', name: 'Cardboard', icon: '📦', isShiny: false, propColour: 'Brown', propTexture: 'Rough' },
    { id: 'wood', name: 'Wood', icon: '🪵', isShiny: false, propColour: 'Brown', propTexture: 'Rough' },
    { id: 'chalk', name: 'Chalk', icon: '🖍️', isShiny: false, propColour: 'White', propTexture: 'Rough' },
    { id: 'copper', name: 'Copper Wire', icon: '🪢', isShiny: true, propColour: 'Reddish', propTexture: 'Smooth' },
    { id: 'aluminium', name: 'Aluminium Foil', icon: '🪙', isShiny: true, propColour: 'Silver', propTexture: 'Smooth' },
    { id: 'steel', name: 'Steel Spoon', icon: '🥄', isShiny: true, propColour: 'Silver', propTexture: 'Smooth' }
  ];

  const handleSelect = (objId) => {
    setActiveObject(objId);
    setLightOn(false);
    setRotation({ x: 0, y: 0 }); // Reset rotation
  };

  const handleTurnOnLight = () => {
    setLightOn(true);
    if (activeObject && !inspectedObjects[activeObject]) {
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

  // Pointer Events for Dragging to Rotate
  const handlePointerDown = (e) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - dy * 0.6)), // Clamp x rotation to avoid flipping upside down
      y: prev.y + dx * 0.6
    }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
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

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
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
                  position: 'relative'
                }}>
                  {obj.icon}
                  {inspectedObjects[obj.id] && (
                    <div style={{ position: 'absolute', bottom: 0, right: -5, background: 'var(--success)', borderRadius: '50%', padding: '2px' }}>
                      <Check size={14} color="white" />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: activeObject === obj.id ? '600' : '400', color: 'var(--text-primary)', textAlign: 'center' }}>
                  {obj.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D Viewer & Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
          
          {/* 3D Viewer Area */}
          <div 
            className="glass-panel" 
            style={{ 
              flex: 2, position: 'relative', display: 'flex', flexDirection: 'column', 
              background: 'radial-gradient(circle at center, var(--surface), var(--card-bg))', 
              border: '2px solid var(--border)', borderRadius: '16px', overflow: 'hidden',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05)',
              touchAction: 'none' // Prevent scrolling while dragging
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {activeObject ? (
              <>
                {/* Viewer Controls */}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleTurnOnLight(); }}
                    disabled={lightOn}
                    className={lightOn ? 'outline' : 'primary'}
                    style={{ 
                      padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: lightOn ? 'var(--surface-hover)' : 'var(--accent)',
                      color: lightOn ? 'var(--text-muted)' : 'white', border: lightOn ? '1px solid var(--border)' : 'none',
                      boxShadow: lightOn ? 'none' : '0 0 15px rgba(99, 102, 241, 0.6)',
                      pointerEvents: 'all'
                    }}
                  >
                    {lightOn ? <Lightbulb size={18} color="var(--warning)" /> : <LightbulbOff size={18} />}
                    {lightOn ? 'Light is ON' : 'Turn Light ON'}
                  </button>
                </div>
                
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Drag to rotate
                </div>

                {/* The 3D Stage */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '800px', pointerEvents: 'none' }}>
                  
                  {/* Spotlight Background Effect */}
                  {lightOn && (
                    <div style={{
                      position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
                      width: '400px', height: '600px',
                      background: 'radial-gradient(ellipse at top, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
                      pointerEvents: 'none'
                    }} />
                  )}

                  {/* The Object */}
                  <motion.div 
                    animate={{ rotateX: rotation.x, rotateY: rotation.y }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                      fontSize: '8rem',
                      lineHeight: 1,
                      filter: lightOn ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' : 'brightness(0.6) drop-shadow(0 10px 10px rgba(0,0,0,0.4))',
                      transformStyle: 'preserve-3d',
                      userSelect: 'none'
                    }}
                  >
                    {activeObjDetails.icon}

                    {/* Specular Reflection for Shiny Objects */}
                    {lightOn && activeObjDetails.isShiny && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%)',
                        backgroundSize: '200% 200%',
                        backgroundPosition: `${(rotation.y % 180) / 180 * 100}% ${(rotation.x % 180) / 180 * 100}%`,
                        mixBlendMode: 'overlay',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                      }} />
                    )}
                  </motion.div>
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
                      pointerEvents: 'none'
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

          {/* Detective Log (Bottom half) */}
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
    </div>
  );
}
