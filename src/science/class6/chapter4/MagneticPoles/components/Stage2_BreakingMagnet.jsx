import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, ContactShadows, Environment, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, AlertCircle, CheckCircle, XCircle, ArrowRight, BookOpen, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
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
function AnimatedLabGroup({ children }) {
  const groupRef = useRef();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.1);

    // Initial: Positioned on the left tabletop parallel to the compass & ruler on the right
    const targetX = hasStarted ? 0 : -4.8;
    const targetY = hasStarted ? -0.5 : -4.2;
    const targetZ = hasStarted ? 0 : 6.5;
    const targetScale = hasStarted ? 1.0 : 0.22;

    const speed = 3.4;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, dt * speed);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, dt * speed);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, dt * speed);

    const currentScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, dt * speed);
    groupRef.current.scale.set(nextScale, nextScale, nextScale);
  });

  return (
    <group ref={groupRef} position={[-4.8, -4.2, 6.5]} scale={[0.22, 0.22, 0.22]}>
      {children}
    </group>
  );
}

export default function Stage2_BreakingMagnet({ onComplete }) {
  const [broken, setBroken] = useState(false);
  const [showPoles, setShowPoles] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
          {/* Small Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              zIndex: 30,
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              padding: '7px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#0F172A',
              fontSize: '0.78rem',
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.2s ease',
            }}
          >
            {isFullscreen ? <Minimize2 size={15} color="#0F172A" /> : <Maximize2 size={15} color="#0F172A" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {/* 3D Canvas Scene matching Stage 1 Camera, Lighting, and Controls */}
          <Canvas
            shadows
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 5, 24], fov: 45 }}
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

              <AnimatedLabGroup>
                <RotatableMagnetGroup>
                  <BreakingMagnet3D broken={broken} showPoles={showPoles} />
                </RotatableMagnetGroup>
                <PaperBoxEnclosure />

                {/* Soft Drop Shadow under Paper */}
                <ContactShadows position={[0, -0.08, 0]} opacity={0.65} scale={32} blur={2.2} far={4} color="#000000" />
              </AnimatedLabGroup>
              <OrbitControls
                makeDefault
                target={[0, 1.2, 0]}
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

      {/* Right Side: Control Panel */}
      <div
        style={{
          flex: '0.9',
          background: '#FFFFFF',
          border: '1.5px solid #A7F3D0',
          borderRadius: '20px',
          padding: '1.4rem 1.5rem',
          boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.1rem',
          minWidth: 0,
          overflowY: 'auto',
        }}
      >
        {/* Step Instructions */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1.5px solid #CBD5E1',
            borderRadius: '18px',
            padding: '1.3rem 1.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              color: '#064E3B',
              fontWeight: 900,
              fontSize: '1.1rem',
            }}
          >
            <BookOpen size={22} color="#047857" />
            <span>
              {!broken && 'Step 1: Break the Magnet'}
              {broken && !showPoles && 'Step 2: Reveal New Poles'}
              {broken && showPoles && 'Step 3: Make Your Observation'}
            </span>
          </div>
          <p style={{ margin: 0, color: '#334155', fontSize: '0.96rem', lineHeight: 1.6, fontWeight: 600 }}>
            {!broken && 'Click the "1. Break" button below to cut the 3D magnet directly in half.'}
            {broken && !showPoles && 'Click the "2. Show Poles" button to reveal magnetic polarity at the newly cut ends.'}
            {broken && showPoles && 'Notice that each half automatically forms a complete magnet with North (N) and South (S) poles.'}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ width: '100%', display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={handleBreak}
            disabled={broken}
            style={{
              flex: 1,
              padding: '0.85rem 0.4rem',
              fontSize: '0.9rem',
              fontWeight: 900,
              borderRadius: '14px',
              background: !broken ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
              color: !broken ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              cursor: !broken ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: !broken ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
            }}
          >
            <Scissors size={15} /> 1. Break
          </button>

          <button
            onClick={handleShowPoles}
            disabled={!broken || showPoles}
            style={{
              flex: 1,
              padding: '0.85rem 0.4rem',
              fontSize: '0.9rem',
              fontWeight: 900,
              borderRadius: '14px',
              background: broken && !showPoles ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
              color: broken && !showPoles ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              cursor: broken && !showPoles ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: broken && !showPoles ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
            }}
          >
            🧲 {showPoles ? 'Poles Shown ✓' : '2. Show Poles'}
          </button>

          <button
            onClick={handleReset}
            disabled={!broken}
            style={{
              flex: 1,
              padding: '0.85rem 0.4rem',
              fontSize: '0.9rem',
              fontWeight: 900,
              borderRadius: '14px',
              background: '#FFFFFF',
              color: broken ? '#1E293B' : '#94A3B8',
              border: '1.5px solid #CBD5E1',
              cursor: broken ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>

        {/* Observation & Conclusion Quiz */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: '#F0FDF4',
              border: '1.5px solid #A7F3D0',
              borderRadius: '20px',
              padding: '1.3rem 1.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 4px 14px rgba(6, 78, 59, 0.05)',
            }}
          >
            <h4
              style={{
                color: '#064E3B',
                margin: 0,
                fontSize: '1.12rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={22} color="#D97706" /> Observation & Conclusion
            </h4>
            <p style={{ margin: 0, color: '#1E293B', fontSize: '0.96rem', lineHeight: 1.55, fontWeight: 700 }}>
              Based on what happens when a magnet breaks, is it possible to obtain a magnet with only a single pole?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={() => handleQuizAnswer('yes')}
                style={{
                  padding: '0.9rem 1.1rem',
                  textAlign: 'left',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  background: quizAnswer === 'yes' ? '#FEE2E2' : '#FFFFFF',
                  borderColor: quizAnswer === 'yes' ? '#EF4444' : '#CBD5E1',
                  borderWidth: '1.5px',
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
                {quizAnswer === 'yes' && <XCircle size={18} color="#EF4444" />}
              </button>

              <button
                onClick={() => handleQuizAnswer('no')}
                style={{
                  padding: '0.9rem 1.1rem',
                  textAlign: 'left',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  background: quizAnswer === 'no' ? '#DCFCE7' : '#FFFFFF',
                  borderColor: quizAnswer === 'no' ? '#16A34A' : '#CBD5E1',
                  borderWidth: '1.5px',
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
                {quizAnswer === 'no' && <CheckCircle size={18} color="#16A34A" />}
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
                    padding: '0.9rem',
                    fontSize: '1rem',
                    fontWeight: 900,
                    borderRadius: '16px',
                    background: isReadyToProceed
                      ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                      : '#F1F5F9',
                    color: isReadyToProceed ? '#FFFFFF' : '#94A3B8',
                    border: isReadyToProceed ? 'none' : '1.5px solid #CBD5E1',
                    cursor: isReadyToProceed ? 'pointer' : 'not-allowed',
                    boxShadow: isReadyToProceed ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.25s ease',
                  }}
                >
                  Proceed to Stage 3{' '}
                  <ArrowRight size={18} color={isReadyToProceed ? '#FFFFFF' : '#94A3B8'} />
                </button>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}