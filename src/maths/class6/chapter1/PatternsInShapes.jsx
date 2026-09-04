import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Environment, Sky, Text, Billboard, useGLTF, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import {
  Layers,
  CheckCircle2,
  RotateCcw,
  Plus,
  Check,
  Link2,
  MousePointerClick,
  Eye,
  Compass,
  ShieldCheck,
  Shapes,
  Zap,
  Flame,
  Gem,
  Award
} from 'lucide-react';
import { PhotorealisticHandDiceRoll3D, PhotorealisticBouncingSoccerBall3D, PhotorealisticHoneycomb3D, PhotorealisticHeptagonSpiderWeb3D, PhotorealisticStopSign3D, PhotorealisticNonagonPrism3D, PhotorealisticDecagonFerrisWheel3D } from './RealisticMath3D';
import { COMPLETE_GRAPHS_DATASET } from './data';
import './theme.css';


// -----------------------------------------------------------------------
// TABLE 3 DATASETS (AUTHENTIC INDIAN CULTURAL HERITAGE)
// -----------------------------------------------------------------------

export const POLYGONS_DATA = [
  {
    sides: 3,
    name: 'Triangle',
    color: '#e11d48',
    icon: '🔺',
    interiorAngle: '60°',
    diagonals: 0,
    realLifeTitle: 'Photorealistic Ancient Pyramid',
    realLife: 'A majestic 3D Egyptian pyramid structure. Its monumental triangular faces have withstood the test of time, perfectly demonstrating the structural stability of triangles.'
  },
  {
    sides: 4,
    name: 'Quadrilateral / Square',
    color: '#ea580c',
    icon: '🎲',
    interiorAngle: '90°',
    diagonals: 2,
    realLifeTitle: 'Photorealistic Teakwood Ludo Board',
    realLife: 'A premium, handcrafted wooden Ludo board. The perfectly square geometry features four 90° corners, housing four colored home bases and high-fidelity square dice.'
  },
  {
    sides: 5,
    name: 'Pentagon',
    color: '#d97706',
    icon: '⚽',
    interiorAngle: '108°',
    diagonals: 5,
    realLifeTitle: 'Photorealistic Bouncing Soccer Ball',
    realLife: 'A truncated icosahedron football consisting of 12 regular black pentagons and 20 white hexagons. Each 5-sided regular pentagon features 108° interior angles, perfectly demonstrating 5-sided polygon geometry in sports!'
  },
  {
    sides: 6,
    name: 'Hexagon',
    color: '#d97706',
    icon: '🍯',
    interiorAngle: '120°',
    diagonals: 9,
    realLifeTitle: 'Photorealistic Honeycomb & Bee (Spilled Honey)',
    realLife: 'A natural beeswax honeycomb tessellation where 6-sided regular hexagons (120° angles) maximize honey storage with minimal wax. Features a honeybee drinking golden nectar and viscous honey spilling into a regular hexagonal puddle.'
  },
  {
    sides: 7,
    name: 'Heptagon',
    color: '#f59e0b',
    icon: '✨',
    interiorAngle: '128.6°',
    diagonals: 14,
    realLifeTitle: 'Photorealistic Orb-Weaver Spider Web (Heptagon)',
    realLife: 'An ultra-realistic morning spider web anchored between branches. The orb-weaver spider naturally constructs geometric frameworks, creating a precise 7-sided regular heptagonal perimeter with radial support threads.'
  },
  {
    sides: 8,
    name: 'Octagon',
    color: '#ef4444',
    icon: '🛑',
    interiorAngle: '135°',
    diagonals: 20,
    realLifeTitle: 'Photorealistic Octagonal Traffic STOP Sign',
    realLife: 'The universal traffic STOP sign, globally standardized as an 8-sided regular octagon. With 8 congruent edges and 135° interior angles, its unique octagonal silhouette is instantly recognizable from any angle, even when viewed from behind!'
  },
  {
    sides: 9,
    name: 'Nonagon',
    color: '#0ea5e9',
    icon: '💎',
    interiorAngle: '140°',
    diagonals: 27,
    realLifeTitle: 'Photorealistic 9-Sided Crystal Glass Prism',
    realLife: 'A flawless optical glass prism cut into a perfect 9-sided regular nonagon. Refracting light through its 9 pristine facets, it demonstrates nonagon geometry with absolute clarity and precision without any overlapping.'
  },
  {
    sides: 10,
    name: 'Decagon',
    color: '#db2777',
    icon: '🎡',
    interiorAngle: '144°',
    diagonals: 35,
    realLifeTitle: 'Photorealistic 10-Gondola Decagon Observation Wheel',
    realLife: 'A magnificent 10-cabin observation Ferris wheel engineered on a regular decagon geometry. 10 structural perimeter chord steel trusses and 10 radial spoke cables connect 10 colorful passenger gondolas at exact 36° central intervals and 144° interior vertex angles.'
  }
];

export const COMPLETE_GRAPHS_MODULAR_DATA = [
  {
    n: 2,
    code: 'K2',
    symbol: 'K₂',
    name: 'K₂ (1 Edge)',
    total: 1,
    formula: '\\frac{2 \\times 1}{2} = 1',
    triangularNumber: 'T₁ = 1',
    color: '#0284c7',
    icon: '📍',
    shapeName: 'Horizontal Line Segment',
    realLifeTitle: '2 Pegs on a Geoboard (1 Edge)',
    realLife: 'Two red pegs connected by 1 horizontal taut string. In real life, two friends shaking hands make exactly 1 handshake.',
    breakdown: [
      { step: 'Peg 1 connects to Peg 2', count: 1 }
    ],
    shapeComponents: [
      { id: 'k2-line', name: 'Connect 2 Pegs', icon: '📍', color: '#0284c7', edges: [{ u: 0, v: 1 }] }
    ]
  },
  {
    n: 3,
    code: 'K3',
    symbol: 'K₃',
    name: 'K₃ (3 Edges)',
    total: 3,
    formula: '\\frac{3 \\times 2}{2} = 3',
    triangularNumber: 'T₂ = 2 + 1 = 3',
    color: '#059669',
    icon: '🔺',
    shapeName: 'Equilateral Triangle',
    realLifeTitle: '3 Pegs Form an Equilateral Triangle',
    realLife: 'With 3 pegs, connecting every pair requires 3 strings. Peg 1 adds 2 strings, Peg 2 adds 1 string (2 + 1 = 3).',
    breakdown: [
      { step: 'Peg 1 connects to 2 other pegs', count: 2 },
      { step: 'Peg 2 connects to the last peg', count: 1 }
    ],
    shapeComponents: [
      { id: 'k3-tri', name: 'All 3 Perimeter Strings', icon: '🔺', color: '#059669', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 0 }] }
    ]
  },
  {
    n: 4,
    code: 'K4',
    symbol: 'K₄',
    name: 'K₄ (6 Edges)',
    total: 6,
    formula: '\\frac{4 \\times 3}{2} = 6',
    triangularNumber: 'T₃ = 3 + 2 + 1 = 6',
    color: '#d97706',
    icon: '🔲',
    shapeName: 'Square with Diagonal Cross (X)',
    realLifeTitle: '4 Pegs: Square + Interior Cross (X)',
    realLife: 'Connecting 4 pegs takes 6 strings: 4 perimeter strings form a square, and 2 interior diagonals form an X in the center (3 + 2 + 1 = 6).',
    breakdown: [
      { step: 'Peg 1 connects to 3 other pegs', count: 3 },
      { step: 'Peg 2 connects to 2 other pegs', count: 2 },
      { step: 'Peg 3 connects to the last peg', count: 1 }
    ],
    shapeComponents: [
      { id: 'k4-perimeter', name: '4 Outside Square Strings', icon: '🟦', color: '#0284c7', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 0 }] },
      { id: 'k4-diagonal', name: '2 Inside Diagonal Strings', icon: '⚡', color: '#f59e0b', edges: [{ u: 0, v: 2 }, { u: 1, v: 3 }] }
    ]
  },
  {
    n: 5,
    code: 'K5',
    symbol: 'K₅',
    name: 'K₅ (10 Edges)',
    total: 10,
    formula: '\\frac{5 \\times 4}{2} = 10',
    triangularNumber: 'T₄ = 4 + 3 + 2 + 1 = 10',
    color: '#db2777',
    icon: '⭐',
    shapeName: 'Pentagon with 5-Pointed Star',
    realLifeTitle: '5 Pegs: Pentagon + Inlaid 5-Pointed Star',
    realLife: '5 pegs take 10 strings: 5 perimeter strings form a regular pentagon, and 5 interior diagonals form a perfect 5-pointed star (4 + 3 + 2 + 1 = 10).',
    breakdown: [
      { step: 'Peg 1 connects to 4 other pegs', count: 4 },
      { step: 'Peg 2 connects to 3 other pegs', count: 3 },
      { step: 'Peg 3 connects to 2 other pegs', count: 2 },
      { step: 'Peg 4 connects to the last peg', count: 1 }
    ],
    shapeComponents: [
      { id: 'k5-pentagon', name: '5 Outside Pentagon Strings', icon: '⬟', color: '#db2777', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 0 }] },
      { id: 'k5-star', name: '5 Inside Star Strings', icon: '⭐', color: '#f59e0b', edges: [{ u: 0, v: 2 }, { u: 2, v: 4 }, { u: 4, v: 1 }, { u: 1, v: 3 }, { u: 3, v: 0 }] }
    ]
  },
  {
    n: 6,
    code: 'K6',
    symbol: 'K₆',
    name: 'K₆ (15 Edges)',
    total: 15,
    formula: '\\frac{6 \\times 5}{2} = 15',
    triangularNumber: 'T₅ = 5 + 4 + 3 + 2 + 1 = 15',
    color: '#7c3aed',
    icon: '⬢',
    shapeName: 'Hexagon with 9 Inner Chords',
    realLifeTitle: '6 Pegs: Hexagon + 9 Inner Diagonals',
    realLife: '6 pegs need 15 strings: 6 perimeter strings form a regular hexagon, and 9 interior strings form interlaced triangles and diametric chords (5 + 4 + 3 + 2 + 1 = 15).',
    breakdown: [
      { step: 'Peg 1 connects to 5 other pegs', count: 5 },
      { step: 'Peg 2 connects to 4 other pegs', count: 4 },
      { step: 'Peg 3 connects to 3 other pegs', count: 3 },
      { step: 'Peg 4 connects to 2 other pegs', count: 2 },
      { step: 'Peg 5 connects to the last peg', count: 1 }
    ],
    shapeComponents: [
      { id: 'k6-hexagon', name: '6 Outside Hexagon Strings', icon: '⬢', color: '#7c3aed', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 5 }, { u: 5, v: 0 }] },
      { id: 'k6-star1', name: 'First Triangle Star', icon: '🔺', color: '#ea580c', edges: [{ u: 0, v: 2 }, { u: 2, v: 4 }, { u: 4, v: 0 }] },
      { id: 'k6-star2', name: 'Second Triangle Star', icon: '🔻', color: '#059669', edges: [{ u: 1, v: 3 }, { u: 3, v: 5 }, { u: 5, v: 1 }] },
      { id: 'k6-diameters', name: '3 Center Diametric Strings', icon: '⚡', color: '#f59e0b', edges: [{ u: 0, v: 3 }, { u: 1, v: 4 }, { u: 2, v: 5 }] }
    ]
  }
];

function generateKoch2D(p1, p2, depth) {
  if (depth === 0) return [p1, p2];
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const pA = [p1[0] + dx / 3, p1[1] + dy / 3];
  const pB = [p1[0] + (2 * dx) / 3, p1[1] + (2 * dy) / 3];
  const angle = -Math.PI / 3;
  const peakX = pA[0] + (dx / 3) * Math.cos(angle) - (dy / 3) * Math.sin(angle);
  const peakY = pA[1] + (dx / 3) * Math.sin(angle) + (dy / 3) * Math.cos(angle);
  const pPeak = [peakX, peakY];

  return [
    ...generateKoch2D(p1, pA, depth - 1).slice(0, -1),
    ...generateKoch2D(pA, pPeak, depth - 1).slice(0, -1),
    ...generateKoch2D(pPeak, pB, depth - 1).slice(0, -1),
    ...generateKoch2D(pB, p2, depth - 1)
  ];
}

// -----------------------------------------------------------------------
// 1. PHOTOREALISTIC INDIAN 3D MODELS
// -----------------------------------------------------------------------

// 3 SIDES: Photorealistic Ancient Egyptian Pyramid Complex & Realistic Moving 3D Camel
export function PhotorealisticPyramid3D() {
  return (
    <group position={[0, -0.52, 0]} rotation={[0.06, 0.32, 0]}>
      {/* 1. Golden Hour Desert Sunlight & Warm Ambient Fill */}
      <ambientLight intensity={0.92} color="#fef3c7" />
      <directionalLight position={[10, 8, 8]} intensity={1.75} color="#fff3da" castShadow />
      <directionalLight position={[-8, 3, -6]} intensity={0.5} color="#fed7aa" />
      <directionalLight position={[0, -3, 0]} intensity={0.4} color="#e09f53" />

      {/* 2. Photorealistic Sky Dome, Desert Floor, Ancient Pyramid & Animated Walking Camel */}
      <Suspense fallback={<RealisticPyramidFallback />}>
        <PhotorealisticDesertSky />
        <RealisticDesertFloor3D />
        <RealisticPyramidMesh3D />
        <RealisticCamelWalk3D />
      </Suspense>
    </group>
  );
}

// -------------------------------------------------------------
// 360-Degree Photorealistic Saharan Desert Panoramic Sky Dome
// -------------------------------------------------------------
function PhotorealisticDesertSky() {
  const skyTexture = useLoader(THREE.TextureLoader, '/desert_sky.jpg');

  useMemo(() => {
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    skyTexture.mapping = THREE.EquirectangularReflectionMapping;
  }, [skyTexture]);

  return (
    <group>
      {/* 1. 360-Degree Panoramic Desert Sky Dome Sphere */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[52, 64, 32]} />
        <meshBasicMaterial map={skyTexture} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* 2. Soft Saharan Atmospheric Horizon Sand Haze */}
      <fog attach="fog" args={['#edd4b8', 16, 52]} />
    </group>
  );
}

