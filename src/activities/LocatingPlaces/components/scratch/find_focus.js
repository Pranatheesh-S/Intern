import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

const idx = content.indexOf('if(focus){');
if (idx >= 0) {
  console.log(content.substring(idx - 50, idx + 400));
} else {
  console.log('if(focus) not found');
}
