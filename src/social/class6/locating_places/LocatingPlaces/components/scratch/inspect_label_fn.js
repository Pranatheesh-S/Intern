import fs from 'fs';

const content = fs.readFileSync('d:/Futura-Edtech/public/atlas-globe.html', 'utf8');

const idxProject = content.indexOf('function project(');
const idxRender = content.indexOf('function renderLabels(');
const idxBuild = content.indexOf('function buildLabelSet(');

console.log('project:', idxProject);
console.log(content.substring(idxProject, idxProject + 600));

console.log('\nrenderLabels:', idxRender);
console.log(content.substring(idxRender, idxRender + 1200));

console.log('\nbuildLabelSet:', idxBuild);
console.log(content.substring(idxBuild, idxBuild + 800));