// -------------------------------------------------------------
// Photorealistic 3D Desert Sand Surface with Wind Ripples & Natural Terrain
// -------------------------------------------------------------
function RealisticDesertFloor3D() {
  const sandTexture = useLoader(THREE.TextureLoader, '/desert_sand.jpg');

  // Desert Dunes in the Outer Perimeter (Distance > 4.0, completely clear of the caravan trail at radius 2.65)
  const dunes = useMemo(() => [
    { pos: [-4.8, -0.4, -3.2], scale: [2.5, 0.5, 2.2], rot: [0.1, 0.4, -0.05], color: '#d9a973' },
    { pos: [4.6, -0.4, -3.0], scale: [2.4, 0.45, 2.0], rot: [-0.1, -0.3, 0.08], color: '#cfa068' },
    { pos: [1.0, -0.4, 4.8], scale: [2.8, 0.45, 2.0], rot: [0.05, 0.8, -0.02], color: '#e0ae78' },
    { pos: [-4.5, -0.4, 3.2], scale: [2.6, 0.42, 1.8], rot: [-0.08, -0.5, 0.04], color: '#c7975e' },
    { pos: [4.8, -0.4, 2.5], scale: [2.6, 0.42, 2.0], rot: [0.12, 0.2, -0.06], color: '#deb079' },
    { pos: [-0.8, -0.45, -5.2], scale: [3.5, 0.55, 2.5], rot: [-0.05, 0.1, 0.03], color: '#c2925b' }
  ], []);

  // Scattered Desert Limestone Rocks (safely positioned away from the walking trail)
  const rocks = useMemo(() => [
    { pos: [-1.4, 0.02, 1.2], scale: [0.14, 0.09, 0.12], rot: [0.3, 0.5, 0.1] },
    { pos: [1.3, 0.01, 1.3], scale: [0.18, 0.12, 0.15], rot: [-0.2, 0.8, 0.4] },
    { pos: [-1.2, 0.02, -1.3], scale: [0.16, 0.1, 0.13], rot: [0.4, -0.3, 0.2] },
    { pos: [4.2, 0.01, -2.2], scale: [0.22, 0.14, 0.18], rot: [0.1, 0.2, -0.4] },
    { pos: [-3.8, 0.02, 2.0], scale: [0.18, 0.11, 0.14], rot: [-0.5, 0.4, 0.3] }
  ], []);

  // Configure high-frequency ripple texture repeat & sculpted desert topography
  const [sandMaterial, desertGeometry] = useMemo(() => {
    sandTexture.wrapS = THREE.RepeatWrapping;
    sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(5.5, 5.5);
    sandTexture.colorSpace = THREE.SRGBColorSpace;

    // Sculpted desert sand bed with level caravan trail at radius 2.65
    const geom = new THREE.CylinderGeometry(7.2, 7.2, 0.1, 96, 32);
    const pos = geom.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      
      // Sculpt top sand surface only
      if (y > 0) {
        const r = Math.hypot(x, z);
        let heightOffset = 0;
        if (r > 3.2) {
          // Natural rolling desert ripples and dunes in outer perimeter
          const fade = Math.min(1.0, (r - 3.2) / 1.5);
          const wave1 = Math.sin(x * 0.7 + z * 0.5) * 0.12;
          const wave2 = Math.cos(x * 1.2 - z * 0.9) * 0.06;
          const wave3 = Math.sin(x * 2.0 + z * 1.8) * 0.02;
          heightOffset = (wave1 + wave2 + wave3) * fade;
        } else if (r < 1.6) {
          // Subtle foundation sand slope near pyramid base
          const fade = (1.6 - r) / 1.6;
          heightOffset = fade * 0.035;
        }
        pos.setY(i, 0.05 + heightOffset);
      }
    }
    geom.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: sandTexture,
      bumpMap: sandTexture,
      bumpScale: 0.035,
      roughness: 0.94,
      metalness: 0.01,
      color: '#dfb27c',
    });

    return [mat, geom];
  }, [sandTexture]);

  return (
    <group>
      {/* 1. Photorealistic Textured Desert Sand Bed */}
      <mesh position={[0, -0.05, 0]} geometry={desertGeometry} material={sandMaterial} receiveShadow />

      {/* 2. Textured Perimeter Sand Dunes with wind-blown ridges */}
      {dunes.map((d, idx) => (
        <mesh key={`dune-${idx}`} position={d.pos} rotation={d.rot} scale={d.scale} receiveShadow>
          <sphereGeometry args={[1, 32, 20]} />
          <meshStandardMaterial
            map={sandTexture}
            bumpMap={sandTexture}
            bumpScale={0.03}
            color={d.color}
            roughness={0.96}
          />
        </mesh>
      ))}

      {/* 3. Desert Limestone Boulders */}
      {rocks.map((r, idx) => (
        <mesh key={`rock-${idx}`} position={r.pos} rotation={r.rot} scale={r.scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#b8956e" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// 3D Ultra-Realistic Camel with Physical 4-Leg Animated Walking Gait
// -------------------------------------------------------------
function RealisticCamelWalk3D() {
  const camelGroupRef = useRef();
  const mixerRef = useRef();
  const { scene, animations } = useGLTF('/camel_animated_walk.glb');
  const texture = useLoader(THREE.TextureLoader, '/camel_texture.jpeg');

  // Safely clone skinned mesh using SkeletonUtils to prevent bone desync / WebGL vertex glitch
  const clonedCamel = useMemo(() => {
    if (!scene) return null;
    const s = SkeletonUtils.clone(scene);

    if (texture) {
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }

    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          color: '#dfaf77',
          roughness: 0.88,
          metalness: 0.02,
        });
      }
    });

    return s;
  }, [scene, texture]);

  // Set up and run the 4-leg walk animation cycle
  useEffect(() => {
    if (!clonedCamel || !animations || animations.length === 0) return;
    const mixer = new THREE.AnimationMixer(clonedCamel);
    const action = mixer.clipAction(animations[0]);
    action.reset();
    action.timeScale = 1.25; // Natural walking cadence
    action.play();
    mixerRef.current = mixer;

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [clonedCamel, animations]);

  useFrame((state, delta) => {
    // 1. Advance the 4-leg skeletal walking animation
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // 2. Trajectory & Orbit around the pyramid
    const t = state.clock.elapsedTime;
    const speed = 0.25; // Natural desert caravan trekking speed
    const radius = 2.65;
    const angle = -t * speed; // Clockwise orbit around pyramid

    if (camelGroupRef.current) {
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      // Realistic quadruped locomotion dynamics
      const walkRoll = Math.sin(t * 1.6) * 0.02;   // Subtle lateral sway
      const walkPitch = Math.sin(t * 3.2) * 0.015; // Gentle fore/aft nod

      // Planted cleanly on the sand surface without clipping or overlap
      camelGroupRef.current.position.set(x, 0.015, z);
      // Tangent heading facing forward along walking circle
      camelGroupRef.current.rotation.y = angle - Math.PI / 2;
      camelGroupRef.current.rotation.z = walkRoll;
      camelGroupRef.current.rotation.x = walkPitch;
    }
  });

  if (!clonedCamel) return null;

  return (
    <group ref={camelGroupRef} scale={0.44}>
      <primitive object={clonedCamel} />
    </group>
  );
}

// -------------------------------------------------------------
// 3D Photorealistic Ancient Giza Pyramid Complex
// -------------------------------------------------------------
function RealisticPyramidMesh3D() {
  const { scene } = useGLTF('/pyramids_realistic.glb');
  const stoneTexture = useLoader(THREE.TextureLoader, '/pyramid_stone.jpg');

  const clonedPyramids = useMemo(() => {
    stoneTexture.wrapS = THREE.RepeatWrapping;
    stoneTexture.wrapT = THREE.RepeatWrapping;
    stoneTexture.repeat.set(3.5, 3.5);
    stoneTexture.colorSpace = THREE.SRGBColorSpace;

    const s = scene.clone(true);
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          map: stoneTexture,
          bumpMap: stoneTexture,
          bumpScale: 0.045,
          color: '#e2ba86',
          roughness: 0.90,
          metalness: 0.02,
        });
      }
    });
    return s;
  }, [scene, stoneTexture]);

  return (
    <group position={[0, 0, 0]} scale={0.21}>
      <primitive object={clonedPyramids} />
      {/* Electrum Golden Pyramidion Capstone on the summit of the Great Pyramid */}
      <mesh position={[0, 6.26, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.55, 0.72, 4]} />
        <meshPhysicalMaterial
          color="#f59e0b"
          emissive="#b45309"
          emissiveIntensity={0.35}
          metalness={0.96}
          roughness={0.12}
          clearcoat={1.0}
        />
      </mesh>
      <pointLight position={[0, 6.4, 0]} intensity={1.8} color="#fef08a" distance={3} />
    </group>
  );
}

// Graceful fallback for suspense while GLB models initialize
function RealisticPyramidFallback() {
  return (
    <group position={[0, 0.75, 0]}>
      <mesh rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 1.7, 1.5, 4]} />
        <meshStandardMaterial color="#dfbe95" roughness={0.94} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.78, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.18, 0.22, 4]} />
        <meshPhysicalMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
}

// Preload assets for instantaneous rendering
useGLTF.preload('/pyramids_realistic.glb');
useGLTF.preload('/camel_animated_walk.glb');

// 4 SIDES: Photorealistic Human Hand Rolling Ivory Dice onto Teakwood Ludo Board
export function PhotorealisticLudoBoard3D() {
  return <PhotorealisticHandDiceRoll3D showTabletop={true} />;
}


