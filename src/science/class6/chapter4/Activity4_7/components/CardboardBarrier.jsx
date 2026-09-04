import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 2D Transparent Billboard Image Mesh Cardboard Barrier with 4 Evolution Stages:
 * - Stage 1: Single Flat Mailer Box (Individual flat pizza/mailer box) -> /assets/cardboard_small.png
 * - Stage 2: Cardboard Sheet (Scaled down, 3/4 isometric flute perspective) -> /assets/cardboard_sheet.png
 * - Stage 3: Compact Stack of Sheets (Reduced volume compact bundle) -> /assets/cardboard_3layers.png
 * - Stage 4: Large Moving Box (Noticeably larger & taller shipping carton) -> /assets/cardboard_box.png
 */

// ─── Offscreen Canvas Texture Cache & Processor with 15% Transparent Padding Buffer ───
const cardboardTextureCache = new Map();

function useCardboardTexture(url) {
  const [texture, setTexture] = useState(() => cardboardTextureCache.get(url) || null);

  useEffect(() => {
    if (cardboardTextureCache.has(url)) {
      setTexture(cardboardTextureCache.get(url));
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      if (!isMounted) return;

      // Add generous transparent padding around all 4 sides so artwork never touches borders
      const padRatio = 0.15; // 15% transparent horizontal and vertical margin
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const targetW = Math.round(origW * (1 + padRatio * 2));
      const targetH = Math.round(origH * (1 + padRatio * 2));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      // Clear entire canvas to transparent
      ctx.clearRect(0, 0, targetW, targetH);

      // Draw the image centered with generous padding
      const drawX = Math.round(origW * padRatio);
      const drawY = Math.round(origH * padRatio);
      ctx.drawImage(img, drawX, drawY, origW, origH);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Key out plain background pixels and any bottom floor artifacts
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const isNeutral = (maxVal - minVal) < 22;

        if (minVal > 238 && isNeutral) {
          data[i + 3] = 0; // Pure transparent background
        } else if (minVal > 218 && isNeutral) {
          // Antialiased edge alpha falloff
          const factor = (238 - minVal) / 20;
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

      cardboardTextureCache.set(url, tex);
      setTexture(tex);
    };

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}

// ─── Stage 1: Single Flat Mailer Box (Individual flat carton sitting alone) ───
function SingleFlatBoxMesh({ thickness = 1 }) {
  const texture = useCardboardTexture('/assets/cardboard_small.png');
  if (!texture) return null;

  const scale = 1 + (thickness - 1) * 0.14;
  // Expanded width & height to accommodate full padded texture without clipping
  const height = 3.6 * scale;
  const width = 3.6 * scale;

  return (
    <group position={[0, -2.85, 0]}>
      <mesh position={[0, height / 2, 0]} visible={Boolean(texture)}>
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

// ─── Stage 2: Cardboard Sheet (3/4 Isometric Perspective showing Flutes) ───
function CardboardSheetMesh({ thickness = 1 }) {
  const texture = useCardboardTexture('/assets/cardboard_sheet.png');
  if (!texture) return null;

  const scale = 1 + (thickness - 1) * 0.14;
  const height = 3.8 * scale;
  const width = 3.6 * scale;

  return (
    <group position={[0, -3.05, 0]}>
      <mesh position={[0, height / 2, 0]} visible={Boolean(texture)}>
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

// ─── Stage 3: Compact Stack of Corrugated Sheets ───
function CompactStackMesh({ thickness = 1 }) {
  const texture = useCardboardTexture('/assets/cardboard_3layers.png');
  if (!texture) return null;

  const scale = 1 + (thickness - 1) * 0.14;
  const height = 3.9 * scale;
  const width = 3.7 * scale;

  return (
    <group position={[0, -3.15, 0]}>
      <mesh position={[0, height / 2, 0]} visible={Boolean(texture)}>
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

// ─── Stage 4: Large Moving Box (Noticeably Larger & Taller) ───
function LargeMovingBoxMesh({ thickness = 1 }) {
  const texture = useCardboardTexture('/assets/cardboard_box.png');
  if (!texture) return null;

  const scale = 1 + (thickness - 1) * 0.14;
  // Expanded width & height to accommodate full padded texture without clipping
  const height = 4.8 * scale;
  const width = 4.8 * scale;

  return (
    <group position={[0, -3.5, 0]}>
      <mesh position={[0, height / 2, 0]} visible={Boolean(texture)}>
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

// ─── Master Cardboard Barrier Component (Switches among 4 Stages) ───
export default function CardboardBarrier({ stage = 1, thickness = 1 }) {
  if (stage === 1) return <SingleFlatBoxMesh thickness={thickness} />;
  if (stage === 2) return <CardboardSheetMesh thickness={thickness} />;
  if (stage === 3) return <CompactStackMesh thickness={thickness} />;
  return <LargeMovingBoxMesh thickness={thickness} />;
}