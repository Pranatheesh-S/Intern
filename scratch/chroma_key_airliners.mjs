import sharp from 'sharp';
import path from 'path';

async function chromaKeyProcess(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Green screen detection
    // Strong green screen: g is dominant over r and b
    const isGreen = (g > 140) && (g > r * 1.35) && (g > b * 1.35);
    const isEdgeGreen = (g > 100) && (g > r * 1.15) && (g > b * 1.15);

    if (isGreen) {
      data[i + 3] = 0; // Completely transparent
    } else if (isEdgeGreen) {
      // Smooth edge antialiasing & remove green spill
      const excess = g - Math.max(r, b);
      const alpha = Math.max(0, Math.min(255, 255 - excess * 3));
      data[i + 3] = alpha;
      // Spill suppression
      data[i + 1] = Math.min(g, Math.max(r, b));
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log(`Successfully generated transparent airliner: ${outputPath}`);
}

async function main() {
  const inputA = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\6fc34d02-23ed-4263-b748-6b147159fbe8\\airliner_ns_green_1787291559962.jpg';
  const inputB = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\6fc34d02-23ed-4263-b748-6b147159fbe8\\airliner_sn_green_1787291582821.jpg';

  const outA = 'c:\\projects\\Futura-Edtech\\public\\MagnetInteraction\\real_airliner_north_south.png';
  const outB = 'c:\\projects\\Futura-Edtech\\public\\MagnetInteraction\\real_airliner_south_north.png';

  await chromaKeyProcess(inputA, outA);
  await chromaKeyProcess(inputB, outB);
}

main().catch(console.error);
