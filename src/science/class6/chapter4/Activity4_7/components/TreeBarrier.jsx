import React, { useMemo } from 'react';
import * as THREE from 'three';
import RusticLogMesh from './RusticLogMesh';

// ─── Texture 1: Parchment / Lined Paper Sheet Texture ───
function generatePaperTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Crisp clean off-white parchment paper
  ctx.fillStyle = '#fbfbf9';
  ctx.fillRect(0, 0, size, size);

  // Subtle cellulose pulp noise
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(215, 205, 190, 0.25)' : 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }

  // Left red margin line
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(70, size);
  ctx.stroke();

  // Blue horizontal ruled notebook lines
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.5;
  for (let y = 60; y < size; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Header Title Text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('Stage 1: Paper Sheet', 90, 45);

  // Body Text lines
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText('• Plant Cellulose Fiber', 90, 95);
  ctx.fillText('• Non-Magnetic Material', 90, 127);
  ctx.fillText('• Magnetic field passes freely', 90, 159);
  ctx.fillText('• Compass needle deflects!', 90, 191);

  // Bottom stamp
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.strokeRect(90, 240, 260, 50);
  ctx.fillStyle = '#047857';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText('✓ PASSED: INDUCTION TEST', 105, 272);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ─── Texture 2: Rich Warm Oak Bark Texture ───
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

// ─── Texture 3: Deep Dark Green Foliage Leaf Texture ───
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

  drawOakLeaf(256, 256, 0, 1.25, '#0a2f14');
  drawOakLeaf(175, 275, -0.65, 1.1, '#0d3d1a');
  drawOakLeaf(337, 275, 0.65, 1.1, '#0a2f14');
  drawOakLeaf(256, 145, 0.2, 1.15, '#14532d');
  drawOakLeaf(205, 385, -0.35, 0.95, '#06200d');
  drawOakLeaf(307, 385, 0.35, 0.95, '#0f4620');
  drawOakLeaf(135, 195, -0.9, 0.9, '#0d3d1a');
  drawOakLeaf(377, 195, 0.9, 0.9, '#166534');
  drawOakLeaf(256, 85, -0.15, 0.9, '#14532d');

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ─────────────────────────────────────────────────────────────
// 1. PART 1: Paper Model (Parchment Sheet of Paper on Stand)
// ─────────────────────────────────────────────────────────────
function PaperModel({ thickness = 1 }) {
  const paperMap = useMemo(() => generatePaperTexture(), []);

  return (
    <group position={[0, 0, 0]} scale={[1 + thickness * 0.1, 1, 1]}>
      {/* Front Face of Paper Sheet */}
      <mesh castShadow receiveShadow position={[0, 0, 0.01]}>
        <boxGeometry args={[1.55, 2.15, 0.03]} />
        <meshStandardMaterial 
          map={paperMap} 
          roughness={0.65} 
          metalness={0.02} 
          color="#ffffff"
        />
      </mesh>

      {/* Paper Clip on Top Left */}
      <mesh position={[-0.55, 1.05, 0.04]} castShadow>
        <torusGeometry args={[0.07, 0.018, 12, 24, Math.PI * 1.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Stand / Base Holder */}
      <mesh position={[0, -1.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.12, 0.45]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, -1.04, 0]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. PART 2: Small Piece of Wood (High-Precision Rustic Wooden Log Timber)
// ─────────────────────────────────────────────────────────────
function WoodPieceModel({ thickness = 1, viewMode = 'textured' }) {
  return <RusticLogMesh thickness={thickness} viewMode={viewMode} />;
}

// ─────────────────────────────────────────────────────────────
// 3. PART 3: Plant Model (Sprouting Young Potted Plant)
// ─────────────────────────────────────────────────────────────
function PlantModel({ thickness = 1 }) {
  const leafMap = useMemo(() => generateDarkGreenLeafTexture(), []);

  return (
    <group position={[0, -0.4, 0]} scale={[1 + thickness * 0.12, 1, 1 + thickness * 0.12]}>
      {/* Terracotta Ceramic Pot */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.44, 0.85, 32]} />
        <meshStandardMaterial color="#c2410c" roughness={0.65} />
      </mesh>

      {/* Pot Rim */}
      <mesh position={[0, 0.43, 0]} castShadow>
        <torusGeometry args={[0.62, 0.06, 16, 32]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>

      {/* Rich Dark Soil */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.59, 32]} />
        <meshStandardMaterial color="#1c1917" roughness={0.95} />
      </mesh>

      {/* Central Green Stem */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.07, 1.15, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.5} />
      </mesh>

      {/* Plant Leaves (Radial Sprouting Foliage) */}
      {[
        { pos: [-0.28, 0.92, 0.15], rot: [0.4, 0.6, 0.85], scale: 0.65 },
        { pos: [0.32, 0.98, -0.12], rot: [-0.3, -0.7, -0.8], scale: 0.68 },
        { pos: [0.08, 1.25, 0.32], rot: [0.9, 0.1, -0.2], scale: 0.62 },
        { pos: [-0.15, 1.35, -0.28], rot: [-0.85, -0.4, 0.3], scale: 0.62 },
        { pos: [0.24, 1.50, 0.18], rot: [0.5, 0.8, -0.6], scale: 0.58 },
        { pos: [-0.22, 1.55, -0.1], rot: [-0.4, -0.9, 0.65], scale: 0.58 },
        { pos: [0.0, 1.78, 0.0], rot: [0.1, 0, 0], scale: 0.52 } // Top apex leaf
      ].map((l, i) => (
        <mesh key={i} position={l.pos} rotation={l.rot} scale={[l.scale, l.scale, l.scale]} castShadow>
          <planeGeometry args={[0.65, 0.65]} />
          <meshStandardMaterial 
            map={leafMap} 
            transparent={true} 
            alphaTest={0.25} 
            side={THREE.DoubleSide} 
            roughness={0.35} 
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. PART 4: Full Living Oak Tree
// ─────────────────────────────────────────────────────────────
function FullTreeModel({ thickness = 1 }) {
  const barkMap = useMemo(() => generateOakBarkTexture(), []);
  const leafMap = useMemo(() => generateDarkGreenLeafTexture(), []);

  const leafClusters = useMemo(() => {
    const clusterCenters = [
      { center: [-0.65, 2.05, 0.15], radius: 0.48, count: 50 },
      { center: [-0.42, 1.75, 0.25], radius: 0.44, count: 42 },
      { center: [-0.52, 2.35, -0.1], radius: 0.46, count: 45 },
      { center: [-0.75, 1.90, -0.2], radius: 0.42, count: 38 },
      { center: [0.68, 2.10, -0.12], radius: 0.48, count: 50 },
      { center: [0.45, 1.78, 0.22], radius: 0.44, count: 42 },
      { center: [0.55, 2.38, 0.1], radius: 0.46, count: 45 },
      { center: [0.78, 1.92, 0.18], radius: 0.42, count: 38 },
      { center: [0.05, 2.65, 0.0], radius: 0.52, count: 55 },
      { center: [0.08, 1.85, 0.52], radius: 0.46, count: 48 },
      { center: [-0.22, 1.98, 0.45], radius: 0.42, count: 40 },
      { center: [0.25, 2.02, 0.46], radius: 0.42, count: 40 },
      { center: [0.02, 2.25, 0.50], radius: 0.44, count: 42 },
      { center: [0.0, 2.05, -0.55], radius: 0.48, count: 50 },
      { center: [-0.35, 2.15, -0.48], radius: 0.45, count: 44 },
      { center: [0.38, 2.18, -0.45], radius: 0.45, count: 44 },
      { center: [-0.15, 2.50, -0.38], radius: 0.46, count: 46 },
      { center: [0.22, 1.80, -0.50], radius: 0.42, count: 38 }
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

  const scaleX = 0.95 + thickness * 0.15;
  const scaleY = 1.0;
  const scaleZ = 0.95 + thickness * 0.15;

  return (
    <group position={[0, -1.35, 0]} scale={[scaleX, scaleY, scaleZ]}>
      {/* Buttress Roots */}
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

      {/* Main Oak Trunk */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.32, 1.35, 32]} />
        <meshStandardMaterial map={barkMap} roughness={0.88} metalness={0.02} color="#854d0e" />
      </mesh>

      {/* Trunk Middle Knot */}
      <mesh position={[0.02, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
      </mesh>

      {/* Left Sweeping Branch */}
      <group position={[-0.08, 1.38, 0.02]} rotation={[0.18, 0.25, 0.68]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.14, 0.82, 16]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
        <mesh position={[-0.06, 0.68, 0.08]} rotation={[0.25, 0.4, 0.45]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.58, 12]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
      </group>

      {/* Right Sweeping Branch */}
      <group position={[0.08, 1.40, -0.02]} rotation={[-0.14, -0.32, -0.65]}>
        <mesh position={[0, 0.40, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.14, 0.85, 16]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
        <mesh position={[0.07, 0.72, -0.06]} rotation={[-0.2, -0.35, -0.42]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.60, 12]} />
          <meshStandardMaterial map={barkMap} roughness={0.9} color="#854d0e" />
        </mesh>
      </group>

      {/* Central Upper Trunk Extension */}
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

      {/* Foliage Clusters */}
      <group>
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

// ─────────────────────────────────────────────────────────────
// Master Tree / Wood Barrier Component (Switches among 4 Stages)
// ─────────────────────────────────────────────────────────────
export default function TreeBarrier({ stage = 1, thickness = 1, woodViewMode = 'textured' }) {
  if (stage === 1) return <PaperModel thickness={thickness} />;
  if (stage === 2) return <WoodPieceModel thickness={thickness} viewMode={woodViewMode} />;
  if (stage === 3) return <PlantModel thickness={thickness} />;
  return <FullTreeModel thickness={thickness} />;
}