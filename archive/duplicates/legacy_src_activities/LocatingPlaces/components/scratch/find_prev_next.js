import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('Prev Text') || content.includes('Next Text')) {
        results.push(full);
      }
    }
  });
  return results;
}

console.log('Matches:', walk('d:/Futura-Edtech/src/social/class6/locating_places'));
