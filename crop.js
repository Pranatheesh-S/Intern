const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\f23fb391-ed56-4d6f-910d-99e07b9255ea\\.user_uploaded\\media_1787121568020.jpg';
const destDir = path.join(__dirname, 'public', 'ch4_cards');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

fs.copyFileSync(src, path.join(destDir, 'mockup.jpg'));

// Image size: 1024 x 523
// 5 columns across, 2 rows down
const colLefts = [34, 231, 428, 624, 820];
const cardWidth = 175;
const cardHeight = 210;
const row1Top = 58;
const row2Top = 276;

async function run() {
  for (let i = 0; i < 5; i++) {
    const left = colLefts[i];
    
    // Card 1 to 5
    await sharp(src)
      .extract({ left: left, top: row1Top, width: cardWidth, height: cardHeight })
      .toFile(path.join(destDir, `card_${i + 1}.jpg`));
      
    // Card 6 to 10
    await sharp(src)
      .extract({ left: left, top: row2Top, width: cardWidth, height: cardHeight })
      .toFile(path.join(destDir, `card_${i + 6}.jpg`));
  }
  console.log('Successfully extracted all 10 cards!');
}

run().catch(console.error);
