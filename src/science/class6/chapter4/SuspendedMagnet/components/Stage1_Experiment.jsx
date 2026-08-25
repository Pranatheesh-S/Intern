import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, CheckCircle, RotateCcw, ArrowRight, Compass, BookOpen, Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';

// -------------------------------------------------------------------
// 1. Realistic 3D Suspended Bar Magnet with Smooth Physics Swing
// -------------------------------------------------------------------
function SuspendedMagnet3D({ targetRotation, isSpinning }) {
  const magnetGroupRef = useRef();
  const currentAngle = useRef(0.25);
  const velocity = useRef(0);

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
        <cylinderGeometry args={[0.016, 0.016, 5.8, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Antiqued Brass Suspension Hook Ring */}
      <mesh position={[0, 0.95, 0]}>
        <torusGeometry args={[0.2, 0.045, 16, 32]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Rotating 3D Magnet Assembly */}
      <group ref={magnetGroupRef}>
        {/* North Half - Deep Carmine Red with Fine Matte Texture */}
        <mesh position={[-3.1, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 1.35, 1.9]} />
          <meshStandardMaterial color="#C51E28" roughness={0.55} metalness={0.15} />
        </mesh>

        {/* North Pole Front Face Label */}
        <Text
          position={[-3.1, 0, 0.97]}
          rotation={[0, 0, 0]}
          fontSize={0.88}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          North
        </Text>

        {/* North Pole Back Face Label */}
        <Text
          position={[-3.1, 0, -0.97]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.88}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          North
        </Text>

        {/* North Pole Top Face Label */}
        <Text
          position={[-3.1, 0.69, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.82}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          North
        </Text>

        {/* South Half - Bold Ultramarine Blue with Fine Matte Texture */}
        <mesh position={[3.1, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 1.35, 1.9]} />
          <meshStandardMaterial color="#1848B8" roughness={0.55} metalness={0.15} />
        </mesh>

        {/* South Pole Front Face Label */}
        <Text
          position={[3.1, 0, 0.97]}
          rotation={[0, 0, 0]}
          fontSize={0.88}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          South
        </Text>

        {/* South Pole Back Face Label */}
        <Text
          position={[3.1, 0, -0.97]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.88}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          South
        </Text>

        {/* South Pole Top Face Label */}
        <Text
          position={[3.1, 0.69, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.82}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          South
        </Text>

        {/* Dark Dividing Seam */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 1.36, 1.91]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>

        {/* Polished Brass Center Clamp Collar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 1.38, 1.94]} />
          <meshStandardMaterial color="#D97706" roughness={0.32} metalness={0.85} />
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

  const isCompleted = spinCount >= 1 && quizAnswer === 'yes';

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

          {/* 3D WebGL Canvas */}
          <Canvas
            shadows
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 2.0, 19.5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.9} />
              <directionalLight
                position={[8, 18, 10]}
                intensity={1.8}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-8, 6, -8]} intensity={0.4} color="#FDE68A" />

              {/* Realistic 3D Suspended Bar Magnet */}
              <SuspendedMagnet3D targetRotation={targetRotation} isSpinning={isSpinning} />

              {/* Drop Shadow beneath Magnet on Table */}
              <ContactShadows position={[0, -4.6, 0]} opacity={0.55} scale={16} blur={2.4} far={8} color="#000000" />
              <OrbitControls makeDefault enablePan={false} maxPolarAngle={Math.PI / 2.1} minPolarAngle={0.2} minDistance={5} maxDistance={32} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Right Side: Guide & Control Panel */}
      <div style={{
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
        overflowY: 'auto'
      }}>
        {/* Complete Instructions Upfront in Initial Stage */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '18px',
          padding: '1.2rem 1.3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#064E3B', fontWeight: 900, fontSize: '1.05rem' }}>
            <BookOpen size={20} color="#047857" />
            <span>Activity Instructions</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, fontWeight: 600 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ background: '#E0F2FE', color: '#0369A1', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>1</span>
              <span>Click <strong>"Rotate Magnet"</strong> to spin the suspended 3D bar magnet.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ background: '#E0F2FE', color: '#0369A1', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>2</span>
              <span>Observe which direction the red North pole and blue South pole point when the magnet settles at rest.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ background: '#E0F2FE', color: '#0369A1', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>3</span>
              <span>Answer the <strong>Quick Check</strong> question below to confirm your observation!</span>
            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div style={{ width: '100%', display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            style={{
              flex: 1.4,
              padding: '0.85rem 1rem',
              fontSize: '0.92rem',
              fontWeight: 900,
              borderRadius: '14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              background: isSpinning ? '#CBD5E1' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: isSpinning ? '#64748B' : '#FFFFFF',
              border: 'none',
              cursor: isSpinning ? 'not-allowed' : 'pointer',
              boxShadow: isSpinning ? 'none' : '0 4px 14px rgba(217, 119, 6, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <RotateCw size={17} className={isSpinning ? 'spin-anim' : ''} /> {isSpinning ? 'Spinning...' : 'Rotate Magnet'}
          </button>

          <button
            onClick={handleReset}
            style={{
              flex: 0.8,
              padding: '0.85rem 0.8rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#FFFFFF',
              color: '#1E293B',
              border: '1.5px solid #CBD5E1',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
            }}
          >
            <RotateCcw size={16} color="#1E293B" /> Restart
          </button>
        </div>

        {/* Observation Question */}
        <div style={{
          background: '#F0FDF4',
          border: '1.5px solid #A7F3D0',
          padding: '1.1rem 1.2rem',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#064E3B', lineHeight: 1.4 }}>
            Quick Check: Does a freely suspended magnet always settle in the North-South direction?
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => handleQuizAnswer('yes')}
              style={{
                flex: 1,
                padding: '0.7rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: quizAnswer === 'yes' ? '#059669' : '#FFFFFF',
                color: quizAnswer === 'yes' ? '#FFFFFF' : '#1E293B',
                border: quizAnswer === 'yes' ? '1.5px solid #059669' : '1.5px solid #CBD5E1',
                boxShadow: quizAnswer === 'yes' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Yes, Always!
            </button>
            <button
              onClick={() => handleQuizAnswer('no')}
              style={{
                flex: 1,
                padding: '0.7rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: quizAnswer === 'no' ? '#EF4444' : '#FFFFFF',
                color: quizAnswer === 'no' ? '#FFFFFF' : '#1E293B',
                border: quizAnswer === 'no' ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                transition: 'all 0.2s ease'
              }}
            >
              No
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
            Stage 1 of 2 ● ○
          </span>

          <button
            onClick={onComplete}
            disabled={!isCompleted}
            style={{
              padding: '0.85rem 2rem',
              fontSize: '0.95rem',
              fontWeight: 900,
              borderRadius: '30px',
              background: isCompleted ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#E2E8F0',
              color: isCompleted ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              cursor: isCompleted ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: isCompleted ? '0 4px 15px rgba(217, 119, 6, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Next <ArrowRight size={18} color={isCompleted ? '#FFFFFF' : '#94A3B8'} />
          </button>
        </div>
      </div>
    </div>
  );
}