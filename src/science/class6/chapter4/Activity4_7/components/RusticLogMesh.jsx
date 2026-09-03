import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Procedural High-Precision 3D Geometry Generator for Rustic Wooden Log Timber
 * Features:
 * - Cylindrical trunk body with quad-like subdivided vertex grid (160 x 120)
 * - Cylindrical UV unwrapping aligned with longitudinal grain flow and organic surface waves & knot swirls
 * - Photorealistic weathered bark texture applied seamlessly to the curved body
 * - Authentic tree growth rings with heartwood, sapwood, radial cracks, and saw marks on cut ends
 * - Non-blocking asynchronous texture loading with instant procedural fallback
 */

// ─── 1. Instant Fallback Weathered Bark Texture Generator ───
function generateWeatheredWoodFallbackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep rich earth-toned wood base
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0.0, '#3e2d21');
  grad.addColorStop(0.3, '#513b2b');
  grad.addColorStop(0.5, '#654936');
  grad.addColorStop(0.75, '#513b2b');
  grad.addColorStop(1.0, '#3e2d21');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Deep longitudinal bark grain furrows & ridges
  for (let x = 0; x < 1024; x += 3) {
    const tone = Math.random() * 0.45 + 0.55;
    ctx.strokeStyle = `rgba(${Math.floor(55 * tone)}, ${Math.floor(38 * tone)}, ${Math.floor(24 * tone)}, 0.75)`;
    ctx.lineWidth = Math.random() * 3.5 + 1.2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(
      x + (Math.random() - 0.5) * 16, 340,
      x + (Math.random() - 0.5) * 16, 680,
      x, 1024
    );
    ctx.stroke();
  }

  // Weathered fissures & deep bark cracks
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 750;
    const len = Math.random() * 350 + 120;
    ctx.strokeStyle = 'rgba(28, 18, 11, 0.9)';
    ctx.lineWidth = Math.random() * 4 + 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 12, y + len);
    ctx.stroke();
  }

  // Micro lichen & dry moss speckling
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(100, 110, 80, 0.25)' : 'rgba(140, 105, 70, 0.3)';
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 3, 5);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.0, 1.0);
  return tex;
}

