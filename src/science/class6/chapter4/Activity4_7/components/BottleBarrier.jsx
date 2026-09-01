import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * 2D Billboard Image Mesh PET Plastic Bottle Barrier with 4 Evolution Stages:
 * - Stage 1: 200ml Compact Pocket Water Bottle (/assets/bottle_200ml.png)
 * - Stage 2: 500ml Standard Spring Water Bottle (/assets/bottle_500ml.png)
 * - Stage 3: 1 Litre Sports Ribbed Water Bottle (/assets/bottle_1l.png)
 * - Stage 4: 20 Litre Commercial Dispenser Jug / Can (/assets/bottle_20l.png)
 */

// ─── Helper hook to load & configure transparent bottle textures cleanly ───
function useBottleTexture(url) {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [url]);
}

// ─── Stage 1: 200 mL Compact Pocket Water Bottle Billboard ───
function Bottle200ml({ thickness = 1 }) {
  const texture = useBottleTexture('/assets/bottle_200ml.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 2.2 * scale;
  const width = 1.35 * scale;

  return (
    <group position={[0, -0.65, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
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

// ─── Stage 2: 500 mL Standard Spring Water Bottle Billboard ───
function Bottle500ml({ thickness = 1 }) {
  const texture = useBottleTexture('/assets/bottle_500ml.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 2.7 * scale;
  const width = 1.4 * scale;

  return (
    <group position={[0, -0.85, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
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

// ─── Stage 3: 1 Litre Ribbed Water Bottle Billboard ───
function Bottle1Litre({ thickness = 1 }) {
  const texture = useBottleTexture('/assets/bottle_1l.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 3.1 * scale;
  const width = 1.45 * scale;

  return (
    <group position={[0, -1.05, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
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

// ─── Stage 4: 20 Litre Commercial Dispenser Jug / Can Billboard ───
function WaterCan20Litre({ thickness = 1 }) {
  const texture = useBottleTexture('/assets/bottle_20l.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 3.3 * scale;
  const width = 2.25 * scale;

  return (
    <group position={[0, -1.15, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
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

// ─── Master Bottle Barrier Component (Switches among 4 Stages) ───
export default function BottleBarrier({ stage = 2, thickness = 1 }) {
  if (stage === 1) return <Bottle200ml thickness={thickness} />;
  if (stage === 2) return <Bottle500ml thickness={thickness} />;
  if (stage === 3) return <Bottle1Litre thickness={thickness} />;
  return <WaterCan20Litre thickness={thickness} />;
}
