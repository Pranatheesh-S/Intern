const fs = require('fs');
const path = require('path');

const dir = 'src/science/class6/chapter6/MaterialsAroundUs/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // 1. Replace h3 color
  let newContent = content.replace(/<h3([^>]*?)(color:\s*['"]var\(--lesson-primary\)['"])([^>]*)>/g, '<h3$1color: \'var(--heading-main)\'$3>');
  
  // 2. Replace h4 color
  newContent = newContent.replace(/<h4([^>]*?)(color:\s*['"]var\(--lesson-primary\)['"])([^>]*)>/g, '<h4$1color: \'var(--heading-section)\'$3>');
  
  // 3. Replace p color if it follows h3 (now catching more generic text color variables that were used as subheadings)
  newContent = newContent.replace(/(<\/h3>\s*<p[^>]*?)(color:\s*['"]var\(--(?:lesson-(?:secondary|muted|text)|text-secondary)\)['"])([^>]*>)/g, '$1color: \'var(--heading-sub)\'$3');
  
  // 4. Just in case there are some that don't match the exact spacing but use text-secondary
  // Actually, wait, let's keep it safe to only right after h3
  
  if (newContent !== content) {
    fs.writeFileSync(path.join(dir, file), newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
console.log('Done');
