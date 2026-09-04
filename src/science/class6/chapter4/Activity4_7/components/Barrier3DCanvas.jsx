import React, { Suspense, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '../../../../../components/ErrorBoundary';

import TreeBarrier from './TreeBarrier';
import BottleBarrier from './BottleBarrier';
import GlassBarrier from './GlassBarrier';
import CardboardBarrier from './CardboardBarrier';

// Dynamic Cinematic Camera Reframing Controller
function CinematicCameraController({ stage, type }) {
  const { camera } = useThree();

  useFrame(() => {
    // Tailored optimal camera distance and framing per stage
    let targetX = 0;
    let targetY = 0.45;
    let targetZ = 4.4;
    let targetFov = 40;

    if (type === 'wood') {
      if (stage === 1) { targetY = -0.75; targetZ = 4.3; targetFov = 40; }
      else if (stage === 2) { targetY = -0.70; targetZ = 4.8; targetFov = 42; }
      else if (stage === 3) { targetY = -0.70; targetZ = 4.9; targetFov = 42; }
      else if (stage === 4) { targetY = -0.55; targetZ = 7.4; targetFov = 50; }
    } else if (type === 'plastic') {
      if (stage === 1) { targetY = -0.80; targetZ = 4.3; targetFov = 40; }
      else if (stage === 2) { targetY = -0.70; targetZ = 4.8; targetFov = 41; }
      else if (stage === 3) { targetY = -0.70; targetZ = 5.2; targetFov = 42; }
      else if (stage === 4) { targetY = -0.65; targetZ = 5.6; targetFov = 44; }
    } else if (type === 'glass') {
      if (stage === 1) { targetY = -0.75; targetZ = 4.3; targetFov = 40; }
      else if (stage === 2) { targetY = -0.70; targetZ = 4.9; targetFov = 42; }
      else if (stage === 3) { targetY = -0.80; targetZ = 4.5; targetFov = 40; }
      else if (stage === 4) { targetY = -0.65; targetZ = 5.2; targetFov = 43; }
    } else if (type === 'cardboard') {
      if (stage === 1) { targetY = -0.58; targetZ = 4.4; targetFov = 40; }
      else if (stage === 2) { targetY = -0.55; targetZ = 4.6; targetFov = 41; }
      else if (stage === 3) { targetY = -0.55; targetZ = 4.6; targetFov = 41; }
      else if (stage === 4) { targetY = -0.55; targetZ = 5.3; targetFov = 43; }
    }

    // Smooth cinematic damping
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    if (Math.abs(camera.fov - targetFov) > 0.1) {
      camera.fov += (targetFov - camera.fov) * 0.06;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

// Stable stage wrapper for clear, stationary 3D presentation
function BarrierModelWrapper({ type, stage = 1, thickness = 1 }) {
  if (!type) return null;
  return (
    <group rotation={[0, 0, 0]}>
      {type === 'wood' && <TreeBarrier stage={stage} thickness={thickness} />}
      {type === 'plastic' && <BottleBarrier stage={stage} thickness={thickness} />}
      {type === 'glass' && <GlassBarrier stage={stage} thickness={thickness} />}
      {type === 'cardboard' && <CardboardBarrier stage={stage} thickness={thickness} />}
    </group>
  );
}

// 3D Loading Fallback: invisible during texture transition to avoid flashing boxes
function BarrierLoader() {
  return null;
}

const BADGE_CONFIG = {
  wood: {
    1: { title: '📄 Part 1: Paper Sheet (Cellulose)', bg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: '#7DD3FC' },
    2: { title: '🪵 Part 2: Rustic Timber Log (Wood)', bg: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)', border: '#FDE68A' },
    3: { title: '🌱 Part 3: Sprouting Plant (Sapling)', bg: 'linear-gradient(135deg, #15803D 0%, #166534 100%)', border: '#86EFAC' },
    4: { title: '🌳 Part 4: Living Oak Tree (Full Tree)', bg: 'linear-gradient(135deg, #065F46 0%, #064E3B 100%)', border: '#6EE7B7' }
  },
  plastic: {
    1: { title: '🧴 Part 1: 200 mL Pocket Bottle (PET)', bg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: '#7DD3FC' },
    2: { title: '🧴 Part 2: 500 mL Spring Water (PET)', bg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: '#7DD3FC' },
    3: { title: '🍶 Part 3: 1 Litre Sports Bottle (PET)', bg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: '#7DD3FC' },
    4: { title: '🛢️ Part 4: 20 Litre Water Can (Polymer)', bg: 'linear-gradient(135deg, #0369A1 0%, #075985 100%)', border: '#38BDF8' }
  },
  glass: {
    1: { title: '🥃 Part 1: Small Shot Glass (Silicate)', bg: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', border: '#5EEAD4' },
    2: { title: '🥛 Part 2: Big Glass Tumbler (Glass)', bg: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', border: '#5EEAD4' },
    3: { title: '🥣 Part 3: Pyrex Glass Bowl (Glass)', bg: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', border: '#5EEAD4' },
    4: { title: '🫙 Part 4: Glass Storage Container', bg: 'linear-gradient(135deg, #0F766E 0%, #134E4A 100%)', border: '#2DD4BF' }
  },
  cardboard: {
    1: { title: '📦 Part 1: Small Box (Kraft Carton)', bg: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)', border: '#FDE68A' },
    2: { title: '📄 Part 2: Cardboard Sheet (Single Wall)', bg: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)', border: '#FDE68A' },
    3: { title: '📚 Part 3: 3 Layers Cardboard (Triple Wall)', bg: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)', border: '#FDE68A' },
    4: { title: '📦 Part 4: Shipping Cardboard Box', bg: 'linear-gradient(135deg, #92400E 0%, #78350F 100%)', border: '#FDE68A' }
  }
};

export default function Barrier3DCanvas({ type = null, treeStage = 1, stage = null, thickness = 1, width = 360, height = 420 }) {
  const currentStage = stage !== null ? stage : (treeStage || 1);

  return (
    <div style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      background: 'transparent',
      overflow: 'visible'
    }}>
      {/* 3D WebGL Canvas */}
      <ErrorBoundary title="3D Barrier Model Glitch">
        <div style={{ width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
          <Canvas
            shadows
            camera={{ position: [0, 0.45, 4.4], fov: 40 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance'
            }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <Suspense fallback={<BarrierLoader />}>
              {/* Dynamic Camera Framing */}
              <CinematicCameraController stage={currentStage} type={type} />

              {/* Studio Environment Map */}
              <Environment preset="studio" intensity={0.2} />

              {/* Natural Ambient Illumination */}
              <ambientLight intensity={0.6} color="#ffffff" />

              {/* Balanced Key Sunlight */}
              <directionalLight
                position={[5, 8, 6]}
                intensity={0.55}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.00015}
                shadow-radius={3.0}
                color="#fffcf5"
              />

              {/* Soft Sky Fill Light */}
              <directionalLight
                position={[-5, 4, 4]}
                intensity={0.4}
                color="#f0f9ff"
              />

              {/* Subtle Rear Silhouette Rim Light */}
              <directionalLight
                position={[0, 6, -6]}
                intensity={0.4}
                color="#fef3c7"
              />

              {/* Realistic Ground Contact Shadows */}
              <ContactShadows
                position={[
                  0,
                  type === 'wood' && currentStage === 4
                    ? -1.68
                    : type === 'plastic'
                      ? (currentStage === 1 ? -2.8 : currentStage === 2 ? -3.1 : currentStage === 3 ? -3.3 : -3.4)
                      : type === 'cardboard'
                        ? (currentStage === 1 ? -2.85 : currentStage === 2 ? -3.05 : currentStage === 3 ? -3.15 : -3.5)
                        : -1.08,
                  0
                ]}
                opacity={0.45}
                scale={type === 'plastic' || type === 'cardboard' ? 5.2 : 4.5}
                blur={2.2}
                far={3.8}
                color="#0f172a"
              />

              {/* The 3D Barrier Model */}
              <BarrierModelWrapper
                type={type}
                stage={currentStage}
                thickness={thickness}
              />
            </Suspense>
          </Canvas>
        </div>
      </ErrorBoundary>
    </div>
  );
}
