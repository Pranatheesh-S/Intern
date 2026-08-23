import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, AlertCircle, CheckCircle, XCircle, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

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

export default function Stage2_BreakingMagnet({ onComplete }) {
  const [broken, setBroken] = useState(false);
  const [showPoles, setShowPoles] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
    setShowFeedbackModal(false);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
    if (answer === 'no') {
      setShowFeedbackModal(true);
    }
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
      }}
    >
      {/* Centered Feedback Pop-up Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
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
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                }}
              >
                <CheckCircle size={36} color="#059669" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064E3B' }}>
                  Observation Verified!
                </h3>
                <p style={{ margin: 0, color: '#334155', fontSize: '1.02rem', lineHeight: 1.6, fontWeight: 700 }}>
                  🎉 Correct! North and South poles always exist in pairs, even in the smallest pieces of a magnet.
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
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                }}
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 20,
              zIndex: 10,
              background: 'rgba(255,255,255,0.92)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#0F172A',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            ✂️ Interactive 3D Lab | Drag to Rotate
          </div>

          {/* 3D Canvas Scene matching Stage 1 Camera, Lighting, and Controls */}
          <Canvas
            shadows
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 24, 30], fov: 45 }}
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

              <BreakingMagnet3D broken={broken} showPoles={showPoles} />

              {/* Realistic White Lab Paper Sheet (26 x 0.04 x 16) */}
              <mesh receiveShadow position={[0, -0.01, 0]}>
                <boxGeometry args={[26, 0.04, 16]} />
                <meshStandardMaterial color="#FAF9F6" roughness={0.95} metalness={0.0} />
              </mesh>

              {/* Soft Drop Shadow under Paper */}
              <ContactShadows position={[0, -0.08, 0]} opacity={0.65} scale={32} blur={2.2} far={4} color="#000000" />
              <OrbitControls
                makeDefault
                maxPolarAngle={Math.PI / 2.15}
                minPolarAngle={0.15}
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