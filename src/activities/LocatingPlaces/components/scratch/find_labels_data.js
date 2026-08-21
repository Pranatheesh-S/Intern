import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

const idx = content.indexOf('LABELS=');
const idx2 = content.indexOf('const LABELS', Math.max(0, idx - 100));
const pos = idx2 >= 0 ? idx2 : idx;

console.log('LABELS location snippet:');
console.log(content.substring(pos, pos + 3000));
