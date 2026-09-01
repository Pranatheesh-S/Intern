import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D Glass Barrier Component with 4 Stages:
 * - Stage 1: Small Glass (Compact thick-base shot/espresso glass)
 * - Stage 2: Big Glass (Tall crystal highball tumbler with water & ice cubes)
 * - Stage 3: Glass Bowl (Wide curved Pyrex glass bowl with water)
 * - Stage 4: Glass Container (Apothecary / lab storage jar with glass lid & graduations)
 */

// ─── Stage 1: Small Glass (Shot / Mini Tumbler) ───
function SmallGlass({ thickness = 1 }) {
  const { glassPts, waterPts } = useMemo(() => {
    const gPts = [];
    const wPts = [];

    // Compact heavy-base shot glass
    gPts.push(new THREE.Vector2(0.0, 0.0));
    gPts.push(new THREE.Vector2(0.38, 0.0));
    gPts.push(new THREE.Vector2(0.42, 0.05));
    gPts.push(new THREE.Vector2(0.44, 0.35)); // Thick solid base
    gPts.push(new THREE.Vector2(0.49, 0.75));
    gPts.push(new THREE.Vector2(0.54, 1.25));
    gPts.push(new THREE.Vector2(0.52, 1.28));
    gPts.push(new THREE.Vector2(0.46, 1.25));
    gPts.push(new THREE.Vector2(0.40, 0.75));
    gPts.push(new THREE.Vector2(0.34, 0.40));
    gPts.push(new THREE.Vector2(0.0, 0.40));

    wPts.push(new THREE.Vector2(0.0, 0.42));
    wPts.push(new THREE.Vector2(0.33, 0.42));
    wPts.push(new THREE.Vector2(0.41, 0.85));
    wPts.push(new THREE.Vector2(0.46, 1.10));
    wPts.push(new THREE.Vector2(0.0, 1.10));

    return { glassPts: gPts, waterPts: wPts };
  }, []);

  const scale = 1.1 + thickness * 0.15;

  return (
    <group position={[0, -0.7, 0]} scale={[scale, scale, scale]}>
      {/* Heavy Crystal Shot Glass Body */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[glassPts, 48]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.96}
          roughness={0.02}
          ior={1.54}
          thickness={0.8}
          specularIntensity={1.3}
          clearcoat={1.0}
          transparent
        />
      </mesh>

      {/* Internal Liquid */}
      <mesh>
        <latheGeometry args={[waterPts, 48]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transmission={0.9}
          roughness={0.03}
          ior={1.333}
          transparent
        />
      </mesh>
    </group>
  );
}

// ─── Stage 2: Big Glass (Tall Highball Glass with Water & Ice) ───
function BigGlass({ thickness = 1 }) {
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

  const scale = 1 + thickness * 0.15;

  return (
    <group position={[0, -1.1, 0]} scale={[scale, scale, scale]}>
      {/* Outer Highball Glass Cylinder */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.52, 2.3, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.96}
          roughness={0.02}
          ior={1.52}
          thickness={0.6}
          specularIntensity={1.2}
          clearcoat={1.0}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Glass Rim Ring */}
      <mesh position={[0, 2.30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.49, 0.54, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          roughness={0.02}
          ior={1.52}
          thickness={0.8}
          transparent
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
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Water Cylinder & Meniscus */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.485, 0.475, 1.85, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.88}
          roughness={0.02}
          ior={1.333}
          thickness={0.5}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 1.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.485, 64]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transmission={0.85}
          roughness={0.02}
          ior={1.333}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Crystalline Ice Cubes */}
      <group position={[-0.06, 0.52, 0.05]} rotation={[0.15, 0.38, 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[0.31, 0.31, 0.31]} />
          <meshPhysicalMaterial
            map={iceMap || null}
            color="#e0f2fe"
            transmission={0.78}
            roughness={0.05}
            ior={1.31}
            thickness={0.55}
            specularIntensity={1.3}
            transparent
          />
        </mesh>
      </group>

      <group position={[0.09, 0.93, -0.03]} rotation={[-0.14, 0.58, -0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.295, 0.295, 0.295]} />
          <meshPhysicalMaterial
            map={iceMap || null}
            color="#e0f2fe"
            transmission={0.78}
            roughness={0.05}
            ior={1.31}
            thickness={0.55}
            specularIntensity={1.3}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── Stage 3: Glass Bowl (Wide Curved Pyrex Glass Bowl with Water) ───
function GlassBowl({ thickness = 1 }) {
  const { bowlPts, waterPts } = useMemo(() => {
    const bPts = [];
    const wPts = [];

    // Wide Hemispherical Pyrex Bowl Profile
    bPts.push(new THREE.Vector2(0.0, 0.0));
    bPts.push(new THREE.Vector2(0.42, 0.02)); // Flat stable base
    bPts.push(new THREE.Vector2(0.65, 0.15));
    bPts.push(new THREE.Vector2(0.85, 0.40));
    bPts.push(new THREE.Vector2(0.98, 0.72));
    bPts.push(new THREE.Vector2(1.02, 1.05));
    bPts.push(new THREE.Vector2(1.08, 1.08)); // Flanged top rim
    bPts.push(new THREE.Vector2(1.04, 1.05));
    bPts.push(new THREE.Vector2(0.92, 0.72));
    bPts.push(new THREE.Vector2(0.78, 0.40));
    bPts.push(new THREE.Vector2(0.55, 0.15));
    bPts.push(new THREE.Vector2(0.0, 0.08));

    // Water Profile inside bowl
    wPts.push(new THREE.Vector2(0.0, 0.10));
    wPts.push(new THREE.Vector2(0.53, 0.16));
    wPts.push(new THREE.Vector2(0.76, 0.40));
    wPts.push(new THREE.Vector2(0.90, 0.70));
    wPts.push(new THREE.Vector2(0.0, 0.70)); // Water surface

    return { bowlPts: bPts, waterPts: wPts };
  }, []);

  const scale = 1.0 + thickness * 0.15;

  return (
    <group position={[0, -0.6, 0]} scale={[scale, scale, scale]}>
      {/* Pyrex Glass Bowl */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[bowlPts, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.96}
          roughness={0.02}
          ior={1.52}
          thickness={0.7}
          specularIntensity={1.2}
          clearcoat={1.0}
          transparent
        />
      </mesh>

      {/* Water in Bowl */}
      <mesh>
        <latheGeometry args={[waterPts, 64]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.1}
          transmission={0.88}
          roughness={0.03}
          ior={1.333}
          transparent
        />
      </mesh>
    </group>
  );
}

// ─── Stage 4: Glass Container (Apothecary / Lab Storage Jar with Lid) ───
function GlassContainer({ thickness = 1 }) {
  const { jarPts, lidPts } = useMemo(() => {
    const jPts = [];
    const lPts = [];

    // Heavy Cylindrical Glass Storage Jar Profile
    jPts.push(new THREE.Vector2(0.0, 0.0));
    jPts.push(new THREE.Vector2(0.68, 0.0));
    jPts.push(new THREE.Vector2(0.72, 0.06));
    jPts.push(new THREE.Vector2(0.72, 1.80)); // Tall cylindrical wall
    jPts.push(new THREE.Vector2(0.65, 1.95)); // Rounded shoulder
    jPts.push(new THREE.Vector2(0.55, 2.02));
    jPts.push(new THREE.Vector2(0.58, 2.06)); // Thickened sealing mouth ring
    jPts.push(new THREE.Vector2(0.55, 2.15));
    jPts.push(new THREE.Vector2(0.46, 2.15)); // Inner mouth opening
    jPts.push(new THREE.Vector2(0.46, 1.98));
    jPts.push(new THREE.Vector2(0.62, 1.78));
    jPts.push(new THREE.Vector2(0.62, 0.08));
    jPts.push(new THREE.Vector2(0.0, 0.08));

    // Heavy Fitted Glass Lid
    lPts.push(new THREE.Vector2(0.0, 2.12));
    lPts.push(new THREE.Vector2(0.44, 2.12));
    lPts.push(new THREE.Vector2(0.44, 2.18));
    lPts.push(new THREE.Vector2(0.62, 2.22)); // Outer sealing flange
    lPts.push(new THREE.Vector2(0.62, 2.34));
    lPts.push(new THREE.Vector2(0.35, 2.45)); // Knob base
    lPts.push(new THREE.Vector2(0.24, 2.50));
    lPts.push(new THREE.Vector2(0.28, 2.68)); // Knob top
    lPts.push(new THREE.Vector2(0.0, 2.70));

    return { jarPts: jPts, lidPts: lPts };
  }, []);

  const scale = 0.95 + thickness * 0.15;

  return (
    <group position={[0, -1.1, 0]} scale={[scale, scale, scale]}>
      {/* Main Glass Jar Body */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[jarPts, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          roughness={0.03}
          ior={1.53}
          thickness={0.8}
          clearcoat={1.0}
          transparent
        />
      </mesh>

      {/* Graduated Volume Markings along the Glass Wall */}
      {[0.4, 0.7, 1.0, 1.3, 1.6].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.725]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.22, 0.015]} />
          <meshBasicMaterial color="#334155" opacity={0.65} transparent />
        </mesh>
      ))}

      {/* Heavy Airtight Glass Lid */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <latheGeometry args={[lidPts, 48]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.94}
          roughness={0.04}
          ior={1.53}
          thickness={0.9}
          clearcoat={1.0}
          transparent
        />
      </mesh>

      {/* Rubber Sealing Gasket Ring */}
      <mesh position={[0, 2.15, 0]}>
        <torusGeometry args={[0.54, 0.032, 16, 48]} />
        <meshStandardMaterial color="#f97316" roughness={0.6} />
      </mesh>

      {/* Metallic Locking Wire Clamp */}
      <mesh position={[0, 2.05, 0]}>
        <torusGeometry args={[0.59, 0.02, 12, 48]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── Master Glass Barrier Component (Switches among 4 Stages) ───
export default function GlassBarrier({ stage = 2, thickness = 1 }) {
  if (stage === 1) return <SmallGlass thickness={thickness} />;
  if (stage === 2) return <BigGlass thickness={thickness} />;
  if (stage === 3) return <GlassBowl thickness={thickness} />;
  return <GlassContainer thickness={thickness} />;
}
