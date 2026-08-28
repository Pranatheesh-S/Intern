import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, ContactShadows, Environment, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, AlertCircle, CheckCircle, XCircle, ArrowRight, BookOpen, RotateCcw, Maximize2, Minimize2, Plus, Minus } from 'lucide-react';
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
// Rotatable System for Magnet
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
      {/* Invisible hit cylinder around magnet to catch drag gestures */}
      <mesh visible={false} position={[0, 2.2, 0]}>
        <cylinderGeometry args={[11, 11, 4.5, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {children}
    </group>
  );
}

// 3D Breaking Magnet Component exactly matching Stage 1 Magnet (14.0 x 1.5 x 2.2) and Paper (30 x 0.04 x 18)
function BreakingMagnet3D({ broken, showPoles }) {
  const leftGroupRef = useRef();
  const rightGroupRef = useRef();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    // Smooth separation animation along X axis
    const targetLeftX = broken ? -3.5 : 0;
    const targetRightX = broken ? 3.5 : 0;

    if (leftGroupRef.current) {
      leftGroupRef.current.position.x = THREE.MathUtils.lerp(
        leftGroupRef.current.position.x,
        targetLeftX,
        dt * 6
      );
    }
    if (rightGroupRef.current) {
      rightGroupRef.current.position.x = THREE.MathUtils.lerp(
        rightGroupRef.current.position.x,
        targetRightX,
        dt * 6
      );
    }
  });

  return (
    <group position={[0, 2.5, 0]}>
      {/* ---------------- LEFT PIECE (Length: 6.0, Height: 1.3, Depth: 1.9) ---------------- */}
      <group ref={leftGroupRef} position={[0, 0, 0]}>
        {/* Left Sub-Half: North Pole (3.0 length) */}
        <mesh position={[-4.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 1.3, 1.9]} />
          <meshStandardMaterial color="#C51E28" roughness={0.55} metalness={0.12} />
        </mesh>
        
        {/* North Pole Letter */}
        <Text
          position={[-4.2, 0.66, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.95}
          color="#FFFFFF"
          fontWeight="bold"
        >
          N
        </Text>

        {/* Left Sub-Half: Body turns into South Pole upon reveal (3.0 length) */}
        <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 1.3, 1.9]} />
          <meshStandardMaterial
            color={showPoles ? '#1848B8' : '#C51E28'}
            roughness={0.55}
            metalness={0.12}
          />
        </mesh>

        {/* New South Pole Letter on Left Piece cut edge */}
        {showPoles && (
          <Text
            position={[-1.5, 0.66, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.95}
            color="#FFFFFF"
            fontWeight="bold"
          >
            S
          </Text>
        )}
      </group>

      {/* ---------------- RIGHT PIECE (Length: 6.0, Height: 1.3, Depth: 1.9) ---------------- */}
      <group ref={rightGroupRef} position={[0, 0, 0]}>
        {/* Right Sub-Half: Body turns into North Pole upon reveal (3.0 length) */}
        <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 1.3, 1.9]} />
          <meshStandardMaterial
            color={showPoles ? '#C51E28' : '#1848B8'}
            roughness={0.55}
            metalness={0.12}
          />
        </mesh>

        {/* New North Pole Letter on Right Piece cut edge */}
        {showPoles && (
          <Text
            position={[1.5, 0.66, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.95}
            color="#FFFFFF"
            fontWeight="bold"
          >
            N
          </Text>
        )}

        {/* Right Sub-Half: South Pole (3.0 length) */}
        <mesh position={[4.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 1.3, 1.9]} />
          <meshStandardMaterial color="#1848B8" roughness={0.55} metalness={0.12} />
        </mesh>

        {/* South Pole Letter */}
        <Text
          position={[4.2, 0.66, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.95}
          color="#FFFFFF"
          fontWeight="bold"
        >
          S
        </Text>
      </group>

      {/* Center Dividing Seam (Exact dimension: 0.06 x 1.31 x 1.91) */}
      {!broken && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 1.31, 1.91]} />
          <meshStandardMaterial color="#111827" roughness={0.7} />
        </mesh>
      )}
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

