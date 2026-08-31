import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ─── 1. Rich Warm Oak Bark Texture ───
function generateOakBarkTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Rich warm brown timber base
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(0, 0, size, size);

  // Vertical furrowed grain ridges
  for (let x = 0; x < size; x += 4) {
    const tone = Math.random() * 0.4 + 0.6;
    ctx.strokeStyle = `rgba(${Math.floor(60 * tone)}, ${Math.floor(35 * tone)}, ${Math.floor(18 * tone)}, 0.85)`;
    ctx.lineWidth = Math.random() * 4 + 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(
      x + (Math.random() - 0.5) * 20, size * 0.33,
      x + (Math.random() - 0.5) * 20, size * 0.66,
      x, size
    );
    ctx.stroke();
  }

  // Micro surface bark speckling
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(45, 25, 12, 0.4)' : 'rgba(140, 95, 55, 0.3)';
    ctx.fillRect(Math.random() * size, Math.random() * size, 3, 6);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 3);
  return texture;
}

// ─── 2. Deep Dark Green Foliage Leaf Texture ───
function generateDarkGreenLeafTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  const drawOakLeaf = (cx, cy, angle, scale, fillCol) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.fillStyle = fillCol;

    ctx.beginPath();
    ctx.moveTo(0, -90);
    ctx.bezierCurveTo(45, -60, 55, -20, 35, 20);
    ctx.bezierCurveTo(20, 55, 10, 75, 0, 90);
    ctx.bezierCurveTo(-10, 75, -20, 55, -35, 20);
    ctx.bezierCurveTo(-55, -20, -45, -60, 0, -90);
    ctx.fill();

    // Subtle dark vein highlight
    ctx.strokeStyle = 'rgba(134, 239, 172, 0.35)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -80);
    ctx.lineTo(0, 80);
    ctx.stroke();
    ctx.restore();
  };

  // Deep rich dark green palette for dense foliage
  drawOakLeaf(256, 256, 0, 1.25, '#0a2f14');     // Deepest forest green
  drawOakLeaf(175, 275, -0.65, 1.1, '#0d3d1a');  // Dark emerald
  drawOakLeaf(337, 275, 0.65, 1.1, '#0a2f14');   // Deepest forest green
  drawOakLeaf(256, 145, 0.2, 1.15, '#14532d');   // Rich dark green
  drawOakLeaf(205, 385, -0.35, 0.95, '#06200d'); // Midnight green shadow
  drawOakLeaf(307, 385, 0.35, 0.95, '#0f4620');  // Dark pine green
  drawOakLeaf(135, 195, -0.9, 0.9, '#0d3d1a');   // Dark emerald
  drawOakLeaf(377, 195, 0.9, 0.9, '#166534');    // Deep moss green
  drawOakLeaf(256, 85, -0.15, 0.9, '#14532d');   // Top accent

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export default function TreeBarrier({ thickness = 1 }) {
  const barkMap = useMemo(() => generateOakBarkTexture(), []);
  const leafMap = useMemo(() => generateDarkGreenLeafTexture(), []);
  const treeGroupRef = useRef();
  const foliageRef = useRef();

  // ─── Lush Foliage Clusters with Abundant Left and Right Canopy ───
  const leafClusters = useMemo(() => {
    // Generous canopy clusters focusing on left and right flanks + top apex
    const clusterCenters = [
      // Left side clusters (abundant & lush)
      { center: [-0.65, 2.05, 0.15], radius: 0.48, count: 50 },  // Far-left branch tip
      { center: [-0.42, 1.75, 0.25], radius: 0.44, count: 42 },  // Mid-left lower branch
      { center: [-0.52, 2.35, -0.1], radius: 0.46, count: 45 },  // Left upper canopy crown
      { center: [-0.75, 1.90, -0.2], radius: 0.42, count: 38 },  // Left rear flank

      // Right side clusters (abundant & lush)
      { center: [0.68, 2.10, -0.12], radius: 0.48, count: 50 },  // Far-right branch tip
      { center: [0.45, 1.78, 0.22], radius: 0.44, count: 42 },   // Mid-right lower branch
      { center: [0.55, 2.38, 0.1], radius: 0.46, count: 45 },    // Right upper canopy crown
      { center: [0.78, 1.92, 0.18], radius: 0.42, count: 38 },   // Right front flank

      // Center, Front & Apex canopy
      { center: [0.05, 2.65, 0.0], radius: 0.52, count: 55 },    // Top apex crown
      { center: [0.08, 1.85, 0.52], radius: 0.46, count: 48 },   // Front-center main bough
      { center: [-0.22, 1.98, 0.45], radius: 0.42, count: 40 },  // Front-left canopy
      { center: [0.25, 2.02, 0.46], radius: 0.42, count: 40 },   // Front-right canopy
      { center: [0.02, 2.25, 0.50], radius: 0.44, count: 42 },   // Front upper bough

      // Backside clusters (lush & balanced for 360-degree rotation)
      { center: [0.0, 2.05, -0.55], radius: 0.48, count: 50 },   // Rear center main bough
      { center: [-0.35, 2.15, -0.48], radius: 0.45, count: 44 }, // Rear-left canopy
      { center: [0.38, 2.18, -0.45], radius: 0.45, count: 44 },  // Rear-right canopy
      { center: [-0.15, 2.50, -0.38], radius: 0.46, count: 46 }, // Rear upper crown
      { center: [0.22, 1.80, -0.50], radius: 0.42, count: 38 }   // Rear lower branch
    ];

    const cards = [];
    clusterCenters.forEach((c) => {
      for (let i = 0; i < c.count; i++) {
        const phi = Math.acos(-1 + (2 * i) / c.count);
        const theta = Math.sqrt(c.count * Math.PI) * phi;
        const rad = c.radius * (0.62 + Math.random() * 0.48);

        const x = c.center[0] + rad * Math.sin(phi) * Math.cos(theta);
        const y = c.center[1] + rad * Math.cos(phi) * 0.88;
        const z = c.center[2] + rad * Math.sin(phi) * Math.sin(theta);

        cards.push({
          pos: [x, y, z],
          rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          scale: 0.46 + Math.random() * 0.22
        });
      }
    });

    return cards;
  }, []);

  // Subtle natural wind sway
  useFrame((state) => {
    if (foliageRef.current) {
      const t = state.clock.getElapsedTime();
      foliageRef.current.rotation.z = Math.sin(t * 1.1) * 0.012;
      foliageRef.current.rotation.x = Math.cos(t * 0.8) * 0.008;
    }
  });

  const scaleX = 0.95 + thickness * 0.15;
  const scaleY = 1.0;
  const scaleZ = 0.95 + thickness * 0.15;

  return (
    <group ref={treeGroupRef} position={[0, -1.35, 0]} scale={[scaleX, scaleY, scaleZ]}>
      
      {/* ─── 1. Sprawling Buttress Roots (Directly on ground, bottom disc removed) ─── */}
      <mesh position={[-0.24, 0.15, 0.18]} rotation={[0.42, -0.6, -0.38]} castShadow>
        <cylinderGeometry args={[0.07, 0.16, 0.65, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#78350f" />
      </mesh>
      <mesh position={[0.26, 0.13, 0.15]} rotation={[0.38, 0.72, 0.42]} castShadow>
        <cylinderGeometry args={[0.07, 0.15, 0.62, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#78350f" />
      </mesh>
      <mesh position={[0.02, 0.13, -0.26]} rotation={[-0.48, 0.12, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.17, 0.6, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#78350f" />
      </mesh>
      <mesh position={[-0.28, 0.11, -0.12]} rotation={[-0.22, -1.15, -0.4]} castShadow>
        <cylinderGeometry args={[0.06, 0.14, 0.55, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#78350f" />
      </mesh>

      {/* ─── 2. Main Sturdy Oak Trunk ─── */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.32, 1.35, 32]} />
        <meshStandardMaterial
          map={barkMap}
          roughness={0.88}
          metalness={0.02}
          color="#854d0e"
        />
      </mesh>

      {/* Trunk Middle Knot / Fork Core */}
      <mesh position={[0.02, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>

      {/* ─── 3. Prominent Spreading 3D Branches ─── */}
      
      {/* Primary Branch 1: Sweeping Left Branch */}
      <group position={[-0.08, 1.38, 0.02]} rotation={[0.18, 0.25, 0.68]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.14, 0.82, 16]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
        {/* Left Sub-Branch 1 */}
        <mesh position={[-0.06, 0.68, 0.08]} rotation={[0.25, 0.4, 0.45]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.58, 12]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
        {/* Left Sub-Branch 2 (Outer Reach) */}
        <mesh position={[0.04, 0.55, -0.12]} rotation={[-0.2, -0.3, -0.35]} castShadow>
          <cylinderGeometry args={[0.04, 0.07, 0.48, 12]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
      </group>

      {/* Primary Branch 2: Sweeping Right Branch */}
      <group position={[0.08, 1.40, -0.02]} rotation={[-0.14, -0.32, -0.65]}>
        <mesh position={[0, 0.40, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.14, 0.85, 16]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
        {/* Right Sub-Branch 1 */}
        <mesh position={[0.07, 0.72, -0.06]} rotation={[-0.2, -0.35, -0.42]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.60, 12]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
        {/* Right Sub-Branch 2 (Outer Reach) */}
        <mesh position={[-0.05, 0.58, 0.12]} rotation={[0.22, 0.3, 0.38]} castShadow>
          <cylinderGeometry args={[0.04, 0.07, 0.50, 12]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
      </group>

      {/* Primary Branch 3: Front-Reaching Branch */}
      <group position={[0.02, 1.36, 0.06]} rotation={[0.62, 0.1, -0.15]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.68, 16]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
        {/* Secondary Fork */}
        <mesh position={[0.05, 0.56, 0.04]} rotation={[0.3, 0.4, 0.3]} castShadow>
          <cylinderGeometry args={[0.04, 0.07, 0.42, 12]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
      </group>

      {/* Primary Branch 4: Back-Left Branch */}
      <group position={[-0.04, 1.42, -0.06]} rotation={[-0.55, -0.5, 0.38]}>
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.74, 16]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
      </group>

      {/* Central Upper Trunk Extension leading to Apex */}
      <mesh position={[0.01, 1.82, 0]} rotation={[0.04, 0.08, 0.02]} castShadow>
        <cylinderGeometry args={[0.09, 0.15, 0.88, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>

      {/* Top Apex Sub-Branches */}
      <mesh position={[-0.08, 2.22, 0.04]} rotation={[0.15, 0.2, 0.35]} castShadow>
        <cylinderGeometry args={[0.04, 0.08, 0.55, 12]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>
      <mesh position={[0.08, 2.24, -0.03]} rotation={[-0.12, -0.2, -0.32]} castShadow>
        <cylinderGeometry args={[0.04, 0.08, 0.55, 12]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>

      {/* ─── 4. Dense Dark Green Foliage Clusters (Lush on Left & Right) ─── */}
      <group ref={foliageRef}>
        {leafClusters.map((leaf, idx) => (
          <mesh
            key={idx}
            position={leaf.pos}
            rotation={leaf.rot}
            scale={[leaf.scale, leaf.scale, leaf.scale]}
            castShadow
          >
            <planeGeometry args={[0.66, 0.66]} />
            <meshStandardMaterial
              map={leafMap}
              transparent={true}
              alphaTest={0.32}
              side={THREE.DoubleSide}
              roughness={0.4}
              depthWrite={true}
            />
          </mesh>
        ))}
      </group>

    </group>
  );
}