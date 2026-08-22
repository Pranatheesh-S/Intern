import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

const idx = content.indexOf('UI_PANELS');
if (idx >= 0) {
  console.log(content.substring(idx - 100, idx + 500));
} else {
  console.log('UI_PANELS not found');
}
