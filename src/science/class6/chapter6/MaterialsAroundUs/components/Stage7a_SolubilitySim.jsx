import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Search, Droplets, Target, Camera } from 'lucide-react';

const StirringProgress = () => {
  const [percent, setPercent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#431407', letterSpacing: '0.05em' }}>STIRRING</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d97706', lineHeight: 1 }}>{percent}%</div>
      </div>
      <div style={{ width: '100%', height: '24px', background: '#fff', border: '1px solid #d6d3d1', borderRadius: '12px', overflow: 'hidden', padding: '2px' }}>
        <div style={{ height: '100%', background: '#d97706', width: `${percent}%`, transition: 'width 0.1s linear', borderRadius: '8px' }} />
      </div>
      <div style={{ fontSize: '1.1rem', color: '#78716c', fontWeight: '600', textTransform: 'uppercase' }}>Mixing...</div>
    </div>
  );
};




// --- REALISTIC WEBGL LABORATORY SIMULATION ---
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const ParticleSystem = ({ selectedSubstance, stirState }) => {
  const meshRef = React.useRef();
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  
  const count = React.useMemo(() => {
    if (!selectedSubstance) return 0;
    return selectedSubstance.id === 'chalk' ? 1200 :
           selectedSubstance.id === 'sawdust' ? 400 :
           600;
  }, [selectedSubstance]);

  const particles = React.useMemo(() => {
    if (!selectedSubstance || count === 0) return [];
    const pts = [];
    const mat = selectedSubstance.id;
    for (let i = 0; i < count; i++) {
      let color;
      if (mat === 'sand') {
        const sandColors = ['#E5A93D', '#F4C05B', '#C98528'];
        color = new THREE.Color(sandColors[Math.floor(Math.random() * sandColors.length)]);
      } else if (mat === 'sawdust') {
        const sawdustColors = ['#A66A38', '#8B4513', '#C17A3E'];
        color = new THREE.Color(sawdustColors[Math.floor(Math.random() * sawdustColors.length)]);
      } else {
        color = new THREE.Color('#ffffff');
      }

      const scaleBase = mat === 'chalk' ? (0.15 + Math.random() * 0.05) : 
                        mat === 'sawdust' ? (0.05 + Math.random() * 0.03) : 
                        mat === 'salt' ? (0.22 + Math.random() * 0.08) :
                        mat === 'sugar' ? (0.20 + Math.random() * 0.08) :
                        (0.18 + Math.random() * 0.08);
      
      pts.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 0.8, 1.8 + Math.random() * 3.0, (Math.random() - 0.5) * 0.8), // Pour in a vertical stream
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.2, -(Math.random() * 4 + 2), (Math.random() - 0.5) * 0.2), // Fast initial downward drop
        scale: scaleBase,
        initialScale: scaleBase,
        material: mat,
        color: color,
        rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        rotV: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
        floatOffset: Math.random() * 0.4,
        dissolveRate: 0.15 + Math.random() * 0.4 // Varied dissolution rate for "concentration" fading effect
      });
    }
    return pts;
  }, [selectedSubstance, count]);

  useFrame((state, delta) => {
    if (!meshRef.current || particles.length === 0) return;
    const dt = Math.min(delta, 0.05);
    const radius = 1.30; // Inside beaker bounds
    let bottom = -1.75;
    const top = 1.35; // Stay inside water surface

    particles.forEach((p, i) => {
        // Dynamic gravity based on particle state
        let gravity = 1.0;
        if (p.material === 'sawdust') gravity = -1.5; // Gentle buoyancy to float to surface
        else if (p.material === 'sand') gravity = 10.0; // Heavy
        else if (p.material === 'chalk') gravity = 8.0; // Fast settling suspension
        else if (p.material === 'sugar' || p.material === 'salt') {
           // If fully dissolved (tiny), suspend them in fluid rather than dropping them
           gravity = p.scale <= 0.02 ? 0.02 : 10.0; 
        }
        
        p.velocity.y -= gravity * dt;
        
        if (stirState === 'stirring') {
          const cx = p.position.x;
          const cz = p.position.z;
          const dist = Math.sqrt(cx*cx + cz*cz);
          const force = Math.max(0, 1 - dist/radius);
          
          // Vortex forces (rotate around Y)
          p.velocity.x += -cz * 4 * force * dt;
          p.velocity.z += cx * 4 * force * dt;
          
          // Pull inwards to prevent particles from forming a hard ring against the glass
          p.velocity.x -= cx * 2 * force * dt;
          p.velocity.z -= cz * 2 * force * dt;
          
          // Upward turbulence during stirring
          if (p.material === 'sand' || p.material === 'chalk') {
              p.velocity.y += (Math.random() * 3.5) * force * dt; // Lift off bottom
          } else if (p.material !== 'sawdust') {
              p.velocity.y += (Math.random() * 2) * force * dt; 
          }
        }

        // Dissolution for soluble materials
        if ((p.material === 'sugar' || p.material === 'salt') && (stirState === 'stirring' || stirState === 'resolved')) {
          // Shrink progressively based on random dissolveRate until they reach absolute zero
          p.scale = Math.max(0.0, p.scale - dt * p.dissolveRate);
        }

        // Damping
        if (stirState === 'dropping') {
           p.velocity.x *= 0.95;
           p.velocity.z *= 0.95;
           p.velocity.y *= 0.99; // Low vertical drag allows them to fall fast to the bottom
        } else if (stirState === 'settled') {
           p.velocity.x *= 0.90;
           p.velocity.z *= 0.90;
           p.velocity.y *= 0.95; // Allows gravity to keep them resting naturally on the floor
           p.rotV.multiplyScalar(0.9);
        } else {
           p.velocity.multiplyScalar(0.95);
        }

      p.position.addScaledVector(p.velocity, dt);
      p.rot.addScaledVector(p.rotV, dt);

      // Boundaries
      let pTop = top;
      if (p.material === 'sawdust') {
        pTop = 1.45 - p.floatOffset * 0.8; // Rest gently near the water surface (1.5)
      }
      
      if (p.position.y > pTop) {
        p.position.y = pTop;
        p.velocity.y *= -0.2;
      }
      
      // Bottom boundary - Create a realistic 3D mound in the center instead of a flat horizontal strip
      let pBottom = bottom;
      if (p.material !== 'sawdust') {
        const distFromCenter = Math.sqrt(p.position.x * p.position.x + p.position.z * p.position.z);
        const moundFactor = p.material === 'chalk' ? 1.0 : 0.7; // Taller mound for chalk powder
        const moundHeight = Math.max(0, (1.0 - distFromCenter)) * moundFactor; // Higher in the middle
        pBottom = bottom + moundHeight + (p.floatOffset * 0.5); 
      }
      
      if (p.position.y < pBottom) {
        p.position.y = pBottom;
        p.velocity.y *= -0.2;
        p.velocity.x *= 0.7;
        p.velocity.z *= 0.7;
      }
      
      // Cylinder walls
      const d = Math.sqrt(p.position.x * p.position.x + p.position.z * p.position.z);
      if (d > radius - 0.05) {
         const nx = p.position.x / d;
         const nz = p.position.z / d;
         p.position.x = nx * (radius - 0.05);
         p.position.z = nz * (radius - 0.05);
         p.velocity.x *= -0.5;
         p.velocity.z *= -0.5;
      }

      if (p.scale > 0) {
        dummy.position.copy(p.position);
        if (p.material === 'sawdust') {
          // Small, thin, irregular wood flakes
          dummy.scale.set(p.scale * 2.0, p.scale * 0.25, p.scale * 1.5);
        } else if (p.material === 'salt' || p.material === 'sugar') {
          // Angular/irregular crystals
          dummy.scale.set(p.scale, p.scale * (0.8 + Math.random() * 0.4), p.scale);
        } else {
          dummy.scale.setScalar(p.scale);
        }
        
        // Use the particle's stable rotation
        dummy.rotation.set(p.rot.x, p.rot.y, p.rot.z);
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, p.color);
      } else {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
  });

  if (!selectedSubstance || count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} renderOrder={2}>
      {selectedSubstance.id === 'chalk' ? <sphereGeometry args={[1, 6, 6]} /> :
       selectedSubstance.id === 'sugar' ? <icosahedronGeometry args={[1, 0]} /> :
       selectedSubstance.id === 'salt' ? <boxGeometry args={[1, 1, 1]} /> :
       selectedSubstance.id === 'sand' ? <dodecahedronGeometry args={[1, 0]} /> :
       <dodecahedronGeometry args={[1, 0]} />}
       
      {/* High contrast physical material that respects individual instance colors and 3D lighting */}
      <meshStandardMaterial 
        transparent={true} // Forces material into transparent pass so renderOrder applies
        opacity={1.0}
        visible={true}
        roughness={0.6}
        metalness={0.1}
        emissive="#ffffff"
        emissiveIntensity={selectedSubstance.id === 'sand' || selectedSubstance.id === 'sawdust' ? 0.0 : 0.1} 
        color="#ffffff" 
        depthWrite={true}
      />
    </instancedMesh>
  );
};