// 5 SIDES: Traditional 5-Wick Brass Diya Lamp
export function RealisticPanchalohaDiya3D() {
  return (
    <group position={[0, -0.2, 0]} rotation={[0.2, 0, 0]}>
      {/* Polished Temple Brass Base Plate */}
      <mesh position={[0, -0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.1, 1.35, 0.18, 64]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Ornate Sculpted Brass Pillar Stem */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 0.9, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 5-Sided Regular Pentagonal Oil Reservoir Bowl */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 0.8, 0.22, 5]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Golden Sesame Oil Surface */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.04, 5]} />
        <meshPhysicalMaterial
          color="#d97706"
          transmission={0.8}
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>

      {/* 5 Burning Cotton Wicks & Warm Golden Flame Lights at the 5 Pentagonal Vertices */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const r = 0.98;
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        return (
          <group key={i} position={[x, 0.65, z]}>
            {/* Cotton Wick */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            {/* Flickering Golden Flame */}
            <mesh position={[0, 0.12, 0]}>
              <coneGeometry args={[0.085, 0.26, 16]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <pointLight position={[0, 0.15, 0]} intensity={1.5} color="#fbbf24" distance={3} />
          </group>
        );
      })}

      {/* Sacred Brass Bird Pinnacle on Top */}
      <group position={[0, 0.8, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <coneGeometry args={[0.12, 0.38, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

// 6 SIDES: Hexagonal Marigold & Jasmine Floral Rangoli
export function RealisticMuruganShatkonaKolam3D() {
  const hexPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      pts.push({ x: 1.35 * Math.cos(angle), z: 1.35 * Math.sin(angle) });
    }
    return pts;
  }, []);

  return (
    <group position={[0, -0.1, 0]} rotation={[0.45, 0, 0]}>
      {/* Terracotta Red Foundation Plate */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.0, 0.08, 6]} />
        <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </mesh>

      {/* Traditional White Rice-Flour Interlocking Double Triangles */}
      <mesh position={[0, -0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.35, 6]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* 6 Fresh Saffron Marigold Flowers at the 6 Hexagonal Vertices */}
      {hexPoints.map((pt, i) => (
        <group key={`m-${i}`} position={[pt.x, 0.06, pt.z]}>
          <mesh castShadow>
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshStandardMaterial color="#ea580c" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#facc15" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 12 Pure White Jasmine Buds around Edge Midpoints */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p1 = hexPoints[i];
        const p2 = hexPoints[(i + 1) % 6];
        const midX = (p1.x + p2.x) / 2;
        const midZ = (p1.z + p2.z) / 2;
        return (
          <group key={`j-${i}`} position={[midX, 0.04, midZ]}>
            <mesh castShadow>
              <sphereGeometry args={[0.15, 24, 24]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
              <meshStandardMaterial color="#16a34a" roughness={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* Central Polished Brass Pooja Diya */}
      <group position={[0, 0.1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.3, 0.22, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <coneGeometry args={[0.08, 0.22, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <pointLight position={[0, 0.25, 0]} intensity={1.8} color="#fbbf24" distance={3} />
      </group>
    </group>
  );
}

// 7 SIDES: 7-Stringed Saraswati Veena Resonance Body
export function RealisticSapthaswaraVeena3D() {
  return (
    <group position={[0, -0.15, 0]} rotation={[0.4, 0.35, 0]}>
      {/* Carved Rosewood Resonator Bowl with 7 Edges */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.15, 0.45, 7]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Decorative Ivory & Mother-of-Pearl Inlay Ring */}
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.03, 7]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Solid Brass Soundboard Sounding Bridge */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.85, 0.12, 0.3]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 7 Golden Bronze Melody Strings */}
      {[-0.32, -0.21, -0.1, 0, 0.1, 0.21, 0.32].map((x, i) => (
        <mesh key={i} position={[x, 0.37, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 2.2, 16]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* Veena Neck Extension */}
      <mesh position={[-1.4, 0.2, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1.2, 0.18, 0.35]} />
        <meshStandardMaterial color="#3b0764" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 8 SIDES: 8-Faced Temple Brass Deepam
export function RealisticAshtalakshmiDeepam3D() {
  return (
    <group position={[0, -0.2, 0]} rotation={[0.3, 0, 0]}>
      {/* 8-Sided Dravidian Temple Pillar Base Plinth */}
      <mesh position={[0, -0.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.4, 1.55, 0.22, 8]} />
        <meshStandardMaterial color="#92400e" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* 8-Sided Scalloped Brass Oil Reservoir */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.28, 1.05, 0.25, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 8 Burning Flames on the 8 Spouts with Holy Vermilion Dots */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 8;
        const r = 1.25;
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        return (
          <group key={i} position={[x, 0.38, z]}>
            {/* Vermilion Marking */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.8} />
            </mesh>
            {/* Flame */}
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.07, 0.22, 16]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <pointLight position={[0, 0.12, 0]} intensity={1.2} color="#fbbf24" distance={2.5} />
          </group>
        );
      })}

      {/* Central Medallion Pinnacle */}
      <group position={[0, 0.65, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 8]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}


// 10 SIDES: Grand Temple Chariot 10-Spoke Wheel
export function RealisticThanjavurTempleCarWheel3D() {
  return (
    <group position={[0, -0.05, 0]} rotation={[0.4, 0.25, 0]}>
      {/* Heavy Steel/Iron Tread Rim */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.22, 64, 1, true]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Massive 10-Sided Teakwood Outer Wheel Felloe */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 1.45, 0.2, 10, 1, true]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Heavy Bronze Hubcap */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.32, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.17]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* 10 Hand-Carved Teakwood Spokes Radiating from Hub to Rim */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 10;
        const len = 0.95;
        const midR = 0.88;
        const x = midR * Math.cos(angle);
        const y = midR * Math.sin(angle);
        return (
          <group key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
            <mesh castShadow>
              <boxGeometry args={[0.13, len, 0.16]} />
              <meshStandardMaterial color="#92400e" roughness={0.75} />
            </mesh>
            {/* Brass Strengthening Clamps & Red Kumkum Dot */}
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.14, 0.05, 0.17]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.85} />
            </mesh>
            <mesh position={[0, 0, 0.086]}>
              <circleGeometry args={[0.035, 32]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// -----------------------------------------------------------------------
// 2. TABLE 3 MASTER 3D VIEWER: POLYGONS
// -----------------------------------------------------------------------
export function Table3Polygons3D({ polygon, placedEdges, viewMode = 'real' }) {
  if (viewMode === 'real') {
    switch (polygon.sides) {
      case 3: return <PhotorealisticPyramid3D />;
      case 4: return <PhotorealisticLudoBoard3D />;
      case 5: return <PhotorealisticBouncingSoccerBall3D />;
      case 6: return <PhotorealisticHoneycomb3D />;
      case 7: return <PhotorealisticHeptagonSpiderWeb3D />;
      case 8: return <PhotorealisticStopSign3D />;
      case 9: return <PhotorealisticNonagonPrism3D />;
      case 10: default: return <PhotorealisticDecagonFerrisWheel3D />;
    }
  }

  const sides = polygon.sides;
  const color = polygon.color;
  const isComplete = placedEdges >= sides;

  const { vertices, edgeLines, diagonals } = useMemo(() => {
    const radius = 1.32;
    const verts = [];

    // Canonical Upright Start Angle (Straight horizontal base/top, no slanting)
    let startAngle = Math.PI / 2;
    if (sides === 3) startAngle = Math.PI / 2;        // Equilateral Triangle: apex straight UP, flat horizontal base
    else if (sides === 4) startAngle = Math.PI / 4;   // Square: flat horizontal top & bottom, vertical left & right
    else if (sides === 5) startAngle = Math.PI / 2;   // Regular Pentagon: apex straight UP, flat horizontal base
    else if (sides === 6) startAngle = Math.PI / 6;   // Regular Hexagon: flat horizontal top & bottom edges
    else if (sides === 7) startAngle = Math.PI / 2;   // Regular Heptagon: apex straight UP
    else if (sides === 8) startAngle = Math.PI / 8;   // Regular Octagon: flat horizontal top & bottom (STOP sign orientation)
    else if (sides === 9) startAngle = Math.PI / 2;   // Regular Nonagon: apex straight UP
    else if (sides === 10) startAngle = Math.PI / 10; // Regular Decagon: flat horizontal top & bottom edges

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + (i * 2 * Math.PI) / sides;
      verts.push({
        id: i,
        label: `V${i + 1}`,
        pos: new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0)
      });
    }

    // Perimeter Edges
    const edges = [];
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      edges.push({ from: verts[i].pos, to: verts[next].pos });
    }

    // Internal Diagonals (n(n-3)/2 pairs)
    const diags = [];
    for (let i = 0; i < sides; i++) {
      for (let j = i + 2; j < sides; j++) {
        if (i === 0 && j === sides - 1) continue; // skip adjacent perimeter edge
        diags.push({
          id: `diag-${i}-${j}`,
          from: verts[i].pos,
          to: verts[j].pos
        });
      }
    }

    return { vertices: verts, edgeLines: edges, diagonals: diags };
  }, [sides]);

  const shapeGeo = useMemo(() => {
    const s = new THREE.Shape();
    vertices.forEach((v, idx) => {
      if (idx === 0) s.moveTo(v.pos.x, v.pos.y);
      else s.lineTo(v.pos.x, v.pos.y);
    });
    s.closePath();
    return s;
  }, [vertices]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Volumetric Translucent Acrylic Polygon Prism */}
      <mesh castShadow receiveShadow position={[0, 0, -0.12]}>
        <extrudeGeometry
          args={[
            shapeGeo,
            {
              depth: 0.24,
              bevelEnabled: true,
              bevelThickness: 0.025,
              bevelSize: 0.025,
              bevelSegments: 3
            }
          ]}
        />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.1}
          transmission={0.7}
          ior={1.48}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent={true}
          opacity={0.88}
        />
      </mesh>

      {/* 2. Perimeter Edges (Built up to placedEdges) */}
      {edgeLines.slice(0, placedEdges).map((edge, idx) => {
        const dir = new THREE.Vector3().subVectors(edge.to, edge.from);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(edge.from, edge.to).multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        return (
          <group key={`edge-${idx}`} position={[mid.x, mid.y, 0.13]}>
            {/* Cylindrical Neon Edge Bar */}
            <mesh quaternion={quat} castShadow>
              <cylinderGeometry args={[0.038, 0.038, len, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.75}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* 3. Internal Luminous Diagonals */}
      {isComplete && diagonals.map((diag) => {
        const dir = new THREE.Vector3().subVectors(diag.to, diag.from);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(diag.from, diag.to).multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        return (
          <group key={diag.id} position={[mid.x, mid.y, 0.125]}>
            <mesh quaternion={quat}>
              <cylinderGeometry args={[0.012, 0.012, len, 8]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={0.5}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}

      {/* 4. Golden Vertex Spheres & Coordinate Badges */}
      {vertices.map((v, idx) => {
        const isBuilt = idx <= placedEdges;
        return (
          <group key={`vert-${idx}`} position={[v.pos.x, v.pos.y, 0.14]}>
            {/* Polished Gold Vertex Node */}
            <mesh castShadow>
              <sphereGeometry args={[0.09, 24, 24]} />
              <meshStandardMaterial
                color={isBuilt ? '#ffffff' : '#94a3b8'}
                emissive={isBuilt ? color : '#64748b'}
                emissiveIntensity={isBuilt ? 0.9 : 0.2}
                roughness={0.15}
                metalness={0.85}
              />
            </mesh>
            {/* Vertex ID Floating Pin */}
            <Html position={[0, 0.2, 0]} center pointerEvents="none">
              <div
                style={{
                  background: isBuilt ? 'rgba(15, 23, 42, 0.92)' : '#64748b',
                  color: '#ffffff',
                  fontSize: '0.66rem',
                  fontWeight: '900',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  border: `1.5px solid ${isBuilt ? color : '#94a3b8'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  whiteSpace: 'nowrap'
                }}
              >
                {v.label}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Floor Contact Shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.65}
        scale={3.2}
        blur={1.8}
        far={2.5}
        color="#000000"
      />
    </group>
  );
}

// -----------------------------------------------------------------------
// Photorealistic Modern Commercial Passenger Jet (Matching Exact Reference Image in High Fidelity)
function RealisticAirliner({ sequence, hubs, speed = 0.5, flightNo = 'AI-204' }) {
  const planeGroupRef = useRef();
  const strobeRef = useRef();
  const beaconRef = useRef();
  const fanLeftRef = useRef();
  const fanRightRef = useRef();

  useFrame((state) => {
    if (!planeGroupRef.current || !sequence || sequence.length < 2 || !hubs) return;
    const time = state.clock.elapsedTime;
    
    const numSegments = sequence.length - 1;
    const totalTime = time * speed;
    const currentSegmentFloat = totalTime % numSegments;
    const currentSegmentIndex = Math.floor(currentSegmentFloat);
    // Pad flight path so airplane stays clearly visible along the corridor (never submerged under hub)
    const rawT = currentSegmentFloat - currentSegmentIndex;
    const t = 0.12 + 0.76 * rawT;
    
    const u = sequence[currentSegmentIndex];
    const v = sequence[currentSegmentIndex + 1];
    const fromPos = hubs[u];
    const toPos = hubs[v];
    
    if (!fromPos || !toPos) return;

    const dx = toPos.x - fromPos.x;
    const dz = toPos.z - fromPos.z;
    const yaw = Math.atan2(dx, dz);

    const curX = fromPos.x + dx * t;
    const curZ = fromPos.z + dz * t;
    
    // Majestic Parabolic Flight Arc
    const dist = Math.sqrt(dx*dx + dz*dz);
    const maxHeight = dist * 0.35; // Peak height based on distance
    const curY = 0.12 + 4 * maxHeight * t * (1 - t);
    
    // Pitch calculation (derivative of the parabola)
    const dy_dt = 4 * maxHeight * (1 - 2 * t);
    const pitch = Math.atan2(dy_dt, dist);

    // Set position and rotation (pitch, yaw, roll)
    planeGroupRef.current.position.set(curX, curY, curZ);
    planeGroupRef.current.rotation.set(pitch, yaw, 0);

    // Strobe & anti-collision beacon flash
    if (strobeRef.current) {
      strobeRef.current.opacity = (Math.sin(time * 8.0) > 0.7) ? 1.0 : 0.1;
    }
    if (beaconRef.current) {
      beaconRef.current.opacity = (Math.sin(time * 5.0) > 0.6) ? 1.0 : 0.15;
    }
    // Spinning engine turbofan blades
    if (fanLeftRef.current) fanLeftRef.current.rotation.z = time * 24.0;
    if (fanRightRef.current) fanRightRef.current.rotation.z = time * 24.0;
  });

  // ================= ULTRA-REALISTIC PROCEDURAL SHAPES =================
  const extrudeSettings = { depth: 0.003, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.0015, bevelThickness: 0.0015 };

  const wingShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.03); // Root LE
    s.lineTo(0, -0.03); // Root TE
    s.lineTo(0.18, -0.06); // Tip TE
    s.lineTo(0.20, -0.05); // Tip Curve
    s.lineTo(0.20, -0.02); // Tip LE
    s.lineTo(0, 0.03); // Root LE
    return s;
  }, []);

  const hStabShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.015);
    s.lineTo(0, -0.015);
    s.lineTo(0.07, -0.035);
    s.lineTo(0.07, -0.015);
    s.lineTo(0, 0.015);
    return s;
  }, []);

  const vStabShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.06, 0);
    s.lineTo(0.10, 0.09);
    s.lineTo(0.06, 0.09);
    s.lineTo(0, 0);
    return s;
  }, []);

  return (
    <group ref={planeGroupRef} scale={2.6}>
      {/* ================= 1. SEAMLESS AERODYNAMIC FUSELAGE & COCKPIT ================= */}
      <group position={[0, 0, 0]}>
        {/* Deep Glossy Metallic Fuselage (Stretched Sphere for perfect teardrop) */}
        <mesh castShadow receiveShadow scale={[1, 1, 9]}>
          <sphereGeometry args={[0.022, 64, 64]} />
          <meshPhysicalMaterial
            color="#1e293b"
            roughness={0.05}
            metalness={0.4}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            reflectivity={1.0}
          />
        </mesh>
        
        {/* Sleek Obsidian Cockpit Visor (Intersecting Mesh) */}
        <mesh position={[0, 0.011, 0.165]} scale={[1, 0.45, 1.8]} rotation={[-0.12, 0, 0]}>
          <sphereGeometry args={[0.016, 32, 32]} />
          <meshPhysicalMaterial color="#020617" roughness={0.0} metalness={0.9} clearcoat={1.0} />
        </mesh>
      </group>

      {/* ================= 2. ORGANIC SWEPT WINGS & WINGLETS ================= */}
      <group position={[0, -0.005, 0.02]}>
        {/* Right Wing */}
        <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0015, 0]}>
          <extrudeGeometry args={[wingShape, extrudeSettings]} />
          <meshPhysicalMaterial color="#0f172a" roughness={0.15} metalness={0.3} clearcoat={0.8} />
        </mesh>
        
        {/* Left Wing (Mirrored cleanly via negative X scale) */}
        <group scale={[-1, 1, 1]}>
          <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0015, 0]}>
            <extrudeGeometry args={[wingShape, extrudeSettings]} />
            <meshPhysicalMaterial color="#0f172a" roughness={0.15} metalness={0.3} clearcoat={0.8} />
          </mesh>
        </group>

        {/* Azure Blue Winglets (Right & Left) */}
        <mesh position={[0.19, 0.015, -0.04]} rotation={[0, 0, -0.4]}>
          <capsuleGeometry args={[0.0025, 0.03, 16, 16]} />
          <meshPhysicalMaterial color="#0284c7" roughness={0.1} metalness={0.4} clearcoat={1.0} />
        </mesh>
        <mesh position={[-0.19, 0.015, -0.04]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.0025, 0.03, 16, 16]} />
          <meshPhysicalMaterial color="#0284c7" roughness={0.1} metalness={0.4} clearcoat={1.0} />
        </mesh>
      </group>

      {/* ================= 3. EMPENNAGE (TAIL ASSEMBLY) ================= */}
      <group position={[0, 0, -0.15]}>
        {/* Swept Vertical Stabilizer */}
        <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-0.0015, 0.01, 0.02]}>
          <extrudeGeometry args={[vStabShape, extrudeSettings]} />
          <meshPhysicalMaterial color="#0284c7" roughness={0.1} metalness={0.3} clearcoat={1.0} />
        </mesh>

        {/* Swept Horizontal Stabilizers (Right & Left) */}
        <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <extrudeGeometry args={[hStabShape, extrudeSettings]} />
          <meshPhysicalMaterial color="#334155" roughness={0.15} metalness={0.3} clearcoat={0.8} />
        </mesh>
        <group scale={[-1, 1, 1]}>
          <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <extrudeGeometry args={[hStabShape, extrudeSettings]} />
            <meshPhysicalMaterial color="#334155" roughness={0.15} metalness={0.3} clearcoat={0.8} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. SCI-FI / NEXT-GEN TURBOFAN ENGINES ================= */}
      {[-0.07, 0.07].map((engX, i) => (
        <group key={`eng-${i}`} position={[engX, -0.014, 0.03]}>
          {/* Swept Aerodynamic Pylon */}
          <mesh position={[0, 0.014, -0.015]} rotation={[0.2, 0, 0]}>
            <capsuleGeometry args={[0.003, 0.03, 16, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshPhysicalMaterial color="#64748b" metalness={0.7} roughness={0.2} />
          </mesh>
          
          {/* Main Seamless Nacelle Cowling */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.014, 0.065, 32]} />
            <meshPhysicalMaterial color="#0f172a" roughness={0.1} metalness={0.3} clearcoat={1.0} />
          </mesh>
          
          {/* Highly Polished Chrome Intake Lip */}
          <mesh position={[0, 0, 0.032]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.015, 0.0025, 16, 64]} />
            <meshStandardMaterial color="#1e293b" metalness={1.0} roughness={0.02} />
          </mesh>
          
          {/* Glowing Plasma/Jet Exhaust Core */}
          <mesh position={[0, 0, -0.034]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.012, 0.01, 32]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={3.5} />
          </mesh>
          
          {/* Deep Dark Titanium Intake */}
          <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.014, 32]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
        </group>
      ))}

      {/* ================= 5. DYNAMIC HIGH-INTENSITY AVIATION LIGHTING ================= */}
      <mesh position={[-0.19, 0.005, -0.04]}>
        <sphereGeometry args={[0.004, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.19, 0.005, -0.04]}>
        <sphereGeometry args={[0.004, 16, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      <mesh position={[0, 0.026, 0.04]}>
        <sphereGeometry args={[0.0035, 16, 16]} />
        <meshBasicMaterial ref={beaconRef} color="#ef4444" transparent />
      </mesh>
      <mesh position={[0, 0.11, -0.16]}>
        <sphereGeometry args={[0.004, 16, 16]} />
        <meshBasicMaterial ref={strobeRef} color="#0f172a" transparent />
      </mesh>
    </group>
  );
}

export const GEOBOARD_NAILS_DATA = [
  { id: 0, label: '1', color: '#0284c7', stringColor: '#38bdf8' },
  { id: 1, label: '2', color: '#d97706', stringColor: '#fcd34d' },
  { id: 2, label: '3', color: '#16a34a', stringColor: '#86efac' },
  { id: 3, label: '4', color: '#9333ea', stringColor: '#d8b4fe' },
  { id: 4, label: '5', color: '#e11d48', stringColor: '#fda4af' },
  { id: 5, label: '6', color: '#0891b2', stringColor: '#67e8f9' }
];

// Exact regular polygon start angle to match the textbook Complete Graph figures K2 to K6
function getCompleteGraphStartAngle(n) {
  if (n === 2) return 0; // horizontal line: (-R, 0) to (R, 0)
  if (n === 3) return -Math.PI / 2; // apex on top
  if (n === 4) return -Math.PI * 3 / 4; // square with horizontal top/bottom and vertical sides
  if (n === 5) return -Math.PI / 2; // pentagon with apex on top
  if (n === 6) return 0; // hexagon with vertices on left and right (-R, 0) and (R, 0)
  return -Math.PI / 2;
}

// Photorealistic tactile String Edge connecting two nails
function StringEdge({ from, to, isPerimeter, isGhost = false }) {
  const { position, quaternion, dist } = useMemo(() => {
    const vFrom = new THREE.Vector3(from.x, 0.14, from.z);
    const vTo = new THREE.Vector3(to.x, 0.14, to.z);
    const dist = vFrom.distanceTo(vTo);
    const pos = vFrom.clone().lerp(vTo, 0.5);
    const direction = vTo.clone().sub(vFrom).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, direction);
    return { position: pos, quaternion: quat, dist };
  }, [from, to]);

  if (isGhost) {
    return (
      <group position={[position.x, 0.02, position.z]} quaternion={quaternion}>
        <mesh>
          <cylinderGeometry args={[0.008, 0.008, dist, 8]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.25} />
        </mesh>
      </group>
    );
  }

  // Taut elastic / silk cords:
  // Perimeter edges: vibrant cyan / sky blue (#0284c7)
  // Interior diagonals: radiant golden amber (#f59e0b)
  const color = isPerimeter ? '#0284c7' : '#f59e0b';
  const emissive = isPerimeter ? '#0369a1' : '#b45309';

  return (
    <group position={position} quaternion={quaternion}>
      {/* Main Taut Braided Cord */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.022, 0.022, dist, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.12}
        />
      </mesh>

      {/* Brass end rings where cord loops around the pegs */}
      <mesh position={[0, -dist / 2 + 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.034, 0.008, 12, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, dist / 2 - 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.034, 0.008, 12, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function Table3CompleteGraphs3D({ graph, activeComponentIds = [] }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/hardwood_texture.jpg');
  useMemo(() => {
    if (woodTexture) {
      woodTexture.wrapS = THREE.RepeatWrapping;
      woodTexture.wrapT = THREE.RepeatWrapping;
      woodTexture.repeat.set(2.5, 2.5);
      woodTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [woodTexture]);

  const currentGraph = graph || COMPLETE_GRAPHS_MODULAR_DATA[2] || COMPLETE_GRAPHS_MODULAR_DATA[0];
  const n = currentGraph?.n || 4;
  const radius = 1.38;

  // All Potential Edge Pairs for Complete Graph Kn
  const allGraphEdges = useMemo(() => {
    const list = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const isPerimeter = n === 2 ? true : (j - i === 1 || (i === 0 && j === n - 1));
        list.push({
          id: `${i}-${j}`,
          u: i,
          v: j,
          isPerimeter,
          type: isPerimeter ? 'perimeter' : 'diagonal'
        });
      }
    }
    return list;
  }, [n]);

  // Connected edges matching activeComponentIds (or all edges if activeComponentIds is empty/stale)
  const connectedEdgesList = useMemo(() => {
    if (!activeComponentIds || activeComponentIds.length === 0) {
      return allGraphEdges;
    }
    const matched = allGraphEdges.filter(e => {
      const isDirect = activeComponentIds.includes(e.id);
      const isViaComponent = currentGraph.shapeComponents?.some(comp =>
        activeComponentIds.includes(comp.id) && comp.edges?.some(ce => (ce.u === e.u && ce.v === e.v) || (ce.u === e.v && ce.v === e.u))
      );
      return isDirect || isViaComponent;
    });
    return matched.length > 0 ? matched : allGraphEdges;
  }, [allGraphEdges, activeComponentIds, currentGraph]);

  // Positions of Nails in an exact Regular Polygon matching textbook angles
  const hubNodes = useMemo(() => {
    const nodes = [];
    const startAngle = getCompleteGraphStartAngle(n);

    for (let i = 0; i < n; i++) {
      const angle = startAngle + (i * 2 * Math.PI) / n;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      nodes.push({
        id: i,
        label: `${i + 1}`,
        angle,
        x,
        y: 0,
        z
      });
    }
    return nodes;
  }, [n, radius]);

  const totalPossible = allGraphEdges.length;
  const connectedIdsSet = useMemo(() => new Set(connectedEdgesList.map(e => e.id)), [connectedEdgesList]);

  return (
    <group position={[0, -0.15, 0]} rotation={[0.62, -0.18, 0]}>
      {/* 1. Deep Space Studio Lighting */}
      <ambientLight intensity={1.4} color="#cbd5e1" />
      <directionalLight position={[6, 10, 8]} intensity={2.8} color="#ffffff" castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[0, 3, 2]} intensity={1.8} color="#fef08a" distance={8} />

      {/* 2. Floating Golden Math Sparkles */}
      <DreiSparkles count={28} scale={4.2} size={2.0} speed={0.35} color="#fde68a" />

      {/* 3. Circular Polished Walnut Inspection Turntable */}
      <group position={[0, -0.06, 0]}>
        {/* Turntable Plinth */}
        <mesh position={[0, -0.07, 0]} receiveShadow>
          <cylinderGeometry args={[2.1, 2.18, 0.14, 64]} />
          <meshStandardMaterial
            map={woodTexture}
            bumpMap={woodTexture}
            bumpScale={0.03}
            color="#1c1917"
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>

        {/* Polished Brass Rim Bezel */}
        <mesh position={[0, 0.008, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[2.1, 0.024, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.14} />
        </mesh>

        {/* Inlaid Concentric Gold Calibration Ring */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[1.92, 0.01, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Recessed Light Maple Geoboard Bed */}
        <mesh position={[0, 0.005, 0]} receiveShadow>
          <cylinderGeometry args={[1.82, 1.82, 0.02, 64]} />
          <meshStandardMaterial
            map={woodTexture}
            bumpMap={woodTexture}
            bumpScale={0.02}
            color="#eed6b8"
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>

        {/* Laser-Engraved Polygon Perimeter Groove */}
        <mesh position={[0, 0.016, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[radius, 0.008, 16, 64]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>

        {/* Laser-Engraved Center Pivot Point */}
        <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#78350f" />
        </mesh>
      </group>

      {/* 4. Front & Top Engraved Labels */}
      <group position={[0, 0.01, 0]}>
        {/* Top Peg Count Label */}
        <group position={[0, 0, -1.65]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.15}
            color="#38bdf8"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            {`n = ${n} Red Pegs (Vertices)`}
          </Text>
        </group>

        {/* Front Formula Rim Label */}
        <group position={[0, 0.015, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            position={[0, 0.07, 0.02]}
            fontSize={0.14}
            color="#fef08a"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            {`Complete Graph K${n} · Total = ${n}×${n - 1}/2 = ${totalPossible} Edges`}
          </Text>
          <Text
            position={[0, -0.07, 0.02]}
            fontSize={0.115}
            color="#93c5fd"
            fontWeight="800"
            anchorX="center"
            anchorY="middle"
          >
            {`Triangular Series: T${n - 1} = ${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(' + ')} = ${totalPossible} Strings`}
          </Text>
        </group>
      </group>

      {/* 5. Strings (Connecting Cords) */}
      {/* Active Strings */}
      {connectedEdgesList.map((edge, idx) => {
        const from = hubNodes[edge.u];
        const to = hubNodes[edge.v];
        if (!from || !to) return null;
        return (
          <StringEdge
            key={`edge-${edge.id || idx}`}
            from={from}
            to={to}
            isPerimeter={edge.isPerimeter}
            isGhost={false}
          />
        );
      })}

      {/* Unconnected Ghost Guide Strings */}
      {allGraphEdges.map((edge, idx) => {
        if (connectedIdsSet.has(edge.id)) return null;
        const from = hubNodes[edge.u];
        const to = hubNodes[edge.v];
        if (!from || !to) return null;
        return (
          <StringEdge
            key={`ghost-edge-${edge.id || idx}`}
            from={from}
            to={to}
            isPerimeter={edge.isPerimeter}
            isGhost={true}
          />
        );
      })}

      {/* 6. Red Pegs (Nails) Matching the Textbook Diagram */}
      {hubNodes.map((hub) => {
        return (
          <group key={`hub-${hub.id}`} position={[hub.x, 0, hub.z]}>
            {/* Brass Base Collar */}
            <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[0.065, 0.08, 0.04, 24]} />
              <meshStandardMaterial color="#d97706" metalness={0.88} roughness={0.2} />
            </mesh>

            {/* Brass Peg Stem */}
            <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.14, 24]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.92} roughness={0.15} />
            </mesh>

            {/* String Groove Waist */}
            <mesh position={[0, 0.14, 0]}>
              <torusGeometry args={[0.034, 0.008, 16, 24]} />
              <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Top Brass Crown Bezel */}
            <mesh position={[0, 0.17, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.036, 0.03, 24]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.16} />
            </mesh>

            {/* Vibrant Ruby-Red Enamel Dome Cap (matching the Red Dots in the textbook!) */}
            <mesh position={[0, 0.205, 0]} castShadow>
              <sphereGeometry args={[0.062, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial
                color="#ef4444"
                roughness={0.12}
                metalness={0.08}
                clearcoat={1.0}
                clearcoatRoughness={0.08}
                emissive="#991b1b"
                emissiveIntensity={0.25}
              />
            </mesh>

            {/* Floating Gold Coin Number Tag */}
            <group position={[0, 0.32, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.075, 24]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.062, 24]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
              <Text
                position={[0, 0.003, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.09}
                color="#fef08a"
                fontWeight="900"
                anchorX="center"
                anchorY="middle"
              >
                {hub.label}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
}

// -----------------------------------------------------------------------
// 4. TABLE 3 MASTER 3D VIEWER: PHOTOREALISTIC MONTESSORI HARDWOOD SQUARE GNOMON BENCH
// Concept: Square Numbers n^2 via Consecutive Odd Number Gnomons (1 + 3 + 5 + 7 + 9)
// -----------------------------------------------------------------------

const HERITAGE_GNOMON_LAYERS = [
  { name: 'Layer 1 (Core)', color: '#f59e0b', stain: '#b45309', badge: '1', odd: 1 },
  { name: 'Layer 2 (+3)', color: '#10b981', stain: '#047857', badge: '+3', odd: 3 },
  { name: 'Layer 3 (+5)', color: '#f97316', stain: '#c2410c', badge: '+5', odd: 5 },
  { name: 'Layer 4 (+7)', color: '#6366f1', stain: '#4338ca', badge: '+7', odd: 7 },
  { name: 'Layer 5 (+9)', color: '#a855f7', stain: '#7e22ce', badge: '+9', odd: 9 },
];

export function Table3StackedSquares3D({ rows = 3, placedLayers = 3 }) {
  const effectiveRows = Math.min(5, Math.max(1, rows || 3));
  const effectivePlaced = Math.min(effectiveRows, Math.max(1, placedLayers || 3));

  return (
    <Suspense fallback={null}>
      <RealisticStackedSquaresScene
        effectiveRows={effectiveRows}
        effectivePlaced={effectivePlaced}
      />
    </Suspense>
  );
}

function RealisticStackedSquaresScene({ effectiveRows, effectivePlaced }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/hardwood_texture.jpg');
  const [hoveredLayer, setHoveredLayer] = useState(null);

  useMemo(() => {
    if (woodTexture) {
      woodTexture.wrapS = THREE.RepeatWrapping;
      woodTexture.wrapT = THREE.RepeatWrapping;
      woodTexture.repeat.set(2.5, 2.5);
      woodTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [woodTexture]);

  const tileSize = 0.52;
  const spacing = 0.58; // Clean tactile 6cm physical spacing
  const offset = ((effectiveRows - 1) * spacing) / 2;
  const gridExtent = effectiveRows * spacing;
  const trayRadius = Math.max(1.85, (gridExtent * 0.707) + 0.42);

  return (
    <group position={[0, -0.16, 0]} rotation={[0.68, -0.22, 0]}>
      {/* 1. Deep Space Studio Lighting for Dark Theme */}
      <ambientLight intensity={1.3} color="#cbd5e1" />
      <directionalLight position={[6, 10, 8]} intensity={2.8} color="#ffffff" castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[0, 3, 2]} intensity={1.8} color="#fef08a" distance={8} />

      {/* 2. Floating Golden Math Sparkles */}
      <DreiSparkles count={28} scale={4.2} size={2.0} speed={0.35} color="#fde68a" />

      {/* 3. Circular Polished Walnut Inspection Turntable */}
      <group position={[0, -0.08, 0]}>
        {/* Turntable Plinth */}
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <cylinderGeometry args={[trayRadius, trayRadius + 0.12, 0.14, 64]} />
          <meshStandardMaterial
            map={woodTexture}
            bumpMap={woodTexture}
            bumpScale={0.03}
            color="#1c1917"
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>

        {/* Polished Brass Rim Bezel */}
        <mesh position={[0, 0.008, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[trayRadius, 0.024, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.14} />
        </mesh>

        {/* Inlaid Concentric Gold Calibration Ring */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[trayRadius * 0.88, 0.01, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Recessed Dark Velvet/Slate Grid Inlay Bed */}
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[gridExtent + 0.22, gridExtent + 0.22]} />
          <meshStandardMaterial color="#090d16" roughness={0.9} metalness={0.08} />
        </mesh>

        {/* Gold Grid Border Framing */}
        <lineSegments position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(gridExtent + 0.22, gridExtent + 0.22)]} />
          <lineBasicMaterial color="#f59e0b" linewidth={2} />
        </lineSegments>
      </group>

      {/* 4. Side Length Dimension Brackets & Labels (n x n = n^2) */}
      <group position={[0, 0.01, 0]}>
        {/* Left Side Dimension Indicator (n units) */}
        <group position={[-offset - tileSize * 0.72, 0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.16}
            color="#38bdf8"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            {effectiveRows} units
          </Text>
        </group>

        {/* Top Side Dimension Indicator (n units) */}
        <group position={[0, 0, -offset - tileSize * 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.16}
            color="#38bdf8"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            {effectiveRows} units
          </Text>
        </group>
      </group>

      {/* 5. Tactile 3D Montessori Hardwood Number Blocks Matrix */}
      {Array.from({ length: effectiveRows }).map((_, r) =>
        Array.from({ length: effectiveRows }).map((_, c) => {
          // L-shaped concentric gnomon layer (0-indexed: 0..4)
          const layer = Math.max(r, c);
          const isPlaced = layer < effectivePlaced;
          const isCorner = r === layer && c === layer;
          const palette = HERITAGE_GNOMON_LAYERS[layer % HERITAGE_GNOMON_LAYERS.length];
          const isHovered = hoveredLayer === layer;

          const x = c * spacing - offset;
          const z = r * spacing - offset;
          const elevateY = isHovered ? 0.05 : 0;

          if (!isPlaced) {
            // UNPLACED LAYER: Carved socket groove with glowing blueprint guide
            return (
              <group key={`unplaced-slot-${r}-${c}`} position={[x, 0.005, z]}>
                {/* Socket Floor */}
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[tileSize * 0.92, tileSize * 0.92]} />
                  <meshStandardMaterial color="#020617" roughness={0.9} />
                </mesh>
                {/* Dashed Guideline Outline */}
                <lineSegments position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <edgesGeometry args={[new THREE.PlaneGeometry(tileSize * 0.92, tileSize * 0.92)]} />
                  <lineBasicMaterial
                    color={palette.color}
                    transparent
                    opacity={0.45}
                    linewidth={1}
                  />
                </lineSegments>
                {/* Ghost numeral hint on the corner block */}
                {isCorner && (
                  <Text
                    position={[0, 0.015, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.17}
                    color={palette.color}
                    fontWeight="800"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={0.45}
                  >
                    {palette.badge}
                  </Text>
                )}
              </group>
            );
          }

          // PLACED TILE: Solid Tactile Beveled Hardwood Block
          return (
            <group
              key={`placed-tile-${r}-${c}`}
              position={[x, elevateY, z]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredLayer(layer);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredLayer(null);
              }}
            >
              {/* Main Beveled Block Body (Sitting proudly at Y = 0.0 to 0.12) */}
              <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
                <boxGeometry args={[tileSize * 0.92, 0.12, tileSize * 0.92]} />
                <meshPhysicalMaterial
                  map={woodTexture}
                  bumpMap={woodTexture}
                  bumpScale={0.02}
                  color={palette.color}
                  roughness={0.24}
                  metalness={0.06}
                  clearcoat={0.65}
                  clearcoatRoughness={0.12}
                />
              </mesh>

              {/* Chamfered Top Bevel Cap */}
              <mesh position={[0, 0.122, 0]} receiveShadow>
                <boxGeometry args={[tileSize * 0.85, 0.01, tileSize * 0.85]} />
                <meshStandardMaterial
                  color={palette.stain}
                  roughness={0.3}
                  metalness={0.1}
                />
              </mesh>

              {/* Corner Block Gnomon Indicator (Brass Medallion + Odd Number Label) */}
              {isCorner ? (
                <group position={[0, 0.128, 0]}>
                  {/* Circular Brass Inlay */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <circleGeometry args={[tileSize * 0.28, 24]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.16} />
                  </mesh>
                  {/* Dark Core Pip */}
                  <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[tileSize * 0.23, 24]} />
                    <meshBasicMaterial color="#0f172a" />
                  </mesh>
                  {/* Engraved Odd Number Badge (e.g. 1, +3, +5, +7, +9) */}
                  <Text
                    position={[0, 0.003, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.17}
                    color="#fef08a"
                    fontWeight="900"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {palette.badge}
                  </Text>
                </group>
              ) : (
                /* Arm Block Inlay (Subtle Concentric Brass Dot) */
                <group position={[0, 0.128, 0]}>
                  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <circleGeometry args={[tileSize * 0.11, 16]} />
                    <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
                  </mesh>
                  <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[tileSize * 0.055, 12]} />
                    <meshBasicMaterial color="#1e293b" />
                  </mesh>
                </group>
              )}
            </group>
          );
        })
      )}
    </group>
  );
}

// -----------------------------------------------------------------------
// 5. SECTION 6 MASTER 3D VIEWER: PHOTOREALISTIC STACKED TRIANGLE ROWS ⟷ SQUARE NUMBERS
// -----------------------------------------------------------------------

const TRIANGLE_TIER_PALETTES = [
  { name: 'Tier 1 (Crimson)', base: '#991b1b', inlay: '#fca5a5', accent: '#fef2f2', rim: '#7f1d1d' },
  { name: 'Tier 2 (Emerald)', base: '#065f46', inlay: '#6ee7b7', accent: '#ecfdf5', rim: '#064e3b' },
  { name: 'Tier 3 (Saffron)', base: '#d97706', inlay: '#fde68a', accent: '#fffbeb', rim: '#b45309' },
  { name: 'Tier 4 (Cobalt)', base: '#1e40af', inlay: '#93c5fd', accent: '#eff6ff', rim: '#1e3a8a' },
  { name: 'Tier 5 (Amethyst)', base: '#6b21a8', inlay: '#d8b4fe', accent: '#faf5ff', rim: '#581c87' },
  { name: 'Tier 6 (Rose Gold)', base: '#be185d', inlay: '#fbcfe8', accent: '#fdf2f8', rim: '#9d174d' }
];

// Single Photorealistic Beveled Equilateral Triangular Tile
function PrismaticTriangleTile({ x, z, size = 0.44, isInverted = false, tier = 0, isPlaced = true }) {
  const palette = TRIANGLE_TIER_PALETTES[tier % TRIANGLE_TIER_PALETTES.length];
  const h = size * (Math.sqrt(3) / 2);
  const rotZ = isInverted ? Math.PI : 0;

  // Exact 2D Equilateral Triangle Profile Centered at Centroid
  const triangleShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Centroid is at h/3 from base and 2h/3 from apex
    shape.moveTo(0, h * (2 / 3)); // Top Apex
    shape.lineTo(size / 2, -h * (1 / 3)); // Bottom Right
    shape.lineTo(-size / 2, -h * (1 / 3)); // Bottom Left
    shape.closePath();
    return shape;
  }, [size, h]);

  const extrudeSettings = useMemo(() => ({
    depth: 0.036,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.007,
    bevelThickness: 0.006
  }), []);

  if (!isPlaced) {
    return (
      <group position={[x, 0.004, z]} rotation={[-Math.PI / 2, 0, rotZ]}>
        {/* Recessed Blueprint Guideline Wireframe on Workbench Bed */}
        <lineSegments>
          <edgesGeometry args={[new THREE.ShapeGeometry(triangleShape)]} />
          <lineBasicMaterial color="#475569" transparent opacity={0.35} />
        </lineSegments>
      </group>
    );
  }

  return (
    <group position={[x, 0.004, z]}>
      {/* 1. Beveled Vitrified Ceramic Prismatic Tile */}
      <mesh
        castShadow
        receiveShadow
        rotation={[-Math.PI / 2, 0, rotZ]}
        position={[0, 0.004, 0]}
      >
        <extrudeGeometry args={[triangleShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={palette.base}
          roughness={0.12}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.92}
        />
      </mesh>

      {/* 2. Traditional Chettinad Floral / Circular Inlay Medallion */}
      <group position={[0, 0.046, 0]} rotation={[0, rotZ, 0]}>
        {/* Outer Inlay Circle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[size * 0.16, 16]} />
          <meshStandardMaterial color={palette.inlay} roughness={0.25} metalness={0.15} />
        </mesh>
        {/* Center Polished Brass Pip */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[size * 0.065, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------
// BRIDGE 3: REALISTIC MONTESSORI HARDWOOD MATH BLOCKS ON DESK
// Concept: Sum of Consecutive Odd Numbers equals Perfect Squares (1+3+5... = N²)
// -----------------------------------------------------------------------
export function PhotorealisticStackedTrianglesBridge3D({ rows = 3 }) {
  const currentRows = Math.min(6, Math.max(1, rows || 3));

  return (
    <Suspense fallback={null}>
      <RealisticWoodenBlocksScene rows={currentRows} />
    </Suspense>
  );
}

function RealisticWoodenBlocksScene({ rows }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/hardwood_texture.jpg');
  const [hoveredLayer, setHoveredLayer] = useState(null);

  // Configure high-detail wood grain repeat
  useMemo(() => {
    if (woodTexture) {
      woodTexture.wrapS = THREE.RepeatWrapping;
      woodTexture.wrapT = THREE.RepeatWrapping;
      woodTexture.repeat.set(2.5, 2.5);
      woodTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [woodTexture]);

  // Distinct real timber species finishes for each L-shaped layer
  const timberLayers = useMemo(() => [
    { name: 'Golden Oak', color: '#f59e0b', stain: '#b45309', odd: 1 },
    { name: 'Nordic Blue Maple', color: '#38bdf8', stain: '#0369a1', odd: 3 },
    { name: 'Forest Emerald Teak', color: '#34d399', stain: '#047857', odd: 5 },
    { name: 'Warm Amber Cherry', color: '#fb923c', stain: '#c2410c', odd: 7 },
    { name: 'Purpleheart Timber', color: '#c084fc', stain: '#7e22ce', odd: 9 },
    { name: 'Rosewood Crimson', color: '#f472b6', stain: '#be185d', odd: 11 },
  ], []);

  // Block geometry with smooth rounded chamfers (tactile wooden toy cubes)
  const blockGeom = useMemo(() => {
    const size = 0.82;
    const b = 0.04;
    const shape = new THREE.Shape();
    const s = size / 2;
    shape.moveTo(-s + b, -s);
    shape.lineTo(s - b, -s);
    shape.quadraticCurveTo(s, -s, s, -s + b);
    shape.lineTo(s, s - b);
    shape.quadraticCurveTo(s, s, s - b, s);
    shape.lineTo(-s + b, s);
    shape.quadraticCurveTo(-s, s, -s, s - b);
    shape.lineTo(-s, -s + b);
    shape.quadraticCurveTo(-s, -s, -s + b, -s);

    const g = new THREE.ExtrudeGeometry(shape, {
      depth: size - b * 2,
      bevelEnabled: true,
      bevelThickness: b,
      bevelSize: b,
      bevelSegments: 3,
      steps: 1,
    });
    g.center();
    g.computeVertexNormals();
    return g;
  }, []);

  const blockSize = 0.82;
  const spacing = 0.88; // gentle natural gap between blocks
  const totalGridSize = rows * spacing;
  const deskSize = Math.max(6.5, totalGridSize + 2.4);

  // Center alignment
  const offsetX = -totalGridSize / 2 + spacing / 2;
  const offsetZ = -totalGridSize / 2 + spacing / 2;

  const totalBlocks = rows * rows;
  const oddSumFormula = Array.from({ length: rows }).map((_, i) => 2 * i + 1).join(' + ');

  return (
    <group position={[0, -0.35, 0]} rotation={[0.12, -0.28, 0]}>
      {/* 1. Warm Classroom Studio Lighting */}
      <ambientLight intensity={1.1} color="#fffbeb" />
      <directionalLight
        position={[6, 10, 8]}
        intensity={2.2}
        color="#fff7ed"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.8} color="#fed7aa" />
      <directionalLight position={[0, -2, 0]} intensity={0.4} color="#d97706" />

      {/* 2. Handcrafted Oak Study Desk Top */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <boxGeometry args={[deskSize, 0.4, deskSize]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#92400e"
          roughness={0.78}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Inlaid Brass Coordinate Measurement Ruler & Tray Border */}
      <mesh position={[0, -0.015, 0]} receiveShadow>
        <boxGeometry args={[totalGridSize + 0.35, 0.03, totalGridSize + 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[totalGridSize + 0.2, 0.035, totalGridSize + 0.2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* 4. Montessori Hardwood Math Cubes */}
      <group position={[offsetX, 0, offsetZ]}>
        {Array.from({ length: rows }).map((_, r) => {
          const timber = timberLayers[r % timberLayers.length];
          const countInLayer = 2 * r + 1; // 1, 3, 5, 7, 9, 11
          const isHovered = hoveredLayer === r;

          // Generate the L-shape (gnomon) coordinates for layer r
          const blocks = [];
          for (let i = 0; i <= r; i++) {
            blocks.push({ x: i, z: r, isCorner: i === r });
          }
          for (let j = 0; j < r; j++) {
            blocks.push({ x: r, z: j, isCorner: false });
          }

          // Elevation when hovered for tactile physical inspection
          const yElev = isHovered ? 0.14 : 0;

          return (
            <group
              key={`layer-${r}`}
              onPointerOver={(e) => { e.stopPropagation(); setHoveredLayer(r); }}
              onPointerOut={(e) => { e.stopPropagation(); setHoveredLayer(null); }}
            >
              {/* Individual Beveled Hardwood Cubes */}
              {blocks.map((b, bIdx) => (
                <group
                  key={`b-${r}-${bIdx}`}
                  position={[b.x * spacing, blockSize / 2 + yElev, b.z * spacing]}
                >
                  <mesh
                    geometry={blockGeom}
                    castShadow
                    receiveShadow
                  >
                    <meshStandardMaterial
                      map={woodTexture}
                      bumpMap={woodTexture}
                      bumpScale={0.02}
                      color={timber.color}
                      roughness={0.65}
                      metalness={0.04}
                    />
                  </mesh>

                  {/* Laser-etched unit pip dot on block top */}
                  <mesh position={[0, blockSize / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.07, 16]} />
                    <meshBasicMaterial color={timber.stain} />
                  </mesh>
                </group>
              ))}

              {/* Floating L-Shape Layer Badge (+1, +3, +5...) */}
              <group position={[r * spacing, blockSize + 0.38 + yElev, r * spacing]}>
                <mesh position={[0, 0, -0.01]}>
                  <planeGeometry args={[0.72, 0.42]} />
                  <meshBasicMaterial color="#ffffff" transparent opacity={0.92} />
                </mesh>
                <Text
                  fontSize={0.28}
                  color={timber.stain}
                  fontWeight="900"
                  anchorX="center"
                  anchorY="middle"
                >
                  +{countInLayer}
                </Text>
              </group>
            </group>
          );
        })}
      </group>

      {/* 5. Centered Floating Educational Concept Plaque (Light Theme) */}
      <group position={[0, 2.55, 0]}>
        {/* Plaque Background */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[4.4, 0.85]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, 0, -0.015]}>
          <planeGeometry args={[4.36, 0.81]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={0.4} />
        </mesh>
        
        {/* Title */}
        <Text
          position={[0, 0.18, 0]}
          fontSize={0.28}
          color="#0369a1"
          fontWeight="900"
          anchorX="center"
          anchorY="middle"
        >
          {oddSumFormula} = {totalBlocks} Blocks
        </Text>
        {/* Equation */}
        <Text
          position={[0, -0.16, 0]}
          fontSize={0.25}
          color="#b45309"
          fontWeight="800"
          anchorX="center"
          anchorY="middle"
        >
          Square Size: {rows} × {rows} = {rows}²
        </Text>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------
// 5. TABLE 3 MASTER 3D VIEWER: PHOTOREALISTIC STACKED EQUILATERAL TRIANGLES
// Concept: Stacking rows of unit equilateral triangles (1, 3, 5, 7, 9) produces Square Numbers n^2
// -----------------------------------------------------------------------

const STACKED_TRIANGLE_TIERS = [
  { name: 'Tier 1 (Odd: 1)', color: '#f59e0b', stain: '#b45309', badge: '1', odd: 1 },
  { name: 'Tier 2 (Odd: 3)', color: '#10b981', stain: '#047857', badge: '+3', odd: 3 },
  { name: 'Tier 3 (Odd: 5)', color: '#f97316', stain: '#c2410c', badge: '+5', odd: 5 },
  { name: 'Tier 4 (Odd: 7)', color: '#6366f1', stain: '#4338ca', badge: '+7', odd: 7 },
  { name: 'Tier 5 (Odd: 9)', color: '#a855f7', stain: '#7e22ce', badge: '+9', odd: 9 },
];

export function Table3StackedTriangles3D({ rows = 3, placedRows = 3 }) {
  const effectiveRows = Math.min(5, Math.max(1, rows || 3));
  const effectivePlaced = Math.min(effectiveRows, Math.max(1, placedRows || 3));

  return (
    <Suspense fallback={null}>
      <RealisticStackedTrianglesScene
        effectiveRows={effectiveRows}
        effectivePlaced={effectivePlaced}
      />
    </Suspense>
  );
}

function RealisticStackedTrianglesScene({ effectiveRows, effectivePlaced }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/hardwood_texture.jpg');
  const [hoveredTier, setHoveredTier] = useState(null);

  useMemo(() => {
    if (woodTexture) {
      woodTexture.wrapS = THREE.RepeatWrapping;
      woodTexture.wrapT = THREE.RepeatWrapping;
      woodTexture.repeat.set(2.5, 2.5);
      woodTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [woodTexture]);

  const s = 0.58; // Unit triangle side length
  const H = s * (Math.sqrt(3) / 2); // Unit triangle height ~0.5022
  const totalH = effectiveRows * H;
  const centerZ = totalH * (2 / 3);
  const trayRadius = Math.max(1.85, totalH * 0.72 + 0.68);

  // Tactile beveled equilateral triangle shape (Z-centered ONLY to preserve true centroid in X & Y)
  const { triangleShape, triangleGeom } = useMemo(() => {
    const size = 0.54; // slight gap for visible mortar lines
    const h = size * (Math.sqrt(3) / 2);
    const shape = new THREE.Shape();
    // Upright 2D shape: Apex at (0, 2h/3), Base at y = -h/3
    shape.moveTo(0, (2 * h) / 3);
    shape.lineTo(size / 2, -h / 3);
    shape.lineTo(-size / 2, -h / 3);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.016,
      bevelSize: 0.016,
      bevelSegments: 2,
    });
    // Center Z only (do NOT call geom.center() which destroys X/Y centroid)
    geom.translate(0, 0, -0.06);
    geom.computeVertexNormals();

    return { triangleShape: shape, triangleGeom: geom };
  }, []);

  // Precompute triangle positions for all rows with 100% tessellation accuracy
  const triangleItems = useMemo(() => {
    const items = [];
    for (let r = 0; r < effectiveRows; r++) {
      const tierCount = 2 * r + 1;
      const isPlaced = r < effectivePlaced;
      const palette = STACKED_TRIANGLE_TIERS[r % STACKED_TRIANGLE_TIERS.length];

      for (let k = 0; k < tierCount; k++) {
        const isUpright = k % 2 === 0;
        const x = (k - r) * (s / 2);
        // Upright apex at r*H, base at (r+1)*H -> centroid at r*H + 2H/3
        // Inverted base at r*H, apex at (r+1)*H -> centroid at r*H + H/3
        const zRaw = isUpright ? (r * H + (2 * H) / 3) : (r * H + H / 3);
        const z = zRaw - centerZ;
        // Central triangle of the tier gets the badge
        const isTierCenter = k === r;

        items.push({
          r,
          k,
          x,
          z,
          isUpright,
          isPlaced,
          palette,
          isTierCenter,
        });
      }
    }
    return items;
  }, [effectiveRows, effectivePlaced, s, H, centerZ]);

  return (
    <group position={[0, -0.16, 0]} rotation={[0.68, -0.22, 0]}>
      {/* 1. Deep Space Studio Lighting for Dark Theme */}
      <ambientLight intensity={1.3} color="#cbd5e1" />
      <directionalLight position={[6, 10, 8]} intensity={2.8} color="#ffffff" castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[0, 3, 2]} intensity={1.8} color="#fef08a" distance={8} />

      {/* 2. Floating Golden Math Sparkles */}
      <DreiSparkles count={28} scale={4.2} size={2.0} speed={0.35} color="#fde68a" />

      {/* 3. Circular Polished Walnut Inspection Turntable */}
      <group position={[0, -0.08, 0]}>
        {/* Turntable Plinth */}
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <cylinderGeometry args={[trayRadius, trayRadius + 0.12, 0.14, 64]} />
          <meshStandardMaterial
            map={woodTexture}
            bumpMap={woodTexture}
            bumpScale={0.03}
            color="#1c1917"
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>

        {/* Polished Brass Rim Bezel */}
        <mesh position={[0, 0.008, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[trayRadius, 0.024, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.14} />
        </mesh>

        {/* Inlaid Concentric Gold Calibration Ring */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[trayRadius * 0.88, 0.01, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Recessed Dark Velvet/Slate Inlay Bed */}
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[trayRadius * 1.6, trayRadius * 1.6]} />
          <meshStandardMaterial color="#090d16" roughness={0.9} metalness={0.08} />
        </mesh>
      </group>

      {/* 4. Side & Base Dimension Labels */}
      <group position={[0, 0.01, 0]}>
        {/* Left Side Slanted Dimension Label (n rows) */}
        <group position={[-effectiveRows * (s / 3.2) - 0.42, 0, -0.1]} rotation={[-Math.PI / 2, 0, Math.PI / 3]}>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.16}
            color="#38bdf8"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            n = {effectiveRows} Rows
          </Text>
        </group>

        {/* Bottom Total Formula Label */}
        <group position={[0, 0, trayRadius * 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.17}
            color="#fef08a"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            Total = {effectiveRows}² = {effectiveRows * effectiveRows} Triangles
          </Text>
        </group>
      </group>

      {/* 5. Tactile 3D Montessori Hardwood Stacked Triangles */}
      {triangleItems.map((item, idx) => {
        // Upright triangle points toward -Z (rotY = 0)
        // Inverted triangle points toward +Z (rotY = Math.PI)
        const rotY = item.isUpright ? 0 : Math.PI;
        const isHovered = hoveredTier === item.r;
        const elevateY = isHovered ? 0.05 : 0;

        if (!item.isPlaced) {
          // UNPLACED ROW: Recessed socket with glowing dashed blueprint wireframe
          return (
            <group key={`unplaced-tri-${idx}`} position={[item.x, 0.005, item.z]}>
              <lineSegments position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, rotY]}>
                <edgesGeometry args={[new THREE.ShapeGeometry(triangleShape)]} />
                <lineBasicMaterial
                  color={item.palette.color}
                  transparent
                  opacity={0.4}
                  linewidth={1}
                />
              </lineSegments>
              {item.isTierCenter && (
                <Text
                  position={[0, 0.015, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.16}
                  color={item.palette.color}
                  fontWeight="800"
                  anchorX="center"
                  anchorY="middle"
                  fillOpacity={0.45}
                >
                  {item.palette.badge}
                </Text>
              )}
            </group>
          );
        }

        // PLACED TRIANGLE: Solid Tactile Beveled Hardwood Prism
        return (
          <group
            key={`placed-tri-${idx}`}
            position={[item.x, 0.07 + elevateY, item.z]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredTier(item.r);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredTier(null);
            }}
          >
            {/* Main Beveled Triangular Prism Block */}
            <mesh
              geometry={triangleGeom}
              rotation={[-Math.PI / 2, 0, rotY]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                map={woodTexture}
                bumpMap={woodTexture}
                bumpScale={0.02}
                color={item.palette.color}
                roughness={0.24}
                metalness={0.06}
                clearcoat={0.65}
                clearcoatRoughness={0.12}
              />
            </mesh>

            {/* Central Triangle of the Tier (Always upright facing viewer) */}
            {item.isTierCenter ? (
              <group position={[0, 0.064, 0]}>
                {/* Circular Brass Inlay */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <circleGeometry args={[0.13, 24]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.16} />
                </mesh>
                <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.105, 24]} />
                  <meshBasicMaterial color="#0f172a" />
                </mesh>
                <Text
                  position={[0, 0.003, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.14}
                  color="#fef08a"
                  fontWeight="900"
                  anchorX="center"
                  anchorY="middle"
                >
                  {item.palette.badge}
                </Text>
              </group>
            ) : (
              /* Arm Triangle Inlay (Subtle Brass Pip) */
              <group position={[0, 0.064, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <circleGeometry args={[0.055, 16]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
                </mesh>
                <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.028, 12]} />
                  <meshBasicMaterial color="#1e293b" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

// -----------------------------------------------------------------------
// 6. TABLE 3 MASTER 3D VIEWER: KOCH SNOWFLAKE RAN// -----------------------------------------------------------------------
// 6. TABLE 3 MASTER 3D VIEWER: PHOTOREALISTIC NATURAL ICE KOCH SNOWFLAKE
// Concept: Crystalline Fractal Branching (3 × 4^k Segments)
// -----------------------------------------------------------------------
export function Table3KochSnowflake3D({ depth }) {
  const clampedDepth = Math.min(Math.max(0, depth || 0), 4);

  return (
    <Suspense fallback={null}>
      <RealisticKochSnowflakeScene depth={clampedDepth} />
    </Suspense>
  );
}

function RealisticKochSnowflakeScene({ depth }) {
  const frostTexture = useLoader(THREE.TextureLoader, '/ice_frost.jpg');

  useMemo(() => {
    if (frostTexture) {
      frostTexture.wrapS = THREE.RepeatWrapping;
      frostTexture.wrapT = THREE.RepeatWrapping;
      frostTexture.repeat.set(2, 2);
      frostTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [frostTexture]);

  // Compute 2D fractal perimeter points (textbook orientation: apex pointing LEFT, medium level size)
  const allPts = useMemo(() => {
    const r = 0.88;
    // Textbook orientation: apex points LEFT at angle = Math.PI (-r, 0)
    const v1 = [-r, 0];
    const v2 = [r * Math.cos(-Math.PI / 3), r * Math.sin(-Math.PI / 3)];
    const v3 = [r * Math.cos(Math.PI / 3), r * Math.sin(Math.PI / 3)];

    const edge1 = generateKoch2D(v1, v2, depth);
    const edge2 = generateKoch2D(v2, v3, depth);
    const edge3 = generateKoch2D(v3, v1, depth);

    return [...edge1.slice(0, -1), ...edge2.slice(0, -1), ...edge3];
  }, [depth]);

  // Create 3D Faceted Crystalline Ice Snowflake Mesh (medium thickness)
  const snowflakeGeom = useMemo(() => {
    if (!allPts || allPts.length < 3) return null;
    const shape = new THREE.Shape();
    shape.moveTo(allPts[0][0], allPts[0][1]);
    for (let i = 1; i < allPts.length; i++) {
      shape.lineTo(allPts[i][0], allPts[i][1]);
    }
    shape.closePath();

    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.014,
      bevelSegments: 2,
    });
    g.translate(0, 0, -0.055);
    g.computeVertexNormals();
    return g;
  }, [allPts]);

  // Sparkling diamond facet edge lines (tuned for medium scale)
  const linePositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < allPts.length - 1; i++) {
      pos.push(allPts[i][0], allPts[i][1], 0.062);
      pos.push(allPts[i + 1][0], allPts[i + 1][1], 0.062);
      pos.push(allPts[i][0], allPts[i][1], -0.062);
      pos.push(allPts[i + 1][0], allPts[i + 1][1], -0.062);
    }
    return new Float32Array(pos);
  }, [allPts]);

  // Inner foundational mother triangle outline
  const motherTrianglePositions = useMemo(() => {
    const r = 0.88;
    const v1 = [-r, 0, 0.064];
    const v2 = [r * Math.cos(-Math.PI / 3), r * Math.sin(-Math.PI / 3), 0.064];
    const v3 = [r * Math.cos(Math.PI / 3), r * Math.sin(Math.PI / 3), 0.064];
    return new Float32Array([
      v1[0], v1[1], v1[2], v2[0], v2[1], v2[2],
      v2[0], v2[1], v2[2], v3[0], v3[1], v3[2],
      v3[0], v3[1], v3[2], v1[0], v1[1], v1[2]
    ]);
  }, []);

  const totalSegments = 3 * Math.pow(4, depth);

  return (
    <group position={[0, -0.1, 0]}>
      {/* 1. Deep Space Cryogenic Lighting for Dark Theme */}
      <ambientLight intensity={1.2} color="#94a3b8" />
      <directionalLight position={[5, 8, 6]} intensity={2.8} color="#ffffff" castShadow />
      <directionalLight position={[-6, 3, -3]} intensity={2.2} color="#38bdf8" />
      <pointLight position={[0, -0.2, 2.8]} intensity={2.2} color="#0ea5e9" distance={7} />

      {/* 2. Floating Sub-Zero Cyan Ice Sparkles */}
      <DreiSparkles count={42} scale={3.8} size={2.2} speed={0.35} color="#7dd3fc" />

      {/* 3. Medium-Sized Horizontal Cryogenic Stage Platform */}
      <group position={[0, -0.84, 0]} rotation={[0.26, 0, 0]}>
        {/* Obsidian Cryogenic Stage Plinth */}
        <mesh position={[0, -0.08, 0]} receiveShadow>
          <cylinderGeometry args={[1.5, 1.65, 0.16, 64]} />
          <meshStandardMaterial
            map={frostTexture}
            bumpMap={frostTexture}
            bumpScale={0.03}
            color="#082f49"
            roughness={0.35}
            metalness={0.3}
          />
        </mesh>

        {/* Polished Brass Cryo-Bezel Rim */}
        <mesh position={[0, 0.008, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[1.5, 0.028, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.14} />
        </mesh>

        {/* Inlaid Inner Brass Concentric Rings on Stage Floor */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[1.15, 0.012, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Central Hexagonal Brass Pedestal Riser (Lifts crystal off the floor) */}
        <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.32, 0.22, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.18} />
        </mesh>
      </group>

      {/* 4. Solid Photorealistic Faceted Crystalline Ice Snowflake (Medium level size at y = 0.18) */}
      {snowflakeGeom && (
        <group position={[0, 0.18, 0]} rotation={[0.16, 0, 0]}>
          {/* Volumetric Ice Crystal Body with Real Physical Refraction */}
          <mesh geometry={snowflakeGeom} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#f0f9ff"
              emissive="#0284c7"
              emissiveIntensity={0.26}
              roughness={0.04}
              metalness={0.04}
              transmission={0.92}
              thickness={0.48}
              ior={1.31} // Physical refractive index of pure water ice
              clearcoat={1.0}
              clearcoatRoughness={0.03}
              transparent={true}
              opacity={0.96}
            />
          </mesh>

          {/* Glowing Crystalline Perimeter Facet Lines */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={linePositions.length / 3}
                array={linePositions}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#7dd3fc" transparent opacity={0.95} linewidth={2} />
          </lineSegments>

          {/* Foundational Mother Triangle (k=0) Etched inside the Crystal */}
          {depth > 0 && (
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={motherTrianglePositions.length / 3}
                  array={motherTrianglePositions}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#38bdf8" transparent opacity={0.5} linewidth={1.5} />
            </lineSegments>
          )}
        </group>
      )}
    </group>
  );
}

// -----------------------------------------------------------------------
// MAIN COMPONENT: PATTERNS IN SHAPES (TABLE 3 WORKBENCH)
// -----------------------------------------------------------------------
export default function PatternsInShapes({
  activeActivity = 1,
  setActiveActivity,
  viewMode = 'real',
  setViewMode = () => {},
  polygonIdx, setPolygonIdx, placedPolyEdges, setPlacedPolyEdges,
  graphIdx, setGraphIdx, activeComponentIds, setActiveComponentIds,
  squareSize, setSquareSize, placedSquareLayers, setPlacedSquareLayers,
  triangleRows, setTriangleRows, placedTriLayers, setPlacedTriLayers,
  kochDepth, setKochDepth
}) {
  const activities = [
    { id: 1, name: 'Regular Polygons', icon: '⬟', count: '3 to 10 Sides' },
    { id: 2, name: 'Complete Graphs', icon: '🕸️', count: 'K₂ to K₆ · T(n-1)' },
    { id: 3, name: 'Stacked Squares', icon: '🔲', count: '1² to 5²' },
    { id: 4, name: 'Stacked Triangles', icon: '🔺', count: '1² to 5²' },
    { id: 5, name: 'Koch Snowflake Rangoli', icon: '❄️', count: 'Depth 0 to 4' }
  ];

  const currentPoly = POLYGONS_DATA[polygonIdx || 0] || POLYGONS_DATA[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
      {/* 3 TABLE 3 ACTIVITIES SELECTOR TABS (Light Theme Palette) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.45rem', flexShrink: 0 }}>
        {activities.map((act) => {
          const isActive = activeActivity === act.id;
          return (
            <button
              key={act.id}
              onClick={() => setActiveActivity(act.id)}
              style={{
                padding: '0.35rem 0.4rem',
                borderRadius: '10px',
                border: isActive ? '1.5px solid var(--theme-primary, #0d9488)' : '1.5px solid #cbd5e1',
                background: isActive ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                color: isActive ? 'var(--theme-primary-dark, #0f766e)' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: isActive ? '0 2px 8px rgba(13, 148, 136, 0.15)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '1rem' }}>{act.icon}</span>
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.name}
                </div>
                <div style={{ fontSize: '0.55rem', color: isActive ? 'var(--theme-primary, #0d9488)' : '#64748b', fontWeight: '700' }}>
                  {act.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {activeActivity === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {/* Header & Dual View Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                Regular Polygons & Symmetry
              </h4>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                Explore how adding sides bridges straight-line geometry to smooth circles.
              </p>
            </div>

            {/* 3D View Mode Dual Tabs */}
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '14px', border: '1.5px solid #64748b' }}>
              <button
                onClick={() => setViewMode('real')}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '11px',
                  border: 'none',
                  background: viewMode === 'real' ? '#0d9488' : 'transparent',
                  color: viewMode === 'real' ? '#ffffff' : '#475569',
                  fontSize: '0.72rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: viewMode === 'real' ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                🌍 Real 3D Object
              </button>
              <button
                onClick={() => setViewMode('geometric')}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '11px',
                  border: 'none',
                  background: viewMode === 'geometric' ? '#0d9488' : 'transparent',
                  color: viewMode === 'geometric' ? '#ffffff' : '#475569',
                  fontSize: '0.72rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: viewMode === 'geometric' ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                📐 Geometric Shape
              </button>
            </div>
          </div>

          {/* Polygon Selector (3 to 10 Sides) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {POLYGONS_DATA.map((poly, idx) => {
              const isSelected = polygonIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setPolygonIdx(idx);
                    setPlacedPolyEdges(poly.sides);
                  }}
                  style={{
                    padding: '0.3rem 0.55rem',
                    borderRadius: '16px',
                    border: isSelected ? '1.5px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)',
                    background: isSelected ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--theme-heading, #134e4a)',
                    fontWeight: '800',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <span>{poly.icon}</span>
                  <span>{poly.sides} Sides</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Geometric Edge Builder (When in geometric mode) */}
          {viewMode === 'geometric' && (
            <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#1e293b' }}>
                Construct Edges: <span style={{ color: '#0d9488', fontWeight: '900' }}>{placedPolyEdges} / {currentPoly.sides}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  onClick={() => setPlacedPolyEdges(prev => Math.max(1, prev - 1))}
                  style={{ padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  - Edge
                </button>
                <button
                  onClick={() => setPlacedPolyEdges(prev => Math.min(currentPoly.sides, prev + 1))}
                  style={{ padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  + Edge
                </button>
                <button
                  onClick={() => setPlacedPolyEdges(currentPoly.sides)}
                  style={{ padding: '0.2rem 0.55rem', borderRadius: '8px', border: 'none', background: '#0d9488', color: '#ffffff', fontSize: '0.72rem', fontWeight: '900', cursor: 'pointer' }}
                >
                  Complete
                </button>
              </div>
            </div>
          )}

          {/* Polygon Information & Properties Panel */}
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '0.75rem 0.85rem', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Real-Life Context Bar */}
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>{currentPoly.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '0.9rem' }}>
                  {currentPoly.realLifeTitle}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.4, marginTop: '0.2rem', display: 'block', textAlign: 'justify' }}>
                  {currentPoly.realLife}
                </span>
              </div>
            </div>

            {/* Mathematical Properties Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ background: '#f0fdfa', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #ccfbf1', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#0f766e', fontWeight: '800' }}>SIDES (n)</div>
                <div style={{ fontSize: '0.86rem', fontWeight: '900', color: '#0d9488' }}>{currentPoly.sides}</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#1e40af', fontWeight: '800' }}>INTERIOR ANGLE</div>
                <div style={{ fontSize: '0.86rem', fontWeight: '900', color: '#2563eb' }}>{currentPoly.interiorAngle}</div>
              </div>
              <div style={{ background: '#fef3c7', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#92400e', fontWeight: '800' }}>DIAGONALS</div>
                <div style={{ fontSize: '0.86rem', fontWeight: '900', color: '#d97706' }}>{currentPoly.diagonals}</div>
              </div>
              <div style={{ background: '#fdf2f8', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#9d174d', fontWeight: '800' }}>SYMMETRY</div>
                <div style={{ fontSize: '0.86rem', fontWeight: '900', color: '#db2777' }}>{currentPoly.sides} Lines</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY 2: COMPLETE GRAPHS — GEOBOARD STRING ART (TABLE 3) */}
      {activeActivity === 2 && (() => {
        const currentGraph = COMPLETE_GRAPHS_MODULAR_DATA[graphIdx || 0] || COMPLETE_GRAPHS_MODULAR_DATA[0];
        
        // Generate ordered list of all pairwise edges for current n
        const allPairwiseEdges = [];
        for (let i = 0; i < currentGraph.n; i++) {
          for (let j = i + 1; j < currentGraph.n; j++) {
            allPairwiseEdges.push({
              id: `${i}-${j}`,
              u: i,
              v: j,
              from: `Peg ${i + 1}`,
              to: `Peg ${j + 1}`
            });
          }
        }

        // Active edge count: supports both granular edge IDs and component IDs
        // If activeComponentIds is empty, default to all edges so the graph is full by default!
        const activeRouteCount = activeComponentIds.length === 0
          ? currentGraph.total
          : allPairwiseEdges.filter(e => 
              activeComponentIds.includes(e.id) || 
              currentGraph.shapeComponents.some(comp => activeComponentIds.includes(comp.id) && comp.edges?.some(ce => (ce.u === e.u && ce.v === e.v) || (ce.u === e.v && ce.v === e.u)))
            ).length;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', justifyContent: 'space-evenly' }}>
            {/* Header & Concept Intro */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                  {'Complete Graphs (Kn) — Geoboard String Art'}
                </h4>
                <span style={{ fontSize: '0.72rem', background: '#ccfbf1', color: '#0f766e', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', border: '1px solid #99f6e4' }}>
                  {'Triangular Series: T(n-1)'}
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, textAlign: 'justify' }}>
                In a <strong>Complete Graph ({currentGraph.symbol})</strong> with <strong>{currentGraph.n} red pegs</strong>, every single peg connects to every other peg with a string.
                This generates the famous <strong>Triangular Number Sequence</strong>: <em>1, 3, 6, 10, 15...</em> You can calculate the total lines using the formula <strong>n × (n-1) / 2</strong>.
              </p>
            </div>

            {/* Complete Graph Selector Buttons (K2 to K6) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {COMPLETE_GRAPHS_MODULAR_DATA.map((g, idx) => {
                const isSelected = graphIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setGraphIdx(idx);
                      // Connect all edges for the selected graph
                      const newEdges = [];
                      for (let i = 0; i < g.n; i++) {
                        for (let j = i + 1; j < g.n; j++) {
                          newEdges.push(`${i}-${j}`);
                        }
                      }
                      setActiveComponentIds(newEdges);
                    }}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '16px',
                      border: isSelected ? '1.5px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)',
                      background: isSelected ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--theme-heading, #134e4a)',
                      fontWeight: '800',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{g.icon}</span>
                    <span>{`${g.code} (${g.total} ${g.total === 1 ? 'Edge' : 'Edges'})`}</span>
                  </button>
                );
              })}
            </div>

            {/* Granular Step-by-Step String Controls */}
            <div style={{ background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#1e293b' }}>
                Strings Connected: <span style={{ color: '#0284c7', fontWeight: '900' }}>{activeRouteCount} of {currentGraph.total}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => {
                    const currentActive = activeComponentIds.length === 0
                      ? allPairwiseEdges.map(e => e.id)
                      : activeComponentIds;
                    if (currentActive.length > 0) {
                      setActiveComponentIds(currentActive.slice(0, -1));
                    }
                  }}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    border: '1.5px solid #64748b',
                    background: '#ffffff',
                    color: '#1e293b',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  - String
                </button>
                <button
                  onClick={() => {
                    const currentActive = activeComponentIds.length === 0
                      ? allPairwiseEdges.map(e => e.id)
                      : activeComponentIds;
                    const missing = allPairwiseEdges.find(e => !currentActive.includes(e.id));
                    if (missing) {
                      setActiveComponentIds([...currentActive, missing.id]);
                    }
                  }}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    border: '1.5px solid #64748b',
                    background: '#ffffff',
                    color: '#1e293b',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  + String
                </button>
                <button
                  onClick={() => setActiveComponentIds(allPairwiseEdges.map(e => e.id))}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--theme-btn-gradient, linear-gradient(135deg, #0284c7 0%, #0369a1 100%))',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  Connect All Strings 🕸️
                </button>
                <button
                  onClick={() => setActiveComponentIds([allPairwiseEdges[0]?.id].filter(Boolean))}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    border: '1.5px solid #64748b',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Step-by-Step Breakdown & Formula Card */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '0.65rem 0.85rem', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {/* Step Breakdown Sequence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🧵 How Strings Add Up (Peg by Peg):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {currentGraph.breakdown?.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        background: '#f0f9ff',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '8px',
                        border: '1px solid #bae6fd',
                        fontSize: '0.7rem',
                        color: '#0369a1',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{b.step}</span>
                      <span style={{ background: '#0284c7', color: '#ffffff', padding: '1px 5px', borderRadius: '6px', fontWeight: '900', fontSize: '0.68rem' }}>
                        +{b.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mathematical Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ background: '#eff6ff', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#1e40af', fontWeight: '800' }}>RED PEGS (n)</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#2563eb' }}>{currentGraph.n} Pegs</div>
                </div>
                <div style={{ background: '#fef3c7', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#92400e', fontWeight: '800' }}>EDGES FORMULA</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#d97706' }}>{currentGraph.n}×{currentGraph.n - 1} / 2 = {currentGraph.total}</div>
                </div>
                <div style={{ background: '#fdf2f8', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#9d174d', fontWeight: '800' }}>TRIANGULAR NUMBER</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#db2777' }}>{currentGraph.triangularNumber}</div>
                </div>
              </div>

              {/* Educational Rationale Insight */}
              <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: 1.45, background: '#f8fafc', padding: '0.45rem 0.65rem', borderRadius: '8px', textAlign: 'justify' }}>
                💡 <strong>Why divide by 2?</strong> Each string connects <strong>2 red pegs</strong> simultaneously. If we didn't divide by 2, we would count every single string twice (once from each end peg)!
              </div>
            </div>
          </div>
        );
      })()}

      {/* ACTIVITY 3: STACKED SQUARES (HERITAGE CERAMIC TILES) */}
      {activeActivity === 3 && (() => {
        // Calculate currently placed tiles sum
        let totalPlacedTiles = 0;
        const gnomonLayers = [];
        for (let l = 1; l <= squareSize; l++) {
          const count = 2 * l - 1;
          const isLPlaced = l <= placedSquareLayers;
          if (isLPlaced) totalPlacedTiles += count;
          gnomonLayers.push({ layer: l, count, isPlaced: isLPlaced });
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem',  }}>
            {/* Header & Concept Intro */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                  {'Stacked Heritage Ceramic Tiles (1², 2², 3², 4², 5²)'}
                </h4>
                <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', border: '1px solid #fde68a' }}>
                  {'Square Numbers: n²'}
                </span>
              </div>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                Handcrafted Chettinad artisan floor mosaic. Each square is expanded by wrapping an <strong>L-shaped gnomon</strong> of consecutive odd numbers (1 + 3 + 5 + 7 + 9 = 25 = 5²).
              </p>
            </div>

            {/* Grid Dimension Selector Buttons (1x1 to 5x5) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {[1, 2, 3, 4, 5].map((s) => {
                const isSelected = squareSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      setSquareSize(s);
                      setPlacedSquareLayers(s);
                    }}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '16px',
                      border: isSelected ? '1.5px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)',
                      background: isSelected ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--theme-heading, #134e4a)',
                      fontWeight: '800',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🔲</span>
                    <span>{`${s}×${s} (${s * s} Tiles)`}</span>
                  </button>
                );
              })}
            </div>

            {/* Granular Gnomon Layer Placement Controls */}
            <div style={{ background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#1e293b' }}>
                Active Mosaic Tiles: <span style={{ color: '#0d9488', fontWeight: '900' }}>{totalPlacedTiles} of {squareSize * squareSize}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => setPlacedSquareLayers(prev => Math.max(1, prev - 1))}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    border: '1.5px solid #64748b',
                    background: '#ffffff',
                    color: '#1e293b',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  - Gnomon
                </button>
                <button
                  onClick={() => setPlacedSquareLayers(prev => Math.min(squareSize, prev + 1))}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    border: '1.5px solid #64748b',
                    background: '#ffffff',
                    color: '#1e293b',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  + Add Gnomon
                </button>
                <button
                  onClick={() => setPlacedSquareLayers(squareSize)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(13, 148, 136, 0.3)'
                  }}
                >
                  Complete Square 🔲
                </button>
                <button
                  onClick={() => setPlacedSquareLayers(1)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    border: '1.5px solid #64748b',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Step-by-Step Gnomon Layer Breakdown & Formula Card */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '0.65rem 0.85rem', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {/* Step Breakdown Sequence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🔲 Consecutive Odd Number Gnomon Layers:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {gnomonLayers.map((gl) => (
                    <div
                      key={gl.layer}
                      style={{
                        background: gl.isPlaced ? '#f0fdfa' : '#f8fafc',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '8px',
                        border: `1px solid ${gl.isPlaced ? '#ccfbf1' : '#475569'}`,
                        fontSize: '0.7rem',
                        color: gl.isPlaced ? '#134e4a' : '#94a3b8',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Layer {gl.layer}</span>
                      <span style={{ background: gl.isPlaced ? '#0d9488' : '#64748b', color: '#ffffff', padding: '1px 5px', borderRadius: '6px', fontWeight: '900', fontSize: '0.68rem' }}>
                        +{gl.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mathematical Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ background: '#eff6ff', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#1e40af', fontWeight: '800' }}>SIDE LENGTH (n)</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#2563eb' }}>{squareSize} Units</div>
                </div>
                <div style={{ background: '#fef3c7', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#92400e', fontWeight: '800' }}>ODD SUM FORMULA</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#d97706' }}>
                    {Array.from({ length: squareSize }).map((_, i) => 2 * i + 1).join(' + ')} = {squareSize * squareSize}
                  </div>
                </div>
                <div style={{ background: '#fdf2f8', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#9d174d', fontWeight: '800' }}>SQUARE NUMBER</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#db2777' }}>{squareSize}² = {squareSize * squareSize}</div>
                </div>
              </div>

              {/* Educational Rationale Insight */}
              <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.35, background: '#f8fafc', padding: '0.35rem 0.6rem', borderRadius: '8px' }}>
                💡 <strong>Why do odd numbers build squares?</strong> Expanding an n × n square to (n+1) × (n+1) requires adding 1 top row (n), 1 side column (n), and 1 corner tile = 2n + 1 (the next consecutive odd number)!
              </div>
            </div>
          </div>
        );
      })()}

      {/* ACTIVITY 4: STACKED TRIANGLES (TEXTBOOK: ROWS OF UNIT TRIANGLES -> SQUARE NUMBERS) */}
      {activeActivity === 4 && (() => {
        const totalTriangles = triangleRows * triangleRows;
        const oddFormula = Array.from({ length: triangleRows }).map((_, i) => 2 * i + 1).join(' + ');

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                  {'Stacked Equilateral Triangles (1², 2², 3², 4², 5²)'}
                </h4>
                <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', border: '1px solid #fde68a' }}>
                  {'Square Numbers: n²'}
                </span>
              </div>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                Stacking rows of unit equilateral triangles forms a large equilateral triangle. Each row adds the next consecutive odd number of triangles (1 + 3 + 5 + 7 + 9 = 25 = 5²), visually proving that summing odd numbers yields square numbers!
              </p>
            </div>

            {/* Row Selector Buttons (1 to 5 Rows) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {[1, 2, 3, 4, 5].map((t) => {
                const isSelected = triangleRows === t;
                const triCount = t * t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setTriangleRows(t);
                      setPlacedTriLayers(t);
                    }}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '16px',
                      border: isSelected ? '1.5px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)',
                      background: isSelected ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--theme-heading, #134e4a)',
                      fontWeight: '800',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🔺</span>
                    <span>{t} {t === 1 ? 'Row' : 'Rows'} ({triCount} {triCount === 1 ? 'Triangle' : 'Triangles'})</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Row Placement Controls */}
            <div style={{ background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#1e293b' }}>
                Rows Placed in Stack: <span style={{ color: '#0d9488', fontWeight: '900' }}>{placedTriLayers} of {triangleRows}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => setPlacedTriLayers(prev => Math.max(1, prev - 1))}
                  style={{ padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1.5px solid #64748b', background: '#ffffff', color: '#1e293b', fontSize: '0.74rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  - Row
                </button>
                <button
                  onClick={() => setPlacedTriLayers(prev => Math.min(triangleRows, prev + 1))}
                  style={{ padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1.5px solid #64748b', background: '#ffffff', color: '#1e293b', fontSize: '0.74rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  + Row
                </button>
                <button
                  onClick={() => setPlacedTriLayers(triangleRows)}
                  style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', border: 'none', background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', color: '#ffffff', fontSize: '0.74rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 2px 6px rgba(13, 148, 136, 0.3)' }}
                >
                  Complete Triangle Stack 🔺
                </button>
                <button
                  onClick={() => setPlacedTriLayers(1)}
                  style={{ padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1.5px solid #64748b', background: '#f8fafc', color: '#475569', fontSize: '0.74rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Mathematical Properties Badges */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '0.65rem 0.85rem', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                <div style={{ background: '#eff6ff', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#1e40af', fontWeight: '800' }}>ROWS (n)</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#2563eb' }}>{triangleRows} {triangleRows === 1 ? 'Row' : 'Rows'}</div>
                </div>
                <div style={{ background: '#fef3c7', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#92400e', fontWeight: '800' }}>ODD SUM FORMULA</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#d97706' }}>{oddFormula} = {totalTriangles}</div>
                </div>
                <div style={{ background: '#f0fdfa', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #ccfbf1', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#0f766e', fontWeight: '800' }}>SQUARE NUMBER</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0d9488' }}>{triangleRows}² = {totalTriangles}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35, background: '#f8fafc', padding: '0.35rem 0.6rem', borderRadius: '8px' }}>
                {'💡 Why do stacked triangles form square numbers? In row r, alternating upright (r) and inverted (r-1) triangles always total 2r - 1 (the consecutive odd numbers). Summing all rows up to n always equals n²!'}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ACTIVITY 3: KOCH SNOWFLAKE RANGOLI */}
      {activeActivity === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem',  }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Artisan Glass Geometric Fractal ($3 \times 4^k$)
            </h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#334155', lineHeight: 1.45 }}>
              This beautiful mathematical structure is built using glowing cyan glass links joined perfectly by solid gold spheres. At each geometric iteration, every straight segment fractures into 4 new smaller segments, multiplying the total segment count by 4!
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.82rem', color: 'var(--theme-heading, #134e4a)' }}>Fractal Depth $k = {kochDepth}$:</span>
            <input
              type="range"
              min="0"
              max="4"
              value={kochDepth}
              onChange={(e) => setKochDepth(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.86rem' }}>
              {3 * Math.pow(4, kochDepth)} Segments
            </span>
          </div>

          {/* Koch Snowflake Sequence Example Box */}
          <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', textAlign: 'center' }}>
              Sequence Rule: Multiply by 4 each Iteration
            </div>
            
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '2.5rem' }}>
              {[3, 12, 48, 192, 768].map((num, i) => {
                const isSelected = i <= kochDepth;
                const isCurrent = i === kochDepth;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {isSelected && i > 0 && <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900', fontSize: '0.85rem', marginTop: '0.1rem' }}>×4</span>}
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '8px', 
                      background: isSelected ? (isCurrent ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--theme-badge-bg, #ccfbf1)') : '#f8fafc', 
                      color: isSelected ? (isCurrent ? '#ffffff' : 'var(--theme-primary-dark, #0f766e)') : '#94a3b8', 
                      fontWeight: isSelected ? '900' : '700',
                      fontSize: '0.85rem',
                      boxShadow: isCurrent ? '0 3px 10px rgba(217, 119, 6, 0.35)' : 'none',
                      transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      border: isSelected && !isCurrent ? '1.5px solid var(--theme-border, #a7f3d0)' : isCurrent ? '1.5px solid transparent' : '1px solid #e2e8f0',
                      zIndex: isCurrent ? 10 : 1
                    }}>
                      {num}
                    </span>
                  </div>
                )
              })}
              <span style={{ padding: '0.2rem', color: '#64748b', fontWeight: '900', fontSize: '0.85rem', marginLeft: '0.2rem' }}>...</span>
            </div>
            
            <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '800', marginTop: '0.2rem', textAlign: 'center', background: '#f1f5f9', padding: '0.5rem 0.8rem', borderRadius: '8px', width: '100%' }}>
              Iteration <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900' }}>k = {kochDepth}</span> ➜ <span style={{ color: '#d97706', fontWeight: '900', fontSize: '0.95rem' }}>{3 * Math.pow(4, kochDepth)} Segments</span>
              <div style={{ color: '#15803d', fontWeight: '900', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Formula: 3 × 4<sup style={{fontSize:'0.65rem', fontWeight:'900'}}>k</sup> ✨
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
