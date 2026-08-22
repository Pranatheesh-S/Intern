import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

// Find script tag or main code near the end of atlas-globe.html
const lastScriptTag = content.lastIndexOf('<script');
console.log('Last script tag at index:', lastScriptTag);

// Show the last 20,000 characters of atlas-globe.html
console.log('End of HTML file:');
console.log(content.substring(content.length - 8000));
