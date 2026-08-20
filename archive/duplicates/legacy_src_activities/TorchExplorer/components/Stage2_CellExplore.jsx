import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Search, Info } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Cylinder, Html, Box } from '@react-three/drei';

export default function Stage2_CellExplore({ onComplete }) {
  const [torchOpened, setTorchOpened] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [quizState, setQuizState] = useState('idle'); // idle, asking, correct, incorrect

  const handleOpenTorch = () => {
    setTorchOpened(true);
    setTimeout(() => {
      setQuizState('asking');
    }, 2000);
  };

  const handleTerminalClick = (isPositive) => {
    if (quizState !== 'asking' && quizState !== 'incorrect') return;
    
    if (isPositive) {
      setQuizState('correct');
    } else {
      setQuizState('incorrect');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!torchOpened ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Explore the Electric Cell</h3>
          <p style={{ margin: '0 0 2rem 0', color: 'var(--text-secondary)' }}>
            The torch is assembled, but it has no power source yet. Let's open it up and look inside!
          </p>
          <button onClick={handleOpenTorch} className="primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
            Open Torch
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          
          {/* 3D Cell Inspector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--text-heading)' }}>360° Cell Inspection</h4>
            <div style={{ 
              width: '100%', 
              height: '400px', 
              background: '#0f172a', 
              borderRadius: '8px', 
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
            }}>
              <Canvas 
                camera={{ position: [0, 0, 5], fov: 40 }}
                onPointerMissed={() => setActiveHotspot(null)}
              >
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={1.5} />
                <pointLight position={[-5, -5, -5]} intensity={0.5} />
                
                <group rotation={[Math.PI / 4, 0, 0]}>
                  {/* Battery Body */}
                  <Cylinder args={[0.8, 0.8, 2.5, 32]} rotation={[0, 0, 0]}>
                    <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
                  </Cylinder>
                  
                  {/* Positive Terminal Cap */}
                  <Cylinder 
                    args={[0.3, 0.3, 0.2, 32]} 
                    position={[0, 1.35, 0]} 
                    onClick={() => handleTerminalClick(true)}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'default'}
                  >
                    <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
                  </Cylinder>
                  
                  {/* Negative Terminal Base */}
                  <Cylinder 
                    args={[0.8, 0.8, 0.1, 32]} 
                    position={[0, -1.3, 0]} 
                    onClick={() => handleTerminalClick(false)}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'default'}
                  >
                    <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
                  </Cylinder>

                  {/* Hotspots */}
                  <Html position={[0, 1.6, 0]} center>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot('positive');
                      }}
                      style={{ background: 'white', color: '#ef4444', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', userSelect: 'none' }}
                    >
                      (+)
                    </div>
                  </Html>
                  <Html position={[0, -1.6, 0]} center>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot('negative');
                      }}
                      style={{ background: 'white', color: '#3b82f6', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', userSelect: 'none' }}
                    >
                      (−)
                    </div>
                  </Html>
                </group>

                <OrbitControls enableZoom={true} minDistance={3} maxDistance={8} />
              </Canvas>

              {/* Hotspot Info Panel overlay */}
              <AnimatePresence>
                {activeHotspot && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 20, x: "-50%" }}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '50%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '1rem',
                      borderRadius: '8px',
                      width: '80%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      zIndex: 10
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h5 style={{ margin: 0, color: activeHotspot === 'positive' ? '#ef4444' : '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Info size={16} /> 
                        {activeHotspot === 'positive' ? 'Positive Terminal (+)' : 'Negative Terminal (−)'}
                      </h5>
                      <button onClick={() => setActiveHotspot(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>&times;</button>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155' }}>
                      {activeHotspot === 'positive' 
                        ? 'The metal cap is the positive terminal of the electric cell. Current flows out from this end in a closed circuit.' 
                        : 'The flat metal disc is the negative terminal. A cell is a portable source of electrical energy stored chemically.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
              Rotate the cell to inspect it. Click the (+) and (−) badges to learn more.
            </p>
          </div>

          {/* Interactive Quiz Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={20} style={{ color: 'var(--accent)' }} /> Mini Activity
              </h4>
              
              {quizState === 'idle' && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                  Wait for the prompt...
                </div>
              )}

              {(quizState === 'asking' || quizState === 'incorrect') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, fontWeight: '500' }}>
                    Can you identify the <strong>positive terminal</strong>?
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Click directly on the corresponding metal part of the 3D cell.
                  </p>
                  
                  {quizState === 'incorrect' && (
                    <div style={{ marginTop: 'auto', background: 'var(--destructive-bg)', color: 'var(--destructive)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid var(--destructive-border)' }}>
                      That's the negative terminal (the flat disc). Try finding the metal cap!
                    </div>
                  )}
                </motion.div>
              )}

              {quizState === 'correct' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                  <CheckCircle2 size={48} style={{ color: 'var(--success)' }} />
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success)', fontSize: '1.2rem' }}>Correct!</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      The metal cap is the positive terminal. You are now ready to build a battery.
                    </p>
                  </div>
                </motion.div>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  onClick={onComplete} 
                  disabled={quizState !== 'correct'}
                  className="primary" 
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem',
                    opacity: quizState === 'correct' ? 1 : 0.5,
                    cursor: quizState === 'correct' ? 'pointer' : 'not-allowed'
                  }}
                >
                  Proceed to Battery Test <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
