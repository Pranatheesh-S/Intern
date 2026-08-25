import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processImage(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Threshold white background removal
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // If near white background
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0; // Transparent
    } else if (r > 220 && g > 220 && b > 220) {
      // Soft edge smoothing
      const diff = Math.min(255 - r, 255 - g, 255 - b);
      data[i + 3] = Math.min(255, Math.floor(diff * 7.5));
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels
    }
  })
  .png()
  .toFile(outputPath);

  console.log(`Saved transparent PNG: ${outputPath}`);
}

async function main() {
  const imgA = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\6fc34d02-23ed-4263-b748-6b147159fbe8\\real_airliner_a_1787291344080.jpg';
  const imgB = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\6fc34d02-23ed-4263-b748-6b147159fbe8\\real_airliner_b_1787291362161.jpg';

  const outA = 'c:\\projects\\Futura-Edtech\\public\\MagnetInteraction\\real_airliner_north_south.png';
  const outB = 'c:\\projects\\Futura-Edtech\\public\\MagnetInteraction\\real_airliner_south_north.png';

  await processImage(imgA, outA);
  await processImage(imgB, outB);
}

main().catch(console.error);
