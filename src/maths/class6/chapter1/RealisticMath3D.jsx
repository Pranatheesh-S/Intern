import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text, ContactShadows, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';
import { CALENDAR_MAGIC_DATASET, getMonthCalendarGrid, getValidCentersForMonth, GROCERY_MARKET_DATASET } from './data';


// =======================================================================
// 1. ULTRA-PHOTOREALISTIC BOTANICAL FLOWERS (FIBONACCI / VIRAHĀNKA SPIRAL)
// =======================================================================
export function BotanicalFlower3D({ flowerKey = 'lily' }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    }
  });

  const flowerConfig = useMemo(() => {
    switch (flowerKey) {
      case 'lily':
        return {
          petals: 3,
          layers: 1,
          color: '#ffffff',
          throatColor: '#86efac',
          stamenColor: '#ea580c',
          stamenCount: 6,
          petalLength: 1.65,
          petalWidth: 0.52,
          curveFactor: 0.42,
          seedCount: 34,
          seedRadius: 0.22,
          name: 'White Madonna Lily (3-fold symmetry)',
          family: 'Liliaceae'
        };
      case 'buttercup':
        return {
          petals: 5,
          layers: 1,
          color: '#facc15',
          throatColor: '#65a30d',
          stamenColor: '#eab308',
          stamenCount: 10,
          petalLength: 1.25,
          petalWidth: 0.72,
          curveFactor: 0.32,
          seedCount: 55,
          seedRadius: 0.3,
          name: 'Glossy Meadow Buttercup (5 Petals)',
          family: 'Ranunculaceae'
        };
      case 'delphinium':
        return {
          petals: 8,
          layers: 2,
          color: '#2563eb',
          throatColor: '#7dd3fc',
          stamenColor: '#ffffff',
          stamenCount: 12,
          petalLength: 1.35,
          petalWidth: 0.46,
          curveFactor: 0.28,
          seedCount: 89,
          seedRadius: 0.36,
          name: 'Royal Blue Delphinium (8 Petals)',
          family: 'Ranunculaceae'
        };
      case 'marigold':
      default:
        return {
          petals: 13,
          layers: 2,
          color: '#f97316',
          throatColor: '#9a3412',
          stamenColor: '#fef08a',
          stamenCount: 16,
          petalLength: 1.18,
          petalWidth: 0.3,
          curveFactor: 0.22,
          seedCount: 144, // 144 Fibonacci seeds
          seedRadius: 0.48,
          name: 'Sunburst Marigold / Daisy (13 Ray Florets)',
          family: 'Asteraceae'
        };
    }
  }, [flowerKey]);

  // Authentic Fibonacci Golden Spiral seed disk coordinates
  const seeds = useMemo(() => {
    const list = [];
    const goldenAngle = 137.507764 * (Math.PI / 180);
    const count = flowerConfig.seedCount;
    const maxR = flowerConfig.seedRadius;

    for (let i = 0; i < count; i++) {
      const r = maxR * Math.sqrt((i + 1) / count);
      const theta = i * goldenAngle;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = Math.max(0, 0.11 * (1 - (r / maxR) * (r / maxR)));
      list.push({ x, y, z, id: i });
    }
    return list;
  }, [flowerConfig]);

  // Curved 3D Petal Geometry using Organic Bezier Shape
  const petalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const len = flowerConfig.petalLength;
    const w = flowerConfig.petalWidth;

    shape.moveTo(0, 0);
    shape.bezierCurveTo(w * 0.55, len * 0.25, w, len * 0.65, 0, len);
    shape.bezierCurveTo(-w, len * 0.65, -w * 0.55, len * 0.25, 0, 0);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.035,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.018,
      bevelThickness: 0.015
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [flowerConfig]);

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Blossom Head */}
      <group position={[0, 0.35, 0]}>
        {/* Layered Organic Petals radiating symmetrically */}
        {Array.from({ length: flowerConfig.layers }).map((_, layerIdx) => {
          const count = flowerConfig.petals;
          const layerOffset = layerIdx * (Math.PI / count);
          const layerScale = 1 - layerIdx * 0.12;
          const tilt = flowerConfig.curveFactor + layerIdx * 0.14;

          return Array.from({ length: count }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / count + layerOffset;
            return (
              <group key={`l-${layerIdx}-p-${i}`} rotation={[0, 0, angle]}>
                <group
                  position={[0, 0.08, -layerIdx * 0.035]}
                  rotation={[-tilt, 0, 0]}
                  scale={[layerScale, layerScale, layerScale]}
                >
                  <mesh geometry={petalGeo} castShadow receiveShadow>
                    <meshPhysicalMaterial
                      color={flowerConfig.color}
                      roughness={0.2}
                      clearcoat={0.65}
                      clearcoatRoughness={0.15}
                      transmission={0.12}
                      ior={1.44}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                  {/* Subtle inner floral throat gradient core */}
                  <mesh position={[0, 0.28, 0.02]}>
                    <coneGeometry args={[flowerConfig.petalWidth * 0.35, 0.45, 8]} />
                    <meshStandardMaterial
                      color={flowerConfig.throatColor}
                      roughness={0.4}
                      transparent
                      opacity={0.75}
                    />
                  </mesh>
                </group>
              </group>
            );
          });
        })}

        {/* Central Fibonacci Golden Spiral Seed Disc (Virahānka Mathematics) */}
        <group position={[0, 0, 0.07]}>
          <mesh castShadow>
            <cylinderGeometry args={[flowerConfig.seedRadius * 1.05, flowerConfig.seedRadius * 0.95, 0.1, 32]} />
            <meshStandardMaterial color="#381a06" roughness={0.88} />
          </mesh>

          {/* Golden Spiral Seeds */}
          {seeds.map((s) => (
            <mesh key={`seed-${s.id}`} position={[s.x, s.y, s.z + 0.05]} castShadow>
              <sphereGeometry args={[0.024, 8, 8]} />
              <meshStandardMaterial
                color={s.id % 2 === 0 ? '#ca8a04' : '#a16207'}
                roughness={0.25}
                metalness={0.25}
              />
            </mesh>
          ))}

          {/* Natural Stamens with Anthers */}
          {Array.from({ length: flowerConfig.stamenCount }).map((_, i) => {
            const stamenAngle = (i * 2 * Math.PI) / flowerConfig.stamenCount;
            const sr = flowerConfig.seedRadius * 0.72;
            const sx = sr * Math.cos(stamenAngle);
            const sy = sr * Math.sin(stamenAngle);

            return (
              <group
                key={`stamen-${i}`}
                position={[sx, sy, 0.07]}
                rotation={[0.18 * Math.cos(stamenAngle), 0.18 * Math.sin(stamenAngle), stamenAngle]}
              >
                {/* Filament */}
                <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.007, 0.007, 0.26, 6]} />
                  <meshStandardMaterial color="#fef08a" roughness={0.3} />
                </mesh>
                {/* Pollen Anther */}
                <mesh position={[0, 0, 0.26]} rotation={[0, 0, Math.PI / 2]}>
                  <capsuleGeometry args={[0.02, 0.045, 4, 8]} />
                  <meshStandardMaterial color={flowerConfig.stamenColor} roughness={0.5} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Green Calyx Sepals underneath flower */}
        <group position={[0, 0, -0.1]}>
          {Array.from({ length: 5 }).map((_, i) => {
            const sepalAngle = (i * 2 * Math.PI) / 5;
            return (
              <group key={`sepal-${i}`} rotation={[0, 0, sepalAngle]}>
                <mesh position={[0, 0.36, -0.04]} rotation={[0.38, 0, 0]}>
                  <coneGeometry args={[0.11, 0.46, 6]} />
                  <meshStandardMaterial color="#166534" roughness={0.65} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* Realistic Green Plant Stem with Organic Leaf */}
      <group position={[0, 0.28, 0]}>
        <mesh position={[0, -0.85, -0.08]} rotation={[0.08, 0, -0.04]} castShadow>
          <cylinderGeometry args={[0.05, 0.065, 1.7, 16]} />
          <meshStandardMaterial color="#14532d" roughness={0.55} />
        </mesh>

        {/* Leaf Node with realistic sculpted leaf */}
        <group position={[0.18, -0.75, 0]} rotation={[0.25, -0.35, 0.55]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[0.2, 0.85, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.45} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// =======================================================================
// =======================================================================
// 2. ULTRA-REALISTIC FRONT-FACING SUPERMARKET POS BILLING & PRODUCE SCALE
// Zero-overlap, photorealistic front view with live digital POS and thermal receipt
// =======================================================================
// Helper component to render ultra-realistic 3D produce types in the shopping basket
function ProduceItem3D({ type, index, isLeft }) {
  const row = index % 3;
  const col = Math.floor(index / 3) % 2;
  const layer = Math.floor(index / 6);
  const pz = (row - 1) * 0.22;
  const px = (col - 0.5) * 0.18;
  const py = layer * 0.10;
  const rotY = index * 1.35;
  const rotX = (index % 2 === 0 ? 0.08 : -0.06);

  switch (type) {
    case 'apple':
      // Shimla Royal Apple (Tapered crown, deep calyx indent, curved woody stalk & orchard leaf)
      return (
        <group position={[px, 0.08 + py, pz]} rotation={[rotX, rotY, 0.06]}>
          {/* Main Tapered Apple Body */}
          <mesh castShadow receiveShadow scale={[1.08, 1.02, 1.08]}>
            <sphereGeometry args={[0.088, 22, 22]} />
            <meshPhysicalMaterial
              color="#b91c1c"
              roughness={0.16}
              clearcoat={0.85}
              clearcoatRoughness={0.08}
              metalness={0.02}
            />
          </mesh>
          {/* Warm Sun-Blush Underside */}
          <mesh position={[0.02, -0.02, 0]} scale={[0.85, 0.85, 0.85]}>
            <sphereGeometry args={[0.075, 14, 14]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.35} />
          </mesh>
          {/* Top Stem Cavity Indent */}
          <mesh position={[0, 0.085, 0]} scale={[1, 0.35, 1]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          {/* Curved Woody Stem */}
          <mesh position={[0.006, 0.105, 0]} rotation={[0.15, 0, 0.2]}>
            <cylinderGeometry args={[0.004, 0.005, 0.045, 8]} />
            <meshStandardMaterial color="#3e1f07" roughness={0.85} />
          </mesh>
          {/* Fresh Orchard Green Leaf */}
          <mesh position={[0.022, 0.112, 0.012]} rotation={[0.4, 0.2, -0.5]} scale={[1.4, 0.4, 0.8]}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshStandardMaterial color="#15803d" roughness={0.4} />
          </mesh>
        </group>
      );

    case 'orange':
      // Nagpur Sweet Orange (Pebbled citrus rind, equatorial swell, star button stem)
      return (
        <group position={[px, 0.08 + py, pz]} rotation={[rotX, rotY, 0]}>
          {/* Main Citrus Sphere with Micro-Rind Texture */}
          <mesh castShadow receiveShadow scale={[1.05, 0.98, 1.05]}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshPhysicalMaterial
              color="#f97316"
              roughness={0.68}
              metalness={0.02}
              clearcoat={0.35}
              clearcoatRoughness={0.25}
            />
          </mesh>
          {/* Stem Button Depressed Calyx */}
          <mesh position={[0, 0.086, 0]}>
            <cylinderGeometry args={[0.016, 0.022, 0.008, 10]} />
            <meshStandardMaterial color="#c2410c" roughness={0.8} />
          </mesh>
          {/* 5-Lobe Green Star Button */}
          {Array.from({ length: 5 }).map((_, si) => (
            <mesh
              key={si}
              position={[0, 0.09, 0]}
              rotation={[0, (si * 2 * Math.PI) / 5, 0]}
            >
              <coneGeometry args={[0.006, 0.018, 4]} />
              <meshStandardMaterial color="#14532d" roughness={0.6} />
            </mesh>
          ))}
        </group>
      );

    case 'onion':
      // Nashik Red Onion (Tear-drop bulb, papery purple tunic, fibrous root beard, dry stem)
      return (
        <group position={[px, 0.08 + py, pz]} rotation={[0.1, rotY, 0.12]}>
          {/* Swollen Tear-Drop Lower Bulb */}
          <mesh castShadow receiveShadow scale={[1.08, 1.08, 1.08]}>
            <sphereGeometry args={[0.085, 20, 20]} />
            <meshPhysicalMaterial
              color="#701a75"
              roughness={0.26}
              clearcoat={0.7}
              clearcoatRoughness={0.12}
              metalness={0.12}
            />
          </mesh>
          {/* Vertical Papery Skin Striations */}
          {Array.from({ length: 8 }).map((_, ri) => (
            <mesh
              key={ri}
              rotation={[0, (ri * Math.PI) / 4, 0]}
              scale={[1.09, 1.09, 1.09]}
            >
              <torusGeometry args={[0.084, 0.002, 6, 20]} />
              <meshBasicMaterial color="#86198f" transparent opacity={0.4} />
            </mesh>
          ))}
          {/* Pinched Papery Neck & Dry Stem Tip */}
          <mesh position={[0, 0.09, 0]} rotation={[0.05, 0, 0.1]}>
            <coneGeometry args={[0.024, 0.065, 10]} />
            <meshStandardMaterial color="#a21caf" roughness={0.5} />
          </mesh>
          <mesh position={[0.006, 0.125, 0]}>
            <cylinderGeometry args={[0.005, 0.008, 0.025, 6]} />
            <meshStandardMaterial color="#f5d0fe" roughness={0.8} />
          </mesh>
          {/* Dry Basal Root Beard Plate */}
          <mesh position={[0, -0.084, 0]}>
            <cylinderGeometry args={[0.026, 0.028, 0.012, 10]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {Array.from({ length: 7 }).map((_, rti) => (
            <mesh
              key={`root-${rti}`}
              position={[(rti % 3 - 1) * 0.012, -0.096, (Math.floor(rti / 3) - 1) * 0.012]}
              rotation={[0.2, rti * 0.9, 0]}
            >
              <cylinderGeometry args={[0.002, 0.002, 0.02, 4]} />
              <meshStandardMaterial color="#d97706" roughness={0.95} />
            </mesh>
          ))}
        </group>
      );

    case 'carrot':
      // Ooty Crunchy Carrot (Natural tapered taproot, ringed growth rings, feathery leafy greens)
      return (
        <group position={[px, 0.06 + py, pz]} rotation={[0.42, rotY, 0.22]}>
          {/* Tapered Conical Taproot */}
          <mesh castShadow receiveShadow position={[0, -0.05, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.042, 0.26, 16]} />
            <meshStandardMaterial color="#ea580c" roughness={0.42} metalness={0.04} />
          </mesh>
          {/* Rounded Tip */}
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color="#c2410c" roughness={0.5} />
          </mesh>
          {/* Horizontal Growth Ridge Rings */}
          {[-0.01, -0.05, -0.09, -0.13].map((gy, gi) => (
            <mesh key={gi} position={[0, gy, 0]} scale={[1.03, 1, 1.03]}>
              <torusGeometry args={[0.038 + gy * 0.12, 0.003, 6, 16]} />
              <meshStandardMaterial color="#c2410c" roughness={0.5} />
            </mesh>
          ))}
          {/* Flat Crown Shoulder */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.038, 0.042, 0.015, 14]} />
            <meshStandardMaterial color="#9a3412" roughness={0.6} />
          </mesh>
          {/* Feathery Leafy Carrot Greens */}
          <group position={[0, 0.095, 0]}>
            {[-0.2, 0, 0.25].map((ang, li) => (
              <mesh key={li} position={[ang * 0.06, 0.03, 0]} rotation={[0.1, 0, ang]}>
                <cylinderGeometry args={[0.004, 0.007, 0.07, 6]} />
                <meshStandardMaterial color="#15803d" roughness={0.45} />
              </mesh>
            ))}
            <mesh position={[0, 0.065, 0]} scale={[1.5, 0.6, 0.6]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial color="#22c55e" roughness={0.4} />
            </mesh>
          </group>
        </group>
      );

    case 'corn':
      // Golden Sweet Corn (Kernels cob, wrapping pale green husk leaves peeling open, silk strands)
      return (
        <group position={[px, 0.06 + py, pz]} rotation={[0.18, rotY, 0.28]}>
          {/* Golden Kernel Cob */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.042, 0.046, 0.24, 16]} />
            <meshStandardMaterial color="#facc15" roughness={0.4} metalness={0.06} />
          </mesh>
          {/* Kernel Beaded Rows Pattern */}
          {Array.from({ length: 6 }).map((_, ki) => (
            <mesh key={ki} position={[0, -0.08 + ki * 0.032, 0]}>
              <torusGeometry args={[0.044, 0.004, 6, 16]} />
              <meshStandardMaterial color="#eab308" roughness={0.35} />
            </mesh>
          ))}
          {/* Base Cut Stalk Shank */}
          <mesh position={[0, -0.13, 0]}>
            <cylinderGeometry args={[0.016, 0.02, 0.035, 10]} />
            <meshStandardMaterial color="#bbf7d0" roughness={0.7} />
          </mesh>
          {/* Outer Wrapping Jade Husk Leaves Peeling Open */}
          <mesh position={[-0.018, -0.02, 0.01]} rotation={[0.1, 0.2, 0.15]}>
            <coneGeometry args={[0.056, 0.22, 8, 1, true]} />
            <meshStandardMaterial color="#86efac" roughness={0.55} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.02, -0.03, -0.01]} rotation={[-0.1, -0.3, -0.15]}>
            <coneGeometry args={[0.054, 0.20, 8, 1, true]} />
            <meshStandardMaterial color="#4ade80" roughness={0.55} side={THREE.DoubleSide} />
          </mesh>
          {/* Corn Silk Tufts at Tip */}
          <mesh position={[0, 0.125, 0]}>
            <coneGeometry args={[0.015, 0.035, 6]} />
            <meshStandardMaterial color="#92400e" roughness={0.9} />
          </mesh>
        </group>
      );

    case 'peas':
      // Tender Green Peas (Crescent curved pod with 4 distinctly bulging peas, dorsal seam & stem)
      return (
        <group position={[px, 0.06 + py, pz]} rotation={[0.22, rotY, 0.12]}>
          {/* Curved Pea Pod Shell */}
          <mesh castShadow receiveShadow scale={[0.42, 1.25, 0.32]}>
            <capsuleGeometry args={[0.042, 0.16, 10, 16]} />
            <meshStandardMaterial color="#16a34a" roughness={0.3} metalness={0.03} />
          </mesh>
          {/* Dorsal Seam Line */}
          <mesh position={[0.018, 0, 0]} scale={[0.05, 1.28, 0.34]}>
            <capsuleGeometry args={[0.040, 0.16, 6, 10]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
          {/* 4 Bulging Peas Visible Along the Pod */}
          {[-0.075, -0.025, 0.025, 0.075].map((pyBump, pbi) => (
            <mesh key={pbi} position={[0, pyBump, 0]} scale={[1.18, 0.95, 1.18]}>
              <sphereGeometry args={[0.016, 10, 10]} />
              <meshStandardMaterial color="#22c55e" roughness={0.35} />
            </mesh>
          ))}
          {/* Stem Cap Attachment */}
          <mesh position={[0, -0.115, 0]}>
            <coneGeometry args={[0.014, 0.022, 6]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
        </group>
      );

    case 'tomato':
      // Heirloom Tomato (Lobed ribs, radiant clearcoat sheen, 5-star green calyx & organic stem)
      return (
        <group position={[px, 0.075 + py, pz]} rotation={[rotX, rotY, 0]}>
          {/* Central Tomato Core */}
          <mesh castShadow receiveShadow scale={[1.15, 0.88, 1.15]}>
            <sphereGeometry args={[0.092, 22, 22]} />
            <meshPhysicalMaterial
              color="#dc2626"
              roughness={0.11}
              clearcoat={0.94}
              clearcoatRoughness={0.04}
              metalness={0.02}
            />
          </mesh>
          {/* Subtle Heirloom Lobes for Organic Texture */}
          {Array.from({ length: 4 }).map((_, li) => (
            <mesh
              key={li}
              position={[Math.cos((li * Math.PI) / 2) * 0.025, 0, Math.sin((li * Math.PI) / 2) * 0.025]}
              scale={[0.88, 0.84, 0.88]}
            >
              <sphereGeometry args={[0.082, 14, 14]} />
              <meshPhysicalMaterial
                color="#ea580c"
                transparent
                opacity={0.3}
                roughness={0.15}
                clearcoat={0.8}
              />
            </mesh>
          ))}
          {/* Concave Stem Indent */}
          <mesh position={[0, 0.080, 0]} scale={[1, 0.25, 1]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
          {/* 5-Pointed Star Calyx & Stem */}
          <group position={[0, 0.082, 0]}>
            {Array.from({ length: 5 }).map((_, sIdx) => (
              <group key={sIdx} rotation={[0, (sIdx * 2 * Math.PI) / 5, 0]}>
                <mesh position={[0.028, 0.008, 0]} rotation={[0, 0, -0.32]}>
                  <coneGeometry args={[0.008, 0.045, 4]} />
                  <meshStandardMaterial color="#16a34a" roughness={0.4} />
                </mesh>
              </group>
            ))}
            <mesh position={[0.004, 0.024, 0]} rotation={[0.12, 0, 0.22]}>
              <cylinderGeometry args={[0.005, 0.006, 0.045, 6]} />
              <meshStandardMaterial color="#15803d" roughness={0.5} />
            </mesh>
          </group>
        </group>
      );

    case 'potato':
    default:
      // Russet Burbank Potato (Organic irregular tuber, earthy matte skin, 5 dormant sprout eyes)
      return (
        <group position={[px, 0.075 + py, pz]} rotation={[0.12, rotY, 0.16]}>
          {/* Main Organic Elongated Tuber */}
          <mesh castShadow receiveShadow scale={[1.40, 0.94, 1.06]}>
            <sphereGeometry args={[0.088, 20, 20]} />
            <meshStandardMaterial
              color="#8c5a24"
              roughness={0.92}
              metalness={0.02}
            />
          </mesh>
          {/* Secondary Organic Asymmetry Lump */}
          <mesh position={[0.03, 0.015, -0.015]} scale={[0.85, 0.78, 0.88]}>
            <sphereGeometry args={[0.072, 14, 14]} />
            <meshStandardMaterial color="#78481a" roughness={0.95} />
          </mesh>
          {/* Natural Soil Dust Patch */}
          <mesh position={[-0.04, -0.02, 0.02]} scale={[0.7, 0.6, 0.7]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.98} />
          </mesh>
          {/* Dormant Sprout Eyes / Dimples */}
          {[
            [-0.07, 0.04, 0.03],
            [0.05, 0.05, -0.02],
            [-0.01, 0.065, 0.04],
            [0.06, -0.03, 0.04],
            [-0.04, -0.04, -0.03]
          ].map(([dx, dy, dz], dIdx) => (
            <group key={dIdx} position={[dx, dy, dz]}>
              <mesh>
                <sphereGeometry args={[0.007, 6, 6]} />
                <meshStandardMaterial color="#381e05" roughness={0.98} />
              </mesh>
              <mesh position={[0.002, 0.002, 0]}>
                <sphereGeometry args={[0.003, 4, 4]} />
                <meshStandardMaterial color="#d4d4d8" roughness={0.5} />
              </mesh>
            </group>
          ))}
        </group>
      );
  }
}

export function MarketProduce3D({
  cartIdx = 0,
  kgPotatoes = 3,
  kgTomatoes = 2,
  kgItem1,
  kgItem2,
  checkoutStep = 0,
  onCheckoutComplete
}) {
  const activeCart = GROCERY_MARKET_DATASET[cartIdx] || GROCERY_MARKET_DATASET[0];
  const item1 = activeCart.item1;
  const item2 = activeCart.item2;
  const qty1 = kgItem1 !== undefined ? kgItem1 : (kgPotatoes !== undefined ? kgPotatoes : item1.defaultKg);
  const qty2 = kgItem2 !== undefined ? kgItem2 : (kgTomatoes !== undefined ? kgTomatoes : item2.defaultKg);
  const cost1 = qty1 * item1.rate;
  const cost2 = qty2 * item2.rate;
  const totalCost = cost1 + cost2;
  const totalWeight = qty1 + qty2;

  const receiptPaperRef = useRef();
  const printProgress = useRef(checkoutStep > 0 ? 1 : 0);

  const counterTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/hardwood_texture.jpg');
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1.5);
    return tex;
  }, []);

  useFrame((state, delta) => {
    const target = checkoutStep > 0 ? 1.0 : 0.0;
    printProgress.current = THREE.MathUtils.damp(printProgress.current, target, 7.0, delta);
    const p = printProgress.current;
    if (receiptPaperRef.current) {
      if (p < 0.01) {
        receiptPaperRef.current.visible = false;
      } else {
        receiptPaperRef.current.visible = true;
        receiptPaperRef.current.position.y = 0.215 + 0.34 * p;
        receiptPaperRef.current.scale.set(1, Math.max(0.01, p), 1);
      }
    }
  });

  return (
    <group position={[0, -0.34, 0]}>
      {/* Studio Lighting with Warm Ambiance */}
      <ambientLight intensity={1.6} color="#ffffff" />
      <directionalLight position={[4, 8, 6]} intensity={2.2} color="#ffffff" castShadow />
      <directionalLight position={[-4, 6, 2]} intensity={1.4} color="#e0f2fe" />
      <pointLight position={[0, 1.4, 1.2]} intensity={2.2} color="#fef3c7" distance={5} />
      <pointLight position={[0, 2.0, -1.0]} intensity={2.4} color="#38bdf8" distance={6} />

      {/* ================= 0. SUPERMARKET STORE INTERIOR BACKDROP WALL ================= */}
      <group position={[0, 0.6, -0.9]}>
        {/* Soft Retail Light Wall - Covers Full Background */}
        <mesh receiveShadow>
          <boxGeometry args={[9.2, 4.5, 0.08]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.75} />
        </mesh>
        {/* Warm Architectural Wood Slats */}
        {[-3.6, -2.4, -1.2, 1.2, 2.4, 3.6].map((wx, idx) => (
          <mesh key={`slat-${idx}`} position={[wx, 0, 0.045]}>
            <boxGeometry args={[0.08, 4.5, 0.02]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} metalness={0.2} />
          </mesh>
        ))}
        {/* Subtle Horizontal Retail Accent Trim */}
        <mesh position={[0, 0.95, 0.045]}>
          <boxGeometry args={[9.2, 0.04, 0.015]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ================= 1. FRONT-FACING SUPERMARKET CHECKOUT COUNTER ================= */}
      <group position={[0, -0.22, 0]}>
        {/* Warm Natural Oak Countertop */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.8, 0.12, 2.4]} />
          <meshPhysicalMaterial
            map={counterTexture}
            bumpMap={counterTexture}
            bumpScale={0.03}
            color="#d97706"
            roughness={0.35}
            metalness={0.1}
            clearcoat={0.5}
            clearcoatRoughness={0.15}
          />
        </mesh>
        {/* Brushed Stainless Steel Front Edge Bezel */}
        <mesh position={[0, 0, 1.205]}>
          <boxGeometry args={[4.82, 0.13, 0.03]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.18} />
        </mesh>
        {/* Dark Slate Counter Base Wall */}
        <mesh position={[0, -0.7, 0]} receiveShadow>
          <boxGeometry args={[4.6, 1.28, 2.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>

      {/* ================= 2. LEFT: DIGITAL WEIGHING SCALE & PRODUCE BASKET (X = -1.42) ================= */}
      <group position={[-1.42, -0.06, 0.08]}>
        {/* Scale Base Platform */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.08, 1.05]} />
          <meshPhysicalMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Polished Stainless Steel Weighing Platter */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[1.00, 0.025, 1.00]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Digital LED Weight Display Panel (Facing Front) */}
        <group position={[0, 0.01, 0.54]}>
          {/* Bezel frame */}
          <mesh>
            <boxGeometry args={[0.96, 0.09, 0.03]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
          {/* Active green LED glow border */}
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[0.92, 0.07]} />
            <meshBasicMaterial color="#064e3b" />
          </mesh>
          {/* Main Net Weight readout */}
          <Text position={[0, 0.008, 0.022]} fontSize={0.046} color="#4ade80" fontWeight="900" anchorX="center" anchorY="middle">
            {`NET WT: ${totalWeight}.00 kg  |  TOTAL: ₹${totalCost}`}
          </Text>
        </group>

        {/* ================= PHOTOREALISTIC WIRE SHOPPING BASKET ================= */}
        <group position={[0, 0.06, 0]}>
          {/* Basket Bottom Frame */}
          <mesh position={[0, 0.01, 0]} receiveShadow>
            <boxGeometry args={[0.94, 0.02, 0.82]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Chrome Top Border Rim with Corner Bumpers */}
          <group position={[0, 0.28, 0]}>
            {[-0.41, 0.41].map((rz, rIdx) => (
              <mesh key={`rail-fb-${rIdx}`} position={[0, 0, rz]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.010, 0.010, 0.96, 16]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.08} />
              </mesh>
            ))}
            {[-0.47, 0.47].map((rx, rIdx) => (
              <mesh key={`rail-lr-${rIdx}`} position={[rx, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.010, 0.010, 0.82, 16]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.08} />
              </mesh>
            ))}
            {[[-0.47, -0.41], [0.47, -0.41], [-0.47, 0.41], [0.47, 0.41]].map(([cx, cz], cIdx) => (
              <mesh key={`bumper-${cIdx}`} position={[cx, 0, cz]}>
                <sphereGeometry args={[0.018, 12, 12]} />
                <meshPhysicalMaterial color="#0d9488" roughness={0.2} clearcoat={0.8} />
              </mesh>
            ))}
          </group>

          {/* Vertical Wire Ribs */}
          {Array.from({ length: 8 }).map((_, vi) => {
            const vx = -0.40 + vi * 0.114;
            return (
              <group key={`v-rib-${vi}`}>
                <mesh position={[vx, 0.14, -0.41]} castShadow>
                  <cylinderGeometry args={[0.005, 0.005, 0.28, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.94} roughness={0.15} />
                </mesh>
                <mesh position={[vx, 0.14, 0.41]} castShadow>
                  <cylinderGeometry args={[0.005, 0.005, 0.28, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.94} roughness={0.15} />
                </mesh>
              </group>
            );
          })}

          {/* Horizontal Perimeter Wire Rings */}
          {[0.09, 0.18].map((hy, hi) => (
            <group key={`h-ring-${hi}`} position={[0, hy, 0]}>
              {[-0.41, 0.41].map((hz, hzi) => (
                <mesh key={`hfb-${hzi}`} position={[0, 0, hz]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.94, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.94} roughness={0.15} />
                </mesh>
              ))}
              {[-0.47, 0.47].map((hx, hxi) => (
                <mesh key={`hlr-${hxi}`} position={[hx, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.82, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.94} roughness={0.15} />
                </mesh>
              ))}
            </group>
          ))}

          {/* Central Produce Divider Wire Slat */}
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.016, 0.24, 0.80]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>

          {/* Dynamic Item 1: Inside Left Half of Basket (Scales up to 10kg) */}
          <group position={[-0.24, 0.02, 0]}>
            {Array.from({ length: Math.min(qty1, 10) }).map((_, i) => (
              <ProduceItem3D key={`item1-${i}`} type={item1.type} index={i} isLeft={true} />
            ))}
          </group>

          {/* Dynamic Item 2: Inside Right Half of Basket (Scales up to 10kg) */}
          <group position={[0.24, 0.02, 0]}>
            {Array.from({ length: Math.min(qty2, 10) }).map((_, i) => (
              <ProduceItem3D key={`item2-${i}`} type={item2.type} index={i} isLeft={false} />
            ))}
          </group>
        </group>
      </group>

      {/* ================= 3. CENTER: MODERN 16:9 WIDESCREEN POS TOUCHSCREEN (X = 0.18) ================= */}
      <group position={[0.18, 0.12, -0.15]}>
        {/* Sleek Heavy Steel Stand */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.22, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, -0.06]} rotation={[0.22, 0, 0]} castShadow>
          <cylinderGeometry args={[0.038, 0.038, 0.38, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* 15.6-inch Widescreen Touchscreen Monitor (Facing Front With Slight Upward Tilt) */}
        <group position={[0, 0.38, 0]} rotation={[-0.12, 0, 0]}>
          {/* Glowing Silhouette Rim (Guarantees Sharp Contrast Against Dark Backgrounds) */}
          <mesh position={[0, 0, -0.005]}>
            <boxGeometry args={[1.60, 1.12, 0.01]} />
            <meshBasicMaterial color="#0ea5e9" />
          </mesh>

          {/* Dark Titanium Outer Bezel */}
          <mesh castShadow>
            <boxGeometry args={[1.56, 1.08, 0.06]} />
            <meshPhysicalMaterial color="#1e293b" roughness={0.25} metalness={0.85} />
          </mesh>

          {/* Obsidian OLED Screen Glass Surface */}
          <mesh position={[0, 0, 0.034]}>
            <planeGeometry args={[1.50, 1.02]} />
            <meshBasicMaterial color="#090d16" />
          </mesh>

          {/* POS Terminal Screen UI (Crisp Typography, Columnar Layout, Zero Overlaps) */}
          <group position={[0, 0, 0.044]}>
            {/* Header Bar */}
            <mesh position={[0, 0.41, 0]}>
              <planeGeometry args={[1.46, 0.11]} />
              <meshBasicMaterial color="#0f766e" />
            </mesh>
            <Text position={[-0.66, 0.41, 0.001]} fontSize={0.044} color="#ffffff" fontWeight="900" anchorX="left" anchorY="middle">
              🛒 FUTURA MART POS • AISLE #01
            </Text>
            <Text position={[0.66, 0.41, 0.001]} fontSize={0.040} color="#ccfbf1" fontWeight="900" anchorX="right" anchorY="middle">
              {checkoutStep > 0 ? 'BILLED ✅' : 'LIVE CART'}
            </Text>

            {/* Table Column Headers */}
            <Text position={[-0.66, 0.31, 0.001]} fontSize={0.033} color="#94a3b8" fontWeight="800" anchorX="left" anchorY="middle">
              PRODUCE ITEM
            </Text>
            <Text position={[0.14, 0.31, 0.001]} fontSize={0.033} color="#94a3b8" fontWeight="800" anchorX="center" anchorY="middle">
              WEIGHT × RATE (AP)
            </Text>
            <Text position={[0.66, 0.31, 0.001]} fontSize={0.033} color="#94a3b8" fontWeight="800" anchorX="right" anchorY="middle">
              SUBTOTAL
            </Text>

            {/* Divider Line */}
            <mesh position={[0, 0.26, 0]}>
              <planeGeometry args={[1.44, 0.003]} />
              <meshBasicMaterial color="#334155" />
            </mesh>

            {/* Item 1 Row */}
            <mesh position={[0, 0.18, 0]}>
              <planeGeometry args={[1.44, 0.10]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <Text 
              position={[-0.66, 0.18, 0.001]} 
              fontSize={0.038} 
              maxWidth={0.60}
              color="#f8fafc" 
              fontWeight="900" 
              anchorX="left" 
              anchorY="middle"
            >
              {`${item1.emoji} ${item1.name}`}
            </Text>
            <Text position={[0.14, 0.18, 0.001]} fontSize={0.042} color="#38bdf8" fontWeight="800" anchorX="center" anchorY="middle">
              {`${qty1} kg × ₹${item1.rate}/kg`}
            </Text>
            <Text position={[0.66, 0.18, 0.001]} fontSize={0.052} color="#38bdf8" fontWeight="900" anchorX="right" anchorY="middle">
              {`₹${cost1}`}
            </Text>

            {/* Item 2 Row */}
            <mesh position={[0, 0.06, 0]}>
              <planeGeometry args={[1.44, 0.10]} />
              <meshBasicMaterial color="#131c2e" />
            </mesh>
            <Text 
              position={[-0.66, 0.06, 0.001]} 
              fontSize={0.038} 
              maxWidth={0.60}
              color="#f8fafc" 
              fontWeight="900" 
              anchorX="left" 
              anchorY="middle"
            >
              {`${item2.emoji} ${item2.name}`}
            </Text>
            <Text position={[0.14, 0.06, 0.001]} fontSize={0.042} color="#f472b6" fontWeight="800" anchorX="center" anchorY="middle">
              {`${qty2} kg × ₹${item2.rate}/kg`}
            </Text>
            <Text position={[0.66, 0.06, 0.001]} fontSize={0.052} color="#f472b6" fontWeight="900" anchorX="right" anchorY="middle">
              {`₹${cost2}`}
            </Text>

            {/* Combined Weight Row */}
            <Text position={[-0.66, -0.05, 0.001]} fontSize={0.036} color="#94a3b8" fontWeight="800" anchorX="left" anchorY="middle">
              ⚖️ Total Produce Weight:
            </Text>
            <Text position={[0.66, -0.05, 0.001]} fontSize={0.040} color="#a7f3d0" fontWeight="900" anchorX="right" anchorY="middle">
              {`${totalWeight}.00 kg`}
            </Text>

            {/* AP Step Formula Bar */}
            <mesh position={[0, -0.18, 0]}>
              <planeGeometry args={[1.44, 0.13]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.18, -0.001]}>
              <planeGeometry args={[1.46, 0.14]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            <Text position={[0, -0.15, 0.001]} fontSize={0.032} color="#fef08a" fontWeight="900" anchorX="center" anchorY="middle">
              {`📐 AP Pattern: Rate adds d1 = ₹${item1.rate} & d2 = ₹${item2.rate} per kg`}
            </Text>
            <Text position={[0, -0.21, 0.001]} fontSize={0.036} color="#67e8f9" fontWeight="800" anchorX="center" anchorY="middle">
              {`Total Bill = (${qty1} × ₹${item1.rate}) + (${qty2} × ₹${item2.rate}) = ₹${totalCost}`}
            </Text>

            {/* Grand Total Banner */}
            <mesh position={[0, -0.35, 0]}>
              <planeGeometry args={[1.44, 0.16]} />
              <meshBasicMaterial color={checkoutStep > 0 ? '#047857' : '#065f46'} />
            </mesh>
            <mesh position={[0, -0.35, -0.001]}>
              <planeGeometry args={[1.46, 0.17]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            <Text position={[-0.62, -0.35, 0.001]} fontSize={0.060} color="#ffffff" fontWeight="900" anchorX="left" anchorY="middle">
              GRAND TOTAL:
            </Text>
            <Text position={[0.62, -0.35, 0.001]} fontSize={0.082} color="#4ade80" fontWeight="900" anchorX="right" anchorY="middle">
              {`₹${totalCost}`}
            </Text>
          </group>
        </group>

        {/* Flatbed Barcode Laser Scanner Glass on Counter */}
        <group position={[0, -0.16, 0.50]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.04, 0.36]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.46, 0.26]} />
            <meshPhysicalMaterial color="#dc2626" transmission={0.7} transparent opacity={0.8} roughness={0.1} />
          </mesh>
          {/* Laser Glow Line */}
          <mesh position={[0, 0.023, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.016]} />
            <meshBasicMaterial color="#ff0000" blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. RIGHT: THERMAL RECEIPT PRINTER & PRINTED BILL (X = 1.24) ================= */}
      <group position={[1.24, 0.04, 0.10]} rotation={[0, -0.22, 0]}>
        {/* Compact POS Thermal Printer Box */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.65, 0.42, 0.65]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.65} roughness={0.25} />
        </mesh>
        {/* Printer Output Slot Bezel */}
        <mesh position={[0, 0.215, 0]}>
          <boxGeometry args={[0.54, 0.02, 0.05]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
        {/* Power Status LED */}
        <mesh position={[-0.24, 0.14, 0.33]}>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshBasicMaterial color={checkoutStep > 0 ? '#38bdf8' : '#22c55e'} />
        </mesh>

        {/* Paper Slot Standby Guide */}
        {checkoutStep === 0 && (
          <group position={[0, 0.23, 0.02]}>
            <Text position={[0, 0.04, 0]} fontSize={0.028} color="#94a3b8" anchorX="center" anchorY="bottom">
              [Click Button Below to Print]
            </Text>
          </group>
        )}

        {/* Upright Front-Facing Thermal Paper Receipt (Emerges on button click) */}
        <group ref={receiptPaperRef} position={[0, 0.18, 0.02]} rotation={[-0.08, 0, 0]}>
          {/* Crisp White Thermal Paper Ribbon */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.68, 0.008]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>

          {/* Receipt Printed Content */}
          <group position={[0, 0, 0.006]}>
            <Text position={[0, 0.28, 0]} fontSize={0.034} color="#0f172a" fontWeight="900" anchorX="center" anchorY="top">
              🧾 FUTURA FRESH MART
            </Text>
            <Text position={[0, 0.22, 0]} fontSize={0.024} color="#64748b" anchorX="center" anchorY="top">
              ========================
            </Text>
            <Text position={[-0.24, 0.15, 0]} fontSize={0.03} color="#0f172a" fontWeight="800" anchorX="left" anchorY="top">
              {`${item1.shortName} (${qty1} kg)`}
            </Text>
            <Text position={[0.24, 0.15, 0]} fontSize={0.03} color="#0f172a" fontWeight="900" anchorX="right" anchorY="top">
              {`₹${cost1}`}
            </Text>
            <Text position={[-0.24, 0.07, 0]} fontSize={0.03} color="#0f172a" fontWeight="800" anchorX="left" anchorY="top">
              {`${item2.shortName} (${qty2} kg)`}
            </Text>
            <Text position={[0.24, 0.07, 0]} fontSize={0.03} color="#0f172a" fontWeight="900" anchorX="right" anchorY="top">
              {`₹${cost2}`}
            </Text>
            <Text position={[0, 0.01, 0]} fontSize={0.024} color="#64748b" anchorX="center" anchorY="top">
              ------------------------
            </Text>
            <Text position={[-0.24, -0.06, 0]} fontSize={0.036} color="#0f172a" fontWeight="900" anchorX="left" anchorY="top">
              TOTAL DUE:
            </Text>
            <Text position={[0.24, -0.06, 0]} fontSize={0.044} color="#0d9488" fontWeight="900" anchorX="right" anchorY="top">
              {`₹${totalCost}`}
            </Text>
            <Text position={[0, -0.17, 0]} fontSize={0.024} color="#64748b" anchorX="center" anchorY="top">
              THANK YOU FOR SHOPPING!
            </Text>
            {/* Barcode Stripe Graphic */}
            <mesh position={[0, -0.27, 0]}>
              <planeGeometry args={[0.38, 0.055]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// =======================================================================
// =======================================================================
// 3. PHOTOREALISTIC DESKTOP CALENDAR EASEL (3x3 MAGIC WINDOW)
// =======================================================================
export function CalendarDesk3D({ selectedCenter = 16, monthIdx = 0, onSelectCenter }) {
  const currentMonth = CALENDAR_MAGIC_DATASET[monthIdx] || CALENDAR_MAGIC_DATASET[0];
  const grid = useMemo(() => getMonthCalendarGrid(currentMonth), [currentMonth]);
  const validCenters = useMemo(() => getValidCentersForMonth(currentMonth), [currentMonth]);

  // Center calculation and validation
  const centerInfo = useMemo(() => {
    const found = validCenters.find(c => c.day === selectedCenter);
    if (found) return found;
    return validCenters.find(c => c.day === currentMonth.defaultCenter) || validCenters[0] || {
      day: 16,
      row: 2,
      col: 3,
      sum: 144,
      boxValues: [],
      pairs: []
    };
  }, [validCenters, selectedCenter, currentMonth]);

  const safeCenter = centerInfo.day;
  const sRow = centerInfo.row;
  const sCol = centerInfo.col;

  // Box values set for fast check
  const inWindowDays = useMemo(() => new Set(centerInfo.boxValues || []), [centerInfo]);

  // Dimensions
  const colW = 0.50;
  const rowH = 0.42;
  const startX = - (6 * colW) / 2; // -1.50
  const startY = 0.85;

  const windowX = startX + sCol * colW;
  const windowY = startY - sRow * rowH;

  const woodTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/hardwood_texture.jpg');
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, []);

  // Symmetrical connecting laser lines
  const symmetricBeams = [
    { name: 'Diagonal ↘', p1: [-colW, rowH], p2: [colW, -rowH], color: '#ec4899', label: '-8 / +8' },
    { name: 'Vertical ↕', p1: [0, rowH], p2: [0, -rowH], color: '#0284c7', label: '-7 / +7' },
    { name: 'Diagonal ↗', p1: [colW, rowH], p2: [-colW, -rowH], color: '#f59e0b', label: '-6 / +6' },
    { name: 'Horizontal ↔', p1: [-colW, 0], p2: [colW, 0], color: '#10b981', label: '-1 / +1' }
  ];

  return (
    <group position={[0, -0.2, 0]} rotation={[0.22, 0, 0]}>
      {/* 1. Deep Studio Lighting */}
      <ambientLight intensity={1.4} color="#f8fafc" />
      <directionalLight position={[4, 8, 7]} intensity={2.6} castShadow color="#ffffff" />
      <directionalLight position={[-5, 3, 4]} intensity={1.5} color="#38bdf8" />
      <pointLight position={[0, 3, 2.5]} intensity={1.8} color="#fef3c7" distance={8} />
      <pointLight position={[0, -1.5, 2.2]} intensity={3.2} color="#ffffff" distance={5} />

      {/* 2. Golden Math Sparkles hovering around the Magic Window */}
      <group position={[windowX, windowY, 0.25]}>
        <DreiSparkles count={24} scale={2.4} size={1.8} speed={0.35} color="#fef08a" />
      </group>

      {/* 3. Executive Polished Tabletop Plinth */}
      <mesh position={[0, -2.15, 0.35]} receiveShadow>
        <boxGeometry args={[5.6, 0.22, 3.4]} />
        <meshStandardMaterial
          map={woodTexture}
          bumpMap={woodTexture}
          bumpScale={0.03}
          color="#1c1917"
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
      {/* Polished Brass Bevel Trim on Table Edge */}
      <mesh position={[0, -2.04, 1.95]}>
        <boxGeometry args={[5.6, 0.02, 0.04]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* 4. Solid Oak Easel Stand Backboard */}
      <group position={[0, 0, -0.08]}>
        {/* Slanted Oak Backboard */}
        <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.1, 4.25, 0.12]} />
          <meshStandardMaterial
            map={woodTexture}
            bumpMap={woodTexture}
            bumpScale={0.02}
            color="#b45309"
            roughness={0.5}
            metalness={0.08}
          />
        </mesh>
        {/* Oak Easel Top Bevel Cap */}
        <mesh position={[0, 2.22, 0.02]} receiveShadow>
          <boxGeometry args={[4.2, 0.08, 0.16]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Front Ledge Retaining Shelf */}
        <mesh position={[0, -1.98, 0.14]} receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.16, 0.32]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Front Brass Shelf Lip */}
        <mesh position={[0, -1.9, 0.29]}>
          <boxGeometry args={[4.1, 0.04, 0.03]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Left & Right Brass Retaining Pegs */}
        {[-1.6, 1.6].map((xPeg, i) => (
          <mesh key={`peg-${i}`} position={[xPeg, -1.82, 0.28]}>
            <cylinderGeometry args={[0.028, 0.035, 0.16, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
          </mesh>
        ))}
      </group>

      {/* 5. 14 Twin-Wire Metal Spiral Coils */}
      {Array.from({ length: 14 }).map((_, i) => {
        const coilX = -1.62 + i * (3.24 / 13);
        return (
          <group key={`coil-${i}`} position={[coilX, 1.96, 0.08]}>
            <mesh rotation={[0, 0, Math.PI / 9]}>
              <torusGeometry args={[0.075, 0.013, 16, 32]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.94} roughness={0.16} />
            </mesh>
          </group>
        );
      })}

      {/* 6. Multi-Layer Cream Linen Parchment Calendar Pad */}
      <group position={[0, 0.05, 0.01]}>
        {/* Back page shadows (stacked sheets) */}
        <mesh position={[0.02, -0.02, -0.01]} receiveShadow>
          <boxGeometry args={[3.84, 3.82, 0.015]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        {/* Main Calendar Front Sheet */}
        <mesh position={[0, 0, 0.005]} receiveShadow>
          <boxGeometry args={[3.82, 3.8, 0.015]} />
          <meshStandardMaterial color="#fffef9" roughness={0.65} metalness={0.02} />
        </mesh>

        {/* 7. Printed Month Header Ribbon */}
        <group position={[0, 1.58, 0.018]}>
          <mesh>
            <boxGeometry args={[3.72, 0.52, 0.01]} />
            <meshStandardMaterial color={currentMonth.headerColor} roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Gold Trim Line below Header */}
          <mesh position={[0, -0.26, 0.006]}>
            <boxGeometry args={[3.72, 0.015, 0.01]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Month & Year Title */}
          <Text
            position={[0, 0.08, 0.015]}
            fontSize={0.21}
            color="#ffffff"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            {`${currentMonth.name.toUpperCase()}`}
          </Text>
          {/* Season & Grade 6 Lab Subtitle */}
          <Text
            position={[0, -0.12, 0.015]}
            fontSize={0.10}
            color="#fef08a"
            fontWeight="700"
            anchorX="center"
            anchorY="middle"
          >
            {`${currentMonth.icon} ${currentMonth.season} · 3×3 Magic Window Lab`}
          </Text>
        </group>

        {/* 8. Day of Week Ribbon */}
        <group position={[0, 1.18, 0.018]}>
          <mesh>
            <boxGeometry args={[3.72, 0.22, 0.005]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
          </mesh>
          {currentMonth.headers.map((hdr, hIdx) => (
            <Text
              key={`h-${hIdx}`}
              position={[startX + hIdx * colW, 0, 0.01]}
              fontSize={0.11}
              color="#475569"
              fontWeight="900"
              anchorX="center"
              anchorY="middle"
            >
              {hdr.toUpperCase()}
            </Text>
          ))}
        </group>

        {/* 9. 42 Calendar Cells Grid */}
        <group position={[0, 0, 0.02]}>
          {grid.map((row, r) =>
            row.map((day, c) => {
              const x = startX + c * colW;
              const y = startY - r * rowH;
              const isCenter = day === safeCenter;
              const inBox = day !== null && inWindowDays.has(day);

              if (day === null) {
                return (
                  <group key={`empty-${r}-${c}`} position={[x, y, 0]}>
                    <mesh>
                      <circleGeometry args={[0.03, 16]} />
                      <meshBasicMaterial color="#cbd5e1" />
                    </mesh>
                  </group>
                );
              }

              // Normal or Window Cell
              const zElev = isCenter ? 0.06 : inBox ? 0.03 : 0.005;
              const cellBg = isCenter
                ? '#0d9488'
                : inBox
                ? '#ccfbf1'
                : '#ffffff';
              const numColor = isCenter
                ? '#ffffff'
                : inBox
                ? '#0f766e'
                : '#1e293b';

              return (
                <group
                  key={`day-${day}`}
                  position={[x, y, zElev]}
                  onClick={() => onSelectCenter && onSelectCenter(day)}
                >
                  {/* Base Paper / Ceramic Tile Chip */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[colW * 0.88, rowH * 0.88, 0.015]} />
                    <meshStandardMaterial
                      color={cellBg}
                      roughness={isCenter ? 0.2 : 0.4}
                      metalness={isCenter ? 0.2 : 0.05}
                    />
                  </mesh>

                  {/* If Center Date: Raised Brass Medallion Rim */}
                  {isCenter && (
                    <>
                      <mesh position={[0, 0, 0.012]}>
                        <circleGeometry args={[colW * 0.38, 32]} />
                        <meshStandardMaterial color="#0d9488" metalness={0.2} roughness={0.3} />
                      </mesh>
                      <mesh position={[0, 0, 0.016]}>
                        <torusGeometry args={[colW * 0.38, 0.02, 16, 32]} />
                        <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.12} />
                      </mesh>
                    </>
                  )}

                  {/* Day Number */}
                  <Text
                    position={[0, isCenter ? 0.01 : 0, isCenter ? 0.035 : 0.02]}
                    fontSize={isCenter ? 0.19 : 0.165}
                    color={numColor}
                    fontWeight="900"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {day}
                  </Text>

                  {/* Center Label Tag */}
                  {isCenter && (
                    <Text
                      position={[0, -0.12, 0.035]}
                      fontSize={0.065}
                      color="#fef08a"
                      fontWeight="900"
                      anchorX="center"
                      anchorY="middle"
                    >
                      CENTER
                    </Text>
                  )}
                </group>
              );
            })
          )}
        </group>

        {/* 10. Artisan Burnished Brass "Magic Window" Loupe Frame */}
        <group position={[windowX, windowY, 0.09]}>
          {/* Main Brass Border Frame */}
          <group position={[0, 0, 0]}>
            {/* Top Bar */}
            <mesh position={[0, rowH * 1.5, 0.01]}>
              <boxGeometry args={[colW * 3.12, 0.032, 0.03]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.16} />
            </mesh>
            {/* Bottom Bar */}
            <mesh position={[0, -rowH * 1.5, 0.01]}>
              <boxGeometry args={[colW * 3.12, 0.032, 0.03]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.16} />
            </mesh>
            {/* Left Bar */}
            <mesh position={[-colW * 1.5, 0, 0.01]}>
              <boxGeometry args={[0.032, rowH * 3.03, 0.03]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.16} />
            </mesh>
            {/* Right Bar */}
            <mesh position={[colW * 1.5, 0, 0.01]}>
              <boxGeometry args={[0.032, rowH * 3.03, 0.03]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.16} />
            </mesh>

            {/* 4 Golden Corner Rivet Studs */}
            {[
              [-colW * 1.5, rowH * 1.5],
              [colW * 1.5, rowH * 1.5],
              [-colW * 1.5, -rowH * 1.5],
              [colW * 1.5, -rowH * 1.5]
            ].map(([rx, ry], idx) => (
              <mesh key={`rivet-${idx}`} position={[rx, ry, 0.024]}>
                <sphereGeometry args={[0.032, 16, 16]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.12} />
              </mesh>
            ))}

            {/* Optical Glass Lens */}
            <mesh position={[0, 0, 0.005]}>
              <boxGeometry args={[colW * 2.95, rowH * 2.95, 0.01]} />
              <meshPhysicalMaterial
                color="#a7f3d0"
                transparent
                opacity={0.12}
                transmission={0.88}
                roughness={0.06}
                clearcoat={1.0}
              />
            </mesh>
          </group>

          {/* 11. 4 Color-Coded Symmetrical Laser Cords connecting opposite pairs */}
          {symmetricBeams.map((beam, idx) => {
            const dx = beam.p2[0] - beam.p1[0];
            const dy = beam.p2[1] - beam.p1[1];
            const length = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);
            return (
              <group key={`beam-${idx}`} position={[0, 0, 0.018]}>
                {/* Connecting Laser Tube */}
                <mesh rotation={[0, 0, angle]}>
                  <boxGeometry args={[length, 0.014, 0.014]} />
                  <meshStandardMaterial
                    color={beam.color}
                    emissive={beam.color}
                    emissiveIntensity={0.6}
                    roughness={0.2}
                  />
                </mesh>
                {/* Endpoint beads */}
                <mesh position={[beam.p1[0], beam.p1[1], 0]}>
                  <sphereGeometry args={[0.024, 16, 16]} />
                  <meshStandardMaterial color={beam.color} />
                </mesh>
                <mesh position={[beam.p2[0], beam.p2[1], 0]}>
                  <sphereGeometry args={[0.024, 16, 16]} />
                  <meshStandardMaterial color={beam.color} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* 12. Laser-Engraved Brass Plaque on Easel Front Shelf */}
      <group position={[0, -1.82, 0.40]} rotation={[-0.22, 0, 0]}>
        {/* Plaque Plate */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[3.8, 0.32, 0.025]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.25} metalness={0.7} roughness={0.15} />
        </mesh>
        {/* Plaque Outer Beveled Border */}
        <mesh position={[0, 0, 0.008]}>
          <boxGeometry args={[3.86, 0.36, 0.01]} />
          <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Formula Line 1 */}
        <Text
          position={[0, 0.06, 0.018]}
          fontSize={0.13}
          color="#000000"
          fontWeight="900"
          anchorX="center"
          anchorY="middle"
        >
          {`3×3 Magic Window Sum = 9 × Center = 9 × ${safeCenter} = ${safeCenter * 9}`}
        </Text>
        {/* Formula Line 2 */}
        <Text
          position={[0, -0.065, 0.018]}
          fontSize={0.105}
          color="#065f46"
          fontWeight="900"
          anchorX="center"
          anchorY="middle"
        >
          {`Opposite Pairs Balance: 4 × (2×${safeCenter}) + ${safeCenter} = ${safeCenter * 8} + ${safeCenter} = ${safeCenter * 9}`}
        </Text>
      </group>
    </group>
  );
}

// =======================================================================
// 4. PHOTOREALISTIC CELESTIAL ORRERY & CLOCK (SECTION 1.1)
// =======================================================================
export function CelestialOrrery3D() {
  const orreryRef = useRef();

  useFrame((state, delta) => {
    if (orreryRef.current) {
      orreryRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* Heavy Ornate Brass Pedestal Stand */}
      <mesh position={[0, -0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.92, 0.26, 32]} />
        <meshStandardMaterial color="#92400e" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.52, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.58, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.94} roughness={0.16} />
      </mesh>

      {/* Rotating Celestial Rings & Planetary Arms */}
      <group ref={orreryRef} position={[0, 0.1, 0]}>
        {/* Tiered Armillary Rings with safe distinct radii preventing intersection */}
        <mesh>
          <torusGeometry args={[1.55, 0.028, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.14} />
        </mesh>
        <mesh rotation={[Math.PI / 3.2, 0, 0]}>
          <torusGeometry args={[1.42, 0.025, 16, 64]} />
          <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2.2, 0]}>
          <torusGeometry args={[1.3, 0.024, 16, 64]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.94} roughness={0.16} />
        </mesh>

        {/* Central Brilliant Radiant Sun with Corona Glow */}
        <mesh castShadow>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshBasicMaterial
            color="#fef08a"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Geared Orbit Arm for Earth at vertical clearance (y = -0.15) */}
        <group position={[0, -0.15, 0]} rotation={[0, 1.2, 0]}>
          <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 1.1, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} />
          </mesh>
          {/* Earth & Moon System */}
          <group position={[1.1, 0, 0]}>
            {/* Tilted Earth Globe (23.5° axial tilt) */}
            <mesh rotation={[0.41, 0, 0]} castShadow>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshStandardMaterial color="#0284c7" roughness={0.35} />
            </mesh>
            {/* Moon on separate orbit ring */}
            <group rotation={[0, 2.5, 0]}>
              <mesh position={[0.3, 0.08, 0]} castShadow>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// =======================================================================
// 5. ANCIENT SANSKRIT PALM-LEAF MANUSCRIPT & TABLA (SECTION 1.2)
// =======================================================================
export function AncientManuscript3D() {
  return (
    <group position={[0, -0.15, 0]}>
      {/* Carved Rosewood Altar Desk Stand */}
      <mesh position={[0, -0.32, 0]} receiveShadow>
        <boxGeometry args={[3.8, 0.12, 2.2]} />
        <meshStandardMaterial color="#3b160b" roughness={0.65} />
      </mesh>

      {/* Sanskrit Palm-Leaf Manuscript Bundle (Virahānka Sanskrit Metre) */}
      <group position={[-0.4, 0.02, 0]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`leaf-${i}`} position={[0, i * 0.028, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.016, 0.65]} />
            <meshStandardMaterial
              color={i === 4 ? '#fef3c7' : '#fde68a'}
              roughness={0.85}
            />
          </mesh>
        ))}
        {/* Red Silk Binding Sutra Cords */}
        {[-0.65, 0.65].map((cx, idx) => (
          <mesh key={idx} position={[cx, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.72, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Indian Dayan Rhythm Tabla Drum (Laghu & Guru Poetic Beats) */}
      <group position={[1.2, 0.15, 0.2]} rotation={[0.2, 0, -0.2]}>
        {/* Resonant Rosewood Shell */}
        <mesh castShadow>
          <cylinderGeometry args={[0.38, 0.48, 0.65, 24]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.3} />
        </mesh>
        {/* Drumhead Parchment (Puri) */}
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.02, 24]} />
          <meshStandardMaterial color="#fdfbf7" roughness={0.6} />
        </mesh>
        {/* Black Syahi Resonance Disc in Center */}
        <mesh position={[0, 0.345, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.015, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}

// =======================================================================
// 6. 3D GEOMETRIC CRYSTAL VOXELS (SECTION 1.3: N³, N², N)
// =======================================================================
export function VoxelCube3D() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15 + 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {[-1, 0, 1].map(x =>
        [-1, 0, 1].map(y =>
          [-1, 0, 1].map(z => (
            <mesh key={`v-${x}-${y}-${z}`} position={[x * 0.46, y * 0.46, z * 0.46]} castShadow>
              <boxGeometry args={[0.38, 0.38, 0.38]} />
              <meshPhysicalMaterial
                color={(x + y + z) % 2 === 0 ? '#4f46e5' : '#0284c7'}
                roughness={0.08}
                clearcoat={0.9}
                clearcoatRoughness={0.1}
                transmission={0.65}
                ior={1.45}
                metalness={0.1}
              />
            </mesh>
          ))
        )
      )}
    </group>
  );
}

// =======================================================================
// 7. 3D WOOD GNOMON PUZZLE (SECTION 1.4: 1 + 3 + 5 + 7 = 4²)
// =======================================================================
export function GnomonPuzzle3D() {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Oak Craftsman Table */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.12, 3.6]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>
      {/* 4 Interlocking L-shaped Gnomon Layers */}
      {[
        { layer: 0, color: '#dc2626' },
        { layer: 1, color: '#ea580c' },
        { layer: 2, color: '#d97706' },
        { layer: 3, color: '#16a34a' }
      ].map(({ layer, color }) =>
        [0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => {
            if (Math.max(r, c) !== layer) return null;
            return (
              <mesh key={`g-${r}-${c}`} position={[(c - 1.5) * 0.46, 0.08, (r - 1.5) * 0.46]} castShadow receiveShadow>
                <boxGeometry args={[0.42, 0.18, 0.42]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
              </mesh>
            );
          })
        )
      )}
    </group>
  );
}

// =======================================================================
// 8. PHOTOREALISTIC QUIZ LAB 3D: DYNAMIC QUESTION MODELS & MASTER VAULT
// Real-time photorealistic 3D models for NCERT Ganita Prakash Chapter 1 Questions
// =======================================================================
export function QuizPhotorealisticLab3D({
  activeQuestionId = 1,
  isSubmitted = false,
  score = 0,
  totalClues = 12,
  currentSlide = 1,
  userAnswer
}) {
  const isUnlocked = isSubmitted && score >= 8;
  const trophyRef = useRef();
  const orbitGroupRef = useRef();
  const animRef = useRef();
  const floatRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (floatRef.current) {
      floatRef.current.position.y = 0.3 + Math.sin(t * 1.2) * 0.04;
    }
    if (trophyRef.current && isUnlocked) {
      trophyRef.current.rotation.y += delta * 0.6;
    }
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.5;
    }
    if (animRef.current) {
      animRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Polished Showcase Platform (Light Theme Marble & Gold) */}
      <mesh position={[0, -0.08, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.0, 2.2, 0.12, 48]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.2} metalness={0.15} clearcoat={0.8} />
      </mesh>
      {/* Brass Edge Bevel Rim */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[1.96, 2.01, 0.02, 48]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.14} />
      </mesh>
      {/* Emerald Top Inlay */}
      <mesh position={[0, -0.015, 0]} receiveShadow>
        <cylinderGeometry args={[1.85, 1.85, 0.02, 48]} />
        <meshPhysicalMaterial color="#0d9488" roughness={0.4} metalness={0.1} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.4, 48]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.15} />
      </mesh>

      {isSubmitted ? (
        <group position={[0, 0.1, 0]}>
          {isUnlocked ? (
            <group ref={trophyRef} position={[0, 0.2, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.38, 0.45, 0.15, 24]} />
                <meshPhysicalMaterial color="#0a0a0a" roughness={0.1} clearcoat={1.0} />
              </mesh>
              <mesh position={[0, 0.32, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.2, 0.5, 16]} />
                <meshPhysicalMaterial color="#f59e0b" metalness={0.98} roughness={0.06} clearcoat={1.0} />
              </mesh>
              <mesh position={[0, 0.72, 0]} castShadow>
                <sphereGeometry args={[0.28, 24, 24]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.98} roughness={0.04} clearcoat={1.0} />
              </mesh>
              {[-1, 1].map((side, i) => (
                <mesh key={i} position={[side * 0.35, 0.68, 0]} rotation={[0, 0, side * 0.4]}>
                  <torusGeometry args={[0.1, 0.025, 12, 24, Math.PI]} />
                  <meshPhysicalMaterial color="#f59e0b" metalness={0.98} roughness={0.1} />
                </mesh>
              ))}
              <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.04, 5]} />
                <meshPhysicalMaterial color="#fef08a" metalness={0.95} roughness={0.05} emissive="#fbbf24" emissiveIntensity={0.3} />
              </mesh>
              {[-0.55, 0.55].map((bx, bIdx) => (
                <mesh key={`gold-${bIdx}`} position={[bx, 0.06, 0.25]} rotation={[0, bIdx * 0.3, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.08, 0.14]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.1} />
                </mesh>
              ))}
              <Text position={[0, 1.35, 0]} fontSize={0.1} color="#fbbf24" anchorX="center" anchorY="middle">
                NCERT PATTERN GRAND MASTER
              </Text>
            </group>
          ) : (
            <group position={[0, 0.4, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.8, 0.8, 0.6]} />
                <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.2} clearcoat={0.6} />
              </mesh>
              <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
                <meshStandardMaterial color="#f1f5f9" metalness={0.96} roughness={0.1} />
              </mesh>
              <Text position={[0, 0.6, 0]} fontSize={0.09} color="#ef4444" anchorX="center" anchorY="middle">
                {'ACCESS DENIED \u2022 SCORE < 80%'}
              </Text>
              <Text position={[0, 0.45, 0]} fontSize={0.07} color="#94a3b8" anchorX="center" anchorY="middle">
                {`Score: ${score}/${totalClues} \u2022 Retry to Unlock`}
              </Text>
            </group>
          )}
        </group>
      ) : (
        <group ref={floatRef} position={[0, 0.3, 0]}>
          {activeQuestionId === 1 && (
            <group position={[0, 0.2, 0]}>
              <mesh position={[0, 0.1, 0]} castShadow>
                <sphereGeometry args={[0.32, 24, 24]} />
                <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={0.8} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.38, 24, 24]} />
                <meshBasicMaterial color="#fef08a" transparent opacity={0.15} />
              </mesh>
              <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <torusGeometry args={[0.85, 0.006, 16, 64]} />
                <meshStandardMaterial color="#38bdf8" metalness={0.9} />
              </mesh>
              <mesh rotation={[Math.PI / 2.1, 0.15, 0]}>
                <torusGeometry args={[1.2, 0.005, 16, 64]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
              <group ref={orbitGroupRef}>
                <group position={[0.85, 0, 0]}>
                  <mesh castShadow>
                    <sphereGeometry args={[0.12, 20, 20]} />
                    <meshStandardMaterial color="#0284c7" roughness={0.4} />
                  </mesh>
                  <mesh position={[0.22, 0, 0]} castShadow>
                    <sphereGeometry args={[0.04, 12, 12]} />
                    <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
                  </mesh>
                </group>
                <mesh position={[-1.2, 0, 0]} castShadow>
                  <sphereGeometry args={[0.09, 16, 16]} />
                  <meshStandardMaterial color="#dc2626" roughness={0.5} />
                </mesh>
              </group>
              <Text position={[0, -0.65, 0.8]} fontSize={0.065} color="#0f766e" anchorX="center" anchorY="middle">
                Gravitation and Orbital Motion
              </Text>
            </group>
          )}

          {activeQuestionId === 2 && (
            <group position={[0, 0.05, 0]}>
              <mesh position={[0, -0.06, 0]} receiveShadow castShadow>
                <boxGeometry args={[1.8, 0.04, 0.8]} />
                <meshStandardMaterial color="#78350f" roughness={0.7} />
              </mesh>
              <mesh position={[0, -0.035, 0]} rotation={[-0.05, 0, 0]}>
                <boxGeometry args={[1.6, 0.012, 0.65]} />
                <meshStandardMaterial color="#fef3c7" roughness={0.85} />
              </mesh>
              <group position={[-0.45, 0.12, 0]}>
                {[0.12, 0.24, 0.12, 0.24, 0.24].map((w, i) => (
                  <mesh key={i} position={[i * 0.22 - 0.22, 0, 0]} castShadow>
                    <boxGeometry args={[w, 0.22, 0.1]} />
                    <meshStandardMaterial color={w > 0.15 ? '#d97706' : '#0d9488'} metalness={0.8} />
                  </mesh>
                ))}
              </group>
              <group ref={animRef} position={[0.5, 0.12, 0]}>
                {[1, 2, 3, 5, 8].map((val, vi) => (
                  <mesh key={vi} position={[vi * 0.06 - 0.15, 0, 0]} rotation={[0, vi * 0.5, 0]}>
                    <torusGeometry args={[0.04 * val, 0.01, 12, 24, Math.PI / 1.8]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
                  </mesh>
                ))}
              </group>
              <Text position={[0, -0.45, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                Virahanka Syllable Meters (1, 2, 3, 5, 8, 13...)
              </Text>
            </group>
          )}

          {activeQuestionId === 3 && (
            <group position={[0, 0.1, 0]}>
              <group position={[-0.7, 0, 0]}>
                {Array.from({ length: 8 }).map((_, row) => {
                  const rowCount = row + 1;
                  return Array.from({ length: rowCount }).map((_, col) => (
                    <mesh key={`t-${row}-${col}`} position={[(col - (rowCount - 1) / 2) * 0.09, 0.04, (row - 3.5) * 0.09]} castShadow>
                      <sphereGeometry args={[0.032, 14, 14]} />
                      <meshStandardMaterial color="#059669" metalness={0.6} roughness={0.2} />
                    </mesh>
                  ));
                })}
                <Text position={[0, -0.08, 0.45]} fontSize={0.055} color="#059669" anchorX="center">
                  {'T\u2088 = 36'}
                </Text>
              </group>
              <group position={[0, 0.04, 0]}>
                <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.12, 0.025, 0.025]} /><meshStandardMaterial color="#f59e0b" metalness={0.9} /></mesh>
                <mesh position={[0, -0.03, 0]}><boxGeometry args={[0.12, 0.025, 0.025]} /><meshStandardMaterial color="#f59e0b" metalness={0.9} /></mesh>
              </group>
              <group position={[0.7, 0, 0]}>
                {Array.from({ length: 6 }).map((_, r) =>
                  Array.from({ length: 6 }).map((_, c) => (
                    <mesh key={`s-${r}-${c}`} position={[(c - 2.5) * 0.09, 0.04, (r - 2.5) * 0.09]} castShadow>
                      <sphereGeometry args={[0.032, 14, 14]} />
                      <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.2} />
                    </mesh>
                  ))
                )}
                <Text position={[0, -0.08, 0.45]} fontSize={0.055} color="#dc2626" anchorX="center">
                  {'6\u00B2 = 36'}
                </Text>
              </group>
              <Text position={[0, -0.45, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                Dual Identity of 36: Triangular and Square
              </Text>
            </group>
          )}

          {activeQuestionId === 4 && (
            <group ref={animRef} position={[0, 0.1, 0]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.07, 6]} />
                <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} />
              </mesh>
              {[
                { count: 6, rad: 0.22, col: '#f59e0b' },
                { count: 12, rad: 0.44, col: '#10b981' },
                { count: 18, rad: 0.66, col: '#3b82f6' },
                { count: 24, rad: 0.88, col: '#8b5cf6' }
              ].map((ring, rIdx) => (
                <group key={rIdx}>
                  {Array.from({ length: ring.count }).map((_, i) => {
                    const ang = (i * 2 * Math.PI) / ring.count;
                    return (
                      <mesh key={i} position={[ring.rad * Math.cos(ang), 0.04, ring.rad * Math.sin(ang)]} castShadow>
                        <cylinderGeometry args={[0.045, 0.045, 0.06, 6]} />
                        <meshStandardMaterial color={ring.col} metalness={0.85} roughness={0.15} />
                      </mesh>
                    );
                  })}
                </group>
              ))}
              <Text position={[0, -0.45, 0.8]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                Hexagonal Numbers (1, 7, 19, 37, 61...)
              </Text>
            </group>
          )}

          {activeQuestionId === 5 && (
            <group position={[0, 0.1, 0]}>
              {[
                { size: 0.15, col: '#ef4444', h: 0.15 },
                { size: 0.3, col: '#f97316', h: 0.13 },
                { size: 0.45, col: '#eab308', h: 0.11 },
                { size: 0.6, col: '#22c55e', h: 0.09 },
                { size: 0.75, col: '#06b6d4', h: 0.07 },
                { size: 0.9, col: '#8b5cf6', h: 0.05 }
              ].map((layer, lIdx) => (
                <mesh key={lIdx} position={[-0.45 + layer.size / 2, layer.h / 2, -0.45 + layer.size / 2]} castShadow>
                  <boxGeometry args={[layer.size, layer.h, layer.size]} />
                  <meshStandardMaterial color={layer.col} roughness={0.3} metalness={0.2} transparent opacity={0.85} />
                </mesh>
              ))}
              <Text position={[0, -0.4, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                {'L-Gnomons: 1 + 3 + 5 + 7 + ... = n\u00B2'}
              </Text>
            </group>
          )}

          {activeQuestionId === 6 && (
            <group ref={animRef} position={[0, 0.08, 0]}>
              {Array.from({ length: 7 }).map((_, col) => {
                const count = col < 4 ? col + 1 : 7 - col;
                const px = (col - 3) * 0.2;
                const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];
                return Array.from({ length: count }).map((_, row) => (
                  <mesh key={`${col}-${row}`} position={[px, 0.06, (row - (count - 1) / 2) * 0.2]} castShadow>
                    <boxGeometry args={[0.17, 0.12, 0.17]} />
                    <meshStandardMaterial color={colors[col]} metalness={0.75} roughness={0.2} />
                  </mesh>
                ));
              })}
              <Text position={[0, -0.4, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                {'Up and Down Sum: 1+2+...+n+...+1 = n\u00B2'}
              </Text>
            </group>
          )}

          {activeQuestionId === 7 && (
            <group position={[0, 0.1, 0]}>
              <group position={[-0.5, 0.04, 0]}>
                {Array.from({ length: 3 }).map((_, row) =>
                  Array.from({ length: row + 1 }).map((_, col) => (
                    <mesh key={`t3-${row}-${col}`} position={[(col - row / 2) * 0.14, 0, row * 0.14 - 0.14]} castShadow>
                      <sphereGeometry args={[0.05, 14, 14]} />
                      <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.2} />
                    </mesh>
                  ))
                )}
                <Text position={[0, -0.08, 0.25]} fontSize={0.05} color="#059669" anchorX="center">
                  {'T\u2083 = 6'}
                </Text>
              </group>
              <group position={[0, 0.04, 0]}>
                <mesh><boxGeometry args={[0.1, 0.02, 0.02]} /><meshStandardMaterial color="#f59e0b" metalness={0.9} /></mesh>
                <mesh><boxGeometry args={[0.02, 0.02, 0.1]} /><meshStandardMaterial color="#f59e0b" metalness={0.9} /></mesh>
              </group>
              <group position={[0.5, 0.04, 0]}>
                {Array.from({ length: 4 }).map((_, row) =>
                  Array.from({ length: row + 1 }).map((_, col) => (
                    <mesh key={`t4-${row}-${col}`} position={[(col - row / 2) * 0.12, 0, row * 0.12 - 0.18]} castShadow>
                      <sphereGeometry args={[0.04, 14, 14]} />
                      <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.2} />
                    </mesh>
                  ))
                )}
                <Text position={[0, -0.08, 0.25]} fontSize={0.05} color="#d97706" anchorX="center">
                  {'T\u2084 = 10'}
                </Text>
              </group>
              <Text position={[0, -0.45, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                {'T\u2083 + T\u2084 = 16 = 4\u00B2 (Square)'}
              </Text>
            </group>
          )}

          {activeQuestionId === 8 && (
            <group ref={animRef} position={[0, 0.1, 0]}>
              <mesh position={[0, 0.05, 0]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} emissive="#dc2626" emissiveIntensity={0.2} />
              </mesh>
              {Array.from({ length: 6 }).map((_, i) => {
                const ang = (i * 2 * Math.PI) / 6;
                return (
                  <group key={i} position={[0.38 * Math.cos(ang), 0.05, 0.38 * Math.sin(ang)]} rotation={[0, ang, 0]}>
                    <mesh castShadow>
                      <coneGeometry args={[0.14, 0.12, 3]} />
                      <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
                    </mesh>
                  </group>
                );
              })}
              {Array.from({ length: 12 }).map((_, i) => {
                const ang = (i * 2 * Math.PI) / 12;
                return (
                  <mesh key={`outer-${i}`} position={[0.7 * Math.cos(ang), 0.05, 0.7 * Math.sin(ang)]}>
                    <sphereGeometry args={[0.03, 12, 12]} />
                    <meshStandardMaterial color="#38bdf8" metalness={0.8} />
                  </mesh>
                );
              })}
              <Text position={[0, -0.45, 0.8]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                (6 x Triangular) + 1 = Hexagonal Number
              </Text>
            </group>
          )}

          {activeQuestionId === 9 && (
            <group ref={animRef} position={[0, 0.2, 0]}>
              {[-0.18, 0, 0.18].map((x, xi) =>
                [-0.18, 0, 0.18].map((y, yi) =>
                  [-0.18, 0, 0.18].map((z, zi) => (
                    <mesh key={`${xi}-${yi}-${zi}`} position={[x, y, z]} castShadow>
                      <boxGeometry args={[0.16, 0.16, 0.16]} />
                      <meshStandardMaterial
                        color={['#0284c7', '#0369a1', '#075985'][xi]}
                        metalness={0.85}
                        roughness={0.15}
                      />
                    </mesh>
                  ))
                )
              )}
              <Text position={[0, -0.55, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                {'Sum of Hexagonal Numbers = Cubes (n\u00B3)'}
              </Text>
            </group>
          )}

          {activeQuestionId === 10 && (
            <group ref={animRef} position={[0, 0.1, 0]}>
              <group position={[-0.5, 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.38, 0.38, 0.07, 5]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
                </mesh>
                {Array.from({ length: 5 }).map((_, i) => {
                  const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                  return (
                    <mesh key={i} position={[0.38 * Math.cos(ang), 0.05, 0.38 * Math.sin(ang)]}>
                      <sphereGeometry args={[0.04, 12, 12]} />
                      <meshBasicMaterial color="#06b6d4" />
                    </mesh>
                  );
                })}
                <Text position={[0, -0.1, 0.5]} fontSize={0.05} color="#f59e0b" anchorX="center">V=5, E=5</Text>
              </group>
              <group position={[0.5, 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.38, 0.38, 0.07, 6]} />
                  <meshStandardMaterial color="#0d9488" metalness={0.9} roughness={0.2} />
                </mesh>
                {Array.from({ length: 6 }).map((_, i) => {
                  const ang = (i * 2 * Math.PI) / 6;
                  return (
                    <mesh key={i} position={[0.38 * Math.cos(ang), 0.05, 0.38 * Math.sin(ang)]}>
                      <sphereGeometry args={[0.04, 12, 12]} />
                      <meshBasicMaterial color="#06b6d4" />
                    </mesh>
                  );
                })}
                <Text position={[0, -0.1, 0.5]} fontSize={0.05} color="#0d9488" anchorX="center">V=6, E=6</Text>
              </group>
              <Text position={[0, -0.45, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                Regular Polygons: Vertices = Edges (V = E)
              </Text>
            </group>
          )}

          {activeQuestionId === 11 && (
            <group ref={animRef} position={[0, 0.12, 0]}>
              {Array.from({ length: 5 }).map((_, i) => {
                const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                return (
                  <mesh key={i} position={[0.6 * Math.cos(ang), 0.04, 0.6 * Math.sin(ang)]} castShadow>
                    <sphereGeometry args={[0.065, 16, 16]} />
                    <meshStandardMaterial color="#ec4899" metalness={0.9} roughness={0.1} />
                  </mesh>
                );
              })}
              {[
                [0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]
              ].map(([a, b], eIdx) => {
                const angA = (a * 2 * Math.PI) / 5 - Math.PI / 2;
                const angB = (b * 2 * Math.PI) / 5 - Math.PI / 2;
                const ax = 0.6 * Math.cos(angA), az = 0.6 * Math.sin(angA);
                const bx = 0.6 * Math.cos(angB), bz = 0.6 * Math.sin(angB);
                const mx = (ax + bx) / 2, mz = (az + bz) / 2;
                const dist = Math.hypot(bx - ax, bz - az);
                const angle = Math.atan2(bz - az, bx - ax);
                return (
                  <mesh key={eIdx} position={[mx, 0.04, mz]} rotation={[0, -angle, 0]}>
                    <boxGeometry args={[dist, 0.012, 0.012]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                );
              })}
              <Text position={[0, -0.45, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                {'Complete Graph K\u2085: 10 Chords = T\u2084'}
              </Text>
            </group>
          )}

          {activeQuestionId === 12 && (
            <group ref={animRef} position={[0, 0.1, 0]}>
              <mesh castShadow position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.55, 0.55, 0.07, 3]} />
                <meshStandardMaterial color="#06b6d4" metalness={0.92} roughness={0.15} />
              </mesh>
              <mesh castShadow position={[0, 0.04, 0]} rotation={[0, Math.PI, 0]}>
                <cylinderGeometry args={[0.55, 0.55, 0.07, 3]} />
                <meshStandardMaterial color="#38bdf8" metalness={0.92} roughness={0.15} />
              </mesh>
              {Array.from({ length: 6 }).map((_, i) => {
                const ang = (i * 2 * Math.PI) / 6;
                return (
                  <mesh key={i} position={[0.5 * Math.cos(ang), 0.04, 0.5 * Math.sin(ang)]} castShadow>
                    <coneGeometry args={[0.1, 0.18, 3]} />
                    <meshStandardMaterial color="#e0f2fe" metalness={0.95} roughness={0.1} />
                  </mesh>
                );
              })}
              {Array.from({ length: 12 }).map((_, i) => {
                const ang = (i * 2 * Math.PI) / 12 + Math.PI / 12;
                return (
                  <mesh key={`s-${i}`} position={[0.72 * Math.cos(ang), 0.04, 0.72 * Math.sin(ang)]} castShadow>
                    <coneGeometry args={[0.05, 0.1, 3]} />
                    <meshStandardMaterial color="#bae6fd" metalness={0.9} roughness={0.12} />
                  </mesh>
                );
              })}
              <Text position={[0, -0.45, 0.7]} fontSize={0.06} color="#0f766e" anchorX="center" anchorY="middle">
                {'Koch Snowflake: 3 \u00D7 4\u1D4F Segments'}
              </Text>
            </group>
          )}
        </group>
      )}
    </group>
  );
}

// Backward-compatible alias
export const DetectiveVaultDesk3D = QuizPhotorealisticLab3D;


// =======================================================================
// 8. SUPERMARKET CHECKOUT (UNIFIED FRONT-FACING BILLING POS)
// =======================================================================
export function SupermarketCheckout3D(props) {
  return <MarketProduce3D {...props} />;
}

// =======================================================================
// 9. ULTRA-PHOTOREALISTIC IVORY CUBICAL DIE (BEVELED WITH 6 FACES)
// =======================================================================
export function PhotorealisticIvoryDie3D({ size = 0.28, primaryColor = '#fcf9f2' }) {
  const half = size / 2;
  const offset = half + 0.0015;

  return (
    <group castShadow receiveShadow>
      {/* High-Gloss Ivory Core with Subsurface Scattering Feel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          color={primaryColor}
          roughness={0.14}
          metalness={0.02}
          clearcoat={0.92}
          clearcoatRoughness={0.08}
          transmission={0.06}
          ior={1.54}
          reflectivity={0.9}
        />
      </mesh>

      {/* Subtle Rounded Corner Spheres to soften edges */}
      {[-half, half].map((cx, i) =>
        [-half, half].map((cy, j) =>
          [-half, half].map((cz, k) => (
            <mesh key={`c-${i}-${j}-${k}`} position={[cx, cy, cz]}>
              <sphereGeometry args={[size * 0.07, 8, 8]} />
              <meshPhysicalMaterial
                color={primaryColor}
                roughness={0.14}
                clearcoat={0.9}
              />
            </mesh>
          ))
        )
      )}

      {/* FACE +Y (TOP): Single Deep Crimson Ace Pip (1) */}
      <mesh position={[0, offset, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[size * 0.16, 24]} />
        <meshStandardMaterial color="#dc2626" roughness={0.25} />
      </mesh>

      {/* FACE -Y (BOTTOM): 6 Obsidian Inset Pips (6) */}
      <group position={[0, -offset, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {[
          [-size * 0.22, -size * 0.24],
          [-size * 0.22, 0],
          [-size * 0.22, size * 0.24],
          [size * 0.22, -size * 0.24],
          [size * 0.22, 0],
          [size * 0.22, size * 0.24]
        ].map(([px, py], idx) => (
          <mesh key={`pip6-${idx}`} position={[px, py, 0]}>
            <circleGeometry args={[size * 0.085, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* FACE +Z (FRONT): 2 Obsidian Pips (2) */}
      <group position={[0, 0, offset]} rotation={[0, 0, 0]}>
        {[
          [-size * 0.22, -size * 0.22],
          [size * 0.22, size * 0.22]
        ].map(([px, py], idx) => (
          <mesh key={`pip2-${idx}`} position={[px, py, 0]}>
            <circleGeometry args={[size * 0.09, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* FACE -Z (BACK): 5 Obsidian Pips (5) */}
      <group position={[0, 0, -offset]} rotation={[0, Math.PI, 0]}>
        {[
          [-size * 0.22, -size * 0.22],
          [size * 0.22, -size * 0.22],
          [-size * 0.22, size * 0.22],
          [size * 0.22, size * 0.22],
          [0, 0]
        ].map(([px, py], idx) => (
          <mesh key={`pip5-${idx}`} position={[px, py, 0]}>
            <circleGeometry args={[size * 0.085, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* FACE +X (RIGHT): 3 Obsidian Pips (3) */}
      <group position={[offset, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[
          [-size * 0.22, -size * 0.22],
          [0, 0],
          [size * 0.22, size * 0.22]
        ].map(([px, py], idx) => (
          <mesh key={`pip3-${idx}`} position={[px, py, 0]}>
            <circleGeometry args={[size * 0.088, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* FACE -X (LEFT): 4 Obsidian Pips (4) */}
      <group position={[-offset, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {[
          [-size * 0.22, -size * 0.22],
          [size * 0.22, -size * 0.22],
          [-size * 0.22, size * 0.22],
          [size * 0.22, size * 0.22]
        ].map(([px, py], idx) => (
          <mesh key={`pip4-${idx}`} position={[px, py, 0]}>
            <circleGeometry args={[size * 0.088, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// =======================================================================
// 10. ULTRA-REALISTIC ORGANIC SCULPTED HUMAN HAND (NO ROBOTIC JOINTS)
// =======================================================================
// =======================================================================
// 10. ULTRA-REALISTIC ORGANIC SCULPTED HUMAN HAND & ARM (ZERO-GAP ANATOMY)
// =======================================================================
export function PhotorealisticSculptedHand3D({ handTiltRef, thumbRef, fingersRef }) {
  // Lifelike human skin tones & keratin material properties
  const skinTone = '#dca082';
  const skinCreaseTone = '#c88668';
  const nailTone = '#fce2d6';

  return (
    <group ref={handTiltRef} rotation={[0.55, -0.2, -0.3]}>
      {/* ================= 1. FOREARM & SLEEVE ================= */}
      {/* Tailored Navy Suit Sleeve */}
      <group position={[0, 0.65, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.26, 0.28, 0.55, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Crisp White Shirt Inner Cuff Trim */}
        <mesh position={[0, -0.27, 0]}>
          <cylinderGeometry args={[0.245, 0.245, 0.05, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
      </group>

      {/* Seamless Forearm Muscle Flesh extending from sleeve to wrist */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.55, 32]} />
        <meshPhysicalMaterial
          color={skinTone}
          roughness={0.42}
          clearcoat={0.22}
          clearcoatRoughness={0.3}
          transmission={0.12}
          ior={1.44}
          sheen={0.35}
          sheenColor="#ffd0ba"
        />
      </mesh>

      {/* Anatomical Wrist Bridge with Ulnar Bone Head */}
      <group position={[0, -0.12, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.17, 0.19, 0.16, 24]} />
          <meshPhysicalMaterial color={skinTone} roughness={0.44} transmission={0.1} />
        </mesh>
        {/* Ulnar Head Prominence */}
        <mesh position={[0.17, 0.02, 0]} scale={[0.8, 1.2, 0.8]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshPhysicalMaterial color={skinCreaseTone} roughness={0.46} />
        </mesh>
      </group>

      {/* ================= 2. CONTINUOUS SCULPTED HUMAN PALM ================= */}
      <group position={[0, -0.32, 0]}>
        {/* Central Palm Body (Smooth Sculpted Human Contour) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]} scale={[1.2, 1.0, 0.65]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshPhysicalMaterial
            color={skinTone}
            roughness={0.4}
            clearcoat={0.25}
            transmission={0.12}
            ior={1.44}
            sheen={0.35}
            sheenColor="#ffd0ba"
          />
        </mesh>

        {/* Fleshy Thenar Pad (Base of Thumb) */}
        <mesh castShadow position={[-0.12, 0.04, 0.05]} scale={[1.1, 1.2, 0.9]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshPhysicalMaterial color={skinCreaseTone} roughness={0.44} transmission={0.1} />
        </mesh>

        {/* Hypothenar Pad (Outer Side of Palm) */}
        <mesh castShadow position={[0.13, 0.02, 0.04]} scale={[0.9, 1.3, 0.8]}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshPhysicalMaterial color={skinCreaseTone} roughness={0.44} transmission={0.1} />
        </mesh>

        {/* Dorsal Extensor Tendon Ridges */}
        {[-0.08, 0, 0.08].map((tx, i) => (
          <mesh key={`tendon-${i}`} position={[tx, 0.02, -0.1]} scale={[0.4, 1.0, 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28, 12]} />
            <meshPhysicalMaterial color={skinTone} roughness={0.48} transparent opacity={0.7} />
          </mesh>
        ))}

        {/* ================= 3. OPPOSABLE HUMAN THUMB ================= */}
        <group
          ref={thumbRef}
          position={[-0.15, 0.02, 0.06]}
          rotation={[0.3, 0.5, 0.6]}
        >
          {/* Proximal Thumb Phalanx */}
          <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.065, 0.14, 16, 20]} />
            <meshPhysicalMaterial color={skinTone} roughness={0.42} clearcoat={0.22} transmission={0.12} />
          </mesh>

          {/* Distal Thumb Phalanx & Fleshy Thumb Pad */}
          <group position={[0, -0.19, 0]} rotation={[-0.25, 0, 0]}>
            <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
              <capsuleGeometry args={[0.058, 0.12, 16, 20]} />
              <meshPhysicalMaterial color={skinTone} roughness={0.4} clearcoat={0.25} transmission={0.14} />
            </mesh>

            {/* Fleshy Touch Pad */}
            <mesh position={[0, -0.07, 0.03]} scale={[1.0, 1.2, 0.7]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshPhysicalMaterial color={skinCreaseTone} roughness={0.46} />
            </mesh>

            {/* Translucent Thumbnail with Lunula */}
            <group position={[0, -0.09, -0.052]} rotation={[0, Math.PI, 0]}>
              <mesh>
                <planeGeometry args={[0.065, 0.085]} />
                <meshPhysicalMaterial
                  color={nailTone}
                  roughness={0.08}
                  clearcoat={0.98}
                  clearcoatRoughness={0.03}
                  transmission={0.24}
                  ior={1.52}
                />
              </mesh>
              <mesh position={[0, -0.025, 0.001]}>
                <circleGeometry args={[0.02, 16, 0, Math.PI]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ================= 4. FOUR ARTICULATED HUMAN FINGERS ================= */}
        <group ref={fingersRef}>
          {[
            { name: 'Index', x: -0.12, len: 0.32, thick: 0.054, baseAngle: -0.08, curl: 0.4 },
            { name: 'Middle', x: -0.04, len: 0.36, thick: 0.058, baseAngle: 0.0, curl: 0.44 },
            { name: 'Ring', x: 0.04, len: 0.33, thick: 0.053, baseAngle: 0.06, curl: 0.48 },
            { name: 'Pinky', x: 0.12, len: 0.26, thick: 0.046, baseAngle: 0.14, curl: 0.54 }
          ].map((f) => (
            <group
              key={f.name}
              position={[f.x, -0.18, 0.02]}
              rotation={[f.curl * 0.6, 0, f.baseAngle]}
            >
              {/* Proximal Phalanx */}
              <mesh position={[0, -f.len * 0.28, 0]} castShadow receiveShadow>
                <capsuleGeometry args={[f.thick, f.len * 0.44, 16, 20]} />
                <meshPhysicalMaterial
                  color={skinTone}
                  roughness={0.42}
                  clearcoat={0.22}
                  transmission={0.12}
                  ior={1.44}
                  sheen={0.3}
                  sheenColor="#ffd0ba"
                />
              </mesh>

              {/* Knuckle Skin Crease */}
              <mesh position={[0, 0, -0.01]} scale={[1.1, 0.9, 1.1]}>
                <sphereGeometry args={[f.thick * 1.05, 16, 16]} />
                <meshPhysicalMaterial color={skinCreaseTone} roughness={0.48} />
              </mesh>

              {/* Intermediate & Distal Phalanges */}
              <group position={[0, -f.len * 0.52, 0]} rotation={[f.curl * 0.7, 0, 0]}>
                <mesh position={[0, -f.len * 0.22, 0]} castShadow receiveShadow>
                  <capsuleGeometry args={[f.thick * 0.88, f.len * 0.36, 16, 20]} />
                  <meshPhysicalMaterial color={skinTone} roughness={0.4} clearcoat={0.24} transmission={0.12} />
                </mesh>

                {/* Distal Fingertip & Fleshy Touch Pad */}
                <group position={[0, -f.len * 0.4, 0]} rotation={[f.curl * 0.75, 0, 0]}>
                  <mesh position={[0, -f.len * 0.14, 0]} castShadow receiveShadow>
                    <capsuleGeometry args={[f.thick * 0.78, f.len * 0.22, 16, 20]} />
                    <meshPhysicalMaterial color={skinTone} roughness={0.38} clearcoat={0.28} transmission={0.14} />
                  </mesh>

                  {/* Fleshy Palmar Finger Pad */}
                  <mesh position={[0, -f.len * 0.12, 0.025]} scale={[0.9, 1.1, 0.6]}>
                    <sphereGeometry args={[f.thick * 0.75, 16, 16]} />
                    <meshPhysicalMaterial color={skinCreaseTone} roughness={0.46} />
                  </mesh>

                  {/* High-Gloss Translucent Fingernail */}
                  <group position={[0, -f.len * 0.14, -f.thick * 0.72]} rotation={[0, Math.PI, 0]}>
                    <mesh>
                      <planeGeometry args={[f.thick * 1.1, f.thick * 1.35]} />
                      <meshPhysicalMaterial
                        color={nailTone}
                        roughness={0.08}
                        clearcoat={0.98}
                        clearcoatRoughness={0.03}
                        transmission={0.24}
                        ior={1.52}
                      />
                    </mesh>
                    {/* Lunula */}
                    <mesh position={[0, -f.thick * 0.42, 0.001]}>
                      <circleGeometry args={[f.thick * 0.32, 16, 0, Math.PI]} />
                      <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

// =======================================================================
// 11. AUTOMATIC PHOTOREALISTIC DICE ROLLING ON WOODEN LUDO BOARD
// =======================================================================
export function PhotorealisticHandDiceRoll3D({
  showTabletop = true
}) {
  const die1Ref = useRef();
  const die2Ref = useRef();

  // Automatic Rolling Physics Cycle: 4.0s loop
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const cycleTime = elapsed % 4.0;

    const groundY = 0.14; // Height of dice resting on Ludo table

    // ================= DIE 1 PHYSICS =================
    // Drops from (x: -0.85, y: 1.8, z: -0.7) and rolls to (x: 0.28, y: 0.14, z: 0.16)
    if (die1Ref.current) {
      let x = 0;
      let y = groundY;
      let z = 0;

      if (cycleTime < 0.65) {
        // Phase 1: Freefall & high-speed aerial tumbling (0 -> 0.65s)
        const p = cycleTime / 0.65;
        x = -0.75 + p * 0.82;
        z = -0.65 + p * 0.68;
        y = 1.85 - 1.71 * (p * p); // Parabolic gravity acceleration
        die1Ref.current.rotation.x += 0.28;
        die1Ref.current.rotation.y += 0.22;
        die1Ref.current.rotation.z += 0.32;
      } else if (cycleTime < 1.2) {
        // Phase 2: First High-Energy Rebound (0.65s -> 1.2s)
        const p = (cycleTime - 0.65) / 0.55;
        x = 0.07 + p * 0.14;
        z = 0.03 + p * 0.09;
        y = groundY + 0.38 * 4 * p * (1 - p); // Damped bounce arc
        die1Ref.current.rotation.x += 0.16;
        die1Ref.current.rotation.y += 0.12;
        die1Ref.current.rotation.z += 0.18;
      } else if (cycleTime < 1.65) {
        // Phase 3: Second Micro-Bounce & Table Surface Skidding (1.2s -> 1.65s)
        const p = (cycleTime - 1.2) / 0.45;
        x = 0.21 + p * 0.07;
        z = 0.12 + p * 0.04;
        y = groundY + 0.1 * 4 * p * (1 - p);
        die1Ref.current.rotation.x += 0.06;
        die1Ref.current.rotation.z += 0.08;
      } else {
        // Phase 4: Stable Rest & Display (1.65s -> 4.0s)
        // Showing Face 1 (Ace with Crimson Center Pip facing top)
        x = 0.28;
        z = 0.16;
        y = groundY;
        die1Ref.current.rotation.set(0, 0.42, 0);
      }

      die1Ref.current.position.set(x, Math.max(groundY, y), z);
    }

    // ================= DIE 2 PHYSICS =================
    // Drops from (x: -0.4, y: 1.95, z: -0.9) and rolls to (x: -0.22, y: 0.14, z: 0.38)
    if (die2Ref.current) {
      let x = 0;
      let y = groundY;
      let z = 0;

      if (cycleTime < 0.75) {
        // Phase 1: Freefall with reverse tumbling (0 -> 0.75s)
        const p = cycleTime / 0.75;
        x = -0.42 + p * 0.14;
        z = -0.85 + p * 0.98;
        y = 1.95 - 1.81 * (p * p);
        die2Ref.current.rotation.x -= 0.32;
        die2Ref.current.rotation.y += 0.26;
        die2Ref.current.rotation.z -= 0.22;
      } else if (cycleTime < 1.35) {
        // Phase 2: First High-Energy Rebound (0.75s -> 1.35s)
        const p = (cycleTime - 0.75) / 0.6;
        x = -0.28 + p * 0.04;
        z = 0.13 + p * 0.18;
        y = groundY + 0.32 * 4 * p * (1 - p);
        die2Ref.current.rotation.x -= 0.18;
        die2Ref.current.rotation.y += 0.14;
        die2Ref.current.rotation.z -= 0.12;
      } else if (cycleTime < 1.75) {
        // Phase 3: Second Micro-Bounce & Kinetic Friction Settle (1.35s -> 1.75s)
        const p = (cycleTime - 1.35) / 0.4;
        x = -0.24 + p * 0.02;
        z = 0.31 + p * 0.07;
        y = groundY + 0.08 * 4 * p * (1 - p);
        die2Ref.current.rotation.x -= 0.06;
      } else {
        // Phase 4: Stable Rest & Display (1.75s -> 4.0s)
        // Showing Face 6 on top (rotation around X by PI)
        x = -0.22;
        z = 0.38;
        y = groundY;
        die2Ref.current.rotation.set(Math.PI, -0.35, 0);
      }

      die2Ref.current.position.set(x, Math.max(groundY, y), z);
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* 1. AUTOMATIC TUMBLING IVORY DIE 1 */}
      <group ref={die1Ref} position={[-0.75, 1.85, -0.65]}>
        <PhotorealisticIvoryDie3D size={0.3} primaryColor="#fffef9" />
      </group>

      {/* 2. AUTOMATIC TUMBLING IVORY DIE 2 */}
      <group ref={die2Ref} position={[-0.42, 1.95, -0.85]}>
        <PhotorealisticIvoryDie3D size={0.3} primaryColor="#fbf9f0" />
      </group>

      {/* 3. SOLID POLISHED TEAKWOOD LUDO PLAYING TABLE */}
      {showTabletop && (
        <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
          {/* Heavy Beveled Wooden Table Base */}
          <mesh position={[0, -0.12, 0]} receiveShadow castShadow>
            <boxGeometry args={[3.4, 0.22, 3.4]} />
            <meshPhysicalMaterial
              color="#381a08"
              roughness={0.32}
              clearcoat={0.65}
              clearcoatRoughness={0.15}
              metalness={0.08}
            />
          </mesh>

          {/* Polished Ivory Playing Board Inset */}
          <mesh position={[0, 0.002, 0]} receiveShadow>
            <boxGeometry args={[3.0, 0.02, 3.0]} />
            <meshPhysicalMaterial color="#fefcf7" roughness={0.25} clearcoat={0.5} />
          </mesh>

          {/* 4 Colored Acrylic Corner Bases */}
          {[
            { x: -0.72, z: -0.72, color: '#dc2626' }, // Red Base
            { x: 0.72, z: -0.72, color: '#16a34a' },  // Green Base
            { x: -0.72, z: 0.72, color: '#2563eb' },  // Blue Base
            { x: 0.72, z: 0.72, color: '#facc15' }    // Yellow Base
          ].map((b, idx) => (
            <group key={`base-${idx}`} position={[b.x, 0.03, b.z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.1, 0.04, 1.1]} />
                <meshPhysicalMaterial
                  color={b.color}
                  roughness={0.12}
                  clearcoat={0.9}
                  transmission={0.25}
                  thickness={0.04}
                />
              </mesh>
              <mesh position={[0, 0.025, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 0.015, 32]} />
                <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={0.9} />
              </mesh>
            </group>
          ))}

          {/* Ludo Track Cross Chords */}
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.48, 0.015, 3.0]} />
            <meshPhysicalMaterial color="#e2e8f0" roughness={0.3} clearcoat={0.3} />
          </mesh>
          <mesh position={[0, 0.016, 0]}>
            <boxGeometry args={[3.0, 0.015, 0.48]} />
            <meshPhysicalMaterial color="#e2e8f0" roughness={0.3} clearcoat={0.3} />
          </mesh>

          {/* Brass Corner Reinforcement Brackets */}
          {[-1.48, 1.48].map((bx, i) =>
            [-1.48, 1.48].map((bz, j) => (
              <mesh key={`bracket-${i}-${j}`} position={[bx, 0.01, bz]} castShadow>
                <boxGeometry args={[0.32, 0.04, 0.32]} />
                <meshStandardMaterial color="#d97706" metalness={0.94} roughness={0.18} />
              </mesh>
            ))
          )}
        </group>
      )}
    </group>
  );
}

// =======================================================================
// 12. PHOTOREALISTIC BOUNCING SOCCER BALL (EXACT MATCH REFERENCE 3D)
// =======================================================================
export function PhotorealisticBouncingSoccerBall3D() {
  const ballGroupRef = useRef();
  const ballSpinRef = useRef();
  const shadowRef = useRef();

  // Create High-Definition 2048x1024 Photorealistic Truncated Icosahedron Maps
  const { colorMap, bumpMap } = useMemo(() => {
    const width = 2048;
    const height = 1024;

    // Color Canvas
    const cCanvas = document.createElement('canvas');
    cCanvas.width = width;
    cCanvas.height = height;
    const cCtx = cCanvas.getContext('2d');
    const cImgData = cCtx.createImageData(width, height);
    const cData = cImgData.data;

    // Bump Canvas
    const bCanvas = document.createElement('canvas');
    bCanvas.width = width;
    bCanvas.height = height;
    const bCtx = bCanvas.getContext('2d');
    const bImgData = bCtx.createImageData(width, height);
    const bData = bImgData.data;

    // 12 Pentagon Centers (Normalized Icosahedron Vertices)
    const phi = (1 + Math.sqrt(5)) / 2;
    const pentCenters = [
      [-1, 0, phi], [1, 0, phi], [-1, 0, -phi], [1, 0, -phi],
      [0, phi, 1], [0, phi, -1], [0, -phi, 1], [0, -phi, -1],
      [phi, 1, 0], [-phi, 1, 0], [phi, -1, 0], [-phi, -1, 0]
    ].map(([x, y, z]) => {
      const l = Math.sqrt(x * x + y * y + z * z);
      return [x / l, y / l, z / l];
    });

    // 20 Hexagon Centers (Normalized Dodecahedron Vertices)
    const hexCenters = [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      [0, 1 / phi, phi], [0, 1 / phi, -phi], [0, -1 / phi, phi], [0, -1 / phi, -phi],
      [1 / phi, phi, 0], [1 / phi, -phi, 0], [-1 / phi, phi, 0], [-1 / phi, -phi, 0],
      [phi, 0, 1 / phi], [phi, 0, -1 / phi], [-phi, 0, 1 / phi], [-phi, 0, -1 / phi]
    ].map(([x, y, z]) => {
      const l = Math.sqrt(x * x + y * y + z * z);
      return [x / l, y / l, z / l];
    });

    const allCenters = [
      ...pentCenters.map(p => ({ pos: p, isPent: true })),
      ...hexCenters.map(h => ({ pos: h, isPent: false }))
    ];

    // Compute pixel values over spherical coordinates
    for (let y = 0; y < height; y++) {
      const v = y / (height - 1);
      const lat = (0.5 - v) * Math.PI; // -PI/2 to PI/2
      const cosLat = Math.cos(lat);
      const py = Math.sin(lat);

      for (let x = 0; x < width; x++) {
        const u = x / (width - 1);
        const lon = (u - 0.5) * 2 * Math.PI; // -PI to PI
        const px = cosLat * Math.sin(lon);
        const pz = cosLat * Math.cos(lon);

        // Find nearest two centers
        let d1 = 999;
        let d2 = 999;
        let closestIsPent = false;

        for (let k = 0; k < 32; k++) {
          const c = allCenters[k];
          const dx = px - c.pos[0];
          const dy = py - c.pos[1];
          const dz = pz - c.pos[2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < d1) {
            d2 = d1;
            d1 = dist;
            closestIsPent = c.isPent;
          } else if (dist < d2) {
            d2 = dist;
          }
        }

        // Distance to the seam between panels
        const seamDist = d2 - d1;
        const seamWidth = 0.046; // Exact width of recessed seam

        const idx = (y * width + x) * 4;

        // Micro leather grain pattern
        const noise = (Math.sin(px * 160) * Math.sin(py * 160) * Math.sin(pz * 160)) * 0.5 + 0.5;

        if (seamDist < seamWidth) {
          // Deep Recessed Stitching Seam Crevice
          const t = seamDist / seamWidth;
          const seamShade = 18 + Math.floor(t * 35);
          cData[idx] = seamShade;
          cData[idx + 1] = seamShade;
          cData[idx + 2] = seamShade + 2;
          cData[idx + 3] = 255;

          // Deep indentation in bump map
          const bVal = Math.floor(t * 50);
          bData[idx] = bVal;
          bData[idx + 1] = bVal;
          bData[idx + 2] = bVal;
          bData[idx + 3] = 255;
        } else {
          // Puffy Convex Dome Curvature towards panel interior
          const dome = Math.min(1.0, (seamDist - seamWidth) / 0.14);
          const bevelFactor = 0.76 + 0.24 * Math.pow(dome, 0.45);

          if (closestIsPent) {
            // MATTE BLACK REGULAR PENTAGON
            const base = 28 + noise * 4;
            cData[idx] = Math.floor(base * bevelFactor);
            cData[idx + 1] = Math.floor(base * bevelFactor);
            cData[idx + 2] = Math.floor((base + 3) * bevelFactor);
            cData[idx + 3] = 255;

            // Convex bump elevation
            const bVal = Math.floor(100 + dome * 140);
            bData[idx] = bVal;
            bData[idx + 1] = bVal;
            bData[idx + 2] = bVal;
            bData[idx + 3] = 255;
          } else {
            // PUFFY WHITE REGULAR HEXAGON (Grain & Bevel)
            const base = 238 + noise * 12;
            cData[idx] = Math.floor(base * bevelFactor);
            cData[idx + 1] = Math.floor(base * bevelFactor);
            cData[idx + 2] = Math.floor((base - 2) * bevelFactor);
            cData[idx + 3] = 255;

            // Convex bump elevation with leather micro-pore texture
            const bVal = Math.floor(120 + dome * 130 + noise * 5);
            bData[idx] = bVal;
            bData[idx + 1] = bVal;
            bData[idx + 2] = bVal;
            bData[idx + 3] = 255;
          }
        }
      }
    }

    cCtx.putImageData(cImgData, 0, 0);
    bCtx.putImageData(bImgData, 0, 0);

    const cTex = new THREE.CanvasTexture(cCanvas);
    cTex.wrapS = THREE.RepeatWrapping;
    cTex.wrapT = THREE.ClampToEdgeWrapping;
    cTex.needsUpdate = true;

    const bTex = new THREE.CanvasTexture(bCanvas);
    bTex.wrapS = THREE.RepeatWrapping;
    bTex.wrapT = THREE.ClampToEdgeWrapping;
    bTex.needsUpdate = true;

    return { colorMap: cTex, bumpMap: bTex };
  }, []);

  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Photorealistic Physical Bounce Loop (2.2s loop with real compression & rotation)
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const cycleTime = elapsed % 2.2; // 2.2-second rhythm

    const ballRadius = 0.72;
    const groundY = -0.72; // Pitch surface elevation
    const apexY = 0.58; // Jump apex elevation

    let ballY = groundY + ballRadius;
    let squishY = 1.0;
    let squishXZ = 1.0;
    let shadowScale = 1.0;
    let shadowOpacity = 0.6;

    // Contact / Impact Compression Phase (0.0s -> 0.16s)
    if (cycleTime < 0.16) {
      const p = cycleTime / 0.16;
      const compression = Math.sin(p * Math.PI); // Smooth squash curve
      squishY = 1.0 - 0.18 * compression;
      squishXZ = 1.0 + 0.09 * compression;
      ballY = groundY + ballRadius * squishY;
      shadowScale = 1.15 + 0.12 * compression;
      shadowOpacity = 0.8;
    }
    // Airborne Parabolic Trajectory Phase (0.16s -> 2.2s)
    else {
      const p = (cycleTime - 0.16) / 2.04;
      const h = 4 * p * (1 - p); // Parabolic trajectory
      ballY = groundY + ballRadius + (apexY - (groundY + ballRadius)) * h;

      // Realistic aerodynamic in-flight restitution
      squishY = 1.0 + 0.03 * Math.sin(p * Math.PI * 4) * (1 - p);
      squishXZ = 1.0 - 0.015 * Math.sin(p * Math.PI * 4) * (1 - p);

      shadowScale = Math.max(0.35, 1.15 - 0.65 * h);
      shadowOpacity = Math.max(0.15, 0.7 - 0.52 * h);
    }

    // Apply Position and Dynamic Squash/Stretch
    if (ballGroupRef.current) {
      ballGroupRef.current.position.set(0, ballY, 0);
      ballGroupRef.current.scale.set(squishXZ, squishY, squishXZ);
    }

    // Interactive Continuous 3D Rotation (pauses when clicked)
    if (isRotating && ballSpinRef.current) {
      ballSpinRef.current.rotation.x += 0.014;
      ballSpinRef.current.rotation.y += 0.022;
      ballSpinRef.current.rotation.z += 0.006;
    }

    // Dynamic Contact Shadow
    if (shadowRef.current) {
      shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale);
      if (shadowRef.current.material) {
        shadowRef.current.material.opacity = shadowOpacity;
      }
    }
  });

  return (
    <group position={[0, -0.05, 0]} rotation={[0.26, 0, 0]}>
      {/* ================= 1. 3D FOOTBALL FIELD GROUND BASE ================= */}
      <group position={[0, -0.72, 0]}>
        {/* Pitch Border Frame */}
        <mesh position={[0, -0.04, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.08, 2.2]} />
          <meshStandardMaterial color="#064e3b" roughness={0.7} />
        </mesh>

        {/* Manicured Grass Field with Alternating Mower Stripes */}
        {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((sx, i) => (
          <mesh
            key={`stripe-${i}`}
            position={[sx, 0.001, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[0.4, 2.1]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#15803d' : '#166534'}
              roughness={0.9}
            />
          </mesh>
        ))}

        {/* Painted Crisp White Pitch Markings */}
        {/* Outer Perimeter Touchline Box */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.35, 1.37, 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        {/* Center Halfway Line */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 2.0]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        {/* Center Kickoff Circle */}
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48, 0.51, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        {/* Center Kickoff Spot */}
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Dynamic Stadium Grass Contact Shadow */}
        <mesh
          ref={shadowRef}
          position={[0, 0.005, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.72, 32]} />
          <meshBasicMaterial color="#022c22" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* ================= 2. PHOTOREALISTIC INTERACTIVE SOCCER BALL ================= */}
      <group ref={ballGroupRef} position={[0, 0.0, 0]}>
        <group
          ref={ballSpinRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsRotating((prev) => !prev);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setIsHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          {/* High-Resolution Sphere with Procedural Truncated Icosahedron Color & Bump Relief */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.72, 128, 128]} />
            <meshPhysicalMaterial
              map={colorMap}
              bumpMap={bumpMap}
              bumpScale={0.075}
              roughness={0.34}
              metalness={0.02}
              clearcoat={0.38}
              clearcoatRoughness={0.28}
              ior={1.48}
            />
          </mesh>
        </group>

        {/* Interactive Floating Status Tooltip */}
        <Html position={[0, 0.95, 0]} center pointerEvents="none">
          <div
            style={{
              background: isRotating ? 'rgba(15, 23, 42, 0.85)' : 'rgba(217, 119, 6, 0.95)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1.0)'
            }}
          >
            <span>{isRotating ? '🔄 Click Ball to Pause Rotation' : '⏸️ Paused (Click to Resume)'}</span>
          </div>
        </Html>
      </group>
    </group>
  );
}

// =======================================================================
// 13. PHOTOREALISTIC HANGING CONICAL HONEYCOMB & SPILLING HONEY 3D
// =======================================================================
// 13. PHOTOREALISTIC HANGING CONICAL HONEYCOMB & SPILLING HONEY 3D
// =======================================================================

// High-Definition Procedural Organic Tree Bark Texture
function useTreeBarkTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep Earthy Dark Brown Wood Base
    ctx.fillStyle = '#2b1810';
    ctx.fillRect(0, 0, 512, 512);

    // Weathered Bark Ridges & Furrows
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const h = 20 + Math.random() * 90;
      const w = 2 + Math.random() * 5;
      const brightness = Math.floor(25 + Math.random() * 45);
      ctx.fillStyle = `rgb(${brightness + 25}, ${brightness + 10}, ${brightness})`;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0.05 * (Math.random() - 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    // Moss / Lichen Greenish Specks
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = `rgba(${40 + Math.random() * 30}, ${75 + Math.random() * 35}, 35, 0.4)`;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// Procedural Botanical Leaf Texture with Veins
function useLeafTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Rich Forest Green Gradient
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#1b5e20');
    grad.addColorStop(0.5, '#2e7d32');
    grad.addColorStop(1, '#388e3c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Primary Midrib
    ctx.strokeStyle = '#81c784';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(128, 250);
    ctx.lineTo(128, 10);
    ctx.stroke();

    // Lateral Pinnate Veins
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = 'rgba(165, 214, 167, 0.7)';
    for (let y = 35; y < 240; y += 22) {
      // Left side
      ctx.beginPath();
      ctx.moveTo(128, y);
      ctx.quadraticCurveTo(80, y - 10, 25, y - 25);
      ctx.stroke();
      // Right side
      ctx.beginPath();
      ctx.moveTo(128, y);
      ctx.quadraticCurveTo(176, y - 10, 231, y - 25);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// High-Definition Procedural Bee Wing Venation Texture
function useBeeWingTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Transparent Base
    ctx.clearRect(0, 0, 512, 256);

    // Subtle Iridescent Sheen Gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, 'rgba(255, 250, 235, 0.35)');
    grad.addColorStop(0.5, 'rgba(224, 242, 254, 0.28)');
    grad.addColorStop(1, 'rgba(254, 243, 199, 0.3)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(256, 128, 240, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark Amber/Charcoal Vein Styling
    ctx.strokeStyle = 'rgba(67, 40, 24, 0.88)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Primary Costa (Leading Edge Thick Vein)
    ctx.beginPath();
    ctx.moveTo(30, 150);
    ctx.bezierCurveTo(90, 50, 260, 25, 480, 75);
    ctx.stroke();

    // Subcosta & Radial Main Trunks
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 150);
    ctx.bezierCurveTo(120, 95, 280, 80, 460, 120);
    ctx.stroke();

    // Median & Cubital Vein Branches
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(30, 150);
    ctx.bezierCurveTo(140, 150, 270, 170, 420, 180);
    ctx.stroke();

    // Fine Crossveins & Wing Cells (Marginal & Submarginal Cells)
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(78, 48, 30, 0.72)';
    [
      [[130, 70], [150, 110]],
      [[200, 50], [220, 90]],
      [[220, 90], [250, 135]],
      [[280, 45], [300, 95]],
      [[300, 95], [340, 140]],
      [[360, 55], [390, 110]],
      [[390, 110], [420, 160]],
      [[160, 120], [180, 160]],
      [[240, 130], [260, 170]],
      [[320, 140], [350, 175]]
    ].forEach(([p1, p2]) => {
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// Photorealistic Honeybee (Apis Mellifera) with In-Flight Aerodynamic Articulation
function RealisticSingleBee({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.72, isFlying = true }) {
  const wingL1Ref = useRef();
  const wingL2Ref = useRef();
  const wingR1Ref = useRef();
  const wingR2Ref = useRef();
  const beeBodyRef = useRef();
  const wingTexture = useBeeWingTexture();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // High-frequency realistic honeybee wing buzz (~75 Hz flap cycle with natural harmonics)
    const flutter = Math.sin(t * 75) * 0.42 + Math.sin(t * 150) * 0.08;

    if (wingL1Ref.current) wingL1Ref.current.rotation.z = 0.25 + flutter;
    if (wingL2Ref.current) wingL2Ref.current.rotation.z = 0.35 + flutter * 0.85;
    if (wingR1Ref.current) wingR1Ref.current.rotation.z = -0.25 - flutter;
    if (wingR2Ref.current) wingR2Ref.current.rotation.z = -0.35 - flutter * 0.85;

    // Organic hover micro-bobbing and abdominal respiration
    if (beeBodyRef.current) {
      beeBodyRef.current.position.y = Math.sin(t * 8) * 0.006;
      beeBodyRef.current.rotation.x = Math.sin(t * 5) * 0.03;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={beeBodyRef}>
        {/* ================= HEAD & SENSORY ORGANS ================= */}
        <group position={[0, 0.04, 0.26]}>
          {/* Dark Chitin Head Base */}
          <mesh castShadow>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color="#18181b" roughness={0.45} metalness={0.15} />
          </mesh>

          {/* Large Obsidian Blue/Black Compound Eyes with Fine Specular Clearcoat */}
          <mesh position={[0.052, 0.025, 0.03]} rotation={[0.2, 0.45, 0.1]}>
            <sphereGeometry args={[0.046, 20, 20]} />
            <meshPhysicalMaterial
              color="#090d16"
              emissive="#0e1726"
              emissiveIntensity={0.2}
              roughness={0.08}
              metalness={0.5}
              clearcoat={1.0}
              clearcoatRoughness={0.03}
            />
          </mesh>
          <mesh position={[-0.052, 0.025, 0.03]} rotation={[0.2, -0.45, -0.1]}>
            <sphereGeometry args={[0.046, 20, 20]} />
            <meshPhysicalMaterial
              color="#090d16"
              emissive="#0e1726"
              emissiveIntensity={0.2}
              roughness={0.08}
              metalness={0.5}
              clearcoat={1.0}
              clearcoatRoughness={0.03}
            />
          </mesh>

          {/* Articulated Antennae with Sensory Bulb Tips */}
          {[-1, 1].map((side, i) => (
            <group key={`ant-${i}`} position={[side * 0.025, 0.065, 0.06]}>
              <mesh rotation={[-0.35, side * 0.25, side * 0.15]}>
                <cylinderGeometry args={[0.005, 0.005, 0.11, 8]} />
                <meshStandardMaterial color="#09090b" roughness={0.3} />
              </mesh>
              {/* Golden Sensory Tip */}
              <mesh position={[side * 0.025, 0.055, 0.05]}>
                <sphereGeometry args={[0.007, 8, 8]} />
                <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.6} />
              </mesh>
            </group>
          ))}

          {/* Proboscis & Mandibles (Natural feeding apparatus) */}
          <mesh position={[0, -0.05, 0.05]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.028, 0.075, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>

          {/* Fuzzy Head Fur Collar (Golden-Brown Velvet Down) */}
          <mesh position={[0, 0.05, -0.04]}>
            <sphereGeometry args={[0.075, 18, 18]} />
            <meshStandardMaterial color="#b45309" roughness={0.95} />
          </mesh>
        </group>

        {/* ================= PLUSH FUZZY GOLDEN-BROWN THORAX ================= */}
        <group position={[0, 0.06, 0.1]}>
          {/* Main Thorax Core */}
          <mesh castShadow>
            <sphereGeometry args={[0.13, 28, 28]} />
            <meshStandardMaterial
              color="#92400e" /* Natural golden brown */
              roughness={0.95}
              metalness={0.01}
            />
          </mesh>

          {/* Plush Golden Fur Down & Lateral Tufts */}
          <mesh position={[0, 0.05, 0.02]}>
            <sphereGeometry args={[0.126, 20, 20]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.96} />
          </mesh>
          <mesh position={[0, 0.04, -0.05]}>
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshStandardMaterial color="#b45309" roughness={0.94} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.116, 18, 18]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
        </group>

        {/* ================= SEGMENTED STRIPED ABDOMEN (NATURAL AMBER & DARK CHITIN) ================= */}
        <group position={[0, 0.01, -0.16]}>
          {/* 7 Anatomical Abdominal Segments (Curved & Tapering with Rich Alternating Bands) */}
          {[
            { pos: 0.08, col: '#b45309', emissive: '#92400e', r: 0.12, fuzz: '#d97706' },
            { pos: 0.04, col: '#27272a', emissive: '#18181b', r: 0.135, fuzz: '#3f3f46' },
            { pos: -0.01, col: '#b45309', emissive: '#78350f', r: 0.13, fuzz: '#d97706' },
            { pos: -0.06, col: '#27272a', emissive: '#18181b', r: 0.115, fuzz: '#3f3f46' },
            { pos: -0.11, col: '#92400e', emissive: '#78350f', r: 0.09, fuzz: '#b45309' },
            { pos: -0.15, col: '#27272a', emissive: '#18181b', r: 0.065, fuzz: '#27272a' },
            { pos: -0.18, col: '#18181b', emissive: '#09090b', r: 0.035, fuzz: '#18181b' }
          ].map((seg, i) => (
            <group key={`ab-seg-${i}`} position={[0, -i * 0.008, seg.pos]}>
              <mesh castShadow>
                <sphereGeometry args={[seg.r, 22, 22]} />
                <meshPhysicalMaterial
                  color={seg.col}
                  emissive={seg.emissive}
                  emissiveIntensity={0.25}
                  roughness={0.38}
                  metalness={0.15}
                  clearcoat={0.8}
                  clearcoatRoughness={0.12}
                />
              </mesh>
              {/* Fine Fuzzy Segment Ring */}
              <mesh scale={[1.03, 1.03, 0.35]}>
                <torusGeometry args={[seg.r * 0.96, 0.012, 10, 24]} />
                <meshStandardMaterial color={seg.fuzz} roughness={0.92} />
              </mesh>
            </group>
          ))}
        </group>

        {/* ================= TRANSLUCENT GOSSAMER WINGS WITH IRIDESCENT VENATION ================= */}
        {/* Left Forewing & Hindwing */}
        <group position={[0.08, 0.15, 0.06]}>
          <mesh ref={wingL1Ref} position={[0.2, 0.03, -0.1]} rotation={[0.12, 0.38, 0.38]}>
            <planeGeometry args={[0.44, 0.2]} />
            <meshPhysicalMaterial
              map={wingTexture}
              transparent
              opacity={0.94}
              transmission={0.95}
              roughness={0.04}
              ior={1.54}
              side={THREE.DoubleSide}
              clearcoat={1.0}
              clearcoatRoughness={0.03}
            />
          </mesh>
          <mesh ref={wingL2Ref} position={[0.15, 0.01, -0.17]} rotation={[0.1, 0.22, 0.48]}>
            <planeGeometry args={[0.3, 0.13]} />
            <meshPhysicalMaterial
              map={wingTexture}
              transparent
              opacity={0.9}
              transmission={0.95}
              roughness={0.06}
              ior={1.54}
              side={THREE.DoubleSide}
              clearcoat={1.0}
            />
          </mesh>
        </group>

        {/* Right Forewing & Hindwing */}
        <group position={[-0.08, 0.15, 0.06]}>
          <mesh ref={wingR1Ref} position={[-0.2, 0.03, -0.1]} rotation={[0.12, -0.38, -0.38]}>
            <planeGeometry args={[0.44, 0.2]} />
            <meshPhysicalMaterial
              map={wingTexture}
              transparent
              opacity={0.94}
              transmission={0.95}
              roughness={0.04}
              ior={1.54}
              side={THREE.DoubleSide}
              clearcoat={1.0}
              clearcoatRoughness={0.03}
            />
          </mesh>
          <mesh ref={wingR2Ref} position={[-0.15, 0.01, -0.17]} rotation={[0.1, -0.22, -0.48]}>
            <planeGeometry args={[0.3, 0.13]} />
            <meshPhysicalMaterial
              map={wingTexture}
              transparent
              opacity={0.9}
              transmission={0.95}
              roughness={0.06}
              ior={1.54}
              side={THREE.DoubleSide}
              clearcoat={1.0}
            />
          </mesh>
        </group>

        {/* ================= 6 STREAMLINED FLIGHT LEGS (Tucked Aerodynamically) ================= */}
        {[-1, 1].map((side, sIdx) => (
          <group key={`legs-${sIdx}`}>
            {/* Front Leg (Curved trailing back) */}
            <group position={[side * 0.07, -0.05, 0.16]} rotation={[0.1, 0, side * 0.25]}>
              <mesh position={[0, -0.04, -0.03]} rotation={[-0.5, 0, 0]}>
                <cylinderGeometry args={[0.009, 0.007, 0.12, 8]} />
                <meshStandardMaterial color="#18181b" roughness={0.35} />
              </mesh>
              <mesh position={[0, -0.08, -0.08]} rotation={[-0.8, 0, 0]}>
                <cylinderGeometry args={[0.006, 0.004, 0.08, 8]} />
                <meshStandardMaterial color="#09090b" roughness={0.3} />
              </mesh>
            </group>

            {/* Middle Leg */}
            <group position={[side * 0.08, -0.06, 0.05]} rotation={[-0.2, 0, side * 0.3]}>
              <mesh position={[0, -0.05, -0.04]} rotation={[-0.6, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.008, 0.13, 8]} />
                <meshStandardMaterial color="#18181b" roughness={0.35} />
              </mesh>
              <mesh position={[0, -0.1, -0.1]} rotation={[-0.9, 0, 0]}>
                <cylinderGeometry args={[0.007, 0.004, 0.09, 8]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </group>

            {/* Hind Leg with Pollen Basket (Corbicula) Trailing Streamlined */}
            <group position={[side * 0.08, -0.05, -0.06]} rotation={[-0.5, 0, side * 0.2]}>
              <mesh position={[0, -0.05, -0.06]} rotation={[-0.8, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.01, 0.14, 8]} />
                <meshStandardMaterial color="#18181b" roughness={0.35} />
              </mesh>
              {/* Pollen Basket (Flattened Shiny Tibia) */}
              <mesh position={[0, -0.11, -0.15]} rotation={[-0.95, 0, 0]} scale={[0.8, 1.0, 1.6]}>
                <boxGeometry args={[0.014, 0.11, 0.028]} />
                <meshPhysicalMaterial
                  color="#09090b"
                  roughness={0.15}
                  metalness={0.3}
                  clearcoat={0.9}
                />
              </mesh>
              {/* Golden Pollen Pellet tucked in basket */}
              <mesh position={[side * 0.008, -0.11, -0.15]} scale={[0.7, 1.1, 0.9]}>
                <sphereGeometry args={[0.016, 12, 12]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.8} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

export function PhotorealisticHoneycomb3D() {
  const dripDropRef = useRef();
  const honeyStreamRef = useRef();
  const honeyTrickleRef = useRef();
  const flyingBeeRef = useRef();
  const combGroupRef = useRef();

  const barkTexture = useTreeBarkTexture();
  const leafTexture = useLeafTexture();

  // Generate Plump Organic Hanging Honeycomb with Saturated Tiers of Regular Hexagonal Cells
    // Organic Vertical Hanging Flat Comb (Real Bees Build Parallel Vertical Combs)
    const { coneHexCells, honeyDroplets, honeySpillRuns } = useMemo(() => {
      const cells = [];
      let id = 0;
      
      const hexRadius = 0.085;
      const hexHeight = hexRadius * Math.sqrt(3);
      const hexWidth = hexRadius * 2;
      
      // We will generate a rounded, tear-drop shaped flat grid on the XY plane
      // from y = 0.5 (near branch) down to y = -0.5
      for (let row = -10; row <= 8; row++) {
        const yPos = -row * (hexHeight * 0.85); // 0.85 spacing for snug fit
        const cellsInRow = 12 - Math.abs(row + 2); // wider in middle, tapers at ends
        
        for (let col = -cellsInRow; col <= cellsInRow; col++) {
          const xPos = col * (hexWidth * 0.78) + (row % 2 !== 0 ? hexWidth * 0.39 : 0);
          
          // Only keep cells that fall within an organic teardrop/oval envelope
          const distToCenter = Math.sqrt(xPos*xPos + (yPos*0.6)*(yPos*0.6));
          if (distToCenter > 0.65) continue;
          
          // Randomly determine if the cell is capped, empty, or full of honey
          const honeyLevel = Math.random();
          
          // Add cell on FRONT face
          cells.push({
            id: id++,
            x: xPos, y: yPos + 0.1, z: 0.1,
            quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2),
            honeyFill: honeyLevel > 0.6 ? 1.0 : (honeyLevel > 0.3 ? 0.5 : 0),
            isBottomTip: row > 7
          });
          
          // Add cell on BACK face
          cells.push({
            id: id++,
            x: xPos, y: yPos + 0.1, z: -0.1,
            quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2),
            honeyFill: honeyLevel > 0.6 ? 1.0 : (honeyLevel > 0.3 ? 0.5 : 0),
            isBottomTip: row > 7
          });
        }
      }

      // Hanging Viscous Honey Teardrops
      const droplets = [
        { pos: [0, -0.68, 0], scale: [0.06, 0.22, 0.06] },
        { pos: [0.15, -0.55, 0.04], scale: [0.04, 0.12, 0.04] },
        { pos: [-0.12, -0.52, -0.03], scale: [0.05, 0.16, 0.05] }
      ];

      // Cascading Top-to-Bottom Honey Trickles / Runs on the Comb Surface
      const runs = [
        { start: [0.05, 0.4, 0.18], end: [0.02, -0.4, 0.18], width: 0.02 },
        { start: [-0.15, 0.2, 0.15], end: [-0.08, -0.45, 0.15], width: 0.015 },
        { start: [0.2, 0.3, -0.16], end: [0.1, -0.35, -0.15], width: 0.022 }
      ];

      return { coneHexCells: cells, honeyDroplets: droplets, honeySpillRuns: runs };
    }, []);

  // Smooth Realistic 3D Flight Path (Front-Side Only) & Honey Flow Animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // 1. Honeybee Front-Only Flight Path (Graceful Figure-8 Lemniscate in Front Hemisphere)
    if (flyingBeeRef.current) {
      const speed = 1.15;
      
      // Figure-8 pattern across front hemisphere:
      // X oscillates horizontally across [-0.75, +0.75]
      // Y undulates smoothly in height [-0.15, +0.32]
      // Z stays strictly in FRONT of the hive (Z in [0.55, 0.95]), NEVER goes backwards!
      const x = Math.sin(t * speed) * 0.72;
      const y = 0.06 + Math.sin(t * speed * 2) * 0.18 + Math.cos(t * 0.7) * 0.05;
      const z = 0.75 + Math.cos(t * speed) * 0.18;

      flyingBeeRef.current.position.set(x, y, z);

      // Compute forward velocity tangents
      const dx = Math.cos(t * speed) * 0.72 * speed;
      const dy = 2 * Math.cos(t * speed * 2) * 0.18 * speed;
      const dz = -Math.sin(t * speed) * 0.18 * speed;

      // Bee model has head oriented along +Z.
      // Set yaw and banking so the bee always faces its flight direction forward towards the user!
      const yaw = Math.atan2(dx, dz);
      const pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
      const roll = -dx * 0.35; // Gentle banking into turns

      flyingBeeRef.current.rotation.set(pitch, yaw, roll, 'YXZ');
    }

    // 2. Gentle organic breeze sway on the hanging honeycomb
    if (combGroupRef.current) {
      combGroupRef.current.rotation.z = Math.sin(t * 0.8) * 0.02;
      combGroupRef.current.rotation.x = Math.cos(t * 0.6) * 0.015;
    }

    // 3. Falling Honey Teardrop Dropping to Ground
    if (dripDropRef.current) {
      const dropCycle = (t * 1.1) % 1.0;
      const startY = -0.62;
      const endY = -0.88;
      const dropY = startY + (endY - startY) * Math.pow(dropCycle, 2);

      dripDropRef.current.position.y = dropY;
      dripDropRef.current.scale.set(
        0.048 * (1 - dropCycle * 0.3),
        0.15 * (1 + dropCycle * 0.5),
        0.048 * (1 - dropCycle * 0.3)
      );
      if (dripDropRef.current.material) {
        dripDropRef.current.material.opacity = dropCycle > 0.92 ? (1 - dropCycle) * 12 : 0.98;
      }
    }

    // 4. Viscous Honey Surface & Ground Puddle Pulsing
    if (honeyStreamRef.current) {
      const pulse = 1.0 + 0.05 * Math.sin(t * 3.5);
      honeyStreamRef.current.scale.set(pulse, pulse, 1.0);
    }
    if (honeyTrickleRef.current) {
      honeyTrickleRef.current.rotation.y = t * 0.03;
    }
  });

  return (
    <group position={[0, 0.0, 0]}>
      {/* Warm Sunny Lighting for Golden Honey & Tree Branch */}
      <ambientLight intensity={1.6} color="#fef3c7" />
      <directionalLight position={[4, 6, 5]} intensity={2.8} color="#fffbeb" castShadow />
      <directionalLight position={[-4, 3, 3]} intensity={1.5} color="#fef08a" />
      <pointLight position={[0, 1.0, 1.5]} intensity={2.0} color="#fbbf24" distance={5} />

      {/* ================= 1. REALISTIC NATURAL WOODEN TREE BRANCH WITH BARK ================= */}
      <group position={[0, 0.72, 0]}>
        {/* Main Weathered Wooden Tree Branch with Bark Texture */}
        <mesh castShadow receiveShadow position={[-0.1, 0.02, 0]} rotation={[0.08, 0.12, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.1, 3.2, 32]} />
          <meshStandardMaterial
            map={barkTexture}
            color="#78350f"
            roughness={0.88}
            metalness={0.04}
          />
        </mesh>

        {/* Natural Branch Fork Knot Detail */}
        <mesh position={[0.65, 0.12, -0.1]} rotation={[0.4, 0.2, 0.8]}>
          <cylinderGeometry args={[0.04, 0.065, 0.58, 20]} />
          <meshStandardMaterial
            map={barkTexture}
            color="#5c2d10"
            roughness={0.9}
          />
        </mesh>
        <mesh position={[-0.75, 0.08, 0.08]} rotation={[-0.3, -0.2, -0.7]}>
          <cylinderGeometry args={[0.035, 0.055, 0.45, 18]} />
          <meshStandardMaterial
            map={barkTexture}
            color="#5c2d10"
            roughness={0.9}
          />
        </mesh>

        {/* Botanical Curved Green Leaves with Realistic Leaf Texture & Translucency */}
        {[
          { pos: [-0.46, 0.1, 0.12], rot: [0.35, 0.6, -0.45], s: [0.11, 0.26, 0.018] },
          { pos: [-0.35, 0.14, 0.18], rot: [0.5, 0.3, -0.2], s: [0.09, 0.22, 0.016] },
          { pos: [0.42, 0.12, 0.15], rot: [0.28, -0.65, 0.38], s: [0.12, 0.28, 0.018] },
          { pos: [0.55, 0.16, 0.1], rot: [0.15, -0.4, 0.55], s: [0.09, 0.21, 0.015] },
          { pos: [0.08, 0.14, -0.14], rot: [-0.45, 0.35, 0.12], s: [0.1, 0.24, 0.018] },
          { pos: [-0.22, 0.16, -0.12], rot: [-0.35, -0.45, -0.25], s: [0.09, 0.22, 0.016] }
        ].map((leaf, i) => (
          <mesh
            key={`leaf-${i}`}
            position={leaf.pos}
            rotation={leaf.rot}
            scale={leaf.s}
            castShadow
          >
            <sphereGeometry args={[1, 24, 24]} />
            <meshPhysicalMaterial
              map={leafTexture}
              color="#2e7d32"
              roughness={0.32}
              metalness={0.03}
              clearcoat={0.6}
              clearcoatRoughness={0.2}
              transmission={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* ================= 2. HANGING ORGANIC BEESWAX HONEYCOMB ================= */}
      <group ref={combGroupRef} position={[0, 0, 0]}>
        {/* Solid Wax Comb Interior Plate */}
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[1.2, 1.4, 0.16]} />
          <meshPhysicalMaterial
            color="#fcd34d"
            roughness={0.8}
            transmission={0.4}
            ior={1.4}
          />
        </mesh>

        {/* Regular 6-Sided Hexagonal Honeycomb Cells Covering the Cone */}
        {coneHexCells.map((cell) => (
          <group key={`cell-${cell.id}`} position={[cell.x, cell.y, cell.z]} quaternion={cell.quat}>
            {/* Hexagonal Beeswax Cell Wall (Hollow 6-Sided Prism) */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.082, 0.082, 0.06, 6, 1, true]} />
              <meshPhysicalMaterial
                color="#fcd34d"
                roughness={0.85}
                transmission={0.5}
                ior={1.4}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Golden Wax Beveled Rim */}
            <mesh position={[0, 0.03, 0]}>
              <ringGeometry args={[0.075, 0.085, 6]} />
              <meshStandardMaterial
                color="#fef08a"
                roughness={0.7}
              />
            </mesh>

            {/* Glistening Liquid Honey Meniscus (Only rendered if honeyFill > 0) */}
            {cell.honeyFill > 0 && (
              <mesh position={[0, cell.honeyFill === 1.0 ? 0.02 : -0.01, 0]}>
                <cylinderGeometry args={[0.078, 0.078, 0.02, 6]} />
                <meshPhysicalMaterial
                  color="#b45309"
                  emissive="#78350f"
                  emissiveIntensity={0.3}
                  roughness={0.02}
                  transmission={0.95}
                  ior={1.6}
                  clearcoat={1.0}
                  clearcoatRoughness={0.05}
                />
              </mesh>
            )}
          </group>
        ))}

        {/* Cascading Honey Trickles Sheeting from Top to Bottom */}
        <group ref={honeyTrickleRef}>
          {honeySpillRuns.map((run, rIdx) => {
            const midX = (run.start[0] + run.end[0]) / 2;
            const midY = (run.start[1] + run.end[1]) / 2;
            const midZ = (run.start[2] + run.end[2]) / 2;
            return (
              <mesh key={`run-${rIdx}`} position={[midX, midY, midZ]}>
                <cylinderGeometry args={[run.width, run.width * 1.3, 0.95, 14]} />
                <meshPhysicalMaterial
                  color="#fbbf24"
                  emissive="#d97706"
                  emissiveIntensity={0.65}
                  roughness={0.02}
                  transmission={0.94}
                  ior={1.54}
                  clearcoat={1.0}
                  clearcoatRoughness={0.02}
                />
              </mesh>
            );
          })}
        </group>

        {/* Viscous Honey Hanging Droplets at Tip */}
        {honeyDroplets.map((drop, idx) => (
          <group key={`drop-${idx}`} position={drop.pos}>
            <mesh scale={drop.scale}>
              <sphereGeometry args={[1, 20, 20]} />
              <meshPhysicalMaterial
                color="#fbbf24"
                emissive="#d97706"
                emissiveIntensity={0.65}
                roughness={0.02}
                transmission={0.96}
                ior={1.54}
                clearcoat={1.0}
              />
            </mesh>
          </group>
        ))}

        {/* Dynamic Falling Honey Droplet (Top-to-Bottom Dripping) */}
        <mesh ref={dripDropRef} position={[0, -0.58, 0]}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshPhysicalMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.7}
            roughness={0.02}
            transmission={0.96}
            ior={1.54}
            clearcoat={1.0}
            transparent
          />
        </mesh>
      </group>

      {/* ================= 3. SPILLED GOLDEN HONEY PUDDLE ON GROUND ================= */}
      <group position={[0, -0.88, 0]}>
        {/* Organic Asymmetrical Spilled Viscous Liquid Honey Puddle */}
        <mesh ref={honeyStreamRef} receiveShadow position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.45, 64]} />
          <meshPhysicalMaterial
            color="#b45309"
            emissive="#78350f"
            emissiveIntensity={0.2}
            roughness={0.02}
            transmission={0.95}
            ior={1.6}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            // Use displacement logic or custom shaders for real puddles, here we overlap meshes for an organic look
          />
        </mesh>
        
        {/* Organic splatters making the puddle look uneven */}
        <mesh receiveShadow position={[0.2, 0.003, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshPhysicalMaterial color="#b45309" roughness={0.02} transmission={0.95} ior={1.6} clearcoat={1.0} />
        </mesh>
        <mesh receiveShadow position={[-0.15, 0.003, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 32]} />
          <meshPhysicalMaterial color="#b45309" roughness={0.02} transmission={0.95} ior={1.6} clearcoat={1.0} />
        </mesh>
        <mesh receiveShadow position={[-0.25, 0.003, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 32]} />
          <meshPhysicalMaterial color="#b45309" roughness={0.02} transmission={0.95} ior={1.6} clearcoat={1.0} />
        </mesh>

        {/* Concentric Impact Ripples from Dripping Honey */}
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 40]} />
          <meshPhysicalMaterial color="#b45309" roughness={0.02} transmission={0.95} ior={1.6} />
        </mesh>
      </group>

      {/* ================= 4. REALISTIC FLYING HONEYBEE ORBITING THE HONEYCOMB ================= */}
      <group ref={flyingBeeRef}>
        <RealisticSingleBee
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={0.72}
          isFlying={true}
        />
      </group>
    </group>
  );
}

// =======================================================================

// =======================================================================
// 14. PHOTOREALISTIC 24K GOLD ROYAL HEPTAGON MEDALLION 3D (7-GON)
// =======================================================================

// Procedural High-Definition Radiant 24K Gold Heptagon Medallion Textures
function useHeptagonGoldTextures() {
  return useMemo(() => {
    // 1. Obverse Canvas (7-Ray Sun Emblem & Royal Filigree)
    const canvasObverse = document.createElement('canvas');
    canvasObverse.width = 1024;
    canvasObverse.height = 1024;
    const ctx = canvasObverse.getContext('2d');

    const cx = 512;
    const cy = 512;
    const r = 475;

    // Radiant Mirror Gold Radial Gradient (Brilliant Light Gold, Zero Dark Charcoal)
    const grad = ctx.createRadialGradient(cx - 60, cy - 60, 40, cx, cy, 520);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, '#fffbeb');
    grad.addColorStop(0.5, '#fef08a');
    grad.addColorStop(0.8, '#f59e0b');
    grad.addColorStop(1, '#d97706');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Dynamic Golden Sunburst Rays
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 360; i += 3) {
      const rad = (i * Math.PI) / 180;
      ctx.strokeStyle = i % 21 === 0 ? 'rgba(255, 255, 255, 0.65)' : 'rgba(254, 240, 138, 0.25)';
      ctx.lineWidth = i % 21 === 0 ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(rad) * 512, Math.sin(rad) * 512);
      ctx.stroke();
    }
    ctx.restore();

    // 7-Sided Regular Heptagon Raised Golden Rim
    const drawHeptagon = (context, radius) => {
      context.beginPath();
      const numSides = 7;
      for (let i = 0; i < numSides; i++) {
        const a = (i * 2 * Math.PI) / numSides - Math.PI / 2;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
    };

    // Double Polished Gold Raised Border
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 14;
    drawHeptagon(ctx, r * 0.96);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    drawHeptagon(ctx, r * 0.94);
    ctx.stroke();

    // Inner 7-Sided Concentric Filigree
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    drawHeptagon(ctx, r * 0.86);
    ctx.stroke();

    // 49 Golden Beaded Pearls
    for (let p = 0; p < 49; p++) {
      const pAng = (p * 2 * Math.PI) / 49;
      const px = cx + Math.cos(pAng) * (r * 0.90);
      const py = cy + Math.sin(pAng) * (r * 0.90);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top Arched Inscription: HEPTAGON · 7 SIDES
    ctx.fillStyle = '#78350f';
    ctx.font = '900 44px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText("HEPTAGON · 7 SIDES", cx, 190);

    // Bottom Arched Inscription: 128.6° REGULAR ANGLES
    ctx.font = '800 36px "Outfit", "Inter", sans-serif';
    ctx.fillText("128.6° REGULAR ANGLES", cx, 830);

    // Center 7-Ray Radiant Golden Star of Wisdom
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);

      // Star Ray Petal
      ctx.beginPath();
      ctx.moveTo(0, -180);
      ctx.lineTo(35, -50);
      ctx.lineTo(0, 0);
      ctx.lineTo(-35, -50);
      ctx.closePath();

      const rayGrad = ctx.createLinearGradient(-35, 0, 35, -180);
      rayGrad.addColorStop(0, '#f59e0b');
      rayGrad.addColorStop(0.5, '#fffbeb');
      rayGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = rayGrad;
      ctx.fill();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();
    }
    ctx.restore();

    // Central Radiant Ruby/Diamond Jewel Boss
    const bossGrad = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, 65);
    bossGrad.addColorStop(0, '#ffffff');
    bossGrad.addColorStop(0.3, '#fef08a');
    bossGrad.addColorStop(0.7, '#f59e0b');
    bossGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = bossGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center Sacred Geometric 7-Petal Mandala
    for (let p = 0; p < 7; p++) {
      const pAng = (p * 2 * Math.PI) / 7 - Math.PI / 2;
      const px = cx + Math.cos(pAng) * 32;
      const py = cy + Math.sin(pAng) * 32;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 2. Reverse Canvas (7 Auspicious Lotus Crest)
    const canvasReverse = document.createElement('canvas');
    canvasReverse.width = 1024;
    canvasReverse.height = 1024;
    const ctxR = canvasReverse.getContext('2d');

    ctxR.fillStyle = grad;
    ctxR.fillRect(0, 0, 1024, 1024);

    // 7-Sided Rim on Reverse
    ctxR.strokeStyle = '#b45309';
    ctxR.lineWidth = 14;
    drawHeptagon(ctxR, r * 0.96);
    ctxR.stroke();
    ctxR.strokeStyle = '#ffffff';
    ctxR.lineWidth = 8;
    drawHeptagon(ctxR, r * 0.94);
    ctxR.stroke();

    // Reverse Text
    ctxR.fillStyle = '#78350f';
    ctxR.font = '900 48px "Outfit", "Inter", sans-serif';
    ctxR.textAlign = 'center';
    ctxR.textBaseline = 'middle';
    ctxR.fillText("ROYAL HEPTAGON", cx, 200);

    ctxR.font = '900 130px "Outfit", serif';
    ctxR.fillText("7", cx, 512);

    ctxR.font = '800 36px "Outfit", "Inter", sans-serif';
    ctxR.fillText("14 DIAGONALS · 7 SYMMETRIES", cx, 820);

    const obverseTexture = new THREE.CanvasTexture(canvasObverse);
    const reverseTexture = new THREE.CanvasTexture(canvasReverse);
    obverseTexture.needsUpdate = true;
    reverseTexture.needsUpdate = true;

    return { obverseTex: obverseTexture, reverseTex: reverseTexture };
  }, []);
}

// Ultra-Realistic 3D Orb-Weaver Spider Web (Heptagon)
export function PhotorealisticHeptagonSpiderWeb3D() {
  const webRef = useRef();
  const spiderRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // Geometric parameters for the Heptagon Web
  const sides = 7;
  const maxRadius = 1.6;
  const spiralCount = 10;
  
  // Calculate vertices of the outer heptagon
  const outerVertices = useMemo(() => {
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius, 0));
    }
    return pts;
  }, []);

  // Generate Dew Drops randomly along the spiral threads
  const dewDrops = useMemo(() => {
    const drops = [];
    for (let r = 2; r <= spiralCount; r++) {
      const radius = (maxRadius * r) / spiralCount;
      for (let i = 0; i < sides; i++) {
        // Only put dew drops randomly
        if (Math.random() > 0.4) {
          const angle1 = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const angle2 = ((i + 1) * 2 * Math.PI) / sides - Math.PI / 2;
          
          const p1 = new THREE.Vector3(Math.cos(angle1) * radius, Math.sin(angle1) * radius, 0);
          const p2 = new THREE.Vector3(Math.cos(angle2) * radius, Math.sin(angle2) * radius, 0);
          
          // Random point along this thread
          const t = Math.random();
          const dropPos = p1.clone().lerp(p2, t);
          // Add a tiny random sag to the Z axis so it catches light
          dropPos.z += (Math.random() - 0.5) * 0.02;
          
          drops.push({
            pos: dropPos,
            size: 0.005 + Math.random() * 0.008
          });
        }
      }
    }
    return drops;
  }, []);

  // Spider animation (crawling along the web)
  useFrame((state, delta) => {
    if (webRef.current) {
      // Very gentle breeze swaying the entire web
      const t = state.clock.elapsedTime;
      webRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
      webRef.current.rotation.y = Math.cos(t * 0.6) * 0.05 + (isHovered ? 0.2 : 0);
    }
    
    if (spiderRef.current) {
      const t = state.clock.elapsedTime * 0.25; // Crawling speed
      // The spider crawls continuously along the 8th spiral ring
      const ringRadius = 0.8; // 80% of maxRadius
      const currentPos = t % sides;
      const sideIndex = Math.floor(currentPos);
      const lerpFactor = currentPos - sideIndex;
      
      const v1 = outerVertices[sideIndex];
      const v2 = outerVertices[(sideIndex + 1) % sides];
      
      const pos = new THREE.Vector3().lerpVectors(v1, v2, lerpFactor).multiplyScalar(ringRadius);
      
      spiderRef.current.position.copy(pos);
      // Offset slightly in Z to sit perfectly ON the web
      spiderRef.current.position.z = 0.02 + Math.sin(t * 10) * 0.002; // Tiny walking bob
      
      // Direction vector to face
      const dir = new THREE.Vector3().subVectors(v2, v1).normalize();
      // Assuming spider default orientation faces +Y
      const angle = Math.atan2(dir.y, dir.x);
      spiderRef.current.rotation.set(0, 0, angle - Math.PI / 2);
    }
  });

  // Reusable Thread Component (Thin cylinder to catch light realistically)
  const Thread = ({ start, end, thickness = 0.002 }) => {
    const distance = start.distanceTo(end);
    const position = start.clone().lerp(end, 0.5);
    
    // Calculate rotation to point cylinder from start to end
    const axis = new THREE.Vector3(0, 1, 0);
    const dir = end.clone().sub(start).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir);

    return (
      <mesh position={position} quaternion={quaternion}>
        <cylinderGeometry args={[thickness, thickness, distance, 4]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.1} // More glossy to catch light
          transmission={0.8} // Highly transmissive
          ior={1.5}
          clearcoat={1.0}
        />
      </mesh>
    );
  };

  // Ultra-Realistic 3-Segment Spider Leg Component (Hierarchical & High-Contrast)
  const SpiderLeg = ({ angle, scale, flip = 1, phase = 0 }) => {
    const legGroupRef = useRef();
    
    useFrame((state) => {
      if (legGroupRef.current) {
        // Walking cycle synced with spider movement
        const t = state.clock.elapsedTime * 8.0 + phase;
        // Legs lift (Z) and step forward (angle/X)
        legGroupRef.current.rotation.x = Math.cos(t) * 0.15;
        legGroupRef.current.position.z = Math.sin(t) > 0 ? Math.sin(t) * 0.015 : 0;
      }
    });

    const femurL = 0.12 * scale;
    const tibiaL = 0.14 * scale;
    const tarsusL = 0.08 * scale;

    return (
      <group rotation={[0, 0, angle]} scale={[flip, 1, 1]}>
        <group ref={legGroupRef} position={[0.02, 0, 0.01]}>
          
          {/* Coxa (Base joint - Bright Red/Orange) */}
          <mesh>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshPhysicalMaterial color="#ff2200" roughness={0.3} clearcoat={1.0} />
          </mesh>
          
          {/* Femur Group: Angles UP and OUT (+X, +Z) */}
          {/* Cylinder defaults to +Y. Rotate around Z to point right, rotate around X to point up. */}
          <group rotation={[Math.PI / 6, 0, -Math.PI / 2.5]}>
            <mesh position={[0, femurL / 2, 0]}>
              <cylinderGeometry args={[0.006 * scale, 0.009 * scale, femurL, 8]} />
              <meshPhysicalMaterial color="#050505" roughness={0.2} clearcoat={1.0} />
            </mesh>
            
            {/* Tibia Group: At the end of Femur. Bend back DOWN towards the web */}
            <group position={[0, femurL, 0]} rotation={[-Math.PI / 2.5, 0, -Math.PI / 6]}>
              {/* Knee */}
              <mesh>
                <sphereGeometry args={[0.01 * scale, 8, 8]} />
                <meshPhysicalMaterial color="#ff2200" roughness={0.3} clearcoat={1.0} />
              </mesh>
              
              <mesh position={[0, tibiaL / 2, 0]}>
                <cylinderGeometry args={[0.004 * scale, 0.006 * scale, tibiaL, 8]} />
                <meshPhysicalMaterial color="#050505" roughness={0.2} clearcoat={1.0} />
              </mesh>

              {/* Spines sticking out of the Tibia */}
              {[0.2, 0.4, 0.6, 0.8].map((f, i) => (
                <group key={`spine-${i}`} position={[0, tibiaL * f, 0]}>
                  <mesh position={[0.006 * scale, 0, 0]} rotation={[0, 0, -Math.PI/3]}>
                    <cylinderGeometry args={[0.0005 * scale, 0.002 * scale, 0.02 * scale, 4]} />
                    <meshBasicMaterial color="#000000" />
                  </mesh>
                  <mesh position={[-0.006 * scale, 0, 0]} rotation={[0, 0, Math.PI/3]}>
                    <cylinderGeometry args={[0.0005 * scale, 0.002 * scale, 0.02 * scale, 4]} />
                    <meshBasicMaterial color="#000000" />
                  </mesh>
                </group>
              ))}

              {/* Tarsus Group: At end of Tibia */}
              <group position={[0, tibiaL, 0]} rotation={[-Math.PI / 6, 0, -Math.PI / 12]}>
                <mesh position={[0, tarsusL / 2, 0]}>
                  <cylinderGeometry args={[0.0015 * scale, 0.003 * scale, tarsusL, 8]} />
                  <meshPhysicalMaterial color="#ff2200" roughness={0.4} clearcoat={1.0} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    );
  };

  return (
    <group position={[0, -0.05, 0]}>
      {/* Morning Golden Hour Lighting */}
      <ambientLight intensity={1.0} color="#e2e8f0" />
      {/* Strong low-angle sun to catch the web silk and dewdrops */}
      <directionalLight position={[6, 2, 8]} intensity={3.5} color="#fef08a" castShadow shadow-mapSize={[2048, 2048]} />
      {/* Backlight to create translucency on the spider */}
      <spotLight position={[-5, 5, -5]} intensity={2.0} color="#bae6fd" angle={0.5} penumbra={1} />
      
      {/* Strong rim light specifically to make the silk threads and dew glisten */}
      <directionalLight position={[-8, 6, 4]} intensity={5.0} color="#ffffff" />

      {/* ================= NATURAL DARK BACKGROUND TO HIGHLIGHT WEB ================= */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#050a05" depthWrite={false} />
      </mesh>

      {/* ================= BACKGROUND ANCHOR BRANCHES ================= */}
      <group position={[0, 0, -0.6]}>
        {outerVertices.map((v, i) => (
          <mesh key={`branch-${i}`} position={[v.x * 1.5, v.y * 1.5, 0]} rotation={[0, 0, (i * Math.PI)/3]}>
            <cylinderGeometry args={[0.02, 0.03, 4.0, 8]} />
            <meshStandardMaterial color="#1a110a" roughness={0.9} bumpScale={0.05} />
          </mesh>
        ))}
      </group>

      {/* ================= 1. HEPTAGON SPIDER WEB ================= */}
      <group ref={webRef}
        onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); document.body.style.cursor = 'auto'; }}
      >
        {/* Radial Threads (Center to 7 Vertices) */}
        {outerVertices.map((v, i) => (
          <Thread key={`radial-${i}`} start={new THREE.Vector3(0,0,0)} end={v} thickness={0.005} />
        ))}

        {/* Concentric Spiral Threads (Forming the nested Heptagons) */}
        {Array.from({ length: spiralCount }).map((_, rIndex) => {
          const r = (rIndex + 1) / spiralCount;
          // Inner spirals are thinner
          const t = 0.002 + (r * 0.002);
          
          return outerVertices.map((v1, i) => {
            const v2 = outerVertices[(i + 1) % sides];
            const start = v1.clone().multiplyScalar(r);
            const end = v2.clone().multiplyScalar(r);
            
            // Add a tiny bit of natural web sag (catenary curve fake)
            const mid = start.clone().lerp(end, 0.5);
            mid.sub(new THREE.Vector3(0, 0.02 * r, 0)); // Gravity sag
            
            return (
              <group key={`spiral-${rIndex}-${i}`}>
                <Thread start={start} end={mid} thickness={t} />
                <Thread start={mid} end={end} thickness={t} />
              </group>
            );
          });
        })}

        {/* ================= 2. MORNING DEW DROPS ================= */}
        {dewDrops.map((drop, i) => (
          <mesh key={`dew-${i}`} position={drop.pos} castShadow>
            <sphereGeometry args={[drop.size, 8, 8]} />
            <meshPhysicalMaterial 
              color="#ffffff"
              transmission={0.98} // Pure water
              ior={1.33}
              roughness={0}
              clearcoat={1.0}
            />
          </mesh>
        ))}

        {/* ================= 3. ULTRA-REALISTIC ORB-WEAVER SPIDER ================= */}
        <group ref={spiderRef} scale={[2.5, 2.5, 2.5]}>
          {/* Abdomen (Elongated oval body - Glossy Black) */}
          <mesh position={[0, -0.07, 0.02]} scale={[0.7, 1.3, 0.7]} castShadow>
            <sphereGeometry args={[0.06, 24, 24]} />
            <meshPhysicalMaterial 
              color="#050505" 
              roughness={0.2} 
              sheen={1.0} 
              sheenColor="#78350f"
              clearcoat={1.0}
            />
          </mesh>
          
          {/* Detailed Abdomen Patterns (Red/Orange spots and bands) */}
          <mesh position={[0, -0.07, 0.02]} scale={[0.71, 1.32, 0.71]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshPhysicalMaterial 
              color="#ff2200" 
              roughness={0.2} 
              transparent 
              opacity={0.8} 
              clearcoat={1.0}
              alphaMap={new THREE.CanvasTexture((() => {
                const c = document.createElement('canvas');
                c.width = 256; c.height = 256;
                const ctx = c.getContext('2d');
                ctx.fillStyle = 'black';
                ctx.fillRect(0,0,256,256);
                ctx.fillStyle = 'white';
                // Draw dots and bands for the red pattern
                ctx.beginPath();
                ctx.arc(128, 40, 20, 0, Math.PI*2); // top spot
                ctx.arc(80, 80, 15, 0, Math.PI*2); // left spot
                ctx.arc(176, 80, 15, 0, Math.PI*2); // right spot
                ctx.fill();
                // horizontal bands
                for(let i=0; i<4; i++) {
                  ctx.fillRect(64, 130 + i*25, 128, 8);
                }
                return c;
              })())}
            />
          </mesh>

          {/* Spinnerets (Silk extruding organs at the back) */}
          <mesh position={[0, -0.15, 0.02]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <coneGeometry args={[0.015, 0.03, 8]} />
            <meshPhysicalMaterial color="#ff2200" roughness={0.4} />
          </mesh>

          {/* Cephalothorax (Head and torso - Bright White/Silver) */}
          <mesh position={[0, 0.03, 0.015]} castShadow>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.2} metalness={0.2} clearcoat={1.0} />
          </mesh>

          {/* Pedipalps (Sensory "mini-legs" near the mouth - Down and Forward) */}
          <group position={[0, 0.06, 0.01]}>
            {/* Left Pedipalp */}
            <group position={[0.01, 0, 0]} rotation={[-Math.PI / 2.5, 0, -Math.PI / 8]}>
              <mesh position={[0, 0.02, 0]}>
                 <cylinderGeometry args={[0.003, 0.005, 0.04, 8]} />
                 <meshPhysicalMaterial color="#ff2200" roughness={0.3} clearcoat={1.0} />
              </mesh>
              <group position={[0, 0.04, 0]} rotation={[-Math.PI/4, 0, 0]}>
                <mesh position={[0, 0.015, 0]}>
                  <cylinderGeometry args={[0.001, 0.003, 0.03, 8]} />
                  <meshPhysicalMaterial color="#050505" roughness={0.3} />
                </mesh>
              </group>
            </group>
            {/* Right Pedipalp */}
            <group position={[-0.01, 0, 0]} rotation={[-Math.PI / 2.5, 0, Math.PI / 8]}>
              <mesh position={[0, 0.02, 0]}>
                 <cylinderGeometry args={[0.003, 0.005, 0.04, 8]} />
                 <meshPhysicalMaterial color="#ff2200" roughness={0.3} clearcoat={1.0} />
              </mesh>
              <group position={[0, 0.04, 0]} rotation={[-Math.PI/4, 0, 0]}>
                <mesh position={[0, 0.015, 0]}>
                  <cylinderGeometry args={[0.001, 0.003, 0.03, 8]} />
                  <meshPhysicalMaterial color="#050505" roughness={0.3} />
                </mesh>
              </group>
            </group>
          </group>

          {/* 8 Eyes (Tiny highly-reflective black beads on the face) */}
          <group position={[0, 0.055, 0.04]}>
            {/* Main anterior median eyes */}
            <mesh position={[0.008, 0, 0]}><sphereGeometry args={[0.004, 8, 8]} /><meshPhysicalMaterial color="#000" roughness={0} clearcoat={1} /></mesh>
            <mesh position={[-0.008, 0, 0]}><sphereGeometry args={[0.004, 8, 8]} /><meshPhysicalMaterial color="#000" roughness={0} clearcoat={1} /></mesh>
            {/* Secondary eyes (smaller) */}
            <mesh position={[0.015, -0.005, -0.005]}><sphereGeometry args={[0.002, 8, 8]} /><meshPhysicalMaterial color="#000" roughness={0} clearcoat={1} /></mesh>
            <mesh position={[-0.015, -0.005, -0.005]}><sphereGeometry args={[0.002, 8, 8]} /><meshPhysicalMaterial color="#000" roughness={0} clearcoat={1} /></mesh>
          </group>

          {/* 8 Articulated Legs (4 pairs) with realistic staggered walking phases */}
          {/* Leg 1: Front reach */}
          <SpiderLeg angle={Math.PI / 4.5} scale={1.4} flip={1} phase={0} />
          <SpiderLeg angle={Math.PI / 4.5} scale={1.4} flip={-1} phase={Math.PI} />
          
          {/* Leg 2: Side front */}
          <SpiderLeg angle={Math.PI / 12} scale={1.2} flip={1} phase={Math.PI / 2} />
          <SpiderLeg angle={Math.PI / 12} scale={1.2} flip={-1} phase={Math.PI * 1.5} />
          
          {/* Leg 3: Side back (shorter) */}
          <SpiderLeg angle={-Math.PI / 6} scale={0.9} flip={1} phase={Math.PI} />
          <SpiderLeg angle={-Math.PI / 6} scale={0.9} flip={-1} phase={0} />
          
          {/* Leg 4: Rear drag */}
          <SpiderLeg angle={-Math.PI / 3} scale={1.3} flip={1} phase={Math.PI * 1.5} />
          <SpiderLeg angle={-Math.PI / 3} scale={1.3} flip={-1} phase={Math.PI / 2} />
          
          {/* Dragline Silk Thread (Extruding continuously from spinneret) */}
          <Thread start={new THREE.Vector3(0, -0.14, 0.02)} end={new THREE.Vector3(0, -2.0, -0.2)} thickness={0.001} />
        </group>
      </group>

      {/* Realistic Soft Contact Shadow on a distant wall */}
      <ContactShadows
        position={[0, 0, -0.4]}
        rotation={[Math.PI/2, 0, 0]}
        opacity={0.4}
        scale={4.0}
        blur={2.5}
        far={1.5}
        color="#000000"
      />
    </group>
  );
}

// =======================================================================
// 14b. PHOTOREALISTIC 9-SIDED CRYSTAL GLASS PRISM 3D (9-GON)
// =======================================================================
export function PhotorealisticNonagonPrism3D() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const nonagonGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 1.35;
    for (let i = 0; i < 9; i++) {
      const angle = (i * 2 * Math.PI) / 9 - Math.PI / 2;
      if (i === 0) shape.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
      else shape.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    shape.closePath();

    const extrudeSettings = {
      depth: 0.45,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.18
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center(); // Center the geometry around the origin
    return geo;
  }, []);

  return (
    <group position={[0, 0.2, 0]} ref={groupRef}>
      <mesh geometry={nonagonGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#f0f9ff"
          emissive="#ffffff"
          emissiveIntensity={0.02}
          roughness={0.02}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={1}
          ior={1.5}
          thickness={1.5}
          attenuationDistance={2.5}
          attenuationColor="#bae6fd"
          transparent={true}
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Dynamic Floor Shadow */}
      <ContactShadows
        position={[0, -0.85, 0]}
        opacity={0.65}
        scale={3.5}
        blur={1.8}
        far={2.2}
        color="#0369a1"
      />
    </group>
  );
}

// =======================================================================
// 15. PHOTOREALISTIC OCTAGONAL TRAFFIC STOP SIGN 3D (8-GON)
// Procedural High-Definition Retroreflective STOP Sign Texture & Bump Map
function useStopSignTextures() {
  return useMemo(() => {
    // 1. Obverse Canvas (Red Octagon + White Inner Border + STOP Typography)
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const cx = 512;
    const cy = 512;
    const r = 480;

    // Crisp White Outer Margin
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 1024);

    // Octagon Clipping Function
    const drawOctagon = (context, radius) => {
      context.beginPath();
      for (let i = 0; i < 8; i++) {
        // Offset by Math.PI / 8 so top and bottom edges are perfectly horizontal
        const angle = (i * 2 * Math.PI) / 8 + Math.PI / 8;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
    };

    // Deep Signal Red Field with Subtle Retroreflective Sheen
    ctx.save();
    drawOctagon(ctx, r);
    ctx.clip();

    const redGrad = ctx.createRadialGradient(cx, cy - 100, 50, cx, cy, 520);
    redGrad.addColorStop(0, '#ef4444');
    redGrad.addColorStop(0.65, '#dc2626');
    redGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = redGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle Micro-Prismatic Retroreflective Sheeting Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < 1024; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 512, 1024);
      ctx.stroke();
    }
    for (let x = 1024; x > -512; x -= 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 512, 1024);
      ctx.stroke();
    }

    ctx.restore();

    // Bold White Inner Octagonal Border Stripe
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 32;
    ctx.lineJoin = 'miter';
    drawOctagon(ctx, r * 0.91);
    ctx.stroke();

    // Subtle Inner Red Margin Accent
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    drawOctagon(ctx, r * 0.87);
    ctx.stroke();

    // Bold Highway Gothic "STOP" White Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 240px "Inter", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '12px';

    // Lettering Shadow for Crisp Embossed Readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 8;
    ctx.fillText("STOP", cx, cy + 10);

    // Specular Highlight on Lettering
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.fillText("STOP", cx, cy + 10);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// Photorealistic 3D Octagonal STOP Sign (8-Gon)
export function PhotorealisticStopSign3D() {
  const signGroupRef = useRef();
  const [isSpinning, setIsSpinning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isHighBeam, setIsHighBeam] = useState(false);
  const stopSignTex = useStopSignTextures();

  // 8-Sided Regular Octagon Shape with flat top and bottom & Normalized UV Geometry
  const { octagonShape, octagonCorners, stopSignFrontGeo } = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 1.34;
    const corners = [];
    for (let i = 0; i < 8; i++) {
      const a = (i * 2 * Math.PI) / 8 + Math.PI / 8;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      corners.push({ id: i, x, y });
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    // Create normalized ShapeGeometry so texture covers the FULL octagon board
    const geo = new THREE.ShapeGeometry(shape);
    const pos = geo.attributes.position;
    const uvs = [];
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      // Map [-radius, +radius] strictly to [0, 1]
      const u = (px + radius) / (2 * radius);
      const v = (py + radius) / (2 * radius);
      uvs.push(u, v);
    }
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    return { octagonShape: shape, octagonCorners: corners, stopSignFrontGeo: geo };
  }, []);

  // Gentle 3D Rotation with Subtle Wind Sway
  useFrame((state, delta) => {
    if (signGroupRef.current) {
      if (isSpinning) {
        signGroupRef.current.rotation.y += delta * 0.95;
      }
      const t = state.clock.elapsedTime;
      signGroupRef.current.position.y = 0.02 + Math.sin(t * 1.8) * 0.015;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. STREET ASPHALT & CURB GROUND BASE ================= */}
      <group position={[0, -1.15, 0]}>
        {/* Asphalt Road Base */}
        <mesh receiveShadow position={[0, -0.06, 0]}>
          <boxGeometry args={[2.8, 0.12, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.92} metalness={0.05} />
        </mesh>
        {/* Concrete Curbing / Sidewalk Edge */}
        <mesh receiveShadow position={[0, 0.01, -0.65]}>
          <boxGeometry args={[2.8, 0.06, 0.45]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.75} metalness={0.1} />
        </mesh>
        {/* Yellow Curb Safety Line */}
        <mesh position={[0, 0.042, -0.42]}>
          <boxGeometry args={[2.8, 0.005, 0.06]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
        {/* Foundation Base Flange */}
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.04, 24]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      {/* ================= 2. ENTIRE ASSEMBLED STOP SIGN & POST (ROTATES AS A SINGLE PIECE) ================= */}
      <group
        ref={signGroupRef}
        position={[0, 0, 0]}
        onClick={() => {
          setIsHighBeam((prev) => !prev);
          setIsSpinning((prev) => !prev);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Galvanized Tubular Steel Post (Cleanly positioned behind sign, extending from back of sign to base) */}
        <mesh castShadow receiveShadow position={[0, -0.3, -0.035]}>
          <cylinderGeometry args={[0.045, 0.045, 1.7, 24]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.32}
            metalness={0.88}
          />
        </mesh>

        {/* ----------------- SINGLE UNIFIED OCTAGONAL SIGN HEAD ----------------- */}
        <group position={[0, 0.45, 0]}>
          {/* Extruded 8-Sided Solid Aluminum Sign Board (Beveled Sides + Solid Aluminum Back) */}
          <mesh castShadow receiveShadow position={[0, 0, -0.02]}>
            <extrudeGeometry
              args={[
                octagonShape,
                {
                  depth: 0.035,
                  bevelEnabled: true,
                  bevelThickness: 0.008,
                  bevelSize: 0.008,
                  bevelSegments: 2
                }
              ]}
            />
            <meshStandardMaterial
              color="#cbd5e1"
              roughness={0.3}
              metalness={0.82}
            />
          </mesh>

          {/* Front Retroreflective Red STOP Sign Decal Face (Spans the Full Board Perfectly) */}
          <mesh geometry={stopSignFrontGeo} position={[0, 0, 0.024]}>
            <meshPhysicalMaterial
              map={stopSignTex}
              color="#ffffff"
              emissive={isHighBeam ? '#dc2626' : '#991b1b'}
              emissiveIntensity={isHighBeam ? 0.65 : 0.15}
              roughness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.06}
              reflectivity={0.95}
            />
          </mesh>

          {/* 8 Corner Vertices Highlight Markers ($135^\circ$ Regular Angles) */}
          {octagonCorners.map((pt) => (
            <group key={`corner-${pt.id}`} position={[pt.x, pt.y, 0.026]}>
              <mesh>
                <sphereGeometry args={[0.024, 12, 12]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Dynamic Floor Shadow */}
      <ContactShadows
        position={[0, -1.08, 0]}
        opacity={0.75}
        scale={3.0}
        blur={1.6}
        far={2.5}
        color="#000000"
      />
    </group>
  );
}

// =======================================================================
// 15b. PHOTOREALISTIC 10-GONDOLA DECAGON OBSERVATION WHEEL 3D (10-GON)
// =======================================================================

// 10 Distinct Vibrant Festive Cabin Colors
const GONDOLA_COLORS = [
  '#e11d48', // 1. Crimson
  '#2563eb', // 2. Royal Blue
  '#059669', // 3. Emerald
  '#d97706', // 4. Amber Orange
  '#7c3aed', // 5. Amethyst Violet
  '#0891b2', // 6. Cyan
  '#ea580c', // 7. Sunset Orange
  '#4f46e5', // 8. Indigo
  '#16a34a', // 9. Leaf Green
  '#db2777'  // 10. Magenta Pink
];

// Single Articulated Passenger Gondola with Glass Windows & Gravity Pivot
function DecagonPassengerGondola({ color = '#e11d48', index = 0 }) {
  return (
    <group position={[0, -0.06, 0]}>
      {/* Top Pivot Suspension Rod */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.08, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.024, 12, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Main Cabin Body with Rounded Aero Silhouette */}
      <mesh castShadow receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[0.22, 0.18, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Cabin Roof Dome */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.035, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Panoramic Glass Windows (Front, Back & Sides) */}
      <mesh position={[0, -0.07, 0.092]}>
        <planeGeometry args={[0.16, 0.09]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          roughness={0.05}
          transmission={0.85}
          thickness={0.15}
          clearcoat={1.0}
        />
      </mesh>
      <mesh position={[0, -0.07, -0.092]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.16, 0.09]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          roughness={0.05}
          transmission={0.85}
          thickness={0.15}
          clearcoat={1.0}
        />
      </mesh>

      {/* Decorative Gold Accent Trim */}
      <mesh position={[0, -0.165, 0]}>
        <boxGeometry args={[0.23, 0.015, 0.19]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

// Master 3D 10-Gondola Decagon Observation Wheel
export function PhotorealisticDecagonFerrisWheel3D() {
  const wheelGroupRef = useRef();
  const gondolasRef = useRef([]);
  const [isSpinning, setIsSpinning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // 10-Sided Regular Decagon Geometry Calculations
  const { vertices, outerRimChords, innerRimChords, radialSpokes } = useMemo(() => {
    const sides = 10;
    const outerRadius = 0.94;
    const innerRadius = 0.54;
    const verts = [];

    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      verts.push({
        id: i,
        angle,
        x: Math.cos(angle) * outerRadius,
        y: Math.sin(angle) * outerRadius,
        innerX: Math.cos(angle) * innerRadius,
        innerY: Math.sin(angle) * innerRadius,
        color: GONDOLA_COLORS[i]
      });
    }

    const outerChords = [];
    const innerChords = [];
    const spokes = [];

    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      const v1 = verts[i];
      const v2 = verts[next];

      // Outer Decagon Rim Chord
      const p1 = new THREE.Vector3(v1.x, v1.y, 0);
      const p2 = new THREE.Vector3(v2.x, v2.y, 0);
      const mid = p1.clone().lerp(p2, 0.5);
      const len = p1.distanceTo(p2);
      const dir = p2.clone().sub(p1);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      outerChords.push({ id: `out-${i}`, mid, len, quat });

      // Inner Decagon Reinforcement Chord
      const ip1 = new THREE.Vector3(v1.innerX, v1.innerY, 0);
      const ip2 = new THREE.Vector3(v2.innerX, v2.innerY, 0);
      const imid = ip1.clone().lerp(ip2, 0.5);
      const ilen = ip1.distanceTo(ip2);
      const idir = ip2.clone().sub(ip1);
      const iquat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), idir.normalize());
      innerChords.push({ id: `in-${i}`, mid: imid, len: ilen, quat: iquat });

      // Radial Spoke Truss
      const spokeMid = p1.clone().multiplyScalar(0.5);
      const spokeQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().normalize());
      spokes.push({ id: `spoke-${i}`, mid: spokeMid, len: outerRadius, quat: spokeQuat });
    }

    return {
      vertices: verts,
      outerRimChords: outerChords,
      innerRimChords: innerChords,
      radialSpokes: spokes
    };
  }, []);

  // Smooth Continuous Wheel Rotation + Gravity-Stabilized Gondolas
  useFrame((state, delta) => {
    if (wheelGroupRef.current) {
      if (isSpinning) {
        wheelGroupRef.current.rotation.z += delta * (isHovered ? 0.65 : 0.42);
      }
      const curZ = wheelGroupRef.current.rotation.z;

      // Keep each passenger gondola strictly vertical under gravity
      gondolasRef.current.forEach((gondolaGroup) => {
        if (gondolaGroup) {
          gondolaGroup.rotation.z = -curZ;
        }
      });
    }
  });

  const axleY = 0.28;

  return (
    <group position={[0, -0.02, 0]}>
      {/* ================= 1. FESTIVAL BOARDWALK DECK & DUAL A-FRAME TOWERS ================= */}
      <group position={[0, 0, 0]}>
        {/* Fairground Timber Decking Foundation */}
        <mesh receiveShadow position={[0, -1.18, 0]}>
          <cylinderGeometry args={[1.45, 1.55, 0.12, 48]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Polished Teakwood Inset Platform */}
        <mesh position={[0, -1.11, 0]}>
          <cylinderGeometry args={[1.32, 1.38, 0.04, 48]} />
          <meshStandardMaterial color="#92400e" roughness={0.45} />
        </mesh>
        {/* Safety Platform Brass Ring */}
        <mesh position={[0, -1.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.28, 1.34, 48]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Central Safety Passenger Platform Buffer */}
        <mesh position={[0, -1.05, 0]} receiveShadow>
          <boxGeometry args={[0.52, 0.08, 0.42]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        {/* Heavy Navy Blue Architectural Dual A-Frame Legs (Front & Back) */}
        {[-0.18, 0.18].map((zPos, aIdx) => (
          <group key={`a-frame-${aIdx}`} position={[0, 0, zPos]}>
            {/* Left Support Leg (from axle to ground) */}
            <mesh position={[-0.24, -0.4, 0]} rotation={[0, 0, 0.34]} castShadow>
              <cylinderGeometry args={[0.032, 0.042, 1.44, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.85} />
            </mesh>
            {/* Right Support Leg (from axle to ground) */}
            <mesh position={[0.24, -0.4, 0]} rotation={[0, 0, -0.34]} castShadow>
              <cylinderGeometry args={[0.032, 0.042, 1.44, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.85} />
            </mesh>
            {/* Lower Cross Stabilizer Strut */}
            <mesh position={[0, -0.68, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.68, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.85} />
            </mesh>
            {/* Upper Cross Stabilizer Strut */}
            <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.42, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.85} />
            </mesh>
            {/* Top Axle Pillow Bearing Housing */}
            <mesh position={[0, axleY, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.05]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Central Heavy Steel Main Axle Spindle */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, axleY, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.48, 24]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.15} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, axleY, 0.22]}>
          <cylinderGeometry args={[0.08, 0.08, 0.035, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, axleY, -0.22]}>
          <cylinderGeometry args={[0.08, 0.08, 0.035, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= 2. ROTATING DECAGONAL OBSERVATION WHEEL (10 SIDES) ================= */}
      <group
        position={[0, axleY, 0]}
        onClick={() => setIsSpinning((prev) => !prev)}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <group ref={wheelGroupRef}>
          {/* Central Illuminated Golden Hubcap */}
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0, 0.055]}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} roughness={0.15} />
          </mesh>

          {/* 10 Outer Straight Rim Chords (The 10 Edges of the Regular Decagon) */}
          {outerRimChords.map((chord) => (
            <group key={chord.id} position={chord.mid} quaternion={chord.quat}>
              {/* Dual Parallel Steel Rim Chords (Front & Back Planes) */}
              <mesh position={[0, 0, 0.075]} castShadow>
                <cylinderGeometry args={[0.013, 0.013, chord.len, 12]} />
                <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.85} />
              </mesh>
              <mesh position={[0, 0, -0.075]} castShadow>
                <cylinderGeometry args={[0.013, 0.013, chord.len, 12]} />
                <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.85} />
              </mesh>
              {/* Cross Lattice Pin */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.8} />
              </mesh>
            </group>
          ))}

          {/* 10 Inner Concentric Decagonal Reinforcement Chords */}
          {innerRimChords.map((ichord) => (
            <group key={ichord.id} position={ichord.mid} quaternion={ichord.quat}>
              <mesh position={[0, 0, 0.05]}>
                <cylinderGeometry args={[0.01, 0.01, ichord.len, 10]} />
                <meshStandardMaterial color="#0369a1" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, -0.05]}>
                <cylinderGeometry args={[0.01, 0.01, ichord.len, 10]} />
                <meshStandardMaterial color="#0369a1" roughness={0.3} metalness={0.8} />
              </mesh>
            </group>
          ))}

          {/* 10 Tension Radial Spoke Cables connecting Center Hub to the 10 Vertices */}
          {radialSpokes.map((spoke) => (
            <group key={spoke.id} position={spoke.mid} quaternion={spoke.quat}>
              <mesh position={[0, 0, 0.04]}>
                <cylinderGeometry args={[0.009, 0.009, spoke.len, 8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0, -0.04]}>
                <cylinderGeometry args={[0.009, 0.009, spoke.len, 8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ))}

          {/* 10 Vertex Structural Mounts & Glowing Fairground Lights */}
          {vertices.map((v) => (
            <group key={`vert-mount-${v.id}`} position={[v.x, v.y, 0]}>
              {/* Vertex Connecting Spindle Pin */}
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 16]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Vertex Brilliant Fairground Light Jewel ($144^\circ$ Regular Angle Corner) */}
              <mesh position={[0, 0, 0.1]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial
                  color={v.color}
                  emissive={v.color}
                  emissiveIntensity={0.85}
                  roughness={0.1}
                />
              </mesh>
              <mesh position={[0, 0, -0.1]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial
                  color={v.color}
                  emissive={v.color}
                  emissiveIntensity={0.85}
                  roughness={0.1}
                />
              </mesh>

              {/* 10 Gravity-Stabilized Passenger Gondolas (Counter-Rotating) */}
              <group ref={(el) => (gondolasRef.current[v.id] = el)}>
                <DecagonPassengerGondola color={v.color} index={v.id} />
              </group>
            </group>
          ))}
        </group>
      </group>

      {/* Dynamic Floor Shadow */}
      <ContactShadows
        position={[0, -1.17, 0]}
        opacity={0.8}
        scale={3.0}
        blur={1.8}
        far={2.5}
        color="#000000"
      />
    </group>
  );
}

// =======================================================================
// 16. PHOTOREALISTIC VIRAL MESSAGE & EXPONENTIAL HANDSHAKE NETWORK 3D (2^N)
// =======================================================================

// Procedural Realistic Attire Palette for Diverse Network Delegates
const NETWORK_PERSON_OUTFITS = [
  { jacket: '#0f766e', shirt: '#ffffff', pants: '#1e293b', hair: '#1c1917', skin: '#f7c09e', glow: '#14b8a6', name: 'Originator' },
  { jacket: '#d97706', shirt: '#fef3c7', pants: '#334155', hair: '#451a03', skin: '#d97706', glow: '#f59e0b', name: 'Peer A' },
  { jacket: '#2563eb', shirt: '#eff6ff', pants: '#0f172a', hair: '#18181b', skin: '#fcd34d', glow: '#3b82f6', name: 'Peer B' },
  { jacket: '#7c3aed', shirt: '#f5f3ff', pants: '#1e1b4b', hair: '#27272a', skin: '#e29d72', glow: '#8b5cf6', name: 'Peer C' },
  { jacket: '#e11d48', shirt: '#fff1f2', pants: '#3f3f46', hair: '#172554', skin: '#fbb587', glow: '#f43f5e', name: 'Peer D' },
  { jacket: '#059669', shirt: '#ecfdf5', pants: '#111827', hair: '#292524', skin: '#c68642', glow: '#10b981', name: 'Peer E' },
  { jacket: '#b45309', shirt: '#fffbeb', pants: '#1c1917', hair: '#0a0a0a', skin: '#8d5524', glow: '#d97706', name: 'Peer F' },
  { jacket: '#475569', shirt: '#f8fafc', pants: '#020617', hair: '#3f3f46', skin: '#f9c9b6', glow: '#64748b', name: 'Peer G' }
];

// High-Detail Articulated Realistic 3D Human Hand with Anatomical Fingers
function DetailedRealisticHand({ skinColor = '#f7c09e', isRight = true, gesture = 'handshake' }) {
  return (
    <group scale={[isRight ? 1 : -1, 1, 1]}>
      {/* Palm Base */}
      <mesh position={[0.02, 0.04, 0]} castShadow>
        <boxGeometry args={[0.08, 0.09, 0.035]} />
        <meshPhysicalMaterial color={skinColor} roughness={0.42} clearcoat={0.15} />
      </mesh>

      {/* Thumb with Natural Opposable Angle */}
      <group position={[-0.035, 0.02, 0.015]} rotation={[-0.3, 0.4, 0.6]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.014, 0.016, 0.055, 10]} />
          <meshPhysicalMaterial color={skinColor} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.065, 0]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.04, 10]} />
          <meshPhysicalMaterial color={skinColor} roughness={0.42} />
        </mesh>
      </group>

      {/* 4 Articulated Fingers in Handshake Clasp / Forward Reach */}
      {[-0.024, -0.008, 0.008, 0.024].map((xOff, fIdx) => {
        const fLen = fIdx === 1 || fIdx === 2 ? 0.075 : 0.062;
        const curl = gesture === 'handshake' ? 0.45 : 0.2;
        return (
          <group key={`finger-${fIdx}`} position={[xOff, 0.085, 0]}>
            {/* Proximal Phalanx */}
            <mesh position={[0, fLen * 0.3, 0]} rotation={[curl, 0, 0]}>
              <cylinderGeometry args={[0.011, 0.013, fLen * 0.6, 10]} />
              <meshPhysicalMaterial color={skinColor} roughness={0.42} />
            </mesh>
            {/* Intermediate & Distal Phalanx */}
            <mesh position={[0, fLen * 0.7, 0.015]} rotation={[curl * 1.5, 0, 0]}>
              <cylinderGeometry args={[0.009, 0.011, fLen * 0.45, 10]} />
              <meshPhysicalMaterial color={skinColor} roughness={0.42} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Articulated Photorealistic 3D Human Avatar with Dual-Handshake Propagation
function RealisticNetworkPerson({
  tier = 0,
  indexInTier = 0,
  isOriginator = false,
  scale = 0.55
}) {
  const outfit = NETWORK_PERSON_OUTFITS[(tier * 3 + indexInTier) % NETWORK_PERSON_OUTFITS.length];
  const bodyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  // Handshake Motion Synchronization
  useFrame((state) => {
    const t = state.clock.elapsedTime * 3.0 + indexInTier * 0.4;
    
    // Natural subtle breathing and torso stabilization
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 0.8) * 0.008;
      bodyRef.current.rotation.y = Math.sin(t * 0.5) * 0.03;
    }

    // Dynamic handshaking pumping cycle (Natural hand pump)
    const handshakePump = Math.sin(t * 2.0) * 0.06;

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.45 + handshakePump;
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = (isOriginator ? 0.45 : 0.2) + (isOriginator ? handshakePump : -handshakePump);
    }
  });

  return (
    <group scale={scale}>
      <group ref={bodyRef}>
        {/* ================= HEAD & HAIR ================= */}
        <group position={[0, 1.05, 0]}>
          {/* Natural Skin Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshPhysicalMaterial
              color={outfit.skin}
              roughness={0.38}
              clearcoat={0.15}
            />
          </mesh>
          {/* Styled Hair */}
          <mesh position={[0, 0.05, -0.02]} castShadow>
            <sphereGeometry args={[0.136, 20, 20]} />
            <meshStandardMaterial color={outfit.hair} roughness={0.85} />
          </mesh>
          {/* Realistic Expressive Eyes */}
          <mesh position={[0.045, 0.02, 0.12]}>
            <sphereGeometry args={[0.018, 14, 14]} />
            <meshStandardMaterial color="#09090b" roughness={0.1} />
          </mesh>
          <mesh position={[-0.045, 0.02, 0.12]}>
            <sphereGeometry args={[0.018, 14, 14]} />
            <meshStandardMaterial color="#09090b" roughness={0.1} />
          </mesh>
          {/* Smile / Mouth */}
          <mesh position={[0, -0.04, 0.12]} rotation={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.008, 12]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
        </group>

        {/* ================= TORSO & MODERN TAILORED ATTIRE ================= */}
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.12, 16]} />
          <meshStandardMaterial color={outfit.shirt} roughness={0.5} />
        </mesh>

        <group position={[0, 0.62, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.42, 0.22]} />
            <meshStandardMaterial
              color={outfit.jacket}
              roughness={0.65}
              metalness={0.08}
            />
          </mesh>
          {/* Lapel / Shirt V Inlay */}
          <mesh position={[0, 0.04, 0.112]}>
            <boxGeometry args={[0.08, 0.3, 0.01]} />
            <meshStandardMaterial color={outfit.shirt} roughness={0.4} />
          </mesh>
        </group>

        {/* ================= ARTICULATED ARMS EXTENDING FOR HANDSHAKES ================= */}
        {/* Right Arm (Reaching Forward Right for Peer Handshake) */}
        <group position={[0.2, 0.74, 0.05]} rotation={[0.45, -0.35, -0.25]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.22, 12]} />
            <meshStandardMaterial color={outfit.jacket} roughness={0.65} />
          </mesh>
          <group ref={rightArmRef} position={[0, -0.22, 0]} rotation={[0.65, 0.3, 0.1]}>
            <mesh position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.038, 0.032, 0.2, 12]} />
              <meshPhysicalMaterial color={outfit.skin} roughness={0.42} />
            </mesh>
            {/* Detailed Anatomical Right Hand */}
            <group position={[0, -0.22, 0]} rotation={[-0.2, 0, -Math.PI / 2]}>
              <DetailedRealisticHand skinColor={outfit.skin} isRight={true} gesture="handshake" />
            </group>
          </group>
        </group>

        {/* Left Arm (Reaching Forward Left for Second Peer Handshake) */}
        <group position={[-0.2, 0.74, 0.05]} rotation={[isOriginator ? 0.45 : 0.25, isOriginator ? 0.35 : 0.1, 0.25]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.22, 12]} />
            <meshStandardMaterial color={outfit.jacket} roughness={0.65} />
          </mesh>
          <group ref={leftArmRef} position={[0, -0.22, 0]} rotation={[isOriginator ? 0.65 : 0.35, -0.3, 0]}>
            <mesh position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.038, 0.032, 0.2, 12]} />
              <meshPhysicalMaterial color={outfit.skin} roughness={0.42} />
            </mesh>
            {/* Detailed Anatomical Left Hand */}
            <group position={[0, -0.22, 0]} rotation={[-0.2, 0, Math.PI / 2]}>
              <DetailedRealisticHand skinColor={outfit.skin} isRight={false} gesture="handshake" />
            </group>
          </group>
        </group>

        {/* ================= LOWER BODY & TROUSERS ================= */}
        <group position={[0, 0.36, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.14, 0.14, 16]} />
            <meshStandardMaterial color={outfit.pants} roughness={0.7} />
          </mesh>
          {[-0.075, 0.075].map((xOffset, legIdx) => (
            <group key={`leg-${legIdx}`} position={[xOffset, -0.22, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.055, 0.045, 0.36, 12]} />
                <meshStandardMaterial color={outfit.pants} roughness={0.7} />
              </mesh>
              <mesh position={[0, -0.2, 0.04]} castShadow>
                <boxGeometry args={[0.07, 0.05, 0.14]} />
                <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.4} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Dynamic Holographic Footprint Aura */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.25, 32]} />
          <meshBasicMaterial
            color={outfit.glow}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

// =======================================================================
// 9. MASTER 3D VIEWER: PHOTOREALISTIC CHESSBOARD RICE DOUBLING TREASURY (POWERS OF 2)
// The Celebrated Indian Mathematical Legend: 2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16 ... 2¹⁰=1024
// =======================================================================
export function PhotorealisticViralHandshakeNetwork3D({ viralRounds = 1 }) {
  const currentPower = Math.max(0, Math.min(viralRounds, 10));
  const grainCount = Math.pow(2, currentPower);
  const pointerRef = useRef();
  const scaleRef = useRef();

  // Active square coordinates on 8x8 chessboard (0 to 63)
  const activeSquareIdx = currentPower;
  const squareCol = activeSquareIdx % 8;
  const squareRow = Math.floor(activeSquareIdx / 8);

  const squareSize = 0.36;
  const boardOriginX = -((8 - 1) * squareSize) / 2;
  const boardOriginZ = -((8 - 1) * squareSize) / 2;

  const targetX = boardOriginX + squareCol * squareSize;
  const targetZ = boardOriginZ + squareRow * squareSize;

  useFrame((state, delta) => {
    // Smooth glide for brass optical loupe to active square
    if (pointerRef.current) {
      pointerRef.current.position.x = THREE.MathUtils.damp(pointerRef.current.position.x, targetX, 5.0, delta);
      pointerRef.current.position.z = THREE.MathUtils.damp(pointerRef.current.position.z, targetZ, 5.0, delta);
    }
    // Dynamic tilt of brass treasury balance scale
    if (scaleRef.current) {
      const tiltAngle = Math.min(0.35, currentPower * 0.038);
      scaleRef.current.rotation.z = THREE.MathUtils.damp(scaleRef.current.rotation.z, -tiltAngle, 4.0, delta);
    }
  });

  return (
    <group position={[0, -0.15, 0]} rotation={[0.42, -0.12, 0]}>
      {/* Studio Lighting */}
      <ambientLight intensity={1.6} color="#f8fafc" />
      <directionalLight position={[6, 10, 5]} intensity={2.8} color="#fffbeb" castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={1.2} color="#f1f5f9" />
      <pointLight position={[targetX, 1.2, targetZ]} intensity={2.0} color="#fef08a" distance={4} />

      {/* ================= 1. SOLID MAHOGANY ROYAL TABLETOP ================= */}
      <group position={[0, -0.09, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[5.2, 0.16, 4.2]} />
          <meshPhysicalMaterial
            color="#221308"
            roughness={0.38}
            metalness={0.08}
            clearcoat={0.35}
            clearcoatRoughness={0.2}
          />
        </mesh>
        {/* Polished Brass Perimeter Rim */}
        <mesh position={[0, 0.081, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.0, 4.0]} />
          <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.16} />
        </mesh>
        {/* Emerald Green Velvet Chessboard Mat */}
        <mesh position={[-0.65, 0.083, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.3, 3.3]} />
          <meshStandardMaterial color="#064e3b" roughness={0.88} />
        </mesh>
      </group>

      {/* ================= 2. ARTISAN 8x8 CHESSBOARD (ROSEWOOD & MAPLE) ================= */}
      <group position={[-0.65, 0.005, 0]}>
        {/* Solid Wooden Chessboard Border Base */}
        <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.16, 0.04, 3.16]} />
          <meshStandardMaterial color="#3b1d11" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.04, 3.04]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* 64 Inlaid Checkerboard Squares */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const idx = row * 8 + col;
            const isDark = (row + col) % 2 === 1;
            const sx = boardOriginX + col * squareSize;
            const sz = boardOriginZ + row * squareSize;
            const isActive = idx === activeSquareIdx;
            const isPast = idx < activeSquareIdx;

            return (
              <group key={`sq-${row}-${col}`} position={[sx, 0.038, sz]}>
                {/* Square Inlay Tile */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <planeGeometry args={[squareSize * 0.96, squareSize * 0.96]} />
                  <meshStandardMaterial
                    color={isActive ? '#0284c7' : isPast ? '#0d9488' : isDark ? '#451a03' : '#fef3c7'}
                    roughness={0.3}
                    metalness={isActive ? 0.3 : 0.05}
                  />
                </mesh>

                {/* Subtle Gilded Square Number Badge */}
                {idx <= 10 && (
                  <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.08, 0.09, 16]} />
                    <meshBasicMaterial color={isActive ? '#fef08a' : '#fbbf24'} />
                  </mesh>
                )}

                {/* Golden Rice Grains Mounds on Active and Previous Squares */}
                {idx <= activeSquareIdx && (
                  <group position={[0, 0.01, 0]}>
                    {/* Visual Rice Grain / Gold Pip Stack */}
                    <mesh castShadow receiveShadow position={[0, Math.min(0.2, (idx + 1) * 0.018), 0]}>
                      <coneGeometry args={[Math.min(0.14, 0.04 + idx * 0.01), Math.min(0.25, 0.03 + idx * 0.022), 16]} />
                      <meshStandardMaterial
                        color="#fbbf24"
                        metalness={0.92}
                        roughness={0.18}
                        emissive="#d97706"
                        emissiveIntensity={isActive ? 0.4 : 0.1}
                      />
                    </mesh>
                  </group>
                )}
              </group>
            );
          })
        )}

        {/* ================= 3. ACTIVE SQUARE BRASS MAGNIFYING LOUPE ================= */}
        <group ref={pointerRef} position={[targetX, 0.07, targetZ]}>
          {/* Heavy Solid Brass Square Bezel */}
          <mesh castShadow>
            <boxGeometry args={[squareSize * 1.05, 0.035, squareSize * 1.05]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh position={[0, 0.005, 0]}>
            <boxGeometry args={[squareSize * 0.92, 0.04, squareSize * 0.92]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Refracting Glass Lens */}
          <mesh position={[0, 0.015, 0]}>
            <planeGeometry args={[squareSize * 0.9, squareSize * 0.9]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshPhysicalMaterial
              color="#fef08a"
              transparent
              opacity={0.65}
              transmission={0.9}
              ior={1.52}
              roughness={0.02}
            />
          </mesh>
        </group>
      </group>

      {/* ================= 4. ANTIQUE SOLID BRASS TREASURY BALANCE SCALE ================= */}
      <group position={[1.45, 0.0, -0.15]}>
        {/* Ornate Stepped Pedestal Base */}
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.46, 0.12, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.94} roughness={0.18} />
        </mesh>
        {/* Center Vertical Pillar */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.5, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.12} />
        </mesh>
        {/* Top Decorative Finial */}
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
        </mesh>

        {/* Tilting Balance Beam */}
        <group ref={scaleRef} position={[0, 1.5, 0]}>
          {/* Horizontal Beam Bar */}
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.022, 1.3, 12]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.12} />
          </mesh>

          {/* Left Pan (Reference Unit = 1) */}
          <group position={[-0.6, -0.45, 0]}>
            {/* Hanging Chains */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.45, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
            {/* Brass Pan */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.18, 0.04, 20]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.94} roughness={0.15} />
            </mesh>
            {/* 1 Origin Grain */}
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} />
            </mesh>
          </group>

          {/* Right Pan (Exponential Stack 2^N) */}
          <group position={[0.6, -0.45, 0]}>
            {/* Hanging Chains */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.45, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
            {/* Brass Pan */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.18, 0.04, 20]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.94} roughness={0.15} />
            </mesh>
            {/* Accumulated Exponential Gold Weight */}
            <mesh position={[0, Math.min(0.25, 0.03 + currentPower * 0.024), 0]} castShadow>
              <cylinderGeometry args={[Math.min(0.2, 0.06 + currentPower * 0.014), Math.min(0.22, 0.08 + currentPower * 0.014), Math.min(0.4, 0.05 + currentPower * 0.035), 16]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.06} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ================= 5. ROYAL PARCHMENT SCROLL ON DESK ================= */}
      <group position={[1.45, 0.02, 1.2]} rotation={[0, -0.25, 0]}>
        {/* Unrolled Parchment Sheet */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.015, 0.9]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
        {/* Top/Bottom Wooden Roller Rods */}
        {[-0.46, 0.46].map((rz, rIdx) => (
          <mesh key={`rod-${rIdx}`} position={[0, 0.02, rz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 1.36, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}