// ─── 2. Authentic Cut End Growth Rings Texture Generator ───
function generateRealisticCutEndTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.47;

  // Outer dark rough bark ring
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(0, 0, size, size);

  // Radial wood gradient (warm dark heartwood core -> amber honey -> light sapwood)
  const grad = ctx.createRadialGradient(cx, cy, 6, cx, cy, radius);
  grad.addColorStop(0.0, '#5a2d0c');  // Deep amber heartwood pith
  grad.addColorStop(0.25, '#7c3f14'); // Rich heartwood
  grad.addColorStop(0.55, '#9a531e'); // Golden honey wood
  grad.addColorStop(0.78, '#b86c2e'); // Outer heartwood
  grad.addColorStop(0.90, '#d48d48'); // Light sapwood
  grad.addColorStop(0.96, '#e0a362'); // Outer sapwood band
  grad.addColorStop(0.985, '#452b1a'); // Inner bark layer (cambium)
  grad.addColorStop(1.0, '#24160d');  // Outer rough bark

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // 60+ Fine Concentric Annual Growth Rings with natural organic wobble
  for (let r = 8; r < radius - 6; r += 4.2) {
    const isMajor = Math.floor(r / 20) % 2 === 0;
    const alpha = isMajor ? 0.65 : 0.35;
    ctx.strokeStyle = `rgba(75, 35, 12, ${alpha})`;
    ctx.lineWidth = isMajor ? 2.2 : 1.1;

    ctx.beginPath();
    const pts = 80;
    for (let p = 0; p <= pts; p++) {
      const angle = (p / pts) * Math.PI * 2;
      const wobble = Math.sin(angle * 5 + r * 0.4) * 2.5 + Math.cos(angle * 3) * 1.8;
      const curR = r + wobble;
      const x = cx + Math.cos(angle) * curR;
      const y = cy + Math.sin(angle) * curR;
      if (p === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Radiating Split Checks / Cracks
  const crackAngles = [0.28, 0.75, 1.35, 1.95, 2.7, 3.4, 4.1, 4.85, 5.5, 6.0];
  crackAngles.forEach((ang) => {
    ctx.strokeStyle = 'rgba(30, 15, 6, 0.88)';
    ctx.lineWidth = 2.0 + Math.random() * 1.8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    let curR = 0;
    const maxR = radius * (0.68 + Math.random() * 0.28);
    while (curR < maxR) {
      curR += 12;
      const jitter = (Math.random() - 0.5) * 0.08;
      const curAng = ang + jitter;
      ctx.lineTo(cx + Math.cos(curAng) * curR, cy + Math.sin(curAng) * curR);
    }
    ctx.stroke();
  });

  // Saw blade curved micro-grooves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.0;
  for (let y = -radius; y <= radius; y += 14) {
    ctx.beginPath();
    ctx.arc(cx, cy + y, radius * 1.2, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // Center pith core
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#3a1b08';
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ─── 3. Generate High-Precision Displaced Trunk Cylinder Geometry with Flow-Aligned UVs ───
function createDisplacedLogTrunkGeometry(length = 2.4, rBase = 0.54, rTop = 0.49, radSegs = 160, heightSegs = 120) {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // 5 Realistic Procedural Knots (theta, y, radius, swirlStrength, rimHeight)
  const knots = [
    { theta: 0.85, y: 0.42, r: 0.26, swirl: 1.4, rim: 0.048, pit: 0.042 },
    { theta: 2.50, y: -0.48, r: 0.22, swirl: -1.2, rim: 0.042, pit: 0.038 },
    { theta: 4.10, y: 0.58, r: 0.20, swirl: 1.1, rim: 0.038, pit: 0.035 },
    { theta: 5.35, y: -0.22, r: 0.28, swirl: -1.5, rim: 0.052, pit: 0.045 },
    { theta: 1.65, y: -0.72, r: 0.18, swirl: 1.0, rim: 0.035, pit: 0.032 }
  ];

  for (let i = 0; i <= heightSegs; i++) {
    const v = i / heightSegs;
    const y = -length / 2 + v * length;
    const rTaper = rBase + v * (rTop - rBase);

    for (let j = 0; j <= radSegs; j++) {
      const u = j / radSegs;
      const theta = u * Math.PI * 2;

      // Natural Undulating Surface Imperfections (Organic trunk waviness & eccentricities)
      const w1 = 0.038 * Math.sin(2.5 * y + 1.2) + 0.022 * Math.cos(4.8 * y - 0.7);
      const w2 = 0.032 * Math.cos(2 * theta + 1.2 * y) + 0.018 * Math.sin(4 * theta - 1.8 * y) + 0.012 * Math.cos(6 * theta + 0.8 * y);

      // Procedural Knot Displacements & Grain Swirl
      let knotDisp = 0;
      let totalSwirl = 0;

      for (let k = 0; k < knots.length; k++) {
        const knot = knots[k];
        const deltaTheta = Math.atan2(Math.sin(theta - knot.theta), Math.cos(theta - knot.theta));
        const dx = deltaTheta * rTaper;
        const dy = y - knot.y;
        const dist = Math.sqrt((dx / 1.0) ** 2 + (dy / 1.6) ** 2);

        if (dist < knot.r * 2.8) {
          const normDist = dist / knot.r;
          const swirlFactor = Math.exp(-(normDist ** 2)) * 0.38 * knot.swirl;
          totalSwirl += swirlFactor;

          const rim = knot.rim * Math.exp(-(((dist - knot.r * 0.75) / (knot.r * 0.35)) ** 2));
          const pit = -knot.pit * Math.exp(-((dist / (knot.r * 0.45)) ** 2));
          knotDisp += (rim + pit);
        }
      }

      // Swirl warped angle for bark flow lines
      const warpedTheta = theta + totalSwirl;

      // Heavy Bark Grain Grooves (Deep longitudinal furrows and sharp ridges)
      const barkTheta = warpedTheta * 24 + 0.7 * Math.sin(3.8 * y) + 0.35 * Math.cos(7.5 * y + warpedTheta);
      const furrow = -0.058 * Math.max(0, 1 - Math.abs(Math.sin(barkTheta / 2)) ** 1.8);
      const ridge = 0.038 * (Math.sin(barkTheta) ** 3) + 0.018 * Math.cos(2 * barkTheta + y * 6.5);
      const microBark = 0.008 * Math.sin(48 * warpedTheta + y * 16) + 0.004 * Math.cos(76 * warpedTheta - y * 22);

      const barkDisp = furrow + ridge + microBark;

      // Outer End Flare (Natural trunk flare at cut boundary)
      const endFlare = 0.026 * (Math.exp(-((v / 0.07) ** 2)) + Math.exp(-(((1 - v) / 0.07) ** 2)));

      // Total radial displacement
      const totalR = rTaper + w1 + w2 + knotDisp + barkDisp + endFlare;

      // Coordinates
      const px = totalR * Math.cos(theta) + 0.025 * Math.sin(y * 1.5);
      const pz = totalR * Math.sin(theta) + 0.020 * Math.cos(y * 1.2);
      const py = y;

      positions.push(px, py, pz);
      normals.push(Math.cos(theta), 0, Math.sin(theta));

      // Cylindrical UV unwrapping aligned with longitudinal grain flow and organic surface waves & knot swirls
      const uvU = (warpedTheta / (Math.PI * 2));
      const uvV = v + 0.018 * Math.sin(theta * 3 + y * 2.2);
      uvs.push(uvU, uvV);
    }
  }

  // Generate Quad-like Triangle Indices
  for (let i = 0; i < heightSegs; i++) {
    for (let j = 0; j < radSegs; j++) {
      const a = i * (radSegs + 1) + j;
      const b = (i + 1) * (radSegs + 1) + j;
      const c = (i + 1) * (radSegs + 1) + (j + 1);
      const d = i * (radSegs + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geom.setIndex(indices);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();

  return geom;
}

// ─── 4. Generate High-Precision Flat Cut End Geometry with Growth Rings & Radial Fracture Cracks ───
function createDisplacedCutEndGeometry(radius = 0.54, isTop = false, ringSegs = 56, sectorSegs = 160) {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  const crackAngles = [0.28, 1.15, 2.05, 3.35, 4.45, 5.60];
  const crackDepths = [1.0, 0.75, 0.9, 1.0, 0.8, 0.85];

  for (let i = 0; i <= ringSegs; i++) {
    const rNorm = i / ringSegs;
    const r = rNorm * radius;

    for (let j = 0; j <= sectorSegs; j++) {
      const u = j / sectorSegs;
      const theta = u * Math.PI * 2;

      // 1. Concentric Growth Rings 3D Stepped Geometry
      const rWobble = r + 0.014 * Math.sin(5 * theta + r * 14) + 0.008 * Math.cos(3 * theta - r * 10) + 0.005 * Math.sin(9 * theta + 1.2);
      const zRings = 0.014 * Math.sin(rWobble * 64 * Math.PI / radius) * (1 - Math.exp(-((r / 0.06) ** 2)));
      const zWood = 0.008 * (1 - Math.exp(-((r / (radius * 0.7)) ** 4)));

      // 2. Radial Fracture Lines (Deep Split Checks / Cracks)
      let zCrack = 0;
      for (let k = 0; k < crackAngles.length; k++) {
        const crackAngle = crackAngles[k] + 0.06 * Math.sin(r * 18) + 0.03 * Math.cos(r * 32);
        const deltaTheta = Math.atan2(Math.sin(theta - crackAngle), Math.cos(theta - crackAngle));
        const halfWidth = 0.045 * ((r / radius) ** 0.5) + 0.008;

        if (Math.abs(deltaTheta) < halfWidth) {
          const vShape = (1 - Math.abs(deltaTheta) / halfWidth) ** 1.8;
          const radialEnv = ((r / radius) ** 0.6) * (1 - Math.exp(-((r / 0.06) ** 2)));
          zCrack -= 0.055 * crackDepths[k] * vShape * radialEnv;
        }
      }

      // 3. Central Pith Core Recess
      const zPith = -0.022 * Math.exp(-((r / 0.055) ** 2));

      // 4. Outer Rough Bark Rim Lip
      let zBark = 0;
      if (rNorm > 0.91) {
        const barkFrac = (rNorm - 0.91) / 0.09;
        zBark = 0.024 * barkFrac + 0.010 * Math.sin(20 * theta) * Math.cos(40 * theta);
      }

      const zDisp = zRings + zWood + zCrack + zPith + zBark;

      const px = r * Math.cos(theta);
      const py = r * Math.sin(theta);
      const pz = isTop ? zDisp : -zDisp;

      positions.push(px, py, pz);
      normals.push(0, 0, isTop ? 1 : -1);
      uvs.push(0.5 + 0.5 * rNorm * Math.cos(theta), 0.5 + 0.5 * rNorm * Math.sin(theta));
    }
  }

  // Generate Disc Triangle Indices
  for (let i = 0; i < ringSegs; i++) {
    for (let j = 0; j < sectorSegs; j++) {
      const a = i * (sectorSegs + 1) + j;
      const b = (i + 1) * (sectorSegs + 1) + j;
      const c = (i + 1) * (sectorSegs + 1) + (j + 1);
      const d = i * (sectorSegs + 1) + (j + 1);

      if (isTop) {
        indices.push(a, b, d);
        indices.push(b, c, d);
      } else {
        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }
  }

  geom.setIndex(indices);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();

  return geom;
}

// ─── Master Rustic Log Mesh Component ───
export default function RusticLogMesh({ thickness = 1, viewMode = 'textured' }) {
  const meshRef = useRef();

  // Instant procedural fallback textures for high reliability
  const fallbackBarkTex = useMemo(() => generateWeatheredWoodFallbackTexture(), []);
  const cutEndTex = useMemo(() => generateRealisticCutEndTexture(), []);
  const [barkTexture, setBarkTexture] = useState(fallbackBarkTex);

  // Asynchronously attempt to load high-res disk texture if available
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/textures/weathered_wood_bark.png',
      (loadedTex) => {
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.wrapT = THREE.RepeatWrapping;
        loadedTex.repeat.set(2.0, 1.0);
        setBarkTexture(loadedTex);
      },
      undefined,
      () => {
        // Fallback texture remains active gracefully
      }
    );
  }, []);

  // Geometries
  const trunkGeom = useMemo(() => createDisplacedLogTrunkGeometry(2.4, 0.54, 0.49), []);
  const baseCutGeom = useMemo(() => createDisplacedCutEndGeometry(0.54, false), []);
  const topCutGeom = useMemo(() => createDisplacedCutEndGeometry(0.49, true), []);

  const scale = 1 + thickness * 0.12;

  const isClay = viewMode === 'clay';
  const isQuads = viewMode === 'quads';

  return (
    <group
      ref={meshRef}
      position={[0, 0, 0]}
      scale={[scale, scale, scale]}
      rotation={[0, -0.4, 0]}
    >
      {/* ─── 1. Main Curved Displaced Trunk Body ─── */}
      <mesh
        geometry={trunkGeom}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        {isClay ? (
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.68}
            metalness={0.03}
            flatShading={false}
          />
        ) : (
          <meshStandardMaterial
            map={barkTexture}
            bumpMap={barkTexture}
            bumpScale={0.055}
            roughness={0.86}
            metalness={0.01}
            color="#ffffff"
          />
        )}
      </mesh>

      {/* ─── 2. Base Flat Cut End: Growth Rings Material ─── */}
      <mesh
        geometry={baseCutGeom}
        position={[0, -1.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        {isClay ? (
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.65}
            metalness={0.02}
            flatShading={false}
          />
        ) : (
          <meshStandardMaterial
            map={cutEndTex}
            bumpMap={cutEndTex}
            bumpScale={0.035}
            roughness={0.78}
            metalness={0.02}
            color="#ffffff"
          />
        )}
      </mesh>

      {/* ─── 3. Top Flat Cut End: Growth Rings Material ─── */}
      <mesh
        geometry={topCutGeom}
        position={[0, 1.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        {isClay ? (
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.65}
            metalness={0.02}
            flatShading={false}
          />
        ) : (
          <meshStandardMaterial
            map={cutEndTex}
            bumpMap={cutEndTex}
            bumpScale={0.035}
            roughness={0.78}
            metalness={0.02}
            color="#ffffff"
          />
        )}
      </mesh>

      {/* ─── 4. Quad-Topology Wireframe Overlay (When in Quads Mode) ─── */}
      {isQuads && (
        <group>
          <mesh geometry={trunkGeom} position={[0, 0, 0]}>
            <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.4} />
          </mesh>
          <mesh geometry={baseCutGeom} position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.4} />
          </mesh>
          <mesh geometry={topCutGeom} position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}
