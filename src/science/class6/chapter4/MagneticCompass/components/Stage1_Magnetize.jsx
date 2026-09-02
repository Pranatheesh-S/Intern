import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowRight, Beaker, Play, Magnet } from 'lucide-react';
import * as THREE from 'three';

// ---------------------------------------------------------
// Paper Box Enclosure with Parchment Texture & Side Walls
// ---------------------------------------------------------
function PaperBoxEnclosure() {
  const paperTexture = useTexture('/MagneticPoles/paper_texture.jpg');

  return (
    <>
      {/* 1. Bottom Paper Base */}
      <mesh receiveShadow position={[0, -0.01, 0]}>
        <boxGeometry args={[20, 0.04, 13]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 2. Back Paper Wall */}
      <mesh receiveShadow position={[0, 2.0, -6.5]}>
        <boxGeometry args={[20, 4.0, 0.04]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 3. Left Paper Wall */}
      <mesh receiveShadow position={[-10.0, 2.0, 0]}>
        <boxGeometry args={[0.04, 4.0, 13]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 4. Right Paper Wall */}
      <mesh receiveShadow position={[10.0, 2.0, 0]}>
        <boxGeometry args={[0.04, 4.0, 13]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>
    </>
  );
}

// ---------------------------------------------------------
// Rotatable Activity Group (Allows left-right rotation of the activity inside the tray)
// ---------------------------------------------------------
function RotatableActivityGroup({ children }) {
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
      {/* Invisible hit cylinder around needle and magnet to catch drag gestures */}
      <mesh visible={false} position={[0, 2.0, 0]}>
        <cylinderGeometry args={[10, 10, 5, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {children}
    </group>
  );
}

// -------------------------------------------------------------------
// 1. 3D Bar Magnet Component (Standard Red/Blue Pole Bar Magnet)
// -------------------------------------------------------------------
function BarMagnet3D({ strokeProgress, isAutoStroking }) {
  const magnetRef = useRef();

  useFrame(() => {
    if (!magnetRef.current) return;
    if (isAutoStroking) {
      const t = strokeProgress % 1;
      if (t < 0.75) {
        // Stroking forward across the floating needle from left to right
        const p = t / 0.75;
        magnetRef.current.position.x = -3.4 + p * 6.8;
        magnetRef.current.position.y = 2.5;
        magnetRef.current.rotation.z = -0.15;
      } else {
        // Lifting high into air and looping back
        const p = (t - 0.75) / 0.25;
        magnetRef.current.position.x = 3.4 - p * 6.8;
        magnetRef.current.position.y = 2.5 + Math.sin(p * Math.PI) * 1.8;
        magnetRef.current.rotation.z = 0.12;
      }
    }
  });

  return (
    <group ref={magnetRef} position={[-3.4, 2.5, 0]} scale={[0.38, 0.38, 0.38]}>
      {/* North Pole Half - Signal Carmine Red */}
      <mesh position={[-2.6, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 1.3, 1.8]} />
        <meshStandardMaterial color="#DC2626" roughness={0.45} metalness={0.15} />
      </mesh>
      <Text
        position={[-3.6, 0.69, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.0}
        color="#FFFFFF"
        fontWeight="bold"
      >
        N
      </Text>

      {/* South Pole Half - Cobalt Blue */}
      <mesh position={[2.6, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 1.3, 1.8]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.45} metalness={0.15} />
      </mesh>
      <Text
        position={[3.6, 0.69, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.0}
        color="#FFFFFF"
        fontWeight="bold"
      >
        S
      </Text>

      {/* Center Dividing Seam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 1.32, 1.82]} />
        <meshStandardMaterial color="#0F172A" roughness={0.7} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------------
// 2. 3D Steel Sewing Needle Component (Steady in Air, Bold & Strong)
// -------------------------------------------------------------------
function SewingNeedle3D({ isMagnetized }) {
  const glowRef = useRef();

  useFrame((state) => {
    if (glowRef.current && isMagnetized) {
      glowRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  return (
    <group position={[0, 1.9, 0]} scale={[0.78, 0.78, 0.78]}>
      {/* Main Bold Polished Steel Body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 8.5, 32]} />
        <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.06} />
      </mesh>

      {/* Sharp Tapered Point (Left End / North Pole) */}
      <mesh position={[-4.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.18, 0.95, 32]} />
        <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.06} />
      </mesh>

      {/* Eye Head (Right End / South Pole) */}
      <mesh position={[4.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.65, 32]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.98} roughness={0.08} />
      </mesh>

      {/* Eyelet Groove Hole */}
      <mesh position={[4.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.035, 16, 24]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Magnetization Field Aura & Glow Rings */}
      {isMagnetized && (
        <>
          <pointLight ref={glowRef} position={[0, 0.5, 0]} color="#38BDF8" distance={7} intensity={1.5} />
          {/* North Red Ring */}
          <mesh position={[-4.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.25, 0.45, 24]} />
            <meshBasicMaterial color="#EF4444" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          {/* South Blue Ring */}
          <mesh position={[4.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.25, 0.45, 24]} />
            <meshBasicMaterial color="#3B82F6" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
    </group>
  );
}

// -------------------------------------------------------------------
// 3. 3D Iron Filings Particle System (True Field Dipole & Pole Spikes)
// -------------------------------------------------------------------
function NeedleFilings3D({ isTesting, isSprinkling, isAttracted }) {
  const count = 4800;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Needle Pole Coordinates matching SewingNeedle3D
  const poles = useMemo(
    () => ({
      nX: -3.7,
      sX: 3.7,
      poleY: 1.9,
      poleZ: 0,
      span: 2.2,
    }),
    []
  );

  const particles = useMemo(() => {
    const data = [];
    const numLines = 55;

    for (let i = 0; i < count; i++) {
      // Confined strictly to paper dimensions (11 x 7)
      const randX = (Math.random() - 0.5) * 10.0;
      const randZ = (Math.random() - 0.5) * 6.2;
      const randomEuler = new THREE.Euler(Math.PI / 2, (Math.random() - 0.5) * Math.PI, 0);

      let targetX, targetZ;
      const clusterRoll = Math.random();

      if (clusterRoll < 0.45) {
        // 1. High density clustering at needle poles
        const isNorth = Math.random() < 0.5;
        const pX = isNorth ? poles.nX : poles.sX;
        const pZ = poles.poleZ;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 2.0) * poles.span + 0.15;

        targetX = pX + Math.cos(angle) * r;
        targetZ = pZ + Math.sin(angle) * (r * 0.85);
      } else {
        // 2. Natural magnetic stream loops
        const lineIdx = Math.floor(Math.random() * numLines);
        const t = Math.random();
        const loopR = 1.2 + (lineIdx / numLines) * 4.6;
        const theta = (t - 0.5) * Math.PI * 0.95;

        const side = Math.random() > 0.5 ? 1 : -1;
        targetX = Math.sin(theta) * (loopR + Math.sin(t * Math.PI) * 1.2);
        targetZ = side * Math.cos(theta) * loopR * 0.72 + (Math.random() - 0.5) * 0.18;
      }

      // Constrain within paper boundary
      targetX = Math.max(-5.2, Math.min(5.2, targetX));
      targetZ = Math.max(-3.2, Math.min(3.2, targetZ));

      data.push({
        originX: randX,
        originZ: randZ,
        targetX,
        targetZ,
        scale: 0.65 + Math.random() * 0.45,
        x: randX,
        y: 11 + Math.random() * 5,
        z: randZ,
        floatY: 0.03 + Math.random() * 2.8,
        q: new THREE.Quaternion().setFromEuler(randomEuler),
        targetQ: new THREE.Quaternion(),
        visible: false,
        delay: Math.random() * 0.6,
      });
    }
    return data;
  }, [count, poles]);

  // Cylinder needle matching coarse metallic shavings
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.024, 0.024, 0.16, 4), []);

  // Charcoal gunmetal material
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#27292D',
        roughness: 0.78,
        metalness: 0.88,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);

    particles.forEach((p, i) => {
      if (!isTesting) {
        p.visible = false;
        p.y = 11 + Math.random() * 5;
        p.x = p.originX;
        p.z = p.originZ;
        p.delay = Math.random() * 0.6;
      } else {
        // Step 1: Sprinkling down
        p.delay -= dt;
        if (p.delay <= 0) {
          p.visible = true;
          if (p.y > p.floatY && isSprinkling) {
            p.y -= dt * 20;
          }
        }

        // Step 2: Attract and form magnetic field lines and vertical pole spikes
        if (isAttracted) {
          p.x = THREE.MathUtils.lerp(p.x, p.targetX, dt * 5.5);
          p.z = THREE.MathUtils.lerp(p.z, p.targetZ, dt * 5.5);

          const dxN = p.x - poles.nX;
          const dyN = p.y - poles.poleY;
          const dzN = p.z - poles.poleZ;
          const distN = Math.max(0.3, Math.hypot(dxN, dyN, dzN));

          const dxS = p.x - poles.sX;
          const dyS = p.y - poles.poleY;
          const dzS = p.z - poles.poleZ;
          const distS = Math.max(0.3, Math.hypot(dxS, dyS, dzS));

          // Dipole field vector components
          const Bx = dxN / Math.pow(distN, 3) - dxS / Math.pow(distS, 3);
          const By = dyN / Math.pow(distN, 3) - dyS / Math.pow(distS, 3);
          const Bz = dzN / Math.pow(distN, 3) - dzS / Math.pow(distS, 3);
          const Bmag = Math.hypot(Bx, By, Bz);

          if (Bmag > 0.0001) {
            const dir = new THREE.Vector3(Bx / Bmag, By / Bmag, Bz / Bmag);
            p.targetQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            p.q.slerp(p.targetQ, dt * 7.5);

            // 3D vertical lifting towards the poles
            const minDist = Math.min(distN, distS);
            if (minDist < 2.4) {
              const spikeHeight = (2.4 - minDist) * 0.8;
              p.y = THREE.MathUtils.lerp(p.y, 0.03 + spikeHeight * Math.abs(By / Bmag), dt * 6.0);
            } else {
              p.y = THREE.MathUtils.lerp(p.y, 0.03, dt * 6.0);
            }
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

// -------------------------------------------------------------------
// 4. Main Stage1 Component
// -------------------------------------------------------------------
export default function Stage1_Magnetize({ onComplete }) {
  const [strokeCount, setStrokeCount] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [isSprinkling, setIsSprinkling] = useState(false);
  const [isAttracted, setIsAttracted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [isAutoStroking, setIsAutoStroking] = useState(false);
  const [strokeAnimProgress, setStrokeAnimProgress] = useState(0);

  const maxStrokes = 5;
  const isMagnetized = strokeCount >= maxStrokes;

  useEffect(() => {
    let animFrame;
    let startTime;
    const duration = 1400;

    if (isAutoStroking && strokeCount < maxStrokes) {
      const animateStroke = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = elapsed / duration;

        setStrokeAnimProgress(progress);

        if (progress >= 1) {
          setStrokeCount((prev) => {
            const next = prev + 1;
            if (next >= maxStrokes) {
              setIsAutoStroking(false);
            }
            return next;
          });
          startTime = timestamp;
        }

        if (isAutoStroking && strokeCount < maxStrokes) {
          animFrame = requestAnimationFrame(animateStroke);
        }
      };

      animFrame = requestAnimationFrame(animateStroke);
    }

    return () => cancelAnimationFrame(animFrame);
  }, [isAutoStroking, strokeCount]);

  const handleTest = () => {
    setIsTesting(true);
    setIsSprinkling(true);
    setIsAttracted(false);
    setTestComplete(false);

    // After 0.5s, filings get drawn into the magnetic field and cluster at the needle poles
    setTimeout(() => {
      setIsSprinkling(false);
      setIsAttracted(true);
    }, 500);

    // After 1.3s, complete test
    setTimeout(() => {
      setTestComplete(true);
    }, 1300);
  };

  const handleReset = () => {
    setStrokeCount(0);
    setIsTesting(false);
    setIsSprinkling(false);
    setIsAttracted(false);
    setTestComplete(false);
    setIsAutoStroking(false);
    setStrokeAnimProgress(0);
  };

  return (
    <div
      style={{
        padding: '0.5rem 1rem',
        display: 'flex',
        gap: '1.25rem',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      {/* Left Side: 3D Interactive Lab Area */}
      <div
        style={{
          flex: '1.75',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            flex: 1,
            minHeight: '380px',
            background: '#F0FDF4',
            border: '1.5px solid #A7F3D0',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)',
          }}
        >
          {/* Laboratory Desk Background Image */}
          <img
            src="/MagneticCompass/bg_image.jpg"
            alt="Physics Lab Background"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(1.02) contrast(1.0)',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.12)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* 3D Canvas Scene */}
          <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10 }}>
            <Canvas
              shadows
              camera={{ position: [0, 8.5, 17], fov: 42 }}
              style={{ width: '100%', height: '100%' }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.9} />
                <directionalLight
                  position={[6, 14, 8]}
                  intensity={1.4}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <pointLight position={[-6, 6, -4]} intensity={0.4} color="#BAE6FD" />

                {/* Scaled & Positioned 3D Lab Group: Tray, Needle, Magnet & Filings (Compact & Well-Proportioned) */}
                <group position={[0, -2.2, 0]} scale={[0.64, 0.64, 0.64]}>
                  {/* Parchment Paper Box Enclosure with Side Walls (Stationary) */}
                  <PaperBoxEnclosure />

                  {/* Rotatable Activity Group (rotates needle, magnet, and filings inside tray) */}
                  <RotatableActivityGroup>
                    {/* 3D Steel Sewing Needle Floating in Air */}
                    <SewingNeedle3D isMagnetized={isMagnetized} />

                    {/* 3D Stroking Bar Magnet */}
                    {!isMagnetized && (
                      <BarMagnet3D
                        strokeProgress={strokeAnimProgress}
                        isAutoStroking={isAutoStroking}
                      />
                    )}

                    {/* 3D Iron Filings */}
                    <NeedleFilings3D
                      isTesting={isTesting}
                      isSprinkling={isSprinkling}
                      isAttracted={isAttracted}
                    />
                  </RotatableActivityGroup>
                </group>

                <OrbitControls
                  makeDefault
                  target={[0, -0.6, 0]}
                  minAzimuthAngle={0}
                  maxAzimuthAngle={0}
                  maxPolarAngle={Math.PI / 2.05}
                  minPolarAngle={0.1}
                  minDistance={5}
                  maxDistance={30}
                  enablePan={false}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {/* Right Side: Instructions, Action Controls & Success Panel (Warm Amber Theme with Spacious Typography) */}
      <div
        style={{
          flex: '1.15',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: '24px',
          padding: '1.45rem 1.6rem',
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: 0,
          boxSizing: 'border-box',
          overflowY: 'auto',
          gap: '0.9rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Magnet size={28} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.48rem', color: '#064E3B', fontWeight: 900 }}>
                Stage 1: Magnetize
              </h3>
            </div>
            <span style={{
              background: '#DCFCE7',
              color: '#15803D',
              fontWeight: 900,
              fontSize: '0.96rem',
              padding: '0.38rem 0.95rem',
              borderRadius: '14px',
              border: '1.5px solid #86EFAC'
            }}>
              Step {testComplete ? 3 : isMagnetized ? 2 : 1} of 3
            </span>
          </div>

          {/* All 3 Steps Visible From Initial Load with Explicit Button Guidance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                stepNum: 1,
                title: '1. Place Sewing Needle',
                desc: 'Place an iron sewing needle on the workspace paper base.'
              },
              {
                stepNum: 2,
                title: '2. Stroke with Bar Magnet',
                desc: 'Stroke one pole of the bar magnet along the needle in one single direction. Click the "Auto Magnetize" button below to stroke the needle 30 times.'
              },
              {
                stepNum: 3,
                title: '3. Test Magnetization',
                desc: 'Bring iron filings near the needle to test if it attracts them like a magnet. Click the "Test Magnetization" button below to verify magnetic attraction.'
              }
            ].map((s) => {
              const currentStepNum = testComplete ? 3 : isMagnetized ? 2 : 1;
              const isCurrent = currentStepNum === s.stepNum;
              const isPast = currentStepNum > s.stepNum || (s.stepNum === 3 && testComplete);

              return (
                <div
                  key={s.stepNum}
                  style={{
                    padding: '0.95rem 1.15rem',
                    borderRadius: '16px',
                    background: isCurrent ? '#FEF3C7' : isPast ? '#DCFCE7' : '#FFFFFF',
                    border: isCurrent 
                      ? '2px solid #F59E0B' 
                      : isPast 
                      ? '1.5px solid #86EFAC' 
                      : '1.5px solid #FDE68A',
                    boxShadow: isCurrent 
                      ? '0 4px 14px rgba(245, 158, 11, 0.18)' 
                      : '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isCurrent ? '#D97706' : isPast ? '#059669' : '#CBD5E1',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.92rem',
                        fontWeight: 900,
                        flexShrink: 0
                      }}>
                        {s.stepNum}
                      </span>
                      <span style={{ fontWeight: 900, fontSize: '1.18rem', color: isCurrent ? '#064E3B' : isPast ? '#065F46' : '#064E3B' }}>
                        {s.title}
                      </span>
                    </div>
                    {isPast && <CheckCircle size={20} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.02rem', color: '#065F46', lineHeight: 1.55, fontWeight: 700 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Middle: Magnetization Progress & Action Controls */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #FDE68A',
              borderRadius: '20px',
              padding: '1.1rem 1.3rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.05)'
            }}
          >
            {/* Step Helper / Guidance Tip */}
            <div style={{
              background: testComplete ? '#DCFCE7' : isMagnetized ? '#FEF3C7' : '#FFFBEB',
              border: `1.5px solid ${testComplete ? '#86EFAC' : isMagnetized ? '#F59E0B' : '#FDE68A'}`,
              borderRadius: '14px',
              padding: '0.65rem 0.95rem',
              fontSize: '0.98rem',
              fontWeight: 800,
              color: testComplete ? '#15803D' : '#92400E',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              lineHeight: 1.45
            }}>
              <span style={{ fontSize: '1.15rem' }}>{testComplete ? '🎉' : '👉'}</span>
              <span>
                {!isMagnetized
                  ? 'Click "1. Auto Magnetize" to stroke the needle 30 times with the bar magnet.'
                  : !testComplete
                  ? 'Great job! Now click "2. Test Magnetization" to check if iron filings stick!'
                  : 'Filings attracted! The needle is now magnetized. Click Next below.'}
              </span>
            </div>

            {/* Progress / Loading Action */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.45rem',
                  fontSize: '1.02rem',
                  color: '#064E3B',
                  fontWeight: 900,
                }}
              >
                <span>Strokes: {strokeCount} / {maxStrokes}</span>
                <span style={{ color: isMagnetized ? '#16A34A' : '#D97706', fontWeight: 900, fontSize: '1.05rem' }}>
                  {Math.round((strokeCount / maxStrokes) * 100)}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '11px',
                  background: '#FEF3C7',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #FDE68A'
                }}
              >
                <motion.div
                  animate={{ width: `${(strokeCount / maxStrokes) * 100}%` }}
                  style={{
                    height: '100%',
                    background: isMagnetized
                      ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)'
                      : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  }}
                />
              </div>
            </div>

            {/* Action Buttons Row: Both Buttons Visible with Clear Sequential Guidance */}
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              {/* Button 1: Auto Magnetize */}
              <button
                onClick={() => setIsAutoStroking(true)}
                disabled={isAutoStroking || isMagnetized}
                className={!isAutoStroking && !isMagnetized ? 'gold-glow-btn' : ''}
                style={{
                  flex: 1.3,
                  padding: '0.92rem 0.85rem',
                  fontSize: '1.02rem',
                  fontWeight: 900,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: isMagnetized ? '#DCFCE7' : isAutoStroking ? '#F1F5F9' : undefined,
                  color: isMagnetized ? '#15803D' : isAutoStroking ? '#94A3B8' : '#FFFFFF',
                  border: isMagnetized ? '1.5px solid #86EFAC' : isAutoStroking ? '1.5px solid #E2E8F0' : undefined,
                  cursor: isMagnetized || isAutoStroking ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isMagnetized ? (
                  <><CheckCircle size={18} color="#15803D" /> Stroked (30/30)</>
                ) : (
                  <><Play size={18} color={!isAutoStroking ? '#FFFFFF' : '#94A3B8'} /> {isAutoStroking ? 'Magnetizing...' : '1. Auto Magnetize'}</>
                )}
              </button>

              {/* Button 2: Test Magnetization */}
              <button
                onClick={handleTest}
                disabled={!isMagnetized || isTesting}
                className={isMagnetized && !isTesting && !testComplete ? 'gold-glow-btn' : ''}
                style={{
                  flex: 1.3,
                  padding: '0.92rem 0.85rem',
                  fontSize: '1.02rem',
                  fontWeight: 900,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: testComplete ? '#DCFCE7' : (!isMagnetized || isTesting) ? '#F1F5F9' : undefined,
                  color: testComplete ? '#15803D' : (!isMagnetized || isTesting) ? '#94A3B8' : '#FFFFFF',
                  border: testComplete ? '1.5px solid #86EFAC' : (!isMagnetized || isTesting) ? '1.5px solid #E2E8F0' : undefined,
                  cursor: isMagnetized && !isTesting ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
              >
                {testComplete ? (
                  <><CheckCircle size={18} color="#15803D" /> Tested ✓</>
                ) : (
                  <><Beaker size={18} color={isMagnetized && !isTesting ? '#FFFFFF' : '#94A3B8'} /> {isSprinkling ? 'Sprinkling...' : isAttracted ? 'Attracting...' : '2. Test Filings'}</>
                )}
              </button>

              {/* Button 3: Reset */}
              <button
                onClick={handleReset}
                disabled={strokeCount === 0 && !isAutoStroking && !isTesting}
                style={{
                  flex: 0.75,
                  padding: '0.92rem 0.7rem',
                  fontSize: '0.98rem',
                  fontWeight: 900,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  background: '#FFFFFF',
                  color: strokeCount > 0 || isAutoStroking || isTesting ? '#D97706' : '#94A3B8',
                  border: '1.5px solid #FDE68A',
                  cursor: strokeCount > 0 || isAutoStroking || isTesting ? 'pointer' : 'not-allowed',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                <RotateCcw
                  size={16}
                  color={strokeCount > 0 || isAutoStroking || isTesting ? '#D97706' : '#94A3B8'}
                />{' '}
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Observation / Success Action Card */}
        <div
          style={{
            background: testComplete ? '#DCFCE7' : '#FFFFFF',
            border: `1.5px solid ${testComplete ? '#86EFAC' : '#FDE68A'}`,
            padding: '1.25rem 1.4rem',
            borderRadius: '20px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.05)'
          }}
        >
          <h4
            style={{
              margin: '0 0 0.45rem 0',
              color: '#064E3B',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontSize: '1.22rem',
              fontWeight: 900,
            }}
          >
            <CheckCircle size={22} color={testComplete ? '#15803D' : '#D97706'} /> {testComplete ? 'Magnetization Complete!' : 'Step 3: Test'}
          </h4>
          <p
            style={{
              margin: '0 0 0.95rem 0',
              color: '#065F46',
              fontSize: '1.02rem',
              fontWeight: '700',
              lineHeight: '1.6',
            }}
          >
            {testComplete
              ? 'The steel pins & iron filings are attracted to the needle! This means the needle has successfully become a magnet.'
              : 'Click the "Test Magnetization" button to sprinkle iron filings and observe if the needle attracts them.'}
          </p>

          <button
            onClick={onComplete}
            disabled={!testComplete}
            className={testComplete ? 'gold-glow-btn' : ''}
            style={{
              width: '100%',
              padding: '0.95rem 1.6rem',
              fontSize: '1.08rem',
              fontWeight: 900,
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.65rem',
              background: testComplete ? undefined : '#F1F5F9',
              color: testComplete ? '#FFFFFF' : '#94A3B8',
              border: testComplete ? undefined : '1.5px solid #E2E8F0',
              cursor: testComplete ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s ease',
            }}
          >
            Next Section: Make a Compass <ArrowRight size={20} color={testComplete ? '#FFFFFF' : '#94A3B8'} />
          </button>
        </div>
      </div>
    </div>
  );
}