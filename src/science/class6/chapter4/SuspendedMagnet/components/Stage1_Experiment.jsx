import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, CheckCircle, XCircle, RotateCcw, ArrowRight, Compass, BookOpen, Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';

// -------------------------------------------------------------------
// 1. Realistic 3D Suspended Bar Magnet with Smooth Physics Swing
// -------------------------------------------------------------------
function SuspendedMagnet3D({ targetRotation, isSpinning }) {
  const magnetGroupRef = useRef();
  const currentAngle = useRef(0.25);
  const velocity = useRef(0);

  const { frontTexture, topTexture, redEndTexture, blueEndTexture } = useMemo(() => {
    const loader = new THREE.TextureLoader();

    // 1. Front and Back Faces Texture (featuring "NORTH" and "SOUTH" labels)
    const front = loader.load('/SuspendedMagnet/bar_magnet_front.png');
    front.colorSpace = THREE.SRGBColorSpace;
    front.anisotropy = 8;

    // 2. Top Face Texture (featuring the magnetic field line pattern)
    const top = loader.load('/SuspendedMagnet/bar_magnet_top.png');
    top.colorSpace = THREE.SRGBColorSpace;
    top.anisotropy = 8;

    // 3. North End Cap (cropped solid red section from the first image)
    const redCap = loader.load('/SuspendedMagnet/bar_magnet_front.png', (tex) => {
      try {
        const img = tex.image;
        if (!img) return;
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        // Sample from the solid red North half
        ctx.drawImage(img, 80, 25, 120, 65, 0, 0, 128, 128);
        redCap.image = canvas;
        redCap.needsUpdate = true;
      } catch (e) {
        console.error('Error cropping red end cap:', e);
      }
    });
    redCap.colorSpace = THREE.SRGBColorSpace;

    // 4. South End Cap (cropped solid blue section from the first image)
    const blueCap = loader.load('/SuspendedMagnet/bar_magnet_front.png', (tex) => {
      try {
        const img = tex.image;
        if (!img) return;
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        // Sample from the solid blue South half
        ctx.drawImage(img, 820, 25, 120, 65, 0, 0, 128, 128);
        blueCap.image = canvas;
        blueCap.needsUpdate = true;
      } catch (e) {
        console.error('Error cropping blue end cap:', e);
      }
    });
    blueCap.colorSpace = THREE.SRGBColorSpace;

    return { frontTexture: front, topTexture: top, redEndTexture: redCap, blueEndTexture: blueCap };
  }, []);

  useFrame((state, delta) => {
    if (!magnetGroupRef.current) return;
    const dt = Math.min(delta, 0.1);

    if (isSpinning) {
      currentAngle.current = THREE.MathUtils.lerp(currentAngle.current, targetRotation, dt * 2.8);
      magnetGroupRef.current.rotation.y = currentAngle.current;
    } else {
      // Natural harmonic settling oscillation towards North-South (0 rad)
      const springK = 7.0;
      const damping = 0.86;
      const force = -springK * currentAngle.current;
      velocity.current = (velocity.current + force * dt) * Math.pow(damping, dt * 60);
      currentAngle.current += velocity.current * dt;
      magnetGroupRef.current.rotation.y = currentAngle.current;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Braided Hanging Suspension Thread */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 5.8, 12]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.45} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Antiqued Brass Suspension Hook Ring */}
      <mesh position={[0, 0.95, 0]}>
        <torusGeometry args={[0.2, 0.045, 16, 32]} />
        <meshStandardMaterial color="#FDE047" emissive="#CA8A04" emissiveIntensity={0.35} roughness={0.18} metalness={0.9} />
      </mesh>

      {/* Rotating 3D Magnet Assembly */}
      <group ref={magnetGroupRef}>
        {/* Dedicated Cinematic Local Lighting with Enhanced Shimmer */}
        <pointLight position={[-3.1, 0.5, 3.2]} intensity={5.2} color="#FF6B6B" distance={18} />
        <pointLight position={[3.1, 0.5, 3.2]} intensity={5.2} color="#60A5FA" distance={18} />
        <pointLight position={[0, 2.5, 3.5]} intensity={4.5} color="#FFFFFF" distance={20} />
        <pointLight position={[0, -2.0, 2.8]} intensity={2.8} color="#FFFBEB" distance={16} />
        <pointLight position={[-3.1, 0.5, -3.2]} intensity={4.0} color="#FF4444" distance={16} />
        <pointLight position={[3.1, 0.5, -3.2]} intensity={4.0} color="#3B82F6" distance={16} />

        {/* North Half Core - High-Saturation Crimson Red with Emissive Luster */}
        <mesh position={[-3.1, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 1.35, 1.9]} />
          <meshStandardMaterial
            color="#DC2626"
            emissive="#EF4444"
            emissiveIntensity={0.36}
            roughness={0.18}
            metalness={0.35}
          />
        </mesh>

        {/* South Half Core - High-Saturation Cobalt Blue with Emissive Luster */}
        <mesh position={[3.1, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 1.35, 1.9]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#3B82F6"
            emissiveIntensity={0.36}
            roughness={0.18}
            metalness={0.35}
          />
        </mesh>

        {/* Dark Dividing Seam */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 1.36, 1.91]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>

        {/* Front Face: First Image (NORTH and SOUTH labels) with Emissive Brilliance and Metallic Sheen */}
        <mesh position={[0, 0, 0.958]} castShadow receiveShadow>
          <planeGeometry args={[12.4, 1.35]} />
          <meshStandardMaterial
            map={frontTexture}
            emissiveMap={frontTexture}
            emissive="#FFFFFF"
            emissiveIntensity={0.32}
            roughness={0.15}
            metalness={0.42}
          />
        </mesh>

        {/* Back Face: First Image with Emissive Brilliance and Metallic Sheen */}
        <mesh position={[0, 0, -0.958]} rotation={[0, Math.PI, 0]} scale={[-1, 1, 1]} castShadow receiveShadow>
          <planeGeometry args={[12.4, 1.35]} />
          <meshStandardMaterial
            map={frontTexture}
            emissiveMap={frontTexture}
            emissive="#FFFFFF"
            emissiveIntensity={0.32}
            roughness={0.15}
            metalness={0.42}
          />
        </mesh>

        {/* Top Face: Second Image (Magnetic Field Lines) with Vibrant Emissive Glow */}
        <mesh position={[0, 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[12.4, 1.9]} />
          <meshStandardMaterial
            map={topTexture}
            emissiveMap={topTexture}
            emissive="#FFFFFF"
            emissiveIntensity={0.35}
            roughness={0.16}
            metalness={0.42}
          />
        </mesh>

        {/* Bottom Face: Clean Base Finish with Matching Glow */}
        <mesh position={[0, -0.68, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[12.4, 1.9]} />
          <meshStandardMaterial
            map={topTexture}
            emissiveMap={topTexture}
            emissive="#FFFFFF"
            emissiveIntensity={0.25}
            roughness={0.18}
            metalness={0.4}
          />
        </mesh>

        {/* North End Cap: Cropped Solid Red Section with Vibrant Emissive Glow */}
        <mesh position={[-6.205, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
          <planeGeometry args={[1.9, 1.35]} />
          <meshStandardMaterial
            map={redEndTexture}
            color="#DC2626"
            emissive="#EF4444"
            emissiveIntensity={0.38}
            roughness={0.18}
            metalness={0.35}
          />
        </mesh>

        {/* South End Cap: Cropped Solid Blue Section with Vibrant Emissive Glow */}
        <mesh position={[6.205, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <planeGeometry args={[1.9, 1.35]} />
          <meshStandardMaterial
            map={blueEndTexture}
            color="#2563EB"
            emissive="#3B82F6"
            emissiveIntensity={0.38}
            roughness={0.18}
            metalness={0.35}
          />
        </mesh>

        {/* Subtle Cinematic Pole Aura Sheen */}
        <mesh position={[-3.1, 0, 0]}>
          <boxGeometry args={[6.28, 1.42, 1.98]} />
          <meshBasicMaterial
            color="#EF4444"
            transparent={true}
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[3.1, 0, 0]}>
          <boxGeometry args={[6.28, 1.42, 1.98]} />
          <meshBasicMaterial
            color="#3B82F6"
            transparent={true}
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Polished Gold Center Clamp Collar with Mirror Shimmer */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 1.38, 1.94]} />
          <meshStandardMaterial
            color="#FBBF24"
            emissive="#D97706"
            emissiveIntensity={0.45}
            roughness={0.08}
            metalness={0.96}
          />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------------
// 2. Main Stage 1 Component
// -------------------------------------------------------------------
export default function Stage1_Experiment({ onComplete }) {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0.25);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Spin 3+ rotations, then settle to 0 (North-South)
    const extraSpins = (Math.floor(Math.random() * 2) + 3) * Math.PI * 2;
    setTargetRotation(targetRotation + extraSpins);

    setTimeout(() => {
      setIsSpinning(false);
      setTargetRotation(0);
      setSpinCount(prev => prev + 1);
    }, 2800);
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
    setTargetRotation(0.25);
    setQuizAnswer(null);
    setShowFeedbackModal(false);
  };

  // Enable next button once question is answered without waiting for experiment to complete
  const isCompleted = quizAnswer !== null;

  return (
    <div style={{
      padding: '0.5rem',
      display: 'flex',
      gap: '1.25rem',
      height: '100%',
      minHeight: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
      position: 'relative'
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
                  🎉 Correct! A freely suspended magnet always comes to rest pointing in the North-South direction.
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
          {/* Top Left Floating Badge Overlay */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
              border: '1.5px solid #B45309',
              borderRadius: '20px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 900,
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(69, 26, 3, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <Compass size={16} color="#F59E0B" /> HEADING: NORTH-SOUTH
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              zIndex: 30,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#0F172A',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            {isFullscreen ? <Minimize2 size={15} color="#0F172A" /> : <Maximize2 size={15} color="#0F172A" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {/* 3D WebGL Canvas - Touch/Click Interactions Disabled on Magnet */}
          <Canvas
            shadows
            gl={{ 
              alpha: true, 
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.32
            }}
            camera={{ position: [0, 2.0, 19.5], fov: 45 }}
            style={{ 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', 
              touchAction: 'none', 
              userSelect: 'none' 
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.15} color="#FFFFFF" />
              <directionalLight
                position={[8, 18, 12]}
                intensity={2.6}
                color="#FFFDF5"
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-8, 8, -8]} intensity={1.3} color="#E0F2FE" />
              <directionalLight position={[0, -6, 8]} intensity={0.9} color="#FEF3C7" />

              {/* Realistic 3D Suspended Bar Magnet (Static to Touch/Click) */}
              <SuspendedMagnet3D targetRotation={targetRotation} isSpinning={isSpinning} />

              {/* Drop Shadow beneath Magnet on Table */}
              <ContactShadows position={[0, -4.6, 0]} opacity={0.55} scale={16} blur={2.4} far={8} color="#000000" />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Right Side: Guide & Control Panel (Enlarged Spacious Typography) */}
      <div style={{
        flex: '1.15',
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
        border: '1.5px solid #FDE68A',
        borderRadius: '24px',
        padding: '1.45rem 1.6rem',
        boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.95rem',
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookOpen size={28} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.48rem', color: '#064E3B', fontWeight: 900 }}>
                Stage 1: Experiment
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
              Step {spinCount >= 1 ? (quizAnswer === 'yes' ? 3 : 2) : 1} of 3
            </span>
          </div>

          {/* All 3 Steps Visible From Initial Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                stepNum: 1,
                title: '1. Rotate Suspended Magnet',
                desc: 'Click "Rotate Magnet" to spin the freely suspended 3D bar magnet.'
              },
              {
                stepNum: 2,
                title: '2. Observe Natural Alignment',
                desc: 'Watch the magnet oscillate and settle pointing in the North-South direction.'
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
                    padding: '1rem 1.25rem',
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
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.04rem', color: '#065F46', lineHeight: 1.55, fontWeight: 700 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Controls Row */}
          <div style={{ width: '100%', display: 'flex', gap: '0.75rem', marginTop: '0.1rem' }}>
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={!isSpinning ? 'gold-glow-btn' : ''}
              style={{
                flex: 1.4,
                padding: '1rem 1.2rem',
                fontSize: '1.12rem',
                fontWeight: 900,
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.6rem',
                background: isSpinning ? '#CBD5E1' : undefined,
                color: isSpinning ? '#64748B' : '#FFFFFF',
                border: isSpinning ? 'none' : undefined,
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                boxShadow: isSpinning ? 'none' : undefined,
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
              }}
            >
              <RotateCw size={20} className={isSpinning ? 'spin-anim' : ''} /> {isSpinning ? 'Spinning...' : 'Rotate Magnet'}
            </button>

            <button
              onClick={handleReset}
              style={{
                flex: 0.8,
                padding: '1rem 0.9rem',
                fontSize: '1.06rem',
                fontWeight: 900,
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#FFFFFF',
                color: '#D97706',
                border: '1.5px solid #FDE68A',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
              }}
            >
              <RotateCcw size={19} color="#D97706" /> Restart
            </button>
          </div>
        </div>

        {/* Observation Question Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #FDE68A',
          padding: '1.3rem 1.45rem',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.95rem',
          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.06)'
        }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#064E3B', lineHeight: 1.55, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
            Quick Check: Does a freely suspended magnet always settle in the North-South direction?
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleQuizAnswer('yes')}
              style={{
                flex: 1,
                padding: '1rem 0.9rem',
                borderRadius: '16px',
                fontSize: '1.12rem',
                fontWeight: 900,
                cursor: 'pointer',
                background: quizAnswer === 'yes' ? '#DCFCE7' : '#FFFFFF',
                color: quizAnswer === 'yes' ? '#065F46' : '#064E3B',
                border: quizAnswer === 'yes' ? '2px solid #16A34A' : '1.5px solid #FDE68A',
                boxShadow: quizAnswer === 'yes' ? '0 4px 14px rgba(5, 150, 105, 0.25)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
              }}
            >
              <CheckCircle size={20} color={quizAnswer === 'yes' ? '#16A34A' : '#D97706'} /> Yes, Always!
            </button>
            <button
              onClick={() => handleQuizAnswer('no')}
              style={{
                flex: 1,
                padding: '1rem 0.9rem',
                borderRadius: '16px',
                fontSize: '1.12rem',
                fontWeight: 900,
                cursor: 'pointer',
                background: quizAnswer === 'no' ? '#FEE2E2' : '#FFFFFF',
                color: quizAnswer === 'no' ? '#991B1B' : '#064E3B',
                border: quizAnswer === 'no' ? '2px solid #DC2626' : '1.5px solid #FDE68A',
                boxShadow: quizAnswer === 'no' ? '0 4px 14px rgba(220, 38, 38, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
              }}
            >
              <XCircle size={20} color={quizAnswer === 'no' ? '#DC2626' : '#94A3B8'} /> No
            </button>
          </div>

          {/* Proceed Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem' }}>
            <span style={{ fontSize: '1rem', color: '#047857', fontWeight: 800, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
              Stage 1 of 2 ● ○
            </span>

            <button
              onClick={onComplete}
              disabled={!isCompleted}
              className={isCompleted ? 'gold-glow-btn' : ''}
              style={{
                padding: '1rem 2.6rem',
                fontSize: '1.16rem',
                fontWeight: 900,
                borderRadius: '24px',
                background: isCompleted ? undefined : '#E2E8F0',
                color: isCompleted ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: isCompleted ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                boxShadow: isCompleted ? undefined : 'none',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
              }}
            >
              Next <ArrowRight size={22} color={isCompleted ? '#FFFFFF' : '#94A3B8'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}