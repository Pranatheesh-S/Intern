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

// ─── 2. Ultra-Dense Vibrant Multi-Tone Foliage Sprig Texture ───
function generateLushLeafSprigTexture() {
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

    // Leaf vein
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -80);
    ctx.lineTo(0, 80);
    ctx.stroke();
    ctx.restore();
  };

  // Dense multi-leaf cluster with rich forest & lime tones
  drawOakLeaf(256, 256, 0, 1.25, '#15803d');
  drawOakLeaf(175, 275, -0.65, 1.1, '#166534');
  drawOakLeaf(337, 275, 0.65, 1.1, '#15803d');
  drawOakLeaf(256, 145, 0.2, 1.15, '#22c55e');
  drawOakLeaf(205, 385, -0.35, 0.95, '#14532d');
  drawOakLeaf(307, 385, 0.35, 0.95, '#16a34a');
  drawOakLeaf(135, 195, -0.9, 0.9, '#15803d');
  drawOakLeaf(377, 195, 0.9, 0.9, '#4ade80');

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export default function TreeBarrier({ thickness = 1 }) {
  const barkMap = useMemo(() => generateOakBarkTexture(), []);
  const leafMap = useMemo(() => generateLushLeafSprigTexture(), []);
  const canopyRef = useRef();

  // ─── 650 Multi-Layered Natural Canopy Leaf Cards ───
  const foliageLeaves = useMemo(() => {
    const cards = [];
    const count = 650;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      // Volumetric multi-lobe egg profile filling both surface and interior
      const depthFactor = 0.55 + Math.random() * 0.55;
      const radX = (0.75 + Math.random() * 0.35) * depthFactor;
      const radY = (1.1 + Math.random() * 0.45) * depthFactor;
      const radZ = (0.75 + Math.random() * 0.35) * depthFactor;

      const x = radX * Math.sin(phi) * Math.cos(theta);
      const y = radY * Math.cos(phi) + 2.25;
      const z = radZ * Math.sin(phi) * Math.sin(theta);
      const scale = 0.5 + Math.random() * 0.35;

      cards.push({
        pos: [x, y, z],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale
      });
    }
    return cards;
  }, []);

  // Subtle wind sway animation
  useFrame((state) => {
    if (canopyRef.current) {
      const t = state.clock.getElapsedTime();
      canopyRef.current.rotation.z = Math.sin(t * 1.1) * 0.012;
      canopyRef.current.rotation.x = Math.cos(t * 0.8) * 0.009;
    }
  });

  const scaleX = 0.85 + thickness * 0.15;
  const scaleZ = 0.85 + thickness * 0.15;

  return (
    <group position={[0, -1.5, 0]} scale={[scaleX, 1, scaleZ]}>
      {/* ─── 1. Main Oak Trunk (Warm Brown Wood) ─── */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.35, 1.4, 32]} />
        <meshStandardMaterial
          map={barkMap}
          roughness={0.88}
          metalness={0.02}
          color="#854d0e"
        />
      </mesh>

      {/* ─── 2. Sprawling Base Roots ─── */}
      {/* Root Flare 1 (Front-Left) */}
      <mesh position={[-0.22, 0.14, 0.16]} rotation={[0.4, -0.6, -0.35]} castShadow>
        <cylinderGeometry args={[0.07, 0.16, 0.65, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.92} color="#78350f" />
      </mesh>

      {/* Root Flare 2 (Front-Right) */}
      <mesh position={[0.24, 0.12, 0.14]} rotation={[0.35, 0.7, 0.4]} castShadow>
        <cylinderGeometry args={[0.07, 0.15, 0.62, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.92} color="#78350f" />
      </mesh>

      {/* Root Flare 3 (Back-Center) */}
      <mesh position={[0.0, 0.12, -0.24]} rotation={[-0.45, 0.1, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.17, 0.6, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.92} color="#78350f" />
      </mesh>

      {/* Root Flare 4 (Side-Left) */}
      <mesh position={[-0.26, 0.1, -0.1]} rotation={[-0.2, -1.1, -0.38]} castShadow>
        <cylinderGeometry args={[0.06, 0.14, 0.55, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.92} color="#78350f" />
      </mesh>

      {/* Natural Dark Earth/Soil Mound */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.72, 0.08, 32]} />
        <meshStandardMaterial color="#271810" roughness={0.98} />
      </mesh>

      {/* ─── 3. Upper Branch Scaffolding ─── */}
      <mesh position={[0, 1.7, 0]} rotation={[0.08, 0.1, 0.05]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 1.1, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>
      <mesh position={[-0.22, 1.58, 0.06]} rotation={[0.2, 0.35, 0.6]} castShadow>
        <cylinderGeometry args={[0.07, 0.13, 0.95, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>
      <mesh position={[0.24, 1.62, -0.05]} rotation={[-0.15, -0.4, -0.55]} castShadow>
        <cylinderGeometry args={[0.07, 0.13, 0.95, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>

      {/* ─── 4. Dense Lush Green Leaf Canopy (650 Leaf Cards) ─── */}
      <group ref={canopyRef}>
        {foliageLeaves.map((leaf, idx) => (
          <mesh
            key={idx}
            position={leaf.pos}
            rotation={leaf.rot}
            scale={[leaf.scale, leaf.scale, leaf.scale]}
            castShadow
          >
            <planeGeometry args={[0.75, 0.75]} />
            <meshStandardMaterial
              map={leafMap}
              transparent={true}
              alphaTest={0.32}
              side={THREE.DoubleSide}
              roughness={0.42}
              depthWrite={true}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}