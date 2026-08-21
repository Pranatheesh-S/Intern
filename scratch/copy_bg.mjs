import fs from 'fs';

const src = 'C:\\Users\\akash\\.gemini\\antigravity-ide\\brain\\6fc34d02-23ed-4263-b748-6b147159fbe8\\photorealistic_aerial_clouds_1787292190295.jpg';
const dest = 'c:\\projects\\Futura-Edtech\\public\\MagnetInteraction\\photorealistic_clouds_bg.jpg';

fs.copyFileSync(src, dest);
console.log('Copied photorealistic cloud background to public/MagnetInteraction');
