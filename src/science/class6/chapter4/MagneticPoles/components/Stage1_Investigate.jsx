import React, { useState, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Hand, RotateCcw, ArrowRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------
// 1. True Rectangular 3D Bar Magnet (Deep Matte Colors)
// ---------------------------------------------------------
function Magnet3D() {
  return (
    <group position={[0, 0.75, 0]}>
      {/* North Pole Half - Deep Oxblood Red */}
      <mesh position={[-3.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.0, 1.5, 2.2]} />
        <meshStandardMaterial 
          color="#5B0E14" 
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* North Letter on Top Face */}
      <Text 
        position={[-4.8, 0.76, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        fontSize={1.1} 
        color="#E2E8F0" 
        fontWeight="bold"
      >
        N
      </Text>

      {/* South Pole Half - Deep Midnight Blue */}
      <mesh position={[3.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.0, 1.5, 2.2]} />
        <meshStandardMaterial 
          color="#0C1E4A" 
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>

      {/* South Letter on Top Face */}
      <Text 
        position={[4.8, 0.76, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        fontSize={1.1} 
        color="#E2E8F0" 
        fontWeight="bold"
      >
        S
      </Text>

      {/* Center Dividing Seam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 1.52, 2.22]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------
// 2. High-Contrast Iron Filings System
// ---------------------------------------------------------
function FilingsSystem({ step, isSprinkling, isVibrating }) {
  const count = 14000;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const poleNx = -6.8;
  const poleSx = 6.8;
  const poleNy = 0.75;
  const poleSy = 0.75;

  // Particle positions for both Scattered (random) and Tapped (streamlines) states
  const particles = useMemo(() => {
    const data = [];
    const numLines = 75;

    for (let i = 0; i < count; i++) {
      const randX = (Math.random() - 0.5) * 36;
      const randZ = (Math.random() - 0.5) * 22;
      const randomEuler = new THREE.Euler(Math.PI / 2, (Math.random() - 0.5) * Math.PI, 0);

      let alignedX, alignedZ;
      const isPolarCluster = Math.random() < 0.38;

      if (isPolarCluster) {
        const isNorth = Math.random() < 0.5;
        const basePoleX = isNorth ? poleNx : poleSx;
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.pow(Math.random(), 2.2) * 3.6;
        alignedX = basePoleX + Math.cos(angle) * rad;
        alignedZ = Math.sin(angle) * rad;
      } else {
        const lineIndex = Math.floor(Math.random() * numLines);
        const t = Math.random();
        const lineRadius = 1.4 + (lineIndex / numLines) * 14.5;
        const theta = (t - 0.5) * Math.PI * 0.95;

        alignedX = Math.sin(theta) * (lineRadius + Math.sin(t * Math.PI) * 2.6);
        alignedZ = (Math.random() > 0.5 ? 1 : -1) * Math.cos(theta) * lineRadius * 0.78 + (Math.random() - 0.5) * 0.3;
      }

      data.push({
        originX: randX,
        originZ: randZ,
        targetX: alignedX,
        targetZ: alignedZ,
        x: randX,
        y: 12 + Math.random() * 5,
        z: randZ,
        q: new THREE.Quaternion().setFromEuler(randomEuler),
        targetQ: new THREE.Quaternion(),
        visible: false,
        delay: Math.random() * 1.2
      });
    }
    return data;
  }, [count]);

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.022, 0.022, 0.26, 4), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#050811',
    roughness: 0.5,
    metalness: 0.7
  }), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);

    particles.forEach((p, i) => {
      if (step === 'initial' && !isSprinkling) {
        p.visible = false;
        p.y = 12 + Math.random() * 5;
        p.x = p.originX;
        p.z = p.originZ;
        p.delay = Math.random() * 1.2;
      }

      if (isSprinkling) {
        p.delay -= dt;
        if (p.delay <= 0) {
          p.visible = true;
          if (p.y > 0.03) {
            p.y -= dt * 25;
          } else {
            p.y = 0.03;
          }
        }
      }

      if (step === 'tapped' || (isVibrating && step === 'tapped')) {
        p.x = THREE.MathUtils.lerp(p.x, p.targetX, dt * 5.5);
        p.z = THREE.MathUtils.lerp(p.z, p.targetZ, dt * 5.5);

        const dxN = p.x - poleNx;
        const dyN = p.y - poleNy;
        const dzN = p.z;
        const distN = Math.max(0.4, Math.hypot(dxN, dyN, dzN));

        const dxS = p.x - poleSx;
        const dyS = p.y - poleSy;
        const dzS = p.z;
        const distS = Math.max(0.4, Math.hypot(dxS, dyS, dzS));

        const Bx = (dxN / (distN ** 3)) - (dxS / (distS ** 3));
        const By = (dyN / (distN ** 3)) - (dyS / (distS ** 3));
        const Bz = (dzN / (distN ** 3)) - (dzS / (distS ** 3));
        const Bmag = Math.hypot(Bx, By, Bz);

        if (Bmag > 0.0001) {
          const dir = new THREE.Vector3(Bx / Bmag, By / Bmag, Bz / Bmag);
          p.targetQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          p.q.slerp(p.targetQ, dt * 8);

          const minDist = Math.min(distN, distS);
          if (minDist < 3.4) {
            const spikeHeight = (3.4 - minDist) * 0.65;
            p.y = THREE.MathUtils.lerp(p.y, 0.03 + spikeHeight * Math.abs(By / Bmag), dt * 6);
          } else {
            p.y = THREE.MathUtils.lerp(p.y, 0.03, dt * 6);
          }
        }
      }

      if (p.visible) {
        dummy.position.set(p.x, p.y, p.z);
        dummy.quaternion.copy(p.q);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(0, -500, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}

// ---------------------------------------------------------
// 3. Main Container
// ---------------------------------------------------------
export default function Stage1_Investigate({ onComplete }) {
  const [step, setStep] = useState('initial');
  const [tapCount, setTapCount] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [isSprinkling, setIsSprinkling] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  const handleScatter = () => {
    setIsSprinkling(true);
    setTimeout(() => {
      setIsSprinkling(false);
      setStep('scattered');
    }, 1800);
  };

  const handleTap = () => {
    if (tapCount >= 1) return;
    setIsVibrating(true);
    setTimeout(() => {
      setIsVibrating(false);
      setTapCount(1);
      setStep('tapped');
    }, 350);
  };

  const handleReset = () => {
    setStep('initial');
    setTapCount(0);
    setQuizAnswer(null);
    setIsSprinkling(false);
    setIsVibrating(false);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
    if (answer === 'ends') {
      setStep('complete');
    }
  };

  return (
    <div style={{ padding: '0.5rem', display: 'flex', gap: '1.25rem', height: '100%', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box', position: 'relative' }}>
      
      {/* 3D WebGL Canvas with Real Physics Lab Background Image */}
      <div style={{ flex: '1.8', display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
        <motion.div
          animate={isVibrating ? { x: [-5, 5, -3, 3, -1, 1, 0], y: [-3, 3, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
          style={{ 
            position: 'relative', 
            width: '100%', 
            flex: 1, 
            minHeight: '380px', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            border: '1.5px solid #A7F3D0', 
            boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)',
            backgroundImage: `radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.8) 100%), url('/SuspendedMagnet/wooden_stand_lab_bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 10, background: 'rgba(255,255,255,0.92)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', backdropFilter: 'blur(8px)', pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            🔬 Interactive 3D Lab | Drag to Rotate
          </div>

          <Canvas 
            shadows 
            gl={{ alpha: true, antialias: true }} 
            camera={{ position: [0, 16, 20], fov: 40 }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.8} />
              <directionalLight
                position={[10, 22, 12]}
                intensity={1.8}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#93C5FD" />
              <Environment preset="city" />

              <Magnet3D />
              <FilingsSystem step={step} isSprinkling={isSprinkling} isVibrating={isVibrating} />

              {/* Realistic White Lab Paper Sheet */}
              <mesh receiveShadow position={[0, -0.01, 0]}>
                <boxGeometry args={[36, 0.04, 21]} />
                <meshStandardMaterial color="#FAF9F6" roughness={0.95} metalness={0.0} />
              </mesh>

              {/* Soft Drop Shadow under Paper */}
              <ContactShadows position={[0, -0.08, 0]} opacity={0.65} scale={44} blur={2.2} far={4} color="#000000" />
              <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.15} minPolarAngle={0.15} minDistance={8} maxDistance={32} enablePan={false} />
            </Suspense>
          </Canvas>
        </motion.div>
      </div>

      {/* Control Panel */}
      <div style={{ flex: '0.7', background: '#FFFFFF', border: '1.5px solid #A7F3D0', borderRadius: '20px', padding: '1.25rem 1.5rem', boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', minWidth: 0 }}>
        
        {/* Buttons */}
        <div style={{ width: '100%', display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={handleScatter}
            disabled={step !== 'initial' || isSprinkling}
            style={{ flex: 1, padding: '0.8rem 0.4rem', fontSize: '0.85rem', fontWeight: 900, borderRadius: '12px', background: step === 'initial' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9', color: step === 'initial' ? '#FFFFFF' : '#94A3B8', border: 'none', cursor: step === 'initial' ? 'pointer' : 'not-allowed' }}
          >
            🧪 1. Sprinkle
          </button>
          
          <button
            onClick={handleTap}
            disabled={step !== 'scattered' || tapCount >= 1}
            style={{ flex: 1, padding: '0.8rem 0.4rem', fontSize: '0.85rem', fontWeight: 900, borderRadius: '12px', background: (step === 'scattered' && tapCount === 0) ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9', color: (step === 'scattered' && tapCount === 0) ? '#FFFFFF' : '#94A3B8', border: 'none', cursor: (step === 'scattered' && tapCount === 0) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Hand size={14} /> {tapCount === 0 ? '2. Tap Paper' : 'Tapped ✓'}
          </button>
          
          <button
            onClick={handleReset}
            disabled={step === 'initial'}
            style={{ padding: '0.8rem 0.6rem', fontSize: '0.85rem', fontWeight: 900, borderRadius: '12px', background: '#FFFFFF', color: '#1E293B', border: '1.5px solid #CBD5E1', cursor: step !== 'initial' ? 'pointer' : 'not-allowed' }}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Observation Quiz Card */}
        <div style={{ background: '#F0FDF4', border: '1.5px solid #A7F3D0', borderRadius: '16px', padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h4 style={{ color: '#064E3B', margin: 0, fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={18} color="#D97706" /> Observation Question
          </h4>
          <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 600 }}>
            Do the iron filings stick uniformly all over the magnet, or do they stick more at specific places?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuizAnswer('uniformly')}
              style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.88rem', fontWeight: 800, borderRadius: '12px', cursor: 'pointer', background: quizAnswer === 'uniformly' ? '#FEE2E2' : '#FFFFFF', borderColor: quizAnswer === 'uniformly' ? '#EF4444' : '#CBD5E1', borderWidth: '1.5px', borderStyle: 'solid', color: quizAnswer === 'uniformly' ? '#991B1B' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>A) Filings stick uniformly all over</span>
              {quizAnswer === 'uniformly' && <XCircle size={16} color="#EF4444" />}
            </button>

            <button
              onClick={() => handleQuizAnswer('ends')}
              style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.88rem', fontWeight: 800, borderRadius: '12px', cursor: 'pointer', background: (quizAnswer === 'ends' || step === 'complete') ? '#DCFCE7' : '#FFFFFF', borderColor: (quizAnswer === 'ends' || step === 'complete') ? '#16A34A' : '#CBD5E1', borderWidth: '1.5px', borderStyle: 'solid', color: (quizAnswer === 'ends' || step === 'complete') ? '#065F46' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>B) Most filings cluster at the two ends (Poles)</span>
              {(quizAnswer === 'ends' || step === 'complete') && <CheckCircle size={16} color="#16A34A" />}
            </button>
          </div>

          {(quizAnswer === 'ends' || step === 'complete') && (
            <button
              onClick={onComplete}
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem', fontSize: '0.92rem', fontWeight: 900, borderRadius: '20px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#FFFFFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              Proceed to Stage 2 <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}