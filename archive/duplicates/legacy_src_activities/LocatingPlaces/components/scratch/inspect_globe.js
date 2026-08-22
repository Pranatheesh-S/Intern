import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

console.log('Length:', content.length);

// Search for physical labels or label positioning logic
const matches = [];
const regex = /(STANOVOY|HIMALAYAS|VINDHYA|TÉNÉRE|MITUMBA|Katanga|Seychelles|Arabian|PHYSICAL|Political|label|occlu|visible|camera|vector)/gi;

let match;
const snippets = [];
let idx = 0;
while ((match = regex.exec(content)) !== null && snippets.length < 30) {
  const start = Math.max(0, match.index - 50);
  const end = Math.min(content.length, match.index + 100);
  snippets.push(`[${match.index}] ${content.substring(start, end).replace(/\s+/g, ' ')}`);
}

console.log('Snippets found:');
console.log(snippets.join('\n'));
