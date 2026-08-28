import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows, OrbitControls, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, CheckCircle, RotateCcw, ArrowRight, Compass, BookOpen, Maximize2, Minimize2, Plus, Minus, Sparkles, Navigation, ShieldAlert, Eye } from 'lucide-react';
import * as THREE from 'three';

// -------------------------------------------------------------------
// 1. Realistic 3D Hardwood Stand Assembly
// -------------------------------------------------------------------
function WoodenRetortStand() {
  return (
    <group position={[-4.2, 0, 0]}>
      {/* 1. Heavy Chamfered Hardwood Base */}
      <mesh position={[0, -3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.5, 5.2]} />
        <meshStandardMaterial color="#5C2D12" roughness={0.65} metalness={0.08} />
      </mesh>

      {/* Brass Leveling Feet on Base Corners */}
      {[
        [-2.2, -3.5, -2.2],
        [2.2, -3.5, -2.2],
        [-2.2, -3.5, 2.2],
        [2.2, -3.5, 2.2],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.22, 0.28, 0.18, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}

      {/* Brass Base Collar Mounting Flange */}
      <mesh position={[0, -2.9, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.25, 24]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* 2. Vertical Solid Oak Upright Post */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 7.8, 20]} />
        <meshStandardMaterial color="#6B3410" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Brass Height-Adjustment Clamp Collar */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.6, 20]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Brass Clamp Tightening Thumbscrew Knob */}
      <mesh position={[-0.45, 4.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.45, 16]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* 3. Horizontal Cantilever Arm Extending Over Center */}
      <mesh position={[2.1, 4.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 4.6, 20]} />
        <meshStandardMaterial color="#6B3410" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Brass End Cap & Suspension Eyelet at [4.2, 4.2, 0] (origin in world space is [0, 4.2, 0]) */}
      <group position={[4.2, 4.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.2, 0.05, 16, 32]} />
          <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------------
