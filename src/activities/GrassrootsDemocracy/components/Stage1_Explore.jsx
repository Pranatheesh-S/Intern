import React, { useState, useRef } from 'react';
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Tractor, MapPin, Waves, Check } from 'lucide-react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment, Sky, ContactShadows } from '@react-three/drei';

function CameraRig({ targetPos, targetLookAt }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Smoothly interpolate camera position
    state.camera.position.lerp(targetPos, delta * 3);
    // Smoothly interpolate look-at target
    currentLookAt.current.lerp(targetLookAt, delta * 3);
    state.camera.lookAt(currentLookAt.current);
  });
  return null;
}

function VillageScene({ spots, discoveredSpots, activeSpot, onDiscover }) {
  // Map spot IDs to 3D positions [x, y, z]
  const positions = {
    school: [-6, 0, -5],
    farm: [7, 0, -4],
    road: [0, 0, 3],
    water: [5, 0, 4]
  };

  // Determine camera targets
  let targetPos = new THREE.Vector3(0, 15, 20); // Default overview
  let targetLookAt = new THREE.Vector3(0, 0, 0);

  if (activeSpot) {
    const pos = positions[activeSpot];
    if (pos) {
      targetPos = new THREE.Vector3(pos[0], 6, pos[2] + 8);
      targetLookAt = new THREE.Vector3(pos[0], 0, pos[2]);
    }
  }

  const renderModel = (id) => {
    switch(id) {
      case 'school':
        return (
          <group>
            {/* Main Building Base */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[5, 3, 3]} /><meshStandardMaterial color="#fef08a" /></mesh>
            {/* Door */}
            <mesh position={[0, 1, 1.51]}><boxGeometry args={[1, 2, 0.05]} /><meshStandardMaterial color="#8b5a2b" /></mesh>
            {/* Windows */}
            <mesh position={[-1.5, 1.5, 1.51]}><boxGeometry args={[1, 1, 0.05]} /><meshStandardMaterial color="#38bdf8" /></mesh>
            <mesh position={[1.5, 1.5, 1.51]}><boxGeometry args={[1, 1, 0.05]} /><meshStandardMaterial color="#38bdf8" /></mesh>
            {/* Roof Base */}
            <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI/4, 0]} castShadow><coneGeometry args={[4.5, 2, 4]} /><meshStandardMaterial color="#ef4444" /></mesh>
            {/* Chimney */}
            <mesh position={[-1.5, 4, -0.5]} castShadow><boxGeometry args={[0.5, 1.5, 0.5]} /><meshStandardMaterial color="#78716c" /></mesh>
            {/* Crack/Hole in roof */}
            <mesh position={[1, 3.9, 1]} rotation={[0, Math.PI/4, 0]}><boxGeometry args={[1.2, 0.1, 1.2]} /><meshStandardMaterial color="#450a0a" /></mesh>
            {/* Broken tile debris */}
            <mesh position={[1.5, 3.7, 1.5]} rotation={[0.2, 0.5, 0.1]}><boxGeometry args={[0.4, 0.05, 0.4]} /><meshStandardMaterial color="#ef4444" /></mesh>
            <mesh position={[0.5, 3.6, 1.8]} rotation={[-0.1, 0.3, 0.4]}><boxGeometry args={[0.3, 0.05, 0.3]} /><meshStandardMaterial color="#ef4444" /></mesh>
          </group>
        );
      case 'farm':
        return (
          <group>
            {/* Field Base */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow><planeGeometry args={[8, 8]} /><meshStandardMaterial color="#65a30d" /></mesh>
            {/* Crop Rows */}
            {[-2, -1, 0, 1, 2].map(x => (
              <mesh key={x} position={[x, 0.1, 1]} rotation={[-Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 6, 8]} /><meshStandardMaterial color="#4d7c0f" /></mesh>
            ))}
            {/* Tractor Body */}
            <mesh position={[-1.5, 0.8, -1]} castShadow><boxGeometry args={[1.5, 1, 2.5]} /><meshStandardMaterial color="#ef4444" /></mesh>
            {/* Tractor Cabin */}
            <mesh position={[-1.5, 1.8, -0.2]} castShadow><boxGeometry args={[1.2, 1.2, 1.2]} /><meshStandardMaterial color="#1f2937" /></mesh>
            {/* Tractor Window */}
            <mesh position={[-1.5, 1.8, 0.41]}><boxGeometry args={[1, 0.8, 0.05]} /><meshStandardMaterial color="#9ca3af" /></mesh>
            {/* Exhaust Pipe */}
            <mesh position={[-1.5, 1.6, -1.8]}><cylinderGeometry args={[0.05, 0.05, 1]} /><meshStandardMaterial color="#d1d5db" /></mesh>
            {/* Big Rear Wheels */}
            <mesh position={[-2.4, 0.6, -0.2]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.8, 0.8, 0.4, 16]} /><meshStandardMaterial color="#111827" /></mesh>
            <mesh position={[-0.6, 0.6, -0.2]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.8, 0.8, 0.4, 16]} /><meshStandardMaterial color="#111827" /></mesh>
            {/* Small Front Wheels */}
            <mesh position={[-2.3, 0.4, -1.8]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.4, 0.4, 0.3, 16]} /><meshStandardMaterial color="#111827" /></mesh>
            <mesh position={[-0.7, 0.4, -1.8]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.4, 0.4, 0.3, 16]} /><meshStandardMaterial color="#111827" /></mesh>
          </group>
        );
      case 'road':
        return (
          <group>
            {/* Broken part of the road base */}
            <mesh position={[0, 0.04, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow><planeGeometry args={[3.2, 4]} /><meshStandardMaterial color="#292524" /></mesh>
            {/* Deep Pothole */}
            <mesh position={[0.2, 0.05, -0.2]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[1.8, 2]} /><meshStandardMaterial color="#1c1917" /></mesh>
            <mesh position={[-0.5, 0.05, 0.8]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[1, 1.2]} /><meshStandardMaterial color="#1c1917" /></mesh>
            {/* Dashed Lines */}
            <mesh position={[0, 0.06, -1.5]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[0.2, 1]} /><meshStandardMaterial color="#ffffff" /></mesh>
            <mesh position={[0, 0.06, 1.5]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[0.2, 1]} /><meshStandardMaterial color="#ffffff" /></mesh>
            {/* Debris/Rocks */}
            <mesh position={[0.8, 0.1, -0.5]} rotation={[0.2, 0.5, 0.1]} castShadow><boxGeometry args={[0.3, 0.2, 0.3]} /><meshStandardMaterial color="#57534e" /></mesh>
            <mesh position={[-0.8, 0.08, 0.2]} rotation={[-0.1, 0.3, 0.4]} castShadow><boxGeometry args={[0.2, 0.15, 0.2]} /><meshStandardMaterial color="#78716c" /></mesh>
            <mesh position={[0.3, 0.05, 1.2]} rotation={[0.4, 0.1, 0.2]} castShadow><boxGeometry args={[0.15, 0.1, 0.15]} /><meshStandardMaterial color="#57534e" /></mesh>
          </group>
        );
      case 'water':
        return (
          <group>
            {/* Stone Well Base */}
            <mesh position={[0, 0.8, 0]} castShadow receiveShadow><cylinderGeometry args={[1.4, 1.4, 1.6, 12]} /><meshStandardMaterial color="#78716c" /></mesh>
            <mesh position={[0, 1.7, 0]} castShadow><cylinderGeometry args={[1.2, 1.2, 0.2, 12]} /><meshStandardMaterial color="#0ea5e9" /></mesh>
            {/* Wooden Frame */}
            <mesh position={[-1.2, 2, 0]} castShadow><boxGeometry args={[0.2, 2.5, 0.2]} /><meshStandardMaterial color="#78350f" /></mesh>
            <mesh position={[1.2, 2, 0]} castShadow><boxGeometry args={[0.2, 2.5, 0.2]} /><meshStandardMaterial color="#78350f" /></mesh>
            <mesh position={[0, 3.2, 0]} castShadow><boxGeometry args={[2.6, 0.2, 0.2]} /><meshStandardMaterial color="#78350f" /></mesh>
            {/* Bucket */}
            <mesh position={[0, 1.9, 0]} castShadow><cylinderGeometry args={[0.4, 0.3, 0.5, 12]} /><meshStandardMaterial color="#fcd34d" /></mesh>
            {/* Broken Pipe/Pump structure on the side */}
            <mesh position={[1.8, 1, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 2, 8]} /><meshStandardMaterial color="#ef4444" /></mesh>
            <mesh position={[2, 2, 0]} rotation={[0, 0, Math.PI/4]} castShadow><cylinderGeometry args={[0.1, 0.1, 1, 8]} /><meshStandardMaterial color="#ef4444" /></mesh>
            {/* Puddle */}
            <mesh position={[2.5, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[1.5, 1.5]} /><meshStandardMaterial color="#38bdf8" transparent opacity={0.8} /></mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CameraRig targetPos={targetPos} targetLookAt={targetLookAt} />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment preset="sunset" />

      {/* Ground Terrain */}
      <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      
      {/* Main Road visual across terrain */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 100]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>

      {/* Spots */}
      {spots.map(spot => {
        const pos = positions[spot.id];
        const isActive = activeSpot === spot.id;
        const isDiscovered = discoveredSpots.includes(spot.id);

        return (
          <group key={spot.id} position={pos}>
            {/* 3D Model wrapper - click to activate */}
            <group onClick={(e) => { e.stopPropagation(); onDiscover(spot.id); }} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
              {renderModel(spot.id)}
              
              {/* Highlight Ring */}
              {!isActive && (
                <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
                  <ringGeometry args={[2.5, 3, 32]} />
                  <meshBasicMaterial color={isDiscovered ? "#10b981" : "#fcd34d"} transparent opacity={0.6} />
                </mesh>
              )}
            </group>

            {/* Floating Marker / Popup */}
            <Html position={[0, 5, 0]} center zIndexRange={[100, 0]}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                {isActive ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 10 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    style={{ background: 'rgba(15, 23, 42, 0.9)', color: 'white', padding: '1.25rem', borderRadius: '16px', width: '260px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                      <spot.icon size={24} color="#34d399" />
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: '#6ee7b7', display: 'block', marginBottom: '0.5rem' }}>{spot.label}</strong>
                    <span style={{ lineHeight: '1.5', opacity: 0.9, fontSize: '0.9rem', display: 'block' }}>{spot.text}</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{ background: isDiscovered ? '#10b981' : 'white', color: isDiscovered ? 'white' : '#059669', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', border: isDiscovered ? 'none' : '2px solid #059669', cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={(e) => { e.stopPropagation(); onDiscover(spot.id); }}
                  >
                    {isDiscovered ? <Check size={24} /> : spot.emoji}
                  </motion.div>
                )}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Global click to reset camera view */}
      <mesh position={[0,0,0]} visible={false} scale={1000} onClick={() => onDiscover(null)}>
        <boxGeometry />
      </mesh>
    </>
  );
}

export default function Stage1_Explore({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const [discoveredSpots, setDiscoveredSpots] = useState([]);
  const [activeSpot, setActiveSpot] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const spots = [
    { id: 'school', emoji: '🏫', icon: BookOpen, label: 'Primary School', text: 'The roof is leaking after heavy rains and needs urgent maintenance.', x: 25, y: 35 },
    { id: 'farm', emoji: '🚜', icon: Tractor, label: 'Farms', text: 'The fields require better irrigation facilities for the upcoming season.', x: 75, y: 40 },
    { id: 'road', emoji: '🛣️', icon: MapPin, label: 'Main Road', text: 'Heavy rains have severely damaged the main connecting road.', x: 45, y: 70 },
    { id: 'water', emoji: '🚰', icon: Waves, label: 'Village Well', text: 'The village faces a water shortage and needs a new handpump.', x: 65, y: 65 },
  ];

  const handleDiscover = (id) => {
    setActiveSpot(id);
    if (id && !discoveredSpots.includes(id)) {
      playClick();
      setDiscoveredSpots(prev => [...prev, id]);
      addXp(5);
    } else if (id) {
      playClick();
    }
  };

  const handleSelect = (option) => {
    if (selectedAnswer !== null) return;
    playClick();
    setSelectedAnswer(option);
    addXp(10);
  };

  const allDiscovered = discoveredSpots.length === spots.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      {/* 1. Introduction Header */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Chapter Introduction
        </div>
        <h1 style={{ margin: 0, fontSize: '3rem', color: 'var(--text-heading)', lineHeight: '1.2' }}>
          Grassroots <span style={{ color: '#38bdf8' }}>Democracy</span>
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
            <div style={{ color: '#eab308', fontSize: '2rem', fontWeight: 'bold' }}>6 lakh</div>
            <div style={{ color: 'var(--text-secondary)' }}>villages across India</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
            <div style={{ color: '#eab308', fontSize: '2rem', fontWeight: 'bold' }}>~2/3</div>
            <div style={{ color: 'var(--text-secondary)' }}>of 1.4 billion people live in rural areas</div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ borderLeft: '3px solid #eab308', paddingLeft: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2rem' }}>
          <p style={{ margin: 0, fontSize: '1.2rem' }}>"The real India lives in its villages."</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#eab308', fontWeight: 'bold' }}>— Mahatma Gandhi</p>
        </motion.div>
      </section>

      {/* 2. Meet Lakshmanpur - 3D MAP */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Meet Lakshmanpur</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0 }}>
              Welcome to Lakshmanpur — a village of 200 houses tucked in the foothills. Click around the village to discover the daily challenges the villagers face.
            </p>
          </div>
          {activeSpot && (
            <button onClick={() => setActiveSpot(null)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Reset View
            </button>
          )}
        </div>
        
        <div style={{ 
          width: '100%', height: '500px', borderRadius: '16px', position: 'relative', 
          background: '#0ea5e9',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)', overflow: 'hidden'
        }}>
          <Canvas shadows camera={{ position: [0, 15, 20], fov: 45 }}>
            <VillageScene 
              spots={spots} 
              discoveredSpots={discoveredSpots} 
              activeSpot={activeSpot}
              onDiscover={handleDiscover}
            />
          </Canvas>
          
          {/* Instruction overlay when nothing is active */}
          <AnimatePresence>
            {!activeSpot && discoveredSpots.length < spots.length && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', padding: '0.75rem 1.5rem', borderRadius: '20px', fontWeight: 'bold', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
                Click on the markers to explore!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Problem Question */}
      <AnimatePresence>
        {allDiscovered && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
            <div className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--accent-border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-heading)' }}>The Big Question 🤔</h3>
              <p style={{ marginTop: '1rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                The village has many immediate needs: roads, water, school repairs. Who should be responsible for making these daily decisions and solving these local problems?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {['The Prime Minister in New Delhi', 'The Chief Minister in the State Capital', 'The Villagers themselves'].map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = index === 2;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      disabled={selectedAnswer !== null}
                      style={{
                        padding: '1rem', borderRadius: '12px', textAlign: 'left',
                        background: isSelected ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--surface)',
                        border: `1px solid ${isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--border)'}`,
                        cursor: selectedAnswer === null ? 'pointer' : 'default', transition: 'all 0.2s',
                        opacity: selectedAnswer !== null && !isSelected ? 0.5 : 1
                      }}
                    >
                      <span style={{ fontSize: '1rem', color: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--text-primary)' }}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  <strong>Exactly!</strong> Imagine if a villager had to travel 500 km to the capital just to fix a leaking pipe. India is too large. Villages need the power to govern their own local issues. This is why we have the <strong>Panchayati Raj System</strong>.
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          onClick={onComplete}
          disabled={!selectedAnswer}
          className="primary" 
          style={{ opacity: selectedAnswer ? 1 : 0.5, padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
        >
          Discover Panchayati Raj <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
