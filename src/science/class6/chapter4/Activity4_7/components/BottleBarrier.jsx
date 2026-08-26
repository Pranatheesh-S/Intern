import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D PET Plastic Spring Water Bottle Barrier Component
 * - Rich vibrant blue internal water volume
 * - Cleaned up shell geometry without protruding fins
 * - Sharp, saturated shrink-wrap label (toneMapped: false)
 * - Dynamic thickness scaling along X/Z axes
 */
export default function BottleBarrier({ thickness = 1 }) {
  // Load local label and cap textures
  const [labelMap, capMap] = useTexture([
    '/textures/bottle-label.png',
    '/textures/cap-ribs.png'
  ]);

  useMemo(() => {
    capMap.wrapS = THREE.RepeatWrapping;
    capMap.repeat.set(4, 1);
  }, [capMap]);

  // Precision Lathe Profile for molded PET bottle and internal liquid
  const { bottlePts, waterPts } = useMemo(() => {
    const bPts = [];
    const wPts = [];

    // Outer Shell Profile
    bPts.push(new THREE.Vector2(0.0, 0.0));
    bPts.push(new THREE.Vector2(0.32, 0.02)); // Inverted punt
    bPts.push(new THREE.Vector2(0.49, 0.07));
    bPts.push(new THREE.Vector2(0.53, 0.16));
    
    // Bottom ribbed grip section
    bPts.push(new THREE.Vector2(0.53, 0.45));
    bPts.push(new THREE.Vector2(0.50, 0.52)); // Grip groove 1
    bPts.push(new THREE.Vector2(0.53, 0.60));
    bPts.push(new THREE.Vector2(0.48, 0.85)); // Mid waist
    bPts.push(new THREE.Vector2(0.53, 1.10)); // Grip groove 2
    bPts.push(new THREE.Vector2(0.53, 1.70)); // Label band top
    
    // Contoured shoulder
    bPts.push(new THREE.Vector2(0.49, 1.95));
    bPts.push(new THREE.Vector2(0.40, 2.22));
    bPts.push(new THREE.Vector2(0.24, 2.45));
    
    // Threaded neck & security ring
    bPts.push(new THREE.Vector2(0.18, 2.50));
    bPts.push(new THREE.Vector2(0.22, 2.54));
    bPts.push(new THREE.Vector2(0.18, 2.58));
    bPts.push(new THREE.Vector2(0.18, 2.72));
    bPts.push(new THREE.Vector2(0.15, 2.74));

    // Internal Water Profile
    wPts.push(new THREE.Vector2(0.0, 0.05));
    wPts.push(new THREE.Vector2(0.30, 0.06));
    wPts.push(new THREE.Vector2(0.46, 0.10));
    wPts.push(new THREE.Vector2(0.49, 0.45));
    wPts.push(new THREE.Vector2(0.46, 0.52));
    wPts.push(new THREE.Vector2(0.49, 0.60));
    wPts.push(new THREE.Vector2(0.45, 0.85));
    wPts.push(new THREE.Vector2(0.49, 1.10));
    wPts.push(new THREE.Vector2(0.49, 1.70));
    wPts.push(new THREE.Vector2(0.45, 1.95));
    wPts.push(new THREE.Vector2(0.35, 2.15)); // Fill level
    wPts.push(new THREE.Vector2(0.0, 2.15));  // Meniscus center

    return { bottlePts: bPts, waterPts: wPts };
  }, []);

  const scaleX = 0.9 + thickness * 0.18;
  const scaleZ = 0.9 + thickness * 0.18;

  return (
    <group position={[0, -1.2, 0]} scale={[scaleX, 1, scaleZ]}>
      {/* ─── 1. Outer Translucent PET Plastic Shell ─── */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[bottlePts, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.96}
          opacity={1.0}
          transparent={true}
          roughness={0.03}
          ior={1.54}
          thickness={0.4}
          specularIntensity={1.0}
          specularColor="#ffffff"
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* ─── 2. Vivid Rich Cyan Spring Water Volume ─── */}
      <mesh position={[0, 0, 0]}>
        <latheGeometry args={[waterPts, 64]} />
        <meshPhysicalMaterial
          color="#0284c7"
          transmission={0.75}
          transparent={true}
          opacity={0.95}
          roughness={0.05}
          ior={1.333}
          thickness={0.7}
          specularIntensity={0.9}
        />
      </mesh>

      {/* ─── 3. High-Gloss Shrink-Wrap Label Band (Vibrant & Sharp) ─── */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.533, 0.533, 0.76, 64, 1, true]} />
        <meshStandardMaterial
          map={labelMap}
          roughness={0.18}
          metalness={0.05}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ─── 4. Ribbed Polypropylene Screw Cap ─── */}
      <mesh position={[0, 2.74, 0]} castShadow>
        <cylinderGeometry args={[0.20, 0.20, 0.16, 48]} />
        <meshStandardMaterial
          map={capMap}
          bumpMap={capMap}
          bumpScale={0.03}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      {/* Tamper-Evident Safety Ring */}
      <mesh position={[0, 2.63, 0]}>
        <cylinderGeometry args={[0.205, 0.205, 0.04, 48]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Ground Contact Shadow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}