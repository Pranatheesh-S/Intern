import * as THREE from 'three';

/**
 * Procedural PBR Texture Generators for Activity 4.7 Barriers
 * High-resolution, zero-network-dependency CanvasTextures.
 */

// 1. High-Detail Oak Bark Texture (Albedo + Bump)
export const createOakBarkTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base deep wood tone
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 0);
  bgGrad.addColorStop(0.0, '#1c0a02');
  bgGrad.addColorStop(0.2, '#3e1a06');
  bgGrad.addColorStop(0.5, '#5c2a0c');
  bgGrad.addColorStop(0.8, '#431c07');
  bgGrad.addColorStop(1.0, '#1c0a02');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Vertical bark furrow ridges and fissures
  for (let i = 0; i < 280; i++) {
    const x = Math.random() * 1024;
    const width = 2 + Math.random() * 8;
    const len = 80 + Math.random() * 350;
    const y = Math.random() * (1024 - len);
    const dark = Math.random() > 0.4;

    const col = dark 
      ? `rgba(18, 7, 2, ${0.4 + Math.random() * 0.5})` 
      : `rgba(146, 75, 28, ${0.25 + Math.random() * 0.35})`;
    ctx.strokeStyle = col;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + (Math.random() - 0.5) * 20, y + len * 0.33,
      x + (Math.random() - 0.5) * 20, y + len * 0.66,
      x, y + len
    );
    ctx.lineWidth = width;
    ctx.stroke();
  }

  // Micro bark grain striations
  for (let y = 0; y < 1024; y += 4) {
    ctx.fillStyle = `rgba(255, 200, 140, ${Math.random() * 0.08})`;
    ctx.fillRect(0, y, 1024, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
};

// 2. PET Water Bottle Label Texture
export const createBottleLabelTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Translucent glacier blue gradient label
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0.0, 'rgba(14, 116, 144, 0.85)');
  grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.92)');
  grad.addColorStop(0.5, 'rgba(240, 253, 250, 0.96)');
  grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.92)');
  grad.addColorStop(1.0, 'rgba(14, 116, 144, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Mountain crest illustration on label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.moveTo(380, 320);
  ctx.lineTo(470, 160);
  ctx.lineTo(512, 220);
  ctx.lineTo(554, 140);
  ctx.lineTo(644, 320);
  ctx.closePath();
  ctx.fill();

  // Ice cyan shadow contour
  ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.beginPath();
  ctx.moveTo(470, 160);
  ctx.lineTo(512, 220);
  ctx.lineTo(512, 320);
  ctx.lineTo(430, 320);
  ctx.closePath();
  ctx.fill();

  // Brand Name Typography
  ctx.fillStyle = '#083344';
  ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('GLACIER PURE', 512, 380);

  ctx.fillStyle = '#0e7490';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('NATURAL SPRING WATER • 500 mL', 512, 425);

  // Nutrition & Eco Icon strip
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText('100% RECYCLABLE PET PLASTIC • BPA FREE', 512, 470);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

// 3. Corrugated Kraft Cardboard Texture (Albedo + Surface Fluting)
export const createCardboardTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base Kraft Paper Color
  const kraftGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  kraftGrad.addColorStop(0.0, '#b47b48');
  kraftGrad.addColorStop(0.5, '#c58b56');
  kraftGrad.addColorStop(1.0, '#9e6737');
  ctx.fillStyle = kraftGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Paper fiber flecks and organic pulp noise
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const len = 1 + Math.random() * 4;
    const isDark = Math.random() > 0.5;
    ctx.fillStyle = isDark ? 'rgba(74, 38, 14, 0.25)' : 'rgba(254, 243, 199, 0.22)';
    ctx.fillRect(x, y, len, Math.random() > 0.5 ? 1 : 2);
  }

  // Corrugation pressure ridges (vertical liner ribs)
  for (let x = 0; x < 1024; x += 18) {
    // shadow rib
    ctx.fillStyle = 'rgba(67, 32, 11, 0.12)';
    ctx.fillRect(x, 0, 5, 1024);
    // highlight rib
    ctx.fillStyle = 'rgba(255, 237, 213, 0.14)';
    ctx.fillRect(x + 5, 0, 4, 1024);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// 4. Cardboard Shipping Tape Texture (Semi-gloss Polypropylene Tape)
export const createPackagingTapeTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Amber translucent tape gradient
  const tapeGrad = ctx.createLinearGradient(0, 0, 512, 0);
  tapeGrad.addColorStop(0.0, 'rgba(180, 110, 30, 0.82)');
  tapeGrad.addColorStop(0.2, 'rgba(235, 165, 60, 0.9)');
  tapeGrad.addColorStop(0.5, 'rgba(250, 195, 95, 0.94)');
  tapeGrad.addColorStop(0.8, 'rgba(235, 165, 60, 0.9)');
  tapeGrad.addColorStop(1.0, 'rgba(180, 110, 30, 0.82)');
  ctx.fillStyle = tapeGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Internal reinforced fiberglass filament lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.2;
  for (let x = 10; x < 512; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};
