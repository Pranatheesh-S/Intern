import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import ErrorBoundary from '../../../../../components/ErrorBoundary';

import TreeBarrier from './TreeBarrier';
import BottleBarrier from './BottleBarrier';
import GlassBarrier from './GlassBarrier';
import CardboardBarrier from './CardboardBarrier';

// Rotating stage wrapper for continuous 360-degree turntable showcase
function BarrierModelWrapper({ type, thickness }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth continuous 360-degree auto-rotation
      groupRef.current.rotation.y += delta * 0.75;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.06, -0.28, 0]}>
      {type === 'wood' && <TreeBarrier thickness={thickness} />}
      {type === 'plastic' && <BottleBarrier thickness={thickness} />}
      {type === 'glass' && <GlassBarrier thickness={thickness} />}
      {type === 'cardboard' && <CardboardBarrier thickness={thickness} />}
    </group>
  );
}

// 3D Loading Fallback
function BarrierLoader() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.8, 1.4, 0.8]} />
      <meshStandardMaterial color="#38bdf8" wireframe />
    </mesh>
  );
}

const BADGE_CONFIG = {
  wood: { title: '🌳 Living Oak Tree (Wood)', bg: 'linear-gradient(135deg, #15803D 0%, #166534 100%)', border: '#86EFAC' },
  plastic: { title: '🧴 PET Spring Water (Plastic)', bg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: '#7DD3FC' },
  glass: { title: '🥛 Crystal Glass Tumbler (Glass)', bg: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', border: '#5EEAD4' },
  cardboard: { title: '📦 Corrugated Shipping Box (Cardboard)', bg: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)', border: '#FDE68A' }
};

export default function Barrier3DCanvas({ type = 'wood', thickness = 1, width = 220, height = 300 }) {
  const badge = BADGE_CONFIG[type] || BADGE_CONFIG.wood;

  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      {/* Top Floating Material Tag Badge */}
      <div style={{
        position: 'absolute',
        top: '-24px',
        background: badge.bg,
        color: '#FFFFFF',
        padding: '5px 14px',
        borderRadius: '16px',
        fontSize: '11px',
        fontWeight: 900,
        boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
        border: `1.5px solid ${badge.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 10,
        whiteSpace: 'nowrap',
        pointerEvents: 'none'
      }}>
        <span>{badge.title}</span>
        <span style={{
          background: 'rgba(255,255,255,0.25)',
          padding: '1px 6px',
          borderRadius: '8px',
          fontSize: '10px',
          fontWeight: 800
        }}>
          {thickness}x
        </span>
      </div>

      {/* 3D WebGL Canvas */}
      <ErrorBoundary title="3D Barrier Model Glitch">
        <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
          <Canvas
            shadows
            camera={{ position: [0, 1.1, 4.8], fov: 42 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance'
            }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <Suspense fallback={<BarrierLoader />}>
              {/* Studio Environment Map for Specular Highlights & Glass Transmission */}
              <Environment preset="city" />

              {/* Studio Ambient Base Light */}
              <ambientLight intensity={0.85} />

              {/* Key Directional Light with Soft Shadows */}
              <directionalLight
                position={[6, 9, 6]}
                intensity={1.8}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
              />

              {/* Cool Sky Fill Light */}
              <directionalLight position={[-6, 2, 4]} intensity={0.9} color="#e0f2fe" />

              {/* Warm Studio Rim Light */}
              <directionalLight position={[0, 5, -6]} intensity={1.1} color="#fef08a" />

              {/* Bottom Ground Bounce Light */}
              <directionalLight position={[0, -4, 2]} intensity={0.4} color="#f1f5f9" />

              {/* Realistic Ground Contact Shadows */}
              <ContactShadows
                position={[0, -1.05, 0]}
                opacity={0.6}
                scale={4.0}
                blur={1.5}
                far={3.5}
                color="#0f172a"
              />

              {/* The 3D Barrier Model */}
              <BarrierModelWrapper type={type} thickness={thickness} />
            </Suspense>
          </Canvas>
        </div>
      </ErrorBoundary>
    </div>
  );
}
