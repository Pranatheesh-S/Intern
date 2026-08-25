import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

const idxGAP = content.indexOf('GAP');
console.log('GAP occurrences:');

let idx = 0;
while ((idx = content.indexOf('GAP', idx)) !== -1) {
  console.log(`Index ${idx}:`, content.substring(idx - 40, idx + 80).replace(/\s+/g, ' '));
  idx += 3;
}
