import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D Crystal Highball Glass Tumbler Barrier Component
 * - Saturated vivid blue internal spring water volume
 * - Clearly visible crystalline ice cubes with sharp specular highlights
 * - Effervescent bubble carbonation wrap
 * - Dynamic thickness scaling along X/Z axes
 */
export default function GlassBarrier({ thickness = 1 }) {
  // Load local bubble and ice textures
  const [bubbleMap, iceMap] = useTexture([
    '/textures/glass-bubbles.png',
    '/textures/ice-cube.png'
  ]);

  useMemo(() => {
    bubbleMap.wrapS = bubbleMap.wrapT = THREE.RepeatWrapping;
    bubbleMap.repeat.set(2, 3);
  }, [bubbleMap]);

  const scaleX = 0.88 + thickness * 0.16;
  const scaleZ = 0.88 + thickness * 0.16;

  return (
    <group position={[0, -1.1, 0]} scale={[scaleX, 1, scaleZ]}>
      {/* ─── 1. Outer Highball Glass Cylinder ─── */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.52, 2.3, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.96}
          opacity={1.0}
          transparent={true}
          roughness={0.02}
          ior={1.52}
          thickness={0.5}
          specularIntensity={1.0}
          specularColor="#ffffff"
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Glass Rim Ring */}
      <mesh position={[0, 2.30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.49, 0.54, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Solid Glass Bottom Base */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 48]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          roughness={0.04}
          ior={1.52}
          thickness={0.8}
          transparent
        />
      </mesh>

      {/* ─── 2. Saturated Vivid Blue Water Cylinder ─── */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.485, 0.475, 1.9, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#0284c7"
          transmission={0.78}
          transparent={true}
          opacity={0.92}
          roughness={0.03}
          ior={1.333}
          thickness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Blue Water Surface Meniscus */}
      <mesh position={[0, 1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.485, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.8}
          transparent={true}
          opacity={0.95}
          roughness={0.02}
        />
      </mesh>

      {/* ─── 3. Effervescent Bubbles Wrap ─── */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.48, 0.47, 1.88, 48, 1, true]} />
        <meshStandardMaterial
          map={bubbleMap}
          transparent={true}
          opacity={0.85}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ─── 4. Clearly Visible Stacked Crystalline Ice Blocks ─── */}
      {/* Bottom Ice Cube */}
      <mesh position={[-0.05, 0.55, 0.04]} rotation={[0.1, 0.4, 0.1]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshPhysicalMaterial
          map={iceMap}
          color="#e0f2fe"
          transmission={0.75}
          roughness={0.05}
          ior={1.31}
          thickness={0.5}
          transparent
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>

      {/* Mid-Lower Ice Cube */}
      <mesh position={[0.08, 0.95, -0.04]} rotation={[-0.15, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.29, 0.29, 0.29]} />
        <meshPhysicalMaterial
          map={iceMap}
          color="#e0f2fe"
          transmission={0.75}
          roughness={0.05}
          ior={1.31}
          thickness={0.5}
          transparent
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>

      {/* Mid-Upper Ice Cube */}
      <mesh position={[-0.07, 1.35, -0.02]} rotation={[0.25, -0.3, 0.2]} castShadow>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshPhysicalMaterial
          map={iceMap}
          color="#e0f2fe"
          transmission={0.75}
          roughness={0.05}
          ior={1.31}
          thickness={0.5}
          transparent
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>

      {/* Top Floating Ice Cube */}
      <mesh position={[0.05, 1.72, 0.05]} rotation={[-0.1, 0.2, 0.35]} castShadow>
        <boxGeometry args={[0.26, 0.26, 0.26]} />
        <meshPhysicalMaterial
          map={iceMap}
          color="#f0f9ff"
          transmission={0.75}
          roughness={0.04}
          ior={1.31}
          thickness={0.5}
          transparent
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* Ground Contact Shadow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}