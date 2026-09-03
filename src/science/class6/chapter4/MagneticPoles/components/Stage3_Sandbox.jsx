import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, ContactShadows, Environment, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, RotateCcw, Shapes, Flag, BookOpen, CheckCircle, ArrowRight, Play, Pause } from 'lucide-react';
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

      {/* 2. Back Paper Wall - Increased Height */}
      <mesh receiveShadow position={[0, 3.9, -8.0]}>
        <boxGeometry args={[26, 7.8, 0.04]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 3. Left Paper Wall - Increased Height */}
      <mesh receiveShadow position={[-13.0, 3.9, 0]}>
        <boxGeometry args={[0.04, 7.8, 16]} />
        <meshStandardMaterial map={paperTexture} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* 4. Right Paper Wall - Increased Height */}
      <mesh receiveShadow position={[13.0, 3.9, 0]}>
        <boxGeometry args={[0.04, 7.8, 16]} />
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

// ----------------------------------------------------
// 1. REALISTIC 3D MAGNET MODELS (PROPORTIONATELY SIZED)
// ----------------------------------------------------

// A. Bar Magnet with Realistic Panoramic Texture Mapping
function BarMagnet3D() {
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const frontTop = loader.load('/MagneticPoles/magnet_front_top.png');
    frontTop.colorSpace = THREE.SRGBColorSpace;
    frontTop.anisotropy = 8;

    const back = loader.load('/MagneticPoles/magnet_back.png');
    back.colorSpace = THREE.SRGBColorSpace;
    back.anisotropy = 8;

    const northCap = loader.load('/MagneticPoles/magnet_end_north.png');
    northCap.colorSpace = THREE.SRGBColorSpace;
    northCap.anisotropy = 8;

    const southCap = loader.load('/MagneticPoles/magnet_end_south.png');
    southCap.colorSpace = THREE.SRGBColorSpace;
    southCap.anisotropy = 8;

    return { frontTop, back, northCap, southCap };
  }, []);

  return (
    <group position={[0, 4.2, 0]} scale={[1.35, 2.2, 1.35]}>
      {/* 1. North Pole Core Half (Left) - Metallic Blue */}
      <mesh position={[-3.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 1.3, 1.9]} />
        <meshStandardMaterial 
          color="#124982" 
          roughness={0.4} 
          metalness={0.25} 
        />
      </mesh>

      {/* 2. South Pole Core Half (Right) - Metallic Red */}
      <mesh position={[3.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 1.3, 1.9]} />
        <meshStandardMaterial 
          color="#A31820" 
          roughness={0.4} 
          metalness={0.25} 
        />
      </mesh>

      {/* 3. Center Dividing Seam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 1.31, 1.91]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* 4. Front Face: First Image (North Left, South Right) */}
      <mesh position={[0, 0, 0.955]} castShadow receiveShadow>
        <planeGeometry args={[12.0, 1.3]} />
        <meshStandardMaterial
          map={textures.frontTop}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      {/* 5. Top Face: First Image (North Left, South Right) */}
      <mesh position={[0, 0.655, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[12.0, 1.9]} />
        <meshStandardMaterial
          map={textures.frontTop}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      {/* 6. Back Face: Second Image (South Left, North Right when viewed from back) */}
      <mesh position={[0, 0, -0.955]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[12.0, 1.3]} />
        <meshStandardMaterial
          map={textures.back}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      {/* 7. North End-Cap (Left Face, X = -6.0): Matching Blue Section */}
      <mesh position={[-6.005, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.9, 1.3]} />
        <meshStandardMaterial
          map={textures.northCap}
          color="#124982"
          roughness={0.38}
          metalness={0.25}
        />
      </mesh>

      {/* 8. South End-Cap (Right Face, X = +6.0): Matching Red Section */}
      <mesh position={[6.005, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.9, 1.3]} />
        <meshStandardMaterial
          map={textures.southCap}
          color="#A31820"
          roughness={0.38}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}

// B. Realistic Solid 3D Horseshoe Magnet (True U-Shape)
function HorseshoeMagnet3D() {
  const { northGeo, southGeo } = useMemo(() => {
    const extrudeSettings = {
      depth: 1.3,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    // North Half Shape (Left side: X from -3.0 to 0)
    const nShape = new THREE.Shape();
    nShape.moveTo(-3.0, -2.6); // Outer pole tip
    nShape.lineTo(-3.0, 0.2);  // Outer leg start of arch
    nShape.absarc(0, 0.2, 3.0, Math.PI, Math.PI / 2, true); // Outer arc to (0, 3.2)
    nShape.lineTo(0, 1.8);     // Line to inner arc apex
    nShape.absarc(0, 0.2, 1.6, Math.PI / 2, Math.PI, false); // Inner arc to (-1.6, 0.2)
    nShape.lineTo(-1.6, -2.6); // Inner leg tip
    nShape.lineTo(-3.0, -2.6); // Close tip

    // South Half Shape (Right side: X from 0 to +3.0)
    const sShape = new THREE.Shape();
    sShape.moveTo(0, 3.2);     // Outer arc apex
    sShape.absarc(0, 0.2, 3.0, Math.PI / 2, 0, true); // Outer arc to (3.0, 0.2)
    sShape.lineTo(3.0, -2.6);  // Outer pole tip
    sShape.lineTo(1.6, -2.6);  // Inner pole tip
    sShape.lineTo(1.6, 0.2);   // Inner leg start of arch
    sShape.absarc(0, 0.2, 1.6, 0, Math.PI / 2, false); // Inner arc to (0, 1.8)
    sShape.lineTo(0, 3.2);     // Close at apex

    const nGeo = new THREE.ExtrudeGeometry(nShape, extrudeSettings);
    const sGeo = new THREE.ExtrudeGeometry(sShape, extrudeSettings);

    // Rotate so extrusion goes along Y axis (thickness 1.3)
    nGeo.rotateX(-Math.PI / 2);
    sGeo.rotateX(-Math.PI / 2);

    return { northGeo: nGeo, southGeo: sGeo };
  }, []);

  return (
    <group position={[0, 1.8, 0]}>
      {/* North Half (Red) */}
      <mesh geometry={northGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#C51E28" roughness={0.55} metalness={0.12} />
      </mesh>
      <Text
        position={[-2.3, 1.36, 1.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.9}
        color="#FFFFFF"
        fontWeight="bold"
      >
        N
      </Text>

      {/* South Half (Blue) */}
      <mesh geometry={southGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#1848B8" roughness={0.55} metalness={0.12} />
      </mesh>
      <Text
        position={[2.3, 1.36, 1.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.9}
        color="#FFFFFF"
        fontWeight="bold"
      >
        S
      </Text>

      {/* Center Seam dividing the U-arch */}
      <mesh position={[0, 0.65, -2.5]}>
        <boxGeometry args={[0.06, 1.32, 1.42]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
    </group>
  );
}

// C. Realistic Solid 3D Ring Magnet
function RingMagnet3D() {
  const { northGeo, southGeo } = useMemo(() => {
    const extrudeSettings = {
      depth: 1.3,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    // North Half Ring Shape (Left side: X from -2.8 to 0)
    const nShape = new THREE.Shape();
    nShape.absarc(0, 0, 2.8, Math.PI / 2, 3 * Math.PI / 2, false);
    nShape.lineTo(0, -1.4);
    nShape.absarc(0, 0, 1.4, 3 * Math.PI / 2, Math.PI / 2, true);
    nShape.lineTo(0, 2.8);

    // South Half Ring Shape (Right side: X from 0 to +2.8)
    const sShape = new THREE.Shape();
    sShape.absarc(0, 0, 2.8, -Math.PI / 2, Math.PI / 2, false);
    sShape.lineTo(0, 1.4);
    sShape.absarc(0, 0, 1.4, Math.PI / 2, -Math.PI / 2, true);
    sShape.lineTo(0, -2.8);

    const nGeo = new THREE.ExtrudeGeometry(nShape, extrudeSettings);
    const sGeo = new THREE.ExtrudeGeometry(sShape, extrudeSettings);

    nGeo.rotateX(-Math.PI / 2);
    sGeo.rotateX(-Math.PI / 2);

    return { northGeo: nGeo, southGeo: sGeo };
  }, []);

  return (
    <group position={[0, 1.8, 0]}>
      {/* North Half Ring (Red) */}
      <mesh geometry={northGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#C51E28" roughness={0.55} metalness={0.12} />
      </mesh>
      <Text
        position={[-2.1, 1.36, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.9}
        color="#FFFFFF"
        fontWeight="bold"
      >
        N
      </Text>

      {/* South Half Ring (Blue) */}
      <mesh geometry={southGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#1848B8" roughness={0.55} metalness={0.12} />
      </mesh>
      <Text
        position={[2.1, 1.36, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.9}
        color="#FFFFFF"
        fontWeight="bold"
      >
        S
      </Text>

      {/* Top and Bottom Seams */}
      <mesh position={[0, 0.65, -2.1]}>
        <boxGeometry args={[0.06, 1.32, 1.42]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.65, 2.1]}>
        <boxGeometry args={[0.06, 1.32, 1.42]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
    </group>
  );
}

function ChosenMagnet3D({ shape }) {
  if (shape === 'bar') return <BarMagnet3D />;
  if (shape === 'horseshoe') return <HorseshoeMagnet3D />;
  if (shape === 'ring') return <RingMagnet3D />;
  return <HorseshoeMagnet3D />;
}

// ---------------------------------------------------------
// Smooth Intro Animation Group (Bottom-Left to Center Growth)
// ---------------------------------------------------------
function AnimatedLabGroup({ children, zoomScale = 1.0, onArrival }) {
  const groupRef = useRef();
  const [hasStarted, setHasStarted] = useState(false);
  const arrivedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, 250);
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

    // Notify once tray and magnet have smoothly arrived at the center
    if (hasStarted && !arrivedRef.current) {
      const dist = Math.hypot(
        groupRef.current.position.x - 0,
        groupRef.current.position.y - (-0.4),
        groupRef.current.position.z - 0
      );
      const scaleDiff = Math.abs(currentScale - targetScale);

      if (dist < 0.08 && scaleDiff < 0.015) {
        arrivedRef.current = true;
        groupRef.current.position.set(0, -0.4, 0);
        groupRef.current.scale.set(targetScale, targetScale, targetScale);
        if (onArrival) onArrival();
      }
    }
  });

  return (
    <group ref={groupRef} position={[-5.8, -3.5, 0.5]} scale={[0.08, 0.08, 0.08]}>
      {children}
    </group>
  );
}

// ----------------------------------------------------
// 2. 3D FILINGS INSTANCED SYSTEM (PERFECTLY FITTED TO PAPER)
// ----------------------------------------------------
function FilingsSystem({ step, isSprinkling, isVibrating, shape, cycleKey, isPaused }) {
  const count = 14000;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lastCycleRef = useRef(-1);

  // Poles coordinates calculated per shape
  const poles = useMemo(() => {
    if (shape === 'horseshoe') {
      return { nX: -2.3, nZ: 2.2, sX: 2.3, sZ: 2.2, span: 3.5 };
    } else if (shape === 'ring') {
      return { nX: 0, nZ: -1.6, sX: 0, sZ: 1.6, span: 3.0 };
    }
    return { nX: -4.8, nZ: 0, sX: 4.8, sZ: 0, span: 4.0 };
  }, [shape]);

  const particles = useMemo(() => {
    const data = [];
    const numLines = 85;

    for (let i = 0; i < count; i++) {
      const randX = (Math.random() - 0.5) * 23;
      const randZ = (Math.random() - 0.5) * 13.5;
      const randomEuler = new THREE.Euler(Math.PI / 2, (Math.random() - 0.5) * Math.PI, 0);
      const initialQ = new THREE.Quaternion().setFromEuler(randomEuler);

      let targetX, targetZ;
      const clusterRoll = Math.random();

      if (clusterRoll < 0.42) {
        const isNorth = Math.random() < 0.5;
        const pX = isNorth ? poles.nX : poles.sX;
        const pZ = isNorth ? poles.nZ : poles.sZ;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 2.0) * poles.span + 0.2;

        targetX = pX + Math.cos(angle) * r;
        targetZ = pZ + Math.sin(angle) * r;
      } else {
        const lineIdx = Math.floor(Math.random() * numLines);
        const t = Math.random();
        const loopR = 1.6 + (lineIdx / numLines) * 8.0;
        const theta = (t - 0.5) * Math.PI * 0.95;

        const side = Math.random() > 0.5 ? 1 : -1;
        targetX = Math.sin(theta) * (loopR + Math.sin(t * Math.PI) * 1.6);
        targetZ = side * Math.cos(theta) * loopR * 0.75 + (Math.random() - 0.5) * 0.25;
      }

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

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.034, 0.034, 0.18, 4), []);
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
    const poleY = shape === 'bar' ? 2.5 : 2.45;

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
      // 1. Sprinkling down
      if (isSprinkling) {
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

      // 2. Scattered on paper
      if (step === 'scattered') {
        p.visible = true;
        p.y = 0.04;
        p.x = p.originX;
        p.z = p.originZ;
        p.q.copy(p.initialQ);
      }

      // 3. Tapped - align along magnetic poles
      if (step === 'tapped' || (isVibrating && step === 'tapped')) {
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

        const Bx = dxN / Math.pow(distN, 3) - dxS / Math.pow(distS, 3);
        const By = dyN / Math.pow(distN, 3) - dyS / Math.pow(distS, 3);
        const Bz = dzN / Math.pow(distN, 3) - dzS / Math.pow(distS, 3);
        const Bmag = Math.hypot(Bx, By, Bz);

        if (Bmag > 0.0001) {
          const dir = new THREE.Vector3(Bx / Bmag, By / Bmag, Bz / Bmag);
          p.targetQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          p.q.slerp(p.targetQ, dt * 7.5);

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

// ----------------------------------------------------
// 3. MAIN COMPONENT
// ----------------------------------------------------
export default function Stage3_Sandbox({ onComplete }) {
  const [step, setStep] = useState('waiting');
  const [cycleKey, setCycleKey] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [shape, setShape] = useState('horseshoe'); // 'horseshoe', 'ring', 'bar'
  const [isSprinkling, setIsSprinkling] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const hasArrivedRef = useRef(false);

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

  // Only start pouring iron filings once the tray and magnet arrive at the center
  const handleArrival = useCallback(() => {
    if (hasArrivedRef.current) return;
    hasArrivedRef.current = true;
    executePhase('sprinkle', 1800);
  }, []);

  // Safety fallback in case of background tab throttling
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasArrivedRef.current) {
        handleArrival();
      }
    }, 2200);
    return () => {
      clearTimeout(fallbackTimer);
      clearLoopTimers();
    };
  }, [handleArrival]);

  const handleShapeChange = (newShape) => {
    setShape(newShape);
    clearLoopTimers();
    setIsPaused(false);
    isPausedRef.current = false;
    setTapCount(0);
    executePhase('sprinkle', 1800);
  };

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
    executePhase('sprinkle', 1800);
  };

  return (
    <div
      style={{
        padding: '0.5rem',
        display: 'flex',
        gap: '1.25rem',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Side: 3D Scene Interactive Area */}
      <div
        style={{
          flex: '1.8',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
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
            backgroundPosition: 'center',
          }}
        >
          {/* 3D Canvas Scene matching Stage 1 Camera & Lights */}
          <Canvas
            shadows
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 5.5, 25], fov: 42 }}
            style={{ width: '100%', height: '100%' }}
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

              <AnimatedLabGroup zoomScale={1.0} onArrival={handleArrival}>
                <RotatableMagnetGroup>
                  <ChosenMagnet3D shape={shape} />
                  <FilingsSystem step={step} isSprinkling={isSprinkling} isVibrating={isVibrating} shape={shape} cycleKey={cycleKey} isPaused={isPaused} />
                </RotatableMagnetGroup>
                <PaperBoxEnclosure isVibrating={isVibrating} isPaused={isPaused} />

                {/* Soft Drop Shadow under Paper */}
                <ContactShadows
                  position={[0, -0.08, 0]}
                  opacity={0.65}
                  scale={32}
                  blur={2.2}
                  far={4}
                  color="#000000"
                />
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

      {/* Right Side: Control Panel (Unified Warm Orange Theme) */}
      <div
        style={{
          flex: '1.15',
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: '24px',
          padding: '1.25rem 1.35rem',
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: 0,
          overflowY: 'auto',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Shapes size={26} color="#D97706" />
            <h3 style={{ margin: 0, fontSize: '1.45rem', color: '#78350F', fontWeight: 900 }}>
              Stage 3: Other Magnet Shapes
            </h3>
          </div>
          <span style={{
            background: step === 'tapped' ? '#DCFCE7' : '#FEF3C7',
            color: step === 'tapped' ? '#15803D' : '#92400E',
            fontWeight: 900,
            fontSize: '0.88rem',
            padding: '0.35rem 0.8rem',
            borderRadius: '12px',
            border: step === 'tapped' ? '1.5px solid #86EFAC' : '1.5px solid #F59E0B'
          }}>
            Step {step === 'tapped' ? 3 : (step === 'scattered' || isVibrating) ? 2 : 1} of 3
          </span>
        </div>

        {/* CONTAINER 1: Steps of Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.96)',
          border: '1.5px solid #FDE68A',
          borderRadius: '20px',
          padding: '1.1rem 1.2rem',
          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #FEF3C7', paddingBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#78350F', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>📋</span> Steps of Instructions
            </h4>
          </div>

          {/* All 3 Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                stepNum: 1,
                title: '1. Choose Magnet Shape',
                desc: 'Select Horseshoe, Ring, or Bar magnet and click "1. Sprinkle".'
              },
              {
                stepNum: 2,
                title: '2. Tap Paper Sheet',
                desc: 'Click "2. Tap Paper" to gently vibrate the sheet and align iron filings.'
              },
              {
                stepNum: 3,
                title: '3. Observe Pole Concentrations',
                desc: 'Observe that filings cluster at magnetic poles regardless of shape.'
              }
            ].map((s) => {
              const currentStepNum = step === 'tapped' ? 3 : (step === 'scattered' || isVibrating) ? 2 : 1;
              const isCurrent = currentStepNum === s.stepNum;
              const isPast = currentStepNum > s.stepNum || (s.stepNum === 3 && step === 'tapped');

              return (
                <div
                  key={s.stepNum}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '14px',
                    background: isPast ? '#DCFCE7' : isCurrent ? '#FEF3C7' : 'rgba(255, 255, 255, 0.7)',
                    border: isPast ? '1.5px solid #86EFAC' : isCurrent ? '1.5px solid #F59E0B' : '1.5px solid transparent',
                    boxShadow: isPast 
                      ? '0 3px 10px rgba(16, 185, 129, 0.1)' 
                      : isCurrent 
                      ? '0 3px 10px rgba(245, 158, 11, 0.12)' 
                      : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isPast ? '#059669' : '#FEF3C7',
                        border: isPast ? '2px solid #059669' : '2px solid #F59E0B',
                        color: isPast ? '#FFFFFF' : '#92400E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.92rem',
                        fontWeight: 900,
                        flexShrink: 0
                      }}>
                        {s.stepNum}
                      </span>
                      <span style={{ 
                        fontWeight: 900, 
                        fontSize: '1.1rem', 
                        color: isPast ? '#15803D' : isCurrent ? '#92400E' : '#78350F' 
                      }}>
                        {s.title}
                      </span>
                    </div>
                    {isPast && <CheckCircle size={20} color="#16A34A" />}
                  </div>
                  <p style={{ margin: '0.15rem 0 0 2.3rem', fontSize: '0.96rem', color: isPast ? '#166534' : '#065F46', lineHeight: 1.5, fontWeight: 600 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Magnet Shape Selector */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              padding: '0.35rem 0 0.1rem 0',
              borderTop: '1px solid #FEF3C7'
            }}
          >
            <h5
              style={{
                color: '#78350F',
                margin: 0,
                fontSize: '1.02rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <Shapes size={18} color="#D97706" /> Choose Magnet Shape:
            </h5>

            <div style={{ display: 'flex', gap: '0.55rem' }}>
              <button
                onClick={() => handleShapeChange('horseshoe')}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: shape === 'horseshoe' ? '#10B981' : '#FDE68A',
                  background: shape === 'horseshoe' ? '#DCFCE7' : '#F8FAFC',
                  color: shape === 'horseshoe' ? '#064E3B' : '#065F46',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: shape === 'horseshoe' ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                }}
              >
                Horseshoe 🧲
              </button>

              <button
                onClick={() => handleShapeChange('ring')}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: shape === 'ring' ? '#10B981' : '#FDE68A',
                  background: shape === 'ring' ? '#DCFCE7' : '#F8FAFC',
                  color: shape === 'ring' ? '#064E3B' : '#065F46',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: shape === 'ring' ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                }}
              >
                Ring ⭕
              </button>

              <button
                onClick={() => handleShapeChange('bar')}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: shape === 'bar' ? '#10B981' : '#FDE68A',
                  background: shape === 'bar' ? '#DCFCE7' : '#F8FAFC',
                  color: shape === 'bar' ? '#064E3B' : '#065F46',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: shape === 'bar' ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                }}
              >
                Bar 🔲
              </button>
            </div>
          </div>

          {/* Action Controls: Pause / Resume & Reset */}
          <div style={{ width: '100%', display: 'flex', gap: '0.65rem', marginTop: '0.2rem', paddingTop: '0.5rem', borderTop: '1px solid #FEF3C7' }}>
            <button
              onClick={handleTogglePause}
              className="gold-glow-btn"
              style={{
                flex: 2,
                padding: '0.85rem 1rem',
                fontSize: '1.02rem',
                fontWeight: 900,
                borderRadius: '14px',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {!isPaused ? (
                <>
                  <Pause size={18} fill="#FFFFFF" color="#FFFFFF" /> Pause Investigation
                </>
              ) : (
                <>
                  <Play size={18} fill="#FFFFFF" color="#FFFFFF" /> Resume Investigation
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '0.85rem 0.6rem',
                fontSize: '0.98rem',
                fontWeight: 800,
                borderRadius: '14px',
                background: '#FFFFFF',
                color: '#92400E',
                border: '1.5px solid #FDE68A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* CONTAINER 2: Observation Summary */}
        <div
          style={{
            background: step === 'tapped' ? '#DCFCE7' : 'rgba(255, 255, 255, 0.96)',
            border: step === 'tapped' ? '1.5px solid #86EFAC' : '1.5px solid #FDE68A',
            borderRadius: '20px',
            padding: '1.1rem 1.2rem',
            boxShadow: step === 'tapped' ? '0 4px 14px rgba(16, 185, 129, 0.12)' : '0 4px 14px rgba(217, 119, 6, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <h4
            style={{
              color: step === 'tapped' ? '#15803D' : '#78350F',
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}
          >
            <Shapes size={22} color={step === 'tapped' ? '#16A34A' : '#D97706'} /> Observation Summary
          </h4>
          <p style={{ margin: 0, color: step === 'tapped' ? '#166534' : '#065F46', fontSize: '1.02rem', lineHeight: 1.55, fontWeight: 600 }}>
            Do all magnet shapes exhibit the same concentration of magnetic poles?
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.25rem',
              color: '#065F46',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.96rem',
              lineHeight: '1.5',
              fontWeight: 600,
            }}
          >
            <li>
              <strong style={{ color: '#064E3B' }}>Horseshoe:</strong> Filings cluster tightly at both curved tips.
            </li>
            <li>
              <strong style={{ color: '#064E3B' }}>Ring:</strong> Filings concentrate on opposite circular pole faces.
            </li>
            <li>
              <strong style={{ color: '#064E3B' }}>Bar:</strong> Filings gather heavily at the two distant ends.
            </li>
          </ul>

          <div style={{ marginTop: '0.2rem' }}>
            <button
              onClick={() => {
                if (onComplete) onComplete();
              }}
              className="gold-glow-btn"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                transition: 'all 0.25s ease',
              }}
            >
              <Flag size={18} color="#FFFFFF" /> Finish Activity & Proceed to Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}