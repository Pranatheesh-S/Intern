import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D Crystal Highball Glass Tumbler Barrier Component
 * - Crystal clear highball glass with refined transmission and reflections
 * - Translucent cool water with subtle meniscus
 * - Effervescent bubble carbonation wrap
 * - Visible crystalline ice cubes with physical refraction and specular highlights
 * - Procedural condensation droplets on the glass exterior
 * - Dynamic thickness scaling along X/Z axes
 */
export default function GlassBarrier({ thickness = 1 }) {
  // Load local bubble and ice textures from public/textures
  const [bubbleMap, iceMap] = useTexture([
    '/textures/glass-bubbles.png',
    '/textures/ice-cube.png'
  ]);

  useMemo(() => {
    if (bubbleMap) {
      bubbleMap.wrapS = bubbleMap.wrapT = THREE.RepeatWrapping;
      bubbleMap.repeat.set(2, 3);
    }
  }, [bubbleMap]);

  const scaleX = 0.88 + thickness * 0.16;
  const scaleZ = 0.88 + thickness * 0.16;

  // Generate condensation droplets procedurally
  const condensationPositions = useMemo(() => {
    const positions = [];
    const dropletCount = 35;
    
    for (let i = 0; i < dropletCount; i++) {
      positions.push({
        x: (Math.random() - 0.5) * 0.9,
        y: Math.random() * 2.0 + 0.1,
        z: Math.random() * 0.12 + 0.52,
        size: Math.random() * 0.012 + 0.006,
        opacity: Math.random() * 0.6 + 0.4
      });
    }
    return positions;
  }, []);

  return (
    <group position={[0, -1.1, 0]} scale={[scaleX, 1, scaleZ]}>
      {/* ─── 1. Outer Highball Glass Cylinder (Crystal Clear) ─── */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.52, 2.3, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.96}
          opacity={1.0}
          transparent={true}
          roughness={0.02}
          ior={1.52}
          thickness={0.6}
          specularIntensity={1.2}
          specularColor="#ffffff"
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Glass Rim Ring */}
      <mesh position={[0, 2.30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.49, 0.54, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          opacity={1.0}
          transparent={true}
          roughness={0.02}
          ior={1.52}
          thickness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Solid Glass Bottom Base */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          roughness={0.04}
          ior={1.52}
          thickness={1.0}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ─── 2. Water Cylinder & Meniscus ─── */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.485, 0.475, 1.85, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.88}
          transparent={true}
          opacity={0.95}
          roughness={0.02}
          ior={1.333}
          thickness={0.5}
          specularIntensity={1.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Water Surface Meniscus */}
      <mesh position={[0, 1.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.485, 64]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transmission={0.85}
          transparent={true}
          opacity={0.95}
          roughness={0.02}
          ior={1.333}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ─── 3. Effervescent Bubbles Wrap ─── */}
      {bubbleMap && (
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.48, 0.47, 1.84, 48, 1, true]} />
          <meshStandardMaterial
            map={bubbleMap}
            transparent={true}
            opacity={0.75}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ─── 4. Procedural Condensation Droplets ─── */}
      {condensationPositions.map((droplet, idx) => (
        <mesh 
          key={`droplet-${idx}`}
          position={[droplet.x, droplet.y, droplet.z]}
          scale={[droplet.size * 2, droplet.size * 2.5, droplet.size]}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            transparent={true}
            opacity={droplet.opacity * 0.8}
            roughness={0.02}
            ior={1.333}
            thickness={0.3}
            specularIntensity={1.2}
          />
        </mesh>
      ))}

      {/* ─── 5. Realistic Crystalline Ice Cubes ─── */}
      {/* Bottom Ice Cube */}
      <group position={[-0.06, 0.52, 0.05]} rotation={[0.15, 0.38, 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[0.31, 0.31, 0.31]} />
          <meshPhysicalMaterial
            map={iceMap || null}
            color="#e0f2fe"
            transmission={0.78}
            transparent={true}
            opacity={0.96}
            roughness={0.05}
            ior={1.31}
            thickness={0.55}
            specularIntensity={1.3}
            specularColor="#ffffff"
            clearcoat={0.9}
            clearcoatRoughness={0.02}
          />
        </mesh>
      </group>

      {/* Mid-Lower Ice Cube */}
      <group position={[0.09, 0.93, -0.03]} rotation={[-0.14, 0.58, -0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.295, 0.295, 0.295]} />
          <meshPhysicalMaterial
            map={iceMap || null}
            color="#e0f2fe"
            transmission={0.78}
            transparent={true}
            opacity={0.96}
            roughness={0.05}
            ior={1.31}
            thickness={0.55}
            specularIntensity={1.3}
            specularColor="#ffffff"
            clearcoat={0.88}
            clearcoatRoughness={0.025}
          />
        </mesh>
      </group>

      {/* Mid-Upper Ice Cube */}
      <group position={[-0.08, 1.32, -0.01]} rotation={[0.22, -0.32, 0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.29, 0.29, 0.29]} />
          <meshPhysicalMaterial
            map={iceMap || null}
            color="#e0f2fe"
            transmission={0.78}
            transparent={true}
            opacity={0.96}
            roughness={0.05}
            ior={1.31}
            thickness={0.55}
            specularIntensity={1.3}
            specularColor="#ffffff"
            clearcoat={0.85}
            clearcoatRoughness={0.03}
          />
        </mesh>
      </group>

      {/* Top Floating Ice Cube */}
      <group position={[0.06, 1.70, 0.04]} rotation={[-0.12, 0.22, 0.32]}>
        <mesh castShadow>
          <boxGeometry args={[0.27, 0.27, 0.27]} />
          <meshPhysicalMaterial
            map={iceMap || null}
            color="#f0f9ff"
            transmission={0.8}
            transparent={true}
            opacity={0.97}
            roughness={0.04}
            ior={1.31}
            thickness={0.5}
            specularIntensity={1.4}
            specularColor="#ffffff"
            clearcoat={0.92}
            clearcoatRoughness={0.015}
          />
        </mesh>
      </group>

      {/* Additional Micro Ice Chunk */}
      <mesh position={[0.12, 1.55, -0.08]} rotation={[0.3, -0.25, 0.45]} castShadow>
        <boxGeometry args={[0.16, 0.18, 0.14]} />
        <meshPhysicalMaterial
          map={iceMap || null}
          color="#e0f2fe"
          transmission={0.8}
          transparent={true}
          opacity={0.94}
          roughness={0.04}
          ior={1.31}
          thickness={0.45}
          specularIntensity={1.25}
        />
      </mesh>

      {/* Ground Contact Shadow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
