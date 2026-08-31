const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Simple pure-Node PNG encoder
function createPNG(width, height, getPixelRGBA) {
  // RGBA buffer with 1 filter byte per scanline
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (rowSize + 1));
  
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRGBA(x, y, width, height);
      rawData[offset++] = Math.max(0, Math.min(255, Math.floor(r)));
      rawData[offset++] = Math.max(0, Math.min(255, Math.floor(g)));
      rawData[offset++] = Math.max(0, Math.min(255, Math.floor(b)));
      rawData[offset++] = Math.max(0, Math.min(255, Math.floor(a !== undefined ? a : 255)));
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const chunk = Buffer.alloc(data.length + 12);
    chunk.writeUInt32BE(data.length, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const crc = crc32(chunk.subarray(4, data.length + 8));
    chunk.writeInt32BE(crc, data.length + 8);
    return chunk;
  }

  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ -1) | 0;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.join(__dirname, '../public/textures');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

console.log('Generating local PBR texture maps...');

// 1. Oak Bark Diffuse (512x512)
const barkBuf = createPNG(512, 512, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;
  // Furrow lines
  const furrow = Math.sin(nx * 38 + Math.sin(ny * 12) * 4) * 0.5 + 0.5;
  const grain = (Math.random() - 0.5) * 30;
  const r = Math.min(255, 36 + furrow * 28 + grain);
  const g = Math.min(255, 24 + furrow * 18 + grain * 0.8);
  const b = Math.min(255, 16 + furrow * 12 + grain * 0.6);
  return [r, g, b, 255];
});
fs.writeFileSync(path.join(outDir, 'bark.png'), barkBuf);

// 2. Oak Bark Normal (512x512)
const barkNormBuf = createPNG(512, 512, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;
  const slope = Math.cos(nx * 38 + Math.sin(ny * 12) * 4);
  const nr = Math.floor(128 + slope * 60);
  return [nr, 128, 245, 255];
});
fs.writeFileSync(path.join(outDir, 'bark-normal.png'), barkNormBuf);

// 3. Foliage Leaf Cluster (512x512 RGBA with vivid emerald & sunlit lime colors)
const foliageBuf = createPNG(512, 512, (x, y, w, h) => {
  const dx = (x - 256) / 150;
  const dy = (y - 256) / 150;
  const d = Math.sqrt(dx * dx + dy * dy);
  
  if (d > 1.1) return [0, 0, 0, 0];

  // Leaf shape lobes
  const angle = Math.atan2(dy, dx);
  const lobes = Math.cos(angle * 5) * 0.2 + Math.sin(angle * 3) * 0.12;
  const maxD = 0.72 + lobes;

  if (d > maxD) return [0, 0, 0, 0];

  // Smooth anti-aliased edge falloff
  const edgeDist = maxD - d;
  const alpha = Math.min(255, Math.floor((edgeDist / 0.06) * 255));

  // Vibrant leaf color gradient (rich emerald #15803d transitioning to sunlit lime #4ade80)
  const isSunlit = Math.sin(angle * 2 + d * 4) > 0.1;
  const rib = Math.abs(Math.sin(d * 14)) > 0.88 ? 40 : 0;
  
  let r, g, b;
  if (isSunlit) {
    // Bright sunlit lime (#4ade80)
    r = Math.min(255, 74 + rib);
    g = Math.min(255, 222 + rib);
    b = Math.min(255, 128 + rib);
  } else {
    // Rich deep emerald (#15803d)
    r = Math.min(255, 21 + rib);
    g = Math.min(255, 140 + rib);
    b = Math.min(255, 61 + rib);
  }

  return [r, g, b, alpha];
});
fs.writeFileSync(path.join(outDir, 'foliage.png'), foliageBuf);

// 4. Bottle Label (512x256)
const labelBuf = createPNG(512, 256, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;

  // Top/bottom silver foil stripes
  if (ny < 0.08 || ny > 0.92) {
    const silver = 200 + Math.sin(nx * 20) * 40;
    return [silver, silver, silver + 15, 255];
  }

  // Cyan gradient substrate
  let r = 2 + Math.floor(Math.sin(nx * Math.PI) * 12);
  let g = 132 + Math.floor(Math.sin(nx * Math.PI) * 30);
  let b = 199;

  // Mountain watermark waveform
  const mtnY = 0.5 + Math.sin(nx * 8) * 0.15 + Math.cos(nx * 14) * 0.08;
  if (ny > mtnY) {
    r += 30;
    g += 40;
    b += 25;
  }

  // White Decal Block (Barcode & Brand Box)
  if (nx > 0.12 && nx < 0.38 && ny > 0.25 && ny < 0.8) {
    if (ny < 0.7) {
      // Barcode stripes
      const bar = (x % 6) < 3 ? 15 : 255;
      return [bar, bar, bar, 255];
    }
    return [245, 245, 245, 255];
  }

  return [r, g, b, 255];
});
fs.writeFileSync(path.join(outDir, 'bottle-label.png'), labelBuf);

