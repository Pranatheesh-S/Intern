import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import RusticLogMesh from './RusticLogMesh';

// ─────────────────────────────────────────────────────────────
// 1. TEXTURE GENERATORS (Photorealistic PBR Textures)
// ─────────────────────────────────────────────────────────────

// High-detail warm ivory laboratory parchment texture
function generateParchmentPaperTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = Math.floor(size * 1.35); // 1024 x 1382
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // 1. Warm ivory base gradient with subtle perimeter aging
  const baseGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w * 0.75);
  baseGrad.addColorStop(0.0, '#fbf8ee');
  baseGrad.addColorStop(0.65, '#f4ecd8');
  baseGrad.addColorStop(0.92, '#eae0c6');
  baseGrad.addColorStop(1.0, '#ded0b5');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Micro cellulose fibers & paper grain noise
  for (let i = 0; i < 2800; i++) {
    const alpha = Math.random() * 0.18 + 0.05;
    ctx.fillStyle = Math.random() > 0.4 ? `rgba(180, 160, 130, ${alpha})` : `rgba(255, 255, 255, ${alpha * 1.5})`;
    const len = Math.random() * 5 + 1;
    const ang = Math.random() * Math.PI;
    ctx.fillRect(Math.random() * w, Math.random() * h, Math.cos(ang) * len + 1, Math.sin(ang) * len + 1);
  }

  // 3. Faint aged perimeter tone
  ctx.strokeStyle = 'rgba(160, 130, 95, 0.22)';
  ctx.lineWidth = 14;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  // 4. Clean Red Margin Line on the left
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(140, 0);
  ctx.lineTo(140, h);
  ctx.stroke();

  // 5. Pale Blue Horizontal Ruled Notebook Lines
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
  ctx.lineWidth = 2.2;
  for (let y = 120; y < h - 80; y += 52) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 6. Educational Typography
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 36px "Outfit", "Inter", system-ui, sans-serif';
  ctx.fillText('Stage 1: Paper Sheet', 180, 95);

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 24px "Inter", system-ui, sans-serif';
  ctx.fillText('• Plant Cellulose Fiber Material', 180, 185);
  ctx.fillText('• Non-Magnetic Organic Barrier', 180, 237);
  ctx.fillText('• Magnetic Field Penetrates Freely', 180, 289);
  ctx.fillText('• Compass Needle Deflects to Level 1!', 180, 341);

  // 7. Verified Stamp Box
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.strokeRect(180, 420, 480, 80);
  ctx.fillStyle = '#047857';
  ctx.font = '900 24px "Outfit", sans-serif';
  ctx.fillText('✓ MAGNETIC FIELD PERMEABLE', 210, 470);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// Procedural organic oak bark texture with natural vertical fissures
function generateOakBarkTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Deep earthy bark base
  ctx.fillStyle = '#3e2d21';
  ctx.fillRect(0, 0, size, size);

  // Vertical furrowed grain ridges
  for (let x = 0; x < size; x += 4) {
    const tone = Math.random() * 0.45 + 0.55;
    ctx.strokeStyle = `rgba(${Math.floor(85 * tone)}, ${Math.floor(60 * tone)}, ${Math.floor(40 * tone)}, 0.85)`;
    ctx.lineWidth = Math.random() * 5 + 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(
      x + (Math.random() - 0.5) * 30, size * 0.33,
      x + (Math.random() - 0.5) * 30, size * 0.66,
      x, size
    );
    ctx.stroke();
  }

  // Deep bark fissures & natural cracks
  for (let i = 0; i < 48; i++) {
    ctx.strokeStyle = 'rgba(22, 14, 8, 0.92)';
    ctx.lineWidth = Math.random() * 4.5 + 2;
    const yS = Math.random() * size;
    const xS = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(xS, yS);
    ctx.lineTo(xS + (Math.random() - 0.5) * 22, yS + Math.random() * 180 + 40);
    ctx.stroke();
  }

  // Subtle lichen & moss accents
  for (let i = 0; i < 350; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(95, 115, 75, 0.25)' : 'rgba(150, 120, 80, 0.25)';
    ctx.fillRect(Math.random() * size, Math.random() * size, 3, 5);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.5, 3.5);
  return tex;
}

