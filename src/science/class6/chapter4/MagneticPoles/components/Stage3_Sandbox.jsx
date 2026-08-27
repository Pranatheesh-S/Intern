import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, ContactShadows, Environment, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, RotateCcw, Shapes, Flag, BookOpen, Maximize2, Minimize2, CheckCircle, ArrowRight, Play, Square, Plus, Minus } from 'lucide-react';
import * as THREE from 'three';

// ---------------------------------------------------------
// Realistic Parchment Paper Box Enclosure
// ---------------------------------------------------------
function PaperBoxEnclosure() {
  const paperTexture = useTexture('/MagneticPoles/paper_texture.jpg');

  return (
    <>
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
    </>
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

// A. Bar Magnet (Proportionate: 12.0 x 1.3 x 1.9)
function BarMagnet3D() {
  return (
    <group position={[0, 2.5, 0]}>
      {/* North Half */}
      <mesh position={[-3.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 1.3, 1.9]} />
        <meshStandardMaterial color="#C51E28" roughness={0.55} metalness={0.12} />
      </mesh>
      <Text
        position={[-4.2, 0.66, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.95}
        color="#FFFFFF"
        fontWeight="bold"
      >
        N
      </Text>

      {/* South Half */}
      <mesh position={[3.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 1.3, 1.9]} />
        <meshStandardMaterial color="#1848B8" roughness={0.55} metalness={0.12} />
      </mesh>
      <Text
        position={[4.2, 0.66, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.95}
        color="#FFFFFF"
        fontWeight="bold"
      >
        S
      </Text>

      {/* Center Seam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 1.31, 1.91]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
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

// ----------------------------------------------------
// 2. 3D FILINGS INSTANCED SYSTEM (PERFECTLY FITTED TO PAPER)
// ----------------------------------------------------
function FilingsSystem3D({ shape, step, isSprinkling, isVibrating }) {
  const count = 14000;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Compute pole points for field simulation
  const poles = useMemo(() => {
    if (shape === 'horseshoe') {
      return { nX: -2.3, nZ: 2.6, sX: 2.3, sZ: 2.6, span: 3.2 };
    }
    if (shape === 'ring') {
      return { nX: -2.1, nZ: 0.0, sX: 2.1, sZ: 0.0, span: 3.2 };
    }
    // Bar
    return { nX: -4.8, nZ: 0.0, sX: 4.8, sZ: 0.0, span: 4.0 };
  }, [shape]);

  const particles = useMemo(() => {
    const data = [];
    const numLines = 85;

    for (let i = 0; i < count; i++) {
      // Confined strictly to paper bounds (Paper is 26 x 16)
      const randX = (Math.random() - 0.5) * 23;
      const randZ = (Math.random() - 0.5) * 13.5;
      const randomEuler = new THREE.Euler(Math.PI / 2, (Math.random() - 0.5) * Math.PI, 0);

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
        y: 11 + Math.random() * 5,
        z: randZ,
        floatY: 0.25 + Math.random() * 4.5,
        q: new THREE.Quaternion().setFromEuler(randomEuler),
        targetQ: new THREE.Quaternion(),
        visible: false,
        delay: Math.random() * 0.9,
      });
    }
    return data;
  }, [count, poles]);

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
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);
    const poleY = shape === 'bar' ? 2.5 : 2.45;

    particles.forEach((p, i) => {
      if (step === 'initial' && !isSprinkling) {
        p.visible = false;
        p.y = 11 + Math.random() * 5;
        p.x = p.originX;
        p.z = p.originZ;
        p.delay = Math.random() * 0.9;
      }

      // Step 2: Sprinkling down - suspended floating in 3D air around the magnet
      if (isSprinkling || step === 'scattered') {
        p.delay -= dt;
        if (p.delay <= 0) {
          p.visible = true;
          if (p.y > p.floatY) {
            p.y -= dt * 20;
          } else {
            p.y = p.floatY;
          }
        }
      }

      if (step === 'tapped' || (isVibrating && step === 'tapped')) {
        p.x = THREE.MathUtils.lerp(p.x, p.targetX, dt * 5.0);
        p.z = THREE.MathUtils.lerp(p.z, p.targetZ, dt * 5.0);

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
            p.y = THREE.MathUtils.lerp(p.y, 0.03 + spikeHeight * Math.abs(By / Bmag), dt * 6);
          } else {
            p.y = THREE.MathUtils.lerp(p.y, 0.03, dt * 6);
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
  const [step, setStep] = useState('initial');
  const [tapCount, setTapCount] = useState(0);
  const [shape, setShape] = useState('horseshoe'); // 'horseshoe', 'ring', 'bar'
  const [isSprinkling, setIsSprinkling] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.0);

  const handleZoomIn = () => setZoomScale((z) => Math.min(2.0, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomScale((z) => Math.max(0.45, +(z - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomScale(1.0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const [isRunning, setIsRunning] = useState(false);
  const autoTimeoutsRef = useRef([]);

  const clearAutoTimeouts = () => {
    autoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    autoTimeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAutoTimeouts();
  }, []);

  const handleShapeChange = (newShape) => {
    setShape(newShape);
    handleReset();
  };

  const handleStart = () => {
    clearAutoTimeouts();
    setIsRunning(true);

    if (step === 'initial') {
      setIsSprinkling(true);
      const t1 = setTimeout(() => {
        setIsSprinkling(false);
        setStep('scattered');

        const t2 = setTimeout(() => {
          setIsVibrating(true);
          const t3 = setTimeout(() => {
            setIsVibrating(false);
            setTapCount(1);
            setStep('tapped');
            setIsRunning(false);
          }, 450);
          autoTimeoutsRef.current.push(t3);
        }, 700);
        autoTimeoutsRef.current.push(t2);
      }, 1200);
      autoTimeoutsRef.current.push(t1);
    } else if (step === 'scattered') {
      setIsVibrating(true);
      const t = setTimeout(() => {
        setIsVibrating(false);
        setTapCount(1);
        setStep('tapped');
        setIsRunning(false);
      }, 450);
      autoTimeoutsRef.current.push(t);
    } else {
      setStep('initial');
      setTapCount(0);
      setIsSprinkling(true);
      const t1 = setTimeout(() => {
        setIsSprinkling(false);
        setStep('scattered');

        const t2 = setTimeout(() => {
          setIsVibrating(true);
          const t3 = setTimeout(() => {
            setIsVibrating(false);
            setTapCount(1);
            setStep('tapped');
            setIsRunning(false);
          }, 450);
          autoTimeoutsRef.current.push(t3);
        }, 700);
        autoTimeoutsRef.current.push(t2);
      }, 1200);
      autoTimeoutsRef.current.push(t1);
    }
  };

  const handleStop = () => {
    clearAutoTimeouts();
    setIsRunning(false);
    setIsSprinkling(false);
    setIsVibrating(false);
  };

  const handleToggleStartStop = () => {
    if (isRunning) {
      handleStop();
    } else {
      handleStart();
    }
  };

  const handleReset = () => {
    clearAutoTimeouts();
    setIsRunning(false);
    setStep('initial');
    setTapCount(0);
    setIsSprinkling(false);
    setIsVibrating(false);
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
          {/* Floating Controls HUD: Zoom In / Zoom Out / Reset Scale / Fullscreen */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(15, 23, 42, 0.78)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '4px 8px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
            }}
          >
            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              title="Make Smaller (Zoom Out)"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Minus size={16} color="#FFFFFF" />
            </button>

            {/* Scale % Display / Click to Reset */}
            <button
              onClick={handleResetZoom}
              title="Click to Reset Size to 100%"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F8FAFC',
                fontSize: '0.82rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                padding: '0 6px',
                minWidth: '52px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {Math.round(zoomScale * 100)}%
            </button>

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              title="Make Bigger (Zoom In)"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Plus size={16} color="#FFFFFF" />
            </button>

            {/* Reset Scale Button */}
            <button
              onClick={handleResetZoom}
              title="Reset Object Size"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <RotateCcw size={14} color="#FFFFFF" />
            </button>

            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.22)', margin: '0 2px' }} />

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s ease',
              }}
            >
              {isFullscreen ? <Minimize2 size={15} color="#FFFFFF" /> : <Maximize2 size={15} color="#FFFFFF" />}
              <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>

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

              <AnimatedLabGroup zoomScale={zoomScale}>
                <RotatableMagnetGroup>
                  {/* Render Selected 3D Magnet */}
                  {shape === 'bar' && <BarMagnet3D />}
                  {shape === 'horseshoe' && <HorseshoeMagnet3D />}
                  {shape === 'ring' && <RingMagnet3D />}

                  {/* Iron Filings Instanced Mesh */}
                  <FilingsSystem3D
                    key={shape}
                    shape={shape}
                    step={step}
                    isSprinkling={isSprinkling}
                    isVibrating={isVibrating}
                  />
                </RotatableMagnetGroup>
                <PaperBoxEnclosure />

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

      {/* Right Side: Control Panel (Activity 4.3 Theme - Champagne Background) */}
      <div
        style={{
          flex: '1.15',
          background: '#F7E7CE',
          border: '1.5px solid #E6D2AC',
          borderRadius: '24px',
          padding: '1.5rem 1.6rem',
          boxShadow: '0 4px 20px rgba(180, 140, 90, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.1rem',
          minWidth: 0,
          overflowY: 'auto',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <Shapes size={28} color="#0284C7" />
              <h3 style={{ margin: 0, fontSize: '1.52rem', color: '#0F172A', fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                Stage 3: Other Magnet Shapes
              </h3>
            </div>
            <span style={{
              background: '#E0F2FE',
              color: '#0369A1',
              fontWeight: 800,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.96rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '12px',
              border: '1.5px solid #BAE6FD'
            }}>
              Step {step === 'tapped' ? 3 : step === 'scattered' ? 2 : 1} of 3
            </span>
          </div>

          {/* All 3 Steps Visible From Initial Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
              const currentStepNum = step === 'tapped' ? 3 : step === 'scattered' ? 2 : 1;
              const isCurrent = currentStepNum === s.stepNum;
              const isPast = currentStepNum > s.stepNum;

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
                        background: isCurrent ? '#0284C7' : isPast ? '#059669' : '#64748B',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {s.stepNum}
                      </span>
                      <span style={{ 
                        fontWeight: 800, 
                        fontSize: '1.22rem', 
                        fontFamily: "'Inter', sans-serif",
                        color: isCurrent ? '#0369A1' : isPast ? '#065F46' : '#1E293B' 
                      }}>
                        {s.title}
                      </span>
                    </div>
                    {isPast && <CheckCircle size={22} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.2rem 0 0 2.5rem', fontSize: '1.06rem', color: '#475569', lineHeight: 1.6, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
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
              gap: '0.75rem',
              padding: '0.2rem 0',
            }}
          >
            <h4
              style={{
                color: '#0F172A',
                margin: 0,
                fontSize: '1.18rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
              }}
            >
              <Shapes size={22} color="#0284C7" /> Choose Magnet Shape
            </h4>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={() => handleShapeChange('horseshoe')}
                style={{
                  flex: 1,
                  padding: '0.88rem 0.6rem',
                  borderRadius: '14px',
                  border: '2px solid',
                  borderColor: shape === 'horseshoe' ? '#0284C7' : '#CBD5E1',
                  background: shape === 'horseshoe' ? '#E0F2FE' : '#FFFFFF',
                  color: shape === 'horseshoe' ? '#0369A1' : '#1E293B',
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: shape === 'horseshoe' ? '0 3px 10px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                Horseshoe 🧲
              </button>

              <button
                onClick={() => handleShapeChange('ring')}
                style={{
                  flex: 1,
                  padding: '0.88rem 0.6rem',
                  borderRadius: '14px',
                  border: '2px solid',
                  borderColor: shape === 'ring' ? '#0284C7' : '#CBD5E1',
                  background: shape === 'ring' ? '#E0F2FE' : '#FFFFFF',
                  color: shape === 'ring' ? '#0369A1' : '#1E293B',
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: shape === 'ring' ? '0 3px 10px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                Ring ⭕
              </button>

              <button
                onClick={() => handleShapeChange('bar')}
                style={{
                  flex: 1,
                  padding: '0.88rem 0.6rem',
                  borderRadius: '14px',
                  border: '2px solid',
                  borderColor: shape === 'bar' ? '#0284C7' : '#CBD5E1',
                  background: shape === 'bar' ? '#E0F2FE' : '#FFFFFF',
                  color: shape === 'bar' ? '#0369A1' : '#1E293B',
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: shape === 'bar' ? '0 3px 10px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                Bar 🔲
              </button>
            </div>
          </div>

          {/* Action Controls: Unified Start/Stop Toggle & Reset */}
          <div style={{ width: '100%', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleToggleStartStop}
              style={{
                flex: 2,
                padding: '1.05rem 1rem',
                fontSize: '1.14rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '16px',
                background: isRunning
                  ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isRunning
                  ? '0 4px 14px rgba(239, 68, 68, 0.35)'
                  : '0 4px 14px rgba(2, 132, 199, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              {isRunning ? (
                <>
                  <Square size={20} fill="#FFFFFF" color="#FFFFFF" /> Stop Investigation
                </>
              ) : (
                <>
                  <Play size={20} fill="#FFFFFF" color="#FFFFFF" /> {step === 'tapped' ? 'Replay Investigation' : 'Start Investigation'}
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={step === 'initial' && !isRunning}
              style={{
                flex: 1,
                padding: '1.05rem 0.6rem',
                fontSize: '1.06rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '16px',
                background: '#FFFFFF',
                color: (step !== 'initial' || isRunning) ? '#1E293B' : '#94A3B8',
                border: '1.5px solid #CBD5E1',
                cursor: (step !== 'initial' || isRunning) ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: (step !== 'initial' || isRunning) ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        {/* Observation Summary */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            paddingTop: '0.35rem',
          }}
        >
          <h4
            style={{
              color: '#0F172A',
              margin: 0,
              fontSize: '1.32rem',
              fontWeight: 800,
              fontFamily: "'Inter', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Shapes size={24} color="#0284C7" /> Observation Summary
          </h4>
          <p style={{ margin: 0, color: '#1E293B', fontSize: '1.16rem', lineHeight: 1.62, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Do all magnet shapes exhibit the same concentration of magnetic poles?
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.35rem',
              color: '#475569',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '1.06rem',
              lineHeight: '1.6',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <li>
              <strong style={{ color: '#0F172A' }}>Horseshoe:</strong> Filings cluster tightly at both curved tips.
            </li>
            <li>
              <strong style={{ color: '#0F172A' }}>Ring:</strong> Filings concentrate on opposite circular pole faces.
            </li>
            <li>
              <strong style={{ color: '#0F172A' }}>Bar:</strong> Filings gather heavily at the two distant ends.
            </li>
          </ul>

          <div style={{ marginTop: '0.4rem' }}>
            <button
              onClick={() => {
                if (onComplete) onComplete();
              }}
              style={{
                width: '100%',
                padding: '1.08rem',
                fontSize: '1.15rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                transition: 'all 0.25s ease',
              }}
            >
              <Flag size={22} color="#FFFFFF" /> Finish Activity & Proceed to Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}