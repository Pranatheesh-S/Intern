import sharp from 'sharp';

async function cleanAirlinerImage(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Step 1: Remove all green chroma key artifacts completely
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    // Detect any green tint / edge fringe
    const maxRB = Math.max(r, b);
    if (g > maxRB) {
      const greenExcess = g - maxRB;
      // If noticeably green, make fully transparent or clean
      if (g > 80 && g > maxRB * 1.1) {
        data[i + 3] = 0; // Erase green border pixel
      } else {
        // Desaturate green border line to match neutral fuselage/wing
        data[i + 1] = maxRB;
      }
    }
  }

  // Step 2: Alpha erosion / feathering (1.5px edge trim to remove any border halo)
  const copyAlpha = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      copyAlpha[y * width + x] = data[idx + 3];
    }
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const currentA = copyAlpha[y * width + x];
      if (currentA === 0) continue;

      // Check 8-neighbors
      let minNeighborA = 255;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const neighborA = copyAlpha[(y + dy) * width + (x + dx)];
          if (neighborA < minNeighborA) minNeighborA = neighborA;
        }
      }

      const idx = (y * width + x) * channels;
      // If on the outer edge touching transparency
      if (minNeighborA === 0) {
        // Soften / erode outer border
        data[idx + 3] = Math.floor(currentA * 0.4);
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log(`Cleaned border lines on: ${outputPath}`);
}

async function main() {
  const inputA = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\6fc34d02-23ed-4263-b748-6b147159fbe8\\airliner_ns_green_1787291559962.jpg';
  const inputB = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\6fc34d02-23ed-4263-b748-6b147159fbe8\\airliner_sn_green_1787291582821.jpg';

  const outA = 'c:\\projects\\Futura-Edtech\\public\\MagnetInteraction\\real_airliner_north_south.png';
  const outB = 'c:\\projects\\Futura-Edtech\\public\\MagnetInteraction\\real_airliner_south_north.png';

  await cleanAirlinerImage(inputA, outA);
  await cleanAirlinerImage(inputB, outB);
}

main().catch(console.error);