// Botanical Quercus lobed oak leaf atlas texture generator
function generateBotanicalOakLeafTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // Draws a classic botanical Quercus lobed oak leaf with rounded lobes and deep sinuses
  const drawQuercusLeaf = (cx, cy, angle, scale, baseColor, veinColor) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    // Leaf Blade Silhouette with 5 pairs of rounded lobes & sinuses
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(0, -140); // Apex

    // Right lobes
    ctx.bezierCurveTo(28, -125, 45, -110, 48, -90);  // Lobe 1
    ctx.bezierCurveTo(46, -75, 30, -70, 32, -60);    // Sinus 1
    ctx.bezierCurveTo(55, -50, 72, -35, 70, -10);    // Lobe 2 (Wide mid lobe)
    ctx.bezierCurveTo(65, 8, 40, 10, 42, 25);        // Sinus 2
    ctx.bezierCurveTo(62, 40, 68, 65, 52, 85);       // Lobe 3
    ctx.bezierCurveTo(42, 98, 25, 95, 22, 110);      // Sinus 3
    ctx.bezierCurveTo(28, 120, 22, 135, 0, 145);     // Base

    // Left lobes (mirrored with slight natural asymmetry)
    ctx.bezierCurveTo(-22, 135, -28, 120, -22, 110);
    ctx.bezierCurveTo(-25, 95, -42, 98, -52, 85);
    ctx.bezierCurveTo(-68, 65, -62, 40, -42, 25);
    ctx.bezierCurveTo(-40, 10, -65, 8, -70, -10);
    ctx.bezierCurveTo(-72, -35, -55, -50, -32, -60);
    ctx.bezierCurveTo(-30, -70, -46, -75, -48, -90);
    ctx.bezierCurveTo(-45, -110, -28, -125, 0, -140);
    ctx.fill();

    // Central Midrib Vein
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(0, -135);
    ctx.lineTo(0, 142);
    ctx.stroke();

    // Secondary Lateral Branching Veins reaching into each lobe apex
    ctx.lineWidth = 2.0;
    const lobeVeins = [
      { y: -85, targetX: 42, targetY: -92 },
      { y: -10, targetX: 62, targetY: -12 },
      { y: 75, targetX: 46, targetY: 82 },
      { y: -85, targetX: -42, targetY: -92 },
      { y: -10, targetX: -62, targetY: -12 },
      { y: 75, targetX: -46, targetY: 82 }
    ];
    lobeVeins.forEach(v => {
      ctx.beginPath();
      ctx.moveTo(0, v.y);
      ctx.quadraticCurveTo(v.targetX * 0.5, v.y + 4, v.targetX, v.targetY);
      ctx.stroke();
    });

    ctx.restore();
  };

  // Compose dense botanical Quercus spray matching the reference oak
  drawQuercusLeaf(512, 512, 0, 1.45, '#315c2b', 'rgba(167, 243, 208, 0.55)');
  drawQuercusLeaf(320, 560, -0.65, 1.25, '#294d27', 'rgba(134, 239, 172, 0.45)');
  drawQuercusLeaf(704, 560, 0.65, 1.25, '#3f7135', 'rgba(187, 247, 208, 0.5)');
  drawQuercusLeaf(512, 280, 0.2, 1.3, '#44763a', 'rgba(167, 243, 208, 0.55)');
  drawQuercusLeaf(380, 800, -0.35, 1.1, '#1e4224', 'rgba(110, 231, 183, 0.4)');
  drawQuercusLeaf(644, 800, 0.35, 1.1, '#315d2c', 'rgba(134, 239, 172, 0.45)');
  drawQuercusLeaf(260, 360, -0.85, 1.05, '#294d27', 'rgba(110, 231, 183, 0.4)');
  drawQuercusLeaf(764, 360, 0.85, 1.05, '#557f3d', 'rgba(187, 247, 208, 0.5)');

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// ─────────────────────────────────────────────────────────────
// 2. STAGE 1: CINEMATIC PAPER MODEL
// ─────────────────────────────────────────────────────────────
function createCurvedPaperGeometry(width = 1.65, height = 2.25, segsX = 32, segsY = 32) {
  const geom = new THREE.PlaneGeometry(width, height, segsX, segsY);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    const curveZ = 0.024 * Math.sin((x / width) * Math.PI) + 0.018 * Math.cos((y / height) * Math.PI * 0.8);
    const cornerLift = 0.025 * Math.max(0, (x / width) + (y / height) - 0.6);

    pos.setZ(i, curveZ + cornerLift);
  }

  geom.computeVertexNormals();
  return geom;
}

