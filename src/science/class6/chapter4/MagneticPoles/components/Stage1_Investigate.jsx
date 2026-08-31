import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Hand, RotateCcw, ArrowRight, BookOpen, Play, Pause } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, ContactShadows, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import '../MagneticPoles.css';

// ---------------------------------------------------------
// Realistic Parchment Paper Box Enclosure
// ---------------------------------------------------------
function PaperBoxEnclosure({ isVibrating, isPaused }) {
  const paperTexture = useTexture('/MagneticPoles/paper_texture.jpg');
  const paperGroupRef = useRef();

  useFrame((state) => {
    if (!paperGroupRef.current || isPaused) return;
    if (isVibrating) {
      paperGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 90) * 0.035;
      paperGroupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 70) * 0.003;
    } else {
      paperGroupRef.current.position.y = 0;
      paperGroupRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={paperGroupRef}>
      {/* 1. Bottom Paper Base */}
      <mesh receiveShadow position={[0, -0.01, 0]}>
        <boxGeometry args={[26, 0.04, 16]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 2. Back Paper Wall */}
      <mesh receiveShadow position={[0, 2.4, -8.0]}>
        <boxGeometry args={[26, 4.8, 0.04]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 3. Left Paper Wall */}
      <mesh receiveShadow position={[-13.0, 2.4, 0]}>
        <boxGeometry args={[0.04, 4.8, 16]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 4. Right Paper Wall */}
      <mesh receiveShadow position={[13.0, 2.4, 0]}>
        <boxGeometry args={[0.04, 4.8, 16]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------
// Rotatable System for Magnet + Iron Filings
// ---------------------------------------------------------
function RotatableMagnetGroup({ children }) {
  const groupRef = useRef();
  const targetRotationY = useRef(0);
  const currentRotationY = useRef(0);
  const isPointerDown = useRef(false);
  const startX = useRef(0);

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!isPointerDown.current) return;
      const deltaX = e.clientX - startX.current;
      startX.current = e.clientX;
      targetRotationY.current += deltaX * 0.012;
    };

    const onPointerUp = () => {
      isPointerDown.current = false;
      document.body.style.cursor = 'auto';
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.1);
    currentRotationY.current = THREE.MathUtils.lerp(currentRotationY.current, targetRotationY.current, dt * 12);
    groupRef.current.rotation.y = currentRotationY.current;
  });

  return (
    <group 
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        isPointerDown.current = true;
        startX.current = e.clientX;
        document.body.style.cursor = 'grabbing';
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        if (!isPointerDown.current) {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {/* Invisible hit cylinder around magnet and filings to easily catch drag gestures */}
      <mesh visible={false} position={[0, 2.2, 0]}>
        <cylinderGeometry args={[11, 11, 4.5, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {children}
    </group>
  );
}

// ---------------------------------------------------------
// 1. True Rectangular 3D Bar Magnet (Proportionate: 12.0 x 1.3 x 1.9)
// ---------------------------------------------------------

function Magnet3D() {
  return (
    <group position={[0, 2.5, 0]}>
      {/* North Pole Half - Pure Rich Red */}
      <mesh position={[-3.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 1.3, 1.9]} />
        <meshStandardMaterial 
          color="#C51E28" 
          roughness={0.55} 
          metalness={0.12} 
        />
      </mesh>
      
      {/* North Letter - White */}
      <Text 
        position={[-4.2, 0.66, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        fontSize={0.95} 
        color="#FFFFFF" 
        fontWeight="bold"
      >
        N
      </Text>

      {/* South Pole Half - Bold Ultramarine Blue */}
      <mesh position={[3.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 1.3, 1.9]} />
        <meshStandardMaterial 
          color="#1848B8" 
          roughness={0.55} 
          metalness={0.12} 
        />
      </mesh>

      {/* South Letter - White */}
      <Text 
        position={[4.2, 0.66, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        fontSize={0.95} 
        color="#FFFFFF" 
        fontWeight="bold"
      >
        S
      </Text>

      {/* Center Dividing Seam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 1.31, 1.91]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------
// Smooth Intro Animation Group (Bottom-Left to Center Growth)
// ---------------------------------------------------------
function AnimatedLabGroup({ children, zoomScale = 1.0 }) {
  const groupRef = useRef();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.1);

    // Initial: Positioned on the left tabletop parallel to the compass & ruler on the right
    const targetX = hasStarted ? 0 : -5.8;
    const targetY = hasStarted ? -0.4 : -3.5;
    const targetZ = hasStarted ? 0 : 0.5;
    const targetScale = (hasStarted ? 0.50 : 0.08) * zoomScale;

    const speed = 3.6;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, dt * speed);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, dt * speed);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, dt * speed);

    const currentScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, dt * speed);
    groupRef.current.scale.set(nextScale, nextScale, nextScale);
  });

  return (
    <group ref={groupRef} position={[-5.8, -3.5, 0.5]} scale={[0.08, 0.08, 0.08]}>
      {children}
    </group>
  );
}

// ---------------------------------------------------------
// 2. High-Contrast 3D Iron Filings System with 3D Lifting
// ---------------------------------------------------------

function FilingsSystem({ step, isSprinkling, isVibrating, cycleKey, isPaused }) {
  const count = 14000;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lastCycleRef = useRef(-1);

  // Magnet pole centers matching the floating 12x1.3x1.9 bar magnet
  const poles = useMemo(() => ({ nX: -4.8, nZ: 0.0, sX: 4.8, sZ: 0.0, span: 4.0 }), []);
  const poleY = 2.5;

  const particles = useMemo(() => {
    const data = [];
    const numLines = 85;

    for (let i = 0; i < count; i++) {
      // Confined strictly to paper bounds (Paper is 26 x 16)
      const randX = (Math.random() - 0.5) * 23;
      const randZ = (Math.random() - 0.5) * 13.5;
      const randomEuler = new THREE.Euler(Math.PI / 2, (Math.random() - 0.5) * Math.PI, 0);
      const initialQ = new THREE.Quaternion().setFromEuler(randomEuler);

      let targetX, targetZ;
      const clusterRoll = Math.random();

      if (clusterRoll < 0.42) {
        // High density clustering directly at poles
        const isNorth = Math.random() < 0.5;
        const pX = isNorth ? poles.nX : poles.sX;
        const pZ = isNorth ? poles.nZ : poles.sZ;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 2.0) * poles.span + 0.2;

        targetX = pX + Math.cos(angle) * r;
        targetZ = pZ + Math.sin(angle) * r;
      } else {
        // Natural magnetic stream loops
        const lineIdx = Math.floor(Math.random() * numLines);
        const t = Math.random();
        const loopR = 1.6 + (lineIdx / numLines) * 8.0;
        const theta = (t - 0.5) * Math.PI * 0.95;

        const side = Math.random() > 0.5 ? 1 : -1;
        targetX = Math.sin(theta) * (loopR + Math.sin(t * Math.PI) * 1.6);
        targetZ = side * Math.cos(theta) * loopR * 0.75 + (Math.random() - 0.5) * 0.25;
      }

      // Constrain tightly to stay neatly on top of the paper
      targetX = Math.max(-11.8, Math.min(11.8, targetX));
      targetZ = Math.max(-6.8, Math.min(6.8, targetZ));

      data.push({
        originX: randX,
        originZ: randZ,
        targetX,
        targetZ,
        scale: 0.65 + Math.random() * 0.45,
        x: randX,
        y: 8 + Math.random() * 4.5,
        z: randZ,
        floatY: 0.04,
        initialQ,
        q: new THREE.Quaternion().copy(initialQ),
        targetQ: new THREE.Quaternion(),
        visible: false,
        delay: Math.random() * 0.75,
      });
    }
    return data;
  }, [count, poles]);

  // Cylinder needle matching coarse metallic filings
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.034, 0.034, 0.18, 4), []);

  // Deep matte charcoal-black material matching real iron shavings, bold and dark in front & top views
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0A0C10',
        roughness: 0.92,
        metalness: 0.05,
        envMapIntensity: 0.1,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    const dt = Math.min(delta, 0.1);

    if (lastCycleRef.current !== cycleKey) {
      lastCycleRef.current = cycleKey;
      particles.forEach((p) => {
        p.visible = false;
        p.x = p.originX;
        p.z = p.originZ;
        p.y = 8 + Math.random() * 4.5;
        p.q.copy(p.initialQ);
        p.delay = Math.random() * 0.75;
      });
    }

    particles.forEach((p, i) => {
      // Step 1: Sprinkling down - suspended floating in 3D air onto the paper
      if (isSprinkling || step === 'initial') {
        p.delay -= dt;
        if (p.delay <= 0) {
          p.visible = true;
          if (p.y > 0.04) {
            p.y -= dt * 18;
          } else {
            p.y = 0.04;
          }
          p.x = p.originX;
          p.z = p.originZ;
          p.q.copy(p.initialQ);
        }
      }

      // Step 2: Scattered flat across paper
      if (step === 'scattered') {
        p.visible = true;
        p.y = 0.04;
        p.x = p.originX;
        p.z = p.originZ;
        p.q.copy(p.initialQ);
      }

      // Step 3: Tapped - align to magnetic field lines and cluster at poles
      if (step === 'tapped' || step === 'complete') {
        p.visible = true;
        p.x = THREE.MathUtils.lerp(p.x, p.targetX, dt * 5.2);
        p.z = THREE.MathUtils.lerp(p.z, p.targetZ, dt * 5.2);

        const dxN = p.x - poles.nX;
        const dyN = p.y - poleY;
        const dzN = p.z - poles.nZ;
        const distN = Math.max(0.35, Math.hypot(dxN, dyN, dzN));

        const dxS = p.x - poles.sX;
        const dyS = p.y - poleY;
        const dzS = p.z - poles.sZ;
        const distS = Math.max(0.35, Math.hypot(dxS, dyS, dzS));

        // Dipole field vector components
        const Bx = dxN / Math.pow(distN, 3) - dxS / Math.pow(distS, 3);
        const By = dyN / Math.pow(distN, 3) - dyS / Math.pow(distS, 3);
        const Bz = dzN / Math.pow(distN, 3) - dzS / Math.pow(distS, 3);
        const Bmag = Math.hypot(Bx, By, Bz);

        if (Bmag > 0.0001) {
          const dir = new THREE.Vector3(Bx / Bmag, By / Bmag, Bz / Bmag);
          p.targetQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          p.q.slerp(p.targetQ, dt * 7.5);

          // 3D vertical magnetic field lifting towards the floating poles
          const minDist = Math.min(distN, distS);
          if (minDist < 3.0) {
            const spikeHeight = (3.0 - minDist) * 0.75;
            p.y = THREE.MathUtils.lerp(p.y, 0.04 + spikeHeight * Math.abs(By / Bmag), dt * 6);
          } else {
            p.y = THREE.MathUtils.lerp(p.y, 0.04, dt * 6);
          }
        }
      }

      if (p.visible) {
        dummy.position.set(p.x, p.y, p.z);
        dummy.quaternion.copy(p.q);
        dummy.scale.set(p.scale, p.scale, p.scale);
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
  const [cycleKey, setCycleKey] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSprinkling, setIsSprinkling] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;

  const phaseRef = useRef('sprinkle'); // 'sprinkle', 'scattered', 'tapping', 'observing'
  const phaseStartTimeRef = useRef(Date.now());
  const remainingMsRef = useRef(1800);
  const timeoutRef = useRef(null);

  const clearLoopTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const advanceToNextPhase = (completedPhase) => {
    if (isPausedRef.current) return;
    if (completedPhase === 'sprinkle') {
      executePhase('scattered', 800);
    } else if (completedPhase === 'scattered') {
      executePhase('tapping', 750);
    } else if (completedPhase === 'tapping') {
      executePhase('observing', 3500);
    } else if (completedPhase === 'observing') {
      executePhase('sprinkle', 1800);
    }
  };

  const executePhase = (phase, duration) => {
    clearLoopTimers();
    phaseRef.current = phase;
    remainingMsRef.current = duration;
    phaseStartTimeRef.current = Date.now();

    if (phase === 'sprinkle') {
      setCycleKey((k) => k + 1);
      setStep('initial');
      setIsSprinkling(true);
      setIsVibrating(false);
    } else if (phase === 'scattered') {
      setStep('scattered');
      setIsSprinkling(false);
      setIsVibrating(false);
    } else if (phase === 'tapping') {
      setStep('tapped');
      setIsSprinkling(false);
      setIsVibrating(true);
      setTapCount((prev) => Math.max(prev, 1));
    } else if (phase === 'observing') {
      setStep('tapped');
      setIsSprinkling(false);
      setIsVibrating(false);
    }

    timeoutRef.current = setTimeout(() => {
      advanceToNextPhase(phase);
    }, duration);
  };

  // Start continuous loop on initial mount
  useEffect(() => {
    executePhase('sprinkle', 1800);
    return () => clearLoopTimers();
  }, []);

  const handleTogglePause = () => {
    if (!isPaused) {
      // Pausing: calculate remaining time for current phase
      clearLoopTimers();
      const elapsed = Date.now() - phaseStartTimeRef.current;
      remainingMsRef.current = Math.max(50, remainingMsRef.current - elapsed);
      setIsPaused(true);
      isPausedRef.current = true;
    } else {
      // Resuming: continue remaining time of current phase
      setIsPaused(false);
      isPausedRef.current = false;
      phaseStartTimeRef.current = Date.now();
      const currentPhase = phaseRef.current;
      const rem = remainingMsRef.current;

      timeoutRef.current = setTimeout(() => {
        advanceToNextPhase(currentPhase);
      }, rem);
    }
  };

  const handleReset = () => {
    clearLoopTimers();
    setIsPaused(false);
    isPausedRef.current = false;
    setTapCount(0);
    setQuizAnswer(null);
    setShowFeedbackModal(false);
    executePhase('sprinkle', 1800);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
    if (answer === 'ends') {
      setStep('complete');
      setShowFeedbackModal(true);
    }
  };

  return (
    <div style={{ padding: '0.5rem', display: 'flex', gap: '1.25rem', height: '100%', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box', position: 'relative' }}>
      
      {/* Centered Feedback Pop-up Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: '#FFFFFF',
                border: '2px solid #6EE7B7',
                borderRadius: '24px',
                padding: '2rem 2.2rem',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(6, 78, 59, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.25rem',
                position: 'relative'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(217, 119, 6, 0.25)'
              }}>
                <CheckCircle size={36} color="#D97706" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064E3B' }}>
                  Observation Verified!
                </h3>
                <p style={{ margin: 0, color: '#065F46', fontSize: '1.02rem', lineHeight: 1.6, fontWeight: 700 }}>
                  🎉 Correct! Magnetic attraction is strongest at the ends, known as the Magnetic Poles
                </p>
              </div>

              <button
                onClick={() => setShowFeedbackModal(false)}
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.85rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
                }}
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* 3D WebGL Canvas with Real Physics Lab Background Image */}
      <div style={{ flex: '1.8', display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
        <div
          style={{ 
            position: 'relative', 
            width: '100%', 
            flex: 1, 
            minHeight: '380px', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            border: '1.5px solid #A7F3D0', 
            boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)',
            backgroundImage: `url('/MagneticPoles/bg_image.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <Canvas 
            shadows 
            gl={{ alpha: true, antialias: true }} 
            camera={{ position: [0, 5.5, 25], fov: 42 }}
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

              <AnimatedLabGroup zoomScale={1.0}>
                <RotatableMagnetGroup>
                  <Magnet3D />
                  <FilingsSystem step={step} isSprinkling={isSprinkling} isVibrating={isVibrating} cycleKey={cycleKey} isPaused={isPaused} />
                </RotatableMagnetGroup>
                <PaperBoxEnclosure isVibrating={isVibrating} isPaused={isPaused} />

                {/* Soft Drop Shadow under Paper */}
                <ContactShadows position={[0, -0.08, 0]} opacity={0.65} scale={32} blur={2.2} far={4} color="#000000" />
              </AnimatedLabGroup>
              <OrbitControls
                makeDefault
                target={[0, 0.8, 0]}
                minAzimuthAngle={0}
                maxAzimuthAngle={0}
                maxPolarAngle={Math.PI / 2.05}
                minPolarAngle={0.1}
                minDistance={8}
                maxDistance={45}
                enablePan={false}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Control Panel (Unified Warm Orange Theme) */}
      <div style={{ 
        flex: '1.15', 
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
        border: '1.5px solid #FDE68A', 
        borderRadius: '24px', 
        padding: '1.5rem 1.6rem', 
        boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1.1rem', 
        minWidth: 0,
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <BookOpen size={28} color="#059669" />
              <h3 style={{ margin: 0, fontSize: '1.52rem', color: '#064E3B', fontWeight: 900 }}>
                Stage 1: Investigation
              </h3>
            </div>
            <span style={{
              background: '#DCFCE7',
              color: '#15803D',
              fontWeight: 900,
              fontSize: '0.92rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '12px',
              border: '1.5px solid #86EFAC'
            }}>
              Step {step === 'tapped' || step === 'complete' ? 3 : (step === 'scattered' || isVibrating) ? 2 : 1} of 3
            </span>
          </div>

          {/* All 3 Steps Visible From Initial Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              {
                stepNum: 1,
                title: '1. Sprinkle Iron Filings',
                desc: 'Spread iron filings evenly across the paper surface around the magnet.'
              },
              {
                stepNum: 2,
                title: '2. Tap Paper Sheet',
                desc: 'Gently tap the sheet to allow iron filings to align along magnetic field lines.'
              },
              {
                stepNum: 3,
                title: '3. Observe Magnetic Poles',
                desc: 'Observe where filings cluster the most and answer the observation question.'
              }
            ].map((s) => {
              const currentStepNum = (step === 'tapped' || step === 'complete') ? 3 : (step === 'scattered' || isVibrating) ? 2 : 1;
              const isCurrent = currentStepNum === s.stepNum;
              const isPast = currentStepNum > s.stepNum || (s.stepNum === 3 && step === 'complete');

              return (
                <div
                  key={s.stepNum}
                  style={{
                    padding: '0.35rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: isCurrent ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : isPast ? '#059669' : '#64748B',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {s.stepNum}
                      </span>
                      <span style={{ 
                        fontWeight: 800, 
                        fontSize: '1.18rem', 
                        color: isCurrent ? '#064E3B' : isPast ? '#047857' : '#334155' 
                      }}>
                        {s.title}
                      </span>
                    </div>
                    {isPast && <CheckCircle size={22} color="#059669" />}
                  </div>
                  <p style={{ margin: '0.2rem 0 0 2.5rem', fontSize: '1.02rem', color: '#065F46', lineHeight: 1.55, fontWeight: 600 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons: Pause / Resume & Reset */}
          <div style={{ width: '100%', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
            <button
              onClick={handleTogglePause}
              className="gold-glow-btn"
              style={{ 
                flex: 2, 
                padding: '1rem 1rem', 
                fontSize: '1.1rem', 
                fontWeight: 900, 
                borderRadius: '16px', 
                color: '#FFFFFF', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              {!isPaused ? (
                <>
                  <Pause size={20} fill="#FFFFFF" color="#FFFFFF" /> Pause Investigation
                </>
              ) : (
                <>
                  <Play size={20} fill="#FFFFFF" color="#FFFFFF" /> Resume Investigation
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              style={{ 
                flex: 1, 
                padding: '1rem 0.6rem', 
                fontSize: '1.02rem', 
                fontWeight: 800, 
                borderRadius: '16px', 
                background: '#FFFFFF', 
                color: '#92400E', 
                border: '1.5px solid #FDE68A', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        {/* Observation Quiz */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.85rem',
          paddingTop: '0.35rem'
        }}>
          <h4 style={{ color: '#064E3B', margin: 0, fontSize: '1.28rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={24} color="#059669" /> Observation Question
          </h4>
          <p style={{ margin: 0, color: '#065F46', fontSize: '1.12rem', lineHeight: 1.6, fontWeight: 600 }}>
            Do the iron filings stick uniformly all over the magnet, or do they stick more at specific places?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => handleQuizAnswer('uniformly')}
              style={{ 
                padding: '0.95rem 1.2rem', 
                textAlign: 'left', 
                fontSize: '1.05rem', 
                fontWeight: 700, 
                borderRadius: '14px', 
                cursor: 'pointer', 
                background: quizAnswer === 'uniformly' ? '#FEE2E2' : '#FFFFFF', 
                borderColor: quizAnswer === 'uniformly' ? '#EF4444' : '#FDE68A', 
                borderWidth: '1.5px', 
                borderStyle: 'solid', 
                color: quizAnswer === 'uniformly' ? '#991B1B' : '#065F46', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>A) Filings stick uniformly all over</span>
              {quizAnswer === 'uniformly' && <XCircle size={22} color="#EF4444" />}
            </button>

            <button
              onClick={() => handleQuizAnswer('ends')}
              style={{ 
                padding: '0.95rem 1.2rem', 
                textAlign: 'left', 
                fontSize: '1.05rem', 
                fontWeight: 700, 
                borderRadius: '14px', 
                cursor: 'pointer', 
                background: (quizAnswer === 'ends' || step === 'complete') ? '#DCFCE7' : '#FFFFFF', 
                borderColor: (quizAnswer === 'ends' || step === 'complete') ? '#10B981' : '#FDE68A', 
                borderWidth: '1.5px', 
                borderStyle: 'solid', 
                color: (quizAnswer === 'ends' || step === 'complete') ? '#064E3B' : '#065F46', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>B) Most filings cluster at the two ends (Poles)</span>
              {(quizAnswer === 'ends' || step === 'complete') && <CheckCircle size={22} color="#10B981" />}
            </button>
          </div>

          {/* Always-visible Proceed Button */}
          {(() => {
            const isReadyToProceed = tapCount >= 1 && (quizAnswer === 'ends' || step === 'complete');
            return (
              <button
                onClick={onComplete}
                disabled={!isReadyToProceed}
                className={isReadyToProceed ? 'gold-glow-btn' : ''}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  fontSize: '1.1rem', 
                  fontWeight: 900, 
                  borderRadius: '16px', 
                  background: isReadyToProceed 
                    ? undefined 
                    : '#F1F5F9', 
                  color: isReadyToProceed 
                    ? '#FFFFFF' 
                    : '#94A3B8', 
                  border: isReadyToProceed 
                    ? 'none' 
                    : '1.5px solid #CBD5E1', 
                  cursor: isReadyToProceed 
                    ? 'pointer' 
                    : 'not-allowed', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.6rem',
                  transition: 'all 0.25s ease'
                }}
              >
                Proceed to Stage 2 <ArrowRight size={20} color={isReadyToProceed ? '#FFFFFF' : '#94A3B8'} />
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}