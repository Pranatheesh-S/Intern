import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D Cardboard Barrier Component with 4 Stages:
 * - Stage 1: Small Box (Compact product / gift carton)
 * - Stage 2: Cardboard Sheet (Single-wall corrugated cardboard sheet with fluting edge)
 * - Stage 3: 3 Layers of Cardboard Sheet (Triple-wall heavy-duty corrugated sandwich)
 * - Stage 4: Shipping Cardboard Box (Large corrugated shipping box with tape & stamps)
 */

// ─── Stage 1: Small Cardboard Box ───
function SmallCardboardBox({ thickness = 1 }) {
  const [cardboardMap, cardboardNormal, tapeMap] = useTexture([
    '/textures/cardboard.png',
    '/textures/cardboard-normal.png',
    '/textures/tape.png'
  ]);

  useMemo(() => {
    if (cardboardMap) {
      cardboardMap.wrapS = cardboardMap.wrapT = THREE.RepeatWrapping;
      cardboardMap.repeat.set(1.5, 1.5);
    }
  }, [cardboardMap]);

  const scale = 1.05 + thickness * 0.15;

  return (
    <group position={[0, -0.6, 0]} scale={[scale, scale, scale]}>
      {/* Main Cube Box */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          map={cardboardMap}
          normalMap={cardboardNormal}
          roughness={0.85}
          metalness={0.01}
          color="#c2884d"
        />
      </mesh>

      {/* Top Seam Tape */}
      <mesh position={[0, 1.202, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[0.22, 1.18]} />
        <meshPhysicalMaterial
          map={tapeMap}
          transparent
          opacity={0.88}
          roughness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Front Barcode Label */}
      <mesh position={[0, 0.6, 0.602]}>
        <planeGeometry args={[0.45, 0.32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.6, 0.603]}>
        <planeGeometry args={[0.35, 0.16]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

// ─── Stage 2: Single Cardboard Sheet ───
function CardboardSheet({ thickness = 1 }) {
  const [cardboardMap, cardboardNormal] = useTexture([
    '/textures/cardboard.png',
    '/textures/cardboard-normal.png'
  ]);

  useMemo(() => {
    if (cardboardMap) {
      cardboardMap.wrapS = cardboardMap.wrapT = THREE.RepeatWrapping;
      cardboardMap.repeat.set(2, 2);
    }
  }, [cardboardMap]);

  const scale = 1 + thickness * 0.15;

  return (
    <group position={[0, -1.1, 0]} scale={[scale, 1, scale]}>
      {/* Front Linerboard Face */}
      <mesh position={[0, 1.1, 0.04]} castShadow receiveShadow>
        <planeGeometry args={[1.65, 2.2]} />
        <meshStandardMaterial
          map={cardboardMap}
          normalMap={cardboardNormal}
          roughness={0.88}
          color="#c2884d"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Back Linerboard Face */}
      <mesh position={[0, 1.1, -0.04]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.65, 2.2]} />
        <meshStandardMaterial
          map={cardboardMap}
          normalMap={cardboardNormal}
          roughness={0.88}
          color="#c2884d"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Internal Corrugated Fluting Core Slab */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.64, 2.19, 0.075]} />
        <meshStandardMaterial color="#8c5828" roughness={0.9} />
      </mesh>

      {/* Side Edge Sinusoidal Fluting Wave Teeth */}
      {[-0.82, 0.82].map((xSide, sIdx) => (
        <group key={sIdx} position={[xSide, 1.1, 0]}>
          {Array.from({ length: 22 }).map((_, idx) => (
            <mesh key={idx} position={[0, -1.0 + idx * 0.095, 0]}>
              <boxGeometry args={[0.015, 0.04, 0.065]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Stage 3: 3 Layers of Cardboard Sheet ───
function TripleLayerCardboard({ thickness = 1 }) {
  const [cardboardMap, cardboardNormal] = useTexture([
    '/textures/cardboard.png',
    '/textures/cardboard-normal.png'
  ]);

  useMemo(() => {
    if (cardboardMap) {
      cardboardMap.wrapS = cardboardMap.wrapT = THREE.RepeatWrapping;
      cardboardMap.repeat.set(2, 2);
    }
  }, [cardboardMap]);

  const scale = 1 + thickness * 0.15;
  const layers = [-0.14, 0.0, 0.14];

  return (
    <group position={[0, -1.1, 0]} scale={[scale, 1, scale]}>
      {/* 3 Heavy-Duty Corrugated Board Sandwiches */}
      {layers.map((zPos, layerIdx) => (
        <group key={layerIdx} position={[0, 1.1, zPos]}>
          {/* Main Board Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.65, 2.2, 0.09]} />
            <meshStandardMaterial
              map={cardboardMap}
              normalMap={cardboardNormal}
              roughness={0.88}
              color={layerIdx === 1 ? "#c2884d" : "#a86d38"}
            />
          </mesh>

          {/* Visible Fluting Wave Edges */}
          {[-0.826, 0.826].map((xEdge, eIdx) => (
            <group key={eIdx} position={[xEdge, 0, 0]}>
              {Array.from({ length: 18 }).map((_, idx) => (
                <mesh key={idx} position={[0, -0.9 + idx * 0.105, 0]}>
                  <boxGeometry args={[0.012, 0.045, 0.08]} />
                  <meshStandardMaterial color="#573310" roughness={0.9} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Heavy-Duty Outer Binding Strap */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.67, 0.15, 0.40]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ─── Stage 4: Large Shipping Cardboard Box ───
function ShippingCardboardBox({ thickness = 1 }) {
  const [cardboardMap, cardboardNormal, decalMap, tapeMap] = useTexture([
    '/textures/cardboard.png',
    '/textures/cardboard-normal.png',
    '/textures/shipping-decal.png',
    '/textures/tape.png'
  ]);

  useMemo(() => {
    if (cardboardMap) {
      cardboardMap.wrapS = cardboardMap.wrapT = THREE.RepeatWrapping;
      cardboardMap.repeat.set(1.5, 2.5);
    }
    if (cardboardNormal) {
      cardboardNormal.wrapS = cardboardNormal.wrapT = THREE.RepeatWrapping;
      cardboardNormal.repeat.set(1.5, 2.5);
    }
    if (tapeMap) {
      tapeMap.wrapS = tapeMap.wrapT = THREE.RepeatWrapping;
      tapeMap.repeat.set(1, 4);
    }
  }, [cardboardMap, cardboardNormal, tapeMap]);

  const scaleX = 0.65 + thickness * 0.24;

  return (
    <group position={[0, -1.1, 0]} scale={[scaleX, 1, 1]}>
      {/* Main Corrugated Kraft Box Chassis */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.2, 1.6]} />
        <meshStandardMaterial
          map={cardboardMap}
          normalMap={cardboardNormal}
          normalScale={new THREE.Vector2(1.5, 1.5)}
          roughness={0.88}
          metalness={0.01}
          color="#c2884d"
        />
      </mesh>

      {/* Flap Seam Crease Lines */}
      <mesh position={[0, 1.1, 0.801]}>
        <planeGeometry args={[0.006, 2.18]} />
        <meshBasicMaterial color="#573310" />
      </mesh>
      <mesh position={[0, 2.201, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.006, 1.58]} />
        <meshBasicMaterial color="#573310" />
      </mesh>

      {/* Flush Shipping Label & FRAGILE Stencils */}
      <mesh position={[0, 1.1, 0.802]}>
        <planeGeometry args={[1.15, 2.15]} />
        <meshStandardMaterial
          map={decalMap}
          transparent
          roughness={0.6}
          depthWrite={false}
        />
      </mesh>

      {/* Packaging Tape */}
      <mesh position={[0, 1.1, 0.803]} castShadow>
        <planeGeometry args={[0.26, 2.18]} />
        <meshPhysicalMaterial
          map={tapeMap}
          transparent
          opacity={0.88}
          roughness={0.15}
          ior={1.5}
          specularIntensity={1.0}
          clearcoat={1.0}
        />
      </mesh>
      <mesh position={[0, 2.202, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[0.26, 1.58]} />
        <meshPhysicalMaterial
          map={tapeMap}
          transparent
          opacity={0.88}
          roughness={0.15}
          ior={1.5}
          specularIntensity={1.0}
          clearcoat={1.0}
        />
      </mesh>
      <mesh position={[0, 1.1, -0.803]} rotation={[0, Math.PI, 0]} castShadow>
        <planeGeometry args={[0.26, 2.18]} />
        <meshPhysicalMaterial
          map={tapeMap}
          transparent
          opacity={0.88}
          roughness={0.15}
          ior={1.5}
          specularIntensity={1.0}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
}

// ─── Master Cardboard Barrier Component (Switches among 4 Stages) ───
export default function CardboardBarrier({ stage = 4, thickness = 1 }) {
  if (stage === 1) return <SmallCardboardBox thickness={thickness} />;
  if (stage === 2) return <CardboardSheet thickness={thickness} />;
  if (stage === 3) return <TripleLayerCardboard thickness={thickness} />;
  return <ShippingCardboardBox thickness={thickness} />;
}