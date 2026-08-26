const fs = require('fs');
const sharp = require('sharp');

async function processBowl() {
  const inputPath = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\23da9e04-fe65-425d-8e3f-84b06df45872\\isolated_water_bowl_1787263414531.jpg';
  const outputPath = 'c:\\projects\\Futura-Edtech\\public\\MagneticCompass\\water_bowl_3d.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const threshold = 245;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Check if pixel is white background (outside the bowl)
    if (r > threshold && g > threshold && b > threshold) {
      data[i + 3] = 0; // Transparent
    } else if (r > 230 && g > 230 && b > 230) {
      // Soft alpha edge feathering
      const diff = Math.min(r, g, b) - 230;
      data[i + 3] = Math.max(0, Math.round(255 - (diff / 15) * 255));
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log('Successfully processed 3D water bowl image to:', outputPath);
}

processBowl().catch(console.error);