const StirringRod = ({ stirState }) => {
  const rodRef = React.useRef();
  const phase = React.useRef(0);
  
  useFrame((state, delta) => {
    if (!rodRef.current) return;
    const dt = Math.min(delta, 0.05);

    if (stirState === 'stirring') {
      phase.current += dt * 8;
      const r = 0.5;
      rodRef.current.position.x = Math.cos(phase.current) * r;
      rodRef.current.position.z = Math.sin(phase.current) * r;
      rodRef.current.rotation.x = Math.PI / 16;
      rodRef.current.rotation.z = Math.cos(phase.current) * 0.1;
      rodRef.current.rotation.x = Math.sin(phase.current) * 0.1 + (Math.PI / 16);
    } else {
      phase.current *= 0.95;
      rodRef.current.position.lerp(new THREE.Vector3(0.3, 0, 0.3), dt * 5);
      rodRef.current.rotation.x = THREE.MathUtils.lerp(rodRef.current.rotation.x, Math.PI / 12, dt * 5);
      rodRef.current.rotation.z = THREE.MathUtils.lerp(rodRef.current.rotation.z, Math.PI / 12, dt * 5);
    }
  });

  return (
    <mesh ref={rodRef} position={[0.2, 0.2, 0.2]} rotation={[Math.PI / 12, 0, Math.PI / 12]}>
      <cylinderGeometry args={[0.04, 0.04, 4.5, 16]} />
      <meshPhysicalMaterial 
        transparent
        transmission={0.95}
        opacity={1}
        roughness={0.02}
        ior={1.52}
        color="#ffffff"
        clearcoat={1}
      />
    </mesh>
  );
};

