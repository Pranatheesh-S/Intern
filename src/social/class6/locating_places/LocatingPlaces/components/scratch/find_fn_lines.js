import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

function findSnippet(str) {
  const idx = content.indexOf(str);
  console.log(`=== SEARCH: "${str}" -> Index ${idx} ===`);
  if (idx >= 0) {
    console.log(content.substring(idx, idx + 1200));
  }
}

findSnippet('function project(v, camDir)');
findSnippet('function uiReservedBoxes()');
findSnippet('function buildLabelSet()');
