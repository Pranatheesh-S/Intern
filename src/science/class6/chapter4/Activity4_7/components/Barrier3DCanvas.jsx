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

export default function Barrier3DCanvas({ type = 'wood', thickness = 1, width = 360, height = 420 }) {
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
      userSelect: 'none',
      background: 'transparent'
    }}>
      {/* Top Floating Material Tag Badge */}
      <div style={{
        position: 'absolute',
        top: '-18px',
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
            camera={{ position: [0, 0.95, 4.4], fov: 44 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              tone: 'aces' // Better tone mapping
            }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <Suspense fallback={<BarrierLoader />}>
              {/* Premium Studio Environment Map for Specular Highlights & Glass Transmission */}
              <Environment preset="studio" intensity={1.2} />

              {/* Studio Ambient Light - INCREASED for brightness */}
              <ambientLight intensity={1.4} color="#ffffff" />

              {/* Primary Key Directional Light - Stronger & Larger */}
              <directionalLight
                position={[8, 10, 8]}
                intensity={2.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0002}
                color="#ffffff"
              />

              {/* Bright Cool Sky Fill Light - More intense */}
              <directionalLight 
                position={[-8, 4, 6]} 
                intensity={1.6} 
                color="#e0f2fe" 
              />

              {/* Warm Studio Rim Light - Enhanced */}
              <directionalLight 
                position={[0, 6, -8]} 
                intensity={1.4} 
                color="#fef3c7" 
              />

              {/* Bottom Ground Bounce Light - More realistic */}
              <directionalLight 
                position={[0, -3, 3]} 
                intensity={0.7} 
                color="#f1f5f9" 
              />

              {/* Additional left-side accent light for more depth */}
              <pointLight
                position={[-6, 3, 0]}
                intensity={1.2}
                color="#dbeafe"
              />

              {/* Realistic Ground Contact Shadows - Less dark */}
              <ContactShadows
                position={[0, -1.05, 0]}
                opacity={0.4}
                scale={4.0}
                blur={2.0}
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