const Beaker3D = ({ stirState }) => {
  const waterRef = React.useRef();

  // Create highly accurate laboratory beaker profile
  const beakerPoints = React.useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0, -1.95)); // center bottom
    points.push(new THREE.Vector2(1.3, -1.95)); // bottom flat edge
    points.push(new THREE.Vector2(1.45, -1.8)); // bottom curve
    points.push(new THREE.Vector2(1.45, 1.7)); // main wall
    points.push(new THREE.Vector2(1.6, 1.9)); // rim flare
    return points;
  }, []);

  const graduationTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 1024);
    ctx.fillStyle = 'rgba(180, 190, 200, 0.85)'; // Light gray/neutral, more visible
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 1; i <= 4; i++) {
      const y = 1024 - (i * 200) - 100; 
      ctx.fillRect(100, y - 2, 80, 4);
      ctx.fillText(`${i * 100} ml`, 85, y);
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  useFrame((state) => {
    if (stirState === 'stirring' && waterRef.current) {
       const time = state.clock.getElapsedTime();
       // Violent vortex ripple
       waterRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 15) * 0.05;
       waterRef.current.rotation.y = Math.cos(time * 15) * 0.05;
       waterRef.current.position.y = 1.5 - Math.sin(time * 8) * 0.02;
    } else if (waterRef.current) {
       const time = state.clock.getElapsedTime();
       // Subtle ripple at rest
       waterRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 2) * 0.005;
       waterRef.current.rotation.y = Math.cos(time * 2) * 0.005;
       waterRef.current.position.y = 1.5;
    }
  });

  return (
    <group position={[0, -0.2, 0]} scale={[1, 1, 1]}>
      {/* True Beaker Glass (Simple physical glass) */}
      <mesh renderOrder={3}>
        <latheGeometry args={[beakerPoints, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff" // Clear glass
          transparent 
          opacity={0.15} // Very subtle body
          roughness={0.05} 
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          side={THREE.DoubleSide}
          depthWrite={false} // Prevent depth occlusion of internal particles
        />
      </mesh>

      {/* Graduation Markings */}
      <mesh position={[0, -0.05, 0]} rotation={[0, -Math.PI / 1.5, 0]} renderOrder={3}>
        <cylinderGeometry args={[1.42, 1.36, 3.6, 32, 1, true]} />
        <meshBasicMaterial map={graduationTexture} transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Photorealistic Water Volume */}
      <mesh position={[0, -0.15, 0]} renderOrder={1}>
        <cylinderGeometry args={[1.4, 1.35, 3.4, 64]} />
        <meshPhysicalMaterial 
          transparent={true}
          opacity={0.4} // Reduced so particles are vibrant
          roughness={0.1}
          metalness={0.05}
          color="#55bbee" // Deeper clear cyan/blue
          depthWrite={false}
        />
      </mesh>
      
      {/* Water Surface / Meniscus */}
      <mesh ref={waterRef} position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <circleGeometry args={[1.4, 64]} />
        <meshPhysicalMaterial 
          transparent={true}
          opacity={0.5} // Reduced so surface doesn't wash out particles entering
          roughness={0.1}
          metalness={0.05}
          color="#55bbee" // Deeper clear cyan/blue
          depthWrite={false}
        />
      </mesh>
      
      {/* Meniscus / Surface Line */}
      <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <torusGeometry args={[1.39, 0.015, 16, 64]} />
        <meshPhysicalMaterial transparent opacity={0.8} color="#ffffff" roughness={0.0} clearcoat={1} depthWrite={false} />
      </mesh>
    </group>
  );
};

