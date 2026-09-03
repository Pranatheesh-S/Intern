import React, { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * 2D Transparent Billboard Image Mesh Wood Barrier with 4 Evolution Stages:
 * - Stage 1: Paper Sheet (Floating curved white paper sheet) -> /assets/paper_sheet.png
 * - Stage 2: Rustic Timber Log (Vertical weathered tree stump with grain & bark) -> /assets/wood_log.png
 * - Stage 3: Sprouting Potted Plant (Tall fairy castle cactus succulent in pot) -> /assets/plant_cactus.png
 * - Stage 4: Living Oak Tree (Preserved original high-resolution living oak tree billboard) -> /assets/mature_oak_tree.png
 */

// ─── 1. Paper Sheet Texture Cache & Processor (Extracts floating curved white paper from light blue backdrop) ───
const paperTextureCache = new Map();

function usePaperTexture(url) {
  const [texture, setTexture] = useState(() => paperTextureCache.get(url) || null);

  useEffect(() => {
    if (paperTextureCache.has(url)) {
      setTexture(paperTextureCache.get(url));
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      if (!isMounted) return;

      const padRatio = 0.12;
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const targetW = Math.round(origW * (1 + padRatio * 2));
      const targetH = Math.round(origH * (1 + padRatio * 2));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, targetW, targetH);
      const drawX = Math.round(origW * padRatio);
      const drawY = Math.round(origH * padRatio);
      ctx.drawImage(img, drawX, drawY, origW, origH);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Extract curved white paper sheet from blue studio backdrop
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Blue background detection
        const isBlueBg = (b > r + 22 && b > 140) || (b > 180 && (b - r) > 15);
        if (isBlueBg) {
          data[i + 3] = 0; // Pure transparent background
        } else if (b > r + 12 && b > 120) {
          const factor = (r - (b - 25)) / 25;
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

      paperTextureCache.set(url, tex);
      setTexture(tex);
    };

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}

// ─── 2. Wood Log Texture Cache & Processor (Extracts standing timber stump from plain background) ───
const woodLogTextureCache = new Map();

function useWoodLogTexture(url) {
  const [texture, setTexture] = useState(() => woodLogTextureCache.get(url) || null);

  useEffect(() => {
    if (woodLogTextureCache.has(url)) {
      setTexture(woodLogTextureCache.get(url));
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      if (!isMounted) return;

      const padRatio = 0.12;
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const targetW = Math.round(origW * (1 + padRatio * 2));
      const targetH = Math.round(origH * (1 + padRatio * 2));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, targetW, targetH);
      const drawX = Math.round(origW * padRatio);
      const drawY = Math.round(origH * padRatio);
      ctx.drawImage(img, drawX, drawY, origW, origH);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Extract isolated wood stump from white background
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const isNeutral = (maxVal - minVal) < 22;

        if (minVal > 238 && isNeutral) {
          data[i + 3] = 0;
        } else if (minVal > 218 && isNeutral) {
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

      woodLogTextureCache.set(url, tex);
      setTexture(tex);
    };

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}

// ─── 3. Plant Cactus Texture Cache & Processor (Extracts tall green fairy castle cactus in pot from dark background) ───
const cactusTextureCache = new Map();

function useCactusTexture(url) {
  const [texture, setTexture] = useState(() => cactusTextureCache.get(url) || null);

  useEffect(() => {
    if (cactusTextureCache.has(url)) {
      setTexture(cactusTextureCache.get(url));
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      if (!isMounted) return;

      const padRatio = 0.12;
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const targetW = Math.round(origW * (1 + padRatio * 2));
      const targetH = Math.round(origH * (1 + padRatio * 2));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, targetW, targetH);
      const drawX = Math.round(origW * padRatio);
      const drawY = Math.round(origH * padRatio);
      ctx.drawImage(img, drawX, drawY, origW, origH);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Extract isolated green cactus & pot from dark background
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r < 22 && g < 22 && b < 22) {
          data[i + 3] = 0;
        } else if (r < 32 && g < 32 && b < 32) {
          const factor = (Math.max(r, g, b) - 22) / 10;
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

      cactusTextureCache.set(url, tex);
      setTexture(tex);
    };

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}

// ─── Stage 1: Paper Sheet 2D Billboard ───
function PaperModel({ thickness = 1 }) {
  const texture = usePaperTexture('/assets/paper_sheet.png');
  if (!texture) return null;

  const scale = 1 + (thickness - 1) * 0.14;
  const height = 3.6 * scale;
  const width = 3.2 * scale;

  return (
    <group position={[0, -2.7, 0]}>
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

// ─── Stage 2: Rustic Wood Log 2D Billboard ───
function WoodPieceModel({ thickness = 1 }) {
  const texture = useWoodLogTexture('/assets/wood_log.png');
  if (!texture) return null;

  const scale = 1 + (thickness - 1) * 0.14;
  const height = 4.2 * scale;
  const width = 2.4 * scale;

  return (
    <group position={[0, -3.1, 0]}>
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

// ─── Stage 3: Potted Plant (Fairy Castle Cactus) 2D Billboard ───
function PlantModel({ thickness = 1 }) {
  const texture = useCactusTexture('/assets/plant_cactus.png');
  if (!texture) return null;

  const scale = 1 + (thickness - 1) * 0.14;
  const height = 4.3 * scale;
  const width = 2.6 * scale;

  return (
    <group position={[0, -3.2, 0]}>
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

// ─── Stage 4: Living Oak Tree 2D Billboard (Preserved Intact) ───
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

// ─── Master Tree / Wood Barrier Component (Switches among 4 Stages) ───
export default function TreeBarrier({ stage = 1, thickness = 1 }) {
  if (stage === 1) return <PaperModel thickness={thickness} />;
  if (stage === 2) return <WoodPieceModel thickness={thickness} />;
  if (stage === 3) return <PlantModel thickness={thickness} />;
  return <FullTreeModel thickness={thickness} />;
}