import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

// Find renderLabels and buildLabelSet and project/occlusion math
const searchTerms = ['function renderLabels', 'function buildLabelSet', 'function project'];

for (const term of searchTerms) {
  const idx = content.indexOf(term);
  if (idx >= 0) {
    console.log(`=== FOUND ${term} at index ${idx} ===`);
    console.log(content.substring(idx, idx + 2500));
  } else {
    console.log(`NOT FOUND: ${term}`);
  }
}