const WebGLBeakerSimulation = ({ selectedSubstance, stirState }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      flex: 1,
      minHeight: 0,
      background: 'transparent'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Canvas camera={{ position: [0, 0.5, 8.5], fov: 40 }} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
          {/* Photorealistic Studio Lighting */}
          <ambientLight intensity={0.5} color="#ffffff" />
          <directionalLight position={[10, 15, 10]} intensity={1.2} color="#ffffff" castShadow />
          <directionalLight position={[-10, 5, -5]} intensity={0.8} color="#ffffff" />
          <spotLight position={[0, 15, 0]} intensity={1.0} penumbra={1} angle={0.8} color="#ffffff" />
          
          <group scale={[1.15, 1.15, 1.15]} position={[0, -0.05, 0]}>
            <Beaker3D stirState={stirState} />
            <StirringRod stirState={stirState} />
            <ParticleSystem selectedSubstance={selectedSubstance} stirState={stirState} />
          </group>
          
          {/* Neutral studio environment mapping for natural reflections */}
          <Environment preset="city" />
          
          {/* Authentic laboratory surface grounding shadow */}
          <ContactShadows position={[0, -2.01, 0]} opacity={0.65} scale={10} blur={2.0} far={4} color="#000000" />
        </Canvas>
      </div>
    </div>
  );
};
// -----------------------------------------------------

