import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Environment, Sky, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sparkles,
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
    name: '2 Cities (1 Route)',
    total: 1,
    formula: '\\frac{2 \\times 1}{2} = 1',
    triangularNumber: 'T₁ = 1',
    color: '#0284c7',
    icon: '✈️',
    realLifeTitle: '2-City Direct Flight Corridor (Delhi ↔ Mumbai)',
    realLife: 'Connecting 2 airports requires exactly 1 direct two-way non-stop flight corridor.',
    breakdown: [
      { step: 'Delhi Airport schedules route to Mumbai', count: 1 }
    ],
    shapeComponents: [
      { id: 'k2-flight', name: 'Delhi ↔ Mumbai Non-Stop Corridor', icon: '✈️', color: '#0284c7', edges: [{ u: 0, v: 1 }] }
    ]
  },
  {
    n: 3,
    name: '3 Cities (3 Routes)',
    total: 3,
    formula: '\\frac{3 \\times 2}{2} = 3',
    triangularNumber: 'T₂ = 2 + 1 = 3',
    color: '#059669',
    icon: '🔺',
    realLifeTitle: '3-City Golden Triangle Aviation Network',
    realLife: 'Delhi connects to 2 cities, and Mumbai connects to 1 remaining city (2 + 1 = 3 non-stop routes forming an airway triangle).',
    breakdown: [
      { step: 'Delhi connects to Mumbai, Bengaluru', count: 2 },
      { step: 'Mumbai connects to Bengaluru', count: 1 }
    ],
    shapeComponents: [
      { id: 'k3-tri', name: 'All 3 Flight Corridors (3 routes)', icon: '🔺', color: '#059669', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 0 }] }
    ]
  },
  {
    n: 4,
    name: '4 Cities (6 Routes)',
    total: 6,
    formula: '\\frac{4 \\times 3}{2} = 6',
    triangularNumber: 'T₃ = 3 + 2 + 1 = 6',
    color: '#d97706',
    icon: '🛫',
    realLifeTitle: '4-City Metro Flight Grid (Delhi, Mumbai, Bengaluru, Chennai)',
    realLife: 'Connecting 4 major metro hubs non-stop requires 3 + 2 + 1 = 6 direct flight corridors.',
    breakdown: [
      { step: 'Delhi connects to Mumbai, Bengaluru, Chennai', count: 3 },
      { step: 'Mumbai connects to Bengaluru, Chennai', count: 2 },
      { step: 'Bengaluru connects to Chennai', count: 1 }
    ],
    shapeComponents: [
      { id: 'k4-perimeter', name: 'Perimeter Coastal Corridors (4 routes)', icon: '🟦', color: '#0284c7', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 0 }] },
      { id: 'k4-diagonal', name: 'Cross-Country Diagonal Corridors (2 routes)', icon: '⚡', color: '#f59e0b', edges: [{ u: 0, v: 2 }, { u: 1, v: 3 }] }
    ]
  },
  {
    n: 5,
    name: '5 Cities (10 Routes)',
    total: 10,
    formula: '\\frac{5 \\times 4}{2} = 10',
    triangularNumber: 'T₄ = 4 + 3 + 2 + 1 = 10',
    color: '#db2777',
    icon: '⭐',
    realLifeTitle: '5-City National Hub Airway Network',
    realLife: '5 national airport hubs need 4 + 3 + 2 + 1 = 10 non-stop routes, forming a pentagon perimeter plus a 5-pointed star flight pattern.',
    breakdown: [
      { step: 'Delhi connects to 4 remaining hubs', count: 4 },
      { step: 'Mumbai connects to 3 remaining hubs', count: 3 },
      { step: 'Bengaluru connects to 2 remaining hubs', count: 2 },
      { step: 'Chennai connects to Kolkata', count: 1 }
    ],
    shapeComponents: [
      { id: 'k5-pentagon', name: 'Outer Perimeter Airway Ring (5 routes)', icon: '⬟', color: '#db2777', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 0 }] },
      { id: 'k5-star', name: 'Inscribed Star Express Corridors (5 routes)', icon: '⭐', color: '#f59e0b', edges: [{ u: 0, v: 2 }, { u: 2, v: 4 }, { u: 4, v: 1 }, { u: 1, v: 3 }, { u: 3, v: 0 }] }
    ]
  },
  {
    n: 6,
    name: '6 Cities (15 Routes)',
    total: 15,
    formula: '\\frac{6 \\times 5}{2} = 15',
    triangularNumber: 'T₅ = 5 + 4 + 3 + 2 + 1 = 15',
    color: '#7c3aed',
    icon: '🌐',
    realLifeTitle: '6-City Complete Metro Airway Grid',
    realLife: '6 major aviation hubs require 5 + 4 + 3 + 2 + 1 = 15 direct routes, perfectly matching the 5th Triangular Number (T₅).',
    breakdown: [
      { step: 'Delhi connects to 5 hubs', count: 5 },
      { step: 'Mumbai connects to 4 remaining', count: 4 },
      { step: 'Bengaluru connects to 3 remaining', count: 3 },
      { step: 'Chennai connects to 2 remaining', count: 2 },
      { step: 'Kolkata connects to Hyderabad', count: 1 }
    ],
    shapeComponents: [
      { id: 'k6-hexagon', name: 'Outer Hexagon Airway Ring (6 routes)', icon: '⬢', color: '#7c3aed', edges: [{ u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 5 }, { u: 5, v: 0 }] },
      { id: 'k6-star1', name: 'Express Star Corridors Δ₁ (3 routes)', icon: '🔺', color: '#ea580c', edges: [{ u: 0, v: 2 }, { u: 2, v: 4 }, { u: 4, v: 0 }] },
      { id: 'k6-star2', name: 'Express Star Corridors Δ₂ (3 routes)', icon: '🔻', color: '#059669', edges: [{ u: 1, v: 3 }, { u: 3, v: 5 }, { u: 5, v: 1 }] },
      { id: 'k6-diameters', name: 'Direct Trans-Continental Corridors (3 routes)', icon: '⚡', color: '#f59e0b', edges: [{ u: 0, v: 3 }, { u: 1, v: 4 }, { u: 2, v: 5 }] }
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

// 3 SIDES: Photorealistic Ancient Egyptian Stepped Limestone Pyramid (Triangle Face Geometry)
export function PhotorealisticPyramid3D() {
  // Stepped Limestone Block Strata (22 discrete stone masonry courses)
  const pyramidLayers = useMemo(() => {
    const layers = [];
    const totalTiers = 20;
    const baseWidth = 2.4;
    const totalHeight = 1.8;
    const tierHeight = totalHeight / totalTiers;

    for (let i = 0; i < totalTiers; i++) {
      const progress = i / totalTiers;
      const width = baseWidth * (1 - progress);
      const y = i * tierHeight + tierHeight / 2;
      // Slight ancient stone weathering color variation
      const colorShades = ['#d4a373', '#cca070', '#c68b59', '#dfb88b', '#e2be96', '#be8956'];
      const color = colorShades[i % colorShades.length];

      layers.push({
        y,
        width,
        height: tierHeight * 1.02,
        color
      });
    }
    return layers;
  }, []);

  // Desert Dunes & Landscape Details
  const dunes = useMemo(() => [
    { pos: [-2.8, -0.15, -1.5], scale: [2.5, 0.4, 2.0], rot: [0.1, 0.4, -0.05] },
    { pos: [2.6, -0.2, -1.2], scale: [2.2, 0.35, 1.8], rot: [-0.1, -0.3, 0.08] },
    { pos: [0.5, -0.22, 2.2], scale: [3.0, 0.3, 1.6], rot: [0.05, 0.8, -0.02] },
    { pos: [-2.2, -0.25, 1.8], scale: [2.4, 0.28, 1.5], rot: [-0.08, -0.5, 0.04] }
  ], []);

  return (
    <group position={[0, -0.55, 0]} rotation={[0.08, 0.35, 0]}>
      {/* Warm Golden Hour Desert Sunlight */}
      <ambientLight intensity={1.4} color="#fef3c7" />
      <directionalLight position={[6, 7, 5]} intensity={2.8} color="#fff1d6" castShadow />
      <directionalLight position={[-6, 3, -4]} intensity={1.2} color="#fcd34d" />
      <pointLight position={[0, 3, 2]} intensity={1.0} color="#f59e0b" distance={6} />

      {/* 1. Expansive Saharan Desert Sand Horizon Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[5.5, 5.5, 0.1, 48]} />
        <meshStandardMaterial color="#d4a373" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* 2. Rolling Desert Sand Dunes */}
      {dunes.map((d, idx) => (
        <mesh key={`dune-${idx}`} position={d.pos} rotation={d.rot} scale={d.scale} receiveShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#c68b59" roughness={0.98} />
        </mesh>
      ))}

      {/* 3. Stepped Limestone Masonry Tier Blocks (Zero Overlap, Clean Strata) */}
      <group position={[0, 0, 0]}>
        {pyramidLayers.map((layer, idx) => (
          <mesh
            key={`tier-${idx}`}
            position={[0, layer.y, 0]}
            rotation={[0, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[layer.width, layer.height, layer.width]} />
            <meshPhysicalMaterial
              color={layer.color}
              roughness={0.92}
              metalness={0.04}
              clearcoat={0.05}
            />
          </mesh>
        ))}

        {/* 4. Radiant Golden Electrum Capstone (Pyramidion) on Top */}
        <mesh position={[0, 1.88, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.18, 0.22, 4]} />
          <meshPhysicalMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.35}
            metalness={0.95}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>
        <pointLight position={[0, 1.95, 0]} intensity={1.5} color="#fef08a" distance={2} />
      </group>

      {/* 5. Ancient Entrance Portal on Northern Face */}
      <mesh position={[0, 0.22, 1.08]} rotation={[-0.48, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.32, 0.08]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>

      {/* 6. Distant Desert Oasis Palm Trees & Atmosphere */}
      <group position={[-2.4, 0, -1.2]}>
        {/* Palm Trunk */}
        <mesh position={[0, 0.45, 0]} rotation={[0, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.035, 0.055, 0.9, 12]} />
          <meshStandardMaterial color="#5c3818" roughness={0.9} />
        </mesh>
        {/* Palm Fronds */}
        {[0, 1, 2, 3, 4, 5].map((p) => (
          <mesh
            key={`frond-${p}`}
            position={[0, 0.88, 0]}
            rotation={[0.3, (p * Math.PI) / 3, 0.5]}
            scale={[0.08, 0.32, 0.02]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

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

export const NETWORK_HUBS_DATA = [
  { id: 0, name: 'Delhi', code: 'DEL', icon: '🛫', color: '#0284c7', light: '#38bdf8' },
  { id: 1, name: 'Mumbai', code: 'BOM', icon: '🛫', color: '#d97706', light: '#f59e0b' },
  { id: 2, name: 'Bengaluru', code: 'BLR', icon: '🛫', color: '#16a34a', light: '#4ade80' },
  { id: 3, name: 'Chennai', code: 'MAA', icon: '🛫', color: '#9333ea', light: '#c084fc' },
  { id: 4, name: 'Kolkata', code: 'CCU', icon: '🛫', color: '#e11d48', light: '#fb7185' },
  { id: 5, name: 'Hyderabad', code: 'HYD', icon: '🛫', color: '#0891b2', light: '#22d3ee' }
];

// Holographic Glowing Flight Arc using QuadraticBezierCurve3
function FlightArc({ from, to, color }) {
  const arcGeo = useMemo(() => {
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const maxHeight = dist * 0.35;
    
    // Create a sweeping parabolic curve in 3D space
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(from.x, 0.05, from.z),
      new THREE.Vector3(from.x + dx / 2, maxHeight, from.z + dz / 2),
      new THREE.Vector3(to.x, 0.05, to.z)
    );
    return new THREE.TubeGeometry(curve, 48, 0.008, 8, false);
  }, [from, to]);

  return (
    <mesh geometry={arcGeo}>
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={3.5} 
        transparent 
        opacity={0.8} 
        roughness={0.1}
      />
    </mesh>
  );
}

export function Table3CompleteGraphs3D({ graph, activeComponentIds = [] }) {
  const currentGraph = graph || COMPLETE_GRAPHS_MODULAR_DATA[0];
  const n = currentGraph?.n || 4;
  const radius = 1.42;

  // Active Connection Edge List
  const connectedEdgesList = useMemo(() => {
    if (!currentGraph) return [];
    const list = [];
    const allGraphEdges = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        allGraphEdges.push({ id: `${i}-${j}`, u: i, v: j });
      }
    }
    allGraphEdges.forEach(e => {
      const isDirect = activeComponentIds?.includes(e.id);
      const isViaComponent = currentGraph.shapeComponents?.some(comp =>
        activeComponentIds?.includes(comp.id) && comp.edges?.some(ce => (ce.u === e.u && ce.v === e.v) || (ce.u === e.v && ce.v === e.u))
      );
      if (isDirect || isViaComponent) {
        list.push(e);
      }
    });
    return list;
  }, [currentGraph, activeComponentIds, n]);

  // Single continuous flight path sequence covering all active edges
  const flightPathSequence = useMemo(() => {
    if (connectedEdgesList.length === 0) return [];
    
    // Build adjacency list for active edges
    const adj = {};
    for (let i = 0; i < n; i++) adj[i] = [];
    connectedEdgesList.forEach(e => {
      adj[e.u].push(e.v);
      adj[e.v].push(e.u);
    });

    const sequence = [];
    let current = connectedEdgesList[0].u;
    sequence.push(current);
    
    let visitedEdges = new Set();
    let steps = 0;
    
    // Greedy Eulerian-like path generation
    while (visitedEdges.size < connectedEdgesList.length && steps < 50) {
      const neighbors = adj[current] || [];
      if (neighbors.length === 0) break;
      
      let next = -1;
      // Prefer unvisited edges
      for (let neighbor of neighbors) {
        const edgeId1 = `${current}-${neighbor}`;
        const edgeId2 = `${neighbor}-${current}`;
        if (!visitedEdges.has(edgeId1) && !visitedEdges.has(edgeId2)) {
          next = neighbor;
          visitedEdges.add(edgeId1);
          visitedEdges.add(edgeId2);
          break;
        }
      }
      
      // If all neighbor edges are visited, randomly traverse a connected neighbor
      if (next === -1) {
        next = neighbors[Math.floor(Math.random() * neighbors.length)];
      }
      
      sequence.push(next);
      current = next;
      steps++;
    }
    
    // Ensure the path loops seamlessly back to the start!
    if (sequence[sequence.length - 1] !== sequence[0]) {
      sequence.push(sequence[0]);
    }
    
    return sequence;
  }, [connectedEdgesList, n]);

  // Positions of Hub Vertices in an exact Regular Polygon (Start Angle 0 for horizontal alignment!)
  const hubNodes = useMemo(() => {
    const nodes = [];
    const startAngle = 0; // Starts precisely on the X-axis so n=2 is perfectly straight horizontally!

    for (let i = 0; i < n; i++) {
      const angle = startAngle + (i * 2 * Math.PI) / n;
      const hub = NETWORK_HUBS_DATA[i % NETWORK_HUBS_DATA.length];
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      nodes.push({
        ...hub,
        angle,
        x,
        y: 0.025,
        z
      });
    }
    return nodes;
  }, [n, radius]);

  // All Potential Edge Pairs for Background Blueprint Guides
  const allPotentialEdges = useMemo(() => {
    const edges = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        edges.push({ id: `${i}-${j}`, u: i, v: j });
      }
    }
    return edges;
  }, [n]);

  return (
    <group position={[0, -0.12, 0]} rotation={[0.42, 0, 0]}>
      {/* Premium Sci-Fi Hologram Studio Lighting */}
      <ambientLight intensity={1.5} color="#cffafe" />
      <directionalLight position={[5, 10, 4]} intensity={2.5} color="#0f172a" castShadow />
      <pointLight position={[0, 3, 0]} intensity={3.0} color="#0ea5e9" distance={8} />
      <pointLight position={[0, -2, 0]} intensity={1.5} color="#3b82f6" distance={6} />

      {/* ================= 1. HOLOGRAPHIC RADAR DISC BASE ================= */}
      <group position={[0, 0, 0]}>
        {/* Glowing Frosted Glass Disc */}
        <mesh receiveShadow castShadow position={[0, -0.04, 0]}>
          <cylinderGeometry args={[2.0, 2.0, 0.04, 64]} />
          <meshPhysicalMaterial
            color="#082f49" 
            emissive="#0c4a6e"
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.2}
            transmission={0.8}
            ior={1.5}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Inner Cyan Holographic Grid Lines */}
        <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.99, radius * 1.01, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.31, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
        
        {/* Outer Glowing Neon Rim */}
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.98, 2.02, 64]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* ================= 2. BACKGROUND INACTIVE FLIGHT ARCS (FAINT GHOST LINES) ================= */}
      {allPotentialEdges.map((edge) => {
        const isConnected = connectedEdgesList.some(ce => ce.id === edge.id);
        if (isConnected) return null;

        const from = hubNodes[edge.u];
        const to = hubNodes[edge.v];
        if (!from || !to) return null;

        return <FlightArc key={`guide-${edge.id}`} from={from} to={to} color="#f8fafc" />;
      })}

      {/* ================= 3. ACTIVE GLOWING FLIGHT ARCS & REALISTIC AIRLINERS ================= */}
      {connectedEdgesList.map((edge, idx) => {
        const from = hubNodes[edge.u];
        const to = hubNodes[edge.v];
        if (!from || !to) return null;

        const isPerimeter = (Math.abs(edge.u - edge.v) === 1) || (Math.min(edge.u, edge.v) === 0 && Math.max(edge.u, edge.v) === n - 1);
        const edgeColor = isPerimeter ? '#06b6d4' : '#f59e0b';

        return (
          <group key={`edge-${edge.id || idx}`}>
            {/* Spectacular Sweeping Neon Flight Arc */}
            <FlightArc from={from} to={to} color={edgeColor} />
          </group>
        );
      })}

      {/* SINGLE CONTINUOUS AIRLINER TRACING ALL ACTIVE FLIGHTS */}
      {flightPathSequence.length > 1 && (
        <RealisticAirliner sequence={flightPathSequence} hubs={hubNodes} speed={0.4} />
      )}

      {/* ================= 4. CRYSTALLINE AIRPORT HUBS ================= */}
      {hubNodes.map((hub) => {
        const count = connectedEdgesList.filter(e => e.u === hub.id || e.v === hub.id).length;
        const isFully = count === (n - 1);
        const indicatorColor = isFully ? '#10b981' : hub.color;

        return (
          <group key={`hub-${hub.id}`} position={[hub.x, 0, hub.z]}>
            {/* Glowing Crystal Obelisk Base */}
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.1, 0.08, 6]} />
              <meshPhysicalMaterial 
                color={indicatorColor} 
                emissive={indicatorColor}
                emissiveIntensity={0.5}
                roughness={0.1} 
                transmission={0.9} 
                ior={1.6} 
              />
            </mesh>

            {/* Highly Emissive Core Beacon */}
            <mesh position={[0, 0.09, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial 
                color={indicatorColor} 
                emissive={indicatorColor} 
                emissiveIntensity={4.0} 
              />
            </mesh>

            {/* Floating Label (Placed high to avoid 3D overlap) */}
            <Html position={[0, 0.28, 0]} center pointerEvents="none">
              <div
                style={{
                  background: isFully
                    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                    : 'rgba(15, 23, 42, 0.94)',
                  color: '#ffffff',
                  border: `1.5px solid ${isFully ? '#6ee7b7' : hub.light}`,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '900',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{hub.code}</span>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    padding: '1px 5px',
                    borderRadius: '6px',
                    fontSize: '0.65rem'
                  }}
                >
                  {count}/{n - 1}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// -----------------------------------------------------------------------
// 4. TABLE 3 MASTER 3D VIEWER: PHOTOREALISTIC HANDCRAFTED HERITAGE TILES WORKBENCH (STACKED SQUARES)
// -----------------------------------------------------------------------

const HERITAGE_CERAMIC_PALETTES = [
  { name: 'Layer 1 (Crimson)', base: '#991b1b', inlay: '#fca5a5', accent: '#fef2f2', rim: '#7f1d1d' },
  { name: 'Layer 2 (Emerald)', base: '#065f46', inlay: '#6ee7b7', accent: '#ecfdf5', rim: '#064e3b' },
  { name: 'Layer 3 (Saffron)', base: '#d97706', inlay: '#fde68a', accent: '#fffbeb', rim: '#b45309' },
  { name: 'Layer 4 (Cobalt)', base: '#1e40af', inlay: '#93c5fd', accent: '#eff6ff', rim: '#1e3a8a' },
  { name: 'Layer 5 (Amethyst)', base: '#6b21a8', inlay: '#d8b4fe', accent: '#faf5ff', rim: '#581c87' }
];

// Single Photorealistic Handcrafted Ceramic Floor Tile (Zero Floating, Zero Z-Fighting, Authentic Physical Chamfers)
function PhotorealisticCeramicTile({ x, z, size = 0.48, layer = 0, isPlaced = true, isCorner = false }) {
  const palette = HERITAGE_CERAMIC_PALETTES[layer % HERITAGE_CERAMIC_PALETTES.length];
  const tileThickness = 0.036;

  if (!isPlaced) {
    return (
      <group position={[x, 0.003, z]}>
        {/* Recessed Blueprint Mortar Guide on Slate Bed */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size * 0.94, size * 0.94]} />
          <meshBasicMaterial color="#e2e8f0" wireframe transparent opacity={0.35} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[x, 0.003, z]}>
      {/* 1. Terracotta Clay Bisque Base (Zero Sinking, Exact Y = 0.003 + thickness/2) */}
      <mesh position={[0, tileThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[size * 0.94, tileThickness, size * 0.94]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.88} metalness={0.05} />
      </mesh>

      {/* 2. Vitrified Mineral Enamel Glaze Surface (Chamfered Top) */}
      <mesh position={[0, tileThickness + 0.0015, 0]} receiveShadow>
        <boxGeometry args={[size * 0.91, 0.003, size * 0.91]} />
        <meshPhysicalMaterial
          color={palette.base}
          roughness={0.12}
          metalness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          reflectivity={0.9}
        />
      </mesh>

      {/* 3. Handcrafted Traditional Geometric Mandala Inlay */}
      <group position={[0, tileThickness + 0.004, 0]}>
        {/* Outer Circular Inlay Border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 0.22, size * 0.31, 24]} />
          <meshStandardMaterial color={palette.inlay} roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Center Floral Medallion */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[size * 0.14, 16]} />
          <meshStandardMaterial color={palette.accent} roughness={0.18} />
        </mesh>

        {/* Center Brass Pip Core */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[size * 0.045, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* 4 Corner Traditional Symmetry Florets */}
        {[-size * 0.27, size * 0.27].map((px, pxIdx) =>
          [-size * 0.27, size * 0.27].map((pz, pzIdx) => (
            <mesh key={`floret-${pxIdx}-${pzIdx}`} position={[px, 0.001, pz]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[size * 0.055, 12]} />
              <meshStandardMaterial color={palette.inlay} roughness={0.25} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

export function Table3StackedSquares3D({ rows = 3, placedLayers = 3 }) {
  const effectiveRows = Math.min(5, Math.max(1, rows || 3));
  const effectivePlaced = Math.min(effectiveRows, Math.max(1, placedLayers || 3));
  const tileSize = 0.48;
  const spacing = 0.51; // 3cm realistic dark mortar grout lines
  const offset = ((effectiveRows - 1) * spacing) / 2;
  const tableWidth = Math.max(3.4, (effectiveRows + 1.4) * spacing);

  return (
    <group position={[0, -0.08, 0]} rotation={[0.48, -0.25, 0]}>
      {/* Warm Natural Studio Lighting */}
      <ambientLight intensity={1.5} color="#1e293b" />
      <directionalLight position={[5, 8, 4]} intensity={2.6} color="#fffbeb" castShadow />
      <directionalLight position={[-4, 5, -3]} intensity={1.2} color="#334155" />
      <pointLight position={[0, 3, 0]} intensity={1.6} color="#fef08a" distance={7} />

      {/* ================= 1. NATURAL TEAKWOOD ARTISAN WORKBENCH ================= */}
      <group position={[0, 0, 0]}>
        {/* Solid Wooden Tabletop Plate (Surface exactly at Y = 0.0) */}
        <mesh position={[0, -0.06, 0]} receiveShadow castShadow>
          <boxGeometry args={[tableWidth, 0.12, tableWidth]} />
          <meshPhysicalMaterial
            color="#291809"
            roughness={0.42}
            metalness={0.08}
            clearcoat={0.35}
            clearcoatRoughness={0.25}
          />
        </mesh>

        {/* Polished Brass Framing Inlay around Working Bed */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[effectiveRows * spacing + 0.14, effectiveRows * spacing + 0.14]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Dark Terracotta Mortar Bed (Recessed at Y = 0.002) */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[effectiveRows * spacing + 0.05, effectiveRows * spacing + 0.05]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>

        {/* Traditional Brass Artisan Ruler on Table Edge */}
        <group position={[-tableWidth * 0.42, 0.008, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.015, tableWidth * 0.75]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* ================= 2. PHOTOREALISTIC HANDCRAFTED CERAMIC TILES MATRIX ================= */}
      {Array.from({ length: effectiveRows }).map((_, r) =>
        Array.from({ length: effectiveRows }).map((_, c) => {
          // L-shaped concentric gnomon layer (0-indexed)
          const layer = Math.max(r, c);
          const isPlaced = layer < effectivePlaced;
          const x = c * spacing - offset;
          const z = r * spacing - offset;

          return (
            <PhotorealisticCeramicTile
              key={`tile-${r}-${c}`}
              x={x}
              z={z}
              size={tileSize}
              layer={layer}
              isPlaced={isPlaced}
              isCorner={r === c}
            />
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

export function PhotorealisticStackedTrianglesBridge3D({ rows = 3 }) {
  const currentRows = Math.min(6, Math.max(1, rows || 3));
  
  // Base geometry for a single triangle (pointing UP)
  const side = 0.55;
  const h = side * (Math.sqrt(3) / 2);
  const triangleShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, h * (2 / 3)); // Top Apex
    shape.lineTo(side / 2, -h * (1 / 3)); // Bottom Right
    shape.lineTo(-side / 2, -h * (1 / 3)); // Bottom Left
    shape.closePath();
    return shape;
  }, [side, h]);
  
  const extrudeSettings = useMemo(() => ({
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015
  }), []);

  // Distinct vibrant colors for each tier corresponding to consecutive odd numbers
  const tierColors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  // Center vertically on the screen
  const totalHeight = currentRows * h;
  const startY = totalHeight / 2 - h / 2; 
  
  return (
    <group position={[0, -0.1, 0]}>
      {/* Bright Studio Presentation Lighting */}
      <ambientLight intensity={1.5} color="#0f172a" />
      <directionalLight position={[5, 8, 6]} intensity={2.8} castShadow />
      <spotLight position={[-5, 5, 4]} intensity={2.0} color="#475569" penumbra={1} />
      
      {/* Sleek Floating Pedestal Base */}
      <mesh position={[0, -totalHeight / 2 - 0.15, -0.1]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.15, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Inner glowing ring on pedestal */}
      <mesh position={[0, -totalHeight / 2 - 0.07, -0.1]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[2.4, 2.45, 64]} />
        <meshBasicMaterial color="#0d9488" />
      </mesh>
      
      {/* The Stacked Triangle Pyramid */}
      {Array.from({ length: currentRows }).map((_, r) => {
        const countInRow = 2 * r + 1; // 1, 3, 5, 7, 9, 11 (Odd sequence)
        const tierY = startY - r * h;
        const color = tierColors[r % tierColors.length];
        
        return (
          <group key={`tier-${r}`}>
            {/* Left-side Tier Label (+odd number) mapping back to sequence on right */}
            <Text 
              position={[-2.2, tierY, 0.1]} 
              fontSize={0.26} 
              color={color} 
              fontWeight="900" 
              anchorX="right"
              anchorY="middle"
            >
              + {countInRow}
            </Text>
            
            {Array.from({ length: countInRow }).map((_, c) => {
              const isInverted = c % 2 === 1;
              const x = -(r * side) / 2 + (c * side) / 2;
              const rotZ = isInverted ? Math.PI : 0;
              
              // Scale down slightly to create a beautiful clean gap without any geometric overlap
              const gapScale = 0.92; 
              
              return (
                <group key={`t-${r}-${c}`} position={[x, tierY, 0]}>
                  <mesh castShadow receiveShadow rotation={[0, 0, rotZ]} scale={[gapScale, gapScale, gapScale]}>
                    <extrudeGeometry args={[triangleShape, extrudeSettings]} />
                    <meshPhysicalMaterial 
                      color={color} 
                      roughness={0.15} 
                      metalness={0.2}
                      clearcoat={1.0}
                      clearcoatRoughness={0.1}
                      emissive={color}
                      emissiveIntensity={0.25}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}
      
      {/* Right-side Floating Total Summary Text */}
      <group position={[2.2, 0, 0.1]}>
        <Text 
          position={[0, 0.2, 0]} 
          fontSize={0.22} 
          color="#64748b" 
          fontWeight="800" 
          anchorX="left"
          anchorY="middle"
        >
          Total Triangles:
        </Text>
        <Text 
          position={[0, -0.15, 0]} 
          fontSize={0.5} 
          color="#0d9488" 
          fontWeight="900" 
          anchorX="left"
          anchorY="middle"
        >
          {currentRows}² = {currentRows * currentRows}
        </Text>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------
// 5. TABLE 3 MASTER 3D VIEWER: PHOTOREALISTIC BILLIARDS 15-BALL TRIANGLE RACK
// -----------------------------------------------------------------------

const BILLIARDS_BALLS_DATA = [
  // Row 1 (Apex): 1 ball
  { num: 1, type: 'solid', color: '#eab308', name: '1 Solid Yellow' },
  // Row 2: 2 balls
  { num: 2, type: 'solid', color: '#2563eb', name: '2 Solid Blue' },
  { num: 3, type: 'solid', color: '#dc2626', name: '3 Solid Red' },
  // Row 3: 3 balls (Standard 8-Ball in center!)
  { num: 4, type: 'solid', color: '#7c3aed', name: '4 Solid Purple' },
  { num: 8, type: 'solid', color: '#0f172a', name: '8 Solid Black' },
  { num: 5, type: 'solid', color: '#ea580c', name: '5 Solid Orange' },
  // Row 4: 4 balls
  { num: 6, type: 'solid', color: '#16a34a', name: '6 Solid Green' },
  { num: 7, type: 'solid', color: '#881337', name: '7 Solid Maroon' },
  { num: 9, type: 'stripe', color: '#eab308', name: '9 Stripe Yellow' },
  { num: 10, type: 'stripe', color: '#2563eb', name: '10 Stripe Blue' },
  // Row 5: 5 balls
  { num: 11, type: 'stripe', color: '#dc2626', name: '11 Stripe Red' },
  { num: 12, type: 'stripe', color: '#7c3aed', name: '12 Stripe Purple' },
  { num: 13, type: 'stripe', color: '#ea580c', name: '13 Stripe Orange' },
  { num: 14, type: 'stripe', color: '#16a34a', name: '14 Stripe Green' },
  { num: 15, type: 'stripe', color: '#881337', name: '15 Stripe Maroon' }
];

// Single Photorealistic Phenolic Resin Billiard Ball (100% Glitch-Free & Zero Z-Fighting)
function PhotorealisticBilliardBall({ radius = 0.22, ballInfo, isPlaced = true }) {
  if (!isPlaced) {
    return (
      <mesh position={[0, radius, 0]}>
        <sphereGeometry args={[radius * 0.92, 16, 16]} />
        <meshStandardMaterial color="#64748b" transparent opacity={0.25} wireframe />
      </mesh>
    );
  }

  const isStripe = ballInfo.type === 'stripe';

  return (
    <group position={[0, radius, 0]}>
      {/* 1. Main High-Gloss Phenolic Resin Ball */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial
          color={ballInfo.color}
          roughness={0.12}
          metalness={0.06}
          clearcoat={0.9}
          clearcoatRoughness={0.05}
          reflectivity={0.9}
        />
      </mesh>

      {/* 2. Stripe White Caps (for stripe balls 9-15) */}
      {isStripe && (
        <>
          <mesh position={[0, radius * 0.72, 0]}>
            <sphereGeometry args={[radius * 0.7, 24, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.15} />
          </mesh>
          <mesh position={[0, -radius * 0.72, 0]}>
            <sphereGeometry args={[radius * 0.7, 24, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.15} />
          </mesh>
        </>
      )}



      {/* 4. Crisp High-Contrast Number Label */}
      <Html position={[0, radius * 0.46, radius * 0.85]} center pointerEvents="none">
        <div
          style={{
            color: '#0f172a',
            fontSize: '0.62rem',
            fontWeight: '900',
            fontFamily: 'Inter, sans-serif',
            userSelect: 'none',
            lineHeight: 1,
            textShadow: '0 0 2px rgba(255,255,255,0.8)'
          }}
        >
          {ballInfo.num}
        </div>
      </Html>
    </group>
  );
}

export function Table3StackedTriangles3D({ rows = 3, placedRows = 3 }) {
  const ballRadius = 0.22;
  const ballDiameter = ballRadius * 2.05; // Clean tangent spacing without overlap
  const rowHeight = ballDiameter * 0.866025; // Equilateral triangle sqrt(3)/2

  // Calculate clean coordinates for all 15 balls
  const balls = useMemo(() => {
    const list = [];
    let idx = 0;

    const totalDepth = 4 * rowHeight;
    const apexZ = -totalDepth * 0.42;

    for (let r = 0; r < rows; r++) {
      const countInRow = r + 1;
      const z = apexZ + r * rowHeight;
      const rowStartX = -((countInRow - 1) * ballDiameter) / 2;

      for (let c = 0; c < countInRow; c++) {
        const x = rowStartX + c * ballDiameter;
        const isPlaced = r < placedRows;
        const ballInfo = BILLIARDS_BALLS_DATA[idx % BILLIARDS_BALLS_DATA.length];
        list.push({ r, c, x, z, isPlaced, ballInfo });
        idx++;
      }
    }
    return list;
  }, [rows, placedRows, ballDiameter, rowHeight]);

  return (
    <group position={[0, -0.15, 0]} rotation={[0.3, 0, 0]}>
      {/* Natural Ambient Room Lighting + Directional Window Daylight */}
      <ambientLight intensity={0.7} color="#0f172a" />
      <directionalLight position={[6, 9, 5]} intensity={1.8} color="#0f172a" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-far={20} />
      <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#475569" />
      <pointLight position={[0, 4, 1]} intensity={0.6} color="#fef08a" distance={10} />

      {/* 1. TOURNAMENT GREEN BAZE FELT TABLE BED (Exact Surface at Y = 0) */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.12, 3.6]} />
        <meshStandardMaterial
          color="#14532d" /* Deep, natural matte cloth green */
          roughness={0.98}
          metalness={0.0}
        />
      </mesh>

      {/* 2. MAHOGANY HARDWOOD RAILS & CUSHIONS */}
      {/* Top Rail */}
      <mesh position={[0, 0.03, -1.86]} castShadow receiveShadow>
        <boxGeometry args={[4.32, 0.1, 0.16]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Bottom Rail */}
      <mesh position={[0, 0.03, 1.86]} castShadow receiveShadow>
        <boxGeometry args={[4.32, 0.1, 0.16]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Left Rail */}
      <mesh position={[-2.16, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.1, 3.88]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Right Rail */}
      <mesh position={[2.16, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.1, 3.88]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* 3. BRASS CORNER POCKET CASTINGS */}
      {[
        [-2.1, -1.8],
        [2.1, -1.8],
        [-2.1, 1.8],
        [2.1, 1.8]
      ].map(([px, pz], pIdx) => (
        <group key={`pocket-${pIdx}`} position={[px, 0.03, pz]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.11, 20]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.056, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 20]} />
            <meshStandardMaterial color="#09090b" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 4. SOLID OAK TRIANGULAR RACK FRAME (Resting on Felt) */}
      <group position={[0, 0.06, 0.06]}>
        {/* Left Rack Bar */}
        <mesh position={[-0.64, 0, 0.02]} rotation={[0, 0.5236, 0]} castShadow>
          <boxGeometry args={[0.05, 0.12, 2.45]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} metalness={0.02} />
        </mesh>
        {/* Right Rack Bar */}
        <mesh position={[0.64, 0, 0.02]} rotation={[0, -0.5236, 0]} castShadow>
          <boxGeometry args={[0.05, 0.12, 2.45]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} metalness={0.02} />
        </mesh>
        {/* Base Rack Bar */}
        <mesh position={[0, 0, 1.08]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.05, 0.12, 2.45]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} metalness={0.02} />
        </mesh>
        {/* Brass Corner Brackets */}
        <mesh position={[0, 0, -1.02]}>
          <cylinderGeometry args={[0.05, 0.05, 0.125, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 5. ASH WOOD CUE STICK (Resting on Table) */}
      <group position={[1.45, 0.05, 0.2]} rotation={[0, 0.25, 0]}>
        {/* Main Shaft */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.035, 3.2, 20]} />
          <meshStandardMaterial color="#fde68a" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* White Ferrule & Blue Chalk Tip */}
        <mesh position={[0, 0, -1.62]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -1.65]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.019, 0.019, 0.02, 20]} />
          <meshStandardMaterial color="#0284c7" roughness={0.9} />
        </mesh>
        {/* Grip Wrap */}
        <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.033, 0.034, 0.7, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>
      </group>

      {/* 6. 15 PHOTOREALISTIC BILLIARD BALLS (Exact Tangent on Felt, Zero Overlap) */}
      {balls.map((b, idx) => (
        <group key={`ball-${idx}`} position={[b.x, 0, b.z]}>
          <PhotorealisticBilliardBall
            radius={ballRadius}
            ballInfo={b.ballInfo}
            isPlaced={b.isPlaced}
          />
        </group>
      ))}
    </group>
  );
}

// -----------------------------------------------------------------------
// 6. TABLE 3 MASTER 3D VIEWER: KOCH SNOWFLAKE RANGOLI MANDALA
// -----------------------------------------------------------------------
export function Table3KochSnowflake3D({ depth }) {
  const clampedDepth = Math.min(depth, 4);
  
  const segmentsData = useMemo(() => {
    const r = 2.0; 
    const v1 = [r * Math.cos(-Math.PI / 2), r * Math.sin(-Math.PI / 2)];
    const v2 = [r * Math.cos(Math.PI / 6), r * Math.sin(Math.PI / 6)];
    const v3 = [r * Math.cos((5 * Math.PI) / 6), r * Math.sin((5 * Math.PI) / 6)];

    const edge1 = generateKoch2D(v1, v2, clampedDepth);
    const edge2 = generateKoch2D(v2, v3, clampedDepth);
    const edge3 = generateKoch2D(v3, v1, clampedDepth);
    
    // Combine all points (closed loop)
    const allPts = [...edge1.slice(0, -1), ...edge2.slice(0, -1), ...edge3];
    
    // Convert to distinct segment objects
    const segs = [];
    for(let i = 0; i < allPts.length - 1; i++) {
       const p1 = allPts[i];
       const p2 = allPts[i+1];
       const dx = p2[0] - p1[0];
       const dy = p2[1] - p1[1];
       const length = Math.sqrt(dx*dx + dy*dy);
       const angle = Math.atan2(dy, dx);
       const midX = p1[0] + dx/2;
       const midY = p1[1] + dy/2;
       segs.push({ length, angle, midX, midY });
    }
    return segs;
  }, [clampedDepth]);

  const totalSegments = 3 * Math.pow(4, clampedDepth);

  // Math to create perfect glass links and golden joints without overlap
  const segLength = segmentsData[0]?.length || 1;
  const thickness = Math.max(0.012, segLength * 0.05); 
  const renderLen = Math.max(0.01, segLength - (thickness * 2.2));
  
  const capsuleGeo = useMemo(() => new THREE.CapsuleGeometry(thickness, renderLen, 4, 12), [thickness, renderLen]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* The Straight 3D Model Group */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* High-Key Premium Studio Lighting */}
      <ambientLight intensity={2.0} color="#0f172a" />
      <directionalLight position={[4, 10, 5]} intensity={2.5} color="#0f172a" castShadow />
      <directionalLight position={[-4, 8, -5]} intensity={1.5} color="#fef3c7" />
      <pointLight position={[0, 0, 2]} intensity={2.0} color="#38bdf8" distance={6} />
      
      {/* Elegant Deep Teal / Slate Pedestal for Strong Contrast */}
      <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3.8, 4.0, 0.2, 64]} />
        <meshPhysicalMaterial 
          color="#134e4a" 
          roughness={0.2} 
          metalness={0.3} 
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>
      
      {/* Polished Gold Trim */}
      <mesh position={[0, 0, -0.1]} receiveShadow>
        <torusGeometry args={[3.8, 0.04, 16, 64]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Artisan Glass & Gold Koch Snowflake */}
      {segmentsData.map((seg, i) => {
        return (
          <group key={`seg-${i}`} position={[seg.midX, seg.midY, 0.15]} rotation={[0, 0, seg.angle - Math.PI/2]}>
            {/* Cyan Crystal Glass Segment */}
            <mesh castShadow receiveShadow geometry={capsuleGeo}>
              <meshPhysicalMaterial 
                color="#cffafe"
                emissive="#06b6d4"
                emissiveIntensity={0.3}
                roughness={0.1}
                metalness={0.1}
                transmission={0.9}
                thickness={0.2}
                ior={1.5}
                clearcoat={1.0}
              />
            </mesh>
            {/* Golden Spherical Joint at the end (connects flawlessly to the next segment) */}
            <mesh position={[0, segLength / 2, 0]} castShadow>
               <sphereGeometry args={[thickness * 1.35, 16, 16]} />
               <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        );
      })}
      
      </group>
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
    { id: 2, name: 'Complete Graphs', icon: '✈️', count: 'Direct City Flights' },
    { id: 3, name: 'Stacked Squares', icon: '🔲', count: '1² to 5²' },
    { id: 4, name: 'Stacked Triangles', icon: '🎱', count: '1, 3, 6, 10, 15 Balls' },
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

      {/* ACTIVITY 2: COMPLETE GRAPHS — DIRECT NON-STOP CITY FLIGHT NETWORK */}
      {activeActivity === 2 && (() => {
        const currentGraph = COMPLETE_GRAPHS_MODULAR_DATA[graphIdx || 0] || COMPLETE_GRAPHS_MODULAR_DATA[0];
        
        // Generate ordered list of all pairwise flight corridors for current n
        const allPairwiseEdges = [];
        for (let i = 0; i < currentGraph.n; i++) {
          for (let j = i + 1; j < currentGraph.n; j++) {
            allPairwiseEdges.push({
              id: `${i}-${j}`,
              u: i,
              v: j,
              from: NETWORK_HUBS_DATA[i]?.name || `Node ${i + 1}`,
              to: NETWORK_HUBS_DATA[j]?.name || `Node ${j + 1}`
            });
          }
        }

        // Active route count: supports both granular edge IDs and component IDs
        const activeRouteCount = allPairwiseEdges.filter(e => 
          activeComponentIds.includes(e.id) || 
          currentGraph.shapeComponents.some(comp => activeComponentIds.includes(comp.id) && comp.edges?.some(ce => (ce.u === e.u && ce.v === e.v) || (ce.u === e.v && ce.v === e.u)))
        ).length;

        const isAllActive = activeRouteCount >= currentGraph.total;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', justifyContent: 'space-evenly' }}>
            {/* Header & Concept Intro */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                  {'Complete Graphs (Kn) — Direct City Flight Routes'}
                </h4>
                <span style={{ fontSize: '0.72rem', background: '#ccfbf1', color: '#0f766e', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', border: '1px solid #99f6e4' }}>
                  {'Triangular Series: T(n-1)'}
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, textAlign: 'justify' }}>
                If an airline connects <strong>{currentGraph.n} major city hubs</strong> with direct non-stop flights in both directions without layovers, how many flight routes must be scheduled? 
                The total number of routes forms a <strong>Triangular Number Sequence</strong>. To find the routes for <em>n</em> cities, we sum the first <em>(n-1)</em> integers. For example, adding a 6th city hub requires connecting it to the 5 existing hubs, adding exactly 5 new routes. The total can be computed quickly using the formula <strong>n×(n-1)/2</strong>.
              </p>
            </div>

            {/* City Hubs Selector Buttons (2 to 6 Cities) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {COMPLETE_GRAPHS_MODULAR_DATA.map((g, idx) => {
                const isSelected = graphIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setGraphIdx(idx);
                      // By default, connect all for instant visual clarity
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
                    <span>{`${g.n} Cities (K${g.n})`}</span>
                  </button>
                );
              })}
            </div>

            {/* Granular Step-by-Step Flight Route Controls */}
            <div style={{ background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#1e293b' }}>
                Active Flight Corridors: <span style={{ color: '#0284c7', fontWeight: '900' }}>{activeRouteCount} of {currentGraph.total}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => {
                    if (activeComponentIds.length > 0) {
                      setActiveComponentIds(prev => prev.slice(0, -1));
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
                  - Route
                </button>
                <button
                  onClick={() => {
                    const missing = allPairwiseEdges.find(e => !activeComponentIds.includes(e.id));
                    if (missing) {
                      setActiveComponentIds(prev => [...prev, missing.id]);
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
                  + Route
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
                  Connect All Routes ✈️
                </button>
                <button
                  onClick={() => setActiveComponentIds([])}
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

            {/* Step-by-Step Airway Breakdown & Formula Card */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '0.65rem 0.85rem', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {/* Step Breakdown Sequence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ✈️ How Direct Routes Add Up (Hub by Hub):
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
                  <div style={{ fontSize: '0.62rem', color: '#1e40af', fontWeight: '800' }}>TOTAL CITY HUBS (n)</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#2563eb' }}>{currentGraph.n} Cities</div>
                </div>
                <div style={{ background: '#fef3c7', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#92400e', fontWeight: '800' }}>DIRECT ROUTES FORMULA</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#d97706' }}>{currentGraph.n}×{currentGraph.n - 1} / 2 = {currentGraph.total}</div>
                </div>
                <div style={{ background: '#fdf2f8', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#9d174d', fontWeight: '800' }}>TRIANGULAR NUMBER</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#db2777' }}>{currentGraph.triangularNumber}</div>
                </div>
              </div>

              {/* Educational Rationale Insight */}
              <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: 1.45, background: '#f8fafc', padding: '0.45rem 0.65rem', borderRadius: '8px', textAlign: 'justify' }}>
                💡 <strong>Why divide by 2?</strong> Each non-stop flight corridor connects <strong>2 cities</strong> simultaneously (e.g. Delhi ↔ Mumbai is a single bidirectional route). Dividing by 2 prevents scheduling the exact same route twice!
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

      {/* ACTIVITY 4: STACKED TRIANGLES (PHOTOREALISTIC BILLIARDS 15-BALL TRIANGLE RACK) */}
      {activeActivity === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem',  }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                {'Billiards 15-Ball Triangle Rack ($1, 3, 6, 10, 15$)'}
              </h4>
              <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', border: '1px solid #a7f3d0' }}>
                {'Triangular Numbers: T(n)'}
              </span>
            </div>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
              In professional pool & billiards, 15 balls are packed inside a wooden triangle frame on green cloth. Each row adds consecutive numbers ($1 + 2 + 3 + 4 + 5 = 15$).
            </p>
          </div>

          {/* Row Selector Buttons (1 to 5 Rows) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {[1, 2, 3, 4, 5].map((t) => {
              const isSelected = triangleRows === t;
              const ballCount = (t * (t + 1)) / 2;
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
                  <span>🎱</span>
                  <span>{t} Rows ({ballCount} Balls)</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Row Placement Controls */}
          <div style={{ background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#1e293b' }}>
              Rows Placed in Rack: <span style={{ color: '#0d9488', fontWeight: '900' }}>{placedTriLayers} of {triangleRows}</span>
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
                Rack All 15 Balls 🎱
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
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#2563eb' }}>{triangleRows} Rows</div>
              </div>
              <div style={{ background: '#fef3c7', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#92400e', fontWeight: '800' }}>GAUSS FORMULA</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#d97706' }}>{triangleRows}×{triangleRows + 1} / 2</div>
              </div>
              <div style={{ background: '#f0fdfa', padding: '0.35rem 0.4rem', borderRadius: '8px', border: '1px solid #ccfbf1', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#0f766e', fontWeight: '800' }}>TOTAL BALLS</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0d9488' }}>{(triangleRows * (triangleRows + 1)) / 2} Balls</div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35, background: '#f8fafc', padding: '0.35rem 0.6rem', borderRadius: '8px' }}>
              {'💡 Geometric Insight: An equilateral triangular rack with n rows always holds exactly T(n) = n(n+1)/2 balls.'}
            </div>
          </div>
        </div>
      )}

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