function PaperModel({ thickness = 1 }) {
  const paperMap = useMemo(() => generateParchmentPaperTexture(), []);
  const paperGeom = useMemo(() => createCurvedPaperGeometry(), []);

  const scale = 1 + (thickness - 1) * 0.08;

  return (
    <group position={[0, 0, 0]} scale={[scale, scale, scale]}>
      {/* Curved Parchment Sheet */}
      <mesh geometry={paperGeom} castShadow receiveShadow position={[0, 0.05, 0]}>
        <meshStandardMaterial
          map={paperMap}
          roughness={0.72}
          metalness={0.02}
          side={THREE.DoubleSide}
          color="#fdfbf7"
        />
      </mesh>

      {/* Polished Stainless Steel Paperclip gripping top edge */}
      <group position={[-0.58, 1.12, 0.035]} rotation={[0, 0, -0.15]}>
        <mesh castShadow>
          <torusGeometry args={[0.065, 0.014, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.18} />
        </mesh>
        <mesh position={[-0.065, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.32, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.18} />
        </mesh>
        <mesh position={[0.065, -0.12, 0]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.24, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.18} />
        </mesh>
        <mesh position={[0, -0.24, 0]} rotation={[0, 0, Math.PI]} castShadow>
          <torusGeometry args={[0.042, 0.014, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.18} />
        </mesh>
      </group>

      {/* Heavy Laboratory Stand Base (Graphite Slate) */}
      <mesh position={[0, -1.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.85, 0.14, 0.52]} />
        <meshStandardMaterial color="#1e293b" roughness={0.55} metalness={0.4} />
      </mesh>

      {/* Beveled Slate Trim */}
      <mesh position={[0, -1.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.05, 0.42]} />
        <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.5} />
      </mesh>

      {/* Brushed Chrome Grip Clamps */}
      <mesh position={[-0.55, -0.98, 0]} castShadow>
        <boxGeometry args={[0.18, 0.12, 0.12]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.88} />
      </mesh>
      <mesh position={[0.55, -0.98, 0]} castShadow>
        <boxGeometry args={[0.18, 0.12, 0.12]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.88} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. STAGE 2: WOOD PIECE (High-Precision Rustic Log Timber)
// ─────────────────────────────────────────────────────────────
function WoodPieceModel({ thickness = 1, viewMode = 'textured' }) {
  return <RusticLogMesh thickness={thickness} viewMode={viewMode} />;
}

// ─────────────────────────────────────────────────────────────
// 4. STAGE 3: ORGANIC LIVING POTTED PLANT
// ─────────────────────────────────────────────────────────────
function PlantModel({ thickness = 1 }) {
  const leafMap = useMemo(() => generateBotanicalOakLeafTexture(), []);
  const plantGroupRef = useRef();
  const leafRefs = useRef([]);

  const leaves = useMemo(() => [
    { pos: [-0.28, 0.92, 0.15], rot: [0.4, 0.6, 0.85], scale: 0.72, speed: 1.4, phase: 0.2 },
    { pos: [0.32, 0.98, -0.12], rot: [-0.3, -0.7, -0.8], scale: 0.75, speed: 1.6, phase: 1.5 },
    { pos: [0.08, 1.25, 0.32], rot: [0.9, 0.1, -0.2], scale: 0.68, speed: 1.3, phase: 2.8 },
    { pos: [-0.16, 1.35, -0.28], rot: [-0.85, -0.4, 0.3], scale: 0.68, speed: 1.7, phase: 3.9 },
    { pos: [0.26, 1.50, 0.18], rot: [0.5, 0.8, -0.6], scale: 0.64, speed: 1.5, phase: 4.6 },
    { pos: [-0.24, 1.58, -0.1], rot: [-0.4, -0.9, 0.65], scale: 0.64, speed: 1.8, phase: 5.4 },
    { pos: [0.0, 1.82, 0.0], rot: [0.1, 0, 0], scale: 0.58, speed: 1.9, phase: 0.8 }
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    leafRefs.current.forEach((ref, idx) => {
      if (ref && leaves[idx]) {
        const l = leaves[idx];
        const flutter = Math.sin(t * l.speed + l.phase) * 0.045 + Math.cos(t * 0.8 + l.phase) * 0.02;
        ref.rotation.z = l.rot[2] + flutter;
        ref.rotation.x = l.rot[0] + flutter * 0.6;
      }
    });
  });

  const scale = 1 + (thickness - 1) * 0.1;

  return (
    <group ref={plantGroupRef} position={[0, -0.4, 0]} scale={[scale, scale, scale]}>
      {/* Terracotta Ceramic Pot Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.64, 0.45, 0.88, 36]} />
        <meshStandardMaterial
          color="#b96542"
          roughness={0.78}
          metalness={0.02}
        />
      </mesh>

      {/* Terracotta Pot Rim with subtle wear */}
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.64, 0.065, 16, 36]} />
        <meshStandardMaterial
          color="#a95635"
          roughness={0.74}
          metalness={0.02}
        />
      </mesh>

      {/* Dark Moist Organic Soil */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.60, 36]} />
        <meshStandardMaterial
          color="#241a12"
          roughness={0.92}
          metalness={0.01}
        />
      </mesh>

      {/* Tapered Organic Stem */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.075, 1.25, 16]} />
        <meshStandardMaterial
          color="#2e6830"
          roughness={0.62}
          metalness={0.02}
        />
      </mesh>

      {/* Stem Node Rings */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <torusGeometry args={[0.062, 0.012, 12, 16]} />
        <meshStandardMaterial color="#4a7c36" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <torusGeometry args={[0.052, 0.011, 12, 16]} />
        <meshStandardMaterial color="#4a7c36" roughness={0.7} />
      </mesh>

      {/* 3D Leaves with Subtle Breeze Flutter */}
      {leaves.map((l, i) => (
        <mesh
          key={i}
          ref={el => (leafRefs.current[i] = el)}
          position={l.pos}
          rotation={l.rot}
          scale={[l.scale, l.scale, l.scale]}
          castShadow
        >
          <planeGeometry args={[0.72, 0.72]} />
          <meshStandardMaterial
            map={leafMap}
            transparent={true}
            alphaTest={0.25}
            side={THREE.DoubleSide}
            roughness={0.42}
            metalness={0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. STAGE 4: PHOTOREALISTIC MATURE TALL-TRUNK OAK TREE (QUERCUS)
// ─────────────────────────────────────────────────────────────
function FullTreeModel({ thickness = 1 }) {
  const treeTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/assets/mature_oak_tree.png');
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  const baseSize = 7.4;
  const scale = 1 + (thickness - 1) * 0.12;
  const treeDim = baseSize * scale;

  return (
    <group position={[0, -5.25, -0.3]}>
      {/* Primary Photorealistic Tall-Trunk Mature Oak Billboard Plane (1:1 Square Aspect Ratio, Base Anchored at Y=-5.25) */}
      <mesh position={[0, treeDim / 2, 0]}>
        <planeGeometry args={[treeDim, treeDim]} />
        <meshBasicMaterial
          map={treeTexture}
          color="#ffffff"
          transparent={true}
          alphaTest={0.15}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
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