// 5. Cap Ribs (256x64)
const capBuf = createPNG(256, 64, (x, y, w, h) => {
  const isTooth = (x % 8) < 4;
  return isTooth ? [56, 189, 248, 255] : [2, 132, 199, 255];
});
fs.writeFileSync(path.join(outDir, 'cap-ribs.png'), capBuf);

// 6. Glass Bubbles (512x512 RGBA)
const bubblesBuf = createPNG(512, 512, (x, y, w, h) => {
  // Sparkle fizz particles
  const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  const isBubble = (hash - Math.floor(hash)) > 0.985;
  if (isBubble) {
    return [255, 255, 255, 230];
  }
  return [0, 0, 0, 0];
});
fs.writeFileSync(path.join(outDir, 'glass-bubbles.png'), bubblesBuf);

// 7. Ice Cube Texture (256x256)
const iceBuf = createPNG(256, 256, (x, y, w, h) => {
  const frac = Math.sin(x * 0.15 + Math.sin(y * 0.2) * 3) * 0.5 + 0.5;
  const val = 220 + Math.floor(frac * 35);
  return [val, val + 15, 255, 255];
});
fs.writeFileSync(path.join(outDir, 'ice-cube.png'), iceBuf);

// 8. Kraft Cardboard (512x512)
const cardboardBuf = createPNG(512, 512, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;
  const rib = Math.sin(ny * 48) * 6;
  const grain = (Math.random() - 0.5) * 25;
  const r = Math.min(255, 182 + rib + grain);
  const g = Math.min(255, 131 + rib * 0.8 + grain * 0.85);
  const b = Math.min(255, 82 + rib * 0.6 + grain * 0.65);
  return [r, g, b, 255];
});
fs.writeFileSync(path.join(outDir, 'cardboard.png'), cardboardBuf);

// 9. Cardboard Normal (512x512)
const cardNormBuf = createPNG(512, 512, (x, y, w, h) => {
  const ny = y / h;
  const slope = Math.cos(ny * 48);
  const ng = Math.floor(128 + slope * 50);
  return [128, ng, 245, 255];
});
fs.writeFileSync(path.join(outDir, 'cardboard-normal.png'), cardNormBuf);

// 10. Shipping Decal (512x512 RGBA)
const decalBuf = createPNG(512, 512, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;

  // White shipping label box
  if (nx > 0.48 && nx < 0.94 && ny > 0.40 && ny < 0.92) {
    if (ny > 0.45 && ny < 0.72) {
      const bar = (x % 5) < 3 ? 20 : 248;
      return [bar, bar, bar, 255];
    }
    return [248, 250, 252, 255];
  }

  // Red FRAGILE Stencil Stamp Box
  if (nx > 0.08 && nx < 0.48 && ny > 0.18 && ny < 0.42) {
    // Border
    if (nx < 0.10 || nx > 0.46 || ny < 0.20 || ny > 0.40) {
      return [220, 38, 38, 255];
    }
    // Cross hatch stencil
    if (Math.abs(Math.sin((nx + ny) * 30)) > 0.5) {
      return [220, 38, 38, 255];
    }
    return [0, 0, 0, 0];
  }

  return [0, 0, 0, 0];
});
fs.writeFileSync(path.join(outDir, 'shipping-decal.png'), decalBuf);

// 11. Packaging Tape (256x512 RGBA)
const tapeBuf = createPNG(256, 512, (x, y, w, h) => {
  return [217, 119, 6, 210];
});
fs.writeFileSync(path.join(outDir, 'tape.png'), tapeBuf);

// 12. Corrugated Fluting Edge (64x256)
const fluteBuf = createPNG(64, 256, (x, y, w, h) => {
  const wave = Math.sin((y / h) * 40 * Math.PI) * 0.5 + 0.5;
  const val = 60 + Math.floor(wave * 70);
  return [val, Math.floor(val * 0.65), Math.floor(val * 0.35), 255];
});
fs.writeFileSync(path.join(outDir, 'fluting.png'), fluteBuf);

console.log('All local PBR textures generated successfully in public/textures/!');