export default function Stage7a_SolubilitySim({ onComplete, addXp }) {
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [stirState, setStirState] = useState('idle'); // idle, stirring, resolved
  const [observations, setObservations] = useState({});

  const substances = [
    { 
      id: 'sugar', name: 'Sugar', type: 'Soluble', image: '/images/solubility_sugar.png',
      desc: 'Sugar completely disappears when stirred into water.',
      conclusion: 'Materials that dissolve in water are called Soluble.',
      waterColor: 'var(--accent)', turbidity: 0, solidVisible: false
    },
    { 
      id: 'salt', name: 'Salt', type: 'Soluble', image: '/images/solubility_salt.png',
      desc: 'Salt completely disappears when stirred into water.',
      conclusion: 'Materials that dissolve in water are called Soluble.',
      waterColor: 'var(--accent)', turbidity: 0, solidVisible: false
    },
    { 
      id: 'chalk', name: 'Chalk Powder', type: 'Insoluble', image: '/images/solubility_chalk.png',
      desc: 'The water turns cloudy and chalk powder does not disappear.',
      conclusion: 'Materials that do not dissolve in water are Insoluble.',
      waterColor: 'var(--border)', turbidity: 0.8, solidVisible: true, solidColor: 'var(--surface)', settle: false
    },
    { 
      id: 'sand', name: 'Sand', type: 'Insoluble', image: '/images/solubility_sand.png',
      desc: 'Sand settles down at the bottom of the beaker.',
      conclusion: 'Sand is Insoluble in water.',
      waterColor: 'var(--accent)', turbidity: 0.2, solidVisible: true, solidColor: '#b45309', settle: true
    },
    { 
      id: 'sawdust', name: 'Sawdust', type: 'Insoluble', image: '/images/solubility_sawdust.png',
      desc: 'Sawdust floats on the surface of the water.',
      conclusion: 'Sawdust is Insoluble in water.',
      waterColor: 'var(--accent)', turbidity: 0.1, solidVisible: true, solidColor: '#d97706', float: true
    }
  ];

  const handleSelect = (sub) => {
    setSelectedSubstance(sub);
    setStirState('dropping');
    setTimeout(() => {
      setStirState(prev => prev === 'dropping' ? 'settled' : prev);
    }, 1500); // 1.5 seconds to pour and settle
  };

  const handleStir = () => {
    if (!selectedSubstance) return;
    setStirState('stirring');

    setTimeout(() => {
      setStirState('resolved');
      if (!observations[selectedSubstance.id]) {
        setObservations(prev => ({ ...prev, [selectedSubstance.id]: true }));
        addXp(15);
      }
    }, 1500);
  };

  const obsCount = Object.keys(observations).length;
  const isComplete = obsCount === substances.length;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ background: '#fdfbf7', border: '1px solid #e7e5e4', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#431407', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
            <Search size={32} color="#d97706" /> Phase 1: Solubility Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '1.15rem', color: '#57534e', fontWeight: '500' }}>
            Activity 6.7: Let us explore how different materials behave when we mix them in water.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #d6d3d1', borderRadius: '12px', padding: '12px 18px', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '1rem', color: '#431407', fontWeight: '600' }}>Does everything dissolve?</div>
            <div style={{ fontSize: '1rem', color: '#431407', fontWeight: '600' }}>Add to water, then stir!</div>
            <div style={{ position: 'absolute', right: '-8px', top: '24px', width: '16px', height: '16px', background: '#fff', borderRight: '1px solid #d6d3d1', borderBottom: '1px solid #d6d3d1', transform: 'rotate(-45deg)' }} />
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        
        {/* Left Side: Experiment */}
        <div style={{ flex: '1 1 50%', minWidth: 0, maxWidth: '50%', padding: '1.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', boxSizing: 'border-box' }}>
          
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Materials to Test
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              {substances.map((sub) => {
                const isSelected = selectedSubstance?.id === sub.id;
                const isObserved = observations[sub.id];
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelect(sub)}
                    style={{
                      background: isSelected ? 'var(--surface)' : 'white',
                      border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      color: isSelected ? 'var(--text-heading)' : 'var(--text-primary)',
                      padding: '1rem 0.5rem',
                      borderRadius: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 15px rgba(59, 130, 246, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--surface)', borderRadius: '50%', padding: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={sub.image} alt={sub.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '50%', mixBlendMode: 'multiply' }} />
                      </div>
                      {isObserved && (
                        <div style={{ position: 'absolute', top: -2, right: -2, background: '#16a34a', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✓</div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.95rem', textAlign: 'center', lineHeight: '1.2' }}>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WebGL 3D Container - flexes to fill available vertical space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
            <WebGLBeakerSimulation selectedSubstance={selectedSubstance} stirState={stirState} />
          </div>

          {/* Dedicated Stir Button Area (Inside document flow) */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', flexShrink: 0, gap: '1.5rem' }}>
            {selectedSubstance && (
              <>
                <button
                  onClick={handleStir}
                  disabled={stirState === 'stirring' || stirState === 'dropping'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 2rem',
                    background: (stirState === 'stirring' || stirState === 'dropping') ? 'var(--text-light)' : '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: (stirState === 'stirring' || stirState === 'dropping') ? 'default' : 'pointer',
                    boxShadow: (stirState === 'stirring' || stirState === 'dropping') ? 'none' : '0 4px 6px rgba(249, 115, 22, 0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  {stirState === 'stirring' ? 'Stirring...' : 'Stir Well'}
                </button>
                
                {stirState === 'resolved' && (
                  <div style={{
                    color: selectedSubstance.type === 'Soluble' ? '#16a34a' : '#ea580c',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    {selectedSubstance.type === 'Soluble' ? 'Fully Dissolved' : 'Did Not Dissolve'}
                  </div>
                )}
              </>
            )}
            {!selectedSubstance && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', alignSelf: 'center' }}>
                Select a material to add to the water.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Observation Console */}
        <div style={{ flex: '1 1 50%', minWidth: 0, maxWidth: '50%', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#431407', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontSize: '1.75rem' }}>
            <Camera size={28} color="#d97706" /> Observation Console
          </h4>
          
          <AnimatePresence mode="wait">
            {selectedSubstance && (stirState === 'resolved' || stirState === 'idle') ? (
              <motion.div
                key={selectedSubstance.id + stirState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fdfbf7', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#d97706', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material</div>
                  <div style={{ fontSize: '1.5rem', color: '#431407', fontWeight: 'bold' }}>{selectedSubstance.name}</div>
                </div>

                {stirState === 'idle' ? (
                  <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px dashed #d6d3d1' }}>
                    <div style={{ color: '#57534e', fontSize: '1.1rem' }}>Added to water. Click 'Stir Well' to observe what happens.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #d6d3d1', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ color: '#d97706', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Observation</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: selectedSubstance.type === 'Soluble' ? '#16a34a' : '#ea580c' }}>
                        {selectedSubstance.type === 'Soluble' ? 'Disappears in water' : 'Does not disappear'}
                      </div>
                      <div style={{ color: '#44403c', fontSize: '1.1rem', lineHeight: '1.5' }}>
                        {selectedSubstance.desc}
                      </div>
                    </div>

                    <div style={{ background: selectedSubstance.type === 'Soluble' ? '#f0fdf4' : '#fdfbf7', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${selectedSubstance.type === 'Soluble' ? '#bbf7d0' : '#e7e5e4'}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ color: selectedSubstance.type === 'Soluble' ? '#16a34a' : '#d97706', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Conclusion</div>
                      <div style={{ color: selectedSubstance.type === 'Soluble' ? '#14532d' : '#431407', fontSize: '1.25rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                        {selectedSubstance.conclusion}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : selectedSubstance && stirState === 'stirring' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fdfbf7', borderRadius: '12px', padding: '3rem', border: '1px solid #e7e5e4' }}>
                <StirringProgress />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#78716c', textAlign: 'center', border: '2px dashed #d6d3d1', borderRadius: '12px', padding: '2rem', background: '#fafaf9' }}>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '50%', border: '1px solid #e7e5e4' }}>
                  <Droplets size={40} color="#a8a29e" />
                </div>
                <span style={{ fontSize: '1.1rem' }}>Select a material and stir to observe its solubility.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer Progress */}
      <div style={{ background: '#fdfbf7', border: '1px solid #e7e5e4', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <div style={{ background: '#fefce8', padding: '8px', borderRadius: '50%' }}>
            <Target size={24} />
          </div>
          <span style={{ color: '#431407', fontSize: '1.15rem', fontWeight: 'bold' }}>Test all 5 materials to see if they are soluble or insoluble.</span>
        </div>
      </div>

    </div>
  );
}