// 2. Tabletop Cardinal Direction Compass Rose Beneath Suspended Magnet
// -------------------------------------------------------------------
function CardinalCompassRoseTabletop() {
  return (
    <group position={[0, -3.2, 0]}>
      {/* Heavy Circular Marble / Parchment Dial Stage */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[5.2, 5.4, 0.28, 48]} />
        <meshStandardMaterial color="#FBF6E9" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Outer Brass Protective Rim */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[5.25, 5.25, 0.08, 48]} />
        <meshStandardMaterial color="#D97706" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Concentric Calibration Circles */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.4, 4.45, 64]} />
        <meshBasicMaterial color="#78350F" opacity={0.6} transparent />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.84, 64]} />
        <meshBasicMaterial color="#B45309" opacity={0.45} transparent />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.24, 64]} />
        <meshBasicMaterial color="#D97706" opacity={0.4} transparent />
      </mesh>

      {/* North-South Axis Guideline Line (Along Z Axis) */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.02, 8.8]} />
        <meshBasicMaterial color="#DC2626" opacity={0.85} transparent />
      </mesh>

      {/* East-West Axis Guideline Line (Along X Axis) */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[8.8, 0.02, 0.08]} />
        <meshBasicMaterial color="#B45309" opacity={0.65} transparent />
      </mesh>

      {/* Cardinal Labels on Tabletop */}
      {/* North Marker (Red Arrow + N) - In 3D space, North is -Z */}
      <group position={[0, 0.16, -3.8]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.45, 0.8, 3]} />
          <meshStandardMaterial color="#DC2626" roughness={0.4} />
        </mesh>
        <Text
          position={[0, 0.02, -0.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.65}
          color="#DC2626"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          NORTH (N)
        </Text>
      </group>

      {/* South Marker (Blue Arrow + S) - In 3D space, South is +Z */}
      <group position={[0, 0.16, 3.8]}>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI]}>
          <coneGeometry args={[0.45, 0.8, 3]} />
          <meshStandardMaterial color="#2563EB" roughness={0.4} />
        </mesh>
        <Text
          position={[0, 0.02, 0.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.65}
          color="#2563EB"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          SOUTH (S)
        </Text>
      </group>

      {/* East Marker (Amber Arrow + E) - In 3D space, East is +X */}
      <group position={[3.8, 0.16, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.35, 0.65, 3]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
        <Text
          position={[0.6, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.55}
          color="#92400E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          EAST (E)
        </Text>
      </group>

      {/* West Marker (Amber Arrow + W) - In 3D space, West is -X */}
      <group position={[-3.8, 0.16, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <coneGeometry args={[0.35, 0.65, 3]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
        <Text
          position={[-0.6, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.55}
          color="#92400E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          WEST (W)
        </Text>
      </group>
    </group>
  );
}

// -------------------------------------------------------------------
// 3. Luminous Earth Geomagnetic Field Lines (Flux Beams)
// -------------------------------------------------------------------
function EarthMagneticFieldLines({ visible = true }) {
  const linesRef = useRef();

  useFrame((state, delta) => {
    if (!linesRef.current || !visible) return;
    // Gentle pulse shimmer
    const t = state.clock.getElapsedTime();
    linesRef.current.children.forEach((child, idx) => {
      if (child.material) {
        child.material.opacity = 0.35 + 0.15 * Math.sin(t * 2 + idx * 0.8);
      }
    });
  });

  if (!visible) return null;

  return (
    <group ref={linesRef} position={[0, 0, 0]}>
      {/* 5 Curved Magnetic Flux Tubes Flowing South (+Z) to North (-Z) */}
      {[-3.6, -1.8, 0, 1.8, 3.6].map((xOffset, idx) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(xOffset * 1.4, -2.8, 6.5),
          new THREE.Vector3(xOffset * 1.8, 0.2, 3.5),
          new THREE.Vector3(xOffset * 2.0, 1.2, 0),
          new THREE.Vector3(xOffset * 1.8, 0.2, -3.5),
          new THREE.Vector3(xOffset * 1.4, -2.8, -6.5),
        ]);
        const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);

        return (
          <mesh key={idx} geometry={tubeGeom}>
            <meshBasicMaterial
              color="#38BDF8"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------------
// 4. Realistic 3D Suspended Bar Magnet with Drag & Physics Settling
// -------------------------------------------------------------------
function SuspendedMagnet3D({ currentAngle, onPointerDownMagnet, isHovered }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Braided Silk Suspension Thread */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 3.4, 8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Antiqued Brass Suspension Swivel Ring */}
      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[0.22, 0.05, 16, 32]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.25} metalness={0.88} />
      </mesh>

      {/* Rotating 3D Magnet Assembly Attached to Silk Thread */}
      <group
        rotation={[0, currentAngle, 0]}
        onPointerDown={onPointerDownMagnet}
      >
        {/* Invisible Hit Box for Easy User Grab/Drag */}
        <mesh visible={false} position={[0, 0, 0]}>
          <cylinderGeometry args={[5.2, 5.2, 2.5, 24]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* North Half (Points Along -Z When Angle = 0) */}
        <mesh position={[0, 0, -2.2]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 1.25, 4.4]} />
          <meshStandardMaterial
            color="#DC2626"
            roughness={0.45}
            metalness={0.18}
            emissive={isHovered ? '#7F1D1D' : '#000000'}
            emissiveIntensity={isHovered ? 0.4 : 0}
          />
        </mesh>

        {/* North Embossed White Text Top Face */}
        <Text
          position={[0, 0.64, -2.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.72}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          NORTH (N)
        </Text>

        {/* North Side Text */}
        <Text
          position={[0.69, 0, -2.2]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.62}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          N
        </Text>
        <Text
          position={[-0.69, 0, -2.2]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.62}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          N
        </Text>

        {/* South Half (Points Along +Z When Angle = 0) */}
        <mesh position={[0, 0, 2.2]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 1.25, 4.4]} />
          <meshStandardMaterial
            color="#1D4ED8"
            roughness={0.45}
            metalness={0.18}
            emissive={isHovered ? '#1E3A8A' : '#000000'}
            emissiveIntensity={isHovered ? 0.4 : 0}
          />
        </mesh>

        {/* South Embossed White Text Top Face */}
        <Text
          position={[0, 0.64, 2.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.72}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          SOUTH (S)
        </Text>

        {/* South Side Text */}
        <Text
          position={[0.69, 0, 2.2]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.62}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          S
        </Text>
        <Text
          position={[-0.69, 0, 2.2]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.62}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          S
        </Text>

        {/* Dark Dividing Center Seam */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.36, 1.26, 0.08]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>

        {/* Polished Brass Center Clamp Collar */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.42, 1.32, 0.65]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.25} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------------
// 5. Main Stage 1 Component
// -------------------------------------------------------------------
export default function Stage1_Experiment({ onComplete }) {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetAngle, setTargetAngle] = useState(0); // 0 rad = North-South
  const [currentAngle, setCurrentAngle] = useState(0.45);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isHovered, setIsHovered] = useState(false);

  // Physics animation loop values
  const currentAngleRef = useRef(0.45);
  const targetAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);

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

  // Zoom handlers
  const handleZoomIn = () => setZoomScale((z) => Math.min(1.8, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomScale((z) => Math.max(0.5, +(z - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomScale(1.0);

  // Pointer drag interactions to manually rotate the magnet
  useEffect(() => {
    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;
      currentAngleRef.current += deltaX * 0.015;
      velocityRef.current = deltaX * 0.4;
      setCurrentAngle(currentAngleRef.current);
    };

    const onPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = 'auto';
        setSpinCount((prev) => prev + 1);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  // Continuous physics engine tick
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!isDraggingRef.current) {
        // Natural damped harmonic restoring torque toward North-South (0 rad modulo 2pi)
        const springK = 6.2;
        const damping = 0.88;
        
        // Find shortest angular distance to alignment (0 or Math.PI)
        let diff = currentAngleRef.current % (Math.PI * 2);
        if (diff > Math.PI) diff -= Math.PI * 2;
        if (diff < -Math.PI) diff += Math.PI * 2;

        const force = -springK * diff;
        velocityRef.current = (velocityRef.current + force * dt) * Math.pow(damping, dt * 60);
        currentAngleRef.current += velocityRef.current * dt;
        setCurrentAngle(currentAngleRef.current);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerDownMagnet = (e) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    velocityRef.current = 0;
    document.body.style.cursor = 'grabbing';
  };

  // Impulse Actions
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const extraImpulse = (Math.random() > 0.5 ? 1 : -1) * (18 + Math.random() * 12);
    velocityRef.current = extraImpulse;
    setSpinCount((prev) => prev + 1);

    setTimeout(() => {
      setIsSpinning(false);
    }, 2400);
  };

  const handleDeflectEast = () => {
    velocityRef.current = 8.5;
    currentAngleRef.current = Math.PI / 2;
    setCurrentAngle(Math.PI / 2);
    setSpinCount((prev) => prev + 1);
  };

  const handleDeflectWest = () => {
    velocityRef.current = -8.5;
    currentAngleRef.current = -Math.PI / 2;
    setCurrentAngle(-Math.PI / 2);
    setSpinCount((prev) => prev + 1);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
    if (answer === 'yes') {
      setShowFeedbackModal(true);
    }
  };

  const handleReset = () => {
    setSpinCount(0);
    setIsSpinning(false);
    currentAngleRef.current = 0.55;
    velocityRef.current = 0;
    setCurrentAngle(0.55);
    setQuizAnswer(null);
    setShowFeedbackModal(false);
  };

  const isCompleted = spinCount >= 1 && quizAnswer === 'yes';

  // Calculate alignment degrees from North (0 - 180)
  const degFromNorth = Math.round(
    (Math.abs(currentAngleRef.current % Math.PI) * 180) / Math.PI
  );
  const isAligned = degFromNorth < 4 || degFromNorth > 176;

  return (
    <div style={{
      padding: '0.5rem',
      display: 'flex',
      gap: '1.25rem',
      height: '100%',
      minHeight: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
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
                background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
              }}>
                <CheckCircle size={36} color="#059669" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064E3B' }}>
                  Observation Verified!
                </h3>
                <p style={{ margin: 0, color: '#334155', fontSize: '1.02rem', lineHeight: 1.6, fontWeight: 700 }}>
                  🎉 Correct! A freely suspended magnet always comes to rest pointing along the North-South axis.
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

      {/* Left Side: 3D Interactive Lab Setup */}
      <div style={{
        flex: '1.8',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Activity Canvas Scene Area */}
        <div style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: '380px',
          borderRadius: '24px',
          border: '1.5px solid #A7F3D0',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)',
          backgroundImage: `url('/SuspendedMagnet/wooden_stand_lab_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {/* Top Left Floating Dynamic Heading Badge */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '16px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              background: isAligned
                ? 'linear-gradient(135deg, #065F46 0%, #047857 100%)'
                : 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
              border: isAligned ? '1.5px solid #34D399' : '1.5px solid #F59E0B',
              borderRadius: '20px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease'
            }}>
              <Compass size={16} color={isAligned ? '#34D399' : '#F59E0B'} />
              <span>
                {isAligned ? 'HEADING: ALIGNED TO NORTH-SOUTH' : `DEFLECTED: ${degFromNorth}° OFF AXIS`}
              </span>
            </div>
          </div>

          {/* Bottom Overlay Pill Buttons on Canvas */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            zIndex: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none'
          }}>
            {/* Quick Deflect Shortcuts */}
            <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
              <button
                onClick={handleDeflectWest}
                title="Deflect to West"
                style={{
                  background: 'rgba(15, 23, 42, 0.82)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '7px 12px',
                  color: '#F8FAFC',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                ◀ Deflect West
              </button>

              <button
                onClick={handleDeflectEast}
                title="Deflect to East"
                style={{
                  background: 'rgba(15, 23, 42, 0.82)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '7px 12px',
                  color: '#F8FAFC',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                Deflect East ▶
              </button>
            </div>

            {/* Earth Field Lines Toggle */}
            <div style={{ pointerEvents: 'auto' }}>
              <button
                onClick={() => setShowFieldLines(!showFieldLines)}
                style={{
                  background: showFieldLines
                    ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
                    : 'rgba(15, 23, 42, 0.82)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '7px 14px',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(8px)',
                  boxShadow: showFieldLines ? '0 4px 14px rgba(2, 132, 199, 0.4)' : 'none'
                }}
              >
                <Sparkles size={14} color="#FDE047" />
                <span>Field Lines: {showFieldLines ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <Canvas
            shadows
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 2.5, 18], fov: 42 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.85} />
              <directionalLight
                position={[10, 20, 12]}
                intensity={1.8}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-10, 8, -10]} intensity={0.4} color="#93C5FD" />
              <directionalLight position={[0, -5, 10]} intensity={0.3} color="#FDE68A" />

              <group scale={[zoomScale * 0.9, zoomScale * 0.9, zoomScale * 0.9]} position={[0, -0.2, 0]}>
                {/* 1. Realistic Hardwood Retort Stand */}
                <WoodenRetortStand />

                {/* 2. Tabletop Cardinal Compass Rose Stage */}
                <CardinalCompassRoseTabletop />

                {/* 3. Earth's Magnetic Streamlines */}
                <EarthMagneticFieldLines visible={showFieldLines} />

                {/* 4. Realistic Suspended Bar Magnet Assembly */}
                <SuspendedMagnet3D
                  currentAngle={currentAngle}
                  onPointerDownMagnet={handlePointerDownMagnet}
                  isHovered={isHovered}
                />

                {/* Drop Shadows */}
                <ContactShadows position={[0, -3.2, 0]} opacity={0.65} scale={18} blur={2.4} far={8} color="#000000" />
              </group>

              <OrbitControls
                makeDefault
                enablePan={false}
                maxPolarAngle={Math.PI / 2.05}
                minPolarAngle={0.15}
                minDistance={6}
                maxDistance={38}
                target={[0, 0.2, 0]}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Right Side: Guide & Control Panel */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <BookOpen size={26} color="#059669" />
              <h3 style={{ margin: 0, fontSize: '1.38rem', color: '#064E3B', fontWeight: 900 }}>
                Stage 1: Experiment
              </h3>
            </div>
            <span style={{
              background: '#DCFCE7',
              color: '#15803D',
              fontWeight: 800,
              fontSize: '0.88rem',
              padding: '0.35rem 0.8rem',
              borderRadius: '12px',
              border: '1.5px solid #86EFAC'
            }}>
              Step {spinCount >= 1 ? (quizAnswer === 'yes' ? 3 : 2) : 1} of 3
            </span>
          </div>

          {/* All 3 Steps Visible From Initial Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              {
                stepNum: 1,
                title: '1. Rotate Suspended Magnet',
                desc: 'Click "Rotate Magnet" or drag the magnet directly in 3D to deflect it.'
              },
              {
                stepNum: 2,
                title: '2. Observe Natural Alignment',
                desc: 'Watch the magnet oscillate and settle along the North-South axis.'
              },
              {
                stepNum: 3,
                title: '3. Verify Quick Check',
                desc: 'Answer the Quick Check question below to confirm your observation.'
              }
            ].map((s) => {
              const currentStepNum = spinCount >= 1 ? (quizAnswer === 'yes' ? 3 : 2) : 1;
              const isCurrent = currentStepNum === s.stepNum;
              const isPast = currentStepNum > s.stepNum || (s.stepNum === 3 && quizAnswer === 'yes');

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
                        background: isCurrent ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : isPast ? '#047857' : '#64748B',
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
                        color: isCurrent ? '#064E3B' : isPast ? '#047857' : '#1E293B' 
                      }}>
                        {s.title}
                      </span>
                    </div>
                    {isPast && <CheckCircle size={22} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.2rem 0 0 2.5rem', fontSize: '1.02rem', color: '#065F46', lineHeight: 1.55, fontWeight: 600 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Controls Row */}
          <div style={{ width: '100%', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={!isSpinning ? 'gold-glow-btn' : ''}
              style={{
                flex: 1.4,
                padding: '0.95rem 1rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.55rem',
                background: isSpinning ? '#F1F5F9' : undefined,
                color: isSpinning ? '#94A3B8' : '#FFFFFF',
                border: 'none',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCw size={18} className={isSpinning ? 'spin-anim' : ''} /> {isSpinning ? 'Spinning...' : 'Rotate Magnet'}
            </button>

            <button
              onClick={handleReset}
              style={{
                flex: 0.8,
                padding: '0.95rem 0.8rem',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#FFFFFF',
                color: '#064E3B',
                border: '1.5px solid #FDE68A',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={17} color="#064E3B" /> Restart
            </button>
          </div>
        </div>

        {/* Observation Question Card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          paddingTop: '0.35rem'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064E3B', lineHeight: 1.55 }}>
            Quick Check: Does a freely suspended magnet always settle in the North-South direction?
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleQuizAnswer('yes')}
              style={{
                flex: 1,
                padding: '0.85rem 0.6rem',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: quizAnswer === 'yes' ? '#DCFCE7' : '#FFFFFF',
                color: quizAnswer === 'yes' ? '#065F46' : '#064E3B',
                border: quizAnswer === 'yes' ? '1.5px solid #10B981' : '1.5px solid #FDE68A',
                boxShadow: quizAnswer === 'yes' ? '0 3px 10px rgba(16, 185, 129, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Yes, Always! ✓
            </button>
            <button
              onClick={() => handleQuizAnswer('no')}
              style={{
                flex: 1,
                padding: '0.85rem 0.6rem',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: quizAnswer === 'no' ? '#FEE2E2' : '#FFFFFF',
                color: quizAnswer === 'no' ? '#991B1B' : '#064E3B',
                border: quizAnswer === 'no' ? '1.5px solid #EF4444' : '1.5px solid #FDE68A',
                transition: 'all 0.2s ease'
              }}
            >
              No ✗
            </button>
          </div>

          {/* Proceed Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 800 }}>
              Stage 1 of 2 ● ○
            </span>

            <button
              onClick={onComplete}
              disabled={!isCompleted}
              className={isCompleted ? 'gold-glow-btn' : ''}
              style={{
                padding: '0.85rem 2.2rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '20px',
                background: isCompleted ? undefined : '#F1F5F9',
                color: isCompleted ? '#FFFFFF' : '#94A3B8',
                border: isCompleted ? 'none' : '1.5px solid #CBD5E1',
                cursor: isCompleted ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              Next <ArrowRight size={18} color={isCompleted ? '#FFFFFF' : '#94A3B8'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}