export default function Stage2_BreakingMagnet({ onComplete }) {
  const [broken, setBroken] = useState(false);
  const [showPoles, setShowPoles] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
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

  const handleBreak = () => {
    setBroken(true);
  };

  const handleShowPoles = () => {
    setShowPoles(true);
  };

  const handleReset = () => {
    setBroken(false);
    setShowPoles(false);
    setQuizAnswer(null);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
  };

  const handleNextSection = () => {
    if (onComplete) onComplete();
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
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      {/* Left Side: 3D Canvas Interactive Area matching Stage 1 background and sizing */}
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
          {/* Top-left Lab Badge */}
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

          {/* 3D Canvas Scene matching Stage 1 Camera, Lighting, and Controls */}
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
                  <BreakingMagnet3D broken={broken} showPoles={showPoles} />
                </RotatableMagnetGroup>
                <PaperBoxEnclosure />

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

      {/* Right Side: Control Panel (Activity 4.3 Theme - Cream Background) */}
      <div
        style={{
          flex: '1.15',
          background: '#FFFDD0',
          border: '1.5px solid #EFE4B0',
          borderRadius: '24px',
          padding: '1.5rem 1.6rem',
          boxShadow: '0 4px 20px rgba(180, 160, 100, 0.08)',
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
              <Scissors size={28} color="#0284C7" />
              <h3 style={{ margin: 0, fontSize: '1.52rem', color: '#0F172A', fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                Stage 2: Breaking Magnet
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
              Step {broken && showPoles ? 3 : broken ? 2 : 1} of 3
            </span>
          </div>

          {/* All 3 Steps Visible From Initial Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              {
                stepNum: 1,
                title: '1. Break the Bar Magnet',
                desc: 'Click "1. Break" to cut the 3D bar magnet directly in half.'
              },
              {
                stepNum: 2,
                title: '2. Reveal New Magnetic Poles',
                desc: 'Click "2. Show Poles" to reveal magnetic polarity at the newly cut inner ends.'
              },
              {
                stepNum: 3,
                title: '3. Observe Magnetic Dipoles',
                desc: 'Notice that each half automatically forms a complete magnet with North (N) and South (S) poles.'
              }
            ].map((s) => {
              const currentStepNum = broken && showPoles ? 3 : broken ? 2 : 1;
              const isCurrent = currentStepNum === s.stepNum;
              const isPast = currentStepNum > s.stepNum || (s.stepNum === 3 && broken && showPoles && quizAnswer === 'no');

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

          {/* Action Controls */}
          <div style={{ width: '100%', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
            <button
              onClick={handleBreak}
              disabled={broken}
              style={{
                flex: 1,
                padding: '1.05rem 0.6rem',
                fontSize: '1.14rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '16px',
                background: !broken ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : '#F1F5F9',
                color: !broken ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: !broken ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: !broken ? '0 4px 14px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Scissors size={18} /> 1. Break
            </button>

            <button
              onClick={handleShowPoles}
              disabled={!broken || showPoles}
              style={{
                flex: 1,
                padding: '1.05rem 0.6rem',
                fontSize: '1.14rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '16px',
                background: broken && !showPoles ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : '#F1F5F9',
                color: broken && !showPoles ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: broken && !showPoles ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: broken && !showPoles ? '0 4px 14px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              🧲 {showPoles ? 'Poles Shown ✓' : '2. Show Poles'}
            </button>

            <button
              onClick={handleReset}
              disabled={!broken}
              style={{
                flex: 1,
                padding: '1.05rem 0.6rem',
                fontSize: '1.06rem',
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '16px',
                background: '#FFFFFF',
                color: broken ? '#1E293B' : '#94A3B8',
                border: '1.5px solid #CBD5E1',
                cursor: broken ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.2s ease',
              }}
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        {/* Observation & Conclusion Quiz */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            paddingTop: '0.35rem'
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
            <AlertCircle size={26} color="#0284C7" /> Observation & Conclusion
          </h4>
          <p style={{ margin: 0, color: '#1E293B', fontSize: '1.16rem', lineHeight: 1.62, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Based on what happens when a magnet breaks, is it possible to obtain a magnet with only a single pole?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => handleQuizAnswer('yes')}
              style={{
                padding: '1.05rem 1.3rem',
                textAlign: 'left',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '14px',
                cursor: 'pointer',
                background: quizAnswer === 'yes' ? '#FEE2E2' : '#FFFFFF',
                borderColor: quizAnswer === 'yes' ? '#EF4444' : '#CBD5E1',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: quizAnswer === 'yes' ? '#991B1B' : '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>A) Yes, we can isolate a single North or South pole</span>
              {quizAnswer === 'yes' && <XCircle size={22} color="#EF4444" />}
            </button>

            <button
              onClick={() => handleQuizAnswer('no')}
              style={{
                padding: '1.05rem 1.3rem',
                textAlign: 'left',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '14px',
                cursor: 'pointer',
                background: quizAnswer === 'no' ? '#DCFCE7' : '#FFFFFF',
                borderColor: quizAnswer === 'no' ? '#16A34A' : '#CBD5E1',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: quizAnswer === 'no' ? '#065F46' : '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>B) No, a single isolated pole cannot exist</span>
              {quizAnswer === 'no' && <CheckCircle size={22} color="#16A34A" />}
            </button>
          </div>

          {/* Proceed Button */}
          {(() => {
            const isReadyToProceed = broken && showPoles && quizAnswer === 'no';
            return (
              <button
                onClick={handleNextSection}
                disabled={!isReadyToProceed}
                style={{
                  width: '100%',
                  padding: '1.08rem',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: '16px',
                  background: isReadyToProceed
                    ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
                    : '#F1F5F9',
                  color: isReadyToProceed ? '#FFFFFF' : '#94A3B8',
                  border: isReadyToProceed ? 'none' : '1.5px solid #CBD5E1',
                  cursor: isReadyToProceed ? 'pointer' : 'not-allowed',
                  boxShadow: isReadyToProceed ? '0 4px 16px rgba(2, 132, 199, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.25s ease',
                }}
              >
                Proceed to Stage 3{' '}
                <ArrowRight size={22} color={isReadyToProceed ? '#FFFFFF' : '#94A3B8'} />
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}