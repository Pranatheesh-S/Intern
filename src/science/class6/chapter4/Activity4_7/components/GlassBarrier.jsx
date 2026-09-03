import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 2D Transparent Billboard Image Mesh Glass Barrier with 4 Stages:
 * - Stage 1: Small Glass (Faceted Crystal Tumbler) -> /assets/glass_small.png
 * - Stage 2: Big Glass (Tall Cut-Glass Highball Tumbler) -> /assets/glass_tall.png
 * - Stage 3: Glass Bowl (Clear Pyrex Crystal Bowl) -> /assets/glass_bowl.png
 * - Stage 4: Glass Jar (Storage Canister with Wire Clip Lock) -> /assets/glass_jar.png
 */

// ─── Offscreen Canvas Texture Processor for pristine studio-grade alpha transparency ───
function useGlassTexture(url) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      if (!isMounted) return;
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Extract isolated glass object and make plain background transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const isNeutral = (maxVal - minVal) < 18;

        if (minVal > 246 && isNeutral) {
          data[i + 3] = 0; // Transparent background
        } else if (minVal > 230 && isNeutral) {
          // Antialiased edge alpha falloff
          const factor = (246 - minVal) / 16;
          data[i + 3] = Math.floor(data[i + 3] * Math.max(0, Math.min(1, factor)));
        }
      }

      ctx.putImageData(imgData, 0, 0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;

      setTexture(tex);
    };

    return () => {
      isMounted = false;
      if (texture) texture.dispose();
    };
  }, [url]);

  return texture;
}

// ─── Stage 1: Small Glass (Compact Thick-Base Faceted Tumbler) ───
function SmallGlassMesh({ thickness = 1 }) {
  const texture = useGlassTexture('/assets/glass_small.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 3.0 * scale;
  const width = 3.0 * scale;

  return (
    <group position={[0, -2.7, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          color="#ffffff"
          transparent={true}
          alphaTest={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Stage 2: Big Glass (Tall Crystal Cut-Glass Tumbler) ───
function BigGlassMesh({ thickness = 1 }) {
  const texture = useGlassTexture('/assets/glass_tall.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 4.2 * scale;
  const width = 2.36 * scale;

  return (
    <group position={[0, -3.2, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          color="#ffffff"
          transparent={true}
          alphaTest={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Stage 3: Glass Bowl (Clear Pyrex Crystal Glass Bowl) ───
function GlassBowlMesh({ thickness = 1 }) {
  const texture = useGlassTexture('/assets/glass_bowl.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 2.8 * scale;
  const width = 3.3 * scale;

  return (
    <group position={[0, -2.6, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          color="#ffffff"
          transparent={true}
          alphaTest={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Stage 4: Glass Jar (Storage Canister with Wire Clamp Lid) ───
function GlassJarMesh({ thickness = 1 }) {
  const texture = useGlassTexture('/assets/glass_jar.png');
  const scale = 1 + (thickness - 1) * 0.14;
  const height = 3.8 * scale;
  const width = 3.8 * scale;

  return (
    <group position={[0, -3.1, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          color="#ffffff"
          transparent={true}
          alphaTest={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Master Glass Barrier Component (Switches among 4 Stages) ───
export default function GlassBarrier({ stage = 1, thickness = 1 }) {
  if (stage === 1) return <SmallGlassMesh thickness={thickness} />;
  if (stage === 2) return <BigGlassMesh thickness={thickness} />;
  if (stage === 3) return <GlassBowlMesh thickness={thickness} />;
  return <GlassJarMesh thickness={thickness} />;
}
