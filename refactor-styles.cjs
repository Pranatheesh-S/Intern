const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Scale fonts only to preserve layout integrity for SVG containers
      content = content.replace(/fontSize:\s*['"](\d+)px['"]/g, (match, p1) => {
        let size = parseInt(p1);
        if (size <= 12) return "fontSize: 'var(--text-xs)'";
        if (size <= 14) return "fontSize: 'var(--text-sm)'";
        if (size <= 16) return "fontSize: 'var(--text-base)'";
        if (size <= 19) return "fontSize: 'var(--text-lg)'";
        if (size <= 24) return "fontSize: 'var(--text-xl)'";
        if (size <= 32) return "fontSize: 'var(--text-2xl)'";
        if (size <= 40) return "fontSize: 'var(--text-3xl)'";
        if (size <= 48) return "fontSize: 'var(--text-4xl)'";
        if (size <= 60) return "fontSize: 'var(--text-5xl)'";
        return `fontSize: 'clamp(${size*0.7}px, ${size/10}vw, ${size*1.5}px)'`;
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated fonts in ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/activities/MaterialsAroundUs'));
console.log('Done refactoring fonts!');
