import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D PET Plastic Bottle Barrier Component with 4 Evolution Stages:
 * - Stage 1: 200ml Water Bottle (Compact pocket bottle)
 * - Stage 2: 500ml Water Bottle (Standard spring water bottle with label)
 * - Stage 3: 1 Litre Water Bottle (Tall sports bottle with ribbed grip & sports cap)
 * - Stage 4: 20 Litre Water Can (Commercial dispenser jug with handle & ribs)
 */

// ─── Stage 1: 200 mL Compact Pocket Water Bottle ───
function Bottle200ml({ thickness = 1 }) {
  const [capMap] = useTexture(['/textures/cap-ribs.png']);

  const { bottlePts, waterPts } = useMemo(() => {
    const bPts = [];
    const wPts = [];

    // Compact 200ml profile
    bPts.push(new THREE.Vector2(0.0, 0.0));
    bPts.push(new THREE.Vector2(0.24, 0.02));
    bPts.push(new THREE.Vector2(0.38, 0.06));
    bPts.push(new THREE.Vector2(0.42, 0.15));
    bPts.push(new THREE.Vector2(0.42, 0.65));
    bPts.push(new THREE.Vector2(0.38, 0.85)); // ergonomic grip waist
    bPts.push(new THREE.Vector2(0.42, 1.05));
    bPts.push(new THREE.Vector2(0.42, 1.25));
    bPts.push(new THREE.Vector2(0.35, 1.45));
    bPts.push(new THREE.Vector2(0.18, 1.62));
    bPts.push(new THREE.Vector2(0.14, 1.66));
    bPts.push(new THREE.Vector2(0.14, 1.78));

    // Water Profile
    wPts.push(new THREE.Vector2(0.0, 0.04));
    wPts.push(new THREE.Vector2(0.35, 0.08));
    wPts.push(new THREE.Vector2(0.39, 0.65));
    wPts.push(new THREE.Vector2(0.35, 0.85));
    wPts.push(new THREE.Vector2(0.39, 1.05));
    wPts.push(new THREE.Vector2(0.39, 1.25));
    wPts.push(new THREE.Vector2(0.28, 1.40));
    wPts.push(new THREE.Vector2(0.0, 1.40));

    return { bottlePts: bPts, waterPts: wPts };
  }, []);

  const scale = 1 + thickness * 0.15;

  return (
    <group position={[0, -0.9, 0]} scale={[scale, scale, scale]}>
      {/* Outer Shell */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[bottlePts, 48]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transmission={0.96}
          roughness={0.02}
          ior={1.54}
          thickness={0.35}
          clearcoat={1.0}
          transparent
        />
      </mesh>

      {/* Cyan Water */}
      <mesh>
        <latheGeometry args={[waterPts, 48]} />
        <meshPhysicalMaterial
          color="#00d4ff"
          emissive="#00a8cc"
          emissiveIntensity={0.15}
          transmission={0.88}
          roughness={0.03}
          ior={1.333}
          transparent
        />
      </mesh>

      {/* Mini White Screw Cap */}
      <mesh position={[0, 1.78, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 36]} />
        <meshStandardMaterial map={capMap} roughness={0.3} color="#f5f5f5" />
      </mesh>

      {/* Safety Ring */}
      <mesh position={[0, 1.69, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.03, 36]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ─── Stage 2: 500 mL Standard Spring Water Bottle ───
function Bottle500ml({ thickness = 1 }) {
  const [labelMap, capMap] = useTexture([
    '/textures/bottle-label.png',
    '/textures/cap-ribs.png'
  ]);

  useMemo(() => {
    if (capMap) {
      capMap.wrapS = THREE.RepeatWrapping;
      capMap.repeat.set(4, 1);
    }
  }, [capMap]);

  const { bottlePts, waterPts } = useMemo(() => {
    const bPts = [];
    const wPts = [];

    bPts.push(new THREE.Vector2(0.0, 0.0));
    bPts.push(new THREE.Vector2(0.32, 0.02));
    bPts.push(new THREE.Vector2(0.49, 0.07));
    bPts.push(new THREE.Vector2(0.53, 0.16));
    bPts.push(new THREE.Vector2(0.53, 0.45));
    bPts.push(new THREE.Vector2(0.50, 0.52));
    bPts.push(new THREE.Vector2(0.53, 0.60));
    bPts.push(new THREE.Vector2(0.48, 0.85));
    bPts.push(new THREE.Vector2(0.53, 1.10));
    bPts.push(new THREE.Vector2(0.53, 1.70));
    bPts.push(new THREE.Vector2(0.49, 1.95));
    bPts.push(new THREE.Vector2(0.40, 2.22));
    bPts.push(new THREE.Vector2(0.24, 2.45));
    bPts.push(new THREE.Vector2(0.18, 2.50));
    bPts.push(new THREE.Vector2(0.22, 2.54));
    bPts.push(new THREE.Vector2(0.18, 2.58));
    bPts.push(new THREE.Vector2(0.18, 2.72));
    bPts.push(new THREE.Vector2(0.15, 2.74));

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
    wPts.push(new THREE.Vector2(0.35, 2.15));
    wPts.push(new THREE.Vector2(0.0, 2.15));

    return { bottlePts: bPts, waterPts: wPts };
  }, []);

  const scaleX = 0.9 + thickness * 0.18;
  const scaleZ = 0.9 + thickness * 0.18;

  return (
    <group position={[0, -1.2, 0]} scale={[scaleX, 1, scaleZ]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[bottlePts, 64]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transmission={0.95}
          opacity={1.0}
          transparent={true}
          roughness={0.02}
          ior={1.54}
          thickness={0.4}
          specularIntensity={1.2}
          specularColor="#ffffff"
          clearcoat={1.0}
          clearcoatRoughness={0.01}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <latheGeometry args={[waterPts, 64]} />
        <meshPhysicalMaterial
          color="#00d4ff"
          emissive="#00a8cc"
          emissiveIntensity={0.15}
          transmission={0.85}
          transparent={true}
          opacity={0.98}
          roughness={0.04}
          ior={1.333}
          thickness={0.7}
          specularIntensity={1.1}
        />
      </mesh>

      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.533, 0.533, 0.76, 64, 1, true]} />
        <meshStandardMaterial
          map={labelMap}
          roughness={0.15}
          metalness={0.08}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 2.74, 0]} castShadow>
        <cylinderGeometry args={[0.20, 0.20, 0.16, 48]} />
        <meshStandardMaterial
          map={capMap}
          bumpMap={capMap}
          bumpScale={0.03}
          roughness={0.3}
          metalness={0.12}
          color="#f5f5f5"
        />
      </mesh>

      <mesh position={[0, 2.63, 0]}>
        <cylinderGeometry args={[0.205, 0.205, 0.04, 48]} />
        <meshStandardMaterial color="#00d4ff" roughness={0.35} metalness={0.08} />
      </mesh>
    </group>
  );
}

// ─── Stage 3: 1 Litre Sports Water Bottle with Ribbed Grip & Sports Cap ───
function Bottle1Litre({ thickness = 1 }) {
  const { bottlePts, waterPts } = useMemo(() => {
    const bPts = [];
    const wPts = [];

    // Robust 1 Litre Profile
    bPts.push(new THREE.Vector2(0.0, 0.0));
    bPts.push(new THREE.Vector2(0.42, 0.02));
    bPts.push(new THREE.Vector2(0.62, 0.08));
    bPts.push(new THREE.Vector2(0.66, 0.20));
    bPts.push(new THREE.Vector2(0.66, 0.70));
    bPts.push(new THREE.Vector2(0.62, 0.80)); // Grip indent 1
    bPts.push(new THREE.Vector2(0.66, 0.90));
    bPts.push(new THREE.Vector2(0.62, 1.00)); // Grip indent 2
    bPts.push(new THREE.Vector2(0.66, 1.10));
    bPts.push(new THREE.Vector2(0.66, 1.95));
    bPts.push(new THREE.Vector2(0.58, 2.25));
    bPts.push(new THREE.Vector2(0.35, 2.52));
    bPts.push(new THREE.Vector2(0.24, 2.60));
    bPts.push(new THREE.Vector2(0.24, 2.78));

    // Water Profile
    wPts.push(new THREE.Vector2(0.0, 0.06));
    wPts.push(new THREE.Vector2(0.58, 0.10));
    wPts.push(new THREE.Vector2(0.62, 0.70));
    wPts.push(new THREE.Vector2(0.58, 0.80));
    wPts.push(new THREE.Vector2(0.62, 0.90));
    wPts.push(new THREE.Vector2(0.58, 1.00));
    wPts.push(new THREE.Vector2(0.62, 1.10));
    wPts.push(new THREE.Vector2(0.62, 1.95));
    wPts.push(new THREE.Vector2(0.48, 2.30));
    wPts.push(new THREE.Vector2(0.0, 2.30));

    return { bottlePts: bPts, waterPts: wPts };
  }, []);

  const scale = 1 + thickness * 0.15;

  return (
    <group position={[0, -1.35, 0]} scale={[scale, scale, scale]}>
      {/* Heavy Translucent Body with Sporty Blue Tint */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[bottlePts, 64]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.92}
          roughness={0.04}
          ior={1.54}
          thickness={0.5}
          clearcoat={1.0}
          transparent
        />
      </mesh>

      {/* Internal Water */}
      <mesh>
        <latheGeometry args={[waterPts, 64]} />
        <meshPhysicalMaterial
          color="#0ea5e9"
          transmission={0.85}
          roughness={0.03}
          ior={1.333}
          transparent
        />
      </mesh>

      {/* Textured Rubberized Mid-Grip Band */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.665, 0.665, 0.65, 48, 1, true]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Sports Flip Cap & Loop */}
      <mesh position={[0, 2.82, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 36]} />
        <meshStandardMaterial color="#0369a1" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.18, 2.92, 0]} rotation={[0, 0, 0.4]} castShadow>
        <torusGeometry args={[0.09, 0.025, 12, 24]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ─── Stage 4: 20 Litre Commercial Water Dispenser Can / Jug ───
function WaterCan20Litre({ thickness = 1 }) {
  const { canPts, waterPts } = useMemo(() => {
    const cPts = [];
    const wPts = [];

    // Commercial 20L Water Can Profile (Barrel shape with horizontal structural reinforcement rings)
    cPts.push(new THREE.Vector2(0.0, 0.0));
    cPts.push(new THREE.Vector2(0.55, 0.02));
    cPts.push(new THREE.Vector2(0.82, 0.08));
    cPts.push(new THREE.Vector2(0.88, 0.22));
    
    // Bottom Ring 1
    cPts.push(new THREE.Vector2(0.88, 0.45));
    cPts.push(new THREE.Vector2(0.82, 0.52));
    cPts.push(new THREE.Vector2(0.88, 0.59));

    // Mid Ring 2
    cPts.push(new THREE.Vector2(0.88, 0.95));
    cPts.push(new THREE.Vector2(0.82, 1.02));
    cPts.push(new THREE.Vector2(0.88, 1.09));

    // Top Ring 3
    cPts.push(new THREE.Vector2(0.88, 1.45));
    cPts.push(new THREE.Vector2(0.82, 1.52));
    cPts.push(new THREE.Vector2(0.88, 1.59));

    // Shoulder & Neck
    cPts.push(new THREE.Vector2(0.88, 1.80));
    cPts.push(new THREE.Vector2(0.72, 2.05));
    cPts.push(new THREE.Vector2(0.38, 2.22));
    cPts.push(new THREE.Vector2(0.26, 2.26));
    cPts.push(new THREE.Vector2(0.26, 2.50));
    cPts.push(new THREE.Vector2(0.22, 2.52));

    // Water Volume
    wPts.push(new THREE.Vector2(0.0, 0.06));
    wPts.push(new THREE.Vector2(0.78, 0.10));
    wPts.push(new THREE.Vector2(0.84, 0.45));
    wPts.push(new THREE.Vector2(0.78, 0.52));
    wPts.push(new THREE.Vector2(0.84, 0.59));
    wPts.push(new THREE.Vector2(0.84, 0.95));
    wPts.push(new THREE.Vector2(0.78, 1.02));
    wPts.push(new THREE.Vector2(0.84, 1.09));
    wPts.push(new THREE.Vector2(0.84, 1.45));
    wPts.push(new THREE.Vector2(0.78, 1.52));
    wPts.push(new THREE.Vector2(0.84, 1.59));
    wPts.push(new THREE.Vector2(0.84, 1.78));
    wPts.push(new THREE.Vector2(0.60, 2.00));
    wPts.push(new THREE.Vector2(0.0, 2.00));

    return { canPts: cPts, waterPts: wPts };
  }, []);

  const scale = 0.9 + thickness * 0.15;

  return (
    <group position={[0, -1.2, 0]} scale={[scale, scale, scale]}>
      {/* Heavy Polycarbonate 20L Water Can Body (Translucent Sky Blue) */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[canPts, 64]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transmission={0.92}
          roughness={0.06}
          ior={1.56}
          thickness={0.8}
          clearcoat={1.0}
          transparent
        />
      </mesh>

      {/* 20 Litres Pure Water Volume */}
      <mesh>
        <latheGeometry args={[waterPts, 64]} />
        <meshPhysicalMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.12}
          transmission={0.85}
          roughness={0.04}
          ior={1.333}
          transparent
        />
      </mesh>

      {/* Molded Side Carry Handle */}
      <group position={[0.74, 1.25, 0]} rotation={[0, 0, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.22, 0.055, 16, 32, Math.PI * 0.9]} />
          <meshPhysicalMaterial
            color="#bae6fd"
            transmission={0.9}
            roughness={0.08}
            ior={1.56}
            transparent
          />
        </mesh>
      </group>

      {/* Non-Spill Blue Dispenser Seal Cap */}
      <mesh position={[0, 2.52, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.16, 36]} />
        <meshStandardMaterial color="#0284c7" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.61, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ─── Master Bottle Barrier Component (Switches among 4 Stages) ───
export default function BottleBarrier({ stage = 2, thickness = 1 }) {
  if (stage === 1) return <Bottle200ml thickness={thickness} />;
  if (stage === 2) return <Bottle500ml thickness={thickness} />;
  if (stage === 3) return <Bottle1Litre thickness={thickness} />;
  return <WaterCan20Litre thickness={thickness} />;
}
