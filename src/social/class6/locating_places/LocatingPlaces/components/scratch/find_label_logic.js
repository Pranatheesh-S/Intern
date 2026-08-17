import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

// Find where labels data or updateLabels / label projection functions are defined
const matches = [];
const regex = /(updateLabels|projectPoint|occlus|dot|normal|camera|labels\.map|labelEl|STANOVOY|HIMALAYAS)/gi;

let match;
while ((match = regex.exec(content)) !== null) {
  const start = Math.max(0, match.index - 80);
  const end = Math.min(content.length, match.index + 160);
  matches.push(`[Line offset ${match.index}] ${content.substring(start, end).replace(/\s+/g, ' ')}`);
  if (matches.length > 50) break;
}

console.log(matches.slice(0, 20).join('\n---\n'));
