import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Import local background & flare textures
import cloudTextureUrl from './sunset_clouds_backdrop.jpg';
import flareTextureUrl from './sunset_clouds_backdrop.jpg';

// -----------------------------------------------------------------------------
// Scene Component: Realistic Texture-Mapped Infinite Cloud Sea & Sun Flare
// -----------------------------------------------------------------------------

function AtmosphericCloudScene() {
  const [cloudTexture, flareTexture] = useTexture([cloudTextureUrl, flareTextureUrl]);

  // Configure texture wrap modes for seamless infinite scrolling
  useMemo(() => {
    if (cloudTexture) {
      cloudTexture.wrapS = THREE.RepeatWrapping;
      cloudTexture.wrapT = THREE.RepeatWrapping;
      cloudTexture.repeat.set(1, 1);
    }
  }, [cloudTexture]);

  // Continuous infinite forward motion loop
  useFrame((state, delta) => {
    if (cloudTexture) {
      cloudTexture.offset.y += delta * 0.05;
    }
  });

  return (
    <>
      {/* Sky Base Horizon Color */}
      <color attach="background" args={['#3B74A6']} />

      {/* Atmospheric Lighting */}
      <ambientLight intensity={1.2} color="#FFE6B3" />
      <directionalLight position={[0, 3.5, -8]} intensity={2.4} color="#FFF5D6" />

      {/* 1. Infinite Moving Cloud Sea Plane */}
      <mesh position={[0, -1.2, -4]} rotation={[-Math.PI * 0.42, 0, 0]}>
        <planeGeometry args={[28, 22]} />
        <meshStandardMaterial
          map={cloudTexture}
          roughness={0.65}
          metalness={0.05}
          color="#FFF8EE"
        />
      </mesh>

      {/* 2. Volumetric Sun Flare Billboard at the Horizon */}
      <mesh position={[0, 2.6, -9]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial
          map={flareTexture}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#FFE8A3"
          opacity={0.85}
        />
      </mesh>
    </>
  );
}

// -----------------------------------------------------------------------------
// Main Export: MagnetActivityBackground (Zero-Impact Background Canvas)
// -----------------------------------------------------------------------------

export default function MagnetActivityBackground({ style = {}, children }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 48 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance'
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <React.Suspense fallback={null}>
          <AtmosphericCloudScene />
        </React.Suspense>
      </Canvas>

      {/* Subtle Atmospheric Vignette Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, transparent 55%, rgba(15, 23, 42, 0.25) 85%, rgba(2, 6, 23, 0.45) 100%)',
          pointerEvents: 'none'
        }}
      />

      {children}
    </div>
  );
}
