import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

const idx = content.indexOf('function uiReservedBoxes');
if (idx >= 0) {
  console.log(content.substring(idx, idx + 1000));
} else {
  console.log('uiReservedBoxes not found');
}
