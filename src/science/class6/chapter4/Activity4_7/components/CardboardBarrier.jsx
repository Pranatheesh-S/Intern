import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D Corrugated Kraft Shipping Cardboard Box Barrier Component
 * - Warm, saturated Kraft paper fiber texture with rich matte finish
 * - Cleaned-up chassis geometry without protruding side wings
 * - Flush shipping decals and golden polypropylene packaging tape
 * - Dynamic thickness scaling along X axis
 */
export default function CardboardBarrier({ thickness = 1 }) {
  // Load local cardboard, decal, and tape textures
  const [cardboardMap, cardboardNormal, decalMap, tapeMap] = useTexture([
    '/textures/cardboard.png',
    '/textures/cardboard-normal.png',
    '/textures/shipping-decal.png',
    '/textures/tape.png'
  ]);

  useMemo(() => {
    cardboardMap.wrapS = cardboardMap.wrapT = THREE.RepeatWrapping;
    cardboardMap.repeat.set(1.5, 2.5);
    cardboardNormal.wrapS = cardboardNormal.wrapT = THREE.RepeatWrapping;
    cardboardNormal.repeat.set(1.5, 2.5);
    tapeMap.wrapS = tapeMap.wrapT = THREE.RepeatWrapping;
    tapeMap.repeat.set(1, 4);
  }, [cardboardMap, cardboardNormal, tapeMap]);

  const scaleX = 0.65 + thickness * 0.24;

  return (
    <group position={[0, -1.1, 0]} scale={[scaleX, 1, 1]}>
      {/* ─── 1. Main Corrugated Kraft Box Chassis (Warm, Saturated & Matte) ─── */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.2, 1.6]} />
        <meshStandardMaterial
          map={cardboardMap}
          normalMap={cardboardNormal}
          normalScale={new THREE.Vector2(1.5, 1.5)}
          roughness={0.88}
          metalness={0.01}
          color="#c2884d"
        />
      </mesh>

      {/* ─── 2. Flap Seam Crease Lines ─── */}
      <mesh position={[0, 1.1, 0.801]}>
        <planeGeometry args={[0.006, 2.18]} />
        <meshBasicMaterial color="#573310" />
      </mesh>
      <mesh position={[0, 2.201, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.006, 1.58]} />
        <meshBasicMaterial color="#573310" />
      </mesh>

      {/* ─── 3. Flush Shipping Label & FRAGILE Stencil Decals ─── */}
      <mesh position={[0, 1.1, 0.802]}>
        <planeGeometry args={[1.15, 2.15]} />
        <meshStandardMaterial
          map={decalMap}
          transparent={true}
          roughness={0.6}
          depthWrite={false}
        />
      </mesh>

      {/* ─── 4. Flush Glossy Packaging Tape ─── */}
      {/* Front Vertical Seam Tape */}
      <mesh position={[0, 1.1, 0.803]} castShadow>
        <planeGeometry args={[0.26, 2.18]} />
        <meshPhysicalMaterial
          map={tapeMap}
          transparent={true}
          opacity={0.88}
          roughness={0.15}
          ior={1.5}
          specularIntensity={1.0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Top Flap Seam Tape */}
      <mesh position={[0, 2.202, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[0.26, 1.58]} />
        <meshPhysicalMaterial
          map={tapeMap}
          transparent={true}
          opacity={0.88}
          roughness={0.15}
          ior={1.5}
          specularIntensity={1.0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Back Vertical Seam Tape */}
      <mesh position={[0, 1.1, -0.803]} rotation={[0, Math.PI, 0]} castShadow>
        <planeGeometry args={[0.26, 2.18]} />
        <meshPhysicalMaterial
          map={tapeMap}
          transparent={true}
          opacity={0.88}
          roughness={0.15}
          ior={1.5}
          specularIntensity={1.0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Ground Contact Shadow */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1.9]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}